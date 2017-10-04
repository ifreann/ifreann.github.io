// interaction.js - html visit planner. Based on RE0924/IN3

// all inputs as a 3D array. First dimension contains input instance names. Second dimension contains dropdown labels. Third dimension contains dropdown options.
var inputs = [];

// all outputs as a 2D array. First dimension contains output instance names. Second dimension contains output values.
var outputs = [];

// a list of all currently visible inputs. Used to track the order of inputs as they appear on screen.
var activeInputs = [];

// comma delimited list used in inputChange() to define the inputs to be added depending on user selection.
var displayInputs = [];

// the first input to be displayed to the user. Nearly always "input1".
var defaultInput = "input1";

// boolean check used to prevent datepicker.clearDates() triggering inputChange()
var triggeredByClearedDatepicker = false;

function showOutputText() {

	var selections = buildSelectionsArray();
	var v = selections[0];
	var withdrawing = selections[1];
	var baselineDate = selections[2];

	var output = "";
	var outputHTML = "";
	var lineNumber = v;
	var heading = "<strong>Double-Blind Treatment Period</strong><br/>";

	if ( v == 1 )
	{
		output = "output1-3_9_4-7";
		outputHTML = calculateOutput(output, baselineDate, 0);
	}
	else if ( withdrawing == 2 )
	{
		output = "output8";
		outputHTML = getOutputText(output);
	}
	else
	{
		output = "output1-3_9_4-7";
		
		if ( v > 3 ) { heading = "<strong>Open-Label Treatment Period</strong><br/>"; }
		
		if ( v == 4 ) { lineNumber += 3; }
		else if ( v == 7 ) { lineNumber += 10; }
		else if ( v > 4 ) { lineNumber += 7; }

		outputHTML = heading + calculateOutput(output, baselineDate, lineNumber);
	}

	var html = "<h2>Projected Future Visit Dates</h2>\
				<div class='col-12 right-edge'><hr></div>\
				<div class='output-area'>" +
					outputHTML
				+ "</div>"

	$('#outputArea').html(html);

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

// uses moment.js to format date
function formatDate(dateObject) {

	// todo

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

// runs on document.ready
function initialize() {

	buildHTML();
	buildInputsArray();
	buildOutputsArray();

	document.getElementById('clearBtn').onclick = clearAll;
	document.getElementById('printBtn').onclick = displayPrintDialog;

}

function inputChange(event) {

	// do nothing if inputChange was triggered by clearing a datepicker
	if ( triggeredByClearedDatepicker ) { return; }

	var inputName = event.target.id;
	var selection = document.getElementById(inputName).selectedIndex;

	switch (inputName) {

		case "input1":
			if ( selection == 1 || selection == 2 ) {
				displayInputs = [ 1, 3 ];
			}
			else {
				displayInputs = [ 1, 2 ];
			}
			break;

		case "input2":
			if ( selection == 1 ) {
				displayInputs = [ 1, 2, 3 ];
			}
			else {
				displayInputs = [ 1, 2 ];
			}
			break;

	}

	// if it's a dropdown that changed
	if ( event.target.localName == "select" ) {
		hideSubmitBtn();
		sortInputs(displayInputs);
		handleNextInput(displayInputs, inputName);
	}
	// if it's a datepicker that changed
	else {
		showSubmitBtn();
	}

	clearOutputText();

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

function addDropdown(inputName, label, optionsArray) {

	var options = "";

	for (var i = 0; i < optionsArray.length; i++) {
		options += "<option>" + optionsArray[i] + "</option>\n"
	}

	var html = "<div class='input' id=" + inputName + "HTML" + ">\
					<div class='col'>\
						<label for='dropdown1'>" + label + "</label>\
					</div>\
					<div class='col'>\
						<select class='custom-select' id='" + inputName + "'>\
							<option selected hidden>Select...</option>"
							+ options +
						"</select>\
					</div>\
				</div>"

	$('#inputArea').append(html);

	document.getElementById(inputName).onchange = inputChange;

}

function addDatepicker(inputName, label) {

	var html = "<div class='input' id=" + inputName + "HTML" + ">\
					<div class='col'>\
						<label>" + label + "</label>\
						<div class='input-group'>\
							<div class='input-group-addon'>\
								<span class='calendar-icon'><img src='calendar.svg' height=25 width=40></span>\
							</div>\
							<input type='datepicker' id=" + inputName + " class='form-control' placeholder='Select date...'>\
						</div>\
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

}

// assigned to Print button
function displayPrintDialog() {

	print();

}

function showSubmitBtn() {

	// if the submit button already exists, do nothing
	if ( document.getElementById("submitBtnHTML")) { return; }

	var html;

	html = "<div class='col' id='submitBtnHTML'>\
				<button type='button' class='btn btn-primary submit-btn' id='submitBtn'>Project Future Visit Dates</button>\
			</div>"

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

// Populates static HTML elements with interaction.xml labels
function buildHTML() {

	// load the xml file to be parsed
	$.ajax({ url: 'interaction.xml' })

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
		major = $(data).find('component[instance_name="major_number"] value').text();
		minor = $(data).find('component[instance_name="minor_number"] value').text();
		build = $(data).find('component[instance_name="build_number"] value').text();
		
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
	$.ajax({ url: 'interaction.xml' })

	.done(function(data) {

		instancesXML = $(data).find('component[instance_name^="input"][type="label"]');

		for (eachInstancesXMLNode of instancesXML) { instances.push(eachInstancesXMLNode.attributes["instance_name"].textContent); }

		labelsXML = $(data).find('component[instance_name^="input"][type="label"] property:nth-child(1) value').toArray();
		
		for (eachLabelsXMLNode of labelsXML) { labels.push(sanitize(eachLabelsXMLNode.textContent)); }
		
		for (var i = 0; i < labelsXML.length; i++) {
			optionsXML.push($(data).find('component[instance_name="input' + ( i + 1 ) + '_dropdown1"] component[instance_name^="label"][instance_name!="label"] property:nth-child(1) value').toArray());
		}

		var count = 0;
		for (eachOptionsXMLNode of optionsXML) {
			options.push([]);
			for (eachOptionsXMLSubnode of eachOptionsXMLNode) {
				options[count].push(sanitize(eachOptionsXMLSubnode.textContent));
			}
			count++;
		}

		inputs.push(instances, labels, options);

		addInput(defaultInput);
		
	});

}

// put relevant XML data into outputs[]
function buildOutputsArray() {

	// load the xml file to be parsed
	$.ajax({ url: 'interaction.xml' })

	.done(function(data) {

		var instancesXML = [];
		var instances = [];
		var valuesXML = [];		
		var values = [];

		instancesXML = $(data).find('component[instance_name^="output"][instance_name!="outputHeading"]');

		for (eachInstancesXMLNode of instancesXML) {
			instances.push(eachInstancesXMLNode.attributes["instance_name"].textContent);
		}

		var valuesXML = $(data).find('component[instance_name^="output"][instance_name!="outputHeading"] property:nth-child(1) value').toArray();

		for (eachValuesXMLNode of valuesXML) {
			values.push(sanitizeOutput(eachValuesXMLNode.textContent));
		}

		outputs.push(instances, values);
	});

}