import { AvatarSessionState, useInteractiveAvatarContext } from '@/logic/context';
import StreamingAvatar, { StartAvatarRequest, StreamingEvents } from '@heygen/streaming-avatar';
import { useCallback, useState } from 'react';
import { baseApiUrlHeyGen } from '@/lib/api/utils';
import { toast } from 'react-toastify';

export const useInteractiveAvatarSession = () => {
  const {
    avatarRef,
    sessionState,
    setSessionState,
    stream,
    setStream,
    clearMessages,
    handleEndMessage,
    handleStreamingTalkingMessage,
    handleUserMessage
  } = useInteractiveAvatarContext();

  const [waiting, setWaiting] = useState(false);

  const init = useCallback(
    (token: string) => {
      avatarRef.current = new StreamingAvatar({
        token: token,
        basePath: baseApiUrlHeyGen(),
      });

      return avatarRef.current;
    },
    [avatarRef]
  );

  const handleStream = useCallback(
    ({ detail }: { detail: MediaStream }) => {
      setStream(detail);
      setSessionState(AvatarSessionState.CONNECTED);
    },
    [setSessionState, setStream]
  );

  const stop = useCallback(async () => {
    try {
      avatarRef.current?.off(StreamingEvents.STREAM_READY, handleStream);
      avatarRef.current?.off(StreamingEvents.STREAM_DISCONNECTED, stop);
      clearMessages();
      // stopVoiceChat();
      // setIsListening(false);
      // setIsUserTalking(false);
      // setIsAvatarTalking(false);
      await avatarRef.current?.stopAvatar();
    } finally {
      setStream(null);
      setSessionState(AvatarSessionState.INACTIVE);
    }
  }, [
    handleStream,
    setSessionState,
    setStream,
    avatarRef,
    // setIsListening,
    // stopVoiceChat,
    clearMessages,
    // setIsUserTalking,
    // setIsAvatarTalking,
  ]);

  const start = useCallback(
    async (config: StartAvatarRequest, token?: string) => {
      if (sessionState !== AvatarSessionState.INACTIVE) {
        throw new Error('There is already an active session');
      }

      if (!avatarRef.current) {
        if (!token) {
          throw new Error('Token is required');
        }
        init(token);
      }

      if (!avatarRef.current) {
        throw new Error('Avatar is not initialized');
      }

      setSessionState(AvatarSessionState.CONNECTING);
      avatarRef.current.on(StreamingEvents.STREAM_READY, handleStream);
      avatarRef.current.on(StreamingEvents.STREAM_DISCONNECTED, stop);
      avatarRef.current.on(StreamingEvents.AVATAR_START_TALKING, () => {
        console.log('Avatar start talking');
      });
      avatarRef.current.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
        console.log('Avatar end talking');
      });
      avatarRef.current.on(StreamingEvents.AVATAR_TALKING_MESSAGE, handleStreamingTalkingMessage);
      avatarRef.current.on(StreamingEvents.AVATAR_END_MESSAGE, handleEndMessage);

      avatarRef.current.createStartAvatar(config)
        .catch((e) => {
        setSessionState(AvatarSessionState.INACTIVE);
        toast.error('К сожалению, не удалось подключиться!');
        console.error(e);
      })

      return avatarRef.current;
    },
    [
      init,
      handleStream,
      stop,
      setSessionState,
      avatarRef,
      sessionState,
      // setConnectionQuality,
      // setIsUserTalking,
      // handleUserTalkingMessage,
      handleStreamingTalkingMessage,
      handleEndMessage,
      // setIsAvatarTalking,
    ]
  );

  return {
    avatarRef,
    sessionState,
    stream,
    initAvatar: init,
    startAvatar: start,
    stopAvatar: stop,
    handleUserMessage,
    waiting,
    setWaiting,
    setSessionState,
  };
};
