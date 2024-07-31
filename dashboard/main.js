const amount = document.getElementById('amount');
const desc = document.getElementById('description');
const category = document.getElementById('category');
const Eul = document.getElementById('expenses-list');

const form = document.getElementById('add-expense-form');

form.addEventListener('submit', onSubmit);


document.addEventListener('DOMContentLoaded', DomLoad);

//DOMLOAD
async function DomLoad() {
    try{
        
            await getExpenses();
        
            // await showDownloadedFiles();

        }
        catch(err){
        console.log(err)
        }

}


//ADD EXPENSE
async function onSubmit(e) {
    e.preventDefault();

    if (amount.value == '' || desc.value == '') {
        msg.innerHTML = '<b>Please enter all fields</b>';

        setTimeout(() => {
            msg.removeChild(msg.firstChild);
        }, 2000);
    } 
    else {
        // const token=localStorage.getItem('token');
            try{
                expense={
                    amount:amount.value,
                    description:desc.value,
                    category:category.value
                };
                console.log(expense);
                let response= await axios.post("http://localhost:3000/add-expense/",expense);
                console.log(response.data.newExpense);
                // if(Eul.hidden){
                //     Eul.hidden=false;
                // }
                showOnScreen(response.data.newExpense);
                // showLeaderBoard();
                
            }
            catch(err){
                console.log(err);
            }

            form.reset();
        }
}


//get expenses
async function getExpenses(){
    try{

        // console.log(rowsperpage);

        
        // const token=localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/get-expenses');

        const expenses=res.data;
        console.log(res.data);

        // localStorage.setItem('ispremiumuser',res.data.ispremiumuser);

        // const ispremiumuser=localStorage.getItem('ispremiumuser');

        // console.log(ispremiumuser);

        // if(ispremiumuser!=null && ispremiumuser=='true'){
        //     document.querySelector('h6').hidden=false;
        //     leaderboard_button.hidden=false;
        //     rzp_button.hidden=true;
        // }

        if(expenses.length > 0){
            // Eul.hidden=false;
            // Eul.innerHTML='';
            // noofrows.hidden=false;

            for (let i in expenses) {
                showOnScreen(expenses[i]);
            }

            // PaginaitonList.hidden=false;
            // showPagination(res.data.expense_Data);
        }
        else{
          
            // ExpensesH5.hidden=false;
        } 

    }
    catch(err){

    }
}



//REMOVE EXPENSE
async function removeExpense(id) {
    try{
        
        // const token=localStorage.getItem('token');
        const data=await axios.delete(`http://localhost:3000/delete-expense/${id}`);
        document.getElementById(id).remove();
        // console.log(data);
        // if(Eul.empty){
        //     ExpensesH5.hidden=false;
        //     noofrows.hidden=true;
        // }
        // showLeaderBoard();
                                 
    }
    catch(err){
        console.log(err);
    }

}

//SHOW ADDED DATA ON SCREEN
function showOnScreen(obj){

   
    const newRow=`<tr id=${obj.id}  class="list-group-item odd:bg-white even:bg-[#799e9b] text-[#154e49] font-semibold  border-b""> 
    <td class="px-6 py-3">
    ${obj.category} </td> 
    <td class="px-6 py-4">${obj.amount} </td> 
    <td class="px-6 py-4">${obj.description}</td> 
    <td class="px-6 py-4"> <button class="w-fit text-white py-2 px-4 rounded-full bg-[#154e49] font-semibold  text-xs" onClick=removeExpense(${obj.id})>Delete</button> 
    </td>
    </tr>`;

    Eul.getElementsByTagName('tbody')[0].insertAdjacentHTML('beforeend', newRow);

    // Eul.innerHTML=Eul.innerHTML+child;
    // Eul.scrollIntoView();
}
