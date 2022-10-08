<template>
    <div class="topBox">
        <div class="btnBox">
            <el-button type="primary" @click="editFlag(0)">解除禁用</el-button>
            <el-button type="danger" @click="editFlag(1)">禁用账户</el-button>
        </div>
    </div>
    <el-table :data="userList" style="width: 100%" @selection-change="select">
        <!-- 数据为空提示 -->
        <template #empty>
            <el-empty description="数据正在来的路上~" />
        </template>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="昵称" prop="nickName">
        </el-table-column>
        <el-table-column label="登录名" prop="loginName" />
        <el-table-column label="身份状态" prop="lockedFlag" align="center">
            <template #default="{ row }">
                <div :style="row.lockedFlag == 0 ? 'color:#5daf34' : 'color:red'">{{
                        row.lockedFlag == 0 ? '正常' : '禁用'
                }}
                </div>
            </template>
        </el-table-column>
        <el-table-column label="是否注销" prop="isDeleted" align="center">
            <template #default="{ row }">
                <div :style="row.isDeleted == 0 ? 'color:#5daf34' : 'color:red'">{{
                        row.isDeleted == 0 ? '正常' : '禁用'
                }}
                </div>
            </template>
        </el-table-column>
        <el-table-column label="注册时间" prop="createTime" />
    </el-table>

    <!-- 分页部分 -->
    <div class="pageBox">
        <el-pagination background layout="prev, pager, next" @current-change="page" :total="1000" />
    </div>

</template>

<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import api from '../api'
import { Flag, Plus } from '@element-plus/icons-vue'
import { storage } from '../assets/utils.js'
import { ElMessage } from 'element-plus';
let userList = ref([]),
    pageSize = ref(1),
    edditTitle = ref(''),
    dialogVisible = ref(false);
let form = reactive({
    carouselId: 1,
    redirectUrl: '',
    carouselRank: 1,
    carouselUrl: '',
    isUpDate: false,
});
let selectList = reactive([]);
const formLabelWidth = '140px'

/* 分页切换 */
const page = (size) => {
    pageSize.value = size
    getData();
}
/* 选中 */
const select = (selection) => {
    selectList = selection
}

/* 获取数据 */
const getData = async () => {
    let { resultCode, data } = await api.users({
        pageNumber: pageSize.value,
        pageSize: 10,
    });
    if (resultCode === 200) {
        userList.value = Object.freeze(data.list)
        console.log(userList.value)
    }
}
onBeforeMount(() => {
    getData();
})
/* 禁用 & 解除禁用 */
const editFlag = async Flag => {
    if (+selectList.length === 0) {
        ElMessage.error('请选择项');
        return;
    }
    if (Flag === 0) {

        selectList = selectList.map(item => item.userId)
        console.log(selectList);
        let { resultCode } = await api.usersDisable(Flag, {
            ids: selectList
        })
        if (+resultCode === 200) {
            ElMessage.success('解除禁用成功');
            getData();
        }
        return;
    }
    selectList = selectList.map(item => item.userId)
    console.log(selectList);
    let { resultCode } = await api.usersDisable(Flag, {
        ids: selectList
    })
    if (+resultCode === 200) {
        ElMessage.success('禁用成功');
        getData();
    }
}


</script>

<style lang="less">
.pageBox {
    width: 100%;
    padding-left: 30%;
    z-index: 100;
    text-align: center;
    position: fixed;
    bottom: 20px;
    background-color: #fff;
}

.topBox {
    width: 100%;
    height: 60px;
    background-color: #fff;
    border-bottom: solid 1px #eee;

    .btnBox {
        float: left;
        line-height: 60px;
        margin-left: 20px;
    }

}

.avatar-uploader .el-upload {
    border: 1px dashed #eee;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

.avatar-uploader-img {
    display: block;
    box-sizing: border-box;
    width: 120px;
    height: 120px;
    line-height: 120px;
    font-size: 24px;
    color: #8c939d;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
}
</style>