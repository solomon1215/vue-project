<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div><img src="../assets/heima.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse?'64px': '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#ffd04b" unique-opened
                        :collapse="isCollapse"
                        :collapse-transition="false" router>
                    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span slot="title">{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>

                    </el-submenu>

                </el-menu>
            </el-aside>
            <!-- 主体结构 -->
            <el-main>
                <!-- 路由占位符-->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>


</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                //左侧菜单数据
                menuList: null,
                iconsObj: {
                    '105': 'iconfont icon-user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                },
                //是否折叠
                isCollapse: false
            }
        },
        created() {
            // 在created阶段请求左侧菜单数据
            this.getMenuList()
        },
        methods: {
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login')
            },

            async getMenuList() {
                // 发送请求获取左侧菜单数据
                const {data: res} = await this.$http.get('/goods/menus/');
                if (res.code !== 0)
                    return this.$message.error('res.errmsg');
                this.menuList = res.data;
                console.log(res)
            },
            toggleCollapse() {
                this.isCollapse = !this.isCollapse
            }
        }
    }
</script>

<style lang="less" scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #373D41;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #fff;
        font-size: 20px;

        > div {
            display: flex;
            align-items: center;
        }
    }

    .el-aside {
        background-color: #333744;

        .el-menu {
            border-right: none;
        }
    }

    .el-main {
        background-color: #eaedf1;
    }

    .iconfont {
        padding-right: 10px;
    }

    .toggle-button {
        background-color: #4A5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>