//SHOW LEADERBOARD
async function showLeaderBoard(){

    const token=localStorage.getItem('token');

    const result=await axios.get("http://localhost:3000/premium/showleaderboard",{headers:{"Authorization":token}})

    // console.log(result.data.result);

    LeaderBoardListDiv.hidden=false;
    
    leaderboard_list.innerHTML='';


    for(let i in result.data.result){
  
        let child;

        if(result.data.result[i].total_expense == null){
            child=`<li id=${result.data.result[i].id} class="list-group-item"> 
                    ${result.data.result[i].uname} - 0 
                    </li>`
        }
        else{
            // console.log(result.data.result[i].user);
            child=`<li id=${result.data.result[i].id} class="list-group-item"> 
                ${result.data.result[i].uname} - ${result.data.result[i].total_expense}  
                </li>`
        }

            leaderboard_list.innerHTML=leaderboard_list.innerHTML+child;
    }

    LeaderBoardListDiv.scrollIntoView();
    
}
