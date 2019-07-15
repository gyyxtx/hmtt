<template>
  <div class="article-container">
    <!-- 筛选区域 -->
    <el-card>
      <div slot="header">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 筛选项 reqParams提交的参数 -->
      <el-form :model="reqParams">
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
              v-model="dateValues"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果区域 -->
    <el-card>
        <my-test>
            <!-- scope收集了该插槽上所有的自定义属性的数据  scope是一个对象,包含插槽上所有的数据 -->
            <template slot="content" slot-scope="scope">内容1{{scope.text}}</template>
            <template slot="footer">底部1</template>
        </my-test>
    </el-card>
  </div>
</template>

<script>
import myTest from '@/components/mytest.vue'
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
      channelOptions: [{ name: 'java', id: 1 }],
      //  日期数据
      dateValues: []
    }
  },
  components: {
    myTest
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-bottom: 20px;
}
</style>
