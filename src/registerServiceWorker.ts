export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('✅ Sinhala Puluwanda Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.log('Service Worker registration skipped:', err);
        });
    });
  }
}
