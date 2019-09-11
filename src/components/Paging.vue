<template>
    <div class="paging">
        <ul class="iconfont">
            <li :class="{unactive: pageNum === 1}" @click="toPage('prev')">&#xe696;</li>
            <li v-for=" i in pageArr" :key="i" :class="{active: pageNum === i}" @click="toPage(i)">{{i}}</li>
            <li :class="{unactive: page.count < page.size || pageNum === pageCount}" @click="toPage('next')">&#xe727;</li>
            <span>共{{pageCount}}页</span>
        </ul>
    </div>
</template>

<script>
/**
 * page {count: Number, size: Number}
 * count: 总页数
 * size: 每页数量 默认20
 */
export default {
    name: 'Paging',
    props: {
        page: { type: Object, default: () => { return { count: 0, size: 20 } } },
    },
    data () {
        return {
            pageNum: 1, //当前页
            pageCount: 1, //总页数
            pageArr: [],
        }
    },
    watch: {
        'page' () {
            this.init()
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            const that = this
            const num = parseInt(that.page.count / that.page.size)
            if(num) {
                if(that.page.count % that.page.size) {
                    that.pageCount = num + 1
                }else {
                    that.pageCount = num
                }
            }else {
                that.pageCount = 1
            }
            that.calcPageArr()
        },
        calcPageArr () {
            const that = this
            that.pageArr = []
            let i = that.pageNum
            let max = 8
            if(i > 5 && that.pageCount - i < 5) {
                i = that.pageCount - 4
            }
            i > 5 ? i -= 4 : i = 1
            if(that.pageCount - that.pageNum < 7) {
                i = that.pageCount - 10
                max = 9
            }
            if(i < 0) i = 1
            for(i; i <= that.pageCount; i++) {
                that.pageArr.push(i)
                if(that.pageArr.length > max) {
                    if(that.pageCount - i > 1){
                        that.pageArr.push('...')
                    }
                    if(i != that.pageCount) {
                        that.pageArr.push(that.pageCount)
                    }
                    return
                }
            }
        },
        toPage (page) {
            const that = this
            if(page === '...') return
            if(page === 'prev') {
                if(that.pageNum <= 1) return
                that.pageNum--
            }else if(page === 'next') {
                if(that.pageNum >= that.pageCount) return
                that.pageNum++
            }else {
                if(page === that.pageNum) return
                that.pageNum = page
            }
            that.$emit('page', that.pageNum)
            that.calcPageArr()
        }
    }
}
</script>

<style lang="scss" scoped>
.paging {
    color: #333;
    margin-right: 10px;
    background-color: #fff;
    >ul {
        display: flex;
        justify-content: flex-end;
        padding: 14px 30px;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        >span {
            display: block;
            padding-left: 5px; 
        }
        >li {
            height: 30px;
            padding: 0 5px;
            min-width: 20px;
            border: 1px solid #DFDFDF;
            border-radius: 4px;
            margin-left: 8px;
            color: #595959;
            line-height: 32px;
            text-align: center;
            cursor: pointer;
            user-select: none;
        }
        .active {
            color: #fff;
            background: #00BBDC;
        }
        .unactive {
            color: #DFDFDF;
        }
    }
}
</style>
