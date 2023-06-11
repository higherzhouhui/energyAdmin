import { request } from 'umi';

export async function fakeSubmitForm(data: any) {
  return request('/admin/upload/uploadImage', {
    method: 'POST',
    data,
  });
}
