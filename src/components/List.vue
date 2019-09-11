<template>
    <div class="list">
        <Scroll>
            <div class="list-wrap">
                <table>
                    <tr>
                        <td v-for="(title, index) in data.titles" :key="index">{{title}}</td>
                    </tr>
                    <tr v-for="(row, i) in data.values" :key="i">
                        <td v-for="(value, j) in row" :key="j" :class="{'link-td': value && value.type === 'link'}" :style="(value && value.type === 'buttons') ? ('width: ' + (value.list.length * 74 + 20) + 'px') : ''">
                            <span v-if="(typeof value === 'string' || typeof value === 'number')">{{value}}</span>

                            <span v-else-if="value && value.type === 'click'" :class="value.event" @click="$emit(value.event, i)">{{value.text}}</span>

                            <router-link v-else-if="value && value.type === 'link'" class="details-link" tag="a" :to="{ name: value.router, query: value.query }">{{value.text}}</router-link>

                            <div v-else-if="value && value.type === 'buttons'" class="buttons">
                                <div v-for="(button, index) in value.list" @click="$emit(button.event, i)" :class="button.event" :key="index">{{button.name}}</div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="!data.values.length">
                        <td :colspan="data.titles.length">
                            <div class="no-data iconfont">
                                <p>&#xe6aa;</p>
                                <p>暂无数据</p>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </Scroll>
    </div>
</template>

<script>
/**
 *  data: {
 *      titles: 列名数组
 *      values: 列值
 *      link: 链接 {title: '列名称', name: '链接名称', router: '路由名称', query: ['查询参数列表']}
 *  }
 *  buttons: 按钮事件 title: '列名称', list: 按钮列表 {name: '按钮名称', event: '按钮事件名称', index: '返回values[event][index]'}
 * no: Boolean 是否显示序号
 */
export default {
    name: 'List',
    props: {
        data: { type: Object, default: () => { return { titles: [], values: [], link: { title: '', name: '', router: '', query: [] } } } },
        buttons: { type: Object, default: () => { return { title: '', list: [] } } },
        no: {type: Boolean, default: true}
    },
}
</script>

<style lang="scss" scoped>
.list {
    height: calc(100% - 170px);
    width: 100%;
    display: block;
    color: #333;
    font-size: 16px;
    background-color: #fff;
    overflow: hidden;
    .list-wrap{
        padding: 0 30px;
        table {
            width: 100%;
            max-width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            >tr {
                >td {
                    height: 47px;
                    max-width: 200px;
                    border: 1px solid #E5E5E5;
                    text-align: center;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    &:first-child {
                        width: 70px;
                    }
                    .idcard, .account {
                        color: #00BBDC;
                        cursor: pointer;
                    }
                    .buttons {
                        display: flex;
                        >div {
                            padding: 5px 10px;
                            line-height: 20px;
                            border-radius: 4px;
                            margin: 0 10px;
                            cursor: pointer;
                            user-select: none;
                            &:first-child {
                                margin-left: 20px;
                            }
                            &:last-child {
                                margin-right: 20px;
                            }
                        }
                        .details {
                            border: 1px solid #00BBDC;
                            background-color: #00BBDC;
                            color: #fff;
                        }
                        .download {
                            border: 1px solid #00BBDC;
                            color: #00BBDC;
                        }
                        .delete {
                            border: 1px solid #FF645E;
                            color: #FF645E;
                        }
                    }
                }
                .status-td {
                    width: 100px;
                }
                .link-td {
                    width: 100px;
                    .details-link {
                        display: block;
                        width: 68px;
                        height: 28px;
                        margin: auto;
                        border: 1px solid #00BBDC;
                        color: #00BBDC;
                        border-radius: 4px;
                        line-height: 30px;
                        text-align: center;
                        text-decoration: none;
                        &:hover {
                            background-color: #00BBDC;
                            color: #fff;
                        }
                    }
                }
                &:first-child {
                    background-color: #FAFAFA;
                }
            }
        }
        .no-data {
            margin: 30px;
            text-align: center;
            font-size: 26px;
            color: #ddd;
            >p {
                &:first-child {
                    font-size: 100px;
                }
            }
        }
    }
}
</style>
