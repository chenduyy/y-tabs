<template>
	<view class="page-news">
		<!-- #ifdef APP-NVUE -->
		<list class="listview">
			<refresh :display="refreshing" @refresh="onRefresh" @pullingdown="onpullingdown"></refresh>
			<cell v-for="(item, index) in dataList" :key="item.id"><news-item :newsItem="item" @close="closeItem(index)"
					@click="goDetail(item)"></news-item></cell>
			<cell v-if="isLoading || dataList.length > 4">
				<view class="loading-more">
					<text class="loading-more-text">加载中...</text>
				</view>
			</cell>
		</list>
		<!-- #endif -->
		<!-- #ifndef APP-NVUE -->
		<!-- swiper左右滑动时，禁止scroll-view上下滚动与下拉刷新 -->
		<scroll-view class="listview" style="flex: 1;" enableBackToTop="true" :scroll-y="scrollY"
			:refresher-enabled="scrollY" :refresher-triggered="refreshing" @refresherrefresh="onRefresh"
			@refresherrestore="onRestore" @scrolltolower="loadMore()">
			<view v-for="(item, index) in dataList" :key="item.id"><news-item :newsItem="item" @close="closeItem(index)"
					@click="goDetail(item)"></news-item></view>
			<view class="loading-more" v-if="isLoading || dataList.length > 4">
				<text class="loading-more-text">加载中...</text>
			</view>
		</scroll-view>
		<!-- #endif -->
		<no-data class="no-data" v-if="isNoData" @retry="loadMore"></no-data>
	</view>
</template>

<script>
	import { friendlyDate } from '@/common/uitls.js';

	import newsItem from './news-item.vue';
	import noData from '@/components/nodata';

	export default {
		components: {
			noData,
			newsItem
		},
		inject: ["newsParent"],
		props: {
			nid: {
				type: [Number, String],
				default: ''
			},
			scrollY: Boolean
		},
		data() {
			return {
				dataList: [],
				requestParams: {
					columnId: this.nid,
					minId: 0,
					pageSize: 10,
					column: 'id,post_id,title,author_name,cover,published_at,comments_count'
				},
				pullTimer: null,
				pulling: false,
				refreshing: false, //设置当前下拉刷新状态，true 表示下拉刷新已经被触发，false 表示下拉刷新未被触发
				refreshFlag: false,
				refreshText: '',
				isLoading: false,
				loadingText: '加载中...',
				isNoData: false,
				pulling: false,
			};
		},
		created() {
			this._isWidescreen = false;
			// #ifdef H5
			var mediaQueryOb = uni.createMediaQueryObserver(this);
			mediaQueryOb.observe({
					minWidth: 768
				},
				matches => {
					this._isWidescreen = matches;
				}
			);
			// #endif

		},
		mounted() {
			this.init(); // 初始化组件引用
		},
		// #ifndef VUE3
		destroyed() {
			if (this.__isUnmounted) return;
			this.unInit();
		},
		// #endif
		// #ifdef VUE3
		unmounted() {
			this.__isUnmounted = true;
			this.unInit();
		},
		// #endif
		methods: {
			// 初始化组件引用
			init() {
				// QQ/百度/字节小程序在父组件的mounted中无法获取到ref，因此在这里处理,向父组件添加引用并加载第一个tab的数据
				if (this.newsParent) {
					this.newsParent.pageList.push(this);
					if (this.newsParent.pageList.length === 1) this.newsParent.onChange(0) //并切换到第一个tab用于加载数据
				}
			},
			// 卸载组件的处理
			unInit() {
				if (this.newsParent) {
					const index = this.newsParent.pageList.findIndex(item => item === this);
					this.newsParent.pageList.splice(index, 1);
				}
			},
			loadData(refresh) {
				if (this.isLoading) return;

				this.isLoading = true;
				this.isNoData = false;
				this.requestParams.time = new Date().getTime() + '';

				var startTime = new Date();

				uni.request({
					// url: this.$host + 'api/news',
					url: 'https://unidemo.dcloud.net.cn/api/news',
					data: this.requestParams,
					success: result => {
						var endTime = new Date();
						const data = result.data;
						this.isNoData = data.length <= 0;

						const data_list = data.map(news => {
							return {
								id: this.newGuid() + news.id,
								newsid: news.id,
								article_type: 1,
								datetime: friendlyDate(new Date(news.published_at.replace(/\-/g, '/'))
									.getTime()),
								title: news.title,
								image_url: news.cover,
								source: news.author_name,
								comment_count: news.comments_count,
								post_id: news.post_id
							};
						});

						if (refresh) {
							this.dataList = data_list;
							this.requestParams.minId = 0;
						} else {
							this.dataList = this.dataList.concat(data_list);
							this.requestParams.minId = data[data.length - 1].id;
						}

						if (this.dataList.length > 0 && this._isWidescreen && this.dataList.length <= 10) {
							this.goDetail(this.dataList[0]);
						}
					},
					fail: err => {
						if (this.dataList.length == 0) {
							this.isNoData = true;
						}
					},
					complete: e => {
						this.isLoading = false;
						if (refresh) {
							this.refreshing = false;
							this.refreshFlag = false;
							this.refreshText = '已刷新';
							if (this.pullTimer) {
								clearTimeout(this.pullTimer);
							}
							this.pullTimer = setTimeout(() => {
								this.pulling = false;
							}, 1000);
						}
					}
				});
			},
			loadMore(e) {
				this.loadData();
			},
			clear() {
				this.dataList.length = 0;
				this.requestParams.minId = 0;
			},
			goDetail(detail) {
				uni.navigateTo({
					url: '/pagesExample/news/detail?query=' + encodeURIComponent(JSON.stringify(detail))
				});
			},
			closeItem(index) {
				uni.showModal({
					content: '不感兴趣？',
					success: res => {
						if (res.confirm) {
							this.dataList.splice(index, 1);
						}
					}
				});
			},
			refreshData() {
				if (this.isLoading) {
					return;
				}
				this.pulling = true;
				this.refreshing = true;
				this.refreshText = '正在刷新...';
				this.loadData(true);
			},
			onRefresh(e) {
				this.refreshData();
				// #ifdef APP-NVUE
				this.$refs.list.resetLoadmore();
				// #endif
			},
			// 自定义下拉刷新被复位
			onRestore() {
				this.refreshing = false; // 需要重置
			},
			onpullingdown(e) {
				if (this.refreshing) {
					return;
				}

				// var angle = (e.pullingDistance) / e.viewHeight * 180;
				// if (angle > 180) {
				// 	angle = 180;
				// }
				// tab.angle = angle;

				this.pulling = false;
				if (Math.abs(e.pullingDistance) > Math.abs(e.viewHeight)) {
					this.refreshFlag = true;
					this.refreshText = '释放立即刷新';
				} else {
					this.refreshFlag = false;
					this.refreshText = '下拉可以刷新';
				}
			},
			newGuid() {
				let s4 = function() {
					return ((65536 * (1 + Math.random())) | 0).toString(16).substring(1);
				};
				return (s4() + s4() + '-' + s4() + '-4' + s4().substr(0, 3) + '-' + s4() + '-' + s4() + s4() + s4())
					.toUpperCase();
			}
		}
	};
</script>

<style scoped>
	.no-data {
		flex: 1;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
	}

	.page-news {
		flex: 1;
		flex-direction: column;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
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

	.refresh {
		justify-content: center;
	}

	.refresh-view {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		width: 750rpx;
		height: 64px;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
	}

	.refresh-icon {
		width: 32px;
		height: 32px;
		transition-duration: 0.5s;
		transition-property: transform;
		transform: rotate(0deg);
		transform-origin: 15px 15px;
	}

	.refresh-icon-active {
		transform: rotate(180deg);
	}

	.loading-icon {
		width: 28px;
		height: 28px;
		margin-right: 5px;
		color: gray;
	}

	.loading-text {
		margin-left: 2px;
		font-size: 16px;
		color: #999999;
	}

	.loading-more {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 14px;
		padding-bottom: 14px;
		text-align: center;
	}

	.loading-more-text {
		font-size: 28upx;
		color: #999;
	}
</style>