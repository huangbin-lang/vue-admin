<template>
  <el-form ref="form" :model="form" label-width="100px">
    <el-form-item label="信息分类：">
      <el-select v-model="form.categoryId">
        <el-option
          v-for="item in data.category"
          :key="item.id"
          :value="item.id"
          :label="item.category_name"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="新闻标题：">
      <el-input v-model="form.title"></el-input>
    </el-form-item>

    <el-form-item label="缩略图：">
      <UploadImg :imageUrl.sync="form.imageUrl" :config="uploadimgConfig" />
    </el-form-item>

    <el-form-item label="发布日期：">
      <el-date-picker v-model="form.createDate" type="date" placeholder="请选择日期" disabled></el-date-picker>
    </el-form-item>

    <el-form-item label="详细内容：">
      <quillEditor v-model="form.content" ref="myQuillEditor" :options="data.editorOption" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import UploadImg from "@/components/UploadImg/index.vue";
import { timestampToTime } from "@/utils/common.js";
import { GetList, EditInfo } from "@/api/news.js";
import { QiniuToken } from "@/api/common.js";
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
//需依赖 npm install vue-quill-editor -S
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  name: "infoDetailed",
  components: { quillEditor, UploadImg },
  setup(props, { root }) {
    const uploadimgConfig = reactive({
      action: "http://up-z2.qiniup.com",
      accesskey: "292hlMonitvbybziT0vy1WgsoCaKzfERGu3ODmdB",
      secretkey: "0y18HTukjy28fLsJi8BgifJFUgRakCErTqOHGAeg",
      buckety: "admin-token"
    });
    const data = reactive({
      id: root.$route.params.id || root.$store.getters["infoDetailed/infoId"],
      category: [],
      editorOption: {}
    });

    const form = reactive({
      categoryId: "",
      title: "",
      createDate: "",
      content: "",
      imageUrl: ""
    });

    /**
     * methods
     *
     * 保存
     */
    const onSubmit = () => {
      let requestData = {
        id: data.id,
        categoryId: form.categoryId,
        title: form.title,
        content: form.content,
        imgUrl: form.imageUrl
      };
      if (!form.categoryId) {
        root.$message({
          message: "分类不能为空",
          type: "error"
        });
        return false;
      }
      if (!form.title) {
        root.$message({
          message: "标题不能为空",
          type: "error"
        });
        return false;
      }

      EditInfo(requestData)
        .then(response => {
          let requestData = response.data;
          root.$message({
            message: "修改成功",
            type: "success"
          });
          root.$router.push({
            name: "InfoIndex"
          });
        })
        .catch(error => {});
    };
    /**
     * 获取信息分类
     */
    const getInfoCategory = () => {
      root.$store
        .dispatch("common/getInfoCategory")
        .then(response => {
          data.category = response;
        })
        .catch(error => {});
    };

    /**
     * 获取当前ID的信息
     */
    const getInfoList = () => {
      let requestData = {
        pageNumber: 1,
        pageSize: 1,
        id: data.id
      };
      GetList(requestData)
        .then(response => {
          let responseData = response.data.data.data[0];
          form.categoryId = responseData.categoryId;
          form.title = responseData.title;
          form.content = responseData.content;
          form.imageUrl = responseData.imgUrl;
          form.createDate = timestampToTime(responseData.createDate);
        })
        .catch(error => {});
    };

    /**
     * 生命周期
     * 页面加载完执行里面的方法
     */
    onMounted(() => {
      getInfoCategory();
      getInfoList();
    });

    return {
      data,
      form,
      uploadimgConfig,
      //method
      onSubmit,
      getInfoList
    };
  }
};
</script>

<style lang="scss" scoped>
</style>