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
      data[index] + "&emsp; <button onclick='saveNote(" + index + ");'> Save </button>";
    var dataValue = data[index];
    dataValue = dataValue.split("$n").join("\n");
    document.getElementById('text-area').value = dataValue;

    //Sets the Event Listener:
    window.addEventListener("keydown", function (e) {
      //Checks the Case:
      if (e.key == "Alt") {
        //Saves the Note:
        saveNote(index);
      }
    })
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