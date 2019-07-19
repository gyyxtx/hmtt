<template>
    <div class="image-contioner">
        <!-- 图片按钮 -->
        <div class="btn-img" @click="openDialog">
          <!-- 如果父组件传值显示父组件穿入的值,如果没传,显示默认图 -->
            <img :src="value||defaultImage" alt />
        </div>
        <!-- 对话框 -->
        <el-dialog :visible.sync="dialogVisible" width="700px">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <!-- 素材库 -->
                <el-tab-pane label="素材库" name="images">
                    <!-- 全部与隐藏 -->
                    <el-radio-group v-model="reqParams.collect" @change="search()" size="small" style="margin-bottom:20px;display:block">
                        <el-radio-button :label="false">全部</el-radio-button>
                        <el-radio-button :label="true">收藏</el-radio-button>
                    </el-radio-group>
                    <!-- 显示图片列表 -->
                    <div class="list-img" v-for="item in images" :key="item.id" @click="selectedImage(item.url)" :class="{selected: selectedImageUrl===item.url}">
                        <img :src="item.url" alt="">
                    </div>
                    <!-- 分页 -->
                    <el-pagination
                        v-if="total>reqParams.per_page"
                        background
                        layout="prev, pager, next"
                        :total="total" style="text-align:center"
                        :current-page="reqParams.page"
                        :page-size="reqParams.per_page"
                        @current-change="changepage">
                    </el-pagination>
                </el-tab-pane>
                <!-- 上传图片 -->
                <el-tab-pane label="上传图片" name="pic">
                    <el-upload
                    :headers="headers"
                    class="avatar-uploader"
                    action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
                    :show-file-list="false"
                    :on-success="handleSuccess" name="image">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-tab-pane>
            </el-tabs>
            <span slot="footer" class="dialog-footer" style="text-align:center">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button @click="confirmImage" type="primary">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import defaultImage from '../assets/images/default.png'
export default {
  name: 'my-image',
  props: ['value'], // 此数据为父组件传给子组件,只能读
  data () {
    return {
      // 控制对话框显示与隐藏
      dialogVisible: false,
      //   控制tabs切换
      activeName: 'images',
      //   上传图片的占位图
      imageUrl: null,
      //   发送请求所需数据
      reqParams: {
        collect: false,
        page: 1,
        per_page: 8
      },
      //   定义数组用来接收后端返回数据
      images: [],
      //   总页数
      total: 0,
      // 选中素材的地址
      selectedImageUrl: null,
      // 设置图片上传的请求头 图片上传为网络地址
      headers: {
        Authorization: 'Bearer ' + JSON.parse(window.sessionStorage.getItem('mytoken')).token
      },
      // webpack不会去打包在数据中定义的地址对应的资源,只打包标签上的src或url的资源
      // 本地资源不会去打包  网络资源可以
      // value: './../assets/images/default.png'
      // 需要自己导入自己所需的资源
      defaultImage
    }
  },
  methods: {
    // 点击确认,确定图片
    confirmImage () {
      if (this.activeName === 'images') {
        if (!this.selectedImageUrl) return this.$message.warning('请选择素材')
        // this.value = this.selectedImageUrl
        // 子传父
        this.$emit('input', this.selectedImageUrl)
      } else if (this.activeName === 'pic') {
        if (!this.imageUrl) return this.$message.warning('请上传图片')
        // this.value = this.imageUrl
        this.$emit('input', this.imageUrl)
      }
      this.dialogVisible = false
    },
    // 点击图片选中效果 实现思想:当选中图片到的路径与遍历图片的路径相同时,显示选中效果,也就是class,用伪元素方法
    selectedImage (url) {
      // 将选中的url地址复制给selectedImageUrl
      this.selectedImageUrl = url
    },
    //   切换分页
    changepage (newpage) {
    // 切换页时,将新的页码赋值给page 并重新请求数据
      this.reqParams.page = newpage
      this.getImages()
    },
    //   控制对话框显示与隐藏
    openDialog () {
      // 打开对话框之前清除上一次的数据
      this.imageUrl = null
      this.selectedImageUrl = null
      //   点击图片打开对话框 渲染列表
      this.dialogVisible = true
      this.getImages()
    },
    // 控制Tabs标签页的切换
    handleClick () {},
    // 素材切换
    search () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 图片上传成功时的函数
    handleSuccess (res) {
      // 上传成功后,将上传的图片地址代替占位图片imageUrl
      this.imageUrl = res.data.url
    },
    // 获取图片列表所需数据
    async getImages () {
      const { data: { data } } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
    }
  }
}
</script>

<style lang="less" scoped>
.image-contioner{
  display:inline-block;
  margin-right: 10px;
}
.btn-img {
  width: 150px;
  height: 150px;
  border: 1px dashed #eee;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.list-img{
  width: 150px;
  height: 120px;
  border: 1px dashed #eee;
  display: inline-block;
  margin-right: 12px;
  position: relative;
  // 相当于.list-img.selected::before{}  加上selected class夹遮罩层
  &.selected{
    &::before{
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.2) url('../assets/images/selected.png') no-repeat center/ 50px 50px;
    }
  }
  img{
      width: 100%;
      height: 100%;
      display: block;
  }
}
</style>
