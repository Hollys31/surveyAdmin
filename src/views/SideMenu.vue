<template>
    <div class="side-menu">
        <div class="title">农房确权发证信息录入系统</div>
        <ul class="menu-list iconfont">
            <router-link tag="li" :to="{ name: 'home' }"><span>&#xe602; 首页</span></router-link>
            <router-link tag="li" :to="{ name: 'audit' }"><span>&#xe71e; 信息审计</span></router-link>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'SideMenu',
}
</script>

<style lang="scss" scoped>
.side-menu {
    position: fixed;
    width: 200px;
    height: 100%;
    background-color: #283643;
    color: #fff;
    z-index: 9;
    .title {
        font-size: 23px;
        padding: 30px;
        line-height: 30px;
    }
    .menu-list {
        >li {
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            user-select: none;
            >span {
                display: block;
                margin-right: 30px;
                padding-left: 50px;
                border-radius: 0 20px 20px 0;
                transition: all 0.3s ease-out;
            }
        }
        .active {
            >span {
                background-color: #00BBDC;
            }
        }
    }
}
</style>
