let players = [];
//TODO: to get data players from local storage
function getDataFromStorage() {
  localStorage.length > 0
    ? (players = JSON.parse(localStorage.getItem("players")))
    : [];
  setDataInTable();
}
getDataFromStorage();

//TODO: to set info players in tables (after get from local storage)
function setDataInTable() {
  let tbody = document.querySelector(".table-players table tbody");
  players.forEach((e) => {
    let tr = document.createElement("tr");
    console.log(e);
    for (let data in e) {
      let td = document.createElement("td");
      td.innerText = e[data];
      if (data == "time") {
        let time = new Date(e[data]);
        td.innerHTML = `${time.getFullYear()} - ${
          time.getMonth() + 1
        } - ${time.getDate()} / ${time.getHours()}:${time.getMinutes()} ${
          time.getHours() > 12 ? "PM" : "AM"
        }`;
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
}