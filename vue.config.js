const env = "prod";
const link = {
    dev: "http://192.168.2.199:80",
    prod: "https://www.b156.com.cn/inspector"
}[env];
module.exports = {
    lintOnSave: true,
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require('postcss-pxtorem')({
                        rootValue: 32, // 换算的基数
                        selectorBlackList: ['weui', 'mu', 'wh','uil'], // 忽略转换正则匹配项
                        propList: ['*'],
                    }),
                ]
            }
        }
    },
    publicPath: './',
    devServer: {
        open: true,
        https: false,
        hotOnly: false,
        proxy: {
            '/inspector': {
                target: link,
                ws: false,
                changOrigin: true,
                pathRewrite: {
                    '^/inspector': ''//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
                }
            }
        },
        before: app => {
        }
    },
};