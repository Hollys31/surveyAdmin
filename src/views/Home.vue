<template>
    <div class="home">
        <div class="section total">
            <h2>总体数据</h2>
            <ul>
                <li>
                    <div>
                        覆盖村落<br />
                        <span>{{total.village}}（个）</span>
                    </div>
                </li>
                <li>
                    <div>
                        已采集资料<br />
                        <span>{{total.gather}}（条）</span>
                    </div>
                </li>
                <li>
                    <div>
                        已下载资料<br />
                        <span>{{total.download}}（条）</span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="section qrcode">
            <h2>信息采集标签</h2>
            <div class="qrcode-img" @click="showPopup = true">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <img :src="QRcode" alt="">
            </div>
            <div class="qrcode-tip">点击二维码下载标签</div>
        </div>
        <Popover  v-show="showPopup" @close="showPopup = false" :title="'下载二维码'">
            <img class="qrcode-img" ref="qrcode" :src="QRcode" alt="" crossorigin="anonymous">
            <div class="tips">唐江村房屋信息采集二维码</div>
            <div class="tips">（微信识别二维码，提交资料）</div>
            <a :href="QRcode" download="屋信息采集二维码" ><div class="download-button">立即下载</div></a>
        </Popover>
    </div>
</template>

<script>
    import Popover from '@/components/Popover.vue'
    export default {
        name: 'Home',
        components: { Popover },
        data () {
            return {
                total: {village: 0, gather: 0, download: 0},
                QRcode: '/img/wx_qrcode.jpg',
                showPopup: false
            }
        },
        mounted () {
            this.getTotal()
        },
        methods: {
            getTotal () {
                const that = this
                that.$get({url: '/api/house/statistics'}).then(res => {
                    let total = {village: 0, gather: 0, download: 0}
                    if(parseInt(res.status) === 200 && res.data) {
                        total.village = res.data.villageCount
                        total.gather = res.data.dataCount
                        total.download = res.data.downloadCount
                    }else {
                        that.$msg({type:'error', text: res.msg})
                    }
                    that.total = total
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
.home {
    background-color: #fff;
    color: #373737;
    .section {
        >h2 {
            position: relative;
            padding-left: 30px;
            font-size: 20px;
            line-height: 60px;
            background-color: #F5F5F5;
            &::before {
                position: absolute;
                top: 18px;
                left: 15px;
                content: '';
                width: 1px;
                height: 24px;
                background-color: #00BBDC;
                box-shadow: 0 0 1px 0.5px #00BBDC;
            }
        }
    }
    .total{
        >ul {
            display: flex;
            position: relative;
            &::before {
                position: absolute;
                top: 25px;
                left: calc(33.33333333333% - 1px);
                content: '';
                width: 2px;
                height: 50px;
                background-color: #ddd;
            }
            &::after {
                position: absolute;
                top: 25px;
                left: calc(66.66666666666% - 1px);
                content: '';
                width: 2px;
                height: 50px;
                background-color: #ddd;
            }
            >li {
                width: 33.3333%;
                height: 100px;
                >div {
                    width: 100px;
                    padding-left: 40px;
                    margin: 20px auto;
                    line-height: 30px;
                    text-align: center;
                    background-position: 0 center;
                    background-repeat: no-repeat;
                    background-size: 32px 32px;
                }
                &:nth-child(1) {
                    >div {
                        >span {
                            color: #559AFE;
                        }
                        background-image: url('../assets/img/1.png');
                    }
                }
                &:nth-child(2) {
                    >div {
                        >span {
                            color: #81D127;
                        }
                        background-image: url('../assets/img/2.png');
                    }
                }
                &:nth-child(3) {
                    >div {
                        >span {
                            color: #22C3E2;
                        }
                        background-image: url('../assets/img/3.png');
                    }
                }
            }
        }
    }
    .qrcode {
        .qrcode-img {
            position: relative;
            width: 360px;
            height: 360px;
            margin: 40px auto 0 auto;
            cursor: pointer;
            >i {
                position: absolute;
                display: block;
                width: 30px;
                height: 30px;
                background-color: #00BBDC;
                &:nth-child(1) {
                    top: -2px;
                    left: -2px;
                }
                &:nth-child(2) {
                    top: -2px;
                    right: -2px;
                }
                &:nth-child(3) {
                    bottom: -2px;
                    left: -2px;
                }
                &:nth-child(4) {
                    bottom: -2px;
                    right: -2px;
                }
            }
            >img {
                position: relative;
                display: block;
                width: calc(100% - 40px);
                height: calc(100% - 40px);
                padding: 20px;
                background-color: #fff;
            }
        }
        .qrcode-tip {
            text-align: center;
            font-size: 20px;
            font-weight: 600;
            line-height: 60px;
        }
    }
    .qrcode-img {
        display: block;
        width: 300px;
        height: 300px;
        margin: auto;
    }
    .tips {
        font-size: 20px;
        font-weight: 600;
        letter-spacing: 3px;
        line-height: 30px;
        text-align: center;
    }
    a {
        text-decoration: none;
    }
    .download-button {
        width: 150px;
        height: 40px;
        line-height: 40px;
        background-color: #00BBDC;
        color: #fff;
        font-size: 20px;
        text-align: center;
        margin: 25px auto 0 auto;
        border-radius: 4px;
        cursor: pointer;
        text-decoration: none;
    }
}
</style>
