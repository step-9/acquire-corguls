const displayAccountBalance = balance => {
  const balanceContainer = document.querySelector("#balance-container");
  balanceContainer.innerText = "$" + balance;
};

const displayAccountStocks = stocks => {
  const accountStocks = {
    "phoenix": "phoenix-stock",
    "quantum": "quantum-stock",
    "hydra": "hydra-stock",
    "fusion": "fusion-stock",
    "america": "america-stock",
    "sackson": "sackson-stock",
    "zeta": "zeta-stock",
  };

  Object.entries(stocks).forEach(([corporation, quantity]) => {
    const stocks = document.getElementById(accountStocks[corporation]);
    const [quantityElement] = [...stocks.children];
    quantityElement.innerText = quantity;
  });
};

const displayAccountTiles = tilesPosition => {
  const tileContainer = document.querySelector("#tile-container");
  const tiles = Array.from(tileContainer.children);

  tilesPosition.forEach((tilePosition, tileID) => {
    const { x, y } = tilePosition;
    const columnSpecification = String.fromCharCode(x + 65);
    tiles[tileID].innerText = y + columnSpecification;
  });
};

const displayAccountStats = ({ balance, stocks, tiles }) => {
  displayAccountBalance(balance);
  displayAccountStocks(stocks);
  displayAccountTiles(tiles);
};

const loadAccount = () => {
  fetch("/game/player-profile")
    .then(res => res.json())
    .then(displayAccountStats);
};

window.onload = loadAccount;
