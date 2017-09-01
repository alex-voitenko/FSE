//////////////////////////////////////////////////////////////////////////////////////////
//
// This File contains all the resources related to the Management of Application
//
// - Collaborator Types
// - Collaborators
// - Activities
// - WorkStamp Types
// - WorkStamps
// - ...
//
//////////////////////////////////////////////////////////////////////////////////////////

var appName;
/* 
 * The following Code has been moved to the module RenelcoBMA_TimeClock_system.js
 * 
var collaboratorTypes;
var collaboratorType;
var collaborators;
var collaborator;
*/
var activities;
var activity;

var customers;
var customer;

var sites;
var site;

var collaborator_workorders;

var workorders;
var workorder;

var tasks;
var task;

var addresses;
var siteAddress;
var customerAddress;

var workstampTypes;
var workstampType;
var workstamps;
var workstamp;

var timeClock;
var timeClockDisplay;

var activityStartTime;
var activityEndTime;

var taskStartTime;
var taskEndTime;


function initBusiness(name) {
if(DEBUG) alert('initBusiness(' + appName + ')');

	initTimeClock();
	
	initCollaboratorTypes();
	
	initWorkStampTypes();
	
	if(WORKFLOW_ENABLED) {
		initIntum();
	}
	
	initTasks();
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// Activity & Activity Collection
//////////////////////////////////////////////////
function initActivity(id) {
if(DEBUG) alert('initActivity(' + id + ')');
	activity = new Activity();
	activity.assignEvent(appName);
	activity.select(id);
}

function onActivity(event) {
if(DEBUG) alert('onActivity Event received ...');
if(DEBUG) activity.show();
	startActivity();
}

function setActivity(id) {
if(DEBUG) alert('setActivity(' + id + ')');
	
	activity = activities.itemById(id);
}


function initActivities(collaborator_id) {
if(DEBUG) alert('initActivities');
	
	activities = new ActivityCollection();
	activities.assignEvent(appName);
	activities.load(collaborator_id);
}

function setActivitiesList() {
if(DEBUG) alert('Executing setActivitiesList()');

		$('#' + appName + '-' + 'hidden-select-cboActivities').empty();
		
		$('#' + appName + '-' + 'hidden-select-cboActivities').append("<option value='-1' label='None'>None</option>"); 

		for(var idx = 0; idx < activities.count; idx++) {
			$('#' + appName + '-' + 'hidden-select-cboActivities').append("<option value='"+activities.item(idx).id+"' label='" + activities.item(idx).name + "'>"+activities.item(idx).name+"</option>"); 
		}
		phoneui.preprocessDOM(phoneui.getCurrentPageId());
		phoneui.forceLayout();
	}

function setDayTasksSummaryActivitiesList() {
if(DEBUG) alert('Executing setDayTasksSummaryActivitiesList()');

		$('#' + appName + '-' + 'hidden-select-cboDayTasksSummaryActivities').empty();
		
		$('#' + appName + '-' + 'hidden-select-cboDayTasksSummaryActivities').append("<option value='-1' label='None'>None</option>"); 

		for(var idx = 0; idx < activities.count; idx++) {
			$('#' + appName + '-' + 'hidden-select-cboDayTasksSummaryActivities').append("<option value='"+activities.item(idx).id+"' label='" + activities.item(idx).name + "'>"+activities.item(idx).name+"</option>"); 
		}
		phoneui.preprocessDOM(phoneui.getCurrentPageId());
		phoneui.forceLayout();
	}

function resetActivitiesList(){
if(DEBUG) alert('resetActivitiesList()');
	$('select[name="cboActivities"] option:first').attr('selected','selected');
	phoneui.preprocessDOM(phoneui.getCurrentPageId());
	phoneui.forceLayout();
}

function onActivityCollection(event) {
if(DEBUG) alert('Event: onActivityCollection received ...');
	setActivitiesList();
	setDayTasksSummaryActivitiesList();
	startWorkingDay();
	gotoWorkOrderActivity(phoneui.transitions.slideLeft);
	
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Customers & Customer Collection 
//////////////////////////////////////////////////
function setCustomer(id) {
if(DEBUG)alert('setCustomer(' + id + ')');
	
	customer = new Customer();
	customer.assignEvent(appName);
	customer.select(id);
}

function onCustomer(event) {
if(DEBUG) alert('onCustomer Event received ...');
if(DEBUG) customer.show();
	setWorkOrderInfo();
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Sites & Site Collection
//////////////////////////////////////////////////
function setSite(id) {
if(DEBUG) alert('setSite');
		
	site = new Site();
	site.assignEvent(appName);
	site.select(id);
}

function onSite(event) {
if(DEBUG) alert('onSite Event received ...');
if(DEBUG) site.show();
	setSiteAddress(site.address_id);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Addresses & Addresses Collection
//////////////////////////////////////////////////
function setSiteAddress(id) {
if(DEBUG) alert('setSiteAddress');
	
	siteAddress = new Address();
	siteAddress.assignEvent(appName);
	siteAddress.select(id);
}

function onAddress(event) {
if(DEBUG) alert('onAddress Event received ...');
if(DEBUG) siteAddress.show();
	setCustomer(site.customer_id);
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// WorkOrder & WorkOrders Collection
//////////////////////////////////////////////////
function setWorkOrder(id) {
if(DEBUG) alert('setWorkOrder');
	
	workorder = new WorkOrder();
	workorder.assignEvent(appName);
	workorder.select(id);
}

function onWorkOrder(event) {
if(DEBUG) alert('onWorkOrder Event received ...');
if(DEBUG) workorder.show();
	if(currentPage!='pageDayTasksSummary') {
		setSite(workorder.site_id);
		initWorkOrderMaterials(workorder.id);
		startWorkOrder();
	}
}

function setWorkOrderInfo() {
if(DEBUG) alert('setWorkOrderInfo');
var pos = new google.maps.LatLng(siteAddress.latitude,siteAddress.longitude);
	// We don't want WorkOrder Information when browsing Day Task Summary
	$('#' + appName + '-' + 'txtWorkOrderSiteInfoCustomer').text(customer.name);
	$('#' + appName + '-' + 'txtWorkOrderSiteInfoName').text(site.name);
	$('#' + appName + '-' + 'txtWorkOrderSiteInfoAddressStreet').text(siteAddress.street);
	$('#' + appName + '-' + 'txtWorkOrderSiteInfoAddressCity').text(siteAddress.zip + '   ' + siteAddress.city);
	$('#' + appName + '-' + 'txtWorkOrderSiteInfoAddressCountry').text(siteAddress.state + ' - ' + siteAddress.country);
	googleMap.setAddressLocation(siteAddress.street + ',' + siteAddress.zip + ' ' + siteAddress.city);
	bwGoogleMap.enable();
	phoneui.preprocessDOM(phoneui.getCurrentPageId());
	phoneui.forceLayout();
}

function resetWorkOrderInfo() {
if(DEBUG) alert('resetWorkOrderInfo');
	$('#' + appName + '-' + 'txtWorkOrderInfoCustomer').text('. . .');
	$('#' + appName + '-' + 'txtWorkOrderInfoSiteName').text('. . .');
	$('#' + appName + '-' + 'txtWorkOrderInfoSiteAddressStreet').text('. . .');
	$('#' + appName + '-' + 'txtWorkOrderInfoSiteAddressCity').text('. . .');
	$('#' + appName + '-' + 'txtWorkOrderInfoSiteAddressCountry').text('. . .');
	bwGoogleMap.disable();
	phoneui.preprocessDOM(phoneui.getCurrentPageId());
	phoneui.forceLayout();
}


function initWorkOrders(collaborator_id) {
if(DEBUG) alert('initWorkOrders ');
	collaborator_workorders = new Collaborator_WorkOrdersCollectionEx();
	collaborator_workorders.assignEvent(appName);
	collaborator_workorders.load(collaborator.id);
}

function setWorkOrdersList() {
if(DEBUG) alert('Executing setWorkOrdersList()');

	$('#' + appName + '-' + 'hidden-select-cboWorkOrders').empty();
	
	$('#' + appName + '-' + 'hidden-select-cboWorkOrders').append("<option value=-1' label='None'>None</option>"); 

	for(var idx = 0; idx < collaborator_workorders.count; idx++) {
//		$('#' + appName + '-' + 'hidden-select-cboWorkOrders').append("<option value='" + collaborator_workorders.item(idx).workorder_id + "' label='" + collaborator_workorders.item(idx).site_name + "'>" + collaborator_workorders.item(idx).site_name + "</option>"); 
//		$('#' + appName + '-' + 'hidden-select-cboWorkOrders').append("<option value='" + collaborator_workorders.item(idx).workorder_id + "' label='" + collaborator_workorders.item(idx).description + "'>" + collaborator_workorders.item(idx).description + "</option>"); 
		$('#' + appName + '-' + 'hidden-select-cboWorkOrders').append("<option value='" + collaborator_workorders.item(idx).workorder_id + "' label='" + collaborator_workorders.item(idx).name + "'>" + collaborator_workorders.item(idx).name + "</option>"); 
	}
	phoneui.preprocessDOM(phoneui.getCurrentPageId());
	phoneui.forceLayout();
}


function setDayTasksSummaryWorkOrdersList() {
if(DEBUG) alert('Executing setDayTasksSummaryWorkOrdersList()');

	$('#' + appName + '-' + 'hidden-select-cboDayTasksSummaryWorkOrders').empty();
	
	$('#' + appName + '-' + 'hidden-select-cboDayTasksSummaryWorkOrders').append("<option value=-1' label='None'>None</option>"); 

	for(var idx = 0; idx < collaborator_workorders.count; idx++) {
		$('#' + appName + '-' + 'hidden-select-cboDayTasksSummaryWorkOrders').append("<option value='" + collaborator_workorders.item(idx).workorder_id + "' label='" + collaborator_workorders.item(idx).site_name + "'>" + collaborator_workorders.item(idx).site_name + "</option>"); 
	}
	phoneui.preprocessDOM(phoneui.getCurrentPageId());
	phoneui.forceLayout();
}


function resetWorkOrdersList(){
if(DEBUG) alert('resetWorkOrdersList()');
	$('select[name="cboWorkOrders"] option:first').attr('selected','selected');
	bwGoogleMap.disable();
	phoneui.preprocessDOM(phoneui.getCurrentPageId());
	phoneui.forceLayout();
}

function onCollaborator_WorkOrdersCollectionEx(event) {
if(DEBUG) alert('onCollaborator_WorkOrdersCollectionEx Event received ...');
	setWorkOrdersList();
	setDayTasksSummaryWorkOrdersList();
	initActivities(collaborator.id);
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// Task & Tasks Collection
//////////////////////////////////////////////////
function startTask() {
if(DEBUG) alert('startTask()');

	taskStartTime = timeClock.currentTime;

	task = new Task();
	task.assignEvent(appName);
	task.collaborator_id = collaborator.id;
	task.workorder_id = workorder.id;
	task.activity_id = activity.id;
	task.name = site.name + ' - ' + activity.name + ' / WorkOrder Id: ' + workorder.id;
	task.description = customer.name + ' / ' + site.name + ' - ' + workorder.description;
	task.executed = LocalDateString(new Date()); 	// replacement of ISODateString that causes problem with DST 
	task.duration = 0;
//	task.show();
	task.create();
}

function terminateTask() {
if(DEBUG) alert('terminateTask()');

	taskEndTime = timeClock.currentTime;
	task.duration = taskEndTime - taskStartTime;
	task.update();
}

function onTask(event) {
if(DEBUG) alert('onTask Event received ... ');

	// Check if it's the beginning of a new Task (duration is equal to 0), it's   
	if(task.duration==0) {
		//
		if(WORKFLOW_ENABLED) {
			workStateManager.setState(WorkStateManager.prototype.WORK_STATES.OnTask);
		}
		currentGPSLocation = deviceGPS.getCurrentPosition();
		if(currentGPSLocation.coords==undefined) {
			workstamp = new WorkStamp(-1, collaborator.id, workorder.id, activity.id, task.id, workstampTypes.itemByName('Start Task').id, taskStartTime, -1, -1);
		}
		else {
			workstamp = new WorkStamp(-1, collaborator.id, workorder.id, activity.id, task.id, workstampTypes.itemByName('Start Task').id, taskStartTime, currentGPSLocation.coords.latitude, currentGPSLocation.coords.longitude);
		}
		workstamp.create();
	}
	// It's the end of the Task (duration has been set), 
	else {
		if(WORKFLOW_ENABLED) {
			workStateManager.setState(WorkStateManager.prototype.WORK_STATES.OnActivity);
		}
		currentGPSLocation = deviceGPS.getCurrentPosition();
		if(currentGPSLocation.coords==undefined) {
			workstamp = new WorkStamp(-1, collaborator.id, workorder.id, activity.id, task.id, workstampTypes.itemByName('End Task').id, taskEndTime, -1, -1);
		}
		else {
			workstamp = new WorkStamp(-1, collaborator.id, workorder.id, activity.id, task.id, workstampTypes.itemByName('End Task').id, taskEndTime, currentGPSLocation.coords.latitude, currentGPSLocation.coords.longitude);
		}
		workstamp.create();
		
		// If we are not running a WorkFlow, we terminate the Activity as well
		if(!WORKFLOW_ENABLED) {
			activityEndTime = timeClock.currentTime;
			currentGPSLocation = deviceGPS.getCurrentPosition();
			if(currentGPSLocation.coords==undefined) {
				workstamp = new WorkStamp(-1, collaborator.id, workorder.id, activity.id, -1, workstampTypes.itemByName('End Activity').id, activityEndTime, -1, -1);
			}
			else {
				workstamp = new WorkStamp(-1, collaborator.id, workorder.id, activity.id, -1, workstampTypes.itemByName('End Activity').id, activityEndTime, currentGPSLocation.coords.latitude, currentGPSLocation.coords.longitude);
			}
			workstamp.create();
		}	
	}
}

function initTasks() {
if(DEBUG) alert('initTasks()');
	tasks = new TaskCollection();
	tasks.assignEvent(appName);
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// WorkStampTypes Collection
//////////////////////////////////////////////////
function initWorkStampTypes() {
if(DEBUG) alert('initWorkStampTypes');
	workstampTypes = new WorkStampTypeCollection();
	workstampTypes.assignEvent(appName);
//	if(workstampTypes.isStored()) {
//		workstampTypes.restore();
//	}
//	else {
		workstampTypes.load();
//	}
}

function onWorkStampTypeCollection(event) {
if(DEBUG) alert('Event: onWorkStampTypeCollection received ...');
//	alert('WorkStamp Types count: ' + event.detail.count);
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// TimeClock                                    
//////////////////////////////////////////////////
function initTimeClock() {
if(DEBUG) alert('initTimeClock()');
	setTimeClockDisplay();
	setTimeClock();
	startTimeClock();
}

function setTimeClock() {
if(DEBUG) alert('setTimeClock()');
	timeClock = new TimeClock();
	timeClock.assignEvent(timeClockDisplay);
//	if(timeClock.isStored()==true) {
//		timeClock.restore();
//	}
//	else {
//		alert('TimeClock currently not Running ...');
//	}
}

function  setTimeClockDisplay() {
if(DEBUG) alert('setTimeClockDisplay()');
	timeClockDisplay = new TimerDisplay(CLOCK_6DIGITS, DIGIT_COLOR_ORANGE);
	timeClockDisplay.attachUI(1, appName + '-' + 'imgDigitTimeClockSecondLow');
	timeClockDisplay.attachUI(2, appName + '-' + 'imgDigitTimeClockSecondHigh');
	timeClockDisplay.attachUI(3, appName + '-' + 'imgDigitTimeClockMinuteLow');
	timeClockDisplay.attachUI(4, appName + '-' + 'imgDigitTimeClockMinuteHigh');
	timeClockDisplay.attachUI(5, appName + '-' + 'imgDigitTimeClockHourLow');
	timeClockDisplay.attachUI(6, appName + '-' + 'imgDigitTimeClockHourHigh');
	timeClockDisplay.attachUI(0, appName + '-' + 'imgDigitTimeClockPoints1');
	timeClockDisplay.attachUI(-1,appName + '-' + 'imgDigitTimeClockPoints2');
}

function startTimeClock() {
if(DEBUG) alert('startTimeClock()');
//	if(timeClock.isIdle() || timeClock.isStopped()) {
//		alert("Let's Rock ...");
//		timeClock.start();
//		timeClock.store();
//	}
//	else {
//		alert("Let's Roll ...");
		timeClock.start();
//	}
}

function stopTimeClock() {
if(DEBUG) alert('stopTimeClock()');
//	if(timeClock.isRunning()) {
//		timeClock.remove();
		timeClock.stop();
//	}
}

function resetTimeClock() {
if(DEBUG) alert('resetTimeClock()');
//	if(timeClock.isRunning()) {
//		alert('Stop the TimeClock prior to Reset it ...');
//	}
//	else {
		timeClock.reset();
		refreshUI();
//	}
}

function showTimeClock(visible) {
if(DEBUG) alert('showTimeClock(' + visible + ')...');
	if(visible==false) {
		$('#' + appName + '-' + 'panelTimeClock').css('visibility', 'hidden');
	}
	else {
		$('#' + appName + '-' + 'panelTimeClock').css('visibility', 'visible');
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
