import { Button, Card, Form, Input, message, Popover, Progress, Select } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { fakeChangePwd } from './service';

import { PageContainer } from '@ant-design/pro-layout';
import md5 from 'js-md5';
import { history } from 'umi';
import styles from './style.less';
const FormItem = Form.Item;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <span>强度：强</span>
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <span>强度：中</span>
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <span>强度：太短</span>
    </div>
  ),
};

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

const AddAccount: FC = () => {
  const [visible, setVisible]: [boolean, any] = useState(false);
  const [popover, setPopover]: [boolean, any] = useState(false);
  const [submitting, setsubmitting]: [boolean, any] = useState(false);
  const confirmDirty = false;
  let interval: number | undefined;
  const [form] = Form.useForm();
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [interval],
  );

  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  const onFinish = (values: any) => {
    console.log(values);
    const param = {
      password: md5(values.password),
      confirm_password: md5(values.confirm_password),
      nick_name: values.nick_name,
      status: values.status * 1,
      user_name: values.user_name,
    };
    const hide = message.loading('正在创建新用户...', 50);
    setsubmitting(true);
    fakeChangePwd(param)
      .then((res: any) => {
        hide();
        setsubmitting(false);
        if (res.errno === 200) {
          history.push({
            pathname: '/accounts/addaccount-result',
            state: {
              username: param.user_name,
            },
          });
        }
      })
      .catch(() => {
        hide();
        setsubmitting(false);
      });
  };

  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('password')) {
      return promise.reject('两次输入的密码不匹配!');
    }
    return promise.resolve();
  };

  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      setVisible(!!value);
    }
    // 有值的情况
    if (!visible) {
      setVisible(!!value);
    }
    setPopover(!popover);
    if (value.length < 6) {
      return promise.reject('');
    }
    if (value && confirmDirty) {
      form.validateFields(['password']);
    }
    return promise.resolve();
  };

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <PageContainer>
      <Card bordered={false}>
        <div className={styles.main}>
          <Form form={form} name="addaccount" onFinish={onFinish} initialValues={{ status: '0' }}>
            <p>
              账号<i>*</i>
            </p>
            <FormItem
              name="user_name"
              className={
                form.getFieldValue('user_name') &&
                form.getFieldValue('user_name').length > 0 &&
                styles.password
              }
              rules={[
                {
                  required: true,
                  message: '请输入账号',
                },
              ]}
            >
              <Input type="text" placeholder="请输入账号" />
            </FormItem>
            <p>
              用户名<i>*</i>
            </p>
            <FormItem
              name="nick_name"
              className={
                form.getFieldValue('nick_name') &&
                form.getFieldValue('nick_name').length > 0 &&
                styles.password
              }
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <Input type="text" placeholder="请输入名称" />
            </FormItem>
            <p>
              状态<i>*</i>
            </p>
            <FormItem
              name="status"
              rules={[
                {
                  required: true,
                  message: '请选择状态',
                },
              ]}
            >
              <Select placeholder="启用">
                <Select.Option value="0">启用</Select.Option>
                <Select.Option value="1">禁用</Select.Option>
              </Select>
            </FormItem>
            <Popover
              getPopupContainer={(node) => {
                if (node && node.parentNode) {
                  return node.parentNode as HTMLElement;
                }
                return node;
              }}
              content={
                visible && (
                  <div style={{ padding: '4px 0' }}>
                    {passwordStatusMap[getPasswordStatus()]}
                    {renderPasswordProgress()}
                    <div style={{ marginTop: 10 }}>
                      <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
                    </div>
                  </div>
                )
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={visible}
              style={{ marginLeft: '300px' }}
            >
              <p>
                密码<i>*</i>
              </p>
              <FormItem
                name="password"
                className={
                  form.getFieldValue('password') &&
                  form.getFieldValue('password').length > 0 &&
                  styles.password
                }
                rules={[
                  {
                    required: true,
                    message: '请输入密码',
                  },
                  {
                    validator: checkPassword,
                  },
                ]}
              >
                <Input
                  type="password"
                  placeholder="至少6位密码,区分大小写"
                  onBlur={() => setVisible(false)}
                />
              </FormItem>
            </Popover>
            <p>
              再次确认<i>*</i>
            </p>
            <FormItem
              name="confirm_password"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
                {
                  validator: checkConfirm,
                },
              ]}
            >
              <Input type="password" placeholder="确认密码" />
            </FormItem>
            <FormItem>
              <Button
                size="large"
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                <span>立即新增</span>
              </Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </PageContainer>
  );
};
export default AddAccount;
