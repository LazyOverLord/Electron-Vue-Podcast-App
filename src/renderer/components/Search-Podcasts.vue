<template>
    <div>
        <p> Enter search terms</p>
        <input v-model="search_term"/>
        <button @click="search()"> Search</button>

        <router-link to="/"> Go Home </router-link>

        <p> Results </p>

        <div v-if="searching == true && no_result == false">
            <p> Loading Search Results </p>
        </div>
        
        <div v-if="search_data.length!=0">
            <ol>
                <li v-for="(result,i) in search_data">
                    <p> {{result.collectionName}}</p>
                    <img class="size" :src="result.artworkUrl600"/>
                    <!--<p>{{result.feedUrl}}</p>-->
                    <p> The genres are </p>
                    <p  v-for="genre in result.genres">{{genre}}</p>

                    <button @click="Add_Feed(result.collectionName,result.feedUrl,result.artworkUrl600)"> Add Feed </button>
                    <router-link :to="`/view-result/${i}`"> Go to Page </router-link>
                </li>
            </ol>

        </div>

        <div v-if="no_result == true">
            <p> No results for the term {{no_result_term}}</p>
        </div>

    </div>
</template>

<script>
import axios from 'axios';
import {ipcRenderer} from 'electron';
import {mapGetters} from 'vuex'

export default {
    name:"search_podcast",
    data(){
        return{
            search_term:"",
            search_data:"",
            no_result:false,
            no_result_term:"",
            searching:false,
            feed_add_error:false
           
        }
    },

    methods:{
        search:function(){
            if(this.search_term.length != 0){

                var split_search = this.search_term.split(' ');
                var final_search = "";
                split_search.forEach((item)=>{
                    final_search+="+"+item;
                });
                

                this.search_data = "";
                this.searching  == true;
                axios.get("https://itunes.apple.com/search?term="+final_search+"&entity=podcast")
                .then((response)=>{
                    if(response.data.results.length == 0){
                        this.no_result = true;
                        this.no_result_term = final_search.replace('+',' ');
                        this.searching = false;
                    } else{
                        this.search_data = response.data.results;
                        this.no_result = false;
                        this.no_result_term = "";
                        this.searching = false;

                        var data = {};
                        data["search_term"] = this.search_term ;
                        data["results"] = response.data.results;
                        this.$store.commit("set_Search_Results_Cache",data);
                    }
                })
            
            }
            
            
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
                console.log("The feed is already added");
            }
        }
    },

    

    mounted:function(){
        var search_results_cache =this.$store.getters.get_Search_Results_Cache;
        if(search_results_cache.results.length !=0){
            this.search_data = search_results_cache.results;
        }
    }


    
}
</script>


<style scoped>

    
    .size {
        width:150px;
        height:150px;
    }

    


    

    
</style>


