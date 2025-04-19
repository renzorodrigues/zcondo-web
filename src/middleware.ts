import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de rotas públicas que não requerem autenticação
const publicRoutes = ['/', '/login', '/register', '/register/confirmation', '/landing', '/activate'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/activate/');
  
  // Verifica o refresh token no cookie
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // Se não estiver autenticado e tentar acessar uma rota protegida
  if (!refreshToken && !isPublicRoute) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Se estiver autenticado e tentar acessar uma rota pública (exceto landing e home)
  if (refreshToken && isPublicRoute && pathname !== '/' && pathname !== '/landing') {
    // Realiza o refresh do token antes de redirecionar
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    
    // Adiciona um header personalizado para indicar que o token deve ser atualizado
    response.headers.set('x-refresh-token', 'true');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 