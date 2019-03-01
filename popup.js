// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


//variables to reference the elements of the popup
var textField;
var textFieldText;

var radioButtons;
var selectedRadioButton;

var authorizeDiv;



//variable to store the list of students
var listOfStudents;

//called when all the elements on the pop up are loaded
window.onload = function ()
{
	
	//assign all the input elements event listeners
	var listButton = document.getElementById("listbutton");
	listButton.addEventListener('click',function(){ window.open("https://docs.google.com/spreadsheets/d/1URk9WCCbt6g5o7GcQtOV9TGyprhDG-vwfGsFlefH4bQ/edit#gid=0") });


	// Get the text data
	textField =document.getElementById("textInput");


	// Get the radio button option
	radioButtons = document.getElementsByName("sort");

			
	var createButton = document.getElementById("CreateButton");
	createButton.addEventListener('click',function(){createButtonClicked();})

	
	var authorizeButtonForNiggasONly = document.getElementById("authorize-button");
	
	
	authorizeButtonForNiggasONly.addEventListener("click",function(){getListOfStudents();})
	

};

function getListOfStudents()
{
	handleAuthClick(event);
}


function createButtonClicked()
{
	textFieldText = textField.value;
	//check for faulty input
	if(isNaN(textFieldText))
	{
		alert("Number entered ("+textFieldText+") is not a number\n try entering a number")
	}
	else if(textFieldText>listOfStudents.length)
	{
		alert("Input entered is too large\n The limit is:"+listOfStudents.length);
		
	}
	else if(textFieldText<=0)
	{
		alert("Input is too low\n try entering a number above zero")
		
	}
	else if(textFieldText=="")
	{
		alert("No input entered\n try entering a number");
	}
	else
	{
	setUpGroupParameters();
	displayGroups(createGroups(listOfStudents));	
	}
	
}


var groupCount; //number of groups

//assign the groupCount the value of number of groups
function setUpGroupParameters()
{
	//check which radiobutton was clicked
	for (var i = 0; i < radioButtons.length; i++)
	{
		if (radioButtons[i].checked)
		{
			selectedRadioButton = radioButtons[i].value;
			break;
		}
	}
	
	//
	
	groupCount=textFieldText;
	if(selectedRadioButton=="people")
	{
		groupCount = Math.round(listOfStudents.length/groupCount);
	}
	
}
//Group randomizer
function createGroups(sl)
{
	//used to avoid references
	var studentlist= new Array(sl.length);
	var groups= new Array(groupCount);
	var rotation=0;// variable to be used to figure out which group to focus
	//sync the lists. Used to destroy avoid references and use values
	for(var i=sl.length-1;i!=-1;i--)
	{
		studentlist[i] = sl[i];

	}
	//remove any text from the group array
	for(var i=groupCount-1;i!=-1;i--){groups[i]="";}
	
	
	
	//cycle through the groups, with each iteration a member is added.
	for(var i=studentlist.length-1;i!=-1;i--)
	{
		groups[rotation] += studentlist.splice(Math.floor(Math.random() * studentlist.length), 1)+", ";
		rotation++;
		if(rotation==groupCount){rotation=0;}
	}
	return groups;
}

function displayGroups(doublelist)
{
	//clean up the output to be readable
	var output="";
	for(var i=0;i!=doublelist.length;i++)
	{
		output+="Group"+(i+1)+"\n";
		output+= doublelist[i]+"\n";
		
	}
	alert(output);
}








// CLIENT ID MUST BE CHANGED TO BE ABLE TO USE THE TEAM BUILDER
  var CLIENT_ID = '286439530035-7rc0i2gfc1gvlpl2m94sgg0kikqniple.apps.googleusercontent.com';

  var SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
//onload
 function checkAuth() {
	gapi.auth.authorize(
	  {
		'client_id': CLIENT_ID,
		'scope': SCOPES.join(' '),
		'immediate': true
	  }, handleAuthResult);
  }
//Verify user authorization
  function handleAuthResult(authResult) {
	var authorizeDiv = document.getElementById('authorize-div');
	if (authResult && !authResult.error) {
	  // Hide auth UI, then load client library.
	 authorizeDiv.style.display = 'none';
	  loadSheetsApi();
	} else {
		alert("Did not sign in, please authorize");
	  // Show auth UI, allowing the user to initiate authorization by
	  // clicking authorize button.
	 authorizeDiv.style.display = 'inline';
	}
  }
//Authorize user into sheets API
  function handleAuthClick(event) {

	gapi.auth.authorize(
	  {client_id: CLIENT_ID, scope: SCOPES, immediate: false}, handleAuthResult);
	return false;
  }

  function loadSheetsApi() {
	var discoveryUrl =
		'https://sheets.googleapis.com/$discovery/rest?version=v4';
	gapi.client.load(discoveryUrl).then(sheetToList);
  }
  
  //Convert data from sheet into an array
  function sheetToList() {

	gapi.client.sheets.spreadsheets.values.get({
	  spreadsheetId: '1URk9WCCbt6g5o7GcQtOV9TGyprhDG-vwfGsFlefH4bQ',
	  range: 'Class!A1:A', //only ever use the first column, make sure the sheet is called Sheet1
	}).then(function(response) {
	  var range = response.result;
	  if (range.values.length > 0) {
		//appendPre('Name, Major:');
		console.log('In sheetToList')
		listOfStudents = new Array(range.values.length);
		for (i = 0; i < range.values.length; i++) {
			var row = range.values[i];
		  listOfStudents[i] = row[0];
			
		  // Print column A, which corresponds to indice 0.
		  //appendPre(row[0]);
		}
	  } else {
		console.log('No data found.');
	  }
	}, function(response) {
	  console.log('Error: ' + response.result.error.message);
	});
  }

//THIS ONWARDS IS NOT USED  
  function appendPre(message) {
	var pre = document.getElementById('output');
	var textContent = document.createTextNode(message + '\n');
	pre.appendChild(textContent);
  }


/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function getImageUrl(searchTerm, callback, errorCallback) {
  // Google image search - 100 searches per day.
  // https://developers.google.com/image-search/
  var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
    '?v=1.0&q=' + encodeURIComponent(searchTerm);
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  // The Google image search API responds with JSON, so let Chrome parse it.
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response || !response.responseData || !response.responseData.results ||
        response.responseData.results.length === 0) {
      errorCallback('No response from Google Image search!');
      return;
    }
    var firstResult = response.responseData.results[0];
    // Take the thumbnail instead of the full image to get an approximately
    // consistent image size.
    var imageUrl = firstResult.tbUrl;
    var width = parseInt(firstResult.tbWidth);
    var height = parseInt(firstResult.tbHeight);
    console.assert(
        typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
        'Unexpected respose from the Google Image Search API!');
    callback(imageUrl, width, height);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    // Put the image URL in Google search.
    renderStatus('Performing Google Image search for ' + url);

    getImageUrl(url, function(imageUrl, width, height) {

      renderStatus('Search term: ' + url + '\n' +
          'Google image search result: ' + imageUrl);
      var imageResult = document.getElementById('image-result');
      // Explicitly set the width/height to minimize the number of reflows. For
      // a single image, this does not matter, but if you're going to embed
      // multiple external images in your page, then the absence of width/height
      // attributes causes the popup to resize multiple times.
      imageResult.width = width;
      imageResult.height = height;
      imageResult.src = imageUrl;
      imageResult.hidden = false;

    }, function(errorMessage) {
      renderStatus('Cannot display image. ' + errorMessage);
    });
  });
});
