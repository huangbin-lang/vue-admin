<template>
  <div>
    <LayoutHeader />
    <LayoutMain />
    <LayoutNav />
  </div>
</template>

<script>
import { computed } from "@vue/composition-api";
import LayoutHeader from "./Components/Header";
import LayoutNav from "./Components/Nav";
import LayoutMain from "./Components/Main";

export default {
  name: "Layout",
  components: {
    LayoutHeader,
    LayoutNav,
    LayoutMain
  },
  setup(props, { root }) {
    const menuStatus = computed(() => {
      root.$store.state.app.isCollapse;
    });
    return {
      menuStatus
    };
  }
};
</script>

<style lang="scss" scoped>
</style>