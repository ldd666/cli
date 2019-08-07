<template>
    <el-popover
    placement="bottom"
    width="60"
    trigger="hover">
        <a @click="checkout" class="checkout">退出</a>
        <a slot="reference">{{username}}</a>
    </el-popover>
</template>
<script>
export default {
  name: 'comlogin',
  data() {
    username: 'xiaoqi'
  },
  methods: {
    checkout() {
      
    }
  }
}
</script>
