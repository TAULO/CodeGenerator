import Main from '@/components/main'
import Container from '@/views/Container.vue'

import PageList from '@/components/website/pageList.vue'
import Editor from '@/views/extension/information/Detail.vue'

import FriendLinkList from '@/components/website/friend-link/List.vue'
import FriendLinkDetail from '@/components/website/friend-link/Detail.vue'

import IconDetail from '@/views/extension/icon/Detail'
import InformationDetial from '@/views/extension/notice/InformationDetail'
import AgreementDetial from '@/views/extension/agreement/AgreementDetial'

export default [{
        path: '/extension',
        component: Main,
        meta: {
            name: '内容管理中心'
        },
        children: [{
                path: 'home',
                component: Container,
                meta: {
                    name: '首页内容设置'
                },
                children: [{
                        path: 'home',
                        name: 'HomePages',
                        meta: {
                            name: '首页设置',
                            code: 'extension-home-home'
                        },
                        component: Object.assign({}, PageList),
                    },
                    {
                        path: 'material',
                        name: 'MaterialPages',
                        meta: {
                            name: '材料资源',
                            code: 'extension-home-material'
                        },
                        component: Object.assign({}, PageList),
                    },
                    {
                        path: 'design',
                        name: 'DesignPages',
                        meta: {
                            name: '设计师中心',
                            code: 'extension-home-design'
                        },
                        component: Object.assign({}, PageList),
                    },
                    {
                        path: 'dress',
                        name: 'DressPages',
                        meta: {
                            name: '服装企业',
                            code: 'extension-home-dress'
                        },
                        component: Object.assign({}, PageList),
                    },
                    {
                        path: 'tool',
                        name: 'ToolPages',
                        meta: {
                            name: '设计工具',
                            code: 'extension-home-tool'
                        },
                        component: Object.assign({}, PageList),
                    },
                    {
                        path: 'home/edit/:page_id',
                        name: 'EditHomePage',
                        meta: {
                            hidden: true,
                            name: '首页设置',
                            code: 'extension-home-home'
                        },
                        component: () => import('@/views/extension/home/Home')
                    },
                    {
                        path: 'home_v2/edit/:page_id',
                        name: 'EditHomePageV2',
                        meta: {
                            hidden: true,
                            name: '首页设置',
                            code: 'extension-home-home'
                        },
                        component: () => import('@/views/extension/home/Home_v2')
                    },
                    {
                        path: 'dress/edit/:page_id',
                        name: 'EditDressPage',
                        meta: {
                            name: '服装企业',
                            code: 'extension-home-dress',
                        },
                        component: () => import('@/views/extension/home/Dress')
                    },
                    {
                        path: 'design/edit/:page_id',
                        name: 'EditDesignPage',
                        meta: {
                            name: '设计师中心',
                            code: 'extension-home-design'
                        },
                        component: () => import('@/views/extension/home/Design')
                    },
                    {
                        path: 'material/edit/:page_id',
                        name: 'EditMaterialPage',
                        meta: {
                            name: '材料资源',
                            code: 'extension-home-material'
                        },
                        component: () => import('@/views/extension/home/Material')
                    },
                    {
                        path: 'tool/edit/:page_id',
                        name: 'EditToolPage',
                        meta: {
                            name: '设计工具',
                            code: 'extension-home-tool'
                        },
                        component: () => import('@/views/extension/home/Tool')
                    },
                    {
                        path: 'history/home',
                        name: 'HomeHistory',
                        meta: {
                            name: '首页设置',
                            code: 'extension-home-home'
                        },
                        component: () => import('@/components/website/history')
                    },
                ],
            },
            {
                path: 'information',
                component: Container,
                meta: {
                    name: '资料库',
                    code: 'extension-information',
                },
                children: [{
                        path: '',
                        name: 'Information',
                        meta: {
                            code: 'extension-information'
                        },
                        component: () => import('@/views/extension/information/List')
                    },
                    {
                        path: ':platform/edit/:information_id',
                        name: 'InformationEditor',
                        meta: {
                            code: 'extension-information'
                        },
                        component: Object.assign({}, Editor),
                    },
                    {
                        path: ':platform/create',
                        name: 'CreateInformationEditor',
                        meta: {
                            code: 'extension-information'
                        },
                        component: Object.assign({}, Editor),
                    },
                    {
                        path: 'preview/:information_id',
                        name: 'InformationPreview',
                        meta: {},
                        component: () => import('@/views/extension/information/Preview')
                    },
                ],
            },
            {
                path: 'link',
                component: Container,
                meta: {
                    name: '友情链接管理',
                    code: 'extension-link',
                },
                children: [{
                        path: 'home',
                        meta: {
                            name: '首页设置',
                            code: 'extension-link-home',
                        },
                        name: 'HomeFriendLinks',
                        component: Object.assign({}, FriendLinkList),
                    },
                    {
                        path: 'material',
                        meta: {
                            name: '材料资源',
                            code: 'extension-link-material',
                        },
                        name: 'MaterialFriendLinks',
                        component: Object.assign({}, FriendLinkList),
                    },
                    {
                        path: 'design',
                        meta: {
                            name: '设计师中心',
                            code: 'extension-link-design',
                        },
                        name: 'DesignFriendLinks',
                        component: Object.assign({}, FriendLinkList),
                    },
                    {
                        path: 'dress',
                        meta: {
                            name: '服装企业',
                            code: 'extension-link-dress',
                        },
                        name: 'DressFriendLinks',
                        component: Object.assign({}, FriendLinkList),
                    },
                    {
                        path: 'witkey',
                        meta: {
                            name: '威客中心',
                            code: 'extension-link-witkey',
                        },
                        name: 'WitkeyFriendLinks',
                        component: Object.assign({}, FriendLinkList),
                    },
                    {
                        path: 'home/:page_type/create',
                        name: 'CreateFriendLink',
                        meta: {
                            hidden: true,
                            name: '首页设置',
                            code: 'extension-link-home',
                        },
                        component: Object.assign({}, FriendLinkDetail),
                    },
                    {
                        path: 'home/:page_type/edit/:link_id',
                        name: 'EditFriendLink',
                        meta: {
                            hidden: true,
                            name: '首页设置',
                            code: 'extension-link-home',
                        },
                        component: Object.assign({}, FriendLinkDetail),
                    },
                    {
                        path: 'material/:page_type/create',
                        name: 'CreateMaterialFriendLink',
                        meta: {
                            hidden: true,
                            name: '材料资源',
                            code: 'extension-link-material',
                        },
                        component: Object.assign({}, FriendLinkDetail),
                    },
                    {
                        path: 'material/:page_type/edit/:link_id',
                        name: 'EditMaterialFriendLink',
                        meta: {
                            hidden: true,
                            name: '材料资源',
                            code: 'extension-link-material',
                        },
                        component: Object.assign({}, FriendLinkDetail),
                    },
                    {
                        path: 'design/:page_type/create',
                        name: 'CreateDesignFriendLink',
                        meta: {
                            hidden: true,
                            name: '设计师中心',
                            code: 'extension-link-design',
                        },
                        component: Object.assign({}, FriendLinkDetail),
                    },
                    {
                        path: 'design/:page_type/edit/:link_id',
                        name: 'EditDesignFriendLink',
                        meta: {
                            hidden: true,
                            name: '设计师中心',
                            code: 'extension-link-design',
                        },
                        component: Object.assign({}, FriendLinkDetail),
                    },
                    {
                        path: 'dress/:page_type/create',
                        name: 'CreateDressFriendLink',
                        meta: {
                            hidden: true,
                            name: '服装企业',
                            code: 'extension-link-dress',
                        },
                        component: Object.assign({}, FriendLinkDetail),
                    },
                    {
                        path: 'dress/:page_type/edit/:link_id',
                        name: 'EditDressFriendLink',
                        meta: {
                            hidden: true,
                            name: '服装企业',
                            code: 'extension-link-dress',
                        },
                        component: Object.assign({}, FriendLinkDetail),
                    },
                    {
                        path: 'witkey/:page_type/create',
                        name: 'CreateWitkeyFriendLink',
                        meta: {
                            hidden: true,
                            name: '威客中心',
                            code: 'extension-link-witkey',
                        },
                        component: Object.assign({}, FriendLinkDetail),
                    },
                    {
                        path: 'witkey/:page_type/edit/:link_id',
                        name: 'EditWitkeyFriendLink',
                        meta: {
                            hidden: true,
                            name: '威客中心',
                            code: 'extension-link-witkey',
                        },
                        component: Object.assign({}, FriendLinkDetail),
                    },
                ],
            },

            {
                path: 'seo',
                component: Container,
                meta: {
                    name: 'SEO设置',
                    code: 'extension-seo',
                },
                children: [{
                        path: '',
                        name: 'SeoList',
                        meta: {
                            code: 'extension-seo',
                        },
                        component: () => import('@/views/extension/seo/List')
                    },
                    {
                        path: 'edit/:seo_id',
                        name: 'SeoDetail',
                        meta: {
                            action: ['create', 'update'],
                            code: 'extension-seo',
                        },
                        component: () => import('@/views/extension/seo/Detail')
                    },
                ],
            },
            {
                path: 'icon',
                component: Container,
                meta: {
                    name: '认证图标管理'
                },
                children: [{
                        path: '',
                        name: 'IconApproveList',
                        component: () => import('@/views/extension/icon/List')
                    },
                    {
                        path: 'create',
                        name: 'IconApproveCreate',
                        component: Object.assign({}, IconDetail),
                    },
                    {
                        path: 'edit/:icon_id',
                        name: 'IconApproveEditor',
                        component: Object.assign({}, IconDetail),
                    },
                ],
            },

            {
                path: 'faq',
                component: Container,
                meta: {
                    name: 'FAQ设置',
                    code: 'extension-faq',
                },
                children: [{
                        path: '',
                        name: 'FaqList',
                        meta: {
                            code: 'extension-faq',
                        },
                        component: () => import('@/views/extension/faq/List')
                    },
                    {
                        path: 'detail/:faq_id',
                        name: 'FaqDetail',
                        meta: {
                            action: ['view'],
                            code: 'extension-faq',
                        },
                        component: () => import('@/views/extension/faq/Detail')
                    },
                    {
                        path: 'edit/:faq_id',
                        name: 'FaqEdit',
                        meta: {
                            action: ['update'],
                            code: 'extension-faq',
                        },
                        component: () => import('@/views/extension/faq/Detail')
                    },
                    {
                        path: 'create',
                        name: 'FaqCreate',
                        meta: {
                            action: ['create'],
                            code: 'extension-faq',
                        },
                        component: () => import('@/views/extension/faq/Detail')
                    },
                ],
            },

            {
                path: 'notice',
                meta: {
                    name: '公告管理',
                    code: 'extension-notice',
                },
                component: Container,
                children: [{
                        path: '',
                        name: 'OfficicalNoticeList',
                        meta: {
                            code: 'extension-notice',
                        },
                        component: () => import('@/views/extension/notice/InformationList')
                    },
                    {
                        path: 'edit/platform/:information_id',
                        name: 'OfficialNoticeEditor',
                        meta: {
                            code: 'extension-notice',
                        },
                        component: Object.assign({}, InformationDetial)
                    },
                    {
                        path: 'platform/create',
                        name: 'OfficialCreateNoticeEditor',
                        meta: {
                            code: 'extension-notice',
                            action: ['create'],
                        },
                        component: Object.assign({}, InformationDetial)
                    },
                ]
            },
            {
                path: 'agreement',
                component: Container,
                meta: {
                    name: '协议管理',
                    code: 'agreements',
                },
                children: [
                    {
                        path: 'agreements',
                        meta: {
                            name: '协议内容',
                            code: 'agreement-agreements',
                        },
                        name: 'AgreementsList',
                        component: () => import('@/views/extension/agreement/AgreementList'),
                    },
                    {
                        path: 'agreements/create',
                        meta: {
                            code: 'agreement-agreements',
                        },
                        name: 'AgreementsCreate',
                        component: Object.assign({}, AgreementDetial),
                    },
                    {
                        path: 'agreements/version/edit/:agreement_version_id',
                        meta: {
                            code: 'agreement-agreements',
                        },
                        name: 'AgreementsVersionEdit',
                        component: Object.assign({}, AgreementDetial),
                    },
                    {
                        path: 'agreements/version/create/:agreement_id',
                        meta: {
                            code: 'agreement-agreements',
                        },
                        name: 'AgreementsVersionCreate',
                        component: Object.assign({}, AgreementDetial),
                    },
                    {
                        path: 'agreements/view/:agreement_version_id',
                        meta: {
                            code: 'agreement-agreements',
                        },
                        name: 'AgreementsView',
                        component: Object.assign({}, AgreementDetial),
                    },
                    {
                        path: 'agreements/version/:agreement_id',
                        meta: {
                            code: 'agreement-agreements',
                        },
                        name: 'AgreementsVersion',
                        component: () => import('@/views/extension/agreement/AgreementVersion'),
                    },
                    {
                        path: 'agreements/logs/:agreement_version_id',
                        meta: {
                            code: 'agreement-agreements',
                        },
                        name: 'AgreementsLogs',
                        component: () => import('@/views/extension/agreement/AgreementLog'),
                    },
                    {
                        path: 'logs',
                        meta: {
                            code: 'agreement-logs',
                        },
                        name: 'AgreementsUserLogs',
                        component: () => import('@/views/extension/agreement/AgreementUserList'),
                    },
                    {
                        path: 'logs/:user_id',
                        meta: {
                            code: 'agreement-logs',
                        },
                        name: 'AgreementsUserLogsDetail',
                        component: () => import('@/views/extension/agreement/AgreementUserDetail'),
                    },
                ],
            }
        ]
    },

]