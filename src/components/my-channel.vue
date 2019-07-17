<template>
    <el-select :value="value" @change="change" placeholder="请选择">
        <el-option
            v-for="item in channelOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
        ></el-option>
    </el-select>
</template>

<script>
export default {
  name: 'my-channel',
  props: ['value'],
  data () {
    return {
      channelOptions: []
    }
  },
  created () {
    this.getChannelOption()
  },
  methods: {
    change (value) {
      this.$emit('input', value)
    },
    // 获取频道下拉菜单
    async getChannelOption () {
      // 解构赋值  {data:{data}}=res     res=data.data
      const { data: { data: { channels } } } = await this.$http.get('channels')
      // console.log(res)
      // this.channelOptions = res.data.data.channels
      this.channelOptions = channels
    }
  }
}
</script>

<style lang="less" scoped>

</style>
// 封装频道组件步骤: 1.封装功能  2.实现v-model的双向数据绑定,也就是父传子和子传父
