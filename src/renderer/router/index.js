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

    

    
  ]
})
