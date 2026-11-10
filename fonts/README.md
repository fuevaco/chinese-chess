# 棋子字型

棋子、吃子托盤及「楚河漢界」使用 **霞鶩文楷 TC Medium**，採用 SIL Open Font License 1.1；完整授權及版權聲明見 [OFL.txt](OFL.txt)。本目錄字型依 OFL 授權，與專案程式碼的 MIT 授權分開。

- 上游：<https://github.com/lxgw/LxgwWenkaiTC>
- 來源版本：`b4792201549f21d16ed1a2215f31f262c7eb7b3b`
- 原始檔：`fonts/TTF/LXGWWenKaiTC-Medium.ttf`
- 本地檔：`chess-wenkai-medium.woff2`
- 保留字元：`帥仕相傌俥炮兵將士象馬車砲卒楚河漢界`
- 處理方式：使用 fonttools 4.68.0 及 Brotli 1.2.1 裁切字元、轉為 WOFF2，保留字型名稱、版權及授權資訊，未修改字形輪廓。

重製方式（先下載上述版本的 TTF）：

```sh
python -m pip install fonttools==4.68.0 brotli==1.2.1
pyftsubset LXGWWenKaiTC-Medium.ttf --text="帥仕相傌俥炮兵將士象馬車砲卒楚河漢界" --flavor=woff2 --name-IDs='*' --output-file=chess-wenkai-medium.woff2
```

新增棋子名稱或河界文字時，需同步擴充字元子集；其他介面文字仍使用原本的系統字型。網頁先等待字型載入再繪製 Canvas 貼圖，載入失敗時使用系統字型繼續遊戲。
