import { PageContainer } from '@ant-design/pro-layout';
import { Button, Input, message, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { getPythonInfo, setPythonInfo } from './service';
import './style.less';
// const { Option } = Select;
const PythonManage: React.FC = () => {
  const [isChecked, setChecked] = useState(false);
  const [pinlv, setPinlv] = useState(0);
  // const [selectValue, setselectValue] = useState('1');
  const onChangeSwitch = (check: boolean) => {
    setChecked(check);
  };
  const [loading, setLoading] = useState(false);
  // const handleChangeSelect = (e: string) => {
  //   console.log(e);
  //   setselectValue(e);
  // };
  const handleChangeInput = (e: any) => {
    setPinlv(e.target.value);
  };

  const handleSubmit = () => {
    setLoading(true);
    setPythonInfo({
      state: isChecked,
      frequency: pinlv * 1,
    }).then((res: any) => {
      setLoading(false);
      message.success('设置成功！');
      console.log(res);
    });
  };
  const initData = () => {
    getPythonInfo().then((res: any) => {
      const data = res?.data || { state: true, frequency: 20 };
      setPinlv(data.frequency);
      setChecked(data.state);
    });
  };
  useEffect(() => {
    initData();
  }, []);
  return (
    <PageContainer>
      <div className="content">
        <div className="item">
          <div className="label">爬虫开关:</div>
          <Switch checked={isChecked} onChange={onChangeSwitch} />
        </div>
        {isChecked && (
          <div className="item">
            <div className="label">爬虫频率:</div>
            {/* <Select
              value={selectValue}
              style={{ width: 180, marginRight: '12px' }}
              onChange={handleChangeSelect}
            >
              <Option value="1">1</Option>
              <Option value="2">10</Option>
              <Option value="3">30</Option>
              <Option value="4">50</Option>
              <Option value="5">其他</Option>
            </Select>
            {selectValue === '5' && (
              <Input
                type="number"
                value={pinlv}
                onChange={handleChangeInput}
                style={{ width: 120, marginRight: '12px' }}
                min={1}
              />
            )} */}
            <Input
              type="number"
              value={pinlv}
              onChange={handleChangeInput}
              style={{ width: 120, marginRight: '12px' }}
              min={1}
            />
            <div className="unit">天/次</div>
          </div>
        )}

        <div className="item">
          <Button
            size="middle"
            type="primary"
            style={{ marginRight: '24px' }}
            onClick={handleSubmit}
            loading={loading}
          >
            保存
          </Button>
          <Button size="middle" onClick={() => initData()}>
            取消
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default PythonManage;
