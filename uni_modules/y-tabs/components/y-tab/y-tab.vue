<template>
	<view class="y-tab__pane" :data-index="index" :class="[uniquePaneClass,paneClass]" :style="[paneStyle]">
		<!-- 渲染过的则不再渲染，未渲染的根据激活状态active进行渲染 -->
		<view class="y-tab__pane--wrap" v-if="rendered ? true : active">
			<slot />
		</view>
	</view>
</template>

<script>
	/**
	 * y-tab 标签
	 * @description 选项卡组件的子组件，搭配y-tabs使用
	 * @property {String | Number}	name		             标签名称，作为匹配的标识符。默认为标签的索引值
	 * @property {String}			title		             标题
	 * @property {Boolean}			disabled	             是否禁用标签，默认false
	 * @property {String}			dot	                     是否在标题右上角显示小红点（优先级高于badge）。默认false
	 * @property {String | Number}	badge	                 图标右上角徽标的内容
	 * @property {String | Number}	badge-max-count	         徽标数最大数字限制，超过这个数字将变成badgeMaxCount+，如果传空字符串则不设置。默认99
	 * @property {Object}       	title-style	             自定义标题样式
	 * @property {Boolean}			title-class	             自定义标题类名
	 * @property {String}	        icon-type	             图标图案，为uniapp扩展组件（uni-ui）下的uni-icons的type值，customPrefix用法等同
	 * @property {String | Number}	icon-size	             图标大小，默认16
	 * @property {String}			custom-prefix	         自定义图标
	 * @property {String}			image-src	             图片路径
	 * @property {String}			image-mode	             图片裁剪、缩放的模式，为uniapp内置组件->媒体组件—>image下的mode属性的可选值
	 * @property {String}			position	             在有图标或图片的情况下，标题围绕它们所在的位置，默认right。可选值：left、top、bottom
	 */

	import { isNull, toClass, getUid, deepClone } from '../js/uitls';
	import { options } from '../js/const';

	export default {
		name: 'y-tab',
		options,
		props: {
			title: String, // 标题
			disabled: Boolean, // 是否禁用标签
			dot: Boolean, // 是否在标题右上角显示小红点
			badge: {
				type: [Number, String],
				default: ''
			}, // 图标右上角徽标的内容
			// 徽标数最大数字限制,超过这个数字将变成badgeMaxCount+,如果传空字符串则不设置
			badgeMaxCount: {
				type: [Number, String],
				default: 99
			},
			name: [Number, String], // 标签名称，作为匹配的标识符
			titleStyle: Object, //	自定义标题样式
			titleClass: String, //	自定义标题类名
			iconType: String, //图标图案，为uniapp扩展组件（uni-ui）下的uni-icons的type值，customPrefix用法等同
			iconSize: {
				type: [Number, String],
				default: 16
			}, //图标大小
			customPrefix: String, //自定义图标
			imageSrc: String, //图片路径
			//图片裁剪、缩放的模式，为uniapp内置组件->媒体组件—>image下的mode值
			imageMode: {
				type: String,
				default: 'scaleToFill',
				validator(value) {
					return [
						'scaleToFill',
						'aspectFit',
						'aspectFill',
						'widthFix',
						'heightFix',
						'top',
						'bottom',
						'center',
						'left',
						'right',
						'top left',
						'top right',
						'bottom left',
						'bottom right'
					].includes(value);
				}
			},
			//如果存在图片或图标，标题围绕它们的位置
			position: {
				type: String,
				default: 'right',
				validator(value) {
					return ['top', 'bottom', 'left', 'right'].includes(value);
				}
			},
			// 是否开启标题插槽（仅针对vue3版本下的小程序端），为true则可以自定义标题（在vue3版本下，循环生成的具名动态插槽无法渲染后备内容）
			titleSlot: {
				type: Boolean,
				default: false
			},
			// 标题插槽的name值，默认为'title'+y-tab的下标（比如第一个y-tab，它的默认插槽名称就是'title0'）
			titleSlotName: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				isUnmounted: false,
				index: -1, //内容卡片对应的下标
				// parent: null, //父元素实例
				active: false, //是否为激活状态
				rendered: false, //是否渲染过
				swipeable: false, //是否开启手势滑动切换
				paneStyle: null, //内容样式
				scrollspy: false, //是否为滚动导航模式
				// paneObserver: null, //pane交叉观察器
				isDisjoint: false, //当前pane是否与参照节点布局区域相离
				isActiveLast: false // 最后一个pane在滚动导航模式下是否激活对应的标签项
			};
		},
		computed: {
			computedName() {
				return !isNull(this.name) ? this.name : this.index;
			},
			unqieKey() {
				return getUid();
			},
			// 保证唯一的样式
			uniquePaneClass() {
				return 'y-tab__pane' + this.unqieKey
			},
			// 内容class
			paneClass() {
				return toClass({ 'is-active': this.active, 'is-scrollspy': this.scrollspy });
			},
		},
		created() {
			this.parent = this.getParent();
		},
		mounted() {
			if (!this.parent) return;
			if (this.parent.childrens.indexOf(this) === -1) this.parent.childrens.push(this);
			this.parent.putTab({ ...deepClone(this.$props || {}), key: this.unqieKey });
			this.scrollspy = this.parent.scrollspy; // 是否为滚动导航
			this.rendered = !this.parent.isLazyRender || this.scrollspy; //标记是否渲染过，非懒加载与滚动导航模式下默认渲染

			// 动态watch props，避免动态添加tab时可能会先触发watch中对$props的监听执行updateTab，后触发mounted中的putTab
			this.$watch(() => this.$props, {
				deep: true,
				handler(props) {
					if (this.parent && props) this.parent.updateTab({ ...props }, this.index); // 更新tab	
				}
			})
		},
		// #ifndef VUE3
		destroyed() {
			if (this.isUnmounted) return;
			this.unInit();
		},
		// #endif
		// #ifdef VUE3
		unmounted() {
			this.isUnmounted = true;
			this.unInit();
		},
		// #endif
		methods: {
			// 获取查询节点信息的对象
			getSelectorQuery() {
				let query = null;
				// #ifdef MP-ALIPAY
				query = uni.createSelectorQuery();
				// #endif
				// #ifndef MP-ALIPAY
				query = uni.createSelectorQuery().in(this);
				// #endif
				return query;
			},
			// 获取元素位置信息
			getRect(selector) {
				return new Promise((resolve, reject) => {
					selector = `.${this.uniquePaneClass}` + (!isNull(selector) ? " " + selector : '')
					this.getSelectorQuery()
						.select(selector)
						.boundingClientRect()
						.exec(rect => {
							resolve(rect[0] || {});
						});
				});
			},
			// 卸载组件的处理
			unInit() {
				this.disconnectObserver(); //销毁观察器
				if (this.parent) {
					const index = this.parent.childrens.findIndex(item => item === this);
					this.parent.childrens.splice(index, 1);
					this.parent.tabs.splice(index, 1);
					this.parent.tabRects.splice(index, 1);
				}
			},
			//获取父元素实例
			getParent(name = 'y-tabs') {
				let parent = this.$parent;
				let parentName = parent.$options.name;
				while (parentName !== name) {
					parent = parent.$parent;
					if (!parent) return false;
					parentName = parent.$options.name;
				}

				return parent;
			},
			// 断掉观察，释放资源
			disconnectObserver() {
				this.paneObserver && this.paneObserver?.disconnect();
			},
			// 观察 - 标签内容滚动时定位标签项
			async observePane(top) {
				this.disconnectObserver();
				const paneObserver = uni.createIntersectionObserver(this, { thresholds: [0, 0.01, 0.99, 1] });


				// 注意：如果y-tabs使用的区域滚动，整个页面的布局跟随页面滚动，当pane跟随页面移动了之后，
				//      那么y-tabs__content的top就会变化，导致交互区域位置不准确，可以在onPageScroll使用定时器实现滚动结束的处理重新resize一下组件创建pane的监听
				// 如果pane内容超过页面的可视区域，最好舍弃这种交互布局，uniapp未实现Android的嵌套滑动机制，页面滑动到底后无法将事件分发给scroll-view，使scroll-view继承滑动

				paneObserver.relativeToViewport({ top: -top }); // 到屏幕顶部的高度时触发
				// 不能观察根节点 unk-vendors.js:14596 [system] Node .y-tab__pane9 is not found. Intersection observer will not trigger.
				paneObserver.observe(`.${this.uniquePaneClass} .y-tab__pane--wrap`, res => {
					// console.log('res:', this.title, res);
					if (!this.isActiveLast) {
						// 如果目标节点布局区域的top小于参照节点的top,则说明目标节点在参照节点布局区域之上，intersectionRatio不大于0则说明两者不相交
						this.isDisjoint = res.intersectionRatio <= 0 && res.boundingClientRect.top <
							res
							.relativeRect.top;
					} else {
						// 滚动导航模式下，最后一个pane完全显示但未超出参照范围顶部时，是否设置相离而激活最后一个标签项
						this.isDisjoint = res.intersectionRatio > 0 && res.boundingClientRect.bottom <=
							res
							.relativeRect.bottom;
					}

					// 保证组件初始化完成时执行，避免创建时触发一次监听器的回调函数，导致执行顺序先于tabs的init方法，使底部条错位:
					// 标签栏点击时触发的滚动不允许设置激活下标
					if (this.parent.isLoaded && !this.parent.lockedScrollspy) this.parent
						.setActivedIndexToScroll();
				});
				this.paneObserver = paneObserver;
			},
		}
	};
</script>

<style lang="scss" scoped>
	@import '../css/index.scss';
</style>