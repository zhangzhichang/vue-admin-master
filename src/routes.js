import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'

import echarts from './views/charts/echarts.vue'

import configManager from './views/configmanager/configmanager.vue'

import utilsSiteManager from  './views/sweetzutils/sitemanager'
import utilsConfigManager from './views/sweetzutils/configmanager'
import utilsFileManager from './views/sweetzutils/filemanager'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    },
    {
        path: '/',
        component: Home,
        name: '导航一',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页' },
            { path: '/table', component: Table, name: 'Table' },
            { path: '/form', component: Form, name: 'Form' },
            { path: '/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '配置中心',
        iconCls: 'el-icon-setting',
        leaf: true,//只有一个节点
        children: [
            { path: '/configManager', component: configManager, name: '配置中心' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '工具管理',
        iconCls: 'el-icon-setting',
        children: [
            { path: '/utils/siteManager', component: utilsSiteManager, name: '站点管理' },
            { path:'/utils/configManager' ,component: utilsConfigManager , name: '配置管理'},
            { path:'/utils/fileManager' ,component: utilsFileManager , name: '文件管理'}
        ]
    }



    /*,{
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    }*/
];

export default routes;