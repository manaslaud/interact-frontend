import { TypingStatus } from '@/types';
import { Chat, Message, User } from '@/types';
import { initialMessage, initialUser } from '@/types/initials';
import { toast } from 'react-toastify';
import { messageToastSettings } from '../utils/toaster';
import { store } from '@/store';
import sortChats from '@/utils/sort_chats';

export class WSEvent {
  type = '';
  payload = initialMessage;
  constructor(type: string, payload: any) {
    this.type = type;
    this.payload = payload;
  }
}

export const getWSEvent = (evt: MessageEvent<any>) => {
  const eventData = JSON.parse(evt.data);
  return new WSEvent(eventData.type, eventData.payload);
};

export class SendMessageEvent {
  content = '';
  chatID = '';
  user = initialUser;
  userID = '';

  constructor(content: string, chatID: string, userID: string, user: User) {
    this.content = content;
    this.chatID = chatID;
    this.userID = userID;
    this.user = user;
  }
}

export class NewMessageEvent {
  content = '';
  chatID = '';
  user = initialUser;
  userID = '';
  createdAt: Date | string = '';
  read = false;

  constructor(content: string, chatID: string, userID: string, user: User, createdAt: Date) {
    this.content = content;
    this.chatID = chatID;
    this.userID = userID;
    this.user = user;
    this.createdAt = createdAt;
  }
}

export class SendNotificationEvent {
  content = '';
  userID = '';

  constructor(userID: string, content: string) {
    this.content = content;
    this.userID = userID;
  }
}

export class ChatSetupEvent {
  chats: string[] = [];
  constructor(chats: string[]) {
    this.chats = chats;
  }
}

export class ChangeChatRoomEvent {
  id = '';
  constructor(id: string) {
    this.id = id;
  }
}

export class MeTyping {
  user = initialUser;
  chatID = '';
  constructor(user: User, chatID: string) {
    this.user = user;
    this.chatID = chatID;
  }
}

export class MeStopTyping {
  user = initialUser;
  chatID = '';
  constructor(user: User, chatID: string) {
    this.user = user;
    this.chatID = chatID;
  }
}

export function routeMessagingWindowEvents(
  event: WSEvent,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  typingStatus: TypingStatus,
  setTypingStatus: React.Dispatch<React.SetStateAction<TypingStatus>>
) {
  if (event.type === undefined) {
    alert('No Type in the Event');
  }
  const currentChatID = store.getState().messaging.currentChatID;
  switch (event.type) {
    case 'new_message':
      const messageEventPayload: Message = event.payload;
      if (messageEventPayload.chatID == currentChatID) setMessages(prev => [messageEventPayload, ...prev]);
      else {
        toast.info(messageEventPayload.user.name + ': ' + messageEventPayload.content, {
          ...messageToastSettings,
          icon: '🐵',
          // icon: () => (
          //   <Image
          //     width={100}
          //     height={100}
          //     src={`${USER_PROFILE_PIC_URL}/${messageEventPayload.user.profilePic}`}
          //     alt="User"
          //   />
          // ),
        });
      }
      break;
    case 'user_typing':
      const userTypingEventPayload: TypingStatus = event.payload;
      setTypingStatus(userTypingEventPayload);
      break;
    case 'user_stop_typing':
      const userStopTypingEventPayload: TypingStatus = event.payload;
      if (userStopTypingEventPayload.user.id !== typingStatus.user.id) {
        const initialTypingStatus: TypingStatus = {
          user: initialUser,
          chatID: typingStatus.chatID,
        };
        setTypingStatus(initialTypingStatus);
      }
      break;
    default:
      alert('Message type not supported');
      break;
  }
}

export function routeChatListEvents(
  event: WSEvent,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
  // typingStatus: TypingStatus,
  // setTypingStatus: React.Dispatch<React.SetStateAction<TypingStatus>>
) {
  if (event.type === undefined) {
    alert('No Type in the Event');
  }

  switch (event.type) {
    case 'new_message':
      const messageEventPayload: Message = event.payload;
      setChats(prev =>
        sortChats(
          prev.map(chat => {
            if (chat.id == messageEventPayload.chatID) {
              chat.latestMessage = messageEventPayload;
            }
            return chat;
          })
        )
      );
      break;
    default:
      break;
  }
}

export function sendEvent(eventName: string, payloadEvent: any, conn: WebSocket) {
  const event = new WSEvent(eventName, payloadEvent);

  try {
    conn.send(JSON.stringify(event));
  } catch {
    alert('Socket connection error');
  }
}
