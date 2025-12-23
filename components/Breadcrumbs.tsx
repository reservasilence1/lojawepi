export default function Breadcrumbs() {
  return (
    <nav className="px-4 py-3 bg-white border-b border-gray-100">
      <div className="flex items-center text-xs text-gray-600">
        <a href="#" className="hover:text-pink-600 font-bold" style={{ color: '#9D93B3' }}>
          Home
        </a>
        <span className="mx-2 text-gray-400 text-xl">›</span>
        <a href="#" className="hover:text-pink-600 font-bold" style={{ color: '#9D93B3' }}>
          Body Splash
        </a>
        <span className="mx-2 text-gray-400 text-xl">›</span>
        <span className="text-pink-600 font-medium underline decoration-pink-600">top5</span>
      </div>
    </nav>
  );
}

