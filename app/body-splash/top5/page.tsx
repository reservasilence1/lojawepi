import HeaderWrapper from '@/components/HeaderWrapper';
import TopBanner from '@/components/TopBanner';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductList from '@/components/ProductList';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import { CartProvider } from '@/contexts/CartContext';
import { products } from '@/data/products';

export default function BodySplashTop5() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <TopBanner />
        <HeaderWrapper />
        <Breadcrumbs />
        <main>
          <ProductList products={products} />
        </main>
        <Footer />
        <CartSidebar />
      </div>
    </CartProvider>
  );
}

