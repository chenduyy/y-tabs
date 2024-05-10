4<template>
	<view class="page-container">
		<view class="title-wrap">
			多个标签页组件嵌套
			<view class="title-wrap__desc">在y-tab中可以嵌套其他的y-tabs</view>
			<view class="title-wrap__desc">开启swipeable，可以嵌套左右滑动</view>
		</view>
		<y-tabs ref="tabs" v-model="activeIndex" background="#f7f7f7" swipeable>
			<y-tab class="y-tab-virtual" v-for="(tab,index) in tabs" :key="index" :title="tab.title">
				<view class="content-wrapper">
					<y-tabs ref="subTabs" v-model="tab.activeIndex" swipeable>
						<y-tab class="y-tab-virtual" v-for="(subTitle,subIndex) in subTabs" :key="subIndex"
							:title="subTitle">
							<view class="content-sub-wrap">{{subTitle}}</view>
						</y-tab>
					</y-tabs>
				</view>
			</y-tab>
		</y-tabs>



		<view class="title-wrap">
			也可以使用swiper组件进行嵌套
			<view class="title-wrap__desc"></view>
		</view>
		<y-tabs ref="tabs" v-model="activeIndex" background="#f7f7f7" swipeable>
			<y-tab class="y-tab-virtual" v-for="(tab,index) in tabs" :key="index" :title="tab.title" />
		</y-tabs>
		<swiper class="swiper" :current="activeIndex" @transition="onTransition" @animationfinish="onAnimationfinish"
			@change="onChange">
			<swiper-item v-for="(tab,index) in tabs" :key="index" :title="tab.title">
				<view class="content-wrapper">
					<y-tabs ref="subTabs" v-model="subActiveIndex">
						<y-tab class="y-tab-virtual" v-for="(subTitle,subIndex) in subTabs" :key="subIndex"
							:title="subTitle">
							<view class="content-sub-wrap">{{subTitle}}</view>
						</y-tab>
					</y-tabs>
				</view>
			</swiper-item>
		</swiper>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: [{title:"短剧",activeIndex: 0}, {title:"小说",activeIndex: 0}],
				activeIndex: 0, // 标签页当前选择项的下标
				subTabs: ['今天', '昨天', '近7天', '本月', '上月'],
				subActiveIndex: 0
			};
		},
		onLoad() {
			// this.toPage()
		},
		onShow() {
			// 如果进入该页面又跳转了其他页面，则在onShow中resize一下组件，避免跳转其他页面但是tabs内部未初始化完成
			// this.$refs?.tabs?.resize()
			// const subTabs = this.$refs?.subTabs?.forEach(tabs=>tabs?.resize())
		},
		methods: {
			toPage() {
				uni.navigateTo({
					url: "/pagesExample/sticky"
				})
			},
			//swiper-item的位置发生改变时
			onTransition(e) {
				// 注意：
				// swiper组件的current初始化时一定要保证是第一项的下标，否则在微信小程序中dx会异常
				// 飞书的dx变化规律难以与微信小程序统一，因此暂无法实现
				this.$refs.tabs.setDx(e?.detail?.dx);
			},
			//swiper滑动动画结束时
			onAnimationfinish(e) {
				this.activeIndex = e.detail.current;
				setTimeout(() => this.$refs.tabs.unlockDx(), 0) //通知y-tabs解除对setDx()的锁定
			},
			// 当前激活的标签改变时触发
			onChange(index) {
				//  由于字节跳动、飞书不支持@animationfinish，因此在change事件中unlockDx
				// #ifdef MP-TOUTIAO || MP-LARK
				this.onAnimationfinish({ detail: { current: index } })
				// #endif
			},
		}
	};
</script>

<style lang="scss" scoped>
	.content-wrapper {
		/* #ifndef H5 */
		// min-height: calc(100vh - var(--window-top));
		/* #endif */
		/* #ifdef H5 */
		// min-height: calc(100vh - 40px - var(--window-top) - var(--window-bottom));
		/* #endif */
		// display: flex;
		// justify-content: center;
		// align-items: center;
		// color: white;
		font-size: 22rpx;
		background-color: #fff;
	}

	.content-sub-wrap {
		font-size: 28rpx;
		font-weight: 600;
		background-color: #fff;
		text-align: center;
		padding: 10vh 0;
	}
	
	.title-wrap__desc{
		margin-top: 6px;
	}

	::v-deep .swiper {
		height: 204px;
	}
</style>