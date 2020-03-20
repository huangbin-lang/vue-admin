<template>
  <div>
    <!-- gutter: 间隔 -->
    <el-row :gutter="16">
      <el-col :span="5">
        <div class="label-warp category">
          <label for>类型：</label>
          <div class="warp-content">
            <el-select v-model="category_value" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in category_options.categorys"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-col>

      <el-col :span="7">
        <div class="label-warp date">
          <label for>时间：</label>
          <div class="warp-content">
            <el-date-picker
              v-model="date_value"
              type="datetimerange"
              :picker-options="picker_options"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00','00:00:00']"
              align="right"
            ></el-date-picker>
          </div>
        </div>
      </el-col>

      <el-col :span="5">
        <div class="label-warp key-work">
          <label for>关键字：</label>
          <div class="warp-content">
            <el-select v-model="search_key" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in search_option"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <el-input v-model="search_keyWork" placeholder="请输入内容" style="width:100%"></el-input>
      </el-col>

      <el-col :span="2">
        <el-button type="danger" style="width:100%" @click="getList">搜索</el-button>
      </el-col>

      <el-col :span="2">
        <el-button
          type="danger"
          class="pull-right"
          style="width:100%"
          @click="dialog_info = true"
        >新增</el-button>
      </el-col>
    </el-row>

    <!-- 表格数据 -->
    <div class="height-space-30"></div>
    <el-table
      :data="table_data.item"
      height="320"
      border
      v-loading="loadingData"
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="title" label="标题" width="400"></el-table-column>
      <el-table-column prop="categoryId" label="类型" width="120" :formatter="toCategory"></el-table-column>
      <el-table-column prop="createDate" label="时间" width="160" :formatter="toData"></el-table-column>
      <el-table-column prop="user" label="管理员" width="100"></el-table-column>
      <el-table-column label="操作">
        <!-- scope:保存的是数据 -->
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="Delete_item(scope.row.id)">删除</el-button>
          <el-button type="success" size="small" @click="editInfo(scope.row.id)">编辑</el-button>
          <el-button type="success" size="small" @click="editInfo(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-row>
      <el-col :span="12">
        <el-button size="medium" @click="Delete_all">批量删除</el-button>
        <!-- <el-button size="medium" @click="Delete_all22">批量删除</el-button> -->
      </el-col>
      <el-col :span="12">
        <el-pagination
          class="pull-right"
          :page-sizes="[10,20,50,100]"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-col>
    </el-row>
    <!-- 新增弹窗 info.vue->this.$emit('close', false) 配合  @close="close"(这个写在标签中) 做逻辑处理 -->
    <DialogInfo :flag.sync="dialog_info" :category="category_options.categorys" />
    <DialogEditInfo
      :flag.sync="dialog_edit_info"
      :id="infoId"
      :category="category_options.categorys"
      @getListEmit="getList"
    />
  </div>
</template>
<script>
import { common } from "@/api/common.js";
import { GetCategory, GetList, DeleteInfo } from "@/api/news.js";
import DialogInfo from "./dialog/info.vue";
import DialogEditInfo from "./dialog/edit.vue";
import { global } from "@/utils/global_V3.0";
import { timestampToTime } from "@/utils/common.js";
import { reactive, ref, watch, onMounted } from "@vue/composition-api";

export default {
  name: "infoIndex",
  components: {
    DialogInfo,
    DialogEditInfo
  },
  setup(props, { root }) {
    const { getInfoCtegory, categoryItem } = common();
    /**
     * 重命名的方式解决命名空间
     */
    // const { str: ss, confirm: Cdd } = global();
    const { str, confirm } = global();
    //watch 深度监听数据
    // watch(() => {
    //   console.log(ss.value + '=======');
    // });
    // watch(() => {
    //   console.log(cc.value);
    // });
    /**
     * ref
     */
    const loadingData = ref(true);
    const dialog_info = ref(false);
    const dialog_edit_info = ref(false);
    const date_value = ref("");
    const category_value = ref("");
    const search_key = ref("id");
    const search_keyWork = ref("");
    const total = ref(0);
    const deleteId = ref("");
    const infoId = ref("");
    /**
     * reactive
     */
    //页码
    const page = reactive({
      pageNumber: 1,
      pageSize: 10
    });

    const category_options = reactive({
      categorys: []
    });

    const search_option = reactive([
      { value: "id", label: "ID" },
      { value: "title", label: "标题" }
    ]);

    const form_inline = reactive({
      user: "",
      region: ""
    });

    const table_data = reactive({
      item: []
    });

    const picker_options = reactive({
      shortcuts: [
        {
          text: "最近一周",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "最近一个月",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "最近三个月",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit("pick", [start, end]);
          }
        }
      ]
    });

    /**
     * vue 2.0 methods
     *
     *  const close = (val) => {
     *  在这里做逻辑性的事情
     *  dialog_info.value = val
     *  }
     */

    const handleSizeChange = val => {
      page.pageSize = val;
    };

    const handleCurrentChange = val => {
      page.pageNumber = val;
      getList();
    };

    const handleSelectionChange = val => {
      let id = val.map(item => item.id);
      deleteId.value = id;
      console.log(id);
    };

    /**
     * 编辑信息
     */
    const editInfo = id => {
      infoId.value = id;
      dialog_edit_info.value = true;
    };

    /**
     * 删除信息
     */
    const Delete_item = id => {
      deleteId.value = [id];
      confirm({
        content: "是否删除当前数据？",
        tip: "警告！",
        thenfn: confirmDelete,
        id: deleteId.value
      });
    };

    const Delete_all = () => {
      if (!deleteId.value || deleteId.value.length == 0) {
        root.$message({
          message: "请选择要删除的数据",
          type: "info"
        });
        return false;
      }
      confirm({
        content: "是否删除当前数据？",
        tip: "警告！",
        thenfn: confirmDelete,
        id: deleteId.value
      });
    };

    //这里的参数是global_3.0传过来的id
    const confirmDelete = val => {
      console.log(val);
      DeleteInfo({ id: deleteId.value })
        .then(response => {
          root.$message({
            message: "删除成功！！",
            type: "success"
          });
          deleteId.value = "";
          getList();
        })
        .catch(error => {});
    };

    /**
     * 搜索
     */
    // const searchButton = () => {
    //   // let requestData = formateData();
    //   getList();
    // };

    const formateData = () => {
      let requestData = {
        pageNumber: page.pageNumber,
        pageSize: page.pageSize
      };
      //分类ID
      if (category_value.value) {
        requestData.categoryId = category_value.value;
      }
      //日期
      if (date_value.value) {
        requestData.starTiem = date_value.value[0];
        requestData.endTiem = date_value.value[1];
      }
      //关键字
      if (search_keyWork.value) {
        requestData[search_key.value] = search_keyWork.value;
      }
      return requestData;
    };

    /**
     * 获取添加的信息
     */
    const getList = () => {
      let requestData = formateData();
      //加载状态
      loadingData.value = true;
      GetList(requestData)
        .then(response => {
          let data = response.data.data;
          //更新数据
          table_data.item = data.data;
          //数据条数
          total.value = data.total;

          loadingData.value = false;
        })
        .catch(error => {
          loadingData.value = false;
        });
    };

    /**
     * 获取分类信息
     */
    const getinfocategory = () => {
      root.$store
        .dispatch("common/getInfoCategory")
        .then(response => {
          category_options.categorys = response;
        })
        .catch(error => {});
    };

    //时间转换
    const toData = (row, column) => {
      return timestampToTime(row.createDate);
    };

    //类型
    const toCategory = row => {
      let category_id = row.categoryId;
      let categoryData = category_options.categorys.filter(
        item => item.id == category_id
      );
      //新的值将原始的值替换
      return categoryData[0].category_name;
    };
    /**
     * 生命周期
     */
    onMounted(() => {
      //vue3.0获取分类
      // getInfoCtegory();
      getList();
      //vuex获取分类
      getinfocategory();
    });

    /**
     * 监听
     */

    watch(
      () => categoryItem.item,
      value => {
        category_options.categorys = value;
      }
    );

    return {
      // 对象数据
      picker_options,
      search_option,
      form_inline,
      table_data,
      category_options,
      // 基础数据
      infoId,
      deleteId,
      category_value,
      loadingData,
      date_value,
      dialog_info,
      dialog_edit_info,
      search_key,
      search_keyWork,
      total,
      // 方法
      Delete_item,
      Delete_all,
      getList,
      handleSizeChange,
      handleCurrentChange,
      toData,
      toCategory,
      handleSelectionChange,
      editInfo
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/config.scss";
.label-warp {
  .warp-content .el-input__inner {
    width: 240px;
    margin-left: 10px;
  }
  &.category {
    @include LabelDom(left, 60, 40);
  }
  &.date {
    @include LabelDom(right, 45, 40);
  }
  &.key-work {
    @include LabelDom(right, 60, 40);
  }
}
</style>