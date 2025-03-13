import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const verifyUrl = "http://127.0.0.1:8000/api/v001/auth/token/verify/"
  
  const response = await fetch(verifyUrl, {
    method: "POST",
    credentials: "include",
    headers: {
      "Cache-Control": "no-store", // Prevent caching of this request
    },
  })

  if (!response.ok && request.nextUrl.pathname !== "/") {
    const redirectResponse = NextResponse.redirect(new URL("/", request.url))
    redirectResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    redirectResponse.headers.set("Pragma", "no-cache")
    redirectResponse.headers.set("Expires", "0")
    return redirectResponse
  }

  const nextResponse = NextResponse.next()
  nextResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
  nextResponse.headers.set("Pragma", "no-cache")
  nextResponse.headers.set("Expires", "0")
  return nextResponse
}

export const config = {
  matcher: ["/reception/:path*", "/examination/:path*", "/sales/:path*", "/clients/:path*", "/existing-clients/:path*", "/admin/:path*", "/settings/:path*"],
}