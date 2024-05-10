# y-tabs 标签页组件

<font color="#ff0000" size="6">注意：</font>

+ <font color="#ff0000" size="2">2.0.1+为非兼容性升级，重命名了诸多样式以及提供的属性名，也移除了部分属性及事件，如无必要，请勿升级，具体调整内容请查看更新记录。</font>

</br>

+ [Tips](#tips)
+ [支持的平台](#supportPlatform)
+ [使用方式](#usageMode)
+ [滚动吸顶示例](#scrollExamples)
+ [与swiper联动示例](#LinkWithSwiperExamples)
+ [Tabs Props](#tabsProps)
+ [Tab Props](#tabProps)
+ [Tabs Events](#tabsEvents)
+ [Tabs Methods](#tabsMethod)
+ [Tabs Slots](#tabsSlots)
+ [Tab Slots](#tabSlots)
+ [注意事项及常见问题](#beCareful)


<div id="tips" ></div>

## Tips

+ 如果有问题，可尝试下载最新代码（示例项目中的`uni_modules/y-tabs`是最新的）。
+ 请保证<font color="#1989fa">HBuilderX正式版为 `v3.4.18`、Alpha版为 `v3.5.2`</font>。
+ 使用该插件需安装`scss`插件。
+ 点击右上角的“<font color="#1989fa">使用HubilderX导入示例项目</font>”按钮下载示例项目运行并查看效果，项目中内置不少案例。
+ 也可扫描右侧图片中的微信小程序码查看（由于微信小程序审核较严，无法发布新版本，因此案例较老，最好运行示例项目查看）。
+ 可以加QQ群交流反馈：`566764891`；也可以邮箱或QQ留言：`18508420370@163.com`、`1431948195`。



<div id="supportPlatform" ></div>

## 支持的平台
+ H5、app-vue、微信、支付宝、钉钉、百度、字节、QQ、飞书、快手、京东小程序可用。
+ 暂不支持nvue及快应用。

<div id="usageMode" ></div>

## 使用方式

### 1、通过HbuilerX创建项目

+ 该组件符合`uni_modules`规范，使用`HbuilderX`导入插件到项目根目录下的`uni_modules`文件夹中。
+ `template`中直接使用，无需单独引入注册组件。
+ 该组件依赖于`uni-icons`，请单独导入。


### 2、通过vue cli创建项目

+ 需保证src下面有`uni_modules`文件夹，将y-tabs拷贝到里面
+ 在`pages.json`中通过`easycom`的方式引入组件（tabs组件中使用了uni-icons，因此需要引入uni-ui）
``` json
{
	"easycom": {
		"autoscan": true,
		"custom": {
			"^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue",
			"^y-(.*)": "@/uni_modules/y-$1/components/y-$1.vue"
		}
	},
}
```


#### 普通案例
+ <font color="#ff0000" size="2">注意：在QQ/百度/字节跳动/飞书/快手小程序中，自定义组件在渲染时会比App/H5端多一级节点，导致标签内容样式失效，需在组件上添加"`.y-tab-virtual`"的样式</font>

```
<template>
 <view>
	 <y-tabs v-model="activeIndex" @click="tabClick"  @change="tabChange">
	 	<y-tab class="y-tab-virtual" v-for="index in 5" :key="index" :title="'标签'+index">
	 		<view class="content-wrap"> 内容{{index}} </view>
	 	</y-tab>
	 </y-tabs>
 </view>
</template>
<script>
	export default {
		data() {
			return {
				activeIndex: 0,
			}
		},
		methods: {
			// 标签点击事件
			tabClick(index, item) {
				console.log("tabClick", index, item);
			},
			// 标签切换事件
			tabChange(index, item) {
				console.log("tabChange", index, item);
			}
		}
	}
</script>
<style scoped>
/* #ifdef MP-QQ || MP-BAIDU || MP-TOUTIAO || MP-LARK || MP-KUAISHOU */
.y-tab-virtual {
	position: relative;
	flex-shrink: 0;
	width: 100%;
}
</style>

```


<div id="scrollExamples" ></div>

#### 滚动吸顶示例
直接开启`sticky`属性即可


```
<template>
 <view>
	 <y-tabs v-model="activeIndex" sticky :offsetTop="offsetTop">
		<y-tab class="y-tab-virtual" v-for="index in 5" :key="index" :title="'标签'+index">
			<view class="content-wrap"> 内容{{index}} </view>
		</y-tab>
	 </y-tabs>
 </view>
</template>
<script>
	export default {
		data() {
			return {
				activeIndex: 0,
				offsetTop: 0, //粘性布局下与顶部的最小距离
			}
		},
		created() {
			// H5端需要减去顶部导航栏高度
			// #ifdef H5
			this.offsetTop = 43
			// #endif
		},
	}
</script>
<style scoped>
/* #ifdef MP-QQ || MP-BAIDU || MP-TOUTIAO || MP-LARK || MP-KUAISHOU */
.y-tab-virtual {
	position: relative;
	flex-shrink: 0;
	width: 100%;
}

.content-wrap{
	height:200vh;
}

</style>


```


<div id="LinkWithSwiperExamples" ></div>

#### 与`Swiper`联动示例

+ 请注意`Swiper`组件的`@transition`、`@animationfinish`的支持平台
+ `barAnimateMode="worm"`,设置底部条切换类似毛毛虫蠕动的效果
+ 经过测试，仅支持App、H5、微信、支付宝、字节跳动、QQ、快手小程序

```
<template>
 <view>
	 <y-tabs ref="tabs" v-model="activeIndex" barAnimateMode="worm">
	 	<y-tab v-for="(item, index) in tabs" :title="item.title" :key="index" />
	 </y-tabs>
	 
	 <!--
	 	支持平台
	 	1. @transition: 支持App、H5、微信、支付宝、字节跳动、飞书、QQ、快手
	 	2. @animationfinish: 字节跳动、飞书小程序不支持(在change事件中unlockDx)
	  -->
	 
	 <swiper class="swiper" :current="activeIndex" @transition="onTransition" @animationfinish="onAnimationfinish" @change="swpierChange">
	 	<swiper-item v-for="(item, index) in tabs" :key="index">
	 		<view class="swiper-item-view" :style="{backgroundColor: item.color}">
	 			{{item.title}}
	 		</view>
	 	</swiper-item>
	 </swiper>
 </view>
</template>
<script>
	export default {
		data() {
			return {
				tabs: [],
				activeIndex: 0,
			}
		},
		created() {
			this.tabs = Array.from({ length: 5 }, (o, i) => {
				return {
					title: 'tab' + (i + 1),
					color: this._getRandomColor()
				}
			});
		},
		methods: {
			//swiper滑动中
			onTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			//swiper滑动结束
			onAnimationfinish(e) {
				this.activeIndex = e.detail.current;
				setTimeout(() => this.$refs.tabs.unlockDx(), 0)  //通知y-tabs解除对setDx()的锁定
			},
			swpierChange(e) {
				//  由于字节跳动、飞书不支持@animationfinish，因此在change事件中unlockDx
				// #ifdef MP-TOUTIAO || MP-LARK
				this.onAnimationfinish(e)
				// #endif
			},
			// 生成随机颜色
			_getRandomColor() {
				const rgb = [];
				for (let i = 0; i < 3; ++i) {
					let color = Math.floor(Math.random() * 256).toString(16)
					color = color.length == 1 ? '0' + color : color
					rgb.push(color)
				}
				return '#' + rgb.join('');
			},
		},
	}
</script>
<style scoped>
.swiper {
	height: 300rpx;
}

.swiper-item-view {
	background-color: #007AFF;
	height: 300rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
	font-size: 50rpx;
}
</style>

```

<div id="tabsProps" ></div>

## Tabs Props
<table>
	<tr><th style="width:15%;">参数</th><th style="width:15%;">类型</th><th style="width:30%;">描述</th><th  style="width:10%;">默认值</th><th style="width:30%;">说明</th></tr>
	<tr><td> v-model   </td><td>  number、string </td><td> 绑定当前选中标签的标识符 </td><td> 0 </td><td> 即tab选中项的下标或者tab的name属性值 </td></tr>
	<tr><td> type   </td><td> string </td><td> 样式风格类型 </td><td> line</td><td> 可选值为 text、card、button、line-button </td></tr>
	<tr><td> color </td><td> string </td><td> 标签主题色 </td><td> <font color="#0022AB">#0022AB</font> </td><td>  </td></tr>
	<tr><td> background    </td><td> string </td><td> 标签栏背景色  </td><td> #fff </td><td>  </td></tr>
	<tr><td> title-active-color    </td><td> string </td><td> 标题选中态颜色  </td><td> - </td><td>  </td></tr>
	<tr><td> title-inactive-color    </td><td> string </td><td> 标题默认态颜色  </td><td> - </td><td>  </td></tr>
	<tr><td> wrap-style    </td><td> object </td><td> 标签栏样式 <font color="#1989fa" size="1">案例 ：透明导航栏下的滚动吸顶</font> </td><td> - </td><td>  </td></tr>
	<tr><td> direction    </td><td> string </td><td> 标签栏的展示方位 </td><td> horizontal </td><td> 可选值：vertical </td></tr>
	<tr>
		<td> duration </td>
		<td> number、string </td>
		<td> 动画时间，单位秒  </td>
		<td> 0.3 </td>
		<td> 仅支持type为line、button、line-button的滑块移动的动画时间，标签内容切换时的转场动画时间、页面级滚动导航的内容定位动画时间。 </td>
	</tr>
	<tr><td> shrink    </td><td> boolean </td><td> 通过 shrink 属性可以开启收缩布局，开启后，所有的标签会向左侧收缩对齐  </td><td> false </td><td>  </td></tr>
	<tr><td> bar-width  <font color="#1989fa" size="2">V2.0.1</font>   </td><td> number、string </td><td> 滑块宽度，支持rpx、vh、vw等单位及calc()函数，也可传入'auto'值，默认px。  </td><td> type为line，标签栏水平、垂直时宽度分别为20px、3px，其余为选中标签宽度；为auto时，代表滑块宽度自适应于选中标签宽度（仅在type='line'且bar-animate-mode='linear'、direction='horizontal'下生效） </td><td> 仅支持type为line、button、line-button。  </td></tr>
	<tr><td> bar-height <font color="#1989fa" size="2">V2.0.1</font>    </td><td>number、string </td><td> 滑块高度，支持度同bar-width </td><td> type为line，标签栏水平、垂直时宽度分别为3px、20px，其余为选中标签高度；为auto时，代表滑块高度自适应于选中标签高度（仅在type='line'、bar-animate-mode='linear'、direction='vertical'下生效） </td><td> 同bar-width </td></tr>
	<tr>
		<td> bar-style  <font color="#1989fa" size="2">V2.0.1</font> </td>
		<td> object </td>
		<td> 滑块样式 </td>
		<td> - </td>
		<td> 同bar-width</td>
	</tr>
	<tr>
		<td> bar-animate-mode  <font color="#1989fa" size="2">V2.0.1</font> </td>
		<td>string </td>
		<td> 滑动切换tab内容时滑块的动画模式，默认为linear。可选值：worm(毛毛虫蠕动)、worm-ease(毛毛虫缓动效果)、none(不设置)。  </td>
		<td> linear </td>
		<td> 仅在 type='line'、direction='horizontal' 时有效。   <br/>可结合swiper组件使用，效果更好 <font color="#1989fa" size="1">案例 ：新闻列表、与swiper组件联动</font> </td>
	</tr>
	<tr><td> is-dynamic <font color="#1989fa" size="2">V2.0.1</font> </td><td> boolean </td><td> 标签切换后宽高是否有变化  </td><td> true </td><td> 当选中标签会放大文字、减少内间距时，开启该属性可避免滑块错位。（如果选中的标签文字使用‘font-size:20px;transition: all .2s’进行过渡变化，开启该属性仍旧会错位） </td></tr>
	<tr><td> ellipsis     </td><td> boolean </td><td> 是否省略过长的标题文字  </td><td> true </td><td> 标签栏水平展示时，如果标签数量未超过滚动阈值则生效，垂直则不限制。 </td></tr>
	<tr><td> scroll-threshold    </td><td> number、string </td><td> 滚动阈值，标签数量超过阈值且总宽度超过标签栏宽度时开始横向滚动  </td><td> 5 </td><td>  </td></tr>
	<tr><td> scroll-to-center    </td><td> boolean </td><td> 标签栏滚动时当前标签居中  </td><td> true</td><td>  </td></tr>
	<tr><td> is-lazy-render    </td><td> boolean </td><td> 是否开启延迟渲染（首次切换到标签时才触发内容渲染）  </td><td> false </td><td>  </td></tr>
	<tr>
		<td> animated </td>
		<td> boolean </td>
		<td> 是否开启动画  </td>
		<td> true </td>
		<td> 用于开启标签栏滚动的过渡动画、切换标签内容时的转场动画、滚动导航下的内容定位动画 </td>
	</tr>
	<tr><td> active-last  <font color="#1989fa" size="2">V2.0.1</font> </td><td> boolean </td><td> 在滚动导航模式下，滚动到最后一个标签内容但其顶部未超过可视区域时，是否激活对应的标签项  </td><td> false </td><td>  </td></tr>
	<tr><td> before-change    </td><td> (name) => boolean | Promise </td><td> 切换标签前的回调函数，返回 false 可阻止切换，支持返回 Promise</td><td> - </td><td> name为v-model绑定的值 </td></tr>
	<tr><td colspan="4" rows="3" height="60">  <font color="#1989fa">内容手势滑动切换相关属性 :</font> </td><td>  </td></tr>
	<tr><td> swipeable    </td><td> boolean </td><td> 是否开启手势滑动切换 <font color="#1989fa" size="1">案例 ：滑动切换 | 新闻列表 | 滚动吸顶+左右滑动 </font> </td></td><td>  false </td><td>  </td></tr>
	<tr>
		<td> swipe-animated </td>
		<td> boolean </td><td> 是否开启标签内容滑动时的拖动动画</td>
		<td> true </td>
		<td> swipeable为true、且is-lazy-render为false时有效 </td>
	</tr>
	<tr><td> swipe-threshold    </td>
		<td> number、string </td>
		<td> 滑动切换的滑动距离阈值，单位为px；表示开启手势滑动时，横向滑动多少px切换标签内容  </td>
		<td> 120 </td>
		<td> 快速滑动时不受限制 </td>
	</tr>
	<tr><td colspan="4" height="60">  <font color="#1989fa">滚动吸顶相关属性 :</font> </td><td>  </td></tr>
	<tr><td> sticky	</td><td> boolean	</td><td> 是否使用粘性布局进行滚动吸顶 <font color="#1989fa" size="1">案例 ：滚动吸顶</font>	</td><td> false</td><td>  </td></tr>
	<tr><td> offset-top    </td><td> number、string </td><td> 粘性布局下标签栏与顶部的最小距离，单位为 px </td><td> 0 </td><td> 注意单位问题，如果是rpx，需要uni.upx2px转为px </td></tr>
	<tr><td> z-index    </td><td> number、string </td><td> 粘性布局下，标签栏的z-index值  </td><td> 99 </td><td>  </td></tr>
	<tr><td> sticky-threshold </td><td> number、string </td><td> 粘性布局吸顶的判断阈值 </td><td> 0</td><td> 表示在页面滚动时,标签栏距屏幕顶部多少px时会触发吸顶函数进行吸顶判断 <font color="#1989fa" size="1">案例 ：透明导航栏下的滚动吸顶</font> </td></tr>
	<tr><td> transparent    </td><td> boolean </td><td> 页面滚动过程中,标题栏背景色是否透明渐变 <font color="#1989fa" size="1">案例 ：透明渐变标题栏</font>  </td><td> false </td><td> background属性值必须为rgba格式 </td></tr>
	<tr><td> transparent-offset    </td><td> number、string </td><td> 标题栏背景色透明渐变的滚动距离 </td><td> 150 </td><td> 请保证标签内容的高度大于该值 </td></tr>
	<tr><td colspan="4" height="60">  <font color="#1989fa">滚动导航及侧边栏导航相关属性 :</font> </td><td>  </td></tr>
	<tr><td> scrollspy    </td><td> boolean </td><td> 是否开启滚动导航；该模式下，内容将会平铺展示 <font color="#1989fa" size="1">案例 ：滚动导航(页面级滚动)</font> </td><td> false </td><td> 如果标签栏垂直展示，且内容平铺展示，就为侧边栏模式<font color="#1989fa" size="1">案例 ：侧边栏导航(页面级滚动)-仿奶茶点单</font> </td></tr>
	<tr><td> page-scroll    </td><td> boolean </td><td>  滚动导航模式下，内容区域是否跟随页面滚动 </td><td> true </td><td> 为false时，内容区域是放在scroll-view中实现的局部滚动，需自行设置标签页容器高度 <font color="#1989fa" size="1">案例 ：侧边栏导航(区域滚动)-仿奶茶点单</font> </td></tr>
</table>



<div id="tabProps" ></div>

## Tab Props
<table>
	<tr><th style="width:140px;">参数</th><th>类型</th><th>描述</th><th>默认值</th></tr>
	<tr><td>name</td>  <td>number、string</td>  <td>标签名称，作为匹配的标识符</td> <td>标签的索引值</td></tr>
	<tr><td>title</td>  <td>string</td>  <td>标题</td> <td>-</td></tr>
	<tr><td>disabled</td>  <td>boolean</td>  <td>是否禁用标签</td> <td>false</td></tr>
	<tr><td>dot</td>  <td>boolean</td>  <td>是否在标题右上角显示小红点（优先级高于badge）</td> <td>false</td></tr>
	<tr><td>badge</td>  <td>number、string</td>  <td>图标右上角徽标的内容</td> <td>-</td></tr>
	<tr><td>badge-max-count  <font color="#1989fa" size="2">V2.0.1</font> </td>  <td>number、string</td>  <td>徽标数最大数字限制,超过这个数字将变成badgeMaxCount+,如果传空字符串则不设置</td> <td>99</td></tr>
	<tr><td>title-style</td>  <td>object</td>  <td>自定义标题样式</td> <td>-</td></tr>
	<tr><td>title-class</td>  <td>string</td>  <td>自定义标题类名</td> <td>-</td></tr>
	<tr><td>icon-type</td>  <td>string</td>  <td>图标图案，为uniapp扩展组件（uni-ui）下的uni-icons的type值，customPrefix用法等同</td> <td>-</td></tr>
	<tr><td>icon-size</td>  <td>number、string</td>  <td>图标大小</td> <td>16</td></tr>
	<tr><td>custom-prefix</td>  <td>string</td>  <td>自定义图标</td> <td>-</td></tr>
	<tr><td>image-src</td>  <td>string</td>  <td>图片路径</td> <td>-</td></tr>
	<tr><td>image-mode</td>  <td>string</td>  <td>图片裁剪、缩放的模式，为uniapp内置组件->媒体组件—>image下的mode属性的可选值</td> <td>-</td></tr>
	<tr><td>position</td>  <td>string</td>  <td>在有图标或图片的情况下，标题围绕它们所在的位置，可选值：left、top、bottom</td> <td>right</td></tr>
</table>

<div id="tabsEvents" ></div>

## Tabs Events
<table>
	<tr><th style="width:140px;">事件名</th><th>说明</th><th>回调参数</th></tr>
	<tr><td>click</td>  <td>点击标签时触发</td>  <td>name：标识符，title：标题</td></tr>
	<tr><td>change</td>  <td>当前激活的标签改变时触发</td>  <td>name：标识符，title：标题</td></tr>
	<tr><td>disabled</td>  <td>点击被禁用的标签时触发</td>  <td>name：标识符，title：标题</td></tr>
	<tr><td>rendered</td>  <td>标签内容首次渲染时触发（仅在开启延迟渲染后触发）</td>  <td>name：标识符，title：标题</td></tr>
	<tr>
		<td>sticky-change  <font color="#1989fa" size="2">V2.0.1</font> </td>  
		<td>吸顶时触发，仅在 sticky 模式下生效</td>  
		<td>{ isFixed: 是否吸顶 }</td>
	</tr>
	<tr><td>loaded <font color="#1989fa" size="2">V2.0.6</font></td>  <td>组件内部初始化完成后调用</td>  <td> - </td> </tr>
	<tr><td>slide-change <font color="#1989fa" size="2">V2.0.9</font></td>  <td>内容页滑动时触发（仅barAnimateMode为linear、worm、worm-ease时有效）</td>  <td>  { dx：滑动距离； rate：当前滑动长度占滑动区域的比例；targetIndex：目标下标；} </td> </tr>
	<tr><td>slide-end <font color="#1989fa" size="2">V2.1.4</font></td>  <td>内容页滑动结束时触发（仅barAnimateMode为linear、worm、worm-ease时有效）</td>  <td>  { targetIndex: 目标下标 } </td> </tr>
</table>

<div id="tabsSlots" ></div>

## Tabs Slots
<table>
	<tr><th style="width:140px;">名称</th><th>说明</th></tr>
	<tr><td>nav-left</td>  <td>标题左侧内容</td></tr>
	<tr><td>nav-right</td>  <td>标题右侧内容</td></tr>
	<tr><td>title+下标</td>  <td>标签标题，插槽名默认为"title"+tab下标（注意：vue3中仅H5、app-vue有效，小程序端无效）</td></tr>
	<tr><td>bar <font color="#1989fa" size="2">V2.0.1</font></td>  <td>滑块，可自定义滑块的内容(可以设置图片等)</td></tr>
</table>
	
 <div id="tabSlots" > </div>
 
 ## Tab Slots
  <table>
  	<tr><th style="width:140px;">名称</th><th>说明</th></tr>
  	<tr><td>default</td>  <td>标签页内容</td></tr>
  </table>

 <div id="tabsMethod" ></div>
 
 ## Tabs Methods
 通过 ref 可以获取到 Tabs 实例并调用实例方法(如果是vue3的组合式API,请使用vue3的写法)；
 <table>
 	<tr><th style="width:140px;">方法名</th><th>说明</th><th>参数</th><th>返回值</th></tr>
 	<tr><td>resize</td>  <td>外层元素大小、标签数量变化、滑块错位以及标签定位不准时，可以调用此方法来触发组件内部初始化进行调整</td>  <td>callback: 回调函数</td> <td>-</td></tr>
	<tr><td>reset</td>  <td>重置组件的一些状态，并调用了resize方法进行数据初始化</td>  <td>callback: 回调函数</td> <td>-</td></tr>
	<tr><td>scrollTo</td>  <td> 滚动到指定的标签页，在滚动导航模式下可用</td>  <td>name: 标识符</td> <td>-</td></tr>
	<tr><td>setDx</td>  <td> 设置滑块的水平偏移量（结合swiper组件的@transition事件，设置滑块的位置；经过测试，仅在App、H5、微信、支付宝、字节跳动、QQ小程序上有良好的效果）</td>  <td>dx: swiper组件的e.detail.dx</td> <td>-</td></tr>
	<tr><td>unlockDx</td>  <td> 解除对setDx()的锁定（结合swiper组件的@animationfinish事件，在动画完成后不锁定setDx）</td>  <td>-</td> <td>-</td></tr>
</table>

  <div id="beCareful" ></div>
  
## 注意事项及常见问题
  


### 组件从隐藏状态切换到显示状态时，底部条位置错误？
Tabs 组件在挂载时，会获取自身的宽度，并计算出底部条的位置。如果组件一开始处于隐藏状态，则获取到的宽度永远为 0，因此无法展示底部条位置。
#### 解决方法
方法一，如果是使用 `v-show` 来控制组件展示的，则替换为 `v-if` 即可解决此问题：
```html
<!-- Before -->
<y-tabs v-show="show" />
<!-- After -->
<y-tabs v-if="show" />
```
方法二，调用组件的 resize 方法来主动触发重绘：
```html
<y-tabs v-show="show" ref="tabs" />

```
```javascript
this.$refs.tabs.resize();
```

### 标签选中后，样式变化可能会导致底部条错误
对于选中的标签，在放大字体的同时添加了过渡样式且有过渡时长，会使标签宽高发生变化，导致内部对于滑块的位置计算错误
#### 解决方法
 * 可以考虑给每一个标签通过`title-style`设定固定宽高，避免标签文字放大后标签宽高变化
 * 如果没有过渡效果，设置`is-dynamic`即可解决滑块错误的问题，否则有过渡时长使用了该属性也难以保证滑块位置计算正确



### 如何解决上下滑动与左右滑动相冲突？

  * 直接给标签内容具体的高度，使用`scroll-view`实现局部滚动 <font color="#1989fa" size="1">案例 ：滑动切换</font>
  * 但是该方式会导致页面级的上拉加载与下拉刷新事件无法触发，因此需要去插件市场找类似的插件



### 切换标签时页面会闪烁？ 
 标签切换后，显示的内容是异步请求获取数据进行渲染的，请给标签内容一个实际的最小高度,避免数据清空后高度回弹有导致页面闪烁
 


### 在u-popup组件中的y-tabs组件需resize一次
对于在`u-popup`中的`tabs`，在弹出层显示后需调用`resize`方法，避免内部计算错误 <font color="#1989fa" size="1">案例 ：在Popup中的标签页</font>

```html
<u-popup :show="show" :round="10" @close="show = false" @open="open">
	<y-tabs ref="tabs" v-model="activeIndex">
	...
	</y-tabs>
</u-popup>
```

```javascript
export default{
	data(){
		return {
			show: false
		}
	},
	methods:{
		open(){
			this.show = true;
			setTimeout(()=> this.$refs.tabs.resize(),1000)
		}
	}
}

```


### uni-data-select组件显示下拉选项时会被遮挡？
受限于tabs组件样式，内容区域使用了`overflow:hidden`,导致`uni-data-select`下拉选项被遮挡，需要给其父容器设置足够的高度才能完整显示

### uni-datetime-picker、uni-popup等使用fixed定位的组件显示位置不对？
由于y-tab使用了```transform: translate(0px, 0px) translateZ(0px);```,需避免fixed元素被y-tab包裹，请放在y-tabs组件的外层

### 如何在自定义组件中修改y-tabs组件的样式？
在微信小程序端，在自定义组件中使用了`y-tabs`，需要设置`styleIsolation: 'shared'`,否则在自定义组件中无法修改`y-tabs`的样式
 
 
### 如何修改y-tabs的样式：
* 如果在`自定义组件`或`页面`中引入了y-tabs，使用 `::v-deep` 在`y-tabs`所在的`页面`进行修改
* 将要修改的样式放在全局样式中，但要给`y-tabs`赋予一个全局唯一的类名，避免全局样式污染
* 仅在微信小程序端，如果自定义组件中使用了`y-tabs`并想修改其样式，需要在自定义组件上配置`styleIsolation: 'shared'`

 ```javascript
export default {
    options: {
        styleIsolation: 'shared'
    },
```


### 如何对激活标签的相邻标签设置样式 ？
 直接可使用`y-tab__prev`与`y-tab__next` 类 <font color="#1989fa" size="1">案例 ：组合导航(侧边栏导航+滚动导航)-仿京东商品分类</font>
 
 
### 侧边栏导航、滚动导航模式

 * 两者内容区域的滚动方式通过`pageScroll`属性控制
 * 为false时，则表示内容页是放在`scroll-view`中实现的局部滚动 <font color="#1989fa" size="1">案例 ：滚动导航(区域滚动) | 侧边栏导航(区域滚动)</font>
 * 为true时，则表示内容区域是在页面上的，跟随页面滚动而滚动(页面级滚动)  <font color="#1989fa" size="1">案例 ：滚动导航(页面级滚动) |  侧边栏导航(页面级滚动)</font>
 * 如何取舍两者之间的使用，根据场景考虑，比如你的标签页上方有banner图，你需要在滚动过程中让标题栏浮动时，则需要页面级滚动,或者需要触发原生的上拉加载、下拉刷新事件也用该方式；
 * 如果你想两种模式在一定高度内滚动，那么就使用局部滚动。
 
 
### 如果标签栏仍出现滚动条，请在全局样式（可放在APP.vue引入的样式文件）中添加如下css：
```scss
// 隐藏scroll-view的滚动条
::-webkit-scrollbar {
    display: none;  
    width: 0 !important;  
    height: 0 !important;  
    -webkit-appearance: none;  
    background: transparent;  
}
```
 
 
 ### 如果在进入页面时又跳转了其他页面，会导致y-tabs内部未初始化完成，因此底部条会错位：
* 场景：进入‘我的’页面，检测到用户未登录，跳转至登录页进行登录后又回到‘我的’页面
* 解决方法如下：

 ```javascript
export default {
   onShow() {
	// 如果进入该页面又跳转了其他页面，则在onShow中resize一下组件，避免跳转其他页面时tabs内部未初始化完成
	this.$refs?.tabs?.resize()
},
```

 
 