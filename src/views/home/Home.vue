<template>
  <div>
    <el-container class="container">
      <el-header class="header">
        <div>
          <img src="../../assets/img/logo1.png" alt="" />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside class="aside" :width="iconSign ? '64px' : '200px'">
          <!-- 折叠-展开 -->
          <div class="toggle-btn" @click="toggleBtn">
            <i :class="isCollapse"></i>
          </div>
          <!-- 侧边栏菜单 -->
          <el-menu
            class="menu"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            :unique-opened="true"
            :collapse="iconSign"
            :collapse-transition="false"
            router
            :default-active="saveNavState"
          >
            <el-submenu :index="String(item.id)" v-for="item in muenuList" :key="item.id">
              <template slot="title">
                <i :class="iconMenu[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item :index="`/${subItem.path}`" v-for="subItem in item.children" :key="subItem.id" @click="isActive">
                <template slot="title"></template>
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getLeftMenu } from 'network/home.js'
export default {
  created() {
    this._getLeftMenu()
    this.saveNavState = window.sessionStorage.getItem('btnActive')
  },
  components: {},
  data() {
    return {
      muenuList: [],
      iconMenu: {
        '125': 'iconfont icon-yonghuming',
        '103': 'iconfont icon-quanxian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-dingdan',
        '145': 'iconfont icon-shuju'
      },
      iconSign: false,
      saveNavState: ''
    }
  },
  computed: {
    isCollapse() {
      return this.iconSign ? 'iconfont icon-zhediehengxiang' : 'iconfont icon-zhankaihengxiang'
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async _getLeftMenu() {
      const res = await getLeftMenu()
      if (res.meta.status !== 200) {
        return this.$message.error('菜单获取失败')
      }
      this.muenuList = res.data
    },
    toggleBtn() {
      this.iconSign = !this.iconSign
    },
    isActive(e) {
      this.saveNavState = e.index
      window.sessionStorage.setItem('btnActive', this.saveNavState)
    }
  }
}
</script>
<style lang="less" scoped>
@import '~assets/less/variable.less';
@import '~assets/less/mixin.less';
.container {
  height: 100vh;
  .header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    color: #fff;
    font-size: 20px;
    div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }
  .aside {
    background-color: #333744;
    .toggle-btn {
      background-color: #4a5064;

      line-height: 40px;
      text-align: center;
      color: #fff;
      i {
        font-size: 25px;
      }
    }
    .menu {
      border-right: none;
    }
  }
  .main {
    background-color: #eaedf1;
  }
  .iconfont {
    margin-right: 10px;
  }
}
</style>
