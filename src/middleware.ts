import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'zh']
const defaultLocale = 'zh'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // 检查当前路径是否已经包含语言前缀
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // 如果路径中没有语言前缀，添加默认语言前缀
  if (pathnameIsMissingLocale) {
    const locale = defaultLocale
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
  }
}

export const config = {
  matcher: [
    // 只匹配不以 _next 开头的路径
    '/((?!_next|api|favicon.ico).*)',
  ],
}
