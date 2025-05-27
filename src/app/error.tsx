'use client';

import { useEffect } from 'react';
import Button from '@/components/Button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='flex flex-col items-center justify-center'>
      <h2 className='text-5xl'>Something went wrong!</h2>
      <Button className='text-3xl px-7 py-5' onClick={() => reset()}>Try again</Button>
    </div>
  );
}
