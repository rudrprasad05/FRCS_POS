using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{

    public interface IProductVariantMapper
    {
        Task<ProductVariantDTO> FromModelToDtoAsync(ProductVariant request);
        Task<List<ProductVariantDTO>> FromModelToDtoAsync(ICollection<ProductVariant> request);
        ProductVariant FromEditVarToModel(EditVarData request);
    }


    public class ProductVariantMapper : IProductVariantMapper
    {
        private readonly IMediaMapper _mediaMapper;
        // private readonly IProductMapper _productMapper;


        public ProductVariantMapper(IMediaMapper mediaMapper)
        {
            _mediaMapper = mediaMapper;
            // _productMapper = productMapper;
        }

        public async Task<ProductVariantDTO> FromModelToDtoAsync(ProductVariant request)
        {
            if (request == null)
                return new ProductVariantDTO();

            var dto = new ProductVariantDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                Name = request.Name,
                Sku = request.Sku,
                Barcode = request.Barcode,
                Price = request.Price,
                FirstWarningInDays = request.FirstWarningInDays,
                CriticalWarningInHours = request.CriticalWarningInHours,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                IsDeleted = request.IsDeleted
            };

            // Media Mapping (with signed URL)
            if (request.Media != null)
            {
                dto.Media = await _mediaMapper.ToDtoAsync(request.Media);
            }

            // Product Mapping (if present)
            if (request.Product != null)
            {
                dto.IsPerishable = request.Product.IsPerishable;
                request.Product.Variants = [];
                dto.Product = request.Product.FromModelToDtoStatic();
            }

            return dto;
        }

        public async Task<List<ProductVariantDTO>> FromModelToDtoAsync(ICollection<ProductVariant> request)
        {
            if (request == null || request.Count == 0)
                return [];

            var dtoList = new List<ProductVariantDTO>();
            foreach (var variant in request)
            {
                var dto = await FromModelToDtoAsync(variant);
                dtoList.Add(dto);
            }

            return dtoList;
        }

        public ProductVariant FromEditVarToModel(EditVarData request)
        {
            if (request == null)
                return new ProductVariant();

            return new ProductVariant
            {
                Name = request.Name,
                Sku = request.Sku,
                Barcode = request.Barcode,
                Price = request.Price,
                CreatedOn = DateTime.UtcNow,
                UpdatedOn = DateTime.UtcNow,
                IsDeleted = false
            };
        }
    }
}
