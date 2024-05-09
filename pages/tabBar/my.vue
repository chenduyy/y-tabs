4<template>
	<view class="container">
		<!-- <button size="mini" type="primary" style="margin: 10rpx;" @click="()={}">toPage</button> -->
		<!-- <y-tabs ref="tabs" v-model="activeIndex" scroll-threshold="3" swipeable :ellipsis="false">
			<y-tab class="y-tab-virtual" v-for="(tab,index) in tabs" :key="index"
				:title="tab.title+(index==2?'哈哈哈哈哈哈哈哈哈哈哈哈哈哈':'')">
				<view class="content-wrap" :style="{backgroundColor: tab.color}"> {{tab.title}}</view>
			</y-tab>
		</y-tabs> -->


		<y-tabs ref="tabs" v-model="activeIndex" background="#f7f7f7" swipeable>
			<y-tab class="y-tab-virtual" v-for="(title,index) in tabs" :key="index" :title="title" />
		</y-tabs>

		<swiper class="swiper" :current="activeIndex" @transition="onTransition" @animationfinish="onAnimationfinish"
			@change="onChange">
			<swiper-item v-for="(item, index) in tabs" :key="index">
				<view class="content-wrap">
					<y-tabs ref="subTabs" v-model="subActiveIndex">
						<y-tab class="y-tab-virtual" v-for="(subTitle,subIndex) in subTabs" :key="subIndex"
							:title="subTitle" />
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
				// tabs: this.$getTabs(5),
				tabs: ["短剧", "小说"],
				activeIndex: 1, // 标签页当前选择项的下标
				subTabs: ['今天', '昨天', '近7天', '本月', '上月'],
				subActiveIndex: 0
			};
		},
		onLoad() {
			// this.toPage()
		},
		onShow() {
			// resize一下，避免跳转其他页面但是tabs内部未初始化完成
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
	.content-wrap {
		/* #ifndef H5 */
		min-height: calc(100vh - var(--window-top));
		/* #endif */
		/* #ifdef H5 */
		min-height: calc(100vh - 40px - var(--window-top) - var(--window-bottom));
		/* #endif */
		// display: flex;
		// justify-content: center;
		// align-items: center;
		// color: white;
		font-size: 50rpx;
		background-color: #fff;
	}
</style>