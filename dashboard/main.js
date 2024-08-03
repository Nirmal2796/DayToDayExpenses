const amount = document.getElementById('amount');
const desc = document.getElementById('description');
const category = document.getElementById('category');
const Eul = document.getElementById('expenses-list');
const EulDiv = document.getElementById('expenses-list-div');
const rzp_button=document.getElementById("buy-btn");
const noExpenseRecords=document.getElementById('noExpenseRecords');

const form = document.getElementById('add-expense-form');


form.addEventListener('submit', onSubmit);
rzp_button.addEventListener('click',buyPremium);

document.addEventListener('DOMContentLoaded', DomLoad);

//token
const token=localStorage.getItem('token');

//DECODE
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


//SHOW PREMIUM
function showPremium(){
    document.getElementById('premium_memb').classList.toggle('hidden');
    rzp_button.classList.toggle('hidden');
    document.getElementById("report-tab").removeEventListener('click',alertBuyPremium);
    document.getElementById("leaderboard-tab").removeEventListener('click',alertBuyPremium);
}


//noRecordsAvailable
function noRecordsAvailable(){
    EulDiv.classList.toggle('hidden');
    noExpenseRecords.classList.toggle('hidden');
}

//buyPremium alert
function alertBuyPremium(e){
    
        alert('Premium Feature!! Please Buy subscrition');
        e.preventDefault();
    
}


//DOMLOAD
async function DomLoad() {
    try{

        const decodedToken=parseJwt(token);

        if(decodedToken.ispremiumuser==true){
            showPremium();
        }
        else{
            document.getElementById("report-tab").addEventListener('click',alertBuyPremium);
            document.getElementById("leaderboard-tab").addEventListener('click',alertBuyPremium);
        }

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
        
            try{
                expense={
                    amount:amount.value,
                    description:desc.value,
                    category:category.value
                };
                console.log(expense);
                let response= await axios.post("http://localhost:3000/add-expense/",expense,{headers:{'Auth':token}});
                console.log(response.data.newExpense);
                if(EulDiv.classList.contains('hidden')){
                   noRecordsAvailable();
                }
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
        const res = await axios.get('http://localhost:3000/get-expenses',{headers:{'Auth':token}});

        const expenses=res.data;
        // console.log(res.data);


        if(expenses.length > 0){
            
            // noofrows.hidden=false;

            for (let i in expenses) {
                showOnScreen(expenses[i]);
            }

            // PaginaitonList.hidden=false;
            // showPagination(res.data.expense_Data);
        }
        else{
            EulDiv.classList.toggle('hidden');
            noExpenseRecords.classList.toggle('hidden');
        } 

    }
    catch(err){

    }
}



//REMOVE EXPENSE
async function removeExpense(id) {
    try{
        
        // const token=localStorage.getItem('token');
        const data=await axios.delete(`http://localhost:3000/delete-expense/${id}`,{headers:{'Auth':token}});
        document.getElementById(id).remove();
        // console.log(data);
        if(Eul.rows.length<=1){
            noRecordsAvailable();
        }
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


//BUY PREMIUM

async function buyPremium (e){


    // const token=localStorage.getItem('token');
    const res = await axios.get('http://localhost:3000/buypremium',{headers:{'Auth':token}});

    console.log(res.data.order.id);
    var options ={
        "key":res.data.key_id,
        "order_id":res.data.order.id,
        "handler": async function(res){
            const result=await axios.post('http://localhost:3000/updateTransactions',{
                order_id:options.order_id,
                payment_id:res.razorpay_payment_id,
                status:'successful'
            },{headers:{'Auth':token}});

        
            alert('You are a Premium User Now');
            showPremium();
            localStorage.setItem('token', result.data.token);
        },
        "retry":{
            enabled: false
        }   
    };
    
    var razorpayObject= new Razorpay(options);

    razorpayObject.on('payment.failed',async (res)=>{
        console.log(res);
        const result=await axios.post('http://localhost:3000/updateTransactions',{
            order_id:options.order_id,
            payment_id:res.razorpay_payment_id,
            status:'failed'
        },{headers:{'Auth':token}});

        alert('Something went wrong');
    });
    
    console.log(razorpayObject);
    razorpayObject.open();
    e.preventDefault();



}