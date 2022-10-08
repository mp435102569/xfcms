<template>
    <div class="formBox">
        <el-form :rules="rules" :model="form" ref="FormRef" label-width="100px">
            <el-form-item label="商品分类" prop="isChoice">

                <el-cascader :placeholder="defaultCate" :props="form.value" @change="handleChange" />
            </el-form-item>
            <el-form-item label="商品名称" prop="name" style="width: 320px;">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="商品简介" prop="desc" style="width: 320px;">
                <el-input v-model="form.desc" type="textarea" />
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
                <el-input-number v-model="form.price" :min="1" :max="999" />
            </el-form-item>
            <el-form-item label="商品售卖价" prop="salePrice">
                <el-input-number v-model="form.salePrice" :min="1" :max="999" />
            </el-form-item>
            <el-form-item label="商品库存" prop="stock">
                <el-input-number v-model="form.stock" :min="1" :max="999" />
            </el-form-item>
            <el-form-item label="商品标签" prop="tag" style="width: 320px;">
                <el-input v-model="form.tag" />
            </el-form-item>
            <el-form-item label="上架状态">
                <el-radio-group v-model="form.state" class="ml-4">
                    <el-radio :label="0" size="large">上架</el-radio>
                    <el-radio :label="1" size="large">下架</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="商品主图" prop="imageUrl">
                <el-upload class="avatar-uploader" :headers="tk"
                    action="http://backend-api-02.newbee.ltd/manage-api/v1/upload/file" :show-file-list="false"
                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="详细内容" prop="textarea">
                <!-- <el-input v-model="form.textarea" maxlength="100" placeholder="请输入内容" show-word-limit type="textarea" /> -->
                <div ref='editor'></div>

            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import WangEditor from 'wangeditor'
import { storage } from '../assets/utils';
import { reactive, ref, onMounted, onBeforeMount } from 'vue'
import { ElMessage } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import api from '../api';
const form = reactive({
    name: '',
    desc: '',
    price: 0,
    salePrice: 0,
    stock: 0,
    tag: '',
    state: 0,
    textarea: '',
    imageUrl: '',
    value: {
        lazy: true,
        lazyLoad(node, resolve) {
            const { level = 0, value } = node
            api.categories({
                params: {
                    pageNumber: 1,
                    pageSize: 1000,
                    categoryLevel: level + 1,
                    parentId: value || 0
                }
            }).then(res => {
                const list = res.data.list
                const nodes = list.map(item => ({
                    value: item.categoryId,
                    label: item.categoryName,
                    leaf: level > 1
                }))
                resolve(nodes)
            })
        }
    }
});
let isChoice = ref(''),
    FormRef = ref(null),
    route = useRoute(),
    router = useRouter(),
    goodsId = ref(null),
    defaultCate = ref(''),
    classId = ref(''),
    editor = ref(null),
    deittorValue = ref('')
let tk = reactive({
    token: storage.get('tk', 302400000),
})
let uploadImgServer = 'http://backend-api-02.newbee.ltd/manage-api/v1/upload/file'
const state = reactive({
    uploadImgServer,
    token: tk || '',
    id: goodsId,
    defaultCate: '',
    goodForm: {
        goodsName: '',
        goodsIntro: '',
        originalPrice: '',
        sellingPrice: '',
        stockNum: '',
        goodsSellStatus: '0',
        goodsCoverImg: '',
        tag: ''
    }
})

onBeforeMount(() => {
    goodsId.value = route.params.id
    /* 表单回显数据 */
    if (goodsId.value == 1) return;
    api.goodsInfo(goodsId.value).then(data => {
        let { goods, firstCategory, secondCategory, thirdCategory } = data.data
        form.name = goods.goodsName;
        form.desc = goods.goodsDetailContent;
        form.price = goods.originalPrice;
        form.salePrice = goods.sellingPrice;
        form.stock = goods.stockNum;
        form.tag = goods.tag;
        form.state = goods.goodsSellStatus;
        form.textarea = goods.goodsDetailContent;
        form.imageUrl = goods.goodsCoverImg;
        defaultCate.value = `${firstCategory.categoryName}/${secondCategory.categoryName}/${thirdCategory.categoryName}`
        classId.value = thirdCategory.categoryId
    })
})
let instance;
onMounted(() => {
    instance = new WangEditor(editor.value)
    instance.config.showLinkImg = false
    instance.config.showLinkImgAlt = false
    instance.config.showLinkImgHref = false
    instance.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2M
    instance.config.uploadFileName = 'file'
    instance.config.uploadImgHeaders = {
        token: state.token
    }
    // 图片返回格式不同，需要自定义返回格式
    instance.config.uploadImgHooks = {
        // 图片上传并返回了结果，想要自己把图片插入到编辑器中
        // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
        customInsert: function (insertImgFn, result) {
            console.log('result', result)
            // result 即服务端返回的接口
            // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
            if (result.data && result.data.length) {
                result.data.forEach(item => insertImgFn(item))
            }
        }
    }
    instance.config.uploadImgServer = uploadImgServer
    Object.assign(instance.config, {
        onchange(value) {
            deittorValue.value = value
        },
    })
    instance.create()
})
const validateRank = (_, value, callback) => {
    if (!value) return callback(new Error("请输入排序序号~"));

    if (value < 1 || value > 300) {
        return callback(new Error("序号必须在1-300之间"));
    }
    callback();
};
const rules = {
    imageUrl: [
        { required: true, message: "请先上传图片", trigger: "blur" },
    ],
    price: [
        {
            required: true,
            message: "请输入价格",
            trigger: "blur",
        },
    ],
    salePrice: [
        {
            required: true,
            message: "请输入售卖价格",
            trigger: "blur",
        },
    ],
    tag: [
        {
            required: true,
            message: "商品标签未填",
            trigger: "blur",
        },
    ],
    textarea: [
        {
            required: true,
            message: "商品详细内容未填写",
            trigger: "blur",
        },
    ],
    name: [
        {
            required: true,
            message: "商品名称未填写",
            trigger: "blur",
        },

    ],
    stock: [
        {
            required: true,
            message: "商品库存为必填项",
            trigger: "blur",
        },

    ],
    desc: [
        {
            required: true,
            message: "请填写商品简介",
            trigger: "blur",
        },

    ],
};
const onSubmit = () => {
    if (!isChoice.value && goodsId.value == 1) {
        ElMessage.error('请先选择分类');
        return;
    }
    FormRef.value.validate(async (valid, fields) => {
        if (goodsId.value == 1) {
            let { resultCode } = await api.goods({
                goodsCategoryId: isChoice.value,
                goodsCoverImg: form.imageUrl,
                goodsDetailContent: deittorValue.value,
                goodsIntro: form.desc,
                goodsName: form.name,
                goodsSellStatus: form.state,
                originalPrice: form.price,
                sellingPrice: form.salePrice,
                stockNum: form.stock,
                tag: form.tag,
            })
            if (resultCode == 200) {
                ElMessage.success('新增成功');
                router.back();
                return;
            }
            ElMessage.error('有数据未填写');
            return;
        }

        /* 这里是修改 */
        let { resultCode } = await api.EditGoods({
            goodsCategoryId: classId.value,
            goodsCoverImg: form.imageUrl,
            goodsDetailContent: form.textarea,
            goodsId: goodsId.value,
            goodsIntro: form.desc,
            goodsName: form.name,
            goodsSellStatus: form.state,
            originalPrice: form.price,
            sellingPrice: form.salePrice,
            stockNum: form.stock,
            tag: form.tag,
        })
        if (resultCode == 200) {
            ElMessage.success('修改成功');
            router.back();
        }
    }
    )
}
const handleChange = (value) => {
    isChoice.value = value[2]
    console.log(isChoice.value);
}
const handleAvatarSuccess = (
    response,
    uploadFile
) => {
    form.imageUrl = URL.createObjectURL(uploadFile.raw)
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

</script>

<style lang="less" scoped>
.formBox {
    height: 750px;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
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
</style>
<style>
.editor {
    line-height: normal !important;
    height: 800px;
}

.ql-snow .ql-tooltip[data-mode=link]::before {
    content: "请输入链接地址:";
}

.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode=video]::before {
    content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: '14px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    content: '10px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    content: '18px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '文本';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: '标题1';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: '标题2';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: '标题3';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: '标题4';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: '标题5';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: '标准字体';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    content: '衬线字体';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    content: '等宽字体';
}
</style>