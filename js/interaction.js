// interaction.js - html visit planner. Based on RE0924/IN3

// all inputs as a 3D array. First dimension contains input instance names. Second dimension contains dropdown labels. Third dimension contains dropdown options.
var inputs = [];

// all outputs as a 2D array. First dimension contains output instance names. Second dimension contains output values.
var outputs = [];

// a list of all currently visible inputs. Preserves the order for non standard sequences of inputs.
var activeInputs = [];

// the first input to be displayed to the user. Nearly always "input1".
var defaultInput = "input1";

var defaultText

// runs on document.ready
function initialize() {

	buildHTML();
	buildInputsArray();
	buildOutputsArray();
	
	document.getElementById('clearBtn').onclick = clearAll;
	document.getElementById('printBtn').onclick = displayPrintDialog;

}

function inputChange(event) {

	var inputName = event.target.id;
	var displayedInputs = [];
	var selection = document.getElementById(inputName).selectedIndex;

	switch (inputName) {

		case "input1":
			if ( selection == 1 || selection == 2 ) {
				displayedInputs = [1,3];
			}
			else {
				displayedInputs = [1,2];
			}
			break;

		case "input2":
			if ( selection == 1 ) {
				displayedInputs = [1,2,3];
			}
			else {
				displayedInputs = [1,2];
			}
			break;

		case "input3":
			break;

	}

	// if it's a dropdown that changed
	if ( event.target.localName == "select" ) {
		sortInputs(displayedInputs);
		hideSubmitBtn();
	}
	// if it's a datepicker that changed
	else {
		showSubmitBtn();
	}

	clearNextInput(displayedInputs, inputName, event.target.localName);

}

// if the next input on the list of active inputs is already visible, clear its value
function clearNextInput(displayedInputs, inputName, event) {

	console.log(displayedInputs);

	var displayedInputsArray = [];
	for ( var i = 0; i < displayedInputs.length; i++ ) { displayedInputsArray.push("input" + displayedInputs[i]); }

	// console.log(displayedInputsArray.length);
	// console.log(document.getElementById(displayedInputsArray[displayedInputsArray.length - 1]));

	console.log("last input in the list: " + displayedInputsArray[displayedInputsArray.length - 1]);

	console.log("the input you changed: " + inputName);

}

// adds inputs if they're not already on the page, and deletes inputs that are not needed
function sortInputs(displayedInputs) {

	// convert [x, y, z] array to [inputx, inputy, inputz] array
	var displayedInputsArray = [];
	for ( var i = 0; i < displayedInputs.length; i++ ) { displayedInputsArray.push("input" + displayedInputs[i]); }

	// delete inactive inputs
	var diff = ($(inputs[0]).not(displayedInputsArray)).toArray();
	for ( var i = 0; i < diff.length; i++ ) { removeInput(diff[i]); }

	// add active inputs
	for ( var i = 0; i < displayedInputsArray.length; i++ ) {
		if ( activeInputs.indexOf(displayedInputsArray[i]) == -1 ) {
			addInput(displayedInputsArray[i]);
		}
	}

}

function addInput(inputName) {

	// do nothing if the input already exists
	// if ( document.getElementById(inputName) ) { return; }

	var inputIndex = inputs[0].indexOf(inputName);
	var label = inputs[1][inputIndex];
	var optionsArray = inputs[2][inputIndex];

	// list the input as visible to the user
	activeInputs.push(inputName);
	
	// If there are no options associated with the input, that means it's a datepicker.
	if ( optionsArray.length == 0 ) { 
		addDatepicker(inputName, label);
	}
	else {
		addDropdown(inputName, label, optionsArray);
	}

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

function showOutputText() {

	var html = "\
				<h2>Projected Future Visit Dates</h2>\
				<div class='col-12 right-edge'><hr></div>\
				<div class='output-area'>\
					<b>Double-Blind Treatment Period</b>\
					<br>Visit 3 Week 4 = 23/Oct/2017 (± 5/± 1 days) \
					<br>Visit 4 Week 8 = 20/Nov/2017 (± 5/± 1 days) \
					<br>Visit 5 Week 10 = 04/Dec/2017 (± 5/± 1 days) \
					<br> \
					<br>Visit window is ± 5 days for patients not on apheresis and ± 1 day for patients on apheresis. Every attempt should be made to ensure all samples are collected immediately prior to LDL apheresis. The timing between the baseline sample collection relative to the most recently completed LDL apheresis procedure should match the timing of the Week 12 sample collection relative to the most recently completed LDL apheresis procedure. Depending on the duration between the LDL apheresis procedure and sample collection, the visit window may not apply. \
					<br> \
					<br>Visit 6 Week 12 /End of Double-Blind Treatment = 18/Dec/2017 (± 3/± 1 days) \
					<br> \
					<br>Please note that Visit 6 Week 12/End of Double-Blind Treatment visit window is ± 3 days for patients not on apheresis and ± 1 day for patients on apheresis. Every attempt should be made to ensure all samples are collected immediately prior to LDL apheresis. The timing between the baseline sample collection relative to the most recently completed LDL apheresis procedure should match the timing of the Week 12 sample collection relative to the most recently completed LDL apheresis procedure. pending bron the duration between the LDL apheresis procedure and sample collection, the visit window may not apply. \
					<br> \
					<br><b>Open-Label Treatment Period</b>\
					<br>Visit 7 Week 18 = 29/Jan/2018 (± 7 days) \
					<br>Visit 8 Week 24/End of Open-Label Treatment = 12/Mar/2018 (± 3/± 1 days) \
					<br> \
					<br>Please note that Visit 8 Week 24/End of Open-Label Treatment visit window is ± 3 days for patients not on apheresis and ± 1 day for patients on apheresis. Every attempt should be made to ensure all samples are collected immediately prior to LDL apheresis. The timing between the baseline sample collection relative to the most recently completed LDL apheresis procedure should match the timing of the Week 12 sample collection relative to the most recently completed LDL apheresis procedure. pending bron the duration between the LDL apheresis procedure and sample collection, the visit window may not apply. \
					<br> \
					<br>Visit 9 Week 32/ End of Study Phone Visit = 07/May/2018 (± 5 days) \
					<br> \
					<br>Please note that Visit 9 Week 32/ End of Study Phone Visit is only for patients who do not participate in another lipid-lowering study.\
				</div>\
			"

	$('#outputArea').html(html);

}

function clearAll() {

	$('#outputArea').html("");

	var defaultInput = "\
				<div class='input' id='input1'>\
					<div class='col'>\
						<label for='dropdown1'>Select current visit:</label>\
					</div>\
					<div class='col'>\
						<select class='custom-select' id='dropdown1'>\
							<option selected hidden>Select...</option>\
							<option>Visit 2 Week 0 (Baseline)</option>\
							<option>Visit 3 Week 4</option>\
							<option>Visit 4 Week 8</option>\
							<option>Visit 5 Week 10</option>\
							<option>Visit 6 Week 12/End of Double-Blind Treatment</option>\
							<option>Visit 7 Week 18</option>\
							<option>Visit 8 Week 24/End of Open-Label Treatment</option>\
						</select>\
					</div>\
				</div>\
				";

	$('#inputArea').html(defaultInput);

	document.getElementById('dropdown1').onchange = addInput2;

}

// assigned to Print button
function displayPrintDialog() {

	print();

}

function showSubmitBtn() {

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