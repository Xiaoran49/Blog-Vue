<template>
  <div class="container">
    <el-form :model="article" label-width="80px">
      <el-form-item label="文章标题">
        <el-input v-model="article.articleTitle"></el-input>
      </el-form-item>
      <el-form-item label="文章内容">
        <el-input type="textarea" v-model="article.articleContent" :rows="15"></el-input>
      </el-form-item>
      <el-form-item label="图片上传">
        <el-upload class="avatar-uploader" action="/api/picture/pictureInsert"
                   :show-file-list="false"
                   :on-success="handleAvatarSuccess"
                   :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      article:{},
      imageUrl:'',
    }
  },
  components: {},
  mounted() {
  },
  methods: {
    submitForm(){
      this.$axios.post('/article/articleInsert', {
          articleTitle: this.article.articleTitle,
          articleContent: this.article.articleContent,
          userId: JSON.parse(sessionStorage.getItem('user')).userId,
      }).then((resp) => {
        this.$router.replace('/MyPage');
        this.$message({
          type: 'success',
          message: '添加成功',
          duration: 800,
        });
      }).catch((error) => {
        console.error(error);
      });
    },
    resetForm(){
      this.article = {}
    },
    // 文件上传成功时的钩子
    handleAvatarSuccess(res, file){
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(file)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      console.log(file)
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
  },
}
</script>
<style scoped lang='scss'>
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