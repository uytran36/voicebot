export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
            //component: './CampaignManagement2',
          },
          {
            name: 'register',
            path: '/user/register',
            component: './User/register',
          },
          {
            name: 'forgot-password',
            path: '/user/forgot-password',
            component: './User/forgot-password',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        authority: ['config/voicebot', 'user'],
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            routes: [
              {
                path: '/',
                // redirect: '/welcome',
                // name: 'profile',
                redirect: '/mainpage',
              },
              {
                name: 'profile',
                path: '/account/profile',
                component: './Account/Profile',
                dynamic: true,
              },
              {
                path: '/configuration/generalconfig',
                component: './Configuration/GeneralConfig',
              },
              {
                name: 'mainpage',
                // icon: 'home',
                icon: '/icons/menu/home.svg',
                path: '/mainpage',
                component: './Mainpage',
                authority: ['mainpage'],
              },
              // {
              //   name: 'call_center',
              //   icon: '/icons/menu/call_center.svg',
              //   path: '/call_center',
              //   // component: './CallCenter',
              //   authority: ['call_center'],
              //   routes: [
              //     {
              //       name: 'extensions',
              //       path: '/call_center/extensions',
              //       component: './CallCenter',
              //       authority: ['call_center/extensions'],
              //     },
              //     {
              //       name: 'gateways',
              //       path: '/call_center/gateways',
              //       component: './CallCenter',
              //       authority: ['call_center/gateways'],
              //     },
              //     {
              //       name: 'dialplan',
              //       path: '/call_center/dialplan',
              //       component: './CallCenter',
              //       authority: ['call_center/gateways'],
              //     },
              //     {
              //       name: 'applications',
              //       path: '/call_center/applications',
              //       component: './CallCenter',
              //       authority: ['call_center/applications'],
              //     },
              //     {
              //       name: 'status',
              //       path: '/call_center/status',
              //       component: './CallCenter',
              //       authority: ['call_center/status'],
              //     },
              //     {
              //       name: 'advanced',
              //       path: '/call_center/advanced',
              //       component: './CallCenter',
              //       authority: ['call_center/advanced'],
              //     },
              //     {
              //       name: 'call_management',
              //       path: '/call_center/call_management',
              //       component: './CallManagement',
              //       exact: true,
              //     },
              //     {
              //       name: 'monitor',
              //       path: '/call_center/monitor',
              //       component: './Monitor',
              //       exact: true,
              //     },
              //   ],
              // },
              {
                path: '/config',
                name: 'config',
                icon: '/icons/menu/voice_outbound.svg',
                authority: ['config'],
                routes: [
                  // {
                  //   name: 'voicebot',
                  //   path: '/config/voicebot',
                  //   component: './Config',
                  //   authority: ['config/voicebot'],
                  //   exact: true,
                  // },
                  // {
                  //   name: 'campaignManagement',
                  //   // icon: '/icons/menu/voice_campaign.svg',
                  //   path: '/config/campaign-management',
                  //   component: './CampaignManagement',
                  //   authority: ['config/campaign-management'],
                  // },
                  {
                    name: 'campaignManagement2',
                    path: '/config/campaign-management-2',
                    component: './CampaignManagement2',
                  },
                  {
                    path: '/config/campaign-management-2/agent',
                    component: './CampaignManagement2/AgentCM',
                    dynamic: true,
                  },
                  {
                    path: '/config/campaign-management-2/:id',
                    component: './CampaignForm',
                    dynamic: true,
                  },
                  {
                    path: '/config/campaign-management-2/:id/report',
                    component: './CampaignManagement2/components/DetailCampaign',
                    dynamic: true,
                  },
                  {
                    path: '/config/campaign-management-2/agent/:id/report',
                    component: './CampaignManagement2/AgentCM/components/DetailCampaign',
                    dynamic: true,
                  },
                  {
                    path: '/config/campaign-management-2/:id/autodialer-report',
                    component: './CampaignManagement2/components/DetailCampaignAutoDialer',
                    dynamic: true,
                  },

                  // Quan ly du lieu goi 1 (xoa nhung dang xai chung route voi quan ly du lieu 2)
                  // {
                  //   name: 'standardized',
                  //   path: '/config/data-call-management-2',
                  //   authority: ['config/standardized'],
                  //   routes: [
                  //     {
                  //       name: 'import',
                  //       path: '/campaign',
                  //       component: './Campaign',
                  //       authority: ['campaign'],
                  //     },
                  //     {
                  //       name: 'standardized',
                  //       path: '/config/standardized',
                  //       component: './Sandardized',
                  //       authority: ['config/standardized'],
                  //     },

                  //   ],
                  // },
                  // Quan  ly du lieu 2
                  {
                    name: 'dataCallManagement2',
                    path: '/config/data-call-management-2',
                    component: './DataCallManagement2',
                  },
                  {
                    path: '/config/data-call-management-2/:tab',
                    component: './Sandardized-detail',
                    dynamic: true,
                  },
                  {
                    path: '/config/data-call-management-2/:tab/:id',
                    component: './Sandardized-detail',
                    dynamic: true,
                  },
                  ...(process.env.ENV === 'dev' || process.env.ENV === 'local'
                    ? [
                        {
                          name: 'campaignreport2',
                          path: '/config/campaign-report-2',
                          component: './CampaignReport2',
                          authority: ['config/campaign-report'],
                        },
                      ]
                    : []),
                  // {
                  //   name: 'campaignreport',
                  //   // icon: 'line-chart',
                  //   path: '/config/campaign-report',
                  //   component: './CampaignReport',
                  //   authority: ['config/campaign-report'],
                  // },
                ],
              },
              // {
              //   name: 'omni_inbound',
              //   icon: '/icons/menu/omni_inbound.svg',
              //   path: '/omni_inbound',
              //   // component: './Chat',
              //   authority: ['omni_inbound'],

              //   routes: [
              //     // {
              //     //   path: '/omni_inbound/config_livechat',
              //     //   name: 'config_livechat',
              //     //   component: './OmniChannelInbound',
              //     //   authority: ['omni_inbound/config_livechat'],
              //     // },
              //     {
              //       path: '/omni_inbound/config_livechat_2',
              //       name: 'config_livechat_2',
              //       component: './OmniChannelInbound2',
              //       authority: ['omni_inbound/config_livechat'],
              //     },
              //     {
              //       path: '/omni_inbound/config_livechat_2/:id',
              //       component: './OmniChannelInbound2',
              //       authority: ['omni_inbound/config_livechat'],
              //       dynamic: true,
              //     },
              //     // {
              //     //   path: '/omni_inbound/chat',
              //     //   name: 'chat',
              //     //   component: './Chat',
              //     //   authority: ['chat'],
              //     // },
              //     {
              //       path: '/omni_inbound/chat',
              //       name: 'chat2',
              //       component: './Chat2',
              //       authority: ['chat'],
              //     },
              //     {
              //       path: '/omni_inbound/report-chat',
              //       name: 'report-chat',
              //       component: './Omnichat-report',
              //       // authority: ['chat'],
              //     },
              //     // {
              //     //   path: '/omni_inbound/comment_management',
              //     //   name: 'comment_management',
              //     //   component: './CommentManagement',
              //     // },
              //     // {
              //     //   path: '/omni_inbound/comment_management/detail_comment',
              //     //   // name: 'detail_comment',
              //     //   // icon: '/icons/menu/call_center.svg',
              //     //   component: './DetailComment',
              //     //   dynamic: true,
              //     // },
              //   ],
              // },
              // {
              //   path: '/call_management',
              //   component: './CallManagement',
              // },
              // {
              //   path: '/standardized',
              //   component: './Sandardized',
              //   authority: ['standardized'],
              // },
              // {
              //   path: '/campaign-management',
              //   component: './CampaignManagement',
              //   authority: ['campaign-management'],
              // },
              // {
              //   path: '/chat',
              //   component: './Chat',
              //   authority: ['chat'],
              // },
              {
                name: 'user-management',
                icon: '/icons/menu/user.svg',
                path: '/administrator',
                authority: ['administrator'],

                routes: [
                  {
                    // icon: 'user',
                    name: 'users',
                    path: '/administrator/users',
                    component: './UserManagement',
                    // authority: ['administrator/users'],
                  },
                  // {
                  //  path: '/administrator/users/import',
                  //  component: './UserManagement/Import',
                  // },
                  // {
                  //   name: 'roles',
                  //   path: '/administrator/roles',
                  //   component: './UserManagement/Roles',
                  //   authority: ['administrator/roles'],
                  // },
                  {
                    name: 'roles',
                    path: '/administrator/roles',
                    component: './Role-management',
                    authority: ['administrator/roles'],
                  },
                  {
                    path: '/administrator/roles/permission',
                    component: './Permission-management',
                    // authority: ['administrator/roles'],
                  },
                  // {
                  //   path: '/administrator/roles/permission',
                  //   component: './UserManagement/Roles/Components/Authorization',
                  //   // authority: ['administrator/roles'],
                  // },
                ],
              },
              // {
              //   name: 'omnichannel',
              //   icon: 'user',
              //   path: '/omnichannel',
              //   component: './Omnichannel',
              // },
              // phần tạo trang động mẫu
              // {
              //   path: '/omnichannel/:id',
              //   component: './Omnichannel/LiveChat',
              //   dynamic: true
              // },
              // {
              //   name: 'countreport',
              //   icon: '/icons/menu/report.svg',
              //   path: '/report-billing',
              //   component: './CountReport',
              //   authority: ['report-billing'],
              // },
              // {
              //   name: 'countreport2',
              //   icon: '/icons/menu/report.svg',
              //   path: '/report-billing-2',
              //   component: './CountReport2',
              //   authority: ['report-billing'],
              // },
              // {
              //   name: 'statistic',
              //   icon: '/icons/menu/statistic.svg',
              //   path: '/statistic',
              //   routes: [
              //     {
              //       path: '/statistic/count_billing',
              //       name: 'count_billing',
              //       icon: '/icons/menu/report.svg',
              //       component: './Statistic/CountReport2',
              //     },
              //     {
              //       path: '/statistic/omnichat',
              //       name: 'omnichat',
              //       icon: '/icons/menu/report.svg',
              //       component: './Statistic/OmniChat',
              //     },
              //     {
              //       path: '/statistic/call-center',
              //       name: 'call-center',
              //       component: './Statistic-call-center',
              //     },
              //   ],
              // },
              // // {
              // //   name: 'testagentcall',
              // //   icon: 'bar-chart',
              // //   path: '/test-agent-call',
              // //   component: './AgentCall',
              // // },
              // // {
              // //   name: 'test-table',
              // //   icon: 'table',
              // //   path: '/TestTable',
              // //   component: './TestTable'
              // // },
              // // {
              // //   name: 'test-table-2',
              // //   icon: 'table',
              // //   path: '/TestTable2',
              // //   component: './TestTable2'
              // // },
              // // {
              // //   name: 'configuration',
              // //   icon: 'setting',
              // //   path: '/configuration',
              // //   component: './Configuration',
              // // },
              // {
              //   // name: 'campaign',
              //   // icon: 'sound',
              //   path: '/campaign',
              //   component: './Campaign',
              //   authority: ['campaign'],
              // },

              // {
              //   name: 'crm',
              //   icon: '/icons/menu/crm.svg',
              //   path: '/customer-relationship-management',
              //   authority: ['administrator'],
              //   routes: [
              //     // {
              //     //   // icon: 'user',
              //     //   name: 'users',
              //     //   path: '/administrator/users',
              //     //   component: './UserManagement/Users',
              //     //   // authority: ['administrator/users'],
              //     // },
              //     {
              //       name: 'crm-customers',
              //       path: '/customer-relationship-management/customer-management',
              //       component: './CR-management',
              //     },
              //     {
              //       path: '/customer-relationship-management/customer-management/:tab',
              //       component: './CRM-detail',
              //       dynamic: true,
              //     },
              //     {
              //       path: '/customer-relationship-management/customer-management/:tab/:id',
              //       component: './CRM-detail',
              //       dynamic: true,
              //     },
              //   ],
              // },
              // {
              //   name: 'detail_comment',
              //   icon: '/icons/menu/call_center.svg',
              //   path: '/detail_comment',
              //   component: './DetailComment',
              // },
              // {
              //   name: 'calendar',
              //   icon: 'home',
              //   path: '/calendar',
              //   component: './TestCalendar',
              // },
              // {
              //   name: 'role-detail',
              //   icon: 'setting',
              //   path: '/RoleDetail',
              //   component: './UserManagement/Roles/Components/RoleDetail',
              // },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
