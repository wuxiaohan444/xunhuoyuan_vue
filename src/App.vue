<template>
    <div id="app">
        <tips></tips>
        <loading></loading>
        <router-view></router-view>
    </div>
</template>

<script>
    import tips from './components/tips'
    import loading from './components/loading'
    export default {
        name: 'app',
        components:{tips,loading}
    }
</script>

<style lang="less">
    * {
        padding: 0;
        margin: 0;
    }

    a {
        text-decoration: none;
        color: #333333;
    }

    body, html, #app {
        color: #333333;
        height: 100%;
    }

    #app {
        padding-top: 100px;
        box-sizing: border-box;
    }

    h1, h2, h3, h4, h5 {
        font-weight: 500;
    }

    input,select {
        outline: none;
        border: none;
    }

    li {
        list-style: none;
    }

    /*头部*/
    .navigation-head {
        height: 100px;
        width: 100%;
        background: #595CA1;
        color: white;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        padding-left: 10px;
        position: fixed;
        top: 0;
        z-index: 99;
        .single {
            padding-left: 20px;
        }
        .back {
            width: 50px;
        }
    }
</style>
