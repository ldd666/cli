<template>
    <section class="so-admin__login">
      <el-popover
      placement="bottom"
      width="60"
      trigger="hover">
          <a @click="checkout" class="checkout">退出</a>
          <a slot="reference">{{userInfo.username}}</a>
      </el-popover>
    </section>    
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('user')
export default {
  name: 'comlogin',
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
    })
  },
  methods: {
    ...mapActions(['logout']),
    checkout() {
      this.logout().then(data => {
        window.location.href = `https://login.ops.qihoo.net:4430/sec/login?ref=${window.location.origin}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.so-admin__login {
  float: right;
  margin-right: 16px;
  line-height: 60px;
}
</style>

