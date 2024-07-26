<template>
	<view class="waterfall">
		<!-- pages.json中设置"disableScroll": true使页面整体不能上下滚动，内容页中使用scroll-view实现局部滚动 -->
		<y-tabs ref="tabs" v-model="activeIndex" sticky shrink swipeable color="#fed802" title-active-color="#fed802"
			:wrap-style="{paddingBottom:'6px'}" @slide-change="slideChange" @slide-end="slideEnd">
			<y-tab class="y-tab-virtual" title="关注" :title-style="titleStyle">
				<view class="content-wrap">
					<scroll-view class="listview" style="flex: 1;" enableBackToTop="true" :scroll-y="!locked"
						:refresher-enabled="!locked" :refresher-triggered="triggered" @refresherrefresh="onRefresh"
						@refresherrestore="onRestore" @scrolltolower="loadMore()">
						<uv-waterfall ref="waterfall" v-model="list" :add-time="10" :left-gap="leftGap"
							:right-gap="rightGap" :column-gap="columnGap" @changeList="changeList">
							<!-- 第一列数据 -->
							<template v-slot:list1>
								<!-- 为了磨平部分平台的BUG，必须套一层view -->
								<view>
									<view v-for="(item, index) in list1" :key="item.id" class="waterfall-item">
										<view class="waterfall-item__image" :style="[imageStyle(item,1)]">
											<image :src="item.image" mode="widthFix" :style="{width:item.width+'px'}">
											</image>
										</view>
										<view class="waterfall-item__ft">
											<view class="waterfall-item__ft__title">
												<text class="value">{{item.title}}</text>
											</view>
											<view class="waterfall-item__ft__desc uv-line-2">
												<text class="value">{{item.desc}}</text>
											</view>
										</view>
									</view>
								</view>
							</template>
							<!-- 第二列数据 -->
							<template v-slot:list2>
								<!-- 为了磨平部分平台的BUG，必须套一层view -->
								<view>
									<view v-for="(item, index) in list2" :key="item.id" class="waterfall-item">
										<view class="waterfall-item__image" :style="[imageStyle(item,2)]">
											<image :src="item.image" mode="widthFix" :style="{width:item.width+'px'}">
											</image>
										</view>
										<view class="waterfall-item__ft">
											<view class="waterfall-item__ft__title">
												<text class="value">{{item.title}}</text>
											</view>
											<view class="waterfall-item__ft__desc uv-line-2">
												<text class="value">{{item.desc}}</text>
											</view>
										</view>
									</view>
								</view>
							</template>
						</uv-waterfall>
						<!-- 加载更多 -->
						<uni-load-more :status="status" />
					
					</scroll-view>
				</view>
			</y-tab>
			<y-tab class="y-tab-virtual" title="动态" :title-style="titleStyle">
				<view class="content-wrap">
					<scroll-view class="listview" style="flex: 1;" enableBackToTop="true" :scroll-y="!locked">
						<goods-list :activeIndex="3" />
					</scroll-view>
				</view>
			</y-tab>
		</y-tabs>
	</view>
</template>
<script>
	import { guid } from '@/uni_modules/uv-ui-tools/libs/function/index.js';
	import goodsList from '@/components/goods-list';
	export default {
		components: {
			goodsList
		},
		data() {
			return {
				activeIndex: 0,
				list: [], // 瀑布流全部数据
				list1: [], // 瀑布流第一列数据
				list2: [], // 瀑布流第二列数据
				leftGap: 10,
				rightGap: 10,
				columnGap: 10,
				status: 'more',
				titleStyle: {
					fontSize: '34rpx',
					padding: '0 16rpx'
				},
				triggered: false, //设置当前下拉刷新状态，true 表示下拉刷新已经被触发，false 表示下拉刷新未被触发
				locked: false //内容区域左右滑动时是否锁住scroll-view的上下滑动
			}
		},
		computed: {
			imageStyle(item, tag) {
				return item => {
					const v = uni.upx2px(750) - this.leftGap - this.rightGap - this.columnGap;
					const w = v / 2;
					const rate = w / item.w;
					const h = rate * item.h;
					return {
						width: w + 'px',
						height: (tag == 1 ? h + 20 : h) + 'px'
					}
				}
			}
		},
		onLoad() {
			this.onRefresh()
		},
		methods: {
			// 自定义下拉刷新被触发
			async onRefresh() {
				if (this.triggered) return;
				this.triggered = true;
				const { data } = await this.getData();
				this.list = data;
				setTimeout(() => (this.triggered = false), 1000)
			},
			// 自定义下拉刷新被复位
			onRestore() {
				this.triggered = false; // 需要重置
			},
			// 上拉加载更多
			async loadMore() {
				console.log(this.status);
				if (this.status == 'more') {
					this.status = 'loading';
					const { data } = await this.getData();
					this.list.push.apply(this.list, data);
					this.status = 'more';
				}
			},
			// 内容滑动中触发
			slideChange() {
				this.locked = true
			},
			// 内容页滑动结束时触发
			slideEnd() {
				this.locked = false
			},
			// 这点非常重要：e.name在这里返回是list1或list2，要手动将数据追加到相应列
			changeList(e) {
				this[e.name].push(e.value);
			},
			// 模拟的后端数据
			getData() {
				return new Promise((resolve) => {
					const imgs = [
						{ url: 'https://via.placeholder.com/100x110.png/3c9cff/fff', width: 100, height: 110 },
						{ url: 'https://via.placeholder.com/200x220.png/f9ae3d/fff', width: 200, height: 220 },
						{ url: 'https://via.placeholder.com/300x340.png/5ac725/fff', width: 300, height: 340 },
						{ url: 'https://via.placeholder.com/400x400.png/f56c6c/fff', width: 400, height: 400 },
						{ url: 'https://via.placeholder.com/500x510.png/909399/fff', width: 500, height: 510 },
						{ url: 'https://via.placeholder.com/600x606.png/3c9cff/fff', width: 600, height: 606 },
						{ url: 'https://via.placeholder.com/310x422.png/f1a532/fff', width: 310, height: 422 },
						{ url: 'https://via.placeholder.com/320x430.png/3c9cff/fff', width: 320, height: 430 },
						{ url: 'https://via.placeholder.com/330x424.png/f9ae3d/fff', width: 330, height: 424 },
						{ url: 'https://via.placeholder.com/340x435.png/5ac725/fff', width: 340, height: 435 },
						{ url: 'https://via.placeholder.com/350x440.png/f56c6c/fff', width: 350, height: 440 },
						{ url: 'https://via.placeholder.com/380x470.png/909399/fff', width: 380, height: 470 }
					];
					let list = [];
					const doFn = (i) => {
						const randomIndex = Math.floor(Math.random() * 10);
						return {
							id: guid(),
							allowEdit: i == 0,
							image: imgs[randomIndex].url,
							w: imgs[randomIndex].width,
							h: imgs[randomIndex].height,
							title: i % 2 == 0 ? `(${this.list.length + i + 1})体验uv-ui框架` :
								`(${this.list.length + i +1})uv-ui支持多平台`,
							desc: i % 2 == 0 ? `(${this.list.length + i + 1})欢迎使用uv-ui，uni-app生态专用的UI框架` :
								`(${this.list.length + i})开发者编写一套代码， 可发布到iOS、Android、H5、以及各种小程序`
						}
					};
					// 模拟异步
					setTimeout(() => {
						for (let i = 0; i < 20; i++) {
							list.push(doFn(i));
						}
						resolve({ data: list });
					}, 200)
				})
			}
		}
	}
</script>
<style>
	page {
		background: #f1f1f1;
	}
</style>
<style scoped lang="scss">
	$show-lines: 1;
	@import '@/uni_modules/uv-ui-tools/libs/css/variable.scss';


	.content-wrap {
		position: relative;
		/* #ifndef H5 */
		height: calc(100vh - 56px);
		/* #endif */
		/* #ifdef H5 */
		height: calc(100vh - 56px - var(--window-top) - var(--window-bottom));
		/* #endif */
		// display: flex;
		// justify-content: center;
		// align-items: center;
		// color: white;
		background-color: #fff;
	}

	.listview {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		/* #ifndef MP-ALIPAY */
		flex-direction: column;
		/* #endif */
	}

	.num-row {
		font-size: 32rpx;
		padding: 12rpx 32rpx;
	}

	::v-deep .y-tabs {

		&__wrap,
		.y-tab {
			height: 50px;

			&.is-active {
				font-weight: 600;
			}
		}
	}

	::v-deep .uv-waterfall {
		padding-top: 12rpx;
		margin-top: -10px;
	}


	.waterfall-item {
		overflow: hidden;
		margin-top: 10px;
		border-radius: 6px;
	}

	.waterfall-item__ft {
		padding: 20rpx;
		background: #fff;

		&__title {
			margin-bottom: 10rpx;
			line-height: 48rpx;
			font-weight: 700;

			.value {
				font-size: 32rpx;
				color: #303133;
			}
		}

		&__desc .value {
			font-size: 28rpx;
			color: #606266;
		}

		&__btn {
			padding: 10px 0;
		}
	}
</style>