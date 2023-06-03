import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import { history, useLocation } from 'umi';
import React, { useEffect, useState } from 'react';
import {getRule} from '../service';
import './style.less';

const MessageDetail: React.FC = () => {
  const [description, setDescriptaion] = useState('');
  const location: any = useLocation();
  const handleClickCancel = () => {
    history.goBack();
  };

  const getMessage = async () => {
    const id: string = location?.query?.id
    const res: any = await getRule(id);
    if (res.success) {
      setDescriptaion(res.data.content);
    }
  }

  useEffect(() => {
    getMessage()
  }, [])


  return (
    <PageContainer>
      <div className="back">
        <Button onClick={handleClickCancel}>
          返回
        </Button>
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: description }} />
    </PageContainer>
  );
};

export default MessageDetail;
