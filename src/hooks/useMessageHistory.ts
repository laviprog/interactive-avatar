import { useInteractiveAvatarContext } from '@/logic/context';

export const useMessageHistory = () => {
  const { messages } = useInteractiveAvatarContext();

  return { messages };
};
