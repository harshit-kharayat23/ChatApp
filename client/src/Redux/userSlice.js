import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
        name:"user",
        initialState:{
            loggedInUser:null,
            otherUsers:null,
        },


        reducers:{

            addUser:(state,action)=>{
                state.loggedInUser=action.payload
            },
            addOtherUsers:(state,action)=>{
                state.otherUsers=action.payload;
            }

        }

})

export const {addUser,addOtherUsers} =userSlice.actions;
export default userSlice.reducer;