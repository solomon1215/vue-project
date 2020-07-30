<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <el-table :data="userList">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click="removeUserById(scope.row.id)"></el-button>
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="queryInfo.page_num"
                    :page-sizes="[1,3,5,10]"
                    :page-size="queryInfo.page_size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
        <el-dialog
                title="添加用户"
                :visible.sync="dialogVisible"
                width="50%" @close="addDialogClosed">
            <!-- 对话框主体区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="修改用户"
                :visible.sync="editDialogVisible"
                width="50%" @close="editDialogClosed">
            <!-- 对话框主体区域 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        name: "Users",
        data() {
            //验证邮箱规则
            var checkEmail = (rule, value, cb) => {
                const regEmail = /^\w+@\w+(\.\w+)+$/
                if (regEmail.test(value)) {
                    return cb()
                }
                //返回一个错误提示
                cb(new Error('请输入合法的邮箱'))
            }
            //验证手机号码的规则
            var checkMobile = (rule, value, cb) => {
                const regMobile = /^1[34578]\d{9}$/
                if (regMobile.test(value)) {
                    return cb()
                }
                //返回一个错误提示
                cb(new Error('请输入合法的手机号码'))
            }
            return {
                //获取查询用户信息的参数
                queryInfo: {
                    query: '',
                    page_num: 1,
                    page_size: 1
                },
                //保存请求回来的用户列表数据
                userList: [],
                total: 0,
                dialogVisible: false,
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                addFormRules: {
                    username: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'},
                        {
                            min: 3,
                            max: 10,
                            message: '用户名在3~10个字符之间',
                            trigger: 'blur'
                        }
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {
                            min: 6,
                            max: 15,
                            message: '用户名在6~15个字符之间',
                            trigger: 'blur'
                        }
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'},
                        {validator: checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur'}
                    ]
                },
                editForm: {
                    username: '',
                    email: '',
                    mobile: ''
                },
                editDialogVisible: false,
                editFormRules: {
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {
                            validator: checkEmail,
                            message: '邮箱格式不正确，请重新输入',
                            trigger: 'blur'
                        }
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'},
                        {
                            validator: checkMobile,
                            message: '手机号码不正确，请重新输入',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            async getUserList() {
                const {data: res} = await this.$http.get('goods/users/', {params: this.queryInfo});
                if (res.code !== 0)
                    return this.$message.error('获取用户列表失败');
                this.userList = res.data.users;
                this.total = res.data.total;
                console.log(res)
            },
            handleSizeChange(newSize) {
                console.log(newSize);
                this.queryInfo.page_size = newSize;
                this.getUserList();
            },
            handleCurrentChange(current) {
                this.queryInfo.page_num = current;
                this.getUserList();
            },
            async userStateChanged(row) {
                //发送请求进行状态修改
                const {data: res} = await this.$http.put(`user/${row.id}/state/${row.mg_state}`)
                if (res.code !== 0) {
                    row.mg_state = !row.mg_state
                    return this.$message.error('修改状态失败')
                }
                this.$message.success('更新状态成功')
            },
            addDialogClosed() {
                this.$refs.addFormRef.resetFields();
            },
            addUser() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return this.$message.error('请填写完整用户信息')
                    const {data: res} = await this.$http.post('goods/users', this.addForm)
                    if (res !== 0)
                        return this.$message.error('添加用户失败')
                    this.$message.success('添加用户成功')
                    //关闭对话框
                    this.dialogVisible = false
                    //重新请求最新的数据
                    this.getUserList()
                })
            },
            async showEditDialog(id) {
                const {data: res} = await this.$http.get('goods/user/' + id + '/')
                if (res.code !== 0) return this.$message.error('获取用户信息失败')
                this.editForm = res.data
                console.log(res.data)
                this.editDialogVisible = true
            },
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            editUser() {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return this.$message.error('请填写完整用户信息')
                    const {data: res} = await this.$http.put('goods/users/' + this.editForm.id, this.editForm)
                    if (res.code !== 0) return this.$message.error('修改用户失败')
                    //修改成功的提示
                    this.$message.success('修改用户成功')
                    //关闭对话框
                    this.editDialogVisible = false
                    //重新请求最新的数据
                    this.getUserList()
                })
            },
            async removeUserById(id) {
                const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                //如果用户点击确认，则confirmResult 为'confirm'
                //如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
                if (confirmResult != "confirm") {
                    return this.$message.info("已经取消删除")
                }
                const {data: res} = await this.$http.delete('goods/user/' + id + '/')
                if (res.code !== 0) return this.$message.error('删除用户失败')
                //修改成功的提示
                this.$message.success('删除用户成功')
                this.getUserList()
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-card {
        margin-top: 10px;
    }
</style>