<template>
  <div v-loading="loading" element-loading-text="注册中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.6)" class="login-container">

    <el-form class="login-form">
      <div class="title-container">
        <h3 class="title">博客Blog注册</h3>
      </div>
      <el-form-item>
        <span class="svg-container">
          <i class="el-icon-user-solid"></i>
        </span>
        <el-input v-model="user.userNickName" placeholder="请输入昵称" name="userNickName" type="text" @keyup.enter.native="registe"/>
      </el-form-item>
      <el-form-item>
        <span class="svg-container">
          <i class="el-icon-user"></i>
        </span>
        <el-input v-model="user.userName" placeholder="请输入用户名" name="userName" type="text" @keyup.enter.native="registe"/>
      </el-form-item>
      <el-form-item>
        <span class="svg-container">
          <i class="el-icon-lock"></i>
        </span>
        <el-input v-model="user.userPassword" :type="passwordType" placeholder="请输入密码" name="password" @keyup.enter.native="handleLogin"/>
        <span class="show-pwd">
          <i class="el-icon-view" @click="passwordType = passwordType === 'password' ? 'text' : 'password'"></i>
        </span>
      </el-form-item>
      <el-form-item>
        <span class="svg-container">
          <i class="el-icon-lock"></i>
        </span>
        <el-input v-model="user.confirmUserPassword" :type="confirmPasswordType" placeholder="请再次输入密码" name="password" @keyup.enter.native="handleLogin"/>
        <span class="show-pwd">
          <i class="el-icon-view" @click="confirmPasswordType = confirmPasswordType === 'password' ? 'text' : 'password'"></i>
        </span>
      </el-form-item>
      <el-form-item>
        <span class="svg-container">
          <span>&#9993;</span>
        </span>
        <el-input v-model="user.userEmail" placeholder="请输入邮箱" name="userEmail" type="text" @keyup.enter.native="registe"/>
      </el-form-item>
      <el-form-item>
        <span class="svg-container">
          <el-icon name="phone"></el-icon>
        </span>
        <el-input v-model="user.userPhoneNumber" placeholder="请输入手机号" name="userPhoneNumber" type="text" @keyup.enter.native="registe"/>
      </el-form-item>
      <el-form-item>
        <span class="svg-container">
          <i class="el-icon-male"></i>
        </span>
        <el-radio-group v-model="user.userSex" style="padding: 12px 5px 12px 15px">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <span class="svg-container">
          <i class="el-icon-date"></i>
        </span>
        <el-date-picker
            v-model="user.birthDate"
            type="date"
            placeholder="请选择出生日期"
            name="userAge"
            format="yyyy-MM-dd"
            @change="calculateAge"
            class="el-input"
            style="width: 90%"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <span class="svg-container">
          <i class="el-icon-collection-tag"></i>
        </span>
        <el-input v-model="user.userIntroduce" placeholder="请输入个人签名" name="userIntroduce" type="text" @keyup.enter.native="registe"/>
      </el-form-item>
      <div>
        <el-button type="primary" style="width:100%;margin-bottom:20px;" @click="registe">注册</el-button>
        <el-button style="width:100%;margin:0px;" @click="goLogin">已有账号去登录</el-button>
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
      // 头像状态
      TxStatus: true,
      user:{
        userNickName:'',
        userName:'',
        userPassword:'',
        confirmUserPassword:'',
        userEmail:'',
        userPhoneNumber:'',
        userSex:'',
        birthDate:'',
        userAge:'',
        userIntroduce:''
      },
      loading: false,
      passwordType: 'password',
      confirmPasswordType:'password',
    }
  },
  methods: {
    calculateAge() {
      if (this.user.birthDate) {
        const birthDate = new Date(this.user.birthDate);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - birthDate.getFullYear();
        this.user.userAge = age;
      }
    },
    registe() {
      console.log(this.user)
      // 首先进行基本的非空验证
      if (!this.user.userNickName || !this.user.userName || !this.user.userPassword || !this.user.confirmUserPassword || !this.user.userEmail || !this.user.userPhoneNumber || !this.user.userSex || !this.user.userAge || !this.user.userIntroduce) {
        this.$message({type:'error',message:'请填写完整信息',duration:1000});
        return;
      }

      // 检查密码和确认密码是否匹配
      if (this.user.userPassword !== this.user.confirmUserPassword) {
        this.$message({type:'error',message:'密码和确认密码不匹配',duration:1000});
        return;
      }

      // 对邮箱格式进行验证
      const emailPattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!emailPattern.test(this.user.userEmail)) {
        this.$message({type:'error',message:'请输入有效的邮箱地址',duration:1000});
        return;
      }

      // 对手机号格式进行验证
      const phonePattern = /^1[3456789]\d{9}$/;
      if (!phonePattern.test(this.user.userPhoneNumber)) {
        this.$message({type:'error',message:'请输入有效的手机号码',duration:1000});
        return;
      }

      this.$axios.get('/user/selectUserName',{
        params: {
          userName: this.user.userName
        }
      }).then((resp) => {
        if (resp === 1) {
          this.$message({type:'error',message:'用户名重复，请重新输入',duration:1000});
        } else {
          this.$axios.get('/user/userRegister', {
            params:{
              userNickName: this.user.userNickName,
              userName: this.user.userName,
              userPassword: this.user.userPassword,
              userEmail: this.user.userEmail,
              userPhoneNumber: this.user.userPhoneNumber,
              userSex: this.user.userSex,
              userAge: this.user.userAge,
              userIntroduce: this.user.userIntroduce
            }
          }).then(
              this.$message({type:'success',message:'注册成功',duration:1000}),
              this.$router.push('/'),
          );
        }
      });
    },
    goLogin(){
      this.$router.push('/')
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
    margin-bottom: 10px;
  }
  .el-date-picker {
    width: 85%;
    .el-input {
      width: 100%;
    }
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
  background-color: #505050;
  background-size: 100% 100%;
  .copyright {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    color: #ccc;
    font-size: 12px;
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 100px 35px 0;
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
      color: $dark_gray;
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

::v-deep(.el-input__prefix){
  display: none;
}
</style>
