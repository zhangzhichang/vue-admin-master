<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-select v-model="filters.siteId" placeholder="请选择站点" @change="queryList()">
					<el-option v-for="item in filters.siteInfoList"
							:key="item.id"
							:label = "item.applicationName"
							:value="item.id">
					</el-option>
				</el-select>
				<el-form-item>
					<el-input v-model="filters.keyword" placeholder="关键字"></el-input>
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
			<el-table :data="configList" @selection-change="selsChange" highlight-current-row style="width: 100%;">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column type="index" :index="(index)=>{return (index+1) + (page.pageNum-1)*page.pageSize }" label="序号" width="80">
				</el-table-column>
				<el-table-column prop="configKey" label="KEY" width="200">
				</el-table-column>
				<el-table-column prop="configValue" label="VALUE" width="250">
				</el-table-column>
				<el-table-column prop="configName" label="配置名称" width="250">
				</el-table-column>
				<el-table-column prop="configDesc" label="配置描述" width="250">
				</el-table-column>
				<el-table-column label="操作" width="100" fixed="right">
					<template scope="scope">
						<el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
						<el-button size="small" type="text" @click="handleDel(scope.$index, scope.row)" ><i class="el-icon-delete"></i></el-button>
					</template>
				</el-table-column>
			</el-table>

			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
				<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="page.pageSize" :total="page.total" style="float:right;"></el-pagination>
			</el-col>
		</template>

		<el-dialog :title="dialogTitle" v-model="showDialog" :close-on-click-modal="false">
			<el-form :model="configInfo" label-width="80px" :rules="rules" ref="configInfo">
				<el-form-item label="站点" prop="siteId">
					<el-select v-model="configInfo.siteId"
							   filterable
							   default-first-option
							   placeholder="请选择站点">
						<el-option v-for="item in filters.siteInfoList"
								   :key="item.id"
								   :label="item.applicationName"
								   :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="KEY" prop="configKey">
					<el-input v-model="configInfo.configKey" size="medium"></el-input>
				</el-form-item>
				<el-form-item label="VALUE" prop="configValue">
					<el-input v-model="configInfo.configValue" size="medium"></el-input>
				</el-form-item>
				<el-form-item label="配置名称">
					<el-input v-model="configInfo.configName" size="medium"></el-input>
				</el-form-item>
				<el-form-item label="配置描述">
					<el-input type="textarea" v-model="configInfo.configDesc"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="showDialog = false">取消</el-button>
				<el-button type="primary" @click.native="submitForm">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>
<script>
	import {getByKeyword , deletedConfigByKey ,deletedConfigBatch ,getConfigInfoPage ,addConfigInfo ,modifyConfigInfo,getConfigInfoByKey} from "../../api/sweetzUtilsApi";
    export default {
		data() {
            var that = this;
            var validateConfigKey = function(rule, value, callback) {
                if (!value) {
                    return callback(new Error('请输入配置KEY'));
                }
                if(that.editConfigKey && that.editConfigKey == value){
                    callback();
                }else{
                    if(that.configInfo.siteId == null || that.configInfo.siteId == undefined){
                        return callback(new Error('请先选择站点'));
					}
                    getConfigInfoByKey({key:value , siteId:that.configInfo.siteId}).then(res => {
                        if(res.code == '10040000'){
                            if(res.result[0] && res.result[0].id){
                                return callback(new Error('该配置KEY已存在'));
                            }else{
                                return callback();
                            }
                        }else{
                            return callback(new Error('配置KEY校验失败'));
                        }
                    })
                }
            }
			return {
                filters:{
				    siteId:'',
					siteInfoList:[],
					keyword:''
				},
                sels:[],
				page:{
                    pageSize:10,
					total:0,
					pageNum:1
				},
                configList:[],
                configInfo:{},
                dialogTitle:"编辑",
                showDialog:false,
				editConfigKey:"",
                rules:{
                    configKey:[
                        {required: true, message: '请输入配置KEY', trigger: 'blur'},
                        { validator: validateConfigKey, trigger: 'blur' }
                    ],
                    siteId:[{required: true, message: '请输选择站点'}],
                    configValue:[{required: true, message: '请输配置值', trigger: 'blur'}]
                }
			}
		},
		methods: {
		    querySiteList: function(){
		        var that = this;
                getByKeyword({}).then(res =>{
                    if(res.code == '10040000'){
                        that.filters.siteInfoList = res.result;
                    }
				})
			},
            queryList: function () {
		        var that = this;
				if(this.filters.siteId != null){
				    var param = {};
				    param.keyword = that.filters.keyword;
				    param.siteId = that.filters.siteId;
				    param.pageNum = that.page.pageNum;
				    param.pageSize = that.page.pageSize;
                    getConfigInfoPage(param).then(res=>{
                        if(res.code == '10040000'){
                            that.page.total = res.result[0].pageInfo.total;
                            that.configList = res.result[0].sysConfigDtoList;
                        }else{
                            that.$message({
                                type: 'error',
                                message: '查询失败'
                            });
						}
					});
				}
            },
            handleAdd: function () {
                this.dialogTitle = "添加";
                this.showDialog = true;
                this.configInfo = {};
                this.editConfigKey = '';
            },
            handleEdit: function (index , row) {
				this.dialogTitle = "编辑";
				this.showDialog = true;
				this.configInfo = row;
				this.editConfigKey = row.configKey;
            },
            submitForm: function () {
                var that = this;
                this.$refs['configInfo'].validate((valid) => {
                    if (valid) {
                        if(that.configInfo.id){
                            //修改
                            modifyConfigInfo(that.configInfo).then(res => {
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
                            addConfigInfo(that.configInfo).then(res => {
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
			handleDel: function (index , row) {
                var that = this;
                this.$confirm('是否删除该条记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletedConfigByKey({key:row.configKey , siteId:row.siteId}).then(res=>{
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
            },
            batchRemove: function () {
				var ids = "";
				var length = this.sels.length;
                this.sels.forEach(function(value,index){
                    ids += value.id;
                    if(index != length - 1){
                        ids += ",";
					}
				})
                var that = this;
                this.$confirm('是否删除已选择记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletedConfigBatch({ids:ids}).then(res=>{
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
            },
            selsChange: function(sels){
                this.sels = sels;
			},
            handleCurrentChange: function (val) {
				this.page.pageNum = val;
				this.queryList();
            }

		},
		created(){
			this.querySiteList();
		},
		mounted() {

		}
	};

</script>

<style scoped>

</style>