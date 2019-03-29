



const state  = {
    user_name: "",
}



const getters = {
    get_User_Name(state,getters){
        return state.user_name;
    }
}


const mutations = {
    set_User_Name(state,user_name){
        state.user_name = user_name;

    }
}


const actions = {

}



export default {
    state,
    mutations,
    actions,
    getters,
    
  };

