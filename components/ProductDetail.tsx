'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { getAssetPath } from '@/lib/paths';
import { useCart } from '@/contexts/CartContext';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [activeTab, setActiveTab] = useState<'descricao' | 'notas' | 'modo'>('descricao');
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart, openCart } = useCart();

  // Se for o produto '1' (Kit 5 Body Splash), usar informações específicas
  const isKit5 = product.id === '1';
  // Se for o kit-1 (Kit Holiday Duo Celebration + Liberté Doré)
  const isKitHoliday = product.id === 'kit-1';
  // Se for o kit-2 (Kit Liberté Doré + Fatal Black For Her)
  const isKitLiberteFatal = product.id === 'kit-2';
  // Se for o produto '2' (Body Splash Liberté)
  const isLiberte = product.id === '2';
  // Se for o produto '3' (Body Splash Liberté Exclusif)
  const isLiberteExclusif = product.id === '3';
  // Se for o produto '31' (Booster Repair Óleo Capilar)
  const isBoosterRepair = product.id === '31';
  // Se for o produto '32' (Kit Hair + Presente Surpresa)
  const isKitHair = product.id === '32';
  const productName = isKit5 ? 'Kit 5 Body Splash - Wepink' : product.name;
  const productImage = isKit5 ? getAssetPath('kit.jpeg') : product.image;

  // Configuração de checkout por produto
  const checkoutConfig: Record<string, { checkout: string; offer: string }> = {
    '1': { checkout: 'https://ambienteseguro.org.ua/c/16c803ea1e', offer: 'WEPINK_KIT_5_BODY_SPLASH' }, // Kit 5 Body Splash
    '2': { checkout: 'https://ambienteseguro.org.ua/c/a81adaca93', offer: 'WEPINK_LIBERTE' }, // Body Splash Liberté
    '3': { checkout: 'https://ambienteseguro.org.ua/c/6557ae9ad7', offer: 'WEPINK_LIBERTE_EXCLUSIF' }, // Liberté Exclusif
    'kit-1': { checkout: 'https://ambienteseguro.org.ua/c/a24ba9525d', offer: 'WEPINK_KIT_HOLIDAY' }, // Kit Holiday Duo Celebration + Liberté Doré
    'kit-2': { checkout: 'https://ambienteseguro.org.ua/c/d9ab2d1f7d', offer: 'WEPINK_KIT_LIBERTE_FATAL' }, // Kit Liberté Doré + Fatal Black For Her
  };

  // Busca a configuração do produto ou usa padrão
  const config = checkoutConfig[product.id] || { 
    checkout: 'https://ambienteseguro.org.ua/c/16c803ea1e', 
    offer: 'WEPINK' 
  };

  const handlePurchase = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    const checkoutUrl = config.checkout;
    const apiUrl = "https://tracker-api-tracker.v3bpu1.easypanel.host/checkout";
    const requestBody = {
      checkout: checkoutUrl,
      offer: config.offer,
    };

    let finalCheckoutUrl = checkoutUrl;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        try {
          const data = await response.json();
          if (data && data.checkout) {
            finalCheckoutUrl = data.checkout;
          }
        } catch (parseError) {
          // Ignora erro de parse
        }
      }

      // Aguarda um pouco para garantir que o servidor processou
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redireciona
      window.location.href = finalCheckoutUrl;

    } catch (error) {
      // Tenta criar a oferta usando keepalive como fallback
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody),
        keepalive: true,
      }).catch(() => {
        // Ignora erros do fallback
      });
      
      // Aguarda um pouco antes de redirecionar
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redireciona mesmo em caso de erro
      window.location.href = checkoutUrl;
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Product Image */}
        <div className="w-full">
          <div className="aspect-square bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center relative overflow-hidden rounded-lg">
            {productImage ? (
              <img
                src={productImage}
                alt={productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-4">
                <div className="w-20 h-20 bg-pink-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-2xl">🌸</span>
                </div>
              </div>
            )}
            {product.outOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="bg-white text-pink-600 px-4 py-2 rounded font-semibold text-sm uppercase">
                  ESGOTADO
                </span>
              </div>
            )}
          </div>
        </div>

          {/* Product Info */}
          <div className="w-full">
          <h1 className="font-bold text-2xl mb-2" style={{ color: '#FF0080' }}>
            {productName}
          </h1>
        
        {!(isKitHoliday || isKitLiberteFatal) && (
          <p className="text-base text-black mb-4">
            {isLiberteExclusif ? 'transborde o frescor da nobreza' : isLiberte ? 'transborde a essência da elegância' : product.description}
          </p>
        )}

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base font-medium text-black">4.6 de 5</span>
            <div className="flex items-center gap-0.5">
              {/* 4 estrelas cheias */}
              {[...Array(4)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5"
                  fill="#FFD700"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              {/* 1 estrela parcialmente preenchida (60%) */}
              <div className="relative w-5 h-5">
                <svg
                  className="w-5 h-5 absolute"
                  fill="#FFD700"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ clipPath: 'inset(0 40% 0 0)' }}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <svg
                  className="w-5 h-5 absolute"
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth="1"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>
            <span className="text-base text-black">(19515)</span>
          </div>

          {/* Pricing */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-400 line-through font-bold">
                {formatPrice(product.originalPrice)}
              </span>
              {discount > 0 && (
                <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded text-xs font-semibold">
                  {discount}% OFF
                </span>
              )}
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.currentPrice)}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          {product.outOfStock ? (
            <button
              className="w-full bg-gray-400 text-pink-600 py-4 px-6 rounded font-semibold text-base cursor-not-allowed flex items-center justify-center gap-2 uppercase"
              disabled
            >
              ESGOTADO
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
                openCart();
              }}
              className="w-full bg-pink-600 text-white py-4 px-6 rounded font-semibold text-base transition-colors flex items-center justify-center gap-2 uppercase hover:bg-pink-700"
            >
              ADICIONAR AO CARRINHO
            </button>
          )}

          {/* Características Section */}
          <div className="mt-6 -mx-4 py-6 px-4" style={{ backgroundColor: '#FF93BE' }}>
            <h2 className="text-2xl font-bold text-white mb-4">Características</h2>
            {isKitHoliday ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Kit Holiday Duo Celebration - Wepink</h3>
                  <ul className="space-y-0.5 text-white font-medium">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Fragrâncias festivas que celebram o fim de ano</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Qualidade incrível em cada borrifada</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Sensação de bem-estar</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Pele perfumada com clima de festa</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Liberté Doré Desodorante Colônia 100ml - Wepink</h3>
                  <ul className="space-y-0.5 text-white font-medium">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Caminho olfativo: Frutado Floral</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Essência sofisticada, intensa e envolvente</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Fixacao e projeção prolongadas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Excelência em cada detalhe</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : isKitLiberteFatal ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Liberté Doré Desodorante Colônia 100ml - Wepink</h3>
                  <ul className="space-y-0.5 text-white font-medium">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Caminho olfativo: Frutado Floral</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Essência sofisticada, intensa e envolvente</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Fixacao e projeção prolongadas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Excelência em cada detalhe</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Fatal Black For Her Desodorante Colônia 100ml - Wepink</h3>
                  <ul className="space-y-0.5 text-white font-medium">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Caminho olfativo: Frutado Floral Oriental</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Essência sofisticada, intensa e envolvente</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Fixacao e projeção prolongadas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Excelência em cada detalhe</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : isLiberte ? (
              <ul className="space-y-0.5 text-white font-medium">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Qualidade incrível</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Pele incrivelmente perfumada</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Bem-estar prolongado</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Essência floral e romântica</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Caminho olfativo: Floral Bouquet</span>
                </li>
              </ul>
            ) : isLiberteExclusif ? (
              <ul className="space-y-0.5 text-white font-medium">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Caminho olfativo: Floral Oriental</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Essência única e sofisticada</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Qualidade incrível</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Longa duração</span>
                </li>
              </ul>
            ) : isBoosterRepair ? (
              <ul className="space-y-0.5 text-white font-medium">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Restauração</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Hidratação</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Nutrição</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Alto poder umectante</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Fortalecimento dos fios</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Aumento da resistência dos fios</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Estímulo do crescimento saudável</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Mais maciez e brilho</span>
                </li>
              </ul>
            ) : isKitHair ? (
              <div className="space-y-4 text-white font-medium">
                <div>
                  <p className="font-bold mb-2">Shampoo My Hair Ultra Repair</p>
                  <ul className="space-y-0.5 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Repara fios da raiz às pontas, inclusive quimicamente tratados</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Fortalece e estimula o crescimento saudável</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Reduz queda, frizz e pontas duplas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Hidratação profunda e brilho radiante</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Sensação refrescante e maciez duradoura nos fios</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-2">Condicionador My Hair Ultra Repair</p>
                  <ul className="space-y-0.5 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Repara pontas duplas e cutículas danificadas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Fortalece os fios, aumentando a resistência</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Brilho intenso e elasticidade renovada</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Maciez e suavidade incomparáveis</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Ultra reparo inteligente com proteção contra frizz e ressecamento</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-2">Booster Repair Óleo Capilar</p>
                  <ul className="space-y-0.5 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Restauração</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Hidratação</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Nutrição</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Alto poder umectante</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Fortalecimento dos fios</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Aumento da resistência dos fios</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Estímulo do crescimento saudável</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Mais maciez e brilho</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-2">Leave-in Capilar Multifuncional</p>
                  <ul className="space-y-0.5 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Fortalecimento dos fios</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Formação de filme protetor</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Reparação de pontas duplas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Hidratação profunda</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Nutrição</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Efeito Antifrizz</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Proteção térmica</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Diminui o volume dos fios</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Melhora a penteabilidade</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Maciez profunda</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Maior brilho</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-2">Proteína Condicionante My Hair Ultra Repair</p>
                  <ul className="space-y-0.5 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Hidratação profunda</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Redução visível do frizz</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Força e resistência da raiz às pontas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Reparação da fibra capilar danificada</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Ação antioxidante e nutritiva</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Fios mais alinhados e brilhantes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Perfume marcante e duradouro</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-2">Máscara My Hair Ultra Repair</p>
                  <ul className="space-y-0.5 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Hidrata profundamente da raiz às pontas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Repara danos e recupera fios quimicamente tratados</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Diminui frizz e pontas duplas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Fortalece o bulbo capilar e estimula o crescimento</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Aumenta o volume e a densidade dos fios</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Restaura a elasticidade e devolve a maciez</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Brilho radiante e perfume duradouro</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <ul className="space-y-0.5 text-white font-medium">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Qualidade incrível</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Pele incrivelmente perfumada</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Bem-estar prolongado</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Essência sensual e adocicada</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Caminho Olfativo: Chypre Floral Amadeirado</span>
                </li>
              </ul>
            )}
          </div>

          {/* Product Details Section with Tabs */}
          <div className="mt-8 pt-6">
            {/* Tabs */}
            <div className="flex gap-6 mb-4 justify-center">
              <button
                onClick={() => setActiveTab('descricao')}
                className={`pb-3 text-base font-medium transition-colors ${
                  activeTab === 'descricao'
                    ? 'text-pink-600 border-b-[4px] border-pink-600'
                    : 'text-black hover:text-gray-700'
                }`}
              >
                Descrição
              </button>
              <button
                onClick={() => setActiveTab('notas')}
                className={`pb-3 text-base font-medium transition-colors ${
                  activeTab === 'notas'
                    ? 'text-pink-600 border-b-[4px] border-pink-600'
                    : 'text-black hover:text-gray-700'
                }`}
              >
                {isBoosterRepair || isKitHair ? 'Ativos' : 'Notas'}
              </button>
              <button
                onClick={() => setActiveTab('modo')}
                className={`pb-3 text-base font-medium transition-colors ${
                  activeTab === 'modo'
                    ? 'text-pink-600 border-b-[4px] border-pink-600'
                    : 'text-black hover:text-gray-700'
                }`}
              >
                {isBoosterRepair || isKitHair ? 'Como usar' : 'Modo de usar'}
              </button>
            </div>

            {/* Tab Content */}
            <div className="text-sm text-gray-700 leading-relaxed">
              {activeTab === 'descricao' && (
                <>
                  {isKitHoliday ? (
                    <div className="space-y-4">
                      <p className="mb-4">
                        Celebre o fim de ano com duas fragrâncias que entregam magia, brilho e aquela energia gostosa das festas e dos novos começos. Do aconchego doce do Natal ao mood vibrante do Ano Novo, este duo transforma cada instante em memórias incríveis, daquelas que guardamos com carinho e um toque de nostalgia. Um convite para viver a temporada do seu jeito: leve, luminosa e cheia de sensações que ficam na pele e no coração!
                      </p>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-black mb-2">Vivencie a magia da temporada</h4>
                          <p className="text-gray-700">
                            Vivencie a magia da temporada com o Desodorante Colônia Body Splash Wepink Holiday Duo Celebration Merry Christmas 2025, a fragrância floral frutada que envolve com a leveza do espírito natalino. No primeiro toque, a delicada exótica da Flor de Bananeira encontra o frescor cintilante da Pera, evoluindo para um bouquet elegante de Jasmim e Rosa, que adiciona profundidade e feminilidade vibrante à composição. A base apresenta a Baunilha em harmonia com o Musk e o toque gourmand de Banana Split, deixando na pele um rastro doce na medida e irresistivelmente festivo, assim como o Natal!
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-black mb-2">Debute o ano celebrando sua melhor versão</h4>
                          <p className="text-gray-700">
                            Debute o ano celebrando sua melhor versão com o Desodorante Colônia Body Splash Holiday Duo Celebration Wepink Happy New Year 2026. A abertura une o brilho da Bergamota ao frescor das Notas Marinhas, criando uma brisa luminosa que revigora o espírito. À medida que evolui, a essência revela um buquê floral exuberante, inspirado em fortuna e prosperidade. Por fim, o rastro cremoso e elegante se funde à composição, envolvendo o corpo em esperança e boas energias. Uma fragrância criada para acompanhar o seu sucesso nesse novo começo!
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-black mb-2">Liberté Doré</h4>
                          <p className="text-gray-700">
                            O Desodorante Colônia Wepink Liberté Doré é uma joia criada para quem brilha naturalmente, com elegância e sofisticação em cada passo. Esta fragrância é a representação aromática da luz dourada que acompanha a liberdade que cada um tem de ser sua melhor versão. Uma peça magnífica para sua coleção.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : isKitLiberteFatal ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-black mb-2">Liberté Doré</h4>
                        <p className="text-gray-700 mb-4">
                          O Desodorante Colônia Wepink Liberté Doré é uma joia criada para quem brilha naturalmente, com elegância e sofisticação em cada passo. Esta fragrância é a representação aromática da luz dourada que acompanha a liberdade que cada um tem de ser sua melhor versão. Uma peça magnífica para sua coleção.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-black mb-2">Fatal Black For Her</h4>
                        <p className="text-gray-700">
                          O Desodorante Colônia Fatal Black For Her é a celebração da mulher que sabe o próprio valor e não tem medo de exibir sua força feminina. Doce e arrebatador, é como como ouro líquido na pele, radiante e instigante. Um aroma que envolve e encanta em segundos, revelando-se irresistível e absolutamente fatal. Flores brancas exuberantes, rosa vibrante e musk mineral se entrelaçam em uma composição extraordinária, que reluz como um tesouro precioso. Fatal Black For Her não é apenas uma fragrância, é uma afirmação: custaria uma fortuna ser tão única, mas a sensação de usar é impagável.
                        </p>
                      </div>
                    </div>
                  ) : isLiberte ? (
                    <p className="mb-8">
                      O Desodorante Colônia Body Splash Liberté é um produto com a essência única que transborda liberdade, elegância e bem-estar! Sua fragrância tem nuances encantadoras e misteriosas facetas, com toques de pimenta rosa, toranja e flores nobres, com grande destaque para a reconhecida rainha da perfumaria, a Rosa Francesa Centifolia.
                    </p>
                  ) : isLiberteExclusif ? (
                    <p className="mb-8">
                      Ascenda a uma verdadeira sensação de liberdade com o Desodorante Colônia Body Splash Wepink Liberté Exclusif, um aroma floral que transborda nobreza e doçura. Envolva-se pelo frescor da Pera, Lichia e pela delicadeza das flores, finalizando na elegância de um fundo doce e amadeirado. Suas nuances de Âmbar e Baunilha pairam no ambiente e revelam leveza e sofisticação, vivendo a essência de um elixir floral.
                    </p>
                  ) : isBoosterRepair ? (
                    <div className="mb-8 space-y-4">
                      <p>
                        O Booster Repair foi desenvolvido para revolucionar o jeito de cuidar do seu cabelo. Ele não é um simples "reparador de pontas" ou "óleo de cabelo".
                      </p>
                      <p>
                        É a fórmula exclusiva que faltava para uma restauração completa dos fios, hidratação da raiz até as pontas trazendo brilho e maciez ao cabelo, além de deixar o cabelo perfumado.
                      </p>
                      <p>
                        Além de todos os ativos e benefícios incríveis, ele tem uma finalização indescritível e um cheiro fora do normal, o verdadeiro perfume para o cabelo.
                      </p>
                    </div>
                  ) : isKitHair ? (
                    <div className="mb-8 space-y-6">
                      <div>
                        <p className="font-semibold text-black mb-2">Shampoo My Hair Ultra Repair</p>
                        <p className="text-gray-700">
                          O Shampoo Wepink My Hair Ultra Repair é o primeiro passo para conquistar fios brilhantes e saudáveis todos os dias. Ele limpa com suavidade enquanto entrega hidratação intensa, brilho e maciez graças aos extratos de aloe vera e chá verde.
                          Sua fórmula poderosa age da raiz às pontas, reparando danos, reduzindo pontas duplas e fortalecendo até os cabelos quimicamente tratados. Com tecnologia avançada de hiper proteína e complexo reticulante, ajuda no crescimento saudável, combate a queda e protege contra novos danos.
                          E para completar, tem um toque refrescante que deixa aquela sensação deliciosa de frescor, com fios macios, soltinhos e perfumados o dia todo.
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-black mb-2">Condicionador My Hair Ultra Repair</p>
                        <p className="text-gray-700">
                          O Condicionador Wepink My Hair Ultra Repair é o aliado perfeito para deixar seus fios alinhados, macios e com um brilho incrível. Ele desembaraça fácil, hidrata profundamente e devolve força e elasticidade graças ao D-Pantenol, ao extrato natural de groselha indiana e aos óleos vegetais de abacate, camélia e chá verde.
                          Com uma tecnologia pensada para cabelos quimicamente tratados, ele combina lanolina, hiper proteína, complexo reticulante e um blend vegetal poderoso que cria uma película protetora, controla o frizz, reduz pontas duplas e repara as áreas mais danificadas da fibra capilar. O resultado? Fios mais saudáveis, sedosos e protegidos, com um toque perfumado que dura o dia inteiro.
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-black mb-2">Booster Repair Óleo Capilar</p>
                        <p className="text-gray-700">
                          O Booster Repair foi desenvolvido para revolucionar o jeito de cuidar do seu cabelo. Ele não é um simples "reparador de pontas" ou "óleo de cabelo".
                          É a fórmula exclusiva que faltava para uma restauração completa dos fios, hidratação da raiz até as pontas trazendo brilho e maciez ao cabelo, além de deixar o cabelo perfumado.
                          Além de todos os ativos e benefícios incríveis, ele tem uma finalização indescritível e um cheiro fora do normal, o verdadeiro perfume para o cabelo.
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-black mb-2">Leave-in Capilar Multifuncional</p>
                        <p className="text-gray-700">
                          Experimente a sensação de cabelo perfeito a cada splash com o Leave-in Capilar Multifuncional do mundo rosa! O tratamento vai redefinir os seus cuidados capilares, oferecendo praticidade incomparável e um resultado final perfeito!
                          O Leave-in é essencial para manter o cabelo saudável e forte. Seu tratamento instantâneo sem enxágue, tem a combinação de ativos especialmente selecionados, que aumentam a resistência, fortalecem os fios, reparam danos causados pelo calor, sela as pontas duplas e proporciona mais brilho, maciez e hidratação.
                          Versátil, o Leave-in permite aplicação tanto no cabelo seco para dar um efeito finalizador, quanto com o cabelo úmido, oferecendo uma camada de proteção térmica. O seu cabelo ficará lindo e leve, do jeito que você mais adora!
                          Para um tratamento completo no cabelo, use você a linha hair wepink.
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-black mb-2">Proteína Condicionante My Hair Ultra Repair</p>
                        <p className="text-gray-700">
                          A Proteína Capilar Wepink My Hair Ultra Repair é a sua maior aliada para conquistar fios sedosos e incríveis, agregando hidratação profunda, elasticidade, maciez e brilho com seus potentes ativos de D-Pantenol, lanolina e um mix natural dos óleos vegetais, argan e chá verde. Sua composição repara da raiz às pontas em um cuidado capilar essencial, por meio do melhor blend da proteína hidrolisada do trigo, arroz e a lanolina, restaurando a fibra danificada, reduzindo o frizz e promovendo ação antioxidante e nutritiva, além de melhorar a resistência capilar e proporcionar um crescimento saudável aos fios. Tudo isso, combinado em uma fragrância potente para o dia a dia, mantendo seu cabelo macio e perfumado durante o dia todo.
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-black mb-2">Máscara My Hair Ultra Repair</p>
                        <p className="text-gray-700">
                          A Máscara Capilar Wepink My Hair Ultra Repair foi feita para devolver vida, força e beleza aos cabelos. Com um mix poderoso de óleos vegetais, hiperproteína, lanolina e ácido poliglutâmico, ela hidrata profundamente, nutre e repara os fios da raiz às pontas.
                          Sua fórmula cria uma película protetora que mantém a hidratação, reduz o frizz, recupera pontas duplas e fortalece o bulbo capilar, ajudando no crescimento saudável. O extrato de linhaça e de sálvia potencializa o volume e a resistência, enquanto o D-Pantenol, extrato de groselha indiana e a aloe vera deixam os fios mais elásticos, macios e brilhantes.
                          Resultado: cabelo saudável, encorpado e com aquele toque sedoso que você sente e vê.
                        </p>
                      </div>
                    </div>
                  ) : isKit5 ? (
                    <div className="mb-8 space-y-6">
                      <div>
                        <p className="font-semibold text-black mb-2">1- Body Splash Obsessed Desodorante Colônia 200ml - Wepink</p>
                        <p className="text-gray-700">
                          A essência sensual que transborda elegância e representa a mulher festiva, sexy e desejada. O <strong>Body Splash Obsessed Desodorante Colônia</strong> tem uma fragrância que oferece uma sensação de bem-estar, em um caminho floral amadeirado, com um toque de cereja entrelaçado em notas cítricas, seguindo para a nobreza da gardênia, que ganha espaço junto a doçura das notas de mel e caramelo para um deleite despretensioso aos sentidos.
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-black mb-2">2- Body Splash Liberté Desodorante Colônia 200ml - Wepink</p>
                        <p className="text-gray-700">
                          O Desodorante Colônia Body Splash Liberté é um produto com a essência única que transborda liberdade, elegância e bem-estar! Sua fragrância tem nuances encantadoras e misteriosas facetas, com toques de pimenta rosa, toranja e flores nobres, com grande destaque para a reconhecida rainha da perfumaria, a Rosa Francesa Centifolia.
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-black mb-2">3- Body Splash Red Desodorante Colônia 200ml - Wepink</p>
                        <p className="text-gray-700">
                          O despertar de uma nova paixão com o Body Splash Red Desodorante Colônia, uma fragrância marcante e sedutora, que representa a pessoa que se destaca e atrai olhares por onde passa. Com o caminho olfativo floral oriental, suas notas contêm um mix de flores em um fundo doce e amadeirado, tudo isso, para proporcionar uma sensação de bem-estar única para você.
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-black mb-2">4- Body Splash VF Desodorante Colônia 200ml - Wepink</p>
                        <p className="text-gray-700">
                          A essência que possui um encanto místico, efervescente e sensual, o Body Splash VF Choices Desodorante Colônia é um convite perfeito para a liberdade de ser quem é, dando um toque de mistério, aventura e bem-estar. Feito para inspirar a mulher mística que há dentro de você!
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-black mb-2">5- Body Splash Infinity Desodorante Colônia 200ml - Wepink</p>
                        <p className="text-gray-700">
                          O Body Splash Infinity Desodorante Colônia tem a essência de uma mulher que corre atrás dos seus sonhos, em notas olfativas de flores de amora, laranja doce, limão, jasmim, frésia, lírio do vale, âmbar, musgo, cedro, patchouli e baunilha, com um caminho olfativo de Floral Amadeirado Ambarado. O empoderamento acompanhará em qualquer parte do dia, com doçura e disposição.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mb-8">
                      A essência sensual que transborda elegância e representa a mulher festiva, sexy e desejada. O <strong>Body Splash Obsessed Desodorante Colônia</strong> tem uma fragrância que oferece uma sensação de bem-estar, em um caminho floral amadeirado, com um toque de cereja entrelaçado em notas cítricas, seguindo para a nobreza da gardênia, que ganha espaço junto a doçura das notas de mel e caramelo para um deleite despretensioso aos sentidos.
                    </p>
                  )}

                  {/* Reviews Section */}
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-black mb-6 text-center">
                      Veja o que estão falando sobre esse produto
                    </h3>

                    {/* Review Card 1 */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">CF</span>
                          </div>
                          <div>
                            <p className="font-bold text-black">Camila Ferreira</p>
                            <span className="inline-block bg-green-100 text-black text-xs px-2 py-1 rounded-full mt-1">
                              Compra Verificada
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">11/12/2025</span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5"
                            fill="#FFD700"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>

                      {/* Review Title */}
                      <h4 className="font-bold text-black mb-2">
                        É um cheiro elegante
                      </h4>

                      {/* Review Text */}
                      <p className="text-sm text-black mb-3">
                        Amei muito! Muito cheiroso e confortável, amo usar no dia a dia! E amo todos os Body splash da marca obsessed.
                      </p>

                      {/* Recommendation */}
                      <div className="flex items-center gap-2 text-green-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        <span className="text-sm font-medium">Recomendo este produto</span>
                      </div>
                    </div>

                    {/* Review Card 2 */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">MS</span>
                          </div>
                          <div>
                            <p className="font-bold text-black">Maria Silva</p>
                            <span className="inline-block bg-green-100 text-black text-xs px-2 py-1 rounded-full mt-1">
                              Compra Verificada
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">08/12/2025</span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5"
                            fill="#FFD700"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>

                      {/* Review Title */}
                      <h4 className="font-bold text-black mb-2">
                        Perfume incrível!
                      </h4>

                      {/* Review Text */}
                      <p className="text-sm text-black mb-3">
                        Comprei para presentear e acabei comprando outro para mim! O cheiro é delicioso, dura bastante e deixa a pele macia. Super recomendo!
                      </p>

                      {/* Recommendation */}
                      <div className="flex items-center gap-2 text-green-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        <span className="text-sm font-medium">Recomendo este produto</span>
                      </div>
                    </div>

                    {/* Review Card 3 */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">AS</span>
                          </div>
                          <div>
                            <p className="font-bold text-black">Ana Santos</p>
                            <span className="inline-block bg-green-100 text-black text-xs px-2 py-1 rounded-full mt-1">
                              Compra Verificada
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">05/12/2025</span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(4)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5"
                            fill="#FFD700"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                        <svg className="w-5 h-5" fill="none" stroke="#FFD700" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>

                      {/* Review Title */}
                      <h4 className="font-bold text-black mb-2">
                        Muito bom, mas poderia durar mais
                      </h4>

                      {/* Review Text */}
                      <p className="text-sm text-black mb-3">
                        Gostei muito do produto, o cheiro é perfeito e elegante. A única coisa é que gostaria que durasse mais tempo na pele, mas no geral estou satisfeita.
                      </p>

                      {/* Recommendation */}
                      <div className="flex items-center gap-2 text-green-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        <span className="text-sm font-medium">Recomendo este produto</span>
                      </div>
                    </div>

                    {/* Review Card 4 */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">JR</span>
                          </div>
                          <div>
                            <p className="font-bold text-black">Juliana Rodrigues</p>
                            <span className="inline-block bg-green-100 text-black text-xs px-2 py-1 rounded-full mt-1">
                              Compra Verificada
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">02/12/2025</span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5"
                            fill="#FFD700"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>

                      {/* Review Title */}
                      <h4 className="font-bold text-black mb-2">
                        Excelente custo-benefício
                      </h4>

                      {/* Review Text */}
                      <p className="text-sm text-black mb-3">
                        Produto de qualidade, cheiro sofisticado e preço justo. Comprei na promoção e valeu muito a pena. Já estou pensando em comprar mais!
                      </p>

                      {/* Recommendation */}
                      <div className="flex items-center gap-2 text-green-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        <span className="text-sm font-medium">Recomendo este produto</span>
                      </div>
                    </div>

                    {/* Review Card 5 */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">LC</span>
                          </div>
                          <div>
                            <p className="font-bold text-black">Laura Costa</p>
                            <span className="inline-block bg-green-100 text-black text-xs px-2 py-1 rounded-full mt-1">
                              Compra Verificada
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">28/11/2025</span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5"
                            fill="#FFD700"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>

                      {/* Review Title */}
                      <h4 className="font-bold text-black mb-2">
                        Perfeito para o dia a dia
                      </h4>

                      {/* Review Text */}
                      <p className="text-sm text-black mb-3">
                        Uso todos os dias e adoro! O cheiro é suave mas marcante, não incomoda e deixa um rastro delicioso. Minha fragrância favorita da marca.
                      </p>

                      {/* Recommendation */}
                      <div className="flex items-center gap-2 text-green-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        <span className="text-sm font-medium">Recomendo este produto</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {activeTab === 'notas' && (
                <>
                  {isLiberteExclusif ? (
                    <p>
                      Ascenda a uma verdadeira sensação de liberdade com o Desodorante Colônia Body Splash Wepink Liberté Exclusif, um aroma floral que transborda nobreza e doçura. Envolva-se pelo frescor da Pera, Lichia e pela delicadeza das flores, finalizando na elegância de um fundo doce e amadeirado. Suas nuances de Âmbar e Baunilha pairam no ambiente e revelam leveza e sofisticação, vivendo a essência de um elixir floral.
                    </p>
                  ) : isBoosterRepair ? (
                    <p>Conteúdo de Ativos em breve...</p>
                  ) : isKitHair ? (
                    <p>Conteúdo de Ativos em breve...</p>
                  ) : (
                    <p>Conteúdo de Notas em breve...</p>
                  )}
                </>
              )}
              {activeTab === 'modo' && (
                <>
                  {isLiberteExclusif ? (
                    <p>
                      Ascenda a uma verdadeira sensação de liberdade com o Desodorante Colônia Body Splash Wepink Liberté Exclusif, um aroma floral que transborda nobreza e doçura. Envolva-se pelo frescor da Pera, Lichia e pela delicadeza das flores, finalizando na elegância de um fundo doce e amadeirado. Suas nuances de Âmbar e Baunilha pairam no ambiente e revelam leveza e sofisticação, vivendo a essência de um elixir floral.
                    </p>
                  ) : isBoosterRepair ? (
                    <p>Conteúdo de Como usar em breve...</p>
                  ) : isKitHair ? (
                    <div className="space-y-6">
                      <div>
                        <p className="font-semibold text-black mb-2">Shampoo My Hair Ultra Repair</p>
                        <p className="text-gray-700">
                          Aplique uma quantidade adequada nos cabelos molhados, massageie suavemente da raiz às pontas até formar espuma. Enxágue abundantemente. Para melhores resultados, use em conjunto com o Condicionador My Hair Ultra Repair.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-black mb-2">Condicionador My Hair Ultra Repair</p>
                        <p className="text-gray-700">
                          Após o shampoo, aplique o condicionador principalmente nas pontas e mechas. Deixe agir por 2 a 3 minutos e enxágue bem. Para cabelos muito danificados, deixe agir por mais tempo.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-black mb-2">Booster Repair Óleo Capilar</p>
                        <p className="text-gray-700">
                          Aplique uma pequena quantidade nas pontas e mechas dos cabelos secos ou úmidos. Massageie suavemente. Pode ser usado como pré-shampoo ou leave-in para hidratação intensa.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-black mb-2">Leave-in Capilar Multifuncional</p>
                        <p className="text-gray-700">
                          Após lavar e secar os cabelos com toalha, aplique o Leave-in uniformemente nos fios úmidos ou secos. Não é necessário enxaguar. Pode ser usado diariamente para proteção e finalização.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-black mb-2">Proteína Condicionante My Hair Ultra Repair</p>
                        <p className="text-gray-700">
                          Use uma vez por semana ou conforme necessidade. Aplique nos cabelos limpos e úmidos, da raiz às pontas. Deixe agir por 10 a 15 minutos e enxágue bem.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-black mb-2">Máscara My Hair Ultra Repair</p>
                        <p className="text-gray-700">
                          Use uma vez por semana após o shampoo. Aplique generosamente nos cabelos úmidos, principalmente nas pontas. Deixe agir por 5 a 10 minutos (ou mais para cabelos muito danificados) e enxágue bem.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p>Conteúdo de Modo de usar em breve...</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
