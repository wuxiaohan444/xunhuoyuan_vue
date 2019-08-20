<template>
    <div id="device">
        <div class="navigation-head"><span class="single">售货机</span></div>
        <div class="head">
            <div v-for="(item,index) in deviceClass" :key="index" :class="deviceClassIndex===index?'active':''"
                 @click="chooseDeviceClass(index)">
                {{item}}
            </div>
        </div>
        <div class="deviceStatus" v-if="deviceClassIndex===0">
            <div class="deviceStatus-title">
                <div class="item-content">
                    <div :class="changeRed === index ? 'active' : ''" v-for="(item,index) in list"
                         :key="index" @click="sellGoodsIndex(index,item.id)">
                        {{item.text}}({{item.number}})
                    </div>
                </div>
            </div>
        </div>
        <div class="deviceStatus" v-if="deviceClassIndex===1">
            <div class="title">
                <div v-for="(item,index) in titleArr" :class="titleIndex===index?'active':''" :key="index"
                     @click="chooseIndex(index)">{{item}}
                </div>
            </div>
        </div>

        <!--主体-->
        <div class='main'>
            <div class="main-item" v-for="(item,index) in deviceList" :key="index">
                <div class="main-item-title" @click="skip(item.structureId,item.id)">
                    <span class="">{{item.nickName}}</span>
                    <img src="../assets/images/right.png">
                </div>
                <div class="main-item-box">
                    <div class="main-item-box-left">
                        <div>编号：{{item.no}}</div>
                        <div>位置：{{item.address}}</div>
                    </div>
                    <div class="main-item-box-right">
                        <div v-if="item.structureId===1">数量：
                            <span>{{item.foo.goodsNowNum}}</span>
                            /{{item.foo.goodsAllNum}}
                        </div>
                        <div v-if="item.structureId===2">剩余数量：
                            <span>{{item.foo.num==null?'0':item.foo.num}}</span>
                        </div>
                        <div v-if="item.structureId===1">类型：传统电机</div>
                        <div v-if="item.structureId===2">类型：RFID</div>
                        <div v-if="item.structureId===3">类型：格子柜</div>
                    </div>
                </div>
            </div>
        </div>
        <navigationBar></navigationBar>
    </div>
</template>

<script>
    import navigationBar from "@/components/navigationBar"

    export default {
        name: "device",
        components: {
            navigationBar
        },
        data() {
            return {
                deviceClass: ['设备状态', '设备结构'],
                deviceClassIndex: 0,
                changeRed: 0,
                list: [
                    {
                        'text': '所有',
                        id: 0,
                        number: ""
                    },
                    {
                        'text': '待补货',
                        id: 1,
                        number: ""
                    },
                    {
                        'text': '故障',
                        id: 2,
                        number: ""
                    },
                    {
                        'text': '离线',
                        id: 3,
                        number: ""
                    }],
                device: '',
                deviceList: [],
                titleArr: ['所有货柜', '电机/格子柜', 'RFID货柜'],
                titleIndex: 0,
                page: 1,
                structureId: 0,
                status: 0,
            }
        },
        created() {
            this.$axios('get', '/inspector/device/deviceCount', {loginCode: localStorage.getItem('loginCode')}, (res) => {
                let data = res.data;
                this.list[0].number = data.all;
                this.list[1].number = data.needAdd;
                this.list[2].number = data.bad;
                this.list[3].number = data.offline;
            });
            this.getRequest()
        },
        methods: {
            getRequest() {
                this.$axios('get', '/inspector/device/listByStatus/' + this.status, {
                    loginCode: localStorage.getItem('loginCode'),
                    page: this.page,
                    limit: 10
                }, (res) => {
                    this.deviceList = res.rows;
                });
            },
            sellGoodsIndex(index, id) {
                this.changeRed = index;
                this.status = id;
                this.deviceList = [];
                this.getRequest()
            },
            chooseDeviceClass(index) {
                this.deviceClassIndex = index;
                this.page = 1;
                this.deviceList = [];
                switch (index) {
                    case 0:
                        this.status = 0;
                        this.getRequest();
                        break;
                    case 1:
                        this.structureId = 0;
                        this.getData()
                }

            },
            chooseIndex(index) {
                this.titleIndex = index;
                switch (index) {
                    case 0:
                        this.structureId = 0;
                        this.getData();
                        break;
                    case 1:
                        this.structureId = 1;
                        this.getData();
                        break;
                    case 2:
                        this.structureId = 2;
                        this.getData()
                }
            },

            getData() {
                this.$axios('get', '/inspector/device/listByStructure/' + this.structureId, {
                    loginCode: localStorage.getItem('loginCode'),
                    page: this.page,
                    limit: '10',
                }, (res) => {
                    this.deviceList = res.rows;
                });
            },
            skip(structureId, id) {
                this.$router.push({
                    path: '/carryOn',
                    query: {
                        id: id
                    }
                })
            },
            lookDetails(id) {
                this.$router.push({
                    path: '/deviceDetails',
                    query: {
                        deviceId: id
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #device {
        height: 100%;
        background: #efefef;
    }

    .head {
        width: 100%;
        height: 100px;
        box-sizing: border-box;
        display: flex;
        text-align: center;
        background: white;
        margin-bottom: 10px;
        justify-content: center;
        align-items: center;
        div {
            height: 80px;
            width: 230px;
            font-size: 28px;
            line-height: 80px;
            color: #333333;
            border: 1px solid #D4A660;
        }
        div:nth-child(1) {
            border-radius: 8px 0 0 8px;
        }
        div:nth-child(2) {
            border-radius: 0 8px 8px 0;
        }
        .active {
            color: #ffffff;
            background: #D4A660;
        }
    }

    .deviceStatus {
        /*售货机状态*/
        .deviceStatus-title {
            width: 100%;
            white-space: nowrap;
            background: white;
            overflow: scroll;
            height: 88px;
            .item-content {
                text-align: center;
                font-size: 30px;
                width: 130%;
                display: flex;
                height: 100%;
                div {
                    width: 30%;
                    line-height: 88px;
                    font-size: 32px;
                    text-align: center;
                }
                .active {
                    color: #D4A660;
                    position: relative;
                }
                .active::after {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 8px;
                    background: #D4A660;
                    bottom: 0;
                    left: 0;
                }
            }
        }
        .title {
            display: flex;
            font-size: 28px;
            color: #333333;
            height: 88px;
            padding: 0 30px;
            box-sizing: border-box;
            background: white;
            > div {
                line-height: 88px;
                flex: 1;
                text-align: center;
            }
            .active {
                color: #D4A660;
                border-bottom: 8px solid #D4A660;
            }
        }
    }

    .main {
        padding: 30px 20px;
        height: calc(~'100% - 280px');
        box-sizing: border-box;
        overflow: scroll;
        .main-item {
            height: 230px;
            background: white;
            border-radius: 8px;
            padding: 0 30px;
            margin-bottom: 20px;
            .main-item-title {
                font-size: 28px;
                font-weight: bold;
                color: rgba(51, 51, 51, 1);
                height: 70px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                img {
                    width: 34px;
                    height: 34px;
                }
            }
            .main-item-box {
                height: 120px;
                display: flex;
                > div {
                    flex: 1;
                    font-size: 26px;
                    color: rgba(102, 102, 102, 1);
                    div {
                        line-height: 60px;
                        span {
                            color: #595CA1;
                        }
                    }

                }
                div:nth-child(2) {
                    border-left: 1px solid #EFEFEF;
                    padding-left: 30px;
                    box-sizing: border-box;
                }
            }
            .main-item-box-left > div {
                width: 308px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
</style>