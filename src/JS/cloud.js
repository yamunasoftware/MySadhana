/* CLOUD VARIABLES */

//Configuration:
const firebaseConfig = {
  apiKey: "AIzaSyDTw4G4mOxZbIYYEPkBUDo2sycRM2XuN94",
  authDomain: "mysadhana-75be1.firebaseapp.com",
  projectId: "mysadhana-75be1",
  storageBucket: "mysadhana-75be1.appspot.com",
  messagingSenderId: "30818005011",
  appId: "1:30818005011:web:4eef8ffc3bbfc3dd468fe6"
};

//Database Variables:
firebase.initializeApp(firebaseConfig);
var database = firebase.firestore();
var collectionName = "users";

//ID Variables:
var codeID = "code";
var dataID = "data";

//Data Variables:
var code = "";
var data = [];

//Timeout Variables:
var notificationTimeout = 10000000;
var timeout = 100000;
var datesTimeout = 1000;
var notesTimeout = 100;
var saveTimeout = 1000;

//Response Variables:
var wait = false;
var saveIndex = null;
var mainInterval = null;

/* CLOUD AUTH FUNCTIONS */

//Sign Up Function:
function signUp() {
  //Gets the Code, Sets the Cloud Data:
  var code = generateCode();
  database.collection(collectionName).doc(code).set({
    data: JSON.stringify(data)
  })
    .then(() => {
      //Sets the Cache Data:
      setCacheData(codeID, code, false);
      setCacheData(dataID, data, true);

      //Shows the Startup:
      showStartup();
    })
    .catch(() => {
      //Displays Error:
      showError("An Error Ocurred");
      showSplash();
    });
}

//Log In Function:
function logIn() {
  //Gets the Code:
  var code = document.getElementById('log-in-input').value;

  //Checks the Case:
  if (code != "") {
    //Gets the Cloud Data:
    database.collection(collectionName).doc(code).get().then((doc) => {
      //Checks the Case:
      if (doc.exists) {
        //Sets the Data:
        data = JSON.parse(formatData(JSON.stringify(doc.data().data)));

        //Sets the Cache Data:
        setCacheData(codeID, code, false);
        setCacheData(dataID, data, true);

        //Shows the Startup:
        showStartup();
      }

      else {
        //Displays Error:
        showError("Invalid ID");
        showSplash();
      }
    })
      .catch(() => {
        //Displays Error:
        showError("An Error Ocurred");
        showSplash();
      });
  }

  else {
    //Displays Error:
    showError("Invalid ID");
    showSplash();
  }
}

//Log Out Function:
function logOut() {
  //Logs Out:
  clearCacheData();
  window.location.reload();
}

//Remove User Function:
function removeUser() {
  //Checks the Case:
  if (getCacheData(codeID, false) != null) {
    //Gets the Code:
    code = getCacheData(codeID, false);

    //Removes the User:
    database.collection(collectionName).doc(code).delete().then(() => {
      //Logs Out:
      logOut();
    })
      .catch(() => {
        //Displays Error:
        showError("An Error Ocurred");
        showSplash();
      });
  }
}

//Generate Code Function:
function generateCode() {
  //Loop Variables:
  var turns = 0;
  var code = "";

  //Loops through Array:
  mainLoop: while (turns < 20) {
    //Gets the Digit:
    var digit = Math.floor((Math.random() * 9) + 1);
    code += digit;

    turns++;
  }

  //Returns the Code:
  return code;
}

/* CLOUD REQUEST FUNCTIONS */

//Send Data Function:
function sendData() {
  //Checks the Case:
  if (getCacheData(codeID, false) != null) {
    //Gets the Code:
    code = getCacheData(codeID, false);
    data = getCacheData(dataID, true);

    //Sets the Cloud Data:
    database.collection(collectionName).doc(code).update({
      data: JSON.stringify(data)
    })
      .catch(() => {
        //Displays Error:
        showDashError("An Error Ocurred");
        showDashboard();
      });
  }
}

//Get Data Function:
function getData() {
  //Checks the Case:
  if (getCacheData(codeID, false) != null) {
    //Gets the Code:
    code = getCacheData(codeID, false);

    //Gets the Cloud Data:
    database.collection(collectionName).doc(code).get().then((doc) => {
      //Checks the Case:
      if (doc.exists) {
        //Sets the Data:
        data = JSON.parse(formatData(JSON.stringify(doc.data().data)));
        setCacheData(dataID, data, true);
        wait = true;
      }

      else {
        //Logs Out:
        logOut();
      }
    })
      .catch(() => {
        //Displays Error:
        showDashError("An Error Ocurred");
        showDashboard();
      });
  }
}

/* DATA FUNCTIONS */

//Copy Code Function:
function copyCode() {
  //Sends the Code to Clipboard:
  code = getCacheData(codeID, false);
  navigator.clipboard.writeText(code);
  showCopyMessage();
}

//Pin Note Function:
function pinNote(index) {
  //Checks the Case:
  if (getCacheData(dataID, false) != null
    && index != 0) {
    //Array Variables:
    data = getCacheData(dataID, true);
    var localData = [];

    //Loop Variables:
    var turns = 0;

    //Loops through Array:
    mainLoop: while (turns < data.length) {
      //Checks the Case:
      if (turns == 0) {
        //Pushes to the Data:
        localData.push(data[index]);
        localData.push(data[turns]);
      }

      else if (turns != index) {
        //Pushes to the Data:
        localData.push(data[turns]);
      }

      turns++;
    }

    //Sets the Data:
    data = localData;
    setCacheData(dataID, data, true);
    exitSafely();
  }
}

//Save Note Function:
function saveNote() {
  //Checks the Case:
  if (getCacheData(dataID, false) != null && saveIndex != null) {
    //Sets the Data:
    data = getCacheData(dataID, true);
    var rawText = document.getElementById('content-area').innerHTML.replace(/["]+/g, '');
    rawText = rawText.replace("</span>", "");

    //Replaces Date Spans:
    rawText = rawText.replace("<span class=\"date-past\">", "");
    rawText = rawText.replace("<span class=\"date-today\">", "");
    rawText = rawText.replace("<span class=\"date-future\">", "");
    data[saveIndex] = rawText;

    //Saves the Data:
    setCacheData(dataID, data, true);
    sendData();
  }
}

//Add Note Function:
function addNote() {
  //Checks the Case:
  if (getCacheData(dataID, false) != null) {
    //Gets the Data:
    data = getCacheData(dataID, true);
    data.push("");

    //Sends the Data
    setCacheData(dataID, data, true);
    sendData();
    displayNotes();
  }
}

//Delete Note Function:
function deleteNote(index) {
  //Checks the Case:
  if (getCacheData(dataID, false) != null) {
    //Deletes the Note:
    data = getCacheData(dataID, true);
    data = deleteElement(data, index);

    //Saves Data:
    setCacheData(dataID, data, true);
    exitSafely();
  }
}

//Exit Notes Function:
function exitNote() {
  //Resets Data:
  saveNote();
  saveIndex = null;

  //Save Delay:
  showLoading();
  setTimeout(function () {
    //Shows the Startup:
    closeConfirm();
    showStartup();
  }, saveTimeout);

  //Checks the Case:
  if (mainInterval != null) {
    //Cancels the Interval:
    clearInterval(mainInterval);
  }
}

//Exit Safely Function:
function exitSafely() {
  //Exits Safely:
  sendData();
  saveIndex = null;

  //Save Delay:
  showLoading();
  setTimeout(function () {
    //Shows Dashboard:
    closeConfirm();
    showDashboard();
    displayNotes();
  }, saveTimeout);

  //Checks the Case:
  if (mainInterval != null) {
    //Cancels the Interval:
    clearInterval(mainInterval);
  }
}

//Display Notes Function:
function displayNotes() {
  //Checks the Case:
  if (getCacheData(dataID, false) != null) {
    //Loop Variables:
    data = getCacheData(dataID, true);
    var notesList = "";
    var turns = 0;

    //Loops through Array:
    mainLoop: while (turns < data.length) {
      //Sets the Notes List:
      notesList +=
        "<div class='margin padding card center'>"
        + "<div class='padding'>" + title(data[turns]) + "</div>";

      //Sets the Notes List:
      var alerts = checkDates(dates(data[turns]));
      notesList +=
        "<div id='past" + turns + "' class='margin dash-alert disappear'>" + alerts[0] + "</div>"
        + "<div id='now" + turns + "' style='background-color: #147efb;' class='margin dash-alert disappear'>" + alerts[1] + "</div>"
        + "<div id='future" + turns + "' style='background-color: #23C552;' class='margin dash-alert disappear'>" + alerts[2] + "</div>"
        + "<button class='dash-button' onclick='showNotes(" + turns + ");'> Open </button>";

      //Checks the Case:
      if (turns != 0) {
        //Adds the Button:
        notesList += "<button class='dash-button' onclick='pinNote(" + turns + ");'> Pin </button>";
      }

      //Adds the Close Button:
      notesList +=
        "<button class='dash-button' onclick='showConfirm(" + turns + ");'> Delete </button> </div>";

      turns++;
    }

    //Sets the HTML:
    document.getElementById('notes-list').innerHTML = notesList;
  }
}

//Search Function:
function search() {
  //Checks the Case:
  if (getCacheData(codeID, false) != null &&
    saveIndex == null) {
    //Loop Variables:
    data = getCacheData(dataID, true);
    var turns = 0;
    var notesList = "";

    //Loops through Array:
    mainLoop: while (turns < data.length) {
      //Checks the Case:
      if (data[turns].toLowerCase().includes(document.getElementById('search').value.toLowerCase())) {
        //Sets the Notes List:
        notesList +=
          "<div class='margin padding card center'>"
          + "<div class='padding'>" + title(data[turns]) + "</div>";

        //Sets the Notes List:
        var alerts = checkDates(dates(data[turns]));
        notesList +=
          "<div id='past" + turns + "' class='margin dash-alert disappear'>" + alerts[0] + "</div>"
          + "<div id='now" + turns + "' style='background-color: #147efb;' class='margin dash-alert disappear'>" + alerts[1] + "</div>"
          + "<div id='future" + turns + "' style='background-color: #23C552;' class='margin dash-alert disappear'>" + alerts[2] + "</div>"
          + "<button class='dash-button' onclick='showNotes(" + turns + ");'> Open </button>";

        //Checks the Case:
        if (turns != 0) {
          //Adds the Button:
          notesList += "<button class='dash-button' onclick='pinNote(" + turns + ");'> Pin </button>";
        }

        //Adds the Close Button:
        notesList +=
          "<button class='dash-button' onclick='showConfirm(" + turns + ");'> Delete </button> </div>";
      }

      turns++;
    }

    //Sets the HTML:
    document.getElementById('notes-list').innerHTML = notesList;
  }
}

//Display Dash Dates Function:
function displayDashDates() {
  //Shows the Tab Notification:
  showNotification();
  
  //Checks the Case:
  if (getCacheData(codeID, false) != null &&
    saveIndex == null) {
    //Loop Variables:
    data = getCacheData(dataID, true);
    var turns = 0;

    //Loops through Array:
    mainLoop: while (turns < data.length) {
      //Gets the Alerts:
      var alerts = checkDates(dates(data[turns]));

      //Checks the Case:
      if (document.getElementById('past' + turns) != null) {
        //Sets the Alert:
        document.getElementById('past' + turns).innerHTML = alerts[0];
      }

      //Checks the Case:
      if (document.getElementById('now' + turns) != null) {
        //Sets the Alert:
        document.getElementById('now' + turns).innerHTML = alerts[1];
      }

      //Checks the Case:
      if (document.getElementById('future' + turns) != null) {
        //Sets the Alert:
        document.getElementById('future' + turns).innerHTML = alerts[2];
      }

      turns++;
    }
  }
}

//Title Function:
function title(string) {
  //Loops Variables:
  var noteTitle = "";
  var turns = 0;
  var localString =
    string.replace(new RegExp("\n", "g"), "$n");

  //Loops through Array:
  mainLoop: while (turns < localString.length) {
    //Checks the Case:
    if (localString[turns] == "$") {
      //Breaks Loop:
      break mainLoop;
    }

    else {
      //Adds to the Title:
      noteTitle += localString[turns];
    }

    turns++;
  }

  //Returns the Title:
  return noteTitle;
}

/* DATES FUNCTIONS */

//Check All Dates:
function checkAllDates() {
  //Gets the Data:
  data = getCacheData(dataID, true);

  //Loop Variables:
  var past = 0;
  var now = 0;
  var future = 0;
  var turns = 0;

  //Loops through Array:
  mainLoop: while (turns < data.length) {
    //Gets the Alerts:
    var alerts = checkDates(dates(data[turns]));

    //Checks the Case:
    if (alerts[0] != "") {
      //Sets the Past:
      past += alerts[0];
    }

    //Checks the Case:
    if (alerts[1] != "") {
      //Sets the Now:
      now += alerts[1];
    }

    //Checks the Case:
    if (alerts[2] != "") {
      //Sets the Future:
      future += alerts[2];
    }

    turns++;
  }

  //Returns the Values:
  return [past, now, future];
}

//Check Dates Function:
function checkDates(dates) {
  //Loop Variable:
  var turns = 0;

  //Count Variables:
  var past = 0;
  var now = 0;
  var future = 0;

  //Loops through Array:
  mainLoop: while (turns < dates.length) {
    //Extracts the Dates:
    var localDates = extractDate(dates[turns]);
    var check = checkDate(localDates);
    
    //Checks the Case:
    if (check == -1) {
      //Increases the Past:
      past++;
    }

    else if (check == 0) {
      //Increases the Now:
      now++;
    }

    else if (check == 1) {
      //Increases the Future:
      future++;
    }

    turns++;
  }

  //Sets the Value:
  if (past == 0) {
    //Sets the Value:
    past = "";
  }

  //Sets the Value:
  if (now == 0) {
    //Sets the Value:
    now = "";
  }

  //Sets the Value:
  if (future == 0) {
    //Sets the Value:
    future = "";
  }

  //Returns the Counts:
  return [past, now, future];
}

//Extract Date Function:
function extractDate(string) {
  //Loop Variables:
  var turns = 0;
  var passed = false;

  //String Variables:
  var month = "";
  var day = "";

  //Loops through Array:
  mainLoop: while (turns < string.length) {
    //Checks the Case:
    if (string[turns] != "-" && !passed) {
      //Adds to the Month:
      month += string[turns];
    }

    else if (string[turns] != "-" && passed) {
      //Adds to the Day:
      day += string[turns];
    }

    //Checks the Case:
    if (string[turns] == "-") {
      //Sets the Passed:
      passed = true;
    }

    turns++;
  }

  //Parses Values:
  var parsedMonth = parseInt(month);
  var parsedDay = parseInt(day);

  //Returns the Array:
  return [parsedMonth, parsedDay];
}

function checkDate(date) {
  //Date Variables:
  var date = new Date();
  var currentMonth = date.getMonth() + 1;
  var currentDay = date.getDate();
  
  //Checks the Case:
  if (date[0] < currentMonth ||
    (date[0] == currentMonth && date[1] < currentDay)) {
    return -1;
  }

  else if (date[0] == currentMonth && date[1] == currentDay) {
    return 0;
  }

  else if (date[0] > currentMonth ||
    (date[0] == currentMonth && date[1] > currentDay)) {
    return 1;
  }
}

//Dates Function:
function dates(string) {
  //Loop Variables:
  var dates = [];
  var turns = 0;

  //Loops through Array:
  mainLoop: while (turns < string.length) {
    //Checks the Case:
    if (string[turns] == "/" && turns != 0
      && turns < string.length - 1) {
      //Checks the Case:
      if (!isNaN(string[turns - 1]) && !isNaN(string[turns + 1])) {
        //Sets the Dates:
        var date = string[turns - 1] + "-" + string[turns + 1];

        //Checks the Case:
        if (turns - 2 >= 0) {
          //Checks the Case:
          if (!isNaN(string[turns - 2])) {
            //Sets the Date:
            date = string[turns - 2] + "" + string[turns - 1] + "-" + string[turns + 1];
          }
        }

        //Checks the Case:
        if (turns + 2 < string.length) {
          //Checks the Case:
          if (!isNaN(string[turns + 2])) {
            //Adds to the Date:
            date += string[turns + 2];
          }
        }

        //Pushes to Dates Array:
        dates.push(date);
      }
    }

    turns++;
  }

  //Returns the Dates:
  return dates;
}

/* CACHE DATA FUNCTIONS */

//Cache Data Get Function:
function getCacheData(id, read) {
  //Checks the Case:
  if (read) {
    //Returns the Data:
    return JSON.parse(localStorage.getItem(id));
  }

  else {
    //Returns the Data:
    return localStorage.getItem(id);
  }
}

//Cache Data Set Function:
function setCacheData(id, value, string) {
  //Checks the Case:
  if (string) {
    //Sets the Data:
    localStorage.setItem(id, JSON.stringify(value));
  }

  else {
    //Sets the Data:
    localStorage.setItem(id, value);
  }
}

//Clear Cache Data:
function clearCacheData() {
  //Clears Cache:
  localStorage.clear();
}

//Delete Cache Data:
function deleteCacheData(id) {
  //Deletes the Cache Item:
  localStorage.removeItem(id);
}

//Firebase Server Formatting Function:
function formatData(rawData) {
  //Replaces Info:
  var newData = rawData.replace(/\\n/g, "$n");
  var string = newData.replace(/\\/g, "");
  var side = string.replace(/^./, "");
  var main = side.slice(0, -1);
  var finalData = main.split("$n").join("\\n");

  //Returns the String:
  return finalData;
}

//Delete Element Function:
function deleteElement(array, index) {
  //Loop Variables:
  var turns = 0;
  var localArray = [];

  //Loops through Array:
  mainLoop: while (turns < array.length) {
    //Checks the Case:
    if (turns != index) {
      //Pushes to the Array:
      localArray.push(array[turns]);
    }

    turns++;
  }

  //Return the Array:
  return localArray;
}