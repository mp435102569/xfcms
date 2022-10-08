import { ElMessage } from 'element-plus';
import { createStore, createLogger } from 'vuex'
const env = process.env.NODE_ENV;
import api from '../api'
import { useRouter } from 'vue-router'
let router = useRouter();
/* 获取localStorage */
let state = JSON.parse(localStorage.getItem('state')) || {
  select: "/home/controlPanel",
  title: '控制面板',
  info: [],
  Pagetype:2,
};
/* vuex数据持久化 */
const myPlugin = (store) => {
    store.subscribe((mutations, state) => {
        localStorage.setItem("state", JSON.stringify(state));
    })
}
const store = createStore({
  state: state,
  getters: {},
  mutations: {
    setSelect(state, payload) {
      state.select = payload;
    },
    setTitle(state, payload) {
      state.title = payload;
    },
    setInfo(state, payload) {
      state.info = payload;
    },
    setPagetype(state, value) {
      state.Pagetype = value;
    },
  },
  actions: {
    /* 获取用户信息 */
    async getUserInfo({ commit }) {
      let { resultCode, data } = await api.userInfo();
      if (resultCode == 200) {
        commit("setInfo", data);
        return;
      }
      ElMessage.error('登录信息已过期,请重新登录');
      router.replace('/login');
    },
  },
  plugins: env !== "production" ? [createLogger(), myPlugin] : [],
});
/* vuex数据持久化方案二 */
// window.onbeforeunload = function () {
//   localStorage.setItem("state", JSON.stringify(store.state));
// }
export default store