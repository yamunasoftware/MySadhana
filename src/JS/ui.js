/* SERVICE WORKER REGISTRATION */

//Registers the Service Worker:
navigator.serviceWorker.register('/service-worker.js', {
  scope: 'https://mysadhana.netlify.app'
});

/* UI FUNCTIONS */

//Onload Function:
window.onload = function () {
  //Init Functions:
  showSplash();
  getData();
}

//Copy Code Function:
function copyCode() {
  //Checks the Case:
  if (getCacheData(codeID, false) != null) {
    //Copies Code:
    navigator.clipboard.writeText(getCacheData(codeID, false));
    document.getElementById('copy-message').innerHTML = "Copied";
  }
}

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

    //Sets the Value:
    document.getElementById('notes-header').innerHTML = 
      data[0][index] + "&emsp; <button onclick='saveNote(" + index + ");'> Save </button>";
    var dataValue = data[1][index];
    dataValue = dataValue.split("$n").join("\n");
    document.getElementById('text-area').value = dataValue;

    //Sets the Event Listener:
    window.addEventListener("keydown", function (e) {
      //Checks the Case:
      if (e.key == "Control") {
        //Checks the Case
        if (e.key == "e") {
          //Saves the Note:
          saveNote(index);
        }
      }
    })
  }
}

//Show Dark Function:
function showDark() {
  //Checks the Case:
  if (getCacheData(darkID, false) != null) {
    //Sets the Dark:
    dark = getCacheData(darkID, true);
    
    //Checks the Case:
    if (dark) {
      //Sets the Background:
      document.getElementById('container').style.backgroundColor = "#000000";
      document.getElementById('text-area').style.backgroundColor = "#000000";

      //Sets the Color:
      document.getElementById('container').style.color = "#ffffff";
      document.getElementById('text-area').style.color = "#ffffff";

      //Sets the Button:
      document.getElementById('dark-button').innerHTML = "On";
    }
  }
}

//Toggle Dark Function:
function toggleDark() {
  //Checks the Case:
  if (getCacheData(darkID, false) != null) {
    //Sets the Dark:
    dark = getCacheData(darkID, true);

    //Checks the Case:
    if (dark) {
      //Sets the Dark:
      dark = false;
    }

    else {
      //Sets the Dark:
      dark = true;
    }

    //Toggles Dark:
    setCacheData(darkID, dark, true);
    sendData();
    showDark();
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
      "Login Code: " + getCacheData(codeID, false) + 
      "&nbsp; <button onclick='copyCode();'> Copy </button>" + 
      "&nbsp; <div style='display: inline;' id='copy-message'></div>";
  }
}

//Show Error Function:
function showError(error) {
  //Sets the Error:
  document.getElementById('error').innerHTML = error;
}