import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de rotas públicas que não requerem autenticação
const publicRoutes = ['/', '/login', '/register', '/register/confirmation', '/landing'];

// Função auxiliar para verificar se uma rota é pública
const isPublicRoute = (pathname: string) => {
  return publicRoutes.includes(pathname) || pathname.startsWith('/activate/');
};

// Função auxiliar para verificar se uma rota é a página de cadastro do usuário
const isUserRegistrationRoute = (pathname: string) => {
  return pathname === '/cadastro';
};

// Função para verificar se o usuário está registrado de forma mais robusta
const isUserRegistered = (request: NextRequest) => {
  // Verifica o cookie is_user_registered
  const isRegisteredCookie = request.cookies.get('is_user_registered')?.value === 'true';
  
  // Se o cookie estiver definido como true, o usuário está registrado
  if (isRegisteredCookie) {
    return true;
  }
  
  // Se o cookie não estiver definido, verifica se o usuário está autenticado
  // Se estiver autenticado, assume que precisa completar o registro
  const token = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  
  return false;
};

// Função de middleware que é executada em cada requisição
export async function middleware(request: NextRequest) {
  // Extrai informações relevantes da requisição
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const userRegistered = isUserRegistered(request);

  // Caso 1: Usuário não autenticado tentando acessar a página de cadastro
  // Redireciona para o login com URL de retorno
  if (isUserRegistrationRoute(pathname) && !token && !refreshToken) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Caso 2: Usuário autenticado e registrado tentando acessar a página de cadastro
  // Redireciona para o dashboard, pois não precisa se cadastrar
  if (isUserRegistrationRoute(pathname) && (token || refreshToken) && userRegistered) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Caso 3: Usuário autenticado mas não registrado tentando acessar qualquer página exceto cadastro
  // Força-o a completar o registro primeiro
  if ((token || refreshToken) && !userRegistered && !isUserRegistrationRoute(pathname)) {
    return NextResponse.redirect(new URL('/cadastro', request.url));
  }

  // Caso 4: Usuário autenticado e registrado tentando acessar rotas públicas
  // Redireciona para o dashboard, pois já está logado
  if (isPublicRoute(pathname) && (token || refreshToken) && userRegistered) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Caso 5: Usuário não autenticado tentando acessar rotas protegidas
  // Redireciona para o login com URL de retorno
  if (!isPublicRoute(pathname) && !token && !refreshToken) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Se nenhuma das condições acima se aplicar, permite que a requisição prossiga
  return NextResponse.next();
}

// Configuração para o middleware
export const config = {
  matcher: [
    /*
     * Corresponder a todos os caminhos de requisição, exceto aqueles que começam com:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de otimização de imagem)
     * - favicon.ico (arquivo de favicon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 