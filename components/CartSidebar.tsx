'use client';

import React, { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { getAssetPath } from '@/lib/paths';
import Link from 'next/link';

export default function CartSidebar() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  // Prevenir scroll quando carrinho está aberto
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] shadow-xl flex flex-col">
        {/* Header */}
        <div className="bg-pink-600 px-4 py-4 flex items-center justify-between">
          <h2 className="text-white text-lg font-bold">Carrinho ({totalItems})</h2>
          <button
            onClick={closeCart}
            className="text-white p-1 hover:bg-pink-700 rounded"
            aria-label="Fechar carrinho"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 mb-2">Seu carrinho está vazio</p>
              <p className="text-sm text-gray-400">Adicione produtos para continuar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-200">
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-pink-50 to-pink-100 rounded overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl">🌸</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-sm font-bold text-gray-900 mb-2">
                      {formatPrice(item.currentPrice)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                        aria-label="Diminuir quantidade"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                        aria-label="Aumentar quantidade"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-red-500 hover:text-red-700 p-1"
                        aria-label="Remover produto"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-pink-600">{formatPrice(totalPrice)}</span>
            </div>
            <Link
              href={getAssetPath('/checkout')}
              onClick={closeCart}
              className="w-full bg-pink-600 text-white py-3 px-4 rounded font-semibold text-base hover:bg-pink-700 transition-colors flex items-center justify-center"
            >
              Finalizar Compra
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

