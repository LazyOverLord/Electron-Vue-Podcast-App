import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'show-case-podcast',
      component: require('@/components/Show-Case-Podcasts').default
    },
    
    {
      path: '*',
      redirect: '/'
    },

    {
      path:"/podcasts/:id",
      name:"podcast",
      component:require('@/components/Podcast').default
    },
    {
      path:"/podcast_search",
      name:"podcast_search",
      component:require('@/components/Search-Podcasts').default
    },

    {
      path:"/view-result/:id",
      name:"view-result",
      component:require('@/components/View-Result').default
    },

    {
      path:"/manage-feeds",
      name:"manage-feeds",
      component:require('@/components/Manage-Feeds').default
    },

    {
      path:"/test",
      name:"test",
      component:require('@/components/Material-Test').default
    },
    {
      path:'/blank',
      name:"blank",
      component:require('@/components/Test-Blank').default
    },
    {
      path:'/card_test',
      name:"card_test",
      component:require('@/components/Card-Test').default
    },
    {
      path:"/test_drawer",
      name:"test_drawer",
      component:require('@/components/Nav-Test').default
    },
    {
      path:"/layout",
      name:"layout",
      component:require('@/components/Grid-Test').default
    }

    

    
  ]
})
