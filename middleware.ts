import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // const token = request.cookies.get("token");
    // const pathname = request.nextUrl.pathname;

    // if (!token && pathname !== "/login") {
    //     return NextResponse.redirect(new URL("/login", request.url));
    // }

    // if (token && pathname === "/login") {
    //     return NextResponse.redirect(new URL("/", request.url));
    // }

    // return NextResponse.next();
}

export const config = {
    // matcher: [
    //     "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    // ],
};
