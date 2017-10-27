// the first input to be displayed to the user. Nearly always "input1".
var defaultInput = "input1";

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
				<hr></hr>\
				<div class='output-area'>" +
					outputHTML
				+ "</div>"

	$('#outputArea').html(html);

	// scroll to the beginning of the output area if on mobile
	if ( $(window).width() < 768 ) {
		$('html, body').animate({
			scrollTop: $("#outputArea").offset().top - 50
		}, 500);
	}
}