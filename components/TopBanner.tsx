export default function TopBanner() {
  return (
    <div className="bg-pink-600 text-white py-2.5 px-4 text-center text-xs font-medium sticky top-0 z-[60]">
      <p>
        Fique ligado! A inclusão do produto na cesta não garante sua compra.{' '}
        <a href="#" className="font-bold underline">
          Finalize o carrinho!
        </a>
      </p>
    </div>
  );
}

