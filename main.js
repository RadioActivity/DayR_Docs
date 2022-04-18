let data = prices["가격표_출력_원가"];
const list = document.getElementById("list");
const content = document.getElementById("search");
const price_type = document.getElementById("price_type");
//한글 음소 분리
const cho = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const jung = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅗㅏ', 'ㅗㅐ', 'ㅗㅣ', 'ㅛ', 'ㅜ', 'ㅜㅓ', 'ㅜㅔ', 'ㅜㅣ', 'ㅠ', 'ㅡ', 'ㅡㅣ', 'ㅣ'];
const jong = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
function divide(a) {
  a = a.split("");
  var b = [];
  //완성형(?)한글이면 분리목록에 포함
  for (var c = 0; c < a.length; c++) {
    if (!a[c].match(/[가-힣]/)) {
      b[c] = a[c];
      a[c] = "";
    } else
      b[c] = "";
  }
  //분리 목록에 있는 것들을 음소분리
  var result = [];
  for (var i = 0; i < a.length; i++) {
    if (a[i] != "") {
      var c = a[i].charCodeAt(0) - 0xAC00;
      var 종 = c % 28;
      var 중 = ((c - 종) / 28) % 21;
      var 초 = parseInt(((c - 종) / 28) / 21);
      result.push(cho[초]);
      result.push(jung[중]);
      if (jong[종] != "")
        result.push(jong[종]);
    } else if (a[i] == "")
      result.push(b[i]);
  }
  return result.join("");
}
//일치도 테스트
function sametest(str1, str2) {
  if (!str1 || !str2) {
    return 0;
  }
  str_2 = divide(str2).toUpperCase().split("");
  str_1 = divide(str1).toUpperCase().split("");
  var a = str_1.length;
  var b = str_2.length;
  var output = [];
  var result = [];
  for (var i = 0; i <= a; i++) {
    for (var j = 0; j <= b; j++) {
      if (result[i] == undefined)
        result[i] = [];
      if (i == 0 || j == 0) {
        result[i][j] = 0;
      } else if (str_1[i - 1] == str_2[j - 1])
        result[i][j] = result[i - 1][j - 1] + 1;
      else
        result[i][j] = Math.max.apply(null, [result[i - 1][j], result[i][j - 1]]);
    }
  }
  return ((result[a][b] / ((a + b) / 2)) * 100);
}

//리스트 생성
let sort_list = [];
function makelist(value) {
  let result = [];
  list.scrollTop = 0;
  list.innerHTML = "무언가 잘못되었어";
  if (value != undefined) {
    sort_list = [];
    list.scrollTop = 0;
    data.forEach((v, i) => {
      sort_list.push([sametest(v.아이템, content.value), v.아이템, v.가격]);
    });
    sort_list.sort(function (a, b) {
      return b[0] - a[0]
    });
       sort_list.forEach(v => {
      let item_price = divtext("price", currency ? ceil(v[2]): perRifleAmmo(v[2]));
      result.push("<div class='element'>"+makediv("img center_text", loadImage(images[v[1]]))+divtext("name", v[1])+item_price+"</div>");
    });
  } else {
    data.forEach(v => {
      let item_price = divtext("price", currency ? ceil(v.가격) : perRifleAmmo(v.가격));
      result.push(makediv("element", makediv("img center_text", loadImage(images[v.아이템]))+divtext("name", v.아이템)+item_price));
    });
  }
  list.innerHTML = result.join("");
}

let currency = true;
//표시 가격 변경
function change_display_price() {
  currency = !currency;
  price_type.textContent = "비율: "+(currency ? "일반": "라이플탄");
  makelist(content.value);
}

//라이플 탄 갯수 비례 계산
let rifle_ammo = 0;
for (var i = 0; i < data.length; i++) {
  if (data[i].아이템 == "라이플탄") {
    rifle_ammo = data[i].가격;
    break;
  }
}
function perRifleAmmo(price) {
  return ceil(price/rifle_ammo);
}

//소숫점올림
function ceil(value) {
  return Math.ceil(value*100)/100;
}

function makediv(cls, value) {
  return "<div class=\""+cls+"\">"+value+"</div>";
}

function loadImage(content) {
  return "<img src=\"./items/"+content+".png\" alt=\""+content+"\" height=\"100%\"></img>"
}

function divtext(cls, value) {
  return makediv(cls, makediv(cls+"_bg center_text", makediv("center_text", value)));
}

let started = false;
//최초 실행시 띄우는 가격표
makelist();
//입력 감지되면 작동
content.oninput = function(event) {
  started = true;
  makelist(content.value)
}