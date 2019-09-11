<template>
    <div class="top-menu">
        <div class="user-name iconfont">
            <span>&#xe630;</span>
            <span>您好，{{userName}}</span>
        </div>
        <div class="exit" @click="exit()"><span class="iconfont">&#xe66a;</span> 退出</div>
    </div>
</template>

<script>
export default {
    name: 'TopMenu',
    props: {
        userName: {type: String, default: '' }
    },
    methods: {
        exit () {
            const that = this
            that.$emit('loading')
            const local = localStorage
            //local.removeItem('oun')
            //local.removeItem('oup')
            local.removeItem('token')
            //local.removeItem('auto_login')
            that.$get({url: '/api/user/logout'}).then(res => { //退出登录
                that.$router.push('login')
                that.$emit('loaded')
                that.$msg({type:'ok', text: '已退出登录！'})
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.top-menu {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    align-items: center;
    background-color: #fff;
    color: #283643;
    box-shadow: 0 1px 6px 1px rgba(0, 0, 0, 0.1);
    z-index: 8;
    .user-name {
        display: flex;
        position: absolute;
        top: 0;
        right: 120px;
        height: 60px;
        padding: 0 10px;
        line-height: 60px;
        color: #919191;
        >span {
            margin-left: 10px;
            display: block;
            &:nth-child(1) {
                font-size: 24px;
                &:hover {
                    color: #00BBDC;
                }
            }
        }
    }
    .exit {
        display: flex;
        position: absolute;
        top: 0;
        right: 20px;
        width: 80px;
        height: 60px;
        line-height: 60px;
        color: #919191;
        cursor: pointer;
        text-align: center;
        user-select: none;
        font-size: 16px;
        >span {
            display: block;
            font-size: 20px;
            margin-right: 10px;
        }
        &:hover {
            color: #00BBDC;
        }
    }
}
</style>
