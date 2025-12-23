'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import ProductCardWrapper from './ProductCardWrapper';
import { getAssetPath } from '@/lib/paths';

interface ProductListProps {
  products: Product[];
}

type SortOption = 
  | 'relevance'
  | 'best-sellers'
  | 'newest'
  | 'discount'
  | 'price-desc'
  | 'price-asc'
  | 'name-asc'
  | 'name-desc';

export default function ProductList({ products: initialProducts }: ProductListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showAll, setShowAll] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const sortProducts = (products: Product[], sort: SortOption): Product[] => {
    const sorted = [...products];
    
    switch (sort) {
      case 'price-asc':
        return sorted.sort((a, b) => a.currentPrice - b.currentPrice);
      case 'price-desc':
        return sorted.sort((a, b) => b.currentPrice - a.currentPrice);
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'discount':
        return sorted.sort((a, b) => {
          const discountA = ((a.originalPrice - a.currentPrice) / a.originalPrice) * 100;
          const discountB = ((b.originalPrice - b.currentPrice) / b.originalPrice) * 100;
          return discountB - discountA;
        });
      default:
        return sorted;
    }
  };

  const sortedProducts = sortProducts(initialProducts, sortBy);
  
  // Lista horizontal: usa APENAS os kits específicos (kit-1, kit-2, kit-3, kit-4)
  // Estes produtos são completamente independentes da lista vertical
  const kitProducts = initialProducts.filter(p => p.id.startsWith('kit-')).slice(0, 4);
  
  // Lista vertical: usa APENAS produtos normais (não kits)
  // Exclui todos os kits e garante que o produto '1' (Kit 5 Body Splash) apareça primeiro
  const verticalProducts = sortedProducts.filter(p => !p.id.startsWith('kit-'));
  const kit5Product = verticalProducts.find(p => p.id === '1');
  const otherProducts = verticalProducts.filter(p => p.id !== '1');
  const displayedProducts = kit5Product 
    ? [kit5Product, ...otherProducts].slice(0, 6)
    : verticalProducts.slice(0, 6);

  const sortOptions = [
    { value: 'relevance', label: 'Relevância' },
    { value: 'best-sellers', label: 'Mais vendidos' },
    { value: 'newest', label: 'Mais recentes' },
    { value: 'discount', label: 'Desconto' },
    { value: 'price-desc', label: 'Preço: Do maior para o menor' },
    { value: 'price-asc', label: 'Preço: Do menor para o maior' },
    { value: 'name-asc', label: 'Nome em ordem crescente' },
    { value: 'name-desc', label: 'Nome em ordem decrescente' },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Ordenar';

  return (
    <div className="max-w-7xl mx-auto">
      {/* Banner */}
      <div className="px-4 py-6 bg-white">
        <img 
          src={getAssetPath('/bannerwepink.png')} 
          alt="Banner Wepink" 
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Controls Bar */}
      <div className="relative">
        <div className="px-4 py-6 pb-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-center gap-4">
            {/* Product Count */}
            <span className="text-sm text-gray-600 font-medium">
              <span className="font-bold">{kitProducts.length + displayedProducts.length}</span> produtos
            </span>

            {/* Separator */}
            <span className="text-gray-300 text-xs">|</span>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort Button */}
              <button
                onClick={() => {
                  setShowSortMenu(!showSortMenu);
                  setShowFilterMenu(false);
                }}
                className="flex items-center gap-1.5 text-sm text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h8"></path>
                </svg>
                <span>Ordenar</span>
              </button>

              {/* Separator */}
              <span className="text-gray-300 text-xs">|</span>

              {/* Filter Button */}
              <button
                onClick={() => {
                  setShowFilterMenu(!showFilterMenu);
                  setShowSortMenu(false);
                }}
                className="flex items-center gap-1.5 text-sm text-gray-700"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span>Filtrar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sort Menu Dropdown */}
        {showSortMenu && (
          <div className="absolute inset-x-0 top-full bg-white border-b border-gray-200 shadow-lg z-50">
            <div className="px-4 py-2 max-h-96 overflow-y-auto">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value as SortOption);
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left py-2 px-2 text-xs rounded ${
                    sortBy === option.value
                      ? 'bg-pink-50 text-pink-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter Menu Dropdown */}
        {showFilterMenu && (
          <div className="absolute inset-x-0 top-full bg-white border-b border-gray-200 shadow-lg z-50">
            <div className="px-4 py-2">
              <p className="text-xs text-gray-500 py-2">Filtros em breve</p>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid - Horizontal Scroll */}
      <div className="py-4 bg-white">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {kitProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[85%] sm:w-[70%]">
              <ProductCardWrapper 
                product={product}
                showAddToCart={true}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Products Grid - Vertical Layout */}
      <div className="px-4 py-4 bg-white">
        <div className="grid grid-cols-1 gap-4">
          {displayedProducts.map((product, index) => {
            // Se for o produto '1', usar informações do kit
            const isKit5 = product.id === '1';
            return (
              <ProductCardWrapper 
                key={`vertical-${product.id}`} 
                product={product} 
                forceImage={isKit5 ? getAssetPath('kit.jpeg') : undefined}
                forceName={isKit5 ? 'Kit 5 Body Splash - Wepink' : undefined}
                showExclusiveBadge={true}
                showAddToCart={true}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

