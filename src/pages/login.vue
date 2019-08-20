<template>
    <div id="login">
        <div class="navigation-head"><span class="single">登录</span></div>
        <div class="container">
            <div class="head">
                巡货员平台
            </div>
            <div class="itemView">
                <input type="text" v-model="userName" name="userName" placeholder="请输入用户名">
            </div>
            <div class="itemView">
                <input type="password" v-model="password" name="password" placeholder="请输入密码">
            </div>
            <div class="viewLogin" @click="login">登录</div>
        </div>
    </div>
</template>

<script>
    import loading from '../components/loading'
    import md5 from 'js-md5'

    export default {
        name: "login",
        data() {
            return {
                userName: '',
                password: '',
            }
        },
        components: {loading},
        created() {

        },
        methods: {
            login() {
                this.$axios("post", "/inspector/index/login", {
                    loginName: this.userName,
                    password: md5(md5(this.password) + md5(this.userName))
                }, (res) => {
                    localStorage.setItem('loginCode', res.data);
                    this.$router.push({
                        path: '/index'
                    });
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #login {
        background: white;
        min-height: 100%;
    }

    .container {
        padding-top: 150px;
        .head {
            margin: 0 auto;
            font-size: 40px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 50px;
        }
        .itemView {
            width: 60%;
            height: 100px;
            margin: 0 auto;
            font-size: 32px;
            input {
                width: 100%;
                height: 60px;
                border-bottom: 1px solid #ccc;
                padding-left: 10px;
            }
        }
        .viewLogin {
            margin: 30px auto;
            width: 300px;
            height: 66px;
            border-radius: 15px;
            color: white;
            background: #595CA1;
            text-align: center;
            line-height: 66px;
            font-size: 32px;
        }
        .code {
            height: 100px;
            margin: 0 auto;
            width: 60%;
            display: flex;
            justify-content: space-between;
            input {
                font-size: 32px;
                height: 70px;
                border-bottom: 1px solid #ccc;
                padding-left: 10px;
                width: 191px;
            }
            .code-box {

            }
        }
    }

</style>