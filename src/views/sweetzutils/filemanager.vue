<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-select v-model="filters.siteId" clearable placeholder="请选择站点" @change="queryList()">
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
			<el-table :data="fileList" highlight-current-row style="width: 100%;">
				<el-table-column type="index" :index="(index)=>{return (index+1) + (page.pageNum-1)*page.pageSize }" label="序号" width="80">
				</el-table-column>
				<el-table-column prop="id" label="文件id" width="320">
				</el-table-column>
				<el-table-column prop="fileName" label="文件名" width="300">
				</el-table-column>
				<el-table-column prop="module1" label="模块1" width="100">
				</el-table-column>
				<el-table-column prop="module2" label="模块2" width="150">
				</el-table-column>
				<el-table-column label="操作" width="150" fixed="right">
					<template slot-scope="scope">
						<el-button size="small" type="primary" @click="getDownloadUrl(scope.$index, scope.row)" >下载</el-button>
						<el-button size="small" type="danger" @click="handleDel(scope.$index, scope.row)" >删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="page.pageSize" :total="page.total" style="float:right;"></el-pagination>
			</el-col>
		</template>

		<el-dialog title="上传" v-model="showDialog" :close-on-click-modal="false">
			<el-upload
					class="upload-demo"
					name="file"
					:data="uploadData"
					drag
					action="/utils/file/upload"
					:show-file-list="showFileList"
					:on-remove="removeFile"
					:on-error="uploadError"
					:file-list="uploadFileList"
					multiple>
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			</el-upload>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="closeUpload">关闭</el-button>
			</div>
		</el-dialog>

	</section>
</template>
<script>
	import {getByKeyword ,getDdownloadUrl,deletedFile,getFileListPage} from "../../api/sweetzUtilsApi";
    export default {
		data() {
            return {
                filters:{
				    siteId:'',
					siteInfoList:[],
					keyword:''
				},
				page:{
                    pageSize:10,
					total:0,
					pageNum:1
				},
                fileList:[],
                docFile:{},
                showDialog:false,
                uploadData:{module1:"utils",module2:"utils-doc-file",siteId:1},
                showFileList:true,
                uploadFileList:[]
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
                var param = {};
                param.keyword = that.filters.keyword;
                param.siteId = that.filters.siteId;
                param.pageNum = that.page.pageNum;
                param.pageSize = that.page.pageSize;
                getFileListPage(param).then(res=>{
                    if(res.code == '10040000'){
                        that.page.total = res.result[0].pageInfo.total;
                        that.fileList = res.result[0].docFileDtoList;
                    }else{
                        that.$message({
                            type: 'error',
                            message: '查询失败'
                        });
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
                    deletedFile({fileId:row.id}).then(res=>{
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
            handleCurrentChange: function (val) {
				this.page.pageNum = val;
				this.queryList();
            },
            getDownloadUrl: function (index,row) {
                getDdownloadUrl({fileId:row.id}).then(res =>{
                    if(res.code == '10040000'){
                        window.open(res.result[0],'_blank')
					}else{

					}
				})
            },
            handleAdd: function(){
              this.uploadFileList = [];
		      this.showDialog=true;
			},
            closeUpload: function () {
                this.showDialog=false;
                this.queryList();
            },
            uploadError: function (err, file, fileList) {
				console.log(err)
            },
			removeFile: function (file, fileList) {
                var docFileInfo = file.response.result[0];
                deletedFile({fileId:docFileInfo.id}).then(res=>{

				})
            }

		},
		created(){
			this.querySiteList();
			this.queryList();
		},
		mounted() {

		}
	};

</script>

<style scoped>

</style>