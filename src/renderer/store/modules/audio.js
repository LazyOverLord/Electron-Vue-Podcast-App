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

    reset_Audio_State(){
      var default_state = {
        audio_player_data:{}
      }

      Object.assign(state,default_state);
    },
    

     set_Audio_Data(state,payload){
       // payload will have title , url , cover_path
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