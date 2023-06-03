import WangEditor from '@/components/Editor';
import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, useLocation } from 'umi';
import { getRule, updateRule } from '../service';
import './style.less';
const MessageAdd: React.FC = () => {
  const [description, setDescriptaion] = useState('');
  const location: any = useLocation();
  const onChange = (str: string) => {
    setDescriptaion(str);
  };
  const handleClickSave = async () => {
    // 调用上传接口
    const res: any = await updateRule({
      id: location?.query?.id,
      content: description,
    });
    if (res.success) {
      history.goBack();
    }
  };
  const handleClickCancel = () => {
    history.goBack();
  };

  const getDocument = async () => {
    const id: string = location?.query?.id;
    const res: any = await getRule(id);
    if (res.success) {
      setDescriptaion(res.data.content);
    }
  };

  useEffect(() => {
    getDocument();
  }, []);

  return (
    <PageContainer>
      <div className="content">
        <WangEditor onChange={onChange} description={description} />
        <div className="btns">
          <Button type="primary" style={{ margin: '0 36px' }} onClick={handleClickSave}>
            保存
          </Button>
          <Button type="default" onClick={handleClickCancel}>
            取消
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default MessageAdd;
