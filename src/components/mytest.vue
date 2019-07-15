<template>
    <div class="content">
        <!-- 备用内容,当不传入自定义内容时,使用备用 -->
        <p><slot name="content" :text="innerData">内容</slot></p>
        <p><slot name="footer">底部</slot></p>
    </div>
</template>

<script>
export default {
  data () {
    return {
      innerData: '我是data中的数据'
    }
  }
}
</script>

<style lang="less" scoped>

</style>
