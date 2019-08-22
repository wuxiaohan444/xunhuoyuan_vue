<template>
    <div id="index">
        <div class="navigation-head"><span class="single">首页</span></div>
        <div class=""></div>
        <div class='mainMsg'>
            <div class='mainMsgDetails'>
                <div class='detailImg'>
                    <img src='../assets/images/1.png'>
                </div>
                <div class='detailMsg'>
                    <div>机器故障</div>
                    <div>{{deviceInfo.bad}}</div>
                </div>
            </div>
            <div class='mainMsgDetails'>
                <div class='detailImg'>
                    <img src='../assets/images/offline.png'>
                </div>
                <div class='detailMsg'>
                    <div>离线设备</div>
                    <div>{{deviceInfo.offline}}</div>
                </div>
            </div>
            <div class='mainMsgDetails'>
                <div class='detailImg'>
                    <img src='../assets/images/all.png'>
                </div>
                <div class='detailMsg'>
                    <div>所有设备</div>
                    <div>{{deviceInfo.all}}</div>
                </div>
            </div>
            <div class='mainMsgDetails'>
                <div class='detailImg'>
                    <img src='../assets/images/4.png'>
                </div>
                <div class='detailMsg'>
                    <div>建议补货</div>
                    <div>{{deviceInfo.needAdd}}</div>
                </div>
            </div>
        </div>
        <navigationBar></navigationBar>
    </div>
</template>

<script>
    import navigationBar from "@/components/navigationBar"

    export default {
        name: "index",
        data() {
            return {
                deviceInfo: '',
                record: '',
                page: 1
            }
        },
        components: {
            navigationBar
        },
        created() {
            this.getInfo();
        },
        methods: {
            getInfo() {
                this.$axios('get', '/inspector/device/deviceCount', {loginCode: localStorage.getItem("loginCode")}, (res) => {
                    this.deviceInfo = res.data;
                });
            }
        }

    }
</script>

<style scoped lang="less">
    #index {
        background: #efefef;
        min-height: 100%;
    }

    .mainMsg {
        padding: 30px 60px;
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
        background: white;
        .mainMsgDetails {
            display: flex;
            width: 50%;
            padding: 20px;
            box-sizing: border-box;
            .detailImg {
                width: 80px;
                height: 80px;
                margin-right: 30px;
                margin-bottom: 30px;
                img {
                    width: 100%;
                    height: 100%;
                    margin-top: 10px;
                }
            }
            .detailMsg div:nth-of-type(1) {
                color: #98979c;
                font-size: 30px
            }
            .detailMsg div:nth-of-type(2) {
                font-size: 30px
            }
        }
        .mainMsgDetails:nth-child(2n) {
            margin-bottom: 0;
        }
    }
</style>