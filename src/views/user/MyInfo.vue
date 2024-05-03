<template>
  <div class="container">
    <el-form :model="user" label-width="90px">
      <el-form-item label="用户昵称">
        <el-input v-model="user.userNickName"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱">
        <el-input v-model="user.userEmail"></el-input>
      </el-form-item>
      <el-form-item label="用户手机号">
        <el-input v-model="user.userPhoneNumber"></el-input>
      </el-form-item>
      <el-form-item label="用户性别">
        <el-input v-model="user.userSex"></el-input>
      </el-form-item>
      <el-form-item label="用户年龄">
        <el-input v-model="user.userAge"></el-input>
      </el-form-item>
      <el-form-item label="用户签名">
        <el-input v-model="user.userIntroduce"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="info" @click="$router.push('/ChangePwd')">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
    }
  },
  components: {},
  mounted() {
  },
  methods: {
    loadData(){
      this.$axios.get('/user/getOneUser', {
        params: {
          id: JSON.parse(sessionStorage.getItem('user')).userId,
        }
      }).then((resp) => {
        this.user = resp;
      }).catch((error) => {
        console.error(error);
      });
    },
    submitForm(){
      this.$axios.get('/user/userUpdate', {
        params: {
          userId: JSON.parse(sessionStorage.getItem('user')).userId,
          userNickName: this.user.userNickName,
          userEmail: this.user.userEmail,
          userPhoneNumber: this.user.userPhoneNumber,
          userSex: this.user.userSex,
          userAge: this.user.userAge,
          userIntroduce: this.user.userIntroduce,
        }
      }).then((resp) => {
        this.$message({
          type: 'success',
          message: '修改成功',
          duration: 1000,
        });
        this.loadData();
      }).catch((error) => {
        console.error(error);
      });
    },
    resetForm(){
      this.user = {};
    },
  },
  created() {
    this.loadData();
  }
}

</script>
<style scoped lang='scss'>
.container {
}
</style>