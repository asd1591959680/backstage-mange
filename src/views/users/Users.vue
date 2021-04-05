<template>
  <div>
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="query"
            clearable
            @clear="_getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="_getUsersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="usersList" stripe border class="table">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <!-- 当前作用域插槽数据scope.row -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteUser(scope.row.id)"
              ></el-button>

              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-thumb"
                  @click="showAllotDialog(scope.row)"
                ></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 2, 5, 7]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeForm"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="usersname">
          <el-input v-model="addForm.usersname"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!--:model是绑定数据  -->
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <!--prop是添加验证规则  -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUsers">确 定 </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="allotDialogVisible"
      width="50%"
      @close="closeAllot"
    >
      <div>
        <p>用户名：{{ currentUser.username }}</p>
        <p>角色：{{ currentUser.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectRightsId" placeholder="请选择">
            <el-option
              v-for="item in allRights"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRoles">确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsersList,
  getUsersState,
  getAddUsers,
  getEditUsers,
  getEditSubmit,
  getDeleteUsers,
  getALLRights,
  allotUserRights,
} from 'network/home.js'
export default {
  created() {
    this._getUsersList()
  },
  components: {},
  data() {
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确邮箱'))
    }
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确手机号'))
    }
    return {
      query: '',
      currentPage: 1,
      pageSize: 2,
      usersList: [],
      total: 0,
      //控制添加用户对话框显示与隐藏
      dialogVisible: false,
      addForm: {
        usersname: '',
        password: '',
        email: '',
        mobile: '',
      },
      addFormRules: {
        usersname: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            trigger: 'blur',
          },
        ],

        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: checkMobile,
            trigger: 'blur',
          },
        ],
      },
      editDialogVisible: false,
      editForm: {},
      editRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: checkMobile,
            trigger: 'blur',
          },
        ],
      },
      allotDialogVisible: false,
      currentUser: {},
      allRights: [],
      selectRightsId: '',
    }
  },
  methods: {
    async _getUsersList() {
      const res = await getUsersList(
        this.query,
        this.currentPage,
        this.pageSize
      )
      this.usersList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this._getUsersList()
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      this._getUsersList()
    },
    async userStateChange(e) {
      const res = await getUsersState(e.id, e.mg_state)
      if (res.meta.status !== 200) {
        e.mg_state = !e.mg_state
        this.$message.error('设置状态失败')
        return
      }
      this.$message.success('设置状态成功')
    },
    closeForm() {
      this.$refs.addFormRef.resetFields()
    },
    addUsers() {
      this.$refs.addFormRef.validate((res) => {
        if (!res) return
        this._getAddUsers()
        this.dialogVisible = false
        this._getUsersList()
      })
    },
    async _getAddUsers() {
      const add = await getAddUsers(
        this.addForm.usersname,
        this.addForm.password,
        this.addForm.email,
        this.addForm.mobile
      )

      if (add.meta.status !== 201) {
        return this.$message.error('添加用户失败')
      }
      this.$message.success('添加用户成功')
    },
    async showEditDialog(id) {
      const res = await getEditUsers(id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.$message.success('查询用户信息成功')
      this.editDialogVisible = true
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    editUsers() {
      this.$refs.editFormRef.validate(async (v) => {
        if (!v) return
        const res = await getEditSubmit(
          this.editForm.id,
          this.editForm.email,
          this.editForm.mobile
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }
        this.$message.success('更新用户信息成功')
        this.editDialogVisible = false
        this._getUsersList()
      })
    },
    async deleteUser(id) {
      const res = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (res === 'cancel') {
        return this.$message('已取消操作')
      }
      const del = await getDeleteUsers(id)
      if (del.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this._getUsersList()
    },
    async showAllotDialog(user) {
      this.currentUser = user
      this.allotDialogVisible = true
      const res = await getALLRights()
      if (res.meta.status !== 200) {
        return this.$message.error('获取所有角色失败')
      }
      this.$message.success('获取所有角色成功')
      this.allRights = res.data
    },
    async allotRoles() {
      this.allotDialogVisible = false
      if (!this.selectRightsId) {
        return
      }
      const res = await allotUserRights(
        this.currentUser.id,
        this.selectRightsId
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('选择角色失败')
      }
      this.$message.success('选择角色成功')

      this._getUsersList()
    },
    closeAllot() {
      this.currentUser = {}
      this.selectRightsId = ''
    },
  },
}
</script>
<style lang="less" scoped>
@import '~assets/less/variable.less';
@import '~assets/less/mixin.less';
.breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
.table {
  margin-top: 15px;
  font-size: 12px;
}
.pagination {
  margin-top: 15px;
}
</style>
