<template>
  <div class="container">
    <div v-for="article in articles" :key="article.id" class="article">
      <router-link :to="{ name: 'ArticleComment', params: { id: article.articleId }}">
        <div class="article-header">
          <div class="article-title">{{ article.articleTitle }}</div>
          <div class="article-meta">
            <span class="article-date">发布时间: {{ article.articleLastUpdateTime }}</span>
            <span class="article-author">作者: {{ article.userNickName }}</span>
          </div>
        </div>
        <div class="article-content">{{ article.articleContent }}</div>
        <div class="article-stats">
          <span class="article-likes">点赞数: {{ article.likeCount }}</span>
          <span class="article-comments">评论数: {{ article.viewCount }}</span>
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
        class="fixed-pagination"
        style="text-align: center;margin: 20px 0px 10px 0px"/>
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
  methods:{
    loadData() {
      this.$axios.get('/comment/getCommentArticles', {
        params: {
          id: JSON.parse(sessionStorage.getItem('user')).userId,
          page: this.pageNum,
          size: this.pageSize,
        }
      }).then((resp) => {
        console.log(resp);
        this.articles = resp.list;
        this.total = resp.total;
      }).catch((error) => {
        console.error(error);
      });
    },
    pageChange(val){
      this.pageNum = val;
      this.loadData(this.search, this.pageNum, this.pageSize);
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
  position: relative; /* 添加相对定位 */
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
}

.article-content {
  font-size: 18px;
  color: #555;
  margin-bottom: 10px;
  line-height: 1.5;
}

.article-image {
  width: 100%;
  height: auto;
  border-radius: 5px;
}

.article-stats {
  font-size: 12px;
  color: #666;
  text-align: right;
  position: absolute; /* 添加绝对定位 */
  bottom: 10px; /* 相对于父元素底部定位 */
  right: 10px; /* 相对于父元素右侧定位 */
}

.article-likes,
.article-comments {
  margin-right: 10px;
}
.article-date,
article-author{
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
.el-pagination{
  margin: 0px;
}
.el-pagination {
  position: fixed; /* 固定定位 */
  bottom: 30px; /* 距离底部20px */
  left: 65%; /* 位于页面水平中间 */
  //transform: translateX(-50%); /* 居中 */
  z-index: 9999; /* 确保在页面上方 */
}
</style>
