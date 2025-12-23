export interface Product {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  currentPrice: number;
  installments: number;
  installmentValue: number;
  image?: string;
  outOfStock?: boolean;
}

