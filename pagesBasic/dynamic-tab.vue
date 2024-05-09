<template>
	<view class="page-container">
		<view class="title-wrap">
			标签宽高动态变化
			<view class="title-wrap__desc">在我们切换标签时，如果选中标签设置了相关样式使标签宽高发生改变（比如说放大字体），那么需要开启is-dynamic属性</view>
			<view class="title-wrap__desc">如果不设置，可能会导致滑块错位</view>
			<view class="title-wrap__desc">如果使用了过渡（transition: all .2s），设置了也无效</view>
			<view class="title-wrap__desc">如果只需放大选中的标签字体，使用transform:scale(1.2)即可，无需设置is-dynamic</view>
		</view>

		<y-tabs ref="tabs" v-model="activeIndex" is-dynamic>
			<y-tab class="y-tab-virtual" v-for="item in tabs" :key="item.key" :title="item.title+item.title">
				<view class="content-wrap"> 内容{{item.key}} </view>
			</y-tab>
		</y-tabs>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: this.$getTabs(15),
				activeIndex: 0,
				offsetTop: 0, //粘性定位布局下与顶部的最小距离
			}
		},
		created() {
			// #ifdef H5
			this.offsetTop = 44;
			// #endif
		},
		methods: {
			handleScrollTo() {
				this.$refs.tabs.scrollTo(2)
			}
		}
	}
</script>
<style lang="scss" scoped>
	::v-deep .y-tab {
		margin-right: 20px;

		&.is-active {
			font-size: 18px !important;
			
			// 如果要放大字体，且需要过渡效果，直接设置如下样式，不要在y-tabs上设置is-dynamic属性
			.y-tab__text {
				// transform: scale(1.4);
				// transition: transform .2s;
			}

		}
	}
</style>