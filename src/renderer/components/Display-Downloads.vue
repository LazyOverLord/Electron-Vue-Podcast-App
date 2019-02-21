<template>

    <div>
        <router-link to="/"> Go Home </router-link>

        <div v-if="download_que.length!=0">
            <p> Download Que </p>
            <ul>
                <li v-for="data in download_que">
                    <p> {{data.podcast_name}}</p>
                    <p> {{data.file_name}}</p>
                    <img :src="data.cover_path">
                </li>

            </ul>

        </div>
                    
        
        <div v-if="downloads.length!=0">
            <p> Downloads </p>
            <ul>
                <li v-for="data in downloads">
                    <p> {{data.episode_title}}</p>
                    <img :src="data.cover_path">
                    <p> The state of the download is {{data.download_state}}</p>
                    <p> The size of the files is {{data.file_size}}</p>
                    <p> Download percent is  {{data.amount_downloaded}}</p>
                    <button @click="resume_download()"> Play</button>
                    <button @click="pause_download()"> Pause</button>
                    <button @click="cancel_download(data)"> Cancel Download </button>
                

                </li>
            </ul>
        </div>

        <div v-if="local_downloads.length!=0">
            <p> Finished Downloads </p>
            <ul>
                <li v-for="data in local_downloads">
                    <p> {{data.podcast_name}}</p>
                    <img :src="data.cover_path">
                    <p> {{data.name}}</p>
                    <button @click="play_Local_Download(data.name,data.file_path,data.cover_path)"> Play </button>
                </li>
            </ul>

        </div>

        <div v-if="(downloads.length && local_downloads.length) == 0">
            <p> You have no downloads </p>
        </div>
        
        
    </div>
</template>


<script>
import {mapGetters} from "vuex"
import { ipcRenderer } from 'electron';
export default {
    name:"downloads",
    data(){
        return{
            current_download_amount:{}
        }
    },

    computed:{
        ...mapGetters({
            downloads:"get_Current_Download",
            download_que:"get_Download_Que",
            local_downloads:"get_Local_Downloads",
            
    })

    },

    beforeRouteLeave:function(to,from,next){
        this.$store.commit("remove_All_Local_Download_Items");
        next();
    },

    methods:{
        Download_Listener:async function (){
            ipcRenderer.on("async_download_page_update_download",(event,file_name,amount_downloaded)=>{

                var current_download = this.$store.getters.get_Current_Download;

                var file_size = current_download[0]["file_size"];

                var percent = amount_downloaded / file_size * 100;
                percent = Math.round(percent);
                var current_percent = current_download[0]["amount_downloaded"];

                if(percent!= current_download){
                    this.$store.commit('update_Current_Download_Download_Amount',percent);
                }

                
            });

            ipcRenderer.on("async_download_add_finish_item",(event,url_name)=>{
                this.downloads.forEach((download)=>{
                    if(download.url_title === url_name){
                        var file_path = "@/../downloads/"+download.podcast_name+"/"+download.title+'.mp3';      
                        var payload = {};               
                        payload["podcast_name"] = download.podcast_name;
                        payload["podcast_id"] = download.podcast_id;
                        payload["name"] = download.title;
                        payload["file_path"] = file_path;
                        payload["cover_path"] = download.podcast_cover;

                        
                        this.$store.commit("add_Local_Download_Item",payload);
                        this.$store.commit("remove_Download_Item",download.download_id);
                        
                    }
                })
            });


            

            ipcRenderer.on("async_download_cancel_ok",(event,download_item)=>{
                this.$store.commit("remove_Download_Item",download_item.download_id);
            });
            
        },

        cancel_download:function(download_item){
            ipcRenderer.send("async_download_cancel",download_item);
        },

        play_Local_Download:function(episode_title,file_path,cover_path){
            var payload = {};
            payload["title"] = episode_title;
            payload["url"] = file_path;
            payload["cover_path"] = cover_path;
            
            this.$store.commit("set_Audio_Data_Manual",payload);
        },

        pause_download:function(){
            ipcRenderer.send("async_download_pause");

        },

        resume_download:function(){
            ipcRenderer.send('async_download_resume');
        }

        
    },

    created:function(){
        var podcast_data = this.$store.getters.getConfigAll;
        var file_path = "@/../downloads";
        //ipcRenderer.send("async_get_local_downloads",podcast_data,file_path);
    },

    mounted:function(){
        var config_data = this.$store.getters.getConfigAll;

        this.Download_Listener();
        
}

}

</script>

<style scoped>
    img{
        width:200px;
        height:200px;
    }
</style>


