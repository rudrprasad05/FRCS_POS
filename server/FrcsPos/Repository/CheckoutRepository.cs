using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Security.Claims;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using FrcsPos.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace FrcsPos.Repository
{
    public class CheckoutRepository : ICheckoutRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;
        private readonly UserManager<User> _userManager;
        private readonly IAmazonS3Service _amazonS3Service;


        public CheckoutRepository(
            ApplicationDbContext applicationDbContext,
            INotificationService notificationService,
            UserManager<User> userManager,
            IAmazonS3Service amazonS3Service
        )
        {
            _userManager = userManager;
            _context = applicationDbContext;
            _notificationService = notificationService;
            _amazonS3Service = amazonS3Service;

        }

        public async Task<ApiResponse<SaleDTO>> CreateCheckoutAsync(NewCheckoutRequest request)
        {
            if (request.Items.Count == 0)
                return ApiResponse<SaleDTO>.Fail(message: "sale is empty");

            // verify company exists
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.Name == request.CompanyName);
            if (company == null)
                return ApiResponse<SaleDTO>.Fail(message: "Company not found");

            // verify session exists
            var session = await _context.PosSessions
                .FirstOrDefaultAsync(ps => ps.Id == request.PosSessionId && ps.IsActive == true);
            if (session == null)
                return ApiResponse<SaleDTO>.Fail(message: "POS session not found");

            // verify cashier exists
            var cashier = await _userManager
                .FindByIdAsync(request.CashierId);
            if (cashier == null)
                return ApiResponse<SaleDTO>.Fail(message: "Cashier not found");


            // Generate InvoiceNumber (example: CompanyID-YYYYMMDD-HHMMSS)
            var invoiceNumber = $"{request.CompanyName[0..2]}-{DateTime.UtcNow:yyyyMMddHHmmss}";

            var productIds = request.Items.Select(i => i.ProductId).ToList();
            var products = await _context.Products
                .Include(p => p.TaxCategory)
                .Where(p => productIds.Contains(p.Id))
                .ToDictionaryAsync(p => p.Id);

            // Load product batches for this company
            var productBatches = await _context.ProductBatches
                .Include(pb => pb.Product)
                .Where(pb => productIds.Contains(pb.ProductId)
                            && pb.Warehouse.CompanyId == company.Id
                            && (pb.ExpiryDate == null || pb.ExpiryDate > DateTime.UtcNow))
                .ToListAsync();

            // Validate stock
            foreach (var item in request.Items)
            {
                var availableQty = productBatches
                    .Where(pb => pb.ProductId == item.ProductId)
                    .Sum(pb => pb.Quantity);

                if (availableQty < item.Quantity)
                {
                    return ApiResponse<SaleDTO>.Fail(
                        message: $"Not enough stock for product {item.Product.Name}. Requested {item.Quantity}, available {availableQty}"
                    );
                }
            }

            foreach (var item in request.Items)
            {
                var needed = item.Quantity;

                var batches = productBatches
                    .Where(pb => pb.ProductId == item.ProductId)
                    .OrderBy(pb => pb.ExpiryDate ?? DateTime.MaxValue) // oldest first
                    .ToList();

                foreach (var batch in batches)
                {
                    if (needed <= 0) break;

                    var deduction = Math.Min(needed, batch.Quantity);
                    batch.Quantity -= deduction;
                    needed -= deduction;
                }

                if (needed > 0)
                {
                    return ApiResponse<SaleDTO>.Fail(
                        message: $"Not enough stock for product {item.ProductId}"
                    );
                }
            }

            // build sale items with verified prices and tax
            decimal subtotal = 0m;
            decimal taxTotal = 0m;

            var saleItems = request.Items.Select(i =>
            {
                if (!products.TryGetValue(i.ProductId, out var product))
                    throw new Exception($"Product {i.ProductId} not found");

                var lineSubtotal = i.Quantity * i.Product.Price;
                var lineTax = lineSubtotal * product.TaxCategory.RatePercent;

                subtotal += lineSubtotal;
                taxTotal += lineTax;

                return new SaleItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    LineTotal = lineSubtotal + lineTax
                };
            }).ToList();

            var total = subtotal + taxTotal;

            // Create Sale
            var sale = new Sale
            {
                CompanyId = company.Id,
                Company = company,
                PosSessionId = session.Id,
                PosSession = session,
                CashierId = cashier.Id,
                Cashier = cashier,
                InvoiceNumber = invoiceNumber,
                Subtotal = subtotal,
                TaxTotal = taxTotal,
                Total = total,
                Status = SaleStatus.PENDING,
                Items = saleItems
            };

            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();

            return ApiResponse<SaleDTO>.Ok(sale.FromModelToDto());
        }
        public async Task<ApiResponse<SaleDTO>> GetByUUIDAsync(string uuid)
        {

            var sale = await _context.Sales
                .Include(s => s.Company)
                .Include(s => s.Items)
                    .ThenInclude(si => si.Product)
                        .ThenInclude(p => p.TaxCategory)
                .Include(s => s.PosSession)
                    .ThenInclude(ps => ps.PosTerminal)
                .Include(s => s.Cashier)
                .FirstOrDefaultAsync(s => s.UUID == uuid);

            if (sale == null)
                return ApiResponse<SaleDTO>.NotFound(message: "Sale not found");
            if (sale.Company == null)
                return ApiResponse<SaleDTO>.NotFound(message: "Company not found");

            return ApiResponse<SaleDTO>.Ok(sale.FromModelToDto());

        }

        public async Task<ApiResponse<string>> GenerateReceiptPDF(string uuid)
        {
            var sale = await _context.Sales
                .Include(s => s.Company)
                .Include(s => s.Items)
                    .ThenInclude(si => si.Product)
                        .ThenInclude(p => p.TaxCategory)
                .Include(s => s.PosSession)
                    .ThenInclude(ps => ps.PosTerminal)
                .Include(s => s.Cashier)
                .FirstOrDefaultAsync(s => s.InvoiceNumber == uuid);

            if (sale == null)
                return ApiResponse<string>.NotFound(message: "Sale not found");

            // Generate PDF bytes using QuestPDF
            var pdfBytes = GenerateReceiptPdfBytes(sale);

            // Upload to S3
            var formFile = ToFormFile(pdfBytes, $"{sale.InvoiceNumber}.pdf");
            var fileUrl = await _amazonS3Service.UploadFileAsync(formFile, sale.InvoiceNumber);

            return ApiResponse<string>.Ok(data: fileUrl);

        }
        private static IFormFile ToFormFile(byte[] fileBytes, string fileName)
        {
            var stream = new MemoryStream(fileBytes);
            return new FormFile(stream, 0, stream.Length, "file", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = "application/pdf"
            };
        }

        private byte[] GenerateReceiptPdfBytes(Sale sale)
        {
            QuestPDF.Settings.License = LicenseType.Community;
            using var ms = new MemoryStream();

            var document = QuestPDF.Fluent.Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(0);
                    page.Size(400, 600); // Narrower receipt-like dimensions
                    page.PageColor("#1a1a1a"); // Dark background

                    page.Content().Padding(30).Column(col =>
                    {
                        col.Spacing(20);

                        // Header with company name
                        col.Item()
                            .AlignCenter()
                            .Text(sale.Company.Name.ToUpper())
                            .FontSize(18)
                            .SemiBold()           // <- replaces FontWeight
                            .FontColor("#ffffff");

                        // Served by line
                        col.Item().AlignCenter().Text($"Served By: {sale.Cashier.UserName}")
                            .FontSize(12)
                            .FontColor("#9ca3af");

                        col.Item().LineHorizontal(1).LineColor("#374151");

                        // Receipt details section
                        col.Item().Column(details =>
                        {
                            details.Spacing(8);

                            details.Item().Row(row =>
                            {
                                row.RelativeItem().Text("Invoice #:")
                                    .FontSize(11)
                                    .FontColor("#9ca3af");
                                row.RelativeItem().AlignRight().Text(sale.InvoiceNumber)
                                    .FontSize(11)
                                    .FontColor("#ffffff");
                            });

                            details.Item().Row(row =>
                            {
                                row.RelativeItem().Text("Date:")
                                    .FontSize(11)
                                    .FontColor("#9ca3af");
                                row.RelativeItem().AlignRight().Text(sale.CreatedOn.ToString("MMM d, yyyy"))
                                    .FontSize(11)
                                    .FontColor("#ffffff");
                            });

                            details.Item().Row(row =>
                            {
                                row.RelativeItem().Text("Time:")
                                    .FontSize(11)
                                    .FontColor("#9ca3af");
                                row.RelativeItem().AlignRight().Text(sale.CreatedOn.ToString("hh:mm tt"))
                                    .FontSize(11)
                                    .FontColor("#ffffff");
                            });

                            details.Item().Row(row =>
                            {
                                row.RelativeItem().Text("Terminal:")
                                    .FontSize(11)
                                    .FontColor("#9ca3af");
                                row.RelativeItem().AlignRight().Text(sale.PosSession.PosTerminal.Name)
                                    .FontSize(11)
                                    .FontColor("#ffffff");
                            });
                        });

                        col.Item().LineHorizontal(1).LineColor("#374151");

                        // Items Purchased section
                        col.Item().Text("Items Purchased")
                            .FontSize(14)
                            .SemiBold()           // <- replaces FontWeight
                            .FontColor("#ffffff");

                        // Items list
                        col.Item().Column(items =>
                        {
                            foreach (var item in sale.Items)
                            {
                                items.Item().Padding(8).Row(row =>
                                {
                                    row.RelativeItem(3).Column(itemDetails =>
                                    {
                                        itemDetails.Item().Text(item.Product.Name)
                                            .FontSize(12)
                                            .FontColor("#ffffff");
                                        itemDetails.Item().Text($"SKU: {item.Product.Sku}")
                                            .FontSize(10)
                                            .FontColor("#9ca3af");
                                        itemDetails.Item().Text($"{item.Quantity} x {item.UnitPrice:C}")
                                            .FontSize(10)
                                            .FontColor("#9ca3af");
                                    });

                                    row.RelativeItem(1).AlignRight().Text(item.LineTotal.ToString("C"))
                                        .FontSize(12)
                                        .FontSize(18)
                                        .Medium()           // <- replaces FontWeight
                                        .FontColor("#ffffff");
                                });

                                items.Item().PaddingLeft(8).Text($"Tax: {(item.LineTotal * 0.125m):P1}")
                                    .FontSize(10)
                                    .FontColor("#9ca3af");
                            }
                        });

                        col.Item().LineHorizontal(1).LineColor("#374151");

                        // Totals section
                        col.Item().Column(totals =>
                        {
                            totals.Spacing(4);

                            totals.Item().Row(row =>
                            {
                                row.RelativeItem().Text("Subtotal:")
                                    .FontSize(12)
                                    .FontColor("#9ca3af");
                                row.RelativeItem().AlignRight().Text(sale.Subtotal.ToString("C"))
                                    .FontSize(12)
                                    .FontColor("#ffffff");
                            });

                            totals.Item().Row(row =>
                            {
                                row.RelativeItem().Text("Tax Total:")
                                    .FontSize(12)
                                    .FontColor("#9ca3af");
                                row.RelativeItem().AlignRight().Text(sale.TaxTotal.ToString("C"))
                                    .FontSize(12)
                                    .FontColor("#ffffff");
                            });

                            totals.Item().PaddingTop(8).Row(row =>
                            {
                                row.RelativeItem().Text("Total:")
                                    .FontSize(16)
                                    .SemiBold()
                                    .FontColor("#10b981"); // Green color for total
                                row.RelativeItem().AlignRight().Text(sale.Total.ToString("C"))
                                    .FontSize(16)
                                    .Bold()
                                    .FontColor("#10b981");
                            });
                        });

                        col.Item().PaddingTop(20).AlignCenter().Column(footer =>
                        {
                            footer.Item().Text("Thank you for shopping with us!")
                                .FontSize(11)
                                .FontColor("#9ca3af")
                                .AlignCenter();
                            footer.Item().Text("Please keep this receipt for your records.")
                                .FontSize(10)
                                .FontColor("#6b7280")
                                .AlignCenter();
                        });
                    });
                });
            });

            document.GeneratePdf(ms);
            return ms.ToArray();
        }

        public async Task<ApiResponse<SaleDTO>> GetReceiptAsync(string uuid)
        {
            var sale = await _context.Sales
                    .Include(s => s.Company)
                    .Include(s => s.Items)
                        .ThenInclude(si => si.Product)
                            .ThenInclude(p => p.TaxCategory)
                    .Include(s => s.PosSession)
                        .ThenInclude(ps => ps.PosTerminal)
                    .Include(s => s.Cashier)
                    .FirstOrDefaultAsync(s => s.InvoiceNumber == uuid);

            if (sale == null)
                return ApiResponse<SaleDTO>.NotFound(message: "Sale not found");
            if (sale.Company == null)
                return ApiResponse<SaleDTO>.NotFound(message: "Company not found");

            return ApiResponse<SaleDTO>.Ok(sale.FromModelToDto());
        }

        public async Task<ApiResponse<List<SaleDTO>>> GetSaleByCompanyAsync(RequestQueryObject queryObject)
        {
            var now = DateTime.UtcNow;
            var query = _context.Sales
                .Where(p => p.Company.Name == queryObject.CompanyName)
                .AsQueryable();

            // filtering
            if (queryObject.IsDeleted.HasValue)
            {
                query = query.Where(c => c.IsDeleted == queryObject.IsDeleted.Value);
            }

            // Sorting
            query = queryObject.SortBy switch
            {
                ESortBy.ASC => query.OrderBy(c => c.CreatedOn),
                ESortBy.DSC => query.OrderByDescending(c => c.CreatedOn),
                _ => query.OrderByDescending(c => c.CreatedOn)
            };

            var totalCount = await query.CountAsync();

            // Pagination
            var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;
            var products = await query
                .Skip(skip)
                .Take(queryObject.PageSize)
                .ToListAsync();

            // Mapping to DTOs
            var result = new List<SaleDTO>();
            foreach (var product in products)
            {
                var dto = product.FromModelToDto();
                result.Add(dto);
            }

            return new ApiResponse<List<SaleDTO>>
            {
                Success = true,
                StatusCode = 200,
                Data = result,
                Meta = new MetaData
                {
                    TotalCount = totalCount,
                    PageNumber = queryObject.PageNumber,
                    PageSize = queryObject.PageSize
                }
            };
        }
    }
}