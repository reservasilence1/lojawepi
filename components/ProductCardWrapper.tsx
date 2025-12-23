'use client';

import ProductCard from './ProductCard';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';

interface ProductCardWrapperProps {
  product: Product;
  forceOutOfStock?: boolean;
  forceImage?: string;
  forceName?: string;
  forceDescription?: string;
  showExclusiveBadge?: boolean;
  showAddToCart?: boolean;
}

export default function ProductCardWrapper(props: ProductCardWrapperProps) {
  const { addToCart } = useCart();
  
  return <ProductCard {...props} onAddToCart={addToCart} />;
}







