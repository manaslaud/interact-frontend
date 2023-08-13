import Cookies from 'js-cookie';
import { SOCKET_URL } from './routes';
import { ChatSetupEvent, MeStopTyping, MeTyping, SendMessageEvent, getWSEvent, sendEvent } from '@/helpers/ws';
import { Message, User } from '@/types';
import { messageToastSettings } from '@/utils/toaster';
import { toast } from 'react-toastify';

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

  public setupChatNotifications() {
    if (this.socket) {
      this.socket.onmessage = function (evt) {
        const event = getWSEvent(evt);
        if (event.type === undefined) {
          alert('No Type in the Event');
        }

        switch (event.type) {
          case 'new_message':
            const messageEventPayload: Message = event.payload;
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
}

const socketService = SocketService.getInstance();
export default socketService;
