import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { PageContainer, PageLoading } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Badge, Button, Drawer, Input, message, Image, Modal, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { TableListItem, TableListPagination } from './data';
import { replayRule, removeRule, rule, updateRule, getDetailRule } from './service';
import ProForm, { ProFormUploadButton } from '@ant-design/pro-form';
import style from './style.less'
import { request } from 'umi';
import { trim } from 'lodash';
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
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const [content, setContent] = useState('');
  const formRef = useRef<any>();
  const [historyList, setHistoryList] = useState([])
  const [freshTime, setFreshTime] = useState(60)
  const [selectValue, setselectValue] = useState('60')
  const timer = useRef<any>(null)
  const [type, setType] = useState(1)
  const [loading, setLoading] = useState(false)
  const listRef = useRef<any>()
  const chatTimer = useRef<any>(null)
  const selectoptions = [
    {label: '10s', value: 10},
    {label: '30s', value: 30},
    {label: '60s', value: 60},
    {label: '两分钟', value: 120},
    {label: '五分钟', value: 300},
    {label: '半个小时', value: 1800},
    {label: '暂停刷新', value: 0},
  ]
  const handleUpdateRecord = async (record: TableListItem) => {
    setLoading(true)
    formRef?.current?.resetFields();
    setType(1)
    setCurrentRow(record);
    handleModalVisible(true);
    setContent('')
    const res = await getDetailRule({form: record.form})
    setLoading(false)
      if (res.code === 200) {
        setHistoryList(res.data)
    }
    listRef.current.scrollTop = listRef.current.scrollHeight
  };

  const getCurrentTime = (time: any) => {
    clearInterval(timer.current)
    let ctime = Number(time)
    if (!isNaN(ctime) && ctime) {
      timer.current = setInterval(() => {
        ctime -= 1
        if (ctime === 0) {
          ctime = Number(time)
          actionRef.current?.reload?.();
        }
        setFreshTime(ctime)
      }, 1000)
    }
  }

  const onchangeSelect = (e: string) => {
    setselectValue(e)
    getCurrentTime(e)
  }

  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: '唯一的 key',
      hideInTable: true,
    },
    {
      title: '发送人手机号',
      dataIndex: 'phone',
      width: 150,
      render: (_, record) => {
        return <b>{record.phone}</b>
      }
    },
    {
      title: '发送人Id',
      dataIndex: 'form',
      width: 150,
      hideInTable: true,
    },
    {
      title: '最新消息内容',
      dataIndex: 'content',
      render: (_, record) => {
        return (
          <>
          {
            record.type == 1 ? <p style={{color: '#f55c51'}}>{record.content}</p> : <Image src={record.content} width={120} height={120} style={{ objectFit: 'contain' }} />
          }
          </>
        );
      },
    },
    {
      title: '接收人Id',
      dataIndex: 'to',
      width: 150,
      hideInTable: true,
    },
    {
      title: '接收人头像',
      dataIndex: 'toPhoto',
      width: 150,
      hideInTable: true,
      render: (_, record) => {
        return (
          <Image src={record.toPhoto} width={120} height={120} style={{ objectFit: 'contain' }} />
        );
      },
    },
    {
      title: '发送时间',
      dataIndex: 'createTime',
      width: 150,
      render: (_, record) => {
        return <p style={{color: '#999'}}>{record.createTime}</p>
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
      fixed: 'right',
      hideInDescriptions: true,
      render: (_, record) => [
        <Badge dot={!record.stat} key="update">
          <Button
            onClick={() => {
              handleUpdateRecord(record);
            }}
            type='link'
            size='middle'
          >
            去回复
          </Button>
        </Badge>,
      ],
    },
  ];
  const updateHistory = async () => {
    const oldHistory = [...historyList]
    const hisRes = await getDetailRule({form: currentRow?.form})
    if (hisRes.code === 200) {
        setHistoryList(hisRes.data)
    }
    if (oldHistory.length !== hisRes.data.length) {
        listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }
  const handleOk = async (ptype?: number, pcontent?: string) => {
    if (!pcontent && !trim(content)) {
      return
    }
    try {
      const res = await replayRule({
        content: pcontent || content,
        to: currentRow?.form,
        type: ptype || type,
      });
      if (res.code === 200) {
        setContent('')
        setType(1)
        formRef?.current?.resetFields();
        const hisRes = await getDetailRule({form: currentRow?.form})
        if (hisRes.code === 200) {
            setHistoryList(hisRes.data)
        }
        listRef.current.scrollTop = listRef.current.scrollHeight
      }
      return true;
    } catch (error) {
      message.error('操作失败，请重试');
      return false;
    }
  };

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
        .then(async (data: any) => {
          const _response = { name: file.name, status: 'done', path: data.data };
          setType(2)
          setContent(data.data)
          //请求成功后把file赋值上去
          onSuccess(_response, file);
          await handleOk(2, data.data)
        })
        .catch(onError);
    },
  };

  const onchangeUpload = (data: any) => {
    const { fileList } = data
    if (!fileList.length) {
      setType(1)
      setContent('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        handleOk()
      }
  }

  useEffect(() => {
    getCurrentTime(selectValue)
    return () => {
      clearInterval((timer as any).current)
      clearInterval(chatTimer.current)
    }
  }, [])

  useEffect(() => {
    if (createModalVisible) {
      chatTimer.current = setInterval(() => {
        updateHistory()
      }, 10000)
    } else {
      clearInterval(chatTimer.current)
    }
  }, [createModalVisible])


  return (
    <PageContainer>
      <div className={style.countTimeWrapper}>
        <span className={style.pinlv}>刷新频率</span>
        <Select placeholder='请选择刷新频率' style={{width: 120, marginRight:  '12px'}} onChange={(e) => onchangeSelect(e)} value={selectValue}>
        {
          selectoptions.map(item => {
            return <Select.Option key={item.value}>{item.label}</Select.Option>
          })
        }
        </Select>
        {
          Number(selectValue) ? <Button type='primary' className={style.countTime}>将在{freshTime}秒后刷新</Button> : null
        }
      </div>
      <ProTable<TableListItem, TableListPagination>
        actionRef={actionRef}
        rowKey="id"
        search={false}
        dateFormatter="string"
        pagination={{
          pageSize: 10,
        }}
        request={async (params: TableListPagination) => {
          const res: any = await rule({ pageNum: params.current, pageSize: params.pageSize });
          return {
            data: res?.data?.list || [],
            page: res?.data?.pageNum,
            success: true,
            total: res?.data?.totalSize,
          };
        }}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      <Modal
        title={<div>与<b>{currentRow?.phone}</b>的聊天记录</div>}
        visible={createModalVisible}
        width={700}
        onOk={() => handleOk()}
        onCancel={() => handleModalVisible(false)}
        okText='回复'
        cancelText='关闭'
      >
        <ProForm formRef={formRef} submitter={false}>
          <div className={style.list} ref={listRef}>
            {
              loading ? <PageLoading /> : 
            <>
              {
                historyList.map((item: any) => {
                  return <div className={`${style.listItem} ${item.form == 1 ? style.specialClass : ''}`} key={item.createTime}>
                  {
                    item.form == 1 ? <>
                    <div className={style.content}>
                      <p>{item.createTime}</p>
                      {item.type == 1 ? item.content : <Image className={style.contentImg} src={item.content} />}
                    </div>
                    <img className={style.avatar} src={item.formPhoto || 'http://img.zhengtaixinnengyuan.com/images/2023-06-11/b03b0934833b48748fa472378bca45c9.png'} /></> : 
                    <><img className={style.avatar} src={item.formPhoto && item.formPhoto !== '1' ? item.formPhoto : 'http://img.zhengtaixinnengyuan.com/images/2023-06-09/c705b8dff6ad476f98b97c1708b63fb4.png'} alt='无'/>
                  <div className={style.content}>
                    <p>{item.createTime}</p>
                    {item.type == 1 ? item.content : <Image className={style.contentImg} src={item.content} />}
                  </div></>
                  }
                </div>
                })
              }
              </>
            }
          </div>
          <div className={style.replyContent}>
            <ProFormUploadButton
              max={1}
              name="image"
              title='图片'
              onChange={onchangeUpload}
              fieldProps={{
                ...Upload,
              }}
            />
            <Input.TextArea placeholder='请输入回复内容(enter键可快速回复)' onKeyDown={(e) => handleKeyDown(e)} rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
        </ProForm>
      </Modal>
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
        {currentRow?.id && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
