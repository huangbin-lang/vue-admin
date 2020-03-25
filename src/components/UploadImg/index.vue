<template>
  <!-- 将token 带到七牛云 :data="data.uploadKey" -->
  <el-upload
    class="avatar-uploader"
    :action="config.action"
    :data="data.uploadKey"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="data.image" :src="data.image" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>
<script>
import { reactive, onMounted, watch } from "@vue/composition-api";
import { QiniuToken } from "@/api/common.js";
export default {
  /**
   * 1.组件的过程需要做什么？(获取token,显示默认图片,渲染自身的图片)
   * 2.最终结果要做什么？(返回自身图片的路径)
   */
  name: "UploadImg",
  props: {
    imageUrl: {
      type: String,
      default: ""
    },
    config: {   //默认传了参数过来，所以不用监听
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit }) {
    console.log(props.config);
    
    const data = reactive({
      image: "",
      uploadKey: {
        token: "",
        key: ""
      }
    });

    /**
     * 图片上传成功出发
     */
    const handleAvatarSuccess = (res, file) => {
      let img = `${root.$store.getters["common/qiniuUrl"]}${res.key}`;
      // key是图片的名称W
      data.image = img;
      //必须要有sync修饰符才能update反向修改父组件的值 img 赋值给了 父组件的 form.imageUrls
      emit("update:imageUrl", img);
    };

    /**
     * 图片上传之前处理一些事情
     */
    const beforeAvatarUpload = file => {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 20;

      if (!isJPG) {
        root.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        root.$message.error("上传头像图片大小不能超过 20MB!");
      }

      //文件名转码
      let suffix = file.name;
      let key = encodeURI(`${suffix}`);
      data.uploadKey.key = key;

      return isJPG && isLt2M;
    };

    /**
     * 获取七牛云token
     */
    const getQiniuToken = () => {
      let requestData = {
        accesskey: props.config.accesskey,
        secretkey: props.config.secretkey,
        buckety: props.config.buckety
      };
      QiniuToken(requestData)
        .then(response => {
          data.uploadKey.token = response.data.data.token;
        })
        .catch(error => {});
    };

    /**
     * watch
     *
     * value 是发生改变后的值
     */
    watch(
      () => props.imageUrl,
      value => {
        data.image = value;
        //子组件不可改变父组件传过来的值(单向数据流)
        //  props.imageUrl = value
      }
    );

    /**
     * 生命周期
     */
    onMounted(() => {
      getQiniuToken();
    });

    return {
      data,
      getQiniuToken,
      beforeAvatarUpload,
      handleAvatarSuccess,
      getQiniuToken
    };
  }
};
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px solid #40e740;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #7fda35;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>