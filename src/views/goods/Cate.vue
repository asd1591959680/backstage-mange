<template>
  <div>
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="card">
      <el-row class="button">
        <el-col>
          <el-button type="primary" @click="showCateDialog">添加商品</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="cateList"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        :expand-type="false"
        :selection-type="false"
        :columns="columns"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >

          <el-tag type="danger" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="handle">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >

          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cateQuery.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="cateQuery.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="添加分类" :visible.sync="cateDialogVisible" width="50%">
      <el-form
        :model="addCateForm"
        :rules="addCatemRules"
        ref="addCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="cascaderChange"
            clearable
            class="cascader"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cateDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateList } from 'network/goods.js'
export default {
  created() {
    this._getCateList()
  },
  components: {},
  data() {
    return {
      cateQuery: {
        type: 3,
        pagenum: 1,
        pagesize: 10,
      },
      cateList: [],
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          //当前列定义为模板列
          type: 'template',
          //模板列名称
          template: 'isok',
        },
        {
          label: '排序',
          //当前列定义为模板列
          type: 'template',
          //模板列名称
          template: 'order',
        },
        {
          label: '操作',
          //当前列定义为模板列
          type: 'template',
          //模板列名称
          template: 'handle',
        },
      ],
      cateDialogVisible: false,
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0,
      },
      addCatemRules: {
        cat_name: [
          { required: true, message: '请输入分类名', trigger: 'blur' },
        ],
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
      },
      selectKeys: [],
    }
  },
  methods: {
    async _getCateList() {
      const res = await getCateList(
        this.cateQuery.type,
        this.cateQuery.pagenum,
        this.cateQuery.pagesize
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.$message.success('获取商品列表成功')
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.cateQuery.pagesize = newSize
      this._getCateList()
    },
    handleCurrentChange(newNum) {
      this.cateQuery.pagenum = newNum
      this._getCateList()
    },
    showCateDialog() {
      this.cateDialogVisible = true
      this._getParentCate()
    },
    async _getParentCate() {
      const res = await getCateList(2)
      this.parentCateList = res.data
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      this.$message.success('获取父级分类成功')
    },
    cascaderChange() {
      console.log(1)
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
  .button {
    margin-bottom: 15px;
  }
}
.cascader {
  width: 100%;
}
</style>
