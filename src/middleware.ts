import { User, UserStatus } from 'entities'
import { checkRoles } from 'hooks'
import jwtDecode from 'jwt-decode'
import { NextRequest, NextResponse } from 'next/server'

// Limit the middleware to paths starting with `/api/`

const PAGES_WITH_NO_GUARD = ['/login', '/register']

const checkPath = (
  user: User | undefined,
  pathname: string,
  isUser: boolean,
  isAdmin: boolean,
  isSuper: boolean
) => {
  if (pathname === '/') return null

  if (
    !pathname.startsWith('/user') &&
    user?.status === UserStatus.ACTIVE &&
    isUser
  ) {
    return '/user'
  }

  if (
    !pathname.startsWith('/user/waiting') &&
    user?.status === UserStatus.VERIFIED &&
    isUser
  ) {
    return '/user/waiting'
  }

  if (
    (pathname === '/admin' || !pathname.startsWith('/admin')) &&
    user?.status === UserStatus.ACTIVE &&
    (isAdmin || isSuper)
  ) {
    return '/admin/dashboard'
  }

  if (!user && !PAGES_WITH_NO_GUARD.some((v) => pathname.startsWith(v))) {
    return '/'
  }

  return null
}

export function middleware(request: NextRequest) {
  // Call our authentication function to check the request
  const token = request.cookies.get('accessToken')
  const user: User | undefined = !!token?.value
    ? jwtDecode(token?.value) || undefined
    : undefined
  const { isAdmin, isUser, isSuper } = checkRoles(user?.roles)
  const redirectString = checkPath(
    user,
    request.nextUrl.pathname,
    isUser,
    isAdmin,
    isSuper
  )

  if (redirectString !== null)
    return NextResponse.redirect(new URL(redirectString, request.url))
}

export const config = {
  matcher: [
    '/user',
    '/',
    '/admin',
    '/admin/dashboard',
    '/admin/calendar',
    '/admin/admins',
    '/admin/scholars',
    '/register',
    '/login',
    '/user/waiting',
  ],
}
