export const formatMessageTime=(date)=>{

        return new Date(date).toLocaleTimeString('en-US',{
            hour:"2-digit",
            minute:"2-digit",
            hour12:false,
        })


}



export const BACKEND_URL = "https://chatapp-ofop.onrender.com"

