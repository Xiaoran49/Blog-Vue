import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import HomeView from '../views/admin/HomeView.vue'
import IndexView from '@/views/admin/IndexView.vue';
import UserView from "@/views/admin/UserView.vue";
import BlogView from "@/views/admin/BlogView.vue";
import Home from "@/views/user/Home.vue";
import MyPage from "@/views/user/MyBlog.vue";
import Article from "@/views/user/Article.vue";
import IndexPage from "@/views/user/Index.vue";
import Articles from "@/views/user/Articles.vue";
import ArticleDetail from "@/views/user/ArticleDetail.vue";
import MyLike from "@/views/user/MyLike.vue";
import MyComment from "@/views/user/MyComment.vue";
import MyInfo from "@/views/user/MyInfo.vue";
import ChangePwd from "@/views/user/ChangePwd.vue";
import AddBlog from "@/views/user/AddBlog.vue";



Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/admin',
    name: 'admin',
    component: HomeView,
    redirect:'/index',
    children: [
      {
        path: '/index',
        name: 'index',
        component: IndexView,
        meta:{
          name: '首页'
        }
      },
      {
        path: '/userManage',
        name: 'userManage',
        component: UserView,
        meta:{
          name: '用户管理'
        }
      },
      {
        path: '/blogManage',
        name: 'blogManage',
        component: BlogView,
        meta:{
          name: '博客管理'
        }
      },
    ],
  },
  {
    path: '/',
    name: 'login',
    component: LoginView,
    meta:{
      name: '登录'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta:{
      name: '注册'
    }
  },
  {
    path:'/user',
    name: 'IndexPage',
    component: IndexPage,
    redirect: '/Articles',
    meta:{
      name: '首页'
    },
    children: [
      {
        path: '/Articles',
        name: 'Articles',
        component: Articles,
        mata:{
          name: '文章列表'
        }
      },
        {
        path: '/ArticleDetail/:id',
        name: 'ArticleDetail',
        component: ArticleDetail,
        mata:{
          name: '文章详情'
        }
      }
    ],
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect:'/MyPage',
    children: [
      {
        path: '/MyPage',
        name: 'MyPage',
        component: MyPage,
        mata:{
          name: '我的主页'
        }
      },
      {
        path: '/article/:id',
        name: 'article',
        component: Article,
        mata:{
          name: '文章详情'
        }
      },
        {
        path: '/MyLike',
        name: 'MyLike',
        component: MyLike,
        mata:{
          name: '我的点赞'
        }
      },
      {
        path: '/MyComment',
        name: 'MyComment',
        component: MyComment,
        mata:{
          name: '我的评论'
        }
      },
        {
        path: '/MyInfo',
        name: 'MyInfo',
        component: MyInfo,
        mata:{
          name: '我的信息'
        }
      },
        {
        path: '/ChangePwd',
        name: 'ChangePwd',
        component: ChangePwd,
        mata:{
          name: '修改密码'
        }
      },
        {
        path: '/AddBlog',
        name: 'AddBlog',
        component: AddBlog,
        mata:{
          name: '添加博客'
        }
      },
      {
        path: '/ArticleLike/:id',
        name: 'ArticleLike',
        component: ArticleDetail,
        mata:{
          name: '文章点赞'
        }
      },
      {
        path: '/ArticleComment/:id',
        name: 'ArticleComment',
        component: ArticleDetail,
        mata:{
          name: '文章评论'
        }
      }
    ],
  },
]


const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(sessionStorage.getItem('user'));

  if (user || to.path === '/' || to.path === '/register') {
    next();
  } else {
    next('/');
  }
});


export default router
