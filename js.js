const Yn = document.getElementById('Yn')
const fin = document.getElementById('fin')
const Cn_ = document.getElementById('Cn')
const resalt = document.getElementById('resalt')
const count = document.getElementById('count')
const sand = document.getElementById('sand')
const clay = document.getElementById('clay')
const panelPositionWeak = document.getElementById('weak')
const panelPositionStrong = document.getElementById('strong')
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
let Kp
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
let Fsd
let Fud
let Mud
let Mopr
let Rez

function func(e) {
    if (e.value.indexOf(".") != '-1') {
      e.value=e.value.substring(0, e.value.indexOf(".") + 3); // цифра 4, устанавливает количество цифр после запятой, 
                                                              //т.е. если 4, то максимум 3 цифры после запятой
    }
  }

function GroundPressCoeff(){
    Ka = (Number(interpol(1))).toFixed(2)
    Kp = (Number(interpol(2))).toFixed(2)
}

// 
function Y11Count(){
    Y1= (Number(Yn.value)*1.05).toFixed(2)
    Y11= (Number(Yn.value)*1.05*0.95).toFixed(2)
}
//  
function fi11Count(){
    if(sand.checked){
            let f = Number(fin.value)
            fi1 = f/1.1
           fi11 =  fi1*0.9
        } else {
      fi1 = (fin.value)/1.15
      fi11 = fi1*0.9
    }
    fi1 = fi1.toFixed(2)
    fi11 = fi11.toFixed(2)
}
//
function C11Count(){
    let a = Number(Cn_.value)
    C1 = (a/1.5).toFixed(2)
    let C = (a/1.5)*0.5
    let h = Number(H.value)
    gr = Number(GroundLevel.value).toFixed(2)
    pi= Number(PipeLevel.value).toFixed(2)
    if(h<=1.5||a==0){
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

function CountLivel(){
    let h = Number(H.value)
    e = Number(eccentricity.value)
    h1 = Number(((gr-pi)-(h/2+e)).toFixed(2))
    h2 = (h1+h).toFixed(2)
}
function testM(a,b){
    if (condition) {
        
    }
}

function testQ(a,b){
    var rezTest
        if (a<b) {
            rezTest = "Условие выполняется"        
        }else rezTest = "Условие не выполняется"
    return rezTest
}

count.onclick = function(){
    let gr
    let pi
    Y11Count()
    fi11Count()
    C11Count()
    CountLivel()
    GroundPressCoeff()
    let l = Number(L.value).toFixed(2) /*light panel*/
    let h = Number(H.value).toFixed(2) /*height panel*/
    let b  = Number(B.value).toFixed(2) /*thickness panel*/
    let Eha = Number(((0.5*Y11*h*Ka*h+Y11*h1*Ka*h)*l).toFixed(2))
    let Ehp = Number(((0.5*Y11*h*Kp*h+Y11*h1*Kp*h)*l).toFixed(2))
    let qd = Number(Qd.value)
    let Fsd = (Eha + qd).toFixed(2)
    let N = (b*l*h*25 +b*l*h1*Y11).toFixed(2)
    let Fud = (N*Math.tan(fi1*Math.PI/180)+b*C1*l+Ehp).toFixed(2)
    let Mud = ((0.5*Y11*h*Kp*h*(1/3)*h+Y11*h1*Kp*h*(1/2)*h)*l+N*b/2).toFixed(2)
    let Mopr = ((0.5*Y11*h*Ka*h*(1/3)*h+Y11*h1*Ka*h*(1/2)*h)*l+qd*((1/2)*h-e)).toFixed(2)


    Rez = `
    <p>Расчетные характеристики грунтов (приняты с учетом 6.3.3 ТКП 45-5.01-237-2011):</p>
    <p> γ1 = ${Y1} кН/м3 </p>
    <p> γ1' = ${Y11} кН/м3 </p>
    <p> φ1 = ${fi1} град </p>
    <p> φ1' =${fi11} град </p>
    <p> С1 = ${C1} кПа </p>
    <p> С1' = ${C11} кПа </p>
    <p> h1 = ${h1} м</p>
    <p> h2 = ${h2} м </p>
    <p>Коэффициенты Кр и Ка принимаем по таблице 6.4 ТКП 45-5.01-237-2011 для условий α=δ=β=0 интерполяцией для φ = ${fi11}град</p>
    <p> K<small>p</small> = ${Kp}</p>
    <p> K<small>a</small> = ${Ka}</p>
    <h2>Расчет устойчивости против сдвига</h2>
    <h3>Fsd  <= γc * Fud / γ n,     (7.3) ТКП 45-5.01-237-2011</h3>
    <p>Fsd — сдвигающая сила, равная сумме проекций на горизонтальную плоскость всех действующих на стену сдвигающих сил, кН;</p>
    <p>Fud — удерживающая сила, равная сумме проекций всех удерживающих сил на ту же плоскость, кН;</p>
    <p>γc — коэффициент условий работы грунта основания: для песков, кроме пылеватых, γc = 1; для пылеватых песков и пылевато-глинистых грунтов в стабилизированном состоянии γc = 0,9, в нестабилизированном состоянии — γc = 0,85;</p>
    <p>γn — коэффициент надежности по назначению сооружения, принимаемый равным 1,2; 1,15 и 1,1 соответственно для зданий и сооружений I, II и III уровней ответственности. ГОСТ 27751-88 - отменен, γn = 1.0</p>
    <h3>Fsd = Eha + Qd = ${Eha} + ${qd} = ${Fsd} кН</h3>
    <p>где Eha - горизонтальная составляющая распора грунта (активного давления)</p>
    <h3>Eha = (0.5*Gyha*h + Gyh1a*h1)*l = (0.5*${Y11}*${h}*${Ka}*${h}+${Y11}*${h1}*${Ka}*${h})*${l} = ${Eha} кН </h3>
    <p>Qd - расчетное значение переменного воздействия от труб ТС, кН</p>
    <h3>Fud = N*tg(φ1-β)+b*C1*l+Ehp = ${N}*tg(${fi1})+${b}*${C1}*${l}+${Ehp} = ${Fud}кН</h3>
    <p>где N - собственный вес щита опоры и грунта над щитом</p>
    <h3>N = b*l*h*25кНм³+b*l*h1*Y1' = ${b}*${l}*${h}*25 +${b}*${l}*${h1}*${Y11} = ${N} кН </h3>
    <p>φ1 - угол внутреннего трения грунта ненарушенного сложения для предельных состоянийпервой группы;</p>
    <p>β — угол наклона поверхности грунта засыпки за щитом опоры к горизонтали = 0;</p>
    <p>b - толщина щита опоры, м</p><p>h - высота щита опоры, м</p><p>l - длина щита опоры, м</p>
    <p>h1 - расстояние от уровня планировки земли до верха щита опоры, м</p><p>С1 - удельное сцепление грунта ненарушенного сложения для предельногосостояния первой группы, кПа</p>
    <p>Ep - горизонтальная составляющая распора грунта (пассивного давления)</p>
    <h3>Ehp = (0.5*Gyhр*h + Gyh1р*h1)*l = (0.5*${Y11}*${h}*${Kp}*${h}+${Y11}*${h1}*${Kp}*${h})*${l} = ${Ehp} кН</h3>
    <h3>Fsd = ${Fsd} кН &lt; Fud = ${Fud} кН  ${testQ(Fsd,Fud)} </h3>
    <p></p>
    <h2>Расчет устойчивости щита против опрокидывания</h2><h3>Mud/Mopr &gt;= 1.0</h3>
    <p>Mud — сумма моментов всех удерживающих сил относительно кромки, проходящей черезточку О, кН·м</p><h3>Mud = (0.5*Gyhр*h*1/3h + Gyh1р*h1*1/2h)*l + N*b/2 = (0.5*${Y11}*${h}*${Kp}*${h}*1/3*${h}+${Y11}*${h1}*${Kp}*${h}*1/2*${h})*${l} + ${N} * ${b}/2  = ${Mud} кн*м</h3>
    <p>Mopr — сумма моментов всех опрокидывающих сил относительно кромки, проходящих черезточку О, кН·м</p>
    <h3>Mopr = (0.5*Gyha*h*1/3h + Gyh1a*h1*1/2h)*l + Qd * (1/2h-e)= (0.5*${Y11}*${h}*${Ka}*${h}*1/3*${h}+${Y11}*${h1}*${Ka}*${h}*1/2*${h})*${l} + ${qd}*(1/2*${h}-${e}) = ${Mopr} кН*м</h3>
    <h3>Mud/Mopr = ${Mud} / ${Mopr} = ${(Mud/Mopr).toFixed(2)}&gt;= 1</h3>`
    
resalt.innerHTML = Rez
}
