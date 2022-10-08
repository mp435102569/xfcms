<template>
    <div class="topBox">
        <div class="btnBox">
            <el-button type="primary" @click="edit($event, null)">新增</el-button>
            <el-button type="danger" @click="removeItem">批量删除</el-button>
        </div>
    </div>
    <el-table :data="bannerList" style="width: 100%" @selection-change="select">
        <!-- 数据为空提示 -->
        <template #empty>
            <el-empty description="数据正在来的路上~" />
        </template>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="轮播图" prop="carouselUrl">
            <template #default="scope">
                <div>
                    <el-image fit="cover" :preview-teleported="true" style="width: 300px; height: 100px"
                        :src="scope.row.carouselUrl" :preview-src-list="[scope.row.carouselUrl]" />
                </div>
            </template>
        </el-table-column>
        <el-table-column label="跳转链接" prop="redirectUrl" />
        <el-table-column label="排序值" prop="carouselRank" align="center" />
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
        <el-pagination background layout="prev, pager, next" @current-change="page" :total="1000" />
    </div>
    <!-- 编辑 -->
    <el-dialog v-model="isEdit" :title="edditTitle" @close="cancel">
        <el-form :model="form" :rules="rules" ref="ruleFormRef">
            <el-form-item label="图片" :label-width="formLabelWidth" prop="carouselUrl">
                <el-upload class="avatar-uploader" action="http://backend-api-02.newbee.ltd/manage-api/v1/upload/file"
                    :headers="tk" accrpt=".png,.jpg,.webp,.jpeg,.gif" :show-file-list="false"
                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :on-error="upError">
                    <img v-if="form.carouselUrl" :src="form.carouselUrl" class="avatar-uploader-img" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>

            <el-form-item label="跳转链接" :label-width="formLabelWidth" prop="redirectUrl">
                <el-input v-model="form.redirectUrl" autocomplete="off" />
            </el-form-item>
            <el-form-item label="排序值" :label-width="formLabelWidth" prop="carouselRank">
                <el-input-number v-model="form.carouselRank" :min="1" :max="300" />
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
let bannerList = ref([]),
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
    redirectUrl: '',
    carouselRank: 1,
    carouselUrl: '',
    isUpDate: false,
});
let selectList = reactive([]);
const formLabelWidth = '140px'
/* 表单校验 */
const validateUrl = (_, value, callback) => {
    let reg =
        /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/;
    if (!value) return callback(new Error("图片链接是必填项"));
    if (!reg.test(value)) return callback(new Error("请输入正确的url地址"));
    callback();
};
const validateRank = (_, value, callback) => {
    if (!value) return callback(new Error("请输入排序序号~"));

    if (value < 1 || value > 300) {
        return callback(new Error("序号必须在1-300之间"));
    }
    callback();
};
const rules = {
    carouselUrl: [
        { required: true, message: "请先上传图片", trigger: "blur" },
    ],
    redirectUrl: [
        {
            required: true,
            validator: validateUrl,
            trigger: "blur",
        },
    ],
    carouselRank: [
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
    let { resultCode, data } = await api.bannerData({
        pageNumber: pageSize.value,
        pageSize: 10,
    });
    if (resultCode === 200) {
        bannerList.value = Object.freeze(data.list)
    }
}
onBeforeMount(() => {
    getData();
})
/* 编辑部分 */
const edit = (e, value) => {
    isEdit.value = true;
    if (value) {
        edditTitle.value = '修改轮播图'
        form.redirectUrl = value.redirectUrl,
            form.carouselRank = value.carouselRank,
            form.carouselUrl = value.carouselUrl
        form.carouselId = value.carouselId
    } else {
        edditTitle.value = '新增轮播图'
        form.isUpDate = true
    }
}
/* 对话框关闭 */
const cancel = () => {
    isEdit.value = false
    edditTitle.value = ''
    form.redirectUrl = '',
        form.carouselRank = 1,
        form.carouselUrl = ''
    form.carouselId = 1
}
/* 提交 */
const submit = type => {
    ruleFormRef.value.validate(async (valid, fields) => {
        if (valid) {
            if (!form.isUpDate) {
                /* 当前是修改 */
                let { resultCode, data } = await api.bannerUpdate({
                    carouselId: form.carouselId,
                    carouselUrl: form.carouselUrl,
                    redirectUrl: form.redirectUrl,
                    carouselRank: form.carouselRank
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
                let { resultCode, data } = await api.bannerNew({
                    carouselUrl: form.carouselUrl,
                    redirectUrl: form.redirectUrl,
                    carouselRank: form.carouselRank
                });
                if (+resultCode === 200) {
                    ElMessage.success('添加成功');
                    isEdit.value = false;
                    getData();
                    form.isUpDate = false

                } else {
                    ElMessage.error('遇到未知错误 请稍候再试');
                    isEdit.value = false;
                    form.isUpDate = false
                }
                return;
            }
        }
        ElMessage.error('填写的内容不符合要求');
    })
}
/* 图片上传 */
const handleAvatarSuccess = (
    response,
    uploadFile
) => {
    form.carouselUrl = URL.createObjectURL(uploadFile.raw)
    ElMessage.success('上传成功');
}
/* 图片校验 */
const beforeAvatarUpload = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('图片格式不正确');
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('上传文件超过规定大小');
        return false
    }
    return true
}
/* 图片上传失败 */
const upError = () => {
    ElMessage.error('上传失败 请稍后重试');
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