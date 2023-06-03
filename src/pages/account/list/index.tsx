import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message, Popconfirm, Switch } from 'antd';
import React, { useRef } from 'react';
import type { TableListItem, TableListPagination } from './data';
import { rule, updateRule } from './service';

const AcccountTableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const onChangeSwitch = async (id: string, state: boolean) => {
    //请求接口更新状态
    const hide = message.loading('正在更新');
    try {
      await updateRule({
        userId: id,
        state: !state,
      });
      hide();
      message.success('更新成功');
      if (actionRef.current) {
        actionRef.current.reload();
      }
      return true;
    } catch (error) {
      hide();
      message.error('更新失败请重试！');
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
      title: '用户状态',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        false: {
          text: '禁用',
          status: 'Default',
        },
        true: {
          text: '启用',
          status: 'Processing',
        },
      },
      render: (_, record: any) => [
        <Popconfirm
          key={record.tel}
          title={`确认${record.state ? '禁用' : '开启'}?`}
          onConfirm={() => onChangeSwitch(record.id, record.state)}
          okText="确认"
          cancelText="取消"
        >
          <Switch key={record.status} checked={record.state} />
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle=""
        actionRef={actionRef}
        rowKey="phone"
        search={{
          labelWidth: 120,
        }}
        request={async (params: any = {}) => {
          const res: any = await rule({
            ...params,
            size: params?.pageSize || 10,
          });
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

export default AcccountTableList;
