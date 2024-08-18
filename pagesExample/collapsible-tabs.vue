<template>
	<!-- 在 微信小程序/App 平台可使用 page-meta 组件动态修改页面样式 来禁止滚动穿透，会导致页面重新渲染 -->
	<!-- <page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta> -->
	<view class="page-container">
		<y-tabs ref="tabs" v-model="activeIndex" type="text" title-active-color="#000" title-inactive-color="#666"
			sticky :offsetTop="offsetTop" :titleActiveStyle="titleActiveStyle" :titleInactiveStyle="titleInactiveStyle">
			<y-tab class=" y-tab-virtual" v-for="(item,index) in myTabs" :key="item.key" :title="item.title">
				<view class="content-wrap">
					<text style="color:ff9900;font-size: 15px;">点击右侧箭头展开所有的标签</text>
					<view v-for="num in 60" :key="num">{{item.title}}</view>
					<view>到底啦！！！</view>
				</view>
			</y-tab>


			<!-- 标签栏右侧 -->
			<template #navRight>
				<view class="nav-right-wrap" @click.stop="showPopup">
					<uni-icons type="bottom" :color="'#5e6d82'" size="16" />
				</view>
			</template>
		</y-tabs>

		<!-- 标签选择弹出层 -->
		<uni-popup ref="popup" background-color="#fff" @change="change" type="top">
			<scroll-view scroll-y="true" class="popup__scrollview">
				<view class="popup-content">
					<view class="popup__title">
						<view class="popup__title-text">我的频道</view>
						<view class="popup__title-subtext">点击进入频道</view>
						<view class="popup__title-tools">
							<view class="popup__title-button" @click.stop="changeEdit">{{btnText}}</view>
							<uni-icons class="close-popup-icon" type="top" color="#5e6d82" size="16"
								@click="closePopup" />
						</view>
					</view>
					<uni-row class="popup__row-tags" :gutter="36">
						<uni-col :span="6" v-for="(item,index) in myTabs" :key="item.key">
							<view @click="handleClickByMy(item,index)">
								<view class="popup-tag"
									:class="[item.disabled && 'is-disabled',  index===activeIndex && 'is-active']">
									<text>{{item.title}}</text>
								</view>
								<!-- 删除图标：'进入编辑'模式且标签非禁用时显示 -->
								<uni-icons v-if="!item.disabled && isEdit" type="clear" color="#e1e1e1" size="18" />
							</view>
						</uni-col>
					</uni-row>

					<view class="popup__title">
						<view class="popup__title-text">推荐频道</view>
						<view class="popup__title-subtext">点击添加频道</view>
					</view>
					<uni-row class="popup__row-tags" :gutter="36">
						<uni-col :span="6" v-for="(item,index) in recommendTabs" :key="item.key">
							<view @click="addTabToMy(item,index)">
								<view class="popup-tag">
									<uni-icons type="plusempty" color="#888" size="10" />
									<text>{{item.title}}</text>
								</view>
							</view>
						</uni-col>
					</uni-row>
				</view>
			</scroll-view>

		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				titleActiveStyle: { color: '#000', fontSize: '15px', },
				titleInactiveStyle: { color: '#666', fontSize: '13px', },
				show: false,
				offsetTop: 0,
				activeIndex: 0, //当前选中的标签下标
				isEdit: false, //是否进入编辑
				myTabs: [], //"我的频道"的标签
				recommendTabs: [], //"推荐频道"的标签
				// disabled表示在'我的频道'中不可移除；isMy为true表示属于'我的频道',为false属于'推荐频道'
				allTabs: [
					{ title: "推荐", disabled: true, isMy: true },
					{ title: "视频", disabled: true, isMy: true },
					{ title: "直播", disabled: true, isMy: true },
					{ title: "美食", disabled: false, isMy: true },
					{ title: "旅行", disabled: false, isMy: true },
					{ title: "穿搭", disabled: false, isMy: true },
					{ title: "搞笑", disabled: false, isMy: true },
					{ title: "情感", disabled: false, isMy: true },
					{ title: "舞蹈", disabled: false, isMy: true },
					{ title: "摄影", disabled: false, isMy: true },
					{ title: "科技数码", disabled: false, isMy: true },
					{ title: "萌宠", disabled: false, isMy: true },
					{ title: "家居", disabled: false, isMy: true },
					{ title: "艺术", disabled: false, isMy: true },
					{ title: "读书", disabled: false, isMy: true },
					{ title: "汽车", disabled: false, isMy: true },
					{ title: "校园生活", disabled: false, isMy: true },
					{ title: "文具手账", disabled: false, isMy: true },
					{ title: "绘画", disabled: false, isMy: true },
					{ title: "健身塑形", disabled: false, isMy: true },
					{ title: "户外", disabled: false, isMy: true },
					{ title: "手工", disabled: false, isMy: true },
					{ title: "明星", disabled: false, isMy: true },
					{ title: "露营", disabled: false, isMy: true },
					{ title: "学习", disabled: false, isMy: true },
					{ title: "影视", disabled: false, isMy: true },
					{ title: "动漫", disabled: false, isMy: false },
					{ title: "减脂", disabled: false, isMy: false },
					{ title: "文化", disabled: false, isMy: false },
					{ title: "运动", disabled: false, isMy: false },
					{ title: "婚礼", disabled: false, isMy: false },
					{ title: "潮鞋", disabled: false, isMy: false },
					{ title: "竞技体育", disabled: false, isMy: false },
					{ title: "心理", disabled: false, isMy: false },
					{ title: "男士理容", disabled: false, isMy: false },
					{ title: "壁纸", disabled: false, isMy: false },
					{ title: "综艺", disabled: false, isMy: false },
					{ title: "社科", disabled: false, isMy: false },
					{ title: "母婴", disabled: false, isMy: false },
					{ title: "机车", disabled: false, isMy: false },
					{ title: "潮玩手办", disabled: false, isMy: false },
					{ title: "头像", disabled: false, isMy: false },
					{ title: "游戏", disabled: false, isMy: false },
					{ title: "珠宝", disabled: false, isMy: false },
					{ title: "家电", disabled: false, isMy: false },

				]
			}
		},
		computed: {
			btnText() {
				return this.isEdit ? '完成编辑' : '进入编辑'
			},
		},
		created() {
			// H5端需要减去标题栏高度
			// #ifdef H5
			this.offsetTop = 40;
			// #endif

			this.initTabs();
		},
		methods: {
			initTabs() {
				this.allTabs.forEach((o, i) => this.$set(o, "key", i)); //设置key
				// 初始化标签
				this.myTabs = this.allTabs.filter(o => o.isMy).map(o => ({ ...o }))
				this.recommendTabs = this.allTabs.filter(o => !o.isMy).map(o => ({ ...o }))
			},
			// 弹出层组件状态发生变化触发
			change(e) {
				this.show = e.show;
			},
			// 显示弹出层
			showPopup() {
				this.$refs.popup.open()
			},
			// 关闭弹出层
			closePopup() {
				this.$refs.popup.close()
			},
			changeEdit() {
				this.isEdit = !this.isEdit
			},
			// "我的频道"的标签点击触发的事件
			handleClickByMy(tag, index) {
				// 如果是'进入编辑'模式，点击的是非禁用的tag，那么将其移除，并添加到'推荐频道'
				if (this.isEdit && !tag?.disabled) {
					this.$set(tag, "isMy", false)
					this.recommendTabs.push({ ...tag });
					this.myTabs.splice(index, 1);
				}

				// 如果是'完成编辑'模式，切换标签页组件的 v-model 并关闭弹出层
				if (!this.isEdit) {
					this.activeIndex = index;
					this.closePopup();
				}
			},
			// 添加标签到"我的频道"
			addTabToMy(tag, index) {
				// 避免重复添加
				const isFound = this.myTabs.find(o => o.key === tag.key);
				if (isFound) return;
				this.$set(tag, "isMy", true);
				this.myTabs.push({ ...tag });
				this.recommendTabs.splice(index, 1);
			},
		}
	}
</script>
<style lang="scss" scoped>
	.content-wrap {
		height: auto;
		line-height: 40px;
		/* #ifndef H5 */
		// height: calc(100vh - 44px);
		/* #endif */
		/* #ifdef H5 */
		// height: calc(100vh - 88px);
		/* #endif */
		background-color: #fff;
		font-size: 14px;
	}

	::v-deep .y-tabs {
		.y-tab {
			padding: 0 20rpx;
		}

		.y-tabs__scroll {
			box-shadow: -15px 0 10px -10px #f2f2f2 inset;
		}

		.y-tabs__nav-right {
			flex: 1;

			.nav-right-wrap {
				padding: 0 20rpx;
				display: flex;
				align-items: center;

			}
		}
	}



	::v-deep .popup__scrollview {
		height: calc(100vh - var(--window-top) - 20vh);

		.popup-content {
			padding: 0 24rpx;
		}

		// 标题
		.popup__title {
			display: flex;
			flex-direction: row;
			padding: 24rpx 0;
			align-items: center;
			line-height: 1;

			&-text {
				font-size: 30rpx;
				font-weight: 560;
			}

			&-subtext {
				font-size: 24rpx;
				color: #777;
				padding-left: 20rpx;
			}

			&-tools {
				flex: 1;
				text-align: right;
			}

			&-button {
				display: inline-block;
				background-color: #eee;
				padding: 10rpx 28rpx;
				font-size: 24rpx;
				border-radius: 60rpx;
				color: #1989fa;
			}

			.close-popup-icon {
				margin-left: 32rpx;
			}
		}

		.uni-col {
			position: relative;
		}

		// 清除图标
		.uni-icons.uniui-clear {
			position: absolute;
			top: -10px;
			right: 4px;
		}

		// 添加图标
		.uni-icons.uniui-plusempty {
			margin-right: 2px;
		}

		// 标签
		.popup-tag {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			text-align: center;
			padding: 18rpx 0;
			margin-bottom: 32rpx;
			color: #666;
			font-size: 24rpx;
			font-weight: 560;
			line-height: 1;
			border: 1rpx solid #e6e6e6;
			border-radius: 8rpx;

			&.is-disabled {
				background-color: #e6e6e6;
			}

			&.is-active {
				color: #EE0A24;
				border-color: #EE0A24;
				background-color: #fff;
			}
		}
	}
</style>