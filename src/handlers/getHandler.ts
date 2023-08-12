import configuredAxios from '@/config/axios';
import Cookies from 'js-cookie';

//* -1 for no protect, 0 for partial protect and 1 for protect

const getHandler = async (URL: string, protect: number) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: '',
  };
  const token = Cookies.get('token');
  if (protect === 1) headers.Authorization = `Bearer ${token}`;
  if (protect === 0 && token && token != '') headers.Authorization = `Bearer ${token}`;

  const response: any = {
    status: 0,
    data: '',
    statusCode: 500,
  };
  await configuredAxios
    .get(URL, { headers })
    .then(res => {
      response.status = 1;
      response.data = res.data;
      response.statusCode = res.status;
    })
    .catch(err => {
      response.status = 0;
      response.data = err.response.data;
      response.statusCode = 500;
    });
  return response;
};

export default getHandler;
