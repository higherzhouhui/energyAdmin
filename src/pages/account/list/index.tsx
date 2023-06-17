import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Drawer, Image } from 'antd';
import React, { useRef, useState } from 'react';
import type { TableListItem, TableListPagination } from './data';
import { rule } from './service';


const TableList: React.FC = () => {
  /** 分布更新窗口的弹窗 */
  const [showDetail, setShowDetail] = useState(false)
  const [currentRow, setCurrentRow] = useState<any>()
  const [total, setTotal] = useState(0)
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: '唯一的 key',
      className: 'idClass',
      hideInSearch: true,
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
      title: '姓名',
      dataIndex: 'name',
      className: 'fullClass',
      hideInSearch: true,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      className: 'fullClass',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <Image src={record.avatar} width={120} height={120} style={{ objectFit: 'contain' }} />
        );
      },
    },
    {
      title: '是否实名认证',
      dataIndex: 'authenticated',
      className: 'fullClass',
      hideInSearch: true,
    },
    {
      title: '手机号',
      dataIndex: 'mobilePhone',
      className: 'fullClass',
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      className: 'fullClass',
      hideInSearch: true,
    },
    {
      title: '推荐人数',
      dataIndex: 'totalChildren',
      className: 'fullClass',
      hideInSearch: true,
    },
    {
      title: '推荐人手机号',
      dataIndex: 'referrerMobilePhone',
      className: 'fullClass',
      hideInSearch: true,
    },
    {
      title: '注册类型',
      dataIndex: 'registerType',
      className: 'fullClass',
      hideInSearch: true,
    },
    {
      title: '今天是否签到',
      dataIndex: 'signInStatus',
      className: 'fullClass',
      hideInSearch: true,
    },
    {
      title: '邀请码',
      dataIndex: 'inviteCode',
      className: 'fullClass',
      hideInSearch: true,
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      className: 'fullClass',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      className: 'fullClass',
      hideInSearch: true,
    },
  ];
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
        } else {
          node.totalChildren = node.children.length
        }
        result.push(node);
      }
    }
    return result
  }
 

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        actionRef={actionRef}
        rowKey="mobilePhone"
        dateFormatter="string"
        headerTitle={`总用户：${total}`}
        search={{
          labelWidth: 90,
          //隐藏展开、收起
          collapsed: false,
          collapseRender:()=>false,
        }}
        pagination={false}
        scroll={{
          x: 1800,
          y: document.body.clientHeight - 410
        }}
        request={async (params: TableListPagination) => {
          const res: any = await rule({ pageNum: 1, pageSize: 99999 });
          (res?.data?.list || []).map((item: any) => {
            let delFlag = '正常';
            if (item.delFlag == 1) {
              delFlag = '已删除';
            }
            let signInStatus = '未签到';
            if (item.signInStatus) {
              signInStatus = '已签到';
            }
            let authenticated = '未实名';
            if (item.authenticated) {
              authenticated = '已实名';
            }
            let registerType = 'APP注册';
            if (item.registerType == 2) {
              registerType = '链接注册';
            }
            item.delFlag = delFlag;
            item.signInStatus = signInStatus;
            item.registerType = registerType;
            item.authenticated = authenticated;
          });
          let data: any = []
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
