export default function Home() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var targetPath = '/body-splash/top5/';
              if (window.location.pathname !== targetPath) {
                window.location.replace(targetPath);
              }
            })();
          `,
        }}
      />
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#ffffff'
      }}>
        <p style={{ color: '#333' }}>Redirecionando...</p>
      </div>
    </>
  );
}

