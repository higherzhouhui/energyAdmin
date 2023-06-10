// https://umijs.org/config/
import { join } from 'path';
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      redirect: '/home/list',
    },
    {
      path: '/home',
      icon: 'home',
      name: 'home',
      routes: [
        {
          path: '/home',
          redirect: '/home/list',
        },
        {
          name: 'home-list',
          path: '/home/list',
          component: './home/list',
        },
      ],
    },
    {
      path: '/user',
      icon: 'User',
      name: 'user',
      routes: [
        {
          path: '/user',
          redirect: '/user/list',
        },
        {
          name: 'user-list',
          path: '/user/list',
          component: './user/list',
        },
      ],
    },
    {
      path: '/user',
      layout: true,
      routes: [
        {
          path: '/user/login',
          layout: false,
          name: 'login',
          component: './user/Login',
        },
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          name: 'register-result',
          icon: 'smile',
          path: '/user/register-result',
          component: './user/register-result',
        },
        {
          name: 'register',
          icon: 'smile',
          path: '/user/register',
          component: './user/register',
        },
        {
          component: '404',
        },
      ],
    },
    {
      path: '/datamanage',
      icon: 'BarChartOutlined',
      name: 'datamanage',
      routes: [
        {
          path: '/datamanage',
          redirect: '/datamanage/noticelist',
        },
        {
          name: 'datamanage-noticelist',
          path: '/datamanage/noticelist',
          component: './datamanage/noticelist',
        },
        {
          name: 'datamanage-bannerlist',
          path: '/datamanage/bannerlist',
          component: './datamanage/bannerlist',
        },
        {
          name: 'datamanage-newslist',
          path: '/datamanage/newslist',
          component: './datamanage/newslist',
        },
        {
          name: 'datamanage-projectlist',
          path: '/datamanage/projectlist',
          component: './datamanage/projectlist',
        },
        {
          name: 'datamanage-tuiguang',
          path: '/datamanage/tuiguang',
          component: './datamanage/list',
        },
        {
          name: 'datamanage-baseinfo',
          path: '/datamanage/baseinfo',
          component: './datamanage/baseinfo',
        },
        {
          name: 'datamanage-version',
          path: '/datamanage/version',
          component: './datamanage/version',
        },
        {
          name: 'datamanage-upload',
          path: '/datamanage/upload',
          component: './datamanage/upload',
        },
        {
          component: '404',
        },
      ],
    },
    {
      path: '/withdraw',
      icon: 'Transaction',
      name: 'withdraw',
      routes: [
        {
          path: '/withdraw',
          redirect: '/withdraw/list',
        },
        {
          name: 'withdraw-list',
          path: '/withdraw/list',
          component: './withdraw/list',
        },
      ],
    },
    {
      path: '/online',
      icon: 'Aliwangwang',
      name: 'online',
      routes: [
        {
          path: '/online',
          redirect: '/online/list',
        },
        {
          name: 'online-list',
          path: '/online/list',
          component: './online/list',
        },
      ],
    },
    // {
    //   path: '/progress',
    //   icon: 'pullRequest',
    //   name: 'progress',
    //   routes: [
    //     {
    //       path: '/progress',
    //       redirect: '/progress/list',
    //     },
    //     {
    //       name: 'progress-list',
    //       path: '/progress/list',
    //       component: './progress/list',
    //     },
    //     {
    //       name: 'progress-info',
    //       path: '/progress/mintInfo',
    //       component: './progress/mintInfo',
    //     },
    //     {
    //       name: 'progress-open',
    //       path: '/progress/open',
    //       component: './progress/open',
    //     },
    //     {
    //       component: '404',
    //     },
    //   ],
    // },
    {
      path: '/accounts',
      icon: 'Setting',
      name: 'account',
      routes: [
        {
          path: '/accounts',
          redirect: '/accounts/list',
        },
        {
          path: '/accounts/list',
          name: 'list',
          component: './accounts/list',
        },
        {
          path: '/accounts/add',
          name: 'add',
          component: './accounts/add',
        },
        {
          path: '/accounts/center',
          name: 'center',
          component: './accounts/percenter',
          hideInMenu: true,
        },
        {
          path: '/accounts/changepwd',
          name: 'changepwd',
          component: './accounts/changepwd',
          hideInMenu: true,
        },
        {
          path: '/accounts/changepwd-result',
          name: 'changepwd-result',
          component: './accounts/changepwd-result',
          hideInMenu: true,
        },
        {
          path: '/accounts/addaccount-result',
          name: 'addaccount-result',
          component: './accounts/changepwd-result',
          hideInMenu: true,
        },
        {
          component: '404',
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
