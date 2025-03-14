'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const signOut = async () => {
  const cookiesStore = await cookies();
  cookiesStore.delete('access');
  cookiesStore.delete('refresh');
  return redirect('/auth/signin');
};
