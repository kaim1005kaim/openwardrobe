import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Optional: Add additional middleware logic here
    console.log("Auth middleware:", req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages without token
        if (req.nextUrl.pathname.startsWith("/auth/")) {
          return true;
        }
        
        // For admin routes, require admin role
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }
        
        // For API routes that require auth, check for token
        if (req.nextUrl.pathname.startsWith("/api/auth/")) {
          return true; // NextAuth API routes are always allowed
        }
        
        if (req.nextUrl.pathname.startsWith("/api/protected/")) {
          return !!token;
        }
        
        // All other routes are public for now
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/protected/:path*",
    "/auth/:path*"
  ],
};