<template>
    <div class="setting-contioner">
        <el-card>
            <div slot="header">
                <my-bread>个人设置</my-bread>
            </div>
            <el-row>
                <!-- 修改用户信息 -->
                <el-col :span="12">
                    <el-form v-model="settingForm" label-width="100px">
                        <el-form-item label="编号:">{{settingForm.id}}</el-form-item>
                        <el-form-item label="手机:">{{settingForm.mobile}}</el-form-item>
                        <el-form-item label="媒体名称:">
                            <el-input v-model="settingForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="媒体介绍:">
                            <el-input type="textarea" :rows="3" v-model="settingForm.intro"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱:">
                            <el-input v-model="settingForm.email"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="updataUserInfo">保存设置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <!-- 修改头像 -->
                <el-col :span="12">
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleSuccess">
                        <img v-if="settingForm.photo" :src="settingForm.photo" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <p style="text-align:center">修改头像</p>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import eventBus from '@/eventBus'
export default {
  data () {
    return {
    // form表单数据
      settingForm: {
        id: null,
        name: null,
        intro: null,
        photo: null,
        email: null,
        mobile: null
      }
    }
  },
  created () {
    //   当页面加载时,获取用户信息
    this.getData()
  },
  methods: {
    //   修改用户信息
    async updataUserInfo () {
      const { data: { data } } = await this.$http.patch('user/profile',
        { name: this.settingForm.name,
          intro: this.settingForm.intro,
          email: this.settingForm.email })
      this.$message.success('修改用户信息成功')
      //   传当前修改的用户名给home  修改home组件的数据 由于是设置界面传值给home,所以是设置界面触发事件  home界面绑定事件
      eventBus.$emit('updataName', data.name)
      // 更新本地存储数据
      const userInfo = JSON.parse(window.sessionStorage.getItem('mytoken'))
      // console.log(userInfo)
      // 将更新过的name值赋值给token的name,实现本地的更新
      userInfo.name = data.name
      // 将更新name值之后,在重新设置token
      window.sessionStorage.setItem('mytoken', JSON.stringify(userInfo))
    },
    //   获取用户个人资料
    async getData () {
      const { data: { data } } = await this.$http.get('user/profile')
      //   console.log(data)
      //   将获取到的资料赋值给settingForm
      this.settingForm = data
    },
    handleSuccess () {}
  }
}
</script>

<style lang="less" scoped>

</style>
