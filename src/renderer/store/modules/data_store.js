

import {ipcRenderer,remote} from 'electron'
import router from '@/router'
import axios from 'axios';
var current_window = remote.getCurrentWindow();











const state = {
  //config_data:config,
  config_data:[],
  audio_player_data:{},
  podcast_feed_data:[],
  search_results_cache:{search_term:"",results:[]},
  search_query_cache:[]
  

  
}


const mutations = {

  set_Default_Feed_State(state){
    var default_state = [];
    for(var i =0;i<state.config_data.length;i++){
      var temp = {};
      temp["id"] = state.config_data[i]["id"];
      temp["data"] = [];
      

      default_state.push(temp);
    }
    

    state.podcast_feed_data = default_state;

    // sets pending downloads default state

    for(var i = 0;i<state.config_data.length;i++){
      state.config_data[i].pending_downloads = [];
    }

    if(state.local_downloads.length == 0){
      for(var i = 0;i<state.config_data.length;i++){
        var temp = [];
        var temp_obj = {};
        temp_obj["id"] = state.config_data[i]["id"];
        temp_obj["name"] = state.config_data[i]["name"];
        
        temp.push(temp_obj);
        state.local_downloads.push(temp);
      }
    }

    
    

    
  },

  set_Search_Results_Cache(state,payload){
    state.search_results_cache.search_term = payload.search_term;
    state.search_results_cache.results = payload.results;
  },




  

  reset_State(state){
    var default_state ={
      // used to clear saved podcasts for development
      //config_data:[],
      //local_downloads:[],

      audio_player_data:{},
      podcast_feed_data:[],
      search_results_cache:{search_term:"",results:[]},
      current_download:[],
      download_que:[],
      

      // clearing old unused variable
      pending_downloads:[],
      config:[]

    }
    Object.assign(state,default_state);
  },

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
  },

  Change_Episode_Order(state,id){
    state.podcast_feed_data.forEach((feed)=>{
      if(feed.id == id){
        feed.data.reverse();
      }
    });


  },

  setPodcastFeed(state,payload){
    for(var i = 0;i<state.podcast_feed_data.length;i++){
      if(state.podcast_feed_data[i].id == payload.id){
        state.podcast_feed_data[i].data = payload.data;
        
      }
    } 
},

add_Search_Query(state,search_query){
  this.search_query_cache.push(search_query);
},

clear_Search_Query_Cache(state){
  this.search_query_cache = [];
},

add_Podcast_Feed(state,payload){
  var current_ids = [];
  state.config_data.forEach((feed)=>{
    current_ids.push(feed.id);
  })

  var gen_id = Math.floor(Math.random(1)*1000);
  var result = current_ids.indexOf(gen_id);
  // cleans up podcast name for file 
  var file_characters_check = ['/',":","*","?","<",">","|",'\\',"#"];
  var podcast_name = payload.name;
  file_characters_check.forEach((char)=>{
    if(podcast_name.includes(char)== true){
      podcast_name = podcast_name.replace(char,"");
    }
  });


  if(result==-1){
    var new_feed_data ={};
    new_feed_data['name'] = podcast_name;
    new_feed_data['url'] = payload.url;
    new_feed_data['cover_path'] = payload.cover_path;
    new_feed_data["id"] = gen_id;
    new_feed_data["pending_downloads"] = [];

    state.config_data.push(new_feed_data);

    var new_podcast_feed_data_holder = {};
    new_podcast_feed_data_holder["id"] = gen_id;
    new_podcast_feed_data_holder["data"] = [];

    state.podcast_feed_data.push(new_podcast_feed_data_holder);
  }

  else{
    while(true){
      gen_id = Math.floor(Math.random(1)*1000);
      var result = current_ids.indexOf(gen_id);
      if(result == -1){
        new_feed_data["name"] = podcast_name;
        new_feed_data["url"] = payload.url;
        new_feed_data["cover_path"] = payload.cover_path;
        new_feed_data["id"] = gen_id;
        new_feed_data["pending_downloads"] = [];

        state.config_data.push(new_feed_data);

        var new_podcast_feed_data_holder = {};
        new_podcast_feed_data_holder["id"] = gen_id;
        new_podcast_feed_data_holder["data"] = [];

        state.podcast_feed_data.push(new_podcast_feed_data_holder);

        break;

      }
    }
  }

},

remove_Podcast_Feed(state,feed_id){
  var current_ids = [];
  state.config_data.forEach((feed)=>{
    current_ids.push(feed.id);
  })

  if(current_ids.indexOf(feed_id) !=-1){
    var feed_index = current_ids.indexOf(feed_id);
    
    state.config_data.splice(feed_index,1);
    
  }
},


}



const getters = {
  getConfigAll(state,getters){
    return state.config_data;
  },

  get_Search_Query_Cache(state,getters){
    return state.search_query_cache;
  },

  get_Audio_Data(state,getters){
    return state.audio_player_data;
  },

  

  get_All_Feed_Data(state,getters){
    return state.podcast_feed_data;
  },

  get_Feed_Data_By_Id: (state) => (id) =>{
    return state.podcast_feed_data.find((podcast_feed_data) => podcast_feed_data.id == id);
  },

  get_Search_Results_Cache(state,getters){
    return state.search_results_cache;
  },

  
}

const actions = {

};



export default {
  state,
  mutations,
  actions,
  getters,
  
};



