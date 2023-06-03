import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Popconfirm, message } from 'antd';
import React, { useRef } from 'react';
import type { TableListItem, TableListPagination } from './data';
import { rule, removeRule } from './service';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const onConfirm = async (record: any) => {
    console.log(record);
    const hide = message.loading('正在删除');
    try {
      await removeRule(record.id);
      hide();
      message.success('删除成功');
      if (actionRef.current) {
        actionRef.current.reload();
      }
      return true;
    } catch (error) {
      hide();
      message.error('删除失败请重试！');
      return false;
    }
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '用户昵称',
      dataIndex: 'nick',
      hideInSearch: true,
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
    },
    {
      title: '反馈内容',
      dataIndex: 'content',
      hideInSearch: true,
    },
    {
      title: '反馈时间',
      dataIndex: 'createTime',
      hideInSearch: true,
    },
    {
      title: '反馈时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      hideInSearch: true,
      render: (_, record) => [
        <Popconfirm
          key={record.tel}
          title={`确认${record.status === 1 ? '禁用' : '开启'}?`}
          onConfirm={() => onConfirm(record)}
          okText="确认"
          cancelText="取消"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle=""
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        request={async (params: any = {}) => {
          console.log('params:', params);
          const param: any = {
            ...params,
            size: params?.pageSize || 10,
          };
          if (params.createTime && params.createTime.length) {
            param.startTime = params.createTime[0];
            param.endTime = params.createTime[1];
          }

          delete param.pageSize;
          delete param.createTime;
          const res: any = await rule(param);
          return {
            data: res?.data?.records || [],
            page: res?.data?.current,
            success: true,
            total: res?.data?.total,
          };
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
