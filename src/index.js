import {run} from "./modules/getMetrics";
import {addResultToTable, formatDate} from "./modules/helper";

let api_url = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
let input_url = document.querySelector("input[name='url']");
let form_elem = document.getElementById('test_url');
let progress_bar = document.getElementById('progress-bar-wrapper');
let today = new Date();
let urlToTest;
let metrics;
let dataStorage = localStorage;


let parseDataToStore = (data) => {
    return JSON.stringify(data);
}

let readDataFromStorage = (data) => {
    return JSON.parse(data);
}

let storeMetrics = (metrics) => {
    if (metrics.desktopMetrics) dataStorage.setItem('desktopMetrics', parseDataToStore(metrics.desktopMetrics));
    if (metrics.mobileMetrics) dataStorage.setItem('mobileMetrics', parseDataToStore(metrics.mobileMetrics));
}

let getPreviousData = () => {
    let previousDataExist = true;
    for (let i = 0; i < dataStorage.length; i++) {
        if (dataStorage.key(i) === 'mobileMetrics' || dataStorage.key(i) === 'desktopMetrics') {
            previousDataExist = true;
        } else {
            previousDataExist = false;
        }
    }

    if (previousDataExist) {
        let desktopMetrics = readDataFromStorage(dataStorage.getItem('mobileMetrics'));
        let mobileMetrics = readDataFromStorage(dataStorage.getItem('desktopMetrics'));

        for (let date in desktopMetrics) {
            if (date !== formatDate(today) && Date.parse(date) < today) {
                addResultToTable(desktopMetrics, mobileMetrics, date);
            }
        }
    }
}

getPreviousData();

form_elem.addEventListener('submit', async (e) => {

    e.preventDefault();
    // Show progress bar
    progress_bar.classList.remove('d-none');
    urlToTest = input_url.value;

    if (urlToTest) {
        metrics = await run(api_url, process.env.API_KEY, urlToTest, formatDate(today));
        // Hide progress bar
        progress_bar.classList.add('d-none');
    }

    // If metrics don't exist, we store them
    if (dataStorage.getItem('desktopMetrics') === null && dataStorage.getItem('mobileMetrics') === null) {
        storeMetrics(metrics);
    } else { // If previous metrics exist but are earlier than today, we store new metrics

        let desktopMetrics = readDataFromStorage(dataStorage.getItem('desktopMetrics'));
        let mobileMetrics = readDataFromStorage(dataStorage.getItem('mobileMetrics'));

        for (let date in desktopMetrics) {
            console.log(date);
            if (!isNaN(Date.parse(date))) {
                //if (Date.parse(date) < today) {
                    storeMetrics(metrics);
                    addResultToTable(desktopMetrics, mobileMetrics, date);

                //}
            }
        }
    }

});
