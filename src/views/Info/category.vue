<template>
  <div id="category">
    <el-button type="danger" @click="addFirst({type:'category_first_add'})">添加一级分类</el-button>
    <div>
      <el-row :gutter="30">
        <el-col :span="10">
          <div class="category-warp">
            <div class="category" v-for="firstItem in categorys.item" :key="firstItem.id">
              <h4>
                <svg-icon icon-class="reduce"></svg-icon>
                {{ firstItem.category_name }}
                <div class="button-group">
                  <el-button
                    size="mini"
                    type="info"
                    @click="editCategory({data:firstItem, type:'category_first_edit'})"
                    round
                  >编辑</el-button>
                  <el-button
                    size="mini"
                    type="success"
                    @click="handelchildrenAdd({data:firstItem, type:'category_children_add'})"
                    round
                  >添加子级</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteCategory(firstItem.id)"
                    round
                  >删除</el-button>
                </div>
              </h4>
              <ul v-if="firstItem.children">
                <li v-for="childrenItem in firstItem.children" :key="childrenItem.id">
                  {{ childrenItem.category_name }}
                  <div class="button-group">
                    <el-button size="mini" type="info" round>编辑</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="deleteCategory(childrenItem.id)"
                      round
                    >删除</el-button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>

        <el-col :span="14">
          <div class="category-edit">
            <h4>一级分类编辑</h4>
            <el-form label-width="110px" ref="categoryForm">
              <el-form-item label="一级分类名称：">
                <el-input v-model="form.categoryName" :disabled="firstLoading"></el-input>
              </el-form-item>

              <el-form-item label="二级分类名称：">
                <el-input v-model="form.secCategoryName"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button size="mini" type="danger" @click="submit" :loading="submit_loading">确认</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {
  AddfirstCategory,
  DeleteCategory,
  EditCategory,
  AddChildrenCategory,
  GetCategoryAll
} from "@/api/news.js";
import { common } from "@/api/common.js";
import {
  reactive,
  ref,
  onMounted,
  computed,
  watch
} from "@vue/composition-api";
import { global } from "@/utils/global_V3.0";
export default {
  name: "infoCategory",
  setup(props, { root, refs }) {
    /**
     * vue 3.0
     */
    const { getInfoCtegory, categoryItem, getCategoryAll } = common();
    const { confirm } = global();
    /**
     * reactive
     */
    const form = reactive({
      categoryName: "",
      secCategoryName: ""
    });

    const categorys = reactive({
      item: [],
      current: []
    });

    /**
     * ref
     */
    const submit_button_type = ref("");
    const submit_loading = ref(false);
    const deleteID = ref("");
    const firstLoading = ref(false);
    /**
     * methods是挂在完成之后执行
     * method
     *
     */
    /**
      点击编辑,input框获取 一级分类名称
      保存类型
     */
    const editCategory = params => {
      // console.log(params)
      form.categoryName = params.data.category_name;
      submit_button_type.value = params.type;
      //存储当前点击的对象
      categorys.current = params.data;
    };

    /**
     * 获取到一级分类的类型
     */
    const addFirst = params => {
      submit_button_type.value = params.type;
      resetFormData();
    };

    const resetFormData = () => {
      // 重置表单
      // refs.categoryForm.resetFields();
      form.categoryName = "";
      form.secCategoryName = "";
      submit_loading.value = false;
    };

    /**
     * 请求修改接口
     *
     * 拿的是输入框中的内容
     *
     * 当编辑完成之后,再次点击确定依然会提示修改成功,所以判断categorys.current.length == 0就不再向下执行
     */
    const editFirstCategory = () => {
      if (categorys.current.length == 0) {
        root.$message({
          message: "为选择分类",
          type: "success"
        });
        return;
      }
      let requestData = {
        id: categorys.current.id,
        categoryName: form.categoryName
      };
      EditCategory(requestData)
        .then(response => {
          root.$message({
            message: "修改成功！！",
            type: "success"
          });
          categorys.current.category_name =
            response.data.data.data.categoryName;
          resetFormData();
          //点完之后要把刚刚存的数据清掉,并且判断category.current.length == 0 （categorys.current是一个数组）
          categorys.current = [];
        })
        .catch(error => {});
    };

    const submit = () => {
      if (submit_button_type.value == "category_first_edit") {
        editFirstCategory();
      }
      if (submit_button_type.value == "category_first_add") {
        addFirstCategory();
      }
      if (submit_button_type.value == "category_children_add") {
        addChildrenCategory();
      }
    };

    /**
     * 添加一级分类
     */
    const addFirstCategory = () => {
      if (!form.categoryName) {
        root.$message({
          message: "信息不能为空",
          type: "error"
        });
        return false;
      }
      //加载成功之后 状态变为不能点击
      submit_loading.value = true;
      AddfirstCategory({ categoryName: form.categoryName })
        .then(response => {
          let data = response.data;
          // console.log(data.data);
          root.$message({
            message: data.message,
            type: "success"
          });
          categorys.item.push(response.data.data);
          // 添加成功之后请求一次接口
          resetFormData();
        })
        .catch(error => {
          resetFormData();
        });
    };

    /**
     * 添加子级
     */
    const handelchildrenAdd = params => {
      //保存按钮类型
      submit_button_type.value = params.type;
      //保存数据
      category.current = params.data;
      //禁用一级文本框
      firstLoading.value = true;
      //获取一级分类名称
      form.categoryName = params.data.category_name;
      //启用按钮
      submit_loading.value = false;
    };

    const addChildrenCategory = () => {
      if (!form.secCategoryName) {
        root.$message({
          message: "未填写分类名称",
          type: "error"
        });
      }
      let requestData = {
        categoryName: form.secCategoryName,
        parentId: category.current.id
      };
      AddChildrenCategory(requestData)
        .then(response => {
          let responseData = response.data;
          root.$message({
            message: "添加成功！！",
            type: "success"
          });
          getInfoCategoryAll();
          form.secCategoryName = "";
        })
        .catch(error => {});
    };

    /**
     * 删除分类
     * 当点击取消时，deleteID.value 并没有清空 ， 所以需要清空  不然可能会影响下一次删除
     * 
     * 删除子级 可以 封装一个 删除 方法 编辑 也是
     */
    const deleteCategory = categoryID => {
      console.log(categoryID);

      deleteID.value = categoryID;
      confirm({
        content: "是否删除当前数据？",
        tip: "警告！",
        thenfn: confirmDelete,
        catchfn: () => {
          deleteID.value = "";
        }
      });
    };
    const confirmDelete = () => {
      DeleteCategory({ categoryId: deleteID.value })
        .then(response => {
          /**
           * 这里需要用两个 等号
           * findIndex 返回索引
           * filter 过滤
           * 过滤掉匹配的东西，之后返回一个新的数组
           */
          //方法一
          // let index = categorys.item.findIndex(item => item.id == deleteID.value)
          // categorys.item.splice(index, 1)
          //反法二  数据量大就不用这种
          let newData = categorys.item.filter(
            item => item.id != deleteID.value
          );
          categorys.item = newData;
        })
        .catch(error => {});
    };

    const childrenDelete = () => {
      DeleteCategory({ categoryId: deleteID.value })
        .then(response => {
          let index = categorys.item.children.findIndex(
            item => item.id == deleteID.value
          );
          categorys.item.children.splice(index, 1);
          getCategoryAll();
        })
        .catch(error => {});
    };
    /**
     * vuex获取分类
     */
    const GetInfoCtegorys = () => {
      root.$store
        .dispatch("common/getInfoCategory")
        .then(response => {
          categorys.item = response;
        })
        .catch(error => {});
    };

    /**
     * 拉取全部数据
     */
    const getInfoCategoryAll = () => {
      root.$store
        .dispatch("common/getCategoryAll")
        .then(response => {
          categorys.item = response;
        })
        .catch(error => {});
    };

    /**
     * onMonuted:生命周期
     *
     * 元素挂在完成后执行里面得方法
     */
    onMounted(() => {
      GetInfoCtegorys();
      getInfoCategoryAll();
      //  getCategoryAll()
    });

    /**
     * 监听
     *
     * vue3.0方法获取分类  知道调用这个方法和监听值就可以了,方法在onmounted调用
     */
    // watch(() => categoryItem.item, (value) => {
    //   categorys.item = value
    // })
    return {
      /**
       * ref
       */
      submit_loading,
      submit_button_type,
      firstLoading,
      /**
       * reactive
       */
      categorys,
      form,

      /**
       * methods
       */
      submit,
      resetFormData,
      deleteCategory,
      editCategory,
      addFirst,
      addFirstCategory,
      GetInfoCtegorys,
      handelchildrenAdd,
      addChildrenCategory,
      getInfoCategoryAll
    };
  }
};
</script>
<style lang="scss" scoped>
.category-warp {
  .category {
    // &::before {
    //   top: 28px;
    // }
  }
  div:first-child {
    // &::before {
    //   bottom: -33px;
    // }
  }
  div:last-child {
    // &::before {
    //   bottom: 20px;
    // }
  }
}
.category {
  position: relative;
  line-height: 44px;
  // &::before {
  //   content: "";
  //   position: absolute;
  //   top: 0px;
  //   bottom: 0px;
  //   left: 15px;
  //   width: 20px;
  //   border-right: 2px dotted #000000;
  // }
  h4 {
    position: relative;
    padding-left: 50px;
    background-color: rgba(162, 212, 121, 0.3);
  }
  svg {
    position: absolute;
    left: 28px;
    top: 15px;
  }
  li {
    position: relative;
    padding-left: 40px;
    // &:before {
    //   content: "";
    //   position: absolute;
    //   width: 35px;
    //   left: 0;
    //   top: 22px;
    //   border-bottom: 2px dotted #000000;
    // }
  }
}
li,
h4 {
  cursor: pointer;
  &:hover {
    .button-group {
      display: block;
    }
    transition: 0.5s;
    background-color: rgba(162, 212, 121, 0.3);
  }
}
.button-group {
  display: none;
  position: absolute;
  right: 9px;
  top: 0px;
  z-index: 2;
  button {
    font-size: 10px;
  }
}
.category-edit {
  line-height: 44px;
  label {
    width: 120px !important;
  }
  h4 {
    background-color: rgba(162, 212, 121, 0.3);
  }
}
</style>