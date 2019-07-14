<template>
  <el-container class="home-contioner">
    <!-- 定义切换导航栏宽度 如果collapse为真,显示宽度为64 ;如果为false,显示宽度为true -->
    <el-aside class="my-aside" :width = " collapse ? '64px':'200px' ">
      <!-- 绑定class方法属性 当collapse为真时,显示class绑定的属性 -->
      <div class="logo" :class="{close: collapse}"></div>
      <!-- :collapse为真时,折叠侧边栏,如果为假展开侧边栏 -->
      <!-- $route.path当前路由的路径 -->
      <el-menu
        router
        :default-active="$route.path"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
        class="menu"
        :collapse="collapse"
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="my-header">
        <span class="el-icon-s-fold" @click="changeCollapse()"></span>
        <span class="text">江苏传智播客科技教育有限公司</span>
        <el-dropdown style="float:right" @command="handleCommand">
          <span class="el-dropdown-link">
            <img :src="avatar" alt />
            {{name}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- click为dom原生事件,而el-dropdown-item并不是原生标签,所以事件并不会生效 -->
            <!-- <el-dropdown-item icon="el-icon-setting" @click.native="setting">个人设置</el-dropdown-item> -->
            <el-dropdown-item icon="el-icon-setting" command='setting'>个人设置</el-dropdown-item>
            <!-- <el-dropdown-item icon="el-icon-unlock" @click.native="logout">退出登录</el-dropdown-item> -->
            <el-dropdown-item icon="el-icon-unlock" command='logout'>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 设置侧边栏属性
      collapse: false,
      // 在data中定义两个属性用来接收登录后后台返回的姓名和图片
      avatar: '',
      name: ''
    }
  },
  created () {
    // 获取登录后,从后端获取的信息
    const user = JSON.parse(window.sessionStorage.getItem('mytoken'))
    // 将图片赋值给avatar,将名字赋值给name
    this.avatar = user.photo
    this.name = user.name
  },
  methods: {
    // 设置侧边栏属性值
    changeCollapse: function () {
      this.collapse = !this.collapse
    },
    // 点击触发的方法,路由跳转到这支页面
    setting () {
      this.$router.push('/setting')
    },
    // 点击退出,将清除sessionstorge中的数据清除,跳转回登录页面
    logout () {
      window.sessionStorage.removeItem('mytoken')
      this.$router.push('/login')
    },
    handleCommand (command) {
      this[command]()
    }
  }
}
</script>

<style lang="less" scoped>
.home-contioner {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .my-aside {
    background-color: #002033;
    .logo{
      width: 100%;
      height: 60px;
      background: url('../../assets/images/logo_admin.png') no-repeat center / 140px auto;
    }
    .close {
      background: url('../../assets/images/logo_admin_01.png') no-repeat center;
      background-size: 36px auto;
    }
    .menu{
      text-align: left;
      border-right: none;
    }
  }
  .my-header {
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    .el-icon-s-fold {
      font-size: 26px;
      vertical-align: middle;
      margin-top: 16px;
      padding-right: 5px;
      float: left;
    }
    .text {
      vertical-align: middle;
      float: left;
    }
    .el-dropdown-link img {
      width: 30px;
      height: 30px;
      vertical-align: middle;
    }
  }
}
</style>
