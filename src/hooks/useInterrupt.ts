import { useCallback } from 'react';

import { useInteractiveAvatarSession } from './useInteractiveAvatarSession';

export const useInterrupt = () => {
  const { avatarRef } = useInteractiveAvatarSession();

  const interrupt = useCallback(() => {
    if (!avatarRef.current) return;
    avatarRef.current.interrupt();
  }, [avatarRef]);

  return { interrupt };
};
