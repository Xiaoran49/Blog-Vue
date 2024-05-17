<template>
  <div class="blog-layout">
    <!-- 左边界面 -->
    <div class="left-panel">
      <div class="user-info">
        <div class="avatar">
          <img :src="imageUrl" alt="" style="width: 500px">
        </div>
        <div class="stats">
          <div class="stat">
            <i class="el-icon-star-on"></i>&nbsp;点赞数: {{ likeCount }}</div>
          <div class="stat">
            <i class="el-icon-s-comment"></i>&nbsp;评论数: {{ commentCount }}</div>
        </div>
      </div>
    </div>

    <!-- 右边界面 -->
    <div class="right-panel">
      <header class="header">
        <nav class="navigation">
          <ul>
            <li style="width: 8%"><div @click="$router.back(-1)" style="cursor:pointer;"><i class="el-icon-back"></i></div></li>
            <li style="width: 10%"><router-link to="/user">主页</router-link></li>
            <li><router-link to="/AddBlog">发布博客</router-link></li>
            <li><router-link to="/MyPage">我的博客</router-link></li>
            <li><router-link to="/MyLike">我的点赞</router-link></li>
            <li><router-link to="/MyComment">我的评论</router-link></li>
            <li><router-link to="/MyInfo">我的信息</router-link></li>
            <a @click.prevent="logout" style="cursor: pointer">退出登录</a>
          </ul>
        </nav>
      </header>
      <main class="content">
        <router-view></router-view>
      </main>
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <p>&copy; 2024 Your Blog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      imageUrl:'',
      commentCount: '',
      likeCount: '',
    };
  },
  methods: {
    loadData(){
      this.$axios.get('/user/getOneUser', {
        params: {
          id: JSON.parse(sessionStorage.getItem('user')).userId,
        }
      }).then((resp) => {
        this.user = resp;
        this.imageUrl = require(`../../assets/uploadImgs/${this.user.avatar}`)
      }).catch((error) => {
        console.error(error);
      });
      this.$axios.get('/article/getLikeAndView',{
        params:{
          id: JSON.parse(sessionStorage.getItem('user')).userId,
        }}).then((resp) => {
        this.likeCount = resp.likeCount;
        this.commentCount = resp.viewCount;
      }).catch((error) => {
        console.error(error);
      });
    },

    logout() {
      sessionStorage.removeItem('user');
      this.$router.push('/');
    }
  },
  computed: {
  },
  created() {
    this.loadData();
  },
};
</script>

<style scoped>
.blog-layout {
  display: flex;
  min-height: 100vh; /* 如果内容不足以填满整个屏幕，则设置最小高度为100vh */
  font-family: "微软雅黑 Light";
  font-size: 20px;
  background-color: #fffefb; /* 设置一个固定的背景色 */
  position: relative;
}

.left-panel {
  height: 100vh;
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-info {
  text-align: center;

}

.stats {
  margin-top: 20px;
}

.right-panel {
  width: 60%;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #cccbc8;
  color: #1d1c1c;
  padding: 20px;
  border-radius: 0px 0px 0px 10px; /* 圆角 */
}
.header a {
  margin:0 0px; /* 调整链接之间的间距 */
}
.navigation ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.navigation ul li {
  display: inline-block;
  width: 14%;
}

.navigation ul li a {
  color: #1d1c1c;
  text-decoration: none;
}

.content {
  padding: 10px;
  flex-grow: 1;
}

.footer {
  background-color: #cccbc8;
  color: #1d1c1c;
  padding: 5px 0;
  border-radius: 10px 0px 0px 0px; /* 圆角 */
  text-align: center;
}

.left-panel {
  background-color: #fffefb;
}

.right-panel {
  background-color: #fffefb;
}
.announcement {
  position: absolute;
  top: 100vh; /* 将其放置在左边界面的下方 */
  width: 30%; /* 使其占据整个左边界面的宽度 */
  padding: 20px;
  background-color: #f5f4f1; /* 可以根据需要修改背景色 */
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.announcement h2 {
  margin-top: 0;
}

.announcement p {
  margin-bottom: 20px;
}
.avatar{

}
</style>
