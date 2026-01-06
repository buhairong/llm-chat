<script setup>
import { reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { fetchEventSource } from '@microsoft/fetch-event-source';

let messages = reactive([])
let chatList = reactive([])
const chatIndex = ref(0)
const userInput = ref("")

function send() {
	messages.push({
		role: 'user',
		content: userInput.value
	})
	
	userInput.value = ''
	
	// bce-v3/ALTAK-70ouDlcS3WIdV6HEETNpZ/853d9711854a2f130f725bca613e1a59b39a3161
	// uni.request({
	// 	url: 'https://qianfan.baidubce.com/v2/chat/completions',
	// 	method: "POST",
	// 	header: {
	// 		'Content-Type': 'application/json',
	// 		Authorization: 'Bearer bce-v3/ALTAK-70ouDlcS3WIdV6HEETNpZ/853d9711854a2f130f725bca613e1a59b39a3161'
	// 	},
	// 	data: {
	// 		model: "ernie-3.5-8k",
	// 		messages,
	// 		stream:true
	// 	}
	// }).then(res => {
	// 	console.log(res)
	// 	messages.push(res.data.choices[0].message)
	// 	console.log('messages',messages)
	// 	chatList[chatIndex.value] = messages
	// 	uni.setStorageSync("chat-list", chatList)
	// })
	
	let lastMsg = {}
	
	fetchEventSource('https://qianfan.baidubce.com/v2/chat/completions', {
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/json',
			Authorization: 'Bearer bce-v3/ALTAK-70ouDlcS3WIdV6HEETNpZ/853d9711854a2f130f725bca613e1a59b39a3161'
	    },
	    body: JSON.stringify({
	        model: "ernie-4.5-turbo-128k",
	        messages,
	        stream:true
	    }),
		onmessage(ev) {
			console.log(ev.data);
			const res = JSON.parse(ev.data)
			if(res.finish_reason === 'stop') {
				uni.setStorageSync("chat-list", chatList)
			} else {
				if(lastMsg.content) {
					lastMsg.content += res.choices[0].delta.content
				} else {
					messages.push({
						role: 'assistant',
						content: res.choices[0].delta.content
					})
					lastMsg = messages[messages.length-1]
				}
				
				
			}
		}
	});
}

function handleBack() {
	uni.navigateBack()
}

onLoad((options) => {
	console.log('options',options)
	const res = uni.getStorageSync("chat-list")
	console.log('res',res)
	if(res) {
		if(options.index) {
			chatIndex.value = +options.index
			messages = res[+options.index]
		}
		chatList = res
	}
	chatList.push(messages)
	console.log('chatList',chatList)
}) 
</script>

<template>
	<view class="page">
		<view class="nav-bar">
			<view class="icon-btn" @click="handleBack">
				<image class="icon" src="/static/back.svg" />
			</view>
			
			<view class="title">
				<view class="main">新的聊天</view>
				<view class="second">共{{messages.length}}条对话</view>
			</view>
			
			<view class="icon-btn">
				<view class="icon share"></view>
			</view>
		</view>
		
		<view class="message-list">
			<view class="message" v-for="(message, index) in messages" :key="index" :class="message.role">
				{{message.content}}
			</view>
		</view>
		
		
		<view class="footer">
			<view class="input-group">
				<textarea class="input" v-model="userInput"  />
				
				<view class="send-btn" @click="send">
					<view class="icon send"></view>
					<view class="text">发送</view>
				</view>
			</view>
		</view>
	</view>
	
</template>

<style scoped>
	.page {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
	
	.message-list {
		flex: 1;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	
	.message {
		padding: 20rpx;
		background-color: rgba(0, 0, 0, .05);
		border: 1rpx solid #dedede;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}
	
	.user {
		background-color: #e7f8ff;
		align-self: flex-end;
	}
	
	.nav-bar {
		padding: 28rpx 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #dedede;
		/* #ifndef MP */
			margin-top: 0;	
		/* #endif */
		/* #ifdef MP */
			margin-top: 200rpx;	
		/* #endif */
	}       
	
	.icon-btn {
		padding: 32rpx;
		border-radius: 20rpx;
		border: 2rpx solid #dedede;
	}
	
	.icon {
		width: 32rpx;
		height: 32rpx;
	}
	
	.back {
		background-image: url(/static/back.svg);
	}
	
	.share {
		background-image: url(/static/share.svg);
	}
	
	.title {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.main {
		font-size: 40rpx;
		font-weight: 600;
	}
	
	.second {
		font-size: 28rpx;
	}
	
	.footer {
		padding: 28rpx 40rpx;
		border-top: 1rpx solid #dedede;
	}
	
	.input-group {
		padding: 28rpx 20rpx;
		border: 1rpx solid #dedede;
		border-radius: 20rpx;
		display: flex;
		gap: 8rpx;
	}
	
	.input {
		flex: 1;
		height: 80rpx;
	}
	
	.send-btn {
		padding: 32rpx;
		border-radius: 20rpx;
		background-color: #1d93ab;
		color: #fff;
		display: flex;
		align-items: center;
		gap: 8rpx;
	}
	
	.send {
		background-image: url(/static/send.svg);
	}
</style>
