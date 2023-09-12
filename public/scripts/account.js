const displayAccountStats = ({ balance, stocks }) => {
  const balanceContainer = document.querySelector("#balance-container");

  Object.entries(stocks).forEach(([corporation, quantity]) => {
    const accountStocks = {
      "phoenix": "phoenix-stock",
      "quantum": "quantum-stock",
      "hydra": "hydra-stock",
      "fusion": "fusion-stock",
      "america": "america-stock",
      "sackson": "sackson-stock",
      "zeta": "zeta-stock",
    };

    const stocks = document.getElementById(accountStocks[corporation]);
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
