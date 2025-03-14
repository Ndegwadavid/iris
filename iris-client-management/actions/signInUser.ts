'use server';

import { cookies } from 'next/headers';

/**
 * Authenticates a user and sets secure cookies for access and refresh tokens.
 *
 */

export async function signInUser(formData: FormData) {
  const cookieStore = await cookies();

  const rawCredentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const resp = await fetch(
    "http://127.0.0.1:8000/api/v001/auth/jwt/create/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rawCredentials),
    }
  );

  if (!resp.ok) {
    return {
      message: 'Email or password invalid!',
      status: resp.status,
    };
  }

  const tokens = await resp.json();

  cookieStore.set('access', tokens.access, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });

  cookieStore.set('refresh', tokens.refresh, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });

  return {
    message: 'Successfully signed in!',
    token: tokens,
    status: resp.status,
  };
}
