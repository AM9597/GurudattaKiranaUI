export interface Product {
  productID: string;
  categoryID?: string;
  productName: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
}
