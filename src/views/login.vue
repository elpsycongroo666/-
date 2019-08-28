<template>
  <div class="login">
    <div class="container">
      <img src="../assets/QQ图片20190822151754.jpg" alt class="avatar" />
      <el-form
        :model="userForm"
        :rules="rules"
        ref="loginForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" prefix-icon="myicon myicon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="userForm.password" placeholder="请输入密码" prefix-icon="myicon myicon-key"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { login } from '@/api/login_index.js'
export default {
  data () {
    return {
      userForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      // 先进行二次判断
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          login(this.userForm)
            .then((res) => {
              if (res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg)
                // 跳转到首页
              } else {
                this.$message.error(res.data.meta.msg)
              }
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          this.$message.warning('请输入所有必填数据')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
