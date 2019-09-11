<template>
    <div class="picture-viewer">
        <div class="picture" ref="picture">
            <img ref="img" src="" alt="">
        </div>
        <div class="ctrl iconfont">
            <div @click="loadPicture(active - 1)">&#xe696;</div>
            <div @click="loadPicture(active + 1)">&#xe727;</div>
        </div>
        <ul class="item-list">
            <li v-for="(item, i) in data" :key="i" @click="loadPicture(i)" :style="i === active ? 'background-color: rgba(255, 255, 255, 0.5)' : ''"></li>
        </ul>
        <div class="zoom iconfont">
            <div class="zoom-out" @click="changeZoom(parseInt(percent/25) * 25 - 25)" :style="percent === 25 ? 'color: #aaa' : ''">&#xe601;</div>
            <div class="Slider" ref="ctrlBar">
                <div class="progress" :style="'width: ' + (percent === 25 ? 0 : percent) + 'px'"></div>
                <div class="ctrl-bar" ref="ctrlPoint" :style="'left: ' + (percent === 25 ? 0 : percent - 16) + 'px'"></div>
            </div>
            <div class="zoom-in" @click="changeZoom(parseInt(percent/25) * 25 + 25)" :style="percent === 200 ? 'color: #aaa' : ''">&#xe604;</div>
            <div class="percent">{{percent}} %</div>
            <div class="rotate iconfont" @click="rotate">&#xe636;</div>
        </div>
        <div class="close iconfont" @click="$emit('close')">&#xe610;</div>
    </div>
</template>

<script>
export default {
    name: 'PictureViewer',
    props: {
        data: {type: Array, default: () => {return [{name: '', url: ''}]}},
        index: {type: Number, default: 0},
    },
    data () {
        return {
            postion: {x: 0, y: 0}, //当前图片的位置
            fullSize: null, //图片实际大小
            active: 0, //当前图片数组下标
            percent: 100, //放大缩小百分比
            rotationAngle: 0, //旋转角度
        }
    },
    mounted () {
        const that = this
        that.active = that.index
        that.loadPicture(that.index)
        that.eventListener()
        that.ctrlBarEvent()
    },
    methods: {
        loadPicture (index) { //加载图片
            const that = this
            if(index < 0) {
                index = that.active = that.data.length - 1
            }else if(index >= that.data.length) {
                index = that.active = 0
            }else {
                that.active = index
            }
            if(that.fullSize){
                that.changeZoom(100)
            }
            const img = that.$refs.img
            const picture = that.$refs.picture
            img.onload = function() {
                const style = picture.getBoundingClientRect()
                that.fullSize = {w: style.width, h: style.height}
                that.postion = {x: (window.innerWidth - style.width) / 2, y: (window.innerHeight - style.height) / 2}
                picture.setAttribute('style', 'left: ' + that.postion.x + 'px; top: ' + that.postion.y + 'px;')
            }
            img.src = that.data[index].url
        },
        eventListener () { //监听事件
            const that = this
            const picture = that.$refs.picture
            let onmove = false
            let x = 0
            let y = 0
            picture.addEventListener('mousedown', function(e) { x = e.clientX; y = e.clientY; onmove = true })
            picture.addEventListener('mouseup', function() { onmove = false })
            picture.addEventListener('mouseout', function() { onmove = false })
            picture.addEventListener('mousemove', function(e) { 
                if(onmove) {
                    const movementX = e.clientX - x
                    const movementY = e.clientY - y
                    x = e.clientX
                    y = e.clientY
                    const offsetX = ( e.movementX | movementX ) + that.postion.x
                    const offsetY = ( e.movementY | movementY ) + that.postion.y
                    that.postion = {x: offsetX, y: offsetY}
                    picture.style.left = offsetX + 'px'
                    picture.style.top = offsetY + 'px'
                } 
            })
        },
        ctrlBarEvent () { //缩放滑杆事件监听
            const that = this
            const ctrlPoint = that.$refs.ctrlPoint
            let onmove = false
            let x = 0
            ctrlPoint.addEventListener('mousedown', function(e) { x = e.clientX; onmove = true })
            document.addEventListener('mouseup', function() { onmove = false })
            document.addEventListener('mousemove', function(e) { 
                if(onmove) {
                    const movementX = e.clientX - x
                    x = e.clientX
                    const percent = ( e.movementX | movementX ) + that.percent
                    if(percent < 25) {
                        that.percent = 25
                    }else if(percent > 200) {
                        that.percent = 200
                    }else {
                        that.percent = percent
                        that.changeZoom(percent)
                    }
                } 
            })
        },
        changeZoom (percent) {
            const that = this
            if(percent < 25 || percent > 200) return
            that.percent = percent
            const img = that.$refs.img
            const picture = that.$refs.picture
            const w = that.fullSize.w * percent / 100
            const h = that.fullSize.h * percent / 100
            that.postion = {x: (window.innerWidth - w) / 2, y: (window.innerHeight - h) / 2}
            img.setAttribute('style', 'width: ' + w + 'px;height: ' + h + 'px;')
            picture.setAttribute('style', 'left: ' + that.postion.x + 'px; top: ' + that.postion.y + 'px;')
        },
        rotate () {
            const that = this
            const picture = that.$refs.picture
            that.rotationAngle < 360 ? that.rotationAngle += 90 : that.rotationAngle = 90
            picture.style.transform = 'rotate(' + that.rotationAngle + 'deg)'
        }
    }
}
</script>

<style lang="scss" scoped>
.picture-viewer {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.5);
    overflow: hidden;
    .picture {
        position: absolute;
        user-select: none;
        >img {
            display: block;
        }
        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            cursor: move;
        }
    }
    .close {
        position: absolute;
        top: 0;
        right: 20px;
        width: 60px;
        height: 60px;
        line-height: 60px;
        font-size: 40px;
        text-align: center;
        color: #fff;
        cursor: pointer;
    }
    .ctrl {
        font-size: 40px;
        line-height: 60px;
        >div {
            position: absolute;
            top: 50%;
            width: 40px;
            height: 60px;
            margin-top: -30px;
            color: #ddd;
            cursor: pointer;
            &:hover {
                color: #fff;
            }
            &:first-child {
                left: 30px;
            }
            &:last-child {
                right: 30px;
            }
        }
    }
    .item-list {
        position: absolute;
        width: 100%;
        bottom: 50px;
        display: flex;
        justify-content: center;
        >li {
            width: 16px;
            height: 16px;
            margin: 0 5px;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 100%;
            transition: all 0.3s ease-in-out;
            cursor: pointer;
        }
    }
    .zoom {
        position: absolute;
        display: flex;
        width: 100%;
        top: 20px;
        justify-content: center;
        color: #fff;
        font-size: 20px;
        line-height: 20px;
        .zoom-out, .zoom-in {
            cursor: pointer;
        }
        .Slider {
            position: relative;
            width: 200px;
            height: 8px;
            margin: 6px 10px;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 4px;
            .progress {
                width: 50px;
                height: 8px;
                background-color: rgba(255, 255, 255, 0.7);
                border-radius: 4px;
            }
            .ctrl-bar {
                position: absolute;
                top: -4px;
                left: 34px;
                width: 16px;
                height: 16px;
                border-radius: 100%;
                background-color: #fff;
                cursor: move;
            }
        }
        .percent {
            width: 50px;
            margin-left: 10px;
            text-align: left;
            font-size: 14px;
        }
        .rotate {
            cursor: pointer;
        }
    }
}
</style>
