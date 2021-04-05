<template>
  <div>
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div>
              <el-row
                :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'center']"
                v-for="(item1, index1) in scope.row.children"
                :key="item1.id"
              >
                <el-col :span="5">
                  <el-tag
                    class="tag"
                    closable
                    @close="deleteTag(scope.row, item1.id)"
                    >{{ item1.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row
                    :class="[index2 === 0 ? '' : 'bdtop', 'center']"
                    v-for="(item2, index2) in item1.children"
                    :key="item2.id"
                  >
                    <el-col :span="6">
                      <el-tag
                        class="tag"
                        type="success"
                        closable
                        @close="deleteTag(scope.row, item2.id)"
                        >{{ item2.authName }}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-row
                        :class="[index3 === 0 ? '' : 'bdtop']"
                        v-for="(item3, index3) in item2.children"
                        :key="item3.id"
                      >
                        <el-col>
                          <el-tag
                            class="tag"
                            type="warning"
                            closable
                            @close="deleteTag(scope.row, item3.id)"
                            >{{ item3.authName }}
                          </el-tag>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" type="primary" icon="el-icon-edit"
                >编辑
              </el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete"
                >删除
              </el-button>
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-thumb"
                @click="rolesDialog(scope.row)"
                >分配角色
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="分配权限"
      :visible.sync="rolesDialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <el-tree
        :data="rolesAllList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        ref="treeRef"
        default-expand-all
        :default-checked-keys="defaultKeys"
      ></el-tree>
      <!-- default-checked-keys 默认勾选的节点的 key 的数组 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolesList,
  deleteRoles,
  getAllRoles,
  rightsSubmit,
} from 'network/power.js'
export default {
  created() {
    this._getRolesList()
  },
  components: {},
  data() {
    return {
      rolesList: [],
      rolesDialogVisible: false,
      rolesAllList: [],
      treeProps: {
        children: 'children',
        label: 'authName',
      },
      defaultKeys: [],
      roleId: null,
    }
  },
  methods: {
    async _getRolesList() {
      const res = await getRolesList()

      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      this.$message.success('获取角色列表成功')
    },
    async deleteTag(roleId, rightId) {
      const res = await this.$confirm(
        '此操作将永久删除该标签, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (res !== 'confirm') {
        return this.$message('取消删除')
      }
      const del = await deleteRoles(roleId.id, rightId)
      if (del.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')
      //不刷新情况下更新状态
      roleId.children = del.data
    },
    async rolesDialog(role) {
      this.roleId = role.id
      this.rolesDialogVisible = true
      const res = await getAllRoles('tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取所有权限失败')
      }
      this.$message.success('获取所有权限成功')
      this.rolesAllList = res.data

      this.getDefaultKeys(this.defaultKeys, role)
    },
    getDefaultKeys(newArr, arr) {
      if (!arr.children) {
        return newArr.push(arr.id)
      }
      arr.children.forEach((item) => {
        this.getDefaultKeys(newArr, item)
      })
    },
    closeDialog() {
      this.defaultKeys = []
    },
    async checkRights() {
      const res = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const newArr = res.join(',')
      const sub = await rightsSubmit(this.roleId, newArr)
      if (sub.meta.status !== 200) {
        return this.$message.error('更新权限失败')
      }
      this.$message.success('更新权限成功')
      this._getRolesList() //刷新列表
      this.rolesDialogVisible = false
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
.box-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
.tag {
  margin: 7px;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-top: 1px solid #eee;
}
.center {
  display: flex;
  align-items: center;
}
</style>
