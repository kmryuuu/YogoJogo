export interface Product {
  id?: string;
  category: string;
  title: string;
  price: number;
  quantity: number;
  desc: string;
  images: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
