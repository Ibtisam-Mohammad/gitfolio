'use server';

import { redirect } from 'next/navigation';

export async function searchUser(formData: FormData) {
  const username = formData.get('username') as string;
  if (username && username.trim()) {
    redirect(`/${username.trim()}`);
  } else {
    // Optionally, handle empty input case, though `required` on input helps
    redirect('/');
  }
}
