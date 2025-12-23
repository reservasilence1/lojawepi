import HeaderWrapper from '@/components/HeaderWrapper';
import TopBanner from '@/components/TopBanner';
import Footer from '@/components/Footer';
import ProductDetail from '@/components/ProductDetail';
import { products } from '@/data/products';
import { CartProvider } from '@/contexts/CartContext';
import CartSidebar from '@/components/CartSidebar';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <CartProvider>
        <div className="min-h-screen bg-white">
          <TopBanner />
          <HeaderWrapper />
          <main className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Produto não encontrado</h1>
              <p className="text-gray-600">O produto que você está procurando não existe.</p>
            </div>
          </main>
          <Footer />
          <CartSidebar />
        </div>
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <TopBanner />
        <HeaderWrapper />
        <main>
          <ProductDetail product={product} />
        </main>
        <Footer />
        <CartSidebar />
      </div>
    </CartProvider>
  );
}

