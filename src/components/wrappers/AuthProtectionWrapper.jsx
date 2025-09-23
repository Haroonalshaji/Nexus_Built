'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import FallbackLoading from '../FallbackLoading';
const AuthProtectionWrapper = ({
  children
}) => {
  const {
    status
  } = useSession();
  const {
    push
  } = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Avoid redirect loop if already on sign-in page
      const isOnSignIn = pathname?.startsWith('/auth/sign-in');
      if (!isOnSignIn) {
        push(`/auth/sign-in?redirectTo=${encodeURIComponent(pathname || '/')}`);
      }
    }
  }, [status, pathname, push]);

  if (status === 'loading') {
    return <FallbackLoading />;
  }

  if (status === 'unauthenticated') {
    return <FallbackLoading />;
  }

  return <Suspense>{children}</Suspense>;
};
export default AuthProtectionWrapper;