<template>
    <div>
        <podcast-info :podcast_data="podcast_config"></podcast-info>
        <podcast-episodes @play_episode="play"
        :error="network_error" :search_podcast="false"
        :podcast_episodes="feed_data" :podcast_data="podcast_config" ref="child_podcast_episodes" @refresh="get_Feed_Data" @change_Order="change_Order"></podcast-episodes>
        
    </div>
</template>

<script>
import {mapGetters,mapMutations,mapActions} from 'vuex'
import {ipcRenderer} from 'electron';

export default {
    name:"podcast",
    data(){
        return{
            podcast_config:"",
            feed_data:[],
            network_error:false,
            
            
            
            
            
            
        }
    },



    

    

    



        
    

    components:{
        "podcast-info":require("@/components/Podcast-Info").default,
        "podcast-episodes":require("@/components/Podcast-Episodes").default
    },


    beforeRouteLeave:function(to,from,next){
        console.log(to);
        this.$refs.child_podcast_episodes.cleanUpFeed_Data();
        next();
    },

    methods:{
    

        change_Order:function(){
            this.$store.commit('Change_Episode_Order',this.$route.params.id);
            
        },

        get_Feed_Data:async function(url){
            
            this.network_error = false;
            
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

            var data = {};
            data["id"] = this.$route.params.id;
            data["data"] = episodes;

            

            this.$store.commit('setPodcastFeed',data);
            

                
                
            });



        },

        play:function(payload){
            this.$store.commit("set_Audio_Data",payload);
        }

        
    },

    

    

    

    created:function(){
      var id =this.$route.params.id;
      var config = this.$store.getters.getConfigAll;
     
      

      config.forEach((feed)=>{
          if(feed.id == id){
              this.podcast_config = feed;

          }
      });

    


      var result = this.$store.getters.get_Feed_Data_By_Id(this.$route.params.id);
        console.log(result.data);
        if(result.data.length == 0){
            this.get_Feed_Data(this.podcast_config.url);
        }
        
        else{
            this.feed_data = result.data;
        }

     
   
    }

    

    

    
}
</script>


<style scoped>

</style>


