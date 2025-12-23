'use client';

import { Product } from '@/types/product';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  forceOutOfStock?: boolean;
  forceImage?: string;
  forceName?: string;
  forceDescription?: string;
  showExclusiveBadge?: boolean;
  showAddToCart?: boolean;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, forceOutOfStock, forceImage, forceName, forceDescription, showExclusiveBadge, showAddToCart = false, onAddToCart }: ProductCardProps) {
  const isOutOfStock = forceOutOfStock !== undefined ? forceOutOfStock : product.outOfStock;
  const imageUrl = forceImage || product.image;
  const productName = forceName || product.name;
  const productDescription = forceDescription !== undefined ? forceDescription : product.description;
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const discount = Math.round(
    ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100
  );

  return (
    <div className="bg-white overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="aspect-square bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center relative overflow-hidden">
        {showExclusiveBadge && (
          <div className="absolute top-0 left-0 bg-pink-600 text-white py-1.5 px-3 text-xs font-bold text-left uppercase z-10 rounded">
            EXCLUSIVO
          </div>
        )}
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-4">
            <div className="w-20 h-20 bg-pink-200 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl">🌸</span>
            </div>
          </div>
        )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="bg-white text-pink-600 px-4 py-2 rounded font-semibold text-sm">
                  ESGOTADO
                </span>
              </div>
            )}
      </div>
      
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2 leading-tight">
          {productName}
        </h3>
        {productDescription && (
          <p className="text-base text-black mb-2 line-clamp-2">
            {productDescription}
          </p>
        )}
        
        <div className="mb-2">
          <div className="flex items-center space-x-1 mb-1">
            <span className="text-xs text-gray-400 line-through font-bold">
              {formatPrice(product.originalPrice)}
            </span>
          </div>
          <div>
            <span className="text-base font-bold text-gray-900">
              {formatPrice(product.currentPrice)}
            </span>
          </div>
        </div>
        
        <div className="mt-auto">
          {isOutOfStock ? (
            <button className="w-full bg-gray-400 text-pink-600 py-2 px-3 rounded font-semibold text-xs cursor-not-allowed flex items-center justify-center gap-1" disabled>
              ESGOTADO
            </button>
          ) : (
            <Link 
              href={`/produto/${product.id}`}
              className="w-full bg-pink-600 text-white py-2 px-3 rounded font-semibold text-xs hover:bg-pink-700 transition-colors flex items-center justify-center gap-1"
            >
              COMPRAR
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

