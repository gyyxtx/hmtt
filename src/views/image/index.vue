<template>
  <div class="container" v-loading="loading">
    <el-card>
        <div slot="header">
            <my-bread>素材管理</my-bread>
        </div>
        <!-- 单选按钮组 -->
        <div style="margin-bottom:20px">
            <el-radio-group v-model="reqParams.collect" @change="search()" size="small">
                <el-radio-button :label="false">全部</el-radio-button>
                <el-radio-button :label="true">收藏</el-radio-button>
            </el-radio-group>
            <el-button type="success" size="small" style="float:right" @click="dialogVisible=true">上传素材</el-button>
        </div>
        <ul class="img-list">
            <li v-for="item in images" :key="item.id">
                <img :src="item.url" alt="">
                <div class="fot" v-if=" !reqParams.collect ">
                    <!-- :class="{red:item%2} 给span绑定class属性 当item%2为1时默认为true,所以当item为奇数时显示红色 -->
                    <span class="el-icon-star-off" @click="toggle(item)" :class="{red:item.is_collected}"></span>
                    <span class="el-icon-delete" @click="del(item.id)"></span>
                </div>
            </li>
        </ul>
        <!-- 判断,当每页个数小于总条数,不显示分页条 -->
        <el-pagination v-if="reqParams.per_page<total" background layout="prev, pager, next" :current-page="reqParams.page" :total="total" :page-size="reqParams.per_page" @current-change="changepage">
        </el-pagination>
        <el-dialog
          title="上传素材"
          :visible.sync="dialogVisible"
          width="300px">
          <span>
            <!-- action上传文件后端地址 upload不是基于axios,name是上传文件需要携带文件名字,后端指定为image -->
            <el-upload
              class="avatar-uploader"
              :headers="headers"
              action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
              :show-file-list="false"
              name="image"
              :on-success="handleSuccess">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
          </span>
        </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      reqParams: {
        collect: false,
        page: 1,
        per_page: 10
      },
      //  接收后端返回的列表数据
      images: [],
      total: 0,
      // 加载默认值  当发送请求之前显示加载,请求成功后停止加载
      loading: false,
      // 上传素材的对话框
      dialogVisible: false,
      imageUrl: null,
      headers: {
        Authorization: 'Bearer ' + JSON.parse(window.sessionStorage.getItem('mytoken')).token
      }
    }
  },
  created () {
    this.getImages()
  },
  methods: {
    // 删除功能
    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '亲情提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete('user/images/' + id)
        // 提示删除成功
        this.$message.success('删除成功')
        // 更新列表
        this.getImages()
      })
        .catch(() => {})
    },
    // 切换是否收藏
    async toggle (item) {
      // 向后端发送请求,向后端传送图片的id,以及发送请求体是否收藏
      const { data: { data } } = await this.$http.put('user/images/' + item.id, { collect: !item.is_collected })
      // 提示成功
      this.$message.success('操作成功')
      // 更改图片是否收藏的状态
      item.is_collected = data.collect
      // 更新视图
      this.getImages()
    },
    //   切换页数触发的函数
    changepage (newPage) {
      // 将改变后的页码赋值给当前页码
      this.reqParams.page = newPage
      //  重新获取列表
      this.getImages()
    },
    //   切换全部和收藏
    search () {
      this.reqParams.page = 1
      this.getImages()
    },
    //  发送请求,获取列表数据
    async getImages () {
      this.loading = true
      const { data: { data } } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      console.log(this.images)
      this.total = data.total_count
      console.log(this.total)
      this.loading = false
    },
    handleSuccess (res) {
      // console.log(res)
      // 将上传成功的图片显示
      this.imageUrl = res.data.url
      // 提示上传成功
      this.$message.success('上传成功')
      // 预览两秒钟,提示上传成功
      window.setTimeout(() => {
        // 关闭对话框
        this.dialogVisible = false
        // 更新列表
        this.getImages()
        // 上传成功后将图片占位改为原始的空
        this.imageUrl = null
      }, 2000)
    }
  }
}
</script>

<style lang="less" scoped>
    .img-list{
        list-style: none;
        padding: 0;
        margin: 0;
        overflow: hidden;
        li{
            float: left;
            width: 160px;
            height: 160px;
            border: 1px dashed #ddd;
            margin-right: 50px;
            margin-bottom: 20px;
            position: relative;
            img{
                width:100%;
                height: 100%
            }
            .fot{
                width: 100%;
                height: 30px;
                position: absolute;
                bottom: 0;
                left: 0;
                background-color: rgba(0,0,0,0.5);
                color: #fff;
                text-align: center;
                line-height: 30px;
                span{
                    margin: 0 20px;
                    &.red{
                        color:red;
                    }
                }
            }
        }
    }
</style>
