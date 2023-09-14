const getInfoIcon = () => document.querySelector("#info-icon");
const getInfoCard = () => document.querySelector("#info-card");
const getInfoCloseBtn = () => document.querySelector("#info-close-btn");
const getPlayersDiv = () => document.querySelector("#players");

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

const setUpTiles = position => {
  fetch("/game/tile", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(position),
  });
};

const displayAccountTiles = tilesPosition => {
  const tileContainer = document.querySelector("#tile-container");
  const tiles = Array.from(tileContainer.children);

  tilesPosition.forEach((tilePosition, tileID) => {
    const { x, y } = tilePosition;
    const columnSpecification = y + 1;
    const rowSpecification = String.fromCharCode(x + 65);
    tiles[tileID].innerText = columnSpecification + rowSpecification;
    tiles[tileID].onclick = () => {
      setUpTiles(tilePosition);
    };
  });
};

const setupInfoCard = () => {
  const infoIcon = getInfoIcon();
  const infoCard = getInfoCard();
  const infoCloseBtn = getInfoCloseBtn();

  infoIcon.onclick = () => {
    infoCard.classList.remove("hide");
  };

  infoCloseBtn.onclick = () => {
    infoCard.classList.add("hide");
  };
};

const displayPlayerName = username => {
  const usernameContainer = document.querySelector("#username");
  usernameContainer.innerText = username.toUpperCase();
};

const renderPlayers = (players) => {
  const playerElements = players.map(({ isTakingTurn, username }) => {
    return generateComponent([
      "div", [
        ["div", "", { class: "profile-pic" }],
        ["div", username, { class: "name" }]
      ],
      { class: `player flex${isTakingTurn ? " active" : ""}` }
    ]);
  });

  getPlayersDiv().append(...playerElements);
};

const displayPlayerProfile = ({ username, balance, stocks, tiles }) => {
  displayPlayerName(username);
  displayAccountBalance(balance);
  displayAccountStocks(stocks);
  displayAccountTiles(tiles);
};

const loadAccount = () => {
  fetch("/game/status")
    .then(res => res.json())
    .then(({ players, portfolio }) => {
      renderPlayers(players);
      displayPlayerProfile(portfolio);
    });

  setupInfoCard();
};

window.onload = loadAccount;
