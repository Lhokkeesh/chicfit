export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageUrl: string;
  category: 'men' | 'women' | 'accessories';
  sizes?: string[];
  colors?: string[];
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
} 