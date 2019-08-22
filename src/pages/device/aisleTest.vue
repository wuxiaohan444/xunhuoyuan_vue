<template>
    <div id="aisleTest">
        <div class="navigation-head"><img src="../../assets/images/back.png" alt="" class="back"
                                          @click="$router.back(-1)"><span>货道测试</span></div>
        <div class="test_main">
            <div :class="item.choose===0?'main_item':'main_item active'" v-for="(item,index) in channelList"
                 :key="index" @click="chooseChannel(index,item.choose)">
                <span>{{item.realNo}}</span>
                <div class="warning" v-show="item.status!==1">!</div>
            </div>
        </div>

        <div class="foot_btn">
            <div @click="channelAll">全货道测试</div>
            <div @click="channelTest">货道测试</div>
            <div @click="channelRecover">货道恢复</div>
        </div>
        <modal :modal-option="modalOption" v-show="modalShow" ref="modalBox"></modal>
    </div>
</template>

<script>
    import modal from "../../components/modal"

    export default {
        name: "aisleTest",
        data() {
            return {
                channelList: [],
                deviceId: '',
                modalShow: false,
                modalOption: {}
            }
        },
        components: {modal},
        created() {
            this.deviceId = this.$route.query.id;
            this.getChannelList();
        },
        methods: {
            getChannelList() {
                this.$axios('get', '/inspector/channelGoods/deviceAmountGoods?loginCode=' + localStorage.getItem('loginCode'), {deviceId: this.deviceId}, (res) => {
                    let data = res.data;
                    data.map((num) => num.choose = 0);
                    this.channelList = data;
                });
            },
            // 选择货道
            chooseChannel(index, choose) {
                switch (choose) {
                    case 0:
                        this.channelList[index].choose = 1;
                        break;
                    case 1:
                        this.channelList[index].choose = 0;
                }
            },
            // 货道测试
            channelTest() {
                let channelGoodsIds = '-1';
                for (let i = 0; i < this.channelList.length; i++) {
                    if (this.channelList[i].choose === 1) {
                        channelGoodsIds = channelGoodsIds + "," + this.channelList[i].id
                    }
                }

                this.$axios('post', '/inspector/channelGoods/sendManyTest', {
                    loginCode: localStorage.getItem("loginCode"),
                    deviceId: this.deviceId,
                    channelGoodsIds: channelGoodsIds
                }, (res) => {
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                })
            },
            // 全货道测试
            channelAll() {
                this.modalShow = true;
                this.modalOption = {
                    text: '是否进行全货道测试？'
                };
                this.$refs.modalBox.confirm().then(() => {
                    this.modalShow = false;
                    this.$axios('post', '/inspector/channelGoods/sendAllTest', {
                        loginCode: localStorage.getItem("loginCode"),
                        deviceId: this.deviceId
                    }, (res) => {
                        this.bus.$emit('tips', {
                            show: true,
                            title: res.data
                        });
                    });
                }).catch(() => {
                    this.modalShow = false;
                })

            },
            //货道恢复
            channelRecover() {
                let channelGoodsIds = '-1';
                for (let i = 0; i < this.channelList.length; i++) {
                    if (this.channelList[i].choose === 1) {
                        channelGoodsIds = channelGoodsIds + "," + this.channelList[i].id
                    }
                }
                this.$axios('post', '/inspector/channelGoods/enableMany', {
                    loginCode: localStorage.getItem("loginCode"),
                    deviceId: this.deviceId,
                    channelGoodsIds: channelGoodsIds
                }, (res) => {
                    this.bus.$emit('tips', {
                        show: true,
                        title: res.data
                    });
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .test_main {
        padding: 30px;
        padding-right: 0;
        display: flex;
        flex-flow: row wrap;
        .main_item {
            width: 122px;
            height: 58px;
            border: 2px solid rgba(204, 204, 204, 1);
            border-radius: 8px;
            color: #999999;
            font-size: 30px;
            text-align: center;
            line-height: 58px;
            margin-right: 20px;
            margin-bottom: 20px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            .warning {
                width: 24px;
                height: 24px;
                background: #EA5959;
                border-radius: 50%;
                color: white;
                font-size: 20px;
                line-height: 24px;
                margin-left: 5px;
            }
        }
        .main_item.active {
            border: 2px solid #D4A660;
            color: #D4A660;
            position: relative;
        }
        .main_item.active:before {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border-top: 18px solid transparent;
            border-left: 18px solid transparent;
            border-right: 18px solid #D4A660;
            border-bottom: 18px solid #D4A660;
            color: #ffffff;
            bottom: 0;
            right: 0;
        }
        .main_item.active:after {
            content: 'へ';
            position: absolute;
            width: 36px;
            height: 36px;
            right: 0;
            bottom: 0;
            font-size: 18px;
            color: #ffffff;
            transform: rotateX(180deg);
            line-height: 20px;
            text-align: right;
        }

    }

    .foot_btn {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 98px;
        display: flex;
        > div {
            flex: 1;
            color: white;
            text-align: center;
            line-height: 98px;
        }
        > div:nth-child(1) {
            background: #D4A660;
        }
        > div:nth-child(2) {
            background: #5AA9E8;
        }
        > div:nth-child(3) {
            background: #595CA1;
        }
    }
</style>