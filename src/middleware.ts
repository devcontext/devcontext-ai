import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { appRoutes } from "@/features/routes";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect app routes
  if (request.nextUrl.pathname.startsWith(appRoutes.home.path)) {
    if (!user) {
      return NextResponse.redirect(
        new URL(appRoutes.auth.login.path, request.url),
      );
    }
  }

  // Redirect to app if already logged in and trying to access auth pages
  if (
    (request.nextUrl.pathname === appRoutes.auth.login.path ||
      request.nextUrl.pathname === appRoutes.auth.signup.path) &&
    user
  ) {
    return NextResponse.redirect(new URL(appRoutes.home.path, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/app/:path*", "/login", "/signup"],
};
