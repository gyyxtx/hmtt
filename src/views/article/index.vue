<template>
  <div class="article-container">
    <!-- 筛选区域 -->
    <el-card>
      <div slot="header">
        <!-- 面包屑导航 -->
        <my-bread>内容管理</my-bread>
      </div>
      <!-- 筛选项 reqParams提交的参数 -->
      <el-form :model="reqParams" label-width="50px">
        <el-form-item label="状态:">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 频道列表 -->
        <el-form-item label="频道:">
          <!-- 子组件绑定v-model 相当于绑定v-bind绑定vlaue值和v-on 绑定input事件  value是相当于父传子  input事件相当于子传父 -->
          <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="时间:">
          <el-date-picker
          value-format="yyyy-MM-dd"
          @change="changeData"
            v-model="dateValues"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果区域 -->
    <!-- <el-card>
        <my-test>
            scope收集了该插槽上所有的自定义属性的数据  scope是一个对象,包含插槽上所有的数据
            <template slot="content" slot-scope="scope">内容1{{scope.text}}</template>
            <template slot="footer">底部1</template>
        </my-test>
    </el-card>-->
    <el-card>
      <div slot="header">
        根据筛选条件共查询到
        <b>{{total}}</b> 条结果：
      </div>
      <el-table :data="articles">
        <el-table-column label="封面">
          <template slot-scope='scope'>
            <el-image :src="scope.row.cover.images[0]" style="width:100px;height:75px">
              <div slot="error" class="image-slot">
                <img src="../../assets/images/error.gif" alt="" width=100 height=75>
              </div>
            </el-image>

          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status==1">待审核</el-tag>
            <el-tag type="success" v-if="scope.row.status==2">审核通过</el-tag>
            <el-tag type="info" v-if="scope.row.status==0">草稿</el-tag>
            <el-tag type="warning" v-if="scope.row.status==3">审核失败</el-tag>
            <el-tag type="danger" v-if="scope.row.status==4">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作">
           <template slot-scope="scope">
              <el-button type="primary" @click="edit(scope.row.id)" icon="el-icon-edit" circle plain></el-button>
              <el-button type="danger" @click="del(scope.row.id)" icon="el-icon-delete" circle plain></el-button>
           </template>
        </el-table-column>
      </el-table>
      <!-- current-change页码发生改变触发的事件 current-page:当前页 -->
      <el-pagination background layout="prev, pager, next" :total="total" @current-change="pager" :current-page="reqParams.page" :page-size="reqParams.per_page">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>

// import myTest from '@/components/mytest.vue'
export default {
  data () {
    return {
      reqParams: {
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null,
        page: 1,
        per_page: 20
      },
      //  日期数据
      dateValues: [],
      // 获取文章列表
      articles: [],
      total: 0
    }
  },
  components: {
    // myTest
  },
  created () {
    this.getArticles()
  },
  methods: {
    // 编辑功能的实现
    edit (id) {
      this.$router.push(`/publish?id=${id}`)
    },
    // 删除功能实现
    del (id) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete(`articles/${id}`)
        // 删除成功
        this.$message.success('删除成功')
        this.getArticles()
      })
        .catch(() => {})
    },
    // 分页  当页码发生改变,将当前页码数赋值给reqParams.page,向后端重新获取数据
    pager (newPage) {
      // console.log(124)
      this.reqParams.page = newPage
      this.getArticles()
    },
    //  筛选 点击筛选重新调用获取文章
    search () {
      // 每次搜索,让页面默认显示第一页
      this.reqParams.page = 1
      this.getArticles()
    },
    // 监听时间变化 此方法获取事件只能是标准格式,并非我们想要的格式,所以需要借助element-ui提供的方法进行格式化
    changeData (values) {
      // 起始时间和终止时间
      this.reqParams.begin_pubdate = values[0]
      this.reqParams.end_pubdate = values[1]
    },
    // 获取列表数据
    async getArticles () {
      // params为固定,axios提供的属性,可以直接得到数据
      const { data: { data } } = await this.$http.get('articles', { params: this.reqParams })
      // console.log(data)
      this.articles = data.results
      // 获取表单的总页数
      this.total = data.total_count
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-bottom: 20px;
}
</style>
