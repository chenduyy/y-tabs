<template>
	<view class="comp-wrap">
		<y-tabs v-model="activeIndex" type="text" color="#333" titleActiveColor="#F56C6C" background="transparent" :ellipsis="false" animated direction="vertical" :pageScroll="false" @change="handleChange">
			<y-tab v-for="(tab, index) in tabs" :title="tab.title" :key="tab.title" />
			<!-- :imageSrc="index===activeIndex?arcImageSrc:''" -->
		</y-tabs>
	</view>
</template>

<script>
	export default {
		name: 'leftNav',
		// 微信小程序端：自定义组件需要styleIsolation: 'shared',否则无法在当前文件中修改y-tabs组件的样式
		options: {
			styleIsolation: 'shared'
		},
		data() {
			return {
				// 左侧导航相关
				arcImageSrc: `${this.$imgUrl}tea/arc.png`,
				tabs: [
					{ title: '京东超市', imageSrc: '' },
					{ title: '男装', imageSrc: '' },
					{ title: '奢侈品', imageSrc: '' },
					{ title: '女装', imageSrc: '' },
					{ title: '鞋靴', imageSrc: '' },
					{ title: '内衣饰品', imageSrc: '' },
					{ title: '箱包', imageSrc: '' },
					{ title: '美妆护肤', imageSrc: '' },
					{ title: '个护清洁', imageSrc: '' },
					{ title: '钟表珠宝', imageSrc: '' },
					{ title: '手机', imageSrc: '' },
					{ title: '数码', imageSrc: '' },
					{ title: '电脑办公', imageSrc: '' },
					{ title: '家电', imageSrc: '' },
					{ title: '生鲜', imageSrc: '' },
					{ title: '食品酒饮', imageSrc: '' },
					{ title: '母婴童装', imageSrc: '' },
					{ title: '玩具乐器', imageSrc: '' },
					{ title: '医疗保健', imageSrc: '' },
					{ title: '计生情趣', imageSrc: '' },
					{ title: '运动户外', imageSrc: '' },
					{ title: '汽摩生活', imageSrc: '' },
					{ title: '医药', imageSrc: '' },
					{ title: '家居厨具', imageSrc: '' },
				],
				activeIndex: 0, // 标签页当前选择项的下标
			}
		},
		computed: {
			// 标签栏导航区域高度
			navHeight() {
				// H5端需要减去顶部导航栏高度
				let height = 0;
				// H5端导航栏高度
				// #ifdef H5
				height = 44;
				// #endif
				return `calc(100vh - ${height}px - 6px)`
			},
			nextTitle() {
				return this.tabs[this.activeIndex + 1]?.title || ""
			},
		},
		watch: {
			nextTitle: {
				immediate: true,
				handler(value) {
					this.$emit('update:nextTitle', value)
				}
			},
		},
		methods: {
			handleChange(index, title) {
				this.$emit('change', index, title)
			},
			// 切换activeIndex
			changeActiveIndex() {
				const index = this.tabs.findIndex(o => o.title === this.nextTitle);
				if (index > -1) this.activeIndex = index;
			}
		}
	}
</script>
<style lang="scss" scoped>
</style>