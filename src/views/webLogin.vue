<template>
  <div class="login-container">
    <div class="login-box">
      <h2>用户登录</h2>
      <el-form :model="form" class="login-form"  ref="loginForm" :rules="rules">
        <el-form-item>
          <el-input
            v-model="form.account"
            placeholder="请输入手机号"
            :prefix-icon="User"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleLogin"
            style="width: 100%"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
      <p class="tip">请输入手机号和密码进行登录</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { loginApi, getDeviceIdentity } from '@/network/apis/login'
import type { LoginParams } from '@/types/login'

const router = useRouter()
const loading = ref(false)
const loginForm = ref<FormInstance>()

const form = reactive<LoginParams>({
  account: '',
  password: '',
  identity: getDeviceIdentity()
})

const rules: FormRules = {
  account: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号格式',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 16, message: '密码长度在 8 到 16 个字符', trigger: 'blur' }
  ]
}


const handleLogin = async () => {
  console.log('登录', form)

  if (!loginForm.value) {
    ElMessage.error('请完善用户名或密码信息')
    console.log(loginForm.value)

    return
  }

  try {
    await loginForm.value.validate()
    console.log('验证通过')
  } catch (error) {
    ElMessage.error('请完善登录信息')
    console.log('表单验证失败:', error)
    return
  }

  loading.value = true
  try {
    const loginParams: LoginParams = {
      account: form.account,
      password: form.password,
      identity: form.identity
    }
    console.log('发送登录请求:', loginParams)
    const response = await loginApi(loginParams)
    console.log('登录响应:', response)

    // 登录成功
    if (response.code === 200) {
      const { token, refreshToken, id } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('userId', id.toString())
      localStorage.setItem('isLoggedIn', 'true')
      ElMessage.success('登录成功')
      console.log(token, refreshToken, id)
      router.push('/homePage')
    }
  } catch (error :any) {
    console.error('登录错误:', error)
    ElMessage.error(error.message || '登录失败，请重试')
  } finally {
    loading.value = false
  }

}
</script>

<style scoped>
.login-container {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 400px;
}

.login-box h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.login-form {
  margin-bottom: 20px;
}

.tip {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin: 0;
}
</style>
