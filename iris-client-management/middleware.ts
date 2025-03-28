import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: string;
  is_superuser?: boolean; 
}

export const middleware = async (req: NextRequest) => {
  const token = req.cookies.get("access")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const decoded: CustomJwtPayload = jwtDecode<CustomJwtPayload>(token);

    if (!decoded.is_superuser) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/admin/:path*"],
};
