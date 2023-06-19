import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Input, message, Modal, Popconfirm, Image } from 'antd';
import React, { useRef, useState } from 'react';
import type { TableListItem, TableListPagination } from './data';
import { addRule, removeRule, rule, updateRule } from './service';
import ProForm, { ProFormUploadButton } from '@ant-design/pro-form';
import { request } from 'umi';

/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: TableListItem[], actionRef?: any) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  selectedRows.forEach(async (row) => {
    try {
      const res = await removeRule({
        id: row.id,
      });
      hide();
      if (res.code === 200) {
        message.success('删除成功，即将刷新');
        if (actionRef) {
          actionRef.current?.reloadAndRest?.();
        }
      }
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  });
  return true;
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem | any>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const formRef = useRef<any>()
  const handleUpdateRecord = (record: TableListItem, type: number) => {
    const hide = message.loading('正在操作中...');
    updateRule({
      id: record.id,
      auditStatus: type
    }).then((res: any) => {
      hide();
      if (res.code === 200) {
        message.success('操作完成，即将刷新');
        actionRef.current?.reloadAndRest?.();
      }
    }).catch(() => {
      hide();
    })
    // setCurrentRow(record);
    // handleModalVisible(true);
    // formRef?.current?.resetFields();
  }
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: '唯一的 key',
      width: 180
    },
    {
      title: '交易单号',
      dataIndex: 'tradeNo',
      width: 200
    },
    {
      title: '购买项目',
      dataIndex: 'title',
      hideInSearch: true,
      width: 200
    },{
      title: '价格',
      dataIndex: 'price',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '项目图',
      dataIndex: 'voucher',
      hideInSearch: true,
      width: 130,
      render: (_, record) => {
        return (
          <Image src={record.image} width={120} height={120} style={{ objectFit: 'contain' }} />
        );
      }
    }, {
      title: '手机号',
      dataIndex: 'phone',
      hideInSearch: true,
      width: 130,
    }, {
      title: '状态',
      dataIndex: 'state',
      width: 100,
      valueEnum: {
        0: {
          text: '待支付',
          status: 'Processing',
        },
        1: {
          text: '已完成',
          status: 'Success',
        }
      },
    }, 
    {
      title: '支付凭证',
      dataIndex: 'voucher',
      hideInSearch: true,
      width: 130,
      render: (_, record) => {
        return (
          <>
            {
              record.payType === 3 ? <Image src={record.voucher} width={120} height={120} style={{ objectFit: 'contain' }} /> : null
            }
          </>
        );
      }
    }, {
      title: '支付方式',
      dataIndex: 'payType',
      width: 100,
      valueEnum: {
        1: {
          text: '微信',
          status: 'Processing',
        },
        2: {
          text: '支付宝',
          status: 'Success',
        },
        3: {
          text: '银行卡',
          status: 'Default',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
      hideInDescriptions: true,
      render: (_, record) => [
        record.state == 0 && record.payType === 3 ? <Popconfirm
        title="确认通过审核？"
        onConfirm={async () => {
          handleUpdateRecord(record, 1);
        }}
        key="access"
      >
        <a key="access">
        通过
        </a>
      </Popconfirm> : null
      ],
    },
  ];
  const addNewNotice = () => {
    setCurrentRow(Object.assign({}, {}));
    handleModalVisible(true);
    formRef?.current?.resetFields();
  };

  const handleOk = async () => {
    const hide = message.loading(`正在${currentRow?.id ? '更新' : '新增'}`);
    try {
      const res = await addRule(currentRow);
      handleModalVisible(false);
      hide();
      if (res.code === 200) {
        message.success('操作成功，即将刷新');
        if (actionRef) {
          actionRef.current?.reloadAndRest?.();
        }
      } else {
        message.error(res.msg);
      }
      return true;
    } catch (error) {
      hide();
      message.error('操作失败，请重试');
      return false;
    }
  };
  const handleChange = (value: any, attar: string) => {
    const newRow = currentRow
    newRow[attar] = value
    setCurrentRow(Object.assign({}, newRow))
  }
  const Upload = {
    //数量
    maxCount: 1,
    accept: 'image/*',
    customRequest: (options: any) => {
      const { onSuccess, onError, file } = options;
      const formData = new FormData();
      formData.append('file', file);
      // /upload为图片上传的地址，后台只需要一个图片的path
      // name，path，status是组件上传需要的格式需要自己去拼接
      request('/admin/upload/uploadImage', { method: 'POST', data: formData })
        .then((data: any) => {
          const _response = { name: file.name, status: 'done', path: data.data };
          handleChange(data.data, 'icon');
          //请求成功后把file赋值上去
          onSuccess(_response, file);
        })
        .catch(onError);
    },
  };

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 90,
          //隐藏展开、收起
          collapsed: false,
          collapseRender:()=>false,
        }}
        dateFormatter="string"
        pagination={{
          pageSize: 10,
        }}
        scroll={{
          x: 1400,
          y: document?.body?.clientHeight - 470,
        }}
        request={async (params: any) => {
          const res: any = await rule({ pageNum: params.current, ...params });
          // (res?.data?.list || []).map((item: any) => {
          //   let status = '审核中'
          //   if (item.state == 1) {
          //     status = '通过'
          //   } else if (item.state == 2) {
          //     status = '驳回'
          //   }
          //   let payType = '银行卡'
          //   if (item.payType == 1) {
          //     payType = '微信'
          //   } else if (item.payType == 2) {
          //     payType = '支付宝'
          //   }
          //   item.payType = payType
          //   item.status = status
          // })
          return {
            data: res?.data?.list || [],
            page: res?.data?.pageNum,
            success: true,
            total: res?.data?.totalSize,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      <Modal
        title={currentRow?.id ? '修改' : '新增'}
        visible={createModalVisible}
        onOk={() => handleOk()}
        onCancel={() => handleModalVisible(false)}
      >
        <ProForm formRef={formRef} submitter={false}>
          <ProFormUploadButton
            label="选择图片"
            max={1}
            name="image"
            fieldProps={{
              ...Upload,
            }}
          />
          {
            currentRow?.icon ? <Form.Item label="">
            <Input value={currentRow?.icon} readOnly />
          </Form.Item> : null
          }
          <Form.Item label="邀请人数">
            <Input type='number' value={currentRow?.inviteNum} onChange={(e) => handleChange(e.target.value, 'inviteNum')}/>
          </Form.Item>
          <Form.Item label="奖励">
            <Input type='number' value={currentRow?.amount} onChange={(e) => handleChange(e.target.value, 'amount')}/>
          </Form.Item>
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default TableList;
