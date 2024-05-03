<template>
  <div class="container">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <div>
          <img src="../../assets/imgs/logo.png"/>
        </div>
        <div>
          <span>博客后台管理系统</span>
        </div>
        <!-- 菜单栏 -->
        <el-menu default-active="/index" background-color="#FF80AB" text-color="#fff" active-text-color="#ffd04b" active-background-color="#FF80AB" @select="handleMenuSelect">
          <el-menu-item index="/index">
            <i class="el-icon-s-home"></i>
            <span slot="title">系统首页</span>
          </el-menu-item>
<!--          <el-menu-item index="/powerManage">-->
<!--            <i class="el-icon-remove"></i>-->
<!--            <span slot="title">权限管理</span>-->
<!--          </el-menu-item>-->
          <el-submenu index>
            <template slot="title">
              <i class="el-icon-folder-opened"></i>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/userManage">
              <template slot="title">
                <i class="el-icon-user-solid"></i>
                <span>用户管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/blogManage">
              <template slot="title">
                <i class="el-icon-edit"></i>
                <span>博客管理</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/user">
            <i class="el-icon-s-platform"></i>
            <span slot="title">前台页面</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header>
          <div class="left">首页</div>
          <div class="right">
            <img src="../../assets/imgs/user.png" alt="" />
            <span>{{ username }}</span>
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-setting" command="a">个人设置</el-dropdown-item>
                <el-dropdown-item icon="el-icon-switch-button" command="b">
                  退出登陆
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <!-- 主体 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
    };
  },
  components: {},
  mounted() {
    // 初始化数据，这些数据不是静态的，需要通过某些方法获取，
    // 然后存入到data中
    this.username = JSON.parse(sessionStorage.getItem('user')).userNickName
  },
  methods: {
    // 登出
    handleCommand(command) {
      if (command == 'b') {
        this.$router.push("/");
        sessionStorage.removeItem('user');
      }
    },
    // 处理菜单项点击事件
    handleMenuSelect(index) {
      this.$router.push(index); // 点击菜单项时进行路由跳转
    }
  },
  created() {
    console.log()
  }
};
</script>
<style scoped lang="scss">
.container {
  height: 100%;
  font-family: "Microsoft YaHei";
  .el-container {
    height: 100%;
  }
  .el-header {
    background-color: #FCE4EC;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      font-weight: bold;
    }
    .right {
      display: flex;
      align-items: center;
      img {
        width: 30px;
      }
      i {
        cursor: pointer;
        margin-left: 10px;
      }
    }
  }
  .el-aside {
    height: 100%;
    background-color: #FF80AB;
    .el-menu {
      border-right: none;
    }
    div {
      color: #fff;
      padding: 15px 0;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 80px;
        margin-right: 15px;
      }
    }
  }
  .el-main {
    background-color: #e9e7ef;
    padding: 10px;
  }
}
</style>
