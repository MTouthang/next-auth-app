import { NextResponse, NextRequest } from "next/server";

// This function can be marked async if using await

export function middleware (request: NextRequest) {
    const path = request.nextUrl.pathname

    const isPublicPath = path === "/login" || path === "/signup" || path === "/verifyemail"

    const token = request.cookies.get("token")?.value || ""

    // incase user is login or has token
    if(isPublicPath && token){
      return NextResponse.redirect(new URL("/", request.nextUrl))
    }

    // user has no token 
    if(!isPublicPath && !token) {
      return NextResponse.redirect(new URL("/login", request.nextUrl))
    }


}


// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/profile",
    "/login",
    "/signup",
    "/verifyemail"
  ]
}