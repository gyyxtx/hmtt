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
                    <template>
                        <el-radio-group v-model="reqParams.status">
                        <el-radio :label='null'>全部</el-radio>
                        <el-radio :label="0">草稿</el-radio>
                        <el-radio :label="1">待审核</el-radio>
                        <el-radio :label="2">审核通过</el-radio>
                        <el-radio :label="3">审核失败</el-radio>
                        </el-radio-group>
                    </template>
                </el-form-item>
                <el-form-item label="频道:">
                    <template>
                        <el-select v-model="reqParams.channel_id" placeholder="请选择">
                            <el-option
                            v-for="item in channelOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-form-item>
            </el-form>
        </el-card>
        <!-- 筛选结果区域 -->
        <el-card></el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      reqParams: {
        status: null,
        channel_id: null
      },
      //  频道选项组数据
      channelOptions: [{ name: 'java', id: 1 }]
    }
  }
}
</script>

<style lang="less" scoped>
    .el-card {
        margin-bottom: 20px;
    }
</style>
