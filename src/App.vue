<template>
    <div id="app">
        <TopMenu @loading="showSpinner = true" @loaded="showSpinner = false" :userName="userName" />
        <SideMenu />
        <div class="content" :style="'height: ' + (winSize.h - 110) + 'px'">
            <Scroll>
                <router-view class="main" @user="userName = arguments[0]" :winSize="winSize" @loading="showSpinner = true" @loaded="showSpinner = false" />
            </Scroll>
        </div>
        <div class="page-bottom">©CopyRight{{(new Date()).getFullYear()}} 江西裕丰智能农业科技有限公司 版权所有</div>
        <Spinner v-show="showSpinner" />
    </div>
</template>

<script>
    import TopMenu from '@/views/TopMenu.vue'
    import SideMenu from '@/views/SideMenu.vue'
    import Spinner from '@/components/Spinner'
    export default {
        name: 'app',
        components: { TopMenu, SideMenu, Spinner },
        data() {
            return {
                showSpinner: false,
                winSize: {w: 0, h: 0},
                userName: localStorage.getItem('user_name'),
            }
        },
        mounted () {
            const that = this
            that.getWinSize()
            window.addEventListener('resize', function() { that.getWinSize() })
        },
        methods: {
            getWinSize (){
                const that = this
                that.winSize.w = window.innerWidth
                that.winSize.h = window.innerHeight
            }
        }
    }
</script>

<style lang="scss">
    html,
    body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        font-size: 14px;
        overflow: hidden;
    }

    ul,
    p,
    h1,
    h2,
    h3 {
        margin: 0;
        padding: 0;
    }

    ul {
        list-style: none;
    }
    @font-face {
    font-family: 'iconfont';  /* project id 1322154 */
        src: url('//at.alicdn.com/t/font_1322154_9e5ip0dfgmf.eot');
        src: url('//at.alicdn.com/t/font_1322154_9e5ip0dfgmf.eot?#iefix') format('embedded-opentype'),
        url('//at.alicdn.com/t/font_1322154_9e5ip0dfgmf.woff2') format('woff2'),
        url('//at.alicdn.com/t/font_1322154_9e5ip0dfgmf.woff') format('woff'),
        url('//at.alicdn.com/t/font_1322154_9e5ip0dfgmf.ttf') format('truetype'),
        url('//at.alicdn.com/t/font_1322154_9e5ip0dfgmf.svg#iconfont') format('svg');
    }
    .iconfont {
        font-style: normal;
        font-family: "iconfont";
        user-select: none;
    }
    @keyframes msg-in-out {
        0% {
            top: -60px;
            margin-left: -150px;
            opacity: 1;
            z-index: 999;
        }
        10% {
            top: inherit;
            margin-left: -150px;
            opacity: 1;
            z-index: 999;
        }
        80% {
            top: inherit;
            margin-left: -150px;
            opacity: 1;
            z-index: 999;
        }
        100% {
            top: inherit;
            margin-left: -300px;
            opacity: 0;
            z-index: 999;
        }
    }
    .app-message {
        display: flex;
        opacity: 0;
        position: absolute;
        top: -60px;
        left: 50%;
        width: 260px;
        height: 30px;
        line-height: 30px;
        padding: 10px 20px;
        margin: 20px 0;
        margin-left: -150px;
        z-index: -1;
        background-color: #fff;
        color: #FFD522;
        border-radius: 4px;
        box-shadow: 1px 2px 5px 1px rgba(0, 0, 0, 0.3);
        transition: all 0.5s ease-in;
        animation: msg-in-out 5s;
        >span {
            display: block;
            &:first-child {
                font-size: 24px;
                margin-right: 10px;
            }
            &:last-child {
                font-size: 16px;
                text-align: center;
            }
        }
    }
    .app-message-ok {
        color: #52C41A;
    }
    .app-message-error {
        color: #EB7762;
    }
    .app-message-warning {
        color: #FA4141;
    }

    #app {
        height: 100%;
        font-family: "Microsoft YaHei", "Helvetica Neue", "Helvetica", "Arial",
            "sans-serif";
        background-color: #eaecf2;
        font-size: 16px;
        color: #fff;
        .content {
            position: relative;
            top: 70px;
            left: 0;
            height: calc(100% - 110px);
            margin: 0 0 0 210px;
            background-color: #fff;
            border-radius: 6px;
            overflow: hidden;
            &::before {
                position: absolute;
                top: 0;
                right: 0;
                content: "";
                width: 10px;
                height: 100%;
                background-color: #eaecf2;
                z-index: 1;
            }
            &::after {
                position: absolute;
                bottom: 0;
                left: 0;
                content: "";
                height: 10px;
                width: 100%;
                background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
            }
            .main {
                width: calc(100% - 10px);
            }
            .login {
                &::before {
                    display: none;
                }
            }
        }
        .page-bottom {
            position: fixed;
            bottom: 0;
            left: 0;
            font-size: 14px;
            width: calc(100% - 220px);
            margin: 10px 10px 0 210px;
            line-height: 40px;
            text-align: center;
            color: #666;
        }
    }
</style>
