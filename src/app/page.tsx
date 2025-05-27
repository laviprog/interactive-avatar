import InteractiveAvatar from '@/components/InteractiveAvatar';
import { InteractiveAvatarProvider } from '@/logic/context';

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <InteractiveAvatarProvider>
        <InteractiveAvatar />
      </InteractiveAvatarProvider>
    </div>
  );
}
