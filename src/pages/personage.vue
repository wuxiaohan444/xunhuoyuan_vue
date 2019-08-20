<template>
    <div id="personage">
        <div class="navigation-head"><span class="single">个人中心</span></div>
        <div class="getInfoMessage">
            <div class="content_box">
                <div class="InfoImg">
                    <img :src="userInfo.headImg">
                </div>
                <div class="InfoPhone">
                    <div class="InfoUser">{{userInfo.loginName}}</div>
                </div>
            </div>
        </div>
        <div class="list_main">
            <!--我的补货单-->
            <router-link class="revamp" to="/ReplenishmentRecord">
                <img src="../assets/images/recond.png">
                <div>补货记录</div>
                <img src='../assets/images/right.png' class='revampRightImg'>
            </router-link>

            <!-- 修改密码  -->
            <router-link class="revamp" to="/password">
                <img src="../assets/images/5.png">
                <div>修改个人信息</div>
                <img src='../assets/images/right.png' class='revampRightImg'>
            </router-link>

            <div class="revamp" @click="logOut">
                <img src="../assets/images/quit.png">
                <div>退出登录</div>
                <img src='../assets/images/right.png' class='revampRightImg'>
            </div>
        </div>

        <navigationBar></navigationBar>
    </div>
</template>

<script>
    import navigationBar from "@/components/navigationBar"

    export default {
        name: "personage",
        components: {
            navigationBar
        },
        data() {
            return {
                userInfo: '',
            }
        },
        created() {
            this.getInfo();
        },
        methods: {
            getInfo() {
                this.$axios('get', '/inspector/inspector/selectById', {loginCode: localStorage.getItem('loginCode')}, (res) => {
                    this.userInfo = res.data;
                    this.userInfo.headImg = this.userInfo.headImg ? this.fixedIp() + this.userInfo.headImg : require("../assets/images/my1.png")
                });

            },
            logOut() {
                localStorage.removeItem("loginCode");
                this.$router.push({
                    path: '/'
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #personage {
        min-height: 100%;
    }

    .getInfoMessage {
        width: 100%;
        display: flex;
        align-items: center;
        height: 266px;
        background: url("../assets/images/juxing.png");
        background-size: 100% 100%;
        padding: 50px;
        box-sizing: border-box;
        margin-bottom: 100px;
        position: relative;
        .content_box {
            position: absolute;
            left: 50%;
            bottom: -20px;
            transform: translateX(-50%);
            text-align: center;
            .InfoImg {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                margin: 0 auto;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }
            .InfoUser {
                font-size: 36px;
                color: #333;
                text-align: center;
            }
        }
    }

    .list_main {
        padding: 0 30px;
        .revamp {
            width: 100%;
            display: flex;
            height: 80px;
            line-height: 80px;
            align-items: center;
            background: white;
            font-size: 30px;
            border-bottom: 1px solid rgba(213, 213, 213, 1);
            img {
                width: 40px;
                height: 40px;
                margin-right: 20px;
            }
        }

        .revampRightImg {
            position: absolute;
            right: 0;
            width: 40px;
            height: 40px;
        }
    }


</style>