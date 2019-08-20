<template>
    <div id="deviceDetails">
        <div class="navigation-head"><img src="../../assets/images/back.png" alt="" class="back"
                                          @click="$router.back(-1)"><span>售货机详情</span></div>
        <div class="head-item">
            <img src="../../assets/images/device.png" class="left">
            <div class="head-right">
                <div class="right-top">NO.{{deviceNo}}</div>
                <div class="right-bottom">
                    <img src="../../assets/images/address2.png">
                    <span>{{address}}</span>
                </div>
            </div>
            <div class="more" @click="moreShow">...</div>
        </div>
        <div class="head-item" @click="lookTemperature">
            <img src="../../assets/images/temperature.png" class="left">
            <div class="head-right">
                <div class="right-bottom">
                    <span>温度监控</span>
                </div>
                <div class="right-top">{{temperature==null?'暂无数据':temperature}}℃</div>
            </div>
        </div>
        <!--设备状态-->
        <div class="device-status">
            <div class="title">设备状况</div>
            <div class="device-bottom">
                <div class="activity==1?(error!==1?(status==1?'':'opacity'):'opacity'):'opacity'">
                    <img src="../../assets/images/normal.png">
                    <div>正常</div>
                </div>
                <div :class="error===1?'':'opacity'">
                    <img src="../../assets/images/bug1.png">
                    <div>故障</div>
                </div>
                <div :class="activity ===1?'opacity':''">
                    <img src="../../assets/images/lixian.png">
                    <div>网络</div>
                </div>
            </div>
        </div>
        <!--缺货状况-->
        <div class="stockout-status">
            <div class="title" v-show="titleShow">{{titleStatus}}</div>
            <div class="stockout-item" v-for="(item,index) in goods" :key="index">
                <img class="goods-img" :src="ip+item.img">
                <div class="stockout-right">
                    <div>{{item.name}}</div>
                    <div>
                        <span>剩余{{item.nowNum}}件</span>
                        <span class="stockout-number" style="font-weight: 700">缺货{{item.allNum-item.nowNum}}件</span>
                    </div>
                </div>
            </div>
        </div>
        <!--各个入口-->
        <div class="entrance" v-show="entranceShow" @click="moreHide">
            <div :class="entranceShow?'entrance-box unfold':'entrance-box'" @click.stop>
                <router-link class="item" :to="'/place?id='+deviceId">
                    <img src="../../assets/images/address6.png">
                    <div>地理位置</div>
                </router-link>
                <div class="item">
                    <img src="../../assets/images/jiqixinxi.png">
                    <div>机器信息</div>
                </div>
                <div class="item">
                    <img src="../../assets/images/gaojing.png">
                    <div>故障状况</div>
                </div>
                <div class="item">
                    <img src="../../assets/images/wifi.png">
                    <div>网络状态</div>
                </div>
                <router-link class="item" :to="'/temperature?id='+deviceId">
                    <img src="../../assets/images/wndu.png">
                    <div>温度监控</div>
                </router-link>
                <div class="item">
                    <img src="../../assets/images/tiaozheng.png">
                    <div>库存调整</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "deviceDetails",
        data() {
            return {
                temperature: '10',//温度
                deviceNo: '',
                deviceId: '',
                address: '',
                activity: '',
                error: '',
                goods: '',
                ip: this.fixedIp(),
                titleStatus: '',
                titleShow: false,
                entranceShow: false
            }
        },
        created() {
            this.deviceId = this.$route.query.deviceId;
            this.getDeviceInfo()
        },
        methods: {
            getDeviceInfo() {
                this.$axios({
                    method: 'get',
                    url: '/inspector/device/select',
                    params: {
                        loginCode: localStorage.getItem("loginCode"),
                        id: this.deviceId
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        let data = res.data.data;
                        this.deviceNo = data.no;
                        this.temperature = data.info.temperature.value;
                        this.address = data.address;
                        this.activity = data.activity;
                        this.error = data.error;
                        this.goods = data.info.goods;
                        if (!data.info.goods) {
                            this.titleStatus = '暂无数据';
                            this.titleShow = true;
                        }
                    }
                })
            },
            moreShow() {
                this.entranceShow = true;
            },
            moreHide() {
                this.entranceShow = false;
            },
            lookTemperature() {
                this.$router.push({
                    path:'/temperature',
                    query:{
                        id:this.deviceId
                    }
                })
            }
        },

    }
</script>

<style scoped lang="less">
    #deviceDetails {
        background: #f2f2f2;
        min-height: 100%;
    }

    .head-item {
        position: relative;
        background: white;
        width: 690px;
        height: 180px;
        margin: 0 auto;
        margin-bottom: 20px;
        border-radius: 8px;
        .left {
            width: 120px;
            height: 120px;
            position: absolute;
            top: 50%;
            left: 30px;
            transform: translateY(-50%);
        }
        .head-right {
            position: absolute;
            left: 180px;
            top: 40px;
        }
        .right-bottom {
            font-size: 26px;
            color: rgba(51, 51, 51, 1);
            line-height: 50px;
            img {
                width: 34px;
                height: 39px;
                vertical-align: middle;
                margin-right: 10px;
            }
        }
        .right-top {
            font-size: 30px;
            font-weight: bold;
            color: rgba(51, 51, 51, 1);
            line-height: 50px;
        }
        .more {
            font-size: 120px;
            position: absolute;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            height: 180px;
            line-height: 100px;
            color: #4B85F3;
        }
    }

    /*设备状态*/
    .device-status {
        width: 690px;
        height: 240px;
        background: white;
        margin: 0 auto;
        margin-bottom: 20px;
        border-radius: 12px;
        .title {
            height: 80px;
            line-height: 80px;
            font-size: 28px;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            border-bottom: 1px solid #f2f2f2;
            box-sizing: border-box;
            padding-left: 30px;
        }
        .device-bottom {
            display: flex;
            height: 160px;
            > div {
                flex: 1;
                text-align: center;
                font-size: 28px;
                padding-top: 30px;
                box-sizing: border-box;
                font-weight: bold;
                img {
                    width: 64px;
                    height: 64px;
                }
            }
            .opacity {
                opacity: 0.6;
            }

        }
    }

    /*缺货状态*/
    .stockout-status {
        width: 690px;
        /*height: 524px;*/
        background: white;
        border-radius: 12px;
        margin: 0 auto;
        overflow: scroll;
        .title {
            height: 80px;
            line-height: 80px;
            font-size: 28px;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            border-bottom: 1px solid #f2f2f2;
            box-sizing: border-box;
            padding-left: 30px;
        }
        .stockout-item {
            height: 160px;
            box-sizing: border-box;
            padding: 25px 30px;
            border-bottom: 1px solid #f2f2f2;
            font-size: 26px;
            .goods-img {
                width: 110px;
                height: 110px;
                border: 1px solid #f2f2f2;
                border-radius: 50%;
                float: left;
            }
            .stockout-right {
                float: left;
                padding-left: 20px;
                > div {
                    line-height: 50px;
                    width: 490px;
                    .stockout-number {
                        float: right;
                    }
                }
            }
        }
    }

    /*各个入口*/
    .entrance {
        position: fixed;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background: rgba(0, 0, 0, .1);
        .entrance-box {
            width: 100%;
            height: 0;
            padding: 0 30px;
            box-sizing: border-box;
            background: white;
            overflow: hidden;
            position: fixed;
            top: 100px;
            .item {
                text-align: center;
                font-size: 28px;
                color: rgba(51, 51, 51, 1);
                width: 230px;
                height: 170px;
                padding: 20px 0;
                float: left;
                box-sizing: border-box;
                img {
                    width: 86px;
                    height: 86px;
                }
            }
        }
        .unfold {
            animation: unfold 0.5s;
            animation-fill-mode: forwards
        }
        @keyframes unfold {
            0% {
                height: 0;
            }
            100% {
                height: 400px;
            }
        }
    }
</style>