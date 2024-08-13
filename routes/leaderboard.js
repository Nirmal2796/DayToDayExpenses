const express=require('express');

const router=express.Router();

const userAuthentication=require('../middleware/userAuthentication');

const leaderBoardController=require('../controller/leaderboard');


router.get('/showleaderboard',userAuthentication.authentication,leaderBoardController.getLeaderBoard);


module.exports=router;