<template>
    <div class="common-layout">
        <el-container class="layout-container-demo">
            <el-aside width="200px">

                <Menu></Menu>

            </el-aside>

            <el-container>
                <el-header style="text-align: right; font-size: 20px; background-color: #fff; font-weight: 600;">
                    <homehead />
                </el-header>

                <el-main style="background-color: #fff; margin:10px;">
                    <el-scrollbar height="750px" max-height="950px">
                        <!-- <keep-alive include=""> -->
                            <router-view></router-view>
                        <!-- </keep-alive> -->
                    </el-scrollbar>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import Menu from '../components/menu.vue'
import homehead from '../components/homeHead.vue'
import { useRouter } from 'vue-router';
import {useStore} from 'vuex'
import { onBeforeMount, ref, onMounted, computed } from 'vue'
let router = useRouter(),
    store = useStore();
onBeforeMount(async () => {
    store.dispatch('getUserInfo');
})
</script>

<style lang="less" scoped>

.common-layout{
background-color: #f8f4f4;
/deep/.headBox {
        background-color: hsl(0deg 0% 100%);
        border: solid 1px block;
    }
}
.middle {
    box-sizing: border-box;
    padding: 10px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
}
 
</style>