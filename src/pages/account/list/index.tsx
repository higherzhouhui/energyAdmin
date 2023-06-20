import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Form, Image, Input, Modal, Tag, message } from 'antd';
import React, { useRef, useState } from 'react';
import type { TableListItem, TableListPagination } from './data';
import { addRule, rule } from './service';
import ProForm from '@ant-design/pro-form';
import style from './style.less'
import { history } from 'umi';
import * as XLSX from 'xlsx'
import { TableOutlined } from '@ant-design/icons';
const TableList: React.FC = () => {
  /** 分布更新窗口的弹窗 */
  const [showDetail, setShowDetail] = useState(false)
  const [currentRow, setCurrentRow] = useState<any>()
  const [total, setTotal] = useState(0)
  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const formRef = useRef<any>()
  const handleUpdateRecord = (record: TableListItem) => {
    setCurrentRow(record);
    handleModalVisible(true);
    formRef?.current?.resetFields();
  }
  const routeToChildren = (record: TableListItem) => {
    history.push(`/account/children?userId=${record.id}&name=${record.name}`)
  }
  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: '点击可查看下级会员',
      width: 180,
      hideInSearch: true,
      hideInTable: true,
      render: (_, record) => {
        return (
          <div className={style.link} onClick={() => routeToChildren(record)}>{record.id}</div>
        );
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 150,
      tooltip: '点击可查看该用户详情',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <div
            className={style.link}
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </div>
        );
      },
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 130,
      hideInSearch: true,
      render: (_, record) => {
        return (
          <>
            {
              record.avatar ? <Image src={record.avatar} width={120} height={120} style={{ objectFit: 'contain' }} /> : <div className={style.avatar}>{record.name || String(record.id).slice(0, 5)}</div>
            }
          </>
        );
      },
    },
    {
      title: '是否实名认证',
      dataIndex: 'authenticated',
      hideInSearch: true,
      width: 120,
      render: (_, record) => {
        return (
          <>
            {
              record.authenticated ? <Tag color='#87d068'>已实名</Tag> : <Tag color='#f50'>未实名</Tag>
            }
          </>
        );
      },
    },
    {
      title: '手机号',
      dataIndex: 'mobilePhone',
      width: 110,
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '推荐总人数',
      dataIndex: 'totalChildren',
      width: 110,
      tooltip: '点击可查看下级会员',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <div className={style.link} onClick={() => routeToChildren(record)}>{record.totalChildren !== undefined ? record.totalChildren : '查看下级会员'}</div>
        );
      },
    },
    {
      title: '推荐人手机号',
      dataIndex: 'referrerMobilePhone',
      width: 110,
      hideInSearch: true,
    },
    {
      title: '注册类型',
      dataIndex: 'registerType',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        return (
          <>
            {
              record.registerType == 1 ? <Tag color='warning'>APP注册</Tag> : <Tag color='success'>链接注册</Tag>
            }
          </>
        );
      },
    },
    {
      title: '是否签到',
      dataIndex: 'signInStatus',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        return (
          <>
            {
              record.signInStatus ? <Tag color='#87d068'>已签到</Tag> : <Tag color='#f50'>未签到</Tag>
            }
          </>
        );
      },
    },
    {
      title: '邀请码',
      dataIndex: 'inviteCode',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      hideInDescriptions: true,
      fixed: 'right',
      render: (_, record) => [
        <a key="access" onClick={() => handleUpdateRecord(record)}>
          修改
        </a>
      ],
    },
  ];
  const  getChildrenCount = (node: any) => {
    if (!node || !node.children) {
      // 如果没有子节点，则直接返回
      return 0;
    }
    let childCount = node.children.length; // 子节点数量初始化为直接子节点数量
    for (let i = 0; i < childCount; i++) {
      // 递归获取每个直接子节点的子节点数量
      childCount += getChildrenCount(node.children[i]);
    }
    return childCount; // 返回总子节点数量
  }
  const buildTree = (data: any[], referrerId=1) => {
    const result: any[] = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].referrerId === referrerId) {
        const node = {
          ...data[i],
          children: buildTree(data, data[i].id),
          totalChildren: 0,
        };
        if (node.children && node.children.length === 0) {
          delete node.children; // 删除空的 children 属性
        }
        if (node.children) {
          node.totalChildren = getChildrenCount(node)
        }
        result.push(node);
      }
    }
    return result
  }
 
  const handleOk = async () => {
    const hide = message.loading(`正在${currentRow?.id ? '更新' : '新增'}`);
    try {
      const res = await addRule({
        id: currentRow?.id,
        name: currentRow?.name,
        idCard: currentRow?.idCard,
      });
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
    const newRow = Object.assign({}, currentRow)
    newRow[attar] = value
    setCurrentRow(newRow)
  }

  const export2Excel = (id: string, name: string) => {
    const exportFileContent = document.getElementById(id)!.cloneNode(true);
    const wb = XLSX.utils.table_to_book(exportFileContent, { sheet: 'sheet1' });
    XLSX.writeFile(wb, `${name}.xlsx`);
  };

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        actionRef={actionRef}
        rowKey="mobilePhone"
        dateFormatter="string"
        id='myTable'
        headerTitle={`总会员：${total}`}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => export2Excel('myTable', '会员列表')}>
            <TableOutlined />
            导出
          </Button>,
        ]}
        search={{
          labelWidth: 90,
          //隐藏展开、收起
          collapsed: false,
          collapseRender:()=>false,
          
        }}
        // pagination={{
        //   pageSize: 10,
        //   current: 1
        // }}
        pagination={false}
        scroll={{
          x: 1800,
          y: document.body.clientHeight - 350
        }}
        request={async (params: TableListPagination) => {
          const res: any = await rule({...params, pageNum: 1, pageSize: 99999});
          // (res?.data?.list || []).map((item: any) => {
          //   let registerType = 'APP注册';
          //   if (item.registerType == 2) {
          //     registerType = '链接注册';
          //   }
          //   item.registerType = registerType;
          // });
          let data: any = []
          data = res?.data?.list || []
          if (params.mobilePhone) {
            data = res?.data?.list || []
          } else {
            data = buildTree(res?.data?.list || [])
          }
          setTotal(res?.data?.totalSize)
          return {
            data: data,
            page: res?.data?.pageNum,
            success: true,
            total: res?.data?.totalSize,
          };
        }}
        columns={columns}
      />
      <Modal
        title={currentRow?.id ? '修改实名认证信息' : '新增'}
        visible={createModalVisible}
        onOk={() => handleOk()}
        onCancel={() => handleModalVisible(false)}
      >
        <ProForm formRef={formRef} submitter={false}>
          <Form.Item label="姓名">
            <Input value={currentRow?.name} onChange={(e) => handleChange(e.target.value, 'name')}/>
          </Form.Item>
          <Form.Item label="身份证号">
            <Input value={currentRow?.idCard} onChange={(e) => handleChange(e.target.value, 'idCard')}/>
          </Form.Item>
        </ProForm>
      </Modal>
      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.mobilePhone && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
