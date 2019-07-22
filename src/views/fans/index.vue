<template>
  <div class="fans-contioner">
    <el-card>
      <div slot="header">
        <my-bread>粉丝管理</my-bread>
      </div>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="fanslist">
          <!-- 报错 Avoid using non-primitive value as key, use string/number value instead  由于item.id为 bigNamber,需要转换为字符串或者数字,但是由于此数字较大,所以转换为字串-->
          <div class="fansimg" v-for="item in images" :key="item.id.toString()">
            <el-avatar :size="80" :src="item.photo"></el-avatar>
            <p style="font-size:12px">{{item.name}}</p>
            <el-button type="primary" plain size="mini">关注+</el-button>
          </div>
          <el-pagination background layout="prev, pager, next" :page-size="reqParams.per_page" :current-page="reqParams.page" :total="total" @current-change="changepage"></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="fansPhoto">粉丝画像</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'fanslist',
      reqParams: {
        page: 1,
        per_page: 20
      },
      images: [],
      total: 0
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 分页
    changepage (newpage) {
      // 将新的页码赋值给page
      this.reqParams.page = newpage
      // 重新获取数据
      this.getData()
    },
    // 发送请求,获取粉丝数据
    async getData () {
      const {
        data: { data }
      } = await this.$http.get('followers', { params: this.reqParams })
      this.images = data.results
      // 总条数
      this.total = data.total_count
    }
  }
}
</script>

<style lang="less" scoped>
.fansimg {
  width: 150px;
  height: 166px;
  border: 1px dashed #eee;
  text-align: center;
  padding: 6px;
  margin-right: 10px;
  margin-bottom: 10px;
  display: inline-block;
}
</style>
