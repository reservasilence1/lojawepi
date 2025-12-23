'use client';

import { useState, useEffect } from 'react';
import Logo from './Logo';

interface HeaderProps {
  onCartClick?: () => void;
  cartItemsCount?: number;
}

export default function Header({ onCartClick, cartItemsCount = 0 }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'kits' },
    { name: 'bath&body' },
    { name: 'body splash' },
    { name: 'perfumaria' },
    { name: 'skincare' },
    { name: 'body cream' },
    { name: 'the cream' },
    { name: 'the oil' },
  ];

  // Prevenir scroll do body quando menu está aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-[40px] z-50 border-b border-gray-200" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="px-4">
          <div className="relative flex items-center justify-between py-3">
            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 z-10"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                style={{ stroke: '#000000' }}
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                    style={{ stroke: '#000000' }}
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                    style={{ stroke: '#000000' }}
                  />
                )}
              </svg>
            </button>

            {/* Logo - Centralizado */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Logo />
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3 z-10">
              <button className="p-2 text-gray-700" aria-label="Perfil">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </button>
              <button
                onClick={onCartClick}
                className="p-2 text-gray-700 relative"
                aria-label="Carrinho"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Menu */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed left-0 top-0 h-full w-full max-w-sm bg-white z-[101] overflow-y-auto shadow-xl">
            {/* Header Rosa */}
            <div className="bg-pink-600 px-4 pt-6 pb-5 relative">
              {/* Logo e X */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1"></div>
                <div className="flex-1 flex justify-center">
                  <Logo color="#FFFFFF" />
                </div>
                <div className="flex-1 flex justify-end">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white p-1"
                    aria-label="Fechar menu"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Quick Actions - 4 ícones em linha */}
              <div className="flex items-center justify-between mb-5 px-2">
                <a href="#" className="flex flex-col items-center text-white flex-1">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-1.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-center leading-tight">Minha conta</span>
                </a>
                <a href="#" className="flex flex-col items-center text-white flex-1">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-1.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-center leading-tight">Trocar e<br/>Devolver</span>
                </a>
                <a href="#" className="flex flex-col items-center text-white flex-1">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-1.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-center leading-tight">Rastreio</span>
                </a>
                <a href="#" className="flex flex-col items-center text-white flex-1">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-1.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-center leading-tight">Nossas<br/>Lojas</span>
                </a>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="digite aqui o que procura..."
                  className="w-full bg-white rounded-lg px-4 py-3 pl-11 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                />
                <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="#FF0080" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Content Branco */}
            <div className="px-4 py-4 bg-white">
              <a href="#" className="text-xs text-black underline mb-5 block text-right">
                Ver todos os produtos &gt;
              </a>

              {/* Categories */}
              <nav>
                <ul className="space-y-0">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <a
                        href="#"
                        className="flex items-center justify-between py-3 text-base text-black hover:opacity-80 border-b border-gray-100 last:border-b-0"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="capitalize">{item.name}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}

