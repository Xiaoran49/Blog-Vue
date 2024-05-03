<template>
  <div v-loading="loading" element-loading-text="登录中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.6)" class="login-container">

    <el-form class="login-form">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="../assets/imgs/user.png" alt="">
      </div>
      <div class="title-container">
        <h3 class="title">博客Blog</h3>
      </div>

      <el-form-item>
        <span class="svg-container">
          <i class="el-icon-user"></i>
        </span>
        <el-input v-model="user.userName" placeholder="请输入用户名" name="username" type="text" @keyup.enter.native="handleLogin"/>
      </el-form-item>

      <el-form-item>
        <span class="svg-container">
          <i class="el-icon-lock"></i>
        </span>
        <el-input v-model="user.userPassword" :type="passwordType" placeholder="请输入密码" name="password" @keyup.enter.native="handleLogin"/>
        <span class="show-pwd">
          <i>
            <i class="el-icon-view" @click="passwordType = passwordType === 'password' ? 'text' : 'password'"></i>
          </i>
        </span>
      </el-form-item>
      <div>
        <el-button type="primary" style="width:100%;margin-bottom:20px;" @click="handleLogin">登录</el-button>
        <el-button style="width:100%;margin:0px;" @click="handleRegister">注册</el-button>
      </div>
    </el-form>
    <div class="copyright">
      <p>&copy; 2024 XiaoRan. All rights reserved.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      user:{
        userName:'',
        userPassword:''
      },
      loading: false,
      passwordType: 'password',
    }
  },
  methods: {
    handleLogin() {
      this.loading = true
      this.$axios.get('/user/userLogin', {
        params:{
          userName:this.user.userName,
          userPassword:this.user.userPassword
        }
      }).then((resp) => {
        console.log(resp);
        // 如果响应状态码为 200，则表示登录成功
        if (resp.status === 200) {
            // 登录成功逻辑
            this.$message({
              type: 'success',
              message: '登录成功！',
              duration: 1000,
            });
            this.loading = false
            // 保存用户信息到sessionStorage中
            sessionStorage.setItem('user', JSON.stringify(resp.user));
            if (resp.user.userIsAdmin === 1){
              this.$router.push('/admin');
            }else {
              this.$router.push('/user');
            }
        }else if (resp.status === 500){
          // 其他状态码处理逻辑
          this.$message({
            type: 'error',
            message: '用户名或密码错误！',
            duration: 1000,
          });
          this.loading = false
          console.log('用户名或密码错误！');
        }else {
          // 其他状态码处理逻辑
          this.$message({
            type: 'error',
            message: '未知错误！',
            duration: 1000,
          });
          this.loading = false
        }
      }).catch(error => {
        // 异常处理逻辑
        console.error('请求出错：'+error);
        this.loading = false
      })
    },
    handleRegister(){
      this.$router.push('/register');
    },
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
.login-container {
  font-family: "微软雅黑 Light";
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  font-family: "微软雅黑 Light";
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #3b3c3d;
  background-size: 100% 100%;
  .copyright {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    color: #ccc;
    font-size: 12px;
  }

  // 头像
  .avatar-box {
    margin: 0 auto;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 1px solid #409eff;
    box-shadow: 0 0 10px #409eff;
    position: relative;
    bottom: 20px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 30px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: 500;

    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
