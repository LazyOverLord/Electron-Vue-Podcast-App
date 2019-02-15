<template>
    <div>

        <router-link to="/"> Go Home </router-link>

        <div v-for=" feed in config_data">
            <p> {{feed.name}}</p>
            <img :src="feed.cover_path"/>
            <button @click="remove_Feed(feed.id,feed.name)"> Remove Feed </button>
            
        </div>
    </div>

</template>


<script>
import {mapGetters} from 'vuex'
import { ipcRenderer } from 'electron';
export default {
    name:"manage-feeds",
    data(){
        return {

        }
    },

    computed:{
        ...mapGetters({
            config_data:"getConfigAll"
        })
    },

    methods:{
        remove_Feed(feed_id,feed_name){
            this.$store.commit("remove_Podcast_Feed",feed_id);
            ipcRenderer.send("async_remove_download_podcast_folder",feed_name);
        }
    }
}
</script>


<style scoped>
    img{
        width:75px;
        height:75px;
        
    }
</style>

