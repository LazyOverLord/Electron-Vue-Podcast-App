<template>
    <md-empty-state
        md-rounded
        md-icon="headset"
        md-label="No Podcasts"
        md-description="You have'nt subscribed to any podcasts yet"
    >

    <router-link to="/">
        <md-button> Go Home </md-button>
    </router-link>
    


    </md-empty-state>
    
</template>

<script>
export default {
    name:"blank_test",
    data(){
        return{

        }
    }
}
</script>

<style scoped>

</style>


