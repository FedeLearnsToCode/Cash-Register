let price = 0;
let cid = [
  ["PENNY", 10], ["NICKEL", 50], ["DIME", 50], ["QUARTER", 50], ["ONE", 50], ["FIVE", 50], ["TEN", 100], ["TWENTY", 100], ["ONE HUNDRED", 100]
];
 
let unitValues = {
  'PENNY': 0.01,
  'NICKEL': 0.05,
  'DIME': 0.10,
  'QUARTER': 0.25,
  'ONE': 1.00,
  'FIVE': 5.00,
  'TEN': 10.00,
  'TWENTY': 20.00,
  'ONE HUNDRED': 100.00
}; 

const moneyReceived = document.getElementById('cash');
const purchaseBtn = document.getElementById('purchase-btn');
const changeDue = document.getElementById('change-due');

let cidCopy = JSON.parse(JSON.stringify(cid));


document.addEventListener('DOMContentLoaded', function () {
  const prices = document.querySelectorAll('.price');
  let total = 0;

  // Random products prices
  prices.forEach(span => {
    const numero = parseFloat((Math.random() * 19 + 1).toFixed(2));
    span.textContent = numero.toFixed(2);
    total += numero;
  });

  const priceString = total.toFixed(2); 
  document.getElementById('totalPrice').textContent = priceString;
  const price = parseFloat(priceString);

  function formatAmount(amount) {
    if (Number.isInteger(amount)) {
      return amount.toString();
    };
    if (amount % 1 !== 0 && amount *10 % 1 === 0) {
      return amount.toFixed(1); 
    };
    return amount.toFixed(2);
  };
  
  function roundAmount(amount) {
    return parseFloat(amount.toFixed(2));
  };

  purchaseBtn.addEventListener('click', () => {
    changeDue.innerText = '';
    let cash = parseFloat(moneyReceived.value);
    let change = Math.round((cash - price) * 100);  
    let reverseCid = cid.slice().reverse().map(([unit, amount]) => [unit, Math.round(amount * 100)]);
    let changeGiven = [];
    const initialTotalCid = reverseCid.reduce((sum, [, amount]) => sum + amount, 0);  
    let totalCid = reverseCid.reduce((sum, [, amount]) => sum + amount, 0);  


    if (cash < price) {
      alert("Customer does not have enough money to purchase the item");  
      return;
    };

    if (cash === price) {
      changeDue.innerText = "No change due - customer paid with exact cash.";
      return;
    };

  
    for (let [unit, totAvailable] of reverseCid) {
      let unitValue = Math.round(unitValues[unit] * 100);
      let moneyToReturn = 0;

      while (change >= unitValue && totAvailable >= unitValue) {
        moneyToReturn += unitValue;
        totAvailable -= unitValue;
        change -= unitValue;
      };

      if (moneyToReturn > 0) {
        changeGiven.push([unit, moneyToReturn / 100]);
        const idx = cid.findIndex(([name]) => name === unit);
        if (idx !== -1) { 
          cid[idx][1] = (totAvailable / 100);
        };
      };
    };
    
    if (change > 0) {
      changeDue.innerText = 'Status: INSUFFICIENT_FUNDS'; 
      changeDue.style.color = '#ff7782';
    } else {
      const changeTotal = Math.round(changeGiven.reduce((sum, [, amount]) => sum + amount, 0) * 100);

      if (Math.abs(changeTotal / 100 - initialTotalCid / 100) < 0.01) {

        changeDue.innerText = 'Status: CLOSED ' + changeGiven
          .sort((a,b) => unitValues[b[0]] - unitValues[a[0]])
          .map(([unit, amount]) => `${unit}: $${formatAmount(amount)}`)
          .join('\n'); 
        changeDue.style.color = '#ff7782';
      } else {
        let changeText = 'Status: OPEN \n';
        changeGiven.forEach(([unit, amount]) => {
          changeText += `${unit}: $${formatAmount(amount)}\n`;
        });
        changeDue.innerText = changeText;
        changeDue.style.color = '#41f1b6';
      };
    };
  });


  // NAVBAR MOBILE

  const hamburgerWrapper = document.querySelector('.hamburger-wrapper');
  const hamburgerIcon = hamburgerWrapper.querySelector('.hamburger-wrapper i');
  const navSection = document.querySelector('.nav-section');

  // Media query for screen under 768px
  const mediaQuery = window.matchMedia('(max-width: 768px)');

  function handleMediaChange(e) {
    if (e.matches) {
      hamburgerWrapper.classList.remove('none');
      navSection.classList.remove('hide');
    } else {
      hamburgerWrapper.classList.add('none');
      navSection.classList.add('hide');
    }
  }
  handleMediaChange(mediaQuery);
  mediaQuery.addEventListener('change', handleMediaChange);

  // Hamburger toggle
  hamburgerWrapper.addEventListener('click', () => {
    const isHidden = navSection.classList.toggle('hide');

      if (!isHidden) {
      hamburgerIcon.classList.remove('fa-xmark');
      hamburgerIcon.classList.add('fa-bars');
    } else {
      hamburgerIcon.classList.remove('fa-bars');
      hamburgerIcon.classList.add('fa-xmark');
    }
  });

});