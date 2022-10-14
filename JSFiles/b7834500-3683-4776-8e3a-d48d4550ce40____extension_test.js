const puppeteer = require('puppeteer');
const assert = require('assert');

const extensionPath = require('path').join(__dirname, '../chrome-react-extension/public');
let extensionPage = null;
let browser = null;

describe('Extension Testing', function() {
  this.timeout(20000);
  before(async function() {
    await boot();
  });

  describe("test", async function() {
    it('Test', async function (){
      await extensionPage.waitForSelector("#root");
      curhtml = await extensionPage.$eval('#root', e => e.innerHTML);
      assert.equal(curhtml, "")
    });
  });

  after(async function() {
    await browser.close();
  });
});

async function boot() {
  browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`
    ]
  });

  const dummyPage = await browser.newPage();
  await dummyPage.waitFor(2000); // arbitrary wait time.

  const extensionName = 'figure';

  const targets = await browser.targets();
  const extensionTarget = targets.find(({ _targetInfo }) => {
      return _targetInfo.title === extensionName && _targetInfo.type === 'background_page';
  });

  const extensionUrl = extensionTarget._targetInfo.url || '';
  const [,, extensionID] = extensionUrl.split('/');
  const extensionPopupHtml = 'index.html'

  extensionPage = await browser.newPage();
  await extensionPage.goto(`chrome-extension://${extensionID}/${extensionPopupHtml}`);
}