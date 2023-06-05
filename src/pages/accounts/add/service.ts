import { request } from 'umi';

export interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface UserRegisterData {
  user_name: string;
  password: string;
  confirm_password: string;
  nick_name: string;
  status: number;
}

export async function fakeChangePwd(params: UserRegisterData) {
  console.log(params);
  return request('/sys_user', {
    method: 'POST',
    data: params,
  });
}
