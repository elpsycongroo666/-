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
  </div>
</template>
<script>
import { getAllUsers } from '@/api/users_index'
export default {
  data () {
    return {
      total: 0,
      yes: true,
      userList: [],
      userobj: {
        query: '',
        pagenum: 1,
        pagesize: 4
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
    }
  }
}
</script>
<style lang="less" scoped>
</style>
