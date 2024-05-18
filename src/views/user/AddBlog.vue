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
        <el-upload class="avatar-uploader"
                   action=""
                   :http-request="uploadFile"
                   :multiple="false"
                   :limit="1"
                   :before-upload="beforeUpload"
                   :on-success="uploadSuccess"
                   :auto-upload="true"
        >
          <el-button size="mini" type="success">点击选择文件<i class="el-icon-upload el-icon--right"></i></el-button>
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
      file:'',
    }
  },
  components: {},
  mounted() {
  },
  methods: {
    submitForm(){
      this.article.userId = JSON.parse(sessionStorage.getItem('user')).userId
      // console.log(this.article)
      const fd = new FormData()
      fd.append('file',this.file);
      fd.append('article', JSON.stringify(this.article));
      console.log(fd)
      this.$axios.post(
          '/article/articleInsert', fd
      ).then((resp) => {
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
    uploadSuccess(res, file){
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(file)
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      console.log(file)
      if (!isJPG) {
        this.$message.error('上传图片格式有误!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    uploadFile(files) {
      this.file = files.file;
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