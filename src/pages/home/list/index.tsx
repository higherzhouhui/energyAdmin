import { PageContainer } from '@ant-design/pro-layout';
import { Button, Radio, Table } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { TableListItem } from './data';
import { rule} from './service';
import { Line } from '@ant-design/charts';
import style from './style.less'
import * as XLSX from 'xlsx';
import { TableOutlined } from '@ant-design/icons';

const TableList: React.FC = () => {
  const [day, setDay] = useState(7)
  const [dataSource, setDataSource] = useState<TableListItem | any>({})
  const [loading, setLoading] = useState(true)
  const itemRef = useRef<any>()
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
    },
    {
      title: '人数',
      dataIndex: 'num',
    },
  ];
  const priceColumns = [
    {
      title: '日期',
      dataIndex: 'date',
    },
    {
      title: '金额',
      dataIndex: 'num',
    },
  ];
  const projectNumColumns = [
    {
      title: '日期',
      dataIndex: 'date',
    },
    {
      title: '个数',
      dataIndex: 'num',
    },
  ];
  const config = {
    height: 400,
    xField: 'date',
    yField: 'num',
    xAxis: {
      visible: true,
      position: 'bottom',
      label: {
        style: {
          fontSize: 12,
          fill: '#999',
        },
        formatter: (text: string) => text.replace('2023-', ''), // 使用 formatter 函数自定义刻度文本格式
      },
      line: {
        style: {
          stroke: '#EEE',
          lineWidth: 2,
        },
      },
    },
    point: {
      size: 5,
      shape: 'diamond',
    },
  };

  const getSummaryRow = (data: any[]) => {
    const ctotal = data.reduce((total, current) => {
      return total + Number(current.num);
    }, 0);
    // 自定义表格汇总行的内容
    const totalRow = (
      <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
        <Table.Summary.Cell index={1} className={style.ctotal}>{ctotal}</Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
    );
  
    return totalRow;
  };
  const userListRow = useMemo(() => getSummaryRow(dataSource?.userList || []), [dataSource]);
  const buyProjectPriceListRow = useMemo(() => getSummaryRow(dataSource?.buyProjectPriceList || []), [dataSource]);
  const buyProjectNumListRow = useMemo(() => getSummaryRow(dataSource?.buyProjectNumList || []), [dataSource]);
  const withdrawPriceListRow = useMemo(() => getSummaryRow(dataSource?.withdrawPriceList || []), [dataSource]);

  const export2Excel = (id: string, name: string) => {
    const exportFileContent = document.getElementById(id)!.cloneNode(true);
    const wb = XLSX.utils.table_to_book(exportFileContent, { sheet: 'sheet1' });
    XLSX.writeFile(wb, `${name}.xlsx`);
  };
  useEffect(() => {
    setLoading(true)
    rule({day: day}).then((res: any) => {
      if (res.code === 200) {
        (res?.data?.userList || []).map((item: any) => {
          item.num = parseInt(item.num)
        });
        (res?.data?.buyProjectPriceList || []).map((item: any) => {
          item.num = parseInt(item.num)
        });
        (res?.data?.buyProjectNumList || []).map((item: any) => {
          item.num = parseInt(item.num)
        });
        (res?.data?.withdrawPriceList || []).map((item: any) => {
          item.num = parseInt(item.num)
        });
        setDataSource(res.data)
      }
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [day])
  return (
    <PageContainer>
       <Radio.Group defaultValue={7} size="large" onChange={(e) => setDay(e.target.value)} buttonStyle="solid">
        <Radio.Button value={7}>最近7天</Radio.Button>
        <Radio.Button value={15}>最近15天</Radio.Button>
        <Radio.Button value={30}>最近30天</Radio.Button>
      </Radio.Group>
      <div className={style.main}>
        <div className={style.item} ref={itemRef}>
          <div className={style.topContent}>
            <div className={style.title}>实名会员统计</div>
            <Button size='middle' type='primary' onClick={() => export2Excel('userList', '实名会员统计')}><TableOutlined />导出Excel</Button>
          </div>
          {
            itemRef?.current?.clientWidth ? <Line {...config} smooth {...{data: dataSource?.userList, width: itemRef?.current?.clientWidth || 500}} /> : null
          }
          <Table 
            columns={columns} 
            dataSource={dataSource?.userList || []} 
            pagination={false} 
            scroll={{ y: 240 }} 
            loading={loading} 
            rowKey={'date'} 
            bordered 
            id='userList'
            summary={() => (
              userListRow
            )}
            />
        </div>
        <div className={style.item}>
          <div className={style.topContent}>
            <div className={style.title}>购买项目金额统计</div>
            <Button size='middle' type='primary' onClick={() => export2Excel('buyProjectPriceList', '购买项目金额统计')}><TableOutlined />导出Excel</Button>
          </div>
          {
            itemRef?.current?.clientWidth ? <Line {...config} smooth {...{data: dataSource?.buyProjectPriceList, width: itemRef?.current?.clientWidth || 500}} /> : null
          }
          <Table 
            columns={priceColumns} 
            dataSource={dataSource?.buyProjectPriceList || []} 
            pagination={false} 
            scroll={{ y: 240 }} 
            loading={loading} 
            rowKey={'date'} 
            bordered 
            id='buyProjectPriceList'
            summary={() => (
              buyProjectPriceListRow
            )}
            />
        </div>
        <div className={style.item}>
          <div className={style.topContent}>
            <div className={style.title}>购买项目数量统计</div>
            <Button size='middle' type='primary' onClick={() => export2Excel('buyProjectNumList', '购买项目数量统计')}><TableOutlined />导出Excel</Button>
          </div>
          {
            itemRef?.current?.clientWidth ? <Line {...config} smooth {...{data: dataSource?.buyProjectNumList, width: itemRef?.current?.clientWidth || 500}} /> : null
          }
          <Table 
            columns={projectNumColumns} 
            dataSource={dataSource?.buyProjectNumList || []} 
            pagination={false} 
            scroll={{ y: 240 }} 
            loading={loading} 
            rowKey={'date'} 
            bordered 
            id='buyProjectNumList'
            summary={() => (
              buyProjectNumListRow
            )}
            />
        </div>
        <div className={style.item}>
          <div className={style.topContent}>
            <div className={style.title}>提现金额统计</div>
            <Button size='middle' type='primary' onClick={() => export2Excel('withdrawPriceList', '提现金额统计')}><TableOutlined />导出Excel</Button>
          </div>
          {
            itemRef?.current?.clientWidth ? <Line {...config} smooth {...{data: dataSource?.withdrawPriceList, width: itemRef?.current?.clientWidth || 500}} /> : null
          }
          <Table 
            columns={priceColumns} 
            dataSource={dataSource?.withdrawPriceList || []} 
            pagination={false} 
            scroll={{ y: 240 }} 
            loading={loading} 
            rowKey={'date'} 
            bordered 
            id='withdrawPriceList'
            summary={() => (
              withdrawPriceListRow
            )}
            />
        </div>
      </div>
    </PageContainer>
  );
};

export default TableList;
