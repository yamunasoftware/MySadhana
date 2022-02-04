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
    //Exits the Note:
    exitNote();
  }

  //Checks the Case:
  if (e.key == "Enter") {
    //Checks the Case:
    if (this.document.activeElement == this.document.getElementById('log-in-input')) {
      //Logs In:
      logIn();
    }
  }
});

//Input Event Listener:
window.addEventListener("input", function (e) {
  //Checks the Case:
  if (this.document.getElementById('search') == this.document.activeElement) {
    //Searches:
    search(e);
  }

  //Checks the Case:
  if (this.document.getElementById('text-area') = this.document.activeElement
    && saveIndex != null) {
    //Saves the Note:
    console.log("here")
    saveNote(); 
    showNotes(saveIndex);
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
  document.getElementById('search').value = "";
}

//Show Notes Function:
function showNotes(index) {
  //Checks the Case:
  if (getCacheData(dataID, false) != null && saveIndex == null) {
    //Gets the Data:
    data = getCacheData(dataID, true);
    saveIndex = index;

    //Shows the Dashboard:
    document.getElementById('splash-screen').style.display = "none";
    document.getElementById('dashboard').style.display = "none";
    document.getElementById('notes').style.display = "block";

    //Sets the Notes Bar:
    var notesBar = 
      "<button onclick='exitNote();'> Back </button>" +
      "<button onclick='deleteNote();'> Delete </button>"; 

    //Checks the Case:
    if (index != 0) {
      //Sets Notes Bar:
      notesBar += "<button onclick='pinNote();'> Pin </button>";
    }

    //Adds the Alerts System:
    notesBar += "<div class='margin note-alert'>" + checkDates(dates(data[index])) + "</div>";

    //Sets the UI Data:
    document.getElementById('notes-bar').innerHTML = notesBar;
    var dataValue = data[index];

    //Sets the Values:
    dataValue = dataValue.split("$n").join("\n");
    document.getElementById('text-area').textContent = dataValue;
  }
}

//Show Login Function:
function showLogIn() {
  //Sets the Element:
  document.getElementById('log-in').style.display = "block";
}

//Show Error Function:
function showError(error) {
  //Sets the Error:
  document.getElementById('error').innerHTML = error;
}