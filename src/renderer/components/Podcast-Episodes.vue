<template>
    <div>
        
        
        <p> Podcast Episodes</p>

        <div v-if="error == false">

            <div v-if="podcast_episodes.length == 0">
                <p> Loading Podcast Data </p>
            </div>
        
            <div v-else>
                <button @click="refresh_Podcast(podcast_data.url)"> Refresh Podcast </button>
                <button @click="change_Display_Order()"> Change Display Order</button>
                <ul>
                    <li v-for="(data, i) in podcast_episodes">
                
                        <button @click="play_Episode(i,podcast_data.cover_path)"> Play </button>
                        <img :src="podcast_data.cover_path"/>
                        <p>{{data.title}}</p>
                        
                        <div v-if="search_podcast == false">
                           <!-- <a :href="data.url" @click="create_Download_Item(data.url,data.title)" download> Download </a>-->
                           <button  @click="create_Download_Item(data.url,data.title)"> Download </button>
                            
                        </div> 
                        
                        
                    

                    </li>
            
                </ul>

            </div>
        </div>

        <div v-else>
            <p> Could not load podcast episodes cheeck your internet connection</p>
            <button @click="refresh_Podcast(podcast_data.url)"> Click to Try Again </button>
        </div>
            

            

        


    </div>
</template>




<script>
import {mapActions, mapGetters,mapMutations,mapState} from 'vuex'
import store from '@/store';
import {ipcRenderer} from 'electron';
import axios from 'axios';
import {remote} from 'electron';
var current_window = remote.getCurrentWindow();





export default {
    name:'podcast-episodes',
    data(){
        return{
         
          
          
             
        }
    },

    props:['podcast_data','podcast_episodes','error','search_podcast'],

    methods:{
        cleanUpFeed_Data:function(){
            console.log("Exiting and cleaning up child-podcast-episodes");
            
            
        },

        change_Display_Order:function(){
            this.$emit('change_Order');
        },

        

        refresh_Podcast:function(url){
            this.$emit('refresh',url);
        },

        play_Episode:function(episode_index,cover_path){
            var payload = {};
            payload["episode_index"] = episode_index;
            payload["cover_path"] = cover_path;

            this.$emit('play_episode',payload);
        },

        create_Download_Item:function(url,episode_title){

           //current_window.webContents.downloadURL(url);


            var file_characters_check = ['/',":","*","?","<",">","|",'\\',"#"];

            var podcast_name = this.podcast_data.name;
            var cleaned_episode_title = episode_title;
            file_characters_check.forEach((char)=>{
                if(podcast_name.includes(char) == true){
                    podcast_name = podcast_name.replace(char,"");
                }

                if(cleaned_episode_title.includes(char)==true){
                    cleaned_episode_title = cleaned_episode_title.replace(char,"");
                }
            })

            ipcRenderer.send('async_create_download_podcast_folder',podcast_name);

            

            var url_split = url.split('/');
            var file_name = url_split[url_split.length -1];
            if(file_name.includes("?") == true){
                var final_split = file_name.split("?");
                file_name = final_split[0];
            }

            var download_payload = {};
            download_payload["podcast_name"] = podcast_name;
            download_payload["podcast_id"] = this.podcast_data.id;
            download_payload["cover_path"] = this.podcast_data.cover_path;
            download_payload["episode_title"] = cleaned_episode_title;
            download_payload["url_stub"] = file_name;
            download_payload["url"] = url;
            download_payload["amount_downloaded"] = 0;
            download_payload["file_size"] = 0;
            download_payload["download_state"] = "pending";
            
            var current_que = this.$store.getters.get_Download_Que;
            if(current_que.length ==0){
                var current_download = this.$store.getters.get_Current_Download;
                if(current_download.length == 0){
                    current_window.webContents.downloadURL(url);
                    this.$store.commit('update_Current_Download_Item',download_payload);
                }
                else{
                    this.$store.commit('add_Download_Item_To_Que',download_payload);
                }
            }

            else{
               this.$store.commit('add_Download_Item_To_Que',download_payload);
            }
            

        

        },

        

        

        

        


        

        
        

    },

    
    

    

    
        
    
    

    
    
    

    

}

    

    
    

</script>

<style scoped>


 

 ul{
     list-style: none;
     padding-right: 1em;
 }

 ul li {
     width:inherit;
     width:inherit;
     padding:2em 1em;
     border-bottom:.5em solid silver;
     border-radius:1em;
     background-color:white;
 }

 ul li button{
     float:left;
     padding-left:10px;
 }

 img{
     float:left;
     width:75px;
     height:75px;
     padding-left:10px;
     padding-right:10px;
 }

 div{
     background-color:gray;
 }
    

</style>


