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
    

     set_Audio_Data(state,{title,url,cover_path}){
       // payload will have title , url , cover_path
       var episode_data = {};
       episode_data["title"] = title;
       episode_data["url"] = url;
       episode_data["cover_path"] = cover_path;

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