import { request } from 'umi';

export async function fakeSubmitForm(data: any) {
  return request('/wings/wings_nft/upload/batch', {
    method: 'POST',
    data,
  });
}
