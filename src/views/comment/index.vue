<template>
  <div class="comment-contioner">
    <el-card>
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
      <!-- 表格 -->
      <el-table :data="comment" style="width: 100%">
        <el-table-column label="标题" prop="title" width="360px"></el-table-column>
        <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
        <el-table-column label="粉丝评论数" prop="fans_comment_count"></el-table-column>
        <!-- 当comment_status状态为true时,显示正常 false时显示关闭 -->
        <el-table-column label="状态">
            <template slot-scope="scope">
                {{scope.row.comment_status?"正常":"关闭"}}
            </template>
        </el-table-column>
        <!-- 操作与状态相反 -->
        <el-table-column label="操作" width="120">
            <template slot-scope="scope">
                <el-button v-if="!scope.row.comment_status" type="success" size="mini">打开评论</el-button>
                <el-button v-else type="danger" size="mini">关闭评论</el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination style="margin-top:20px;text-align:center" background layout="prev, pager, next" :current-page="reqParams.page" :page-size="reqParams.per_page" @current-change="changepage" :total="total"></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      comment: [],
      reqParams: {
        response_type: 'comment',
        page: 1,
        per_page: 20
      },
      total: 0
    }
  },
  created () {
    //   当页面加载时渲染列表
    this.getdata()
  },
  methods: {
    //   分页回调函数,默认传参为新的页数
    changepage (newpage) {
      // 将切换的页数赋值给当前页
      this.reqParams.page = newpage
      //   更新列表
      this.getdata()
    },
    //   发送axios请求
    async getdata () {
      // 根据后端接口要求,传参数
      const { data: { data } } = await this.$http.get('articles', { params: this.reqParams })
      //   console.log(data.results)
      //   将请求相应数据赋值给实现准备的接收容器
      this.comment = data.results
      //   获取总条数
      this.total = data.total_count
    }
  }
}
</script>

<style lang="less" scoped>
</style>
