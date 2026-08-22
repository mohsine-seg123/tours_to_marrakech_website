import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/((?!api|admin|_next|_vercel|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml|llms.txt|.*\\..*).*)",
  ],
};
