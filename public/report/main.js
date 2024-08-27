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

const download_pagination = document.getElementById('download-pagination');
const date_pagination=document.getElementById('date-pagination');
const month_pagination=document.getElementById('month-pagination');
const year_pagination=document.getElementById('year-pagination');

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

//ROWS PER PAGE
const rowsPerPage = localStorage.getItem('rowsPerPage');

//PAGE
const page = 1;
const rowsperpage = localStorage.getItem('rowsPerPage');

//values will be stored to download 
let dateVal;
let monthVal;
let yearVal;

//SHOW DATE REPORT
async function showDateReport(e) {
    e.preventDefault();
    dateVal = date.value;
    await dateReport(dateVal,page,rowsperpage);
    date_form.reset();

    // console.log(expenses.data.length);
    
}

//DATE REPORT
async function dateReport(dateVal,page,rowsperpage){

    const expenses = await axios.get(`http://3.88.62.108:3000/get-report/${dateVal}?page=${page}&limit=${rowsperpage}`, { headers: { 'Auth': token } });
    
    // console.log(expenses.data.expenses);
    // console.log(expenses.data.pageData);

    dateDiv.hidden = false;
    document.getElementById('date-table-body').innerHTML = " ";
    date_pagination.innerHTML='';

    if (expenses.data.expenses.length == 0) {
        noDateRecords.hidden = false;
        dateTable.hidden = true;
        date_download_btn.hidden = true;
    }
    else {

        noDateRecords.hidden = true;
        dateTable.hidden = false;
        date_download_btn.hidden = false;

        for (let e in expenses.data.expenses) {
            showOnScreen(expenses.data.expenses[e], dateTable);
        }

        showPagination(expenses.data.pageData,1);
    }
}


//SHOW MONTH REPORT
async function showMonthReport(e) {
    e.preventDefault();
    // console.log(month.value);
    monthVal = month.value;

    await monthReport(monthVal,page,rowsperpage);
    month_form.reset();
    
}

//MONTH REPORT
async function monthReport(monthVal,page,rowsperpage) {

    const expenses = await axios.get(`http://3.88.62.108:3000/get-monthReport?month=${monthVal.split('-')[1]}&year=${monthVal.split('-')[0]}&page=${page}&limit=${rowsperpage} `, { headers: { 'Auth': token } });

    
    // console.log(expenses.data.expenses);

    monthDiv.hidden = false;
    document.getElementById('month-table-body').innerHTML = " ";
    month_pagination.innerHTML='';

    if (expenses.data.expenses.length == 0) {
        noMonthRecords.hidden = false;
        monthTable.hidden = true;
        month_download_btn.hidden = true;
        
    }
    else {
        noMonthRecords.hidden = true;
        monthTable.hidden = false;
        month_download_btn.hidden = false;

        for (let e in expenses.data.expenses) {
            showOnScreen(expenses.data.expenses[e], monthTable);
        }

        showPagination(expenses.data.pageData,2);
    }
}


//SHOW YEAR REPORT
async function showYearReport(e) {
    e.preventDefault();
    yearVal = year.value;
    await yearReport(yearVal,page,rowsperpage);
    year_form.reset();

}

//YEAR REPORT
async function yearReport(yearVal,page,rowsperpage) {

    const expenses = await axios.get(`http://3.88.62.108:3000/get-yearReport/${yearVal}?page=${page}&limit=${rowsperpage} `, { headers: { 'Auth': token } });

    
    // console.log(expenses.data.expenses);

    yearDiv.hidden = false;
    document.getElementById('year-table-body').innerHTML = " ";
    year_pagination.innerHTML='';

    if (expenses.data.expenses.length == 0) {
        noYearRecords.hidden = false;
        yearTable.hidden = true;
        year_download_btn.hidden = true;
        
    }
    else {
        noYearRecords.hidden = true;
        yearTable.hidden = false;
        year_download_btn.hidden = false;

        for (let e in expenses.data.expenses) {
            showOnScreen(expenses.data.expenses[e], yearTable);
        }

        showPagination(expenses.data.pageData,3);
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

    const res = await axios.get(`http://3.88.62.108:3000/download-report/${dateVal}`, { headers: { 'Auth': token } });

    // console.log
    if (res.status == 200) {
        var a = document.createElement('a');
        a.href = res.data.fileURL;
        a.click();
    }
    else {
        alert('Someting went wrong');
    }

}

//DOWNLOAD MONTH REPORTS
async function downloadMonthReport(e) {

    const res = await axios.get(`http://3.88.62.108:3000/download-monthReport?month=${monthVal.split('-')[1]}&year=${monthVal.split('-')[0]} `, { headers: { 'Auth': token } });

    if (res.status == 200) {
        var a = document.createElement('a');
        a.href = res.data.fileURL;
        a.click();
    }
    else {
        alert('Someting went wrong');
    }


}

//DOWNLOAD YEAR REPORTS
async function downloadYearReport(e) {

    const res = await axios.get(`http://3.88.62.108:3000/download-yearReport/${yearVal} `, { headers: { 'Auth': token } });

    if (res.status == 200) {
        var a = document.createElement('a');
        a.href = res.data.fileURL;
        a.click();
    }
    else {
        alert('Someting went wrong');
    }

}



//SHOW DOWNLOADED FILES
async function showDownloadedFiles() {

    await downloadedFiles(page,rowsperpage);
    
}

//DOWNLOADED FILES
async function downloadedFiles(page,rowsperpage) {
    
    const files = await axios.get(`http://3.88.62.108:3000/showDownloads?page=${page}&limit=${rowsperpage}`, { headers: { 'Auth': token } });

    // console.log(files.data.downloads);

   

    document.getElementById('downloads-table-body').innerHTML = " ";
    download_pagination.innerHTML='';

    if (files.data.downloads.length == 0) {
        noDownloadedRecords.hidden = false;
        downloadsTable.hidden = true;

    }
    else {
        noDownloadedRecords.hidden = true;
        downloadsTable.hidden = false;



        for (let f in files.data.downloads) {
            const newRow = `<tr id=${files.data.downloads[f].id}  class="list-group-item odd:bg-white even:bg-[#799e9b] text-[#154e49] font-semibold  border-b">
                            <td class="px-6 py-4">${files.data.downloads[f].date} </td> 
                            <td class="px-6 py-4"><a href='${files.data.downloads[f].fileURL}' class='hover:text-[#FBB04B] underline'>LINK</a></td> 
                            
                            </tr>`;

            downloadsTable.getElementsByTagName('tbody')[0].insertAdjacentHTML('beforeend', newRow);
        }

        showPagination(files.data.pageData,4);

    }

}

//SHOW DOWNLOAD PAGINATION

function showPagination(pageData,flag) {

    // console.log("pageData", pageData);

    const rowsperpage = localStorage.getItem('rowsPerPage');


     
  
    //PREVIOUS PAGE
    if (pageData.hasPreviousPage) {
        // console.log(pageData.hasPreviousPage);
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = `<svg class="w-3.5 h-3.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
                                          </svg>
                                       `;
        prevBtn.setAttribute('id', pageData.previousPage);
        prevBtn.classList.add('px-2','mx-1', 'h-8', 'text-sm', 'font-medium', 'text-white', 'bg-[#154e49]', 'hover:text-[#FBB04B]', 'hover:underline', 'hover:scale-125', 'rounded-full');
        

        switch(flag){
            case 1:
                    prevBtn.addEventListener('click', () => dateReport(dateVal,pageData.previousPage,rowsperpage));
                    date_pagination.appendChild(prevBtn);
                    break;
            case 2:
                    prevBtn.addEventListener('click', () => monthReport(monthVal,pageData.previousPage,rowsperpage));
                    month_pagination.appendChild(prevBtn);
                    break;
            case 3:
                    prevBtn.addEventListener('click', () => yearReport(yearVal,pageData.previousPage,rowsperpage));
                    year_pagination.appendChild(prevBtn);
                    break;
            case 4: 
                    prevBtn.addEventListener('click', () => downloadedFiles(pageData.previousPage,rowsperpage));
                    download_pagination.appendChild(prevBtn);
                    break;
            
        }
        

    }

    //CURRENT PAGE
    const currentBtn = document.createElement('button');
    currentBtn.innerHTML = pageData.currentPage;
    currentBtn.setAttribute('id', pageData.currentPage);
    currentBtn.classList.add('px-3', 'h-8','text-sm', 'font-medium', 'text-white', 'bg-[#154e49]', 'hover:text-[#FBB04B]', 'hover:underline', 'hover:scale-125', 'rounded-full');

    switch(flag){
        case 1:
                currentBtn.addEventListener('click', () => dateReport(dateVal,pageData.currentPage, rowsperpage));
                date_pagination.appendChild(currentBtn);
                break;
        case 2:
                currentBtn.addEventListener('click', () => monthReport(monthVal,pageData.currentPage, rowsperpage));
                month_pagination.appendChild(currentBtn);
                break;
        case 3:
                currentBtn.addEventListener('click', () => yearReport(yearVal,pageData.currentPage, rowsperpage));
                year_pagination.appendChild(currentBtn);
                break;
        case 4: 
                currentBtn.addEventListener('click', () => downloadedFiles(pageData.currentPage, rowsperpage));
                download_pagination.appendChild(currentBtn);
                break;
        
    }
    


    //NEXT PAGE
    if (pageData.hasNextPage) {

        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = `<svg class="w-3.5 h-3.5  rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                          </svg>`;
        nextBtn.setAttribute('id', pageData.nextPage);
        nextBtn.classList.add('px-2','mx-1', 'h-8', 'text-sm', 'font-medium', 'text-white', 'bg-[#154e49]', 'hover:text-[#FBB04B]', 'hover:underline', 'hover:scale-125', 'rounded-full');

        switch(flag){
            case 1:
                    nextBtn.addEventListener('click', () => dateReport(dateVal,pageData.nextPage, rowsperpage));
                    date_pagination.appendChild(nextBtn);
                    break;
            case 2:
                    nextBtn.addEventListener('click', () => monthReport(monthVal,pageData.nextPage, rowsperpage));
                    month_pagination.appendChild(nextBtn);
                    break;
            case 3:
                    nextBtn.addEventListener('click', () => yearReport(yearVal,pageData.nextPage, rowsperpage));
                    year_pagination.appendChild(nextBtn);
                    break;
            case 4: 
                    nextBtn.addEventListener('click', () => downloadedFiles(pageData.nextPage, rowsperpage));
                    download_pagination.appendChild(nextBtn);
                    break;
            
        }
       
    }


    //LAST PAGE
    if (pageData.nextPage != pageData.lastPage && pageData.currentPage != pageData.lastPage) {

        const dotsBtn = document.createElement('p');
        dotsBtn.innerHTML = '...';
        dotsBtn.classList.add('px-3', 'h-8', 'text-sm', 'font-medium', 'text-[#154e49]', 'bg-white');

        const lastBtn = document.createElement('button');
        lastBtn.innerHTML = pageData.lastPage;
        lastBtn.setAttribute('id', pageData.lastPage);

        lastBtn.classList.add('px-3', 'h-8', 'text-sm', 'font-medium', 'text-white', 'bg-[#154e49]', 'hover:text-[#FBB04B]', 'hover:underline', 'hover:scale-125', 'rounded-full');
        
        switch(flag){
            case 1:
                    lastBtn.addEventListener('click', () => dateReport(dateVal,pageData.lastPage,rowsperpage));
                    date_pagination.appendChild(dotsBtn);
                    date_pagination.appendChild(lastBtn);
                    break;
            case 2:
                    lastBtn.addEventListener('click', () => monthReport(monthVal,pageData.lastPage,rowsperpage));
                    month_pagination.appendChild(dotsBtn);
                    month_pagination.appendChild(lastBtn);
                    break;
            case 3:
                    lastBtn.addEventListener('click', () => yearReport(yearVal,pageData.lastPage,rowsperpage));
                    year_pagination.appendChild(dotsBtn);
                    year_pagination.appendChild(lastBtn);
                    break;
            case 4: 

                    lastBtn.addEventListener('click', () => downloadedFiles(pageData.lastPage,rowsperpage));
                    download_pagination.appendChild(dotsBtn);
                    download_pagination.appendChild(lastBtn);
                    break;
            
        }
        
    }

}



