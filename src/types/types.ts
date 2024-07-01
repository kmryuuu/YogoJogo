export interface Product {
  id: string;
  title: string;
  price: number;
  quantity: number;
  category: string;
  desc: string;
  imageUrl?: string;
  createdAt: Date;
}
