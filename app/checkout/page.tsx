'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import TopBanner from '@/components/TopBanner';
import { useCart, CartItem } from '@/contexts/CartContext';
import { CartProvider } from '@/contexts/CartContext';
import { getAssetPath } from '@/lib/paths';

interface AddressData {
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

function CheckoutContent() {
  const { cartItems, totalPrice } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [localCartItems, setLocalCartItems] = useState<CartItem[]>([]);
  
  // Carregar diretamente do localStorage como fallback
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('wepink_cart');
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          setLocalCartItems(parsed);
        } catch (error) {
          console.error('Erro ao carregar carrinho do localStorage:', error);
        }
      }
      // Aguardar um pouco para o contexto carregar
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, []);
  
  // Usar itens do contexto ou do localStorage como fallback
  const displayCartItems = cartItems.length > 0 ? cartItems : localCartItems;
  const displayTotalPrice = cartItems.length > 0 ? totalPrice : localCartItems.reduce(
    (sum, item) => sum + (item.currentPrice || 0) * (item.quantity || 0),
    0
  );

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    telefone: '',
  });

  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');
  const lastSearchedCep = useRef<string>('');
  
  // Estados para pagamento
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [pixCode, setPixCode] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatCEP = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
  };

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 10) {
      return digits.length <= 2 ? digits : `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const fetchAddressByCEP = useCallback(async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      setCepError('CEP deve conter 8 dígitos');
      setLoadingCep(false);
      return;
    }

    // Evitar buscar o mesmo CEP novamente
    if (lastSearchedCep.current === cleanCep) {
      return;
    }

    setLoadingCep(true);
    setCepError('');
    lastSearchedCep.current = cleanCep;

    try {
      // Usar BrasilAPI que tem CORS habilitado
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setCepError('CEP não encontrado. Verifique o CEP digitado.');
          setLoadingCep(false);
          lastSearchedCep.current = ''; // Resetar para permitir nova busca
          return;
        }
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Verificar se temos dados válidos
      if (!data || !data.city) {
        setCepError('CEP não encontrado. Verifique o CEP digitado.');
        setLoadingCep(false);
        lastSearchedCep.current = ''; // Resetar para permitir nova busca
        return;
      }

      // Preencher o formulário com os dados retornados (BrasilAPI usa nomes diferentes)
      setFormData((prev) => ({
        ...prev,
        logradouro: data.street || '',
        complemento: '',
        bairro: data.neighborhood || data.district || '',
        cidade: data.city || '',
        estado: data.state || '',
      }));
      
      setCepError(''); // Limpar erro se tudo der certo
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setCepError('Erro ao buscar CEP. Por favor, preencha os campos manualmente.');
      lastSearchedCep.current = ''; // Resetar para permitir nova busca
    } finally {
      setLoadingCep(false);
    }
  }, []);

  // Effect para buscar CEP quando tiver 8 dígitos
  useEffect(() => {
    const cleanCep = formData.cep.replace(/\D/g, '');
    
    // Só buscar se tiver 8 dígitos, não estiver carregando, e for um CEP diferente do último buscado
    if (cleanCep.length === 8 && !loadingCep && lastSearchedCep.current !== cleanCep) {
      const timeoutId = setTimeout(() => {
        fetchAddressByCEP(formData.cep);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
    
    // Resetar referência se o CEP for alterado para menos de 8 dígitos
    if (cleanCep.length < 8) {
      lastSearchedCep.current = '';
    }
  }, [formData.cep, loadingCep, fetchAddressByCEP]);

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    setFormData((prev) => ({ ...prev, cep: formatted }));
    
    const cleanCep = formatted.replace(/\D/g, '');
    if (cleanCep.length < 8) {
      setCepError('');
      setLoadingCep(false);
    }
  };

  const calculateTotal = () => {
    return displayTotalPrice;
  };

  const generateRandomPhone = () => {
    // Gera um telefone aleatório apenas com números se não foi informado
    const areaCode = Math.floor(Math.random() * 90) + 10; // 10-99
    const firstPart = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    const secondPart = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    return `${areaCode}${firstPart}${secondPart}`;
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      setApiError('Por favor, preencha o nome completo.');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setApiError('Por favor, preencha um e-mail válido.');
      return false;
    }
    if (!formData.cpf.trim() || formData.cpf.replace(/\D/g, '').length !== 11) {
      setApiError('Por favor, preencha um CPF válido.');
      return false;
    }
    if (!formData.cep.trim() || formData.cep.replace(/\D/g, '').length !== 8) {
      setApiError('Por favor, preencha um CEP válido.');
      return false;
    }
    if (!formData.logradouro.trim()) {
      setApiError('Por favor, preencha o logradouro.');
      return false;
    }
    if (!formData.numero.trim()) {
      setApiError('Por favor, preencha o número do endereço.');
      return false;
    }
    if (!formData.bairro.trim()) {
      setApiError('Por favor, preencha o bairro.');
      return false;
    }
    if (!formData.cidade.trim()) {
      setApiError('Por favor, preencha a cidade.');
      return false;
    }
    if (!formData.estado.trim() || formData.estado.length !== 2) {
      setApiError('Por favor, preencha o estado (2 letras).');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    setIsPaymentLoading(true);
    setApiError('');
  
    try {
      // Garantir que todos os campos estejam preenchidos e válidos
      const customerName = (formData.nome || '').trim();
      const customerEmail = (formData.email || '').trim().toLowerCase();
      const customerCPF = (formData.cpf || '').replace(/\D/g, '');
      const customerPhone = formData.telefone 
        ? formData.telefone.replace(/\D/g, '') 
        : generateRandomPhone();
      
      // Validar campos obrigatórios
      if (!customerName) {
        setApiError('Nome é obrigatório');
        setIsPaymentLoading(false);
        return;
      }
      if (!customerEmail || !customerEmail.includes('@')) {
        setApiError('E-mail válido é obrigatório');
        setIsPaymentLoading(false);
        return;
      }
      if (!customerCPF || customerCPF.length !== 11) {
        setApiError('CPF válido é obrigatório');
        setIsPaymentLoading(false);
        return;
      }
      if (!customerPhone || customerPhone.length < 10) {
        setApiError('Telefone válido é obrigatório');
        setIsPaymentLoading(false);
        return;
      }
      
      const totalAmount = calculateTotal();
      if (!totalAmount || totalAmount <= 0) {
        setApiError('Valor do pedido inválido');
        setIsPaymentLoading(false);
        return;
      }
      
      const productTitle = `Produto - ${displayCartItems.length} ${displayCartItems.length === 1 ? 'item' : 'itens'}`;
      
      const vendaData = {
        credentials: {
          token: "sk_live_a48725f1b1d3b452041f6e98141c4a41",
          encryptedKey: "hv2GP7IHDwdcaN2AH0acRzVbvwxa66vhfkjMtwtc5EE98liactLknTqvChnVxPbRvwTR_zIVPoRIIhMeJkbXKA",
          name: "Isack Costa - BuckPay API",
          offer: {
            id: "wepink-brasil",
            name: "Wepink Brasil"
          }
        },
        amount: totalAmount,
        product: {
          title: productTitle
        },
        customer: {
          name: customerName,
          email: customerEmail,
          document: {
            type: "CPF",
            number: customerCPF
          },
          phone: customerPhone
        }
      };
  
      // Log para debug
      console.log('Enviando dados:', JSON.stringify(vendaData, null, 2));
  
      // Chamar a rota /duttyfy
      const response = await fetch('https://tracker-api-tracker.v3bpu1.easypanel.host/duttyfy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendaData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro: ${response.status} - ${errorText}`);
      }
  
      const apiResponse = await response.json();
  
      // Processar resposta
      if (apiResponse.success && apiResponse.pix) {
        setQrCode(apiResponse.pix.qrcode || apiResponse.pix.copiaECola);
        setPixCode(apiResponse.pix.copiaECola || apiResponse.pix.qrcode);
        setTransactionId(apiResponse.id || '');
        setPaymentStatus(apiResponse.status || 'PENDING');
        setIsModalOpen(true);
      } else {
        throw new Error('Resposta inválida da API');
      }
    } catch (error) {
      console.error('Erro:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao processar pagamento';
      setApiError(errorMessage);
      setIsModalOpen(false);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  // Mostrar loading enquanto carrega
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando carrinho...</p>
        </div>
      </div>
    );
  }

  // Verificar se está vazio após carregar
  if (!isLoading && displayCartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Carrinho vazio</h2>
          <p className="text-gray-600 mb-6">Adicione produtos ao carrinho para continuar</p>
          <a
            href={getAssetPath('/body-splash/top5')}
            className="inline-block bg-pink-600 text-white px-6 py-3 rounded font-semibold hover:bg-pink-700 transition-colors"
          >
            Voltar para produtos
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <TopBanner />
      <HeaderWrapper />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Pessoais */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Dados Pessoais</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                        CPF *
                      </label>
                      <input
                        type="text"
                        id="cpf"
                        required
                        maxLength={14}
                        value={formData.cpf}
                        onChange={(e) => {
                          const formatted = formatCPF(e.target.value);
                          setFormData((prev) => ({ ...prev, cpf: formatted }));
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone *
                      </label>
                      <input
                        type="text"
                        id="telefone"
                        required
                        maxLength={15}
                        value={formData.telefone}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          setFormData((prev) => ({ ...prev, telefone: formatted }));
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Endereço de Entrega</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
                      CEP *
                    </label>
                    <input
                      type="text"
                      id="cep"
                      required
                      maxLength={9}
                      value={formData.cep}
                      onChange={handleCEPChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                        cepError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="00000-000"
                    />
                    {loadingCep && (
                      <p className="mt-1 text-sm text-gray-500">Buscando CEP...</p>
                    )}
                    {cepError && (
                      <p className="mt-1 text-sm text-red-500">{cepError}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700 mb-1">
                      Logradouro *
                    </label>
                    <input
                      type="text"
                      id="logradouro"
                      required
                      value={formData.logradouro}
                      onChange={(e) => setFormData((prev) => ({ ...prev, logradouro: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Rua, Avenida, etc."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
                        Número *
                      </label>
                      <input
                        type="text"
                        id="numero"
                        required
                        value={formData.numero}
                        onChange={(e) => setFormData((prev) => ({ ...prev, numero: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>

                    <div className="col-span-2">
                      <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-1">
                        Complemento
                      </label>
                      <input
                        type="text"
                        id="complemento"
                        value={formData.complemento}
                        onChange={(e) => setFormData((prev) => ({ ...prev, complemento: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Apartamento, Bloco, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      id="bairro"
                      required
                      value={formData.bairro}
                      onChange={(e) => setFormData((prev) => ({ ...prev, bairro: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        id="cidade"
                        required
                        value={formData.cidade}
                        onChange={(e) => setFormData((prev) => ({ ...prev, cidade: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                        Estado *
                      </label>
                      <input
                        type="text"
                        id="estado"
                        required
                        maxLength={2}
                        value={formData.estado}
                        onChange={(e) => setFormData((prev) => ({ ...prev, estado: e.target.value.toUpperCase() }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="SP"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {apiError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{apiError}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={isPaymentLoading}
                className={`w-full bg-pink-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                  isPaymentLoading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-pink-700'
                }`}
              >
                {isPaymentLoading ? 'Processando...' : 'Finalizar Pedido'}
              </button>
            </form>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-4 mb-6">
                {displayCartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-pink-50 to-pink-100 rounded overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xl">🌸</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatPrice(item.currentPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">{formatPrice(displayTotalPrice)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Frete:</span>
                  <span className="font-medium text-gray-900">A calcular</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-pink-600">{formatPrice(displayTotalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Modal do PIX */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pagamento via PIX</h2>
              
              {qrCode && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Escaneie o QR Code ou copie o código PIX abaixo
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4 flex justify-center">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCode)}`}
                      alt="QR Code PIX"
                      className="w-64 h-64"
                    />
                  </div>
                </div>
              )}
              
              {pixCode && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código PIX (Copiar e Colar):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={pixCode}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                      id="pix-code"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(pixCode);
                        alert('Código PIX copiado!');
                      }}
                      className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              )}
              
              {transactionId && (
                <p className="text-xs text-gray-500 mb-4">
                  ID da Transação: {transactionId}
                </p>
              )}
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  Após realizar o pagamento, aguarde a confirmação. O pedido será processado automaticamente.
                </p>
              </div>
              
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <CartProvider>
      <CheckoutContent />
    </CartProvider>
  );
}

