import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { getRule } from '../service';
import { history, useLocation } from 'umi';
import './style.less';

const MessageDetail: React.FC = () => {
  const [description, setDescriptaion] = useState('');
  const location: any = useLocation();

  const getDocument = async () => {
    const id: string = location?.query?.id
    const res: any = await getRule(id);
    if (res.success) {
      setDescriptaion(res.data.content);
    }
  }

  useEffect(() => {
    getDocument()
  }, [])



  return (
    <PageContainer>
      <div className="back">
        <a onClick={() => history.push(`/netmanage/document/edit?id=${location?.query?.id}`)}>
          <Button>编辑</Button>
        </a>
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: description }} />
    </PageContainer>
  );
};

export default MessageDetail;
