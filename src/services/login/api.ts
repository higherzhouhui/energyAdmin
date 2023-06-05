// @ts-ignore
/* eslint-disable */
import { message } from 'antd';
import request from 'umi-request';
// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options) => {
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('Access-Token');
  }
  if (null === token) {
    token = 'test';
  }
  options.headers = {
    ...options.headers,
    'Access-Token': token,
  };
  options.timeout = 500000;
  return {
    url: `${url}`,
    options: options,
  };
});

// request拦截器, 改变url 或 options.
request.interceptors.response.use(async (response, options) => {
  // let result;
  const data = await response.clone().json();
  if (data.code !== 200) {
    message.error(data.message);
  }
  return {
    ...data,
    code: data.code,
  };
});

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  // const { initialState } = useModel('@@initialState');
  return request<{
    data: API.CurrentUser;
  }>(`/energy/user/personalInfo`, {
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
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/admin/administer/login', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
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
