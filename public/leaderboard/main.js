
//token

document.addEventListener('DOMContentLoaded',showLeaderBoard);

const leaderboard_table = document.getElementById("leaderboard-table-body");


//SHOW LEADERBOARD
async function showLeaderBoard() {

    const token = localStorage.getItem('token');
    // console.log(token);
    const result = await axios.get("http://3.88.62.108:3000/showleaderboard", { headers: { "Auth": token } })

    // console.log(result.data);

    

    for (let i in result.data) {

        let newRow;

        if (result.data[i].totalExpenses == null) {


            newRow = `<tr id=${result.data[i].id}  
             class="list-group-item odd:bg-white even:bg-[#799e9b] text-[#154e49] font-semibold  border-b"> 
              <td class="px-6 py-3">
                    ${Number(i)+1} </td> 
                    <td class="px-6 py-3">
                    ${result.data[i].name} </td> 
                    <td class="px-6 py-4">0</td> 
                    </tr>`;


        }
        else {
            newRow = `<tr id=${result.data[i].id}  
                class="list-group-item odd:bg-white even:bg-[#799e9b] text-[#154e49] font-semibold  border-b"> 
                 <td class="px-6 py-3">
                       ${Number(i)+1} </td> 
                       <td class="px-6 py-3">
                       ${result.data[i].name} </td> 
                       <td class="px-6 py-4">${result.data[i].totalExpenses} </td> 
                       </tr>`;

        }

        leaderboard_table.insertAdjacentHTML('beforeend', newRow);
    }


}


