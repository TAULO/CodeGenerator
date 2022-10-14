/**
 * 自拓报表相关API
 */
import { post, get } from '@/request/http'

export default {
    // 获取团队筛选
    getGroupList(params) {
        return post('/rptapi/extension/group/list', params)
    },
    // 情况统计数据
    statisticsTotal(params) {
        return post('/rptapi/extension/statistics/total', params)
    },
    // 情况统计数据
    statisticHomesTotal(params) {
        return post('/rptapi/extension/statistics/base/total', params)
    },
    // 客户趋势统计
    customerTrend(params) {
        return post('/rptapi/extension/customer/trend', params)
    },
    // 团队业绩排行
    achievementGroupSort(params) {
        return post('/rptapi/extension/achievement/group/sort', params)
    },
    // 自渠专员业绩排行
    achievementStaffSort(params) {
        return post('/rptapi/extension/achievement/staff/sort', params)
    },
    // 拓客方式业绩排行
    achievementChannelSort(params) {
        return post('/rptapi/extension/achievement/channel/sort', params)
    },
    //获取报表页面客户穿透列表
    getReportCust(params) {
        return post('/rptapi/extension/statistics/detail', params)
    },
    //获取案场经理数据看板首付访客户列表
    getRankVisitList(params) {
        return post('/rptapi/storage/visitList', params)
    },
    //获取报表页面数据看板认购签约穿透列表
    getReportOrderOrSignList(params) {
        return post('/rptapi/extension/statistics/detail/trade', params)
    },
    //获取报表页面团队穿透列表
    getGroupDetail(params) {
        return post('/rptapi/extension/achievement/group/detail', params)
    },
    //获取报表页面团队认购签约穿透列表
    getGroupOrderOrSignList(params) {
        return post('/rptapi/extension/achievement/group/trade/detail', params)
    },
    //获取报表页面人员穿透列表
    getStaffDetail(params) {
        return post('/rptapi/extension/achievement/staff/detail', params)
    },
    //获取报表页面人员认购签约穿透列表
    getStaffOrderOrSignList(params) {
        return post('/rptapi/extension/achievement/staff/trade/detail', params)
    },
    //获取报表页面拓客方式穿透列表
    getChannelDetail(params) {
        return post('/rptapi/extension/achievement/channel/detail', params)
    },
    //获取报表页面拓客方式认购签约穿透列表
    getChannelOrderOrSignList(params) {
        return post('/rptapi/extension/achievement/channel/trade/detail', params)
    },
}
