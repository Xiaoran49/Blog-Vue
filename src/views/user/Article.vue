<template>
  <div class="container">
    <el-form :model="article" label-width="80px">
      <el-form-item label="文章标题">
        <el-input v-model="article.articleTitle"></el-input>
      </el-form-item>
      <el-form-item label="文章内容">
        <el-input type="textarea" v-model="article.articleContent" :rows="15"></el-input>
      </el-form-item>
      <el-form-item label="文章图片">
        <el-upload
            class="avatar-uploader"
            action=""
            :http-request="uploadFile"
            :limit="1"
            :before-upload="beforeUpload"
            :on-change="uploadChange"
            :auto-upload="true">
          <img v-if="imageUrl !== ''" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="info" @click="deleteForm">删除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      article: {},
      imageUrl:''
    };
  },
  created() {
    const articleId = this.$route.params.id;
    this.getArticleById(articleId);
  },
  methods: {
    getArticleById(id) {this.$axios.get('/article/getOneArticle', {
        params: {
          id: id
        }
      }).then((resp) => {
        this.article = resp;
        this.imageUrl = require(`../../assets/uploadImgs/${this.article.articleImg}`)
      }).catch((error) => {
        console.error(error);
      });
    },
    submitForm() {
      const fd = new FormData()
      fd.append('file', this.file);
      fd.append('article', JSON.stringify(this.article))
      this.$axios.post('/article/articleUpdate', fd).then((resp) => {
        this.$router.replace('/MyPage');
        this.$message({
          type: 'success',
          message: '修改成功',
          duration: 800,
        });
        // 数据修改成功后重新加载数据
      }).catch((error) => {
        console.error(error);
      });
    },
    deleteForm() {
      this.$axios.get('/article/articleDelete', {
        params: {
          id: this.article.articleId,
        }
      }).then((resp) => {
        this.$router.replace('/MyPage');
        this.$message({
          type: 'success',
          message: '删除成功',
          duration: 800,
        });
      }).catch((error) => {
        console.error(error);
      });
    },
    resetForm() {
      this.article = {}
    },
    uploadFile(files) {
      this.file = files.file;
    },
    uploadChange(res, file) {
      const file1 = event.target.files[0];
      // 使用 FileReader 对象读取文件并生成数据 URL
      const reader = new FileReader();
      reader.onload = () => {
        // 将生成的数据 URL 存储在组件的数据中
        this.imageUrl = reader.result;
        console.log(this.imageUrl)
      };
      reader.readAsDataURL(file1);
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
  }
};
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