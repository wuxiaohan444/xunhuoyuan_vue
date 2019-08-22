<template>
    <div id="ReplenishmentRecord">
        <div class="navigation-head"><img src="../../assets/images/back.png" alt="" class="back"
                                          @click="$router.back(-1)"><span>补货记录</span></div>

        <div class="head">
            <div>
                <input type="text" v-model="deviceName" placeholder="输入机器名称搜索">
                <div class="choose-time" @click="chooseTime">选择时间</div>
            </div>
        </div>
        <div class="time-box" v-show="timeShow">
            <div @click="chooseStart">开始时间：<span>{{startTime}}</span></div>
            <div @click="chooseEnd">结束时间：<span>{{endTime}}</span></div>
        </div>

        <div :class="timeShow?'strut mainBottom':'mainBottom'" @scroll="scrollList" ref="list">
            <div class="replenishment_item clearfloat " v-for="(item,index) in recordList" :key="index">
                <div class="item-title">
                    <img src="../../assets/images/order1.png" class="order">
                    <span>{{item.no}}</span>
                    <img src="../../assets/images/deviceDetails.png" class="deviceDetails" @click="look(item.id)">
                </div>
                <div class="item_bottom">
                    <div class="item_name">
                        <div>设备名称</div>
                        <div>{{item.foo.device?item.foo.device.nickName:'暂无数据'}}</div>
                    </div>
                    <div class="item_name">
                        <div>机器编号</div>
                        <div>{{item.foo.device?item.foo.device.no:'暂无数据'}}</div>
                    </div>
                </div>
                <div class="item_time">补货时间：{{item.createTime}}</div>
            </div>
            <div class="mainBottom-foot" v-show="footHide">已经到底了</div>
        </div>
        <div class="time-model" v-show="modelShow">
            <div class="calender-box">
                <Calendar v-on:choseDay="chooseStartTime" v-show="starShow"></Calendar>
                <Calendar v-on:choseDay="chooseEndTime" v-show="endShow"></Calendar>
            </div>
        </div>

    </div>
</template>

<script>
    import Calendar from 'vue-calendar-component'

    export default {
        name: "ReplenishmentRecord",
        data() {
            return {
                recordList: [],
                page: 1,
                control: true,
                footHide: true,
                deviceName: '',
                endTime: '',
                startTime: '',
                modelShow: false,
                starShow: false,
                endShow: false,
                timeShow: false,
            }
        },
        components: {Calendar},
        created() {
            this.getRecord();
        },
        methods: {
            getRecord() {
                this.$axios('get', '/inspector/goodsIn/record', {
                    loginCode: localStorage.getItem("loginCode"),
                    page: this.page,
                    limit: "10",
                    deviceName: this.deviceName,
                    end: this.endTime,
                    start: this.startTime
                }, (res) => {
                    this.recordList = this.recordList.concat(res.rows);
                    if (res.rows.length < 10) {
                        this.footHide = true;
                        this.control = false
                    } else {
                        this.control = true;
                    }
                });
            },
            look(id) {
                this.$router.push({
                    path: '/record',
                    query: {
                        id: id
                    }
                })
            },
            scrollList() {
                let a = this.$refs.list.scrollHeight;
                let b = this.$refs.list.clientHeight;
                let c = this.$refs.list.scrollTop;
                if (a - (b + c) < 200 && this.control&&this.recordList.length>=10) {
                    this.control = false;
                    this.page++;
                    this.getRecord();
                }
            },
            // 选择时间
            chooseTime() {
                this.timeShow = true;
            },
            chooseStartTime(data) { //选择开始时间
                this.startTime = data;
                this.modelShow = false;
                this.starShow = false;
            },
            chooseEndTime(data) {//选择结束时间
                this.endTime = data;
                this.modelShow = false;
                this.endShow = false;
                this.page = 1;
                this.getRecord();
            },
            chooseStart() {
                this.modelShow = true;
                this.starShow = true;
            },
            chooseEnd() {
                this.modelShow = true;
                this.endShow = true;
            }

        },
    }
</script>

<style scoped lang="less">
    #ReplenishmentRecord {
        background: #f2f2f2;
        height: 100%;
        box-sizing: border-box;
    }

    .head {
        width: 100%;
        height: 90px;
        background: white;
        position: fixed;
        top: 100px;
        > div {
            display: flex;
            height: 90px;
            justify-content: space-around;
            align-items: center;
            input {
                width: 400px;
                height: 68px;
                border: 2px solid rgba(94, 94, 94, 1);
                border-radius: 34px;
                text-indent: 1em;
            }
            .choose-time {
                width: 140px;
                height: 40px;
                background: #595CA1;
                color: white;
                padding: 10px 20px;
                font-size: 26px;
                border-radius: 15px;
                text-align: center;
                line-height: 40px;
            }
        }
    }

    .time-box {
        display: flex;
        height: 90px;
        width: 100%;
        background: white;
        position: fixed;
        top: 190px;
        > div {
            flex: 1;
            text-indent: 1em;
            display: flex;
            align-items: center;
            font-size: 24px;
            span {
                display: inline-block;
                width: 200px;
                height: 50px;
                line-height: 50px;
                border-bottom: 1px solid #f2f2f2;
            }
        }
    }

    /*主要部分*/
    .mainBottom {
        padding-top: 90px;
        height: calc(~'100% - 90px');
        overflow: scroll;
        .replenishment_item {
            width: 690px;
            height: 270px;
            background: rgba(255, 255, 255, 1);
            border-radius: 8px;
            margin: 20px auto;
            .item-title {
                height: 80px;
                font-size: 30px;
                color: rgba(51, 51, 51, 1);
                line-height: 80px;
                padding: 0 30px;
                box-sizing: border-box;
                border-bottom: 1px solid #f2f2f2;
                .order {
                    width: 35px;
                    height: 40px;
                    vertical-align: middle;
                    margin-right: 15px;
                }
                .deviceDetails {
                    width: 49px;
                    height: 51px;
                    vertical-align: middle;
                    float: right;
                    margin-top: 15px;
                }
            }
            .item_time {
                font-size: 26px;
                line-height: 60px;
                padding-left: 32px;
            }
            .item_bottom {
                width: 100%;
                display: flex;
                margin-top: 15px;
                > div {
                    flex: 1;
                    font-size: 26px;
                    color: rgba(153, 153, 153, 1);
                    line-height: 50px;
                    > div:last-child {
                        color: rgba(51, 51, 51, 1);
                        font-size: 30px;
                    }
                }
                .item_name {
                    padding-left: 32px;
                }
            }
        }
        .mainBottom-foot {
            line-height: 50px;
            text-align: center;
        }
    }

    .mainBottom.strut {
        padding-top: 180px;
    }

    .time-model {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        position: fixed;
        top: 0;
        left: 0;
        .calender-box {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }
    }
</style>