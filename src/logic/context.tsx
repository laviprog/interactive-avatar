'use client';

import React, { createContext, useRef, useState } from 'react';
import StreamingAvatar, { StreamingTalkingMessageEvent } from '@heygen/streaming-avatar';

export enum AvatarSessionState {
  INACTIVE = 'inactive',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
}

export enum MessageSender {
  CLIENT = 'CLIENT',
  AVATAR = 'AVATAR',
}

export interface Message {
  id: string;
  sender: MessageSender;
  content: string;
}

type InteractiveAvatarContextProps = {
  avatarRef: React.MutableRefObject<StreamingAvatar | null>;

  stream: MediaStream | null;
  setStream: (stream: MediaStream | null) => void;

  sessionState: AvatarSessionState;
  setSessionState: (sessionState: AvatarSessionState) => void;

  messages: Message[];
  clearMessages: () => void;

  handleStreamingTalkingMessage: ({ detail }: { detail: StreamingTalkingMessageEvent }) => void;
  handleEndMessage: () => void;
  handleUserMessage: (message: Message) => void;

  waiting: boolean;
  setWaiting: (waiting: boolean) => void;
};

const InteractiveAvatarContext = createContext<InteractiveAvatarContextProps>({
  avatarRef: { current: null },
  stream: null,
  setStream: () => {},

  sessionState: AvatarSessionState.INACTIVE,
  setSessionState: () => {},

  messages: [],
  clearMessages: () => {},
  handleStreamingTalkingMessage: () => {},
  handleEndMessage: () => {},
  handleUserMessage: () => {},

  waiting: false,
  setWaiting: () => {},
});

export const useInteractiveAvatarSessionState = () => {
  const [sessionState, setSessionState] = useState(AvatarSessionState.INACTIVE);
  const [stream, setStream] = useState<MediaStream | null>(null);

  return {
    sessionState,
    setSessionState,
    stream,
    setStream,
  };
};

const useStreamingAvatarMessageState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const currentSenderRef = useRef<MessageSender | null>(null);
  const [waiting, setWaiting] = useState(false);

  const handleUserMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleStreamingTalkingMessage = ({ detail }: { detail: StreamingTalkingMessageEvent }) => {
    if (currentSenderRef.current === MessageSender.AVATAR) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          ...prev[prev.length - 1],
          content: [prev[prev.length - 1].content, detail.message].join(''),
        },
      ]);
    } else {
      currentSenderRef.current = MessageSender.AVATAR;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: MessageSender.AVATAR,
          content: detail.message,
        },
      ]);
    }
  };

  const handleEndMessage = () => {
    currentSenderRef.current = null;
  };

  return {
    messages,
    clearMessages: () => {
      setMessages([]);
      currentSenderRef.current = null;
    },
    handleStreamingTalkingMessage,
    handleEndMessage,
    handleUserMessage,
    waiting,
    setWaiting,
  };
};

export const InteractiveAvatarProvider = ({
  children,
}: {
  children: React.ReactNode;
  basePath?: string;
}) => {
  const avatarRef = React.useRef<StreamingAvatar>(null);
  const sessionState = useInteractiveAvatarSessionState();
  const messageState = useStreamingAvatarMessageState();
  // const listeningState = useStreamingAvatarListeningState();
  // const talkingState = useStreamingAvatarTalkingState();
  // const connectionQualityState = useStreamingAvatarConnectionQualityState();

  return (
    <InteractiveAvatarContext.Provider
      value={{
        avatarRef,
        // ...voiceChatState,
        ...sessionState,
        ...messageState,
        // ...listeningState,
        // ...talkingState,
        // ...connectionQualityState,
      }}
    >
      {children}
    </InteractiveAvatarContext.Provider>
  );
};

export const useInteractiveAvatarContext = () => {
  return React.useContext(InteractiveAvatarContext);
};
