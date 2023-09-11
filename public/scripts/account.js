const displayAccountStats = ({ balance }) => {
  const balanceContainer = document.querySelector("#balance-container");
  balanceContainer.innerText = "$" + balance;
};

const loadAccount = () => {
  fetch("/account-stats")
    .then(res => res.json())
    .then(displayAccountStats);
};

window.onload = loadAccount;
