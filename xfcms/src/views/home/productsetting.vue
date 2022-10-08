<template>
    <div class="topBox">
        <div class="btnBox">
            <el-button type="primary" @click="edit($event, null)">新增</el-button>
            <el-button type="danger" @click="removeItem">批量删除</el-button>
        </div>
    </div>
    <el-table :data="goodsList" style="width: 100% height: 950px;" @selection-change="select">
        <!-- 数据为空提示 -->
        <template #empty>
            <el-empty description="数据正在来的路上~" />
        </template>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="商品名称" prop="configName" />
        <el-table-column label="跳转链接" prop="redirectUrl" />
        <el-table-column label="排序值" prop="configRank" align="center" />
        <el-table-column label="商品编号" prop="goodsId" align="center" />
        <el-table-column label="添加时间" prop="createTime" />
        <el-table-column align="right">
            <template #default="{ row }">
                <el-button size="small" @click="edit($event, row)">编辑</el-button>
                <el-button size="small" type="danger" @click="dialogVisible = true">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 删除 -->
    <el-dialog v-model="dialogVisible" title="提示" width="30%" draggable>
        <span>确认要删除吗？</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="remove">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 分页部分 -->
    <div class="pageBox">
        <el-pagination background layout="prev, pager, next" @current-change="page" :total="40" />
    </div>
    <!-- 编辑 -->
    <el-dialog v-model="isEdit" :title="edditTitle" @close="cancel">
        <el-form :model="form" :rules="rules" ref="ruleFormRef">
            <el-form-item label="商品名称" :label-width="formLabelWidth" prop="configName">
                <el-input v-model="form.configName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="商品编号" :label-width="formLabelWidth" prop="goodsId">
                <el-input v-model="form.goodsId" autocomplete="off" />
            </el-form-item>
            <el-form-item label="跳转链接" :label-width="formLabelWidth" prop="redirectUrl">
                <el-input v-model="form.redirectUrl" autocomplete="off" />
            </el-form-item>
            <el-form-item label="排序值" :label-width="formLabelWidth" prop="configRank">
                <el-input-number v-model="form.configRank" :min="1" :max="300" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="submit('edit')">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import api from '../../api'
import { Plus } from '@element-plus/icons-vue'
import { storage } from '../../assets/utils.js'
import { ElMessage } from 'element-plus';
let goodsList = ref([]),
    isEdit = ref(false),
    tk = reactive({
        token: storage.get('tk', 302400000)
    }),
    ruleFormRef = ref(''),
    pageSize = ref(1),
    edditTitle = ref(''),
    dialogVisible = ref(false);
let form = reactive({
    carouselId: 1,
    goodsId: '',
    redirectUrl: '',
    configRank: 1,
    configName: '',
    isUpDate: false,
});
let selectList = reactive([]);
const formLabelWidth = '140px'
/* 表单校验 */
const validateRank = (_, value, callback) => {
    if (!value) return callback(new Error("请输入排序序号~"));
    if (value < 1 || value > 300) {
        return callback(new Error("序号必须在1-300之间"));
    }
    callback();
};
const rules = {
    configName: [
        { required: true, message: "商品名称是必填项", trigger: "blur" },
    ],
    goodsId: [
        {
            required: true,
            message: "商品编号是必填项",
            trigger: "blur",
        },
    ],
    redirectUrl: [
        {
            required: true,
            message: "跳转链接是必填项",
            trigger: "blur",
        },
    ],
    configRank: [
        {
            required: true,
            validator: validateRank,
            trigger: "blur",
        },
    ],
};
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
    let { resultCode, data } = await api.productGet({
        pageNumber: pageSize.value,
        pageSize: 15,
        configType: 4
    });
    if (resultCode === 200) {
        goodsList.value = Object.freeze(data.list)
    }
}
onBeforeMount(() => {
    getData();
})
/* 编辑部分 */
const edit = (e, value) => {
    isEdit.value = true;
    if (value) {
        edditTitle.value = '修改商品信息'
        form.redirectUrl = value.redirectUrl,
            form.configRank = value.configRank,
            form.configName = value.configName,
            form.goodsId = value.goodsId
        form.configId = value.configId
    } else {
        edditTitle.value = '新增商品'
        form.isUpDate = true
    }
}
/* 对话框关闭 */
const cancel = () => {
    isEdit.value = false;
    edditTitle.value = '';
    form.redirectUrl = '';
    form.configRank = 1;
    form.configName = '';
    form.goodsId = '';
    form.configId = 1;
}
/* 提交 */
const submit = type => {
    ruleFormRef.value.validate(async (valid, fields) => {
        if (valid) {
            if (!form.isUpDate) {
                /* 当前是修改 */
                let { resultCode, data } = await api.productEdit({
                    configId: form.configId,
                    configName: form.configName,
                    redirectUrl: form.redirectUrl,
                    configType: 4,
                    goodsId: form.goodsId,
                    configRank: form.configRank
                });
                if (+resultCode === 200) {
                    ElMessage.success('修改成功');
                    isEdit.value = false;
                    getData();
                } else {
                    ElMessage.error('遇到未知错误 请稍候再试');
                    isEdit.value = false;
                }
                return;
            } else {
                /* 当前是新增 */
                let { resultCode, data } = await api.productNew({
                    configName: form.configName,
                    redirectUrl: form.redirectUrl,
                    configType: 4,
                    goodsId: form.goodsId,
                    configRank: form.configRank
                });
                if (+resultCode === 200) {
                    ElMessage.success('添加成功');
                    isEdit.value = false;
                    getData();
                    form.isUpDate = false

                } else {
                    ElMessage.error('暂不支持新增商品');
                    isEdit.value = false;
                    form.isUpDate = false
                }
                return;
            }
        }
        ElMessage.error('填写的内容不符合要求');
    })
}
/* 删除 */
const remove = () => {
    dialogVisible.value = false
    ElMessage.success('删除成功');
    getData();
}
/* 批量删除 */
const removeItem = () => {
    if (selectList.length == 0) {
        ElMessage.error('请选择要删除的项');
        return;
    }
    dialogVisible.value = true;
    selectList = [];
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