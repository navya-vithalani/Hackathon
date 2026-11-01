import Link from 'next/link';
import QRCode from 'qrcode';
import { ArrowLeft } from 'lucide-react';
import { CampusIdCard } from '@/components/profile/CampusIdCard';
import { PrintIdButton } from '@/components/profile/PrintIdButton';
import { createClient } from '@/services/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProfileIdPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(`Could not verify the current user: ${error.message}`);
  if (!user) redirect('/login?redirectTo=%2Fapp%2Fprofile%2Fid');

  const fullName = user.user_metadata?.full_name;
  const avatarUrl = user.user_metadata?.avatar_url;
  const accountType = user.user_metadata?.account_type === 'staff' ? 'Staff' : 'Student';
  const displayName = typeof fullName === 'string' && fullName.trim()
    ? fullName
    : user.email ?? 'hivai member';
  const campusMetadata = user.user_metadata?.institution_name;
  const campusName = typeof campusMetadata === 'string' && campusMetadata.trim()
    ? campusMetadata.trim()
    : 'Campus not added';
  const qrCode = await QRCode.toDataURL(`hivai:member:${user.id}`, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 256,
    color: { dark: '#291b16', light: '#fffdf6' },
  });

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link href="/app/profile" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[var(--color-secondary)]"><ArrowLeft size={16} /> Profile</Link>
      <header><p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary)]">Campus identity</p><h1 className="font-heading text-3xl font-semibold">Digital ID</h1></header>
      <CampusIdCard
        displayName={displayName}
        email={user.email ?? 'No email on file'}
        accountType={accountType}
        campusName={campusName}
        memberId={user.id.slice(0, 8).toUpperCase()}
        avatarUrl={typeof avatarUrl === 'string' ? avatarUrl : undefined}
        verified={Boolean(user.email_confirmed_at)}
        qrCode={qrCode}
      />
      <PrintIdButton />
      <p className="text-xs leading-relaxed text-[var(--color-text-subtle)]">Your member QR contains your HIVAI account ID. Event check-in will use separate event-ticket QR codes.</p>
    </div>
  );
}