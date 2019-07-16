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
        <el-form-item label="频道:">
          <el-select v-model="reqParams.channel_id" placeholder="请选择">
            <el-option
              v-for="item in channelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
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
        <b>0</b> 条结果：
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
           <el-button type="primary" icon="el-icon-edit" circle plain></el-button>
           <el-button type="danger" icon="el-icon-delete" circle plain></el-button>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :total="1000">
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
        end_pubdate: null
      },
      //  频道选项组数据
      channelOptions: [],
      //  日期数据
      dateValues: [],
      // 获取文章列表
      articles: []
    }
  },
  components: {
    // myTest
  },
  created () {
    this.getChannelOption()
    this.getArticles()
  },
  methods: {
    //  筛选 点击筛选重新调用获取文章
    search () {
      this.getArticles()
    },
    // 监听时间变化 此方法获取事件只能是标准格式,并非我们想要的格式,所以需要借助element-ui提供的方法进行格式化
    changeData (values) {
      this.reqParams.begin_pubdate = values[0]
      this.reqParams.end_pubdate = values[1]
    },
    // 获取频道下拉菜单
    async getChannelOption () {
      // 解构赋值  {data:{data}}=res     res=data.data
      const { data: { data: { channels } } } = await this.$http.get('channels')
      // console.log(res)
      // this.channelOptions = res.data.data.channels
      this.channelOptions = channels
    },
    // 获取列表数据
    async getArticles () {
      // params为固定,axios提供的属性,可以直接得到数据
      const { data: { data } } = await this.$http.get('articles', { params: this.reqParams })
      // console.log(data)
      this.articles = data.results
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-bottom: 20px;
}
</style>
