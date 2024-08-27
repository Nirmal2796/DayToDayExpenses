const amount = document.getElementById('amount');
const desc = document.getElementById('description');
const category = document.getElementById('category');
const Eul = document.getElementById('expenses-list');
const EulDiv = document.getElementById('expenses-list-div');
const rzp_button = document.getElementById("buy-btn");
const noExpenseRecords = document.getElementById('noExpenseRecords');
const rowsPerPage=document.getElementById('rowsPerPage');
const pagination = document.getElementById('pagination');
const rowsPerPageDiv=document.getElementById('rowsPerPage-div');


const form = document.getElementById('add-expense-form');


form.addEventListener('submit', onSubmit);
rzp_button.addEventListener('click', buyPremium);

document.addEventListener('DOMContentLoaded', DomLoad);

//PAGE
let lastPage=1;
let pageData;

//token
const token = localStorage.getItem('token');

//DECODE
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


//SHOW PREMIUM
function showPremium() {
    rzp_button.classList.toggle('hidden');
    document.getElementById('premium_memb').classList.toggle('hidden');
    document.getElementById("report-tab").removeEventListener('click', alertBuyPremium);
    document.getElementById("leaderboard-tab").removeEventListener('click', alertBuyPremium);
}


//rows per page
rowsPerPage.onchange=async()=>{
    localStorage.setItem('rowsPerPage',rowsPerPage.value)
    await getExpenses(1,0,rowsPerPage.value);
}

//noRecordsAvailable
function noRecordsAvailable() {
    EulDiv.classList.toggle('hidden');
    noExpenseRecords.classList.toggle('hidden');
    pagination.classList.toggle('hidden');
    rowsPerPageDiv.classList.toggle('hidden');
}

//buyPremium alert
function alertBuyPremium(e) {

    alert('Premium Feature!! Please Buy subscrition');
    e.preventDefault();

}


//DOMLOAD
async function DomLoad() {
    try {

        const page = 1;
        localStorage.setItem('rowsPerPage',rowsPerPage.value);
        const rowsperpage=localStorage.getItem('rowsPerPage');

        const decodedToken = parseJwt(token);

        if (decodedToken.ispremiumuser == true) {
            showPremium();
        }
        else {
            document.getElementById("report-tab").addEventListener('click', alertBuyPremium);
            document.getElementById("leaderboard-tab").addEventListener('click', alertBuyPremium);
        }

        await getExpenses(page, 0,rowsperpage);

        // await showDownloadedFiles();

    }
    catch (err) {
        console.log(err)
    }

}


//ADD EXPENSE
async function onSubmit(e) {
    e.preventDefault();

    if (amount.value == '' || desc.value == '' || category.value=='Select') {
        msg.innerHTML = '<b>Please enter all fields</b>';

        setTimeout(() => {
            msg.removeChild(msg.firstChild);
        }, 2000);
    }
    else {

        try {
            expense = {
                amount: amount.value,
                description: desc.value,
                category: category.value
            };
            // console.log(expense);
            let response = await axios.post("http://3.88.62.108:3000/add-expense/", expense, { headers: { 'Auth': token } });
            // console.log(response.data.newExpense);
            if (EulDiv.classList.contains('hidden')) {
                noRecordsAvailable();
            }
            // console.log(pageData);
            lastPage = pageData.lastPage;
            // console.log(lastPage);
            showPagination(pageData);
            showOnScreen(response.data.newExpense, 1);

            // showLeaderBoard();

        }
        catch (err) {
            console.log(err);
        }

        form.reset();
    }
}


//get expenses
async function getExpenses(page, flag,rowsPerPage) {
    try {


        // console.log(rowsperpage);


        // const token=localStorage.getItem('token');
        const res = await axios.get(`http://3.88.62.108:3000/get-expenses?page=${page}&limit=${rowsPerPage}`, { headers: { 'Auth': token } });

        const expenses = res.data.expenses;
        // console.log(res.data.expenses);
        lastPage = res.data.pageData.lastPage;
         pageData=res.data.pageData;

        if (expenses.length > 0) {


            document.getElementById('expenses-list-body').innerHTML = '';
            // noofrows.hidden=false;

            

            for (let i in expenses) {
                showOnScreen(expenses[i], flag);
            }

            EulDiv.classList.remove('hidden');

            showPagination(res.data.pageData);
        }
        else {
            // console.log(res.data.pageData);
            EulDiv.classList.toggle('hidden');
            noExpenseRecords.classList.toggle('hidden');
            rowsPerPageDiv.classList.toggle('hidden');
        }

    }
    catch (err) {

    }
}



//REMOVE EXPENSE
async function removeExpense(id) {
    try {

        // const token=localStorage.getItem('token');
        const data = await axios.delete(`http://3.88.62.108:3000/delete-expense/${id}`, { headers: { 'Auth': token } });
        document.getElementById(id).remove();
        // console.log(data);
        const rowsperpage=localStorage.getItem('rowsPerPage');
      
        // if()
        if (Eul.rows.length <= 1 && lastPage==1) {
            noRecordsAvailable();
        }
        else if(Eul.rows.length <= 1){
            getExpenses(1,0,rowsperpage);
        }
        // showLeaderBoard();

    }
    catch (err) {
        console.log(err);
    }

}

//SHOW ADDED DATA ON SCREEN
function showOnScreen(obj, flag) {

   
    if (flag == 1) {
        if(noExpenseRecords.classList.contains('hidden')){
            document.getElementById(lastPage).click();
        }
    }

    const newRow = `<tr id=${obj.id}  class="list-group-item odd:bg-white even:bg-[#799e9b] text-[#154e49] font-semibold  border-b""> 
    <td class="px-6 py-3">
    ${obj.category} </td> 
    <td class="px-6 py-4">${obj.amount} </td> 
    <td class="px-6 py-4">${obj.description}</td> 
    <td class="px-6 py-4"> <button class="w-fit text-white py-2 px-4 rounded-full bg-[#154e49] font-semibold  text-xs" onClick=removeExpense(${obj.id})>Delete</button> 
    </td>
    </tr>`;



    Eul.getElementsByTagName('tbody')[0].insertAdjacentHTML('beforeend', newRow);

}


//BUY PREMIUM

async function buyPremium(e) {


    // const token=localStorage.getItem('token');
    const res = await axios.get('http://3.88.62.108:3000/buypremium', { headers: { 'Auth': token } });

    var options = {
        "key": res.data.key_id,
        "order_id": res.data.order.id,
        "handler": async function (res) {

            // console.log(res);

            const result = await axios.post('http://3.88.62.108:3000/updateTransactions', {
                order_id: options.order_id,
                payment_id: res.razorpay_payment_id,
                status: 'successful'
            }, { headers: { 'Auth': token } });

            

            alert('You are a Premium User Now');
            showPremium();
            localStorage.setItem('token', result.data.token);
        },
        "retry": {
            enabled: false
        }
    };

    var razorpayObject = new Razorpay(options);

    razorpayObject.on('payment.failed', async (res) => {
        // console.log(res);
        const result = await axios.post('http://3.88.62.108:3000/updateTransactions', {
            order_id: options.order_id,
            payment_id: res.razorpay_payment_id,
            status: 'failed'
        }, { headers: { 'Auth': token } });

        alert('Something went wrong');
    });

    // console.log(razorpayObject);
    razorpayObject.open();
    e.preventDefault();

}




//SHOW PAGINATION

function showPagination(pageData) {

    // console.log("pageData", pageData);

    const rowsperpage=localStorage.getItem('rowsPerPage');
    

    pagination.innerHTML = '';

    pagination.hidden = false;

    lastPage=pageData.lastPage;

    // console.log(lastPage);

    if (pageData.hasPreviousPage) {

      
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = pageData.previousPage;
        prevBtn.setAttribute('id',pageData.previousPage);
        prevBtn.classList.add('px-3', 'h-8', 'text-sm', 'font-medium', 'text-white', 'bg-[#154e49]', 'hover:text-[#FBB04B]', 'hover:underline', 'hover:scale-125', 'rounded-full');
        // prevBtn.addEventListener('click',()=>getExpenses(pageData.previouePage,rowsperpage.value)); 

        prevBtn.addEventListener('click', () => getExpenses(pageData.previousPage,0,rowsperpage));

        // prevBtn.addEventListener('click',()=>getExpenses(pageData.previouePage,rowsperpage.value)); 

        pagination.appendChild(prevBtn);

    }

    const currentBtn = document.createElement('button');
    currentBtn.innerHTML = pageData.currentPage;
    currentBtn.setAttribute('id',pageData.currentPage);
    currentBtn.classList.add('px-3', 'h-8', 'text-sm', 'font-medium', 'text-white', 'bg-[#154e49]', 'hover:text-[#FBB04B]', 'hover:underline', 'hover:scale-125', 'rounded-full');
   
    currentBtn.addEventListener('click', () => getExpenses(pageData.currentPage,0,rowsperpage));

    pagination.appendChild(currentBtn);



    if (pageData.hasNextPage) {

        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = pageData.nextPage;
        nextBtn.setAttribute('id',pageData.nextPage);
        nextBtn.classList.add('px-3', 'h-8', 'text-sm', 'font-medium', 'text-white', 'bg-[#154e49]', 'hover:text-[#FBB04B]', 'hover:underline', 'hover:scale-125', 'rounded-full');

        nextBtn.addEventListener('click', () => getExpenses(pageData.nextPage,0,rowsperpage));

        pagination.appendChild(nextBtn);

    }


    if (pageData.nextPage != pageData.lastPage && pageData.currentPage != pageData.lastPage) {
        const dotsBtn = document.createElement('p');
        dotsBtn.innerHTML = '...';
        dotsBtn.classList.add('px-3', 'h-8', 'text-sm', 'font-medium', 'text-[#154e49]', 'bg-white');

        pagination.appendChild(dotsBtn);

        const lastBtn = document.createElement('button');
        lastBtn.innerHTML = pageData.lastPage;
        lastBtn.setAttribute('id', pageData.lastPage);

        lastBtn.classList.add('px-3', 'h-8', 'text-sm', 'font-medium', 'text-white', 'bg-[#154e49]', 'hover:text-[#FBB04B]', 'hover:underline', 'hover:scale-125', 'rounded-full');
        // prevBtn.addEventListener('click',()=>getExpenses(pageData.previouePage,rowsperpage.value)); 

        lastBtn.addEventListener('click', () => getExpenses(pageData.lastPage,0,rowsperpage));

        // prevBtn.addEventListener('click',()=>getExpenses(pageData.previouePage,rowsperpage.value)); 

        pagination.appendChild(lastBtn);
    }


}