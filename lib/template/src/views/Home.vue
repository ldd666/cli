<template>
  <section>
    <%if(presets.features.indexOf('com-h-header') > -1){%>
    <ComHeader></ComHeader>
    <%}%>
  </section>
</template>
<script>
<%if(presets.features.indexOf('com-h-header') > -1){%>
import ComHeader from '@/components/header.vue'
<%}%>
export default {
  name: 'home',
  components: {
    <%if(presets.features.indexOf('com-h-header') > -1){%>
    ComHeader
    <%}%>
  }
}
</script>
