<template>
  <div id="header-warp">
    <div class="pull-left header-icon" @click="navMenuState()">
      <svg-icon iconClass="menu" iconName="menu" />
    </div>
    <div class="pull-right">
      <div class="pull-left">图标</div>
      <div class="user-info pull-left">{{ username }}</div>
      <div class="header-icon pull-left" @click="exit()">
        <svg-icon iconClass="exit" iconName="exit" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api';
export default {
  name: "Header",
  setup(props, { root }) {
    // 只有取值需要 root.$store.state.login.name; 调用方法 不需要 
    // const names = root.$store.state.login.name;

    //监听值的变化
    const username = computed(() => {
      return root.$store.state.app.username
    })

    // Nav那边就用computed实时监听iscollapse的改变
    const navMenuState = () => {
      root.$store.commit("app/SET_ISCOLLAPSE");
    };

    const exit = () => {
      root.$store.dispatch('app/exit').then(() => {
        root.$router.push({
          name: 'Login'
        })
      })
    }
 
    return {
      navMenuState,
      username,
      exit
    };
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/config.scss";
#header-warp {
  position: fixed;
  top: 0;
  left: $navMenu;
  right: 0;
  height: 75px;
  background-color: #fff;
  -webkit-box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.1);
  line-height: 75px;
  .header-icon {
    padding: 0 32px;
    svg {
      margin-bottom: -8px;
      font-size: 28px;
      cursor: pointer;
    }
  }
}
// + 选择同一级别的下一级
.user-info {
  height: 100%;
  padding: 0 32px;
  border-right: 1px solid #ededed;
  + .header-icon {
    padding: 0 28px;
  }
}
</style>