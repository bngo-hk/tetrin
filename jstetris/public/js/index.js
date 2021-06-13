//左右定数定義
  const LEFT=-1;
  const RIGHT=1;
//ミノ種類定数定義
  const IMN = 1;
  const TMN = 2;
  const OMN = 3;
  const JMN = 4;
  const LMN = 5;
  const ZMN = 6;
  const SMN = 7;
  //ゴーストブロック種類定義
  const IGH = IMN + 20;
  const TGH = TMN + 20;
  const OGH = OMN + 20;
  const JGH = JMN + 20;
  const LGH = LMN + 20;
  const ZGH = ZMN + 20;
  const SGH = SMN + 20;
  //クリアエフェクト用
  const CLEAR1 = -2
  const CLEAR2 = -3
  const CLEAR3 = -4


  //fieldのサイズ
  F_WIDTH = 300;
  F_HEIGHT = 600;
  //nextのサイズ
  N_WIDTH = 100;
  N_HEIGHT = 220;
  //holdのサイズ
  H_WIDTH = 100;
  H_HEIGHT = 100;

  //おにちくモード変数初期化
  let oniFlg=false;
  let oniCnt=0;
  let oniMargin=0;
  

  //canvas contextを保持する
  let contextObj={};

  function createcanvas(width,height,contextName,className,lineWidth){
    //canvas作成
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    //canvasをエレメントの子要素にする
    
    const elemField = document.querySelector(className);
    elemField.appendChild(canvas);

    contextObj[contextName] = canvas.getContext('2d');
    //線の太さ
    contextObj[contextName].lineWidth=lineWidth;
  }
  
  // canvas要素を作る。
  createcanvas(F_WIDTH,F_HEIGHT,'field','.pg_game',3);
  createcanvas(N_WIDTH,N_HEIGHT,'next','.next_box',2);
  createcanvas(H_WIDTH,H_HEIGHT,'hold','.hold_box',2);

  //ボタン要素取得
  const start_button = document.querySelector('.button_start')
  const howto_button = document.getElementsByClassName('button_howto')
  const howto_button2 = document.querySelector('.button_howto2')
  const restart_button = document.querySelector('.button_restart')
  const toTop_button = document.querySelector('.button_toTop')
  const tweet_button = document.querySelector('.button_tweet')
  const oni_button = document.querySelector('.button_oni')
  //ページ要素取得
  const pg_top = document.querySelector('.pg_top')
  const pg_howto = document.querySelector('.pg_howto')
  const pg_gov = document.querySelector('.pg_gov')
  const pg_clear = document.querySelector('.pg_clear')
  const pg_result = document.querySelector('.pg_result')
  //テーブル要素取得
  const tablecells = document.getElementsByClassName('tablecells')
  //レベル,ラインを書き込む要素取得
  const levelElem = document.querySelector('.level_view');
  const lineElem = document.querySelector('.line_view');
  const scoreElem = document.querySelector('.score_view');


  //onclick設定

  //スタート
  start_button.addEventListener("click", ()=>{
    pg_top.style.display='none';
    pg_howto.style.display='none';
    oniFlg=false
    controller();
  });
  //おにちくスタート
  oni_button.addEventListener("click", ()=>{
    pg_top.style.display='none';
    pg_howto.style.display='none';
    oniFlg=true
    controller();
  });

  howto_button[0].addEventListener("click", ()=>{
    //howtoページを表示
    pg_howto.style.display='block';
    pg_howto.className='pg_howto pg_howto_active';
  });

    howto_button[1].addEventListener("click", ()=>{
    //howtoページを表示
    pg_howto.style.display='block';
    pg_howto.className='pg_howto pg_howto_active';
  });

   pg_howto.addEventListener("click", ()=>{
    //howtoページを非表示に
    pg_howto.style.display='none';
    pg_howto.className='pg_howto';
  });

    //ゲームオーバー時のリスタート
    restart_button.addEventListener("click", ()=>{
    //ゲームオーバー画面消す
    pg_gov.style.display='none';
    pg_gov.className='pg_gov';
    restart_button.innerHTML = 'TRY AGAIN?';
    //キャンバスクリア
    contextObj['field'].clearRect(0, 0, F_WIDTH, F_HEIGHT);
    contextObj['next'].clearRect(0, 0, F_WIDTH, F_HEIGHT);
    contextObj['hold'].clearRect(0, 0, F_WIDTH, F_HEIGHT);
    //リスタート
    controller();
  });
    //ボタンの装飾
    restart_button.addEventListener("mouseover", ()=>{
    restart_button.innerHTML = 'YES!YES!YES!'

  });
    //ボタンの装飾
    restart_button.addEventListener("focus", ()=>{
    restart_button.innerHTML = 'YES!YES!YES!'
  });
    //ボタンの装飾
    restart_button.addEventListener("mouseout", ()=>{
    restart_button.innerHTML = 'TRY AGAIN?'
  });
    //ボタンの装飾
    restart_button.addEventListener("focusout", ()=>{
    restart_button.innerHTML = 'TRY AGAIN?'
  });

  toTop_button.addEventListener("click", ()=>{
    resultEnd()
    setkeydown()
    lineElem.innerHTML=0;
    scoreElem.innerHTML=0;
    levelElem.innerHTML=1;
    pg_top.style.display='block';
  });

  //おにちくモード設定
  function setkeydown(){
    window.onkeydown = (e) => {
    //hkhkの順で押す
    if(e.key==='h')
    {
      if(oniCnt %2 ===0)
      {
        oniCnt++;
      }
      else
      {
        oniCnt=0;
      }
    }
    else if(e.key==='k')
    {
      if(oniCnt===1)
      {
        oniCnt++;
      }
      else if(oniCnt===3)
      {
        //おにちくモードボタン出現
        oni_button.style.display='block';
      }
      else
      {
        oniCnt=0;
      }
    }
    else{
        oniCnt=0;
      }
  }
}
  setkeydown()


//盤面管理
class Manager{
  constructor(){
    //変数初期化 (レベル,ライン,スコア,ホールド,ホールドフラグ,表示したミノ数,フレーム)
    this.level= 1;
    this.line = 0;
    this.lineRest = 0;
    this.score= 0;
    this.minoCnt=2;
    this.hold = 0;
    this.currentMino=0;
    this.holdFlg=true;
    this.frame=0;
    
    if(oniFlg)
    {
      this.level=16;
    }


    //ゲームオーバーフラグ
    this.gameoverFlag=false;
    //盤面作成
    //Array[0][0]～Array[23][11]
    this.field = Array.from(new Array(24), () => new Array(12).fill(0));
    this.field_p = Array.from(new Array(24), () => new Array(12).fill(0));
    //外枠埋め
    for(var i=0;i<12;i++)
    {
      //下
      this.field[23][i]=-1;
      this.field_p[23][i]=-1;
      //左
      this.field[i][0]=-1;
      this.field_p[i][0]=-1;
      //右
      this.field[i][11]=-1;   
      this.field_p[i][11]=-1; 
    }

    for(i=12;i<24;i++)
    {
      //左
      this.field[i][0]=-1;
      this.field_p[i][0]=-1;
      //右
      this.field[i][11]=-1;
      this.field_p[i][11]=-1;
    }
    //ミノ配列作成 1～7個目
    this.minoList = [IMN,TMN,OMN,JMN,LMN,ZMN,SMN];
    this.shuffleMino(this.minoList);
    //8~14個目
    this.minoList2 = [IMN,TMN,OMN,JMN,LMN,ZMN,SMN];
    this.shuffleMino(this.minoList2);
    //初期ネクスト更新
    this.next=[this.minoList[0],this.minoList[1],this.minoList[2]]

    // 色を保存
    this.color={
       [IMN] : ['#00ffff','#008080','#60ffff'],
       [TMN] : ['#ff00ff','#800080','#ff60ff'],
       [OMN] : ['#ffff00','#808000','#ffff60'],
       [ZMN] : ['#ff0000','#800000','#ff6060'],
       [SMN] : ['#00ff00','#008000','#60ff60'],
       [JMN] : ['#0000ff','#000080','#6060ff'],
       [LMN] : ['#ff8000','#804000','#ffa060'],
       [IGH] : ['rgba(0,255,255,.6)','rgba(0,128,128,.6)','rgba(96,255,255,.6)'],
       [TGH] : ['rgba(255,0,255,.6)','rgba(128,0,128,.6)','rgba(255,96,255,.6)'],
       [OGH] : ['rgba(255,255,0,.6)','rgba(128,128,0,.6)','rgba(255,255,96,.6)'],
       [ZGH] : ['rgba(255,0,0,.6)','rgba(128,0,0,.6)','rgba(255,96,96,.6)'],
       [SGH] : ['rgba(0,255,0,.6)','rgba(0,128,0,.6)','rgba(96,255,96,.6)'],
       [JGH] : ['rgba(0,0,255,.6)','rgba(0,0,128,.6)','rgba(96,96,255,.6)'],
       [LGH] : ['rgba(255,128,0,.6)','rgba(128,64,0,.6)','rgba(255,160,96,.6)'],
       [CLEAR1]:['rgba(255,255,255,1)'],
       [CLEAR2]:['rgba(180,255,255,.7)'],
       [CLEAR3]:['rgba(0,180,255,.4)'],
       ['gameover'] : ['#444','#222','#777'],
    };

    //種類と文字の対照表
    this.kindLetter={
      [IMN] : 'I', [TMN] : 'T', [OMN] : 'O',
      [ZMN] : 'Z', [SMN] : 'S',
      [JMN] : 'J', [LMN] : 'L'
    }

    //hold,nextボックスの中央寄せ
    this.drawerWeight={
      [IMN] : 0.5, [TMN] : 0.5, [OMN] : 0,
      [ZMN] : 0.5, [SMN] : 0.5,
      [JMN] : 0.5, [LMN] : 0.5
    }
    //スコア表
      this.scoreList={
      'normal':[1000 , 4000 , 9000 , 20000],
      'tspin':[5000 , 20000, 36000]
    };
    if(oniFlg)
    {
      this.scoreList={
        'normal':[2000 , 8000 , 18000 , 40000],
        'tspin':[10000 , 40000, 72000]
      };
    }
    
    this.delHeight={
      [CLEAR1]:30,
      [CLEAR2]:20,
      [CLEAR3]:5,
    }
    
  }

  //フィールド全体を描画する
  rectDrawer(){
    contextObj['field'].clearRect(0, 0, F_WIDTH, F_HEIGHT);
    let val;
    let start={};
    // 正方形を1個ずつ追加。
    //field[1][1]～field[20][10]をチェック
    for(let y=1; y<23;y++)
    {
      //消去列描画
      val = this.field_p[y][1] 
      if(val <= CLEAR1)
      {
        contextObj['field'].beginPath();
        contextObj['field'].rect(0 , (y-3)*30 + (30-this.delHeight[val])/2 , 300, this.delHeight[val]);
        contextObj['field'].fillStyle = this.color[ val ] [0];
        contextObj['field'].fill();
      }
      for(var x=1; x<11;x++)
      { 
        //valは0(空白)か、定数 IMN,TMNなど(1~7)
        //暫定フィールドを描画
        val=this.field_p[y][x];
        if(val>=IGH)
        {
          start.x=(x-1)*30;
          start.y=(y-3)*30;
          contextObj['field'].beginPath();
          contextObj['field'].rect(start.x ,start.y , 30, 30);
          contextObj['field'].fillStyle = this.color[val][0];
          contextObj['field'].fill();
        }
        else if(val>0)
        {

          start.x=(x-1)*30 + 1.5;
          start.y=(y-3)*30 + 1.5;
  
          contextObj['field'].beginPath();
          contextObj['field'].moveTo(start.x,start.y);
          contextObj['field'].lineTo(start.x + 27, start.y);
          contextObj['field'].lineTo(start.x + 27, start.y + 27);
          contextObj['field'].strokeStyle = this.color[val][0]; // 塗る色
          contextObj['field'].stroke();
   
          contextObj['field'].beginPath();
          contextObj['field'].strokeStyle = this.color[val][1]; 
          contextObj['field'].moveTo(start.x + 27 ,start.y + 27);
          contextObj['field'].lineTo(start.x, start.y + 27);
          contextObj['field'].lineTo(start.x,start.y);
          contextObj['field'].stroke();

          contextObj['field'].beginPath();
          contextObj['field'].rect(start.x+1.5  ,start.y+1.5  , 24, 24);
          contextObj['field'].fillStyle = this.color[val][2];
          contextObj['field'].fill();

          contextObj['field'].beginPath();
          contextObj['field'].moveTo(start.x +1.5 , start.y +7);
          contextObj['field'].lineTo(start.x +25.5, start.y + 13);
          contextObj['field'].lineTo(start.x + 25.5, start.y + 25.5);
          contextObj['field'].lineTo(start.x +1.5, start.y + 25.5);
          contextObj['field'].closePath();
          contextObj['field'].fillStyle = this.color[val][0];
          contextObj['field'].fill();
        }
      }
    }
  }

  //描画をループする処理
  loop(){
    //魂の30fps
    //フレーム加算
    this.frame++;
    if(this.gameoverFlag)
    {
      //ゲームオーバーで停止
      return false
    }
    //描画呼び出し
    this.rectDrawer()
    //再帰呼び出し
    //フレーム送り
    setTimeout(this.loop.bind(this), 1000/30);
 
  }

  
  
  //ホールド描画
  holdDrawer(){
    const size=15;
    contextObj['hold'].clearRect(0, 0, H_WIDTH, H_HEIGHT);
    //minoShape[ this.kindLetter[IMN] ] === minoShape.I
    const rects = minoShape[ this.kindLetter[ this.hold ] ]
    let start={}
    const lineWidth=2;
    let color= this.color[this.hold];
    if(!this.holdFlg)
    {
      color = this.color['gameover'];
    }

    rects.forEach(element => {

          start.x = H_WIDTH/2 + element[0]*size - size/2 +1.5;
          start.y = H_HEIGHT/2 - (element[1]-this.drawerWeight[this.hold])*size - size/2;
            
          contextObj['hold'].beginPath();
          contextObj['hold'].moveTo(start.x,start.y);
          contextObj['hold'].lineTo(start.x + size-lineWidth, start.y);
          contextObj['hold'].lineTo(start.x + size-lineWidth, start.y + size-lineWidth);
          contextObj['hold'].strokeStyle = color[0]; // 塗る色
          contextObj['hold'].stroke();
   
          contextObj['hold'].beginPath();
          contextObj['hold'].moveTo(start.x + size-lineWidth ,start.y + size-lineWidth);
          contextObj['hold'].lineTo(start.x, start.y + size-lineWidth);
          contextObj['hold'].lineTo(start.x,start.y);
          contextObj['hold'].strokeStyle = color[1]; 
          contextObj['hold'].stroke();

          contextObj['hold'].beginPath();
          contextObj['hold'].rect(start.x + lineWidth/2 +0.2 ,start.y + lineWidth/2 -0.2, size - lineWidth*2 +0.2, size - lineWidth*2 +0.2);
          contextObj['hold'].fillStyle = color[2];
          contextObj['hold'].fill();

          contextObj['hold'].beginPath();
          contextObj['hold'].moveTo(start.x + lineWidth/2 , start.y + 3);
          contextObj['hold'].lineTo(start.x + size - lineWidth, start.y + 6);
          contextObj['hold'].lineTo(start.x +  size - lineWidth, start.y +  size - lineWidth);
          contextObj['hold'].lineTo(start.x + lineWidth/2, start.y +  size - lineWidth);
          contextObj['hold'].closePath();
          contextObj['hold'].fillStyle = color[0];
          contextObj['hold'].fill();
    });
  }

  //ネクスト描画
  nextDrawer(){
    const size=15;
    let rects=[]
    let start={}
    let lineWidth=2;
    let cnt=0;
    let ajust =[2,80,140]
    contextObj['next'].clearRect(0, 0, N_WIDTH, N_HEIGHT);
    //minoShape[ this.kindLetter[IMN] ] === minoShape.I
    //ネクストの数だけ繰り返し
    this.next.forEach(kind => {
      //ネクストのブロック取得
      rects = minoShape[ this.kindLetter[ kind ] ]
      //描画
      rects.forEach(element => {

        start.x = 50 + element[0]*size - size/2 -1.5;
        start.y = 50 - (element[1]-this.drawerWeight[ kind ])*size - size/2 + ajust[cnt];
          
        contextObj['next'].beginPath();
        contextObj['next'].moveTo(start.x,start.y);
        contextObj['next'].lineTo(start.x + size-lineWidth, start.y);
        contextObj['next'].lineTo(start.x + size-lineWidth, start.y + size-lineWidth);
        contextObj['next'].strokeStyle = this.color[ kind ][0]; // 塗る色
        contextObj['next'].stroke();

        contextObj['next'].beginPath();
        contextObj['next'].moveTo(start.x + size-lineWidth ,start.y + size-lineWidth);
        contextObj['next'].lineTo(start.x, start.y + size-lineWidth);
        contextObj['next'].lineTo(start.x,start.y);
        contextObj['next'].strokeStyle = this.color[ kind ][1]; 
        contextObj['next'].stroke();

        contextObj['next'].beginPath();
        contextObj['next'].rect(start.x + lineWidth/2 ,start.y + lineWidth/2 -0.2 , size - lineWidth*2 +0.2,size - lineWidth*2 +0.2);
        contextObj['next'].fillStyle = this.color[ kind ][2];
        contextObj['next'].fill();

        contextObj['next'].beginPath();
        contextObj['next'].moveTo(start.x + lineWidth/2 , start.y + 3);
        contextObj['next'].lineTo(start.x + size - lineWidth, start.y + 6);
        contextObj['next'].lineTo(start.x +  size - lineWidth, start.y +  size - lineWidth);
        contextObj['next'].lineTo(start.x + lineWidth/2, start.y +  size - lineWidth);
        contextObj['next'].closePath();
        contextObj['next'].fillStyle = this.color[kind][0];
        contextObj['next'].fill();
      });  
      cnt++;
    });
  }

  //まあ関数を通さず値は取れるけども……
  getFrame(){
    return this.frame;
  }

  //盤面情報取得
  getField(){
    return this.field.concat();
  }
  //レベル取得
  getLevel(){
    return this.level;
  }
  //レベル取得
  getLine(){
    return this.line;
  }
  //レベル取得
  getScore(){
    return this.score;
  }

  //ホールド使用可能チェック
  checkAvailableHold(){
    return this.holdFlg;
  }
  //ホールド取得
  getHold(){

    return this.hold;
  }
    //ホールド取得
  getNext(){
    return this.next[0];
  }

  //ホールド更新
  updateHold(){
    //ホールドを使用済み状態にする
    this.holdFlg=false;
      //ホールドミノと入れ替え
      var holdb = this.hold;
      this.hold=this.currentMino;
      this.currentMino=holdb;

    return this.currentMino;
  }
  holdReset(){
    //ホールド使用状況クリア
    this.holdFlg=true;
  }

  //ミノ排出
  getMino(){
    //ネクストを取得して返す next[0]
    this.currentMino=this.next.shift();
    return this.currentMino;
  }
  
  //ネクスト更新
  updateNext(){
    this.minoCnt++;
    //ネクストをリストから取り出す
    this.next[2] = this.minoList[this.minoCnt%7];
    if(this.minoCnt%7===0)
    {
      //リストを切り替えシャッフル
      let work = this.minoList.concat();
      this.minoList = this.minoList2.concat();
      this.minoList2 = this.shuffleMino(work);
    }
    
  }

  //ツモシャッフル
  shuffleMino(list){
    //シャッフル (Fisher Yatesアルゴリズム)
    for(let i = list.length - 1; i > 0; i--){
      var r = Math.floor(Math.random() * (i + 1));
      var tmp = list[i];
      list[i] = list[r];
      list[r] = tmp;
    }
    return list
  }

  //盤面更新
  //確定したミノの座標を受け取る
  updateField(minoPoint){
    //更新列リスト初期化
    let updatedLine=[]
    //オブジェクトは4つのブロックの位置を格納している 
    //暫定フィールドにコピー
    //値渡し
    this.field_p = JSON.stringify(this.field); // JSON文字列化
    this.field_p = JSON.parse(this.field_p);
    //.x .y は座標 .kind は種別 .size はブロックの数(4つ以外でも動作するように)
    for(var i=0; i < minoPoint.length ; i++)
    {
      this.field_p[ minoPoint[i][1] ][ minoPoint[i][0] ] = minoPoint.kind;
      //更新される列番号を保存
      updatedLine.push(minoPoint[i][1]);
    }
    //更新された列番号を返す
    //Setオブジェクトで重複排除(filterより早いらしい)
    //スプレッド構文(...)でオブジェクトを展開、配列化
    return [...new Set(updatedLine)];
  }

  //ミノ確定時に発火
  //暫定フィールドを同期する
  syncField(){
    if(this.hold)
    {
      this.holdDrawer();
    }
    //フィールドコピー
    this.field = JSON.stringify(this.field_p); // JSON文字列化
    this.field = JSON.parse(this.field);
  }
  //ライン消去判定
  //更新されたラインを受け取る
  //updateLineList(下から)
  deleteJudge(updatedLineList){
    //削除列リスト初期化
    let deleteLineList= [];
    let line
    let flg;
      //更新されたライン数分繰り返し
      for(var i=0;i<updatedLineList.length;i++)
      {
        line = updatedLineList[i];
        //flg=trueでライン消去
        flg=true;
        
        //1列分のフィールド状況を確認する
        for(var j=1;j<11;j++)
        {
          //ブロックが無ければ0が入っている
          if(this.field[line][j]===0)
          {
            //隙間が空いている場合フラグをfalseにする
            flg=false;
            break;
          }
        }
       
        if(flg)
        {
          //削除列リストにライン番号をpushする
          deleteLineList.push(line);
        }
      }
      if(deleteLineList.length===0)
      {
        return false
      }
      //削除列リストが空でなければ削除処理
      return deleteLineList
  }

   //ライン消去
  async deleteLine(deleteLineList,tspin){
    //最下段から最初の消去列まで
    const length=deleteLineList.length;
    //消去ライン加算
    this.lineAdd(length);
    //スコア加算
    this.scoreAdd(length,tspin);
    //レベル加算
    this.levelAdd();
    //降順にラインを消す
    //配列ソート
      deleteLineList.sort(
        function(a,b){
          return (a < b ? 1 : -1);
        }
      );

    //新しい列を定義
    const newLine=[-1,0,0,0,0,0,0,0,0,0,0,-1];
    const newDelLine=[-1,CLEAR1,CLEAR1,CLEAR1,CLEAR1,CLEAR1,CLEAR1,CLEAR1,CLEAR1,CLEAR1,CLEAR1,-1];

    
    for(let i=0; i<length; i++){
      //削除列置き換え
      this.field.splice(deleteLineList[i], 1, newDelLine);
    }
    this.updateField([])
    await sleep(1000/30)

    for (let j = 0; j < 2; j++) {
      for(let i=0; i<length; i++){
        //削除列置き換え
        //（判定が列の先頭だけなので）先頭(field.[y][1])だけCLEAR2,3にする
        this.field[ deleteLineList[i] ][1] = CLEAR2-j
      }
        this.updateField([])
        await sleep(1000/30)
    }

    for(let i=0; i<length; i++){
      //指定列削除
      this.field.splice(deleteLineList[i], 1);
    }
    for(let i=0; i<length; i++){
      //空の列を最上段に挿入
      this.field.unshift(newLine);
    }
    this.updateField([])
  }
  //レベル管理
  levelAdd(){
    if(this.lineRest>=10)
    {
      this.lineRest-=10;
      this.level++;
    }
  } 
  //ライン管理
  lineAdd(line){
    this.line += line;
    this.lineRest += line;
  }
  //スコア管理
  //ライン数,tspin判定を受け取る
  scoreAdd(number,tspin){
    this.score += tspin ? this.scoreList['tspin'][number-1] : this.scoreList['normal'][number-1];
  }
  //ゲームオーバー判定
  judgeGameover(next){
    const shape= minoShape[ this.kindLetter[next] ]
    const weight= minoWeight[ this.kindLetter[next] ]
    const point = shape.map(function (value) {
      return [value[0] + weight[0], -value[1] - weight[1]]
    })

    //基準点
    const refx = 5;
    let check=[]
    let flg=false;
    let refy=4;
    for(;refy>=2;refy--)
    {

      check = point.map( value =>{
        return this.field[value[1] + refy][value[0] + refx]
      })
      flg = check.every(element => {
        return (element === 0);
      });
      if(flg)
      {
        break;
      }
    }

    if(flg)
    {
      return {flg : false, y : refy}
    }
    else{
      return {flg : true}
    }
  }

  gameOverEf(){
      this.color[IMN]=this.color[TMN]=this.color[OMN]=this.color[SMN]=this.color[ZMN]=this.color[JMN]=this.color[LMN]=
      this.color[IGH]=this.color[TGH]=this.color[OGH]=this.color[SGH]=this.color[ZGH]=this.color[JGH]=this.color[LGH]=this.color['gameover'];
  }

  gameOver(){
    this.gameoverFlag=true;
  }

}

//テトノミノクラス
//一つごとにオブジェクト生成、削除
class Tetnomino{
  constructor(field,minoShape,minoWeight,kind,y){//フィールド,ミノ形状,補正値,ミノ種類,出現y座標
  
    //値渡し
    this.minoShape = JSON.stringify(minoShape); // JSON文字列化
    this.minoShape = JSON.parse(this.minoShape);
    
    this.field = field;
    this.minoWeight = minoWeight;
    this.kind = kind;
    this.refPoint={};
    this.spinPoint={};

    //基準点
    this.refPoint.x = 5;
    this.refPoint.y = y;
    //回転位置(上下左右)
    this.spinPoint.x=0;
    this.spinPoint.y=1
    //tspinフラグ
    this.tspinFlg = false;
  }

  //回転
  //x' = xcosθ - ysinθ
  //y' = ycosθ + xsinθ
  turn(LR){//なぜspinではないのか？
    //回転した形状
    let turned=[];
    //回転した座標
    let turnedPoint=[];

    for(var i=0; i<this.minoShape.length; i++)
    {
      //変形
      //x=y y=-x
      turned.push( [LR * this.minoShape[i][1], -LR * this.minoShape[i][0] ])

      //基準点からの差を算出し座標に変換
      turnedPoint.push([
        this.refPoint.x + (turned[i][0] + this.minoWeight[0]),
        this.refPoint.y - (turned[i][1] + this.minoWeight[1])
        ])
    }
    

    //回転位置更新
    const spinPointTemp={
      x : LR * this.spinPoint.y,
      y : -LR * this.spinPoint.x
    }
    //移動量保存
    const move={
      x : spinPointTemp.x -  this.spinPoint.x,
      y : spinPointTemp.y -  this.spinPoint.y,
    }
    let shift={}
    //ずらしの値計算
    if(this.kind===IMN)
    {
      shift={
        x:[
            0,
            -0.5 * move.x + 1.5 * move.y + (move.x+move.y) * (move.x+move.y+2) * (-3/16 * LR - 3/16),
            // (x+y) * (x+y+2) → (1,1)以外を0にする
            -0.5 * move.x - 1.5 * move.y + (move.x+move.y) * (move.x+move.y+2) * (3/16 * LR + 3/16),
            -0.5 * move.x + 1.5 * move.y,
            -0.5 * move.x - 1.5 * move.y
          ],
        y:[
            0,
            0,
            0,
            -1 * (-1.5 * move.x - 0.5 * move.y),
            -1 * (1.5 * move.x - 0.5 * move.y)     
          ]
      }
    }
    else
    {
      shift={
        x:[
            0,
            -move.x,
            -move.x,
            0,
            -move.x
          ],
        y:[
            0,
            0,
            -1 * -LR * move.x * move.y,
            -1 * 2 * LR * move.x * move.y,
            -1 * 2 * LR * move.x * move.y          
          ]
      }
    }

    for(i=0;i<5;i++)
    {
      //回転可能チェック
      //可能でなければ 上左右下に1ブロックずらして再度チェック
      
      if(this.turnCheck(turnedPoint, shift.x[i], shift.y[i]))
      {
    
        //ミノ形状を変更
        for(var j=0;j < turned.length ;j++)
        {
          this.minoShape[j][0] = turned[j][0];
          this.minoShape[j][1] = turned[j][1];
        }
        
        //ずらし
        this.refPoint.x += shift.x[i];
        this.refPoint.y += shift.y[i];

        //回転位置確定
        this.spinPoint.x=spinPointTemp.x;
        this.spinPoint.y=spinPointTemp.y;

        if(this.kind===TMN)
        {
          this.tspinCheck()
        }

        break;
      }
    }
  }

  //回転可能チェック
  turnCheck(turnedPoint,shiftX,shiftY){//座標,ずらし値
    let flg=true;
    //回転後のブロックの座標とフィールドの座標を照合
    //0でなければブロックが重なる
    for(var i=0; i<turnedPoint.length; i++)
    {
      if(this.field[ turnedPoint[i][1] + shiftY ][ turnedPoint[i][0] + shiftX ] !== 0)
      {
        flg=false;
        break;
      }
    }
    return flg;
  }

  tspinCheck(){
      const block = [
        //ミノの中心の周囲斜め4マスのうち、3マス以上埋まっていればtspinと判定する
        [this.refPoint.x -1 , this.refPoint.y -1],
        [this.refPoint.x -1 , this.refPoint.y +1],
        [this.refPoint.x +1 , this.refPoint.y -1],
        [this.refPoint.x +1 , this.refPoint.y +1]
      ]
      let filled=0;
      for(let i=0;i<block.length;i++)
      {
        this.field[ block[i][1] ][ block[i][0] ]!== 0 
        ? filled++ : '' ;
      }
      if(filled>=3)
      {

        this.tspinFlg=true
        this.tspinPoint = {
          x : this.refPoint.x,
          y : this.refPoint.y
        }
      }
  }
  //左右移動
  move(LR){
    //座標配列初期化
    let minoPoint=Array.from(new Array(this.minoShape.length), () => new Array(2).fill(0));
  
    //移動可能か
    let flg=true;

    for(var i=0; i<this.minoShape.length ;i++)
    {
      minoPoint[i][0] = this.refPoint.x + LR + (this.minoShape[i][0] + this.minoWeight[0]);
      minoPoint[i][1] = this.refPoint.y - (this.minoShape[i][1] + this.minoWeight[1]);
      if(this.field[ minoPoint[i][1] ] [ minoPoint[i][0] ] !== 0)
      {
        flg=false;
        break;
      }
    }
    if(flg){
      this.refPoint.x += LR;
    }    
  }
  //落下
  fallCheck(){
    let flg=true;
    //身の座標配列初期化
    let minoPoint=Array.from(new Array(this.minoShape.length), () => new Array(2).fill(0));
    
    for(var i=0; i<this.minoShape.length ;i++)
    {
      minoPoint[i][0] = this.refPoint.x + (this.minoShape[i][0] + this.minoWeight[0]);
      minoPoint[i][1] = this.refPoint.y + 1 - (this.minoShape[i][1] + this.minoWeight[1]);

      if(this.field[ minoPoint[i][1] ] [ minoPoint[i][0] ] !== 0)
      {
        return false;
      }
    }
    return true;
  }

  fall(){
    this.refPoint.y += 1;
  }

  //ハードドロップ準備
  preHardDrop(){
    let flg=true;
    //座標配列初期化
    let minoPoint=Array.from(new Array(this.minoShape.length), () => new Array(2).fill(0));
    
    //高さ初期化
    let nearest=23;
    let dist;
    for(var i=0; i<this.minoShape.length ;i++)
    {
      //座標算出
      minoPoint[i][0] = this.refPoint.x + (this.minoShape[i][0] + this.minoWeight[0]);
      minoPoint[i][1] = this.refPoint.y - (this.minoShape[i][1] + this.minoWeight[1]);
      for(var j=0;j<24;j++)
      {
        //フィールドの真下を探索
        if( this.field [j] [ minoPoint[i][0] ] !== 0 )
        {
          //真下のブロックと現在の座標が最も近い部分の距離を保持する
          dist = j - minoPoint[i][1];
          if(dist<nearest && -1 < dist)
          {
            nearest=dist;
          }
        }
      }
    }
    return nearest-1
  }

  hardDrop(nearest){
    this.refPoint.y += nearest;
  }

  setGhost(nearest){
    const y = this.refPoint.y + nearest;
    let block=[]
    for(var i=0; i<this.minoShape.length; i++)
    {
      block[i]=[
        this.refPoint.x + (this.minoShape[i][0] + this.minoWeight[0]) ,
        y - (this.minoShape[i][1] + this.minoWeight[1])
      ]
    }
    block.kind = this.kind + 20;
    return block;
  }

  clearGhost(nearest){
    const y = this.refPoint.y + nearest;
    let block=[]
    for(var i=0; i<this.minoShape.length; i++)
    {
      block[i]=[
        this.refPoint.x + (this.minoShape[i][0] + this.minoWeight[0]) ,
        y - (this.minoShape[i][1] + this.minoWeight[1])
      ]
    }
    block.kind = 0;
    return block;
  }




  //ミノ座標取得
  getPoint(){
    
    let block=[];
    
    for(var i=0; i<this.minoShape.length; i++)
    {
      block[i]=[
        this.refPoint.x + (this.minoShape[i][0] + this.minoWeight[0]) ,
        this.refPoint.y - (this.minoShape[i][1] + this.minoWeight[1])
      ]
     }
    //ミノ種類を追加
    block.kind=this.kind;
     return block;
  }



  //Tスピン判定
  getTspin(){
    //最後のスピンがTスピンでかつ最後の動作がスピンである
    if(this.tspinFlg){
    }
    if(this.tspinFlg && this.tspinPoint.x===this.refPoint.x && this.tspinPoint.y===this.refPoint.y)
    {
      return true
    }
    return false
  }

}

//ミノ生成関数
  function createMino(field,kind,y){
    switch (kind){//形を選択
      
      case IMN:
        mino = new Tetnomino(field,minoShape.I,minoWeight.I,kind,y);
        break;

      case TMN:
        mino = new Tetnomino(field,minoShape.T,minoWeight.T,kind,y);
        break;
      
      case OMN:
        mino = new Tetnomino(field,minoShape.O,minoWeight.O,kind,y);
        break;

      case JMN:
        mino = new Tetnomino(field,minoShape.J,minoWeight.J,kind,y);
        break;

      case LMN:
        mino = new Tetnomino(field,minoShape.L,minoWeight.L,kind,y);
        break;

      case SMN:
        mino = new Tetnomino(field,minoShape.S,minoWeight.S,kind,y);
        break;

      case ZMN:
        mino = new Tetnomino(field,minoShape.Z,minoWeight.Z,kind,y);
        break;
    }
    return mino
  }

  //ミノの形を座標で表すオブジェクトを生成する
  const minoShape={
    I : [ [-1.5,0.5], [-0.5,0.5], [0.5,0.5], [1.5,0.5] ],
    T : [ [-1,0], [0,0], [1,0], [0,1] ],
    L : [ [-1,0], [0,0], [1,0], [1,1] ],
    J : [ [-1,0], [0,0], [1,0], [-1,1] ],
    S : [ [-1,0], [0,0], [0,1], [1,1] ],
    Z : [ [-1,1], [0,1], [0,0], [1,0] ],
    O : [ [-0.5,-0.5], [-0.5,0.5], [0.5,-0.5], [0.5,0.5] ]
  }
  //座標補正値
  const minoWeight={
    I:[0.5,-0.5], T:[0,0], J:[0,0], L:[0,0], Z:[0,0], S:[0,0], O:[0.5,0.5]
  }

  //スリープ処理関数
  const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
  
  async function clearLoop(height){
    contextObj['field'].clearRect(0,F_HEIGHT-height+10, F_WIDTH, height-10);
    contextObj['field'].fillStyle='rgba(255,255,255,'+ height/750 +')';
    contextObj['field'].beginPath();
    contextObj['field'].arc(F_WIDTH/2, F_HEIGHT, height, 0, Math.PI, true);
    contextObj['field'].fill();
    if(height>700)
    {
      return false;
    }
    await sleep(1000/60)
    height+= 10+height/5;
    clearLoop(height);
  }

  async function clearEnd(){
    for(i=100;i>=0;i-=10)
    {
      pg_clear.style.opacity=''+i/100;
      await sleep(1000/50)
    }
    pg_clear.style.display='none';
    pg_clear.style.opacity='1';
  }

  async function resultStart(score,time,rank){
    //score
    tablecells[1].innerHTML=score;
    //time
    tablecells[3].innerHTML=time;
    //rank
    tablecells[5].innerHTML=rank;

    //表示
    pg_result.style.display='block';
    await sleep(1600)
    
    for(i=0;i<tablecells.length;i++)
    {
        tablecells[i].style.display='block';
        await sleep(850)
    }
    toTop_button.style.display='block';
    tweet_button.style.display='block';
  }

  function resultEnd(){
    pg_result.style.display='none';
    for(i=0;i<tablecells.length;i++)
    {
      tablecells[i].style.display='none';
    }
    toTop_button.style.display='none';
    tweet_button.style.display='none';

    contextObj['field'].clearRect(0, 0, F_WIDTH, F_HEIGHT);
    contextObj['next'].clearRect(0, 0, N_WIDTH, N_HEIGHT);
    contextObj['hold'].clearRect(0, 0, H_WIDTH, H_HEIGHT);
  }

  function msToTime(duration) {
    /*
      1minute = 60000ms
      1hour = 60minutes = 3600000ms
    */
    const minute = Math.floor((duration / 60000));
    const mm = ('00' + minute).slice(-2);
    const ms = ('00000' + (duration % 60000)).slice(-5);

    const time = `${mm}m ${ms.slice(0,2)}s ${ms.slice(2,4)}`;

    return time
  }

  function rankCheck(time,score){
    let rank='error';

    if(score<250000)
    {
      rank = 'HEW KIRAIYA';
    }
    else if(score<400000)
    {
      rank = 'UMAI';
    }
    else if(score<550000)
    {
      rank = 'SUGOI';
    }
    else if(score<700000)
    {
      rank = 'TENSAI';
    }
    else if(score>=700000)
    {
      rank = 'SAIKYOU';
      if(time<420000){
        rank = 'KAMI';
      }
    }
    if(oniFlg)
    {
      rank='BNGO'
    }
    return rank;
  }

  function createTweet(time,score,rank){
    const elem = document.querySelector('.twitter_a');

    let msg=`150Lines Clear!!!
    SCORE : ${score} 
    TIME  : ${time}
    RANK  : ${rank}
    `

    if(!oniFlg)
    {
      msg += 'おにちくモード → Press "hkhk"'
    }
    else{
      msg += 'おにちくモードクリア！すごい！'
    }
    msg += '\n'
    msg = encodeURI(msg);


    const url='http://twitter.com/share?text='+ msg +'&url=https://bngo-hk.com&lang=Japanese&count=none&hashtags=TETRIN';
    
    elem.href=url
  }

  //操作許可
    allowKey=true;

//ゲーム制御関数
async function controller(){   
    //ゲームオブジェクト生成
    //フィールド生成
    let game = new Manager();
    //フィールド取得
    let field = game.getField();
    //ミノリセットフラグ
    let minoResetFlg=true;

    //レベル、スコア、ライン初期化
    levelElem.innerHTML = 1;
    lineElem.innerHTML = 0;
    scoreElem.innerHTML= 0;

    //おにちくもーど設定
    if(oniFlg)
    {
      oniMargin=12;
    }

    //---------------------
    //ユーザ操作イベント設定
    //---------------------

      //イベントハンドラ設定
      //onkeydown 引数.key に押したキー名が入る
      window.onkeydown = (e) => {
        fallTF = mino.fallCheck();
         if(!fallTF && touchedFrame > Math.floor( 65 - level*2.5))
         {
           allowKey=false;
           minoResetFlg=true
         }
         else
         {
          if(allowKey)
          {
            //ゴーストブロック消去
            nearest = mino.preHardDrop();
            ghostPoint=mino.clearGhost(nearest);
            game.updateField(ghostPoint);
            game.syncField();

            if(e.key==='z'){//左右回転
              mino.turn(RIGHT)
              
            }else if(e.key==='x'){
              mino.turn(LEFT)
            }else if(e.key==='ArrowDown'){//ソフトドロップ
              if(fallTF){
                mino.fall();
              }
              else{
                touchedFrame+=1;
              }
            }else if(e.key==='ArrowLeft'){//左右移動
              mino.move(LEFT)
            }else if(e.key==='ArrowRight'){
              mino.move(RIGHT)
            }else if(e.key==='ArrowUp'){//ハードドロップ
              //ミノリセットフラグ
              minoResetFlg=false;

              //ハードドロップ
              nearest = mino.preHardDrop()
              mino.hardDrop(nearest)

              allowKey=false;
              //ミノ位置取得
              minoPoint=mino.getPoint();
              
              //更新列受取
              updateLineList = game.updateField(minoPoint);
              
              //フィールド同期
              game.syncField();

              //猶予フレームをリセット
              touchedFrame=0;
              
            }else if(e.key==='Shift'){//ホールド
              if(game.checkAvailableHold())
              {
                minoKind = game.getHold()
                //最初の使用時(holdが空)
                if(minoKind===0)
                {
                  minoKind = game.getNext()
                }
                //ゲームオーバーチェック
                gameOverObj = game.judgeGameover(minoKind)
                if(gameOverObj.flg)
                {
                  //ゲームオーバーになるためhold操作拒否
                  minoPoint=mino.getPoint();
                  game.holdFlg=false;

                  //ゴーストブロック表示高さ取得
                  nearest = mino.preHardDrop();
                  //ミノとゴーストブロックの位置が同じ場合表示しない
                  if(nearest>0)
                  {
                    ghostPoint = mino.setGhost(nearest);
                    game.updateField(ghostPoint);
                    game.syncField();
                  }
                  //ミノ位置反映
                  minoPoint = mino.getPoint();
                  game.updateField(minoPoint);

                  return false
                }
                minoKind = game.updateHold()
                if(minoKind===0)
                {
                  minoKind = game.getMino()
                
                  //ネクスト更新
                  game.updateNext();
                  game.nextDrawer();
                }
                //猶予フレームをリセット
                touchedFrame=0;
                //ホールド描画
                game.holdDrawer()
                createMino(field,minoKind,gameOverObj.y);

                //おにちく20G
                if(oniFlg)
                {
                  nearest = mino.preHardDrop();
                  mino.hardDrop(nearest)
                  //ミノ位置反映
                  minoPoint = mino.getPoint();
                  game.updateField(minoPoint);
                }
              }
            }
            minoPoint=mino.getPoint();

            //ゴーストブロック表示高さ取得
            nearest = mino.preHardDrop();
            //ミノとゴーストブロックの位置が同じ場合表示しない
            if(nearest>0)
            {
              ghostPoint = mino.setGhost(nearest);
              game.updateField(ghostPoint);
              game.syncField();
            }
            //ミノ位置反映
            minoPoint = mino.getPoint();
            game.updateField(minoPoint);
          }
        }
      }
    //ホールド取得
    let hold = game.getHold();
    //レベル取得
    let level=game.getLevel();
    levelElem.innerHTML= level ;
    //フレーム設定
    let frame=0;
    let startframe=0;
    //ライン初期化
    let line=0;

    //その他いろいろ初期化
    let minoPoint=[];
    let ghostPoint=[];
    let fallTF=true;
    let deleteLineList=[];
    let updateLineList=[];
    let touchedStart=null;
    let tspin=false;
    let gotNext;
    let gameOverObj={flg:false , y:4}
    touchedFrame=0;
    let nearest=0;
    //タイマースタート
    const startTime = new Date();
//描画ループ開始
    game.loop()
  //  ループ

  //ゲームオーバーでbreak
  while(true)
  {  
    //テトリミノ生成
    field=game.getField()
    let minoKind = game.getMino();
    //ゲームオーバー判定時のy座標を再利用
    mino = createMino(field,minoKind,gameOverObj.y);
    //NEXT表示
    game.updateNext();
    //ネクスト描画
    game.nextDrawer();
    //ゴーストブロック表示
    nearest = mino.preHardDrop();
    ghostPoint = mino.setGhost(nearest);
    game.updateField(ghostPoint);
    game.syncField();

    //描画(フィールド情報渡し)
    minoPoint = mino.getPoint();
    game.updateField(minoPoint);
    //落下開始フレーム初期化
    startFrame=game.getFrame();
    //更新ラインリスト初期化
    updateLineList=[];
    //ループ
    minoResetFlg=true;
    //操作許可
    allowKey=true;
    //おにちく20G
    if(oniFlg)
    {
      nearest = mino.preHardDrop();
      mino.hardDrop(nearest)
      //ミノ位置反映
      minoPoint = mino.getPoint();
      game.updateField(minoPoint);
    }
    while(minoResetFlg)
    {
      //スリープ処理
      await sleep(1000/60)
      frame=game.getFrame();
      //自由落下 60/レベル フレーム経過で1ブロック落下
      if(frame-startFrame > Math.floor(59/(level + oniMargin*4)))
      { 
        //猶予フレーム計測
        if(touchedStart)
        {
          touchedFrame = touchedFrame + frame - touchedStart;
        }
        //落下可能か判定 
        fallTF = mino.fallCheck();
        //落下可能
        if(fallTF)
        {
          touchedStart = null;
          mino.fall(); 
          //落下計測開始フレーム更新
          startFrame=frame;
          //ミノ位置反映
          minoPoint = mino.getPoint();
          game.updateField(minoPoint);
        }
        else
        {
          //着地
          if(touchedFrame > Math.floor(30 - level/1.5 + oniMargin))
          {
            //操作拒否
            allowKey=false
            updateLineList = game.updateField(minoPoint);
            //猶予フレームをリセット
            touchedFrame = 0;
            touchedStart = null;

            //ループ抜ける
            break;
          }
          //着地計測開始フレーム更新
          touchedStart=frame;
        }
      }
    }

    //ホールドクリア
    game.holdReset();
    //暫定フィールド同期
    game.syncField();
    
    //ライン判定
    deleteLineList = game.deleteJudge(updateLineList);
    //消去、フィールド更新、スコア加算、ライン加算
    if(deleteLineList)
    {
      tspin = mino.getTspin();
      game.deleteLine(deleteLineList,tspin);
      //レベル取得,表示
      level=game.getLevel();
      levelElem.innerHTML= level ;
      //ライン取得,表示
      line=game.getLine()
      lineElem.innerHTML= line ;
      //スコア取得,表示
      score=game.getScore()
      scoreElem.innerHTML= score ;
      //エフェクト待ち
      await sleep(1000/30*4) 
    }
    //ネクスト取得
    gotNext = game.getNext()
    //ゲームオーバー判定
    //flg:フラグとy:ミノの出現高さが返る
    gameOverObj = game.judgeGameover(gotNext)
    if(gameOverObj.flg)
    {
      //直接書き換えるのは良くない
      game.holdFlg=false
      game.gameOverEf();
      await sleep(120) 
      game.gameOver();
      pg_gov.style.display='block';
      await sleep(120) 
      pg_gov.className='pg_gov pg_gov_active';
      break;
    }
    //クリア
    if(line>=150){
      //リザルト中にhold効いちゃうからゆるして
      game.holdFlg=false
      //フィールド更新 ミノはないので空の配列を渡す
      game.updateField([]);
      //タイマーストップ
      const endTime = new Date();
      //時間計測
      let time = endTime.getTime() - startTime.getTime();

      //スコア取得
      const score = game.getScore();
      const rank = rankCheck(time,score);
      time = msToTime(time);
      //ツイート作成
      createTweet(time,score,rank)
      await sleep(120) 
      game.gameOver();
      clearLoop(0);
      await sleep(420)
      pg_clear.style.display='block';
      await sleep(5200)
      clearEnd()
      resultStart(score,time,rank)
      break;

    }
  }
  //  ループ
}