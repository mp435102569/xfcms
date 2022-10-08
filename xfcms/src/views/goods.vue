<template>
    <div class="topBox">
        <div class="btnBox">
            <el-button type="primary" @click="router.push('/home/NewGoods'+ 1)">新增商品</el-button>
        </div>
    </div>
    <el-table :data="bannerList" style="width: 100%" @selection-change="select">
        <!-- 数据为空提示 -->
        <template #empty>
            <el-empty description="数据正在来的路上~" />
        </template>
        <el-table-column label="商品编号" width="150" prop="goodsId" align="center">

        </el-table-column>
        <el-table-column label="商品名" width="100" prop="goodsName" />
        <el-table-column label="商品简介" width="150" prop="goodsIntro" align="center" />
        <el-table-column label="商品图片" prop="goodsCoverImg">
            <template #default="scope">
                <div>
                    <el-image fit="cover" :preview-teleported="true" style="width: 100%; height: 100px"
                        :src="scope.row.goodsCoverImg" :preview-src-list="[scope.row.goodsCoverImg]" />
                </div>
            </template>
        </el-table-column>
        <el-table-column label="商品库存" prop="stockNum" align="center" />
        <el-table-column label="商品售价" prop="sellingPrice" align="center" />
        <el-table-column label="上架状态" prop="goodsSellStatus" align="center">
            <template #default="{ row }">
                <div :style="row.goodsSellStatus == 0 ? 'color:#5daf34' : 'color:red'">{{
                row.goodsSellStatus == 0 ? '销售中' : '已下架'
                }}
                </div>
            </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
            <template #default="{ row }">
                <el-button size="small" @click="edit(row)">修改</el-button>
                <el-button size="small" @click="SellStatus(row)">{{ row.goodsSellStatus == 0
                ? '下架' : '上架'
                }}</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页部分 -->
    <div class="pageBox">
        <el-pagination background layout="prev, pager, next" @current-change="page" :total="1000" />
    </div>

</template>

<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import api from '../api'
import { storage } from '../assets/utils.js'
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router'
let bannerList = ref([]),
    isEdit = ref(false),
    router = useRouter(),
    tk = reactive({
        token: storage.get('tk', 302400000)
    }),
    ruleFormRef = ref(''),
    pageSize = ref(1),
    edditTitle = ref(''),
    dialogVisible = ref(false)
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
    let { resultCode, data } = await api.goodslist({
        pageNumber: pageSize.value,
        pageSize: 10,
    });
    if (resultCode === 200) {
        bannerList.value = Object.freeze(data.list)
        console.log(bannerList.value);
    }
}
const edit = (value) => {
    router.push('/home/NewGoods' + value.goodsId);
}
onBeforeMount(() => {
    getData();
})
const SellStatus = async (value) => {
    let code = value.goodsSellStatus;
    if (code == 0) {
        code = 1
    } else {
        code = 0
    };

    let { resultCode, data } = await api.goodsstatus(code, {
        ids: [value.goodsId]
    })
    if (resultCode == 200) {
        ElMessage.success(`${code == 0 ? '上架成功' : '下架成功'}`);
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