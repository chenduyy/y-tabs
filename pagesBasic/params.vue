<template>
	<view class="page-container">
		<view class="title-wrap">
			<p>如果在小程序中存在案例显示有问题的话，请单独复制某个示例进行测试。</p>
		</view>

		<view class="title-wrap">
			基础用法:
		</view>
		<y-tabs v-model="activeIndex">
			<y-tab class="y-tab-virtual" v-for="tab in tabs" :key="tab.key" :title="tab.title">
				<view class="content-wrap"> 内容{{tab.key}} </view>
			</y-tab>
		</y-tabs>


		<view class="title-wrap">
			通过名称匹配
			<view class="title-wrap__desc">
				在标签指定 name 属性的情况下，v-model 的值为当前标签的 name（此时无法通过索引值来匹配标签）。
			</view>
		</view>
		<y-tabs v-model="activeIndex2">
			<y-tab class="y-tab-virtual" v-for="tab in tabs" :key="tab.key" :title="tab.title" :name="'tab'+tab.key">
				<view class="content-wrap"> 内容{{tab.key}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			样式风格
			<view class="title-wrap__desc">
				默认为line，可选：text、card、button、line-button
			</view>
		</view>
		<y-tabs ref="styleTabs" :type="styleType" v-model="activeIndex3" barWidth="20" color="#ee0a24">
			<y-tab class="y-tab-virtual" v-for="tab in tabs" :key="tab.key" :title="tab.title">
				<view class="content-wrap"> 内容{{tab.key}} </view>
			</y-tab>
		</y-tabs>
		<radio-group class="uni-list" @change="styleChange">
			<view v-for="(item, index) in styles" :key="index" class="uni-list-item">
				<view class="uni-list-item__container">
					<view class="uni-list-item__content">
						<text class="uni-list-item__content-title">{{ item.text }}</text>
					</view>
					<view class="uni-list-item__extra">
						<radio :value="item.value" :checked="item.checked" />
					</view>
				</view>
			</view>
		</radio-group>

		<view class="title-wrap">
			标签栏滚动
			<view class="title-wrap__desc">
				标签数量超过滚动阈值（swipeThreshold）且总宽度超过标签栏宽度时，标签栏可以在水平方向上滚动，切换时会自动将当前标签居中(scrollToCenter="false"可取消居中)</view>
		</view>
		<y-tabs v-model="activeIndex4">
			<y-tab class="y-tab-virtual" v-for="tab in scrollTabs" :key="tab.key" :title="tab.title">
				<view class="content-wrap"> 内容{{tab.key}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			标签标题文字超出省略
			<view class="title-wrap__desc">
				标签数量未超过滚动阈值（swipeThreshold）,但是标签总宽度大于标签栏宽度时,标题文字会自动超出省略
			</view>
		</view>
		<y-tabs v-model="activeIndex5">
			<y-tab class="y-tab-virtual" v-for="(tab,index) in  tabs" :key="tab.key"
				:title="(index>1?'标题':'超长的文本标签')+tab.key">
				<view class="content-wrap">内容{{tab.key}}</view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			收缩布局
			<view class="title-wrap__desc">通过 shrink 属性可以开启收缩布局，开启后，所有的标签会向左侧收缩对齐。</view>
		</view>
		<y-tabs v-model="activeIndex6" shrink>
			<y-tab class="y-tab-virtual" v-for="tab in tabs" :key="tab.key" :title="tab.title">
				<view class="content-wrap"> 内容{{tab.key}} </view>
			</y-tab>
		</y-tabs>

		<view class="title-wrap">
			切换动画
			<view class="title-wrap__desc">通过animated开启切换标签内容时的转场动画,默认开启，动画时长通过duration设置</view>
		</view>
		<y-tabs v-model="activeIndex7">
			<y-tab class="y-tab-virtual" v-for="tab in tabs" :key="tab.key" :title="tab.title">
				<view class="content-wrap"> 内容{{tab.key}} </view>
			</y-tab>
		</y-tabs>


		<view class="title-wrap">
			标题图标（iconType）、图片（image）；右上角小红点（dot）、徽标（badge）
		</view>
		<button size="mini" type="primary" style="margin: 0 0 10rpx 30rpx;" @click="updateBadge">更新徽标</button>
		<y-tabs v-model="activeIndex8" ref="badgeTabs">
			<y-tab class="y-tab-virtual" title="标签1" dot>
				<view class="content-wrap"> 右上角小红点</view>
			</y-tab>
			<y-tab class="y-tab-virtual" title="标签2" :badge="badgeValue">
				<view class="content-wrap"> 右上角徽标</view>
			</y-tab>
			<y-tab class="y-tab-virtual" title="标签3" iconType="info">
				<view class="content-wrap"> 图标 </view>
			</y-tab>
			<y-tab class="y-tab-virtual" title="标签4" :imageSrc="imgUrl" position="right">
				<view class="content-wrap"> 图片 </view>
			</y-tab>
		</y-tabs>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: this.$getTabs(),
				scrollTabs: this.$getTabs(15),
				activeIndex: 0,
				activeIndex2: "tab3",
				activeIndex3: 0,
				activeIndex4: 10,
				activeIndex5: 0,
				activeIndex6: 0,
				activeIndex7: 0,
				activeIndex8: 0,
				styleType: 'line',
				badgeValue: 7,
				styles: [{
						value: 'line',
						text: '线条',
						checked: true
					},
					{
						value: 'text',
						text: '文字'
					},
					{
						value: 'card',
						text: '卡片'
					},
					{
						value: 'button',
						text: '面性按钮'
					},
					{
						value: 'line-button',
						text: '线性按钮'
					}
				],
				imgUrl: `${this.$imgUrl}tea/hot.png`,
			}
		},
		methods: {
			// 更新徽标
			updateBadge() {
				this.badgeValue = Math.floor(Math.random() * 10) + 5;
			},
			styleChange(e) {
				if (this.styleType !== e.detail.value) {
					this.styleType = e.detail.value
					this.activeIndex13 = 0
					this.$nextTick(() => this.$refs.styleTabs.reset())
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	.page-container {

		.swiper-item-view {
			background-color: #007AFF;
			height: 300rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: white;
			font-size: 50rpx;
		}


		.uni-list {
			flex: 1;
			margin-top: 15px;
		}

		.uni-list-item {
			display: flex;
			flex: 1;
			flex-direction: row;
			background-color: #FFFFFF;
		}


		.uni-list-item__container {
			padding: 12px 15px;
			width: 100%;
			flex: 1;
			position: relative;
			display: flex;
			box-sizing: border-box;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			border-bottom-style: solid;
			border-bottom-width: 1px;
			border-bottom-color: #eee;
		}

		.uni-list-item__content-title {
			font-size: 14px;
		}
	}
</style>