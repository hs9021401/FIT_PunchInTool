# FIT PunchInTool
## 前置
* **安裝[Node.js](https://nodejs.org/zh-tw/download/)**

* **下載[壓縮包](https://github.com/hs9021401/FIT_PunchInTool/archive/refs/heads/master.zip)並解壓縮，將裡頭的FIT_PunchInTool資料夾放置您喜好的位置**

  ![Decompress](https://github.com/hs9021401/FIT_PunchInTool/blob/816d6a521495c9bf1060ea3e65453bcd1a242235/images/decompress.png)
* **將目錄路徑加到環境變數**

  ![Setup the environment variable](https://github.com/hs9021401/FIT_PunchInTool/blob/da3fb95024cfec911ec99a169da81cc8749e4e8e/images/environmentVariable.png)
* **提升執行Powershell script權限**
  1. 在 PowerShell 啟動捷徑上按下滑鼠右鍵，選擇以系統管理員身分執行 PowerShell。
  2. 執行以下 PowerShell 指令，將執行原則設定為 RemoteSigned
  
      ``Set-ExecutionPolicy RemoteSigned``
      
      ![Elevated privilege](https://github.com/hs9021401/FIT_PunchInTool/blob/e1292079ed53d6624195f0a59a36fb78df171130/images/ps_permission.png)
* **安裝需要使用到的Node Modules**
  1. 使用Powershell cd位置至目錄裡
  2. 輸入以下指令會自動下載所需的Modules
  
      ``npm install``
    
      ![install modules](https://github.com/hs9021401/FIT_PunchInTool/blob/63bc414f760616923f480746664260f7e861418e/images/install_node_modules.png)
## 設置檔介紹
### config資料夾內容物如下
* chromeDriverVer.config
  * 紀錄目前Chrome Driver版本 **(⚠️自動偵測設置，無須手動更改⚠️)**

* auth.config
  * 存放登入帳號密碼，帳號密碼中間需要空格分開

* dayoff.config
  * 此工具會自動略過國定假日以及六日
  * 於工作日請假或颱風天休假則需要自行在此設定檔填入, 格式如下
  * ``[20211004,20211005,20211006]``
