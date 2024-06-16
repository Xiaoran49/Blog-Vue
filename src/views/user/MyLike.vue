<template>
  <div class="container">
    <div v-for="article in articles" :key="article.id" class="article">
      <div class="article-image">
        <img :src="getAvatarUrl(article.articleImg)" alt="Article Image">
      </div>
      <router-link :to="{ name: 'article', params: { id: article.articleId }}">
        <div class="article-content1">
          <div class="article-header">
            <div class="article-title">{{ article.articleTitle }}</div>
            <div class="article-meta">
              <span class="article-date">发布时间: {{ article.articleLastUpdateTime }}</span>
              <span class="article-author">作者: {{ article.userNickName }}</span>
            </div>
          </div>
          <div class="article-content">{{ article.articleContent.substr(0, 100) }}......</div>
          <div class="article-stats">
            <span class="article-likes">点赞数: {{ article.likeCount }}</span>
            <span class="article-comments">评论数: {{ article.viewCount }}</span>
          </div>
        </div>
      </router-link>
    </div>
    <!--el分页插件-->
    <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="pageNum"
        @current-change="pageChange"
        style="text-align: center"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '', //搜索条件
      total: 0, //默认总条数
      pageNum: 1, //默认当前页数
      pageSize: 5, //默认每页显示条数
      articles: [],
    };
  },
  methods: {
    loadData() {
      this.$axios.get('/like/getLikeArticles', {
        params: {
          id: JSON.parse(sessionStorage.getItem('user')).userId,
          page: this.pageNum,
          size: this.pageSize,
        }
      }).then((resp) => {
        this.articles = resp.list;
        this.total = resp.total;
      }).catch((error) => {
        console.error(error);
      });
    },
    pageChange(val) {
      this.pageNum = val;
      this.loadData(this.search, this.pageNum, this.pageSize);
    },
    getAvatarUrl(filename) {
      return require(`@/assets/uploadImgs/${filename}`);
    }
  },
  created() {
    this.loadData();
  },

};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}

.article {
  width: 100%;
  height: 18%;
  margin-bottom: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: #f5f4f1;
  position: relative;
  display: flex;
  align-items: flex-start; /* 改为 flex-start */
}

.article-image {
  width: 100px; /* 固定宽度 */
  height: 100px; /* 保留高度 */
  margin-right: 20px; /* 保留右侧间距 */
  border: 1px solid #ddd; /* 保留边框样式 */
  border-radius: 5px; /* 保留圆角 */
  display: flex; /* 保留弹性布局 */
  align-items: center; /* 垂直居中 */
}

.article-image img {
  width: 100px; /* 固定宽度 */
  height: 100px; /* 保留高度 */
  border-radius: 5px; /* 添加圆角 */
}

.article-content1 {
  margin-top: 10px; /* 固定顶部距离 */
}

.article-header {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.article-title {
  font-size: 20px;
  font-weight: bold;
}

.article-meta {
  font-size: 12px;
  color: #666;
  text-align: right;
  position: absolute;
  top: 10%;
  right: 1%;
}

.article-content {
  font-size: 18px;
  color: #555;
  margin-bottom: 10px;
  line-height: 1.5;
}

.article-stats {
  font-size: 12px;
  color: #666;
  text-align: right;
  position: absolute;
  bottom: 10%;
  right: 1%;
}

.article-likes,
.article-comments {
  margin-right: 10px;
}

.article-date,
.article-author {
  padding: 0 10px;
}

/* Custom link styles */
a {
  text-decoration: none !important;
  color: inherit !important;
}

a:hover {
  color: inherit !important;
}

a:active {
  color: inherit !important;
}

a:focus {
  outline: none;
}

.el-pagination {
  margin: 0px;
}

</style>
