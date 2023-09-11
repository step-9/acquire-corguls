const displayAccountStats = ({ balance, stocks }) => {
  const balanceContainer = document.querySelector("#balance-container");

  Object.entries(stocks).forEach(([corporation, quantity]) => {
    const stocks = document.querySelector(`.${corporation}`);
    const [quantityElement] = [...stocks.children];
    quantityElement.innerText = quantity;
  });

  

  balanceContainer.innerText = "$" + balance;
};

const loadAccount = () => {
  fetch("/account-stats")
    .then(res => res.json())
    .then(displayAccountStats);
};

window.onload = loadAccount;
