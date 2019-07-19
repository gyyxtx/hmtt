<template>
  <div class="article-container">
    <el-card>
      <div slot="header">
        <!-- 根据地址栏是否有地址,判断是修改文章还是发布文章 -->
        <my-bread>{{articleId?"修改文章":"发布文章"}}</my-bread>
      </div>
      <el-form ref="publish-form" :model="publishForm" label-width="80px">
        <el-form-item label="标题:">
          <el-input style="width:400px" v-model="publishForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容:">
          <quill-editor v-model="publishForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面:" style="margin-top:50px">
          <el-radio-group v-model="publishForm.cover.type" @change="changeType">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 上传文件组件 -->
          <div v-if="publishForm.cover.type===1">
            <my-image v-model="publishForm.cover.images[0]"></my-image>
          </div>
          <div v-if="publishForm.cover.type===3">
            <my-image v-model="publishForm.cover.images[0]"></my-image>
            <my-image v-model="publishForm.cover.images[1]"></my-image>
            <my-image v-model="publishForm.cover.images[2]"></my-image>
          </div>
        </el-form-item>
        <el-form-item label="频道">
          <my-channel v-model="publishForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item v-if="!articleId">
          <el-button type="primary" @click="publish(false)">发表</el-button>
          <el-button @click="publish(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="primary" @click="edit(false)">保存修改</el-button>
          <el-button @click="edit(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 导入quill相关文件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  components: { quillEditor },
  data () {
    return {
      publishForm: {
        title: '',
        content: '',
        cover: {
          type: 1,
          images: []
        },
        channel_id: null,
        articleId: null
      },
      // 富文本编辑器设置
      editorOption: {
        //   占位符为空
        placeholder: '',
        // 富文本编辑器配置选项
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }]
          ]
        }
      }
    }
  },
  created () {
    // 获取地址栏中的id值
    this.articleId = this.$route.query.id
    // 判断如果地址栏中存在id值,就调用修改文章方法
    if (this.articleId) {
      this.changeArticles()
    }
  },
  // watch为了解决在修改页面上点击发表文章,路由跳转但是内容没有发生改变
  // watch监听data中的数据变化,监听路由route变化,route也相当于数据
  watch: {
    // 当前只能监听一种情况,在组建内路由发生改变
    $route () {
      // 将文章的id设置为空
      this.articleId = null
      // 将表单所有内容这是为初始状态
      this.publishForm = {
        title: '',
        content: '',
        cover: {
          type: 1,
          images: []
        },
        channel_id: null
      }
    }
  },
  methods: {
    // 修改时获取文章
    async changeArticles () {
      const { data: { data } } = await this.$http.get('articles/' + this.articleId)
      this.publishForm = data
    },
    // 修改,编辑后的提交
    async edit (draft) {
      // 发送发布文章请求,携带是否存为草稿参数和请求头和文章id
      await this.$http.put(`articles/${this.articleId}?draft=${draft}`, this.publishForm)
      // 判断修改还是存草稿
      this.$message.success(!draft ? '修改成功' : '存入草稿成功')
      // 跳转回文章列表
      this.$router.push('/article')
    },
    // 单图和三图切换
    changeType () {
      this.publishForm.cover.images = []
    },
    // 发表文章
    async publish (draft) {
      // 发送发布文章请求,携带是否存为草稿参数和请求头
      await this.$http.post(`articles?draft=${draft}`, this.publishForm)
      // 判断发表还是存草稿
      this.$message.success(!draft ? '发表成功' : '存入草稿成功')
      // 跳转回文章列表
      this.$router.push('/article')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
