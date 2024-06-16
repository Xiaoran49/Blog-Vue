<template>
  <div class='container'>
    <el-form :model="password" label-width="100px">
      <el-form-item label="原始密码">
        <el-input v-model="password.oldPassword"></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input type="password" v-model="password.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input type="password" v-model="password.confirmPassword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">确认修改</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password:{
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      }
    }
  },
  components: {},
  mounted() {

  },
  methods: {
    submitForm(){
      //MD5加密存储
      // console.log(this.$md5(this.password.oldPassword))
      if (this.$md5(this.password.oldPassword) != JSON.parse(sessionStorage.getItem('user')).userPassword){
        this.$message({
          type: 'error',
          message: '原始密码错误！',
          duration: 1000,
        });
      }else if (this.password.newPassword != this.password.confirmPassword){
        this.$message({
          type: 'error',
          message: '两次输入密码不一致！',
          duration: 1000,
        });
      }else {

        this.$axios.get('/user/userUpdatePwd', {
          params: {
            userId: JSON.parse(sessionStorage.getItem('user')).userId,
            userPassword: this.password.newPassword,
          }
        }).then((resp) => {
          this.$router.replace('/MyInfo');
          this.$message({
            type: 'success',
            message: '修改成功',
            duration: 1000,
          });
        }).catch((error) => {
          console.error(error);
        });
      }
    },
    resetForm(){
      this.password = {}
    }
  },
  created() {
  }
}

</script>
<style scoped lang='scss'>
.container {
}
</style>