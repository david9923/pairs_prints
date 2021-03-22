
const fs = require('fs');
const { promisify } = require('util');
const webdriver = require('selenium-webdriver');
const { Builder, By, until } = webdriver;

const capabilities = webdriver.Capabilities.chrome();
capabilities.set('chromeOptions', {
    args: [
        '--headless',
        '--no-sandbox',
        '--disable-gpu',
        `--window-size=1980,1200`
    ]
});

// awaitを使うので、asyncで囲む
(async () => {
    // ブラウザ立ち上げ
    const driver = await new Builder().withCapabilities(capabilities).build();
    // URLのサイトへ移動
    await driver.get("https://pairs.lv/?logou://pairs.lv/?logout");
    // 1000で1sec
    // facebookログインボタンの出現待機
    await driver.wait(until.elementLocated(By.className("css-119434f")), 10000);
    // facebookログインボタンの取得
    await driver.findElement(By.className("css-119434f")).click();

    // ウィンドウハンドルを記録
    const tabs = await driver.getAllWindowHandles();
    await driver.switchTo().window(tabs[1]);

    // メールアドレス入力
    await driver.findElement(By.xpath("//*[@id='email']")).sendKeys("246810ab90@gmail.com");

    // パスワード入力
    await driver.findElement(By.xpath("//*[@id='pass']")).sendKeys("246810KKi");

    // 待機
    await driver.sleep(2000);

    // ログインボタンを取得
    await driver.findElement(By.name("login")).click();

    await driver.switchTo().window(tabs[0]);

    //------------------------------------------------------------------------------
    // *変更点があるかもポイント*
    //------------------------------------------------------------------------------
    // 今日のピックアップ要素を取得
    if (driver.findElement(By.className("css-158rrs2"))) {
        // 無料いいねの写真要素が表示されるまで待機
        await driver.wait(until.elementLocated(By.className("css-16vhh06")), 10000);
        // 探す画面に戻る要素を取得
        await driver.findElement(By.className("css-etvp15")).click();
    }

    // 写真が表示されるまで待機する
    await driver.sleep(2000);

    // 広告表示対策で一度リロードする
    await driver.navigate().refresh();

    await driver.sleep(2000);

    for (let i=1; i<100; i++) {
        const pics = await driver.findElements(By.className("grid-user-item__34y23 css-z901cb"));
        if (pics) {
            // スクロール処理
            await driver.executeScript(
                "window.scrollTo(0, document.body.scrollHeight);"
            );
        }
        await pics[i].click();
        await driver.sleep(2000);
        await driver.navigate().back();
        await driver.sleep(1000);
        console.log("足跡をつけた人数"+i+"人");
    }

    // ブラウザ終了
    await driver.quit();

})();

