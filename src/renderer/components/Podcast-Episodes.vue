<template>
    <div>
        
        
        <p> Podcast Episodes</p>

        <md-dialog :md-active.sync="showDialog">
                
                <md-card>
                    <md-card-header>
                        <md-card-header-text>
                            <div class="md-title"> {{desc_obj.title}}</div>
                            <div class="md-subhead"> {{desc_obj.desc}}</div>
                        </md-card-header-text>

                        <md-card-media md-big>
                            <img :src="podcast_data.cover_path" alt="People">
                        </md-card-media>

                    </md-card-header>
                </md-card>
                    

                <md-dialog-actions>
                    <md-button @click="play_Episode(desc_obj.episode_index,desc_obj.cover_path)"> Play </md-button>
                    <md-button @click="clear_Desc_Data()"> close </md-button>
                    
                </md-dialog-actions>

        </md-dialog>


        <div v-if="error == false">

            <div v-if="podcast_episodes.length == 0">
                <p> Loading Podcast Data </p>
                <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate"></md-progress-spinner>
            </div>
        
            <div v-else>
                <button @click="refresh_Podcast(podcast_data.url)"> Refresh Podcast </button>
                <button @click="change_Display_Order()"> Change Display Order</button>
                <ul>
                    <li v-for="(data, i) in podcast_episodes">
                
                        <md-button class="md-icon-button" @click="play_Episode(i,podcast_data.cover_path)"> 
                            <md-icon> play_arrow </md-icon>
                        </md-button>
                        <img :src="podcast_data.cover_path"/>
                        <p>{{data.title}}</p>
                        <md-button @click="set_Current_Desc(data.title,data.desc,i)"> info </md-button>
                        

                        
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
         showDialog:false,
         desc_obj:{}
          
          
             
        }
    },

    props:['podcast_data','podcast_episodes','error','search_podcast'],

    methods:{

        set_Current_Desc:function(title,desc,episode_index){
            var payload = {};
            payload["title"] = title;
            payload["desc"] = desc;
            payload["episode_index"] = episode_index;
            this.desc_obj = payload;
            this.showDialog = true;
        },

        clear_Desc_Data:function(){
            this.desc_obj = {};
            this.showDialog = false;
        },
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

.md-dialog{
    border-radius: 1em;
}
 

 ul{
     list-style: none;
     padding-right: 1em;
 }
 
/*
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
 }*/
    
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


