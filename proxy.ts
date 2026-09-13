import nextAuthMiddleware from "next-auth/middleware";

export default nextAuthMiddleware;

export const config = {
  matcher: [
    "/((?!login|api|_next/static|_next/image|favicon.ico|spark-logo|login-page).*)",
  ],
};
