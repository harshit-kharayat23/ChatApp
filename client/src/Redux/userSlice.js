import { createSlice } from "@reduxjs/toolkit";


const userSlice=createSlice({
        name:"user",
        initialState:{
            userData:null,
            otherUsers:null,
            selectedUser:null,
            webSocket:null,
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
             setSocket:(state,action)=>{
                state.webSocket=action.payload;
            },
             setOnlineUsers:(state,action)=>{
                
                state.onlineUsers = action.payload;
            },

        }

})

export const {addUser,addOtherUsers,setSelectedUser,setSocket,setOnlineUsers} =userSlice.actions;
export default userSlice.reducer;