import { createSlice } from "@reduxjs/toolkit";


const userSlice=createSlice({
        name:"user",
        initialState:{
            userData:null,
            otherUsers:null,
            selectedUser:null,
            onlineUsers:[],
        
        },


        reducers:{

            addUser:(state,action)=>{
                state.userData=action.payload
            },
            addOtherUsers:(state,action)=>{
                state.otherUsers=action.payload;
            },
            setSelectedUser:(state,action)=>{
                state.selectedUser=action.payload;
            },
             setOnlineUsers:(state,action)=>{
                
                state.onlineUsers = action.payload;
            },
         
        }

})

export const {addUser,addOtherUsers,setSelectedUser,setSocket,setOnlineUsers,showProfile} =userSlice.actions;
export default userSlice.reducer;