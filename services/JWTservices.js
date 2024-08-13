const jwt=require('jsonwebtoken');

const generateToken=(id, ispremiumuser)=>{
    return jwt.sign({userId:id , ispremiumuser:ispremiumuser},'sdkjflk');
}


module.exports={
    generateToken
};