<template>
  <div class="data-statistics">
    <el-row :gutter="20" class="fixed-row" style="margin-top: 0px">
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-header">
            <i class="el-icon-user-solid"></i> 用户统计
          </div>
          <div class="stat-content">
            <h1 class="stat-number">{{ userCount }}</h1>
            <p class="stat-description">当前用户总数</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-header">
            <i class="el-icon-s-data"></i> 博客统计
          </div>
          <div class="stat-content">
            <h1 class="stat-number">{{ artcileCount }}</h1>
            <p class="stat-description">当前发文博客总量</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-header">
            <i class="el-icon-chat-dot-round"></i>  系统公告
          </div>
          <div class="stat-content" style="margin-top: 0px;padding: 10px">
            <div class="overview">
              <el-table :data="announcement" :show-header="false" @row-click="handleRowClick" class="table-table">
                <el-table-column prop="item"></el-table-column>
                <el-table-column prop="detail" align="right"></el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="fixed-row" style="height: 450px">
      <el-col :span="16">
        <el-card class="stat-card" style="height: 450px">
          <div class="stat-header">
            <i class="el-icon-pie-chart"></i>  数据分析
          </div>
          <div class="stat-content" style="margin-top: 120px">
            <h1 class="stat-number">{{ userCount }}</h1>
            <p class="stat-description">当前用户总数</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card" style="height: 450px">
          <div class="stat-header">
            <i class="el-icon-notebook-1"></i>  版本信息
          </div>
          <div class="home-page">
            <div class="overview">
              <el-table :data="systemOverview" border>
                <el-table-column label="项目" prop="item"></el-table-column>
                <el-table-column label="详情" prop="detail"></el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>

export default {
  name: 'DataStatistics',
  data() {
    return {
      userCount: '', // 替换为实际用户总数
      artcileCount: '', // 替换为博客总数
      welcomeMessage: '欢迎来到我们的系统！',
      systemOverview: [
        { item: '项目名称', detail: '博客管理系统' },
        { item: '版本号', detail: '1.0.0' },
        { item: '作者', detail: '小然' },
        { item: '使用技术', detail: '前端：VUE/ElementUI/Axios，后端：SpringBoot/MyBatis' },
        { item: '描述', detail: '一个博客的管理系统😍' }
      ],
      announcement:[
        { item: '版本公告1', detail: '2024-02-25' ,content:'进行了一场维护。'},
        { item: '版本公告2', detail: '2024-02-28' ,content:'进行了一场维护。'},
        { item: '版本公告3', detail: '2024-03-04' ,content:'进行了一场维护。'},
        { item: '版本测试1', detail: '2024-02-29' ,content:'进行了一场维护。'},
        { item: '版本测试2', detail: '2024-03-05' ,content:'进行了一场维护。'}
      ]
    };
  },
  methods:{
    loadData() {
      this.$axios.get('/user/getCountUser',).then((resp) => {
        this.userCount = resp;
      }).catch((error) => {
        console.error(error);
      });
      this.$axios.get('/article/getCountArt').then((resp)=>{
        this.artcileCount = resp;
      }).catch((error)=>{
        console.error(error);
      })
    },
    handleRowClick(row) {
      this.$confirm(row.content, row.item, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // 点击确定按钮后的操作
      }).catch(() => {
        // 点击取消按钮后的操作
      });
    },
  },
  created() {
    this.loadData();
  }
};
</script>

<style scoped>
.data-statistics {
  padding: 10px;
}

.fixed-row {
  margin-top: 30px;
  height: 350px; /* 设置固定高度 */
}

.stat-card {
  border-radius: 10px;
  height: 350px;
}

.stat-header {
  padding: 10px;
  font-size: 18px;
}

.stat-content {
  text-align: center;
  margin-bottom: 10px;
  margin-top: 80px;
}

.stat-number {
  font-size: 36px;
  margin-bottom: 10px;
}

.stat-description {
  font-size: 16px;
  color: #999;
}
.home-page {
  padding: 20px;
}

.overview, .main-functions {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 10px;
}

p {
  margin-bottom: 5px;
}
.table-table{
  cursor: pointer; /* 将鼠标指针设置为手型 */
  background-color: #f0f0f0; /* 悬停时的背景色 */
}

</style>
