import WangEditor from '@/components/Editor';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Space } from 'antd';
import React, { useState } from 'react';
import { addRule } from '../service';
import { history } from 'umi';
import './style.less';
const MessageAdd: React.FC = () => {
  const [description, setDescriptaion] = useState('');
  const onChange = (str: string) => {
    setDescriptaion(str);
  };
  const handleClickSave = async () => {
    // 调用上传接口
    console.log(description);
    const res: any = await addRule({
      content: description,
    });
    if (res.success) {
      history.push('/netmanage/message');
    }
  };
  const handleClickCancel = () => {
    history.goBack();
  };
  return (
    <PageContainer>
      <div className="content">
        <WangEditor onChange={onChange} description={description} />
        <Space>
          <Button type="primary" onClick={handleClickSave}>
            保存
          </Button>
          <Button type="default" onClick={handleClickCancel}>
            取消
          </Button>
        </Space>
      </div>
    </PageContainer>
  );
};

export default MessageAdd;
