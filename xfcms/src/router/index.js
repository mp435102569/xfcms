import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes';
import store from '../store/index'
import {storage} from '../assets/utils'
import { ElMessage } from 'element-plus';

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
});
/* 导航守卫 
router钩子函数   全局导航守卫--->路由守卫-->组件守卫
*/
router.beforeEach(async (to, from, next) => {
  store.commit("setSelect", to.path);
  /* 登录态校验 */
    let tk = storage.get("tk", 302400000);
  if (!tk && to.path !=='/login') {
    ElMessage.error('当前未登录');
    next(`/login?form=${to.path}`);
    return;
  }
  next();
})

router.afterEach(to => {
    /* 修改页面标题 */
  let { title } = to.meta;
  if (!title) {
       let arr = ["零", "一", "二", "三", "四", "五", "六"];
       title = `分类${arr[store.state.Pagetype]}级管理`;
  }
  if (title) {
    document.title = `新峰CMS管理系统 - ${title}`;
    store.commit('setTitle', title);
    
    }
  })
export default router;