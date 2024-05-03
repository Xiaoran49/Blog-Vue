<template>
	<div class="container">
		<el-row :gutter="20">
			<el-col :span="6">
				<el-input size="small" placeholder="请输入文章标题" prefix-icon="el-icon-search" @input="searchChange"
					v-model="search" clearable>
				</el-input>
			</el-col>
			<el-col :span="6">
				<el-button type="primary" size="small" icon="el-icon-search" @click="selSearch">搜索</el-button>
				<el-button type="success" size="small" @click="showAddModal">添加</el-button>
			</el-col>
			<el-col :span="12"></el-col>
		</el-row>
		<!-- 表格数据 -->
		<el-table :data="articles" stripe border style="width: 100%;" :row-style="{ height: '70px' }">
			<el-table-column label="序号" type="index" width="50px" align="center"></el-table-column>
			<el-table-column prop="articleTitle" label="文章标题" width="180px"></el-table-column>
			<el-table-column prop="articleContent" label="文章内容" width="600px">
				<template slot-scope="scope">
					<div v-if="scope.row.articleContent !== null" class="ellipsis-content">
						<div v-if="!scope.row.showFullContent">
							{{ scope.row.articleContent.substr(0, 30) }}...... <!-- 仅显示部分内容 -->
							<span @click="toggleFullContent(scope.row)" style="float: right;color: blue">显示全部</span>
						</div>
						<div v-else>
							{{ scope.row.articleContent }}
							<span @click="toggleFullContent(scope.row)" style="float: right;color: blue">收起</span>
						</div>
					</div>
					<div v-else>
						{{ scope.row.articleContent }}
						<span @click="toggleFullContent(scope.row)" style="float: right;color: blue">收起</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="articleCreateTime" label="创建时间" width="140px"></el-table-column>
			<el-table-column prop="articleLastUpdateTime" label="修改时间" width="140px"></el-table-column>
			<el-table-column prop="userNickName" label="作者姓名" width="120px"></el-table-column>
			<el-table-column prop="likeCount" label="点赞量" width="75px" align="center"></el-table-column>
			<el-table-column prop="viewCount" label="浏览量" width="75px"></el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button size="mini" @click="showEditModal(scope.row.articleId)">编辑</el-button>
					<el-button size="mini" type="danger" @click="deleteUser(scope.row.articleId)">删除</el-button>
          <el-button size="mini" icon="el-icon-search" type="success" @click="check(scope.row.articleId)">查看</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10]"
			:page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
		</el-pagination>
    <!--查看博客的抽屉-->
    <el-drawer
        title="查看博客"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose"
    >
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
              <span>点赞{{article.likeCount}}人</span>
              <span>评论{{article.viewCount}}条</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
                      <el-button @click="showLikes(article.articleId)" class="drawer-button">点赞列表</el-button>
                      <el-button @click="showComments(article.articleId)" class="drawer-button" style="margin-left: 0px">评论列表</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="user-info1" v-for="like in showLikesPeople" :key="like.userId" style="margin-top: 0px" v-show="showLikesPage">
              <div class="user-item" style="margin-bottom: 0px">
                <div class="info">
                  <p style="text-align: left;margin-top: 10px;line-height: 1.5;padding: 0px 8px 0px 15px">{{ like.userNickName }}</p>
                </div>
              </div>
              <hr style="width: 95%">
            </div>
            <div class="user-info1" v-for="comment in showCommentsPeople" :key="comment.id" style="margin-top: 0px" v-show="showCommentsPage">
              <div class="user-item" style="margin-bottom: 0px">
                <div class="info">
                  <p style="text-align: left;margin-top: 10px;line-height: 1.5;padding: 0px 8px 0px 15px">{{ comment.commentContent }}</p>
                  <p style="text-align: left;margin-top: 7px;font-size: 12px;color: #666;text-align: right;margin-right: 20px;margin-bottom: 5px">
                    发布人：{{ comment.userNickName }}
                  </p>
                </div>
              </div>
              <hr style="width: 95%">
            </div>
          </el-col>
        </el-row>
      </div>
<!--      <div class="drawer-content">-->
<!--        <div class="article-info">-->
<!--          <div class="article-title">文章标题：{{ article.articleTitle }}</div>-->
<!--          <div class="article-content">文章内容：{{ article.articleContent }}</div>-->
<!--        </div>-->
<!--        <div class="buttons">-->
<!--          <el-button @click="showLikes(article.articleId)" class="drawer-button">点赞列表</el-button>-->
<!--          <el-button @click="showComments(article.articleId)" class="drawer-button">评论列表</el-button>-->
<!--        </div>-->
<!--        <div class="likes-comments" v-show="showLikesPage || showCommentsPage">-->
<!--          <h3 v-show="showLikesPage">点赞的人：</h3>-->
<!--          <h3 v-show="showCommentsPage">评论的人：</h3>-->
<!--          <ul>-->
<!--            <li v-for="liker in showLikesPeople" v-show="showLikesPage">{{ liker.userNickName }}</li>-->
<!--            <li v-for="commenter in showCommentsPeople" v-show="showCommentsPage">{{ commenter.userNickName }}{{commenter.commentContent}}</li>-->
<!--          </ul>-->
<!--        </div>-->
<!--      </div>-->
    </el-drawer>
		<!-- 添加员工的模态框 -->
		<el-dialog :visible.sync="ModalVisible" :title="isEdit ? '修改博客信息' : '添加博客'" width="500px">
			<el-form :model="article" label-width="100px"
				style="display: flex; flex-direction: column; align-items: center;">
				<el-form-item label="文章标题">
					<el-input v-model="article.articleTitle" style="width: 300px"></el-input>
				</el-form-item>
				<el-form-item label="文章内容">
					<el-input v-model="article.articleContent" type="textarea" :rows="15"
						style="width: 300px"></el-input>
				</el-form-item>
				<el-form-item label="作者姓名">
					<el-select v-model="value" filterable placeholder="请选择" style="width: 300px">
						<el-option v-for="item in options" :key="item.userId" :label="item.userNickName" :value="item.userId">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="ModalVisible = false">取消</el-button>
				<el-button type="primary" @click="saveUser">保存</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	export default {
		name: "UserComponent",
		data() {
			return {
				search: '', //搜索条件
				total: 0, //默认总条数
				pageNum: 1, //默认当前页数
				pageSize: 10, //默认每页显示条数
				ModalVisible: false, // 模态框显示/隐藏
				isEdit: false,
				article: {
					articleId: '',
					articleTitle: '',
					articleContent: '',
					articleCreateTime: '',
					articleLastUpdateTime: '',
					userNickName: '',
					likeCount: '',
					viewCount: '',
				},
				articles: [],
				options: [],
        value:'',
        drawer: false,
        direction: 'rtl',
        showLikesPage: true, // 默认显示点赞页面
        showCommentsPage: false, // 默认不显示评论页面
        showLikesPeople:[],
        showCommentsPeople:[]
			}
		},
		methods: {
			loadData() {
				this.$axios.get('/article/articleSelect', {
					params: {
						articleTitle: this.search,
						page: this.pageNum,
						size: this.pageSize,
					}
				}).then((resp) => {
					this.articles = resp.list.map(article => {
						return {
							...article,
							showFullContent: false // 添加 showFullContent 属性，默认为 false
						};
					});
					this.total = resp.total;
					this.article = resp;
					// console.log(this.articles);
				}).catch((error) => {
					console.error(error);
				});
				this.$axios.get('/user/getUserName').then((resp) => {
					this.options = resp;
					// console.log(this.options);
				}).catch((error) => {
					console.error(error);
				});
			},

			//搜索
			selSearch: function() {
				this.loadData(this.search, this.pageNum, this.pageSize);
			},
			searchChange: function() {
				this.loadData(this.search, this.pageNum, this.pageSize);
			},
			//currentPage 默认当前页数改变时会触发
			handleCurrentChange(val) {
				this.pageNum = val;
				this.loadData(this.search, this.pageNum, this.pageSize);
			},

			// 打开模态框，用于添加员工
			showAddModal() {
				this.isEdit = false; // 设置为添加模式
				this.ModalVisible = true;
				this.resetForm();
			},
			// 打开模态框，用于编辑员工
			showEditModal(id) {
				this.isEdit = true; // 设置为编辑模式
				this.ModalVisible = true;
				// 根据 id 获取员工信息并填充到表单中
				this.getUser(id);
			},
			// 保存员工信息
			saveUser() {
				if (this.isEdit) {
					this.updateUser(); // 执行编辑员工的方法
				} else {
					this.addUser(); // 执行添加员工的方法
				}
			},
			// 添加文章信息
			addUser() {
				console.log(this.value);
				this.$axios.post('/article/articleInsert',{
						userId: this.value,
						articleTitle: this.article.articleTitle,
						articleContent: this.article.articleContent,
				}).then((resp) => {
					this.$message({
						type: 'success',
						message: '添加成功',
            duration: 1000
					});
					// 数据新增成功后重新加载数据
					this.loadData();
				}).catch((error) => {
					console.error(error);
				});
				// 保存后关闭模态框，并重新加载数据
				this.ModalVisible = false;
				this.article = {
						articleId: '',
						articleTitle: '',
						articleContent: '',
						articleCreateTime: '',
						articleLastUpdateTime: '',
						userNickName: '',
						likeCount: '',
						viewCount: '',
					},
					this.loadData();
			},

			//修改员工信息
			updateUser() {
				this.$axios.get('/article/articleUpdate', {
					params: {
            userId: this.value,
						articleId: this.article.articleId,
						articleTitle: this.article.articleTitle,
						articleContent: this.article.articleContent,
						articleCreateTime: this.article.articleCreateTime,
						articleLastUpdateTime: this.article.articleCreateTime,
						userNickName: this.article.userNickName,
						likeCount: this.article.likeCount,
						viewCount: this.article.viewCount,
					}
				}).then((resp) => {
					console.log(resp);
					this.$message({
						type: 'success',
						message: '修改成功',
            duration: 1000
					});
					// 数据修改成功后重新加载数据
					this.loadData();
				}).catch((error) => {
					console.error(error);
				});
				// 保存后关闭模态框，并重新加载数据
				this.ModalVisible = false;
				this.article = {
						articleId: '',
						articleTitle: '',
						articleContent: '',
						articleCreateTime: '',
						articleLastUpdateTime: '',
						userNickName: '',
						likeCount: '',
						viewCount: '',
        }, this.loadData();
			},
			// 删除员工信息
			deleteUser(id) {
				console.log(id);
				this.$axios.get('/article/articleDelete', {
					params: {
						id: id
					}
				}).then((resp) => {
					console.log(resp);
					this.$message({
						type: 'success',
						message: '删除成功',
            duration: 1000
					});
					this.loadData();
				}).catch((error) => {
					console.error(error);
				});
			},
			// 得到一个员工信息
			getUser(id) {
				this.$axios.get('/article/getOneArticle', {
					params: {
						id: id
					}
				}).then((resp) => {
					this.article = resp;
          this.value = resp.userNickName;
				})
			},
			//重置模态框表单
			resetForm() {
				this.article = {
					articleId: '',
					articleTitle: '',
					articleContent: '',
					articleCreateTime: '',
					articleLastUpdateTime: '',
					userNickName: '',
					likeCount: '',
					viewCount: '',
				}
			},
			// 方法用于切换完整内容的显示
			toggleFullContent(row) {
				console.log(row);
				row.showFullContent = !row.showFullContent;
			},
      check(id){
        this.drawer = true
        this.getUser(id);
        this.showComments(id);
        this.showLikes(id);

      },
      handleClose(done) {
        this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        this.showLikesPage = true;
        this.showCommentsPage = false;
      },
      showLikes(id) {
        this.showLikesPage = true;
        this.showCommentsPage = false;
        this.$axios.get('/like/showLikes',{
          params: {
            id: id
          }
        }).then((resp)=>{
            this.showLikesPeople = resp;
        })
      },
      showComments(id) {
        this.showLikesPage = false;
        this.showCommentsPage = true;
        this.$axios.get('/comment/getThisComments',{
          params: {
            id: id
          }
        }).then((resp)=>{
          this.showCommentsPeople = resp;
        })
      }
		},
		created: function() {
			this.loadData(this.search, this.pageNum, this.pageSize);
		}
	}
</script>

<style scoped lang="scss">
	.container {
		.el-row {
			margin-bottom: 10px;
		}

		el-table-column {
			height: 40px;
		}

		.el-pagination {
			position: fixed;
			bottom: 10px;
			left: 50%;
			transform: translateX(-50%);
		}

		.ellipsis-content {
			overflow: hidden;
			text-overflow: ellipsis;
			cursor: pointer;
		}

    .drawer-content {
      padding: 20px;
    }

    .article-info {
      margin-bottom: 20px;
    }

    .article-title {
      font-size: 18px;
      font-weight: bold;
    }

    .article-content {
      margin-top: 10px;
    }

    .buttons {
      margin-bottom: 20px;
    }

    .likes-comments {
      margin-top: 20px;
    }

    ul {
      list-style-type: none;
    }

    li {
      margin-bottom: 5px;
    }
    /* 抽屉样式 */
    .el-drawer {
      border-radius: 10px; /* 圆角 */
      padding: 20px; /* 内边距 */
    }

    /* 文章标题样式 */
    .article-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px; /* 底部边距 */
    }

    /* 文章内容样式 */
    .article-content {
      margin-bottom: 20px; /* 底部边距 */
    }

    /* 按钮样式 */
    .buttons {
      margin-bottom: 20px; /* 底部边距 */
    }

    .drawer-button {
      width: 50%; /* 按钮宽度 */
    }

    /* 点赞列表、评论列表样式 */
    .likes-comments {
      margin-top: 20px; /* 顶部边距 */
    }

    .likes-comments h3 {
      margin-bottom: 10px; /* 底部边距 */
    }

    /* 列表项样式 */
    .likes-comments ul li {
      margin-bottom: 5px; /* 底部边距 */
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
        margin: 50px;
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