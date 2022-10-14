export default {
  path: '/admin/operation',
  redirect: '/admin/operation/vipScoreManage',
  meta: {
    nav: '运营管理',
    icon: 'icon-yunyingtuiguang',
    auth: true,
    authCode: 501040
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // -------------- 积分管理
    {
      path: '/admin/operation/vipScoreManage',
      redirect: '/admin/operation/vipScoreManage/vipScoreSeting',
      meta: {
        nav: '积分管理',
        icon: 'icon-jifen',
        auth: true,
        authCode: 501043,
        visible: true
      },
      component: r => require(['@/views/admin/vipScore/IndexLayout'], r),
      children: [

        // -------------- 购买商品
        {
          path: '/admin/operation/vipScoreManage/vipScoreSeting',
          meta: {
            title: '',
            icon: '',
            auth: true,
            authCode: 501043,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '积分设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vipScore/Index'], r)
        },

        // -------------- 销售商品
        {
          path: '/admin/operation/vipScoreSeting/sale',
          meta: {
            title: '',
            icon: '',
            auth: true,
            authCode: 501043,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '积分设置', path: '/admin/operation/vipScoreManage/vipScoreSeting' },
              { title: '销售商品', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vipScore/Index'], r)
        },

        // -------------- 积分记录
        {
          path: '/admin/operation/vipScoreManage/vipScoreRecord',
          meta: {
            title: '',
            icon: '',
            auth: true,
            authCode: 501043,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '积分设置', path: '/admin/operation/vipScoreManage/vipScoreSeting' },
              { title: '积分记录', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vipScore/Record'], r)
        }
      ]
    },

    // -------------- 广告管理
    {
      path: '/admin/operation/adverti',
      redirect: '/admin/operation/adverti/mobile',
      meta: {
        nav: '广告管理',
        icon: 'icon-guanggao',
        auth: true,
        authCode: 501044
      },
      component: r => require(['@/views/admin/adverti/ManageLayout'], r),
      children: [
        {
          path: '/admin/operation/adverti/mobile',
          meta: {
            title: '',
            auth: true,
            authCode: 501044,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '广告设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/adverti/ManageList'], r)
        },

        {
          path: '/admin/operation/adverti/pc',
          meta: {
            title: '',
            auth: true,
            authCode: 501044,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '广告设置', path: '/admin/operation/adverti' },
              { title: 'PC端', path: '' }
            ]
          },
          component: r => require(['@/views/admin/adverti/ManageList'], r)
        },

        {
          path: '/admin/operation/adverti/edit',
          meta: {
            title: '广告位管理',
            auth: true,
            authCode: 501044,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '广告设置', path: '/admin/operation/adverti' },
              { title: '编辑', path: '' }
            ]
          },
          component: r => require(['@/views/admin/adverti/ManagePublic'], r)
        }
      ]
    },

    // -------------- 套餐管理
    {
      path: '/admin/operation/setmealManage',
      redirect: '/admin/operation/setmealManage/list',
      meta: {
        nav: '套餐管理',
        icon: 'icon-taocan',
        auth: true,
        authCode: 501045
      },
      component: r => require(['@/views/admin/setmeal/ManageLayout'], r),
      children: [
        {
          path: '/admin/operation/setmealManage/list',
          meta: {
            title: '',
            auth: true,
            authCode: 501045,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '套餐管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/setmeal/ManageList'], r)
        },

        {
          path: '/admin/operation/setmealManage/add',
          meta: {
            title: '',
            thirdMenu: false,
            auth: true,
            authCode: 501045,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '套餐管理', path: '/admin/operation/setmealManage' },
              { title: '新增套餐', path: '' }
            ]
          },
          component: r => require(['@/views/admin/setmeal/ManagePublic'], r)
        },

        {
          path: '/admin/operation/setmealManage/edit',
          meta: {
            title: '',
            thirdMenu: false,
            auth: true,
            authCode: 501045,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '套餐管理', path: '/admin/operation/setmealManage' },
              { title: '编辑套餐', path: '' }
            ]
          },
          component: r => require(['@/views/admin/setmeal/ManagePublic'], r)
        },

        {
          path: '/admin/operation/setmealManage/rule',
          meta: {
            title: '套餐规则设置',
            auth: true,
            authCode: 501045,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '套餐管理', path: '/admin/operation/setmealManage' },
              { title: '套餐规则设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/setmeal/RuleSet'], r)
        }
      ]
    },

    // 社群运营
    {
      path: '/admin/operation/community',
      redirect: '/admin/operation/community/index',
      meta: {
        nav: '社群运营',
        icon: 'icon-qunzuduoren',
        auth: true,
        authCode: 501042,
        visible: false
      },
      component: r => require(['@/views/admin/operation/community/Layout'], r),
      children: [
        {
          path: '/admin/operation/community/index',
          meta: {
            nav: '票务管理',
            auth: true,
            authCode: 501042,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '社群运营', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/community/Index'], r)
        },

        // 详情
        {
          path: '/admin/operation/community/details',
          meta: {
            nav: '详情',
            icon: '',
            auth: true,
            authCode: 501042,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '社群运营', path: '/admin/operation/community/index' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/PublicDetails'], r)
        }
      ]
    },

    // 拼团
    {
      path: '/admin/operation/extension/assemble',
      redirect: '/admin/operation/extension/assemble/index',
      meta: {
        nav: '拼团',
        icon: 'icon-qunzuduoren',
        auth: true,
        authCode: 501042,
        visible: false
      },
      component: r => require(['@/views/admin/operation/extension/Layout'], r),
      children: [
        {
          path: '/admin/operation/extension/assemble/index',
          meta: {
            nav: '票务管理',
            auth: true,
            authCode: 501042,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '拼团', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/assemble/Index'], r)
        },

         // 新增
        {
          path: '/admin/operation/extension/assemble/add',
          meta: {
            nav: '详情',
            icon: '',
            auth: true,
            authCode: 501042,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '拼团', path: '/admin/operation/extension/assemble/index' },
              { title: '新增', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/assemble/PublicAssemble'], r)
        },

         // 编辑
        {
          path: '/admin/operation/extension/assemble/edit',
          meta: {
            nav: '详情',
            icon: '',
            auth: true,
            authCode: 501042,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '拼团', path: '/admin/operation/extension/assemble/index' },
              { title: '编辑', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/assemble/PublicAssemble'], r)
        },

        // 设置
        {
          path: '/admin/operation/extension/assemble/setting',
          meta: {
            title: '设置',
            auth: true,
            authCode: 501042,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '推广拉新', path: '/admin/operation/extension' },
              { title: '拼团', path: '/admin/operation/extension/community' },
              { title: '设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/community/GoodsSetting'], r)
        },

        // 详情
        {
          path: '/admin/operation/extension/assemble/details',
          meta: {
            nav: '详情',
            icon: '',
            auth: true,
            authCode: 501042,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '拼团', path: '/admin/operation/extension/assemble/index' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/PublicDetails'], r)
        }
      ]
    },

    // 超级拼团
    {
      path: '/admin/operation/extension/supper/assemble',
      redirect: '/admin/operation/extension/assemble/index',
      meta: {
        nav: '超级拼团',
        icon: 'icon-qunzuduoren',
        auth: true,
        authCode: 501042,
        visible: false
      },
      component: r => require(['@/views/admin/operation/supper-assemble/Layout'], r),
      children: [

        // 配置商品
        {
          path: '/admin/operation/extension/supper/assemble/configure',
          meta: {
            nav: '超级拼团',
            auth: true,
            // refresh: false,
            authCode: 501042,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '超级拼团', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/supper-assemble/ActivitiesPublic'], r)
        },

        // 配置商品-设置
        {
          path: '/admin/operation/extension/supper/assemble/setting',
          meta: {
            title: '设置',
            auth: true,
            authCode: 501042,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '推广拉新', path: '/admin/operation/extension' },
              { title: '超级拼团', path: '/admin/operation/extension/supper/assemble/configure' },
              { title: '设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/supper-assemble/SuperGroupSetting'], r)
        },

        // 配置商品-详情
        {
          path: '/admin/operation/extension/supper/assemble/details',
          meta: {
            nav: '详情',
            icon: '',
            auth: true,
            authCode: 501042,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '超级拼团', path: '/admin/operation/extension/supper/assemble/configure' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/PublicDetails'], r)
        },

         // 拼团统计
        {
          path: '/admin/operation/extension/supper/assemble/statistics',
          meta: {
            nav: '拼团统计',
            icon: '',
            auth: true,
            authCode: 501042,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '超级拼团', path: '/admin/operation/extension/supper/assemble/configure' },
              { title: '拼团统计', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/supper-assemble/Statistics'], r)
        },

         // 拼团统计-详情
        {
          path: '/admin/operation/extension/supper/assemble/statistics-details',
          meta: {
            nav: '拼团统计',
            icon: '',
            auth: true,
            authCode: 501042,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '超级拼团', path: '/admin/operation/extension/supper/assemble/configure' },
              { title: '拼团统计', path: '/admin/operation/extension/supper/assemble/statistics' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/supper-assemble/StatisticsDetails'], r)
        }
      ]
    },

    // 升级套餐区
    {
      path: '/admin/operation/extension/upgrade',
      redirect: '/admin/operation/extension/upgrade/index',
      meta: {
        nav: '升级套餐区',
        icon: 'icon-qunzuduoren',
        auth: true,
        authCode: 501042,
        visible: false
      },
      component: r => require(['@/views/admin/operation/upgrade/layout'], r),
      children: [

        // 配置商品
        {
          path: '/admin/operation/extension/upgrade/index',
          meta: {
            nav: '升级套餐区',
            auth: true,
            // refresh: false,
            authCode: 501042,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '升级套餐区', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/upgrade/index'], r)
        },

        // 配置商品-设置
        {
          path: '/admin/operation/extension/upgrade/setting',
          meta: {
            title: '设置',
            auth: true,
            authCode: 501042,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '推广拉新', path: '/admin/operation/extension' },
              { title: '升级套餐区', path: '/admin/operation/extension/upgrade/index' },
              { title: '设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/upgrade/setting'], r)
        },
        // 分佣设置
        {
          path: '/admin/operation/extension/upgrade/commission',
          meta: {
            title: '分佣设置',
            auth: true,
            authCode: 501042,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '推广拉新', path: '/admin/operation/extension' },
              { title: '升级套餐区', path: '/admin/operation/extension/upgrade/index' },
              { title: '分佣设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/upgrade/commission'], r)
        },

        // 配置商品-详情
        {
          path: '/admin/operation/extension/upgrade/details',
          meta: {
            nav: '详情',
            icon: '',
            auth: true,
            authCode: 501042,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '升级套餐区', path: '/admin/operation/extension/upgrade/index' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/PublicDetails'], r)
        },

        // 拼团统计
        {
          path: '/admin/operation/extension/upgrade/statistics',
          meta: {
            nav: '拼团统计',
            icon: '',
            auth: true,
            authCode: 501042,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '超级拼团', path: '/admin/operation/extension/upgrade/index' },
              { title: '拼团统计', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/upgrade/Statistics'], r)
        },

        // 拼团统计-详情
        {
          path: '/admin/operation/extension/upgrade/e/statistics-details',
          meta: {
            nav: '拼团统计',
            icon: '',
            auth: true,
            authCode: 501042,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '超级拼团', path: '/admin/operation/extension/upgrade/index' },
              { title: '拼团统计', path: '/admin/operation/extension/upgrade/statistics' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/upgrade/StatisticsDetails'], r)
        }
      ]
    },
    // // --------------服务管理
    // {
    //   path: '/admin/operation/service',
    //   redirect: '/admin/operation/service/index',
    //   meta: {
    //     nav: '服务管理',
    //     icon: 'icon-zixunguanlizixunfuwuguanli',
    //     auth: true,
    //     authCode: 501031
    //   },
    //   component: r => require(['@/views/admin/operation/service/Layout'], r),
    //   children: [
    //     {
    //       path: '/admin/operation/service/index',
    //       meta: {
    //         nav: '服务管理',
    //         icon: '',
    //         auth: true,
    //         authCode: 501031
    //       },
    //       component: r => require(['@/views/admin/operation/service/Index'], r)
    //     }
    //   ]
    // },

    // // --------------分享设置
    // {
    //   path: '/admin/operation/share',
    //   meta: {
    //     nav: '分享设置',
    //     icon: 'icon-fenxiang',
    //     auth: true,
    //     authCode: 501031
    //   },
    //   component: r => require(['@/views/admin/operation/share/Seting'], r)
    // },

     // 推广拉新
    {
      path: '/admin/operation/extension',
      redirect: '/admin/operation/extension/list',
      meta: {
        nav: '推广拉新',
        icon: 'icon-qunzuduoren',
        auth: true,
        authCode: 501042
      },
      component: r => require(['@/views/admin/operation/extension/Layout'], r),
      children: [
        {
          path: '/admin/operation/extension/list',
          meta: {
            title: '推广拉新',
            auth: true,
            authCode: 501042,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '推广拉新', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/extension/List'], r)
        },

        {
          path: '/admin/operation/extension/community',
          meta: {
            title: '社群运营',
            auth: true,
            authCode: 501042,
            refresh: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '推广拉新', path: '/admin/operation/extension' },
              { title: '社群运营', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/community/Index'], r)
        },

        {
          path: '/admin/operation/extension/community/setting',
          meta: {
            title: '设置',
            auth: true,
            authCode: 501042,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '推广拉新', path: '/admin/operation/extension' },
              { title: '社群运营', path: '/admin/operation/extension/community' },
              { title: '设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/community/GoodsSetting'], r)
        },

        // 详情
        {
          path: '/admin/operation/extension/community/details',
          meta: {
            title: '详情',
            icon: '',
            auth: true,
            authCode: 501042,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '推广拉新', path: '/admin/operation/extension' },
              { title: '社群运营', path: '/admin/operation/extension/community' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/PublicDetails'], r)
        }
      ]
    },

    // 促销转化
    {
      path: '/admin/operation/conversion',
      redirect: '/admin/operation/conversion/list',
      meta: {
        nav: '促销转化',
        icon: 'icon-taocan',
        auth: true,
        authCode: 501046
      },
      component: r => require(['@/views/admin/operation/conversion/ManageLayout'], r),
      children: [
        {
          path: '/admin/operation/conversion/list',
          meta: {
            title: '促销转化',
            auth: true,
            authCode: 501046,
            breadcrumb: [
              {title: '首页', path: '/admin/console'},
              {title: '运营管理', path: '/admin/operation'},
              {title: '促销转化', path: ''}
            ]
          },
          component: r => require(['@/views/admin/operation/conversion/List'], r)
        }
      ]
    },

    // -------------- 促销转化-大转盘
    {
      path: '/admin/operation/conversion/turntable',
      redirect: '/admin/operation/conversion/turntable/list',
      meta: {
        nav: '大转盘',
        icon: '',
        auth: true,
        authCode: 501046,
        visible: false
      },
      component: r => require(['@/views/admin/operation/turntable/TurntableLayout'], r),
      children: [
        {
          path: '/admin/operation/conversion/turntable/list',
          meta: {
            title: '大转盘',
            auth: true,
            authCode: 501046,
            breadcrumb: [
              {title: '首页', path: '/admin/console'},
              {title: '运营管理', path: '/admin/operation'},
              {title: '促销转化', path: '/admin/operation/conversion'},
              {title: '大转盘', path: ''}
            ]
          },
          component: r => require(['@/views/admin/operation/turntable/Turntable'], r)
        },
        {
          path: '/admin/operation/conversion/turntable/add',
          meta: {
            title: '添加活动',
            auth: true,
            authCode: 501046,
            breadcrumb: [
              {title: '首页', path: '/admin/console'},
              {title: '运营管理', path: '/admin/operation'},
              {title: '促销转化', path: '/admin/operation/conversion'},
              {title: '大转盘', path: '/admin/operation/conversion/turntable'},
              {title: '新增活动', path: ''}
            ]
          },
          component: r => require(['@/views/admin/operation/turntable/TurntablePublic'], r)
        },
        {
          path: '/admin/operation/conversion/turntable/edit',
          meta: {
            title: '编辑活动',
            auth: true,
            authCode: 501046,
            breadcrumb: [
              {title: '首页', path: '/admin/console'},
              {title: '运营管理', path: '/admin/operation'},
              {title: '促销转化', path: '/admin/operation/conversion'},
              {title: '大转盘', path: '/admin/operation/conversion/turntable'},
              {title: '编辑活动', path: ''}
            ]
          },
          component: r => require(['@/views/admin/operation/turntable/TurntablePublic'], r)
        },
        {
          path: '/admin/operation/conversion/turntable/detail',
          meta: {
            title: '编辑活动',
            auth: true,
            authCode: 501046,
            breadcrumb: [
              {title: '首页', path: '/admin/console'},
              {title: '运营管理', path: '/admin/operation'},
              {title: '大转盘', path: '/admin/operation/conversion/turntable'},
              {title: '查看活动', path: ''}
            ]
          },
          component: r => require(['@/views/admin/operation/turntable/TurntableDetail'], r)
        },

        // 中奖记录
        {
          path: '/admin/operation/conversion/turntable/prize',
          meta: {
            title: '中奖记录',
            auth: true,
            authCode: 501046,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '促销转化', path: '/admin/operation/conversion' },
              { title: '大转盘', path: '/admin/operation/conversion/turntable' },
              { title: '中奖记录', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/turntable/Prize'], r)
        },

         // 票务管理
        {
          path: '/admin/operation/conversion/ticket',
          redirect: '/admin/operation/conversion/ticket/list',
          meta: {
            nav: '票务管理',
            icon: 'icon-menpiao',
            auth: true,
            authCode: 501046,
            visible: false
          },
          component: r => require(['@/views/admin/operation/ticket/Layout'], r),
          children: [
            {
              path: '/admin/operation/conversion/ticket/list',
              meta: {
                title: '票务管理',
                auth: true,
                authCode: 501046,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '运营管理', path: '/admin/operation' },
                  { title: '促销转化', path: '/admin/operation/conversion' },
                  { title: '票务管理', path: '' }
                ]
              },
              component: r => require(['@/views/admin/operation/ticket/List'], r)
            },

            {
              path: '/admin/operation/conversion/ticket/add',
              meta: {
                title: '添加会务票',
                authCode: 501046,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '运营管理', path: '/admin/operation' },
                  { title: '票务管理', path: '/admin/operation/ticket' },
                  { title: '促销转化', path: '/admin/operation/conversion' },
                  { title: '添加会务票', path: '' }
                ]
              },
              component: r => require(['@/views/admin/operation/ticket/Public'], r)
            },

            {
              path: '/admin/operation/conversion/ticket/edit',
              meta: {
                title: '编辑会务票',
                auth: true,
                authCode: 501046,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '运营管理', path: '/admin/operation' },
                  { title: '促销转化', path: '/admin/operation/conversion' },
                  { title: '票务管理', path: '/admin/operation/ticket' },
                  { title: '编辑会务票', path: '' }
                ]
              },
              component: r => require(['@/views/admin/operation/ticket/Public'], r)
            },

            {
              path: '/admin/operation/conversion/ticket/order',
              meta: {
                nav: '订单',
                icon: '',
                auth: true,
                authCode: 501046,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '运营管理', path: '/admin/operation' },
                  { title: '促销转化', path: '/admin/operation/conversion' },
                  { title: '票务管理', path: '/admin/operation/ticket' },
                  { title: '订单', path: '' }
                ]
              },
              component: r => require(['@/views/admin/operation/ticket/Order'], r)
            },

            {
              path: '/admin/operation/conversion/ticket/order/details',
              meta: {
                nav: '详情',
                icon: '',
                auth: true,
                authCode: 501046,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '运营管理', path: '/admin/operation' },
                  { title: '促销转化', path: '/admin/operation/conversion' },
                  { title: '票务管理', path: '/admin/operation/ticket' },
                  { title: '订单', path: '/admin/operation/ticket/order' },
                  { title: '详情', path: '' }
                ]
              },
              component: r => require(['@/views/admin/operation/ticket/Details'], r)
            }
          ]
        }
      ]
    },

    // -------------- 促销转化 - 限时特卖
    {
      path: '/admin/operation/conversion/flash',
      redirect: '/admin/operation/conversion/flash/index',
      meta: {
        nav: '限时特卖',
        icon: '',
        auth: true,
        authCode: 501046,
        visible: false
      },
      component: r => require(['@/views/admin/operation/flash/Layout'], r),
      children: [
        {
          path: '/admin/operation/conversion/flash/index',
          meta: {
            title: '限时特卖',
            auth: true,
            authCode: 501046,
            breadcrumb: [
              {title: '首页', path: '/admin/console'},
              {title: '运营管理', path: '/admin/operation'},
              {title: '促销转化', path: '/admin/operation/conversion'},
              {title: '限时特卖', path: ''}
            ]
          },
          component: r => require(['@/views/admin/operation/flash/Index'], r)
        },

        // 未开始
        {
          path: '/admin/operation/conversion/flash/not',
          meta: {
            title: '限时特卖',
            auth: true,
            authCode: 501046,
            breadcrumb: [
              {title: '首页', path: '/admin/console'},
              {title: '运营管理', path: '/admin/operation'},
              {title: '促销转化', path: '/admin/operation/conversion'},
              {title: '限时特卖', path: '/admin/operation/conversion/flash/index'},
              {title: '未开始', path: ''}
            ]
          },
          component: r => require(['@/views/admin/operation/flash/Index'], r)
        },

        // 进行中
        {
          path: '/admin/operation/conversion/flash/way',
          meta: {
            title: '限时特卖',
            auth: true,
            authCode: 501046,
            breadcrumb: [
              {title: '首页', path: '/admin/console'},
              {title: '运营管理', path: '/admin/operation'},
              {title: '促销转化', path: '/admin/operation/conversion'},
              {title: '限时特卖', path: '/admin/operation/conversion/flash/index'},
              {title: '进行中', path: ''}
            ]
          },
          component: r => require(['@/views/admin/operation/flash/Index'], r)
        },

        // 已结束
        {
          path: '/admin/operation/conversion/flash/end',
          meta: {
            title: '限时特卖',
            auth: true,
            authCode: 501046,
            breadcrumb: [
              {title: '首页', path: '/admin/console'},
              {title: '运营管理', path: '/admin/operation'},
              {title: '促销转化', path: '/admin/operation/conversion'},
              {title: '限时特卖', path: '/admin/operation/conversion/flash/index'},
              {title: '已结束', path: ''}
            ]
          },
          component: r => require(['@/views/admin/operation/flash/Index'], r)
        },

        // 添加活动
        {
          path: '/admin/operation/conversion/flash/add',
          meta: {
            title: '添加活动',
            auth: true,
            authCode: 501046,
            thirdMenu: false,
            breadcrumb: [
              {title: '首页', path: '/admin/console'},
              {title: '运营管理', path: '/admin/operation'},
              {title: '促销转化', path: '/admin/operation/conversion'},
              {title: '限时特卖', path: '/admin/operation/conversion/flash/index'},
              {title: '新增限时特卖', path: ''}
            ]
          },
          component: r => require(['@/views/admin/operation/assemble/PublicAssemble'], r)
        },

        // 编辑活动
        {
          path: '/admin/operation/conversion/flash/edit',
          meta: {
            title: '编辑活动',
            auth: true,
            authCode: 501046,
            thirdMenu: false,
            breadcrumb: [
              {title: '首页', path: '/admin/console'},
              {title: '运营管理', path: '/admin/operation'},
              {title: '促销转化', path: '/admin/operation/conversion'},
              {title: '限时特卖', path: '/admin/operation/conversion/flash/index'},
              {title: '编辑限时特卖', path: ''}
            ]
          },
          component: r => require(['@/views/admin/operation/assemble/PublicAssemble'], r)
        },

        // 详情
        {
          path: '/admin/operation/conversion/flash/detail',
          meta: {
            title: '编辑活动',
            auth: true,
            authCode: 501046,
            breadcrumb: [
              {title: '首页', path: '/admin/console'},
              {title: '运营管理', path: '/admin/operation'},
              {title: '限时特卖', path: '/admin/operation/conversion/flash/index'},
              {title: '查看活动', path: ''}
            ]
          },
          component: r => require(['@/views/admin/operation/assemble/PublicAssemble'], r)
        }
      ]
    },

    // -------------- 促销转化 - 优惠券
    {
      path: '/admin/operation/conversion/coupon',
      redirect: '/admin/operation/conversion/coupon/all',
      meta: {
        nav: '优惠券',
        icon: '',
        auth: true,
        authCode: 501046,
        visible: false
      },
      component: r => require(['@/views/admin/operation/coupon/Layout'], r),
      children: [
        {
          path: '/admin/operation/conversion/coupon/all',
          meta: {
            title: '优惠券',
            auth: true,
            authCode: 501046,
            breadcrumb: [
              {title: '首页', path: '/admin/console'},
              {title: '运营管理', path: '/admin/operation'},
              {title: '促销转化', path: '/admin/operation/conversion'},
              {title: '优惠券', path: ''}
            ]
          },
          component: r => require(['@/views/admin/operation/coupon/list'], r)
        },

        // 进行中
        {
          path: '/admin/operation/conversion/coupon/ongoing',
          meta: {
            title: '优惠券',
            auth: true,
            authCode: 501046,
            breadcrumb: [
              {title: '首页', path: '/admin/console'},
              {title: '运营管理', path: '/admin/operation'},
              {title: '促销转化', path: '/admin/operation/conversion'},
              {title: '优惠券', path: '/admin/operation/conversion/coupon/list'},
              {title: '进行中', path: ''}
            ]
          },
          component: r => require(['@/views/admin/operation/coupon/list'], r)
        },

        // 已结束
        {
          path: '/admin/operation/conversion/coupon/ended',
          meta: {
            title: '优惠券',
            auth: true,
            authCode: 501046,
            breadcrumb: [
              {title: '首页', path: '/admin/console'},
              {title: '运营管理', path: '/admin/operation'},
              {title: '促销转化', path: '/admin/operation/conversion'},
              {title: '优惠券', path: '/admin/operation/conversion/coupon/list'},
              {title: '已结束', path: ''}
            ]
          },
          component: r => require(['@/views/admin/operation/coupon/list'], r)
        },

        // 添加活动
        {
          path: '/admin/operation/conversion/coupon/add',
          meta: {
            title: '添加活动',
            auth: true,
            authCode: 501046,
            thirdMenu: false,
            breadcrumb: [
              {title: '首页', path: '/admin/console'},
              {title: '运营管理', path: '/admin/operation'},
              {title: '促销转化', path: '/admin/operation/conversion'},
              {title: '优惠券', path: '/admin/operation/conversion/coupon/list'},
              {title: '新增优惠券', path: ''}
            ]
          },
          component: r => require(['@/views/admin/operation/coupon/publicCoupon'], r)
        },

        // 编辑活动
        {
          path: '/admin/operation/conversion/coupon/edit',
          meta: {
            title: '编辑活动',
            auth: true,
            authCode: 501046,
            thirdMenu: false,
            breadcrumb: [
              {title: '首页', path: '/admin/console'},
              {title: '运营管理', path: '/admin/operation'},
              {title: '促销转化', path: '/admin/operation/conversion'},
              {title: '优惠券', path: '/admin/operation/conversion/coupon/list'},
              {title: '编辑优惠券', path: ''}
            ]
          },
          component: r => require(['@/views/admin/operation/coupon/publicCoupon'], r)
        }
      ]
    },

    // -------------- 互动运营
    {
      path: '/admin/operation/interactive',
      redirect: '/admin/operation/interactive/list',
      meta: {
        nav: '互动运营',
        icon: 'icon-qunzuduoren',
        auth: true,
        authCode: 501047,
        visible: true
      },
      component: r => require(['@/views/admin/operation/interactive/Layout'], r),
      children: [
        {
          path: '/admin/operation/interactive/list',
          meta: {
            title: '互动运营',
            auth: true,
            authCode: 501047,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '互动运营', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/interactive/List'], r)
        }
      ]
    },

    // -------------- 互动运营
    {
      path: '/admin/operation/interactive/admin/list',
      redirect: '/admin/operation/interactive',
      meta: {
        nav: '互动运营',
        icon: 'icon-qunzuduoren',
        auth: true,
        authCode: 501047,
        visible: false
      },
      component: r => require(['@/views/admin/operation/interactive/beansAdminLayout'], r),
      children: [
        // 兑换专区
        {
          path: '/admin/operation/interactive/exchange',
          meta: {
            title: '兑换专区',
            auth: true,
            authCode: 501047,
            refresh: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '互动运营', path: '/admin/operation/interactive/list' },
              { title: '兑换专区', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/community/Index'], r)
        },

        // 商品详情
        {
          path: '/admin/operation/interactive/exchange/details',
          meta: {
            title: '商品详情',
            auth: true,
            authCode: 501047,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '互动运营', path: '/admin/operation/interactive/list' },
              { title: '兑换专区', path: '/admin/operation/interactive/exchange' },
              { title: '商品详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/PublicDetails'], r)
        },

        // 商品设置
        {
          path: '/admin/operation/interactive/exchange/setting',
          meta: {
            title: '商品设置',
            auth: true,
            authCode: 501047,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '互动运营', path: '/admin/operation/interactive/list' },
              { title: '兑换专区', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/community/GoodsSetting'], r)
        },

        // 芯豆规则
        {
          path: '/admin/operation/interactive/rule',
          meta: {
            title: '芯豆规则',
            auth: true,
            authCode: 501047,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '互动运营', path: '/admin/operation/interactive/list' },
              { title: '芯豆规则', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/interactive/BeanRule'], r)
        },

        // 交易记录
        {
          path: '/admin/operation/interactive/record',
          meta: {
            title: '交易记录',
            auth: true,
            authCode: 501047,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '互动运营', path: '/admin/operation/interactive/list' },
              { title: '交易记录', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/interactive/giftRecord'], r)
        }
      ]
    },
    // -------------- 互动运营-易货区
    {
      path: '/admin/operation/interactive/barter',
      redirect: '/admin/operation/interactive/barter/all',
      meta: {
        nav: '易货区',
        icon: 'icon-qunzuduoren',
        auth: true,
        visible: false,
        authCode: 501047
      },
      component: r => require(['@/views/admin/operation/interactive/barter/layout'], r),
      children: [
        // 易货区-全部
        {
          path: '/admin/operation/interactive/barter/all',
          meta: {
            title: '易货区-全部',
            auth: true,
            authCode: 501047,
            refresh: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '互动运营', path: '/admin/operation/interactive/list' },
              { title: '易货区-全部', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/interactive/barter/index'], r)
        },

        // 易货区-待审核
        {
          path: '/admin/operation/interactive/barter/wait',
          meta: {
            title: '易货区-待审核',
            auth: true,
            authCode: 501047,
            refresh: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '互动运营', path: '/admin/operation/interactive/list' },
              { title: '易货区-待审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/interactive/barter/index'], r)
        },
        // 易货区-审核通过
        {
          path: '/admin/operation/interactive/barter/pass',
          meta: {
            title: '易货区-审核通过',
            auth: true,
            authCode: 501047,
            refresh: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '互动运营', path: '/admin/operation/interactive/list' },
              { title: '易货区-审核通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/interactive/barter/index'], r)
        },
        // 易货区-审核不通过
        {
          path: '/admin/operation/interactive/barter/reject',
          meta: {
            title: '易货区-审核不通过',
            auth: true,
            authCode: 501047,
            refresh: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '互动运营', path: '/admin/operation/interactive/list' },
              { title: '易货区-审核不通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/interactive/barter/index'], r)
        },
        // 易货区-审核
        {
          path: '/admin/operation/interactive/barter/audit',
          meta: {
            title: '易货区-审核',
            auth: true,
            authCode: 501047,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '互动运营', path: '/admin/operation/interactive/list' },
              { title: '易货区-审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/interactive/barter/publicBarter'], r)
        },
        // 易货区-详情
        {
          path: '/admin/operation/interactive/barter/detail',
          meta: {
            title: '易货区-详情',
            auth: true,
            authCode: 501047,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '互动运营', path: '/admin/operation/interactive/list' },
              { title: '易货区-详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/interactive/barter/publicBarter'], r)
        }
      ]
    },

    // -------------- 营销工具
    {
      path: '/admin/operation/marketing',
      redirect: '/admin/operation/marketing/list',
      meta: {
        nav: '营销工具',
        icon: 'icon-taocan',
        auth: true,
        authCode: 501048
      },
      component: r => require(['@/views/admin/operation/marketing/Layout'], r),
      children: [
        {
          path: '/admin/operation/marketing/list',
          meta: {
            title: '营销工具',
            auth: true,
            authCode: 501048,
            breadcrumb: [
              {title: '首页', path: '/admin/console'},
              {title: '运营管理', path: '/admin/operation'},
              {title: '营销工具', path: ''}
            ]
          },
          component: r => require(['@/views/admin/operation/marketing/List'], r)
        }
      ]
    },

    // -------------- 营销工具 - 拉群工具
    {
      path: '/admin/operation/marketing/group/list',
      redirect: '/admin/operation/marketing',
      meta: {
        nav: '营销工具',
        icon: 'icon-qunzuduoren',
        auth: true,
        authCode: 501048,
        visible: false
      },
      component: r => require(['@/views/admin/operation/marketing/PullGroupLayout'], r),
      children: [
        // 建群人管理
        {
          path: '/admin/operation/marketing/master',
          meta: {
            title: '建群人管理',
            auth: true,
            authCode: 501048,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '营销工具', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/marketing/MasterList'], r)
        },

        // 拉群海报管理
        {
          path: '/admin/operation/marketing/poster',
          meta: {
            title: '拉群海报管理',
            auth: true,
            authCode: 501048,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '营销工具', path: '/admin/operation/marketing' },
              { title: '拉群海报管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/marketing/PosterList'], r)
        },

        // 拉群海报管理新增
        {
          path: '/admin/operation/marketing/poster/add',
          meta: {
            title: '新增拉群海报',
            auth: true,
            authCode: 501048,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '营销工具', path: '/admin/operation/marketing' },
              { title: '拉群海报管理', path: '/admin/operation/marketing/poster' },
              { title: '新增拉群海报', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/marketing/PosterPublic'], r)
        },

        // 拉群海报管理编辑
        {
          path: '/admin/operation/marketing/poster/edit',
          meta: {
            title: '编辑拉群海报',
            auth: true,
            authCode: 501048,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '营销工具', path: '/admin/operation/marketing' },
              { title: '拉群海报管理', path: '/admin/operation/marketing/poster' },
              { title: '编辑拉群海报', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/marketing/PosterPublic'], r)
        },

        // // 宣传助手
        {
          path: '/admin/operation/marketing/propaganda',
          meta: {
            title: '宣传助手',
            auth: true,
            authCode: 501048,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '运营管理', path: '/admin/operation' },
              { title: '营销工具', path: '/admin/operation/marketing' },
              { title: '宣传助手', path: '' }
            ]
          },
          component: r => require(['@/views/admin/operation/marketing/Propaganda'], r)
        }
      ]
    }
  ]
}
