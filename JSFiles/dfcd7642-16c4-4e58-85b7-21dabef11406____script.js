localStorage.csMoneyHelperExtensionID = chrome.runtime.id;

function addJS_Node(textContent, src, funcToRun, runOnLoad) {
	let scriptNode = document.createElement('script');
	scriptNode.type = "text/javascript";
	if (runOnLoad) scriptNode.addEventListener("load", runOnLoad, false);
	if (textContent) scriptNode.textContent = textContent;
	if (src) scriptNode.src = src;
	if (funcToRun) scriptNode.textContent += '(' + funcToRun.toString() + ')()';

	let target = document.getElementsByTagName('head')[0] || document.body || document.documentElement;
	target.insertAdjacentElement('afterBegin', scriptNode);
}

window.addEventListener('message', function(e) {
	if (e.data.csMoneyHelperExtensionID === localStorage.csMoneyHelperExtensionID) {
		chrome.runtime.sendMessage(chrome.runtime.id, e.data, function(body) {
			window.postMessage({
				target: e.data.target + '_answer',
				body
			}, '*');
		});
	}
});

(() => {
	async function init() {
        if (window.location.host === 'old.cs.money') return;
        const offerInventoryEvent = new Event('offerInventoryChange');
        function isJson(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
        function isIterable(value) {
            return Symbol.iterator in Object(value);
        }
        function getTimeRemaining(endTime) {
            let total = Date.parse(endTime) - new Date().getTime();
            let seconds = Math.floor((total / 1000) % 60);
            let minutes = Math.floor((total / 1000 / 60) % 60);
            let hours = Math.floor((total / (1000 * 60 * 60)) % 24);
            return { total, hours, minutes, seconds }
        }
        function initializeClock(selector, callback) {
            let clock = document.querySelector(selector);
            let hoursSpan = clock.querySelector('.hours');
            let minutesSpan = clock.querySelector('.minutes');
            let secondsSpan = clock.querySelector('.seconds');
            let endTime = new Date(+clock.dataset.deadline);
            function updateClock() {
                let t = getTimeRemaining(endTime);
                if (t.total <= 0 || !hoursSpan || !minutesSpan || !secondsSpan) {
                    clearInterval(timeInterval);
                    callback();
                } else {
                    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
                    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
                    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
                }
            }
            updateClock();
            let timeInterval = setInterval(updateClock, 1000);
        }
        class customInventory {
            constructor() {
                this.inventory = [];
                this.history = {};
                this.loaded = false;
                this.contextItem = null;
                this.contextMenuPopup = null;
            }
            add(items){
                this.loaded = true;
                if (isIterable(items)) {
                    this.inventory = [...new Set([...this.inventory, ...items])];
                } else {
                    this.inventory.push(items);
                }
            }
            unshift(items){
                this.loaded = true;
                if (isIterable(items)) {
                    this.inventory = [...new Set([...items, ...this.inventory])];
                } else {
                    this.inventory.unshift(items);
                }
            }
            upgrade(items){
                if (!this.inventory){
                    this.set(items);
                } else {
                    this.add(items);
                }
            }
            set(data){
                this.loaded = true;
                this.inventory = data;
            }
            setWithOffset(data, { limit, offset }){
                if (offset === 0) {
                    this.set(data);
                } else {
                    this.add(data);
                }
            }
            clear(){
                this.loaded = false;
                this.inventory = [];
            }
            remove(index){
                this.inventory.splice(index, 1);
            }
            get(id = null){
                if (id) {
                    return this.inventory.find(item => item.assetId === id);
                }
                return this.inventory;
            }
            load(url) {
                if (!this.history[url]) {
                    this.history[url] = {
                        count: 0,
                        spam: false,
                        checkSpamAfterCount: 5,
                        spamClearDelay: 20000,
                        spamRepeatDelay: 2000,
                        time: new Date().getTime(),
                        lastTime: null,
                        timeStamps: [],
                        getAverageTimeStamp: () => {
                            const count = this.history[url].timeStamps.length;
                            const sum = this.history[url].timeStamps.reduce((a, b) => a + b, 0);
                            return sum / count
                        }
                    }
                }
                if (this.history[url].count >= this.history[url].checkSpamAfterCount && this.history[url].getAverageTimeStamp() <= this.history[url].spamRepeatDelay) {
                    console.warn('SPAM SPAM SPAM!!');
                    this.history[url].spam = true;
                    const timer = setTimeout(() => {
                        this.history[url].count = 0;
                        this.history[url].spam = false;
                        this.history[url].timeStamps = [];
                        clearInterval(timer);
                    }, this.history[url].spamClearDelay);
                }
                if (!this.spam) {
                    let xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);
                    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    xhr.getResponseHeader("Set-Cookie", this.cookies);
                    xhr.withCredentials = true;
                    xhr.send(null);
                    this.history[url].count += 1;
                    this.history[url].lastTime = this.history[url].time;
                    this.history[url].time = new Date().getTime();
                    this.history[url].timeStamps.push(Math.abs(this.history[url].time - this.history[url].lastTime));
                }
                return true;
            }
            highlight(type, options){
                for (let item of this.inventory) {
                    try {
                        if (item.element) {
                            item.fullName = item.fullName || options.skinsBaseList[item.nameId].m;
                            if (options[type].includes(item.fullName)) {
                                item[type] = true;
                                item.element.classList.add(type);
                            }
                        }
                    } catch (error) {
                        console.log(type, options);
                    }
                }
            }
            assignmentItems(html_items) {
                if (html_items.length === this.inventory.length) {
                    for (let [index, html_item] of Object.entries(html_items)) {
                        this.inventory[index].element = html_item;
                        this.inventory[index].element.addEventListener('contextmenu', async (e) => {
                            this.contextItem = this.inventory[index];
                            this.contextMenuPopup = await this.promiseSelector(`#portal [class^="Popper_safe_zone"]`);
                            this.improveContextMenu('[class^="LinksSection_links_section"]');
                            this.insertSalesHistory('aside');
                        });
                        this.inventory[index].element.querySelector('[class^="actioncard_buttons"]').addEventListener('click', async (e) => {
                            this.contextItem = this.inventory[index];
                            this.contextMenuPopup = await this.promiseSelector('#modal [class^="styles_wrapper"]');
                            await this.promiseSelector('#modal [class^="styles_wrapper"] [class^="styles_links"]');
                            this.improveModalMenu('[class^="styles_links"]');
                            this.insertSalesHistory();
                        });
                    }
                }
            }
            async promiseSelector(contextMenuSelector) {
                return await new Promise((resolve, reject) => {
                    const timer = setInterval(() => {
                        let contextMenu = document.querySelector(contextMenuSelector);
                        if (contextMenu) {
                            clearInterval(timer);
                            clearTimeout(timeout);
                            resolve(contextMenu);
                        }
                    }, 100);
                    const timeout = setTimeout(() => {
                        clearInterval(timer);
                        clearTimeout(timeout);
                        reject();
                    }, 10000);
                });
            }
            async backgroundRequest(target, options = []) {
                window.postMessage({ target, options, csMoneyHelperExtensionID: localStorage.csMoneyHelperExtensionID }, '*');
                let res = await new Promise((resolve) => {
                    window.addEventListener('message', ({ data }) => {
                        if (data.target === target + '_answer') {
                            resolve(data.body);
                        }
                    });
                });
                return res;
            }
            appendContextMenuPopup(childSelector, html){
                if (childSelector) {
                    this.contextMenuPopup.querySelector(childSelector).insertAdjacentHTML('afterEnd', html);
                } else {
                    this.contextMenuPopup.insertAdjacentHTML('afterEnd', html);
                }
            }
            async improveModalMenu(childSelector = null) {
                if (this.contextMenuPopup) {
                    let html = `
                        <div class="styles_links__3mgtm" style="justify-content: start;gap: 35px;margin: 15px 0;">
                            <a href="https://old.cs.money/market_sales?appid=730&name_id=${this.contextItem.nameId}" class="styles_link__1s2TP styles_link__2L7ry" target="_blank" rel="noopener noreferrer">
                                SALES INFO (OLD)
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" class="styles_icon__1tC0E">
                                    <path d="M3.514 3.514v1.239l4.906.004-5.345 5.346.878.878L9.3 5.636l-.005 4.906h1.248V3.514H3.514z"></path>
                                </svg>
                            </a>
                            <a href="https://csm.auction/sales${this.contextItem.nameId}" class="styles_link__1s2TP styles_link__2L7ry" target="_blank" rel="noopener noreferrer">
                                SALES INFO (NEW)
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" class="styles_icon__1tC0E">
                                    <path d="M3.514 3.514v1.239l4.906.004-5.345 5.346.878.878L9.3 5.636l-.005 4.906h1.248V3.514H3.514z"></path>
                                </svg>
                            </a>
                        </div>`;
                    this.appendContextMenuPopup(childSelector, html);
                } else {
                    console.log('contextMenuPopup not found');
                }
            }
            // TODO: fix this.contextItem undefined error
            async improveContextMenu(childSelector = null) {
                if (this.contextMenuPopup && !document.querySelector('.improveContextMenu')) {
                    let html = `
                        <section class="LinksSection_links_section__3zrV3 improveContextMenu">
                            <div class="csm_ui__wrapper__67dba">
                                <a href="https://old.cs.money/market_sales?appid=730&name_id=${this.contextItem.nameId}" rel="noopener noreferrer" target="_blank" tabindex="0" class="csm_ui__text_button__67dba csm_ui__secondary__67dba">
                                    <span class="csm_ui__text__6542e csm_ui__label_11_medium__6542e">Sales Info (old)</span>
                                    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="csm_ui__size_12__2e8eb" aria-label="arrow diagonal">
                                        <path d="M5.146 15.206l-.353-.353a.5.5 0 010-.707l6.71-6.71.102-.101h1.06v1.06l-.101.102-6.71 6.71a.5.5 0 01-.708 0z"></path>
                                        <path d="M7.171 5.343v-.5a.5.5 0 01.5-.5h7.486a.5.5 0 01.5.5v7.487a.5.5 0 01-.5.5h-.5a.5.5 0 01-.5-.5V5.843H7.67a.5.5 0 01-.5-.5z"></path>
                                    </svg>
                                </a>
                            </div>
                            <div class="csm_ui__wrapper__67dba">
                                <a href="https://csm.auction/sales${this.contextItem.nameId}" rel="noopener noreferrer" target="_blank" tabindex="0" class="csm_ui__text_button__67dba csm_ui__secondary__67dba">
                                    <span class="csm_ui__text__6542e csm_ui__label_11_medium__6542e">Sales Info (new)</span>
                                    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="csm_ui__size_12__2e8eb" aria-label="arrow diagonal">
                                        <path d="M5.146 15.206l-.353-.353a.5.5 0 010-.707l6.71-6.71.102-.101h1.06v1.06l-.101.102-6.71 6.71a.5.5 0 01-.708 0z"></path>
                                        <path d="M7.171 5.343v-.5a.5.5 0 01.5-.5h7.486a.5.5 0 01.5.5v7.487a.5.5 0 01-.5.5h-.5a.5.5 0 01-.5-.5V5.843H7.67a.5.5 0 01-.5-.5z"></path>
                                    </svg>
                                </a>
                            </div>
                        </section>`;
                    this.appendContextMenuPopup(childSelector, html);
                } else {
                    console.log('contextMenuPopup not found');
                }
            }
            // TODO: fix this.contextItem undefined error
            async insertSalesHistory(childSelector = null){
                if (!document.querySelector('.item__sales')) {
                    let sales_html = document.createElement('div');
                    sales_html.classList.add('item__sales');
                    sales_html.innerHTML = `
                        <div class="styles_wrapper__3Mukf">
                            <div class="styles_content__3id0p">
                                <div class="styles_icon__3UorY">
                                    <div class="styles_loader__1PAI3"></div>
                                </div>
                                <div class="styles_title__1vfCM">Start processing</div>
                                <div class="styles_description__3hwVb">Please, wait...</div>
                            </div>
                        </div>`;
                    if (childSelector) {
                        this.contextMenuPopup.querySelector(childSelector).insertAdjacentElement('beforeEnd', sales_html);
                    } else {
                        this.contextMenuPopup.insertAdjacentElement('beforeEnd', sales_html);
                    }
                    if (!this.contextItem.sales) {
                        console.log(this.contextItem)
                        this.contextItem.sales = await this.backgroundRequest('getSales', {
                            name_id: String(this.contextItem.nameId),
                            search_float: String(this.contextItem.float).slice(0, 12),
                            limit: 15
                        });
                    }
                    sales_html.innerHTML = '';
                    for (let sale of this.contextItem.sales) {
                        sales_html.innerHTML += `
                            <div class="item__sale ${sale.similar_sale ? 'similar_sale' : ''}">
                                <div class="item__sale-date">
                                    ${new Date(sale.update_time * 1000).toISOString().slice(0, 10)}
                                </div>
                                <div class="item__sale-info">
                                    ${String(sale.floatvalue).slice(0, 12)} → ${sale.custom_price}$
                                </div>
                            </div>`;
                    }
                }
            }
        }
        class offerInventory extends customInventory {
            constructor() {
                super();
                this.inventory = {}
            }
            add(item){
                this.inventory[item.id] = item;
            }
            getCount() {
                return Object.keys(this.inventory).length;
            }
            remove(id){
                delete this.inventory[id];
            }
            highlight(type, options){
                switch (type) {
                    case 'disabledSkins':
                        for (let id of options[type]) {
                            this.inventory[id][type] = true;
                            if (document.querySelector('[data-id="' + id + '"]')) {
                                document.querySelector('[data-id="' + id + '"]').classList.add(type);
                            }
                        }
                        break;
                    case 'popularSkins':
                    case 'limitedSkins':
                        for (let index in this.inventory) {
                            if (options[type].includes(this.inventory[index].fullName)) {
                                this.inventory[index][type] = true;
                                if (document.querySelector('[data-id="' + id + '"]')) {
                                    document.querySelector('[data-id="' + id + '"]').classList.add(type);
                                }
                            }
                        }
                    default:
                        break;
                }
            }
            assignmentItems(html_items) {
                for (let [index, html_item] of Object.entries(html_items)) {
                    const ids = Object.keys(this.inventory);
                    html_item.dataset.id = ids[index];
                }
            }
        }
        class pendingInventory extends customInventory {
            constructor() {
                super();
                this.inventory = [];
                this.delay = 10 * 60 * 1000;
            }
            getInventoryName() {
                return this.constructor.name;
            }
            add({items, status = {}, offer_id = null, expiry = new Date().getTime() + this.delay }) {
                const newData = [{ items, status, offer_id, expiry }];
                this.inventory = [...new Set([...this.inventory, ...newData])];
                localStorage.setItem(this.getInventoryName(), JSON.stringify(this.inventory));
            }
            get(){
                const pendingInventory = localStorage.getItem(this.getInventoryName());
                if (pendingInventory && isJson(pendingInventory)) {
                    const parsedValue = JSON.parse(pendingInventory);
                    if (isIterable(parsedValue)) {
                        for (let value of parsedValue) {
                            if (value.expiry < new Date().getTime()) {
                                parsedValue.splice(parsedValue.indexOf(value), 1);
                            }
                        }
                        this.inventory = parsedValue;
                        localStorage.setItem(this.getInventoryName(), JSON.stringify(this.inventory));
                    }
                }
                return this.inventory;
            }
            remove(id){
                const pendingInventory = localStorage.getItem(this.getInventoryName());
                if (pendingInventory && isJson(pendingInventory)) {
                    const parsedValue = JSON.parse(pendingInventory);
                    if (isIterable(parsedValue)) {
                        for (let value of parsedValue) {
                            if (value.offer_id == id) {
                                parsedValue.splice(parsedValue.indexOf(value), 1);
                            }
                        }
                        this.inventory = parsedValue;
                        localStorage.setItem(this.getInventoryName(), JSON.stringify(this.inventory));
                    }
                }
                this.get();
            }
        }
        class sellInventory extends customInventory {
            constructor() {
                super();
                this.pageOffset = 0;
                this.contextItem = null;
            }
            assignmentItems(html_items, { limit, offset }) {
                if (this.inventory.length < limit) {
                    limit = this.inventory.length;
                }
                let to = offset + limit - this.pageOffset > 0 ? offset + limit : offset + limit * 2;
                let from = to - html_items.length;
                console.log(from, to, offset + limit - this.pageOffset);
                this.pageOffset = offset;
                for (let index = 0; index < html_items.length; index++) {
                    let key = index + from;
                    this.inventory[key].element = html_items[index];
                    this.inventory[key].element.querySelector('[data-id="sell_more_info"]').addEventListener('click', async (e) => {
                        this.contextItem = this.inventory[index];
                        try {
                            this.contextMenuPopup = await this.promiseSelector('#modal [class^="styles_wrapper"]');
                            await this.promiseSelector('#modal [class^="styles_wrapper"] [class^="styles_links"]');
                            this.improveModalMenu('[class^="styles_links"]');
                            this.insertSalesHistory();
                        } catch (error) {
                            console.error(error);
                        }
                    });
                    this.inventory[key].element.addEventListener('contextmenu', async (e) => {
                        e.preventDefault();
                        this.contextItem = this.inventory[key];
                        this.contextItem.element.querySelector('[data-id="sell_more_info"]').click();
                    });
                }
            }
            setWithOffset(items, { limit, offset }){
                if (!this.get().length || items.length < limit) {
                    console.log(this.get().length, items.length, this.get().length < items.length);
                    this.inventory = items;
                } else {
                    for (let [index, item] of Object.entries(items)) {
                        this.inventory[Number(index) + Number(offset)] = item;
                    }
                }
                this.loaded = true;
            }
        }
        class lotsInventory extends customInventory {
            constructor() {
                super();
                this.usersCurrentBets = {};
            }
            async assignmentItems(html_items) {
                if (html_items.length === this.inventory.length) {
                    for (let [index, html_item] of Object.entries(html_items)) {
                        this.inventory[index].element = html_item;
                        this.inventory[index].element.addEventListener('contextmenu', async (e) => {
                            this.contextItem = this.inventory[index];
                            this.contextMenuPopup = await this.promiseSelector(`#portal [class^="Popper_safe_zone"]`);
                            this.improveContextMenu('[class^="LinksSection_links_section"]');
                            this.insertSalesHistory('aside');
                        });
                    }
                } else {
                    console.error('lotsInventory Error');
                }
                this.highlightCurrentUserBet();
            }
            highlightCurrentUserBet(){
                for (const [steamId64, user] of Object.entries(this.usersCurrentBets)) {
                    const { betsAssetId, avatar, userId } = user;
                    for (let item of this.inventory) {
                        if (betsAssetId.includes(item.assetId)) {
                            item.element.dataset.steamId64 = steamId64;
                            item.element.dataset.userId = userId;
                            if (!item.element.querySelector('.avatar')) {
                                item.element.querySelector('section').insertAdjacentHTML('beforeend', `
                                    <div class="avatar">
                                        <a href="https://steamcommunity.com/profiles/${steamId64}" target="_blank"><img src="${avatar}" alt=""></a>
                                    </div>
                                `);
                            }
                        }
                    }
                }
            }
            getLotsAssetId(){
                return this.inventory.filter(item => item.betsList.at(-1).yourBet).map(item => item.assetId);
            }
            removeByAssetId(assetId){
                this.inventory.forEach((item, index) => {
                    if (item.assetId === assetId) {
                        delete this.inventory[index];
                    }
                })
            }
            update(){
                for (let index = 0; index < this.inventory.length; index++){
                    if (!document.body.contains(this.inventory[index].element)) {
                        this.remove(index);
                        index--;
                    }
                }
            }
            transportLotToInventory(lot, inventory){
                inventory.add(lot);
                this.removeByAssetId(lot.assetId);
            }
        }
        class Extension {
            constructor() {
                this.botOfferInventory = new offerInventory();
                this.userOfferInventory = new offerInventory();
                this.botInventory = new customInventory();
                this.userInventory = new customInventory();
                this.botLotsInventory = new lotsInventory();
                this.userLotsInventory = new lotsInventory();
                this.userSellInventory = new sellInventory();
                this.pendingOffersInventory = new pendingInventory();
                this.requestMap = new Map();
                this.userInfo = {};
                this.pendingTransactions = [];
                this.popularSkins = [];
                this.hiddenSkins = [];
                this.limitedSkinsData = [];
                this.skinsBaseList = [];
                this.isModalVisible = false;
                this.isOfferInventoryOpen = false;
                this.contextMenu = { init: false, selectedItem: null };
                this.lastStatus = null;
                this.cookies = null;
                this.mediaQueries = {
                    isMobile: false,
                    isDesktop: false,
                    device: 'desktop',
                };
                this.currentPage = {
                    currentUrl: window.location.origin + window.location.pathname,
                    previousUrl: null
                }
                this.init();
            }
            async init(){
                console.log('New cs.money extension Inited!');
                const { props: { initialReduxState: { g_userInfo } } } = await this.loadNextData();
                this.userInfo = g_userInfo;
                this.popularSkins = await this.backgroundRequest('getPopularSkins');
                this.hiddenSkins = await this.backgroundRequest('getHiddenSkins');
                this.limitedSkins = await this.backgroundRequest('getLimitedSkins');
                this.skinsBaseList = await this.backgroundRequest('getSkinsBaseList');
                this.cookies = await this.backgroundRequest('getCookies', { domain: "old.cs.money" });
                this.pendingOffersInventory.get();
                this.setCurrentPage();
            }
            async loadNextData(){
                let nextData = window.__NEXT_DATA__;
                if (!nextData) {
                    let ticks_max = 30;
                    nextData = await new Promise((resolve, reject) => {
                        const timer = setInterval(() => {
                            if (window.__NEXT_DATA__) {
                                clearInterval(timer);
                                resolve(window.__NEXT_DATA__);
                            } else if (ticks_max-- <= 0) {
                                clearInterval(timer);
                                reject('Timeout');
                            }
                        }, 50);
                    });
                }
                return nextData;
            }
            async setCurrentPage(){
                if (this.currentPage.currentUrl !== window.location.origin + window.location.pathname) {
                    this.currentPage.previousUrl = this.currentPage.currentUrl;
                }
                this.currentPage.currentUrl = window.location.origin + window.location.pathname;
                this.setMediaQueries();
                this.initPage();
                console.log(this);
            }
            async initPage(){
                let timer;
                switch (this.currentPage.currentUrl) {
                    case "https://cs.money/csgo/trade/":
                        this.buildButtons();
                        await this.checkOfferInventoryOpen();
                        this.updateOfferInventory();
                        this.buildBetterAuctionTimers(false);
                        clearInterval(timer);

                        if (!this.botInventory.get().length || !this.userInventory.get().length) {
                            const { query, props: { initialReduxState: { g_userInfo } } } = await this.loadNextData();
                            this.userInfo = g_userInfo;
                            const onLoadOptions = Object.assign(structuredClone(query), {
                                limit: 60,
                                offset: 0,
                                priceWithBonus: this.userInfo.buyBonus,
                                withStack: true,
                            });
                            if (query.search) { onLoadOptions.name = query.search }
                            if (!query.sort) { onLoadOptions.sort = 'botFirst' }
                            delete onLoadOptions.search;
                            delete onLoadOptions.game;
                            if (!this.botInventory.get().length && !this.botInventory.loaded) {
                                this.botInventory.loaded = this.botInventory.load('https://inventories.cs.money/5.0/load_bots_inventory/730?' + new URLSearchParams(onLoadOptions).toString());
                            }
                            if (!this.userInventory.get().length && !this.userInventory.loaded) {
                                this.userInventory.loaded = this.userInventory.load('https://cs.money/3.0/load_user_inventory/730?isPrime=false&limit=60&noCache=true&offset=0&order=desc&sort=price&withStack=true');
                            }
                        }
                        break;
                    case "https://cs.money/csgo/auction/":
                        timer = setInterval(this.buildBetterAuctionTimers, 500);
                        const auctionOptions = {
                            appId: 730,
                            limit: 200,
                            offset: 0,
                            order: "desc",
                            sort: "betsAmount",
                            status: "running",
                        }
                        if (!this.botLotsInventory.get().length && !this.botLotsInventory.loaded) {
                            this.botLotsInventory.loaded = this.botLotsInventory.load('https://cs.money/1.0/auction/lots?' + new URLSearchParams(auctionOptions).toString());
                        }
                        if (!this.userLotsInventory.get().length && !this.userLotsInventory.loaded) {
                            this.userLotsInventory.loaded = this.userLotsInventory.load('https://cs.money/1.0/auction/my-lots?' + new URLSearchParams(auctionOptions).toString());
                        }
                        break;
                    case "https://cs.money/csgo/sell/":
                        clearInterval(timer);
                        const sellPageOptions = {
                            limit: 60,
                            offset: 0,
                            order: "desc",
                            inventoryType: "allSkins",
                            sort: "priceAndUnsellable",
                        }
                        if (!this.userSellInventory.get().length && !this.userSellInventory.loaded) {
                            this.userSellInventory.loaded = this.userSellInventory.load('https://cs.money/2.0/load_sell_inventory/730?' + new URLSearchParams(sellPageOptions).toString());
                        }
                        break;
                    default:
                        clearInterval(timer);
                        break;
                }
            }
            setMediaQueries(){
                const isDesktop = !!document.querySelector('[class^="MediaQueries_desktop"]').childElementCount;
                const isMobile = !!document.querySelector('[class^="MediaQueries_mobile"]').childElementCount;
                this.mediaQueries = {
                    isDesktop,
                    isMobile,
                    device: isDesktop ? 'desktop' : 'mobile',
                };
            }
            buildBetterAuctionTimers(){
                let lots = document.querySelectorAll('[class^="AuctionListing_lot_"]:not(.active_rate), [class^="AuctionMobile_lot_"]:not(.active_rate)');
                for (let lot of [...lots]) {
                    let img = lot.querySelector('[class^="CSGOSkinInfo_image"]:not([src$="_large_preview.png"])');
                    let timer = lot.querySelector('[class^="Timer_time_wrapper"]:not([class^="Timer_state"])');
                    if (img?.src.includes('_icon')) {
                        img.src = img.src.replace('_icon', '_large_preview');
                    }
                    if (lot.querySelector('[class*="LotInfoDesktop_bid_"] span, [class*="LotInfoMobile_bid_"] span').innerText > 0) {
                        lot.querySelector('[class^="LotCardDesktop_auction-card"], [class^="LotCardMobile_wrapper_"]').classList.add('active_rate');
                    }
                    if (timer.innerText === 'Time is over') {
                        timer.dataset.state = 'purple';
                    } else {
                        let [hours, minutes, seconds] = timer.innerText.split(':');
                        minutes = Number(hours) * 60 + Number(minutes);
                        switch (minutes) {
                            case 0:
                            case 1:
                                timer.dataset.state = 'red';
                                break;
                            case 2:
                            case 3:
                                timer.dataset.state = 'orange';
                                break;
                            default:
                                timer.dataset.state = 'green';
                                break;
                        }
                    }
                }
            }
            buildButtons(){
                if (!document.querySelector('#show-virtual-first-modal') && this.mediaQueries.isDesktop) {
                    document.querySelector('[class^="TradePage_center"]').insertAdjacentHTML('afterbegin', `
                        <button class="TradePage_trade_button__3AwF8 styles_button__303YR styles_main__PiMGk TradeButton_button__1Dt47 styles_disabled__FKMBn TradeButton_disabled__2nLaR" disabled="" type="button" id="trade-virtual-first">
                            <span>Virtual First</span>
                        </button>
                        <button id="show-virtual-first-modal">
                            <span>Show virtual offers</span>
                        </button>
                    `);
                    this.initEvents();
                }
            }
            initClocks(){
                for (let timer of [...document.querySelectorAll('.timer')]) {
                    initializeClock(`[data-deadline='${timer.dataset.deadline}']`, () => {
                        this.pendingOffersInventory.get();
                    });
                }
            }
            showModal(modalType, options) {
                let offers_html = '';
                switch (modalType) {
                    case 'loading':
                        offers_html = `
                        <div class="styles_wrapper__3Mukf">
                            <div class="styles_content__3id0p">
                                <div class="styles_icon__3UorY">
                                    <div class="styles_loader__1PAI3"></div>
                                </div>
                                <div class="styles_title__1vfCM">Start processing</div>
                                <div class="styles_description__3hwVb">Please, wait...</div>
                            </div>
                        </div>`;
                        break;
                    case 'confirm':
                        if (this.pendingOffersInventory.get().length) {
                            document.querySelector(`#offer${options.offer_id} .styles_icon_wrapper__1fs1B`).innerHTML = `
                            <div class="styles_wrapper__1RYBS styles_decline_icon_container__1SYgS styles_unlock__3zpuG">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="styles_icon__3YyMx styles_withdraw__1S_qC">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.3271 5.25628C17.6688 5.59799 17.6688 6.15201 17.3271 6.49372L9.16039 14.6604C8.81868 15.0021 8.26466 15.0021 7.92295 14.6604L3.25628 9.99372C2.91457 9.65201 2.91457 9.09799 3.25628 8.75628C3.59799 8.41457 4.15201 8.41457 4.49372 8.75628L8.54167 12.8042L16.0896 5.25628C16.4313 4.91457 16.9853 4.91457 17.3271 5.25628Z" fill="#C0C0C2"/>
                                </svg>
                            </div>`;
                            document.querySelector(`#offer${options.offer_id} .timer`).remove();
                            document.querySelector(`#offer${options.offer_id} .styles_actions__3uEFS`).remove();
                            return;
                        } else {
                            offers_html = `
                            <div class="styles_wrapper__3Mukf">
                                <div class="styles_content__3id0p">
                                    <div class="styles_icon__3UorY">
                                        <img src="/img/success_emoji.png" alt="success emoji">
                                    </div>
                                    <div class="styles_title__1vfCM">Great! Trade was successful confirmed!</div>
                                    <div class="styles_description__3hwVb">You confirmed all offers</div>
                                </div>
                            </div>`;
                        }
                        break;
                    case 'decline':
                        if (this.pendingOffersInventory.get().length) {
                            document.querySelector(`#offer${options.offer_id} .styles_icon_wrapper__1fs1B`).innerHTML = `
                            <div class="styles_wrapper__1RYBS styles_decline_icon_container__1SYgS styles_block__3K0ES">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="styles_icon__3YyMx styles_icon__YYN8A">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.061 12.122l4.055 4.054a.5.5 0 00.707 0l.354-.353a.5.5 0 000-.707l-4.055-4.055-1.06 1.061zM16.177 4.177a.5.5 0 010 .707L4.884 16.177a.5.5 0 01-.707 0l-.354-.354a.5.5 0 010-.707L15.116 3.823a.5.5 0 01.707 0l.354.354z" fill="#C0C0C2"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10 11.06L3.823 4.885a.5.5 0 010-.707l.354-.354a.5.5 0 01.707 0L11.06 10 10 11.06z" fill="#C0C0C2"></path>
                                </svg>
                            </div>`;
                            document.querySelector(`#offer${options.offer_id} .timer`).remove();
                            document.querySelector(`#offer${options.offer_id} .styles_actions__3uEFS`).remove();
                            return;
                        } else {
                            offers_html = `
                            <div class="styles_wrapper__3Mukf">
                                <div class="styles_content__3id0p">
                                    <div class="styles_icon__3UorY">
                                        <img src="/img/success_emoji.png" alt="success emoji">
                                    </div>
                                    <div class="styles_title__1vfCM">Great! Trade was successful declined!</div>
                                    <div class="styles_description__3hwVb">You decline all offers</div>
                                </div>
                            </div>`;
                        }
                        break;
                    case 'error':
                        console.error(options.error)
                        offers_html = `
                        <div class="styles_wrapper__3Mukf">
                            <div class="styles_content__3id0p">
                                <div class="styles_icon__3UorY">
                                    <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/325/dizzy-face_1f635.png" alt="error emoji">
                                </div>
                                <div class="styles_title__1vfCM">Oh no! Trade failed!</div>
                                <div class="styles_description__3hwVb">You didn't confirm all offers</div>
                            </div>
                        </div>`;
                        break;
                    case 'disabledSkins':
                        offers_html += `
                        <div class="modal-offer">
                            <div class="styles_icon_wrapper__1fs1B">
                                <div class="styles_wrapper__1RYBS styles_decline_icon_container__1SYgS styles_block__3K0ES">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="styles_icon__3YyMx styles_icon__YYN8A">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.061 12.122l4.055 4.054a.5.5 0 00.707 0l.354-.353a.5.5 0 000-.707l-4.055-4.055-1.06 1.061zM16.177 4.177a.5.5 0 010 .707L4.884 16.177a.5.5 0 01-.707 0l-.354-.354a.5.5 0 010-.707L15.116 3.823a.5.5 0 01.707 0l.354.354z" fill="#C0C0C2"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10 11.06L3.823 4.885a.5.5 0 010-.707l.354-.354a.5.5 0 01.707 0L11.06 10 10 11.06z" fill="#C0C0C2"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="styles_title__13qTi">
                                <span class="styles_subtitle__3SAy7">Virtual trade</span>
                            </div>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="styles_icon__2K1cb styles_rotate__NPPVg">
                                <path d="M11.65 13.25a.75.75 0 001.12 1l3.539-3.962a.75.75 0 00.01-.987l-3.451-4.038a.75.75 0 00-1.14.975l2.377 2.78H4.75a.75.75 0 100 1.5h9.341l-2.44 2.732z" fill="#C0C0C2"></path>
                            </svg>
                            <div class="items_wrapper" style="width: 450px; max-width: none;">
                                <div class="styles_container__3SsSr">`;
                        for (let [item_index, item] of Object.entries(this.botOfferInventory.get())) {
                            offers_html += `
                                    <div class="bot_skins ${options.disabledSkins.includes(item.assetId) ? 'disabledSkins' : ''}">
                                        <div class="styles_preview__3CQDx">
                                            <div class="styles_container__gSliV styles_container_dark_gray__1WkFc styles_container_small__1Je2M">
                                                <img class="styles_img__FwAe7 styles_img_small__2TjSR" src="${item.img}" alt="item">
                                            </div>
                                        </div>
                                    </div>`;
                        }
                        offers_html += `
                                </div>
                            </div>
                        </div>`;
                        break;
                    case 'notFoundPendingItems':
                        offers_html = `
                        <div class="styles_wrapper__3Mukf">
                            <div class="styles_content__3id0p">
                                <div class="styles_icon__3UorY">
                                    <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/325/thinking-face_1f914.png" alt="nothing happen emoji">
                                </div>
                                <div class="styles_title__1vfCM">Oh no! You have no offers!</div>
                                <div class="styles_description__3hwVb">Nothing happen</div>
                            </div>
                        </div>`;
                        break;
                    case 'pendingItems':
                        for (let offers of this.pendingOffersInventory.get()) {
                            offers_html += `
                            <div class="modal-offer" id="offer${offers.offer_id}">
                                <div class="styles_icon_wrapper__1fs1B">
                                    <div class="styles_wrapper__1RYBS">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="styles_icon__3YyMx styles_icon__p0zW2">
                                            <path clip-rule="evenodd" d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 1.273A5.734 5.734 0 001.273 7 5.734 5.734 0 007 12.727 5.734 5.734 0 0012.727 7 5.734 5.734 0 007 1.273zm-.601 6.37a.614.614 0 01-.036-.207v-3.75A.63.63 0 017 3.06a.63.63 0 01.636.625v3.113h2.107a.63.63 0 01.622.636.63.63 0 01-.622.637H6.987a.624.624 0 01-.588-.43z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div class="styles_title__13qTi">
                                    <span class="styles_subtitle__3SAy7">Virtual trade</span>
                                </div>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="styles_icon__2K1cb styles_rotate__NPPVg">
                                    <path d="M11.65 13.25a.75.75 0 001.12 1l3.539-3.962a.75.75 0 00.01-.987l-3.451-4.038a.75.75 0 00-1.14.975l2.377 2.78H4.75a.75.75 0 100 1.5h9.341l-2.44 2.732z" fill="#C0C0C2"></path>
                                </svg>
                                <div class="items_wrapper">
                                    <div class="styles_container__3SsSr">`;
                            for (let [item_index, item] of Object.entries(offers.items)) {
                                offers_html += `
                                        <div class="bot_skins">
                                            <div class="styles_preview__3CQDx">
                                                <div class="styles_container__gSliV styles_container_dark_gray__1WkFc styles_container_small__1Je2M">
                                                    <img class="styles_img__FwAe7 styles_img_small__2TjSR" src="${item.img}" alt="item">
                                                </div>
                                            </div>
                                        </div>`;
                            }
                            offers_html += `
                                    </div>
                                </div>
                                <div class="timer" data-deadline="${offers.expiry}">
                                    <span class="hours countdown-time"></span>:<span class="minutes countdown-time"></span>:<span class="seconds countdown-time"></span>
                                </div>
                                <div class="styles_actions__3uEFS">
                                    <div class="styles_actions__3uEFS">
                                        <button type="button" data-action="decline" data-offer_id="${offers.offer_id}" class="offerButton styles_button__3139I styles_white__2fplg">
                                            <span class="styles_no_event__3bE7t">Decline</span>
                                        </button>
                                        <button type="button" data-action="confirm" data-offer_id="${offers.offer_id}" class="offerButton csm_ui__button__24e1f csm_ui__primary_button__2d1f1 csm_ui__medium__2d1f1 csm_ui__confirm_secondary__2d1f1">
                                            <span class="csm_ui__text_overflow_wrapper__2d1f1">
                                                <span class="csm_ui__text__6542e csm_ui__button_12_medium__6542e csm_ui__text_wrapper__2d1f1">Accept</span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>`;
                        }
                        break;
                    default:
                        break;
                }
                if (!this.isModalVisible) {
                    this.buildModal(offers_html);
                    this.isModalVisible = true;
                } else {
                    this.changeModal(offers_html);
                }
                this.initClocks();
            }
            buildModal(html){
                document.querySelector('[class^="TradePage_center"]').insertAdjacentHTML('afterbegin', `
                    <div id="myModal">
                        <div class="styles_overlay__3KR4i">
                            <div class="modal">
                                <p class="modal-title">Trade process</p>
                                <div class="modal-body">
                                    <div class="modal-container">${html}</div>
                                </div>
                                <button class="styles_close__2w7q4 close_modal" type="button"></button>
                            </div>
                        </div>
                    </div>
                `);
                const buttonsEvents = ({ target }) => {
                    if (target.closest('.close_modal')) {
                        document.querySelector('#myModal').removeEventListener('click', buttonsEvents, true);
                        document.querySelector('#myModal').remove();
                        this.isModalVisible = false;
                        console.log(extension);
                    } else if (target.closest('.offerButton')) {
                        const { dataset: { offer_id, action } } = target.closest('.offerButton');
                        this.offerAction(action, offer_id, (offerActionError, status) => {
                            if (offerActionError || !status || status.success === false) {
                                this.showModal('error', { error: offerActionError });
                            } else {
                                this.pendingOffersInventory.remove(offer_id);
                                this.showModal(action, { offer_id: offer_id });
                            }
                        });
                    }
                }
                document.querySelector('#myModal').addEventListener('click', buttonsEvents, true);
            }
            changeModal(html){
                document.querySelector('#myModal .modal-container').innerHTML = html;
            }
            async checkOfferInventoryOpen() {
                if (this.mediaQueries.isDesktop) {
                    const offerHeader = document.querySelector('[class^="TradeCart_header"]');
                    if (!offerHeader.parentNode.className.includes('TradeCart_open')) {
                        this.isOfferInventoryOpen = await new Promise(resolve => setTimeout(() => {
                            if (offerHeader.nextSibling) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        }, 100));
                    } else {
                        this.isOfferInventoryOpen = false;
                    }
                }
            }
            updateOfferInventory(){
                const html_items_bot = [...document.querySelectorAll(`[class*="bot-listing_cart_"] [class^="List_list__"] > div`)];
                const html_items_user = [...document.querySelectorAll(`[class*="user-listing_cart_"] [class^="List_list__"] > div`)];
                if (this.isOfferInventoryOpen) {
                    this.botOfferInventory.assignmentItems(html_items_bot);
                    this.botOfferInventory.highlight('disabledSkins', { disabledSkins: this.lastStatus.callback.disabledSkins });
                    this.userOfferInventory.assignmentItems(html_items_user);
                }
            }
            initEvents(){
                let virtualFirstButton = document.querySelector('#trade-virtual-first');
                let virtualFirstModalButton = document.querySelector('#show-virtual-first-modal');
                let offerHeaders = document.querySelectorAll('[class^="TradeCart_header"]');
                virtualFirstButton.addEventListener('click', async () => {
                    this.showModal('loading');
                    this.sendVirtualOffer((offerError, offerData) => {
                        this.lastStatus = JSON.parse(offerData);
                        if (offerError || !this.lastStatus || this.lastStatus.success === false) {
                            this.showModal('disabledSkins', { disabledSkins: this.lastStatus.callback.disabledSkins });
                            this.botOfferInventory.highlight('disabledSkins', { disabledSkins: this.lastStatus.callback.disabledSkins });
                        } else {
                            this.getTransactions((transactionError, transactionData) => {
                                if (transactionError || !transactionData || transactionData.success === false) {
                                    console.error(transactionError, transactionData);
                                    this.showModal('error', { error: transactionError });
                                } else {
                                    this.pendingTransactions = transactionData.filter(item => Object.entries(item)[0][1].trades[0].status == 'pending');
                                    this.pendingOffersInventory.add({
                                        status: this.lastStatus,
                                        items: this.botOfferInventory.get(),
                                        offer_id: String(Object.values(this.pendingTransactions.find(item => Object.keys(item) == this.lastStatus.uniqid))[0].trades[0].offer_id)
                                    });
                                    this.showModal('pendingItems');
                                }
                            });
                        }
                    });
                }, false);
                virtualFirstModalButton.addEventListener('click', () => {
                    console.log(extension);
                    if (this.pendingOffersInventory.get().length) {
                        this.showModal('pendingItems');
                    } else {
                        this.showModal('notFoundPendingItems');
                    }
                }, false);
                window.addEventListener('offerInventoryChange', (e) => {
                    if (this.botOfferInventory.getCount() > 0) {
                        virtualFirstButton.removeAttribute('disabled');
                        virtualFirstButton.classList.remove('styles_disabled__FKMBn', 'TradeButton_disabled__2nLaR');
                    } else {
                        virtualFirstButton.setAttribute('disabled', '');
                        virtualFirstButton.classList.add('styles_disabled__FKMBn', 'TradeButton_disabled__2nLaR');
                    }
                }, false);
                offerHeaders.forEach(item => {
                    item.addEventListener('click', async () => {
                        await this.checkOfferInventoryOpen();
                        this.updateOfferInventory();
                    }, false);
                });
            }
            async backgroundRequest(target, options = []) {
                window.postMessage({ target, options, csMoneyHelperExtensionID: localStorage.csMoneyHelperExtensionID }, '*');
                let res = await new Promise((resolve) => {
                    window.addEventListener('message', ({ data }) => {
                        if (data.target === target + '_answer') {
                            resolve(data.body);
                        }
                    });
                });
                return res;
            }
            async getUsersCurrentBets(){
                const usersCurrentBets = await this.backgroundRequest('getUsersCurrentBets', {
                    betsAssetId: this.userLotsInventory.getLotsAssetId(),
                    steamId64: this.userInfo.steamId64,
                    avatar: this.userInfo.avatar.replace('_medium', '_full'),
                    userId: this.userInfo.userId,
                });
                this.botLotsInventory.usersCurrentBets = usersCurrentBets;
                this.userLotsInventory.usersCurrentBets = usersCurrentBets;
                this.botLotsInventory.highlightCurrentUserBet();
                this.userLotsInventory.highlightCurrentUserBet();
            }
            getTransactions(callback) {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://old.cs.money/get_transactions', true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.getResponseHeader("Set-Cookie", this.cookies);
                xhr.withCredentials = true;
                xhr.onload = function () {
                    callback(null, JSON.parse(xhr.response));
                };
                xhr.onerror = function () {
                    callback(xhr.response);
                };
                xhr.send(null);
            }
            offerAction(action, offer_id, callback){
                let xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://old.cs.money/confirm_virtual_offer', true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.getResponseHeader("Set-Cookie", this.cookies);
                xhr.withCredentials = true;
                xhr.onload = function () {
                    let { error, status } = JSON.parse(xhr.response);
                    if (error) callback(error);
                    callback(null, status);
                };
                xhr.onerror = function () {
                    callback(xhr.response);
                };
                xhr.send(JSON.stringify({
                    action,
                    steamid64: this.userInfo.steamId64,
                    offer_id
                }));
            }
            sendVirtualOffer(callback) {
                const botItems = [];
                const items = this.botOfferInventory.get();
                Object.keys(items).forEach(key => {
                    const { assetId, price, tradeLock = null, fullName, steamId, nameId, float } = items[key];
                    const { username } = this.userInfo;
                    botItems.push({
                        "assetid": assetId,
                        "local_price": price,
                        "price": price,
                        "hold_time": tradeLock,
                        "market_hash_name": fullName,
                        "bot": steamId,
                        "reality": "physical",
                        "currency": "USD",
                        "username": username,
                        "appid": 730,
                        "name_id": nameId,
                        "float": float,
                        "stickers_count": 0
                    });
                });
                let xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://old.cs.money/send_offer', true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.getResponseHeader("Set-Cookie", this.cookies);
                xhr.withCredentials = true;
                xhr.onload = function () {
                    callback(null, xhr.response);
                };
                xhr.onerror = function () {
                    callback(xhr.response);
                };
                xhr.send(JSON.stringify({
                    "peopleItems": [],
                    "botItems": botItems,
                    "games": {},
                    "onWallet": -botItems.map(item => item.price).reduce((partialSum, a) => partialSum + a, 0),
                    "forceVirtual": 1,
                    "recommended": false
                }));
            }
        }
        const extension = new Extension();

        XMLHttpRequest.prototype.originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(value) {
            this.addEventListener("load", async function(e){
                const { responseText, responseURL, url = new URL(responseURL), searchParams = new URLSearchParams(url.search) } = this;
                const { error, items } = responseJson = isJson(responseText) ? JSON.parse(responseText) : [];
                if (error || !responseJson || !url.hostname.includes(window.location.hostname)) return;
                const { id, type, createdFrom, offset, limit } = [...searchParams.entries()].reduce((acc, [key, value]) => {
                    acc[key] = isJson(value) ? JSON.parse(value) : value;
                    return acc;
                }, {});
                const postParams = JSON.parse(value);
                const requestKey = url.pathname.split('/').at(-1);
                switch (requestKey) {
                    case 'add_cart':
                    case 'remove_cart_item':
                    case 'clear_cart':
                        const whose_cart = (postParams?.type || type) === 1 ? 'user' : 'bot';
                        const inventory_cart = whose_cart + 'OfferInventory';
                        const method_cart = requestKey.split('_')[0];
                        console.log(method_cart);
                        const item = id || postParams.item;
                        const html_items_cart = [...document.querySelectorAll(`[class*="${whose_cart}-listing_cart_"] [class^="List_list__"] > div`)];
                        extension[inventory_cart][method_cart](item);
                        extension[inventory_cart].assignmentItems(html_items_cart);
                        window.dispatchEvent(offerInventoryEvent);
                        break;
                    case 'my-lots':
                    case 'lots':
                        if (requestKey === 'my-lots') {
                            for (let item of extension.userLotsInventory.get()){
                                if (!item.betsList.at(-1).yourBet) {
                                    console.log(item, responseJson);
                                }
                            }
                        }
                        const queriesInventory = {
                            "desktop": document.querySelectorAll('[class^="Auction_listing"]'),
                            "mobile": document.querySelectorAll('[class^="Auction_wrapper"] [class^="styles_tab"]')
                        }
                        const lotsInventory = {
                            "my-lots": { lotsInventoryName: 'userLotsInventory', lotsInventoryItems: [...queriesInventory[extension.mediaQueries.device][0].querySelectorAll(`[class^="List_wrapper__"] > .list > div`)] },
                            "lots": { lotsInventoryName: 'botLotsInventory', lotsInventoryItems: [...queriesInventory[extension.mediaQueries.device][1].querySelectorAll(`[class^="List_wrapper__"] > .list > div`)] },
                        }
                        const method_lots = createdFrom ? 'add' : 'set';
                        const { lotsInventoryName, lotsInventoryItems } = lotsInventory[requestKey];
                        extension[lotsInventoryName][method_lots](responseJson);
                        extension[lotsInventoryName].assignmentItems(lotsInventoryItems, { limit, offset, usersCurrentBets: extension.usersCurrentBets });
                        extension[lotsInventoryName].highlight('limitedSkins', { limitedSkins: extension.limitedSkins });
                        await extension.getUsersCurrentBets();
                        break;
                    case '730':
                        const loadInventory = {
                            "load_bots_inventory": { inventoryName: 'botInventory', inventoryItems: [...document.querySelectorAll(`[data-onboarding="bot-listing"] [class*="list_large"] > div:not([role])`)] },
                            "load_user_inventory": { inventoryName: 'userInventory', inventoryItems: [...document.querySelectorAll(`[data-onboarding="user-listing"] [class*="list_large"] > div:not([role])`)] },
                            "load_sell_inventory": { inventoryName: 'userSellInventory', inventoryItems: [...document.querySelectorAll(`[class*="styles_sell_page__"] > div:not([role])`)] },
                        }
                        const inventoryType = url.pathname.split('/').at(-2);
                        const { inventoryName, inventoryItems } = loadInventory[inventoryType];
                        extension[inventoryName].setWithOffset(items, { limit, offset });
                        extension[inventoryName].assignmentItems(inventoryItems, { limit, offset });
                        extension[inventoryName].highlight('limitedSkins', { limitedSkins: extension.limitedSkins, skinsBaseList: extension.skinsBaseList });
                        break;
                    case 'make-bet':
                        const Lot = extension.botLotsInventory.get(postParams.item.id);
                        extension.botLotsInventory.transportLotToInventory(Lot, extension.userLotsInventory);
                        await extension.getUsersCurrentBets();
                        break;
                    case 'active-offers':
                        extension.botLotsInventory.update();
                        extension.userLotsInventory.update();
                        break;
                    default:
                        break;
                }
                extension.requestMap.set(url, responseJson);
                extension.setCurrentPage();
                console.log(extension);
            }, false);

            this.originalSend(value);
        }
	}
	addJS_Node(null, null, init);
})();