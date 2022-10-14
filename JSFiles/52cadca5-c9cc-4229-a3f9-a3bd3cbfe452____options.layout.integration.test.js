const puppeteer = require("puppeteer");

jest.setTimeout(20000);

//                              //
//  Options Menu Layout Tests   //
//                              //

describe("> Options and Layout Integration Tests", () => {

       /* Integration Test 
       //
       // Testing Function: popup.html document, content-layout.js, content-update.js
       //
       // Objective: To verify that turning ON the ON/OFF button 
       //            reformats the YouTube Home Page
       //
       // Assumptions: The button is ON
       //
       // Function Input: click()
       //
       // Expected Effect: The home page is reformatted 
       //
       */

    describe("OS1-IT2: Integration Test - Options ON Homepage Reformatted", () => {

        let browser;
        let page;
        let youTubeHomePage;

        beforeAll(async function () {

            browser = await puppeteer.launch({
                headless: false,
                args: [
                    "--disable-extensions-except=" + require("path").resolve("../src"),
                    "--load-extension=" + require("path").resolve("../src")]
            });

            // loading the chrome extension popup
            const extensionName = "Rebuilding the Web: Media and Video"
            const targets = await browser.targets();
            const extensionTarget = targets.find(({ _targetInfo }) => {
                return _targetInfo.title === extensionName && _targetInfo.type === 'background_page';
            });

            const extensionUrl = extensionTarget._targetInfo.url || '';
            const [, , extensionID] = extensionUrl.split('/');

            const extensionPopupHtml = 'popup.html'

            page = await browser.newPage();

            // going to chrome extension popup menu
            await page.goto(`chrome-extension://${extensionID}/${extensionPopupHtml}`);

            youTubeHomePage = await browser.newPage();
            await youTubeHomePage.goto("https://www.youtube.com");

            // emulate user toggling off the ON/OFF button  
            selector = '#big-button';
            await page.waitForSelector(selector);
            await page.evaluate((selector) => document.querySelector(selector).click(), selector);

            // emulate user toggling on the ON/OFF button  
            selector = '#big-button';
            await page.waitForSelector(selector);
            await page.evaluate((selector) => document.querySelector(selector).click(), selector);
            // by default, the ON/OFF button is ON 

        });

        afterAll(async function () {
            await page.close();
            await browser.close();
        });

       /* Requirements: OS1 and LT1
       //
       // Testing Function: popup.html document, content-layout.js, content-update.js
       //
       // Objective: To verify that turning ON the the ON/OFF button 
       //            resizes the YouTube logo on the YouTube home page 
       //
       // Assumptions: The switch is by default turned on 
       //
       // Function Input: click()
       //
       // Expected Effect: YouTube logo is resized to height 90px and width 300px
       //
       */

        test("INTEGRATION: ON changes home page YouTube icon size", async () => {

            // LT1T1: checking YouTube Icon Resized 

            const height = await youTubeHomePage.$eval(
                "#logo-icon-container.yt-icon-container.style-scope.ytd-topbar-logo-renderer",
                e => getComputedStyle(e).height
            );

            expect(height).toBe('90px');

            const width = await youTubeHomePage.$eval(
                "#logo-icon-container.yt-icon-container.style-scope.ytd-topbar-logo-renderer",
                e => getComputedStyle(e).width
            );

            expect(width).toBe('300px');

        })

       /* Requirements: OS1 and LT1
       //
       // Testing Function: popup.html document, content-layout.js, content-update.js
       //
       // Objective: To verify that turning ON the the ON/OFF button 
       //            repositions the YouTube icon on the YouTube home page 
       //
       // Assumptions: The switch is by default turned on 
       //
       // Function Input: click()
       //
       // Expected Effect: YouTube logo is positioned in the middle of the screen
       //
       */

        test("INTEGRATION: ON changes home page YouTube icon position", async () => {
            // by default, the ON/OFF button is ON 
            // LT1T2: checking YouTube Icon position
            const top = await youTubeHomePage.$eval(
                ".youtube-logo",
                e => e.style.top
            );

            expect(top).toBe('25%');

            const left = await youTubeHomePage.$eval(
                ".youtube-logo",
                e => e.style.left
            );

            expect(left).toBe('37%');

        });

       /* Requirements: OS1 and LT1
       //
       // Testing Function: popup.html document, content-layout.js, content-update.js
       //
       // Objective: To verify that turning ON the the ON/OFF button 
       //            resizes the search bar 
       //
       // Assumptions: The switch is by default turned on 
       //
       // Function Input: click()
       //
       // Expected Effect: Search bar is resized on the YouTube home page 
       //
       */

        test("INTEGRATION: Search bar size changed", async () => {
            // by default, the ON/OFF button is ON 

            // LT1T3: checking search bar size 
            const width = await youTubeHomePage.$eval(
                ".google-style",
                e => getComputedStyle(e).width
            );

            expect(width).toBe('500px');

        });

       /* Requirements: OS1 and LT1
       //
       // Testing Function: popup.html document, content-layout.js, content-update.js
       //
       // Objective: To verify that turning ON the the ON/OFF button 
       //            repositions the search bar 
       //
       // Assumptions: The switch is by default turned on 
       //
       // Function Input: click()
       //
       // Expected Effect: YouTube search bar is repositioned to mimic Google layout
       //
       */

        test("INTEGRATION: Search bar repositioned", async () => {
            // by default, the ON/OFF button is ON 

            // LT1T4: checking search bar repositioned
            const top = await youTubeHomePage.$eval(
                ".google-style",
                e => e.style.top
            );

            expect(top).toBe('45%');

            const left = await youTubeHomePage.$eval(
                ".google-style",
                e => e.style.left
            );

            expect(left).toBe('30%');

        });

       /* Requirements: OS1 and LT1
       //
       // Testing Function: popup.html document, content-layout.js, content-update.js
       //
       // Objective: To verify that turning ON the the ON/OFF button 
       //            removes all recommended videos from the YouTube home page
       //
       // Assumptions: The switch is by default turned on 
       //
       // Function Input: click()
       //
       // Expected Effect: videoDisplay selector is equal to none 
       //
       */

        test("INTEGRATION: Recommended videos removed", async () => {
            // by default, the ON/OFF button is ON 

            // LT1T6: checking recommended videos removed 
            const videoDisplay = await youTubeHomePage.$eval(
                "ytd-two-column-browse-results-renderer",
                e => getComputedStyle(e).display
            );

            expect(videoDisplay).toBe('none');
        });

       /* Requirements: OS1 and LT1
       //
       // Testing Function: popup.html document, content-layout.js, content-update.js
       //
       // Objective: To verify that turning ON the the ON/OFF button 
       //            preserves the autofill functionality of the search bar 
       //
       // Assumptions: The switch is by default turned on 
       //
       // Function Input: click()
       //
       // Expected Effect: Autofill box pops up upon user input 
       //
       */

        test("INTEGRATION: Search bar autofill functionality preserved", async () => {
            // by default, the ON/OFF button is ON 

            // LT1T5: checking search bar autofill functionality preserved
            // emulate user typing into search bar
            await youTubeHomePage.type("#search", "cod");

            await youTubeHomePage.type("#search", "i");

            await youTubeHomePage.type("#search", "ng");

            await youTubeHomePage.type("#search", " ");

            await youTubeHomePage.type("#search", " ");

            await youTubeHomePage.waitFor(2000);

            // check popup attribute
            const searchSuggestions = await youTubeHomePage.$eval(
                "#search.ytd-searchbox",
                e => e.getAttribute("aria-haspopup")
            )

            // popup attribute should be true
            expect(searchSuggestions).toBe("true");
        });

       /* Requirements: OS1 and LT1
       //
       // Testing Function: popup.html document, content-layout.js, content-update.js
       //
       // Objective: To verify that turning ON the the ON/OFF button 
       //            preserves the search functionality of the search bar 
       //
       // Assumptions: The switch is by default turned on 
       //
       // Function Input: click()
       //
       // Expected Effect: Searching takes the user to the correct search results page
       //
       */

        test("INTEGRATION: Search bar results page functionality preserved", async () => {
            // by default, the ON/OFF button is ON 
            // click to see search results
            selector = "#search-icon-legacy.style-scope.ytd-searchbox";
            await youTubeHomePage.waitFor(selector);
            await youTubeHomePage.evaluate((selector) => document.querySelector(selector).click(), selector);

            // searching should take you to the search results page
            expect(youTubeHomePage.url()).toBe('https://www.youtube.com/results?search_query=coding++');

        });
    });

       /* Integration Test 
       //
       // Testing Function: popup.html document, content-layout.js, content-update.js
       //
       // Objective: To verify that turning OFF the ON/OFF button doesn't
       //            reformat the YouTube Home Page
       //
       // Assumptions: The button is OFF
       //
       // Function Input: click()
       //
       // Expected Effect: The home page is not reformatted 
       //
       */

    describe("OS1-IT3: Integration Test - Options OFF Homepage Unchanged", () => {

        let browser;
        let page;
        let youTubeHomePage;

        beforeAll(async function () {

            browser = await puppeteer.launch({
                headless: false,
                args: [
                    "--disable-extensions-except=" + require("path").resolve("../src"),
                    "--load-extension=" + require("path").resolve("../src")]
            });

            // loading the chrome extension popup
            const extensionName = "Rebuilding the Web: Media and Video"
            const targets = await browser.targets();
            const extensionTarget = targets.find(({ _targetInfo }) => {
                return _targetInfo.title === extensionName && _targetInfo.type === 'background_page';
            });

            const extensionUrl = extensionTarget._targetInfo.url || '';
            const [, , extensionID] = extensionUrl.split('/');

            const extensionPopupHtml = 'popup.html'

            page = await browser.newPage();

            // going to chrome extension popup menu
            await page.goto(`chrome-extension://${extensionID}/${extensionPopupHtml}`);

            youTubeHomePage = await browser.newPage();
            await youTubeHomePage.goto("https://www.youtube.com");

            // emulate user toggling off the ON/OFF button  
            selector = '#big-button';
            await page.waitForSelector(selector);
            await page.evaluate((selector) => document.querySelector(selector).click(), selector);
            // by default, the ON/OFF button is ON 

        });

        afterAll(async function () {
            await page.close();
            await browser.close();
        });

       /* Requirements: OS1 and LT1
       //
       // Testing Function: popup.html document, content-layout.js, content-update.js
       //
       // Objective: To verify that turning OFF the the ON/OFF button 
       //            displays the recommended videos on the YouTube home page 
       //
       // Assumptions: The switch is by default turned on 
       //
       // Function Input: click()
       //
       // Expected Effect: originalDisplay selector doesn't change 
       //
       */

        test("INTEGRATION: Recommended videos not removed", async () => {
            const originalDisplay = await youTubeHomePage.$eval(
                "ytd-two-column-browse-results-renderer",
                e => getComputedStyle(e).display
            );

            const videoDisplay = await youTubeHomePage.$eval(
                "ytd-two-column-browse-results-renderer",
                e => getComputedStyle(e).display
            );

            expect(videoDisplay).toBe(originalDisplay);
        });
    });


   /* Integration Test 
   //
   // Testing Function: popup.html document, content-layout.js, content-update.js
   //
   // Objective: To verify that turning ON the ON/OFF button 
   //            reformats the YouTube Video Page
   //
   // Assumptions: The button is ON
   //
   // Function Input: click()
   //
   // Expected Effect: The video page is reformatted
   //
   */

    describe("OS1-IT2: Integration Test - Options ON Video Page Reformatted", () => {

        let browser;
        let page;
        let youTubeVideoPage;

        beforeAll(async function () {

            browser = await puppeteer.launch({
                headless: false,
                args: [
                    "--disable-extensions-except=" + require("path").resolve("../src"),
                    "--load-extension=" + require("path").resolve("../src")]
            });

            // loading the chrome extension popup
            const extensionName = "Rebuilding the Web: Media and Video"
            const targets = await browser.targets();
            const extensionTarget = targets.find(({ _targetInfo }) => {
                return _targetInfo.title === extensionName && _targetInfo.type === 'background_page';
            });

            const extensionUrl = extensionTarget._targetInfo.url || '';
            const [, , extensionID] = extensionUrl.split('/');

            const extensionPopupHtml = 'popup.html'

            page = await browser.newPage();

            // going to chrome extension popup menu
            await page.goto(`chrome-extension://${extensionID}/${extensionPopupHtml}`);

            // emulate user toggling off the ON/OFF button  
            selector = '#big-button';
            await page.waitForSelector(selector);
            await page.evaluate((selector) => document.querySelector(selector).click(), selector);

            // emulate user toggling off the ON/OFF button  
            selector = '#big-button';
            await page.waitForSelector(selector);
            await page.evaluate((selector) => document.querySelector(selector).click(), selector);

            youTubeVideoPage = await browser.newPage();
            await youTubeVideoPage.goto("https://www.youtube.com/watch?v=UMKWijxv0kE&t=6s");

        });

        afterAll(async function () {
            await page.close();
            await browser.close();
        });

       /* Requirements: OS1 and LT3
       //
       // Testing Function: popup.html document, content-layout.js, content-update.js
       //
       // Objective: To verify that turning ON the the ON/OFF button 
       //            moves the description in the video viewing page 
       //
       // Assumptions: The switch is by default turned on 
       //
       // Function Input: click()
       //
       // Expected Effect: description is moved on top of the secondary column
       //
       */

        test("INTEGRATION: ON moves description on top of recommended videos", async () => {
            await youTubeVideoPage.setViewport({ width: 1366, height: 768 });

            await youTubeVideoPage.waitForSelector("ytd-expander.style-scope.ytd-video-secondary-info-renderer");
            await youTubeVideoPage.waitForSelector("#meta.style-scope.ytd-watch-flexy");
            await youTubeVideoPage.waitForSelector("#secondary");
            await youTubeVideoPage.waitForSelector("ytd-video-secondary-info-renderer");

            let changeOccurred = await youTubeVideoPage.evaluate(() => {
                return document.querySelector("#meta.style-scope.ytd-watch-flexy").parentNode.id == "secondary";
            });

            expect(changeOccurred).toBe(true);
        });

       /* Requirements: OS1 and LT2
       //
       // Testing Function: popup.html document, content-layout.js, content-update.js
       //
       // Objective: To verify that turning ON the the ON/OFF button 
       //            preserves the functionality of the recommended videos
       //
       // Assumptions: The switch is by default turned on 
       //
       // Function Input: click()
       //
       // Expected Effect: clicking a video in the recommended videos list 
       //                  takes the user to a different video
       //
       */

        test("INTEGRATION: recommended video functionality preserved", async () => {
            // emulate user clicking on another video in recommendations column
            let selector = "#thumbnail.yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail";
            await youTubeVideoPage.waitFor(selector);
            await youTubeVideoPage.click(selector);

            await youTubeVideoPage.waitFor(2000);

            // page changes to another watch page
            expect(youTubeVideoPage.url()).not.toBe("https://www.youtube.com/watch?v=UMKWijxv0kE&t=6s");

            // the new page is a YouTube watch page
            expect(youTubeVideoPage.url()).toMatch(/watch/);
        });

       /* Requirements: OS1 and LT3
       //
       // Testing Function: popup.html document, content-layout.js, content-update.js
       //
       // Objective: To verify that turning ON the the ON/OFF button 
       //            preserves the 'show more' functionality of the description box
       //
       // Assumptions: The switch is by default turned on 
       //
       // Function Input: click()
       //
       // Expected Effect: pressing 'show more' uncollapses description 
       //
       */

        test("INTEGRATION: description 'show more' functionality preserved", async () => {
            await youTubeVideoPage.waitFor("#meta.style-scope.ytd-watch-flexy");

            // Check the description is currently in collapsed form
            const normalDescription = await youTubeVideoPage.$eval(
                "ytd-expander.style-scope.ytd-video-secondary-info-renderer",
                e => e.hasAttribute("collapsed")
            );
            expect(normalDescription).toBe(true);

            // emulate clicking on 'show more' button
            let selector = "#more.style-scope.ytd-expander";
            await youTubeVideoPage.waitFor(selector);
            await youTubeVideoPage.click(selector);
           
            await youTubeVideoPage.waitFor(2000);

            // check that description is no longer in collapsed form
            const expandedDescription = await youTubeVideoPage.$eval(
                "ytd-expander.style-scope.ytd-video-secondary-info-renderer",
                e => e.hasAttribute("collapsed")
            );
            expect(expandedDescription).toBe(false);
        });

       /* Requirements: OS1 and LT3
       //
       // Testing Function: popup.html document, content-layout.js, content-update.js
       //
       // Objective: To verify that turning ON the the ON/OFF button 
       //            preserves the 'show less' functionality of the description box
       //
       // Assumptions: The switch is by default turned on 
       //
       // Function Input: click()
       //
       // Expected Effect: pressing 'show less' collapses description 
       //
       */

        test("INTEGRATION: description 'show less' functionality preserved", async () => {

            // emulate clicking on 'show less' button
            selector = "#less.style-scope.ytd-expander";
            await youTubeVideoPage.waitFor(selector);
            await youTubeVideoPage.evaluate((selector) => document.querySelector(selector).click(), selector);

            await youTubeVideoPage.waitFor(2000);

            // check that description is in collapsed form
            const normalDescription = await youTubeVideoPage.$eval(
                "ytd-expander.style-scope.ytd-video-secondary-info-renderer",
                e => e.hasAttribute("collapsed")
            );
            expect(normalDescription).toBe(true);

        });
    });

   /* Integration Test 
   //
   // Testing Function: popup.html document, content-layout.js, content-update.js
   //
   // Objective: To verify that turning OFF the ON/OFF button doesn't
   //            reformat the YouTube Video Page
   //
   // Assumptions: The button is OFF
   //
   // Function Input: click()
   //
   // Expected Effect: The video page is not reformatted and the description is not moved
   //
   */

  describe("OS1-IT3: Integration Test - Options OFF Video Page Not Reformatted", () => {

    let browser;
    let page;
    let youTubeVideoPage;

    beforeAll(async function () {

        browser = await puppeteer.launch({
            headless: false,
            args: [
                "--disable-extensions-except=" + require("path").resolve("../src"),
                "--load-extension=" + require("path").resolve("../src")]
        });

        // loading the chrome extension popup
        const extensionName = "Rebuilding the Web: Media and Video"
        const targets = await browser.targets();
        const extensionTarget = targets.find(({ _targetInfo }) => {
            return _targetInfo.title === extensionName && _targetInfo.type === 'background_page';
        });

        const extensionUrl = extensionTarget._targetInfo.url || '';
        const [, , extensionID] = extensionUrl.split('/');

        const extensionPopupHtml = 'popup.html'

        page = await browser.newPage();

        // going to chrome extension popup menu
        await page.goto(`chrome-extension://${extensionID}/${extensionPopupHtml}`);

         // emulate user toggling off the ON/OFF button  
         selector = '#big-button';
         await page.waitForSelector(selector);
         await page.evaluate((selector) => document.querySelector(selector).click(), selector);
         // by default, the ON/OFF button is ON 

        youTubeVideoPage = await browser.newPage();
        await youTubeVideoPage.goto("https://www.youtube.com/watch?v=UMKWijxv0kE&t=6s");

    });

    afterAll(async function () {
        await page.close();
        await browser.close();
    });

       /* Requirements: OS1 and LT3
       //
       // Testing Function: popup.html document, content-layout.js, content-update.js
       //
       // Objective: To verify that turning OFF the the ON/OFF button 
       //            makes no changes to the positioning of the video description 
       //
       // Assumptions: The switch is by default turned on 
       //
       // Function Input: click()
       //
       // Expected Effect: description is not moved on top of the secondary column
       //
       */

    test("INTEGRATION: OFF does not move description", async () => {
        await youTubeVideoPage.setViewport({ width: 1366, height: 768 });

        await youTubeVideoPage.waitForSelector("ytd-expander.style-scope.ytd-video-secondary-info-renderer");
        await youTubeVideoPage.waitForSelector("#meta.style-scope.ytd-watch-flexy");
        await youTubeVideoPage.waitForSelector("#secondary");
        await youTubeVideoPage.waitForSelector("ytd-video-secondary-info-renderer");

        let changeOccured = await youTubeVideoPage.evaluate(() => {
            return document.querySelector("#meta.style-scope.ytd-watch-flexy").parentNode.id == "secondary";
        });

        expect(changeOccured).toBe(false);
    });
});
});