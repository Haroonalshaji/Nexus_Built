export const MENU_ITEMS = [{
  key: 'menu',
  label: 'MENU',
  isTitle: true
}, {
  key: 'dashboards',
  label: 'Dashboards',
  icon: 'ri:dashboard-2-line',
  children: [{
    key: 'analytics',
    label: 'Analytics',
    url: '/dashboards/analytics',
    parentKey: 'dashboards'
  },
    //  {
    //   key: 'agent',
    //   label: 'Agent',
    //   url: '/dashboards/agent',
    //   parentKey: 'dashboards'
    // }, {
    //   key: 'customer',
    //   label: 'Customer',
    //   url: '/dashboards/customer',
    //   parentKey: 'dashboards'
    // }
  ]
}, {
  key: 'property',
  label: 'Categories',
  icon: 'iconamoon:category-light',
  children: [
    // {
    //   key: 'property-grid',
    //   label: 'Category Grid',
    //   url: '/property/grid',
    //   parentKey: 'property'
    // }, {
    //   key: 'property-list',
    //   label: 'Category List',
    //   url: '/property/list',
    //   parentKey: 'property'
    // }, {
    //   key: 'property-details',
    //   label: 'Category Details',
    //   url: '/property/details',
    //   parentKey: 'property'
    // },
    {
      key: 'add-property',
      label: 'Add Category',
      url: '/property/add',
      parentKey: 'property'
    }]
},
// {
//   key: 'agents',
//   label: 'Agents',
//   icon: 'ri:group-line',
//   children: [{
//     key: 'agents-list-view',
//     label: 'List View',
//     url: '/agents/list-view',
//     parentKey: 'agents'
//   }, {
//     key: 'agents-grid-view',
//     label: 'Grid View',
//     url: '/agents/grid-view',
//     parentKey: 'agents'
//   }, {
//     key: 'agent-details',
//     label: 'Agent Details',
//     url: '/agents/details',
//     parentKey: 'agents'
//   }, {
//     key: 'add-agent',
//     label: 'Add Agent',
//     url: '/agents/add',
//     parentKey: 'agents'
//   }]
// },
//  {
//   key: 'customers',
//   label: 'Customers',
//   icon: 'ri:contacts-book-3-line',
//   children: [{
//     key: 'list-view',
//     label: 'List View',
//     url: '/customers/list-view',
//     parentKey: 'customers'
//   }, {
//     key: 'grid-view',
//     label: 'Grid View',
//     url: '/customers/grid-view',
//     parentKey: 'customers'
//   }, {
//     key: 'customer-details',
//     label: 'Customer Details',
//     url: '/customers/details',
//     parentKey: 'customers'
//   }, {
//     key: 'add-customer',
//     label: 'Add Customer',
//     url: '/customers/add',
//     parentKey: 'customers'
//   }]
// }, 
// {
//   key: 'orders',
//   label: 'Orders',
//   icon: 'ri:home-office-line',
//   url: '/orders'
// },
{
  key: 'transactions',
  label: 'Transactions',
  icon: 'ri:arrow-left-right-line',
  url: '/transactions'
},
{
  key: 'reviews',
  label: 'Enquiries',
  icon: 'ri:chat-quote-line',
  url: '/reviews'
}, 
// {
//   key: 'messages',
//   label: 'Messages',
//   icon: 'ri:discuss-line',
//   url: '/messages'
// }, {
//   key: 'inbox',
//   label: 'Inbox',
//   icon: 'ri:inbox-line',
//   url: '/inbox'
// },
 {
  key: 'post',
  label: 'Export Data',
  icon: 'ri:news-line',
  children: [{
    key: 'post',
    label: 'Print Data',
    url: '/post',
    parentKey: 'post'
  }, 
  // {
  //   key: 'post-details',
  //   label: 'Post Details',
  //   url: '/post/details',
  //   parentKey: 'post'
  // }, {
  //   key: 'create-post',
  //   label: 'Create Post',
  //   url: '/post/create',
  //   parentKey: 'post'
  // }
]
},

];


// these are the menu sys_that made hidden 
const disabedMenus = [

  {
    key: 'custom',
    label: 'CUSTOM',
    isTitle: true
  }, {
    key: 'pages',
    label: 'Pages',
    icon: 'ri:pages-line',
    children: [{
      key: 'welcome',
      label: 'Welcome',
      url: '/pages/welcome',
      parentKey: 'pages'
    }, {
      key: 'calendar',
      label: 'Calendar',
      url: '/pages/calendar',
      parentKey: 'pages'
    }, {
      key: 'invoice',
      label: 'Invoice',
      url: '/pages/invoice',
      parentKey: 'pages'
    }, {
      key: 'faqs',
      label: 'FAQs',
      url: '/pages/faqs',
      parentKey: 'pages'
    }, {
      key: 'coming-soon',
      label: 'Coming Soon',
      url: '/coming-soon',
      parentKey: 'pages'
    }, {
      key: 'timeline',
      label: 'Timeline',
      url: '/pages/timeline',
      parentKey: 'pages'
    }, {
      key: 'pricing',
      label: 'Pricing',
      url: '/pages/pricing',
      parentKey: 'pages'
    }, {
      key: 'maintenance',
      label: 'Maintenance',
      url: '/maintenance',
      parentKey: 'pages'
    }, {
      key: '404-error',
      label: '404 Error',
      url: '/404-error',
      parentKey: 'pages'
    }, {
      key: '404-error(alt)',
      label: '404 Error (alt)',
      url: '/pages/error-404-alt',
      parentKey: 'pages'
    }]
  }, {
    key: 'auth',
    label: 'Authentication',
    icon: 'ri:lock-password-line',
    children: [{
      key: 'sign-in',
      label: 'Sign In',
      url: '/auth/sign-in',
      parentKey: 'auth'
    }, {
      key: 'sign-up',
      label: 'Sign Up',
      url: '/auth/sign-up',
      parentKey: 'auth'
    }, {
      key: 'reset-password',
      label: 'Reset Password',
      url: '/auth/reset-password',
      parentKey: 'auth'
    }, {
      key: 'lock-screen',
      label: 'Lock Screen',
      url: '/auth/lock-screen',
      parentKey: 'auth'
    }]
  }, {
    key: 'widgets',
    label: 'Widgets',
    icon: 'ri:shapes-line',
    badge: {
      text: 'Hot',
      variant: 'danger'
    },
    url: '/widgets'
  },
  {
    key: 'Components',
    label: 'COMPONENTS',
    isTitle: true
  }, {
    key: 'base-ui',
    label: 'Base UI',
    icon: 'ri:contrast-drop-line',
    children: [{
      key: 'accordion',
      label: 'Accordion',
      url: '/base-ui/accordion',
      parentKey: 'base-ui'
    }, {
      key: 'alerts',
      label: 'Alerts',
      url: '/base-ui/alerts',
      parentKey: 'base-ui'
    }, {
      key: 'avatar',
      label: 'Avatar',
      url: '/base-ui/avatar',
      parentKey: 'base-ui'
    }, {
      key: 'badge',
      label: 'Badge',
      url: '/base-ui/badge',
      parentKey: 'base-ui'
    }, {
      key: 'breadcrumb',
      label: 'Breadcrumb',
      url: '/base-ui/breadcrumb',
      parentKey: 'base-ui'
    }, {
      key: 'buttons',
      label: 'Buttons',
      url: '/base-ui/buttons',
      parentKey: 'base-ui'
    }, {
      key: 'cards',
      label: 'Cards',
      url: '/base-ui/cards',
      parentKey: 'base-ui'
    }, {
      key: 'carousel',
      label: 'Carousel',
      url: '/base-ui/carousel',
      parentKey: 'base-ui'
    }, {
      key: 'collapse',
      label: 'Collapse',
      url: '/base-ui/collapse',
      parentKey: 'base-ui'
    }, {
      key: 'dropdown',
      label: 'Dropdown',
      url: '/base-ui/dropdown',
      parentKey: 'base-ui'
    }, {
      key: 'list-group',
      label: 'List Group',
      url: '/base-ui/list-group',
      parentKey: 'base-ui'
    }, {
      key: 'modals',
      label: 'Modals',
      url: '/base-ui/modals',
      parentKey: 'base-ui'
    }, {
      key: 'tabs',
      label: 'Tabs',
      url: '/base-ui/tabs',
      parentKey: 'base-ui'
    }, {
      key: 'offcanvas',
      label: 'Offcanvas',
      url: '/base-ui/offcanvas',
      parentKey: 'base-ui'
    }, {
      key: 'pagination',
      label: 'Pagination',
      url: '/base-ui/pagination',
      parentKey: 'base-ui'
    }, {
      key: 'placeholders',
      label: 'Placeholders',
      url: '/base-ui/placeholders',
      parentKey: 'base-ui'
    }, {
      key: 'popovers',
      label: 'Popovers',
      url: '/base-ui/popovers',
      parentKey: 'base-ui'
    }, {
      key: 'progress',
      label: 'Progress',
      url: '/base-ui/progress',
      parentKey: 'base-ui'
    }, {
      key: 'spinners',
      label: 'spinners',
      url: '/base-ui/spinners',
      parentKey: 'base-ui'
    }, {
      key: 'toasts',
      label: 'Toasts',
      url: '/base-ui/toasts',
      parentKey: 'base-ui'
    }, {
      key: 'tooltips',
      label: 'Tooltips',
      url: '/base-ui/tooltips',
      parentKey: 'base-ui'
    }]
  }, {
    key: 'advanced-ul',
    label: 'Advanced Ul',
    icon: 'ri:briefcase-line',
    children: [{
      key: 'ratings',
      label: 'Ratings',
      url: '/advanced-ul/ratings',
      parentKey: 'advanced-ul'
    }, {
      key: 'alert',
      label: 'Sweet Alert',
      url: '/advanced-ul/alert',
      parentKey: 'advanced-ul'
    }, {
      key: 'swiper',
      label: 'Swiper Slider',
      url: '/advanced-ul/swiper',
      parentKey: 'advanced-ul'
    }, {
      key: 'scrollbar',
      label: 'Scrollbar',
      url: '/advanced-ul/scrollbar',
      parentKey: 'advanced-ul'
    }, {
      key: 'toastify',
      label: 'Toastify',
      url: '/advanced-ul/toastify',
      parentKey: 'advanced-ul'
    }]
  }, {
    key: 'charts',
    label: 'charts',
    icon: 'ri:bar-chart-line',
    children: [{
      key: 'area',
      label: 'area',
      url: '/charts/area',
      parentKey: 'charts'
    }, {
      key: 'bar',
      label: 'Bar',
      url: '/charts/bar',
      parentKey: 'charts'
    }, {
      key: 'bubble',
      label: 'Bubble',
      url: '/charts/bubble',
      parentKey: 'charts'
    }, {
      key: 'candlestick',
      label: 'Candlestick',
      url: '/charts/candlestick',
      parentKey: 'charts'
    }, {
      key: 'column',
      label: 'Column',
      url: '/charts/column',
      parentKey: 'charts'
    }, {
      key: 'heatmap',
      label: 'Heatmap',
      url: '/charts/heatmap',
      parentKey: 'charts'
    }, {
      key: 'line',
      label: 'Line',
      url: '/charts/line',
      parentKey: 'charts'
    }, {
      key: 'mixed',
      label: 'Mixed',
      url: '/charts/mixed',
      parentKey: 'charts'
    }, {
      key: 'charts-timeline',
      label: 'Timeline',
      url: '/charts/timeline',
      parentKey: 'charts'
    }, {
      key: 'boxplot',
      label: 'Boxplot',
      url: '/charts/boxplot',
      parentKey: 'charts'
    }, {
      key: 'treemap',
      label: 'Treemap',
      url: '/charts/treemap',
      parentKey: 'charts'
    }, {
      key: 'pie',
      label: 'Pie',
      url: '/charts/pie',
      parentKey: 'charts'
    }, {
      key: 'radar',
      label: 'Radar',
      url: '/charts/radar',
      parentKey: 'charts'
    }, {
      key: 'radial-bar',
      label: 'RadialBar',
      url: '/charts/radial-bar',
      parentKey: 'charts'
    }, {
      key: 'scatter',
      label: 'Scatter',
      url: '/charts/scatter',
      parentKey: 'charts'
    }, {
      key: 'polar',
      label: 'Polar Area',
      url: '/charts/polar',
      parentKey: 'charts'
    }]
  }, {
    key: 'forms',
    label: 'Forms',
    icon: 'ri:survey-line',
    children: [{
      key: 'basic',
      label: 'Basic Element',
      url: '/forms/basic',
      parentKey: 'forms'
    }, {
      key: 'checkbox',
      label: 'Checkbox & Radio ',
      url: '/forms/checkbox',
      parentKey: 'forms'
    }, {
      key: 'select',
      label: 'Choices Select',
      url: '/forms/select',
      parentKey: 'forms'
    }, {
      key: 'clipboard',
      label: 'Clipboard',
      url: '/forms/clipboard',
      parentKey: 'forms'
    }, {
      key: 'flat-picker',
      label: 'Flatepicker',
      url: '/forms/flat-picker',
      parentKey: 'forms'
    }, {
      key: 'validation',
      label: 'Validation',
      url: '/forms/validation',
      parentKey: 'forms'
    }, {
      key: 'wizard',
      label: 'Wizard',
      url: '/forms/wizard',
      parentKey: 'forms'
    }, {
      key: 'file-uploads',
      label: 'File Upload',
      url: '/forms/file-uploads',
      parentKey: 'forms'
    }, {
      key: 'editors',
      label: 'Editors',
      url: '/forms/editors',
      parentKey: 'forms'
    }, {
      key: 'input-mask',
      label: 'Input Mask',
      url: '/forms/input-mask',
      parentKey: 'forms'
    }, {
      key: 'range-slider',
      label: 'Slider',
      url: '/forms/range-slider',
      parentKey: 'forms'
    }]
  }, {
    key: 'tables',
    label: 'Tables',
    icon: 'ri:table-line',
    children: [{
      key: 'tables-basic',
      label: 'Basic Tables',
      url: '/tables/basic',
      parentKey: 'tables'
    }, {
      key: 'gridjs',
      label: 'Grid Js',
      url: '/tables/gridjs',
      parentKey: 'tables'
    }]
  }, {
    key: 'icons',
    label: 'Icons',
    icon: 'ri:pencil-ruler-2-line',
    children: [{
      key: 'boxicons',
      label: 'Box Icons',
      url: '/icons/boxicons',
      parentKey: 'icons'
    }, {
      key: 'solaricons',
      label: 'Solar Icons',
      url: '/icons/solaricons',
      parentKey: 'icons'
    }]
  }, {
    key: 'maps',
    label: 'Maps',
    icon: 'ri:road-map-line',
    children: [{
      key: 'google',
      label: 'Google Maps',
      url: '/maps/google',
      parentKey: 'maps'
    }, {
      key: 'vector',
      label: 'Vector Maps',
      url: '/maps/vector',
      parentKey: 'maps'
    }]
  }, {
    key: 'badge-menu',
    label: 'Badge Menu',
    badge: {
      text: '1',
      variant: 'danger'
    },
    icon: 'ri:shield-star-line'
  }, {
    key: 'menu-items',
    label: 'Menu Item',
    icon: 'ri:share-line',
    children: [{
      key: 'menu-items-1',
      label: 'Menu Items 1',
      parentKey: 'menu-items'
    }, {
      key: 'menu-items-2',
      label: 'Menu Items 2',
      parentKey: 'menu-items',
      children: [{
        key: 'menu sub item',
        label: 'Menu Sub Item',
        parentKey: 'menu-items-2'
      }]
    }]
  }, {
    key: ' Disable Item',
    label: ' Disable Item',
    icon: 'ri:prohibited-2-line'
  }
]