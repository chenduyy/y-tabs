<template>
	<view class="content">
		<view class="banner" auto-focus>
			<image class="banner-img" :src="banner.image_url" mode="scaleToFill"></image>
			<view class="title-area">
				<text class="title-text">{{banner.title}}</text>
			</view>
		</view>
		<view class="article-meta">
			<text class="article-meta-text article-author">{{banner.source}}</text>
			<text class="article-meta-text article-text">发表于</text>
			<text class="article-meta-text article-time">{{banner.datetime}}</text>
		</view>
		<view class="article-content">
			<rich-text :nodes="content" style="font-size: 14px;"></rich-text>
		</view>
		<view class="comment-wrap"></view>
	</view>
</template>

<script>
	import htmlParser from '@/common/html-parser'

	const FAIL_CONTENT = '<p>获取信息失败1</p>';

	function parseImgs(nodes) {
		nodes.forEach(node => {
			if (
				node.name === 'img' &&
				node.attrs &&
				node.attrs['data-img-size-val']
			) {
				const sizes = node.attrs['data-img-size-val'].split(',')
				const width = uni.upx2px(720 * 0.9)
				const height = parseInt(width * (sizes[1] / sizes[0]))
				node.attrs.style = `width:${width};height:${height};`
			}
			if (Array.isArray(node.children)) {
				parseImgs(node.children)
			}
		})
		return nodes
	}

	export default {
		data() {
			return {
				banner: {},
				content: []
			}
		},
		onShareAppMessage() {
			return {
				title: this.banner.title,
				path: '/pagesExample/detail/share?query=' + JSON.stringify(this.banner)
			}
		},
		onLoad(event) {
			// 目前在某些平台参数会被主动 decode，暂时这样处理。

			this.load(event.query);
		},
		methods: {
			load(e) {
				var p = decodeURIComponent(e);
				try {
					this.banner = JSON.parse(p);
				} catch (error) {
					this.banner = JSON.parse(p);
				}

				uni.setNavigationBarTitle({
					title: this.banner.title
				});
				console.log(e);
				this.getDetail();
			},
			getDetail() {
				uni.request({
					url: 'https://unidemo.dcloud.net.cn/api/news/36kr/' + this.banner.post_id,
					success: (result) => {
						let content = FAIL_CONTENT
						if (result.statusCode == 200) {
							content = result.data.content
						}
						const nodes = htmlParser(content);
						// #ifdef APP-PLUS-NVUE
						parseImgs(nodes)
						// #endif
						this.content = nodes
					}
				});
			}
		}
	}
</script>

<style>
	/* #ifndef APP-PLUS */
	page {
		min-height: 100%;
	}

	/* #endif */

	.banner {
		height: 180px;
		position: relative;
		background-color: #ccc;
		flex-direction: row;
		overflow: hidden;
	}

	.banner-img {
		width: 100%;
		flex: 1;
	}

	.title-area {
		position: absolute;
		left: 15px;
		right: 15px;
		bottom: 15px;
		z-index: 11;
	}

	.title-text {
		font-size: 16px;
		font-weight: 400;
		line-height: 20px;
		/* #ifndef MP-KUAISHOU */
		lines: 2;
		/* #endif */
		color: #ffffff;
		overflow: hidden;
	}

	.article-meta {
		padding: 10px 15px;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.article-meta-text {
		color: gray;
	}

	.article-text {
		font-size: 12px;
		line-height: 25px;
		margin: 0 10px;
	}

	.article-author {
		font-size: 15px;
	}

	.article-time {
		font-size: 15px;
	}

	.article-content {
		font-size: 15px;
		padding: 0 15px;
		margin-bottom: 15px;
		overflow: hidden;
	}

	/* #ifdef H5 */

	.article-content {
		line-height: 1.8;
	}

	.article-content img {
		max-width: 100%;
	}

	/* #endif */
</style>