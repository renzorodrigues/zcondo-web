import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de rotas públicas que não requerem autenticação
const publicRoutes = ['/', '/login', '/register', '/register/confirmation', '/landing'];

// Função para verificar se uma rota é pública
const isPublicRoute = (pathname: string) => {
  return publicRoutes.includes(pathname) || pathname.startsWith('/activate/');
};

// Função para verificar se uma rota é a página de cadastro do usuário
const isUserRegistrationRoute = (pathname: string) => {
  return pathname === '/cadastro';
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const isUserRegistered = request.cookies.get('is_user_registered')?.value === 'true';

  // Se não estiver autenticado e tentar acessar a página de cadastro, redireciona para o login
  if (isUserRegistrationRoute(pathname) && !token && !refreshToken) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Se estiver autenticado e registrado e tentar acessar a página de cadastro, redireciona para o dashboard
  if (isUserRegistrationRoute(pathname) && (token || refreshToken) && isUserRegistered) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Se estiver autenticado mas não registrado, redireciona para a página de cadastro
  // independente da rota que ele tenta acessar (exceto a própria página de cadastro)
  if ((token || refreshToken) && !isUserRegistered && !isUserRegistrationRoute(pathname)) {
    return NextResponse.redirect(new URL('/cadastro', request.url));
  }

  // Se for uma rota pública e o usuário estiver autenticado, redireciona para o dashboard
  // apenas se o usuário estiver registrado
  if (isPublicRoute(pathname) && (token || refreshToken) && isUserRegistered) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Se não for uma rota pública e o usuário não estiver autenticado, redireciona para o login
  if (!isPublicRoute(pathname) && !token && !refreshToken) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

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