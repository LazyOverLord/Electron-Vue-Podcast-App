<template>
  <div id="app">
    <router-view></router-view>

    <audio-player></audio-player>
    
  </div>
</template>

<script>
import {ipcRenderer, ipcMain,remote} from "electron";
import {rename,readdir, readdirSync,exists} from 'fs';
import path from "path";

var current_webcontents = remote.getCurrentWebContents();






  
  export default {
    name: 'app',

    components:{
      "audio-player":require("@/components/Audio-Player").default
    },

    methods:{
      main_event_listener: async function(){
        

        ipcRenderer.on("async_download_state_updated",(event,new_state)=>{
          this.$store.commit('update_Current_Download_State',new_state);
        })

        ipcRenderer.on("async_current_download_canceled",(event)=>{
          this.$store.dispatch("update_Current_Download",true);
        })

       

        

        

        ipcRenderer.on("async_download_change_state",(event,download_id,new_state)=>{
          var payload = {};
          payload["download_id"] = download_id;
          payload["download_state"] = new_state;

          this.$store.commit('update_Download_Item_State',payload);
        })

        ipcRenderer.on("async_dir_search_add_local_download",(event,total_payload)=>{
          total_payload.forEach((payload)=>{
            this.$store.commit("add_Multiple_Local_Download_Items",total_payload);
          })
        })

        ipcRenderer.on("async_data_url_test_resp",(event,url_data)=>{
          var payload = {};
          payload["title"] = "test";
          payload["cover_path"] = "";
          payload["url"] = url_data;
          this.$store.commit("set_Audio_Data_Manual",payload);
        })

        

        

        
      },

      add_Download_Item:function(download,url_name,file_size){
        this.$store.commit('remove_Pending_Download_Item',download.download_id);
              // delete once you create downloads and add it

              var current_downloads = this.$store.getters.get_Download_Items;
              var current_download_id = [];
              if(current_downloads.length !=0){
                current_downloads.forEach((download)=>{
                  current_download_id.push(download.download_id);
                })
              }

              var new_download_id;
              if(current_download_id.length == 0){
                new_download_id = Math.floor((Math.random(1)*1000));

              }
              else{
                var check_id = Math.floor((Math.random(1)*1000));
                var result = current_download_id.indexOf(check_id);
                if(result == -1){
                  new_download_id = check_id;
                }

                else{
                  while(true){
                    var check_id = Math.floor((Math.random(1)*1000));
                    var result = current_download_id.indexOf(check_id);
                    if(result == -1){
                      new_download_id = check_id;
                      break;
                    }
                  }
                  
                }
              }

              var episode_name = download.file_name;
              var file_characters_check = ['/',":","*","?","<",">","|",'\\',"#"];

              file_characters_check.forEach((char)=>{
                if(episode_name.includes(char) == true){
                  episode_name = episode_name.replace(char,"");
                }
              })

              var download_payload = {};
              download_payload["podcast_id"] = download.id;
              download_payload["podcast_name"] = download.podcast_name;
              download_payload["title"] = episode_name;
              download_payload["download_id"] = new_download_id;
              download_payload["download_size"] = file_size;
              download_payload["url_title"] = url_name;
              download_payload["podcast_cover"] = download.podcast_cover;
              

              console.log(download_payload);

              this.$store.commit("add_Dowmload_Item",download_payload);

              var feeds = this.$store.getters.getConfigAll;

              var current_podcast = "";

              feeds.forEach((feed)=>{
                if(feed.id == download.id){
                  current_podcast = feed.name;
                }
              })

              
              
            },

          
    get_Podcast_Downloads_All:function(download_path){
       var podcasts = this.$store.getters.getConfigAll;
       var podcast_names = [];

       podcasts.forEach((podcast)=>{
         podcast_names.push(podcast.name);
       })

       var total_file_downloads = [];

       podcast_names.forEach((name)=>{
         var new_path = download_path+"/"+name;
         exists(new_path,(result)=>{
           if(result){
             readdir(new_path,(err,files)=>{
               if(files.length!=0){
               if(err){console.log(err)}
               console.log(files);

               }

             })
           }
         })


       
    });

    },

    
    

    

    
    

    
    

    },

        
      
  
    

    

    created:function(){
      this.$store.commit('reset_State');
      this.$store.commit('set_Default_Feed_State');
      
      

      
      
    },

    mounted:function(){
      this.main_event_listener();
      


      
     
    }

    
    

    
  }
</script>

<style>
  
</style>
