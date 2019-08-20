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
                            <div class="number">货道编号:{{item.showNo}}</div>
                        </div>
                        <div class="goods_choose" @click="chooseMultipleChannel(index,sub)">
                            <img :src="item.choose===0?require('../../assets/images/choose.png'):require('../../assets/images/choose1.png')"
                                 v-show="chooseShow">
                        </div>
                        <div class="item_number">
                            <span @click="minusCount(index,sub)" class="minus">-</span>
                            <input class="count" title="" v-model="item.goodsNum">
                            <span @click="addCount(index,sub,item.maxNum)" class="add">+
                        </span>
                        </div>
                        <div class="goods_sum">剩余数量:
                            <span style="color: #595CA1">{{item.num===null?0:item.num}}</span>
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
        <div class="add_footer">
            <div class="add_footer-top" v-show="topShow">
                <div class="top-left" @click="allChoose">
                    <img :src="chooseAll===0?require('../../assets/images/choose.png'):require('../../assets/images/choose1.png')">
                    <span>全选</span>
                </div>
                <div class="btn" @click="goodsShow1">
                    更换商品
                </div>
            </div>
            <div class="add_footer_bottom">
                <div class="multiple_choose" @click="multipleChoose">{{multipleText}}</div>
                <div class="add_save" @click="save">保存</div>
            </div>
        </div>

        <!--商品-->
        <div class="goods" v-show="goods_show">
            <div class="navigation-head"><img src="../../assets/images/back.png" alt="" class="back"
                                              @click="$router.back(-1)"><span>补货</span></div>
            <div class="search">
                <input type="text" placeholder="搜索需要更换的商品" @keyup.enter="search" v-model="goodsName"/>
                <button @click="search">搜索</button>
            </div>
            <div class="goods-main" @scroll="scrollGoods" ref="goodsBox">
                <div class="goods_list clearfloat" v-for="(item,index) in goods" :key="index">
                    <div class="goods_name">{{item.name}}</div>
                    <div class="goods_price">￥{{item.discount}}</div>
                    <div class="goods_change" @click="change(item.id)">更换商品</div>
                </div>
            </div>
            <div class="exit" @click="exit">退出</div>
        </div>
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
                chooseAll: 0,
                multipleText: '多选',
                multipleStatus: 0,
                topShow: false,
                chooseShow: false,
                restsShow: false,
                goods_show: false,
                goods: [],
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
                this.$axios({
                    method: 'get',
                    url: '/inspector/device/traditionalByFloor/' + this.deviceId,
                    params: {
                        loginCode: localStorage.getItem('loginCode'),
                    },
                }).then((res) => {
                    if (res.data.code === 0) {
                        let data = res.data.data;
                        this.tierNumber = data.map((num) => {
                            return num.floor
                        });
                        data.reduce((item, next) => {
                            next.channelList.map((num) => {
                                num.choose = 0;
                                num.goodsNum = 0;
                                return num
                            });
                            return next
                        }, []);
                        this.channel = data;
                        this.$nextTick(()=>{
                            for (let i = 0; i < this.channel.length; i++) {
                                this.heightArr.push(this.$refs[this.channel[i].floor][0].offsetTop - (this.$refs.head.offsetHeight + this.$refs.top.offsetHeight))
                            }
                        })
                    }
                })
            },

            getChoose(data, value) {
                data.reduce((item, next) => {
                    next.channelList.map((num) => {
                        num.choose = value;
                        return num
                    });
                    return next
                }, []);
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
            scrollGoods() {
                let a = this.$refs.goodsBox.scrollHeight;
                let b = this.$refs.goodsBox.clientHeight;
                let c = this.$refs.goodsBox.scrollTop;
                if (b + c >= a) {
                    this.page++;
                    this.getGoods();
                }
            },
            search() {
                this.goods = [];
                this.page = 1;
                this.getGoods();
            },
            getGoods() {
                this.$axios({
                    method: 'get',
                    url: '/inspector/goods/list',
                    params: {
                        loginCode: localStorage.getItem('loginCode'),
                        id: this.deviceId,
                        page: this.page,
                        goodsName: this.goodsName
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.goods = this.goods.concat(res.data.rows)
                    }
                })
            },

            sellGoodsIndex(index) {
                this.chooseIndex = index;
                document.getElementById(index).scrollIntoView(); //指定到某个位置
            },
            // 商品出现
            goodShow(id) {
                let channelId = [];
                channelId.push(id);
                this.channelId = channelId;
                this.goods = [];
                this.page = 1;
                this.goodsName = '';
                this.goods_show = true;
                this.getGoods();
            },
            goodsShow1() {
                let channel = [];
                for (let i = 0; i < this.channel.length; i++) {
                    for (let j = 0; j < this.channel[i].channelList.length; j++) {
                        if (this.channel[i].channelList[j].choose === 1) {
                            channel.push(this.channel[i].channelList[j].id)
                        }
                    }
                }

                if (channel.length <= 0) {
                    alert("请选择货道")
                } else {
                    this.goods_show = true;
                    this.goods = [];
                    this.page = 1;
                    this.channelId = channel;
                    this.getGoods();
                }
            },
            exit() {
                this.goods_show = false
            },
            //多选
            chooseMultipleChannel(index, sub) {
                let choose = this.channel[index].channelList[sub].choose;
                if (choose === 0) {
                    this.channel[index].channelList[sub].choose = 1;
                } else {
                    this.channel[index].channelList[sub].choose = 0;
                }
            },
            // 减
            minusCount(index, sub) {
                if (this.channel[index].channelList[sub].num <= 0) {
                    alert("无法再减了")
                } else {
                    this.channel[index].channelList[sub].goodsNum--;
                    this.channel[index].channelList[sub].num--;
                }
            },
            //加
            addCount(index, sub, maxNum) {
                if (this.channel[index].channelList[sub].num >= maxNum) {
                    alert("无法再加了")
                } else {
                    this.channel[index].channelList[sub].goodsNum++;
                    this.channel[index].channelList[sub].num++;
                }

            },
            multipleChoose() {
                if (this.multipleStatus === 0) {
                    this.topShow = true;
                    this.chooseShow = true;
                    this.multipleText = '取消多选';
                    this.multipleStatus = 1;
                } else {
                    this.topShow = false;
                    this.chooseShow = false;
                    this.multipleText = '多选';
                    this.multipleStatus = 0;
                }
            },
            allChoose() {
                if (this.chooseAll === 0) {
                    this.chooseAll = 1;
                    this.getChoose(this.channel, 1)
                } else {
                    this.chooseAll = 0;
                    this.getChoose(this.channel, 0)
                }
            },
            change(id) {
                this.goodsId = id;
                this.modalShow = true;
                for (let i = 0; i < this.goods.length; i++) {
                    if (this.goodsId === this.goods[i].id) {
                        this.changeGoodsInfo = this.goods[i]
                    }
                }
                this.modalOption = {
                    text: '确认更换商品吗？'
                };
                this.$refs.modalBox.confirm().then(() => {
                    for (let i = 0; i < this.channel.length; i++) {
                        for (let j = 0; j < this.channel[i].channelList.length; j++) {
                            if (this.channelId.indexOf(this.channel[i].channelList[j].id) !== -1) {
                                this.channel[i].channelList[j].goodsNum = 0;
                                this.channel[i].channelList[j].num = 0;
                                this.channel[i].channelList[j].foo.goods = this.changeGoodsInfo;
                                this.channel[i].channelList[j].goodsId = this.goodsId
                            }
                        }
                    }
                    this.goods_show = false;
                    this.modalShow = false
                }).catch(() => {
                    this.modalShow = false;
                })
            },
            chooseTitle(index) {
                this.titleIndex = index;
                if (this.titleIndex === 1) {
                    let goodsDetail = [];
                    for (let i = 0; i < this.channel.length; i++) {
                        goodsDetail = goodsDetail.concat(this.channel[i].channelList)
                    }

                    this.$axios({
                        method: 'post',
                        url: '/inspector/goodsIn/traditionalCalculate/' + this.deviceId + '?loginCode=' + localStorage.getItem('loginCode'),
                        data: goodsDetail,
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.goodsList = res.data.data;
                        } else {
                            alert(res.data.data);
                        }
                    })
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
                    this.bus.$emit('loading', true);
                    this.modalShow = false;
                    this.$axios({
                        method: 'post',
                        url: '/inspector/goodsIn/traditionalAdd/' + this.deviceId + '?loginCode=' + localStorage.getItem('loginCode'),
                        data: goodsDetail,
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.checkStatus();
                        } else {
                            this.bus.$emit('loading', false);
                            alert(res.data.data);
                        }
                    });
                }).catch(() => {
                    this.modalShow = false;
                })

            },
            checkStatus() {
                this.$axios({
                    method: 'get',
                    url: '/inspector/device/infoById/' + this.deviceId + '?loginCode=' + localStorage.getItem('loginCode'),
                }).then((res) => {
                    this.bus.$emit('loading', false);
                    if (res.data.code === 0) {
                        let status = res.data.data.status;
                        if (status === 1) {
                            this.$router.push({
                                path: '/index'
                            })
                        } else if (status === 3) {
                            setTimeout(() => {
                                this.checkStatus();
                            }, 2000)
                        }
                    } else {
                        alert(res.data.data);
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
            height: 180px;
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
                width: 50%;

                .number {
                    font-size: 26px;
                    color: rgba(153, 153, 153, 1);
                }
            }
            .item_number {
                float: left;
                padding-top: 20px;
                padding-left: 30px;
            }
        }
        .minus, .add, .count {
            display: inline-block;
            width: 60px;
            height: 60px;
            text-align: center;
            vertical-align: middle;
            line-height: 60px;
            z-index: -1;
        }
        .count {
            margin: 0 15px;
        }
        .minus, .add {
            background: #D4A660;
            color: white;
            border-radius: 50%;
            font-weight: 700;
        }
        .goods_sum {
            float: right;
            padding-top: 30px;
            padding-right: 20px;
            font-size: 26px;
            color: rgba(153, 153, 153, 1);
        }

        .goods_choose {
            position: absolute;
            right: 30px;
            top: 30px;
            > img {
                width: 40px;
                height: 40px;
            }
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
        background: white;
        border-top: 2px solid rgba(35, 24, 21, 0.1);
        box-sizing: border-box;
        .add_footer-top {
            height: 88px;
            display: flex;
            width: 100%;
            position: absolute;
            top: -90px;
            box-shadow: 0 -2px 0 0 rgba(35, 24, 21, 0.1);
            background: white;
            align-items: center;
            justify-content: space-between;
            padding: 0 50px;
            box-sizing: border-box;
            .top-left {
                display: flex;
                align-items: center;
            }
            img {
                width: 40px;
                height: 40px;
                margin-right: 20px;
            }
            span {
                font-size: 26px;
                color: #999999;
            }
            .btn {
                width: 150px;
                height: 60px;
                border: 1px solid #F64E56;
                color: #F64E56;
                line-height: 60px;
                border-radius: 30px;
                box-sizing: border-box;
                text-align: center;
                font-size: 26px;
            }

        }
        .add_footer_bottom {
            display: flex;
            height: 98px;
            > div {
                color: white;
                line-height: 98px;
                text-align: center;
            }
            .multiple_choose {
                flex: 1;
                background: #D4A660;
            }
            .add_save {
                flex: 2;
                background: #595CA1;
            }
        }
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

    /*商品列表*/
    .search {
        width: 690px;
        height: 68px;
        position: fixed;
        top: 110px;
        left: 50%;
        transform: translateX(-50%);
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        input {
            width: 70%;
            height: 100%;
            border: 2px solid rgba(94, 94, 94, 1);
            border-radius: 34px;
            padding-left: 20px;
            box-sizing: border-box;
            font-size: 26px;
            text-align: center;
        }
        button{
            width: 20%;
            height: 90%;
            background:#595CA1;
            border:none;
            outline: none;
            border-radius: 34px;
            color: white;
        }
    }

    .goods {
        position: fixed;
        top: 0;
        width: 100%;
        height: 100%;
        background: #ffffff;
        z-index: 999;
        padding-top: 188px;
        box-sizing: border-box;
        .goods-main {
            height: calc(~'100% - 100px');
            overflow: scroll;
        }
        .goods_list {
            background: white;
            padding: 30px;
            height: 140px;
            box-sizing: border-box;
            position: relative;
            box-shadow: 0 -1px 0 0 rgba(223, 223, 223, 1);
            > div {
                font-size: 26px;
                color: rgba(51, 51, 51, 1);
            }
            .goods_change {
                width: 140px;
                height: 60px;
                background: #595CA1;
                border-radius: 30px;
                color: white;
                text-align: center;
                line-height: 60px;
                position: absolute;
                top: 50%;
                right: 30px;
                transform: translateY(-50%);
            }
            .goods_price {
                font-size: 28px;
                font-weight: bold;
                color: #595CA1;
            }
        }
        .exit {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            background: #595CA1;
            color: white;
            line-height: 80px;
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