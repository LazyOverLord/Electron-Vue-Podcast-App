import router from '@/router'


const state = {
    audio:{}
}


const getters = {
    get_Audio_Data(state,getters){
        return state.audio;
      },






}

const mutations = {

    reset_Audio_State(){
      var default_state = {
        audio:{}
      }

      Object.assign(state,default_state);
    },
    

     set_Audio_Data(state,payload){
       // payload will have title , url , cover_path
       var episode_data = {};
       episode_data["title"] = payload.title;
       episode_data["url"] = payload.url;
       episode_data["cover_path"] = payload.cover_path;

       state.audio = episode_data;


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