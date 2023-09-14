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

const fillSpace = position => {
  const tileId = position.x * 12 + position.y;
  const tiles = document.querySelectorAll(".space");
  tiles[tileId].classList.add("placed-tile");
};

const setUpTiles = position => {
  fetch("/game/tile", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(position),
  }).then(res => {
    if (res.status === 200) {
      fillSpace(position);
    }
  });
};

const removeTileFromCollection = tile => {
  tile.innerText = "";
};

const displayTile = (tile, tilePosition) => {
  const { x, y } = tilePosition;
  const columnSpecification = y + 1;
  const rowSpecification = String.fromCharCode(x + 65);
  tile.innerText = columnSpecification + rowSpecification;
};

const attatchListener = (tile, tilePosition) => {
  tile.onclick = () => {
    setUpTiles(tilePosition);
    removeTileFromCollection(tile);
  };
};

const displayAndSetupAccountTiles = tilesPosition => {
  const tileContainer = document.querySelector("#tile-container");
  const tiles = Array.from(tileContainer.children);

  tilesPosition.forEach((tilePosition, tileID) => {
    const tile = tiles[tileID];

    displayTile(tile, tilePosition);
    attatchListener(tile, tilePosition);
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

const displayPlayerProfile = ({ username, balance, stocks, tiles }) => {
  displayPlayerName(username);
  displayAccountBalance(balance);
  displayAccountStocks(stocks);
  displayAndSetupAccountTiles(tiles);
};

const displayIncorporatedTiles = ({ incorporatedTiles }) => {
  incorporatedTiles.forEach(fillSpace);
};

const renderPlayers = (players) => {
  const playersDiv = getPlayersDiv();
  const playerElements = players.map(({ isTakingTurn, username }) => {
    return generateComponent([
      "div", [
        ["div", "", { class: "profile-pic" }],
        ["div", username, { class: "name" }]
      ],
      { class: `player flex${isTakingTurn ? " active" : ""}` }
    ]);
  });

  [...playersDiv.children].forEach(child => child.remove());
  playersDiv.append(...playerElements);
};

const loadAccount = () => {
  fetch("/game/status")
    .then(res => res.json())
    .then(({ players, portfolio, tiles }) => {
      renderPlayers(players);
      displayPlayerProfile(portfolio);
      displayIncorporatedTiles(tiles);
    });

  setupInfoCard();
};

const keepPlayerProfileUpdated = () => {
  const interval = 1000;
  loadAccount();
  setInterval(loadAccount, interval);
};

window.onload = keepPlayerProfileUpdated;
