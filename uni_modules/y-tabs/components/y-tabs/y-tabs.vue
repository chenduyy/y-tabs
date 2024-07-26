<template>
	<view class="y-tabs" :class="[uniqueTabsClass,tabsClass]">
		<view class="y-tabs__depend--offset" :style="[dependOffsetStyle]" />
		<!-- 依赖元素，用于处理滚动吸顶所需 -->
		<view class="y-tabs__depend" :style="[dependStyle]" />
		<!-- 依赖元素,用于模拟透明标签栏渐变所需 -->
		<view v-if="transparent" class="y-tabs__depend--transparent" :style="[dependTranStyle]" />

		<!-- 标签栏区域 -->
		<!-- touchmove.prevent阻止触摸移动事件 -->
		<view class="y-tabs__wrap" :style="[innerWrapStyle, wrapStyle]" :class="[wrapClass]">
			<!-- 标签栏左侧插槽 -->
			<view class="y-tabs__nav-left">
				<slot name="nav-left" />
			</view>

			<!-- 标签栏 -->
			<scroll-view class="y-tabs__scroll" :scroll-x="scrollX" :scroll-y="scrollY"
				:scroll-with-animation="scrollWithAnimation" scroll-anchoring enable-flex :scroll-left="scrollLeft"
				:scroll-top="scrollTop" :style="[scrollStyle]" @scroll="handleScrollByNav" @touchmove.stop="() => {}">
				<view class="y-tabs__nav" :class="[navClass]" :style="[navStyle]">
					<!-- 标签项 -->
					<view class="y-tab" v-for="(tab, index) in tabs" :key="tab.key" @tap.stop="onClick(index)"
						:class="[tabClass(index, tab), tab.titleClass]" :style="[tabStyle(index), tab.titleStyle]">
						<!-- 标题 -->
						<view class="y-tab__title" :class="[titleClass(tab)]">
							<!-- 图标或图片 -->
							<view class="y-tab__icons" v-if="tab.iconType || tab.imageSrc">
								<uni-icons v-if="tab.iconType" :custom-prefix="tab.customPrefix" :type="tab.iconType"
									:size="Number(tab.iconSize)" />
								<image class="y-tab__image" v-if="tab.imageSrc" :mode="tab.imageMode"
									:src="tab.imageSrc" />
							</view>
							<!-- 标签文本 -->
							<view class="y-tab__text" :class="[textClass(tab)]">

								<!--快应用联盟不支持动态的具名插槽 -->
								<!-- #ifdef QUICKAPP-WEBVIEW-UNION -->
								{{ tab.title }}
								<!-- #endif -->


								<!-- 非快应用联盟：app、h5、小程序端 -->
								<!-- #ifndef QUICKAPP-WEBVIEW-UNION -->

								<!-- vue2：支持循环生成的具名插槽渲染后备内容 -->
								<!-- #ifndef VUE3 -->
								<slot :name="tab.titleSlotName">{{ tab.title }}</slot>
								<!-- #endif -->

								<!-- vue3： 仅app、h5支持循环生成的具名插槽渲染后备内容，小程序端需通过titleSlot属性处理-->
								<!-- #ifdef VUE3 -->

								<!-- #ifdef APP-PLUS || H5 -->
								<slot :name="tab.titleSlotName">{{ tab.title }}</slot>
								<!-- #endif -->

								<!-- 小程序端：如果用户开启了titleSlot属性，表示自定义标题，否则直接显示传入的title值 -->
								<!-- #ifndef APP-PLUS || H5 -->
								<template v-if="tab.titleSlot">
									<slot :name="tab.titleSlotName"  />
								</template>
								<template v-else> {{ tab.title }}</template>
								<!-- #endif -->

								<!-- #endif -->

								<!-- #endif -->


							</view>
						</view>
						<!-- 标签右上角信息 -->
						<view class="y-tab__info" v-if="tab.dot || tab.badge">
							<!-- 提示小红点 -->
							<text class="y-tab__info--dot" v-if="tab.dot" />
							<!-- 徽标 -->
							<text class="y-tab__info--badge" v-if="tab.badge">{{formatBadge(tab) }}</text>
						</view>
					</view>
					<!-- 滑块: 仅支持line、button、line-button ，可使用插槽自定义-->
					<view v-if="isSlideBlock" class="y-tabs__bar" :class="[barClass]"
						:style="[barAnimatedStyle,barInnerStyle,barStyle]">
						<slot name="bar" />
					</view>
				</view>
			</scroll-view>

			<!-- 标签栏右侧插槽 -->
			<view class="y-tabs__nav-right">
				<slot name="nav-right" />
			</view>
		</view>

		<!-- 标签栏占位容器 -->
		<view class="y-tabs__placeholder" :style="[placeholderStyle]" />

		<!-- 标签内容 -->
		<view class="y-tabs__content" :class="[contentClass]" @touchstart="touchStart"
			@touchmove="touchMove" @touchend="touchEnd">
			<view class="y-tabs__track" :class="[{ 'is-scrollspy': scrollspy }]" :style="[trackStyle]">
				<!-- 滚动导航与侧边栏导航的内容区域：使用scroll-view实现区域滚动，否则就是页面级滚动 -->
				<scroll-view v-if="scrollspy && !pageScroll" class="y-tabs__content-scrollview" scroll-y
					:scroll-with-animation="scrollWithAnimation" :scroll-top="paneScrollTop" scroll-anchoring
					enable-flex>
					<slot />
				</scroll-view>
				<slot v-else></slot>
			</view>
		</view>
	</view>
</template>
<script>
	/**
	 * y-tabs 标签页
	 * @description 选项卡组件，用于在不同的内容区域之间进行切换，搭配y-tab使用
	 * @property {String | Number}	v-model		             绑定当前选中标签的标识符
	 * @property {String}			type		             样式风格类型。默认值为line，可选值为 text、card、button、line-button
	 * @property {String}			color	                 标签主题色。默认值为#0022AB
	 * @property {String}			background	             标签栏背景色。默认值为#fff
	 * @property {String}			title-active-color	     标题选中态颜色
	 * @property {String}			title-inactive-color	 标题默认态颜色
	 * @property {Object}			wrap-style	             标签栏样式
	 * @property {String}			direction	             标签栏的展示方位。默认值为horizontal，可选值：vertical
	 * @property {String | Number}	duration	             动画时间，单位秒。默认值为0.3。仅支持type为line、button、line-button的滑块移动的动画时间，标签内容切换时的转场动画时间、页面级滚动导航的内容定位动画时间。
	 * @property {Boolean}			shrink	                 通过 shrink 属性可以开启收缩布局，开启后，所有的标签会向左侧收缩对齐
	 * @property {String | Number}	bar-width	             滑块宽度， 仅支持type为line、button、line-button。可使用rpx、vh、vw等单位，以及calc()函数与'auto'值，默认px。type为line，标签栏水平、垂直时宽度分别为20px、3px，其余为选中标签宽度；为auto时，代表滑块宽度自适应于选中标签宽度（仅在type='line'且bar-animate-mode='linear'、direction='horizontal'下生效）
	 * @property {String | Number}	bar-height	             滑块高度，支持度同bar-width。type为line，标签栏水平、垂直时宽度分别为3px、20px，其余为选中标签高度；为auto时，代表滑块高度自适应于选中标签高度（仅在type='line'、bar-animate-mode='linear'、direction='vertical'下生效）
	 * @property {Object}			bar-style	             滑块样式，支持度同bar-width。
	 * @property {String}			bar-animate-mode	     滑动切换tab内容时滑块的动画模式，默认为linear，仅在 type='line'、direction='horizontal' 时有效。。可选值：worm(毛毛虫蠕动)、worm-ease(毛毛虫缓动效果)、none(不设置)。
	 * @property {Boolean}			is-dynamic	             标签切换后宽高是否有变化，默认false。当选中标签会放大文字、减少内间距时，开启该属性可避免滑块错位。
	 * @property {Boolean}			ellipsis	             是否省略过长的标题文字，默认为true。标签栏水平展示时，如果标签数量未超过滚动阈值则生效，垂直则不限制。
	 * @property {String | Number}	scroll-threshold	     滚动阈值，标签数量超过阈值且总宽度超过标签栏宽度时开始横向滚动。默认5
	 * @property {Boolean}			scroll-to-center	     标签栏滚动时当前标签居中，默认true
	 * @property {Boolean}			is-lazy-render	         是否开启延迟渲染（首次切换到标签时才触发内容渲染），默认false
	 * @property {Boolean}			animated	             是否开启动画，默认true。用于开启标签栏滚动的过渡动画、切换标签内容时的转场动画、滚动导航下的内容定位动画
	 * @property {Boolean}			active-last	             在滚动导航模式下，滚动到最后一个标签内容但其顶部未超过可视区域时，是否激活对应的标签项，默认false
	 * @property {Function}			before-change	         切换标签前的回调函数，返回 false 可阻止切换，支持返回 Promise。(name) => boolean | Promise
	 * @property {Boolean}			swipeable	             是否开启手势滑动切换，默认false
	 * @property {Boolean}			swipe-animated	         是否开启标签内容滑动时的拖动动画，默认true。swipeable为true、且is-lazy-render为false时有效
	 * @property {String | Number}	swipe-threshold	         滑动切换的滑动距离阈值，默认120，单位为px。表示开启手势滑动时，横向滑动多少px切换标签内容（快速滑动时不受限制）
	 * @property {Boolean}			sticky	                 是否使用粘性布局进行滚动吸顶，默认false
	 * @property {String | Number}	offset-top	             粘性布局下标签栏与顶部的最小距离，单位为 px，默认0
	 * @property {String | Number}	z-index	                 粘性布局下，标签栏的z-index值，默认99
	 * @property {String | Number}	sticky-threshold	     粘性布局吸顶的判断阈值，默认为0。表示在页面滚动时,标签栏距屏幕顶部多少px时会触发吸顶函数进行吸顶判断
	 * @property {Boolean}			transparent	             页面滚动过程中,标题栏背景色是否透明渐变，默认false
	 * @property {String | Number}	transparent-offset	     标题栏背景色透明渐变的滚动距离，默认150。请保证标签内容的高度大于该值
	 * @property {String}			scrollspy	             是否开启滚动导航；该模式下，内容将会平铺展示。默认false
	 * @property {String}			page-scroll	             滚动导航模式下，内容区域是否跟随页面滚动，默认true。为false时，内容区域是放在scroll-view中实现的局部滚动
	 * @event {Function} click 点击标签时触发。返回值：name：标识符，title：标题
	 * @event {Function} change 当前激活的标签改变时触发。返回值：name：标识符，title：标题
	 * @event {Function} disabled 点击被禁用的标签时触发。返回值：name：标识符，title：标题
	 * @event {Function} rendered 标签内容首次渲染时触发（仅在开启延迟渲染后触发）。返回值：name：标识符，title：标题
	 * @event {Function} sticky-change 吸顶时触发，仅在 sticky 模式下生效。返回值：{ isFixed: 是否吸顶 }
	 * @event {Function} loaded 组件内部初始化完成后调用
	 * @event {Function} slide-change 内容页滑动时触发（仅barAnimateMode为linear、worm、worm-ease时有效）。返回值：{ dx：滑动距离； rate：当前滑动长度占滑动区域的比例；targetIndex：目标下标；}
	 * @event {Function} slide-end 内容页滑动结束时触发（仅barAnimateMode为linear、worm、worm-ease时有效）。返回值：{ targetIndex: 目标下标 }
	 * @example <y-tabs v-model="activeIndex"><y-tab class="y-tab-virtual" v-for="item in tabs" :key="item.key" :title="item.title" /></y-tabs>
	 */

	import {
		isNull,
		addUnit,
		isDef,
		isObject,
		callInterceptor,
		getColor,
		toClass,
		getUid,
		progress,
		noop
	} from '../js/uitls';
	import { options, emits, props } from '../js/const';
	import { touchMixin } from '../js/touchMixin';

	export default {
		name: 'y-tabs',
		options,
		emits,
		props,
		mixins: [touchMixin()],
		data() {
			return {
				isUnmounted: false, //标记组件是否卸载
				isLoaded: false, //标记组件内部是否已经初始化完成
				// initTimer: null,
				currentIndex: null, //当前选中下标
				lastIndex: null, //上一个选中的下标
				// childrens: [], // 存放子组件数组
				tabs: [], //存放标签栏数据
				tabRects: [], //存放标签节点信息等数据
				reseted: true, //组件是否重置完成
				shouldSetDx: true, //是否可以执行setDx函数

				// 元素节点信息
				wrapRect: {}, //标签栏
				contentRect: {}, // 标签内容容器
				barRect: {}, //滑块
				dependOffsetRect: {}, //标签栏吸顶设置offset时的模拟元素
				extraWidth: 0, //标签栏nav-left、nav-right插槽宽度
				extraHeight: 0, //标签栏nav-left、nav-right插槽高度

				// 标签栏的scroll-view相关
				scrollLeft: 0, //设置横向滚动条位置
				scrollTop: 0, //设置竖向滚动条位置
				scrollViewRect: 0, //标签栏scroll-view的节点信息
				scrollDetail: { scrollLeft: 0, scrollTop: 0 }, //标签栏scroll-view滚动时的详情信息

				// 标签栏滑块动画相关
				barOffset: 0, //滑块偏移量：水平展示为left值，垂直为top值
				barAnimated: false, //是否开启滑块切换动画（首次不开启）
				barCalcedWidth: undefined,
				barCalcedHeight: undefined,
				disabledSetLine: false, //是否允许标签切换时设置滑块位置
				firstSetLine: true, //是否首次设置滑块，是则透明度为0，避免translate3d设置时会有一瞬间的闪动

				// 内容区域相关
				paneScrollTop: 0, //设置内容区域scroll-view的竖向滚动条位置
				trackStyle: null, //内容区域滑动轨道样式
				lockedScrollspy: false, //锁定滚动导航模式下点击标签栏触发的pane交互观察器的回调执行

				// 标签栏吸顶相关
				// dependObserver: null,
				isFixed: false, //是否吸顶

				// 标签栏渐变相关
				// tranObserver: null,
				transparentBgColor: 'rgba(255,255,255,0)', //标签栏透明背景色
				rgba: {
					R: '',
					G: '',
					B: '',
					A: '',
				}
			};
		},
		computed: {
			// 传入的实际值
			// #ifndef VUE3
			realValue() {
				return this.value;
			},
			// #endif
			// #ifdef VUE3
			realValue() {
				return this.modelValue;
			},
			// #endif
			// 标签栏是否垂直展示
			isVertical() {
				return this.direction === 'vertical';
			},
			// 标签栏垂直展示时允许垂直滚动
			scrollY() {
				return this.isVertical;
			},
			// 标签栏是否允许横向滚动
			scrollX() {
				return !this.isVertical && this.tabs.length > Number(this.scrollThreshold);
			},
			// 是否省略过长的标题文字
			isEllipsis() {
				// 标签水平展示时，如果ellipsis为true，且标签数量大于阈值，则超出隐藏
				// 标签垂直展示时,ellipsis为true则超出隐藏
				return (!this.scrollX || this.isVertical) && this.ellipsis;
			},
			// 是否为滚动导航
			scrollNav() {
				return this.scrollspy && !this.isVertical;
			},
			// 是否为侧边栏导航
			sidebarNav() {
				return this.scrollspy && this.isVertical;
			},
			// 样式风格为滑块
			isLine() {
				return this.type === 'line';
			},
			// 样式风格为胶囊，type为button、line-button
			isPills() {
				return ['button', 'line-button'].includes(this.type);
			},
			// 用于滑块切换的样式风格，仅支持type为line、button、line-button
			isSlideBlock() {
				return this.isLine || this.isPills;
			},
			// 滑块切换模式为线性运动
			isLineMode() {
				return this.isLine && this.barAnimateMode === "linear"
			},
			// 滑块切换模式为毛毛虫运动
			isWormMode() {
				return this.isLine && this.barAnimateMode.indexOf("worm") >= 0
			},
			// 当前激活标签的name值
			currentName() {
				if (isNull(this.currentIndex)) return ""
				const { name, index } = this.tabs[this.currentIndex] || {};
				return !isNull(name) ? name : index;
			},
			// 标签数量
			dataLen() {
				return this.tabs.length;
			},
			// 滑动动画时长(ms)
			msDuration() {
				return this.animated ? Number(this.duration) * 1000 : 0;
			},
			// 在设置滚动条位置时使用动画过渡
			// （scroll-view的过渡动画时长为300ms，不能设置，因此为300ms时使用scroll-view自身的过渡，否则模拟一组数据实现过渡,setInterval时间不准确，暂时不做）
			scrollWithAnimation() {
				return this.animated && this.reseted;
			},
			// 保证标签页唯一的样式
			uniqueTabsClass() {
				return 'y-tabs' + getUid()
			},
			// 标签页class
			tabsClass() {
				return toClass({
						'is-fixed': this.isFixed,
						'is-vertical': this.isVertical, //标签栏是否垂直
						'is-scrollNav': this.scrollNav, //滚动导航
						'is-sidebarNav': this.sidebarNav, //侧边栏导航
						'is-areaScroll': !this.pageScroll, //pane是否为区域滚动
					},
					`y-tabs--${this.type}`);
			},
			// 标签栏容器class
			wrapClass() {
				return toClass({
						'is-fixed': this.isFixed,
						'is-transparent': this.transparent,
						'is-vertical': this.isVertical
					},
					`is-${this.type}`,
				);
			},
			// 标签栏class
			navClass() {
				return toClass({ 'is-vertical': this.isVertical, 'is-shrink': this.shrink }, `is-${this.type}`);
			},
			// 滑块class
			barClass() {
				return toClass({ 'is-vertical': this.isVertical }, `is-${this.type}`);
			},
			// 内容卡片class
			contentClass() {
				return toClass({ 'is-scrollspy': this.scrollspy, 'is-vertical': this.isVertical });
			},
			// 标签栏容器样式
			innerWrapStyle() {
				const style = {};
				// 透明标签栏使用transparentBgColor
				const background = !this.transparent ? this.background : this.transparentBgColor;
				if (!isNull(background)) style.background = background
				// 滚动吸顶
				if (this.isFixed) {
					style.top = this.offsetTop + 'px';
					if (!isNull(this.zIndex)) style.zIndex = this.zIndex;
				}
				return style;
			},
			// 标签栏样式
			navStyle() {
				const style = {};
				// 卡片样式添加边框颜色
				if (this.type === 'card') style.borderColor = this.color;
				return style;
			},
			// 标签栏吸顶的依赖元素样式
			dependStyle() {
				// stickyThreshold：是一个边界值，用于设置标签栏滚动到距屏幕顶部多少px时，触发吸顶函数进行吸顶判断
				return { top: `-${Number(this.stickyThreshold)}px` };
			},
			// 模拟标签栏吸顶时设置offset的样式
			dependOffsetStyle() {
				return { top: `${this.offsetTop}px` };
			},
			dependTranStyle() {
				return { height: `${Number(this.transparentOffset)}px` };
			},
			// 标签栏占位元素样式
			placeholderStyle() {
				if (!this.isFixed) return {}
				if (!this.isVertical) return { height: this.scrollViewRect?.height + 'px' }; //标签栏水平展示时设置占位元素高度
				else return { width: this.scrollViewRect?.width + 'px' }; //标签栏垂直展示时设置占位元素宽度
			},
			// 滑块透明度
			lineOpacity() {
				// 首次设置滑块无动画时将透明度设为0
				return !this.isSlideBlock || this.currentIndex === null || this.firstSetLine ? 0 : 1
			},
			// 滑块容器动画样式
			barAnimatedStyle() {
				const x = !this.isVertical ? `${this.barOffset}px` : 0;
				const y = !this.isVertical ? 0 : `${this.barOffset}px`;
				const style = {
					opacity: this.lineOpacity,
					transform: `translate3d(${x},${y},0)`,
					transition: this.barAnimated ? `all ${this.duration}s linear` : 'none',
				}
				// 标签垂直时，胶囊风格或line风格高度自适应: 设置高度等于当前选中标签的高度
				if ((this.isPills || this.autoLineBarHeight) && this.isVertical) style.height = addUnit(this
					.barCalcedHeight);
				return style
			},
			// line风格的底部条宽度自适应选中标签宽度，仅对barAnimateMode为linear生效
			autoLineBarWidth() {
				return this.isLine && this.barAnimateMode === "linear" && this.barWidth === "auto"
			},
			// line风格的底部条高度自适应选中标签高度，仅对barAnimateMode为linear生效
			autoLineBarHeight() {
				return this.isLine && this.barAnimateMode === "linear" && this.barHeight === "auto"
			},
			// 滑块内容样式
			barInnerStyle() {
				const style = {};
				// 水平和垂直的处理
				style.transition = this.barAnimated ? `all ${this.duration}s linear` : 'none';
				const width = !isNull(this.barCalcedWidth) ? addUnit(this.barCalcedWidth) : null;
				const height = !isNull(this.barCalcedHeight) ? addUnit(this.barCalcedHeight) : null;
				if (width) style.width = width;
				if (height) style.height = height;

				// line:标签水平展示时,外边框圆角等于高度;垂直展示,外边框圆角等于宽度;
				// button、line-button,外边框圆角等于高度;
				switch (this.type) {
					case 'line':
						if (this.color) style.backgroundColor = this.color;
						if (this.isVertical && width) style.borderRadius = width;
						if (!this.isVertical && height) style.borderRadius = height;
						break;
					case 'button':
						if (this.color) style.backgroundColor = this.color;
						if (height) style.borderRadius = height;
						break;
					case 'line-button':
						if (this.color) style.borderColor = this.color;
						if (height) style.borderRadius = height;
						break;
				}
				return style;
			},
			// 标签栏scroll-view样式
			scrollStyle() {
				// 标签水平展示,计算width,只需减去扩展插槽宽度
				if (!this.isVertical) return { width: `calc(100% - ${this.extraWidth}px)` }
				// 标签垂直展示,计算height,只需减去扩展插槽高度
				return { height: `calc(100% - ${this.extraHeight}px)` }
			},
			// 标签水平展示时到中心点的宽度
			tabCenterWidth() {
				// 首次获取scrollViewRect时，宽度不正确（没有剔除扩展插槽，可能是由于渲染机制的问题）
				// 因此这里作个比较,如果viewW小于wrapW，则使用viewW，否则wrapW-extraWidth
				// 注意：不要给yui-tabs__scroll设置margin、padding，并设定插槽
				const wrapW = this.wrapRect?.width;
				const viewW = this.scrollViewRect?.width;
				const width = viewW < wrapW ? viewW : wrapW - this.extraWidth;
				return width / 2;
			},
			// 标签垂直展示时到中心点的高度
			tabCenterHeight() {
				const wrapH = this.wrapRect?.height;
				const viewH = this.scrollViewRect?.height;
				const height = viewH < wrapH ? viewH : wrapH - this.extraHeight;
				return height / 2;
			},
			// 内容宽度
			contentWidth() {
				// 在快手小程序中不知道为什么会获取错误，这里使用标签栏宽度处理
				let width = this.contentRect?.width || 0;
				// #ifdef MP-KUAISHOU
				width = this.wrapRect?.width || 0;
				// #endif
				return width
			},
			// 页面级滚动，非导航模式下，如果标签栏吸顶，记录上一个pane的滚动位置，保证切换切换回来时自动定位
			pageScrollLocate() {
				return this.pageScroll && !this.scrollspy && this.isFixed
			},
		},
		watch: {
			// 监听子组件数组长度变化，赋index值
			'tabs.length'() {
				const lastIndex = this.childrens.length - 1;
				this.childrens.forEach((child, index) => {
					child.index = index;
					child.isActiveLast = this.activeLast ? lastIndex === index : false;
					const tab = this.tabs[index];
					if (tab) this.$set(tab, "index", index); //与pane引用绑定对应关系
				});
			},
			// 监听选中标识符变化,用于绑定的v-model变化时激活对应的标签
			realValue(value) {
				// 必须保证初始化完成后才能更正活动选项卡的索引
				if (this.isLoaded && value !== this.currentName) this.setCurrentIndexByName(value);
			},
			// 监听选中下标变化
			currentIndex(newIdx, oldIdx) {
				if (isNull(newIdx)) return;
				this.lastIndex = oldIdx;

				//滚动导航模式下，更新子组件是否相离参照区域
				if (this.scrollspy) this.childrens.forEach((child, index) => child.isDisjoint = index < newIdx);

				// 需要$nextTick一下，否则导致新选中的标签节点信息获取有误
				this.$nextTick(() => {
					this.setLine(); //设置底部线条位置
					this.changeStatus(newIdx, oldIdx); // 状态变更
					this.changeStyle(); // 样式切换
					// this.scrollPosition(newIdx, oldIdx); //内容滚动位置定位
				})
			},
			// 监听背景色变化，重新获取rgba各值
			background: {
				immediate: true,
				handler(value) {
					if (this.transparent) {
						const color = getColor(isNull(value) ? 'rgba(255,255,255,0)' : value);
						if (color.length) {
							const [R, G, B, A] = color;
							this.rgba = { R, G, B, A: parseFloat(A) };
						} else {
							throw new Error('元素背景颜色必须为RGBA');
						}
					}
				}
			},
			isFixed(val) {
				this.$emit('sticky-change', { isFixed: val }); // emit 吸顶变化事件
				this.updateTabsWrapRect(); // 更新标签栏wrap的节点信息
				this.clearScrollPostion(); // 清除标签内容的滚动位置
			},
			// 更新滑块计算宽度
			barWidth: {
				immediate: true,
				handler(val) {
					if (val !== "auto") this.barCalcedWidth = val; // 为auto时，不设置
				},
			},
			// 更新滑块计算高度
			barHeight: {
				immediate: true,
				handler(val) {
					if (val !== "auto") this.barCalcedHeight = val; // 为auto时，不设置
				},
			}
		},
		created() {
			//存放引用的变量，如果在data中定义会报错：  Property or method "toJSON" is not defined on the instance but referenced during render.
			this.childrens = [];
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
		// 组件创建了Observer监听，当切换页面时页面不一定会销毁， 因此tabs组件也没有销毁，就无法触发destroyed或unmounted钩子，导致unInit方法不会调用从而断开监听。
		// 在页面隐藏后，组件仍然保持监听，会因为获取不到元素的节点信息而报错：Cannot read property 'bottom' of null
		// 因此在组件失活后手动断开监听来解决这个报错
		activated() {
			this.createObserver();
		},
		deactivated() {
			this.destroyObserver(); // 断开observer的监听
		},
		methods: {
			// 卸载组件的处理
			unInit() {
				this.destroyObserver(); // 断开observer的监听
			},
			// @exposed-api 重置组件的一些状态
			reset(callback) {
				this.reseted = false;
				this.barAnimated = false;
				this.lockedScrollspy = true;
				this.disabledSetLine = false;
				this.firstSetLine = true;
				this.shouldSetDx = true;
				this.scrollLeft = 0;
				this.scrollTop = 0;
				this.scrollDetail = { scrollLeft: 0, scrollTop: 0 };
				this.paneScrollTop = 0;
				this.barCalcedWidth = this.barWidth;
				this.barCalcedHeight = this.barHeight;
				this.$nextTick(() => {
					this.reseted = true;
					this.resize(callback);
				})
			},
			// @exposed-api 外层元素大小或组件显示状态变化时，可以调用此方法来触发重绘
			async resize(callback) {
				this.init(() => {
					callback && callback();
				});
			},
			// @exposed-api 滚动到指定的标签页，在滚动导航模式下可用
			scrollTo(name) {
				this.$nextTick(() => {
					this.setCurrentIndexByName(name);
					this.scrollToCurrentContent(false);
				});
			},
			// 添加tab
			putTab(props) {
				const defaultSlotName = 'title' + this.tabs.length //标题的默认插槽名
				this.tabs.push({
					...props,
					// titleSlot: 'title' + this.tabs.length,
					//标题插槽名，默认以"title"+下标命名，如果用户设置了titleSlotName，就使用titleSlotName
					//,vue3只有H5、app支持自定义标签插槽
					defaultSlotName, //标题的默认插槽名
					titleSlotName: this.getTitleSlotName(defaultSlotName, props?.titleSlotName), //标题的实际插槽名
					show: this.scrollspy //是否显示内容（滚动导航模式默认显示）
				});
				this.$nextTick(() => {
					this.initTimer && clearTimeout(this.initTimer);
					this.initTimer = setTimeout(() => this.init(), 5); //初始化
				});

			},
			// 更新tab
			updateTab(props, index) {
				const tab = this.tabs[index];
				Object.entries(props || {}).forEach(ele => this.$set(tab, ele[0], ele[1]));
				this.$set(tab, "titleSlotName", this.getTitleSlotName(tab.defaultSlotName, props?.titleSlotName))
			},
			// 获取标题插槽名
			getTitleSlotName(defaultSlotName, titleSlotName) {
				// 如果用户设置了titleSlotName，就使用titleSlotName，否则使用默认的插槽名称（以"title"+下标命名）
				return !isNull(titleSlotName) ? titleSlotName : defaultSlotName
			},
			// 标签项class
			tabClass(index, tab) {
				return toClass({
						'is-active': this.currentIndex === index,
						'is-disabled': tab.disabled,
						'is-animated': this.isSlideBlock,
						'is-shrink': this.shrink,
						'y-tabs__ellipsis': this.isEllipsis,
						'y-tab__prev': index === this.currentIndex - 1, //与当前标签相邻的前面的标签
						'y-tab__next': index === this.currentIndex + 1 //与当前标签相邻的后面的标签
					},
					`is-${this.type}`,
					`y-tab_${index}`
				);
			},
			// 标签区域class
			titleClass(tab) {
				return toClass({ 'y-tabs__ellipsis': this.isEllipsis }, `y-tab__title--${tab.position}`);
			},
			// 标签文字class
			textClass(tab) {
				return toClass({ 'y-tabs__ellipsis': this.isEllipsis }, `y-tab__text--${tab.position}`);
			},
			// 标签项style
			tabStyle(index) {
				const activated = this.currentIndex === index;
				let { titleActiveColor: color, titleInactiveColor: defColor } = this;
				let background = '';
				let borderColor = '';

				if (this.type === 'line') {
					if (isNull(color)) color = '#323233';
					if (isNull(defColor)) defColor = '#646566';
				} else if (this.type === 'text') {
					// type="text" 时，选中时使用主题色
					if (isNull(color)) color = this.color;
					if (isNull(defColor)) defColor = '#323233';
				} else if (this.type === 'card') {
					// type="card" 时，未选中则使用主题色
					background = this.color;
					if (isNull(color)) color = '#fff';
					if (isNull(defColor)) defColor = this.color;
				} else if (this.type === 'button') {
					// 非滑块时设置背景色
					// if (!this.isSlideBlock) background = this.color;
					if (isNull(color)) color = '#fff';
					if (isNull(defColor)) defColor = '#323233';
				} else if (this.type === 'line-button') {
					// 非滑块时设置边框颜色
					// if (!this.isSlideBlock) borderColor = this.color;
					if (isNull(color)) color = this.color;
					if (isNull(defColor)) defColor = '#323233';
				}

				const style = {
					color: activated ? color : defColor,
					background: activated ? background : '',
					borderColor: activated ? borderColor : ''
				};
				return style;
			},
			// 徽标格式化
			formatBadge(tab) {
				if (!isNull(tab?.badge) && !isNull(tab?.badgeMaxCount) && tab?.badge > tab?.badgeMaxCount) {
					return tab?.badgeMaxCount + '+';
				} else {
					return tab?.badge
				}
			},
			// 初始化操作
			async init(callback) {
				try {
					this.wrapRect = await this.getRect('.y-tabs__wrap'); //标签栏包裹层节点信息（在小程序中，偶发性高度获取不正确）
					this.scrollViewRect = await this.getRect('.y-tabs__scroll'); //标签栏scroll-view的节点信息
					this.barRect = await this.getRect('.y-tabs__bar'); //滑块节点信息
					this.contentRect = await this.getRect('.y-tabs__content'); //标签内容节点信息
					this.dependOffsetRect = await this.getRect('.y-tabs__depend--offset'); //标签栏吸顶设置offset时的模拟元素
					// nav-left、nav-right插槽宽度、高度,计算额外宽高
					const r1 = await this.getRect('.y-tabs__nav-left');
					const r2 = await this.getRect('.y-tabs__nav-right');
					this.extraWidth = r1?.width + r2?.width;
					this.extraHeight = r1?.height + r2?.height;

					// 标签水平展示时，line风格滑块设置默认宽度
					const barWidth = this.barRect?.width;
					const barHeight = this.barRect?.height;
					//barWidth大于0才设置:首次初始化时,因为v-show为false,width获取为0,会导致底部条的宽度一直是0
					// if (!this.isVertical && this.isLine && barWidth > 0) this.barCalcedWidth = barWidth;
					// 更新滑块的计算高度和宽度
					if (this.isLine) {
						if (!this.isVertical && barWidth > 0) this.barCalcedWidth = barWidth;
						if (this.isVertical && barHeight > 0) this.barCalcedHeight = barHeight;
					}

					await this.updateTabRect(true); //首次全量更新标签节点信息

					await this.createObserver(); // 创建观察器

					this.setCurrentIndexByName(this.realValue); //更正活动选项卡的索引

					await this.setLine(); //设置底部线条位置

					// 滚动到指定的pane (非第一个标签时内容滚动到指定位置可能会不准确，取决于pane中的内容何时渲染完)
					// fix: 使用scrollTo方法
					// if (this.currentIndex > 0) this.scrollToCurrentContent(true);
					this.emitLoaded(); // emit loaded事件
				} finally {
					callback && callback();
				}
			},
			// 触发组件内部初始化完成的事件"loaded"
			emitLoaded() {
				if (this.isLoaded) return;
				this.$nextTick(() => {
					this.isLoaded = true;
					this.$emit('loaded');
				})
			},
			// 创建观察器
			async createObserver() {
				await this.observeSticky();
				await this.observerTransparent();
				await this.observePane();
			},
			// 销毁观察器
			destroyObserver() {
				['dependObserver', 'tranObserver'].forEach(name => this.disconnectObserver(name));
				this.childrens?.forEach(child => child.disconnectObserver());
			},
			// 断掉观察，释放资源
			disconnectObserver(observerName) {
				const observer = this[observerName];
				observer && observer.disconnect();
			},
			// 观察 - 标签栏吸顶
			async observeSticky() {
				//  offsetTop（只在初始化时有效，不能动态变更），使用resize初始化一下可生效。
				if (!this.sticky) return;
				this.disconnectObserver('dependObserver'); // 先断掉之前的观察
				// 检测的区间范围(在目标节点与参照节点在页面显示区域内相交或相离，且相交或相离程度达到目标节点布局区域的20%和50%时，触发回调函数)
				const dependObserver = uni.createIntersectionObserver(this, {
					thresholds: [0.01, 0.5, 1]
				});
				const offsetTop = Number(this.offsetTop)
				dependObserver.relativeToViewport({ top: -offsetTop }); // 到屏幕顶部的高度时触发
				// 绑定观察的元素
				dependObserver.observe(`.${this.uniqueTabsClass} .y-tabs__depend`, res => {
					// 判断是否达到吸顶条件范围
					this.isFixed = res.intersectionRatio <= 0 && res.boundingClientRect.top <= offsetTop;
				});
				this.dependObserver = dependObserver;
			},
			// 观察 - 透明渐变标签栏
			async observerTransparent() {
				if (!this.transparent) return;

				// 通过observer模拟出滚动效果，得到预设阈值触发时的相交高度从而计算出透明度
				// 1.通过bottom将参照节点布局区域高度设置为 目标节点区域到屏幕顶部的高度
				// 2.指定目标节点的高度为transparentOffset的值,页面滚动时目标节点与参照节点就有有一个最大为transparentOffset的相交高度
				// 2.当目标节点进入参照节点时达到预设的阈值时调用回调函数获取相交比例
				// 3.通过相交比例计算透明度
				const transOffset = Number(this.transparentOffset);
				const screenHeight = uni.getSystemInfoSync().screenHeight;
				const rect = await this.getRect('.y-tabs__depend--transparent');
				const visibleHeight = screenHeight - rect.top; //可见高度
				const length = 30; //预设阈值数量为30个
				const increment = (1 / transOffset) * Math.floor(transOffset / length); //增量
				const thresholds = Array.from({ length: length + 1 }, (_, i) => {
					let value = (i * increment).toFixed(3);
					//避免阈值范围超过0-1
					if (value > 1) value = 1;
					if (value < 0) value = 0;
					return value;
				});
				this.disconnectObserver('tranObserver');
				const tranObserver = uni.createIntersectionObserver(this, { thresholds });
				tranObserver.relativeToViewport({ bottom: -visibleHeight });
				tranObserver.observe('.y-tabs__depend--transparent', res => {
					const { A, R, G, B } = this.rgba || {};
					let opacity = res.boundingClientRect.top > res.relativeRect.top ? res.intersectionRatio +
						A : 1;
					opacity = Math.min(Math.max(A, opacity), 1);
					this.transparentBgColor = `rgba(${R},${G},${B},${opacity})`;
				});
				this.tranObserver = tranObserver;
			},
			// 观察 - 标签内容滚动时定位标签项
			async observePane() {
				if (!this.scrollspy) return; //非滚动导航时不创建观察器

				// 页面级滚动：以offsetTop为参照区域top，如果是滚动导航，需加上标签栏高度
				// 区域滚动：以pane的父容器的top为参照区域top
				const top = this.pageScroll ? Number(this.offsetTop) + (this.scrollNav ? this.wrapRect?.height || 0 :
						0) : this
					.contentRect?.top || 0;
				this.childrens.forEach(async child => await child.observePane(top));
			},
			// 标签点击事件
			onClick(index) {
				const { title, disabled, computedName } = this.childrens[index];
				if (disabled) {
					this.$emit('disabled', computedName, title); //emit 禁用事件
				} else {
					this.$emit('click', computedName, title); // emit click事件:点击标签时触发
					callInterceptor({
						interceptor: this.beforeChange,
						args: [computedName],
						done: () => {
							this.disabledSetLine = false;
							this._lockDx(); //锁定dx
							this.setCurrentIndex(index); //设置当前下标
							setTimeout(() => this.scrollToCurrentContent(), 0); //滚动到当前标签内容
						}
					});
				}
			},
			// 更正活动选项卡的索引
			setCurrentIndexByName(name) {
				const matched = this.childrens.find(child => child.computedName === name);
				const defaultIndex = this.childrens[0] ? this.childrens[0].index : 0;
				this.setCurrentIndex(matched ? matched.index : defaultIndex);
			},
			// 设置当前下标
			setCurrentIndex(currentIndex) {
				const newIndex = this.findAvailableTab(currentIndex); //查询可用tab
				if (!isDef(newIndex)) return;

				const shouldEmit = newIndex !== this.currentIndex; //激活下标是否重复
				const shouldEmitChange = this.currentIndex !== null;
				const { title, computedName, rendered } = this.childrens[newIndex];

				// 非scrollspy且是延迟渲染,emit rendered事件:标签内容首次渲染时触发（仅在开启延迟渲染后触发）
				if (this.isLazyRender && !this.scrollspy && !rendered) this.$emit('rendered', computedName, title);
				this.currentIndex = newIndex; //更改当前激活下标

				//禁止重复切换
				if (shouldEmit) {
					// 更新v-model绑定的值
					this.$emit("input", computedName);
					this.$emit("update:modelValue", computedName);
					if (shouldEmitChange) this.$emit('change', computedName, title); //emit change事件:当前激活的标签改变时触发
				}
			},
			// 查询可用tab
			findAvailableTab(index) {
				const diff = index < this.currentIndex ? -1 : 1;
				while (index >= 0 && index < this.tabs.length) {
					if (!this.tabs[index]?.disabled) {
						return index;
					}
					index += diff;
				}
			},
			// 设置滑块位置
			async setLine() {
				// 标签宽高动态变化时需要更新tab的节点信息
				if (this.isDynamic) await this.updateTabRect(false);
				const rect = this.tabRects[this.currentIndex];
				// 标签切换时设置滑块位置
				if (this.isSlideBlock && !this.disabledSetLine) {
					// 胶囊风格的滑块，标签栏水平展示时，滑块宽度等于选中标签宽度；垂直展示时，滑块高度为选中标签高度
					// 线条风格的滑块，如果barWidth为auto，标签栏水平展示时，滑块宽度等于选中标签宽度；
					// 线条风格的滑块，如果barHeight为auto，标签栏垂直展示时，滑块高度为选中标签高度；
					if (this.isPills || this.autoLineBarWidth || this.autoLineBarHeight) {
						if (!this.isVertical) this.barCalcedWidth = rect?.width;
						else this.barCalcedHeight = rect?.height;
					}

					this.barOffset = rect?.barOffset; //滑块位置
					if (!this.barAnimated) {
						this.delayedFn(() => {
								this.barAnimated = true;
								this.firstSetLine = false;
							},
							"barAnimatedTimer"); //开启滑块动画
					}
				}

				// 延迟一下，避免在快速滑动时，设置scrollLeft或scrollTop不一定生效
				// 可能是在设置滚动条位置时有动画过渡，scroll-view组件节流
				this.delayedFn(() => this.scrollIntoView(), "scrollIntoViewTimer"); //将激活的tab滚动到可见区域中
			},
			// 将激活的tab滚动到可见区域中
			async scrollIntoView() {
				if (!this.scrollX && !this.scrollY) return; // 不能水平滚动也不能垂直滚动时就阻止
				const rect = this.tabRects[this.currentIndex];
				const fieldName = !this.isVertical ? "scrollLeft" : "scrollTop"; //设置标签栏scroll-view水平/垂直滚动偏移量的变量名
				// 结束的滚动位置：如果标签需滚动至中心,取scrollOffset；否则标签水平展示取offsetLeft，垂直展示取offsetTop
				let scrollOffset = this.scrollToCenter ? rect?.scrollOffset : rect?.[!this.isVertical ? "offsetLeft" :
					"offsetTop"
				];
				if (scrollOffset < 0) scrollOffset = 0;
				this[fieldName] = scrollOffset;
			},
			// 滚动到当前标签内容
			async scrollToCurrentContent(immediate = false) {
				// 只有滚动导航模式才能定位pane
				if (!this.scrollspy) return;
				this.lockedScrollspy = true; //滚动锁
				//获取滚动距离
				let { scrollTop = 0 } = await this.getScrollViewRect();

				// 获取当前pane上边距与页面顶部的距离
				let { top = 0 } = await this.childrens[this.currentIndex].getRect();

				if (this.pageScroll) {
					// 页面滚动，滚动导航模式下设置了吸顶，需要减去标签栏高度及标签栏距离屏幕顶部的高度
					if (this.scrollNav && this.sticky) {
						top -= (this.dependOffsetRect?.top || 0);
						top -= (this.wrapRect?.height || 0);
					}
				} else {
					// 区域滚动,减去内容区域距离页面顶部的高度
					const rect = await this.getRect('.y-tabs__content'); //实时获取top
					top -= (rect?.top || 0);
				}

				// 实际的滚动距离 = 滚动距离 + 计算得到的pane距滚动区域顶部的真实距离
				scrollTop += top;
				scrollTop = Math.max(0, scrollTop)
				scrollTop += Math.random() * 0.1 //加一个随机数（避免当重复设置某些属性为相同的值时，不会同步到view层）

				// 页面滚动使用自己设定的动画时长，区域滚动时使用scroll-view设置的动画效果,大概300ms
				if (this.pageScroll) uni.pageScrollTo({ scrollTop, duration: immediate ? 0 : this.msDuration })
				else this.paneScrollTop = scrollTop;

				this.unLockedPane(scrollTop); // 释放pane滚动锁
			},
			// 标签栏scroll-view滚动时触发
			handleScrollByNav(e) {
				this.scrollDetail = e?.detail;
			},
			// 释放滚动锁
			releaseScrollspyLock() {
				// 内容区域触发了触摸开始事件,解除pane区域滚动时对tab标签进行定位时的锁定
				this.lockedScrollspy = false;
			},
			// 释放pane滚动锁
			async unLockedPane(scrollTop) {
				// 通过定时器查询当前页面滚动的距离，来判断页面或者scroll-view是否滚动结束
				// 滚动结束时，释放滚动锁，避免使用鼠标滚轮滚动因锁无法定位到tab标签
				await this.callNextTick()
				const ms = (this.pageScroll ? this.msDuration : 300) + 50;
				this.intervalFn(async (clear) => {
					const rect = await this.getScrollViewRect();
					if (rect.scrollTop >= scrollTop - 5 && rect.scrollTop <= scrollTop + 5) {
						this.releaseScrollspyLock(); //释放滚动锁
						clear();
					}
				}, "paneLockedTimer", ms)
			},
			// 设置内容区域滚动时激活的下标
			setActivedIndexToScroll() {
				// 取最后一个相离的pane的下一个兄弟pane,则为当前激活的pane,如果没找到,则默认为第一个
				const childs = this.childrens.filter(o => o.isDisjoint);
				let index = 0;
				if (childs.length > 0) {
					const dIndex = childs[childs.length - 1].index;
					index = dIndex === this.childrens.length - 1 ? dIndex : dIndex + 1; //如果是最后一个，则直接取下标，否则+1取下一个
				}
				this.setCurrentIndex(index);
			},
			// 状态变更
			changeStatus(newIdx, oldIdx) {
				//非滚动导航
				if (!this.scrollspy) {
					this.tabs[oldIdx] && (this.tabs[oldIdx].show = false); //标记旧tab内容隐藏
					this.tabs[newIdx] && (this.tabs[newIdx].show = true); // 标记当前tab内容显示
					this.childrens[newIdx] && (this.childrens[newIdx].rendered = true); //标记当前tab内容渲染过
				}

				// 子数组标记激活状态
				this.childrens.forEach((child, index) => (child.active = newIdx === index));
			},
			// 样式切换
			async changeStyle() {
				// 非滚动导航,不对内容区进行样式调整
				if (this.scrollspy) return
				this.changeTrackStyle(false); //改变标签内容滑动轨道样式
				await this.callNextTick(); //nextTick一下

				//改变标签内容样式
				// #ifdef H5
				setTimeout(() => this.changePaneStyle(), 50); // H5端：tabs嵌入的页面为tabBar配置的第一个页面时，获取高度有问题,使用setTimeout
				// #endif
				// #ifndef H5
				this.changePaneStyle();
				// #endif
			},
			// 改变标签内容滑动轨道样式
			changeTrackStyle(isSlide = false, duration, offsetWidth = 0) {
				// isSlide为true，表示左右滑动；false表示点击标签切换内容的转场动画；
				const left = isSlide ? offsetWidth + 'px' : -100 * this.currentIndex + '%';
				duration = isNull(duration) ? this.duration : duration;

				// 使用left替换transform，因为transform会导致设置了fixed的元素变成绝对定位（uni-datetime-picker、uni-popup）
				// this.trackStyle = { left, transition：this.animated ? `left ${duration}s linear` : 'none' };

				// fix（v2.2.8）：
				// 在微信开发者工具上,使用了left，transition有时会失效，left效果不好，仍使用transform
				// 需避免有fixed的元素嵌套在y-tab中
				this.trackStyle = {
					transform: `translate(${left}, 0px) translateZ(0px)`,
					transition: this.animated ? `transform ${duration}s linear` : 'none',
				}
			},
			// 改变标签内容样式
			async changePaneStyle() {
				const curr = this.childrens[this.currentIndex]; //当前pane
				if (!curr) return;

				// 页面级滚动，非导航模式下，如果标签栏吸顶，记录上一个pane的滚动位置，保证切换切换回来时自动定位
				let viewScrollTop = null;
				if (this.pageScrollLocate) {
					const rect = await this.getScrollViewRect(); //获取滚动容器此时的滚动高度
					viewScrollTop = rect?.scrollTop;
					if (!isNull(this.lastIndex)) this.$set(this.tabs[this.lastIndex], "scrollTop", viewScrollTop)
				}

				//清除当前pane的样式，默认高度为auto
				curr.paneStyle = null;

				// 隐藏pane高度统一为显示pane的高度
				const rect = await curr.getRect('.y-tab__pane--wrap');
				const panStyle = { height: rect?.height + 'px' };
				this.tabs.filter(o => !o.show).forEach(tab => {
					const pane = this.childrens[tab.index];
					if (pane) pane.paneStyle = panStyle;
				});

				if (this.pageScrollLocate) {
					// 获取当前标签内容之前的滚动位置
					let scrollTop = this.tabs[this.currentIndex]?.scrollTop
					// 获取不到时，默认滚动到吸顶临界值的距离
					if (isNull(scrollTop)) {
						const rect = await this.childrens?.[this.lastIndex]?.getRect()
						// 取上一个pane距屏幕顶部的高度+滚动高度 - 吸顶与标签栏高度之和
						scrollTop = viewScrollTop + rect?.top - this.wrapRect.height - this.offsetTop + 2
					}

					// 当前pane滚动到上次所在的位置
					if (!isNull(scrollTop)) this.$nextTick(() => uni.pageScrollTo({ scrollTop, duration: 0 }))
				}
			},
			// 清除标签内容的滚动位置
			clearScrollPostion() {
				// 页面级滚动，非导航模式下，标签吸顶时清除上次的位置数据
				if (this.pageScrollLocate) this.tabs.forEach(tab => this.$set(tab, "scrollTop", null))
			},
			// 获取标签栏scroll-view当前的滚动偏移量
			getTabScrollOffset() {
				return new Promise((resolve, reject) => {
					// 标签栏水平，返回scrollLeft；垂直时，返回scrollTop
					const nodeRef = this.getSelectorQuery().select(`.${this.uniqueTabsClass} .y-tabs__scroll`);
					const fieldName = !this.isVertical ? "scrollLeft" : "scrollTop";
					nodeRef.scrollOffset(res => resolve(res?.[fieldName] || 0)).exec();
				});
			},
			// 获取页面或内容区域的滚动高度
			getScrollViewRect() {
				return new Promise((resolve, reject) => {
					const query = this.getSelectorQuery();
					// 页面级滚动，获取viewport的滚动距离;区域滚动，获取scroll-view的滚动距离
					const nodeRef = this.pageScroll ? query.selectViewport() : query.select(
						`.${this.uniqueTabsClass} .y-tabs__content-scrollview`);
					nodeRef.fields({ size: true, scrollOffset: true }, res => resolve(res || {})).exec();
				});
			},
			// 更新标签栏wrap的节点信息
			updateTabsWrapRect() {
				// 标签栏垂直展示下的吸顶，需重新获取标签栏wrap的节点信息，并更新tab的barOffset、scrollOffset
				this.$nextTick(async () => {
					this.wrapRect = await this.getRect('.y-tabs__wrap'); //标签栏节点信息
					this.scrollViewRect = await this.getRect('.y-tabs__scroll'); //标签栏scroll-view的节点信息
					this.tabRects.forEach(item => {
						const res = this.getTabOffset(item);
						this.$set(item, 'barOffset', res.barOffset);
						this.$set(item, 'scrollOffset', res.scrollOffset);
					});
				})
			},
			//更新标签节点信息
			async updateTabRect(isFull = false) {
				// 百度、支付宝、字节等小程序是否支持批量查询节点信息，是否根节点套一层view
				// init时标签宽高全量更新
				if (isFull) {
					//scrollLeft,scrollTop均为0，表示组件初始化，标签节点均处于初始位置
					const isInit = this.scrollDetail?.scrollLeft === 0 && this.scrollDetail?.scrollTop === 0;
					// 获取tab的节点信息
					const rects = await this.getBatchRect(this.tabs.map((_, i) => `.y-tab_${i}`));
					this.tabRects = this.tabs.map((tab, index) => {
						const r = rects[index] || {};
						const result = {
							index, //记录tab下标
							width: r.width, //标签宽度
							height: r.height, //标签高度
							left: r?.left, //标签左边界距屏幕左边界的距离
							top: r?.top, //标签上边界距屏幕上边界的距离
							leftSpace: 0, //与上一个tab的水平间隙
							topSpace: 0, //与上一个tab的垂直间隙
							offsetLeft: 0, //标签左边界距scroll-view左边界的距离
							offsetTop: 0, //标签上边界距scroll-view上边界的距离
							barOffset: 0, //滑块水平/垂直偏移量
							scrollOffset: 0, //croll-view水平/垂直的滚动偏移量
						}
						// 上一个节点的right、bottom
						let prevRight = rects[index - 1]?.right;
						let prevBottom = rects[index - 1]?.bottom;

						// 非初始化时，当前left、top需要加上滚动距离作为最初位置的left、top
						// 因为动态增删标签时，会调用init方法触发updateTabRect的节点信息计算，如果不加上滚动距离，位置会计算错误
						if (!isInit) {
							const { scrollLeft, scrollTop } = this.scrollDetail || {}
							result.left += scrollLeft;
							result.top += scrollTop;
							prevRight += scrollLeft;
							prevBottom += scrollTop;
						}
						result.leftSpace = result.left - (index === 0 ? this.scrollViewRect?.left : prevRight);
						result.topSpace = result.top - (index === 0 ? this.scrollViewRect?.top : prevBottom);
						return result;
					})
				} else {
					// 非全量更新，只更新当前及上一个选中tab的节点信息，并改变后面tab的节点信息,旧节点也需要
					const idxs = [this.currentIndex];
					if (!isNull(this.lastIndex)) idxs.push(this.lastIndex);
					const rects = await this.getBatchRect(idxs.map(i => `.y-tab_${i}`));
					const keys = ["width", "height", "top", "left"];
					idxs.forEach((i, idx) => {
						const matched = this.tabRects?.[i],
							rect = rects?.[idx];
						if (matched && rect) keys.forEach(key => this.$set(matched, key, rect?.[key]))
					});
				}

				// 计算相关偏移量
				let tabRects = [];
				if (isFull) {
					tabRects = this.tabRects;
				} else {
					// 如果标签宽高会根据选中态进行变化，需进行差量更新，取最小的动态节点开始向后重新计算
					const start = !isNull(this.lastIndex) ? Math.min(this.lastIndex, this.currentIndex) : this
						.currentIndex;
					tabRects = this.tabRects.filter((_, i) => i >= start);
				}
				tabRects.forEach((item, i) => {
					const prev = this.tabRects[item.index - 1] || {};
					//首个标签取leftSpace
					if (!this.isVertical) {
						this.$set(item, 'offsetLeft', item.index === 0 ? item.leftSpace : prev.offsetLeft +
							prev.width + item.leftSpace);
					} else {
						this.$set(item, 'offsetTop', item.index === 0 ? item.topSpace : prev.offsetTop + prev
							.height + item.topSpace);
					}
					const res = this.getTabOffset(item);
					this.$set(item, 'barOffset', res.barOffset);
					this.$set(item, 'scrollOffset', res.scrollOffset);
				})

			},
			// 获取动态偏移量等数据
			getTabOffset({ width, height, offsetLeft, offsetTop }) {
				if (!this.isVertical) {
					const cLeft = offsetLeft + width / 2; // 水平展示下的选中标签中心点
					// 滑块定位到标签的水平偏移量；胶囊风格或line风格且barWidth为auto时，由于滑块宽度等于标签宽度,无需像line处于中心位置，因此barOffset等于offsetLeft
					const barOffset = this.isLine && !this.autoLineBarWidth ? cLeft - this.barRect.width / 2 : offsetLeft;
					let scrollOffset = cLeft - this.tabCenterWidth; //标签栏滚动到中心时的left值
					if (scrollOffset < 0) scrollOffset = 0;
					return { barOffset, scrollOffset };
				} else {
					const cTop = offsetTop + height / 2; //垂直展示下的选中标签中心点
					const barOffset = this.isLine && !this.autoLineBarHeight ? cTop - this.barRect.height / 2 : offsetTop;
					const scrollOffset = cTop - this.tabCenterHeight;
					return { barOffset, scrollOffset };
				}
			},
			// pane触摸结束事件
			async touchEndForPane(deltaX, currIndex, targetIndex, isChange) {
				//是否底部条有动画模式(仅支持水平展示)
				const isAnimatedMode = !this.isVertical && (this.isLineMode || this.isWormMode);

				// 有动画时，禁止触发setLine函数
				isAnimatedMode && (this.disabledSetLine = true);

				// 达到阈值，切换标签；未达到阈值，pane归位；
				isChange ? this.setCurrentIndex(targetIndex) : this.changeTrackStyle(false);

				// 对触摸结束时底部条动画的执行
				if (isAnimatedMode) await this.handleWormAnimated(deltaX, currIndex, targetIndex, isChange);

				// 如果标签宽高动态变化，会导致滑块错位，这里修正一下；如果使用了过渡，仍会错位
				if (this.isDynamic) {
					await this.callNextTick(); //nextTick一下
					this.disabledSetLine = false;
					this.setLine();
				}
				this.unlockDx();
			},
			// 内容滑动结束时的毛毛虫动画模拟
			handleWormAnimated(deltaX, currIndex, targetIndex, isChange) {
				// 使用transform与width同时过渡时，两者不一定并行变化，会导致滑块错位，因此使用定时器模拟过渡；
				return new Promise(resolve => {
					this.barAnimated = false; //关闭滑块动画
					const
						duration = this.msDuration,
						increment = 10;

					const endX = isChange ? this.contentWidth * (deltaX <= 0 ? -1 : 1) : 0; //结束的滑动距离（右滑为负，左滑为正）
					// 模拟一组触摸滑动开始位置到最终位置的数据
					const dxList = Array.from({ length: duration / increment }, (_, i) => {
						const currDx = progress((i + 1) * increment, deltaX, endX, duration);
						return this.getBarPostion(currIndex, currDx);
					});

					this.intervalFn((clear) => {
						if (dxList.length === 0) {
							//内容页滑动结束时触发（仅barAnimateMode为linear、worm、worm-ease时有效）
							this.$emit('slide-end', { targetIndex });
							clear();
							resolve();
						} else {
							const values = dxList.shift();
							if (values) {
								this.barOffset = values.barOffset;
								this.barCalcedWidth = values.barCalcedWidth;
								// 内容页滑动时触发（仅barAnimateMode为linear、worm、worm-ease时有效）
								this.$emit("slide-change", {
									dx: values.dx,
									rate: values.rate,
									targetIndex
								})
							}
						}
					}, "barIntervalTimer", increment);
				})
			},
			//锁定dx，用于避免在swiper被动触发滚动时候执行setDx中的代码
			_lockDx() {
				this.shouldSetDx = false;
			},
			//在swiper的@animationfinish中通知y-tabs对setDx的锁定，若在父组件中调用了setDx，则必须调用unlockDx
			unlockDx() {
				this.$nextTick(() => {
					this.barAnimated = true;
					this.shouldSetDx = true;
				})
			},
			/**
			 * @exposed-api 设置滑块的水平偏移量
			 * @param {number} dx 横向滑动的值
			 * @param {boolean} isSwiper 代表是否为swiper组件滑动时调用
			 */
			setDx(dx, isSwiper = true) {
				if (this.isVertical) return;
				if (!this.shouldSetDx && isSwiper) return;
				if (!this.isLineMode && !this.isWormMode) return;

				// swiper组件的current初始化时一定要保证是第一项的下标，否则在微信小程序中dx会异常
				if (isSwiper) {

					// 飞书、快手通过swiper组件的@transition返回的dx不统一，使用setDx()错位,因此需要统一dx的变化,与微信、H5端一致
					// 飞书小程序的dx变化规律难以与微信小程序统一，因此暂无法实现

					// 正确的dx变化
					// 向左滑动： 第一屏 {dx:0} -> {dx:222} -> {dx:375}     第二屏  {dx:0} -> {dx:222} -> {dx:375}
					// 向右滑动： 第一屏 {dx:0} -> {dx:-222} -> {dx:-375}   第二屏  {dx:0} -> {dx:-222} -> {dx:-375}

					// 飞书：
					// 向左滑动： 第一屏 {dx:0} -> {dx:222} -> {dx:375}   第二屏  {dx:375} -> {dx:680} -> {dx:750}
					// 向右滑动： 第一屏 {dx:375} -> {dx:222} -> {dx:0}   第二屏  {dx:750} -> {dx:680} -> {dx:375}

					// 处理快手的dx
					// #ifdef MP-KUAISHOU
					dx = dx - this.currentIndex * this.contentWidth; //向左滑动时，算出一屏的变化
					// #endif

					// swiper组件调用的setDx,仅支持App、H5、微信、支付宝、字节跳动、QQ、快手小程序
					// #ifdef APP-PLUS || H5  || MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO || MP-QQ || MP-KUAISHOU
					this.handleDx(dx);
					// #endif
				} else {
					this.handleDx(dx, false);
				}

			},
			// 设置滑块偏移量及宽度
			handleDx(deltaX, isSwiper = true) {
				const values = this.getBarPostion(this.currentIndex, deltaX);
				if (!values) return;
				this.barAnimated = false; //滑动不开启动画
				const { barOffset, barCalcedWidth, dx, rate, targetIndex } = values || {};
				this.barOffset = barOffset;
				this.barCalcedWidth = barCalcedWidth;
				// 内容页滑动时触发（仅barAnimateMode为linear、worm、worm-ease时有效）
				if (!isSwiper) this.$emit("slide-change", { dx, rate, targetIndex });
			},
			// 获取滑块应变化的位置
			getBarPostion(currIndex, dx) {
				let barOffset = this.barOffset;
				let barCalcedWidth = this.barCalcedWidth;
				dx = Number(dx.toFixed(0)); //取整，避免超过contentWidth
				const isRight = dx <= 0; //通过dx判断是否向右滑动

				let dxRate = dx / (this.contentWidth + 0.1); //+0.1，避免dxRate为1时造成的底部条错位
				const currSwiperIndex = currIndex + parseInt(dxRate);
				if (currSwiperIndex !== currIndex) dxRate = dxRate - (currSwiperIndex - currIndex);

				// 下一个tab下标，保证不能超过tab的范围
				let nextIndex = currSwiperIndex + (isRight ? -1 : 1);
				nextIndex = Math.max(0, nextIndex);
				nextIndex = Math.min(nextIndex, this.dataLen - 1);

				if (currSwiperIndex === nextIndex) return null;

				// tab对应的滑块偏移量
				const nextOffset = this.tabRects[nextIndex]?.barOffset;
				const currOffset = this.tabRects[currSwiperIndex]?.barOffset;
				let distanceX = Math.abs(nextOffset - currOffset); //以当前tab与下一个tab的滑块offset之间的距离作为滑动轨道

				if (this.isLineMode) {
					barOffset = currOffset + dxRate * distanceX;

					// 对于自适应当前标签的底部条，需要根据下一个标签的宽度进行宽度伸缩
					if (this.autoLineBarWidth) {
						const organWidth = this.tabRects[currSwiperIndex].width; //滑块原始宽度为当前tab的宽度
						const width = this.tabRects[nextIndex].width;
						const diff = width - organWidth;
						if (diff !== 0) barCalcedWidth = organWidth + diff * Math.abs(dxRate)
					}
				} else if (this.isWormMode) {
					const organWidth = this.barRect?.width; //滑块原始宽度
					if (this.barAnimateMode === "worm") {
						const isHalf = Math.abs(dxRate) >= 0.5 //滑动距离超过一半的内容区域
						dxRate = Math.abs(dxRate * 2);
						let calcedWidth = 0;
						// 滑动距离小于一半
						if (!isHalf) {
							// 滑动距离小于一半，滑块宽度持续增加
							calcedWidth = organWidth + dxRate * distanceX;
							// 右滑，滑块位置应向左不断减少
							if (isRight) barOffset = currOffset - dxRate * distanceX;
						} else {
							// 滑动距离超过一半，滑块宽度减少
							calcedWidth = organWidth + (2 - dxRate) * distanceX;
							// 左滑，滑块位置应向右不断增加
							if (!isRight) barOffset = currOffset + (dxRate - 1) * distanceX;
							else barOffset = nextOffset //修正因dxRate无法达到1时滑块位置的偏移
						}

						barCalcedWidth = Math.max(calcedWidth, organWidth);

					} else {
						// 先增加至最大宽度再减少到原始宽度
						const maxWidth = distanceX * 0.5; //滑块增加到的最大宽度(这里设置为滑动轨道的一半)
						// 滑块扩张区域的移动宽度及占比
						const extendWidth = (distanceX - maxWidth) / 2;
						const extendRange = extendWidth / distanceX;

						// 滑块收缩区域的移动宽度及占比
						const shrinkWidth = maxWidth + extendWidth;
						const shrinkRange = shrinkWidth / distanceX;

						// 滑块变化宽度
						const changeWidth = maxWidth - organWidth;

						const rate = Math.abs(dxRate);
						if (rate < extendRange) {
							// 滑块宽度增加
							const addWidth = changeWidth / extendRange * rate; //滑块增加的宽度
							barCalcedWidth = Math.max(organWidth + addWidth, organWidth); //不允许小于原始宽度
							if (!isRight) {
								// 向左滑动，仅移动滑块扩张至最大时距离
								barOffset = currOffset + extendWidth / extendRange * dxRate; //滑块位置变化
							} else {
								// 向右滑动，减去滑块增加的宽度及移动比例所占的距离
								barOffset = currOffset + dxRate * distanceX - addWidth;
							}
						} else {
							// 滑块宽度减少
							const reduceWidth = changeWidth / shrinkRange * (1 - rate); //滑块减少的宽度
							barCalcedWidth = Math.max(organWidth + reduceWidth, organWidth);
							if (!isRight) {
								barOffset = currOffset + extendWidth + shrinkWidth / shrinkRange * (dxRate - extendRange);
							} else {
								barOffset = currOffset + dxRate * distanceX - reduceWidth;
							}
						}
					}
				}

				return {
					barOffset, //底部条偏移量
					barCalcedWidth, //底部条宽度 
					dx, //滑动距离
					targetIndex: nextIndex, //滑动到的目标下标
					rate: Math.abs(dx / this.contentWidth) //滑动比例
				}
			},
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
					if (!selector) reject('Parameter is empty');
					const query = this.getSelectorQuery();
					// 在百度小程序中，如果有多个tabs共存在一个页面，则获取的节点信息永远是第一个，这里使用根节点唯一的class进行隔离
					query.select(`.${this.uniqueTabsClass} ${selector}`).boundingClientRect();
					query.exec(data => resolve(Array.isArray(data) ? data[0] : data));

				})
			},
			// 批量查询节点信息
			getBatchRect(selectors) {
				return new Promise((resolve, reject) => {
					if (!selectors) reject('Parameter is empty');
					const query = this.getSelectorQuery();
					// 在百度小程序中，如果有多个tabs共存在一个页面，则获取的节点信息永远是第一个，这里使用根节点唯一的class进行隔离
					const prefix = `.${this.uniqueTabsClass} `;
					selectors.forEach(seletor => {
						query.select(prefix + seletor).boundingClientRect();
					});
					query.exec(data => resolve(data || []));
				})
			},
			// 延时执行函数，用于执行指定动画时长(duration)完成后需要触发的逻辑
			delayedFn(cb, name, ms) {
				const self = this;

				function clear() {
					if (self[name]) {
						clearTimeout(self[name])
						self[name] = null;
					}
				}
				clear();
				this[name] = setTimeout(() => {
					cb && cb()
					clear();
				}, isNull(ms) ? this.msDuration : ms);
			},
			// 定时器
			intervalFn(cb, name, ms) {
				const self = this;

				function clear() {
					if (self[name]) {
						clearInterval(self[name])
						self[name] = null;
					}
				}
				clear();
				this[name] = setInterval(() => {
					cb && cb(clear)
				}, ms);
			},
			// 包装一下nextTick的调用：部分用户使用了uView库，该库对$nextTick进行了重写但是未判空，因此传入一个空函数避免报错
			callNextTick() {
				return new Promise(resolve => {
					this.$nextTick(() => {
						resolve && resolve()
					})
				})
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import '../css/index.scss';
</style>