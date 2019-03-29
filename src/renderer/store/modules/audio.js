import router from '@/router'


const state = {
    audio_player_data:{}
}


const getters = {
    get_Audio_Data(state,getters){
        return state.audio_player_data;
      },






}

const mutations = {
    set_Audio_Data(state,payload){
    
        var id = router.currentRoute.params.id;
        for(var i = 0; i<state.podcast_feed_data.length;i++){
          if(id == state.podcast_feed_data[i].id){
            var episode_url = state.podcast_feed_data[i].data[payload.episode_index].url;
            var episode_title = state.podcast_feed_data[i].data[payload.episode_index].title;
   
            var episode_data = {}
            episode_data["title"] = episode_title;
            episode_data["url"] = episode_url;
            episode_data["cover_path"] = payload.cover_path;
            
            state.audio_player_data = episode_data;
          }
        }
     },

     set_Audio_Data_Manual(state,payload){
        var episode_data = {};
        episode_data["title"] = payload.title;
        episode_data["url"] = payload.url;
        episode_data["cover_path"] = payload.cover_path;
    
        state.audio_player_data = episode_data;
      }


}


const actions = {

}



export default {
    state,
    mutations,
    actions,
    getters,
    
  };