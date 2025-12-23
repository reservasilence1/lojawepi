'use client';

import { useState } from 'react';
import Logo from './Logo';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-pink-600 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Logo and Links */}
        <div className="mb-6">
          <div className="mb-6 flex justify-start">
            <Logo color="#FFFFFF" />
          </div>
          
          <nav>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-white hover:opacity-80">
                  sobre nós →
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white hover:opacity-80">
                  central de ajuda →
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white hover:opacity-80">
                  solicitação de troca →
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white hover:opacity-80">
                  solicitação de devolução →
                </a>
              </li>
              <li>
                <button className="text-sm text-white hover:opacity-80 text-left">
                  canais de atendimento →
                </button>
              </li>
              <li>
                <a href="#" className="text-sm text-white hover:opacity-80">
                  regulamentos →
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white hover:opacity-80">
                  trabalhe conosco →
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white hover:opacity-80">
                  cadê meu pedido →
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white hover:opacity-80">
                  franquias →
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white hover:opacity-80">
                  nossas lojas →
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white hover:opacity-80">
                  TAC →
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Social Media */}
        <div className="mb-14">
          <div className="flex items-center justify-center gap-3">
            <a
              href="https://www.instagram.com/wepink.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-full p-3 hover:opacity-80 transition-opacity"
              aria-label="Instagram"
            >
              <svg className="w-7 h-7" fill="#FF0080" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://www.facebook.com/wepink.br"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-full p-3 hover:opacity-80 transition-opacity"
              aria-label="Facebook"
            >
              <svg className="w-7 h-7" fill="#FF0080" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@wepink_br"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-full p-3 hover:opacity-80 transition-opacity"
              aria-label="YouTube"
            >
              <svg className="w-7 h-7" fill="#FF0080" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6 text-center">
          <h3 className="text-base font-bold text-white mb-3">Formas de pagamento</h3>
          <div className="flex justify-center items-center">
            <svg width="16" height="31" viewBox="0 0 16 31" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-auto">
              <path d="M10.687 11.7625L8.30746 9.382C8.2205 9.295 8.11773 9.27918 8.06239 9.27918C8.00705 9.27918 7.90428 9.295 7.81732 9.382L5.42983 11.7704C5.16104 12.0393 4.74204 12.4743 3.34275 12.4743L6.27572 15.4005C6.72042 15.8448 7.32321 16.0943 7.95171 16.0943C8.58021 16.0943 9.18301 15.8448 9.6277 15.4005L12.5686 12.4664C11.8492 12.4664 11.2483 12.324 10.687 11.7625ZM5.42983 4.60518L7.81732 6.99359C7.88056 7.05686 7.97543 7.0964 8.06239 7.0964C8.14935 7.0964 8.24422 7.05686 8.30746 6.99359L10.6712 4.62891C11.2325 4.04367 11.8729 3.90922 12.5923 3.90922L9.65142 0.975122C9.20673 0.530814 8.60393 0.28125 7.97543 0.28125C7.34693 0.28125 6.74413 0.530814 6.29944 0.975122L3.36646 3.90131C4.75785 3.90131 5.18475 4.36001 5.42983 4.60518Z" fill="white"/>
              <path d="M15.1616 6.48746L13.3828 4.70011H12.3867C11.9598 4.70011 11.5329 4.8741 11.2404 5.18253L8.86875 7.55512C8.64739 7.77657 8.35488 7.88729 8.06238 7.88729C7.76117 7.88304 7.47287 7.76429 7.256 7.55512L4.86851 5.15881C4.5681 4.85828 4.15701 4.68429 3.7222 4.68429H2.56008L0.749697 6.50328C0.305559 6.94814 0.0560913 7.55117 0.0560913 8.1799C0.0560913 8.80864 0.305559 9.41167 0.749697 9.85653L2.56008 11.6755H3.73011C4.15701 11.6755 4.5681 11.5015 4.87642 11.201L7.26391 8.8126C7.48527 8.59115 7.77777 8.48043 8.07028 8.48043C8.36279 8.48043 8.6553 8.59115 8.87665 8.8126L11.2562 11.1931C11.5567 11.4936 11.9677 11.6676 12.4026 11.6676H13.3987L15.1774 9.88026C15.6234 9.42739 15.8721 8.81633 15.8692 8.1806C15.8662 7.54486 15.6118 6.93615 15.1616 6.48746Z" fill="white"/>
              <path d="M4.52627 21.2728H2.1095V27.7299H2.7921V25.6913H4.52627C6.1682 25.6913 7.16442 24.8611 7.16442 23.4867C7.16442 22.103 6.1682 21.2728 4.52627 21.2728ZM4.50782 25.0917H2.7921V21.8632H4.50782C5.79922 21.8632 6.48182 22.4536 6.48182 23.4867C6.48182 24.5014 5.79922 25.0917 4.50782 25.0917ZM8.70798 21.8171C8.98471 21.8171 9.18764 21.6049 9.18764 21.3374C9.18764 21.0884 8.97548 20.8854 8.70798 20.8854C8.44047 20.8854 8.22831 21.0976 8.22831 21.3466C8.22831 21.6049 8.44047 21.8171 8.70798 21.8171ZM8.3759 27.7299H9.03083V22.8779H8.3759V27.7299ZM14.6904 27.7299L12.7533 25.2393L14.5797 22.8779H13.8603L12.4028 24.7781L10.9454 22.8779H10.2074L12.0338 25.2393L10.1152 27.7299H10.8531L12.4028 25.7005L13.9433 27.7299H14.6904Z" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="text-center">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs text-white hover:opacity-80 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Voltar ao topo
          </button>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-pink-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Privacy and Terms */}
          <nav className="mb-4 text-center">
            <ul className="flex flex-wrap items-center justify-center gap-2 text-xs text-white">
              <li>
                <a href="#" className="hover:opacity-80">
                  Política de Privacidade
                </a>
              </li>
              <li className="text-white opacity-50">|</li>
              <li>
                <a href="#" className="hover:opacity-80">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </nav>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-xs text-white font-medium">
              Todos os direitos reservados © 2025 | SAVI COSMÉTICOS LTDA | CNPJ: 42.422.967/0001-01
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

