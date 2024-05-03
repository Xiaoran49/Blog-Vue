<template>
  <div class="container">
    <el-form :model="article" label-width="80px">
      <el-form-item label="文章标题">
        <el-input v-model="article.articleTitle"></el-input>
      </el-form-item>
      <el-form-item label="文章内容">
        <el-input type="textarea" v-model="article.articleContent" :rows="15"></el-input>
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
      options: [],
      value: '',
    };
  },
  created() {
    const articleId = this.$route.params.id;
    this.getArticleById(articleId);
    this.loadData();
    // console.log(this.article);
  },
  methods: {
    loadData() {
      this.$axios.get('/user/getUserName').then((resp) => {
        this.options = resp;
      }).catch((error) => {
        console.error(error);
      });
    },
    getArticleById(id) {this.$axios.get('/article/getOneArticle', {
        params: {
          id: id
        }
      }).then((resp) => {
        this.value = resp.userNickName;
        this.article = resp;
        // console.log(resp);
      }).catch((error) => {
        console.error(error);
      });
    },
    submitForm() {
      this.$axios.get('/article/articleUpdate', {
        params: {
          articleId:this.article.articleId,
          articleTitle: this.article.articleTitle,
          articleContent: this.article.articleContent,
        }
      }).then((resp) => {
        this.$router.replace('/MyPage');
        this.$message({
          type: 'success',
          message: '修改成功',
          duration: 800,
        });
        // 数据修改成功后重新加载数据
        this.loadData();
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
        // 数据修改成功后重新加载数据
        this.loadData();
      }).catch((error) => {
        console.error(error);
      });
    },
    resetForm() {
      this.article = {}
    },
  }
};
</script>
<style scoped lang='scss'>
.container {
}
</style>