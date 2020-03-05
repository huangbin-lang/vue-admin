<template>
  <div id="login">
    <div class="login-warp">
      <ul class="menu-tab">
        <!-- :key="item.id" 如果没有会自动生成一个id {tex:'登陆',current:true,id} 有就调用这个id -->
        <li
          v-for="item in menuTab"
          :class="{'current':item.current}"
          :key="item.id"
          @click="toggleMenu(item)"
        >{{ item.tex }}</li>
      </ul>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm" class="login-from">
        <el-form-item prop="username" class="item-from">
          <label for="username">邮箱</label>
          <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-from">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="text"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="passwords" class="item-from" v-show="model === 'register'">
          <label for="passwords">重复密码</label>
          <el-input
            id="passwords"
            type="text"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-from">
          <label for>验证码</label>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-input v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
            </el-col>
            <el-col :span="12">
              <el-button
                type="success"
                class="block"
                @click="getSms()"
                :disabled="codeButtons.statu"
              >{{ codeButtons.text }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('loginForm')"
            class="login-btn block"
            :disabled="loginbuttonStatus"
          >{{ model === 'login' ? '登陆' : '注册'}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import sha1 from "js-sha1";
import { GetSms, Register, Login } from "@/api/login.js";
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api";
import {
  stripscript,
  validateEmail,
  validatePass,
  validateCd
} from "@/utils/validate.js";

export default {
  name: "login",
  /**
   * 解构写法
   * setup(props, { refs })
   *
   * 就可以直接用 refs[formName]
   *
   * 生命周期函数：onMounted(() => {})
   *
   * 对象数据：const name = reactive({})
   *
   * 基础数据: const name = ref()
   *
   * 申明的数据需要return
   */
  // setup(props, context) {
  setup(props, { refs, root }) {
    /**
     * console.log(context)中的方法
     * attrs(...) == this.$attrs
     * emit(...) == this.$emit
     * listeners(...) == this.$listeners
     * parent(...) == this.$parent
     * refs(...) == this.$refs
     * root(...) == this
     */
    // 用户名验证
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    // 密码验证
    let validatePassword = (rule, value, callback) => {
      // 把过滤的数据赋给rules.password再重新赋给value
      ruleForm.password = stripscript(value);
      value = ruleForm.password;

      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!validatePass(value)) {
        callback(new Error("密码不正确"));
      } else {
        callback();
      }
    };
    // 验证重复密码
    let validatePasswords = (rule, value, callback) => {
      // 如果模块之为login,就直接通过
      if (model.value === "login") {
        callback();
      }
      // 把过滤的数据赋给rules.password再重新赋给value
      ruleForm.passwords = stripscript(value);
      value = ruleForm.passwords;

      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value !== ruleForm.password) {
        callback(new Error("密码不相同"));
      } else {
        callback();
      }
    };
    // 验证码
    let validateCode = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("验证码不能为空"));
      } else if (validateCd(value)) {
        return callback(new Error("请输入正确的验证码"));
      } else {
        callback();
      }
    };
    /**
     * 申明数据
     */
    const menuTab = reactive([
      { tex: "登陆", current: true, type: "login" },
      { tex: "注册", current: false, type: "register" }
    ]);
    // 基础数据
    const model = ref("login");
    // 登陆按钮禁用状态
    const loginbuttonStatus = ref(true);
    // 验证码按钮禁用状态
    const codeButtons = reactive({
      statu: false,
      text: "获取验证码"
    });
    // 倒计时
    const timer = ref(null);
    // 表单绑定数据
    const ruleForm = reactive({
      username: "852298715@qq.com",
      password: "1305388810",
      passwords: "1305388810",
      code: ""
    });

    // 表单的验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }]
    });

    /**
     * 申明函数
     * 这里面没有this
     */
    //切换模块
    const toggleMenu = data => {
      menuTab.forEach(element => {
        element.current = false;
      });
      // 高亮
      data.current = true;
      // 隐藏和像是重复密码
      // 直接赋值model是更改,.value才是赋值
      //console.log(data.type)//登陆：login  注册：register
      model.value = data.type;
      // 重置表单
      resetFormData();
      // 恢复验证码默认状态
      clearCountDown();
    };
    const resetFormData = () => {
      // 重置表单
      refs.loginForm.resetFields();
    };

    /**
     * 更新按钮状态
     */
    const updataButtonStatus = params => {
      // 修改获取验证码状态
      codeButtons.statu = params.statu;
      // 修改验证码文字
      codeButtons.text = params.text;
    };

    /**
     * 获取验证码
     */
    const getSms = () => {
      // 进行提示
      /**
       * request中的响应拦截中也做了一次判断
       */
      if (ruleForm.username === "") {
        root.$message.error("邮箱不能为空");
        return false;
      }

      // 邮箱格式
      if (validateEmail(ruleForm.username)) {
        root.$message.error("邮箱格式不正确！");
        return false;
      }

      //获取验证码
      /**
       * module: 'login'
       * 传入module 判断邮箱存不存在
       */
      let requestData = {
        username: ruleForm.username,
        module: model.value
      };

      // 清除按钮状态
      updataButtonStatus({
        statu: true,
        text: "发送中"
      });

      GetSms(requestData)
        //对应requese响应拦截中的  return response
        .then(response => {
          let data = response.data;

          root.$message({
            //弹出验证码发送成功
            message: data.message,
            type: "success"
          });

          // 启用登陆或注册按钮
          loginbuttonStatus.value = false;

          // 调定时器,倒计时
          conutDown(10);
        })
        //对用  return Promise.reject(data)
        .catch(error => {
          console.log(error);
        });
    };

    /**
     * 提交表单
     *
     * formName 对应的是 loginForm
     */
    const submitForm = formName => {
      refs[formName].validate(valid => {
        if (valid) {
          // 判断type 类型
          model.value === "login" ? login() : register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    /**
     * 登陆
     * 
     * 通过dispatch调用 store里面的异步请求
     */
    const login = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      root.$store
        .dispatch("app/loGin", requestData)
        .then(response => {
          console.log("登陆成功");
          //store 中的 actions 需要将 response 返回出来 不然是undefined
          console.log(response);
          // 页面跳转
          root.$router.push({
            name: "Console"
          });
        })
        .catch(error => {});
      // Login(requestData)
      //   .then(response => {
      //     console.log("登陆成功");
      //     // 页面跳转
      //     root.$router.push({
      //       // Console 这是 路由中的 Console
      //       name: "Console"
      //     });
      //   })
      //   .catch(error => {});
    };
    /**
     * 注册
     */
    const register = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code,
        module: "register"
      };
      // 注册接口
      Register(requestData)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          // 模拟注册成功   自动切换到登陆
          toggleMenu(menuTab[0]);
          // 恢复验证码默认状态
          clearCountDown();
        })
        .catch(error => {});
    };
    /**
      倒计时
     */
    const conutDown = number => {
      // 判断定时器是否存在,存在则清除
      if (timer.value) {
        clearInterval(timer.value);
      }
      let time = number;
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          clearInterval(timer.value);

          // 清除按钮状态
          updataButtonStatus({
            statu: false,
            text: "再次获取"
          });
        } else {
          codeButtons.text = `倒计时${time}秒`;
        }
      }, 1000);
    };
    //恢复验证码默认状态
    const clearCountDown = () => {
      // 清除按钮状态
      updataButtonStatus({
        statu: false,
        text: "获取验证码"
      });
      clearInterval(timer.value);
      // const codeButtons = reactive({
      //   statu: false,
      //   text: "获取验证码"
      // });
    };
    /* 生命周期
       挂在完成后
    onMounted(() => {});

    // 要将所有定义的数据全部return
    */
    return {
      menuTab,
      ref,
      model,
      loginbuttonStatus,
      codeButtons,
      ruleForm,
      rules,
      onMounted,
      submitForm,
      toggleMenu,
      getSms
    };
  }
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
/* socped:加上了代表只在当前的文件生效,没加就代表在全局生效 */
#login {
  height: 100vh;
  background: rgb(139, 139, 243);
}
.login-warp {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    font-size: 14px;
    line-height: 36px;
    border-radius: 2px;
    color: #fff;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 1);
  }
}
.login-from {
  margin-top: 29px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
  }
  .item-from {
    margin-bottom: 13px;
  }
  .block {
    display: block;
    width: 100%;
    height: 40px;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>