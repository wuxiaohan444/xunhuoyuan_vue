<template>
    <div id="tradition">
        <div class="navigation-head"><img src="../../assets/images/back.png" alt="" class="back"
                                          @click="$router.back(-1)"><span>库存详情</span></div>
        <div class="title">
            <div :class="titleIndex===index?'active':''" v-for="(item,index) in titleArr" :key="index"
                 @click="chooseIndex(index)">{{item}}
            </div>
        </div>
        <!--货道-->
        <div class="aisle-main" v-if="titleIndex===0">
            <!--左边-->
            <div class="aisle-main-left">
                <div :class="tierIndex===index?'aisle-main-left-item active':'aisle-main-left-item'"
                     v-for="(item,index) in tierNumber" :key="index" @click="chooseTier(index,item)">{{item}}
                </div>
            </div>
            <!--右边-->
            <div class="aisle-main-right">
                <div class="aisle-main-right-item">
                    <div class="aisle-main-right-item-title">{{tierList.floor}}</div>
                    <div class="aisle-main-right-item-list" v-for="(item,index) in tierList.channelList" :key="index">
                        <img :src="ip+item.foo.goods.img">
                        <div class="list-goods">
                            <div class="list-goods-name">{{item.foo.goods.name}}</div>
                            <div class="list-goods-info">
                                <div class="realNo">货道编号：{{item.realNo}}</div>
                                <div>数量: <span>{{item.num}}</span> / {{item.maxNum}}</div>
                            </div>
                        </div>
                        <div class="choose" @click="chooseChannel(item.choose,index)"><img
                                :src="item.choose===1?require('../../assets/images/choose1.png'):require('../../assets/images/choose.png')"
                                alt=""></div>
                    </div>
                    <div class="noGoods" v-show="textHiht">暂无商品</div>
                </div>
            </div>
        </div>
        <!--商品-->
        <div class="goods-main" v-if="titleIndex===1">
            <div class="goods-main-item" v-for="(item,index) in goodsList" :key="index">
                <img :src="ip+item.img">
                <div class="goods-main-info">
                    <div>{{item.name}}</div>
                    <div>￥{{item.price}}</div>
                </div>
                <div class="goods-number">
                    数量 : <span>{{item.foo.num}}</span>
                </div>
            </div>
        </div>
        <div class="foot-btn">
            <div>一键补满</div>
            <div>自定义补货</div>
            <div @click="adjust">容量调整</div>
        </div>
        <div class="modal" v-show="adjustShow">
            <div class="modal_box">
                <h5 class="modal_title">容量调整</h5>
                <input type="text" placeholder="填写调整数量" v-model="adjustNumber">
                <div class="modal_btn">
                    <div @click="listenerCancel">取消</div>
                    <div @click="listenerConfirm">确认</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "tradition",
        data() {
            return {
                deviceId: '',
                titleArr: ['货道', '商品'],
                titleIndex: 0,
                tierNumber: '',//层数
                tierIndex: 0,
                tierInfo: '',//货道详情
                tierList: [],
                countData: '',
                ip: this.fixedIp(),
                textHiht: false,
                goodsList: [],
                adjustShow: false,
                adjustNumber: ''
            }
        },
        created() {
            this.deviceId = this.$route.query.id;
            this.getInfo();
            this.getGoods()
        },
        methods: {
            getInfo() {
                this.$axios("get", '/inspector/device/traditionalByFloor/' + this.deviceId, {loginCode: localStorage.getItem('loginCode')}, (res) => {
                    let data = res.data;
                    this.tierNumber = data.map((a) => {
                        return a.floor
                    });
                    this.countData = data;
                    this.getTier(data, this.tierNumber[this.tierIndex])
                });
            },

            chooseIndex(index) {
                this.titleIndex = index;
            },

            // 选择层数
            chooseTier(index, content) {
                this.tierIndex = index;
                this.getTier(this.countData, content)
            },

            getTier(data, tierNumber) {
                let tierList;
                for (let i = 0; i < data.length; i++) {
                    if (tierNumber === data[i].floor) {
                        tierList = data[i];
                    }
                }
                let tierList1 = [];
                tierList.channelList.reduce((item, next) => {
                    next.foo.hasOwnProperty("goods") && tierList1.push(next);
                    return next;
                }, {foo: {}});
                tierList1.map((num) => {
                    num.choose = 0;
                });
                tierList.channelList = tierList1;

                this.tierList = tierList;
                if (tierList.channelList === 0) {
                    this.textHiht = true
                }
            },
            getGoods() {
                this.$axios("get", '/inspector/device/traditionalByGoods/' + this.deviceId, {loginCode: localStorage.getItem('loginCode')}, (res) => {
                    this.goodsList = res.data;
                });
            },
            adjust() {
                this.adjustShow = true;
            },
            listenerCancel() {
                this.adjustShow = false;
            },
            listenerConfirm() {
                let channelGoodsIds = [];
                for (let i = 0; i < this.tierList.channelList.length; i++) {
                    if (this.tierList.channelList[i].choose === 1) {
                        channelGoodsIds.push(this.tierList.channelList[i].id)
                    }
                }
                this.$axios("post", '/inspector/device/adjustMaxNum', {
                    loginCode: localStorage.getItem('loginCode'),
                    channelGoodsIds: channelGoodsIds.join(','),
                    num: this.adjustNumber
                }, (res) => {
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                    this.getInfo();
                    this.adjustShow = false;
                });
            },
            chooseChannel(choose, index) {
                if (choose === 0) {
                    this.tierList.channelList[index].choose = 1;
                } else if (choose === 1) {
                    this.tierList.channelList[index].choose = 0;
                }
                this.$forceUpdate()
            }
        }
    }
</script>

<style scoped lang="less">
    #tradition {
        height: 100%;
    }

    .title {
        padding: 0 80px;
        display: flex;
        justify-content: space-between;
        font-size: 28px;
        height: 80px;
        > div {
            width: 230px;
            text-align: center;
            line-height: 80px;
            box-sizing: border-box;
        }
        .active {
            color: #595CA1;
            border-bottom: 4px solid #595CA1;
        }

    }

    .aisle-main {
        height: calc(~'100% - 165px');
        .aisle-main-left {
            width: 180px;
            background: #f3f3f3;
            height: 100%;
            float: left;
            .aisle-main-left-item {
                font-size: 28px;
                color: rgba(51, 51, 51, 1);
                height: 100px;
                line-height: 100px;
                text-align: center;
            }
            .aisle-main-left-item:after {
                display: block;
                content: '';
                width: 80px;
                height: 2px;
                background: #E5E5E5;
                margin-left: 50px;
            }
            .aisle-main-left-item:last-child:after {
                background: #f3f3f3;
            }
            .aisle-main-left-item.active {
                background: white;
            }
            .aisle-main-left-item.active:after {
                background: #f3f3f3;
            }

        }
        .aisle-main-right {
            width: 540px;
            float: left;
            margin-left: 30px;
            height: 100%;
            overflow: scroll;
            .aisle-main-right-item-title {
                font-size: 28px;
                color: rgba(51, 51, 51, 1);
                text-align: center;
                line-height: 70px;
                box-shadow: 0 2px 0px 0px rgba(35, 24, 21, 0.1);
            }

            .aisle-main-right-item-list {
                box-shadow: 0 2px 0px 0px rgba(35, 24, 21, 0.1);
                display: flex;
                font-size: 28px;
                color: #333333;
                padding: 20px 0;
                position: relative;
                img {
                    width: 100px;
                    height: 100px;
                    margin-right: 20px;
                }
                .list-goods {
                    width: 400px;
                    .channel-btn {
                        display: flex;
                        justify-content: flex-end;
                        > div {
                            width: 120px;
                            height: 56px;
                            background: rgba(212, 166, 96, 1);
                            border-radius: 6px;
                            color: white;
                            text-align: center;
                            line-height: 56px;
                            margin-left: 20px;
                        }
                    }
                }
                .choose {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    right: 20px;
                    top: 20px;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .list-goods-info {
                    display: flex;
                    justify-content: space-between;
                    .realNo {
                        color: #999999;
                    }
                    > div {
                        line-height: 60px;
                        span {
                            color: #595CA1;
                        }
                    }
                }
            }
        }
        .noGoods {
            text-align: center;
            font-size: 30px;
            line-height: 150px;
        }
    }

    /*商品*/
    .goods-main {
        background: #f2f2f2;
        height: calc(~'100% - 165px');
        overflow: scroll;
        .goods-main-item {
            height: 190px;
            box-shadow: 0 2px 0 0 rgba(35, 24, 21, 0.1);
            display: flex;
            align-items: center;
            padding: 0 20px;
            font-size: 28px;
            color: #333333;
            background: white;
            margin-bottom: 2px;
            img {
                width: 130px;
                height: 130px;
            }
            .goods-main-info {
                width: 400px;
                margin-left: 20px;
                > div {
                    line-height: 60px;
                }
            }
            .goods-number {
                width: 175px;
                text-align: right;
                span {
                    color: #595CA1;
                }
            }
        }
    }

    .foot-btn {
        width: 100%;
        height: 88px;
        position: fixed;
        bottom: 0;
        left: 0;
        display: flex;
        > div {
            text-align: center;
            line-height: 88px;
            color: white;
            font-size: 28px;
            flex: 1;
        }
        > div:nth-child(1) {
            background: #5AA9E8;
        }
        > div:nth-child(2) {
            background: #595CA1;
        }
        > div:nth-child(3) {
            background: #d4a660;
        }
    }

    .modal {
        height: 100%;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.4);
        .modal_box {
            width: 590px;
            height: 360px;
            background-color: #ffffff;
            border-radius: 8px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            .modal_title {
                text-align: center;
                line-height: 88px;
                box-shadow: inset 0px -2px 0px 0px rgba(34, 24, 21, 0.1);
                font-size: 32px;
            }
            input {
                margin: 54px 20px;
                width: 550px;
                height: 80px;
                background-color: #ffffff;
                border-bottom: 1px solid rgba(34, 24, 21, 0.5);
                color: #666;
            }
            .modal_btn {
                display: flex;
                > div {
                    flex: 1;
                    text-align: center;
                    line-height: 80px;
                    border-top: 1px solid rgba(34, 24, 21, 0.2);
                    font-size: 32px;
                }
                > div:nth-child(1) {
                    border-right: 1px solid rgba(34, 24, 21, 0.2);
                }
            }
        }
    }
</style>