const Yn = document.getElementById('Yn')
const fin = document.getElementById('fin')
const Cn_ = document.getElementById('Cn')
const resalt = document.getElementById('resalt')
const count = document.getElementById('count')
const sand = document.getElementById('sand')
const clay = document.getElementById('clay')
const H = document.getElementById('H')
const L = document.getElementById('L')
const B = document.getElementById('B')
const Qd = document.getElementById("load")
const GroundLevel = document.getElementById("ground_level")
const PipeLevel = document.getElementById("pipe_level")
const eccentricity = document.getElementById("eccentricity")

const K = 
[
    [10,0.7,1.42],
    [11,0.68,1.47],
    [12,0.66,1.52],
    [13,0.63,1.57],
    [14,0.61,1.64],
    
    [15,0.59,1.69],
    [16,0.57,1.76],
    [17,0.55,1.82],
    [18,0.53,1.86],
    [19,0.51,1.96],

    [20,0.49,2.04],
    [21,0.47,2.12],
    [22,0.46,2.20],
    [23,0.44,2.28],
    [24,0.42,2.37],

    [25,0.41,2.46],
    [26,0.39,2.56],
    [27,0.38,2.66],
    [28,0.36,2.77],
    [29,0.35,2.88],

    [30,0.33,3.00],
    [31,0.32,3.12],
    [32,0.31,3.25],
    [33,0.30,3.39],
    [34,0.28,3.54],

    [35,0.27,3.69],
    [36,0.26,3.85],
    [37,0.25,4.02],
    [38,0.24,4.20],
    [39,0.23,4.39],

    [40,0.22,4.60],
    [41,0.21,4.82],
    [42,0.2,5.04],
    [43,0.19,5.29],
    [44,0.18,5.56],
    [45,0.17,5.83]
]

// глобальные переменные
let Ka
let alfa
let Y11
let Y1
let fi11
let fi1
let C11
let C1
let groundValue
let e
let h1
let h2
let GHoldMin // удерживающая мин
let GHoldMax // удерживающая макс
let GshiftMin // сдвигающая мин
let GshiftMax // сдвигающая макс
let W // момент сопротивления 
let S //  площадь щита
let Kp
let Fsd
let Fud
let Mud
let Mopr
let Rez


function AlfaCount(){
    Ka = (Number(interpol(1))).toFixed(2)
    // console.log('Kp='+ Kp)
    Kp = (Number(interpol(2))).toFixed(2)
    // console.log('Ka='+ Ka)
    // alfa = (Ka-Kp)*Y11
    // console.log('fi11 ='+ fi11)
    // console.log('alfa ='+ alfa)
}

// 
function Y11Count(){
    Y1= (Number(Yn.value)*1.05).toFixed(2)
    Y11= (Number(Yn.value)*1.05*0.95).toFixed(2)
}
//  
function fi11Count(){
    if(sand.checked){
            fi1 = (Number(fin.value)/1.1).toFixed(2)
           fi11 =  (fi1*0.9).toFixed(2)
           console.log(fi11)
    } else {
      fi1 = (Number(fin.value)/1.15).toFixed(2)
      fi11 = (fi1)*0.9.toFixed(2)
    }
}

// 
function C11Count (){
    let a = Number(Cn_.value)
    C1 = (a/1.5).toFixed(2)
    let C = (a/1.5)*0.5
    let h = Number(H.value)
    let gr = Number(GroundLevel.value)
    let pi= Number(PipeLevel.value)
    if(h<=1.5){
         C11 = 0
    }else if((gr-pi+h/2)<=3){
        C11 = 5
    }else if(C<=7.0){
        C11 = C
    }else C11 = 7.0
    
}


// 
function groundValueCount(){
    if(!sand.checked && !clay.checked)
        resalt.textContent = 'Установите тип грунта'
        else if(sand.checked)
            groundValue = sand.value
        else  groundValue = clay.value
    
}

function interpol(p){  
    /*arr - массив, p - Ка(1) или Кр(2), s-значение угла трения*/
 let a 
 let b
 let c
 let d

    let  long = K.length-1
    for (var i = 0; i <= long; i++) {
        if(K[i][0]>=fi11){
            a = K[i][p]
            b = K[i+1][p]
            c = K[i][0]
            d = K[i+1][0]
            break
        }
    }

    return (b-a)*((fi11-c)/(d-c))+a

}





// function eccentricity(){
//     let h = Number(H.value)
//     console.log('h ='+ h)
//     let b = Number(B.value)
//     console.log('b ='+ b)
//     let n = Number(N.value)
//     console.log('n ='+ n)
//     return ((h*h*h)*(alfa)*b)/(12*n)
// } 




count.onclick = function(){
  Rez = NaN
  Rez = '<p>Расчетные характеристики грунтов (приняты с учетом 6.3.3 ТКП 45-5.01-237-2011):</p>'
  Y11Count()
  Rez += "<p> Y1 = " + Y1+ " кН/м3 </p>"
  Rez += "<p> Y1` = " + Y11+ " кН/м3 </p>"
  fi11Count()
  Rez += "<p> f1 = " + fi1 + " град </p>"  
  Rez += "<p> f1` = " + fi11 + " град </p>"
  C11Count()
  Rez += "<p> С1 = " + C1 + " кПа </p>"
  Rez += "<p> С1` = " + C11.toFixed(2) + " кПа </p>"
  
  AlfaCount()
//   console.log(alfa)
  e = Number(eccentricity.value)
  console.log(e)
  h1 = Number(GroundLevel.value) - Number(PipeLevel.value) - ( Number(H.value)/2 + e)
//   console.log(h1)
Rez += "<p> h1 = " + h1.toFixed(2) + " м </p><p></p>"
  h2 = h1 + Number(H.value)
//   console.log(h2)
Rez += "<p> h2 = " + h2.toFixed(2) + " м </p>"
  
Rez += "<p>Коэффициенты Кр и Ка принимаем по таблице 6.4 ТКП 45-5.01-237-2011 для условий α=δ=β=0 интерполяцией для φ = "+fi11+"град</p>"
Rez += "<p> K<small>p</small> = " + Kp+ " </p>"
Rez += "<p> K<small>a</small> = " + Ka+ " </p>"
Fsd = (Number(Qd.value) + ((Yn.value)*Ka*(h1+h2)/2)*H.value*L.value).toFixed(2)
Rez += "<p> Сдвигающая сила - Fsd = " + Fsd+ " кН </p>"
// Rez += "<p> C1 = " + C1+ " </p>"
Fud  = (((Yn.value)*Kp*(h1+h2)/2)*H.value*L.value + (B.value*H.value*L.value*25 + h1*B.value*L.value*Yn.value)*Math.tan(fi1*Math.PI/180) + B.value*L.value*C1).toFixed(2)
Rez += "<p> Удерживающая сила - Fud = " + Fud + " кН </p>"
let h = Number(H.value)
let l = Number(L.value)
Mopr = ((h1*Y11*Ka*h*h*l/2) + (h*Y11*Ka*l/2)*h/3 + Qd.value*((h/2)-e)).toFixed(2)
Rez += "<p> Опрокидывающий момент - Mopr = " + Mopr + "кН*м </p>"
Mud = ((h1*Y11*Kp*h*h*l/2) + (h*Y11*Kp*l/2)*h/3 + (B.value*H.value*L.value*25 + h1*B.value*L.value*Yn.value)*B.value/2).toFixed(2)
Rez += "<p> Удерживающий момент - Mud = " + Mud + "кН*м </p>"

  resalt.innerHTML = Rez
//   console.log(fi1)
// console.log(fi11)
// console.log(C1)
// console.log(C11)
}
