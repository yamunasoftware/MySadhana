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
var saveIndex = null;

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

      //Shows the Dashboard:
      showDashboard();
      displayNotes();
    })
    .catch(() => {
      //Displays Error:
      showError("Error");
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

        //Shows the Dashboard:
        showDashboard();
        displayNotes();
      }

      else {
        //Displays Error:
        showError("Invalid ID");
      }
    })

  }

  else {
    //Displays Error:
    showError("Invalid ID");
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
  if (getCacheData(codeID, false) != null) {
    //Gets the Code:
    code = getCacheData(codeID, false);

    //Sets the Cloud Data:
    database.collection(collectionName).doc(code).update({
      data: JSON.stringify(data)
    })
      .catch(() => {
        //Displays Error:
        showError("Error");
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

        //Shows the Dashboard:
        showDashboard();
        displayNotes();
      }

      else {
        //Displays Error:
        showError("Invalid ID");
      }
    })
      .catch(() => {
        //Displays Error:
        showError("Invalid ID");
      });
  }
}

/* DATA FUNCTIONS */

//Copy Code Function:
function copyCode() {
  //Sends the Code to Clipboard:
  code = getCacheData(codeID, false);
  navigator.clipboard.writeText(code);
}

//Save Note Function:
function saveNote() {
  //Checks the Case:
  if (getCacheData(dataID, false) != null) {
    //Sets the Data:
    data = getCacheData(dataID, true);
    data[saveIndex] = document.getElementById('text-area').innerHTML;
    
    //Replaces the Highlight:
    data[saveIndex].replace("<mark>", "");
    data[saveIndex].replace("</mark>", "");

    //Saves the Data:
    setCacheData(dataID, data, true);
    sendData();
  }
}

//Pin Note Function:
function pinNote() {
  //Checks the Case:
  if (getCacheData(dataID, false) != null &&
    saveIndex != null) {
    //Gets the Data:
    data = getCacheData(dataID, true);
    var localData = data;

    //Gets the Note:
    var note = localData[saveIndex];
    var newArray = [];

    //Loop Variable:
    var turns = 0;

    //Loops through Array:
    mainLoop: while (turns < localData.length) {
      //Checks the Case:
      if (turns == 0) {
        //Pushes to the Array:
        newArray.push(note);
        newArray.push(localData[turns]);
      }

      else if (localData[turns] != note) {
        //Pushes tot he Array:
        newArray.push(localData[turns]);
      }

      turns++;
    }

    //Sets the Data:
    data = newArray;
    setCacheData(dataID, data, true);

    //Sends the Data:
    sendData();
    exitNote();
  }
}

//Exit Notes Function:
function exitNote() {
  //Shows the Dashboard:
  saveIndex = null;
  showDashboard();
  displayNotes();
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
        "<div class='margin padding card center' style='cursor: pointer;' onclick='showNotes(" + turns + ");'>"
        + title(data[turns]);

      //Sets the Notes List:
      var alerts = checkDates(dates(data[turns]));
      notesList +=
        "<div class='margin dash-alert'>" + alerts[1] + "</div>"
        + "<div style='background-color: #147efb;' class='margin dash-alert'>" + alerts[0] + "</div>"
        + "<div style='background-color: #53d769;' class='margin dash-alert'>" + alerts[2] + "</div> </div>";

      turns++;
    }

    //Sets the HTML:
    document.getElementById('notes-list').innerHTML = notesList;
  }
}

//Search Function:
function search(e) {
  //Loop Variables:
  data = getCacheData(dataID, true);
  var turns = 0;
  var notesList = "";

  //Loops through Array:
  mainLoop: while (turns < data.length) {
    //Checks the Case:
    if (data[turns].toLowerCase().includes(e.target.value.toLowerCase())) {
      //Sets the Notes List:
      notesList +=
        "<div class='margin padding card center' style='cursor: pointer;' onclick='showNotes(" + turns + ");'>"
        + title(data[turns]);

      //Sets the Notes List:
      var alerts = checkDates(dates(data[turns]));
      notesList +=
        "<div class='margin dash-alert'>" + alerts[1] + "</div>"
        + "<div style='background-color: #147efb;' class='margin dash-alert'>" + alerts[0] + "</div>"
        + "<div style='background-color: #53d769;' class='margin dash-alert'>" + alerts[2] + "</div> </div>";
    }

    turns++;
  }

  //Sets the HTML:
  document.getElementById('notes-list').innerHTML = notesList;
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
function deleteNote() {
  //Checks the Case:
  if (getCacheData(dataID, false) != null &&
    saveIndex != null) {
    //Gets the Data:
    data = getCacheData(dataID, true);
    data.splice(saveIndex, 1);

    //Sends the Data:
    setCacheData(dataID, data, true);
    sendData();
    exitNote();
  }
}

//Title Function:
function title(string) {
  //Loops Variables:
  var noteTitle = "";
  var turns = 0;

  //Loops through Array:
  mainLoop: while (turns < string.length) {
    //Checks the Case:
    if (string[turns] != "<") {
      //Adds to the Title:
      noteTitle += string[turns];
    }

    else {
      //Exits the Loop:
      break mainLoop;
    }

    turns++;
  }

  //Returns the Title:
  return noteTitle;
}

/* DATES FUNCTIONS */

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

//Check Dates Function:
function checkDates(dates) {
  //Gets the Current Date Variables:
  var date = new Date();
  var currentMonth = date.getMonth() + 1;
  var currentDay = date.getDate();

  //Loop Variables:
  var turns = 0;
  var now = 0;
  var past = 0;
  var upcoming = 0;

  //Loops through Array:
  mainLoop: while (turns < dates.length) {
    //Extracts the Dates:
    var localDates = extractDate(dates[turns]);

    //Checks the Case:
    if (localDates[0] == currentMonth && localDates[1] == currentDay) {
      //Adds to the Alerts:
      now++;
    }

    else if (localDates[0] < currentMonth) {
      //Adds to the Alerts:
      past++;
    }

    else if (localDates[1] < currentDay && localDates[0] == currentMonth) {
      //Adds to the Alerts:
      past++;
    }

    else if (localDates[0] == currentMonth && localDates[1] > currentDay) {
      //Checks the Case:
      if (localDates[1] - currentDay <= 2) {
        //Adds to the Alerts:
        upcoming++;
      }
    }

    turns++;
  }

  //Checks the Case:
  if (now == 0 && past != 0 && upcoming != 0) {
    //Returns the Array:
    return ["", past, upcoming];
  }

  else if (now != 0 && past == 0 && upcoming != 0) {
    //Returns the Array:
    return [now, "", upcoming];
  }

  else if (now != 0 && past != 0 && upcoming == 0) {
    //Returns the Array:
    return [now, past, ""];
  }

  else if (now == 0 && past == 0 && upcoming != 0) {
    //Returns the Array:
    return ["", "", upcoming];
  }

  else if (now != 0 && past == 0 && upcoming == 0) {
    //Returns the Array:
    return [now, "", ""];
  }

  else if (now == 0 && past != 0 && upcoming == 0) {
    //Returns the Array:
    return ["", past, ""];
  }

  else if (now == 0 && past == 0 && upcoming == 0) {
    //Returns the Array:
    return ["", "", ""];
  }

  else {
    //Returns the Array:
    return [now, past, upcoming];
  }
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

//Highlight Dates Function:
function highlightDates(string, dates) {
  //Loop Variables:
  var localString = string;
  var turns = 0;

  //Loops through Array:
  mainLoop: while (turns < dates.length) {
    //Sets the String:
    localString = highlight(dates[turns], localString);
    
    turns++;
  }

  //Returns the String:
  return localString;
}

//Highlight Function:
function highlight(value, text) {
  //Returns the Highlighted Text:
	var newText = text.replace(value, "<mark>" + value + "</mark>");
  console.log(value);
	return newText;
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

//Firebase Server Formatting Function:
function formatData(rawData) {
  //Replaces Info:
  var string = rawData.replace(/\\/g, "");
  var side = string.replace(/^./, "");
  var main = side.slice(0, -1);

  //Returns the String:
  return main;
}