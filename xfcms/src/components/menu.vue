<template>

  <el-menu :router="true" active-text-color="hsl(180deg 73% 39%)" background-color="#545c64"
    class="el-menu-vertical-demo home-menu" :default-active="selectItem" text-color="#fff" @select="select">
    <div class="titleBox"><img src="https://s.weituibao.com/1582958061265/mlogo.png"
        style="width:50px; height:50px"><span>新峰商城CMS</span>
    </div>
    <el-sub-menu index="1">
      <template #title>
        <span><img class="iconSize" src="../assets/首页.png" alt="" style="vertical-align: middle">首页配置</span>
      </template>
      <el-menu-item v-for="item in state.homepage" :key="item" :index="item.path">
        <img class="iconSize" :src="'src/assets/'+ item.meta.icon" alt="">
        {{item.meta.title}}
      </el-menu-item>
    </el-sub-menu>


    <el-menu-item v-for="item in state.homeCildren" :key="item" :index="item.path">
      <img class="iconSize" :src="'src/assets/'+ item.meta.icon" alt="">
      <span>{{item.meta.title}}</span>
    </el-menu-item>
  </el-menu>


</template>
<script setup>
import {useStore} from 'vuex'
import { ref, onBeforeMount, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute(),
  router = useRouter(),
  store = useStore();
const state = reactive({
  homeCildren: [],
  homepage: [],
});
let selectItem = ref(store.state.select);

watch(() => selectItem, (set, get) => {
  console.log(set);
  selectItem.value = set
})


onBeforeMount(() => {
  let routes = router.getRoutes(),
    reg = /^\/home\/([a-zA-Z]+)$/;
  routes = routes.filter(item => reg.test(item.path));
   state.homepage = routes.filter(item => item.meta.issubset);
  state.homeCildren  = routes.filter(item => !item.meta.issubset)
})
const select = value => {
  store.commit('setSelect', value);
  selectItem.value = store.state.select
}
</script>
<style scoped>
.home-menu{
  height: 100%;
  width: 100%;}
a {
  color: #42b983;
}
.iconSize{
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.titleBox{
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #fff;
}
</style>
