<template>
    <div>
        
        <div v-if="audio!=undefined">
            <img :src="audio.cover_path">
            <p> {{audio.title}}</p>
            <audio controls autoplay :src="audio.url"></audio>
        </div>

        <div v-else>
            <audio src=""></audio>
        </div>

        


        
    </div>
</template>

<script>
import {mapGetters} from "vuex"
export default {
    name:"audio-player",
    data(){
        return{
            
        }
    },

    computed:{
        ...mapGetters({
            audio:"get_Audio_Data"
        })
    },

   

    
}
</script>



<style scoped>
    div{
        
        bottom:0px;
        height:75px;
        left:40px;
        right:40px;
        background-color:gray;
        border:.5em inset white;
        border-radius:.5em;
        text-align:center;
        opacity:.9;
    }
    
    img{
        float:left;
        height:75px;
        width:75px;
        padding-right:20px;
        
    }

    p{
        float:left;
        padding-right:20px;
    }

    audio{
        float:left;
        
        padding-top:10px;
    }
</style>


