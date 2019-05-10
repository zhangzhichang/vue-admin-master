<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item label="关键字">
					<el-input v-model="filters.keyword" style="width: 300px;" placeholder="站点名称、uuid、应用名称、描述"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button v-on:click="queryList" icon="el-icon-search">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="success" icon="el-icon-plus" @click="handleAdd()">添加</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="siteList" highlight-current-row style="width: 100%;">
				<el-table-column type="index" label="序号" width="80">
				</el-table-column>
				<el-table-column prop="siteUuid" label="UUID" width="300">
				</el-table-column>
				<el-table-column prop="applicationName" label="应用名" width="150">
				</el-table-column>
				<el-table-column prop="siteName" label="站点名" width="250">
				</el-table-column>
				<el-table-column prop="siteDesc" label="描述" width="250">
				</el-table-column>
				<el-table-column prop="siteDomain" label="网址" width="200">
				</el-table-column>
				<el-table-column label="操作" width="100" fixed="right">
					<template slot-scope="scope">
						<el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
						<el-button size="small" type="text" @click="handleDelete(scope.$index, scope.row)" ><i class="el-icon-delete"></i></el-button>
					</template>
				</el-table-column>
			</el-table>
		</template>

		<el-dialog :title="dialogTitle" v-model="showDialog" :close-on-click-modal="false">
			<el-form :model="siteInfo" label-width="80px" :rules="rules" ref="siteInfo">
				<el-form-item label="UUID" v-if="siteInfo.id != null">
					<el-input v-model="siteInfo.siteUuid" size="medium" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="应用名" prop="applicationName">
					<el-input v-model="siteInfo.applicationName" placeholder="该站点的代码" size="medium"></el-input>
				</el-form-item>
				<el-form-item label="站点名" prop="siteName">
					<el-input v-model="siteInfo.siteName" placeholder="该站点的名称" size="medium"></el-input>
				</el-form-item>
				<el-form-item label="描述">
					<el-input type="textarea" v-model="siteInfo.siteDesc" placeholder="该站点的简介"></el-input>
				</el-form-item>
				<el-form-item label="网址">
					<el-input v-model="siteInfo.siteDomain" placeholder="该站点的网站地址" size="medium"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="showDialog = false">取消</el-button>
				<el-button type="primary" @click.native="submitSiteForm">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>
<script>
	import {getByUuid , deletedByUuid , getByKeyword ,checkByAppName ,addSite , modifySite} from "../../api/sweetzUtilsApi";
    export default {
		data() {
		    var that = this;
            var validateApplicationName =function(rule, value, callback){
                if (!value) {
                    return callback(new Error('应用名不能为空'));
                }
                if(that.editApplicationName && that.editApplicationName == value){
                    callback();
				}else{
                    checkByAppName({appName:value}).then(res => {
						if(res.code == '10040000'){
						    if(!res.result[0]){
                                return callback(new Error('该应用名已存在'));
							}else{
                                return callback();
							}
						}else{
                            return callback(new Error('应用名校验失败'));
						}
					})
				}

            }
			return {
				filters: {
                    keyword:''
				},
				siteList:[],
				siteInfo:{},
                dialogTitle:"编辑",
                showDialog:false,
				editApplicationName:'',
				rules:{
                    applicationName:[
						{required: true, message: '请输入应用名', trigger: 'blur'},
                        { validator: validateApplicationName, trigger: 'blur' }
					],
                    siteName:[{required: true, message: '请输入站点名称', trigger: 'blur'}]
				}
			}
		},
		methods: {
            queryList: function(){
                var param = {};
                var that = this;
                param.keyword = that.filters.keyword;
                getByKeyword(param).then(res =>{
                    if(res.code == '10040000'){
						that.siteList = res.result;
					}else{
                        that.$message({
                            type: 'error',
                            message: '查询失败'
                        });
					}
                })
			},
            handleAdd: function(){
				this.dialogTitle = "添加";
				this.showDialog = true;
				this.siteInfo = {};
				this.editApplicationName = '';
			},
			handleEdit: function(index , row){
                var that = this;
                getByUuid({uuid:row.siteUuid}).then(res =>{

                    if(res.code == '10040000'){

                        if(res.result[0] != null){
                            that.dialogTitle = "修改";
                            that.showDialog = true;
                            that.siteInfo = res.result[0];
                            that.editApplicationName = that.siteInfo.applicationName
                        }else{
                            that.$message({
                                type: 'error',
                                message: '参数有误，未查询到结果!'
                            });
						}
                    }else{
                        that.$message({
                            type: 'error',
                            message: '查询失败!'
                        });
                    }
				})

			},
			submitSiteForm: function(){
                var that = this;
                this.$refs['siteInfo'].validate((valid) => {
                    if (valid) {
                        if(that.siteInfo.id){
                            //修改
                            modifySite(that.siteInfo).then(res => {
                                if(res.code == '10040000'){
                                    that.$message({
                                        type: 'success',
                                        message: '修改成功!',
                                        onClose:function(){
                                            that.showDialog = false;
                                            that.queryList();
                                        }
                                    });
                                }else{
                                    that.$message({
                                        type: 'error',
                                        message: '修改失败!'
                                    });
                                }
							})
						}else{
                            //添加
                            addSite(that.siteInfo).then(res => {
                                if(res.code == '10040000'){
                                    that.$message({
                                        type: 'success',
                                        message: '添加成功!',
                                        onClose:function(){
                                            that.showDialog = false;
                                            that.queryList();
                                        }
                                    });
                                }else{
                                    that.$message({
                                        type: 'error',
                                        message: '添加失败!'
                                    });
                                }
							})
						}
                    } else {
                        return false;
                    }
                });
			},
			handleDelete: function (index , row) {
                var that = this;
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var uuid = row.siteUuid;
                    deletedByUuid({uuid:uuid}).then(res=>{
                        if(res.code == '10040000'){
                            that.$message({
                                type: 'success',
                                message: '删除成功!',
                                onClose:function(){
                                    that.queryList();
                                }
                            });
                        }else{
                            that.$message({
                                type: 'error',
                                message: '删除失败!'
                            });
                        }
                    })

                }).catch(() => {

                });
            }
        },
		created(){
			this.queryList();
		},
		mounted() {

		}
	};

</script>

<style scoped>

</style>