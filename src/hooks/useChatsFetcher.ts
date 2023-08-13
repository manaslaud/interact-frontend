import { MESSAGING_URL } from '@/config/routes';
import getHandler from '@/handlers/getHandler';
import { configSelector, setFetchedChats } from '@/slices/configSlice';
import { ChatSlice, setChats } from '@/slices/userSlice';
import { Chat } from '@/types';
import Toaster from '@/utils/toaster';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';

const useChatsFetcher = () => {
  const dispatch = useDispatch();

  const config = useSelector(configSelector);

  const userID = Cookies.get('id');

  const fetchChats = () => {
    if (config.fetchedContributingProjects) return;
    const URL = `${MESSAGING_URL}/me`;
    getHandler(URL, 1)
      .then(res => {
        if (res.statusCode === 200) {
          const chats: ChatSlice[] = [];
          res.data.chats?.forEach((chat: Chat) => {
            chats.push({ chatID: chat.id, userID: chat.acceptedByID == userID ? chat.createdByID : chat.acceptedByID });
          });
          dispatch(setChats(chats));
          dispatch(setFetchedChats());
        } else Toaster.error(res.data.message);
      })
      .catch(err => {
        Toaster.error('Internal Server Error');
        console.log(err);
      });
  };

  return fetchChats;
};

export default useChatsFetcher;
