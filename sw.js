self.addEventListener('install', (event) => {
    console.log('[SW] Instalado');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (event) => {
    console.log('[SW] Activado');
  });
  
  self.addEventListener('fetch', (event) => {
    // Puedes manejar caché si deseas
  });
  