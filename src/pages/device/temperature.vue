<template>
    <div id="temperature">
        <div class="navigation-head"><img src="../../assets/images/back.png" alt="" class="back"
                                          @click="$router.back(-1)"><span>温度监控</span></div>
        <div class="device">
            <div class="title">{{deviceName}}</div>
            <div class="device-mian">
                <div class="content">
                    <span class="numerical">{{now}}℃</span>
                    <div class="text">当前温度</div>
                </div>
                <div class="show">
                    <div v-show="down">
                        <img src="../../assets/images/xia.png">
                        <span style="color: #6093F9">降温中</span>
                    </div>
                    <div v-show="up">
                        <img src="../../assets/images/shang.png">
                        <span style="color: #F9617D">升温中</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="control">
            <div class="title">
                <span>设备开关(设置温度必须禁用设备)</span>
            </div>
            <div class="control-center">
                <div :class="up?'explain':'explain up'">{{explain}}</div>
                <div :class="status===1?'handle opacity':'handle'">
                    <div class="minus" @click="minus">
                        <img src="../../assets/images/jian.png">
                    </div>
                    <div class="number">{{figure}}℃</div>
                    <div class="add" @click="add">
                        <img src="../../assets/images/add.png">
                    </div>
                </div>
                <span class="set">设置温度</span>
            </div>
            <div :class="status===1?'start play':'start'" @click="play">
                <div :class="status===1?'play':''"></div>
            </div>
        </div>
        <div class="affirm" @click="affirm" :style="{opacity:status===1?'0.5':'1'}">确认</div>
    </div>
</template>

<script>
    export default {
        name: "temperature",
        data() {
            return {
                deviceName: '',
                now: '',
                down: false,
                up: false,
                figure: '',
                status: '',
                deviceId: '',
                explain: ''
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
                    url: '/inspector/device/select',
                    params: {
                        loginCode: localStorage.getItem("loginCode"),
                        id: this.deviceId
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        let data = res.data.data;
                        this.now = data.info.temperature.value == null ? '暂无' : data.info.temperature.value;//当前温度
                        this.figure = data.info.temperature.value == null ? 0 : data.info.temperature.value;//需要调节的温度
                        this.deviceName = data.nickName;
                        this.status = data.status
                    }
                })
            },
            minus() {
                if (this.status === 0) {
                    this.figure--;
                    if (this.figure > this.now) {
                        this.up = false;
                        this.down = true;
                        this.explain = '升温';
                    } else {
                        this.up = true;
                        this.down = false;
                        this.explain = '制冷';
                    }
                }

            },
            add() {
                if (this.status === 0) {
                    this.figure++;
                    if (this.figure > this.now) {
                        this.up = false;
                        this.down = true;
                        this.explain = '升温';
                    } else {
                        this.up = true;
                        this.down = false;
                        this.explain = '制冷';
                    }
                }
            },
            play() {
                if (this.status === 1) {
                    this.$axios({
                        method: 'POST',
                        url: '/inspector/device/disableDevice',
                        data: this.$qs.stringify({
                            loginCode: localStorage.getItem("loginCode"),
                            deviceId: this.deviceId
                        })
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.status = 0;
                            alert("禁用成功")
                        } else {
                            alert(res.data.data)
                        }
                    })
                } else {
                    this.$axios({
                        method: 'POST',
                        url: '/inspector/device/enableDevice',
                        data: this.$qs.stringify({
                            loginCode: localStorage.getItem("loginCode"),
                            deviceId: this.deviceId
                        })
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.status = 1;
                            alert("启用成功")
                        } else {
                            alert(res.data.data)
                        }
                    })
                }

            },
            affirm() {
                this.$axios({
                    method: 'POST',
                    url: '/inspector/device/setTemperature',
                    data: this.$qs.stringify({
                        loginCode: localStorage.getItem("loginCode"),
                        deviceId: this.deviceId,
                        temperature: this.figure
                    })
                }).then((res) => {
                    if (res.data.code === 0) {
                        alert("温度设置成功，请等待1~2小时，请开启设备，否则无法正常使用")
                    } else {
                        alert(res.data.data)
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #temperature {
        min-height: 100%;
        background: #f2f2f2;
        .device {
            width: 690px;
            height: 260px;
            background: rgba(255, 255, 255, 1);
            border-radius: 8px;
            margin: 0 auto;
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
            .device-mian {
                text-align: center;
                position: relative;
                box-sizing: border-box;
                padding-top: 35px;
            }
            .content {
                .numerical {
                    font-size: 60px;
                    color: rgba(51, 51, 51, 1);
                }
                .text {
                    font-size: 22px;
                    color: rgba(153, 153, 153, 1)
                }
            }

            .show {
                position: absolute;
                right: 10px;
                top: 10px;
                img {
                    width: 26px;
                    height: 26px;
                    vertical-align: middle;
                }
                span {
                    font-size: 22px;
                    padding-left: 10px;
                }
            }
        }
        /*开启温控*/

        .control {
            width: 690px;
            height: 340px;
            background: rgba(255, 255, 255, 1);
            border-radius: 8px;
            margin: 20px auto;
            position: relative;
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
            .control-center {
                text-align: center;
                padding-top: 40px;
                .explain {
                    font-size: 30px;
                    color: rgba(96, 147, 249, 1);
                    height: 40px;
                    display: block;
                }
                .up {
                    color: #F9617D;
                }
                .handle {
                    height: 70px;
                    line-height: 70px;
                    margin: 0 auto;
                    width: 276px;
                    padding-top: 20px;
                    > div {
                        float: left;
                        font-size: 30px;
                        color: rgba(51, 51, 51, 1);
                    }
                    .minus, .add {
                        width: 48px;
                        height: 48px;
                        img {
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                    .number {
                        width: 140px;
                        height: 70px;
                        background: rgba(238, 239, 240, 1);
                        border-radius: 35px;
                        margin: 0 20px;
                    }
                }
                .opacity {
                    opacity: 0.5;
                }
                .set {
                    font-size: 22px;
                    color: rgba(153, 153, 153, 1);
                }

            }
            .start {
                position: absolute;
                width: 66px;
                height: 30px;
                right: 30px;
                top: 30px;
                background: rgba(187, 208, 251, 1);
                border-radius: 15px;
                > div {
                    width: 40px;
                    height: 40px;
                    background: #6093F9;
                    border-radius: 50%;
                    position: absolute;
                    top: -5px;
                    right: 0;
                }
                .play {
                    background: #C4C1C2;
                    left: 0;
                }
            }
            .play {
                background: #F2F1F1;
            }
        }
        .affirm {
            width: 750px;
            height: 88px;
            background: #6093F9;
            color: white;
            line-height: 88px;
            text-align: center;
            position: fixed;
            bottom: 0;
        }
    }
</style>