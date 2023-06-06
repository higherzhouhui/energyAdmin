import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Drawer, Image } from 'antd';
import React, { useRef, useState } from 'react';
import type { TableListItem, TableListPagination } from './data';
import { rule } from './service';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';


const TableList: React.FC = () => {
  /** 分布更新窗口的弹窗 */
  const [showDetail, setShowDetail] = useState(false)
  const [currentRow, setCurrentRow] = useState<any>()
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: '唯一的 key',
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
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: (_, record) => {
        return (
          <Image src={record.avatar} width={120} height={120} style={{ objectFit: 'contain' }} />
        );
      },
    },
    {
      title: '是否实名认证',
      dataIndex: 'authenticated',
    },
    {
      title: '手机号',
      dataIndex: 'mobilePhone',
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
    },
    {
      title: '推荐人ID',
      dataIndex: 'referrerId',
    },
    {
      title: '推荐人手机号',
      dataIndex: 'referrerMobilePhone',
    },
    {
      title: '注册类型',
      dataIndex: 'registerType',
    },
    {
      title: '今天是否签到',
      dataIndex: 'signInStatus',
    },
    {
      title: '邀请码',
      dataIndex: 'inviteCode',
    },
    {
      title: '账号状态',
      dataIndex: 'delFlag',
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        actionRef={actionRef}
        rowKey="mobilePhone"
        search={false}
        dateFormatter="string"
        pagination={{
          pageSize: 10,
        }}
        request={async (params: TableListPagination) => {
          const res: any = await rule({ pageNum: params.current, pageSize: params.pageSize });
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
          return {
            data: res?.data?.list || [],
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
