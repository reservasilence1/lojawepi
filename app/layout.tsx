import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const getBasePath = () => {
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
};

export const metadata: Metadata = {
  title: 'WePink - Body Splash Top5',
  description: 'Garanta agora o seu kit we favorito!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const basePath = getBasePath();
  const scriptPath = basePath ? `${basePath}/9f8a7b1c.js` : '/9f8a7b1c.js';
  
  return (
        <html lang="pt-BR" suppressHydrationWarning>
          <body suppressHydrationWarning>
            {/* PIXEL2 */}
            <Script id="pixel2" strategy="afterInteractive">
              {`
            
              window.pixelId = "6948d9621127add55d211c18";
              var a = document.createElement("script");
              a.setAttribute("async", "");
              a.setAttribute("defer", "");
              a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
              document.head.appendChild(a);

              `}
            </Script>
            
            {/* UTM Script */}
            <Script
              src="https://cdn.utmify.com.br/scripts/utms/latest.js"
              data-utmify-prevent-xcod-sck
              data-utmify-prevent-subids
              strategy="afterInteractive"
            />
            
            {children}
            <script src={scriptPath} defer></script>
          </body>
        </html>
  )
}

