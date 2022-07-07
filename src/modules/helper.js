import constants from "./constants";

// Renvoie un objet contenant les deux valeurs booléennes en fonction de si le test de performances sur mobile ou desktop est passé
let isCoreWebVitalsPassed = (metrics) => {
    let isPassed = {
        isDesktopPassed: true,
        isMobilePassed: true
    };

    // DESKTOP
    if (metrics.desktopMetrics.coreWebVitalsMetrics.LCP !== constants.MetricsConstants.BETTER_NOTE) {
        isPassed.isDesktopPassed = false;
    }
    if (metrics.desktopMetrics.coreWebVitalsMetrics.FID !== constants.MetricsConstants.BETTER_NOTE) {
        isPassed.isDesktopPassed = false;
    }
    if (metrics.desktopMetrics.coreWebVitalsMetrics.CLS !== constants.MetricsConstants.BETTER_NOTE) {
        isPassed.isDesktopPassed = false;
    }

    // MOBILE
    if (metrics.mobileMetrics.coreWebVitalsMetrics.LCP !== constants.MetricsConstants.BETTER_NOTE) {
        isPassed.isMobilePassed = false;
    }
    if (metrics.mobileMetrics.coreWebVitalsMetrics.FID !== constants.MetricsConstants.BETTER_NOTE) {
        isPassed.isMobilePassed = false;
    }
    if (metrics.mobileMetrics.coreWebVitalsMetrics.CLS !== constants.MetricsConstants.BETTER_NOTE) {
        isPassed.isMobilePassed = false;
    }

    return isPassed;
}

// Permet d'ajouter un 0 pour les jours et les mois d'une date à 1 chiffre
let add0ForNumbersLessThan10 = (num) => {
    return num.toString().padStart(2, '0');
}

// En passant un objet date en paramètre, renvoie une date formatée "dd-mm-yyyy"
let formatDate = (date) => {
    if (date instanceof Date) {
        return [
            add0ForNumbersLessThan10(date.getDate()),
            add0ForNumbersLessThan10(date.getMonth() + 1),
            date.getFullYear()
        ].join('-');
    }
}

// Permet d'ajouter une ligne au tableau de résultats avec les métriques passées en paramètres
let addResultToTable = (desktopMetrics, mobileMetrics, desktopCoreWebVitals, mobileCoreWebVitals, date) => {

    desktopMetrics.lighthouseValues.CLS = Number.parseFloat(desktopMetrics.lighthouseValues.CLS).toFixed(3);
    mobileMetrics.lighthouseValues.CLS = Number.parseFloat(mobileMetrics.lighthouseValues.CLS).toFixed(3);

    let desktopColors = setResultsColor(date, desktopMetrics.url, desktopMetrics.lighthouseValues.LCP, desktopMetrics.lighthouseValues.FID, desktopMetrics.lighthouseValues.CLS);
    let mobileColors = setResultsColor(date, mobileMetrics.url, mobileMetrics.lighthouseValues.LCP, mobileMetrics.lighthouseValues.FID, mobileMetrics.lighthouseValues.CLS);

    console.log(desktopColors);
    console.log(mobileColors);

    let t_body = document.querySelector('tbody');
    let tr = document.createElement("tr");
    t_body.appendChild(tr);

    let td_date = document.createElement("td");
    td_date.innerHTML = date;
    td_date.style.color = desktopColors.date;
    tr.appendChild(td_date);

    let td_url = document.createElement("td");
    td_url.innerHTML = desktopMetrics.url;
    td_url.style.color = desktopColors.url;
    tr.appendChild(td_url);

    let td_desktop_core_web_vitals = document.createElement("td");
    td_desktop_core_web_vitals.innerHTML = desktopCoreWebVitals;

    if (desktopCoreWebVitals === 'Succès') {
        td_desktop_core_web_vitals.style.color = "#0ea000";
    } else if (desktopCoreWebVitals === 'Echec') {
        td_desktop_core_web_vitals.style.color = "#ff0000";
    }
    tr.appendChild(td_desktop_core_web_vitals);

    let td_mobile_core_web_vitals = document.createElement("td");
    td_mobile_core_web_vitals.innerHTML = mobileCoreWebVitals;
    if (mobileCoreWebVitals === 'Succès') {
        td_mobile_core_web_vitals.style.color = "#0ea000";
    } else if (mobileCoreWebVitals === 'Echec') {
        td_mobile_core_web_vitals.style.color = "#ff0000";
    }

    console.log(desktopMetrics);

    for (let elem in desktopMetrics.lighthouseValues) {

        if ( elem !== 'FCP' ) {
            let td_desktop = document.createElement("td");
            td_desktop.innerHTML = desktopMetrics.lighthouseValues[elem];

            if (elem === 'LCP') {
                td_desktop.style.color = desktopColors.lcp;
            } else if (elem === 'FID') {
                td_desktop.style.color = desktopColors.fid;
            } else if (elem === 'CLS') {
                td_desktop.style.color = desktopColors.cls;
            }

            tr.appendChild(td_desktop);
        }
    }

    tr.appendChild(td_mobile_core_web_vitals);

    for (let elem in mobileMetrics.lighthouseValues) {
        if ( elem !== 'FCP' ) {
            let td_mobile = document.createElement("td");
            td_mobile.innerHTML = mobileMetrics.lighthouseValues[elem];

            if (elem === 'LCP') {
                td_mobile.style.color = mobileColors.lcp;
            } else if (elem === 'FID') {
                td_mobile.style.color = mobileColors.fid;
            } else if (elem === 'CLS') {
                td_mobile.style.color = mobileColors.cls;
            }

            tr.appendChild(td_mobile);
        }
    }

}

// Renvoie un objet JSON contenant les couleurs en fonction des valeurs des métriques
let setResultsColor = (date, url, lcp, fid, cls) => {

    cls = Number.parseFloat(cls).toFixed(2);

    let colorClasses = {
        green: '#0ea000',
        orange: '#ff8000',
        red: '#ff0000',
        white: '#fff'
    };

    let effectiveClasses = {
        date: colorClasses.white,
        url: colorClasses.white,
        lcp: '',
        fid: '',
        cls: ''
    };

    if (lcp <= 2500) {
        effectiveClasses['lcp'] = colorClasses.green;
    } else if (2500 < lcp <= 4000) {
        effectiveClasses['lcp'] = colorClasses.orange;
    } else if (lcp > 4000) {
        effectiveClasses['lcp'] = colorClasses.red;
    } else {
        effectiveClasses['lcp'] = colorClasses.white;
    }

    if (fid <= 100) {
        effectiveClasses['fid'] = colorClasses.green;
    } else if (100 < fid <= 300) {
        effectiveClasses['fid'] = colorClasses.orange;
    } else if (fid > 300) {
        effectiveClasses['fid'] = colorClasses.red;
    } else {
        effectiveClasses['fid'] = colorClasses.white;
    }

    if (cls <= 0.10) {
        effectiveClasses['cls'] = colorClasses.green;
    } else if (cls > 0.10 && cls <= 0.25) {
        effectiveClasses['cls'] = colorClasses.orange;
    } else if (cls > 0.25) {
        effectiveClasses['cls'] = colorClasses.red;
    } else {
        effectiveClasses['cls'] = colorClasses.white;
    }

    return effectiveClasses;
}

export { isCoreWebVitalsPassed, formatDate, addResultToTable };