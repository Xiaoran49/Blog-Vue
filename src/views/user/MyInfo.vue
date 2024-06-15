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
      <el-form-item label="用户头像">
        <!--        <el-input v-model="user.avatar"></el-input>-->
        <el-upload
            :auto-upload="true"
            :before-upload="beforeUpload"
            :http-request="uploadFile"
            :limit="1"
            :on-change="uploadChange"
            action=""
            class="avatar-uploader">
          <img v-if="imageUrl !== require(`../../assets/imgs/user.png`)" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
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
      imageUrl: ''
    }
  },
  components: {},
  mounted() {
  },
  methods: {
    loadData() {
      this.$axios.get('/user/getOneUser', {
        params: {
          id: JSON.parse(sessionStorage.getItem('user')).userId,
        }
      }).then((resp) => {
        this.user = resp;
        this.imageUrl = require(`../../assets/uploadImgs/${this.user.avatar}`)
        console.log(this.imageUrl)
      }).catch((error) => {
        console.error(error);
      });
    },
    submitForm() {
      //图片上传
      const fd = new FormData()
      fd.append('file', this.file);
      fd.append('user', JSON.stringify(this.user))
      console.log(fd)
      console.log(this.user)
      this.$axios.post('/user/userUpdate', fd).then((resp) => {
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
    resetForm() {
      this.user = {};
    },
    uploadChange(res, file) {
      const file1 = event.target.files[0];
      // 使用 FileReader 对象读取文件并生成数据 URL
      const reader = new FileReader();
      reader.onload = () => {
        // 将生成的数据 URL 存储在组件的数据中
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file1);
      // this.imageUrl = file.response
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    uploadFile(files) {
      this.file = files.file;
    },
  },
  created() {
    this.loadData();
  }
}

</script>
<style lang='scss' scoped>
.container {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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
}
</style>