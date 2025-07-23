'use client';

import { useSearchParams } from 'next/navigation';

export default function StorePaymentPage() {
  const searchParams = useSearchParams();
  const userId = searchParams ? searchParams.get('userId') : null;

  if (!userId) {
    return <div>Missing userId</div>;
  }

  return (
    <div>
      Welcome, user {userId}!
    </div>
  );
}
