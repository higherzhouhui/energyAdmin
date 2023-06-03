// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { TableListItem } from './data';

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
  return request<{
    data: TableListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/msgRel/getList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function getRule(id: string) {
  return request<TableListItem>('/msgRel/getById', {
    params: {
      id
    },
    method: 'GET'
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/msgRel/add', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(id: string) {
  return request<Record<string, any>>('/msgRel/deleteById', {
    params: {
      id
    },
    method: 'GET'
  });
}
