import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/profile(.*)',
  '/orders(.*)',
  '/dashboard(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)'
  ]
}
