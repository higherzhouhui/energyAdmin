import { PlusOutlined } from '@ant-design/icons';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { ModalForm } from '@ant-design/pro-form';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Image, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { Link } from 'umi';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { TableListItem, TableListPagination } from './data';
import { removeRule, rule, updateRule } from './service';
import './style.less';
/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields: FormValueType, currentRow?: TableListItem) => {
  const hide = message.loading('正在配置', 50);
  try {
    await updateRule({
      ...currentRow,
      ...fields,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: TableListItem[], actionRef?: any) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const res = await removeRule({
      id: selectedRows.map((row) => row.id),
    });
    hide();
    if (res.errno === 200) {
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
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  /** 国际化配置 */
  const [quantity, setQuantity] = useState({
    current: 100,
    total: 5000,
  });
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: '唯一的 key',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '编号',
      dataIndex: 'no',
      sorter: (a, b) => parseInt(b.no.replace('#', '')) - parseInt(a.no.replace('#', '')),
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '图片',
      dataIndex: 'path',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <Image src={record.path} width={120} height={120} style={{ objectFit: 'contain' }} />
        );
      },
    },
    {
      title: '上传时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      sorter: (a, b) => a.create_time - b.create_time,
    },
    {
      title: '是否Mint',
      dataIndex: 'minted',
      sorter: (a, b) => a.minted - b.minted,
      valueEnum: {
        1: {
          text: '是',
          status: 'Success',
        },
        2: {
          text: '否',
          status: 'Error',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      render: (_, record) => [
        // <a
        //   key="update"
        //   onClick={() => {
        //     handleUpdateModalVisible(true);
        //     setCurrentRow(record);
        //   }}
        // >
        //   修改
        // </a>,
        // eslint-disable-next-line react/jsx-key
        <Popconfirm
          title="确认删除？"
          onConfirm={async () => {
            await handleRemove([record], actionRef);
          }}
        >
          <a style={{ color: 'red' }} key="delete">
            删除
          </a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle={`已上传翅膀数量 ${quantity.current}/${quantity.total}`}
        tooltip={`${quantity.total}个为上限`}
        actionRef={actionRef}
        rowKey="no"
        search={false}
        dateFormatter="string"
        pagination={{
          pageSize: 10,
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary">
            <PlusOutlined />
            <Link
              to={{
                pathname: '/wings/upload',
              }}
              style={{ color: '#fff' }}
            >
              上传
            </Link>
          </Button>,
        ]}
        request={async (params: TableListPagination) => {
          const res: any = await rule({ pageNum: params.current, pageSize: params.pageSize });
          setQuantity({
            current: res?.data?.current,
            total: res?.data?.total,
          });
          res?.data?.rows.map((row: any) => {
            row.create_time = row.create_time * 1000;
            row.minted = row.minted ? 1 : 2;
            row.path = row.path.substr(row.path.indexOf('//'));
          });
          return {
            data: res?.data?.rows || [],
            page: res?.data?.page?.pageNum,
            success: true,
            total: res?.data?.page?.total,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
            </div>
          }
        >
          <Popconfirm
            title="确认删除？"
            onConfirm={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
            onCancel={() => {
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <Button style={{ width: '100px' }}>
              {selectedRowsState.length > 1 ? '批量删除' : '删除'}
            </Button>
          </Popconfirm>
        </FooterToolbar>
      )}
      <ModalForm
        title={currentRow?.no}
        width="600px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        submitter={{
          resetButtonProps: {
            style: {
              display: 'none',
            },
          },
          submitButtonProps: {
            style: {
              display: 'none',
            },
          },
        }}
      >
        <img src={currentRow?.path} className="modal-img" />
      </ModalForm>

      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value, currentRow);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.no && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.no}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.no,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
