<template>
    <div id="record">
        <div class="navigation-head"><img src="../../assets/images/back.png" alt="" class="back"
                                          @click="$router.back(-1)"><span>补货记录详情</span></div>
        <div class="record-main">
            <div class="record-main-item" v-for="(item,index) in goodsList" :key="index">
                <h5>货道编号</h5>
                <div class="goods-info">
                    <img :src="ip+item.img" alt="">
                    <div>
                        <div>商品名称：{{item.name}}</div>
                        <div>补货数量：{{item.foo.add}}</div>
                        <div><span>之前的数量：{{item.foo.after}}</span> <span>&nbsp;&nbsp;现在的数量：{{item.foo.after+item.foo.add}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "record",
        data() {
            return {
                goodsList: '',
                ip: this.fixedIp()
            }
        },
        created() {
            let id = this.$route.query.id;
            this.$axios('get', 'inspector/goodsIn/recordDetail/' + id, {loginCode: localStorage.getItem("loginCode")}, (res) => {
                this.goodsList = res.data;
            });
        }
    }
</script>

<style scoped lang="less">
    #record {
        height: 100%;
    }

    .record-main {
        background: #f3f3f3;
        padding: 20px;
        box-sizing: border-box;
        height: 100%;
        overflow: scroll;
        .record-main-item {
            padding: 10px 20px;
            background: white;
            font-size: 28px;
            box-sizing: border-box;
            border-radius: 20px;
            margin-bottom: 20px;
            h5 {
                border-bottom: 2px solid #f1f1f1;
                line-height: 50px;
            }
            .goods-info {
                display: flex;
                align-items: center;
                img {
                    width: 130px;
                    height: 130px;
                }
                > div {
                    margin-left: 20px;
                }
            }
        }
        .record-main-item:last-child {
            margin-bottom: 0;
        }
    }
</style>