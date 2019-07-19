// 封装一个vue组件  完成当前文件夹的所有组件的注册
// 当导入这个模块,使用Vue.use(使用这个模块) Vue会调用install函数  默认传入Vue对象
import Mybread from '@/components/my-bread.vue'
import Mychannel from '@/components/my-channel.vue'
import Myimage from '@/components/my-image.vue'
export default {
  install (Vue) {
    // 使用Vue对象做想做的业务
    // 进行组件的注册
    // 第一项组件的名称,第二项组建的配置项
    Vue.component(Mybread.name, Mybread)
    Vue.component(Mychannel.name, Mychannel)
    Vue.component(Myimage.name, Myimage)
  }
}
