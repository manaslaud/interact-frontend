import Cookies from 'js-cookie';
import { SOCKET_URL } from './routes';
import {
  ChatSetupEvent,
  MeStopTyping,
  MeTyping,
  SendMessageEvent,
  SendNotificationEvent,
  WSEvent,
  getWSEvent,
  routeChatListEvents,
  routeGroupChatListEvents,
  routeGroupMessagingWindowEvents,
  routeMessagingWindowEvents,
  sendEvent,
} from '@/helpers/ws';
import { Chat, GroupChat, GroupChatMessage, Message, TypingStatus, User } from '@/types';
import { messageToastSettings } from '@/utils/toaster';
import { toast } from 'react-toastify';
import { store } from '@/store';
import { incrementUnreadNotifications } from '@/slices/feedSlice';

class SocketService {
  private static instance: SocketService | null = null;
  private socket: WebSocket | null = null;
  private chatIDs: string[] = [];

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public getSocket(): WebSocket | null {
    return this.socket;
  }

  public getChats(): string[] {
    return this.chatIDs;
  }

  public connect(userID: string | undefined = Cookies.get('id')): void {
    if (!this.socket) {
      if (!userID || userID == '') return;
      this.socket = new WebSocket(`${SOCKET_URL}?userID=${userID}`);
      this.socket.addEventListener('open', event => {
        this.setupChatNotifications();
        this.setupPushNotifications();
      });
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  public setupChats(chats: string[]): void {
    if (this.socket) {
      this.chatIDs = chats;
      const outgoingEvent = new ChatSetupEvent(chats);
      sendEvent('chat_setup', outgoingEvent, this.socket);
    }
  }

  public sendMessage(message: string, chatID: string, userID: string, self: User) {
    if (this.socket) {
      const outgoingMessageEvent = new SendMessageEvent(message, chatID, userID, self);
      sendEvent('send_message', outgoingMessageEvent, this.socket);
    }
  }

  public sendTypingStatus(self: User, chatID: string, status: number) {
    if (this.socket) {
      if (status == 0) {
        const outgoingStopTypingEvent = new MeStopTyping(self, chatID);
        sendEvent('me_stop_typing', outgoingStopTypingEvent, this.socket);
      } else {
        const outgoingEvent = new MeTyping(self, chatID);
        sendEvent('me_typing', outgoingEvent, this.socket);
      }
    }
  }

  public sendNotification(userID: string, content: string) {
    if (this.socket) {
      const outgoingNotificationEvent = new SendNotificationEvent(userID, content);
      sendEvent('send_notification', outgoingNotificationEvent, this.socket);
    }
  }

  public setupChatWindowRoutes(
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    typingStatus: TypingStatus,
    setTypingStatus: React.Dispatch<React.SetStateAction<TypingStatus>>
  ) {
    if (this.socket) {
      this.socket.addEventListener('message', function (evt) {
        const eventData = JSON.parse(evt.data);
        const event = new WSEvent(eventData.type, eventData.payload);
        routeMessagingWindowEvents(event, setMessages, typingStatus, setTypingStatus);
      });
    }
  }

  public setupGroupChatWindowRoutes(
    setMessages: React.Dispatch<React.SetStateAction<GroupChatMessage[]>>,
    typingStatus: TypingStatus,
    setTypingStatus: React.Dispatch<React.SetStateAction<TypingStatus>>
  ) {
    if (this.socket) {
      this.socket.addEventListener('message', function (evt) {
        const eventData = JSON.parse(evt.data);
        const event = new WSEvent(eventData.type, eventData.payload);
        routeGroupMessagingWindowEvents(event, setMessages, typingStatus, setTypingStatus);
      });
    }
  }

  public setupChatListRoutes(setChats: React.Dispatch<React.SetStateAction<Chat[]>>) {
    if (this.socket) {
      this.socket.addEventListener('message', function (evt) {
        const eventData = JSON.parse(evt.data);
        const event = new WSEvent(eventData.type, eventData.payload);
        routeChatListEvents(event, setChats);
      });
    }
  }

  public setupGroupChatListRoutes(setChats: React.Dispatch<React.SetStateAction<GroupChat[]>>) {
    if (this.socket) {
      this.socket.addEventListener('message', function (evt) {
        const eventData = JSON.parse(evt.data);
        const event = new WSEvent(eventData.type, eventData.payload);
        routeGroupChatListEvents(event, setChats);
      });
    }
  }

  public setupChatNotifications() {
    if (this.socket) {
      this.socket.onmessage = function (evt) {
        const event = getWSEvent(evt);
        if (event.type === undefined) {
          alert('No Type in the Event');
        }

        switch (event.type) {
          case 'new_message':
            const messageEventPayload = event.payload as Message;
            toast.info('New Message from: ' + messageEventPayload.user.name, {
              ...messageToastSettings,
              toastId: messageEventPayload.chatID,
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
            break;
          default:
            break;
        }
      };
    }
  }

  public setupPushNotifications() {
    if (this.socket) {
      this.socket.onmessage = function (evt) {
        const event = getWSEvent(evt);
        if (event.type === undefined) {
          alert('No Type in the Event');
        }

        switch (event.type) {
          case 'receive_notification':
            type WS_Notification = {
              userID: string;
              content: string;
            };
            const notificationEventPayload = event.payload as WS_Notification;
            toast.info(notificationEventPayload.content, {
              ...messageToastSettings,
              icon: '🐵',
            });
            store.dispatch(incrementUnreadNotifications());
            break;
          default:
            break;
        }
      };
    }
  }
}

const socketService = SocketService.getInstance();
export default socketService;
