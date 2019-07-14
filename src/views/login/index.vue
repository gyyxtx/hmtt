<template>
  <div class="login-container">
    <el-card class="box">
      <img src="../../assets/images/logo_index.png" alt />
      <!-- 登录表单 -->
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" :status-icon="true">
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input placeholder="请输入验证码" style="width:240px;float:left" v-model="loginForm.code"></el-input>
          <el-button style="float:right">发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox :value="true" style="float:left">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    // 表单自定义验证
    let checkmobile = (rule, value, callback) => {
      if (/^1[3-9]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error('手机号格式不正确'))
      }
    }
    return {
      loginForm: {
        mobile: '',
        code: ''
      },
      // 表单验证
      loginRules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '请输入6位有效数字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 整体表单请求
    login () {
      this.$refs.loginForm.validate((valid) => {
        // 如果请求成功,发送请求,跳转至首页
        if (valid) {
          // 提交登录请求 axios是基于primise封装的post() 返回值是promise对象
          this.$http
            .post(`authorizations`, this.loginForm)
            .then(res => {
              // 1.跳转至首页
              this.$router.push('/')
              // 2.保存用户信息  用来判断登录状态
              // console.log(res.data.data.token)
              // sessionStorage是DOM对象,全局对象,挂载在window下,作用是保存数据,关闭浏览器后失效
              // sessionStorage.setItem(key,value)存储数据
              // sessionStorage.getItem(key)获取数据
              // sessionStorage.remove(Itemkey)删除数据
              // sessionStorage.clear() 清空所有数据
              window.sessionStorage.setItem('mytoken', JSON.stringify(res.data.data))
            })
            .catch(() => {
              this.$message.error('手机号或者验证码错误')
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: url("../../assets/images/login_bg.jpg") no-repeat center / cover;
  .box {
    width: 400px;
    height: 340px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    img {
      display: block;
      width: 200px;
      margin: 10px auto;
    }
  }
}
</style>
