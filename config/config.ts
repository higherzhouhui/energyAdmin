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
      path: '/user',
      layout: false,
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
      path: '/account',
      icon: 'User',
      name: 'account',
      routes: [
        {
          path: '/account',
          redirect: '/account/list',
        },
        {
          name: 'account-list',
          path: '/account/list',
          component: './account/list',
        },
      ],
    },
    {
      path: '/netmanage',
      icon: 'cloudSync',
      name: 'netmanage',
      routes: [
        {
          path: '/netmanage',
          redirect: '/netmanage/message',
        },
        // {
        //   name: 'python-manage',
        //   path: '/netmanage/python',
        //   component: './netmanage/python',
        // },
        {
          name: 'message-manage',
          path: '/netmanage/message',
          component: './netmanage/message',
        },
        {
          name: 'message-manage-detail',
          path: '/netmanage/message/detail',
          component: './netmanage/message/detail',
          hideInMenu: true,
        },
        {
          name: 'message-manage-add',
          path: '/netmanage/message/add',
          component: './netmanage/message/add',
          hideInMenu: true,
        },
        {
          name: 'doc-manage',
          path: '/netmanage/document',
          component: './netmanage/document',
        },
        {
          name: 'doc-manage-detail',
          path: '/netmanage/document/detail',
          component: './netmanage/document/detail',
          hideInMenu: true,
        },
        {
          name: 'doc-manage-edit',
          path: '/netmanage/document/edit',
          component: './netmanage/document/edit',
          hideInMenu: true,
        },
      ],
    },
    {
      path: '/feedback',
      icon: 'book',
      name: 'feedback',
      routes: [
        {
          path: '/feedback',
          redirect: '/feedback/list',
        },
        {
          name: 'list-feedback',
          path: '/feedback/list',
          component: './feedback/list',
        },
      ],
    },
    {
      path: '/',
      redirect: '/account/list',
    },
    {
      component: '404',
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
