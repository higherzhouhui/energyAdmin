import { login } from '@/services/login/api';
import { LockOutlined, MobileOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, history, useIntl, useModel } from 'umi';

import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<any>({});
  const [type] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    console.log('userInfo:', userInfo);
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const { userName, pwd } = values;
      const msg = await login({
        userName,
        pwd,
      });
      if (msg.code === 'SUCCESS') {
        localStorage.setItem('tshs-token', msg?.data || '');
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      } else {
        message.error('账号或密码错误！');
      }
      console.log(msg);
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      message.error(defaultLoginFailureMessage);
    }
  };
  const { type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      {/* <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div> */}
      <div className={styles.content}>
        <LoginForm
          // logo={<img alt="logo" src="/logo.svg" />}
          title="X-因子后台"
          subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(admin/ant.design)',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                name="userName"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '账号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入账号"
                      />
                    ),
                  },
                  // {
                  //   pattern: /^1\d{10}$/,
                  //   message: (
                  //     <FormattedMessage
                  //       id="pages.login.phoneNumber.invalid"
                  //       defaultMessage="手机号格式错误！"
                  //     />
                  //   ),
                  // },
                ]}
              />
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                  type: 'password',
                }}
                name="pwd"
                placeholder={intl.formatMessage({
                  id: 'pages.login.pwd.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage id="pages.login.pwd.required" defaultMessage="请输入密码" />
                    ),
                  },
                  // {
                  //   pattern: /^1\d{10}$/,
                  //   message: (
                  //     <FormattedMessage
                  //       id="pages.login.phoneNumber.invalid"
                  //       defaultMessage="手机号格式错误！"
                  //     />
                  //   ),
                  // },
                ]}
              />
              {/* <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                phoneName="phone"
                name="phone_code"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  if (!phone) {
                    return;
                  }
                  if (phone === '17823285206' || phone === '17384087448') {
                    const res = await getFakeCaptcha(phone);
                    if (res.code === 200) {
                      message.success('获取验证码成功');
                    }
                  } else {
                    message.error('没有权限！');
                    return;
                  }
                }}
              /> */}
            </>
          )}

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
          </div>
        </LoginForm>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
