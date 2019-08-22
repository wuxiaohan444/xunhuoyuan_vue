<template>
    <div id="addOrder">
        <div class="navigation-head" ref="top"><img src="../../assets/images/back.png" alt="" class="back"
                                                    @click="$router.back(-1)"><span>补货</span></div>
        <div class="title" ref="head">
            <div :class="titleIndex===index?'active':''" v-for="(item,index) in titleArr" :key="index"
                 @click="chooseTitle(index)">{{item}}
            </div>
        </div>
        <div class="box_left" v-if="titleIndex===0">
            <!--层数-->
            <div :class="topShow?'tier chooseHieght':'tier'">
                <div v-for="(item,index) in tierNumber"
                     :class="chooseIndex === index ? 'choose tier_number' : 'tier_number'"
                     @click='sellGoodsIndex(index)'
                     :key="index">{{item}}
                </div>
            </div>
            <!--内容-->
            <div :class="topShow?'content chooseHieght':'content'" @scroll="orderScroll" ref="Box">
                <div class="content_item" v-for="(item,index) in channel" :key="index" :id="index" :ref="item.floor">
                    <div class="content_title">{{item.floor}}</div>
                    <div class="content_main" v-for="(item,sub) in item.channelList" :key="sub">
                        <div class="goods_img" @click="goodShow(item.id)">
                            <img :src="ip+item.foo.goods.img">
                        </div>
                        <div class="goods_info">
                            <div class="name">{{item.foo.goods.name}}</div>
                            <div class="number">
                                <div>货道编号:{{item.showNo}}</div>
                                <div class="goods_sum">补货数量:<span
                                        style="color: #595CA1">{{item.goodsNum}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="box_right" v-if="titleIndex===1">
            <div class="goods-main-item" v-for="(item,index) in goodsList" :key="index">
                <img :src="ip+item.img">
                <div class="goods-main-info">
                    <div>{{item.name}}</div>
                    <div>￥{{item.price}}</div>
                </div>
                <div class="goods-number">
                    <div>当前数量 :
                        <span>{{item.foo.nowNum}}</span>
                    </div>
                    <div>之前数量 :
                        <span>{{item.foo.oldNum}}</span>
                    </div>
                    <div v-if="item.foo.nowNum-item.foo.oldNum>0">增加了<span>{{item.foo.nowNum-item.foo.oldNum}}</span>
                    </div>
                    <div v-if="item.foo.nowNum-item.foo.oldNum<0">减少了<span>{{item.foo.oldNum-item.foo.nowNum}}</span>
                    </div>
                    <div v-if="item.foo.nowNum-item.foo.oldNum===0">数量没有改变</div>
                </div>
            </div>
        </div>
        <!--底部-->
        <div class="add_footer" @click="save">保存</div>
        <modal :modal-option="modalOption" v-show="modalShow" ref="modalBox"></modal>
    </div>
</template>

<script>
    import modal from "../../components/modal"

    export default {
        name: "addOrder",
        data() {
            return {
                deviceId: '',
                tierNumber: '',
                channel: '',
                chooseIndex: 0,
                ip: this.fixedIp(),
                topShow: false,
                restsShow: false,
                heightArr: [],
                titleArr: ['货道', '商品'],
                titleIndex: 0,
                goodsList: '',
                page: 1,
                goodsName: '',
                channelId: '',
                modalShow: false,
                changeGoodsInfo: '',
                modalOption: {},
            }
        },
        components: {modal},
        created() {
            this.deviceId = this.$route.query.id;
            this.getReplenish();
        },
        methods: {
            getReplenish() {
                this.$axios('get', '/inspector/device/traditionalByFloor/' + this.deviceId, {loginCode: localStorage.getItem('loginCode')}, (res) => {
                    let data = res.data;
                    this.tierNumber = data.map((num) => {
                        return num.floor
                    });
                    data.reduce((item, next) => {
                        next.channelList.map((num) => {
                            num.goodsNum = num.maxNum - num.num;
                            return num
                        });
                        return next
                    }, []);
                    this.channel = data;
                    setTimeout(() => {
                        for (let i = 0; i < this.channel.length; i++) {
                            this.heightArr.push(this.$refs[this.channel[i].floor][0].offsetTop - (this.$refs.head.offsetHeight + this.$refs.top.offsetHeight))
                        }
                    }, 100);
                });
            },

            orderScroll() {
                let a = this.$refs.Box.scrollHeight;
                let b = this.$refs.Box.clientHeight;
                let c = this.$refs.Box.scrollTop;
                for (let i = 0; i < this.heightArr.length; i++) {
                    if (c >= this.heightArr[i]) {
                        this.chooseIndex = i;
                    }
                }
                if (c + b === a) {
                    this.chooseIndex = this.tierNumber.length - 1;
                }
            },

            sellGoodsIndex(index) {
                this.chooseIndex = index;
                document.getElementById(index).scrollIntoView(); //指定到某个位置
            },
            chooseTitle(index) {
                this.titleIndex = index;
                if (this.titleIndex === 1) {
                    let goodsDetail = [];
                    for (let i = 0; i < this.channel.length; i++) {
                        goodsDetail = goodsDetail.concat(this.channel[i].channelList)
                    }
                    this.$axios('POST', '/inspector/goodsIn/traditionalCalculate/' + this.deviceId + '?loginCode=' + localStorage.getItem('loginCode'), JSON.stringify(goodsDetail), (res) => {
                        this.goodsList = res.data;
                    }, "application/json", false);
                }
            },
            save() {
                let goodsDetail = [];
                for (let i = 0; i < this.channel.length; i++) {
                    goodsDetail = goodsDetail.concat(this.channel[i].channelList)
                }
                this.modalShow = true;
                this.modalOption = {
                    text: '确认提交补货单吗'
                };

                this.$refs.modalBox.confirm().then(() => {
                    this.modalShow = false;
                    this.$axios('post', '/inspector/goodsIn/traditionalAdd/' + this.deviceId + '?loginCode=' + localStorage.getItem('loginCode'), JSON.stringify(goodsDetail), (res) => {
                        this.checkStatus();
                    }, "application/json", false);
                }).catch(() => {
                    this.modalShow = false;
                })
            },
            checkStatus() {
                this.$axios('get', '/inspector/device/infoById/' + this.deviceId, {loginCode: localStorage.getItem('loginCode')}, (res) => {
                    let status = res.data.status;
                    if (status === 1) {
                        this.$router.push({
                            path: '/'
                        })
                    } else if (status === 3) {
                        setTimeout(() => {
                            this.checkStatus();
                        }, 2000)
                    }
                });
            },
        }
    }
</script>

<style scoped lang="less">
    #addOrder {
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
        > div.active {
            color: #595CA1;
            border-bottom: 4px solid #595CA1;
        }
    }

    .box_left, .box_right {
        height: calc(~'100% - 180px');
    }

    /*左侧*/
    .tier {
        width: 180px;
        height: 100%;
        box-sizing: border-box;
        float: left;
        background: #f3f3f3;
        margin-right: 20px;
        .tier_number {
            display: block;
            width: 180px;
            height: 100px;
            line-height: 100px;
            text-align: center;
            border-bottom: 1px solid #f3f3f3;
            font-size: 32px;
            color: #333333;
        }
        .choose {
            background: #FFFFFF;
        }
        /*隐藏滚动条*/
        ::-webkit-scrollbar {
            width: 0;
            height: 0;
            color: transparent;
        }

    }

    .tier.chooseHieght {
        height: calc(~'100% - 100px');
    }

    /*右侧*/
    .content {
        width: 550px;
        float: right;
        font-size: 32px;
        box-sizing: border-box;
        overflow: scroll;
        height: 100%;
        .content_item {
            padding-left: 10px;
            border-bottom: 10px solid #f3f3f3;
        }
        .content_item:last-child {
            border-bottom: none;
        }
        .content_title {
            padding: 10px 0;
            font-weight: 700;
            font-size: 34px;
            text-align: center;
            color: #333333;
        }
        .content_main {
            border-top: 1px solid #f3f3f3;
            height: 100px;
            padding-bottom: 20px;
            padding-top: 30px;
            position: relative;
            .goods_img {
                width: 100px;
                height: 100px;
                float: left;
                border: 2px solid #cccccc;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .goods_info {
                height: 100px;
                padding-right: 10px;
                /*margin-right: 40px;*/
                margin-left: 120px;

                .number {
                    font-size: 26px;
                    color: rgba(153, 153, 153, 1);
                    display: flex;
                    align-items: center;
                    line-height: 60px;
                    justify-content: space-between;
                }
            }
            .item_number {
                float: left;
                padding-top: 20px;
                padding-left: 30px;
            }
        }
        .goods_sum {
            font-size: 26px;
            color: rgba(153, 153, 153, 1);
            padding-right: 20px;
        }

    }

    .content.chooseHieght {
        height: calc(~'100% - 100px');
    }

    /*开始底部*/
    .add_footer {
        width: 100%;
        height: 100px;
        position: fixed;
        bottom: 0;
        background: #595CA1;
        border-top: 2px solid rgba(35, 24, 21, 0.1);
        box-sizing: border-box;
        color: white;
        text-align: center;
        line-height: 100px;
    }

    .restsBox {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .4);
        position: fixed;
        left: 0;
        top: 0;
        .btn {
            width: 124px;
            height: 124px;
            color: white;
            border-radius: 50%;
            font-size: 26px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            bottom: 249px;
        }
        .one_key {
            left: 211px;
            background: #23A010;
        }
        .quitReplenishment {
            right: 211px !important;
            background: #BD3B3C;
        }
        .quitRests {
            position: absolute;
            width: 94px;
            height: 94px;
            background: rgba(73, 73, 73, 1);
            border-radius: 50%;
            align-items: center;
            justify-content: center;
            color: white;
            display: flex;
            font-size: 50px;
            bottom: 60px;
            left: 50%;
            transform: translateX(-50%);
        }
    }

    .box_right {
        background: #f2f2f2;
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
                div {
                    text-align: left;
                    line-height: 50px;
                }
                text {
                    color: #1f76ec;
                }

            }

        }

    }
</style>