'use client';

import { useState, useEffect } from 'react';
import Header from './Header';
import { useCart } from '@/contexts/CartContext';

export default function HeaderWrapper() {
  const { openCart, totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  // Garantir que só renderize após hidratação no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Durante SSR, sempre passar 0 para evitar diferença de hidratação
  return <Header onCartClick={openCart} cartItemsCount={mounted ? totalItems : 0} />;
}




