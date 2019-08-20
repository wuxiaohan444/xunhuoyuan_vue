import Vue from 'vue';
import Router from 'vue-router'
import login from '@/pages/login'
import index from '@/pages/index'
import stock from '@/pages/stock'
import device from '@/pages/device'
import personage from '@/pages/personage'
import deviceDetails from '@/pages/device/deviceDetails'
import tradition from '@/pages/device/tradition'
import temperature from '@/pages/device/temperature'
import aisleTest from '@/pages/device/aisleTest'
import ReplenishmentRecord from '@/pages/personage/ReplenishmentRecord'
import record from  '@/pages/personage/record'
import password from '@/pages/personage/password'
import carryOn from  '@/pages/stock/carryOn'
import addOrder from  '@/pages/stock/addOrder'
import oneKaypull from  '@/pages/stock/oneKaypull'


Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: login
        },
        {
            path: '/index',
            name: 'index',
            component: index
        }, {
            path: '/stock',
            name: 'stock',
            component: stock
        }, {
            path: '/device',
            name: 'device',
            component: device,
        }, {
            path:'/temperature',
            name:'temperature',
            component:temperature
        },{
            path: '/personage',
            name: 'personage',
            component: personage
        },{
            path:'/deviceDetails',
            name:'deviceDetails',
            component:deviceDetails
        },{
            path:'/tradition',
            name:'tradition',
            component:tradition
        },{
            path:'/ReplenishmentRecord',
            name:'ReplenishmentRecord',
            component:ReplenishmentRecord
        },{
            path:'/password',
            name:'password',
            component:password
        },{
            path:'/carryOn',
            name:'carryOn',
            component:carryOn
        },{
            path:'/addOrder',
            name:'addOrder',
            component:addOrder
        },{
            path:'/oneKaypull',
            name:'oneKaypull',
            component:oneKaypull
        },{
            path:'/record',
            name:'record',
            component:record
        },{
            path:'/aisleTest',
            name:'aisleTest',
            component:aisleTest
        }
    ]
})