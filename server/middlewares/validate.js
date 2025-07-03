import validator from "validator";

export const validateUser=(req)=>{
      const {emailId,password}=req.body;

      if(!validator.isEmail(emailId)){
        throw new Error("Invalid Email");
      }
      if(!validator.isStrongPassword(password)){
        throw new Error("Not a strong Password");
      }

      
}
