<template>
  <div>
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="card">
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="authName" label="名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="等级">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.level === '0'">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.level === '1'"
                >二级
              </el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from 'network/power.js'
export default {
  created() {
    this._getRightsList()
  },
  components: {},
  data() {
    return {
      rightsList: [],
    }
  },
  methods: {
    async _getRightsList() {
      const res = await getRightsList('list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.$message.success('获取权限列表成功')
      this.rightsList = res.data
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
</style>
