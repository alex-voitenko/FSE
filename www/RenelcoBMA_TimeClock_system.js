//////////////////////////////////////////////////////////////////////////////////////////
//
// This File contains all the resources related to the Management of the Device
//
// - Device Info
// - Network Info
// - Device Camera
// - Device GPS
// - ...
// - Collaborator Management has been added to allow Login at App StartUp
//
//////////////////////////////////////////////////////////////////////////////////////////

var fileServerURL;
var currentGPSLocation;

var deviceInfo=null;
var networkInfo=null;
var appInfo = null;
var appBackupMgr = null;


var deviceCamera=null;
var deviceGPS=null;

var googleMap=null;

var language = null;
var curLanguage = 'ENGLISH';

//var fileUploader;

var collaboratorTypes;
var collaboratorType;
var collaborators;
var collaborator;



function initSystem() {
	
	initDeviceInfo();			// Retrieve Device & Network Info 
	
	initAppInfo();				// Retrieve App. Info
	initAppBackupMgr();			// Initialize Application Backup Manager 
	
	if(!deviceInfo.isNull()) {
		initGPS();
		if(networkInfo.isConnected()==true) {
			initGMap();
		}
		initCamera();
		initCollaborator();
		return true;
	}
	else {
		alert('Could not retrieve DeviceInfo - Initialization failed, Exiting ...');
		return false;
	}
}

//////////////////////////////////////////////////
// Application Info                       
//////////////////////////////////////////////////
function initAppInfo() {
    appInfo = new AppInfo();
    appInfo.assignEvent(appName);	// Event-Driven Method not used, using polling	
    appInfo.load();
}

// AppInfo Event are not used in this case
function onAppInfo(event) {
if(DEBUG) alert('AppInfo Event received ...');
	
	// Set current App. Informations
	appId = appInfo.applicationId;
	uriDbFile = appInfo.appBaseDirectory + '/databases';
	uriDocument = 'file:///storage/emulated/0/Android/data/'  + appId + '/cache';
}


//////////////////////////////////////////////////
// Application Backup Manager
//////////////////////////////////////////////////
function initAppBackupMgr() {
	appBackupMgr  = new ApplicationBackupManager();
}

// ApplicationBackupManager Event are not used in this case
function onApplicationBackupManager(event) {
if(DEBUG) console.log('ApplicationBackupManager Event received ...');

}


//////////////////////////////////////////////////
// Device & Network Info                       
//////////////////////////////////////////////////
function checkDevice() {
	deviceInfo = new DeviceInfo();
//	deviceInfo.show();	// Should be commented before App Building
}

function checkNetwork() {
	networkInfo = new NetworkInfo();
//	networkInfo.show();
}

function initDeviceInfo() {
if(DEBUG) alert('initDeviceInfo()');
/*
 * The following line has been commented and moved to RenelcoBMA_TimeClock_custom.js. 
 * This must be executed first in order to determine the OS Version hence the JS Event Model
 * 
 */
//	checkDevice();

	checkNetwork();
}


//////////////////////////////////////////////////
// Device Camera                               
//////////////////////////////////////////////////
function initCamera() {
if(DEBUG) alert('initCamera()');
	deviceCamera = new DeviceCamera();
	deviceCamera.assignEvent(appName);
}

function captureImage() {
if(DEBUG) alert('captureImage()');
	deviceCamera.captureImage();
}

function loadImage() {
if(DEBUG) alert('loadImage()');
	deviceCamera.getImage();
}


//////////////////////////////////////////////////
// Device GPS                                   
//////////////////////////////////////////////////
function initGPS() {
if(DEBUG) alert('initGPS()' + appName);
	deviceGPS = new GPSTracker();
//	currentGPSLocation = deviceGPS.getCurrentPosition();
	deviceGPS.assignEvent(appName);
	deviceGPS.startTracking();
}

function onGPSTracker(event) {
if(DEBUG) alert('onGPSPosition()');
//	$('#m1-MapTest-txtLatitude').val(parseFloat(event.detail.position.coords.latitude).toFixed(6));
//	$('#m1-MapTest-txtLongitude').val(parseFloat(event.detail.position.coords.longitude).toFixed(6));
//	$('#m1-MapTest-txtAltitude').val(parseInt(event.detail.position.coords.altitude));
//	$('#m1-MapTest-txtSpeed').val(parseInt(event.detail.position.coords.speed));
//	$('#m1-MapTest-txtHeading').val(parseInt(event.detail.position.coords.heading));
	currentGPSLocation = event.detail.position;
	if(googleMap!=null) {
		googleMap.setCurrentLocation(currentGPSLocation);
	}
}


//////////////////////////////////////////////////
// GMap Management
//////////////////////////////////////////////////

function initGMap() {
if(DEBUG) alert('Enter initGMap()');
	googleMap = new GMapLight(appName + '-' + 'map1', GMapLight.prototype.RENELMAP_TYPE.TRACKING);
	googleMap.setCurrentLocation(deviceGPS.getCurrentPosition());
}


//////////////////////////////////////////////////
// Languages & Translation Management
//////////////////////////////////////////////////

function setLanguages(lang) {
if(DEBUG) alert('setLanguages()');

	language = new Language();
	language.assignEvent(appName);
	language.load(lang);
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// CollaboratorTypes & Collaborator Management
//////////////////////////////////////////////////
function initCollaboratorTypes() {
if(DEBUG) alert('initCollaboratorTypes');
	
	collaboratorTypes = new CollaboratorTypeCollection();
	collaboratorTypes.assignEvent(appName);
//	if(collaboratorTypes.isStored()) {
//		collaboratorTypes.restore();
//	}
//	else {
		collaboratorTypes.load();
//	}
}

function onCollaboratorTypeCollection(event) {
if(DEBUG) alert('Event: onCollaboratorTypeCollection received ...');
//	collaboratorTypes.store();
}


function initCollaborator() {
if(DEBUG) alert('initCollaborator');

	collaborator = new Collaborator();
	collaborator.assignEvent(appName);
}

function setCollaborator() {
console.log('setCollaborator()');
	initWorkOrders(collaborator.id);
}

/*
function login(email, password) {
if(DEBUG) console.log('login(' + email + ', ********)');

	Beep();
	
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'login(' + email + ', ********)');
	
	phoneui.showActivityDialog('Authenticating ...')
	localStorage.setItem('Username', email);
	collaborator.login(email, password);
}
*/
/* 
 *  function onCollaborator(event)
 *  This Event Handler is located in the main Module <AppName>_custom.js
 */



////////////////////////////////////////////////////////////////////////////////////////////////////
