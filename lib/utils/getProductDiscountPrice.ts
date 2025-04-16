import { Product } from "@/types/product.type";

export function getProductDiscountPrice(product: Product, langPrefix: string) {
  if (!product.discountStartDate || !product.discountEndDate) {
    return 0;
  }

  const currentDate = new Date();
  const discountStartDate = new Date(product.discountStartDate);
  const discountEndDate = new Date(product.discountEndDate);

  if (currentDate < discountStartDate || currentDate > discountEndDate) {
    return 0;
  }

  return (
    product[`price${langPrefix}`] -
    (product[`price${langPrefix}`] * (product?.discountPercentage || 1)) / 100
  );
}
