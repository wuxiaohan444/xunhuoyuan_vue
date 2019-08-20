<template>
    <div id="password">
        <div class="navigation-head"><img src="../../assets/images/back.png" alt="" class="back"
                                          @click="$router.back(-1)"><span>个人中心</span></div>
        <div class="headImg">
            <img :src="headImg">
        </div>

        <div class="main">
            <div class="realName">
                <span>真实姓名：</span> <input type="text" v-model="realName" placeholder=""/>
            </div>
            <div class="name">
                <span>登录姓名：</span> <input type="text" v-model="name" placeholder="">
            </div>
            <div class="password">
                <span>登录密码：</span>
                <input type="password" v-model="password" placeholder="请输入新密码"/></div>
            <div class="sex">
                <span>性 别 ：</span>
                <select name="" id="" v-model="sex">
                    <option value=""></option>
                    <option value="1">男</option>
                    <option value="2">女</option>
                </select>
            </div>
            <div class="phone">
                <span>手机号：</span>
                <input type="text" v-model="phone" placeholder="请输入新密码"/>
            </div>
        </div>

        <div @click="affirm" class="affirm">确认修改</div>
    </div>
</template>

<script>
    export default {
        name: "password",
        data() {
            return {
                headImg: '',
                realName: '',
                name: '',
                password: '',
                phone: '',
                headImg2: '',
                sex: ''
            }
        },
        created() {
            this.getInfo()
        },
        methods: {
            getInfo() {
                this.$axios('get', '/inspector/inspector/selectById', {loginCode: localStorage.getItem('loginCode')}, (res) => {
                    let userInfo = res.data;
                    this.headImg = userInfo.headImg ? this.fixedIp() + userInfo.headImg : require("../../assets/images/my1.png");
                    this.headImg2 = userInfo.headImg;
                    this.realName = userInfo.realName;
                    this.name = userInfo.loginName;
                    this.password = userInfo.password;
                    this.phone = userInfo.phone;
                    this.sex = userInfo.sex
                });
            },
            affirm() {
                let data = {
                    loginCode: localStorage.getItem('loginCode'),
                    realName: this.realName,
                    loginName: this.name,
                    password: this.password,
                    phone: this.phone,
                    headImg: this.headImg2,
                    sex: this.sex
                };
                this.$axios('post', '/inspector/inspector/updateData', data, (res) => {
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
    .headImg {
        background: #2aadff;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        margin: 30px auto;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }

    .main {
        padding: 20px;
        > div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 88px;
            span {
                width: 30%;
            }
            input, select {
                border-bottom: 1px solid #cccccc;
                width: 70%;
                padding-left: 20px;
                height: 50px;
            }
            .name {
                margin-top: 20px;
                margin-bottom: 20px;
            }
            .sex, .phone {
                margin-top: 20px;
            }
        }

    }

    .btnBindP {

        button {
            width: 60%;
            font-size: 28px;
        }
        .text {
            font-size: 24px;
            color: red;
            text-align: center;
            line-height: 40px;
        }
    }

    .affirm {
        font-size: 30px;
        height: 80px;
        background: #595CA1;
        color: white;
        position: fixed;
        bottom: 0;
        width: 100%;
        text-align: center;
        line-height: 80px;
    }
</style>