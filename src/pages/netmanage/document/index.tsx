import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React, { useRef } from 'react';
import type { TableListItem, TableListPagination } from './data';
import { history } from 'umi';
import { rule } from './service';

const MessageTableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '文档名称',
      dataIndex: 'docName',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      hideInSearch: true,
      width: 200,
      render: (_, record: any) => [
        <a
          style={{ marginRight: '12px' }}
          key={record.tel}
          onClick={() => history.push(`/netmanage/document/detail?id=${record.id}`)}
        >
          详情
        </a>,
        <a
          style={{ marginRight: '12px' }}
          onClick={() => history.push(`/netmanage/document/edit?id=${record.id}`)}
          key={record.tel}
        >
          编辑
        </a>
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle=""
        actionRef={actionRef}
        // toolBarRender={() => [
        //   <Button type="primary" key="primary">
        //     <PlusOutlined />{' '}
        //     <a href="/netmanage/document/add" style={{ color: '#fff' }}>
        //       发布文档
        //     </a>
        //   </Button>,
        // ]}
        rowKey="key"
        search={false}
        request={async (params: any = {}) => {
          const param: any = {
            ...params,
            size: params?.pageSize || 10,
          }
          delete param.pageSize;
          const res: any = await rule(param);
          return {
            data: res?.data || [],
            page: 1,
            success: true,
            total: 3
          };
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default MessageTableList;
