<template>
    <svg :class="svgClass" aria-hidden="true">
      <use :xlink:href="iconName" />
    </svg>
</template>
<script>
import {
  reactive,
  ref,
  isRef,
  toRefs,
  onMounted,
  computed
} from "@vue/composition-api";
export default {
  name: "svgIcons",
  /**
   * <svg-icon svgClass="menu" className="menu" />
   * 自定义属性名,而 menu 则是menu.svg文件
   */
  props: {
    iconClass: {
      type: String,
      default: ""
    },
    className: {
      type: String,
      defulat: ""
    }
  },
  setup(props, {}) {
    /**
     * 计算属性：computed
     * 一开始 number的值是 1 , 通过点击事件将number的值改为 2 而有一个 computed 方法为
     * plusOne = computed (() => {
     *    return number * 10
     * })
     * 那么当点击的时候number值发生改变,就会执行这个方法,继续发生改变,继续执行
     */
    const iconName = computed(() => `#icon-${props.iconClass}`);
    const svgClass = computed(() => {
      if (props.className) {
        return `svg-icon ${props.className}`;
      } else {
        return `svg-icon`;
      }
    });
    return {
      svgClass,
      iconName
    };
  }
};
</script>
<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>