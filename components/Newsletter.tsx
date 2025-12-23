export default function Newsletter() {
  return (
    <section className="bg-gray-50 py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            receba dicas e novidades toda semana no seu e-mail
          </h2>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded text-sm font-semibold hover:bg-pink-700 transition-colors whitespace-nowrap"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

