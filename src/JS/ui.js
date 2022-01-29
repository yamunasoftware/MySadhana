/* SERVICE WORKER REGISTRATION */

//Registers the Service Worker:
navigator.serviceWorker.register('/service-worker.js', {
  scope: 'https://mysadhana.netlify.app'
});

/* WINDOW FUNCTIONS */

//Onload Function:
window.onload = function () {
  //Init Functions:
  showSplash();
  getData();
}

//Key Board Event Listener:
window.addEventListener("keydown", function (e) {
  //Checks the Case:
  if (e.key == "Escape" && saveIndex != null) {
    //Saves the Note:
    saveNote(saveIndex);
  }

  //Checks the Case:
  if (e.key == "Enter") {
    //Checks the Case:
    if (this.document.getElementById('log-in-input') == this.document.activeElement) {
      //Logs In:
      logIn();
    }
  }

  //Checks the Case:
  if (this.document.getElementById('search') == this.document.activeElement) {
    //Runs the Search:
    search();
  }
});

/* UI FUNCTIONS */

//Show Splash Function:
function showSplash() {
  //Checks the Case:
  if (getCacheData(codeID, false) == null) {
    //Shows the Splash:
    document.getElementById('splash-screen').style.display = "block";
    document.getElementById('dashboard').style.display = "none";
    document.getElementById('notes').style.display = "none";
  }
}

//Show Dashboard Function:
function showDashboard() {
  //Shows the Dashboard:
  document.getElementById('splash-screen').style.display = "none";
  document.getElementById('dashboard').style.display = "block";
  document.getElementById('notes').style.display = "none";
}

//Show Notes Function:
function showNotes(index) {
  //Checks the Case:
  if (getCacheData(dataID, false) != null) {
    //Gets the Data:
    data = getCacheData(dataID, true);

    //Shows the Dashboard:
    document.getElementById('splash-screen').style.display = "none";
    document.getElementById('dashboard').style.display = "none";
    document.getElementById('notes').style.display = "block";

    //Sets the UI:
    document.getElementById('notes-header').innerHTML = 
      "<button style='margin-left: 0px;' onclick='saveNote(" + index + ");'> Save </button>";
    var dataValue = data[index];

    //Sets the Values:
    dataValue = dataValue.split("$n").join("\n");
    document.getElementById('text-area').value = dataValue;
    saveIndex = index;
  }
}

//Show Login Function:
function showLogIn() {
  //Sets the Element:
  document.getElementById('log-in').style.display = "block";
}

//Show Login Code:
function showLoginCode() {
  //Checks the Case:
  if (getCacheData(codeID, false) != null) {
    //Sets the Code:
    document.getElementById('login-code').innerHTML = 
      "Login Code: " + getCacheData(codeID, false);
  }
}

//Show Error Function:
function showError(error) {
  //Sets the Error:
  document.getElementById('error').innerHTML = error;
}