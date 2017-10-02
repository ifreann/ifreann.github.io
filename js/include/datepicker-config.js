// applies datepicker functionality to any text field typed "datepicker". Call it after you've loaded a date input into the HTML.

function applyDatePicker(inputName) {
	var date_input=$("#"+inputName);
	var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
	date_input.datepicker({
		format: "dd/M/yyyy",
		autoclose: true,
		todayHighlight: true
	})
}

/* config options

Parameter					Default Values
********************************************
autoclose					FALSE
assumeNearbyYear			FALSE
beforeShowDay
beforeShowMonth
beforeShowYear
beforeShowDecade
beforeShowCentury
calendarWeeks				FALSE
clearBtn					FALSE
container					‘body’
datesDisabled				[]
daysOfWeekDisabled		[]
daysOfWeekHighlighted	[]
defaultViewDate			today
disableTouchKeyboard		FALSE
enableOnReadonly			TRUE
endDate					Infinity
forceParse					TRUE
format						‘mm/dd/yyyy’
immediateUpdates			FALSE
inputs
keepEmptyValues			FALSE
keyboardNavigation		TRUE
language					‘en’
maxViewMode				4 ‘centuries’
minViewMode				0 ‘days’
multidate					FALSE
multidateSeparator			‘,’
orientation					‘auto’
showOnFocus				TRUE
startDate					-Infinity
startView					0 ‘days’ (current month)
templates
title							‘’
todayBtn					FALSE
todayHighlight				TRUE
toggleActive				FALSE
weekStart					0 (Sunday)
zIndexOffset				10*/