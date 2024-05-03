<template>
  <div class="container" :model="article">
    <el-row>
      <el-col :span="24">
        <div class="grid-content header">
          <div class="head1">
            {{article.articleTitle}}
          </div>
        </div>
        <div class="head2">
          <span class="article-date">发布时间: {{ article.articleLastUpdateTime }}</span>
          <span class="article-author">作者: {{ article.userNickName }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="grid-content middle">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{article.articleContent}}
        </div>

      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="grid-content footer">
          <span><i class="el-icon-thumb">点赞{{this.likeCount}}人</i></span>
          <span><i class="el-icon-edit-outline">评论{{this.comments.length}}条</i></span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="grid-content under">
          <el-input
              type="textarea"
              placeholder="请发表评论"
              :rows="10"
              v-model="viewValue">
          </el-input>
        </div>
        <span style="margin-left: 18px;cursor: pointer" v-if="likeor" @click="confirmLike">
          <i class="el-icon-star-off" style="margin-top: 18px">点赞</i>
        </span>
        <span style="margin-left: 18px;cursor: pointer" v-else @click="cancelLike">
          <i class="el-icon-star-on" style="margin-top: 18px">取消</i>
        </span>
        <el-button type="primary" @click="submitForm" style="float: right;margin-top: 10px">发表评论</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" v-if="comments.length>0">
        <el-card class="box1-card" style="padding: 10px">
          <div slot="header" style="font-size: 18px;font-weight: bold;">评论</div>
          <hr>
          <div class="user-info1" v-for="comment in comments" :key="comment.id" style="margin-top: 0px">
              <div class="user-item" style="margin-bottom: 0px">
                <div class="info">
                  <p style="text-align: left;margin-top: 10px;line-height: 1.5;padding: 0px 8px 0px 15px" v-if="comment.id != editValue">{{ comment.commentContent }}</p>
                  <el-input v-model="comment.commentContent" style="text-align: left;margin-top: 10px;line-height: 1.5;padding: 0px 8px 0px 15px;width: 96%" v-else></el-input>
                  <p style="text-align: left;margin-top: 7px;font-size: 12px;color: #666;text-align: right;margin-right: 20px;margin-bottom: 5px">
                    发布人：{{ comment.userNickName }}
                    <el-button type="primary" icon="el-icon-edit" size="mini" style="margin-left: 10px;" v-show="comment.uid === userId" v-if="comment.id != editValue" @click="editComment(comment.id)"></el-button>
                    <el-button type="primary" icon="el-icon-check" size="mini" style="margin-left: 10px;" v-else @click="confirmEdit(comment.id)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left: 10px;margin-right: 5px" v-show="comment.uid === userId" @click="deleteComment(comment.id)"></el-button>
                  </p>
                </div>
              </div>
            <hr style="width: 95%">
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      article: {},
      viewValue:'',
      comments:[],
      likeor:true,
      commentor:true,
      confirmEditor:true,
      likeCount:0,
      userId:'',
      editValue:'',
    };
  },
  created() {
    this.userId = JSON.parse(sessionStorage.getItem('user')).userId
    const articleId = this.$route.params.id;
    this.getArticleById(articleId);
    this.getThisComments(articleId);
    this.getThisLike(articleId);
    this.isLike();
  },
  methods: {
    getArticleById(id) {this.$axios.get('/article/getOneArticle', {
      params: {
        id: id
      }
    }).then((resp) => {
      this.article = resp;
    }).catch((error) => {
      console.error(error);
    });
    },
    //发布评论
    submitForm(){
      this.$axios.get('/comment/addComment', {
        params: {
          id: this.article.articleId,
          uid: JSON.parse(sessionStorage.getItem('user')).userId,
          commentContent: this.viewValue,
        }
      }).then((resp) => {
        this.$message({
          type: 'success',
          message: '发表成功',
          duration: 800,
        });
        // 数据修改成功后重新加载数据
        this.getThisComments(this.article.articleId);
        this.$router.app.$emit('updateParent');//使父路由更新界面
      }).catch((error) => {
        console.error(error);
      });
    },
    //得到所有评论
    getThisComments(id){
      this.$axios.get('/comment/getThisComments', {
        params: {
          id: id
        }
      }).then((resp) => {
        this.comments = resp;
        // console.log(resp);
      }).catch((error) => {
        console.error(error);
      });
    },
    //得到点赞数量
    getThisLike(id){
      this.$axios.get('/like/getLikeCount', {
        params: {
          id: id
        }
      }).then((resp) => {
        this.likeCount = resp;
        // console.log(resp);
      }).catch((error) => {
        console.error(error);
      });
    },
    //点赞
    confirmLike(){
      this.$axios.get('/like/confirmLike', {
        params: {
          articleId: this.$route.params.id,
          userId: JSON.parse(sessionStorage.getItem('user')).userId,
        }
      }).then((resp) => {
        // 数据修改成功后重新加载数据
        this.getThisLike(this.$route.params.id);
        this.$router.app.$emit('updateParent');//使父路由更新界面
        this.likeor=false;
      }).catch((error) => {
        console.error(error);
      });
    },
    //取消点赞
    cancelLike(){
      this.$axios.get('/like/cancelLike',{
        params:{
          articleId: this.$route.params.id,
          userId: JSON.parse(sessionStorage.getItem('user')).userId,
        }
      }).then((resp)=>{
        this.getThisLike(this.$route.params.id);
        this.$router.app.$emit('updateParent');//使父路由更新界面
        this.likeor=true;
      }).catch((error)=>{
        console.error(error);
      })
    },
    //判断是否点赞，调整点赞样式
    isLike(){
      this.$axios.get('/like/isLike',{
        params:{
          articleId: this.$route.params.id,
          userId: JSON.parse(sessionStorage.getItem('user')).userId,
        }
      }).then((resp)=>{
        if(resp==1){
          this.likeor=false;
        }else{
          this.likeor=true;
        }
      }).catch((error) => {
        console.error(error);
      })
    },
    //点击修改
    editComment(id){

      console.log(id);
      this.editValue = id;
      this.commentor=false;
      this.confirmEditor = false;
    },
    //确认修改
    confirmEdit(id){
      this.$axios.get('/comment/updateComment',{
        params:{
          id: id,
          uid: JSON.parse(sessionStorage.getItem('user')).userId,
        }
      }).then((resp)=>{
        this.commentor=true;
        this.editValue ='';
        this.confirmEditor = true;
        this.$router.app.$emit('updateParent');//使父路由更新界面
      }).catch((error) => {
        console.error(error);
      })
    },
    //删除评论
    deleteComment(id){
      // console.log(id)
      this.$axios.get('/comment/deleteComment',{
        params:{
          id: id,
        }
      }).then((resp)=>{
        this.$router.app.$emit('updateParent');//使父路由更新界面
        this.getThisComments(this.$route.params.id);
      }).catch((error) => {
        console.error(error);
      })
    },
  }
};
</script>
<style scoped lang='scss'>
.container {
  font-family: "微软雅黑 Light";
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .header {
    height: 80px;
    text-align: center;
    line-height: 80px;
    font-size: 24px;
    font-weight: bold;
    padding: 10px;
  }
  .head2{
    font-size: 14px;
    color: #666;
    text-align: right;
    span{
      margin: 5px;
    }
  }
  .middle{
    line-height: 1.5;

    padding: 40px 20px 40px 20px;
  }
  .footer{
    height: 80px;
    line-height: 80px;
    text-align: center;
    font-size: 16px;
    span{
      margin: 150px;
    }

  }
  .under{
    background: #99a9bf;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;

  }
  .box1-card {
    padding: 10px;
    text-align: left;
    background-color: #f5f4f1;
    font-size: 16px;
    margin-bottom: 150px;
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
    width: 100%;
  }
  .info {
    margin-left: 10px;
    width:100%;
  }
  a {
    text-decoration: none !important;
    color: inherit !important;
    width: 100%;
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

}
</style>