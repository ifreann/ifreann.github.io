// interaction.js - html visit planner. Based on RE0924/IN3

// all inputs as a 3D array. First dimension contains input instance names. Second dimension contains dropdown labels. Third dimension contains dropdown options.
var inputs = [];

// all outputs as a 2D array. First dimension contains output instance names. Second dimension contains output values.
var outputs = [];

// a list of all currently visible inputs. Used to track the order of inputs as they appear on screen.
var activeInputs = [];

// comma delimited list used in inputChange() to define the inputs to be added depending on user selection.
var displayInputs = [];

// boolean check used to prevent datepicker.clearDates() triggering inputChange()
var triggeredByClearedDatepicker = false;

// runs on document.ready
function initialize() {

	buildHTML();
	buildInputsArray();
	buildOutputsArray();

	document.getElementById('clearBtn').onclick = clearAll;
	document.getElementById('printBtn').onclick = displayPrintDialog;
	document.getElementById('dismissBtn').onclick = dismissDisclaimer;

}

// what happens when you click the X button on the disclaimer
function dismissDisclaimer() {

	// slides down and fades away footer, then hides HTML
	$( "#footer" ).animate({
		marginBottom: "-150px",
		opacity: "0"
	}, 500, function() {
		$( "#footer" ).hide();
	});

	// set margin-bottom of body to 0

}

// returns the output with its date objects calculated
function calculateOutput(output, dateToUse, lineNumber) {

	var rawHTML = outputs[1][outputs[0].indexOf(output)];

	var splitOutput = rawHTML.split("<br />");

	splitOutput.splice(0, lineNumber);

	splitOutput = splitOutput.join("<br />");

	var dateObjects = getDateObjects(splitOutput, dateToUse);

	var calculatedDates = calculateDates(dateObjects, dateToUse);

	var calculatedOutput = "";

	for ( var i = 0; i < dateObjects[0].length; i++ ) {
		splitOutput = splitOutput.replace(dateObjects[0][i], calculatedDates[i]);
	}

	return splitOutput;

}

// returns an array of formatted dates with their calculations applied
function calculateDates(dateObjects, dateToUse) {

	var calculations = dateObjects[3];
	var operators = [];
	var numbers = [];
	var units = [];

	for ( var i = 0; i < calculations.length; i++ ) {
		operators.push(calculations[i].charAt(0));
		numbers.push(calculations[i].slice(1, calculations[i].indexOf(",")));
		units.push(calculations[i].slice(calculations[i].indexOf(",") + 1));
	}
	var dateComponents = [operators, numbers, units];

	var calculatedDates = [];
	for ( var i = 0; i < dateObjects[0].length; i++ ) {
		var thisDate = dateToUse;
		if ( dateComponents[0][i] == "+" ) {
			thisDate = moment(thisDate).add(dateComponents[1][i], dateComponents[2][i]);
		}
		else {
			thisDate = moment(thisDate).subtract(dateComponents[1][i], dateComponents[2][i]);
		}
		thisDate = moment(thisDate).format("DD/MMM/YYYY");
		calculatedDates.push(thisDate);	
	}

	return calculatedDates;

}

// returns an array of all date objects (arrayed by type, format and calculation) within an output
function getDateObjects(output) {

	// array of all date objects within an output. Looks for everything starting with "[date" and ends with "]".
	var allObjects = output.match(/\[date(.*?)\]/g);

	var types = [];
	var formats = [];
	var calculations = [];

	for ( var i = 0; i < allObjects.length; i++ ) {
		types.push(allObjects[i].substring(allObjects[i].lastIndexOf("type=") + 6, allObjects[i].indexOf('"', allObjects[i].lastIndexOf("type=") + 6)));
		formats.push(allObjects[i].substring(allObjects[i].lastIndexOf("format=") + 8, allObjects[i].indexOf('"', allObjects[i].lastIndexOf("format=") + 8)));
		calculations.push(allObjects[i].substring(allObjects[i].lastIndexOf("calculation=") + 13, allObjects[i].indexOf('"', allObjects[i].lastIndexOf("calculation=") + 13)));
	}

	var dateObjects = [allObjects, types, formats, calculations];

	return dateObjects;
}

// returns output text by instance name
function getOutputText(output) {

	return outputs[1][outputs[0].indexOf(output)];

}

// returns a numbered list of selectedIndex values for all inputs. Datepickers are given a date. Missing inputs are given a "" value to prevent errors in showOutputText().
function buildSelectionsArray() {

	var selections = [];
	var element;

	for ( var i = 0; i < inputs.length; i++ ) {

		element = document.getElementById(inputs[0][i]);

		if ( !element ) {
			selections.push("");
		}
		else if ( element.nodeName == "INPUT" ) {
			selections.push( $("#" + element.id).datepicker("getDate"));
		}
		else {
			selections.push(element.selectedIndex);
		}
	}

	return selections;

}

// deals with the next active input after the user makes their selection - clear the value of the next input, or show the submit button
function handleNextInput(displayInputs, inputName) {

	var displayInputsArray = [];
	for ( var i = 0; i < displayInputs.length; i++ ) { displayInputsArray.push("input" + displayInputs[i]); }

	var index = displayInputsArray.indexOf(inputName);
	var nextInput = document.getElementById(displayInputsArray[index + 1]);

	// if the next input is the same as the current input (i.e. it's the last in line), do nothing
	if ( nextInput == inputName ) { return; }

	// if the next input is blank
	if ( nextInput == null ) {
		showSubmitBtn();
	}
	// if the next input is a dropdown
	else if ( nextInput.localName == "select") {
		nextInput.selectedIndex = 0;
	}
	// if the next input is a datepicker
	else {
		triggeredByClearedDatepicker = true;
		var next = "#" + nextInput.id;
		$(next).datepicker("clearDates");
		triggeredByClearedDatepicker = false;
	}

}

// adds inputs if they're not already on the page, and deletes inputs that are not needed
function sortInputs(displayInputs) {

	// convert [x, y, z] array to [inputx, inputy, inputz] array
	var displayInputsArray = [];
	for ( var i = 0; i < displayInputs.length; i++ ) { displayInputsArray.push("input" + displayInputs[i]); }

	// delete inactive inputs
	var diff = ($(inputs[0]).not(displayInputsArray)).toArray();
	for ( var i = 0; i < diff.length; i++ ) { removeInput(diff[i]); }

	// add active inputs
	for ( var i = 0; i < displayInputsArray.length; i++ ) {
		if ( !document.getElementById(displayInputsArray[i]) ) {
			addInput(displayInputsArray[i]);
		}
	}

}

// parent function of addDropdown and addDatepicker
function addInput(inputName) {

	// do nothing if the input already exists
	if ( document.getElementById(inputName) ) { return; }

	var inputIndex = inputs[0].indexOf(inputName);
	var label = inputs[1][inputIndex];
	var optionsArray = inputs[2][inputIndex];

	// list the input as visible to the user
	activeInputs.push(inputName);
	
	// If there are no options associated with the input, that means it's a datepicker.
	if ( optionsArray == "" ) {
		addDatepicker(inputName, label);
	}
	else {
		addDropdown(inputName, label, optionsArray);
	}

	console.log("Active inputs: " + activeInputs);

}

// returns true/false if a specified HTML element is completely visible to the user.
function isFullyVisible(e) {

    var elemTop = e.getBoundingClientRect().top;
    var elemBottom = e.getBoundingClientRect().bottom;
    var isVisible = elementTop < window.innerHeight && elementBottom >= 0;

    return isVisible;

}

function addDropdown(inputName, label, optionsArray) {

	var options = "";

	for (var i = 0; i < optionsArray.length; i++) {
		options += "<option>" + optionsArray[i] + "</option>\n"
	}

	var html = "<div class='input' id=" + inputName + "HTML" + ">\
					<label for='dropdown1'>" + label + "</label>\
					<select class='custom-select' id='" + inputName + "'>\
						<option selected hidden>Select...</option>"
						+ options +
					"</select>\
				</div>"

	$('#inputArea').append(html);

	document.getElementById(inputName).onchange = inputChange;

}

function addDatepicker(inputName, label) {

	var html = "<div class='input' id=" + inputName + "HTML" + ">\
					<label>" + label + "</label>\
					<div class='input-group'>\
						<div class='input-group-addon'>\
							<span class='calendar-icon'><img src='calendar.svg' height=25 width=40></span>\
						</div>\
						<input type='datepicker' id=" + inputName + " class='form-control' placeholder='Select date...' readonly>\
					</div>\
				</div>"

	$('#inputArea').append(html);

	applyDatePicker(inputName);

	document.getElementById(inputName).onchange = inputChange;

}

function removeInput(inputName) {

	// delete the input HTML
	$( "#" + inputName + "HTML" ).remove();

	// remove the input from the list of active inputs
	var index = activeInputs.indexOf(inputName);
	if (index != -1) { activeInputs.splice(index, 1); }

}

function clearAll() {

	for ( var i = 0; i < inputs[0].length; i++ ) { removeInput(inputs[0][i]); }

	clearOutputText();

	hideSubmitBtn();

	addInput(defaultInput);

	$('body').scrollTop(0);

}

// assigned to Print button
function displayPrintDialog() {

	print();

}

function showSubmitBtn() {

	// if the submit button already exists, do nothing
	if ( document.getElementById("submitBtnHTML")) { return; }

	var html;

	html = "<div id='submitBtnHTML'>\
				<button type='button' class='btn btn-primary submit-btn' id='submitBtn'>Project Future Visit Dates</button>"

	$('#inputArea').append(html);

	document.getElementById('submitBtn').onclick = showOutputText;

}

function hideSubmitBtn() {

	$( "#submitBtnHTML" ).remove();

}

function clearOutputText() {

	$('#outputArea').html("");

}

/*

XML Stuff

*/

// removes all HTML tags from FSB labels
function sanitize(string) {

	return string.replace(/<\/?[^>]+(>|$)/g, "");

}

// removes unwanted HTML tags from FSB outputs
function sanitizeOutput(string) {
	
	// replace any closing div tags with line breaks
	string = string.replace(/<\/div>/g, "</br>");

	// delete all HTML tags other than b, strong and br
	string = string.replace(/<(?!\/?b>|\/?strong>|\/?br)[^>]+>/g, "");

	return string;

}

// Populates static HTML elements with XML data
function buildHTML() {

	// load the xml file to be parsed
	$.get({ url: 'interaction.xml' })

	.done(function(data) {

		var heading, subheading, clearBtn, printBtn, informationBtn, informationHeading, informationContent, inputsHeading, outputsHeading, submitBtn, disclaimer, major, minor, build;

		heading = $(data).find('content title:first').text();
		document.getElementById('heading').innerHTML = heading;

		subheading = $(data).find('component[instance_name="introduction"] value:first').text();
		document.getElementById('subheading').innerHTML = subheading;

		clearBtn = sanitize($(data).find('component[instance_name="clear_all"] component[instance_name="button"] value:first').text());
		document.getElementById('clearBtn').innerHTML = clearBtn;

		printBtn = sanitize($(data).find('component[instance_name="print"] component[instance_name="button"] value:first').text());
		document.getElementById('printBtn').innerHTML = printBtn;

		informationBtn = "Information"; // could be an FSB label in future. Hardcoded for now
		document.getElementById('informationBtn').innerHTML = informationBtn;

		informationHeading = sanitize($(data).find('component[instance_name="informationIcon"] component[instance_name="title"] property:first value').text());
		document.getElementById('informationHeading').innerHTML = informationHeading;

		informationContent = $(data).find('component[instance_name="informationIcon"] component[instance_name="content"] property:first value').text();
		document.getElementById('informationContent').innerHTML = informationContent;

		inputsHeading = sanitize($(data).find('component[instance_name="requiredInformation"] property:first value:first').text());
		document.getElementById('inputsHeading').innerHTML = inputsHeading;

		disclaimer = $(data).find('component[instance_name="disclaimer"] property:first value:first').text();
		document.getElementById('disclaimer').innerHTML = disclaimer;
		
		// load this after output is displayed, not before
		outputsHeading = sanitize($(data).find('component[instance_name="outputHeading"] property:first value:first').text());
		// document.getElementById('outputsHeading').innerHTML = outputsHeading;

		// load this after submitBtn is displayed, not before
		submitBtn = sanitize($(data).find('component[instance_name="calculation_button"] component[instance_name="button"] property:first value:first').text());
		// document.getElementById('submitBtn').innerHTML = submitBtn;		

		// load FSB build number
		var version;
		major = $(data).find('major_number').text();
		minor = $(data).find('minor_number').text();
		build = $(data).find('build_number').text();

		// interaction.xml only has a version number after you've run a build on FSB. So while working locally, the version number will say "Development Build" instead.
		if ( major == "" || minor == "" || build == "" ) { version = "Development Build"; }
		else { version = "v" + major + "." + minor + "." + build; }
		document.getElementById('version').innerHTML = version;
		
	});

}

// put relevant XML data into inputs[]
function buildInputsArray() {

	var instancesXML = [];
	var instances = [];
	var labelsXML = [];
	var labels = [];
	var optionsXML = [];		
	var options = [];

	// load the xml file to be parsed
	$.get({ url: 'interaction.xml' })

	.done(function(data) {

		instancesXML = $(data).find('component[instance_name^="input"][type="label"]');

		for ( var i = 0; i < instancesXML.length; i++ ) {
			instances.push(instancesXML[i].attributes["instance_name"].textContent);
		}

		labelsXML = $(data).find('component[instance_name^="input"][type="label"] property:nth-child(1) value').toArray();
		
		for ( var i = 0; i < labelsXML.length; i++ ) { labels.push(sanitize(labelsXML[i].textContent)); }
		
		for (var i = 0; i < labelsXML.length; i++) {
			optionsXML.push($(data).find('component[instance_name="input' + ( i + 1 ) + '_dropdown1"] component[instance_name^="label"][instance_name!="label"] property:nth-child(1) value').toArray());
		}

		for ( var i = 0; i < optionsXML.length; i++ ) {
			options.push([]);
			for ( var j = 0; j < optionsXML[i].length; j++ ) {
				options[i].push(sanitize(optionsXML[i][j].textContent));
			}
		}

		inputs.push(instances, labels, options);

		addInput(defaultInput);
		
	});

}

// put relevant XML data into outputs[]
function buildOutputsArray(data) {

	// load the xml file to be parsed
	$.get({ url: 'interaction.xml' })

	.done(function(data) {

		var instancesXML = [];
		var instances = [];
		var valuesXML = [];		
		var values = [];

		instancesXML = $(data).find('component[instance_name^="output"][instance_name!="outputHeading"]');

		for (var i = 0; i < instancesXML.length; i++) { 	instances.push(instancesXML[i].attributes["instance_name"].textContent); }

		var valuesXML = $(data).find('component[instance_name^="output"][instance_name!="outputHeading"] property:nth-child(1) value').toArray();

		for (var i = 0; i < valuesXML.length; i++) { values.push(sanitizeOutput(valuesXML[i].textContent)); }

		outputs.push(instances, values);
	
	});

}