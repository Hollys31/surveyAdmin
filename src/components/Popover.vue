<template>
    <div class="popover">
            <div class="popup-content" :style="'top: ' + top + 'px;width: ' + width + 'px;margin-left: -' + width/2 + 'px;'">
                <div class="popup-title">{{title}}</div>
                <div class="close iconfont" @click="$emit('close')">&#xe610;</div>
                <div class="user-content" ref="userPanel">
                    <Scroll>
                        <slot></slot>
                    </Scroll>
                </div>
            </div>
    </div>
</template>

<script>
import { setTimeout } from 'timers';

export default {
    name: 'Popover',
    props: {
        title: {type: String, default: '标题'},
        width: {type: Number, default: 560},
        top: {type: Number, default: 70},
    },
    data () {
        return {
            height: 0,
        }
    },
    mounted () {
        const that = this
        const height = that.$refs.userPanel.getBoundingClientRect().height
        const maxHeight = window.innerHeight - 170
        if(height > maxHeight) {
            that.$refs.userPanel.setAttribute('style', 'height:' + (maxHeight - 60) + 'px;')
        }
    }
}
</script>

<style lang="scss" scoped>
    .popover {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 10;
        user-select: none;
        .popup-content {
            position: absolute;
            top: 0;
            left: 50%;
            width: 560px;
            margin-left: -290px;
            border-radius: 10px;
            overflow: hidden;
            background-color: #fff;
            .popup-title {
                line-height: 60px;
                background-color: #00BBDC;
                font-size: 24px;
                letter-spacing: 2px;
                text-align: center;
                color: #fff;
            }
            .close {
                position: absolute;
                top: 10px;
                right: 10px;
                width: 40px;
                height: 40px;
                font-size: 30px;
                text-align: center;
                line-height: 40px;
                color: #fff;
                cursor: pointer;
            }
            .user-content {
                padding: 30px;
                overflow: hidden;
            }
        }
    }
</style>