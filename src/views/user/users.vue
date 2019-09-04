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
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="editUserDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" icon="el-icon-check" @click="allotUserRole(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" @click="delUser(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pageunm"
      :page-sizes="[1, 2, 3, 4, 5, 6]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addform" status-icon :label-width="'80px'" :rules="rules" ref="addUserForm">
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
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :label-width="'80px'">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" auto-complete="off" disabled style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="allotDialogFormVisible">
      <el-form :model="allotForm" :label-width="'80px'">
        <el-form-item label="当前用户">
          <span>{{allotForm.username}}</span>
        </el-form-item>
        <el-form-item label="选择角色">
          <el-select v-model="allotForm.rid" placeholder="请选择">
            <!-- label是展示给用户看的 -->
            <!-- value是给程序员用的，这里的value的值会传递给v-model -->
            <el-option
              :label="item.roleName"
              :value="item.id"
              v-for="item in roleList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="allotDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllUsers,
  addUsers,
  editUsers,
  allotUserRole,
  delUserById
} from '@/api/users_index'
import { getALLRoleList } from '@/api/role_index.js'
export default {
  data () {
    return {
      // 角色列表
      roleList: [],
      allotDialogFormVisible: false,
      // 分配用户角色表单数据
      allotForm: {
        username: '',
        rid: '',
        id: ''
      },
      editDialogFormVisible: false,
      // 编辑用户表单数据
      editForm: {
        id: '',
        email: '',
        mobiel: '',
        username: ''
      },
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
        pagesize: 6
      },
      // 给添加用户表单添加规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          {
            pattern: /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/,
            message: '请输入正确邮箱格式',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            pattern: /0?(13|14|15|18)[0-9]{9}/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    //  获取用户列表
    this.init()
    // 获取所有角色
    getALLRoleList().then(res => {
      console.log(res)
      if (res.data.meta.status === 200) {
        this.roleList = res.data.data
      }
    })
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
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    // 编辑用户按钮弹出对话框
    editUserDialog (row) {
      // console.log(row)
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
      this.editDialogFormVisible = true
    },
    // 编辑用户
    async editUser () {
      let res = await editUsers(this.editForm)
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.editDialogFormVisible = false
        this.$message.success(res.data.meta.msg)
        this.init()
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    // 分配角色弹出对话框
    allotUserRole (row) {
      // console.log(row)
      this.allotDialogFormVisible = true
      this.allotForm.username = row.username
      this.allotForm.id = row.id
      this.allotForm.rid = row.rid
    },
    // 分配角色
    async allotRole () {
      // 如果他有值我们才给它发送请求
      // 因为我们一开始添加用户的时候是没有添加到角色的分配的
      if (this.allotForm.rid) {
        let res = await allotUserRole(this.allotForm)
        console.log(res)
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
          this.allotDialogFormVisible = false
          this.init()
        } else {
          this.$message.error(res.data.meta.msg)
        }
      } else {
        this.$message.error('请选择角色')
      }
    },
    // 删除用户
    delUser (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(id)
        delUserById(id)
          .then(res => {
            if (res.data.meta.status === 200) {
              this.$message.success('删除成功')
              this.userobj.pagenum = Math.ceil((this.total - 1) / this.userobj.pagesize) < this.userobj.pagesize
                ? --this.userobj.pagenum : this.userobj.pagenum
              this.init()
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
