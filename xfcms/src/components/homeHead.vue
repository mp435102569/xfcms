<template>
    <div class="headBOX">
        <el-page-header title="返回上一级" :content="title" @back="goBack" v-if="isShow" />

        <span class="title" v-else>{{ title }}</span>
        <el-popover v-model:visible="visible" trigger="focus" placement="bottom" title="用户信息" :width="250">
            <div @mouseleave="visible = !visible">
                <span>用户名: {{ userInfo.loginUserName }}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>账号: {{ userInfo.nickName }}</span>
                <el-button type="primary" style="margin:10px auto; position: relative; left: 20%; width: 150px;"
                    @click="centerDialogVisible = true">退出
                </el-button>
            </div>

            <template #reference>
                <div class="userInfo" @mouseenter="visible = !visible">
                    <svg t="1655125691345" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="2820" width="40" height="40">
                        <path
                            d="M504.59685925 253.55757036m-207.0452148 0a207.04521482 207.04521482 0 1 0 414.09042963 0 207.04521482 207.04521482 0 1 0-414.09042963 0Z"
                            p-id="2821" fill="#1baeae"></path>
                        <path
                            d="M856.54945185 647.38038517C656.42192592 519.8279111 658.4850963 519.8279111 514.42725925 519.8279111c-141.63057778 0-141.99466667 0-358.02074073 132.64971852-47.81700741 31.7970963-75.85185185 188.59804445-75.85185185 230.22554074 0 108.86257778 192.48165925 78.88592592 429.86761481 78.88592593s429.86761482 29.97665185 429.86761482-78.88592593c0.12136297-43.93339259-31.06891852-202.67614815-83.74044445-235.32278519z"
                            p-id="2822" fill="#1baeae"></path>
                    </svg>
                </div>
            </template>
        </el-popover>
        <!-- 对话框 -->
        <el-dialog v-model="centerDialogVisible" title="Notice" width="30%" destroy-on-close center>
            <template #header>
                提示
            </template>
            <div>
                <strong>确认要退出吗？</strong>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="outLogin">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>

</template>

<script setup>
import { defineProps, ref, watch, onBeforeMount,onMounted } from 'vue'
import { storage } from '../assets/utils';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
const store = useStore(),
    router = useRouter();
/* 监听标题变化 */
watch(() => store.state.title, (value) => {
    if (value == '首页') {
        let arr = ['零', '一', '二', '三', '四', '五', '六'];
        title.value = `分类${arr[store.state.Pagetype]}级管理`
        store.commit('setTitle', title.value);
        return;
    }
    title.value = value
    if (/分类[\w\W]+级管理/.test(title.value) || title.value == '订单详情') {
        isShow.value = true
    };
})
let title = ref(store.state.title),
    visible = ref(false),
    userInfo = ref([]),
    centerDialogVisible = ref(false),
    isShow = ref(false);

onBeforeMount(() => {
    if (/分类[\w\W]级管理/.test(title.value) || title.value == '订单详情') {
        isShow.value = true
    };
})
/* 获取vuex用户信息 */
watch(() => store.state.info, (set,get) => {
    userInfo.value = set
})
/* 退出登录 */
const outLogin = () => {
    centerDialogVisible.value = false;
    store.commit('setInfo', []);
    storage.remove('tk');
    router.replace('/login');
    ElMessage({
        message: '退出登录成功',
        type:'success'
    })
}
/* 返回上一级 */
const goBack = () => {
    router.back();
    isShow.value = false
}
</script>

<style lang="less" scoped>
.headBOX{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top:5px;
   
    // line-height: 40px;
    .title{
        font-weight: 600;
    }
    .popoverBox{
        width: 100px;
        height: 150px;
        display: block;
        background-color: pink;
    }
    .userInfo{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
}
</style>