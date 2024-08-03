const date = document.getElementById("date");
const month = document.getElementById("month");
const year = document.getElementById("year");
const dateTable = document.getElementById('date-report');
const monthTable = document.getElementById('month-report');
const yearTable = document.getElementById('year-report');
const date_form = document.getElementById("date-form");
const month_form = document.getElementById("month-form");
const year_form = document.getElementById("year-form");



const noDateRecords = document.getElementById('noDateRecords');
const noMonthRecords = document.getElementById('noMonthRecords');
const noYearRecords = document.getElementById('noYearRecords');

date_form.addEventListener('submit', showDateReport);
month_form.addEventListener('submit', showMonthReport);
year_form.addEventListener('submit', showYearReport);

const tabs=document.querySelectorAll('[role="tab"]');

tabs.forEach(tab => { 
    tab.addEventListener('click', handleTabClick); 
  });


  function handleTabClick(e){
    dateTable.hidden = true;
    monthTable.hidden = true;
    yearTable.hidden=true;
  }



//token
const token = localStorage.getItem('token');



async function showDateReport(e) {
    e.preventDefault();
    const expenses = await axios.get(`http://localhost:3000/get-report/${date.value}`, { headers: { 'Auth': token } });
    date_form.reset();

    console.log(expenses.data.length);

    document.getElementById('date-table-body').innerHTML = " ";

    if (expenses.data.length == 0) {
        noDateRecords.hidden = false;
        dateTable.hidden = true;
    }
    else {
        noDateRecords.hidden = true;
        dateTable.hidden = false;
        for (let e in expenses.data) {
            showOnScreen(expenses.data[e], dateTable);
        }
    }
}


async function showMonthReport(e) {
    e.preventDefault();
    console.log(month.value)
    const expenses = await axios.get(`http://localhost:3000/get-monthReport?month=${month.value.split('-')[1]}&year=${month.value.split('-')[0]} `, { headers: { 'Auth': token } });

    month_form.reset();
    console.log(expenses.data);

    document.getElementById('month-table-body').innerHTML = " ";

    if (expenses.data.length == 0) {
        noMonthRecords.hidden = false;
        monthTable.hidden = true;
    }
    else {
        noMonthRecords.hidden = true;
        monthTable.hidden = false;   
        for (let e in expenses.data) {
            showOnScreen(expenses.data[e], monthTable);
        }
    }
}

async function showYearReport(e) {
    e.preventDefault();
    const expenses = await axios.get(`http://localhost:3000/get-yearReport/${year.value} `, { headers: { 'Auth': token } });

    year_form.reset();
    console.log(expenses.data);
    
    document.getElementById('year-table-body').innerHTML = " ";

    if (expenses.data.length == 0) {
        noYearRecords.hidden = false;
        yearTable.hidden = true;
    }
    else {
        noYearRecords.hidden = true;
        yearTable.hidden = false;
       
        for (let e in expenses.data) {
            showOnScreen(expenses.data[e], yearTable);
        }
    }

}



//SHOW ADDED DATA ON SCREEN
function showOnScreen(obj, table) {


    const newRow = `<tr id=${obj.id}  class="list-group-item odd:bg-white even:bg-[#799e9b] text-[#154e49] font-semibold  border-b"> 
    <td class="px-6 py-3">
    ${obj.category} </td> 
    <td class="px-6 py-4">${obj.amount} </td> 
    <td class="px-6 py-4">${obj.description}</td> 
    
    </tr>`;

    table.getElementsByTagName('tbody')[0].insertAdjacentHTML('beforeend', newRow);


}