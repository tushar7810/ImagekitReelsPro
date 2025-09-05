import {withAuth} from "next-auth/middleware"
import { NextResponse } from "next/server";

export default withAuth(
    function middleware() {
        return NextResponse.next();
    },
    {
        callbacks: {
            async authorized({ req, token }) {
                const {pathname} = req.nextUrl
                if(pathname.startsWith("/api/auth") || pathname === "/login" || pathname === "/register"){
                    return true
                }

                if(pathname === "/" || pathname.startsWith("/api/posts")) {
                    return true
                }
                return !!token
            }
        }
    }
);

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)"
    ]
};
