<template>
  <div class="uesr">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索输入框 -->
    <el-input
      placeholder="请输入内容"
      v-model="userobj.query"
      class="input-with-select"
      style="width:350px"
      @input.native="init"
    >
      <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
    </el-input>
    <!-- 添加用户按钮 -->
    <el-button type="success" plain @click="addDialogFormVisible=true">添加用户</el-button>
    <!-- 表格 -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="address" label="用户状态">
        <!-- 开关 -->
        <el-switch v-model="yes" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
          <el-button type="primary" icon="el-icon-edit"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
          <el-button type="success" icon="el-icon-check"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除" placement="top">
          <el-button type="danger" icon="el-icon-delete"></el-button>
        </el-tooltip>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pageunm"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addform" :label-width="'80px'" :rules="rules" ref="addUserForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAllUsers, addUsers } from '@/api/users_index'
export default {
  data () {
    return {
      // 添加用户的表单数据
      addDialogFormVisible: false,
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 用户总数
      total: 0,
      yes: true,
      userList: [],
      userobj: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      // 给添加用户表单添加规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { pattern: /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/, message: '请输入正确邮箱格式', trigger: 'blur' }
        ],
        mobile: [
          { pattern: /0?(13|14|15|18)[0-9]{9}/, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    //  获取用户列表
    this.init()
  },
  methods: {
    // 切换当前页码时触发 当前第几页
    handleCurrentChange (val) {
      console.log(val)
      this.userobj.pagenum = val
      this.init()
    },
    // 切换size下拉列表 每页多少条
    handleSizeChange (val) {
      console.log(val)
      this.userobj.pagesize = val
      this.init()
    },
    // 页面数据初始化
    init () {
      getAllUsers(this.userobj)
        .then(res => {
          console.log(res)
          this.userList = res.data.data.users
          this.total = res.data.data.total
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 添加用户
    async addUsers () {
      let res = await addUsers(this.addform)
      console.log(res)
      if (res.data.meta.status === 201) {
        this.$message.success(res.data.meta.msg)
        this.addDialogFormVisible = false
        // 重置表单数据
        this.$refs.addUserForm.resetFields()
        // 刷新页面
        this.init()
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
