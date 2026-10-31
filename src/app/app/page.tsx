import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';

export default function AppIndexPage() {
  redirect(ROUTES.APP_HOME);
}