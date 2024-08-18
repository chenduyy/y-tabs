<template>
	<!-- pages.json中设置"disableScroll": true使页面整体不能上下滚动，内容页中使用scroll-view实现局部滚动 -->
	<view class="page-container">
		<y-tabs ref="tabs" v-model="activeIndex" barAnimateMode="worm-ease" color="#1989fa" title-active-color="#000"
			title-inactive-color="#555" background="#fff" @click="onClick" @change="onChange">
			<y-tab class="y-tab-virtual" v-for="(tab, index) in tabs" :title="tab.title" :key="tab.newsid">
				<!-- <newsPage class="page-item" :nid="tab.newsid" :ref="'page' + index" /> -->
			</y-tab>
		</y-tabs>
		<swiper class="swiper" :current="activeIndex" @transition="onTransition" @animationfinish="onAnimationfinish">
			<swiper-item v-for="(tab, index) in tabs" :key="tab.newsid">
				<newsPage class="page-item" :nid="tab.newsid" :ref="'page' + index" :scrollY="scrollY" />
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import newsPage from '@/pagesExample/news/news-page.vue';

	// 根据插件市场"新闻模板"示例改动：
	// 它在App端使用了nvue的原生渲染，实现高性能的左右拖动长列表；并支持可自定义的任何形式的下拉刷新。
	// 在非App端使用的模式是只缓存左右一共3列的数据，dom中的数据过多时，它会自动释放。
	// 就是说App上，只要看过这一页，再进去时内容是还在的。而在非App上，只能做到缓存3页数据，其他页即便看过，再进去也会重新加载。
	// 并且非App的这种情况下，不再提供下拉刷新。虽然插件市场也有其他前端模拟的下拉刷新，但性能不佳。
	// 一般小程序的大厂案例里，提供左右拖长列表的，都是这种做法。

	// 缓存每页最多
	const MAX_CACHE_DATA = 100;
	// 缓存页签数量
	const MAX_CACHE_PAGE = 3;

	export default {
		// shared:表示页面 wxss 样式将影响到自定义组件
		options: {
			styleIsolation: 'shared'
		},
		components: {
			newsPage
		},
		provide() {
			return {
				newsParent: this, //提供引用供后代组件使用
			}
		},
		data() {
			return {
				activeIndex: 0, // 标签页当前选择项的下标
				tabs: [{
						title: '最新',
						newsid: 0
					},
					{
						title: '大公司',
						newsid: 23
					},
					{
						title: '内容',
						newsid: 223
					},
					{
						title: '消费',
						newsid: 221
					},
					{
						title: '娱乐',
						newsid: 225
					},
					{
						title: '区块链',
						newsid: 208
					}
				],
				pageList: [],
				cacheTab: [],
				isTap: false, //是否是点击标签进行切换的
				scrollY: true, //是否开启scroll-view的上下滑动，swiper左右滑动时不开启
			};
		},
		methods: {
			// 缓存、释放tab
			handleCacheTab() {
				// 缓存 tabId (内容页列表长度超过100，则进行缓存)
				// click事件在change事件之前执行，因此点击click时，this.activeIndex为上一次记录的下标，缓存tabId是缓存上一次显示的tab内容
				if (this.pageList?.[this.activeIndex].dataList?.length > MAX_CACHE_DATA && !this.cacheTab.includes(this
						.activeIndex)) {
					this.cacheTab.push(this.activeIndex);
					// console.log("cache:", this.activeIndex);
				}

				// 释放 tabId (超过最大缓存页数，则释放,清空dataList)
				if (this.cacheTab.length > MAX_CACHE_PAGE) {
					const cacheIndexs = this.cacheTab.splice(0, 1);
					this.clearTabData(cacheIndexs[0]);
				}
			},
			loadTabData(index) {
				this.pageList[index].loadData();
			},
			clearTabData(index) {
				this.pageList[index].clear();
			},
			// 点击标签时触发
			onClick() {
				this.isTap = true;
				this.handleCacheTab(); //缓存、释放tab
			},
			// 当前激活的标签改变时触发
			onChange(index) {
				// 列表数据为空则加载数据
				if (this.pageList?.[index].dataList?.length === 0) this.loadTabData(index);

				//  由于字节跳动、飞书不支持@animationfinish，因此在change事件中unlockDx
				// #ifdef MP-TOUTIAO || MP-LARK
				this.onAnimationfinish({ detail: { current: index } })
				// #endif
			},
			//swiper-item的位置发生改变时
			onTransition(e) {
				this.scrollY = false
				// 注意：
				// swiper组件的current初始化时一定要保证是第一项的下标，否则在微信小程序中dx会异常
				// 飞书的dx变化规律难以与微信小程序统一，因此暂无法实现
				this.$refs.tabs.setDx(e?.detail?.dx);
			},
			//swiper滑动动画结束时
			onAnimationfinish(e) {
				// 滑动切换时才进行缓存、释放tab，点击标签时触发了click事件进行该操作
				if (!this.isTap) this.handleCacheTab(); //缓存、释放tab
				this.isTap = false;
				this.scrollY = true

				this.activeIndex = e.detail.current;
				setTimeout(() => this.$refs.tabs.unlockDx(), 0) //通知y-tabs解除对setDx()的锁定
			},
		}
	};
</script>
<style lang="scss" scoped>
	.page-container {

		.swiper,
		.page-item {
			/* #ifndef H5 */
			height: calc(100vh - 44px);
			/* #endif */
			/* #ifdef H5 */
			height: calc(100vh - 88px);
			/* #endif */
			position: relative;
			overflow: hidden;
			display: block;
		}
	}
</style>