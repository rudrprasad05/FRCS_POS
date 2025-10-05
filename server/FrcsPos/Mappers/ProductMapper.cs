using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public interface IProductMapper
    {
        Task<ProductDTO> FromModelToDtoAsync(Product request);
        ProductDTO FromModelToOnlyDto(Product request);
        Task<List<ProductDTO>> FromModelToDtoAsync(ICollection<Product> request);
    }
    public class ProductMapper : IProductMapper
    {
        private readonly IProductVariantMapper _variantMapper;


        public ProductMapper(IProductVariantMapper variantMapper)
        {
            _variantMapper = variantMapper;
        }

        public async Task<ProductDTO> FromModelToDtoAsync(Product request)
        {
            if (request == null)
                return new ProductDTO();

            var dto = new ProductDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                Name = request.Name,
                IsDeleted = request.IsDeleted,
                CompanyId = request.CompanyId,
                Sku = request.Sku,
                TaxCategoryId = request.TaxCategoryId,
                IsPerishable = request.IsPerishable
            };

            // Map Variants (with signed media URLs)
            if (request.Variants != null && request.Variants.Count > 0)
            {
                dto.Variants = await _variantMapper.FromModelToDtoAsync(request.Variants);
            }

            // Map Tax Category
            if (request.TaxCategory != null)
            {
                dto.TaxCategory = request.TaxCategory.FromModelToDto();
            }

            // Map Supplier
            if (request.Supplier != null)
            {
                dto.Supplier = request.Supplier.FromModelToDto();
            }

            return dto;
        }

        public ProductDTO FromModelToOnlyDto(Product request)
        {
            if (request == null)
                return new ProductDTO();

            return new ProductDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                IsDeleted = request.IsDeleted,
                Name = request.Name,
                CompanyId = request.CompanyId,
                Sku = request.Sku,
                TaxCategoryId = request.TaxCategoryId,
                IsPerishable = request.IsPerishable
            };
        }


        public async Task<List<ProductDTO>> FromModelToDtoAsync(ICollection<Product> request)
        {
            if (request == null || request.Count == 0)
                return [];

            var dtoList = new List<ProductDTO>();
            foreach (var product in request)
            {
                dtoList.Add(await FromModelToDtoAsync(product));
            }

            return dtoList;
        }
    }
}
