<template>
  <div class="so-admin__header">
    <a href="/" class="so-admin__link">
        <img class="so-admin__link--logo" src="http://p6.qhimg.com/t01534bd957673a89c2.png" alt="so-admin">
    </a>
    <div class="so-admin__menu">
        <el-menu 
        :default-openeds="defaultOpeneds"
        :default-active="defaultActive"
        background-color="#24292e" 
        text-color="#fff"
        active-text-color="#fff" 
        mode="horizontal" 
        :router="true"
        @select="handleSelect">
            <template v-for="(item, index) in menu">
                <el-menu-item v-if="!item.children" :index="item.path" :key="index">
                    {{item.title}}
                </el-menu-item>
                <el-submenu v-else :index="item.path" :key="index">
                    <template slot="title">
                        {{item.title}}
                    </template>
                    <template v-for="(subItem, subIndex) in item.children">
                        <el-menu-item :index="subItem.path" :key="index+'-'+subIndex">
                            {{subItem.title}}
                        </el-menu-item>
                    </template>
                </el-submenu>
            </template>
        </el-menu>
    </div>
  </div>
</template>
<script>
export default {
    name: 'comheader',
    data() {
        return {
            defaultOpeneds: [],
            defaultActive: '',
            menu: [
            {
                title: '处理中心',
                path: '/a' // 填写路由路径
            },{
                title: '我的工作台',
                path: '/b', // 填写路由路径
                children: [{
                    title: '选项1',
                    path: '/b/1'
                },{
                    title: '选项2',
                    path: '/b/2'
                }]
            },{
                title: '消息中心',
                path: '/c' // 填写路由路径
            }]
        }
    },
    methods: {   
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        } 
    },
    beforeMount() {
        this.defaultOpeneds = [this.$route.path];
        this.defaultActive = this.$route.path;
    }
};
</script>

<style scoped lang="scss">
.so-admin__header {
    height: 60px;
    background-color: #24292e;
    color: hsla(0,0%,100%,.7);
}
.so-admin__link {
    margin-left: 16px;
    white-space: nowrap;
    font-weight: 600;
    color:#fff;
    display:inline-block;
    vertical-align: 10px;
    &--logo{
        height: 40px;
    }
}
.so-admin__menu {
    display:inline-block;
}
</style>