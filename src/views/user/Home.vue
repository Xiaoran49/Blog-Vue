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
            <i class="el-icon-star-on"></i>&nbsp;点赞数: {{ likeCount }}
          </div>
          <div class="stat">
            <i class="el-icon-s-comment"></i>&nbsp;评论数: {{ commentCount }}
          </div>
        </div>
      </div>
    </div>

    <!-- 右边界面 -->
    <div class="right-panel">
      <header class="header">
        <nav class="navigation">
          <ul>
            <li style="width: 8%">
              <div @click="$router.back(-1)" style="cursor:pointer;"><i class="el-icon-back"></i></div>
            </li>
            <li style="width: 10%">
              <router-link to="/user">主页</router-link>
            </li>
            <li>
              <router-link to="/AddBlog">发布博客</router-link>
            </li>
            <li>
              <router-link to="/MyPage">我的博客</router-link>
            </li>
            <li>
              <router-link to="/MyLike">我的点赞</router-link>
            </li>
            <li>
              <router-link to="/MyComment">我的评论</router-link>
            </li>
            <li>
              <router-link to="/MyInfo">我的信息</router-link>
            </li>
            <a @click.prevent="logout" style="cursor: pointer">退出登录</a>
          </ul>
        </nav>
      </header>
      <main class="content">
        <router-view></router-view>
      </main>
      <footer class="footer">
        <p>&copy; 2024 Your Blog. All rights reserved.</p>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      imageUrl: '',
      commentCount: '',
      likeCount: '',
    };
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
      }).catch((error) => {
        console.error(error);
      });
      this.$axios.get('/article/getLikeAndView', {
        params: {
          id: JSON.parse(sessionStorage.getItem('user')).userId,
        }
      }).then((resp) => {
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
  computed: {},
  created() {
    this.loadData();
  },
};
</script>

<style scoped>
.blog-layout {
  display: flex;
  min-height: 100vh;
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
  margin: 0 10px; /* 调整链接之间的间距 */
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
  padding: 10px 10px 0px 10px;
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
</style>
