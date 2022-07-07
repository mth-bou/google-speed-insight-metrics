import {run, setUpQuery} from "./modules/getMetrics";
import {isCoreWebVitalsPassed, formatDate, addResultToTable} from "./modules/helper";

let api_url = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
let input_url = document.querySelector("input[name='url']");
let form_elem = document.getElementById('test_url');
let progress_bar = document.getElementById('progress-bar-wrapper');
let today = new Date();
let urlToTest;
let metrics;
let isPassed;
let dataStorage = localStorage;

let parseDataToStore = (data) => {
    return JSON.stringify(data);
}

let readDataFromStorage = (data) => {
    return JSON.parse(data);
}

let storeMetrics = (metrics) => {
    if (metrics.desktopMetrics) dataStorage.setItem(formatDate(today) + '-desktopMetrics', parseDataToStore(metrics.desktopMetrics));
    if (metrics.mobileMetrics) dataStorage.setItem(formatDate(today) + '-mobileMetrics', parseDataToStore(metrics.mobileMetrics));
}

form_elem.addEventListener('submit', async (e) => {

    e.preventDefault();
    // Show progress bar
    progress_bar.classList.remove('d-none');
    urlToTest = input_url.value;

    if (urlToTest) {
        metrics = await run(api_url, process.env.API_KEY, urlToTest);
        // Hide progress bar
        progress_bar.classList.add('d-none');
        isPassed = isCoreWebVitalsPassed(metrics);
    }

    if (dataStorage.getItem(formatDate(today) + '-desktopMetrics') === null &&
        dataStorage.getItem(formatDate(today) + '-mobileMetrics') === null) {

        storeMetrics(metrics);

        if (isPassed.isDesktopPassed) {
            dataStorage.setItem(formatDate(today) + '-desktopCoreWebVitalsPassed', 'Succès');
        } else {
            dataStorage.setItem(formatDate(today) + '-desktopCoreWebVitalsPassed', 'Echec');
        }

        if (isPassed.isMobilePassed) {
            dataStorage.setItem(formatDate(today) + '-mobileCoreWebVitalsPassed', 'Succès');
        } else {
            dataStorage.setItem(formatDate(today) + '-mobileCoreWebVitalsPassed', 'Echec');
        }

    }

    let desktopCoreWebVitals = dataStorage.getItem(formatDate(today) + '-desktopCoreWebVitalsPassed');
    let mobileCoreWebVitals = dataStorage.getItem(formatDate(today) + '-mobileCoreWebVitalsPassed');
    let desktopMetrics = readDataFromStorage(dataStorage.getItem(formatDate(today) + '-desktopMetrics'));
    let mobileMetrics = readDataFromStorage(dataStorage.getItem(formatDate(today) + '-mobileMetrics'));

    addResultToTable(desktopMetrics, mobileMetrics, desktopCoreWebVitals, mobileCoreWebVitals, formatDate(today));

});
