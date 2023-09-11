const getJoinForm = () => document.querySelector("#join-form");

const setupJoinForm = () => {
  const joinFrom = getJoinForm();
  joinFrom.onsubmit = event => {
    event.preventDefault();
    window.location.assign("/lobby");
  };
};

const main = () => {
  setupJoinForm();
};

window.onload = main;
