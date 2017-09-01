//var DEBUG = false;	Declared somewhere else ...
var DeviceInfo = (function () {
	var DeviceInfo = function () {
		if(DEBUG) alert('DeviceInfo Constructor ...');
		this.model = device.model;
		this.cordova = device.cordova;
		this.platform = device.platform;
		this.uuid = device.uuid;
		this.version = device.version;
		if(DEBUG) alert('Exiting DeviceInfo Constructor ...');
	};
	DeviceInfo.prototype = {
		isKitKat: function() {
			return true;
			if(this.version.substring(0,3)=='4.4') {
				
				return true;
			}
			return false;
		},
		isNull: function() {
		if(DEBUG) alert('DeviceInfo.isNull(' + this.platform + ')');
		var thisDeviceInfo = this;
			if(thisDeviceInfo.platform==null) {
				return true;
			}
			return false;
		},
		show: function() {
			alert('Device Informations:\n' +
				  'Device Name: ' + this.model + '\n' + 
                  'Device Cordova: ' + this.cordova + '\n' + 
                  'Device Platform: ' + this.platform + '\n' + 
                  'Device UUID: ' + this.uuid + '\n' + 
                  'Device Version: ' + this.version + '\n');
		}
	};
	return DeviceInfo;
})();

var NetworkInfo = (function () {
	var NetworkInfo = function () {
		if(DEBUG) alert('NetworkInfo Constructor ...');
		this.states = {};
		this.states[Connection.UNKNOWN]  = 'Unknown connection';
		this.states[Connection.ETHERNET] = 'Ethernet connection';
		this.states[Connection.WIFI]     = 'WiFi connection';
		this.states[Connection.CELL_2G]  = 'Cell 2G connection';
		this.states[Connection.CELL_3G]  = 'Cell 3G connection';
		this.states[Connection.CELL_4G]  = 'Cell 4G connection';
		this.states[Connection.NONE]     = 'No network connection';
		this.networkState = navigator.connection.type;
		if(DEBUG) alert('Exiting NetworkInfo Constructor ...');
	};
	NetworkInfo.prototype = {
		refresh: function()  {
			this.networkState = navigator.connection.type;
		},	
		isConnected: function() {
			if(this.networkState===Connection.NONE) {
				return false;
			}
			return true;
		},
		show: function() {
			alert('Network Informations:\n' +
				  'Connection Type: ' + this.states[this.networkState] + '\n');
		}
	};
	return NetworkInfo;
})();
