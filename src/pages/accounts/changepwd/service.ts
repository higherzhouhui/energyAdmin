import { request } from 'umi';

export interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface UserRegisterParams {
  password: string;
  new_password: string;
  confirm_password: string;
}

export async function fakeChangePwd(params: UserRegisterParams) {
  return request('/sys_user', {
    method: 'PUT',
    data: params,
  });
}
