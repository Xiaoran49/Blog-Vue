<template>
  <div class="container">
    <el-header>
      <div class="header-content">
        <div class="nav-link" @click="$router.back(-1)" style="cursor:pointer;"><i class="el-icon-back"></i></div>
        <div class="nav-links">
          <router-link to="/user" class="nav-link">主页</router-link>
          <router-link to="/MyPage" class="nav-link">我的</router-link>
          <a class="nav-link" @click.prevent="logout" style="cursor: pointer">退出登录</a>
        </div>
      </div>
    </el-header>
    <el-row>
      <el-col :span="6" class="center-content">
        <div class="grid-content bg-purple1">
          <el-card class="box1-card">
            <div slot="header" style="font-size: 18px;font-weight: bold">用户信息</div>
            <div class="user-info">
              <img :src="require('@/assets/imgs/user.png')" alt="Image" style="width: 100px;height: 100px">
              <p style="margin: 10px 0px">昵称: {{ user.userNickName }}</p>
              <p style="margin: 10px 0px">邮箱: {{ user.userEmail }}</p>
              <p style="margin: 10px 0px">手机号: {{ user.userPhoneNumber }}</p>
              <p style="margin: 10px 0px">性别: {{ user.userSex }}</p>
              <p style="margin: 10px 0px">年龄: {{ user.userAge }}</p>
              <p style="margin: 10px 0px">个人签名: {{ user.userIntroduce }}</p>
              <span style="margin: 20px 20px"><i class="el-icon-thumb"></i>{{ likeCount }}</span>
              <span style="margin: 20px 20px"><i class="el-icon-chat-square"></i>{{ viewCount }}</span>
            </div>
          </el-card>
        </div>
        <div class="grid-content bg-purple4">
          <el-card class="box1-card" style="padding: 20px">
            <div slot="header" style="font-size: 18px;font-weight: bold">其他博主</div>
            <div class="user-info1" v-for="user in users" :key="user.id">
              <div class="user-item">
                <el-avatar :src="require('@/assets/imgs/user.png')"></el-avatar>
                <div class="info">
                  <p style="text-align: left">{{ user.userNickName }}</p>
                  <p style="text-align: left">{{ user.userEmail }}</p>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12" class="center-content">
        <div class="grid-content bg-purple2">
        <router-view :key="$route.fullPath"></router-view>
        <!-- :key="$route.fullPath" 可以解决路由切换时页面不刷新的问题-->
        </div>
      </el-col>
      <el-col :span="6" class="center-content">
        <div class="grid-content bg-purple1">
          <el-card class="box1-card" style="padding: 10px">
            <div slot="header" style="font-size: 18px;font-weight: bolder;">最新文章</div>
            <hr>
              <div class="user-info1" v-for="article in articles" :key="article.articleId" style="margin-top: 5px">
                <router-link :to="{ name: 'ArticleDetail', params: { id: article.articleId }}">
                <div class="user-item">
                  <div class="info">
                    <p style="text-align: left;margin-top: 10px;font-weight: bold">{{ article.articleTitle }}</p>
                    <p style="text-align: left;margin-top: 7px;line-height: 1.5">{{ article.articleContent.slice(0,25) }}......</p>
                  </div>
                </div>
                </router-link>
                <hr style="width: 90%">
              </div>
          </el-card>
        </div>
        <div class="grid-content bg-purple4">
          <el-card class="box1-card">
            <div slot="header" style="font-size: 18px;font-weight: bold">当前时间</div>
                  <div class="time">
                    {{ currentTime }}
                  </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <p>&copy; 2024 Your Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      users: [],
      search: '', //搜索条件
      total: 0, //默认总条数
      pageNum: 1, //默认当前页数
      pageSize: 10, //默认每页显示条数
      articles:[],
      likeCount:'',
      viewCount:'',
      currentTime:''
    };
  },
  methods: {
    loadData(){
      this.$axios.get('/user/getOneUser',{
        params:{
          id: JSON.parse(sessionStorage.getItem('user')).userId,
        }}).then((resp) => {
        this.user = resp;
      }).catch((error) => {
        console.error(error);
      });
      this.$axios.get('/article/getLikeAndView',{
        params:{
          id: JSON.parse(sessionStorage.getItem('user')).userId,
        }}).then((resp) => {
        this.likeCount = resp.likeCount;
        this.viewCount = resp.viewCount;
      }).catch((error) => {
        console.error(error);
      });
      this.$axios.get('/user/userSelectAll').then((resp) => {
        this.users = resp;
      });
      this.$axios.get('/article/getThreeArt').then((resp)=>{
        this.articles = resp;
      });
    },

    getCurrentTime() {
      const date = new Date();
      const hours = date.getHours().toString().padStart(2, '0'); // 获取小时，并补零
      const minutes = date.getMinutes().toString().padStart(2, '0'); // 获取分钟，并补零
      const seconds = date.getSeconds().toString().padStart(2, '0'); // 获取秒数，并补零
      // 将当前时间赋值给currentTime变量
      this.currentTime = `${hours}:${minutes}:${seconds}`;
    },

    logout() {
      sessionStorage.removeItem('user'); //清除sessionStorage中的user
      // sessionStorage.clear();  //清除所有sessionStorage
      this.$router.push('/');
    },
  },

  created() {
    this.loadData();
    this.getCurrentTime();
    this.timer = setInterval(() => {
      this.getCurrentTime();
    }, 1000);
    // 在父路由的 created 生命周期钩子中监听子路由触发的事件
    this.$router.app.$on('updateParent', this.loadData);

  },
  destroyed() {
    // 在组件销毁前移除事件监听，避免内存泄漏
    this.$router.app.$off('updateParent', this.loadData);
  },
  beforeDestroy() {
    clearInterval(this.timer); // 清除定时器
  },
};
</script>

<style scoped lang="scss">
.container {
  font-family: "微软雅黑 Light";
  font-size: 20px;
  background-color: #fffefb;
  .el-header {
    background-color: #cccbc8;
    align-items: center;
    color: #1d1c1c;
    padding: 0px 80px;
  }

  .header-content {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 60px;
    padding: 0 20px;

  }
  .nav-links {
    display: flex;
    align-items: center;
    justify-content: flex-end; /* 将内容居右对齐 */
  }
  .nav-link {
    margin-right: 20px;
    text-decoration: none;
    color: #1d1c1c;
  }

  .nav-link.active-link {
    color: #1d1c1c;
    font-weight: bold;
  }

  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple1 {
    //background: #d3dce6;
    width: 60%;
    margin-top: 30px;
  }
  .bg-purple2 {
    width: 100%;
    margin-top: 30px;
  }
  .bg-purple3{
    background: #d3dce6;
    width: 60%;
    margin-top: 30px;
  }
  .bg-purple4{
    background: #d3dce6;
    width: 60%;
    margin-top: 80px;
  }


  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .box1-card {
    padding: 10px;
    text-align: center;
    background-color: #f5f4f1;
    font-size: 16px;
  }

  .user-info {
    margin-top: 20px;
  }
  .user-info1 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 20px;
  }
  .user-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .info {
    margin-left: 10px;
  }

  .center-content {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
}
.article {
  width: 100%;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: #f5f4f1;
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
}

.article-likes,
.article-comments {
  margin-right: 10px;
}
.article-date,
article-author{
  padding: 0 10px;
}

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
.el-card ::v-deep .el-card__body {
  padding: 0px;
}
.time {
  font-size: 24px;
  text-align: center;
  padding: 20px;
}
.footer {

  color: #1d1c1c;
  padding: 8px 0;
  text-align: center;

}

</style>
