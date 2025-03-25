import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
// middleware for server from supabase.com
export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // refreshing the auth token
  const { data, error } = await supabase.auth.getUser();
  const isAuthenticated = !!data.user && !error;

  const { pathname } = request.nextUrl;

  // custom url

  // prevent unauthenticated access to protected routes
  if (pathname === '/home' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // if an authenticated user is trying to access login or register, redirect them to "/"
  if (
    isAuthenticated &&
    (pathname === '/login' || pathname === '/register' || pathname === '/home')
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // for authenticated users, when accessing "/" rewrite the request to serve the dashboard content
  if (pathname === '/' && isAuthenticated) {
    // The rewrite will serve the content from "/home" but the browser will still show "/"
    return NextResponse.rewrite(new URL('/home', request.url));
  }

  // other rewrites in mind:
  // {
  //   source: '/w/:workspaceId',
  //   destination: '/workspaces/:workspaceId',
  // }

  return supabaseResponse;
}
