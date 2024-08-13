const date = document.getElementById("date");
const month = document.getElementById("month");
const year = document.getElementById("year");

const dateDiv = document.getElementById('date-report-div');
const monthDiv = document.getElementById('month-report-div');
const yearDiv = document.getElementById('year-report-div');

const dateTable = document.getElementById('date-report');
const monthTable = document.getElementById('month-report');
const yearTable = document.getElementById('year-report');
const downloadsTable = document.getElementById('downloads-table');

const date_form = document.getElementById("date-form");
const month_form = document.getElementById("month-form");
const year_form = document.getElementById("year-form");

const date_download_btn = document.getElementById("date-download-btn");
const month_download_btn = document.getElementById("month-download-btn");
const year_download_btn = document.getElementById("year-download-btn");

const noDateRecords = document.getElementById('noDateRecords');
const noMonthRecords = document.getElementById('noMonthRecords');
const noYearRecords = document.getElementById('noYearRecords');
const noDownloadedRecords = document.getElementById('noDownloadedRecords');

date_form.addEventListener('submit', showDateReport);
month_form.addEventListener('submit', showMonthReport);
year_form.addEventListener('submit', showYearReport);
date_download_btn.addEventListener('click', downlodReport);
month_download_btn.addEventListener('click', downloadMonthReport);
year_download_btn.addEventListener('click', downloadYearReport);

const tabs = document.querySelectorAll('[role="tab"]');

//event for all tabs
tabs.forEach(tab => {
    tab.addEventListener('click', handleTabClick);
});

//data should go away when tabs changed
function handleTabClick(e) {
    dateDiv.hidden = true;
    monthDiv.hidden = true;
    yearDiv.hidden = true;
}



//token
const token = localStorage.getItem('token');

//values will be stored to download 
let dateVal;
let monthVal;
let yearVal;

//DATE REPORT
async function showDateReport(e) {
    e.preventDefault();
    dateVal = date.value;
    const expenses = await axios.get(`http://localhost:3000/get-report/${date.value}`, { headers: { 'Auth': token } });
    date_form.reset();

    // console.log(expenses.data.length);

    dateDiv.hidden = false;
    document.getElementById('date-table-body').innerHTML = " ";

    if (expenses.data.length == 0) {
        noDateRecords.hidden = false;
        dateTable.hidden = true;
        date_download_btn.hidden = true;
    }
    else {
        noDateRecords.hidden = true;
        dateTable.hidden = false;
        date_download_btn.hidden = false;

        for (let e in expenses.data) {
            showOnScreen(expenses.data[e], dateTable);
        }
    }
}


//MONTH REPORT
async function showMonthReport(e) {
    e.preventDefault();
    console.log(month.value);
    monthVal = month.value;
    const expenses = await axios.get(`http://localhost:3000/get-monthReport?month=${month.value.split('-')[1]}&year=${month.value.split('-')[0]} `, { headers: { 'Auth': token } });

    month_form.reset();
    console.log(expenses.data);

    monthDiv.hidden = false;
    document.getElementById('month-table-body').innerHTML = " ";

    if (expenses.data.length == 0) {
        noMonthRecords.hidden = false;
        monthTable.hidden = true;
        month_download_btn.hidden = true;
    }
    else {
        noMonthRecords.hidden = true;
        monthTable.hidden = false;
        month_download_btn.hidden = false;

        for (let e in expenses.data) {
            showOnScreen(expenses.data[e], monthTable);
        }
    }
}


//YEAR REPORT
async function showYearReport(e) {
    e.preventDefault();
    yearVal = year.value;
    const expenses = await axios.get(`http://localhost:3000/get-yearReport/${year.value} `, { headers: { 'Auth': token } });

    year_form.reset();
    console.log(expenses.data);

    yearDiv.hidden = false;
    document.getElementById('year-table-body').innerHTML = " ";

    if (expenses.data.length == 0) {
        noYearRecords.hidden = false;
        yearTable.hidden = true;
        year_download_btn.hidden = true;
    }
    else {
        noYearRecords.hidden = true;
        yearTable.hidden = false;
        year_download_btn.hidden = false;

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



//DOWNLOAD DATE REPORTS
async function downlodReport(e) {

    const res = await axios.get(`http://localhost:3000/download-report/${dateVal}`, { headers: { 'Auth': token } });

    if (res.status == 200) {
        var a = document.createElement('a');
        a.href = res.data.fileURL;
        a.download = 'MyExpenses.txt';
        a.click();
    }
    else {
        alert('Someting went wrong');
    }

}

//DOWNLOAD MONTH REPORTS
async function downloadMonthReport(e) {

    const res = await axios.get(`http://localhost:3000/download-monthReport?month=${monthVal.split('-')[1]}&year=${monthVal.split('-')[0]} `, { headers: { 'Auth': token } });

    if (res.status == 200) {
        var a = document.createElement('a');
        a.href = res.data.fileURL;
        a.download = 'MyMonthlyExpenses.csv';
        a.click();
    }
    else {
        alert('Someting went wrong');
    }


}

//DOWNLOAD YEAR REPORTS
async function downloadYearReport(e) {

    const res = await axios.get(`http://localhost:3000/download-yearReport/${yearVal} `, { headers: { 'Auth': token } });

    if (res.status == 200) {
        var a = document.createElement('a');
        a.href = res.data.fileURL;
        a.download = 'MyYearlyExpenses.csv';
        a.click();
    }
    else {
        alert('Someting went wrong');
    }

}


//SHOW DOWNLOADED FILES

async function showDownloadedFiles(e) {

    const files = await axios.get(`http://localhost:3000/showDownloads`, { headers: { 'Auth': token } });

    console.log(files)

    document.getElementById('downloads-table-body').innerHTML = " ";

    if (files.data.length == 0) {
        noDownloadedRecords.hidden = false;
        downloadsTable.hidden = true;

    }
    else {
        noDownloadedRecords.hidden = true;
        downloadsTable.hidden = false;

        

        for (let f in files.data) {
            const newRow = `<tr id=${files.data[f].id}  class="list-group-item odd:bg-white even:bg-[#799e9b] text-[#154e49] font-semibold  border-b">
                            <td class="px-6 py-4">${files.data[f].date} </td> 
                            <td class="px-6 py-4"><a href='${files.data[f].fileURL}' class='hover:text-blue-600 underline'>LINK</a></td> 
                            
                            </tr>`;

            downloadsTable.getElementsByTagName('tbody')[0].insertAdjacentHTML('beforeend', newRow);
        }

    }
}