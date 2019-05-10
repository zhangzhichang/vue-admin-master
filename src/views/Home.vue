<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="10">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="4" class="userInfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userInfo-inner"><img :src="this.sysUserAvatar" /> {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router :collapse="collapsed">
				<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
					<el-submenu :index="index+''" v-if="!item.leaf">
						<template slot="title">
							<i :class="item.iconCls"></i>
							<span>{{item.name}}</span>
						</template>
						<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
					</el-submenu>
					<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path">
						<i :class="item.iconCls"></i>
						<span slot="title">{{item.children[0].name}}</span>
					</el-menu-item>
				</template>
			</el-menu>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	export default {
		data() {
			return {
				sysName:'VUEADMIN',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',

			}
		},
		methods: {
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a, b) {
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					_this.$router.push('/login');
				}).catch(() => {

				});
			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			}
		},
		created(){
		  var user = "{\"id\":1,\"username\":\"admin\",\"avatar\":\"https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png\",\"name\":\"张某某\"}";
		  sessionStorage.setItem("user" , user);
		},
		mounted() {
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.name || '';
				this.sysUserAvatar = user.avatar || '';
			}

		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';

	.el-menu-vertical-demo:not(.el-menu--collapse) {width: 230px;min-height: 600px;}
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: $color-primary;
			color:#fff;
			.userInfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userInfo-inner {
					cursor: pointer;
					color:#fff;
					img {width: 40px;height: 40px;border-radius: 20px;margin: 10px 0px 10px 10px;float: right;}
				}
			}
			.logo {
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				img {width: 40px;float: left;margin: 10px 10px 10px 18px;}
				.txt {color:#fff;}
			}
			.logo-width{width:230px;}
			.logo-collapse-width{width:60px}
			.tools{padding: 0px 23px;width:14px;height: 60px;line-height: 60px;cursor: pointer;}
		}
		.main {
			display: flex;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;

			.el-menu--collapse{width: 60px;min-height: 600px;}
			.content-container {
				flex:1;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					.title {width: 200px;float: left;color: #475669;}
					.breadcrumb-inner {float: right;}
				}
				.content-wrapper {background-color: #fff;box-sizing: border-box;}
			}
		}
	}
</style>