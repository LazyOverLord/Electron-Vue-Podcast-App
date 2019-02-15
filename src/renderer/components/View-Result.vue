<template>
    <div>
        <podcast-info :podcast_data="result_info"> </podcast-info>

        <router-link to="/podcast_search"> Go Back to search Page </router-link>

        <div v-if="feed_add_error == false">
        <button @click="Add_Feed(result_info.name,result_info.url,result_info.cover_path)"> Add Feed </button>

        </div>
        
        <div v-else>
            <p> Feed Already added </p>
        </div>

        <podcast-episodes @change_Order="change_Episode_Order" @refresh="get_Feed_Data" @play_episode="play"
        :podcast_data="result_info" :search_podcast="true"
        :error="network_error" :podcast_episodes="feed_data" > </podcast-episodes>
        
    </div>

</template>


<script>
import {ipcRenderer} from 'electron'
export default {
    name:"view_result",
    data(){
        return {
            result_info:"",
            feed_data:[],
            network_error:false,
            feed_add_error:false
        }
    },

    components:{
        "podcast-info":require("@/components/Podcast-Info").default,
        "podcast-episodes":require('@/components/Podcast-Episodes').default
        
    },

    methods:{
        get_Feed_Data:async function(url){
            
            this.network_error = false;
            this.feed_data = [];
            ipcRenderer.send('async_pull_feed',url);
            
            ipcRenderer.on("async_pull_feed_network_error",(event)=>{
                this.network_error = true;
            });

            ipcRenderer.on("async_pull_feed_res",(event,data)=>{
                var episodes = [];
                var parser = new DOMParser();
                var xml = parser.parseFromString(data,"text/xml");
                var channel = xml.getElementsByTagName("channel")[0];
                var main_title = channel.getElementsByTagName('title')[0].textContent;
                var check_image = channel.getElementsByTagName('image');
                var desc = channel.getElementsByTagName('description')[0].textContent;
    
      
                var image_url = "";
                if(check_image.length != 0){
                        image_url = check_image[0].getElementsByTagName('url')[0].textContent;
                    }
    
                if(image_url==""){
                        image_url = channel.getElementsByTagName("itunes:image")[0].getAttribute("href");
                    }
    
      
                var current_time = new Date();


    
                var items = channel.getElementsByTagName("item");
                for(var i =0;i<items.length;i++){
                    var temp = {};
                    var title = items[i].getElementsByTagName("title")[0].textContent;
                    var desc = items[i].getElementsByTagName("description")[0].textContent;
                    var enclosure = items[i].getElementsByTagName("enclosure")[0];
                    var url = enclosure.getAttribute("url");
                    temp["title"] = title;
                    temp["desc"] = desc;
                    temp["url"] = url;
                    episodes.push(temp);
                    }

            this.feed_data = episodes;

            

                
                
            });



        },

        change_Episode_Order:function(){
            this.feed_data.reverse();
        },

        play:function(payload){
            var episode_index = payload.episode_index;
            var episode = this.feed_data[episode_index];

            var data = {};
            data["title"] = episode.title;
            data["url"] = episode.url;
            data["cover_path"] = payload.cover_path;

            this.$store.commit('set_Audio_Data_Manual',data);

        },

        Add_Feed:function(name,url,cover_path){
            var current_feeds = this.$store.getters.getConfigAll;
            var matches = false;
            current_feeds.forEach((feed)=>{
                if(feed.url == url){
                    matches = true;
                }
            })
            
            if(matches == false){
                var temp_obj = {};
                temp_obj["name"] = name;
                temp_obj["url"] = url;
                temp_obj["cover_path"] = cover_path;

                this.$store.commit('add_Podcast_Feed',temp_obj);
            }
            else{
                this.feed_add_error = true;
            }
        }
    },

    mounted:function(){
        var id = this.$route.params.id;
        var search_results_cache = this.$store.getters.get_Search_Results_Cache;
        var result_data = search_results_cache.results[id];

        var result_info = {};
        result_info["name"] = result_data.collectionCensoredName;
        result_info["cover_path"] = result_data.artworkUrl600;
        result_info["url"] = result_data.feedUrl;

        this.result_info = result_info;

        this.get_Feed_Data(result_data.feedUrl);


        
    }
}
</script>


<style>

</style>


