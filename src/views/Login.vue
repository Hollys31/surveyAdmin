<template>
    <div class="login">
        <div>
            <div class="web-name">农房确权发证信息录入系统</div>
            <div class="login-form">
                <div>
                    <label class="user-name" for="uname">
                        <span class="iconfont">账号</span>
                        <span class="tips">{{uTips}}</span>
                        <input id="uname" v-model="userName" type="text" placeholder="输入您的账号" autofocus="autofocus" autocomplete="off"  maxlength="50" tabindex="1">
                    </label>
                    <label class="user-password" for="upass">
                        <span class="iconfont">密码</span>
                        <span class="tips">{{pTips}}</span>
                        <input id="upass" v-model="password" type="password"  placeholder="输入您的密码" autocomplete="new-password">
                    </label>
                    <div class="auto-login" @click="remember = !remember"><span class="iconfont">{{remember ? '&#xe670;' : ''}}</span>记住密码</div>
                    <div class="login-button" @click="login()">登录</div>
                    <div v-if="message" class="message">{{message}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ttof, ftot} from '@/lib/util'
export default {
    name: 'Login',
    data () {
        return {
            message: '',
            userName: '',
            password: '',
            remember: false, //记住密码
            uTips: '',
            pTips: '',
        }
    },
    mounted () {
        const that = this
        const userName = ftot(localStorage.getItem('oun'))
        const password = ftot(localStorage.getItem('oup'))
        that.remember = localStorage.getItem('auto_login')
        if(userName != null) {
            that.userName = userName
        }
        if(password != null) {
            that.password = password
        }
        document.onkeydown = function(){
            if(window.event.keyCode === 13 && /login/.test(document.URL)){
                that.login()
            }
        }
        that.$emit('loaded')
    },
    methods: {
        login () {
            const that = this
            const local = localStorage
            if(!that.verify()) return
            that.$emit('loading')

            if(that.remember) {
                local.setItem('oun', ttof(that.userName))
                local.setItem('oup', ttof(that.password))
                local.setItem('auto_login', true)
            }else {
                local.removeItem('oun')
                local.removeItem('oup')
                local.removeItem('auto_login')
            }

            const userInput = {
                type: 'web',
                account: that.userName,
                password: that.password
            }
            that.$get({url: '/api/user/login', data: userInput}).then(res => {
                if(parseInt(res.status) === 200) {
                    const userName = res.data ? res.data.nickName : '用户'
                    local.setItem('user_name', userName )
                    that.$router.push('home')
                    that.$emit('user', userName)
                    that.$msg({type:'', text: userName + '，欢迎您登录！'})
                }else {
                    that.$msg({type:'error', text: res.msg})
                }
                that.$emit('loaded')
            })
        },
        verify() {
            const that = this
            if(!that.userName) {
                that.$msg({type:'warning', text: '请填写用户名！'})
                return false
            }

            if(!that.password) {
                that.$msg({type:'warning', text: '请输入密码！'})
                return false
            }
            return true
        },
    }
}
</script>

<style lang="scss" scoped>
.login {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    background-color: #fff;
    background-position: 0, 0;
    background-size: 100% 100%;
    background-image: url('../assets/img/login_bg.jpg');
    font-size: 16px;
    user-select: none;
    z-index: 99;
    >div {
        position: absolute;
        top: 25%;
        right: 10%;
        width: 420px;
        .web-name {
            padding-bottom: 30px;
            text-align: center;
            font-size: 32px;
        }
        .login-form {
            >div {
                padding: 20px 30px;
                background-color: #fff;
                border-radius: 8px;
                .auto-login {
                    position: relative;
                    line-height: 20px;
                    padding: 0 0 20px 26px;
                    cursor: pointer;
                    color: #777;
                    >span {
                        position: absolute;
                        left: 0;
                        top: 3px;
                        height: 14px;
                        width: 14px;
                        border-radius: 14px;
                        font-size: 14px;
                        line-height: 14px;
                        text-align: center;
                        border: 1px solid #00BBDC;
                    }
                }
                .login-button {
                    width: 160px;
                    background-color: #019be6;
                    color: #fff;
                    margin: 0 auto;
                    line-height: 40px;
                    text-align: center;
                    font-size: 20px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .message {
                    position: absolute;
                    bottom: 40px;
                    left: 80px;
                    color: #f00;
                    font-size: 12px;
                }
                .user-name, .user-password {
                    position: relative;
                    display: block;
                    height: 100px;
                    line-height: 80px;
                    color: #333;
                    .iconfont {
                        display: block;
                        line-height: 24px;
                    }
                    .tips {
                        position: absolute;
                        left: 10px;
                        bottom: -10px;
                        line-height: 20px;
                        color: #f00;
                        font-size: 12px;
                    }
                    >input {
                        width: 340px;
                        height: 38px;
                        padding: 5px 10px;
                        margin: 10px 0;
                        border: none;
                        background-color: #edf9ff;
                        border-radius: 4px;
                        font-size: 16px;
                        color: #777777;
                    }
                }
            }
        }
    }
}
</style>
