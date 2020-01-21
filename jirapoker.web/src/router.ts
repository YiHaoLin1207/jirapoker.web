import Vue from 'vue';
import VueRouter from 'vue-router';
import Main from '@/views/Main';
import Login from '@/views/Login';
import Home from '@/components/Home.vue';
import { JiraPoker, JiraPokerSingle } from '@/components/JiraPoker';

Vue.use(VueRouter);

/*
Developer's guildline
router name should be formatted as (TopPageName_SubPageName)_Action, which end with a EnumAction defined by permissions
*/
const routes = [
  {
    name: 'app',
    path: '/',
    redirect: '/zh-tw/login',
  },
  {
    name: 'login',
    path: '/:lang/login',
    component: Login,
  },
  {
    name: 'main',
    path: '/:lang',
    component: Main,
    children: [
      { path: 'home', name: 'home', component: Home, meta: { pageId: 1 } },
      { path: 'jira-poker', name: 'jira-poker', component: JiraPoker, meta: { pageId: 100 } },
      { path: 'jira-poker/single/:id', name: 'jira-poker-single', component: JiraPokerSingle, meta: { pageId: 100 } },
    ],
  },
];


export default new VueRouter({
  routes,
  mode: 'history',
});
