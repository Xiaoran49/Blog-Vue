<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
            size="small"
            placeholder="请输入姓名"
            prefix-icon="el-icon-search"
            @input="searchChange"
            v-model="search"
            clearable>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" size="small" icon="el-icon-search" @click="selSearch">搜索</el-button>
        <el-button type="success" size="small" @click="showAddModal">添加</el-button>
      </el-col>
      <el-col :span="12"></el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table :data="users" stripe border style="width: 100%;" :row-style="{ height: '70px' }">
      <el-table-column label="序号" type="index" width="50px"></el-table-column>
      <el-table-column prop="userNickName" label="用户昵称" width="150px"></el-table-column>
      <el-table-column prop="userName" label="用户名" width="150px"></el-table-column>
      <el-table-column prop="userPassword" label="用户密码" width="150px"></el-table-column>
      <el-table-column prop="userEmail" label="用户邮箱" width="200px"></el-table-column>
      <el-table-column prop="userAge" label="年龄" width="75px"></el-table-column>
      <el-table-column prop="userSex" label="性别" width="75px"></el-table-column>
      <el-table-column prop="userPhoneNumber" label="用户手机号" width="150px"></el-table-column>
      <el-table-column prop="userIntroduce" label="用户签名" width="200px"></el-table-column>
      <el-table-column prop="userRegTime" label="用户注册时间" width="150px"></el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="showEditModal(scope.row.userId)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.row.userId)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="管理员" prop="userIsAdmin" align="center">
        <template slot-scope="scope">
          <el-switch
              v-model="scope.row.userIsAdmin"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否"
              @change="changeAdmin(scope.row.userId, scope.row.userIsAdmin)"
              :active-value="1"
              :inactive-value="0"
              class="centered-switch">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    <!-- 添加员工的模态框 -->
    <el-dialog :visible.sync="ModalVisible" :title="isEdit ? '修改用户信息' : '添加用户'" width="500px">
      <el-form :model="user" label-width="100px" style="display: flex; flex-direction: column; align-items: center;">
        <el-form-item label="用户名">
          <el-input v-model="user.userName" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="user.userNickName" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="user.userPassword" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱">
          <el-input v-model="user.userEmail" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="user.userAge" type="number" min="0" max="200" step="1" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="user.userSex" style="width: 300px">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户手机号">
          <el-input v-model="user.userPhoneNumber" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="用户签名">
          <el-input v-model="user.userIntroduce" style="width: 300px"></el-input>
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
  data(){
    return{
      search: '',//搜索条件
      total: 0,//默认总条数
      pageNum: 1,//默认当前页数
      pageSize: 10,//默认每页显示条数
      ModalVisible: false, // 模态框显示/隐藏
      isEdit:false,
      user: {
        userId: '',
        userNickName:'',
        userName: '',
        userPassword: '',
        userEmail: '',
        userPhoneNumber: '',
        userSex: '',
        userIntroduce:'',
        userAge:'',
      },
      users: [],
    }
  },
  methods: {
    loadData() {
      this.$axios.get('/user/userSelect', {
        params: {
          userNickName: this.search,
          page: this.pageNum,
          size: this.pageSize,
        }
      }).then((resp) => {
        this.users = resp.list;
        this.total = resp.total;
        console.log(this.users);
      }).catch((error) => {
        console.error(error);
      });
    },
    //搜索
    selSearch: function(){
      this.loadData(this.search,this.pageNum, this.pageSize);
    },
    searchChange:function (){
      this.loadData(this.search,this.pageNum, this.pageSize);
    },
    //currentPage 默认当前页数改变时会触发
    handleCurrentChange(val) {
      this.pageNum = val;
      this.loadData(this.search,this.pageNum, this.pageSize);
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
    // 添加员工信息
    addUser() {
      this.$axios.get('/user/userInsert', {
        params: {
          userNickName: this.user.userNickName,
          userName: this.user.userName,
          userPassword: this.user.userPassword,
          userEmail: this.user.userEmail,
          userAge: this.user.userAge,
          userPhoneNumber: this.user.userPhoneNumber,
          userSex: this.user.userSex,
          userIntroduce:this.user.userIntroduce,
        }
      }).then((resp) => {
        console.log(resp);
        this.$message({
          type: 'success',
          message: '添加成功',
          duration: 1000,
        });
        // 数据新增成功后重新加载数据
        this.loadData();
      }).catch((error) => {
        console.error(error);
      });
      // 保存后关闭模态框，并重新加载数据
      this.ModalVisible = false;
      this.user = {
        userNickName:'',
        userName: '',
        userPassword: '',
        userEmail: '',
        userPhoneNumber: '',
        userSex: '',
        userIntroduce:'',
        userAge:'',
      };
      this.loadData();
    },

    //修改员工信息
    updateUser() {
      this.$axios.get('/user/userUpdate', {
        params: {
          userId: this.user.userId,
          userNickName:this.user.userNickName,
          userName:this.user.userName,
          userPassword: this.user.userPassword,
          userEmail: this.user.userEmail,
          userAge:this.user.userAge,
          userPhoneNumber: this.user.userPhoneNumber,
          userSex: this.user.userSex,
          userIntroduce:this.user.userIntroduce,
        }
      }).then((resp) => {
        console.log(resp);
        this.$message({
          type: 'success',
          message: '修改成功'
          ,duration: 1000,
        });
        // 数据修改成功后重新加载数据
        this.loadData();
      }).catch((error) => {
        console.error(error);
      });
      // 保存后关闭模态框，并重新加载数据
      this.ModalVisible = false;
      this.user = {
        userNickName:'',
        userName: '',
        userPassword: '',
        userEmail: '',
        userPhoneNumber: '',
        userSex: '',
        userIntroduce:'',
        userAge:'',
      };
      this.loadData();
    },
    // 删除员工信息
    deleteUser(id) {
      console.log(id);
      this.$axios.get('/user/userDelete', {
        params: {
          id: id
        }
      }).then((resp) => {
        console.log(resp);
        this.$message({
          type: 'success',
          message: '删除成功',
          duration: 1000,
        });
        this.loadData();
      }).catch((error) => {
        console.error(error);
      });
    },
    // 得到员工信息
    getUser(id) {
      this.$axios.get('/user/getOneUser', {
        params: {
          id: id
        }
      }).then((resp) => {
        this.user = resp;
      })
    },
    //重置模态框表单
    resetForm() {
      this.user = {
        userNickName:'',
        userName: '',
        userPassword: '',
        userEmail: '',
        userPhoneNumber: '',
        userSex: '',
        userIntroduce:'',
        userAge:'',
      };
    },
    changeAdmin(userId,isAdmin){
      console.log(userId);
      console.log(isAdmin);
      this.$axios.get('/user/changeAdmin',{
        params: {
          userId: userId,
          isAdmin:isAdmin
        }
      })
    }
  },
  created: function () {
    this.loadData(this.search,this.pageNum, this.pageSize);
  }

}
</script>


<style scoped lang="scss">
.container {

  .el-table .cell, .el-table div .cell{
    text-align: center;
  }


  .el-row {
    margin-bottom: 10px;
  }
  el-table-column{
    height: 40px;
  }

  .el-pagination {
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  }

  .centered-switch {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
