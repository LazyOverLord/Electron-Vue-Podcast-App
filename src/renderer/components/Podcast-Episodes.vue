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


