import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef } from 'react';
import type { TableListItem, TableListPagination } from './data';
import { rule, removeRule } from './service';
import { history } from 'umi';
import TextArea from 'antd/lib/input/TextArea';
const MessageTableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const handleDeleteClick = async (id: string) => {
    //请求接口更新状态
    const hide = message.loading('正在删除');
    try {
      await removeRule(id);
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
  const removeHtmlTag = (content: string) => {
    const reg = new RegExp('<[^>]*>', 'g');
    let tStr = content.replace(reg, '');
    tStr = tStr.replace('&nbsp;', ''); // 过滤空格
    return tStr;
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '消息内容',
      dataIndex: 'content',
      hideInSearch: true,
      // valueType: 'textarea',
      // ellipsis: true,
      render: (_, record: any) => [
        <TextArea
          key={record.content}
          value={removeHtmlTag(record.content)}
          bordered={false}
          rows={3}
        />,
      ],
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      width: 300,
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
          onClick={() => {
            history.push(`/netmanage/message/detail?id=${record.id}`);
          }}
        >
          详情
        </a>,
        <Popconfirm
          key={record.tel}
          title={`确认删除?`}
          onConfirm={() => handleDeleteClick(record.id)}
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
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              history.push('/netmanage/message/add');
            }}
          >
            <PlusOutlined /> 发布消息
          </Button>,
        ]}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        request={async (params: any = {}) => {
          const param: any = {
            ...params,
            size: params?.pageSize || 10,
          };
          if (param.createTime) {
            param.startTime = param.createTime[0];
            param.endTime = param.createTime[1];
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

export default MessageTableList;
