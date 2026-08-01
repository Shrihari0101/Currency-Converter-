const CURRENCIES = [
  ["USD","US Dollar"], ["EUR","Euro"], ["GBP","British Pound"], ["JPY","Japanese Yen"],
  ["INR","Indian Rupee"], ["AUD","Australian Dollar"], ["CAD","Canadian Dollar"],
  ["CHF","Swiss Franc"], ["CNY","Chinese Yuan"], ["SGD","Singapore Dollar"],
  ["AED","UAE Dirham"], ["NZD","New Zealand Dollar"], ["ZAR","South African Rand"],
  ["BRL","Brazilian Real"], ["MXN","Mexican Peso"], ["HKD","Hong Kong Dollar"]
];
const FALLBACK = {USD:1,EUR:0.92,GBP:0.79,JPY:155.4,INR:83.5,AUD:1.52,CAD:1.36,CHF:0.90,CNY:7.24,SGD:1.34,AED:3.67,NZD:1.64,ZAR:18.4,BRL:5.4,MXN:18.1,HKD:7.81};

let rates = null;

const fromSel = document.getElementById('fromCurrency');
const toSel = document.getElementById('toCurrency');
const fromAmt = document.getElementById('fromAmount');
const toAmt = document.getElementById('toAmount');
const dot = document.getElementById('dot');
const rateLine = document.getElementById('rateLine');

function populate(){
  CURRENCIES.forEach(([code])=>{
    const o1 = document.createElement('option'); o1.value = code; o1.textContent = code;
    const o2 = o1.cloneNode(true);
    fromSel.appendChild(o1); toSel.appendChild(o2);
  });
  fromSel.value = "USD";
  toSel.value = "INR";
}

async function loadRates(){
  try{
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    if(data.result !== 'success') throw new Error();
    rates = data.rates;
    dot.classList.remove('stale');
  }catch(e){
    rates = FALLBACK;
    dot.classList.add('stale');
  }
  convert();
}

function convert(){
  if(!rates) return;
  const from = fromSel.value, to = toSel.value;
  const amt = parseFloat(fromAmt.value) || 0;
  const rFrom = rates[from], rTo = rates[to];
  if(rFrom == null || rTo == null) return;
  const result = (amt / rFrom) * rTo;
  toAmt.value = result.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
  const unit = rTo / rFrom;
  rateLine.innerHTML = `<b>1 ${from}</b> = <b>${unit.toFixed(4)} ${to}</b>`;
}

document.getElementById('swapBtn').addEventListener('click', (e)=>{
  e.currentTarget.classList.add('spin');
  setTimeout(()=> e.currentTarget.classList.remove('spin'), 300);
  const f = fromSel.value, t = toSel.value;
  fromSel.value = t; toSel.value = f;
  convert();
});

fromAmt.addEventListener('input', convert);
fromSel.addEventListener('change', convert);
toSel.addEventListener('change', convert);

populate();
loadRates();