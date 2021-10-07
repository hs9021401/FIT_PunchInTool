/*
Author: Alex Lin
Version: 1.2.0
Selenium API Doc: https://www.selenium.dev/selenium/docs/api/javascript/index.html
Chrome WebDriver: http://chromedriver.storage.googleapis.com/index.html
Taiwan Calendar: https://data.gov.tw/dataset/14718
*/

const {
  Builder,
  By,
  Key,
  until
} = require('selenium-webdriver');
const axois = require('axios');
const fs = require('fs');
const xmlparser = require('fast-xml-parser');
const decompress = require('decompress');
const decompressUnzip = require('decompress-unzip');
const axios = require('axios');

const username = process.argv[2];
const password = process.argv[3];
const chromeVer = process.argv[4];  //瀏覽器版本
const chromeDriverVer = process.argv[5];  //Selenium Driver for Chrome版本

console.log(`username: ${username}, password: ${password}, chromeVer: ${chromeVer}, chromeDriverVer: ${chromeDriverVer}`);

const date = new Date();
const year = date.getFullYear();
const month = (date.getMonth() + 1).toString().padStart(2, '0');
const day = date.getDate().toString().padStart(2, '0');
const today = `${year}${month}${day}`;
let data = fs.readFileSync(`${__dirname}\\${year}_holiday.json`);
const holidays = JSON.parse(data.toString());

let isHoliday = false;
let isDayoff = false;

const downloadFile = `${__dirname}\\downloadContent.zip`;
const driverVerConfig = `${__dirname}\\chromeDriverVer.config`;


async function updateDriver() {
  // Parse the latest version and generate download URL
  let htmlcode = await axios.get('https://chromedriver.storage.googleapis.com/?delimiter=/&prefix=');
  let jsonVersionCollection = xmlparser.parse(htmlcode.data).ListBucketResult.CommonPrefixes;
  let versions = jsonVersionCollection.filter(el => {
    return getFirstTwoVersion(el.Prefix) === getFirstTwoVersion(chromeVer);
  });
  let latestVersion = versions.reduce((acc, curr, idx) => {
    return acc = acc > curr.Prefix ? acc : curr.Prefix;
  }, '');
  
  console.log(`Latest Chrome driver version: ${latestVersion}`);

  // Download File
  let downloadUrl = `https://chromedriver.storage.googleapis.com/${latestVersion}chromedriver_win32.zip`;
  const writer = fs.createWriteStream(downloadFile);
  let downloadStream = await axios({
    url: downloadUrl,
    method: 'GET',
    responseType: 'stream'
  });

  await downloadStream.data.pipe(writer);  
  writer.on('close', ()=> {
    console.log('File downloaded! Start to decompress....');
    decompress(downloadFile, null, {
      plugins:[
        decompressUnzip()
      ]
    }).then(() => {
      console.log(`The zip file was decompressed! Update config verison: ${latestVersion}`);
      //Update config file
        fs.writeFileSync(driverVerConfig, latestVersion, {
          encoding: 'utf-8',
          flag: 'w'
        });
    }).catch(err => console.log('The zip file decompress failed. ', err.message));
  });
}

if (getFirstTwoVersion(chromeVer) !== getFirstTwoVersion(chromeDriverVer)) {
  //執行更新, 當Driver與Chrome瀏覽器版本不符
  console.log('Updating driver. Please wait....');
  updateDriver();
}

console.log('The driver is up to date. Start processing...');

let dateObj = holidays.find(item => {
  return item['西元日期'] === today;
});

// Check if today is holiday
isHoliday = dateObj['是否放假'] == 2 ? true : false;
if (isHoliday) {
  console.log(`Happy holiday! Comment: ${dateObj['備註']}`);
  return;
}

// Check if today is off day
data = fs.readFileSync(`${__dirname}\\dayoff.txt`);
let arrDayoff = JSON.parse(data.toString());
isDayoff = arrDayoff.some(el => el == today);
if (isDayoff) {
  console.log('Out of office today.');
  return;
}

// Punch in process
(async function example() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('https://xpage.foxlink.com.tw/WebAp/fit/AP001.nsf/HR_AP03.xsp');
    await driver.findElement(By.name('Username')).sendKeys(username);
    await driver.findElement(By.name('Password')).sendKeys(password);
    await driver.findElement(By.xpath("//input[@type='submit' and @value='Sign In']")).sendKeys(Key.RETURN); //Key.RETURN
    await driver.wait(until.titleIs('崴強_行動打卡'), 1000);
    await driver.findElement(By.id('view:_id1:_id24:callback1:radioGroup1:1')).click(); //溫度超過? 否
    await driver.findElement(By.id('view:_id1:_id24:callback1:inputText2')).sendKeys(getRandomTemperature()); //溫度
    await driver.findElement(By.id('view:_id1:_id24:callback1:radioGroup2:1')).click();
    await driver.findElement(By.id('view:_id1:_id24:callback1:radioGroup4:1')).click();
    await driver.findElement(By.id('view:_id1:_id24:callback1:button6')).click(); // 送出
    console.log('Punch In Done!!');
  } catch (err) {
    console.log(`Error happened: ${err.message}`);
  } finally {
    //await driver.quit();
  }
})();

const getRandomTemperature = function () {
  const wendu = (Math.floor(Math.random() * (368 - 360 + 1)) + 360) / 10;
  console.log(`Temperature: ${wendu}`);
  return wendu;
}


function getFirstTwoVersion(ver) {  
  let vs = ver.split('.');
  return `${vs[0]}.${vs[1]}`;
}