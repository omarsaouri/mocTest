const cneInput = document.getElementById("cneInput");
const usernameInput = document.getElementById("usernameInput");
const subsSelect = document.getElementById("subsSelect");
const cancelBtn = document.getElementById("cancelBtn");
const addBtn = document.getElementById("addBtn");
const usersContainer = document.getElementById("usersContainer");
const checkSpan = document.getElementById("checkSpan");

const url = "http://localhost:3000/users";

addBtn.setAttribute("disabled", "");

addBtn.addEventListener("click", () => {
  let cneValue = cneInput.value;
  let usernameValue = usernameInput.value;
  let subsValue = subsSelect.value;

  let userToSend = {
    CNE: cneValue,
    username: usernameValue,
    subscription: subsValue,
  };
  userToSend = JSON.stringify(userToSend);

  const xhr = new XMLHttpRequest();
  xhr.open("post", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.addEventListener("load", () => {
    if (xhr.status == 201) {
      let data = JSON.parse(xhr.response);
      addUserToDiv(data);
      usernameInput.value = "";
      cneInput.value = "";
    } else alert(xhr.response);
  });
  xhr.addEventListener("error", () => {
    alert("error");
  });
  xhr.send(userToSend);
});

const addUserToDiv = (data) => {
  const userDiv = document.createElement("div");
  userDiv.classList.add("user");
  // <div class="user"></div>
  userDiv.classList.add(data.subscription);
  const userData = document.createElement("div");
  userData.classList.add("user-data");
  const userName = document.createElement("h3");
  userName.innerText = data.username;
  const userSubs = document.createElement("h4");
  userSubs.innerText = data.subscription;
  const userCne = document.createElement("p");
  userCne.innerText = data.CNE;
  const userControls = document.createElement("div");
  userControls.classList.add("user-controls");
  const deletebtn = document.createElement("button");
  deletebtn.classList.add("delete-btn");
  deletebtn.innerText = "Delete";
  const selectSubs = document.createElement("select");
  const options = ["free", "premium", "pro"];
  selectSubs.id = "selectSubs";

  for (let i = 0; i < options.length; i++) {
    let option = document.createElement("option");
    option.value = options[i];
    option.innerText = options[i];
    selectSubs.appendChild(option);
  }

  selectSubs.value = data.subscription;

  userData.appendChild(userName);
  userData.appendChild(userSubs);
  userData.appendChild(userCne);
  userControls.appendChild(deletebtn);
  userControls.appendChild(selectSubs);
  userDiv.appendChild(userData);
  userDiv.appendChild(userControls);
  usersContainer.appendChild(userDiv);

  deletebtn.addEventListener("click", () => {
    const xhr = new XMLHttpRequest();
    xhr.open("delete", url + "/" + data.CNE, true);
    xhr.addEventListener("load", () => {
      if (xhr.status == 200) userDiv.remove();
      else {
        return alert(xhr.response);
      }
    });
    xhr.addEventListener("error", () => {
      alert("error");
    });
    xhr.send();
  });
  selectSubs.addEventListener("change", () => {
    const xhr = new XMLHttpRequest();
    xhr.open("put", url + "/" + data.CNE, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", () => {
      if (xhr.status != 200) return alert(xhr.response);
      userDiv.classList = "";
      userDiv.classList.add("user");
      userDiv.classList.add(selectSubs.value);
      userSubs.innerText = selectSubs.value;
    });
    xhr.addEventListener("error", () => {
      alert("error");
    });
    let modifiedData = {
      CNE: data.CNE,
      username: data.username,
      subscription: selectSubs.value,
    };

    xhr.send(JSON.stringify(modifiedData));
  });
};

const loadUsers = () => {
  usersContainer.innerHTML = "";
  const xhr = new XMLHttpRequest();
  xhr.open("get", url, true);
  xhr.addEventListener("load", () => {
    if (xhr.status == 200) {
      let data = JSON.parse(xhr.response);
      data.forEach((user) => {
        addUserToDiv(user);
      });
    } else return alert(xhr.respons);
  });
  xhr.addEventListener("error", () => {
    alert("error");
  });
  xhr.send();
};

loadUsers();

cancelBtn.addEventListener("click", () => {
  cneInput.value = "";
  usernameInput.value = "";
});

cneInput.addEventListener("input", () => {
  let value = cneInput.value;
  if (!value) {
    checkSpan.innerText = "cne is required";
    return addBtn.setAttribute("disabled", "");
  }

  checkSpan.innerText = "";
  addBtn.removeAttribute("disabled");
});

usernameInput.addEventListener("input", () => {
  let value = usernameInput.value;
  if (!value) {
    checkSpan.innerText = "username is required";
    return addBtn.setAttribute("disabled", "");
  }

  checkSpan.innerText = "";
  addBtn.removeAttribute("disabled");
});
