import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import React, { useRef, useState } from 'react';
import { Link } from 'umi';
import type { TableListItem, TableListPagination } from './data';
import { rule, updateRule } from './service';

/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields: any, currentRow?: TableListItem) => {
  const hide = message.loading('正在修改...', 50);
  try {
    await updateRule({
      ...currentRow,
      ...fields,
    });
    hide();
    message.success('修改成功!');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const AccountList: React.FC = () => {
  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const FormItem = Form.Item;
  const formRef = useRef<any>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: '唯一的 key',
      hideInSearch: true,
    },
    {
      title: '用户名',
      dataIndex: 'nick_name',
    },
    {
      title: '头像',
      dataIndex: 'path',
      hideInSearch: true,
      hideInTable: true,
      // render: (_, record) => {
      //   return <Image src={record.path} width={120} height={120} style={{objectFit: 'contain'}}/>;
      // },
    },
    {
      title: '账号',
      dataIndex: 'user_name',
    },
    {
      title: '类型',
      dataIndex: 'status',
      sorter: (a, b) => a.status - b.status,
      valueEnum: {
        0: {
          text: '启用',
          status: 'Success',
        },
        1: {
          text: '禁用',
          status: 'Default',
        },
        2: {
          text: '禁用',
          status: 'Default',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            setCurrentRow(record);
            handleUpdateModalVisible(true);
          }}
        >
          修改
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        actionRef={actionRef}
        rowKey="id"
        search={false}
        dateFormatter="string"
        toolBarRender={() => [
          <Button type="primary" key="primary">
            <PlusOutlined />
            <Link
              to={{
                pathname: '/accounts/add',
              }}
              style={{ color: '#fff' }}
            >
              新增用户
            </Link>
          </Button>,
        ]}
        pagination={{
          pageSize: 10,
        }}
        request={async (params: TableListPagination) => {
          const res: any = await rule({ pageNo: params.current, pageSize: params.pageSize });
          return {
            data: res?.data?.rows || [],
            page: res?.data?.page?.pageNo,
            success: true,
            total: res?.data?.page?.total,
          };
        }}
        columns={columns}
      />
      <Modal
        width={480}
        bodyStyle={{
          padding: '32px 40px 48px',
        }}
        title="更新用户信息"
        visible={updateModalVisible}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        onOk={async () => {
          if (formRef && formRef.current) {
            const user_name = formRef?.current?.getFieldValue('user_name');
            const nick_name = formRef?.current?.getFieldValue('nick_name');
            const status = formRef?.current?.getFieldValue('status') * 1;
            const value = { user_name, nick_name, status };
            const success = await handleUpdate(value, currentRow);
            if (success) {
              handleUpdateModalVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
        }}
        getContainer={false}
      >
        <Form
          ref={formRef}
          name="updateuserinfo"
          initialValues={{ ...currentRow, ...{ status: currentRow?.status.toString() } }}
        >
          <FormItem
            name="user_name"
            label="账号"
            labelCol={{ span: 4 }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="text" placeholder="请输入账号" />
          </FormItem>
          <FormItem
            name="nick_name"
            label="用户名"
            labelCol={{ span: 4 }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="text" placeholder="请输入名称" />
          </FormItem>
          <FormItem
            name="status"
            label="状态"
            labelCol={{ span: 4 }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="启用">
              <Select.Option value="0">启用</Select.Option>
              <Select.Option value="1">禁用</Select.Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default AccountList;
