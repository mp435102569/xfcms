<template>
    <div class="topBox">
        <div class="btnBox">
            <el-input v-model="input" type="text" @keydown.enter="orderNo($event)"
                style="width: 200px; margin-right:20px;" placeholder="请输入订单号" />
            <el-select class="m-2" v-model="orderStatus" @change='selectOrder' style="margin-right: 20px;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button type="primary" @click="orderChange">配货完成</el-button>
            <el-button type="primary" @click="orderscheckOut">出库</el-button>
            <el-button type="danger" @click="close">关闭订单</el-button>
        </div>
    </div>
    <el-table :data="bannerList" style="width: 100%" @selection-change="select">
        <!-- 数据为空提示 -->
        <template #empty>
            <el-empty description="数据正在来的路上~" />
        </template>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="订单号" prop="orderNo" align="center">
        </el-table-column>
        <el-table-column label="订单总价" prop="totalPrice" align="center" />
        <el-table-column label="订单状态" prop="orderStatus" align="center">
            <template #default="{ row }">
                {{ orderStatus1[row.orderStatus] }}
            </template>
        </el-table-column>
        <el-table-column label="支付方式" prop="payType" align="center">
            <template #default='{ row }'>
                <span v-if="row.payType == 1">微信支付</span>
                <span v-else-if="row.payType == 2">支付宝支付</span>
                <span v-else>未支付</span>
            </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" />

        <el-table-column align="left" label="操作">
            <template #default="{ row }">
                <el-button size="small" @click="router.push('/home/order/orderDetil' + row.orderId)">订单详情</el-button>
                <el-button size="small" type="danger" v-if="row.orderStatus != -1" @click="close">关闭订单
                </el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页部分 -->
    <div class="pageBox">
        <el-pagination background layout="prev, pager, next" @current-change="page" :total="+labelPage" />
    </div>

</template>

<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import api from '../api'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
let bannerList = ref([]),
    pageSize = ref(1),
    input = ref(''),
    labelPage = ref(''),
    router = useRouter(),
    dialogVisible = ref(false);
let selectList = reactive([]),
    options = reactive([{
        value: '',
        label: '全部'
    }, {
        value: 0,
        label: '待支付'
    }, {
        value: 1,
        label: '已支付'
    }, {
        value: 2,
        label: '配货完成'
    }, {
        value: 3,
        label: '出库成功'
    }, {
        value: 4,
        label: '交易成功'
    }, {
        value: -1,
        label: '手动关闭'
    }, {
        value: -2,
        label: '超时关闭'
    }, {
        value: -3,
        label: '商家关闭'
    }]),
    orderStatus = ref('');
const orderStatus1 = {
    '0': '待支付',
    '1': '已支付',
    '2': '配货完成',
    '3': '出库成功',
    '4': '交易成功',
    '-1': '手动关闭',
    '-2': '超时关闭',
    '-3': '商家关闭'
}
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
const getData = async (orderNo, orderStatus) => {
    let { resultCode, data } = await api.ordersGet({
        pageNumber: pageSize.value,
        pageSize: 10,
        orderNo: orderNo || '',
        orderStatus: orderStatus || '',
    });
    if (resultCode === 200) {
        bannerList.value = Object.freeze(data.list)
        labelPage.value = data.totalPage
        console.log(bannerList.value);
    }
}
onBeforeMount(() => {
    getData();
})
const orderNo = ($event) => {
    getData($event.target.value)

}
const selectOrder = val => {
    getData('', val);
}
/* 关闭 */
const close = () => {
    ElMessage.error('暂时不支持此操作')
}
/* 配货 */
const orderChange = async () => {
    if (selectList.length == 0) {
        ElMessage.error('请选择项');
        return;
    }
    selectList = selectList.map(item => item.orderId);
    let { resultCode, message } = await api.orderscheckDone({
        ids: selectList
    })
    if (resultCode == 200) {
        ElMessage.success('配货完成');
        getData();
        return
    }
    ElMessage.error(message);
}
const orderscheckOut = async () => {
    if (selectList.length == 0) {
        ElMessage.error('请选择项');
        return;
    }
    selectList = selectList.map(item => item.orderId);
    let { resultCode, message } = await api.orderscheckOut({
        ids: selectList
    })
    if (resultCode == 200) {
        ElMessage.success('出库完成');
        getData();
        return
    }
    ElMessage.error(message);
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