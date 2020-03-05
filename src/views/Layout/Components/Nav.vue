<template>
  <div id="nav-warp">
    <!-- logo -->
    <h1 class="logo">Vue</h1>
    <!-- li -->
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="transparent"
      text-color="black"
      active-text-color="#fff"
      router
    >
      <template v-for="(item, index) in routers">
        <!-- ：key要放在实际会被渲染的标签中 li  遍历后的index是number类型 加上+ ''转为字符串类型 -->
        <el-submenu v-if="!item.hidden" :key="item.id" :index="index + ''">
          <!-- 一级菜单 -->
          <template slot="title">
            <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon" />
            <span slot="title">{{ item.meta.name }}</span>
          </template>
          <!-- 子级菜单 li  router 结合 子组件:index="subItem.path" 尽心路由跳转-->
          <el-menu-item
            v-for="subItem in item.children"
            :key="subItem.id"
            :index="subItem.path"
          >{{ subItem.meta.name }}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
    <!-- vue默认的运行模式是runtime ,需要将vue指向改变成vue.js -->
  </div>
</template>

<script>
import { reactive, ref, isRef, toRefs, onMounted, computed } from "@vue/composition-api";
export default {
  name: "Nav",
  setup(props, { root }) {
    /**
     * 数据
     */
    // const isCollapse = ref(false);
    const routers = reactive(root.$router.options.routes);
    /**
     * 事实监听数据改变
     */
    const isCollapse = computed(() => {
      return root.$store.state.app.isCollapse
    })
    /**
     * 函数
     */
    return {
      isCollapse,
      routers,
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/config.scss";
.el-menu-vertical-demo {
  border-right: 0;
}
.logo {
  text-align: center;
  font-size: 75px;
  line-height: 0px;
}
#nav-warp {
  position: fixed;
  top: 0;
  left: 0;
  width: $navMenu;
  height: 100vh;
  background-color: pink;
  svg {
    font-size: 20px;
    margin-right: 10px;
  }
}
</style>