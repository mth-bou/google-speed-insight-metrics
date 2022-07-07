import {formatDate} from "./helper";

async function run(apiUrl, apiKey, urlToTest) {
    //const today = formatDate(new Date());
    const url = setUpQuery(apiUrl, apiKey, urlToTest);
    const mobileUrl = url + '&strategy=MOBILE';
    let metrics = {};
    let desktopMetrics = {};
    let mobileMetrics = {};

    const desktopRequest = new Request(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const mobileRequest = new Request(mobileUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    const desktopResponse = await fetch(desktopRequest)
        .then(response => {
            return response;
        })
        .catch(error => console.log(error.message));

    /*const desktopReader = desktopResponse.body.getReader();
    const contentLength = desktopResponse.headers.get('Content-Length');

    let receivedLength = 0;
    let chunks = [];

    while (true) {
        const {done, value} = await desktopReader.read();

        if (done) {
            break;
        }

        chunks.push(value);
        receivedLength += value.length;

        console.log(`Reçu ${receivedLength}/${contentLength}`);
    }

    let chunksAll = new Uint8Array(receivedLength);
    let position = 0;

    for (let chunk of chunks) {
        chunksAll.set(chunk, position);
        position += chunk.length;
    }

    let result = new TextDecoder("utf-8").decode(chunksAll);
    desktopMetrics = JSON.parse(result);*/

    if (desktopResponse.ok) {
        let json = await desktopResponse.json();

        const coreWebVitalsMetrics = {
            LCP: json.loadingExperience.metrics.LARGEST_CONTENTFUL_PAINT_MS.category, // Mesure les performances de chargement. <= 2.5s est bon
            FCP: json.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category,
            FID: json.loadingExperience.metrics.FIRST_INPUT_DELAY_MS.category, // Mesure l'interactivité. <= 100ms est bon
            CLS: json.loadingExperience.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.category // Mesure la stabilité visuelle. <= 0.1s est bon.
        };

        const lighthouse = json.lighthouseResult;

        const lighthouseValues = {
            LCP: lighthouse.audits['largest-contentful-paint'].numericValue,
            FCP: lighthouse.audits['first-contentful-paint'].numericValue,
            FID: lighthouse.audits['max-potential-fid'].numericValue,
            CLS: lighthouse.audits['cumulative-layout-shift'].numericValue
        }

        desktopMetrics['url'] = json.id;
        desktopMetrics['coreWebVitalsMetrics'] = coreWebVitalsMetrics;
        desktopMetrics['lighthouseValues'] = lighthouseValues;

    } else {
        throw new Error(`Error ! status : ${desktopResponse.status}`);
    }

    const mobileResponse = await fetch(mobileRequest)
        .then(response => {
            return response;
        })
        .catch(error => console.log(error.message));

    if (mobileResponse.ok) {
        let json = await mobileResponse.json();

        const coreWebVitalsMetrics = {
            LCP: json.loadingExperience.metrics.LARGEST_CONTENTFUL_PAINT_MS.category, // Mesure les performances de chargement. <= 2.5s est bon
            FCP: json.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category,
            FID: json.loadingExperience.metrics.FIRST_INPUT_DELAY_MS.category, // Mesure l'interactivité. <= 100ms est bon
            CLS: json.loadingExperience.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.category // Mesure la stabilité visuelle. <= 0.1s est bon.
        };

        const lighthouse = json.lighthouseResult;

        const lighthouseValues = {
            LCP: lighthouse.audits['largest-contentful-paint'].numericValue,
            FCP: lighthouse.audits['first-contentful-paint'].numericValue,
            FID: lighthouse.audits['max-potential-fid'].numericValue,
            CLS: lighthouse.audits['cumulative-layout-shift'].numericValue
        }

        mobileMetrics['url'] = json.id;
        mobileMetrics['coreWebVitalsMetrics'] = coreWebVitalsMetrics;
        mobileMetrics['lighthouseValues'] = lighthouseValues;
    } else {
        throw new Error(`Error : status : ${mobileResponse.status}`);
    }

    metrics['desktopMetrics'] = desktopMetrics;
    metrics['mobileMetrics'] = mobileMetrics;

    return metrics;
}

function setUpQuery(apiUrl, apiKey, urlToTest) {
    const api = apiUrl;
    const parameters = {
        url: urlToTest,
        key: apiKey
    };

    let query = `${api}?`;
    for (let key in parameters) {
        if (key === 'url') {
            query += `${key}=${parameters[key]}`;
        } else {
            query += `&${key}=${parameters[key]}`;
        }
    }
    return query;
}

export { run, setUpQuery };