import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que não precisam de autenticação
const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/terms', '/privacy'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verifica se é uma rota pública
  const isPublicRoute = publicRoutes.some(route => pathname === route);
  
  // Verifica se o usuário está autenticado
  // Como o middleware roda no servidor, não podemos acessar localStorage diretamente
  // Vamos usar um cookie para verificar a autenticação
  const isAuthenticated = request.cookies.has('auth-token');

  // Se for uma rota pública e o usuário estiver autenticado, redireciona para o dashboard
  // Exceto se for a rota raiz, que deve ser acessível mesmo autenticado
  if (isPublicRoute && isAuthenticated && pathname !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Se não for uma rota pública e o usuário não estiver autenticado, redireciona para o login
  if (!isPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Configuração de quais rotas o middleware deve ser executado
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 