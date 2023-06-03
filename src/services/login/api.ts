// @ts-ignore
/* eslint-disable */
import { message } from 'antd';
import request from 'umi-request';
import { history } from 'umi';
// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options) => {
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('tshs-token');
  }
  if (null === token) {
    token = '5e73e5db36a34988';
  }
  options.headers = {
    ...options.headers,
    'Content-Type': 'application/json;charset=UTF-8',
    AUTHENTICATION: token,
  };
  options.timeout = 500000;
  return {
    url: `/api/manageApi${url}`,
    options: options,
  };
});

// request拦截器, 改变url 或 options.
request.interceptors.response.use(async (response, options) => {
  // let result;
  const data = await response.clone().json();
  if (data.code !== 'SUCCESS') {
    message.error(data.message || data.msg);
  }
  if (data.code === 'AUTHENTICATION_ERROR' || data.code === 'NOT_LOGIN') {
    history.push('/user/login');
  }
  return data;
});

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  // const { initialState } = useModel('@@initialState');
  return request<{
    data: API.CurrentUser;
  }>(`/webUser/getUserInfo`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/sys_user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(params: API.LoginParams, options?: { [key: string]: any }) {
  return request('/user/login', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: params,
    ...(options || {}),
  });
}

/** 获取验证码 */
export async function getFakeCaptcha(phone: string) {
  return request<API.LoginResult>('/user/sendCode', {
    method: 'POST',
    data: {
      phone,
    },
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
