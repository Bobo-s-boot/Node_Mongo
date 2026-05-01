function checkStorage(type, value) {
  if (!value) {
    hideMessages(type);
    return;
  }

  const key = `node_mongo_cache_${type}_${value}`;
  const cached = localStorage.getItem(key);

  hideMessages(type);

  if (cached) {
    document.getElementById(`${type}_msg_found`).style.display = "block";
    document.getElementById("output").textContent =
      "--- ДАНІ З LOCALSTORAGE ---\n" +
      JSON.stringify(JSON.parse(cached), null, 2);
  } else {
    document.getElementById(`${type}_msg_none`).style.display = "block";
    document.getElementById("output").textContent =
      "Дані в пам'яті браузера відсутні.";
  }
}

function hideMessages(type) {
  document.getElementById(`${type}_msg_found`).style.display = "none";
  document.getElementById(`${type}_msg_none`).style.display = "none";
}

function sendRequest(type, value) {
  if (!value) return alert("Оберіть значення!");

  fetch(`/api?type=${type}&value=${value}`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("output").textContent =
        "--- ДАНІ З СЕРВЕРА (Node.js + MongoDB) ---\n" +
        JSON.stringify(data, null, 2);

      const key = `node_mongo_cache_${type}_${value}`;
      localStorage.setItem(key, JSON.stringify(data));

      checkStorage(type, value);
    })
    .catch((err) => console.error("Помилка:", err));
}
