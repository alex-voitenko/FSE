/**
 * Notification that the UI is about to transition to a new screen.
 * Perform custom prescreen-transition logic here.
 * @param {String} currentScreenId 
 * @param {String} targetScreenId 
 * @returns {boolean} true to continue transition; false to halt transition
 */

var fuckTmp;	// For my Exclusive use :-< 
var gender;


var appName = 'm1-RenelcoBMA_TimeClock';		// Current Application Name

var appConfigs = null;							// List of available Application Parameter Sets
var appParams = null;							// Current (In use) Application Parameters

var appId = null;								// Application Id (retrieved from Application Package)								

var appNeedRestart = false;

/* 
 * HETZNER Server Definitions
 */
//var hostBaseUrl = 'http://46.4.76.207';

/* 
 * DELTALIS Servers Definitions
 */
//var hostBaseUrl = 'https://5.144.37.152';

var hostBaseUrl = '';							// Current Server Base URL
var customerName = '';							// Current Customer Name	
var LOCAL_DB=true;								// We use Local Database in this Application
var LOGFile = false;							// LOG File is currently disabled (default)
var DEBUG = false;								// DEBUG is currently disabled (default)
var AUTOSynchro = false;						// AUTOSynchro is currently disabled, controlled by the App. (default)
												// When true, the App. is only responsible to upload the local DB 

var dbUpload = 'dbSQLite';
var dbDownload = 'dbSQLite';

var urlUploadServer = '';
var urlDataServer = '';							// Server @ Hetzner
var urlPhpServices = '';						// PHP DBSynchro on Server @ Hetzner 

var owncloudBaseDir = '/renelbox/';
var adminBaseDir = '';

var picUploadSubDir = ''; 
var picUploadDir = ''; 

var logUpload = 'deviceLogs';


/*
var urlUploadServer = hostBaseUrl;
var urlDataServer = hostBaseUrl + '/RenelSync/' + customerName;									// Server @ Hetzner
var urlPhpServices = hostBaseUrl + '/RenelSync/' + customerName + '/index.php';					// PHP DBSynchro on Server @ Hetzner 

var dbUpload = 'dbSQLite';
var dbDownload = 'dbSQLite';

var owncloudBaseDir = '/renelbox/';
var picUploadSubDir = customerName + '/media/images'; 
var picUploadDir = owncloudBaseDir + picUploadSubDir + '/'; 

var logUpload = 'deviceLogs';

var urlDataServices = hostBaseUrl + ':9773' + '/services/renelco_bma_' + customerName.toString().toLowerCase();	// WSO2Dss on Serveur @ Hetzner according to the current Customer Name
*/


/* 
 * DELTALIS Definitions
 *
//var hostBaseUrl = 'https://5.144.37.152';
var hostBaseUrl = '';
var urlUploadServer = hostBaseUrl + ':444';
var urlDataServer = hostBaseUrl + ':444' + '/RenelSync/' + customerName;						// Server @ Deltalis
var urlPhpServices = hostBaseUrl + ':444' + '/RenelSync/' + customerName + '/index.php';		// PHP DBSynchro on Server @ Deltalis 

var dbUpload = 'dbSQLite';
var dbDownload = 'dbSQLite';

var owncloudBaseDir = '/renelbox/';
var picUploadSubDir = customerName + '/files/' + customerName + '/media/images'; 
var picUploadDir = owncloudBaseDir + picUploadSubDir + '/';

var logUpload = 'deviceLogs';

var urlDataServices = hostBaseUrl + ':447' + '/services/renelco_bma_' + customerName.toString().toLowerCase();	// WSO2Dss on Serveur @ Hetzner according to the current Customer Name
*/

//var uriDbFile = '/data/data/' + appId + '/databases';							// Now, directly retrieved from AppInfo
var uriDbFile = null;

//var uriDocument = 'file:///storage/sdcard0/Android/data/' + appId + '/cache';	// Now, directly retrieved from AppInfo
var uriDocument = null;

var DBName = 'RenelcoBMA';
var databaseManager;




var WORKFLOW_ENABLED = false;
var ROUTE_AND_DRIVE_ENABLED = false;

var APP_STATES = {Idle: 'Idle', AtWork: 'At Work', OnPause: 'On Pause', EndWork: 'End Work'};
var WORK_STATES = {Idle: 'Idle', OnTheRoad: 'OnTheRoad', OnWorkOrder: 'OnWorkOrder', OnPreActivity: 'OnPreActivity', OnActivity: 'OnActivity', onPause: 'onPause', EndActivity: 'EndActivity', EndWorkOrder: 'EndWorkOrder', Synchronizing: "Synchronizing"};

var log = null;

// Application System Objects
// Implemented in RenelcoBMA_TimeClock_system.js

// Application IS and related Business Objects
// Implemented in RenelcoBMA_TimeClock_business.js
var previousPage;
var currentPage;
var workStateManager;

// GUI Variables
var bwLogin;	
var bwMenu;

// WorkOrderActivity Page ComboBoxes & Buttons
var ewWorkOrders;
var ewActivities;

var bwGoogleMap;


// Pause Page Buttons
var bwStartPause;

// TimeClock Page Buttons
var bwWorkOrderActivitySound;
var bwStartWorkOrder;
var bwStartActivity;
var bwContinueActivity;
var bwPauseActivity;
var bwStopActivity;
var bwWorkflow;		// bwTaskActivity
var bwEndWorkOrder;

// Language Selection Buttons
var lbwLanguageFrench;
var lbwLanguageGerman;
var lbwLanguageItalian;
var lbwLanguageEnglish;
var lbwLanguagePortuguese;

var tbwPageSettings; 

var appStatus = APP_STATES.Idle;
var workStatus = WorkStateManager.prototype.WORK_STATES.Idle;

// List Constants & Variables
var LISTITEM_BACKCOLOR_LIGHT = 'rgba(230,230,230,255)';
var LISTITEM_BACKCOLOR_DARK = 'rgba(200,200,200,255)';
var LISTITEM_BACKCOLOR_ACTIVE = 'rgba(255,128,64,255)';

var MENUITEM_FORECOLOR_ACTIVE = 'rgba(255,255,255,255)';
var MENUITEM_FORECOLOR_INACTIVE = 'rgba(150,150,150,255)';

var previousListItem;
var currentListItem;

////////////////////////////////////////////////////////////////////////////////////////////////////
// System Notifications Handling
//////////////////////////////////////////////////

phoneui.prePageTransition = function(currentScreenId, targetScreenId) {
  // add custom pre-transition code here
  // return false to terminate transition
  return true;
}

/**
 * Notification that the UI has transitioned to a new screen.
 * 
 * @param {String} newScreenId 
 */
phoneui.postPageTransition = function(newScreenId) {
  
}

/**
 * Notification that the page's HTML/CSS/JS is about to be loaded.
 * Perform custom logic here, f.e. you can cancel request to the server.
 * @param {String} targetScreenId 
 * @returns {boolean} true to continue loading; false to halt loading
 */
phoneui.prePageLoad = function(targetScreenId) {
  // add custom pre-load code here
  // return false to terminate page loading, this cancels transition to page as well
  return true;
}

/**
 * Notification that device orientation has changed. 
 * 
 * @param {String} newOrientation 
 */
phoneui.postOrientationChange = function(newOrientation) {
  
}

/**
 * Called when document is loaded.
 */
phoneui.documentReadyHandler = function() {
	if (phoneui.cordovaAvailable()) { 
		// Running on device; wait for device API libraries to load
		$('#' + appName + '-' + 'listMenu').css('visibility', 'hidden');
		$('#' + appName + '-' + 'listMenu').css('left', '-200px');
	    document.addEventListener("deviceready", onDeviceReady, false);
	} else { 
		//running in browser, give UI 1/2 sec to init
		setTimeout(function() {
			$('#' + appName + '-' + 'listMenu').css('visibility', 'hidden');
			$('#' + appName + '-' + 'listMenu').css('left', '-200px');
			globalInit();
		}, 
		500);
	}
}

function onDeviceReady() {
if(DEBUG) alert('onDeviceReady()');

	// Add Buttons Event Handlers
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);
	document.addEventListener("backbutton", onBackKeyDown, false);
	document.addEventListener("menubutton", onMenuKeyDown, false);
	document.addEventListener("searchbutton", onSearchKeyDown, false);
	
	// Add Keyboard Event Handlers
//	document.addEventListener("showkeyboard", onShowKeyboard, false);
//	document.addEventListener("hidekeyboard", onHideKeyboard, false);
	window.addEventListener('native.keyboardshow', keyboardShowHandler);
	window.addEventListener('native.keyboardhide', keyboardHideHandler);
	
	// Add Network Event Handlers
	document.addEventListener("online", onOnline, false);
	document.addEventListener("offline", onOffline, false);
	
	// Initialize Application Setup
	checkDevice();		// We must do this first in order to retrieve OS Version hence the JS Event Model
	
	initAppConfigs();	// This can be executed only once we have retrieved the Device Info
}

//
// System Notifications Handling
//
function onPause() {
if(DEBUG) console.log('onPause()');
//	timeClock.store();
//	collaboratorTypes.store();
}

function onResume() {
if(DEBUG) console.log('onResume()');
//	timeClock.restore();
//	collaboratorTypes.restore();
}

function onBackKeyDown() {
if(DEBUG) console.log('onBackKeyDown()');	
	goBack();
}

function onMenuKeyDown() {
if(DEBUG) console.log('onMenuKeyDown()');	
}

function onSearchKeyDown() {
if(DEBUG) console.log('onSearchKeyDown()');	
}

function keyboardShowHandler(e){
var elf = $("*:focus");

	if(currentPage=='pageLogin') {
		bwLogin.disable();
		bwLogin.hide();
		$('#' + appName + '-' + 'panelMainLogin').hide().show(0);
		phoneui.preprocessDOM();
		phoneui.forceLayout(appName + '-' + 'panelMainLogin');
	}
	if(currentPage=='pageSettings') {
		tbwPageSettings.hide();	
	}
	if(WORKFLOW_ENABLED) {
		intumKeyboardShow();
	}
}	

function keyboardHideHandler(e){
var elf = $("*:focus");

	if(currentPage=='pageLogin') {
		bwLogin.enable();
		bwLogin.show();
		elf.blur();
		$('#' + appName + '-' + 'panelMainLogin').hide().show(0);
		phoneui.preprocessDOM();
		phoneui.forceLayout(appName);
	}
	if(currentPage=='pageSettings') {
		setTimeout(function() {
			tbwPageSettings.show();	
		}, 5);
	}
	if(WORKFLOW_ENABLED) {
		intumKeyboardHide();
	}
}	


function onOnline() {
//	console.log('onLine');
	networkInfo.refresh();
}


function onOffline() {
//	console.log('offLine');
	networkInfo.refresh();
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// System Initialization
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////
// Application Setup                       
//////////////////////////////////////////////////
function initAppConfigs() {
console.log('initAppConfigs()');

	appConfigs = new AppConfigCollection();
	appConfigs.assignEvent(appName);
	appConfigs.load();
}

function onAppConfigCollection(event) {
console.log('onAppConfigCollection Event received...');

	setAppConfigsList();
	
	globalInit();
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// AppConfig
//////////////////////////////////////////////////
function onAppConfig(event) {
console.log('onAppConfig Event received...');

	if(appParams.isDefined()==true) {
		// Add App Params Setup according to values in AppConfig
		setAppParams();
	}
	else {
		alert(language.translate('App. Parameters could not be set, using Dev as default.'));
		setAppDefaultParams();
	}
	if(currentPage=="pageSettings") {
		if(workStateManager.state==WorkStateManager.prototype.WORK_STATES.Idle) {
			initLanguages();
			initCollaborator();
			gotoLogin(phoneui.transitions.slideRight);
		}
		if(workStateManager.state==WorkStateManager.prototype.WORK_STATES.StartWorkingDay) {
			gotoWorkOrderActivity(phoneui.transitions.slideLeft);
		}
	}
}

function setAppParams() {
console.log('setAppParams()');

	hostBaseUrl = appParams.hostBaseUrl;
	customerName = appParams.customerName;
	
	urlUploadServer = hostBaseUrl + ((appParams.basePort.trim().length==0) ? '' : ':' + appParams.basePort);
	urlDataServer = hostBaseUrl + ((appParams.basePort.trim().length==0) ? '' : ':' + appParams.basePort) + '/RenelSync/' + customerName;
	urlPhpServices = hostBaseUrl + ((appParams.basePort.trim().length==0) ? '' : ':' + appParams.basePort) + '/RenelSync/' + customerName + '/index.php';

	dbUploadDir = 'dbSQLite';
	dbDownloadDir = 'dbSQLite';

	
	// Server @ Hetzner
	if((appParams.hostId==1) || (appParams.hostId==2)) {
		owncloudBaseDir = '/renelbox/';
		picUploadSubDir = customerName + '/media/images'; 
		picUploadDir = owncloudBaseDir + picUploadSubDir + '/'; 
	}
	// Server @ Deltalis
	else {
		owncloudBaseDir = '/renelbox/';
		picUploadSubDir = customerName + '/files/' + customerName + '/media/images'; 
		picUploadDir = owncloudBaseDir + picUploadSubDir + '/'; 
	}

	urlDataServices = hostBaseUrl + ':' + appParams.dssPort + '/services/renelco_bma_' + customerName.toString().toLowerCase();	
	
	LOCAL_DB = appParams.LOCAL_DB;
	DEBUG = (appParams.DEBUG==='true') ? true : false;
	AUTOSynchro = (appParams.AUTOSynchro==='true') ? true : false;
	LOGFile = (appParams.LOGFile==='true') ? true : false;
	if(LOGFile==true) {
		log = new LogFile();
	}

	bwMenu.disable();
}

function setAppDefaultParams() {
console.log('setAppDefaultParams()');
	hostBaseUrl = 'http://46.4.76.207';
	urlUploadServer = hostBaseUrl;
	
	customerName = 'Dev';
	
	urlDataServer = hostBaseUrl + '/RenelSync/' + customerName;					
	
	urlPhpServices = hostBaseUrl + '/RenelSync/' + customerName + '/index.php';		

	dbUploadDir = 'dbSQLite';
	dbDownloadDir = 'dbSQLite';

	owncloudBaseDir = '/renelbox/';
	picUploadSubDir = customerName + '/media/images'; 
	picUploadDir = owncloudBaseDir + picUploadSubDir + '/'; 
	
	urlDataServices = hostBaseUrl + ':9773' + '/services/renelco_bma_' + customerName.toString().toLowerCase();	// WSO2Dss on Serveur @ Hetzner according to the current Customer Name
	
	LOCAL_DB = true;
	DEBUG = false;
	AUTOSynchro = false;
	LOGFile = false;
}

function setAppConfig() {
console.log('setAppConfigs()');

	if(appParams.isStored()) {
		appNeedRestart = true;
	}
	else {
		appNeedRestart = false;
	}
	appParams.LOCAL_DB = true;
	appParams.LOGFile = ($('#' + appName + '-' + 'tgSettingsLogFile input').attr('checked')=='checked') ? 'true' : 'false';
	appParams.AUTOSynchro = ($('#' + appName + '-' + 'tgSettingsAUTOSynchro input').attr('checked')=='checked') ? 'true' : 'false';
	appParams.DEBUG = ($('#' + appName + '-' + 'tgSettingsDebug input').attr('checked')=='checked') ? 'true' : 'false';
}


function getAppConfig() {
console.log('getAppConfig()');

	if(appParams!=null) {
		$('select[name="cboAppConfigs"]').val(appParams.hostId);
		$('input[name="txtSettingsCustomerName"]').val(appParams.customerName);		
		(appParams.LOGFile==='true') ? $('input[name="tgSettingsLogFile"]').prop('checked', true) : $('input[name="tgSettingsLogFile"]').prop('checked', false);
		(appParams.AUTOSynchro==='true') ? $('input[name="tgSettingsAUTOSynchro"]').prop('checked', true) : $('input[name="tgSettingsAUTOSynchro"]').prop('checked', false);
		(appParams.DEBUG==='true') ? $('input[name="tgSettingsDebug"]').prop('checked', true) : $('input[name="tgSettingsDebug"]').prop('checked', false);
		setTimeout(function() {
			enableLogFile(true);
			enableAUTOSynchroMode(true);
			enableDebugMode(true);
		}, 1000);
	}
}

function enableLogFile(enabled) {
console.log('enableLogFile()');
	
	if(enabled==true) {
		$('#' + appName + '-' + 'tgSettingsLogFile').attr('disabled', 'enabled');
		$('#' + appName + '-' + 'tgSettingsLogFile').css('pointer-events', 'auto');
	}
	else {
		$('#' + appName + '-' + 'tgSettingsLogFile').attr('disabled', 'disabled');
		$('#' + appName + '-' + 'tgSettingsLogFile').css('pointer-events', 'none');
	}
}

function setLogFile() {
console.log('setLogFile()');
	if($('#' + appName + '-' + 'tgSettingsLogFile input').attr('checked')=='checked') {
		console.log('LOG File enabled');
		LOGFile = true;
	}
	else {
		console.log('LOG File disabled');
		LOGFile = false;
	}
}

function enableAUTOSynchroMode(enabled) {
console.log('enableAUTOSynchroMode()');
	if(enabled==true) {
		$('#' + appName + '-' + 'tgSettingsAUTOSynchro').attr('disabled', 'enabled');
		$('#' + appName + '-' + 'tgSettingsAUTOSynchro').css('pointer-events', 'auto');
	}
	else {
		$('#' + appName + '-' + 'tgSettingsAUTOSynchro').attr('disabled', 'disabled');
		$('#' + appName + '-' + 'tgSettingsAUTOSynchro').css('pointer-events', 'none');
	}
}

function setAUTOSynchroMode() {
console.log('setAUTOSynchroMode()');
	if($('#' + appName + '-' + 'tgSettingsAUTOSynchro input').attr('checked')=='checked') {
		console.log('AUTOSynchro (By the Server) enabled');
		AUTOSynchro = true;
	}
	else {
		console.log('AUTOSynchro (By the App) enabled');
		AUTOSynchro = false;
	}
}

function enableDebugMode(enabled) {
console.log('enableDebugMode()');
	if(enabled==true) {
		$('#' + appName + '-' + 'tgSettingsDebug').attr('disabled', 'enabled');
		$('#' + appName + '-' + 'tgSettingsDebug').css('pointer-events', 'auto');
	}
	else {
		$('#' + appName + '-' + 'tgSettingsDebug').attr('disabled', 'disabled');
		$('#' + appName + '-' + 'tgSettingsDebug').css('pointer-events', 'none');
	}
}

function setDebugMode() {
console.log('setDebugMode()');
	if($('#' + appName + '-' + 'tgSettingsDebug input').attr('checked')=='checked') {
		console.log('DEBUG enabled');
		DEBUG = true;
	}
	else {
		console.log('DEBUG disabled');
		DEBUG = false;
	}
}

function saveAppConfig() {
console.log('saveAppConfig()');

	setAppConfig();
	if(appParams.isDefined()) {
		appParams.save();
		if(appNeedRestart==true) {
			appExit();
//			alert(language.translate('The App. must restart for the Parameters to take effect. Exiting.'));
//			setTimeout( function() { navigator.app.exitApp(); });
		}
	}
	else {
		alert((language==null) ? 'Invalid App. Parameters.\n Please enter valid App. Parameters.' : language.translate('Invalid App. Parameters.\n Please enter valid App. Parameters.'));
	}
}

function loadAppConfig() {
console.log('loadAppConfig()');

	appParams = new AppConfig();
	appParams.assignEvent(appName);
	appParams.restore();
}

function cancelAppConfig() {
console.log('cancelSettings()');
	if(appParams.isDefined()) {
		
		appNeedRestart = false;
		
		if(workStateManager.state==WorkStateManager.prototype.WORK_STATES.Idle) {
			gotoLogin(phoneui.transitions.slideRight);
		}
		if(workStateManager.state==WorkStateManager.prototype.WORK_STATES.StartWorkingDay) {
			this. gotoWorkOrderActivity(phoneui.transitions.slideLeft);
		}
		
	}
	else {
		alert(language.translate('No App. Parameters found.\n Please enter valid App. Parameters.'));
	}
	
}

function setAppConfigsList() {
console.log('setAppConfigsList()');

	if((appConfigs!=null) && (appConfigs.count>0)) {
		$('#' + appName + '-' + 'hidden-select-cboAppConfigs').empty();
		$('#' + appName + '-' + 'hidden-select-cboAppConfigs').append("<option value='-1' label='None'>None</option>"); 
		for(var idx = 0; idx < appConfigs.count; idx++) {
			$('#' + appName + '-' + 'hidden-select-cboAppConfigs').append("<option value='" + appConfigs.item(idx).hostId + "' label='" + appConfigs.item(idx).hostName + "'>" + appConfigs.item(idx).hostName + "</option>"); 
		}
	}
	else {
		$('#' + appName + '-' + 'hidden-select-cboAppConfigs').empty();
		$('#' + appName + '-' + 'hidden-select-cboAppConfigs').append("<option value='-1' label='None'>None</option>"); 
	}
}

function selectAppConfig() {
console.log('selectAppConfig()');

	appParams = new AppConfig();
	appParams = appConfigs.itemById($('select[name="cboAppConfigs"]').val());
	appParams.assignEvent(appName);
	getAppConfig();
}

function setAppSettingsLOGFile() {
	
}

function setAppSettingsDebugMode() {
	
}

//////////////////////////////////////////////////
// Application Initialization                       
//////////////////////////////////////////////////
function globalInit() {
if(DEBUG) console.log('globalInit()');

	appStatus = APP_STATES.Idle;
	workStatus = WorkStateManager.prototype.WORK_STATES.Idle;

	

	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'Executing globalInit()');

	if(initSystem()==true) {
		//alert("joket: networkInfo = " + networkInfo.networkState + " Connection.NONE = " + Connection.NONE +  " localeCompare = " + networkInfo.networkState.localeCompare(Connection.NONE));
		var timer;
		phoneui.showActivityDialog('Initializing...');
		if(networkInfo.networkState.localeCompare(Connection.NONE) == 0) {
			var curLanguage = (localStorage.getItem('CurrentLanguage')!=null) ? localStorage.getItem('CurrentLanguage') : 'ENGLISH';
			timer = setInterval(function(){
				
				if(networkInfo.networkState.localeCompare(Connection.NONE)  == 0) {		
					if(curLanguage.localeCompare('English')){
						var result = confirm("No Connection. Please try again");
					}
					else if(curLanguage.localeCompare('French')){
						var result = confirm('Pas de réseau, veuillez vous connecter et réessayer');
					}
					if(result == true){

					}
					else{
						clearInterval(timer);
						//alert('No Connection. Exiting ...');
						navigator.app.exitApp();
					}
				}
				else{
					clearInterval(timer);
					if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'Hello World...');
					initUI();
					initWorkStateManager();
					if(localStorage.getItem('AppConfig')==undefined) {
						
						gotoAppSettings(phoneui.transitions.slideRight);
					}
					else {
						loadAppConfig();
						
						setAppParams();
						initLanguages();
						initCollaborator();
						
					}
					phoneui.hideActivityDialog();
				}
			},5000);
		}
		else{
			if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'Hello World...');
			initUI();
			initWorkStateManager();
			if(localStorage.getItem('AppConfig')==undefined) {
				gotoAppSettings(phoneui.transitions.slideRight);
			}
			else {
				loadAppConfig();
				setAppParams();
				initLanguages();
				initCollaborator();
			}
			phoneui.hideActivityDialog();
		}
	}
	else {
		alert(language.translate('Could not retrieve Device and/or Network Info. Exiting ...'));
		setTimeout( function() { navigator.app.exitApp(); });
	}

	
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// Collaborator
//////////////////////////////////////////////////

/*
 * The remaining of the code related to Collaborator Object 
 * has been moved to the module <AppName>_system.js.
 * Only the following Event Handler has been left here.
 *  
 */


function login(email, password) {
if(DEBUG) console.log('login(' + email + ', ********)');

	Beep();
	bwLogin.disable();
	
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'login(' + email + ', ********)');
	
	phoneui.showActivityDialog('Authenticating ...')
//	localStorage.setItem('Username', email);
	collaborator.login(email, password);
}

function onCollaborator(event) {
if(DEBUG) console.log('Event: onCollaborator received ...');

	//This Event is generated by Login

	phoneui.hideActivityDialog();

	if(event.detail.action=='LOGIN_SUCCEED') {
		console.log('Collaborator LogIn SUCCESS');
		bwMenu.enable();
		if(appId!=null) {
			initDatabaseManager();
		}
		else {
			alert(language.translate('Failed to retrieve Application ID. Exiting ...'));
			setTimeout( function() { navigator.app.exitApp(); });
		}
		
	}
	if(event.detail.action=='LOGIN_FAILED') {
		console.log('Collaborator LogIn ERROR');
		bwLogin.enable();
		
		alert(language.translate('LogIn Failed.\nWrong Username and/or Password.'));
	}

}


////////////////////////////////////////////////////////////////////////////////////////////////////
// Local Database Management
//////////////////////////////////////////////////
function initDatabaseManager() {
if(DEBUG) console.log('Executing initDatabaseManager()');

	if(LOCAL_DB==true) {
//		DBName = DBName + '_' + deviceInfo.uuid + '-' + getDateString(new Date());		// UUID IS NO MORE PART OF DB NAME
		DBName = DBName + '_' + collaborator.id + '-' + getDateString(new Date());
		databaseManager = new DatabaseManager(urlDataServer, urlPhpServices, uriDbFile, DBName);
		databaseManager.assignEvent(appName);
		databaseManager.initialize();
	}
	else {
		setCollaborator();
		initBusiness(appName);
	}
}

function onDatabaseManager(event) {
if(DEBUG) console.log('onDatabaseManager Event received: ' + event.detail.status);
var dbStatus = event.detail.status;
	switch(dbStatus) {
		case "Undefined":
			if(DEBUG) console.log('DB is Undefined ...');
			// Nothing to do here 
			break;
		case "Downloaded":
			if(DEBUG) console.log('DB is Downloaded ...');
			// Nothing to do here 
			break;
		case "Opened":
			if(DEBUG) console.log('DB is Populated and Ready ...');
			if(workStateManager.state==WorkStateManager.prototype.WORK_STATES.Synchronizing) {
				databaseManager.status = DatabaseManager.prototype.DB_STATUS.Synchronizing;
				pictures = new DocumentCollection();
				pictures.assignEvent(appName);
				pictures.load();
//				pictures.upload();
			}
			else {
				setLanguages(curLanguage);	
				
				setCollaborator();
				
				initBusiness(appName);
			}
			break;
		case "Uploaded":
			if(DEBUG) console.log('DB has been uploaded to the Server');
			if(databaseManager.status==DatabaseManager.prototype.DB_STATUS.Synchronizing) {
				console.log('Previous DB has been Uploaded. Now creating the current DB...');
			}
			else {
				if(AUTOSynchro==false) {
					console.log('Current DB is synchronized by the App.');
					databaseManager.status = DatabaseManager.prototype.DB_STATUS.SynchronizingOnExit;
					databaseManager.synchronize(localStorage.getItem("LocalDB"));	// Ask the Server to synchronize the upload
				}
				else {
					console.log('Current DB will be synchronized by Server.');
					workStateManager.setState(WorkStateManager.prototype.WORK_STATES.Idle);
					localStorage.setItem("LocalDB", ''); 
					setTimeout( function() { navigator.app.exitApp(); });			// Simply Exit the App. DB will be synchronize later on Server
				}
			}
			break;
		case "Synchronized":
			workStateManager.setState(WorkStateManager.prototype.WORK_STATES.Idle);
			break;
		case "NotSynchronized":
			if(databaseManager.status==DatabaseManager.prototype.DB_STATUS.Synchronizing) {
				console.log('Previous DB is not yet Synchronized. Now opening prebvious DB for Documents Upload...');
				workStateManager.setState(WorkStateManager.prototype.WORK_STATES.Synchronizing);
				databaseManager.open(localStorage.getItem('LocalDB'));
			}
			break;
		case "SynchronizedOnExit":
			workStateManager.setState(WorkStateManager.prototype.WORK_STATES.Idle);
			localStorage.setItem("LocalDB", ''); 
			setTimeout( function() { navigator.app.exitApp(); });
			break;
		case "NotSynchronizedOnExit":
			console.log('Current DB may have not been synchronized. Check Data on DB Server.');
			workStateManager.setState(WorkStateManager.prototype.WORK_STATES.Idle);
			localStorage.setItem("LocalDB", ''); 
			setTimeout( function() { navigator.app.exitApp(); });
			break;
		default:
			break;
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// WorkState Management
//////////////////////////////////////////////////
function initWorkStateManager() {
if(DEBUG) console.log('Executing initWorkStateManager()');

	workStateManager = new WorkStateManager();
	workStateManager.assignEvent(appName);
	workStateManager.setState(WorkStateManager.prototype.WORK_STATES.Idle);
}

function onWorkStateManager(event) {
if(DEBUG) console.log('WorkStateManager Event received: ' + event.detail.state);
	var workStatus = event.detail.state;
	if(workStatus==WorkStateManager.prototype.WORK_STATES.Idle) {
		if(DEBUG) console.log('Idle');
		ewWorkOrders.enable();
		ewActivities.disable();
		// FRANCO 7-dec-2016: commenté la ligne suivante pour éviter plantage lorsque on met WORKFLOW_ENABLED = false (à vérifier!)
		//ewWorkOrderMaterials.disable();
		
		bwGoogleMap.disable();
		
		bwWorkOrderActivitySound.disable();
		bwStartActivity.show();
		bwStartActivity.disable();
		bwContinueActivity.show();
		bwContinueActivity.disable();
		bwPauseActivity.hide();
		bwPauseActivity.disable();
		bwStopActivity.disable();
		bwEndWorkOrder.disable();

		// FRANCO 7-dec-2016: commenté les lignes suivantes pour éviter plantage lorsque on met WORKFLOW_ENABLED = false (à vérifier!)
		// bwWorkOrderMaterialSound.disable();
		// bwWorkOrderMaterialPhoto.disable();
		
		bwWorkflow.disable();
		// bwWorkflowSound.disable();
		// bwPictureBefore.disable();
		// bwMetree.disable();
		// bwPictureAfter.disable();
		// cwPictureBefore.uncheck();
		// cwMetree.uncheck();
		// cwPictureAfter.uncheck();
		// bwNewTask.disable;
		
		$('#' + appName + '-' + 'txtCurrentStatus').val((language==null) ? 'Select WorkOrder' : language.translate('Select WorkOrder'));
		$('#' + appName + '-' + 'txtCurrentStatus').css('color', '#ff4500');
		if(collaborator.isAdmin()) {
			bwMenu.enable();
		}
		else {
			bwMenu.disable();
		}
		
		enableExitButton(true);
	}
	if(workStatus==WorkStateManager.prototype.WORK_STATES.OnStartWorkingDay) {
		
	}
	if(workStatus==WorkStateManager.prototype.WORK_STATES.OnWorkOrder) {
		if(DEBUG) console.log('OnWorkOrder');
		ewWorkOrders.disable();
		ewActivities.enable();
		
		bwGoogleMap.disable();
		
		bwStartActivity.show();
		bwStartActivity.disable();
		bwContinueActivity.show();
		bwContinueActivity.disable();
		bwPauseActivity.hide();
		bwPauseActivity.disable();
		bwStopActivity.disable();
		
		bwEndWorkOrder.disable();
		
		$('#' + appName + '-' + 'txtCurrentStatus').val(language.translate('Select Activity'));
		$('#' + appName + '-' + 'txtCurrentStatus').css('color', '#ff4500');
		
		bwMenu.disable();
		
		enableExitButton(false);
	}
	if(workStatus==WorkStateManager.prototype.WORK_STATES.OnPreActivity) {
		if(DEBUG) console.log('OnPreActivity');
		ewWorkOrders.disable();
		ewActivities.enable();
		
		if(googleMap!=null) bwGoogleMap.enable();
		
		bwContinueActivity.hide();
		bwContinueActivity.disable();
		bwPauseActivity.show();
		bwPauseActivity.disable();
		bwStopActivity.disable();
		
		if(WORKFLOW_ENABLED) { 
			bwStartActivity.hide();
			bwStartActivity.disable();
			bwWorkflow.enable();
			
			bwWorkflowSound.disable();
			bwPictureBefore.disable();
			bwMetree.disable();
			bwPictureAfter.disable();
			cwPictureBefore.uncheck();
			cwMetree.uncheck();
			cwPictureAfter.uncheck();
			bwNewTask.disable;
		}
		else {
			bwStartActivity.show();
			bwStartActivity.enable();
		}
		
		bwEndWorkOrder.disable();
		
		$('#' + appName + '-' + 'txtCurrentStatus').val(language.translate('At Work'));
		$('#' + appName + '-' + 'txtCurrentStatus').css('color', '#737373');
	}
	if(workStatus==WorkStateManager.prototype.WORK_STATES.OnActivity) {
		if(DEBUG) console.log('OnActivity');
		ewWorkOrders.disable();
		ewActivities.disable();
		
		if(googleMap!=null) bwGoogleMap.enable();

		bwStartActivity.hide();
		bwStartActivity.disable();
		
		bwContinueActivity.hide();
		bwContinueActivity.disable();
		
		bwPauseActivity.show();
		bwPauseActivity.enable();
		
		if(WORKFLOW_ENABLED) { 
			if((workflow!=undefined) && (!workflow.isRunning())) {
				bwStopActivity.enable();
			}
			bwWorkflow.enable();
		}
		else {
			bwStopActivity.enable();
		}
		
		bwEndWorkOrder.disable();
		
		$('#' + appName + '-' + 'txtCurrentStatus').val(language.translate('At Work'));
		$('#' + appName + '-' + 'txtCurrentStatus').css('color', '#737373');
	}
	if(workStatus==WorkStateManager.prototype.WORK_STATES.OnPause) {
		if(DEBUG) console.log('OnPause');
		ewWorkOrders.disable();
		ewActivities.disable();
		
		if(googleMap!=null) bwGoogleMap.enable();
		
		bwStartActivity.hide();
		bwStartActivity.disable();
		
		bwPauseActivity.hide();
		bwPauseActivity.disable();
		
		bwContinueActivity.show();
		bwContinueActivity.enable();
		
		bwStopActivity.disable();
		
		if(WORKFLOW_ENABLED) { 
			bwWorkflow.disable();
		}
		
		bwEndWorkOrder.disable();
		
		$('#' + appName + '-' + 'txtCurrentStatus').val(language.translate('On Pause'));
		$('#' + appName + '-' + 'txtCurrentStatus').css('color', '#737373');
	}
	if(workStatus==WorkStateManager.prototype.WORK_STATES.EndActivity) {
		if(DEBUG) console.log('EndActivity');
		
		ewWorkOrders.disable();
		resetActivitiesList();
		ewActivities.enable();
		
		if(googleMap!=null) bwGoogleMap.enable();
		
		bwContinueActivity.show();
		bwContinueActivity.disable();
		bwPauseActivity.hide();
		bwStopActivity.disable();
		bwWorkflow.disable();
		
		bwEndWorkOrder.enable();
		
		$('#' + appName + '-' + 'txtCurrentStatus').val(language.translate('Select Activity'));
		$('#' + appName + '-' + 'txtCurrentStatus').css('color', '#ff4500');
	}
	if(workStatus==WorkStateManager.prototype.WORK_STATES.EndWorkOrder) {
		if(DEBUG) console.log('EndWorkOrder');
		
		resetWorkOrdersList();
		ewWorkOrders.enable();
		resetActivitiesList();
		ewActivities.disable();
		
		bwGoogleMap.disable();
		
		bwEndWorkOrder.disable();
		
		$('#' + appName + '-' + 'txtCurrentStatus').val(language.translate('Select WorkOrder'));
		$('#' + appName + '-' + 'txtCurrentStatus').css('color', '#ff4500');

		bwMenu.enable();

		enableExitButton(true);
	}
	if(workStatus==WorkStateManager.prototype.WORK_STATES.EndWorkingDay) {
	}
	phoneui.preprocessDOM(phoneui.getCurrentPageId());
	phoneui.forceLayout();
}



////////////////////////////////////////////////////////////////////////////////////////////////////
// GRAPHIC USER INTERFACE 
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
// GUI Global Initialization & Management
//////////////////////////////////////////////////
function initUI() {
//if(DEBUG) console.log('InitUI()');

	// WorkOrders & Activities ComboBoxes
	ewWorkOrders = new ElementUIWrapper(appName + '-' + 'cboWorkOrders');
	ewActivities = new ElementUIWrapper(appName + '-' + 'cboActivities');
	
	// Menu UI Elements
	initMenu();
	bwMenu = new ButtonUIWrapper(appName + '-' + 'imgMenu', 'images/btn_menu_inactive.png', 1);
	bwMenu.disable();
	
	bwLogin = new ButtonUIWrapper(appName + '-' + 'imgLogin', 'images/btn_validation_inactive.png', 1);
	bwLogin.disable();
	
	// Misc UI Elements 
	bwGoogleMap = new ButtonUIWrapper(appName + '-' + 'imgGoogleMap', 'images/btn_googlemaps_inactive.png', 1);
	bwGoogleMap.disable();
	
	// WorkOrder Activity UI Elements 
	bwEndWorkOrder = new ButtonUIWrapper(appName + '-' + 'imgEndWorkOrder', 'images/btn_arret_inactive.png', 1);
	
	bwStartPause = new ButtonUIWrapper(appName + '-' + 'imgStartPause', 'images/PlayerButton_Pause_Inactive_128x40.png', 1);
	bwStartActivity = new ButtonUIWrapper(appName + '-' + 'imgStartActivity', 'images/btn_marche_inactive.png', 1);
	bwContinueActivity = new ButtonUIWrapper(appName + '-' + 'imgContinueActivity', 'images/btn_marche_inactive.png', 1);
	bwPauseActivity = new ButtonUIWrapper(appName + '-' + 'imgPauseActivity', 'images/btn_pause_inactive.png', 1);
	bwStopActivity = new ButtonUIWrapper(appName + '-' + 'imgStopActivity', 'images/btn_arret_inactive.png', 1);
	bwWorkflow = new ButtonUIWrapper(appName + '-' + 'imgWorkflow', 'images/btn_task_inactive.png', 1);
	bwWorkOrderActivitySound = new ButtonUIWrapper(appName + '-' + 'imgWorkOrderActivitySound', 'images/btn_sound_inactive.png', 1);
	
	if(WORKFLOW_ENABLED) {
		initIntumUI();
	}
	
	// Set current (StartUp) Page 
	currentPage = 'pageLogin';
	if(localStorage.getItem('Username')!=null) {
		$('#' + appName + '-' + 'txtLoginUsername').val(localStorage.getItem('Username'));	// Commented 2016-03-04 - Uncommented 2016-03-10
	}

	// Language UI Elements
	initLanguageBar();

	// Toolbars UI Elements
	initToolbars();

	enableExitButton(true);
}

function refreshUI() {
	// TODO - Add code to force UI Refresh (webkit Bug)
	console.log('refreshUI()');
}


function enableExitButton(enable) {
	if(enable==true) {
		$('#' + appName + '-' + 'cusExit').css('background-color', 'rgba(0,0,0,0)');
		$('#' + appName + '-' + 'cusExit').css('background-image', '-webkit-gradient(linear, 50.0% 0.0, 50.0% 100.0%, from(rgb(249,175,100)), to(rgb(255,128,0)), color-stop(0.499,rgb(246,139,32)), color-stop(0.501,rgb(255,128,0)))');
		$('#' + appName + '-' + 'cusExit').attr('disabled', 'enabled');
		$('#' + appName + '-' + 'cusExit').css('pointer-events', 'auto');
	}
	else {
		$('#' + appName + '-' + 'cusExit').css('background-color', 'rgba(0,0,0,0)');
		$('#' + appName + '-' + 'cusExit').css('background-image', '-webkit-gradient(linear, 50.0% 0.0, 50.0% 100.0%, from(rgb(169,180,180)), to(rgb(128,128,128)), color-stop(0.499,rgb(131,148,148)), color-stop(0.501,rgb(128,128,128)))');
		$('#' + appName + '-' + 'cusExit').css('color', 'rgb(255,255,255)');
		$('#' + appName + '-' + 'cusExit').attr('disabled', 'disabled');
		$('#' + appName + '-' + 'cusExit').css('pointer-events', 'none');
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// Menu Initialization & Management
//////////////////////////////////////////////////
function initMenu() {
if(DEBUG) console.log('initMenu()');
	$('#' + appName + '-' + 'imgMenu').css('visibility', 'visible');
	$('#' + appName + '-' + 'listMenu').css('z-index', '100');
	$('#' + appName + '-' + 'listMenu').css('visibility', 'hidden');
	$('#' + appName + '-' + 'listMenu').css('left', '-200px');
	phoneui.preprocessDOM();
	phoneui.forceLayout();
}

function menu() {
if(DEBUG) console.log('menu()');

	Beep();
	
	if($('#' + appName + '-' + 'listMenu').css('left')=='-200px') {
		$('#' + appName + '-' + 'listMenu').css('z-index', '100');
		$('#' + appName + '-' + 'listMenu').css('visibility', 'visible');
		$('#' + appName + '-' + 'listMenu').animate({left: 0}, 500);
	}
	else {
		$('#' + appName + '-' + 'listMenu').animate({left: -200}, 500, function() {
			$('#' + appName + '-' + 'listMenu').css('visibility', 'hidden');
			$('#' + appName + '-' + 'listMenu').css('z-index', '-99');
		});
	}
	phoneui.preprocessDOM();
	phoneui.forceLayout();
} 

function menuSettings() {
	console.log('menuSettings()');
	if((collaborator!=null) && (collaborator.isAdmin()=="true")) {
		getAppConfig();
		gotoAppSettings(phoneui.transitions.slideRight);
	}
	else {
		alert(language.translate('You must have Admin. rights to access this menu.'));
	}
	menu();	
}

function menuContacts() {
	alert(language.translate('Contacts Module not currently installed.'));
	menu();	
}

function menuMaterial() {
	alert(language.translate('Material Module not currently installed.'));
	menu();	
}

function menuSalesOrder() {
	alert('Sales Order Module not currently installed.');
	menu();	
}

function menuAssets() {
	alert('Assets Module not currently installed.');
	menu();	
}

function menuTravelExpenses() {
	alert('Travel Expenses Module not currently installed.');
	menu();	
}

function menuEmployeeDirectory() {
	alert('Employee Directory Module not currently installed.');
	menu();	
}

function menuReporting() {
	gotoDayTasksSummary(phoneui.transitions.slideRight);
	menu();
}

function enableListOfMaterialMenuItem(enable) {
if(DEBUG) console.log('enableListOfMaterialMenuItem(' + enable + ')');
	if(enable==true) {
		$('#' + appName + '-' + 'txtMenuListItem1').css('color', MENUITEM_FORECOLOR_ACTIVE);
		$('#' + appName + '-' + 'lstMenuListItem1').css('pointer-events', 'auto');
	}
	else {
		$('#' + appName + '-' + 'txtMenuListItem1').css('color', MENUITEM_FORECOLOR_INACTIVE);
		$('#' + appName + '-' + 'lstMenuListItem1').css('pointer-events', 'none');
	}
	phoneui.preprocessDOM();
}

function enableDailyWorkingReportMenuItem(enable) {
if(DEBUG) console.log('enableDailyWorkingReportMenuItem(' + enable + ')');
	if(enable==true) {
		$('#' + appName + '-' + 'txtMenuListItem2').css('color', MENUITEM_FORECOLOR_ACTIVE);
		$('#' + appName + '-' + 'lstMenuListItem2').css('pointer-events', 'auto');
	}
	else {
		$('#' + appName + '-' + 'txtMenuListItem2').css('color', MENUITEM_FORECOLOR_INACTIVE);
		$('#' + appName + '-' + 'lstMenuListItem2').css('pointer-events', 'none');
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Languages & Translation Management
//////////////////////////////////////////////////
function initLanguages() {
if(DEBUG) console.log('inittLanguages()');

	curLanguage = (localStorage.getItem('CurrentLanguage')!=null) ? localStorage.getItem('CurrentLanguage') : 'ENGLISH';
	switch(curLanguage) {
		case 'FRENCH':
			setLangFrench();
			break;
		case 'GERMAN':
			setLangGerman();
			break;
		case 'ITALIAN':
			setLangItalian();
			break;
		case 'ENGLISH':
			setLangEnglish();
			break;
		case 'PORTUGUES':
			setLangPortuguese();
			break;
		default:
			setLangEnglish();
			break;
	}
}
function initLanguagesforNoNetwork() {
if(DEBUG) console.log('inittLanguages() for no network');

	curLanguage = (localStorage.getItem('CurrentLanguage')!=null) ? localStorage.getItem('CurrentLanguage') : 'ENGLISH';
	switch(curLanguage) {
		case 'FRENCH':
			setLangFrenchforNoNetwork();
			break;
		case 'GERMAN':
			setLangGermanforNoNetwork();
			break;
		case 'ITALIAN':
			setLangItalianforNoNetwork();
			break;
		case 'ENGLISH':
			setLangEnglishforNoNetwork();
			break;
		case 'PORTUGUES':
			setLangPortugueseforNoNetwork();
			break;
		default:
			setLangEnglishforNoNetwork();
			break;
	}
}
function setLanguages() {
if(DEBUG) console.log('setLanguages()');

//	curLanguage = (localStorage.getItem('CurrentLanguage')!=null) ? localStorage.getItem('CurrentLanguage') : 'ENGLISH';
	language = new Language();	
	language.assignEvent(appName);
	language.load(curLanguage);
}

function onLanguage(event) {
if(DEBUG) console.log('onLanguage Event received...');

	translateApp();
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// LanguageBar Initialization & Management
//////////////////////////////////////////////////
function initLanguageBar() {
if(DEBUG) console.log('initLanguageBar()');
	lbwLanguageFrench = new LangButtonUIWrapper(appName + '-' + 'imgLanguageFrench', 'images/Flags_France_inactive.png', 1, false);
	lbwLanguageFrench.enable();
	lbwLanguageGerman = new LangButtonUIWrapper(appName + '-' + 'imgLanguageGerman', 'images/Flags_Germany_inactive.png', 1, false);
	lbwLanguageGerman.disable();
	lbwLanguageItalian = new LangButtonUIWrapper(appName + '-' + 'imgLanguageItalian', 'images/Flags_Italy_inactive.png', 1, false);
	lbwLanguageItalian.disable();
	lbwLanguageEnglish = new LangButtonUIWrapper(appName + '-' + 'imgLanguageEnglish', 'images/Flags_English_inactive.png', 1, false);
	lbwLanguageEnglish.enable();
	lbwLanguagePortuguese = new LangButtonUIWrapper(appName + '-' + 'imgLanguagePortuguese', 'images/Flags_Portugal_inactive.png', 1, false);
	lbwLanguagePortuguese.disable();
}

function showLanguageBar(show) {
if(DEBUG) console.log('showLanguageBar()');		
	if(show==true) {
		$('#' + appName + '-' + 'tbLanguage').css('visibility', 'visible');
	}
	else {
		$('#' + appName + '-' + 'tbLanguage').css('visibility', 'hidden');
	}
}

function setLangFrench() {
if(DEBUG) console.log('setLangFrench()');	
	window.plugins.infobox.showInfo('French selected.', 0);
	
	curLanguage = 'FRENCH';
	localStorage.setItem('CurrentLanguage', curLanguage);
	lbwLanguageFrench.enable();
	lbwLanguageFrench.select(true);
//	lbwLanguageGerman.enable();
//	lbwLanguageGerman.select(false);
//	lbwLanguageItalian.enable();
//	lbwLanguageItalian.select(false);
	lbwLanguageEnglish.enable();
	lbwLanguageEnglish.select(false);
//	lbwLanguagePortuguese.enable();
//	lbwLanguagePortuguese.select(false);
	
	setLanguages();
}
function setLangFrenchforNoNetwork() {
if(DEBUG) console.log('setLangFrench()');	
	window.plugins.infobox.showInfo('French selected.', 0);
	
	curLanguage = 'FRENCH';
	//localStorage.setItem('CurrentLanguage', curLanguage);
	//lbwLanguageFrench.enable();
	//lbwLanguageFrench.select(true);
//	lbwLanguageGerman.enable();
//	lbwLanguageGerman.select(false);
//	lbwLanguageItalian.enable();
//	lbwLanguageItalian.select(false);
//	lbwLanguageEnglish.enable();
//	lbwLanguageEnglish.select(false);
//	lbwLanguagePortuguese.enable();
//	lbwLanguagePortuguese.select(false);
	
	setLanguages();
}
function setLangGerman() {
if(DEBUG) console.log('setLangGerman()');	
	window.plugins.infobox.showInfo('German not yet available.', 0);
//	curLanguage = 'GERMAN';
//	localStorage.setItem('CurrentLanguage', curLanguage);
//	lbwLanguageFrench.select(false);
//	lbwLanguageGerman.enable();
//	lbwLanguageGerman.select(true);
//	lbwLanguageItalian.enable();
//	lbwLanguageItalian.select(false);
//	lbwLanguageEnglish.enable();
//	lbwLanguageEnglish.select(false);
//	lbwLanguagePortuguese.enable();
//	lbwLanguagePortuguese.select(false);
	
//	setLanguages();
}
function setLangGermanforNoNetwork() {
if(DEBUG) console.log('setLangGerman()');	
	window.plugins.infobox.showInfo('German not yet available.', 0);
//	curLanguage = 'GERMAN';
//	localStorage.setItem('CurrentLanguage', curLanguage);
//	lbwLanguageFrench.select(false);
//	lbwLanguageGerman.enable();
//	lbwLanguageGerman.select(true);
//	lbwLanguageItalian.enable();
//	lbwLanguageItalian.select(false);
//	lbwLanguageEnglish.enable();
//	lbwLanguageEnglish.select(false);
//	lbwLanguagePortuguese.enable();
//	lbwLanguagePortuguese.select(false);
	
//	setLanguages();
}

function setLangItalian() {
if(DEBUG) console.log('setLangItalian()');	
	window.plugins.infobox.showInfo('Italian not yet available.', 0);
//	curLanguage = 'ITALIAN';
//	localStorage.setItem('CurrentLanguage', curLanguage);
//	lbwLanguageFrench.select(false);
//	lbwLanguageGerman.enable();
//	lbwLanguageGerman.select(false);
//	lbwLanguageItalian.enable();
//	lbwLanguageItalian.select(true);
//	lbwLanguageEnglish.enable();
//	lbwLanguageEnglish.select(false);
//	lbwLanguagePortuguese.enable();
//	lbwLanguagePortuguese.select(true);

//	setLanguages();
}
function setLangItalianforNoNetwork() {
if(DEBUG) console.log('setLangItalian()');	
	window.plugins.infobox.showInfo('Italian not yet available.', 0);
//	curLanguage = 'ITALIAN';
//	localStorage.setItem('CurrentLanguage', curLanguage);
//	lbwLanguageFrench.select(false);
//	lbwLanguageGerman.enable();
//	lbwLanguageGerman.select(false);
//	lbwLanguageItalian.enable();
//	lbwLanguageItalian.select(true);
//	lbwLanguageEnglish.enable();
//	lbwLanguageEnglish.select(false);
//	lbwLanguagePortuguese.enable();
//	lbwLanguagePortuguese.select(true);

//	setLanguages();
}

function setLangEnglish() {
if(DEBUG) console.log('setLangEnglish()');	
	window.plugins.infobox.showInfo('English selected.', 0);
	curLanguage = 'ENGLISH';
	localStorage.setItem('CurrentLanguage', curLanguage);
	lbwLanguageFrench.select(false);
	
//	lbwLanguageGerman.enable();
//	lbwLanguageGerman.select(false);
//	lbwLanguageItalian.enable();
//	lbwLanguageItalian.select(false);
	lbwLanguageEnglish.enable();
	lbwLanguageEnglish.select(true);
//	lbwLanguagePortuguese.enable();
//	lbwLanguagePortuguese.select(false);
	
	setLanguages();
}
function setLangEnglishforNoNetwork() {
if(DEBUG) console.log('setLangEnglish()');	
	window.plugins.infobox.showInfo('English selected.', 0);
	curLanguage = 'ENGLISH';
	
	localStorage.setItem('CurrentLanguage', curLanguage);
	
	lbwLanguageFrench.select(false);
	
//	lbwLanguageGerman.enable();
//	lbwLanguageGerman.select(false);
//	lbwLanguageItalian.enable();
//	lbwLanguageItalian.select(false);
	lbwLanguageEnglish.enable();
	lbwLanguageEnglish.select(true);
//	lbwLanguagePortuguese.enable();
//	lbwLanguagePortuguese.select(false);
	
	setLanguages();
}

function setLangPortuguese() {
if(DEBUG) console.log('setLangPortuguese()');	
	window.plugins.infobox.showInfo('Portuguese not yet available.', 0);
//	curLanguage = 'PORTUGUESE';
//	localStorage.setItem('CurrentLanguage', curLanguage);
//	localStorage.setItem('CurrentLanguage', curLanguage);
//	lbwLanguageFrench.select(false);
//	lbwLanguageGerman.enable();
//	lbwLanguageGerman.select(false);
//	lbwLanguageItalian.enable();
//	lbwLanguageItalian.select(false);
//	lbwLanguageEnglish.enable();
//	lbwLanguageEnglish.select(false);
//	lbwLanguagePortuguese.enable();
//	lbwLanguagePortuguese.select(true);
	
//	setLanguages();
}
function setLangPortugueseforNoNetwork() {
if(DEBUG) console.log('setLangPortuguese()');	
	window.plugins.infobox.showInfo('Portuguese not yet available.', 0);
//	curLanguage = 'PORTUGUESE';
//	localStorage.setItem('CurrentLanguage', curLanguage);
//	localStorage.setItem('CurrentLanguage', curLanguage);
//	lbwLanguageFrench.select(false);
//	lbwLanguageGerman.enable();
//	lbwLanguageGerman.select(false);
//	lbwLanguageItalian.enable();
//	lbwLanguageItalian.select(false);
//	lbwLanguageEnglish.enable();
//	lbwLanguageEnglish.select(false);
//	lbwLanguagePortuguese.enable();
//	lbwLanguagePortuguese.select(true);
	
//	setLanguages();
}
function translateApp() {
if(DEBUG) console.log('translateApp()');

	// Translate pageLogin according to selected Language
	$('#' + appName + '-' + 'lblLoginUsername').text(language.translate($('#' + appName + '-' + 'lblLoginUsername').attr('data-lang')));
	$('#' + appName + '-' + 'lblLoginPassword').text(language.translate($('#' + appName + '-' + 'lblLoginPassword').attr('data-lang')));

	// Translate pageWorkOrderActivity according to selected Language
	$('#' + appName + '-' + 'lblWorkOrder').text(language.translate($('#' + appName + '-' + 'lblWorkOrder').attr('data-lang')));
	$('#' + appName + '-' + 'lblActivity').text(language.translate($('#' + appName + '-' + 'lblActivity').attr('data-lang')));
	$('#' + appName + '-' + 'lblDetails').text(language.translate($('#' + appName + '-' + 'lblDetails').attr('data-lang')));
	
	$('#' + appName + '-' + 'lblWorkOrderSiteInfoCustomer').text(language.translate($('#' + appName + '-' + 'lblWorkOrderSiteInfoCustomer').attr('data-lang')));
	$('#' + appName + '-' + 'lblWorkOrderSiteInfoName').text(language.translate($('#' + appName + '-' + 'lblWorkOrderSiteInfoName').attr('data-lang')));
	$('#' + appName + '-' + 'lblWorkOrderSiteInfoAddress').text(language.translate($('#' + appName + '-' + 'lblWorkOrderSiteInfoAddress').attr('data-lang')));
	
	// Translate pageWorkflowIntum according to selected Language
	$('#' + appName + '-' + 'lblWorkflowPictureBefore').text(language.translate($('#' + appName + '-' + 'lblWorkflowPictureBefore').attr('data-lang')));
	$('#' + appName + '-' + 'lblWorkflowMetree').text(language.translate($('#' + appName + '-' + 'lblWorkflowMetree').attr('data-lang')));
	$('#' + appName + '-' + 'lblWorkflowPictureAfter').text(language.translate($('#' + appName + '-' + 'lblWorkflowPictureAfter').attr('data-lang')));
	$('#' + appName + '-' + 'lblTasksList').text(language.translate($('#' + appName + '-' + 'lblTasksList').attr('data-lang')));
	
	// Translate pageMetrees according to selected Language
	$('#' + appName + '-' + 'lblTaskMetreeBatiment').text(language.translate($('#' + appName + '-' + 'lblTaskMetreeBatiment').attr('data-lang')));
	$('#' + appName + '-' + 'lblTaskMetreeEtage').text(language.translate($('#' + appName + '-' + 'lblTaskMetreeEtage').attr('data-lang')));
	$('#' + appName + '-' + 'lblTaskMetreePiece').text(language.translate($('#' + appName + '-' + 'lblTaskMetreePiece').attr('data-lang')));
	$('#' + appName + '-' + 'lblTaskMetreeComment').text(language.translate($('#' + appName + '-' + 'lblTaskMetreeComment').attr('data-lang')));
	
	// Translate pageMetreesObturation according to selected Language
	$('#' + appName + '-' + 'lblTaskMetreeTypeObturation').text(language.translate($('#' + appName + '-' + 'lblTaskMetreeTypeObturation').attr('data-lang')));
	$('#' + appName + '-' + 'lblTaskMetreeLargeurObturation').text(language.translate($('#' + appName + '-' + 'lblTaskMetreeLargeurObturation').attr('data-lang')));
	$('#' + appName + '-' + 'lblTaskMetreeHauteurObturation').text(language.translate($('#' + appName + '-' + 'lblTaskMetreeHauteurObturation').attr('data-lang')));
	$('#' + appName + '-' + 'lblTaskMetreeProfondeur').text(language.translate($('#' + appName + '-' + 'lblTaskMetreeProfondeur').attr('data-lang')));
	
	// Translate pageTaskDetails according to selected Language
	$('#' + appName + '-' + 'lblTaskDetailsTitle').text(language.translate($('#' + appName + '-' + 'lblTaskDetailsTitle').attr('data-lang')));
	
	$('#' + appName + '-' + 'lblTaskDetailsBatiment').text(language.translate($('#' + appName + '-' + 'lblTaskDetailsBatiment').attr('data-lang')));
	$('#' + appName + '-' + 'lblTaskDetailsEtage').text(language.translate($('#' + appName + '-' + 'lblTaskDetailsEtage').attr('data-lang')));
	$('#' + appName + '-' + 'lblTaskDetailsPiece').text(language.translate($('#' + appName + '-' + 'lblTaskDetailsPiece').attr('data-lang')));
	$('#' + appName + '-' + 'lblTaskDetailsComment').text(language.translate($('#' + appName + '-' + 'lblTaskDetailsComment').attr('data-lang')));

	$('#' + appName + '-' + 'lblTaskDetailsTypeObturation').text(language.translate($('#' + appName + '-' + 'lblTaskDetailsTypeObturation').attr('data-lang')));
	$('#' + appName + '-' + 'lblTaskDetailsLargeur').text(language.translate($('#' + appName + '-' + 'lblTaskDetailsLargeur').attr('data-lang')));
	$('#' + appName + '-' + 'lblTaskDetailsHauteur').text(language.translate($('#' + appName + '-' + 'lblTaskDetailsHauteur').attr('data-lang')));
	$('#' + appName + '-' + 'lblTaskDetailsProfondeur').text(language.translate($('#' + appName + '-' + 'lblTaskDetailsProfondeur').attr('data-lang')));

	$('#' + appName + '-' + 'lblTaskDetailsPictureBefore').text(language.translate($('#' + appName + '-' + 'lblTaskDetailsPictureBefore').attr('data-lang')));
	$('#' + appName + '-' + 'lblTaskDetailsPictureAfter').text(language.translate($('#' + appName + '-' + 'lblTaskDetailsPictureAfter').attr('data-lang')));

	// Translate pageWorkOrderMaterials according to selected Language
	$('#' + appName + '-' + 'lblWorkOrderMaterialsList').text(language.translate($('#' + appName + '-' + 'lblWorkOrderMaterialsList').attr('data-lang')));
	
	// Translate pageGoogleMap according to selected Language
	// No Labels to translate
	
	// Translate pagePictureViewer according to selected Language
	// No Labels to translate
	
	// Translate pageDayTasksSummary according to selected Language
	$('#' + appName + '-' + 'lblDayTasksSummaryWorkOrder').text(language.translate($('#' + appName + '-' + 'lblDayTasksSummaryWorkOrder').attr('data-lang')));
	$('#' + appName + '-' + 'lblDayTasksSummaryActivity').text(language.translate($('#' + appName + '-' + 'lblDayTasksSummaryActivity').attr('data-lang')));
	$('#' + appName + '-' + 'lblDayTasksSummaryList').text(language.translate($('#' + appName + '-' + 'lblDayTasksSummaryList').attr('data-lang')));
	
	// Translate pageWorkOrderMaterial according to selected Language
	$('#' + appName + '-' + 'lblWorkOrderMaterialName').text(language.translate($('#' + appName + '-' + 'lblWorkOrderMaterialName').attr('data-lang')));
	$('#' + appName + '-' + 'lblWorkOrderMaterialComment').text(language.translate($('#' + appName + '-' + 'lblWorkOrderMaterialComment').attr('data-lang')));
	$('#' + appName + '-' + 'lblWorkOrderMaterialQuantity').text(language.translate($('#' + appName + '-' + 'lblWorkOrderMaterialQuantity').attr('data-lang')));
	
}


////////////////////////////////////////////////////////////////////////////////////////////////////
//ToolBars Initialization & Management
//////////////////////////////////////////////////
function initToolbars() {
	
	tbwPageSettings = new ToolbarUIWrapper(appName + '-' + 'panelToolBarSettings');
	tbwPageSettings.enable();
	tbwPageSettings.show();
}

function hideToolbars() {
	
	tbwPageSettings.disable();
	tbwPageSettings.hide();
}


////////////////////////////////////////////////////////////////////////////////////////////////////
//Page Navigation
//////////////////////////////////////////////////
function gotoLogin(transition) {
	currentPage = 'pageLogin';
	phoneui.gotoMultiPagePage(appName + '-' + 'multiPage1', 'SET_PAGE', appName + '-' + 'pageLogin', transition);
}

function gotoWorkOrderActivity(transition) {
	currentPage = 'pageWorkOrderActivity';
	
	if((workStateManager.state==WorkStateManager.prototype.WORK_STATES.Idle) || (workStateManager.state==WorkStateManager.prototype.WORK_STATES.StartWorkingDay)) {
		$('#' + appName + '-' + 'txtCurrentStatus').val(language.translate('Select WorkOrder'));
		$('#' + appName + '-' + 'txtCurrentStatus').css('color', '#ff4500');
	}
	phoneui.gotoMultiPagePage(appName + '-' + 'multiPage1', 'SET_PAGE', appName + '-' + 'pageWorkOrderActivity', transition);
	
//	alert('--- ' + document.getElementById('m1-RenelcoBMA_TimeClock-panelDisplayTimeClock').clientWidth);
//	phoneui.preprocessDOM(phoneui.getCurrentPageId());
//	phoneui.forceLayout();
}

function gotoGoogleMap(transition) {
	currentPage = 'pageGoogleMap';
	
	phoneui.gotoMultiPagePage(appName + '-' + 'multiPage1', 'SET_PAGE', appName + '-' + 'pageGoogleMap', transition);
	googleMap.drawRoute();
}

function gotoTimeClock(transition) {
	currentPage = 'pageTimeClock';
	$('#' + appName + '-' + 'txtCurrentStatus').val('Start Of Work');
	if(transition!=null) {
		phoneui.gotoMultiPagePage(appName + '-' + 'multiPage1', 'SET_PAGE', appName + '-' + 'pageTimeClock', transition);
	}
	phoneui.preprocessDOM('#' + appName + '-' + 'panelDisplayTimeClock');

	phoneui.forceLayout();
//	phoneui.preprocessDOM(phoneui.getCurrentPageId());
//	phoneui.forceLayout();
}

function gotoAppSettings(transition) {
	currentPage = 'pageSettings';
	phoneui.preprocessDOM(phoneui.getCurrentPageId());
	phoneui.gotoMultiPagePage(appName + '-' + 'multiPage1', 'SET_PAGE', appName + '-' + 'pageSettings', transition);
}

function goBack() {
//	if(DEBUG) console.log('goBack(' + currentPage + ')');
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'Back Button pressed.');
	if(currentPage=="pageLogin") {
		return;
	}
	if(currentPage=="pageWorkOrderActivity") {
		return;
	}
	if(currentPage=="pageGoogleMap") {
		gotoWorkOrderActivity(phoneui.transitions.slideRight);
		return;
	}
	if(currentPage=="pageSettings") {
		if((appParams.isDefined()==true) && (appParams.isStored()==true)) {
			if(workStateManager.state==WorkStateManager.prototype.WORK_STATES.Idle) {
					gotoLogin(phoneui.transitions.slideRight);
			}
			if(workStateManager.state==WorkStateManager.prototype.WORK_STATES.StartWorkingDay) {
				this. gotoWorkOrderActivity(phoneui.transitions.slideLeft);
			}
		}
	}
	if(WORKFLOW_ENABLED) {
		intumGoBack();
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// Working Day Management
//////////////////////////////////////////////////
function startWorkingDay() {
if(DEBUG) console.log('startWorkingDay');

	appStatus = APP_STATES.AtWork;
	
//	workStateManager.setState(WorkStateManager.prototype.WORK_STATES.Idle);
	workStateManager.setState(WorkStateManager.prototype.WORK_STATES.StartWorkingDay);
	
	$('#' + appName + '-' + 'txtCurrentStatus').val(language.translate('Start Of Work'));
	$('#' + appName + '-' + 'txtCurrentStatus').css('color', '#737373');
	
	currentGPSLocation = deviceGPS.getCurrentPosition();
	if(currentGPSLocation.coords==undefined) {
		workstamp = new WorkStamp(-1, collaborator.id, -1, -1, -1, workstampTypes.itemByName('Start Working Day').id, timeClock.startTime, -1, -1);
	}
	else {
		workstamp = new WorkStamp(-1, collaborator.id, -1, -1, -1, workstampTypes.itemByName('Start Working Day').id, timeClock.startTime, currentGPSLocation.coords.latitude, currentGPSLocation.coords.longitude);
	}
	workstamp.create();
}

function endWorkingDay() {
	if(DEBUG) console.log('endWorkingDay()');

	appStatus = APP_STATES.EndWork;
	
	$('#' + appName + '-' + 'txtCurrentStatus').val(language.translate('End Of Work'));
	$('#' + appName + '-' + 'txtCurrentStatus').css('color', '#737373');
	
	currentGPSLocation = deviceGPS.getCurrentPosition();
	if(currentGPSLocation.coords==undefined) {
		workstamp = new WorkStamp(-1, (collaborator.id==undefined) ? -1 : collaborator.id , -1, -1, -1, workstampTypes.itemByName('End Working Day').id, timeClock.currentTime, 0.000000, 0.000000);
	}
	else {
		workstamp = new WorkStamp(-1, (collaborator.id==undefined) ? -1 : collaborator.id, -1, -1, -1, workstampTypes.itemByName('End Working Day').id, timeClock.currentTime, currentGPSLocation.coords.latitude, currentGPSLocation.coords.longitude);
	}
	workstamp.assignEvent(appName);
	workstamp.create();
	
	bwMenu.enable();
	enableListOfMaterialMenuItem(false);
	enableDailyWorkingReportMenuItem(true);
	
	stopTimeClock();
}

function onTimeClock(event) {
if(DEBUG) console.log('App.onTimeClock() Event received ...');

}


//////////////////////////////////////////////////
// WorkOrder Management
//////////////////////////////////////////////////
function selectWorkOrder() {
if(DEBUG) console.log('selectWorkOrder()');
var workorder_id = $('select[name="cboWorkOrders"]').val();

	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'Select WorkOrder pressed.');
	if(workorder_id>0) {
		setWorkOrder(workorder_id);
	}
	else {
		alert(language.translate('Please, Select a Valid WorkOrder.'));
	}
}

function selectDayTasksSummaryWorkOrder() {
if(DEBUG) console.log('selectDayTasksSummaryWorkOrder()');
var workorder_id = $('select[name="cboDayTasksSummaryWorkOrders"]').val();
	if(workorder_id>0) {
		setWorkOrder(workorder_id);
	}
	else {
		alert(language.translate('Please, Select a Valid WorkOrder.'));
	}
}

function startWorkOrder() {
if(DEBUG) console.log('startWorkOrder()');

	workStatus = WorkStateManager.prototype.WORK_STATES.OnWorkOrder;
	ewActivities.enable();

	workStateManager.setState(WorkStateManager.prototype.WORK_STATES.OnWorkOrder);
	
	currentGPSLocation = deviceGPS.getCurrentPosition();
	if(currentGPSLocation.coords==undefined) {
		workstamp = new WorkStamp(-1, collaborator.id, workorder.id, -1, -1, workstampTypes.itemByName('Start WorkOrder').id, timeClock.currentTime, -1, -1);
	}
	else {
		workstamp = new WorkStamp(-1, collaborator.id, workorder.id, -1, -1, workstampTypes.itemByName('Start WorkOrder').id, timeClock.currentTime, currentGPSLocation.coords.latitude, currentGPSLocation.coords.longitude);
	}
	workstamp.create();
}

function endWorkOrder() {
if(DEBUG) console.log('endWorkOrder()');

	Beep();
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'EndWorkOrder Button pressed.');

	workStatus = WorkStateManager.prototype.WORK_STATES.EndWorkOrder;

	workStateManager.setState(WorkStateManager.prototype.WORK_STATES.EndWorkOrder);

	resetWorkOrderInfo();
	
	currentGPSLocation = deviceGPS.getCurrentPosition();
	if(currentGPSLocation.coords==undefined) {
		workstamp = new WorkStamp(-1, collaborator.id, workorder.id, -1, -1, workstampTypes.itemByName('End WorkOrder').id, timeClock.currentTime, -1, -1);
	}
	else {
		workstamp = new WorkStamp(-1, collaborator.id, workorder.id, -1, -1, workstampTypes.itemByName('End WorkOrder').id, timeClock.currentTime, currentGPSLocation.coords.latitude, currentGPSLocation.coords.longitude);
	}
	workstamp.create();
	
	if(WORKFLOW_ENABLED) {
		gotoWorkOrderMaterials(phoneui.transitions.slideLeft);
	}
	
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// Google Basic Map  Management
//////////////////////////////////////////////////
function showGoogleMap() {
if(DEBUG) console.log('showGoogleMapMap()');

	Beep();
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'ShowGoogleMap Button pressed.');
	gotoGoogleMap(phoneui.transitions.slideLeft);
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// Activity Management
//////////////////////////////////////////////////
function selectActivity() {
if(DEBUG) console.log('selectActivity()');
var activity_id = $('select[name="cboActivities"]').val();

	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'Select Activity pressed.');
	if(activity_id>0) {
		workStatus = WorkStateManager.prototype.WORK_STATES.OnPreActivity;
		workStateManager.setState(WorkStateManager.prototype.WORK_STATES.OnPreActivity);
		initActivity(activity_id);
	}
	else {
		alert(language.translate('Please, Select a Valid Activity.'));
	}
}

function selectDayTasksSummaryActivity() {
if(DEBUG) console.log('selectDayTasksSummaryActivity()');
var activity_id = $('select[name="cboDayTasksSummaryActivities"]').val();

	if(activity_id>0) {
		setActivity(activity_id);
		setTasksList();
	}
	else {
		alert(language.translate('Please, Select a Valid Activity.'));
	}
}

function startActivity() { 
if(DEBUG) console.log('startActivity()');

//	Beep();
	if(!WORKFLOW_ENABLED) {
		if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'StartActivity Button pressed.');
	}
	else {
		if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'WorkFlow Button pressed.');
	}
	activityStartTime = timeClock.currentTime;
	
	workStatus = WorkStateManager.prototype.WORK_STATES.OnActivity;
	workStateManager.setState(WorkStateManager.prototype.WORK_STATES.OnActivity);

	currentGPSLocation = deviceGPS.getCurrentPosition();
	if(currentGPSLocation.coords==undefined) {
		workstamp = new WorkStamp(-1, collaborator.id, workorder.id, activity.id, -1, workstampTypes.itemByName('Start Activity').id, activityStartTime, -1, -1);
	}
	else {
		workstamp = new WorkStamp(-1, collaborator.id, workorder.id, activity.id, -1, workstampTypes.itemByName('Start Activity').id, activityStartTime, currentGPSLocation.coords.latitude, currentGPSLocation.coords.longitude);
	}
	workstamp.create();
	
	if(!WORKFLOW_ENABLED) {
		startTask();
	}
}

function  continueActivity() {
if(DEBUG) console.log('continueActivity()');

	Beep();
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'ContinueActivity Button pressed.');

	appStatus = APP_STATES.AtWork;
	workStatus = WorkStateManager.prototype.WORK_STATES.OnActivity;
	workStateManager.setState(WorkStateManager.prototype.WORK_STATES.OnActivity);
	
	currentGPSLocation = deviceGPS.getCurrentPosition();
	if(currentGPSLocation.coords==undefined) {
		workstamp = new WorkStamp(-1, collaborator.id, workorder.id, activity.id, task.id, workstampTypes.itemByName('End Pause').id, timeClock.currentTime, -1, -1);
	}
	else {
		workstamp = new WorkStamp(-1, collaborator.id, workorder.id, activity.id, task.id, workstampTypes.itemByName('End Pause').id, timeClock.currentTime, currentGPSLocation.coords.latitude, currentGPSLocation.coords.longitude);
	}
	workstamp.create();
	
	gotoTimeClock(null);
}

function endActivity() {
if(DEBUG) console.log('endActivity()');

	Beep();
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'StopActivity Button pressed.');

	appStatus = APP_STATES.AtWork;
	
	if(!WORKFLOW_ENABLED) {
		workStatus = WorkStateManager.prototype.WORK_STATES.EndActivity;
		workStateManager.setState(WorkStateManager.prototype.WORK_STATES.EndActivity);
		terminateTask();
	}
	else {
		if(workStateManager.state==WorkStateManager.prototype.WORK_STATES.OnTask) {
			activityEndTime = timeClock.currentTime;
			currentGPSLocation = deviceGPS.getCurrentPosition();
			if(currentGPSLocation.coords==undefined) {
				workstamp = new WorkStamp(-1, collaborator.id, workorder.id, activity.id, task.id, workstampTypes.itemByName('End Task').id, activityEndTime, -1, -1);
			}
			else {
				workstamp = new WorkStamp(-1, collaborator.id, workorder.id, activity.id, task.id, workstampTypes.itemByName('End Task').id, activityEndTime, currentGPSLocation.coords.latitude, currentGPSLocation.coords.longitude);
			}
			workstamp.create();
		}
		workStatus = WorkStateManager.prototype.WORK_STATES.EndActivity;
		workStateManager.setState(WorkStateManager.prototype.WORK_STATES.EndActivity);
		workflow = null;
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


////////////////////////////////////////////////////////////////////////////////////////////////////
// Pause Management
//////////////////////////////////////////////////
function startPause() {
if(DEBUG) console.log('startPause()');

	Beep();
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'PauseActivity Button pressed.');

	appStatus = APP_STATES.OnPause;
	workStateManager.setState(WorkStateManager.prototype.WORK_STATES.OnPause);
	
	currentGPSLocation = deviceGPS.getCurrentPosition();
	if(currentGPSLocation.coords==undefined) {
		workstamp = new WorkStamp(-1, collaborator.id, workorder.id, activity.id, task.id, workstampTypes.itemByName('Start Pause').id, timeClock.currentTime, -1, -1);
	}
	else {
		workstamp = new WorkStamp(-1, collaborator.id, workorder.id, activity.id, task.id, workstampTypes.itemByName('Start Pause').id, timeClock.currentTime, currentGPSLocation.coords.latitude, currentGPSLocation.coords.longitude);
	}
	workstamp.create();
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// Tasks Management
//////////////////////////////////////////////////
function startTasks() {
if(DEBUG) console.log('startTasks()');

	Beep();

	if((workflow==null) || (workflow==undefined)) {
		initWorkflow();
		startTask();
	}
	if(workStateManager.state==WorkStateManager.prototype.WORK_STATES.OnPreActivity) {
		currentGPSLocation = deviceGPS.getCurrentPosition();
		if(currentGPSLocation.coords==undefined) {
			workstamp = new WorkStamp(-1, collaborator.id, workorder.id, activity.id, -1, workstampTypes.itemByName('Start Activity').id, taskStartTime, -1, -1);
		}
		else {
			workstamp = new WorkStamp(-1, collaborator.id, workorder.id, activity.id, -1, workstampTypes.itemByName('Start Activity').id, taskStartTime, currentGPSLocation.coords.latitude, currentGPSLocation.coords.longitude);
		}
		workstamp.create();
		
		workStatus = WorkStateManager.prototype.WORK_STATES.OnActivity;
		workStateManager.setState(WorkStateManager.prototype.WORK_STATES.OnActivity);
	}
	setTasksList();
	gotoWorkflow(phoneui.transitions.slideLeft);
}

function newTask() {

	Beep();
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'NewTask Button pressed.');

	workflow.reset();
	startTask();
}

function setTasksList() {
if(DEBUG) console.log('setTasksList()');

	tasks.loadByWorkOrderCollaboratorActivity(workorder.id, collaborator.id, activity.id);
}

function onTaskCollection(event) {
if(DEBUG) console.log('onTaskCollection event received ...');
if(DEBUG) console.log('Nb of achieved Taks: ' + JSON.stringify(event.detail));
	if((workStateManager.state==='OnActivity') || (workStateManager.state==='OnTask')) {
		render_WorkFlowTaskslist();
	}
	if(workStateManager.state==='EndWorkOrder') {
		render_DayTasksSummaryTasksList();
	}
}

function render_WorkFlowTaskslist() {
if(DEBUG) console.log('render_WorkFlowTaskslist()');
var list = $('#' + appName + '-' + 'lstExecutedTasks'); //lookup <ul>
var itemCnt = tasks.count;	//lookup number of listItems from home screen; convert to number
var description = '';
var totalDuration = 0;
var info = '';
var cssClassList;
var bkColor;
var bkColorIdx = 0;
	//remove current list items
	list.children('#' + appName + '-' + 'lstExecutedTasksListItem').remove();
	
	$('#' + appName + '-' + 'lstExecutedTasksListItem').css('visibility', 'visible');

	//build list 
	firstItemClass = 'm1-first';
	internalItemClass = ' m1-clickable m1-hyperlink-internal';
	lastItemClass = ' m1-last';
	singleItemClass = 'm1-first m1-last';

//  Last Item displayed first
	for (var idx=itemCnt-1; idx >=0 ; idx--) {
		if(tasks.item(idx).duration>0) {
			//build list css class list
			if(itemCnt===1) {
				cssClassList = singleItemClass;
			}
			else {
				if((idx<itemCnt-1) && (idx>0)) {
					cssClassList = internalItemClass;
				}
				else {
					cssClassList = idx==itemCnt-1 ? firstItemClass : '';
					cssClassList += idx==0 ? lastItemClass : '';
				}
			}
			if(bkColorIdx%2===0) {
				bkColor = LISTITEM_BACKCOLOR_LIGHT; 
			}
			else {
				bkColor = LISTITEM_BACKCOLOR_DARK;
			}
			
			description = sprintf("%-20s", activity.name.substr(0,20));
			totalDuration = totalDuration*1 + tasks.item(idx).duration*1;
			list.append('<li id="' + appName + '-' + 'lstExecutedTasksListItem" class="' + cssClassList + '"' +  
			      	'      data-listitem-index="' + idx + '" style="background-color:' + bkColor + ';" >' + 
			      	'   <div id="' + appName + '-' + 'lstExecutedTasksListItem-inner-div">' + 
			      	'       <div id="' + appName + '-' + 'txtExecutedTasksListItem" class="m1-text" style="width:240px;font-family:monospace;" onClick="activateListItem(); showTask(' + tasks.item(idx).id + ')">' + description + '</div>'+ 
			      	'       <div id="' + appName + '-' + 'txtExecutedTasksDurationListItem" class="m1-text" style="width:65px;font-family:monospace;" onClick="activateListItem(); showTask(' + tasks.item(idx).id + ')">' + getDurationString(tasks.item(idx).duration) + '</div>'+
			      	'   </div>'+
			      	'</li>');
			bkColorIdx++;
		}
	}

	info = sprintf(language.translate("Number") + ": %-5s - " + language.translate("Working Time") + ": %10s", numPad(itemCnt, 3), getDurationString(totalDuration));
	$('#' + appName + '-' + 'txtTasksSummaryInfo').text(info);
	
	//Update panel's content height, set the ht value on the panel's 
	// scroller <div> data-layout-content-height attribute.
	// panelHt = header ht + listItems ht + footer ht
	var panelHt = 30 + itemCnt * 50;
	$('#' + appName + '-' + 'panelTasksList-scroller').attr('data-layout-content-height', panelHt);
	
	previousListItem = null;
	
	phoneui.preprocessDOM(list);
	phoneui.forceLayout();
}

function render_DayTasksSummaryTasksList() {
if(DEBUG) console.log('render_DayTasksSummaryTasksList()');
var list = $('#' + appName + '-' + 'lstDayTasksSummary'); //lookup <ul>
var itemCnt = tasks.count;	//lookup number of listItems from home screen; convert to number 
var description = '';
var totalDuration = 0;
var info = '';
var cssClassList;
var bkColor;
var bkColorIdx = 0;

	//remove current list items
	list.children('#' + appName + '-' + 'lstDayTasksSummaryListItem').remove();
	
	$('#' + appName + '-' + 'lstDayTasksSummaryListItem').css('visibility', 'visible');

	//build list 
	firstItemClass = 'm1-first';
	internalItemClass = ' m1-clickable m1-hyperlink-internal';
	lastItemClass = ' m1-last';
	singleItemClass = 'm1-first m1-last';

//  Last Item displayed first
	for (var idx=itemCnt-1; idx >=0 ; idx--) {
		if(tasks.item(idx).duration>0) {
			//build list css class list
			if(itemCnt===1) {
				cssClassList = singleItemClass;
			}
			else {
				if((idx<itemCnt-1) && (idx>0)) {
					cssClassList = internalItemClass;
				}
				else {
					cssClassList = idx==itemCnt-1 ? firstItemClass : '';
					cssClassList += idx==0 ? lastItemClass : '';
				}
			}
			
			if(idx%2===0) {
				bkColor = LISTITEM_BACKCOLOR_LIGHT; 
			}
			else {
				bkColor = LISTITEM_BACKCOLOR_DARK;
			}
			
			description = sprintf("%-20s", activity.name.substr(0,20));
			totalDuration = totalDuration*1 + tasks.item(idx).duration*1;
			list.append('<li id="' + appName + '-' + 'lstDayTasksSummaryListItem" class="' + cssClassList + '"' +  
				      	'      data-listitem-index="' + idx + '" style="background-color:' + bkColor + ';" >' + 
				      	'   <div id="' + appName + '-' + 'lstDayTasksSummaryListItem-inner-div">' + 
				      	'       <div id="' + appName + '-' + 'txtDayTasksSummaryListItem" class="m1-text" style="width:240px;font-family:monospace;" onClick="activateListItem(); showTask(' + tasks.item(idx).id + ')">' + description + '</div>'+ 
				      	'       <div id="' + appName + '-' + 'txtDayTasksSummaryDurationListItem" class="m1-text" style="width:65px;font-family:monospace;" onClick="activateListItem(); showTask(' + tasks.item(idx).id + ')">' + getDurationString(tasks.item(idx).duration) + '</div>'+
				      	'   </div>'+
				      	'</li>');
			bkColorIdx++;
		}
	}

	
	info = sprintf(language.translate("Number") + ": %-5s - " + language.translate("Working Time") + ": %10s", numPad(itemCnt, 3), getDurationString(totalDuration));
	$('#' + appName + '-' + 'txtDayTasksSummaryInfo').text(info);
	
	//Update panel's content height, set the ht value on the panel's 
	// scroller <div> data-layout-content-height attribute.
	// panelHt = header ht + listItems ht + footer ht
	var panelHt = 30 + itemCnt * 50;
	$('#' + appName + '-' + 'panelDayTasksSummaryList-scroller').attr('data-layout-content-height', panelHt);
	
	previousListItem = null;
	
	phoneui.preprocessDOM(list);
	phoneui.forceLayout();


}
function activateListItem() {
var selectedItem = $(event.srcElement).closest('li[data-listitem-index]');
	if(previousListItem!=null) {
		if($(previousListItem).attr('data-listitem-index')%2===0) {
			$(previousListItem).css('background-color', LISTITEM_BACKCOLOR_LIGHT);
		}
		else {
			$(previousListItem).css('background-color', LISTITEM_BACKCOLOR_DARK);
		}
	}
	$(selectedItem).css('background-color', LISTITEM_BACKCOLOR_ACTIVE);
	previousListItem =selectedItem;
	phoneui.preprocessDOM($(selectedItem));
}

function showTask(id) {
//if(DEBUG) console.log('showTask()');
var selectedItem = $(event.srcElement).closest('li[data-listitem-index]');
var origBkColor = $(selectedItem).css('background-color');

	metrees.empty();
	metrees.loadByTask(id, collaborator.id);
}

function setTaskInfo(taskInfo) {
var local_photo_before = uriDocument + taskInfo.photo_before.substring(taskInfo.photo_before.lastIndexOf('/'));
var local_photo_after = uriDocument + taskInfo.photo_after.substring(taskInfo.photo_after.lastIndexOf('/'));

	$('#' + appName + '-' + 'txtTaskDetailsBatiment').text(taskInfo.name);
	$('#' + appName + '-' + 'txtTaskDetailsEtage').text(taskInfo.etage);
	$('#' + appName + '-' + 'txtTaskDetailsPiece').text(taskInfo.piece);
	$('#' + appName + '-' + 'txtTaskDetailsComment').text(taskInfo.comment);
	$('#' + appName + '-' + 'txtTaskDetailsTypeObturation').text(metree_obturation_types0.obturationTypes);
	$('#' + appName + '-' + 'txtTaskDetailsLargeur').text(taskInfo.largeur_obturation);
	$('#' + appName + '-' + 'txtTaskDetailsHauteur').text(taskInfo.hauteur_obturation);
	$('#' + appName + '-' + 'txtTaskDetailsProfondeur').text(taskInfo.profondeur);
	if(networkInfo.isConnected()==true) {
		$('#' + appName + '-' + 'imgTaskDetailsPictureBefore').attr('src', taskInfo.photo_before);
		$('#' + appName + '-' + 'imgTaskDetailsPictureBefore').click(function() { 
			$('#' + appName + '-' + 'panelTaskDetailsPictureBefore').css('background-color', LISTITEM_BACKCOLOR_ACTIVE);
			showPicture(taskInfo.photo_before, true); 
		});
	}
	else {
		$('#' + appName + '-' + 'imgTaskDetailsPictureBefore').attr('src', local_photo_before);
		$('#' + appName + '-' + 'imgTaskDetailsPictureBefore').click(function() { 
			$('#' + appName + '-' + 'panelTaskDetailsPictureBefore').css('background-color', LISTITEM_BACKCOLOR_ACTIVE);
			showPicture(local_photo_before, true); 
		});
	}
	if(networkInfo.isConnected()==true) {
		$('#' + appName + '-' + 'imgTaskDetailsPictureAfter').attr('src', taskInfo.photo_after);
		$('#' + appName + '-' + 'imgTaskDetailsPictureAfter').click(function() { 
			$('#' + appName + '-' + 'panelTaskDetailsPictureAfter').css('background-color', LISTITEM_BACKCOLOR_ACTIVE);
			showPicture(taskInfo.photo_after, false); 
		});
	}
	else {
		$('#' + appName + '-' + 'imgTaskDetailsPictureAfter').attr('src', local_photo_after);
		$('#' + appName + '-' + 'imgTaskDetailsPictureAfter').click(function() { 
			$('#' + appName + '-' + 'panelTaskDetailsPictureAfter').css('background-color', LISTITEM_BACKCOLOR_ACTIVE);
			showPicture(local_photo_after, false); 
		});
	}
	gotoTaskDetails(phoneui.transitions.slideLeft);
}

function onWorkStamp(event) {
if(DEBUG) console.log('onWorkstamp Event received ...');
	// Check if WorkStamp Type is "End of Working Day"
	// And resume App Exit processing ...
	if(event.detail.workstamp_type_id==14) {
		if((networkInfo.isConnected()==true) && (LOCAL_DB==true)) {
			if(WORKFLOW_ENABLED) {
				phoneui.showActivityDialog('Uploading Pictures...');
				pictures.initUpload();
				pictures.upload();
			}
			else {
				phoneui.showActivityDialog('Uploading Data...');
				databaseManager.startUpload();
			}
		}
		else {
			if(timeClock.isRunning()) {
				timeClock.store();
			}
			setTimeout( function() { navigator.app.exitApp(); });
		}
	}

}

function Beep() {
//	navigator.notification.beep(1);
	navigator.notification.vibrate(50); 
}

function appExit() {
if(DEBUG) console.log('exit()');

	Beep();
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'Exit Button pressed.');
	
	appBackupMgr.backup();
	
	if(appNeedRestart==true) {
		
		alert((language==null) ? 'The App. must restart for the Parameters to take effect.' : language.translate('The App. must restart for the Parameters to take effect.'));
		setTimeout(function() {
			bwMenu.disable();
			phoneui.preprocessDOM('#' + appName + '-' + 'navBar');
		}, 1000);
		enableExitButton(false);
		if((collaborator!=undefined) && (collaborator.id!=-1)) {
			
			// This part of the process has been moved to onWorkStamp Event Handler
			// in order to ensure that the End Of Working Day Workstamp has been corectly inserted 
			// in the Database, before it is Uploaded to the Server for Synchronization.
			if(workStateManager!=undefined) endWorkingDay();
		}
		else {
			setTimeout( function() { navigator.app.exitApp(); });
		}
	}
	else {
		if(confirm((language==null) ? 'Do you really want to quit the Application ?' : language.translate('Do you really want to quit the Application ?'))) {
			setTimeout(function() {
				bwMenu.disable();
				phoneui.preprocessDOM('#' + appName + '-' + 'navBar');
			}, 1000);
			enableExitButton(false);
			if((collaborator!=undefined) && (collaborator.id!=-1)) {
				
				// This part of the process has been moved to onWorkStamp Event Handler
				// in order to ensure that the End Of Working Day Workstamp has been corectly inserted 
				// in the Database, before it is Uploaded to the Server for Synchronization.

				console.log("joket: endWorkingDay()");
				if(workStateManager!=undefined) endWorkingDay();
			}
			else {
				setTimeout( function() { navigator.app.exitApp(); });
			}
		}
	}
}



////////////////////////////////////////////////////////////////////////////////////////////////////
//Dev & Test Resources
////////////////////////////////////////////////////////////////////////////////////////////////////
function testXML() {
	$.ajax({
		url: './hosts.xml',
		dataType: 'xml',
		success: function(xml) {
			$(xml).find('host').each(function(){
				console.log($(this).find('host_name').text());
				console.log($(this).find('host_base_url').text());
				console.log($(this).find('base_port').text());
				console.log($(this).find('dss_port').text());
			});			
		},
		//other code
		error: function(error) {
			alert("The XML File could not be processed correctly.");
		}
	});	
}
