import configuredAxios from '@/config/axios';
import Cookies from 'js-cookie';

const postHandler = async (URL: string, formData: object, protect: boolean, type: string = 'application/json') => {
  const headers = {
    'Content-Type': type,
    Authorization: '',
  };
  if (protect) headers.Authorization = `Bearer ${Cookies.get('token')}`;
  const response: any = {
    status: 0,
    data: {},
    statusCode: 500,
  };

  await configuredAxios
    .post(URL, formData, { headers })
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

export default postHandler;
