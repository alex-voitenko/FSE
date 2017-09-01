/*
// Define the base class for all object classes.
function BaseObject(){
    // Class properties.
}
 
// Method returns a class-bound version of the passed-in
// function; this will execute in the context of the
// originating object (this).
BaseObject.prototype.Bind = function( fnMethod ){
	var objSelf = this;
 
    // Return a method that will call the given method
    // in the context of THIS object.
    return(
        function(){
            return( fnMethod.apply( objSelf, arguments ) );
        }
    );
}

// Extend the base object.
GPSTracker.prototype = new BaseObject();
*/
//////////////////////////////////////////////////
// Define GPS Class
//////////////////////////////////////////////////

/** GPS Tracker 
 * This class encapsulates the GPS function supplied by Cordova.
 * It is based on the following methods:
 *		- navigator.geolocation.getCurrentPosition(...): Returns the current Location.
 *		- navigator.geolocation.watchPosition(...): Scans GPS and returns the Location when changes are detected.
 * It generates the event GPSPosition each time a Position is acquired.
 * The event is tied to an HTMLElement of the UI Page (generally the id of the page itself)
 * The event handler onGPSPosition MUST BE IMPLEMENTED in the UI Page as follows:
 *
 *
 * 			function onGPSPosition(event) {
 * 				// your code here ...
 * 			}
 *
 * This event-driven approach has the advantage to maintain loose coupling between GPS and 
 * the other modules.
 *
 */	
/**
 * @author Hell
 */
/**
 *  GPSTracker Class Definition 
 */
var GPSTracker = (function () {
	var GPSTracker = function () {
//		alert('Enter Constructor GPSTracker()');
		this.position = new Object();
		this.gpsDataLog = []; 		// new Array();
		this.watchId = null;
		this.options = {};			// new Object();
		this.watching = false;
		this.logging = false;
		this.htmlElementId = null;
		if(deviceInfo===undefined) {
//			alert('GPSTracker(): DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.GPSPositionEvent = new CustomEvent ("GPSPosition", {
				detail: {
					position: new Object(),
					logger: new Object(),
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('GPSTracker(): KitKat Device...');
				this.GPSPositionEvent = new CustomEvent ("GPSPosition", {
					detail: {
						position: new Object(),
						logger: new Object(),
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('GPSTracker(): NOT a KitKat Device...');
				this.GPSPositionEvent = document.createEvent("CustomEvent");
				this.GPSPositionEvent.initCustomEvent('GPSPosition', true, false, {position: new Object(), logger: new Object(), time: new Date()});
			}
		}
//		alert('Exit Constructor GPSTracker()');
	};

	GPSTracker.prototype = {
		hasGPS: function () {
			if (navigator.geolocation) {
				return true;
			}
			return false;
		},
		getCurrentPosition: function() {
//		alert('GPSTracker.getCurrentPosition()');
		var thisGPS = this;
//			thisGPS.options = {enableHighAccuracy: true, frequency: 3000, timeout: 10000, maximumAge: 0 };
			thisGPS.options = {enableHighAccuracy: true, timeout: 300000, maximumAge: 60000 };
			navigator.geolocation.getCurrentPosition(
				function onSuccess(position){
					thisGPS.position = position;
					if(thisGPS.logging==true) {
//						alert('Getting current Position and Logging ...');
						thisGPS.GPSPositionEvent.detail.position = thisGPS.position;
						thisGPS.GPSPositionEvent.detail.logger = thisGPS.gpsDataLog;
						thisGPS.gpsDataLog.push(thisGPS.position);
					}
					else {
//						alert('Getting current Position without Logging ...');
						thisGPS.GPSPositionEvent.detail.position = thisGPS.position;
						thisGPS.GPSPositionEvent.detail.logger = null;
					}
//					alert('onSuccess()\n' + JSON.stringify(thisGPS.position) + '\n\n' + thisGPS.htmlElementId);
//					thisGPS.fireEvent();
				}, 
				function onError(error) {
//				    alert('code: '    + error.code    + '\n' +
//				          'message: ' + error.message + '\n');
				},
				thisGPS.options
			);
			return thisGPS.position;
		},
		startTracking: function() {
//		alert('GPSTracker.startTracking()');
		var thisGPS = this;
			thisGPS.watching = true;
			thisGPS.options = {enableHighAccuracy: true, frequency:3000, timeout:10000, maximumAge:0};
		    thisGPS.watchId = navigator.geolocation.watchPosition(
				function onSuccess(position) {
					thisGPS.position = position;
					if(thisGPS.logging==true) {
//						alert('Tracking and Logging ...');
						thisGPS.GPSPositionEvent.detail.position = thisGPS.position;
						thisGPS.GPSPositionEvent.detail.logger = thisGPS.gpsDataLog;
						thisGPS.gpsDataLog.push(thisGPS.position);
					}
					else {
//						alert('Tracking without Logging ...');
						thisGPS.GPSPositionEvent.detail.position = thisGPS.position;
						thisGPS.GPSPositionEvent.detail.logger = null;
					}
//					alert('onSuccess()\n' + JSON.stringify(thisGPS.position) + '\n\n' + thisGPS.htmlElementId);
					thisGPS.fireEvent();
				}, 
				function onError(error) {
//					alert('code: '    + error.code    + '\n' +
//						  'message: ' + error.message + '\n');
				},
				thisGPS.options
		    );
		},
		stopTracking: function () {
//		alert('GPSTracker.stopTracking()');
		var thisGPS = this;
			navigator.geolocation.clearWatch(thisGPS.watchId);	
			thisGPS.watching = false;
		},
		isTracking: function() {
		var thisGPS = this;
			return thisGPS.watching;
		},
		getLog: function() {
		var thisGPS = this;
			return thisGPS.gpsDataLog;
		},
		// FOR TEST ONLY
		showLog: function() {
		var thisGPS = this;
		var msg = "gpsDataLog Logger:\n";
			msg = msg + "Nb of gpsDataLog: " + thisGPS.gpsDataLog.length + "\n\n\n";
			for (var idx=0; idx<thisGPS.gpsDataLog.length; idx++) {
				msg += JSON.stringify(thisGPS.gpsDataLog[idx]) + "\n\n";
			}
			alert(msg);
		},
		enableLog: function(enable) {
		var thisGPS = this;
			thisGPS.logging = enable;
		},
		clearLog: function() {
		var thisGPSD = this;
			thisGPS.gpsDataLog.length = 0;
		},
		isLogging: function() {
		var thisGPS = this;
			return thisGPS.logging;
		},
		assignEvent: function(element) {
		var thisGPS = this;
			thisGPS.htmlElementId = element;
			document.getElementById(thisGPS.htmlElementId).addEventListener("GPSPosition", onGPSTracker, false);
		},
		fireEvent: function() {
		var thisGPS = this;
			document.getElementById(thisGPS.htmlElementId).dispatchEvent(thisGPS.GPSPositionEvent);
		}
	};
	return GPSTracker;
})();

var GPSCompass = (function () {
	var GPSCompass = function () {
//		alert('Enter Constructor GPSCompass()');
		this.heading = new Object();
		this.gpsDataLog = []; 		// new Array();
		this.watchId = new Object();
		this.options = {};			// new Object();
		this.watching = false;
		this.logging = false;
		this.htmlElementId;
		if(deviceInfo===undefined) {
//			alert('GPSCompass(): DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.GPSCompassEvent = new CustomEvent ("GPSCompass", {
				detail: {
					heading: new Object(),
					logger: new Object(),
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('GPSCompass(): KitKat Device...');
				this.GPSCompassEvent = new CustomEvent ("GPSCompass", {
					detail: {
						heading: new Object(),
						logger: new Object(),
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('GPSCompass(): NOT a KitKat Device...');
				this.GPSCompassEvent = document.createEvent("CustomEvent");
				this.GPSCompassEvent.initCustomEvent('GPSCompass', true, false, {heading: new Object(), logger: new Object(), time: new Date()});
			}
		}
//		alert('Exit Constructor GPSCompass()');
	};

	GPSCompass.prototype = {
		hasGPS: function () {
			if (navigator.geolocation) {
				return true;
			}
			return false;
		},
		getCurrentHeading: function() {
//		alert('GPSCompass.getCurrentHeading()');
		var thisCompass = this;
			navigator.compass.getCurrentHeading(
				function onSuccess(heading){
					thisCompass.heading = heading;
					if(thisCompass.logging==true) {
//						alert('Getting current Heading and Logging ...');
						thisCompass.GPSCompassEvent.detail.heading = thisCompass.heading;
						thisCompass.GPSCompassEvent.detail.logger = thisCompass.gpsDataLog;
						thisCompass.gpsDataLog.push(thisCompass.position);
					}
					else {
//						alert('Getting current Heading without Logging ...');
						thisCompass.GPSCompassEvent.detail.heading = thisCompass.heading;
						thisCompass.GPSCompassEvent.detail.logger = null;
					}
//					alert('onSuccess()\n' + JSON.stringify(thisCompass.heading) + '\n\n' + thisCompass.htmlElementId);
					thisCompass.fireEvent();
				}, 
				function onError(error) {
//				    alert('code: '    + error.code    + '\n' +
//				          'message: ' + error.message + '\n');
				}
			);
		},
		startWatchHeading: function() {
//		alert('GPSCompass.startWatchHeading()');
		var thisCompass = this;
			thisCompass.options = { frequency: 3000 };
			thisCompass.watchId = navigator.compass.watchHeading(
					function onSuccess(heading){
						thisCompass.heading = heading;
						if(thisCompass.logging==true) {
							thisCompass.GPSCompassEvent.detail.heading = thisCompass.heading;
							thisCompass.GPSCompassEvent.detail.logger = thisCompass.gpsDataLog;
							thisCompass.gpsDataLog.push(thisCompass.heading);
						}
						else {
							thisCompass.GPSCompassEvent.detail.heading = thisCompass.heading;
							thisCompass.GPSCompassEvent.detail.logger = null;
						}
//						alert('onSuccess()\n' + JSON.stringify(thisCompass.heading) + '\n\n' + thisCompass.htmlElementId);
						thisCompass.fireEvent();
					},
					function onError(error){
//						alert('code: '    + error.code    + '\n' +
//							  'message: ' + error.message + '\n');
					},
					thisCompass.options
			);
		},
		stopWatchHeading: function() {
//		alert('GPSCompass.stopWatchHeading()');
		var thisCompass = this;
			if (thisCompass.watchID) {
				navigator.compass.clearWatch(thisCompass.watchID);
				thisCompass.watchID = null;
			}
		},
		isTracking: function() {
		var thisCompass = this;
			return thisCompass.watching;
		},
		getLog: function() {
		var thisCompass = this;
			return thisCompass.gpsDataLog;
		},
		// FOR TEST ONLY
		showLog: function() {
		var thisCompass = this;
		var msg = "gpsDataLog Logger:\n";
			msg = msg + "Nb of gpsDataLog: " + thisCompass.gpsDataLog.length + "\n\n\n";
			for (var idx=0; idx<thisCompass.gpsDataLog.length; idx++) {
				msg += JSON.stringify(thisCompass.gpsDataLog[idx]) + "\n\n";
			}
			alert(msg);
		},
		enableLog: function(enable) {
		var thisCompass = this;
			thisCompass.logging = enable;
		},
		clearLog: function() {
		var thisCompass = this;
			thisCompass.gpsDataLog.length = 0;
		},
		isLogging: function() {
		var thisCompass = this;
			return thisCompass.logging;
		},
		assignEvent: function(element) {
		var thisCompass = this;
			thisCompass.htmlElementId = element;
			document.getElementById(thisCompass.htmlElementId).addEventListener("GPSCompass", onGPSCompass, false);
		},
		fireEvent: function() {
		var thisCompass = this;
			document.getElementById(thisCompass.htmlElementId).dispatchEvent(thisCompass.GPSCompassEvent);
		}
	};
	return GPSCompass;
})();
