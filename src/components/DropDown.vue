<template>
    <div class="drop-down" :class="{readonly: readonly}" :style="'width: ' + (width - 2) + 'px'">
        <div>
            {{option ? option : (data.default ? data.default : data.name)}}
            <i></i>
        </div>
        <ul v-if="data.list.length > 0" :style="'height: ' + ( (data.list.length < 6) ? data.list.length * 30 : 180 ) + 'px;'">
            <Scroll>
                <li class="option-list" v-for="(item, index) in data.list" :key="index" @click="selected(item, index)">{{item}}</li>
            </Scroll>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'DropDown',
    props: {
        data: { type: Object, default: () => { return { name: '请选择', list: [], default: '' } } },
        readonly: { type: Boolean, default: false },
        width: { type: Number, default: 170 }
    },
    watch: {
        'data' () {
            this.option = this.data.default
        }
    },
    data () {
        return {
            option: ''
        }
    },
    methods: {
        selected(item, index) {
            const that = this
            if(!that.readonly) {
                that.option = item
                that.$emit('select', index)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.drop-down {
    position: relative;
    width: 168px;
    height: 30px;
    border: 1px solid #00BBDC;
    border-radius: 4px;
    margin: 14px 10px 14px 0;
    color: #434343;
    cursor: pointer;
    user-select: none;
    &::after {
        position: absolute;
        content: '';
        bottom: -8px;
        left: 0;
        width: 100%;
        height: 10px;
    }
    &:hover {
        >ul {
            display: block;
            height: 182px;
            overflow: hidden;
        }
        i {
            top: calc(50% - 2px);
            &::before {
                transform: rotate(45deg) translateX(4px);
            }
            &::after {
                transform: rotate(-45deg) translateX(-4px);
            }
        }
    }
    >ul {
        display: none;
        position: absolute;
        width: 100%;
        left: -1px;
        top: 35px;
        z-index: 8;
        background-color: #fff;
        border: 1px solid #00BBDC;
        border-radius: 4px;
        .option-list {
            padding: 5px 10px;
            height: 20px;
            line-height: 20px;
            &:hover {
                background-color: #00BBDC;
                color: #fff;
            }
        }
    }
    >div {
        position: relative;
        padding: 5px 10px;
        height: 20px;
        line-height: 20px;
        >i {
            transition: transform .3s cubic-bezier(.645,.045,.355,1);
            position: absolute;
            top: 50%;
            right: 10px;
            width: 8px;
            transition: all 0.3s ease-out;
            &::before {
                content: '';
                position: absolute;
                vertical-align: baseline;
                background: #DEDEDE;
                width: 8px;
                height: 1.5px;
                border-radius: 2px;    
                transform: rotate(-45deg) translateX(4px);
                transition: transform .3s cubic-bezier(.645,.045,.355,1),top .3s cubic-bezier(.645,.045,.355,1);
            }
            &::after {
                content: '';
                position: absolute;
                vertical-align: baseline;
                background: #DEDEDE;
                width: 8px;
                height: 1.5px;
                border-radius: 2px;
                transform: rotate(45deg) translateX(-4px);
                transition: transform .3s cubic-bezier(.645,.045,.355,1),top .3s cubic-bezier(.645,.045,.355,1);
            }
        }
    }
}
.readonly {
    border: 1px solid #eaecf2;
    color: #777;
    cursor: no-drop;
    >ul {
        border: 1px solid #eaecf2;
        .option-list {
            &:hover {
                background-color: #eaecf2;
            }
        }
    }
}
</style>
