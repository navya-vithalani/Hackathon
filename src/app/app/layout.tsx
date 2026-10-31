import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { createClient } from '@/services/supabase/server';

export default async function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Could not verify the current user: ${error.message}`);
  }
  if (!user) {
    redirect('/login?redirectTo=%2Fapp%2Fhome');
  }

  const fullName = user.user_metadata?.full_name;
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <AppShell
      user={{
        full_name: typeof fullName === 'string' && fullName.trim()
          ? fullName
          : user.email ?? 'hivai member',
        avatar_url: typeof avatarUrl === 'string' ? avatarUrl : undefined,
      }}
    >
      {children}
    </AppShell>
  );
}