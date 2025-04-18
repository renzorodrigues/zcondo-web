'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function RefreshTokenHandler() {
  const pathname = usePathname() || '';

  useEffect(() => {
    // Verifica se estamos em uma rota pública
    const publicRoutes = ['/', '/login', '/register', '/landing'];
    const isPublicRoute = publicRoutes.includes(pathname);
    
    if (isPublicRoute) {
      // Atualiza a meta tag para indicar que o token deve ser atualizado
      let metaTag = document.querySelector('meta[name="x-refresh-token"]');
      
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'x-refresh-token');
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', 'true');
    }
  }, [pathname]);

  // Este componente não renderiza nada
  return null;
} 