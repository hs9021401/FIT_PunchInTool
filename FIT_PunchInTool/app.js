/*
Author: Alex Lin
Version: 1.1.1
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
const fs = require('fs');
const username = process.argv[2];
const password = process.argv[3];
const date = new Date();
const year = date.getFullYear();
const month = (date.getMonth() + 1).toString().padStart(2, '0');
const day = date.getDate().toString().padStart(2, '0');
let today = `${year}${month}${day}`;
let isHoliday = false;
let isDayoff = false;
let data = fs.readFileSync(`./${year}_holiday.json`);
let holidays = JSON.parse(data.toString());

let dateObj = holidays.find((item, index, arr) => {
  return item['西元日期'] === today;
});

// Check if today is holiday
isHoliday = dateObj['是否放假'] == 2 ? true : false;
if (isHoliday) {
  console.log(`Happy holiday! Comment: ${dateObj['備註']}`);
  return;
}

// Check if today is off day
data = fs.readFileSync('./dayoff.txt');
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