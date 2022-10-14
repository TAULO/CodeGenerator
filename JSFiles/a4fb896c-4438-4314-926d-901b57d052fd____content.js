var uniqueId = "amazon-analysis-" + chrome.runtime.id;
var hostname = window.location.hostname;
var validDomains = {
    "www.amazon.com": "english",
    "www.amazon.co.uk": "english",
    "www.amazon.com.au": "english",
    "www.amazon.ca": "canadian",
    "www.amazon.es": "estonia",
    "www.amazon.it": "italian",
    "www.amazon.de": "germani",
    "www.amazon.fr": "french"
};

/**
 * Get amazon products url
 */
function getProductUrls() {
    var nodes = document.querySelectorAll('.s-main-slot.s-result-list [data-component-type=s-search-result]');
    var links = [];
    nodes.forEach(item => {
        var isSponsored = item.querySelector("[data-component-type=sp-sponsored-result]");
        var node = item.querySelector(".rush-component > .a-link-normal");
        var index = item.getAttribute("data-index");
        links.push({
            link: "https://" + hostname + node.getAttribute("href"),
            index: index,
            isSponsored: isSponsored == null ? false : true
        });
    });

    return links;
}

/**
 * Separate number with commas
 * @param {*} num
 */
function numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Calculate score
 * @param {*} totalResult
 * @param {*} avgBSR
 * @param {*} avgReviews
 * @param {*} avgPrice
 */
function calculateScore(totalResult, avgBSR, avgReviews, avgPrice) {

    // Calculate total result score
    var totalResultScore = 0;
    totalResult = parseInt(totalResult);
    if (totalResult >= 10001) {
        totalResultScore = 4 * 1;
    } else if (totalResult >= 4001 && totalResult <= 10000) {
        totalResultScore = 4 * 2;
    } else if (totalResult >= 2501 && totalResult <= 4000) {
        totalResultScore = 4 * 3;
    } else if (totalResult >= 1001 && totalResult <= 2500) {
        totalResultScore = 4 * 4;
    } else if (totalResult >= 501 && totalResult <= 1000) {
        totalResultScore = 4 * 5;
    } else if (totalResult >= 76 && totalResult <= 400) {
        totalResultScore = 4 * 6;
    } else if (totalResult >= 0 && totalResult <= 75) {
        totalResultScore = 4 * 7;
    }

    // Calculate average bsr score
    var avgBSRScore = 0;
    avgBSR = parseInt(avgBSR);
    if (avgBSR >= 1000001) {
        avgBSRScore = 4 * 1;
    } else if (avgBSR >= 500000 && avgBSR <= 1000000) {
        avgBSRScore = 4 * 2;
    } else if (avgBSR >= 250001 && avgBSR <= 499999) {
        avgBSRScore = 4 * 3;
    } else if (avgBSR >= 150001 && avgBSR <= 250000) {
        avgBSRScore = 4 * 4;
    } else if (avgBSR >= 75001 && avgBSR <= 150000) {
        avgBSRScore = 4 * 5;
    } else if (avgBSR >= 25000 && avgBSR <= 75000) {
        avgBSRScore = 4 * 6;
    } else if (avgBSR >= 1 && avgBSR < 25000) {
        avgBSRScore = 4 * 7;
    }

    // Calculate average reviews score
    var avgReviewsScore = 0;
    avgReviews = parseInt(avgReviews);
    if (avgReviews >= 1000) {
        avgReviewsScore = 3 * 1;
    } else if (avgReviews >= 500 && avgReviews <= 999) {
        avgReviewsScore = 3 * 2;
    } else if (avgReviews >= 350 && avgReviews <= 499) {
        avgReviewsScore = 3 * 3;
    } else if (avgReviews >= 100 && avgReviews <= 349) {
        avgReviewsScore = 3 * 4;
    } else if (avgReviews >= 50 && avgReviews <= 99) {
        avgReviewsScore = 3 * 5;
    } else if (avgReviews >= 25 && avgReviews <= 49) {
        avgReviewsScore = 3 * 6;
    } else if (avgReviews >= 0 && avgReviews <= 24) {
        avgReviewsScore = 3 * 7;
    }

    // Calculate average reviews score
    var avgPriceScore = 0;
    avgPrice = parseFloat(avgPrice);
    if (avgPrice >= 0 && avgPrice <= 5.99) {
        avgPriceScore = 3 * 1;
    } else if (avgPrice >= 6 && avgPrice <= 6.99) {
        avgPriceScore = 3 * 2;
    } else if (avgPrice >= 7 && avgPrice <= 7.99) {
        avgPriceScore = 3 * 3;
    } else if (avgPrice >= 8 && avgPrice <= 8.99) {
        avgPriceScore = 3 * 4;
    } else if (avgPrice >= 9 && avgPrice <= 9.99) {
        avgPriceScore = 3 * 5;
    } else if (avgPrice >= 10 && avgPrice <= 10.99) {
        avgPriceScore = 3 * 6;
    } else if (avgPrice >= 11) {
        avgPriceScore = 3 * 7;
    }

    var totalScore = totalResultScore + avgBSRScore + avgReviewsScore + avgPriceScore;
    var maxScorePercent = 0.98;

    var finalScore = parseFloat(totalScore / maxScorePercent);
    // console.log("finalScore 1", finalScore);
    if (totalResult > 10000) {
        finalScore = finalScore - (finalScore * 0.30);
        // console.log("finalScore 2", finalScore);
    }

    return finalScore.toFixed(0);
}

/**
 * Create and download excel file
 * @param {*} productDetails
 */
function createExcelFileBSR(productDetails) {
    // // Create csv data
    // var data = [["ASIN / ISBN", "Authors", "Title"]];
    // Object.keys(productDetails).map(function (key) {
    //   var arr = [];
    //   arr.push(productDetails[key].isbn10.replace(/,/g, ""));
    //   // console.log(productDetails[key], productDetails[key].authors);
    //   arr.push(productDetails[key].authors);
    //   arr.push(productDetails[key].title.replace(/,/g, ""));
    //   data.push(arr);
    // });
    // csvData = data.map(function (v) { return v.join(',') }).join('\n');

    var createXLSLFormatObj = [];

    /* XLS Head Columns */
    var xlsHeader = ["ASIN / ISBN", "Authors", "Title"];

    /* XLS Rows Data */
    var xlsRows = Object.keys(productDetails).map(function (key) {
        return {
            "ASIN / ISBN": productDetails[key].isbn10.replace(/,/g, ""),
            "Authors": productDetails[key].authors,
            "Title": productDetails[key].title.replace(/,/g, "")
        };
    });

    createXLSLFormatObj.push(xlsHeader);
    $.each(xlsRows, function (index, value) {
        var innerRowData = [];
        $.each(value, function (ind, val) {

            innerRowData.push(val);
        });
        createXLSLFormatObj.push(innerRowData);
    });


    /* File Name */
    var filename = "amazon_analysis.xlsx";

    /* Sheet Name */
    var ws_name = "AmazonAnalysis";

    if (typeof console !== 'undefined') console.log(new Date());
    var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);

    /* Add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws, ws_name);

    /* Write workbook and Download */
    if (typeof console !== 'undefined') console.log(new Date());
    XLSX.writeFile(wb, filename);
    if (typeof console !== 'undefined') console.log(new Date());
}

/**
 * Render analysis table
 * @param {*} resNumber
 * @param {*} avgBSR
 * @param {*} nicheScore
 * @param {*} avgReviews
 * @param {*} avgPrice
 */
function renderLoadingTable() {
    if (document.getElementById(uniqueId)) {
        document.getElementById(uniqueId).remove();
    }

    var rows = [
        [
            {
                attrs: {
                    rowspan: 2
                },
                content: `<div style="display: flex;align-items: center;justify-content: center;"><img src="chrome-extension://${chrome.runtime.id}/images/icon-64.png" width="100px"/></div>`
            },
            {
                content: `<div style="display: flex;align-items: center;justify-content: center;">
                    <span>Analysis in progress</span>
                    <span style="
                        width: 25px;
                        height: 25px;
                        display: table;
                        background: #FF9800;
                        border-radius: 100px;
                        margin: 10px;
                    "></span>
                  </div>`
            },
            {
                content: `<div style="display: flex;align-items: center;justify-content: center;">
                    <span>Keyword Niche Score: Loading...</span>
                    <span style="
                        width: 25px;
                        height: 25px;
                        display: table;
                        background: #ddd;
                        border-radius: 100px;
                        margin: 10px;
                    "></span>
                    <span style="
                      width: 25px;
                      height: 25px;
                      border-radius: 100px;
                      margin: 10px;
                      line-height: 1.2;
                      border: 1px solid #ddd;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      cursor: help;
                    "
                    title="This algorithm is specifically tailored towards books as its first priority. The algorithm uses ALL key data points together to determine competitiveness. It does not include sponsored products. The higher the score the easier it will be to rank on page 1. We look for book niches with a score of 63 and up, but see what works for you. For other product research besides books, we recommend just using our data points shown in the bar and not necessarily the score. If you have any questions or need help, ask us in our Facebook Group. Happy selling! If you are experiencing problems with this Chrome Extension, please try the following: 1) try refreshing the page 2) close the browser tab and open new one 3) disable other Amazon Chrome Extensions to see if that fixes it. For more help and support please join our Facebook group."
                    >?</span>
                  </div>`
            },
            {
                content: "Number of Results: Loading..."
            },
            {
                content: "Average Reviews: Loading..."
            },
            {
                content: `<a href="https://www.facebook.com/groups/2690865597847008" target="_blank" style="color: white">
                    <span>Join our Facebook Group</span>
                    <span><img src="chrome-extension://${chrome.runtime.id}/images/bullhorn-solid.png" style="width: 23px; margin: 6px 10px;" /></span>
                  </a>`
            }
        ],
        [
            {
                content: `<div><img src="chrome-extension://${chrome.runtime.id}/images/publishing.png" width="250px"></div>`
            },
            {
                content: '<div style="text-align: center;"><a href="#" style="color: white">Download: ASINs, Author/Seller Names, Titles</a>'
            },
            {
                content: "Average BSR: Loading..."
            },
            {
                content: "Average Price:  Loading..."
            },
            {
                content: `<a href="https://selfpublishingtitans.com/" style="color: white">
                  <span>Go to Website for more Free Tools</span>
                  <span><img src="chrome-extension://${chrome.runtime.id}/images/home-solid.png" style="width: 18px; margin: 4px 10px;" /></span>
                </a>`
            }
        ]
    ];

    var table = `<table id="amazon-analysis-${chrome.runtime.id}" style="border-collapse: collapse; border: 1px solid white; color: white; text-align: center;">
      <tbody>
        <tr style="border: 1px solid white; line-height: 30px;">
            <td rowspan="2" style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">
              <div style="display: flex;align-items: center;justify-content: center;">
                <img src="chrome-extension://${chrome.runtime.id}/images/icon-64.png" width="100px">
              </div>
            </td>
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">
              <div style="display: flex;align-items: center;justify-content: center;">
                  <span>Keyword Niche Score: Loading...</span>
                  <span style="
                    width: 25px;
                    height: 25px;
                    display: table;
                    background: #FF9800;
                    border-radius: 100px;
                    margin: 10px;
                    "></span>
                  <span style="
                    width: 25px;
                    height: 25px;
                    border-radius: 100px;
                    margin: 10px;
                    line-height: 1.2;
                    border: 1px solid #ddd;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: help;
                    " title="This algorithm is specifically tailored towards books as its first priority. The algorithm uses ALL key data points together to determine competitiveness. It does not include sponsored products. The higher the score the easier it will be to rank on page 1. We look for book niches with a score of 63 and up, but see what works for you. For other product research besides books, we recommend just using our data points shown in the bar and not necessarily the score. If you have any questions or need help, ask us in our Facebook Group. Happy selling! If you are experiencing problems with this Chrome Extension, please try the following: 1) try refreshing the page 2) close the browser tab and open new one 3) disable other Amazon Chrome Extensions to see if that fixes it. For more help and support please join our Facebook group.">?</span>
              </div>
            </td>
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">Number of Results: Loading...</td>
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">Average Price: Loading...</td>
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">
              <a href="https://chrome.google.com/webstore/detail/huge-amazon-search-sugges/mmdamlknnafgffhlobhlmiljonijdnid?hl=en&authuser=1" style="color: white">
              <span>Get Free Keyword Search Suggestion Expander Extension</span>
              <span><img src="chrome-extension://${chrome.runtime.id}/images/logo2.png" style="width: 24px; margin: 4px 10px;"></span>
              </a>
            </td>
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">
              <a href="https://www.facebook.com/groups/2690865597847008" target="_blank" style="color: white">
                <span>Join our Facebook Group</span>
                <span><img src="chrome-extension://${chrome.runtime.id}/images/bullhorn-solid.png" style="width: 23px; margin: 6px 10px;">
                </span>
              </a>
            </td>
        </tr>
        <tr style="border: 1px solid white; line-height: 30px;">
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);"><img src="chrome-extension://${chrome.runtime.id}/images/publishing.png" width="250px"></td>
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">Average BSR: Loading...</td>
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">Average Reviews: Loading...</td>
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">
              <div style="text-align: center;"><a href="javascript: void(0)" id="#" style="color: white">Download: ASINs, Author/Seller Names, Titles</a></div>
            </td>
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">
              <a href="https://selfpublishingtitans.com/" style="color: white">
              <span>Go to Website for more Free Tools</span>
              <span><img src="chrome-extension://${chrome.runtime.id}/images/home-solid.png" style="width: 18px; margin: 4px 10px;"></span>
              </a>
            </td>
        </tr>
      </tbody>
    </table>`;

    var wrapper = document.createElement("div");
    wrapper.innerHTML = table;
    var nav = document.getElementById("nav-main");
    nav.after(wrapper);
    nav.style.height = "auto";
}

/**
 * Render analysis table
 * @param {*} avgBSR
 * @param {*} nicheScore
 * @param {*} avgReviews
 * @param {*} avgPrice
 */
function renderTable(productDetails = []) {
    if (document.getElementById(uniqueId)) {
        document.getElementById(uniqueId).remove();
    }

    // Get number of results
    var resNumber = 0;
    document.querySelectorAll("script").forEach(item => {
        if (item.innerText.indexOf("totalResultCount") >= 0) {
            var scriptText = item.innerText.trim();
            var jsonText = scriptText.substr(scriptText.indexOf("{"));
            jsonText = jsonText.replace(");", "").replace(/\\/g, "").trim();
            resNumber = JSON.parse(jsonText).totalResultCount;
        }
    })

    var productCount = Object.keys(productDetails).filter(function (item) {
        return productDetails[item].isSponsored == false
    }).length;

    var productCountForBSRavg = Object.keys(productDetails).filter(function (item) {
        // console.log("BSR", productDetails[item].bsr);
        return productDetails[item].isSponsored == false && productDetails[item].bsr !== 0
    }).length;

    var avgBSR = ((Object.keys(productDetails).map(function (key) {
        return productDetails[key].bsr
    }).reduce((a, b) => a + b, 0)) / productCountForBSRavg).toFixed(0);

    // console.log("sum bsr", (Object.keys(productDetails).map(function (key) { return productDetails[key].bsr }).reduce((a, b) => a + b, 0)), "productCountForBSRavg:", productCountForBSRavg, "avg:", (Object.keys(productDetails).map(function (key) { return productDetails[key].bsr }).reduce((a, b) => a + b, 0)) / productCountForBSRavg, "avgBSR:", avgBSR );

    var avgReviews = ((Object.keys(productDetails).map(function (key) {
        // console.log("review", productDetails[key].ratings);
        return productDetails[key].ratings
    }).reduce((a, b) => a + b, 0)) / productCount).toFixed(0);

    // console.log("avgReviews", avgReviews);

    var avgPrice = ((Object.keys(productDetails).map(function (key) {
        return productDetails[key].price
    }).reduce((a, b) => a + b, 0)) / productCount).toFixed(2);

    // Calculte score
    var score = calculateScore(resNumber, avgBSR, avgReviews, avgPrice);
    var ScoreColor = "#ddd";
    if (score >= 87.6 && score <= 100) {
        ScoreColor = "#3dff2c";
    } else if (score >= 75.1 && score <= 87.5) {
        ScoreColor = "#48ff00";
    } else if (score >= 62.6 && score <= 75) {
        ScoreColor = "#aeff00";
    } else if (score >= 50.1 && score <= 62.5) {
        ScoreColor = "#f4ff00";
    } else if (score >= 37.6 && score <= 50) {
        ScoreColor = "#f7f400";
    } else if (score >= 25.1 && score <= 37.5) {
        ScoreColor = "#ffc700";
    } else if (score >= 12.6 && score <= 25) {
        ScoreColor = "#ff7c00";
    } else if (score >= 0 && score <= 12.5) {
        ScoreColor = "#ff0002";
    }

    var table = `<table id="amazon-analysis-${chrome.runtime.id}" style="border-collapse: collapse; border: 1px solid white; color: white; text-align: center;">
      <tbody>
        <tr style="border: 1px solid white; line-height: 30px;">
            <td rowspan="2" style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">
              <div style="display: flex;align-items: center;justify-content: center;">
                <img src="chrome-extension://${chrome.runtime.id}/images/icon-64.png" width="100px">
              </div>
            </td>
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">
              <div style="display: flex;align-items: center;justify-content: center;">
                  <span>Keyword Niche Score (Beta Version): ${score}%</span>
                  <span style="
                    width: 25px;
                    height: 25px;
                    display: table;
                    background: ${ScoreColor};
                    border-radius: 100px;
                    margin: 10px;
                    "></span>
                  <span style="
                    width: 25px;
                    height: 25px;
                    border-radius: 100px;
                    margin: 10px;
                    line-height: 1.2;
                    border: 1px solid #ddd;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: help;
                    " title="This algorithm is specifically tailored towards books as its first priority. The algorithm uses ALL key data points together to determine competitiveness. It does not include sponsored products. The higher the score the easier it will be to rank on page 1. We look for book niches with a score of 63 and up, but see what works for you. For other product research besides books, we recommend just using our data points shown in the bar and not necessarily the score. If you have any questions or need help, ask us in our Facebook Group. Happy selling! If you are experiencing problems with this Chrome Extension, please try the following: 1) try refreshing the page 2) close the browser tab and open new one 3) disable other Amazon Chrome Extensions to see if that fixes it. For more help and support please join our Facebook group.">?</span>
              </div>
            </td>
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">Number of Results: ${numberWithCommas(resNumber)}</td>
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">Average Price: ${numberWithCommas(avgPrice)}</td>
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">
              <a href="https://chrome.google.com/webstore/detail/huge-amazon-search-sugges/mmdamlknnafgffhlobhlmiljonijdnid?hl=en&authuser=1" style="color: white">
              <span>Get Free Keyword Search Suggestion Expander Extension</span>
              <span><img src="chrome-extension://${chrome.runtime.id}/images/logo2.png" style="width: 24px; margin: 4px 10px;"></span>
              </a>
            </td>
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">
              <a href="https://www.facebook.com/groups/2690865597847008" target="_blank" style="color: white">
                <span>Join our Facebook Group</span>
                <span><img src="chrome-extension://${chrome.runtime.id}/images/bullhorn-solid.png" style="width: 23px; margin: 6px 10px;">
                </span>
              </a>
            </td>
        </tr>
        <tr style="border: 1px solid white; line-height: 30px;">
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);"><img src="chrome-extension://${chrome.runtime.id}/images/publishing.png" width="250px"></td>
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">Average BSR: ${numberWithCommas(avgBSR)}</td>
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">Average Reviews: ${numberWithCommas(avgReviews)}</td>
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">
              <div style="text-align: center;"><a href="javascript: void(0)" id="download_excel_file_${chrome.runtime.id}" style="color: white">Download: ASINs, Author/Seller Names, Titles</a></div>
            </td>
            <td style="border: 1px solid white; vertical-align: middle; background-color: rgb(35, 40, 45);">
              <a href="https://selfpublishingtitans.com/" style="color: white">
              <span>Go to Website for more Free Tools</span>
              <span><img src="chrome-extension://${chrome.runtime.id}/images/home-solid.png" style="width: 18px; margin: 4px 10px;"></span>
              </a>
            </td>
        </tr>
      </tbody>
    </table>`;

    var wrapper = document.createElement("div");
    wrapper.innerHTML = table;
    var nav = document.getElementById("nav-main");
    nav.after(wrapper);
    nav.style.height = "auto";

    Object.keys(productDetails).forEach(function (key) {
        setTimeout(function () {
            // add product details
            let product = document.querySelector('.s-main-slot.s-result-list [data-index="' + productDetails[key].index + '"] .rush-component:nth-child(2)');
            if (!product) {
                product = document.querySelector('.s-main-slot.s-result-list [data-index="' + productDetails[key].index + '"] .s-include-content-margin.s-border-bottom.s-latency-cf-section');
            }

            if (product) {
                let details = document.createElement("div");
                details.style.border = "3px solid black";
                details.style.margin = "5px";
                details.style.padding = "5px";
                details.innerHTML = key;
                details.innerHTML =
                    '<div>Best-sellers rank #' + numberWithCommas(productDetails[key].bsr) + ' in Books</div>'
                    + '<div>' + productDetails[key].bsrHTML + '</div>'
                    + '<div><strong>Paperback: </strong>' + productDetails[key].paperback + '</div>'
                    + '<div><strong>ISBN-10/ASIN: </strong>' + productDetails[key].isbn10.replace(/,/g, "") + '</div>'
                    + '<div><strong>Size: </strong>' + productDetails[key].size + '</div>'
                    + '<div><strong>Seller: </strong>' + productDetails[key].seller + '</div>';
                product.prepend(details);
            }
        }, 2000)
    })

    $("#download_excel_file_" + chrome.runtime.id).click(function () {
        createExcelFileBSR(productDetails);
    });
}

/**
 * Parse english content
 * @param {*} html
 */
function parseProductHTML(product, html) {
    var siteLang = validDomains[hostname];
    // console.log("hostname ", hostname);
    // console.log("siteLang ", siteLang, " hostname ", hostname);

    var selectors = {
        title: {
            english: "#productTitle",
            canadian: "#productTitle",
            estonia: "#productTitle",
            italian: "#productTitle",
            germani: "#productTitle",
            french: "#productTitle"
        },
        itemWeight: {
            english: {
                list: "#detailBulletsWrapper_feature_div span:contains('Item Weight')",
                table: "#productDetails_feature_div th:contains('Item Weight')"
            },
            canadian: {
                list: "#detailBulletsWrapper_feature_div span:contains('Item Weight')",
                table: "#productDetails_feature_div th:contains('Item Weight')"
            },
            estonia: {
                list: "#detailBulletsWrapper_feature_div span:contains('Peso del producto')",
                table: "#productDetails_feature_div th:contains('Peso del producto')"
            },
            italian: {
                list: "#detailBulletsWrapper_feature_div span:contains('Peso articolo')",
                table: "#productDetails_feature_div th:contains('Peso articolo')"
            },
            germani: {
                list: "#detailBulletsWrapper_feature_div span:contains('Artikelgewicht')",
                table: "#productDetails_feature_div th:contains('Artikelgewicht')"
            },
            french: {
                list: "#detailBulletsWrapper_feature_div span:contains('Poids de l'article')",
                table: "#productDetails_feature_div th:contains('Poids de l'article')"
            }
        },
        bsr: {
            english: {
                list: [
                    "#detailBulletsWrapper_feature_div span:contains('Best-sellers rank')",
                    "#detailBulletsWrapper_feature_div span:contains('Best Sellers Rank')",
                    "#SalesRank"
                ],
                table: [
                    "#productDetails_feature_div th:contains('Best-sellers rank')",
                    "#productDetails_feature_div th:contains('Best Sellers Rank')"
                ]
            },
            canadian: {
                list: [
                    "#detailBulletsWrapper_feature_div span:contains('Bestsellers rank')",
                    "#detailBulletsWrapper_feature_div span:contains('Best Sellers Rank')"
                ],
                table: [
                    "#productDetails_feature_div th:contains('Bestsellers rank')",
                    "#productDetails_feature_div th:contains('Best Sellers Rank')"
                ]
            },
            estonia: {
                list: [
                    "#detailBulletsWrapper_feature_div span:contains('éxitos de ventas')",
                    "#detailBulletsWrapper_feature_div span:contains('Clasificación en los más vendidos')",
                ],
                table: [
                    "#productDetails_feature_div th:contains('éxitos de ventas')",
                    "#productDetails_feature_div th:contains('Clasificación en los más vendidos')",
                ]
            },
            italian: {
                list: [
                    "#detailBulletsWrapper_feature_div span:contains('best-seller')",
                    "#detailBulletsWrapper_feature_div span:contains('classifica Bestseller')"
                ],
                table: [
                    "#productDetails_feature_div th:contains('classifica Bestseller')",
                    "#productDetails_feature_div th:contains('classifica Bestseller')",
                ]
            },
            germani: {
                list: [
                    "#detailBulletsWrapper_feature_div span:contains('Bestseller-Rang')"
                ],
                table: [
                    "#productDetails_feature_div th:contains('Bestseller-Rang')"
                ]
            },
            french: {
                list: [
                    "#detailBulletsWrapper_feature_div span:contains('Classement des meilleures')"
                ],
                table: [
                    "#productDetails_feature_div th:contains('Classement des meilleures')"
                ]
            }
        },
        bsrHTML: {
            english: {
                list: [
                    "#detailBulletsWrapper_feature_div span:contains('Best-sellers rank') ul li",
                    "#detailBulletsWrapper_feature_div span:contains('Best Sellers Rank') ul li"
                ],
                table: [
                    "#productDetails_feature_div th:contains('Best-sellers rank') ul li",
                    "#productDetails_feature_div th:contains('Best Sellers Rank')"
                ]
            },
            canadian: {
                list: [
                    "#detailBulletsWrapper_feature_div span:contains('Bestsellers rank') ul li",
                    "#detailBulletsWrapper_feature_div span:contains('Best Sellers Rank')"
                ],
                table: [
                    "#productDetails_feature_div th:contains('Bestsellers rank') ul li",
                    "#productDetails_feature_div th:contains('Best Sellers Rank')"
                ]
            },
            estonia: {
                list: [
                    "#detailBulletsWrapper_feature_div span:contains('éxitos de ventas') ul li"
                ],
                table: [
                    "#productDetails_feature_div th:contains('éxitos de ventas')"
                ]
            },
            italian: {
                list: [
                    "#detailBulletsWrapper_feature_div span:contains('best-seller') ul li",
                    "#detailBulletsWrapper_feature_div span:contains('classifica Bestseller') ul li"
                ],
                table: [
                    "#productDetails_feature_div th:contains('classifica Bestseller')"
                ]
            },
            germani: {
                list: [
                    "#detailBulletsWrapper_feature_div span:contains('Bestseller-Rang') ul li"
                ],
                table: [
                    "#productDetails_feature_div th:contains('Bestseller-Rang')"
                ]
            },
            french: {
                list: [
                    "#detailBulletsWrapper_feature_div span:contains('Classement des meilleures') ul li"
                ],
                table: [
                    "#productDetails_feature_div th:contains('Classement des meilleures')"
                ]
            }
        },
        paperback: {
            english: {
                list: "#detailBulletsWrapper_feature_div span:contains('Paperback')",
                table: "#productDetails_feature_div th:contains('Paperback')"
            },
            canadian: {
                list: "#detailBulletsWrapper_feature_div span:contains('Paperback')",
                table: "#productDetails_feature_div th:contains('Paperback')"
            },
            estonia: {
                list: "#detailBulletsWrapper_feature_div span:contains('Tapa blanda')",
                table: "#productDetails_feature_div th:contains('Tapa blanda')"
            },
            italian: {
                list: "#detailBulletsWrapper_feature_div span:contains('Copertina flessibile')",
                table: "#productDetails_feature_div th:contains('Copertina flessibile')"
            },
            germani: {
                list: "#detailBulletsWrapper_feature_div span:contains('Taschenbuch')",
                table: "#productDetails_feature_div th:contains('Taschenbuch')"
            },
            french: {
                list: "#detailBulletsWrapper_feature_div span:contains('Broché')",
                table: "#productDetails_feature_div th:contains('Broché')"
            }
        },
        isbn10: {
            english: {
                list: "#detailBulletsWrapper_feature_div span:contains('ISBN-10')",
                table: "#productDetails_feature_div th:contains('ISBN-10')"
            },
            canadian: {
                list: "#detailBulletsWrapper_feature_div span:contains('ISBN-10')",
                table: "#productDetails_feature_div th:contains('ISBN-10')"
            },
            estonia: {
                list: "#detailBulletsWrapper_feature_div span:contains('ISBN-10')",
                table: "#productDetails_feature_div th:contains('ISBN-10')"
            },
            italian: {
                list: "#detailBulletsWrapper_feature_div span:contains('ISBN-10')",
                table: "#productDetails_feature_div th:contains('ISBN-10')"
            },
            germani: {
                list: "#detailBulletsWrapper_feature_div span:contains('ISBN-10')",
                table: "#productDetails_feature_div th:contains('ISBN-10')"
            },
            french: {
                list: "#detailBulletsWrapper_feature_div span:contains('ISBN-10')",
                table: "#productDetails_feature_div th:contains('ISBN-10')"
            }
        },
        asin: {
            english: {
                list: "#detailBulletsWrapper_feature_div span:contains('ASIN')",
                table: "#productDetails_feature_div th:contains('ASIN')"
            },
            canadian: {
                list: "#detailBulletsWrapper_feature_div span:contains('ASIN')",
                table: "#productDetails_feature_div th:contains('ASIN')"
            },
            estonia: {
                list: "#detailBulletsWrapper_feature_div span:contains('ASIN')",
                table: "#productDetails_feature_div th:contains('ASIN')"
            },
            italian: {
                list: "#detailBulletsWrapper_feature_div span:contains('ASIN')",
                table: "#productDetails_feature_div th:contains('ASIN')"
            },
            germani: {
                list: "#detailBulletsWrapper_feature_div span:contains('ASIN')",
                table: "#productDetails_feature_div th:contains('ASIN')"
            },
            french: {
                list: "#detailBulletsWrapper_feature_div span:contains('ASIN')",
                table: "#productDetails_feature_div th:contains('ASIN')"
            }
        },
        publisher: {
            english: {
                list: "#detailBulletsWrapper_feature_div span:contains('Publisher')",
                table: "#productDetails_feature_div th:contains('Publisher')"
            },
            canadian: {
                list: "#detailBulletsWrapper_feature_div span:contains('Publisher')",
                table: "#productDetails_feature_div th:contains('Publisher')"
            },
            estonia: {
                list: "#detailBulletsWrapper_feature_div span:contains('Editorial')",
                table: "#productDetails_feature_div th:contains('Editorial')"
            },
            italian: {
                list: "#detailBulletsWrapper_feature_div span:contains('Editore')",
                table: "#productDetails_feature_div th:contains('Editore')"
            },
            germani: {
                list: "#detailBulletsWrapper_feature_div span:contains('Herausgeber')",
                table: "#productDetails_feature_div th:contains('Herausgeber')"
            },
            french: {
                list: "#detailBulletsWrapper_feature_div span:contains('Éditeur')",
                table: "#productDetails_feature_div th:contains('Éditeur')"
            }
        },
        manufacturer: {
            english: {
                list: "#detailBulletsWrapper_feature_div span:contains('Manufacturer')",
                table: "#productDetails_feature_div th:contains('Manufacturer')"
            },
            canadian: {
                list: "#detailBulletsWrapper_feature_div span:contains('Manufacturer')",
                table: "#productDetails_feature_div th:contains('Manufacturer')"
            },
            estonia: {
                list: "#detailBulletsWrapper_feature_div span:contains('Fabricante')",
                table: "#productDetails_feature_div th:contains('Fabricante')"
            },
            italian: {
                list: "#detailBulletsWrapper_feature_div span:contains('Produttore')",
                table: "#productDetails_feature_div th:contains('Produttore')"
            },
            germani: {
                list: "#detailBulletsWrapper_feature_div span:contains('Hersteller')",
                table: "#productDetails_feature_div th:contains('Hersteller')"
            },
            french: {
                list: "#detailBulletsWrapper_feature_div span:contains('Fabricant')",
                table: "#productDetails_feature_div th:contains('Fabricant')"
            }
        },
        ratings: {
            english: {
                list: "#acrCustomerReviewText",
                table: "#acrCustomerReviewText"
            },
            canadian: {
                list: "#acrCustomerReviewText",
                table: "#acrCustomerReviewText"
            },
            estonia: {
                list: "#acrCustomerReviewText",
                table: "#acrCustomerReviewText"
            },
            italian: {
                list: "#acrCustomerReviewText",
                table: "#acrCustomerReviewText"
            },
            germani: {
                list: "#acrCustomerReviewText",
                table: "#acrCustomerReviewText"
            },
            french: {
                list: "#acrCustomerReviewText",
                table: "#acrCustomerReviewText"
            }
        },
        productDimensions: {
            english: {
                list: "#detailBulletsWrapper_feature_div span:contains('Product Dimensions')",
                table: "#productDetails_feature_div th:contains('Product Dimensions')"
            },
            canadian: {
                list: "#detailBulletsWrapper_feature_div span:contains('Product Dimensions')",
                table: "#productDetails_feature_div th:contains('Product Dimensions')"
            },
            estonia: {
                list: "#detailBulletsWrapper_feature_div span:contains('Dimensiones del producto')",
                table: "#productDetails_feature_div th:contains('Dimensiones del producto')"
            },
            italian: {
                list: "#detailBulletsWrapper_feature_div span:contains('Dimensioni')",
                table: "#productDetails_feature_div th:contains('Dimensioni')"
            },
            germani: {
                list: "#detailBulletsWrapper_feature_div span:contains('Verpackungsabmessungen')",
                table: "#productDetails_feature_div th:contains('Verpackungsabmessungen')"
            },
            french: {
                list: "#detailBulletsWrapper_feature_div span:contains('Dimensions du produit')",
                table: "#productDetails_feature_div th:contains('Dimensions du colis')"
            }
        },
        size: {
            english: {
                list: "#detailBulletsWrapper_feature_div span:contains('Size')",
                table: "#productDetails_feature_div th:contains('Size')"
            },
            canadian: {
                list: "#detailBulletsWrapper_feature_div span:contains('Size')",
                table: "#productDetails_feature_div th:contains('Size')"
            },
            estonia: {
                list: "#detailBulletsWrapper_feature_div span:contains('Tamaño')",
                table: "#productDetails_feature_div th:contains('Tamaño')"
            },
            italian: {
                list: "#detailBulletsWrapper_feature_div span:contains('Size')",
                table: "#productDetails_feature_div th:contains('Size')"
            },
            germani: {
                list: "#detailBulletsWrapper_feature_div span:contains('Größe')",
                table: "#productDetails_feature_div th:contains('Größe')"
            },
            french: {
                list: "#detailBulletsWrapper_feature_div span:contains('Taille')",
                table: "#productDetails_feature_div th:contains('Taille')"
            }
        },
        authorsNode: {
            english: {
                list: "#bylineInfo_feature_div span.author",
                table: "#bylineInfo_feature_div span.author"
            },
            canadian: {
                list: "#bylineInfo_feature_div span.author",
                table: "#bylineInfo_feature_div span.author"
            },
            estonia: {
                list: "#bylineInfo_feature_div span.author",
                table: "#bylineInfo_feature_div span.author"
            },
            italian: {
                list: "#bylineInfo_feature_div span.author",
                table: "#bylineInfo_feature_div span.author"
            },
            germani: {
                list: "#bylineInfo_feature_div span.author",
                table: "#bylineInfo_feature_div span.author"
            },
            french: {
                list: "#bylineInfo_feature_div span.author",
                table: "#bylineInfo_feature_div span.author"
            }
        },
        paperbackPrice: {
            english: "#tmmSwatches a:contains('Paperback')",
            canadian: "#tmmSwatches a:contains('Paperback')",
            estonia: "#tmmSwatches a:contains('Tapa blanda')",
            italian: "#tmmSwatches a:contains('Copertina flessibile')",
            germani: "#tmmSwatches a:contains('Taschenbuch')",
            french: "#tmmSwatches a:contains('Broché')"
        },
        kindlePrice: {
            english: "#tmmSwatches a:contains('Kindle')",
            canadian: "#tmmSwatches a:contains('Kindle')",
            estonia: "#tmmSwatches a:contains('Versión Kindle')",
            italian: "#tmmSwatches a:contains('Formato Kindle')",
            germani: "#tmmSwatches a:contains('Kindle')",
            french: "#tmmSwatches a:contains('Format Kindle')"
        },
        spiralBoundPrice: {
            english: "#tmmSwatches a:contains('Spiral-bound')",
            canadian: "#tmmSwatches a:contains('Spiral-bound')",
            estonia: "#tmmSwatches a:contains('Encuadernación en espiral')",
            italian: "#tmmSwatches a:contains('Spiral-bound')",
            germani: "#tmmSwatches a:contains('Spiral-bound')",
            french: "#tmmSwatches a:contains('Spiral-bound')"
        },
        hardcoverPrice: {
            english: "#tmmSwatches a:contains('Hardcover')",
            canadian: "#tmmSwatches a:contains('Hardcover')",
            estonia: "#tmmSwatches a:contains('Tapa dura')",
            italian: "#tmmSwatches a:contains('Copertina rigida')",
            germani: "#tmmSwatches a:contains('Gebundenes Buch')",
            french: "#tmmSwatches a:contains('Relié')"
        },
        mp3Price: {
            english: "#tmmSwatches a:contains('MP3 CD') .a-size-base.a-color-secondary",
            canadian: "#tmmSwatches a:contains('MP3 CD') .a-size-base.a-color-secondary",
            estonia: "#tmmSwatches a:contains('MP3 CD') .a-size-base.a-color-secondary",
            italian: "#tmmSwatches a:contains('MP3 CD') .a-size-base.a-color-secondary",
            germani: "#tmmSwatches a:contains('MP3 CD') .a-size-base.a-color-secondary",
            french: "#tmmSwatches a:contains('MP3 CD') .a-size-base.a-color-secondary"
        },
        audiobookPrice: {
            english: "#tmmSwatches a:contains('Audiobook') .a-size-base.a-color-secondary",
            canadian: "#tmmSwatches a:contains('Audiobook') .a-size-base.a-color-secondary",
            estonia: "#tmmSwatches a:contains('CD de audio') .a-size-base.a-color-secondary",
            italian: "#tmmSwatches a:contains('Audiolibro') .a-size-base.a-color-secondary",
            germani: "#tmmSwatches a:contains('Hörbuch') .a-size-base.a-color-secondary",
            french: "#tmmSwatches a:contains('Téléchargement audio') .a-size-base.a-color-secondary"
        },
        insideBoxPrice: {
            english: "#price_inside_buybox",
            canadian: "#price_inside_buybox",
            estonia: "#price_inside_buybox",
            italian: "#price_inside_buybox",
            germani: "#price_inside_buybox",
            french: "#price_inside_buybox"
        },
    };

    var parsed = $('<div/>').append(html);
    var title = parsed.find(selectors.title[siteLang]).text().trim();
    // Get product details
    var itemWeight = 0;
    var bsr = 0;
    var bsrHTML = [];
    var paperback = 0;
    var isbn10 = 0;
    var seller = "";
    var ratings = 0;
    var productDimensions = "";
    var authorsNode = null;
    var authors = [];

    // Determine product details layout
    if (parsed.find("#detailBulletsWrapper_feature_div").length || parsed.find("#productDetailsTable").length) {
        // Get product details
        itemWeight = parsed.find(selectors.itemWeight[siteLang]['list']).text().match(/\d+((.|,)\d+)?/);
        if (Array.isArray(itemWeight)) {
            itemWeight = itemWeight[0];
        }

        bsr = null;
        selectors.bsr[siteLang]['list'].forEach(selector => {
            if (parsed.find(selector).text() !== null && parsed.find(selector).text() !== "") {
                bsr = parsed.find(selector).text().match(/\d+((.|,)\d+)?/);
            }
        })

        if (Array.isArray(bsr)) {
            bsr = bsr[0];
        }

        // Get bsr html
        bsrHTML = [];
        selectors.bsrHTML[siteLang]['list'].forEach(selector => {
            if (parsed.find(selector).html() !== undefined) {
                bsrHTML.push("<li>" + parsed.find(selector).html() + "</li>");
            }
        })
        bsrHTML = bsrHTML.join("");

        paperback = parsed.find(selectors.paperback[siteLang]['list']).text().match(/\d+((.|,)\d+)?/);
        if (Array.isArray(paperback)) {
            paperback = paperback[0];
        }

        isbn10 = parsed.find(selectors.isbn10[siteLang]['list']).next('span').text().match(/\d+((.|,)\d+)?/);
        if (!isbn10) {
            isbn10 = parsed.find(selectors.asin[siteLang]['list']).next('span').text().trim();
        }
        if (Array.isArray(isbn10)) {
            isbn10 = isbn10[0];
        }

        seller = parsed.find(selectors.publisher[siteLang]['list']).next('span').text();
        if (!seller) {
            seller = parsed.find(selectors.manufacturer[siteLang]['list']).next("td").text().trim();
        }

        ratings = parsed.find(selectors.ratings[siteLang]['list']).text().match(/\d+((.|,)\d+)?/);
        if (Array.isArray(ratings)) {
            ratings = ratings[0];
        }

        productDimensions = parsed.find(selectors.productDimensions[siteLang]['list']).next("span").text();
        if (!productDimensions) {
            productDimensions = parsed.find(selectors.size[siteLang]['list']).next("span").text();
        }

        authorsNode = parsed.find(selectors.authorsNode[siteLang]['list'] + " a.contributorNameID");
        if (authorsNode.length <= 0) {
            authorsNode = parsed.find(selectors.authorsNode[siteLang]['list'] + " a");
        }
        authors = [];
        for (var m = 0; m < authorsNode.length; m++) {
            authors.push(authorsNode[m].innerText.trim().replace(/,/g, ""));
        }
    } else if (parsed.find("#productDetails_feature_div").length) {
        // Get product details
        itemWeight = parsed.find(selectors.itemWeight[siteLang]['table']).next("td").text().match(/\d+((.|,)\d+)?/);
        if (Array.isArray(itemWeight)) {
            itemWeight = itemWeight[0];
        }

        selectors.bsr[siteLang]['table'].forEach(selector => {
            if (parsed.find(selector).next("td").text() !== null && parsed.find(selector).next("td").text() !== "") {
                bsr = parsed.find(selector).next("td").text().match(/\d+((.|,)\d+)?/);
            }
        })
        if (Array.isArray(bsr)) {
            bsr = bsr[0];
        }

        // Get bsr html
        bsrHTML = "";
        selectors.bsrHTML[siteLang]['table'].forEach(selector => {
            if (parsed.find(selector).next("td").html() !== null && parsed.find(selector).next("td").html() !== undefined) {
                bsrHTML = parsed.find(selector).next("td").html();
            }
        })

        paperback = parsed.find(selectors.paperback[siteLang]['table']).next("td").text().match(/\d+((.|,)\d+)?/);
        if (Array.isArray(paperback)) {
            paperback = paperback[0];
        }

        isbn10 = parsed.find(selectors.isbn10[siteLang]['table']).next("td").text().match(/\d+((.|,)\d+)?/);
        if (!isbn10) {
            isbn10 = parsed.find(selectors.asin[siteLang]['table']).next('td').text().trim();
        }
        if (Array.isArray(isbn10)) {
            isbn10 = isbn10[0];
        }

        seller = parsed.find(selectors.publisher[siteLang]['table']).next('td').text().trim();
        if (!seller) {
            seller = parsed.find(selectors.manufacturer[siteLang]['table']).next("td").text().trim();
        }

        ratings = parsed.find(selectors.ratings[siteLang]['table']).next('td').text().match(/\d+((.|,)\d+)?/);
        if (Array.isArray(ratings)) {
            ratings = ratings[0];
        }

        productDimensions = parsed.find(selectors.productDimensions[siteLang]['table']).next("td").text().trim();
        // console.log("productDimensions", siteLang, selectors.productDimensions[siteLang]['table'])
        if (!productDimensions) {
            productDimensions = parsed.find(selectors.size[siteLang]['table']).next("td").text().trim();
            // console.log("size", siteLang, selectors.size[siteLang]['table']);
        }

        authorsNode = parsed.find(selectors.authorsNode[siteLang]['table'] + " a.contributorNameID");
        if (authorsNode.length <= 0) {
            authorsNode = parsed.find(selectors.authorsNode[siteLang]['table'] + " a");
        }
        authors = [];
        for (var m = 0; m < authorsNode.length; m++) {
            authors.push(authorsNode[m].innerText.trim().replace(/,/g, ""));
        }
    } else {
        // console.log("layout not found", product);
    }

    // Get price
    var price = 0;
    var paperbackPrice = parsed.find(selectors.paperbackPrice[siteLang]).text().match(/\d+((.|,)\d+)?/);
    var kindlePrice = parsed.find(selectors.kindlePrice[siteLang]).text().match(/\d+((.|,)\d+)?/);
    var spiralBoundPrice = parsed.find(selectors.spiralBoundPrice[siteLang]).text().match(/\d+((.|,)\d+)?/);
    var hardcoverPrice = parsed.find(selectors.hardcoverPrice[siteLang]).text().match(/\d+((.|,)\d+)?/);
    var mp3Price = parsed.find(selectors.mp3Price[siteLang]).text().match(/\d+((.|,)\d+)?/);
    var audiobookPrice = parsed.find(selectors.audiobookPrice[siteLang]).text().match(/\d+((.|,)\d+)?/);
    var insideBoxPrice = parsed.find(selectors.insideBoxPrice[siteLang]).text().match(/\d+((.|,)\d+)?/);
    if (paperbackPrice !== null) {
        price = paperbackPrice;
    } else if (kindlePrice !== null) {
        price = kindlePrice;
    } else if (spiralBoundPrice !== null) {
        price = spiralBoundPrice;
    } else if (hardcoverPrice !== null) {
        price = hardcoverPrice;
    } else if (mp3Price !== null) {
        price = mp3Price;
    } else if (audiobookPrice !== null) {
        price = audiobookPrice;
    } else if (insideBoxPrice !== null) {
        price = insideBoxPrice;
    }

    if (Array.isArray(price)) {
        price = price[0];
    }
    // console.log("price", price, product.link);
    // console.log("ratings", ratings, product.link);
    return {
        index: product.index,
        isSponsored: product.isSponsored,
        title: title,
        authors: authors.join("-"),
        itemWeight: itemWeight ? itemWeight : 0,
        bsr: bsr ? parseFloat(bsr.replace(",", "").replace(".", "")) : 0,
        bsrHTML: bsrHTML,
        paperback: paperback ? paperback.replace(",", "").replace(".", "") : "",
        isbn10: isbn10 ? isbn10 : "",
        seller: seller,
        size: productDimensions,
        ratings: ratings ? parseInt(ratings.replace(",", "").replace(".", "")) : 0,
        price: parseFloat(price.toString().replace(",", "."))
    };
}

/**
 * Render analysis table
 */
function renderAnalysisTable() {
    // Check domain hostname
    if (!Object.keys(validDomains).includes(hostname)) {
        return;
    }

    // Check is on search page
    const urlParams = new URLSearchParams(window.location.search);
    var haskeyword = urlParams.get('k');

    if (haskeyword == null) {
        return;
    }

    chrome.storage.local.get(uniqueId + "_isEnable", function (data) {
        if (data[uniqueId + "_isEnable"] !== undefined && (data[uniqueId + "_isEnable"] == "false" || data[uniqueId + "_isEnable"] == false)) {
            return;
        }

        // console.log("msg.isEnable get", data);

        // Render loading
        renderLoadingTable();

        setTimeout(function () {
            // Get product urls
            var products = getProductUrls();
            if (products.length <= 0) {
                return;
            }

            var productDetails = [];
            var promises = [];
            Object.keys(products).forEach(function (i) {
                if (!products[i].isSponsored) {
                    promises.push(
                        // HTTP request to get product details
                        $.get(products[i].link, function (html) {
                            productDetails.push(parseProductHTML(products[i], html));
                        })
                            .fail(function (error) {
                                // console.log("error", error);
                            })
                    );
                } else {

                    // Create sponsored product box
                    setTimeout(function () {
                        // add product details
                        let product = document.querySelector('.s-main-slot.s-result-list [data-index="' + products[i].index + '"] .rush-component:nth-child(2)');
                        if (!product) {
                            product = document.querySelector('.s-main-slot.s-result-list [data-index="' + products[i].index + '"] .s-include-content-margin.s-border-bottom.s-latency-cf-section');
                        }

                        // console.log("sponsored item", '.s-main-slot.s-result-list [data-index="' + products[i].index + '"] .rush-component:nth-child(2)');
                        if (product) {
                            let details = document.createElement("div");
                            details.style.border = "3px solid black";
                            details.style.margin = "5px";
                            details.style.padding = "5px";
                            details.innerHTML = '<div>This is a Sponsored Product. Only organic results used for algorithm.</div>';
                            product.prepend(details);
                        }
                    }, 2000);
                }
            });

            // Done all promise
            Promise.all(promises)
                .then(function () {
                    // render nav bar table
                    // console.log(productDetails);
                    renderTable(productDetails);
                });
        }, 2000);
    });
}

// Render main table
renderAnalysisTable();

// event based on ajax request
if (Object.keys(validDomains).includes(hostname)) {
    var oldLocation = location.href;
    setInterval(function () {
        if (location.href !== oldLocation) {
            // do your action
            oldLocation = location.href
            document.getElementById(uniqueId).remove();

            // Render main table
            renderAnalysisTable();
        }
    }, 1000);
}

// chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
//     chrome.storage.local.set({
//         [uniqueId + "_isEnable"]: msg.isEnable
//     }, function () {
//         if (chrome.runtime.lastError) {
//             console.log("Error Storing 2: ", chrome.runtime.lastError.message);
//         }
//
//         location.reload();
//     });
// });


// Kdp Huge search results

// var hostname = window.location.hostname;
// var uniqueId = "amazon-search-" + chrome.runtime.id;
//
// var validDomains = {
//     "www.amazon.com": "english",
//     "www.amazon.co.uk": "english",
//     "www.amazon.com.au": "english",
//     "www.amazon.ca": "canadian",
//     "www.amazon.es": "estonia",
//     "www.amazon.it": "italian",
//     "www.amazon.de": "germani",
//     "www.amazon.fr": "french"
// };

/**
 * Create and download excel file
 * @param {*} productDetails
 */
function createExcelFile(keywords) {
    var createXLSLFormatObj = [];

    /* XLS Head Columns */
    var xlsHeader = ["Keywords"];

    console.log("before", keywords);
    /* XLS Rows Data */
    var xlsRows = Object.keys(keywords).map(function (key) {
        return {
            "Keywords": keywords[key].value
        };
    });
    console.log("after", xlsRows);

    createXLSLFormatObj.push(xlsHeader);
    $.each(xlsRows, function (index, value) {
        var innerRowData = [];
        $.each(value, function (ind, val) {

            innerRowData.push(val);
        });
        createXLSLFormatObj.push(innerRowData);
    });


    /* File Name */
    var filename = "keywords.xlsx";

    /* Sheet Name */
    var ws_name = "keywords";

    if (typeof console !== 'undefined') console.log(new Date());
    var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);

    /* Add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws, ws_name);

    /* Write workbook and Download */
    if (typeof console !== 'undefined') console.log(new Date());
    XLSX.writeFile(wb, filename);
    if (typeof console !== 'undefined') console.log(new Date());
}

/**
 * Render analysis table
 * @param {*} avgBSR
 * @param {*} nicheScore
 * @param {*} avgReviews
 * @param {*} avgPrice
 */
function renderList(firstSuggestions, recommendedKeywords) {
    let style = document.createElement('style');
    let stylePrefix = chrome.runtime.id;
    style.innerText = `\
    #${stylePrefix}-list-wrapper {\
      position: absolute;\
      width: 99%;\
      transform: translate(-50%, 0);\
      left: 50%;\
      z-index: 999999999999;\
      top: -11px;\
      overflow: hidden;\
      background: #fff;\
      border: 1px solid #bbb;\
      box-sizing: border-box;\
      -moz-box-sizing: border-box;\
      -webkit-box-sizing: border-box;\
      margin: 0;\
      -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.13);\
      -moz-box-shadow: 0 2px 4px 0 rgba(0,0,0,.13);\
      box-shadow: 0 2px 4px 0 rgba(0,0,0,.13);\
      -ms-user-select: none;\
      zoom: 1;\
      font-size: 13px;\
      font-family: inherit;\
      line-height: normal;\
      max-height: 450px;\
    }\
\
    #${stylePrefix}-list-wrapper ul {\
      margin: 0;\
      display: flex;\
      flex-wrap: wrap;\
    }\
\
    #${stylePrefix}-list-wrapper ul li {\
      list-style: none;\
      cursor: pointer;\
      width: 25%;\
      cursor: pointer;\
    }\
\
    #${stylePrefix}-list-wrapper ul li a {\
      font-family: "Amazon Ember",Arial,sans-serif;\
      font-size: 16px;\
      color: #000;\
      padding: 8px 10px;\
      font-size: 16px;\
      font-family: "Amazon Ember";\
      cursor: pointer;\
      width: 100%;\
      display: table;\
      text-decoration: none;\
      cursor: pointer;\
    }\
\
    #${stylePrefix}-list-wrapper ul li:hover a {\
      background-color: #eee;\
    }\
\
    #${stylePrefix}-list-wrapper table {\
      margin-top: 20px;\
      position: absolute;\
      bottom: 0;\
    }\
\
    #${stylePrefix}-list-wrapper table tr td {\
      vertical-align: middle;\
      background-color: #24282d;\
      border: 1px solid #fff;\
      padding: 9px 13px;\
      text-align: center;\
      line-height: 2.5;\
    }\
\
    #${stylePrefix}-first-suggestions {\
      border: 1px solid #ddd;\
      padding: 25px 0;\
      margin-bottom: 10px;\
      position: relative;\
    }\
\
    #${stylePrefix}-first-suggestions span {\
      position: absolute;\
      top: 0;\
      background: #ddd;\
      padding: 4px 10px;\
      border-bottom-right-radius: 5px;\
    }\
\
    #${stylePrefix}-list-scroll {\
      max-height: 450px;\
      overflow: scroll;\
      padding-bottom: 95px;\
    }\
\
    #${stylePrefix}-additional-suggestions {\
      border: 1px solid #ddd;\
      padding: 25px 0;\
      margin-bottom: 10px;\
      position: relative;\
    }\
\
    #${stylePrefix}-additional-suggestions span {\
      position: absolute;\
      top: 0;\
      background: #ddd;\
      padding: 4px 10px;\
      border-bottom-right-radius: 5px;\
    }\
  `;
    document.getElementsByTagName('head')[0].appendChild(style);

    if (document.getElementById(`${stylePrefix}-list-wrapper`)) {
        document.getElementById(`${stylePrefix}-list-wrapper`).remove();
    }

    $("#nav-flyout-iss-anchor").prepend(`
    <div id="${stylePrefix}-list-wrapper">
        <div id="${stylePrefix}-list-scroll">
          <ul id="${stylePrefix}-first-suggestions">
            <span>Primary Amazon Suggestions</span>
            ${Object.keys(firstSuggestions).map((key) => {
        const item = firstSuggestions[key];
        return `<li><a href="#" onClick="(function(){document.getElementById('${stylePrefix}-list-wrapper').remove(); window.location = '${item.link}';return false;})();return false;">${item.value}</a></li>`;
    }).join("")}
          </ul>
          <ul id="${stylePrefix}-additional-suggestions">
            <span>Additional Amazon Suggestions</span>
            ${Object.keys(recommendedKeywords).map((key) => {
        const item = recommendedKeywords[key];
        return `<li><a href="#" onClick="(function(){document.getElementById('${stylePrefix}-list-wrapper').remove(); window.location = '${item.link}';return false;})();return false;">${item.value}</a></li>`;
    }).join("")}
          </ul>
        </div>
        <table>
          <tr>
            <td>
              <img src="chrome-extension://${chrome.runtime.id}/images/publishing.png" width="250px">
            </td>
            <td>
              <div style="text-align: center;">
                <a href="javascript: void(0)" id="download_excel_file_${chrome.runtime.id}" style="color: white">Download Suggested Keywords</a>
              </div>
            </td>
            <td>
              <div style="text-align: center;">
                <a href="https://chrome.google.com/webstore/detail/kdp-amazon-bsr-keyword-re/eefljgmhgaidffapnppcmmafobefjece?hl=en-US" id="download_excel_file_${chrome.runtime.id}" style="color: white">
                  <div>
                    <span>
                      Get Free Amazon / KDP Niche Research Extension
                    </span>
                    <span>
                      <img src="chrome-extension://${chrome.runtime.id}/images/logo.png" style="width: 25px; margin: 4px 10px;">
                    </span>
                  </div>
                  <span>
                    (Keyword Score, Book Data, Averages, BSR & More)
                  </span>
                </a>
              </div>
            </td>
            <td>
              <a href="https://www.facebook.com/groups/2690865597847008" style="color: white">
                <span>Join Facebook Group for Help</span>
                <span>
                  <img src="chrome-extension://${chrome.runtime.id}/images/bullhorn-solid.png" style="width: 23px; margin: 6px 10px;">
                </span>
              </a>
            </td>
            <td>
              <a href="https://selfpublishingtitans.com/" style="color: white">
                <span>Go to Website for more Free Tools</span>
                <span><img src="chrome-extension://${chrome.runtime.id}/images/home-solid.png" style="width: 18px; margin: 4px 10px;"></span>
              </a>
            </td>
          </tr>
        </table>
    </div>
  `);

    $("#download_excel_file_" + chrome.runtime.id).click(function () {
        createExcelFile([...firstSuggestions, ...recommendedKeywords]);
    });

    $(document).click(function (event) {
        var $target = $(event.target);
        if (!$target.closest(`#${stylePrefix}-list-wrapper`).length &&
            $(`#${stylePrefix}-list-wrapper`).is(":visible")) {
            $(`#${stylePrefix}-list-wrapper`).hide();
        }
    });
}

/**
 * Get variables from page
 * @param {*} variables
 */
function retrieveWindowVariables(variables) {
    var ret = {};

    var scriptContent = "";
    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        scriptContent += "if (typeof " + currVariable + " !== 'undefined') document.getElementsByTagName('body')[0].setAttribute('tmp_" + currVariable + "', " + currVariable + ");\n"
    }

    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);

    for (var i = 0; i < variables.length; i++) {
        var currVariable = variables[i];
        ret[currVariable] = document.getElementsByTagName('body')[0].getAttribute("tmp_" + currVariable);
        document.getElementsByTagName('body')[0].removeAttribute("tmp_" + currVariable);
    }

    document.getElementById("tmpScript").remove();

    return ret;
}

/**
 * Render analysis table
 */
function renderAnalysisTableHUGE() {
    // Check domain hostname
    if (!Object.keys(validDomains).includes(hostname)) {
        return;
    }

    chrome.storage.local.get(uniqueId + "_isEnable", function (data) {
        if (data[uniqueId + "_isEnable"] !== undefined && (data[uniqueId + "_isEnable"] == "false" || data[uniqueId + "_isEnable"] == false)) {
            return;
        }

        // console.log("test", data[uniqueId + "_isEnable"]);

        var timer;
        $("#twotabsearchtextbox").on("keyup", function () {
            var searchedText = $(this).val().trim();

            clearInterval(timer);
            timer = setTimeout(function () {
                // console.log('User finished typing !!', searchedText);

                let keywords = [];
                let keywordsElemenets = $("#nav-flyout-searchAjax #suggestions-template #suggestions div");
                for (var i = 0; i < keywordsElemenets.length; ++i) {
                    let keywordElement = keywordsElemenets[i];
                    const keyword = $(keywordElement).data("keyword");
                    const crid = $(keywordElement).data("crid");
                    const refTag = $(keywordElement).data("reftag");

                    if (keywords.filter(item => item.value == keyword.value).length <= 0) {
                        keywords.push({
                            value: keyword,
                            link: `https://${hostname}/s?k=${keyword.replace(/ /g, "+")}&crid=${crid}&sprefix=${searchedText.replace(/ /g, "+")}&ref=${refTag}`
                        });
                    }
                }

                if (keywords.length > 0) {
                    let promises = [];
                    let recommendedKeywords = [];
                    var variables = retrieveWindowVariables(["ue_mid", "ue_id", "ue_sid"]);


                    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
                    for (let i = 0; i <= chars.length; i++) {
                        const mid = variables.ue_mid;
                        const requestId = variables.ue_id;
                        const sessionId = variables.ue_sid;
                        const alias = "aps";
                        const prefix = `${searchedText} ${chars[i]}`;
                        const limit = 11;
                        let link = `https://completion.${hostname.replace("www.", "")}/api/2017/suggestions?session-id=${sessionId}&request-id=${requestId}&mid=${mid}&alias=${alias}&prefix=${prefix}&limit=${limit}`;

                        promises.push(
                            // HTTP request to get product details
                            $.get(link, function (res) {

                                // console.log({
                                //   prefix,
                                //   suggestions: res.suggestions.map(keyword => keyword.value)
                                // });

                                res.suggestions.forEach(keyword => {
                                    if (
                                        recommendedKeywords.filter(item => item.value == keyword.value).length <= 0 &&
                                        keywords.filter(item => item.value == keyword.value).length <= 0
                                    ) {
                                        recommendedKeywords.push({
                                            value: keyword.value,
                                            link: `https://${hostname}/s?k=${keyword.value.replace(/ /g, "+")}&crid=${res.responseId}&sprefix=${res.prefix.replace(/ /g, "+")}&ref=${keyword.refTag}`
                                        });
                                    }
                                });
                            })
                                .fail(function (error) {
                                    // console.log("error", error);
                                })
                        );
                    }

                    // Done all promise
                    Promise.all(promises)
                        .then(function () {
                            renderList(keywords, recommendedKeywords);
                        });
                }
            }, 1000);
        });
    });
}

try {
    renderAnalysisTableHUGE();
} catch (error) {
    // console.log("catch", error);
}


// overlay

function overlay() {
    // overlay {
    //     position: fixed; /* Sit on top of the page content */
    //     display: none; /* Hidden by default */
    //     width: 100%; /* Full width (cover the whole page) */
    //     height: 100%; /* Full height (cover the whole page) */
    //     top: 0;
    //     left: 0;
    //     right: 0;
    //     bottom: 0;
    //     background-color: rgba(0,0,0,0.5); /* Black background with opacity */
    //     z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
    //     cursor: pointer; /* Add a pointer on hover */
    // }

    if (!Object.keys(validDomains).includes(hostname)) {
        return;
    }

    chrome.runtime.onMessage.addListener(
        function (msg) {
            console.log(msg)
        }
    )

}

// var port = chrome.runtime.connect();
//
// window.addEventListener("message", function(event) {
//     // We only accept messages from ourselves
//     // if (event.source != window)
//     //     return;
//
//     if (event.data.type && (event.data.type == "FROM_PAGE")) {
//         console.log("Content script received: " + event.data.text);
//         port.postMessage(event.data.text);
//     }
// }, false);


try {
    overlay();
} catch (error) {
    // console.log("catch", error);
}



chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {

    if (msg.advanceKeyword === 'true') {

        let aPage = document.getElementById('nav-belt')
        var div = document.createElement("div");
        div.style.width = "1000px";
        div.style.height = "1000px";
        div.innerHTML = `<div id='overlay' class="card">
  <div class="navbar">
    <p>Advance keyword Research</p>
    <button class="close-btn" id="close-btn">X</button>
  </div>
  

  
<table>
  <tr>
    <th>Keyword Niche Score</th>
    <th>Number of Results</th>
    <th>Average BSR</th>
     <th>Average Reviews</th>
     <th>Average Price</th>
     <th>Estimated Sales</th>
     <th>Estimated Search Volume</th>
  </tr>
  <tr>
    <td>67%</td>
    <td>23,454</td>
    <td>64,322</td>
    <td>64,322</td>
    <td>64,322</td>
    <td>64,322</td>
    <td>64,322</td>
  </tr>
  
</table>
  
  
<!-- <div class="grid-container">
  <div class="grid-item">1</div>
  <div class="grid-item">2</div>
  <div class="grid-item">3</div>  
  <div class="grid-item">4</div>
  <div class="grid-item">5</div>
  <div class="grid-item">6</div>  
  <div class="grid-item">7</div>

  <div class="grid-item">9</div>  
</div> -->
</div>`;
        document.body.appendChild(div);
        document.getElementById("overlay").style.display = "block";
        document.getElementById('close-btn').onclick= function(){
            console.log('close')
            document.getElementById("overlay").style.display = "none";
        }

        console.log(msg)
    } else {
        // console.log('Runnig')
        chrome.storage.local.set({
            [uniqueId + "_isEnable"]: msg.isEnable
        }, function () {
            if (chrome.runtime.lastError) {
                console.log("Error Storing 2: ", chrome.runtime.lastError.message);
            }

            location.reload();
        });
    }

});
