<template>
  <div>
    <div class="login-container">
      <div class="login-box">
        <!-- 头像区域 -->
        <div class="avatar-box">
          <img src="../../assets/img/logo.jpg" alt="" />
        </div>
        <!-- 表单区域 -->
        <el-form
          label-width="0px"
          class="login-form"
          :model="loginForm"
          :rules="loginRules"
          ref="loginForm"
        >
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              prefix-icon="iconfont icon-yonghuming"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="loginForm.password"
              prefix-icon="iconfont icon-mima"
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="Validate">登录</el-button>
            <el-button type="info" @click="resetFields">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getLogin } from 'network/login.js'
export default {
  components: {},
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    async _getLogin() {
      let name = this.loginForm.username
      let password = this.loginForm.password
      const res = await getLogin(name, password)
      if (res.meta.status !== 200) {
        return this.$message.error('登录失败')
      }
      this.$message.success('登录成功')
      window.sessionStorage.setItem('token', res.data.token)
      this.$router.push('/home')
    },

    resetFields() {
      this.$refs.loginForm.resetFields()
    },
    Validate() {
      this.$refs.loginForm.validate((res) => {
        if (!res) return
        this._getLogin()
      })
    },
  },
}
</script>
<style lang="less" scoped>
@import '~assets/less/variable.less';
@import '~assets/less/mixin.less';
.login-container {
  background-color: @color-background;
  height: 100vh;

  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    .poc();
    .avatar-box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .btns {
      display: flex;
      justify-content: flex-end;
    }
    .login-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
}
</style>
