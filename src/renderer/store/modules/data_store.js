

import {ipcRenderer} from 'electron'
import router from '@/router'
import axios from 'axios';











const state = {
  //config_data:config,
  config_data:[],
  audio_player_data:{},
  podcast_feed_data:[],
  search_results_cache:{search_term:"",results:[]},
  pending_downloads:[],
  downloads:[],
  local_downloads:[]

  
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

    
    

    
  },

  set_Search_Results_Cache(state,payload){
    state.search_results_cache.search_term = payload.search_term;
    state.search_results_cache.results = payload.results;
  },




  

  reset_State(state){
    var default_state ={
      // used to clear saved podcasts for development
      //config_data:[],

      audio_player_data:{},
      podcast_feed_data:[],
      search_results_cache:{search_term:"",results:[]},
      pending_downloads:[],
      downloads:[],
      local_downloads:[],

      // clearing old unused variable
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

add_Pending_Download_Item(state,payload){
  // file_name actual file name
  // id podcast id
  // url name is the rough name
  var pending_download_ids = [];
  state.pending_downloads.forEach((download)=>{
    pending_download_ids.push(download.download_id);

  })

  if(pending_download_ids.length == 0){
    var download_id = Math.floor((Math.random(1)*1000));
    payload["download_id"] = download_id;
    state.pending_downloads.push(payload);
  }
  
  else{
    var check_download_id = Math.floor((Math.random(1)*1000));
    var result = pending_download_ids.indexOf(check_download_id);
    if(result == -1){
      payload["download_id"] = check_download_id;
      state.pending_downloads.push(payload);
    }
    else{
      while(true){
        var check_download_id = Math.floor((Math.random(1)*1000));
        var result = pending_download_ids.indexOf(check_download_id);
        if(result == -1){
          payload['download_id'] = check_download_id;
          state.pending_downloads.push(payload);
          break;
        }
      }
    }
  }
  
},

remove_Pending_Download_Item(state,pending_download_id){
  state.pending_downloads.forEach((download,index)=>{
    if(download.download_id === pending_download_id){
      state.pending_downloads.splice(index,1);
    }
  })
},

add_Dowmload_Item(state,payload){
  // should be passed to this
  // podcast_id
  // download_title
  // download_id
  // download_size

  // download_item will have
  //  download_state, amount_downloaded 
  var download_item = {};
  download_item["podcast_id"] = payload.podcast_id;
  download_item["podcast_name"] = payload.podcast_name;
  download_item["title"] = payload.title;
  download_item["download_id"] = payload.download_id;
  download_item["download_size"] = payload.download_size;
  download_item["download_state"] = "downloading";
  download_item["amount_downloaded"] = 0;
  download_item["url_title"] = payload.url_title;
  download_item["podcast_cover"] = payload.podcast_cover;

  state.downloads.push(download_item);

 
  
},

remove_Download_Item(state,download_id){
  state.downloads.forEach((download_item,index)=>{
    if(download_item.download_id == download_id){
      state.downloads.splice(index,1);
    }
  })
},

add_Local_Download_Item(state,payload){
  // payload should have
  //  podcast_name , podcast_id , name , file_path , 
  var current_local_downloads_ids = [];
  var found = false;
  state.local_downloads.forEach((local_download)=>{
    current_local_downloads_ids.push(local_download.download_id);

    if(local_download.name === payload.name){
      found = true;
    }
  })

  if(found == false){
    var gen_id = Math.floor((Math.random(1)*1000));
    var result = current_local_downloads_ids.indexOf(gen_id);
    if(result == -1){
      payload["download_id"] = gen_id;
      state.local_downloads.push(payload);

     }

    else{
      while(true){
        var gen_id = Math.floor((Math.random(1)*1000));
        var result = current_local_downloads_ids.indexOf(gen_id);
        if(result == -1){
          payload["download_id"] = gen_id;
          state.local_downloads.push(payload);
          break;
        }
      }
    }
  }
},

add_Multiple_Local_Download_Items(state,payload){
  payload.forEach((payload)=>{
    state.local_downloads.push(payload);
  })
},

remove_All_Local_Download_Items(state){
  state.local_downloads = [];
},


update_Download_Item_Download_Amount(state,payload){
  state.downloads.forEach((download_item,index)=>{
    if(download_item.download_id == payload.download_id){
      state.downloads[index]["amount_downloaded"] = payload.amount_downloaded;
    }
  })
},

update_Download_Item_State(state,payload){
  state.downloads.forEach((download_item,index)=>{
    if(download_item.download_id == payload.download_id){
      state.downloads[index]["download_state"] = payload.download_state;
    }
  })
},



  

}



const getters = {
  getConfigAll(state,getters){
    return state.config_data;
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

  get_Pending_Downloads(state,getters){
    return state.pending_downloads;
  },

  get_Download_Items(state,getters){
    return state.downloads;
  },

  get_Single_Download_Item: (state) => (id) =>{
    return state.downloads.find((download)=> download.download_id == id);
  },

  get_Local_Downloads(state){
    return state.local_downloads;
  }
 
}

const actions = {
  

  test_Pull_Feed(context,url){
    axios.get("url")
    .then((response)=>{
      return response;
    })
  },

  test(context){
    console.log("hello World");
  }

  
};



export default {
  state,
  mutations,
  actions,
  getters,
  
};



