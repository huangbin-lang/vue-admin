<template>
  <el-dialog
    title="新增"
    :visible.sync="data.dialog_info_flag"
    @close="close"
    width="580px"
    @open="openDialog"
  >
    <el-form :model="data.form" ref="infoForm">
      <el-form-item label="类型：" :label-width="data.formLabelWidth" prop="category">
        <el-select v-model="data.form.category" placeholder="请选择活动区域">
          <el-option
            v-for="item in data.categoryOption"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题：" :label-width="data.formLabelWidth" prop="title">
        <el-input v-model="data.form.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="概括：" :label-width="data.formLabelWidth" prop="content">
        <el-input type="textarea" v-model="data.form.content" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="danger" :loading="data.submitLoading" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { AddInfo } from "@/api/news.js";
import { reactive, ref, watch } from "@vue/composition-api";
export default {
  name: "DialogInfo",
  /**
   * 关闭的时候又变成false,就改变了传过来的值,所以就会报错  错误信息：Prop being mutated
   *
   * 单向数据流  父级 -> 子级  不能反向修改传过来的值
   */
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { root, emit, refs }) {
    /**
     * 把所有的数据都放到data里面
     */
    const data = reactive({
      dialog_info_flag: false,
      submitLoading: false,
      formLabelWidth: "70px",
      form: {
        category: "",
        title: "",
        content: ""
      },
      categoryOption: []
    });

    /**
     * watch
     */
    watch(() => {
      data.dialog_info_flag = props.flag;
    });
    /**
     * methods
     * vue2.0 通过this.$emit  来改变父级的值
     * "update:flag" 回去读 父级 flag 属性 然后改变 dialog_info 的值
     * 利用 修饰器 sync 改变 dialog_info 值(这种只是赋值一个基础变量,无法做逻辑性的事情)
     * 回调时需要做逻辑处理的时候就不能用修饰器了
     */

    const submit = () => {
      let requestData = {
        category: data.form.category,
        title: data.form.title,
        content: data.form.content
      };
      if (!data.form.category) {
        root.$message({
          message: "分类不能为空",
          type: "error"
        });
        return false;
      }
      if (!data.form.title) {
        root.$message({
          message: "标题不能为空",
          type: "error"
        });
        return false;
      }

      data.submitLoading = true;

      AddInfo(requestData)
        .then(response => {
          let requestData = response.data;
          root.$message({
            message: requestData.message,
            type: "success"
          });
          close();
        })
        .catch(error => {
          close();
        });
    };

    const close = () => {
      data.dialog_info_flag = false;
      data.submitLoading = false;
      resetFormData();
      emit("update:flag", false);
      // this.$emit('close', false)
    };

    /**
     * 打开窗口的时候保存值
     * 这里是父组件传过来的分类信息
     */
    const openDialog = () => {
      data.categoryOption = props.category;
    };

    /**
     * 点击取消的时候也要清掉,因为值一直都是存在的
     */
    const resetFormData = () => {
      // 重置表单
      refs.infoForm.resetFields();
      // data.form.title = "";
      // data.form.content = "";
      // data.form.category = "";
    };

    return {
      data,
      //methods
      close,
      openDialog,
      submit,
      resetFormData
    };
  }
};
</script>

<style lang="scss" scoped>
</style>