<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-select v-model="filters.application" placeholder="请选择Application" @change="queryProfileList(1)">
					<el-option v-for="item in filters.applicationList"
							:key="item.value"
							:value="item.value">
					</el-option>
				</el-select>
				<el-select v-model="filters.profile" placeholder="请选择Profile" @change="queryList(1)">
					<el-option v-for="item in filters.profileList"
							   :key="item.value"
							   :value="item.value">
					</el-option>
				</el-select>
				<el-form-item>
					<el-button v-on:click="queryList" icon="el-icon-search">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="success" icon="el-icon-plus" @click="handleAdd()">添加</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="publishConfig" v-if="showPublish">发布</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="configList" highlight-current-row style="width: 100%;">
				<el-table-column type="index" label="序号" width="80">
				</el-table-column>
				<el-table-column prop="pkey" label="KEY" width="200">
				</el-table-column>
				<el-table-column prop="pvalue" label="VALUE" width="250">
				</el-table-column>
				<el-table-column prop="beforeValue" label="历史值" width="250">
				</el-table-column>
				<el-table-column prop="label" label="LABEL" width="100">
				</el-table-column>
				<el-table-column prop="isPublish" label="是否发布" :formatter="formatPublish" width="160">
				</el-table-column>
				<el-table-column label="操作" width="100" fixed="right">
					<template slot-scope="scope">
						<el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
						<el-button size="small" type="text" @click="handleDel(scope.$index, scope.row)" ><i class="el-icon-delete"></i></el-button>
					</template>
				</el-table-column>
			</el-table>
		</template>

		<el-dialog title="编辑" v-model="showDialog" :close-on-click-modal="false">
			<el-form :model="editFormConfig" label-width="80px" ref="editFormConfig">
				<el-form-item label="Application">
					<el-select v-model="editFormConfig.application"
							   filterable
							   allow-create
							   default-first-option
							   placeholder="请选择Application"
							   @change="queryProfileList(2)">
						<el-option v-for="item in dailogApplicationList"
								   :key="item.value"
								   :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="Profile">
					<el-select v-model="editFormConfig.profile"
							   filterable
							   allow-create
							   default-first-option
							   placeholder="请选择Profile">
						<el-option v-for="item in dailogProfileList"
								   :key="item.value"
								   :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="KEY">
					<el-input v-model="editFormConfig.pkey" size="medium"></el-input>
				</el-form-item>
				<el-form-item label="VALUE">
					<el-input type="textarea" v-model="editFormConfig.pvalue"></el-input>
				</el-form-item>
				<el-form-item label="LABEL">
					<el-input v-model="editFormConfig.label" size="medium"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="showDialog = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>
<script>
	import {getApplicationList , getProfileList ,getConfigList ,publishConfig ,deleteConfig,submitConfig} from "../../api/configManagerApi";
	import utils from "../../common/js/util.js";
    export default {
		data() {
			return {
				filters: {
					application: '',
					profile:'',
					applicationList:[],
					profileList:[]
				},
				configList: [],
				dailogApplicationList:[],
				dailogProfileList:[],
                showPublish:false,
				showDialog:false,
				editFormConfig: {
				    id:'',
					application:'',
                    profile:'',
                    pkey:'',
                    pvalue:'',
					label:''
				}
			}
		},
		methods: {
            formatPublish: function (row, column) {
                return row.isPublish == 1 ? '已发布' : '未发布';
            },
		    queryList: function(){
		    	//查询列表
				if(!utils.isNull(this.filters.application) && !utils.isNull(this.filters.profile)){
					this.showPublish = true;
				    var that = this;
				    var param = {};
                    param.application = this.filters.application;
                    param.profile = this.filters.profile;
                    getConfigList(param).then(res =>{
                        that.configList = res.result;
                    })
				}
			},
			queryApplicationList: function (flag) {
		        var that = this;
                getApplicationList().then(res =>{
                    if(res.code == 200){
                        if(flag == 1){
                            that.filters.applicationList = [];
                            for(var i = 0 ; i < res.result.length ; i++){
                                var item = res.result[i];
                                that.filters.applicationList.push({value:item});
                            }
						}else{
                            that.dailogApplicationList = [];
                            for(var i = 0 ; i < res.result.length ; i++){
                                var item = res.result[i];
                                that.dailogApplicationList.push({value:item});
                            }
						}

					}
				})
            },
			queryProfileList: function(flag){
				var that = this;
				var application = this.filters.application;
				if(flag != 1){
                    application = this.editFormConfig.application;
				}else{
                    this.filters.profile = '';
				}
                getProfileList({application:application}).then(res =>{
                    if(res.code == 200){
                        if(flag == 1){
                            that.filters.profileList = [];
                            for(var i = 0 ; i < res.result.length ; i++){
                                var item = res.result[i];
                                that.filters.profileList.push({value:item});
                            }
						}else{
                            that.dailogProfileList = [];
                            for(var i = 0 ; i < res.result.length ; i++){
                                var item = res.result[i];
                                that.dailogProfileList.push({value:item});
                            }
						}

                    }
				})
			},
            publishConfig: function(){
                var that = this;
                var param = {};
                param.application = this.filters.application;
                param.profile = this.filters.profile;
                publishConfig(param).then(res =>{
                    if(res.code == 200){
                        that.$alert("发布成功", "提示", {
                            confirmButtonText: '确定',
                            callback: action => {
                                that.queryList();
                            }
                        });

                    }else{
                        that.$message({
                            message: res.message,
                            type: 'error',
                            onClose: action => {
                                that.queryList();
                            }
                        });
                    }
                })
			},
            handleEdit: function(index , row){
                this.dailogApplicationList = this.filters.applicationList;
				this.editFormConfig = this.configList[index];
				this.showDialog = true;
			},
            editSubmit: function(){
                var that = this;
                submitConfig(that.editFormConfig).then(res =>{
                    var message = "";
                    if(res.code == 200){
                        if(that.editFormConfig.id){
                            message = "修改成功"
						}else{
                            message = "添加成功"
						}
                    }else{
                        message = res.message;
					}
                    that.$message({
                        type: 'success',
                        message: message,
                        onClose:function(){
                            that.showDialog = false;
                            that.queryApplicationList(1);
                            that.queryList();
                        }
                    });
                })
			},
            handleAdd: function(){
                this.dailogApplicationList = this.filters.applicationList;
                this.editFormConfig = {id:'',application:'',profile:'',pkey:'',pvalue:'',label:''}
                this.showDialog = true;
			},
            handleDel: function(index , row){
                var that = this;
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var id = row.id;
                    deleteConfig({id:id}).then(res=>{
                        if(res.code == 200){
                            that.$message({
                                type: 'success',
                                message: '删除成功!',
                                onClose:function(){
                                    that.queryApplicationList(1);
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
            this.queryApplicationList(1);
		},
		mounted() {

		}
	};

</script>

<style scoped>

</style>