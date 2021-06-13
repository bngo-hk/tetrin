const loadLines = document.getElementsByClassName('line');
const loadBoxes = document.getElementsByClassName('line_box');
const loadText = document.querySelector('.loading_text');
const loadWrap = document.querySelector('.loading_wrap');
const loadBox = document.querySelector('.loading_box');
async function loadingAnim(){
  for (let i = 0; i < loadLines.length; i++)
  {
    loadBoxes[i].style.transform= `rotateZ(${45 * i}deg)`;
    loadLines[i].style.transform= `translateX(${-200}px)`;
  }
  for(let i = 0; i < loadLines.length; i++)
  {
    loadLines[i].style.display= `block`;
    await sleep(125)
  }

}
loadingAnim()

//onloadで呼び出されるたびにカウントアップ
const Loader = function(expectedCnt, callback){
  let cnt = 0;
  return function(){
    if(++cnt == expectedCnt){ callback(); }
  }
};

// 画像オブジェクトの新規生成
const img1 = new Image();
const img2 = new Image();
const img3 = new Image();
const img4 = new Image();
const img5 = new Image();
const img6 = new Image();
const img7 = new Image();
const img8 = new Image();
const img9 = new Image();
const img10 = new Image();
const img11 = new Image();
const img12 = new Image();
const img13 = new Image();

// ロードする画像を設定。この設定によって非同期でロードが開始される
img1.src = "./images/nd.png";
img2.src = "./images/howto.png";
img3.src = "./images/next_img.png";
img4.src = "./images/next_img2.png";
img5.src = "./images/score_img.png";
img6.src = "./images/hold_img.png";
img7.src = "./images/field_back.png";

//待たない
img8.src = "./images/clearef1.png";
img9.src = "./images/clearef2.png";
img10.src = "./images/clearef3.png";
img11.src = "./images/clearef4.png";
img12.src = "./images/twittercard.png";
img13.src = "./images/icon_twitter.png";


const loader = Loader(7, ()=>{loadingDone()} );
img1.onload = loader;
img2.onload = loader;
img3.onload = loader;
img4.onload = loader;
img5.onload = loader;
img6.onload = loader;
img7.onload = loader;

// 必須ではないけどエラー時の処理も設定できる。エラー時には onload は
// 呼ばれないので、これがないとロード中のまま先に進まなくなる。
// image.onerror = 
//     function() {
//         // ロードエラー時処理
//     };

async function loadingDone(){
    for(i=100; i>0; i-=5)
    {
        // loadBox.style.opacity=`${i/100}`;
        // loadText.style.opacity=`${i/100}`;
        loadWrap.style.opacity=`${i/100}`;
        await sleep(32)
    }
    // for(i=5; i<101; i= i*1.1+5)
    // {
    //     loadWrap.style.top= `${i}vh`;
    //     await sleep(32)
    // }

    loadWrap.style.display= 'none';
}
  