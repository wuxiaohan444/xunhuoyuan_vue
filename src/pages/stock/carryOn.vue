<template>
    <div id="carryOn">
        <div class="navigation-head"><img src="../../assets/images/back.png" alt="" class="back"
                                          @click="$router.back(-1)"><span>类型选择</span></div>
        <div class="counter-img">
            <div class="counter-img-box"><img :src='counterImg'></div>
            <div class="btn">{{typeName}}</div>
        </div>
        <div class="device-info">
            <div class="device-info-title">设备参数</div>
            <div class="device-info-li">
                <div class="left">设备名称</div>
                <div class="right">{{deviceInfo.nickName}}</div>
            </div>
            <div class="device-info-li">
                <div class="left">设备编号</div>
                <div class="right">{{deviceInfo.no}}</div>
            </div>
            <div class="device-info-li">
                <div class="left">地址</div>
                <div class="right">{{deviceInfo.address}}</div>
            </div>
            <div :class="opacity?'device-info-li opacity':'device-info-li'">
                <div class="left">设备开关</div>
                <div class="right">
                    <div><span>状态：{{statusText}}</span></div>
                </div>
                <div :class="status===1?'open':'close'" @click="cut"></div>
            </div>
            <div class="hint"><span>i</span> 补货时，需要关闭该设备</div>
        </div>
        <div class="foot-button">
            <div class="affirm" @click="disposable">一键补满</div>
            <div class="affirm" @click="affirm">自定义补货</div>
            <div class="affirm" @click="test">货道测试</div>
            <div class="affirm" @click="lookGoods">查看商品</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "carryOn",
        data() {
            return {
                deviceInfo: '',
                typeName: '',
                counterImg: '',
                counterShow: true,
                deviceId: '',
                type: '',
                status: 1,
                opacity: false,
                statusText: ''
            }
        },
        created() {
            this.deviceId = this.$route.query.id;
            this.getDeviceInfo();
        },
        methods: {
            getDeviceInfo() {
                this.$axios({
                    method: 'get',
                    url: '/inspector/device/infoById/' + this.deviceId,
                    params: {
                        loginCode: localStorage.getItem('loginCode'),
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        let data = res.data.data;
                        this.status = data.status;
                        switch (this.status) {
                            case 1:
                                this.statusText = '开启';
                                break;
                            case 3:
                                this.statusText = '禁用';
                        }
                        if (this.status !== 1 && this.status !== 3) {
                            this.opacity = true;
                        }
                        switch (data.structureId) {
                            case 1:
                                this.counterImg = require('../../assets/images/diandong.png');
                                this.counterShow = true;
                                this.typeName = '电机类';
                                this.deviceInfo = data;
                                this.type = 1;
                                break;
                            case 2:
                                this.counterImg = require('../../assets/images/RFID.png');
                                this.counterShow = false;
                                this.typeName = 'RFID';
                                this.deviceInfo = data;
                                this.type = 2;
                        }
                    }
                })
            },

            affirm() {
                switch (this.type) {
                    case 1:
                        this.$router.push({
                            path: '/addOrder',
                            query: {
                                id: this.deviceId,
                            }
                        });
                        break;
                    case 2:
                        this.$router.push({
                            path: '/FRID',
                            query: {
                                id: this.deviceId,
                            }
                        });
                }
            },

            lookGoods() {
                this.$router.push({
                    path: '/tradition',
                    query: {
                        id: this.deviceId,
                    }
                });
            },

            disposable() {
                this.$router.push({
                    path: '/oneKaypull',
                    query: {
                        id: this.deviceId,
                    }
                });
            },
            test() {
                this.$router.push({
                    path:'/aisleTest',
                    query: {
                        id: this.deviceId,
                    }
                })
            },
            cut() {
                if (this.status === 1) {
                    this.disable();
                } else if (this.status === 3) {
                    this.status = 1;
                    this.enable();
                }
            },
            // 禁用
            disable() {
                this.$axios({
                    method: 'post',
                    url: '/inspector/device/disable',
                    data: this.$qs.stringify(
                        {
                            loginCode: localStorage.getItem('loginCode'),
                            id: this.deviceId
                        }
                    )
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.status = 3;
                        this.statusText = '禁用';
                        this.bus.$emit('tips', {
                            show: true,
                            title: res.data.data
                        })
                    } else {
                        this.bus.$emit('tips', {
                            show: true,
                            title: res.data.data
                        })
                    }
                })
            },
            // 启用
            enable() {
                this.$axios({
                    method: 'post',
                    url: '/inspector/device/enable',
                    data: this.$qs.stringify(
                        {
                            loginCode: localStorage.getItem('loginCode'),
                            id: this.deviceId
                        }
                    )
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.status = 1;
                        this.statusText = '启用';
                        this.bus.$emit('tips', {
                            show: true,
                            title: res.data.data
                        })
                    } else {
                        this.bus.$emit('tips', {
                            show: true,
                            title: res.data.data
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .counter-img {
        margin: 0 auto;
        width: 268px;
        .counter-img-box {
            padding-top: 40px;
            padding-bottom: 30px;
            img {
                width: 268px;
                height: 268px;
            }
        }
        .btn {
            width: 140px;
            height: 56px;
            background: #595CA1;
            border-radius: 8px;
            color: white;
            font-size: 26px;
            text-align: center;
            line-height: 56px;
            margin: 0 auto;
            margin-bottom: 50px;
        }
    }

    .device-info {
        padding: 0 30px;
        .device-info-title {
            height: 100px;
            font-size: 32px;
            color: #333333;
            text-align: center;
            line-height: 100px;
        }
        .device-info-li {
            width: 690px;
            height: 88px;
            box-shadow: 0 2px 0 0 rgba(35, 24, 21, 0.1);
            line-height: 88px;
            display: flex;
            position: relative;
            .left {
                font-size: 28px;
                color: rgba(51, 51, 51, 1);
                width: 164px;
            }
            .right {
                font-size: 28px;
                color: #666666;
            }
            .open, .close {
                width: 100px;
                height: 50px;
                background: #595CA1;
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                border-radius: 50px;
            }

            .close {
                background: #F2F1F1;
            }

            .open:after, .close:after {
                content: '';
                display: block;
                width: 50px;
                height: 50px;
                background: #ffffff;
                border-radius: 50%;
                position: absolute;
            }
            .open:after {
                left: 0;
            }
            .close:after {
                right: 0;
                background: #C4C1C2;
            }
        }
        .opacity {
            opacity: 0.5;
        }
        .hint {
            color: rgba(153, 153, 153, 1);
            font-size: 26px;
            display: flex;
            align-items: center;
            height: 60px;
            span {
                display: inline-block;
                width: 35px;
                height: 35px;
                line-height: 35px;
                border-radius: 50%;
                text-align: center;
                color: white;
                background: #F9606E;
                margin-right: 10px;
            }
        }
    }

    .foot-button {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 88px;
        text-align: center;
        line-height: 88px;
        color: white;
        font-size: 32px;
        display: flex;
        > div {
            flex: 1;
        }
        :nth-child(1) {
            background: #5AA9E8;
        }
        :nth-child(2) {
            background: #D4A660;
        }
        :nth-child(3) {
            background: #AE8571;
        }
        :nth-child(4) {
            background: #595CA1;
        }

    }
</style>