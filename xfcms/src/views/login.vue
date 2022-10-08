<template>
    <div class="loginBox">
        <div class="formBox">
            <el-form :rules="rules" class="elForm" label-width="100px" ref="ruleFormRef" :model="formLabelAlign"
                style="max-width: 460px">
                <el-form-item label="用户名" prop="userName"
                required="true">
                    <el-input v-model="formLabelAlign.userName" />
                </el-form-item>
                <el-form-item label="密码" prop="passWord"
                required="true">
                    <el-input v-model="formLabelAlign.passWord" type="password" />
                </el-form-item>
                <el-form-item>
                    <el-checkbox label="记住密码" name="type" v-model="isSelect" />
                </el-form-item>
            </el-form>

            <el-button type="primary" color="#626aef" class="buttonLogin" :loading="loading" :disabled="disabled"
                @click="submit">登录</el-button>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref ,onBeforeMount} from 'vue'
import api from '../api'
import md5 from "md5"
import { storage } from '../assets/utils.js'
import {useRouter,useRoute} from 'vue-router'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
const router = useRouter(),
    route = useRoute(),
    store = useStore();
const formLabelAlign = reactive({
    userName: '',
    passWord: '',
    faslePass:'',
})

let ruleFormRef = ref(null),
    loading = ref(false),
    disabled = ref(false),
    isSelect = ref(false);
/* 获取用户保存的账号信息 */
onBeforeMount(() => {
  try {
      let { userName, passwordMd5 } = storage.get('user', 302400000);
      if (userName && passwordMd5) {
          formLabelAlign.userName = userName;
          formLabelAlign.passWord = '******';
          formLabelAlign.faslePass = passwordMd5;
          isSelect.value = true;
      }

  } catch (_) { }
})
/* 校验用户名 */
const validateName = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('用户名不能为空'));
        return;
    }
        callback()
}
/* 校验密码 */
const validatePass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('密码不能为空'));
        return;
    } 
        callback()
}
/* 表单校验 */
const rules = reactive({
    userName: [{ validator: validateName, trigger: 'blur' }],
    passWord: [{ validator: validatePass, trigger: 'blur' }],
})
/* 登录按钮 */
const submit = (value) => {
    ruleFormRef.value.validate((valid, fields) => {
        if (valid) {
            disabled.value = true;
            loading.value = true;
            /* 判断当前是否是保存过的用户信息 */
            if (formLabelAlign.passWord === '******') {
                formLabelAlign.passWord = formLabelAlign.faslePass;
            } else {
                formLabelAlign.passWord = md5(formLabelAlign.passWord);
            };
            api.login({
                userName: formLabelAlign.userName,
                passwordMd5: formLabelAlign.passWord
            }).then(value => {
                let { resultCode, data } = value;
                let { form } = route.query;
                if (+resultCode === 200) {
                    ElMessage({
                        message: '登录成功咯~',
                        type: 'success',
                    });
                    /* 判断用户是否选中记住密码 */
                    if (isSelect) {
                        storage.set('user', {
                            userName: formLabelAlign.userName,
                            passwordMd5: formLabelAlign.passWord
                        })
                    }
                    /* 存储token */
                    storage.set('tk', data);
                    /* 调用actions函数 存储用户信息 */
                    store.dispatch('getUserInfo');
                    /* 跳转页面 */
                    router.replace(form ? form : '/home/controller');
                 
                    return;
                } else {
                    ElMessage.error('登录发生错误');
                    disabled.value = false;
                    loading.value = false;
                }
          })
            
            return;
        }
     })

}
</script>

<style lang="less" scoped>


.loginBox{
    height: 100vh;
    width: 100vw;
    background-image: url(' https://images.pexels.com/photos/2523959/pexels-photo-2523959.jpeg');
    background-size: cover;
    /deep/.formBox{
   
        padding-top: 50px;
        margin: 0 auto;
        position: relative;
        top: 30%;
        background-color:#faffffc2;
        width: 500px;
        height:250px;
        border-radius:15px;
       /deep/ .elForm{
         color: #fff!important;
        }
        .buttonLogin{
            width: 200px;
            height: 40px;
            position: relative;
            top: 15px;
            left: 30%;
        }
    }
}
</style>