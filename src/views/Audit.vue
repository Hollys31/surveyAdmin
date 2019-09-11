<template>
    <div class="audit">
        <div class="form">
            <div class="region">
                <div class="form-name">请选择地区：</div>
                <DropDown :data="provinceList" :readonly="provinceList.list.length > 2 ? false : true" :width="115" @select="province = arguments[0] ? provinceList.list[arguments[0]] : '';getRegion(province, 2)" />
                <DropDown :data="cityList" :readonly="cityList.list.length > 2 ? false : true" :width="115" @select="city = arguments[0] ? cityList.list[arguments[0]] : '';getRegion(city, 3)" />
                <DropDown :data="countyList" :readonly="countyList.list.length > 2 ? false : true" :width="115" @select="county = arguments[0] ? countyList.list[arguments[0]] : '';getRegion(county, 4)" />
                <DropDown :data="townList" :readonly="townList.list.length > 2 ? false : true" @select="town = arguments[0] ? townList.list[arguments[0]] : '';getRegion(town, 5)" :width="115" />
                <DropDown :data="villageList" :readonly="villageList.list.length > 2 ? false : true" @select="village = arguments[0] ? villageList.list[arguments[0]] : ''" :width="115" />
            </div>
            <div class="screen">
                <div class="form-name">数据筛选：</div>
                <DropDown :data="screenList" @select="screen = arguments[0]" :width="240" />
            </div>
            <div class="keyword">
                <div class="form-name">关键词搜索：</div>
                <input type="text" placeholder="输入户主姓名" v-model="hadeName">
                <div class="serach-button iconfont" @click="getAuditList(currentPage)">&#xe600; 搜索</div>
            </div>
            <div class="export-file" @click="showExport = true">批量导出文件</div>
        </div>
        <div class="item-list" :style="'height: ' + (winSize.h - 370) + 'px'">
            <List :data="auditList" @details="showAudit = arguments[0]; auditDetails = auditList.values[showAudit]" @download="downloadFile('single', arguments[0])" @idcard="pictureIndex = 0;showPictureViewer = arguments[0]" @account="pictureIndex = 2;showPictureViewer = arguments[0]" />
            <Paging :page="page" @page="getAuditList" />
        </div>
        <Popover v-if="showExport" class="export" @close="showExport = false" :title="'批量导出文件'">
            <div class="address"><span>* </span>江西省 - 赣州市 - 会昌县{{town ? ' - ' + town : ''}}{{village ? ' - ' + village : ''}}</div>
            <div class="type"><span>* </span>下载类型：<span>{{screenList.list[screen]}}数据</span></div>
            <div class="count"><span>* </span>共计<span> {{page.count}} </span>户文件资料。</div>
            <div class="option">
                <div class="cancel" @click="showExport = false">取消</div>
                <div class="ok" @click="downloadFile('batch')">确定</div>
            </div>
        </Popover>
        <Popover v-if="showAudit != -1" :width="900" class="audit" @close="showAudit = -1" :title="'信息审计详情'">
            <div class="details">
                <div>户主姓名：<span>{{auditDetails[1]}}</span></div>
                <div>联系电话：<span>{{response[showAudit].headPhone}}</span></div>
                <div>身份证号：<span>{{auditDetails[2]}}</span></div> 
                <div>竣工时间：<span>{{response[showAudit].completeTime}}</span></div>
                <div>房屋地址：<span>{{auditDetails[3]}}</span></div>
                <div>
                    <p>身份证照片：</p>
                    <div>
                        <div @click="pictureIndex = 0;showPictureViewer = showAudit">
                            <img :src="'/api' + response[showAudit].idCardFront" alt="">
                        </div>
                        <div @click="pictureIndex = 1;showPictureViewer = showAudit">
                            <img :src="'/api' + response[showAudit].idCardBack" alt="">
                        </div>
                    </div>
                </div>
                <div>
                    <p>户口本照片：</p>
                    <div>
                        <div v-for="(img, index) in response[showAudit].registeredResidenceImageList" :key="index" @click="pictureIndex = 2 + index ;showPictureViewer = showAudit">
                            <img :src="'/api' + img.imgPath" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="option">
                <div class="reject-button" @click="showReject = true">驳回</div>
                <div class="ok" @click="showAudit = -1">确定</div>
            </div>
        </Popover>
        <Popover v-if="showReject" :top="140" class="reject" @close="showReject = false" :title="'驳回'">
            <div class="cause">请输入驳回原因：<textarea v-model="rejectInfo"  placeholder="您填写的资料不合格，请重新填写并提交资料，谢谢合作！"></textarea></div>
            <div class="option">
                <div class="ok" @click="reject(auditDetails[0])">确定驳回</div>
            </div>
        </Popover>
        <PictureViewer v-if="showPictureViewer != -1" @close="showPictureViewer = -1" :data="pictureList[showPictureViewer]" :index="pictureIndex" />
    </div>
</template>

<script>
    import DropDown from '@/components/DropDown.vue'
    import List from '@/components/List.vue'
    import Paging from '@/components/Paging.vue'
    import Popover from '@/components/Popover.vue'
    import PictureViewer from '@/components/PictureViewer.vue'
    export default {
        name: 'Audit',
        props: {
            winSize: {type: Object, default: () => {return {w: 0, h: 0}} }
        },
        components: { DropDown, List, Paging, Popover, PictureViewer },
        data () {
            return {
                response: [], //请求返回的列表
                auditList: { titles: [], values: [] }, //审计列表
                page: {count: 0, size: 10}, //分页数据
                currentPage: 1, //当前页
                currentSendData: {}, //保存当前翻页所使用的参数
                province: '', //省份
                provinceList: {list: [], default: '所有省份'}, //省份选单列表
                city: '', //市、区
                cityList: {list: [], default: '所有市区'}, //市、区选单列表
                county: '', //县
                countyList: {list: [], default: '所有县'}, //县选单列表
                town: '', //乡、镇
                townList: {list: [], default: '所有乡镇'}, //乡、镇选单列表
                village: '', //村
                villageList: {list: [], default: '所有村'}, //村选单列表
                screen: 0, //数据筛选
                screenList: {list: ['全部', '已下载', '未下载', '被驳回'], mark: ['', 'DL', 'UD', 'RJ'], default: '全部'}, //数据筛选项目列表
                hadeName: '', //户主姓名
                auditDetails: ['1', '李某', '123456799', '江西省赣州市会昌县朱兰乡唐江村', {type: 'click', event: 'idcard', text: '点击查看', url: 'https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/0F/09/ChMkJlauze2IPKICABzBh_ueXY0AAH9JAMQ2qUAHMGf334.jpg'}, {type: 'click', event: 'account', text: '点击查看', url: 'https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/0F/09/ChMkJlauze2IPKICABzBh_ueXY0AAH9JAMQ2qUAHMGf334.jpg'}, '已下载100次'], //审计详情数据
                showExport: false, //是否显示导出文件弹出框
                showAudit: -1, //是否显示审计信息弹出框
                showReject: false, //是否显示驳回表单弹出框
                showPictureViewer: -1, //正在查看图片的链接
                pictureList: [], //图片列表
                pictureIndex: 0, //查看图片的在数组中的下标
                rejectInfo: '', //保存驳回信息

            }
        },
        mounted () {
            this.getAuditList()
            this.getRegion('', 1)
            this.getRegion('江西省', 2)
            this.getRegion('赣州市', 3)
            this.getRegion('会昌县', 4)
        },
        methods: {
            getAuditList (page = 1) {
                const that = this
                that.$emit('loading')
                that.currentPage = page
                let sendData = {
                    province: that.province ? that.province : '江西省',
                    city: that.city ? that.city : '赣州市',
                    distrinct: that.county ? that.county : '会昌县',
                    town: that.town,
                    village: that.village,
                    approveStatus: that.screenList.mark[that.screen],
                    headName: that.hadeName,
                    pageNum: page,
                    pageSize: that.page.size,
                }
                if(page > 1) {
                    that.currentSendData.pageNum = page
                    sendData = that.currentSendData
                }else {
                    that.currentSendData = sendData
                }
                that.$get({url: '/api/house/list', data: sendData}).then(res => {
                    let auditList = {
                        titles: ['ID', '户主姓名', '身份证号', '房屋地址', '身份证照片', '户口本照片', '状态', '操作'], 
                        values: []
                    }
                    let pictureList = []
                    if(parseInt(res.status) === 200 && res.data) {
                        const total = parseInt(res.data.total)
                        that.page = {count: total ? total : 0, size: that.page.size}
                        that.response = res.data.list

                        if(res.data.list instanceof Array) {
                            res.data.list.forEach(item => {
                                auditList.values.push([
                                    item.addrId,
                                    item.headName,
                                    item.idCardNo,
                                    (item.province + item.city + item.distrinct + item.town + item.village + item.addrInfo),
                                    {type: 'click', event: 'idcard', text: '点击查看'}, 
                                    {type: 'click', event: 'account', text: '点击查看'},
                                    item.approveStatus === 'RJ' ? '被驳回' : ( parseInt(item.downloadCount) ? '已下载' + parseInt(item.downloadCount) + '次' : '未下载' ),
                                    {type: 'buttons', list: [{name: '详情', event: 'details'}, {name: '下载', event: 'download'}]}
                                ])
                                let images = []
                                images.push({name: '身份证正面照片', url: '/api' + item.idCardFront})
                                images.push({name: '身份证背面照片', url: '/api' + item.idCardBack})
                                if(item.registeredResidenceImageList instanceof Array) {
                                    item.registeredResidenceImageList.forEach((img, i) => {
                                        images.push({name: '户口本照片' + (i + 1), url: '/api' + img.imgPath})
                                    })
                                }
                                pictureList.push(images)
                            })
                        }
                    }else {
                        that.$msg({type:'error', text: res.msg})
                    }
                    that.auditList = auditList
                    that.pictureList = pictureList
                    that.$emit('loaded')
                })
            },
            getRegion (parentRegion, level) { //获取地区 String parentRegion：查询该地区下一级地区 Number level: 1->省 | 2->市 | 3->县 | 4->乡、镇 | 5->村
                const that = this
                if(!parentRegion && level != 1) {
                    that.village = ''; that.villageList = {list: [], default: '所有村'}
                    if(level == 5) return 
                    that.town = ''; that.townList = {list: [], default: '所有乡镇'}
                    if(level == 4) return 
                    that.county = ''; that.countyList = {list: [], default: '所有县'}
                    if(level == 3) return 
                    that.city = ''; that.cityList = {list: [], default: '所有市区'}
                    return
                }
                that.$get({url: '/api/house/branch', data: {parentName: parentRegion, level: level}}).then(res => {
                    if(parseInt(res.status) === 200 && res.data) {
                        if(res.data.children instanceof Array) {
                            switch(level) {
                                case 1: 
                                    that.province = ''
                                    that.provinceList = {list: ['所有省份'].concat(res.data.children), default: '江西省'}
                                    break
                                case 2: 
                                    that.city = ''
                                    that.cityList = {list: ['所有市区'].concat(res.data.children), default: '赣州市'}
                                    break
                                case 3: 
                                    that.county = ''
                                    that.countyList = {list: ['所有县'].concat(res.data.children), default: '会昌县'}
                                    break
                                case 4: 
                                    that.town = ''
                                    that.townList = {list: ['所有乡镇'].concat(res.data.children), default: '所有乡镇'}
                                    break
                                case 5: 
                                    that.village = ''
                                    that.villageList = {list: ['所有村'].concat(res.data.children), default: '所有村'}
                                    break
                            }
                        }
                    }else {
                        that.$msg({type:'error', text: res.msg})
                    }
                })
            },
            reject (id) { //驳回
                const that = this
                that.$emit('loading')
                that.$get({url: '/api/house/reject', data: {
                    addrId: id, 
                    approveRemark: that.rejectInfo ? that.rejectInfo : '您填写的资料不合格，请重新填写并提交，谢谢合作！'
                }}).then(res => {
                    if(parseInt(res.status) === 200) {
                        that.getAuditList(that.currentPage)
                        that.$msg({type:'ok', text: '已提交驳回信息'})
                    }else {
                        that.$msg({type:'error', text: res.msg})
                    }
                    that.$emit('loaded')
                    that.showReject = false
                })

            },
            downloadFile (type, index) { //下载文件
                const that = this
                let parameters = {}
                if(type === 'single') {
                    parameters = {
                        type: type, 
                        addrId: that.response[index].addrId, 
                        headName: that.response[index].headName}
                }else if(type === 'batch') {
                    parameters = {
                        type: type,
                        province: that.province ? that.province : '江西省',
                        city: that.city ? that.city : '赣州市',
                        distrinct: that.county ? that.county : '会昌县',
                        town: that.town,
                        village: that.village,
                        approveStatus: that.screenList.mark[that.screen]
                    }
                }
                let downloadUrl = '/api/house/download?'
                for(let key in parameters) {
                    downloadUrl += key + '=' + parameters[key] + '&'
                }
                const a = document.createElement('a')
                a.download = ''
                a.href = downloadUrl
                document.body.appendChild(a)
                a.click()
                a.remove()
            }
        }

    }
</script>

<style lang="scss" scoped>
.audit {
    color: #333;
    .form {
        padding: 10px 30px;
        .form-name {
            width: 120px;
            font-size: 16px;
            font-weight: 600;
            line-height: 60px;
        }
        .region, .screen {
            display: flex;
        }
        .keyword {
            display: flex;
            input {
                width: 218px;
                height: 22px;
                padding: 4px 10px;
                margin: 14px 0;
                border: 1px solid #00BBDC;
                border-radius: 4px;
                font-size: 16px;
            }
            .serach-button {
                height: 32px;
                background-color: #00BBDC;
                color: #fff;
                line-height: 32px;
                text-align: center;
                letter-spacing: 2px;
                padding: 0 20px;
                border-radius: 4px;
                margin: 14px 10px;
                cursor: pointer;
            }
        }
        .export-file {
            height: 32px;
            width: 120px;
            background-color: #00BBDC;
            color: #fff;
            line-height: 32px;
            letter-spacing: 2px;
            border-radius: 4px;
            margin: 14px 0;
            text-align: center;
            cursor: pointer;
            user-select: none;
        }
    }
    .item-list {
        position: relative;
        height: calc(100% - 260px);
        .list {
            height: calc(100% - 60px);
        }
        .paging {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
        }
    }
    
    .option {
        display: flex;
        padding-top: 30px;
        justify-content: center;
        line-height: 38px;
        font-size: 18px;
        font-weight: 600;
        letter-spacing: 2px;
        >div {
            width: 98px;
            height: 38px;
            margin: 0 15%;
            border: 1px solid #00BBDC;
            border-radius: 10px;
            text-align: center;
            cursor: pointer;
            user-select: none;
        }
        .cancel {
            color: #00BBDC;
        }
        .ok {
            background-color: #00BBDC;
            color: #fff;
        }
        .reject-button {
            border: 1px solid #f00;
            color: #f00;
        }
    }
    .export {
        .address, .type, .count {
            font-size: 18px;
            font-weight: 600;
            letter-spacing: 2px;
            line-height: 38px;
            >span {
                &:first-child {
                    color: #f00;
                }
            }
        }
        .type {
            >span {
                &:nth-child(2) {
                    color: #666;
                }
            }
        }
        .count {
            >span {
                &:nth-child(2) {
                    color: #00BBDC;
                }
            }
        }
    }
    .audit {
        .details {
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 2px;
            line-height: 38px;
            margin-left: 50px;
            span {
                color: #666;
                margin-left: 20px;
            }
            >div {
                &:nth-child(6), &:nth-child(7) {
                    display: flex;
                    >p {
                        width: 120px;
                        padding-top: 40px;
                        line-height: 190px;
                    }
                    >div {
                        display: flex;
                        flex-wrap: wrap;
                        line-height: 190px;
                        margin-top: 20px;
                        width: 660px;
                        >div {
                            width: 280px;
                            height: 168px;
                            padding: 10px;
                            margin-top: 20px;
                            margin-right: 20px;
                            border: 1px dashed #00BBDC;
                            border-radius: 6px;
                            cursor: pointer;
                            >img {
                                display: block;
                                width: 100%;
                                height: 100%;
                                background-color: #eee;
                            }
                        }
                    }
                }
            }
        }
    }
    .reject {
        .cause {
            font-size: 18px;
            font-weight: 600;
            letter-spacing: 2px;
            line-height: 38px;
            display: flex;
            height: 130px;
            textarea {
                width: 300px;
                height: 100px;
                padding: 5px;
                border-radius: 4px;
                font-size: 16px;
            }
        }
        .option {
            .ok {
                width: 120px
            }
        }
    }
}
</style>