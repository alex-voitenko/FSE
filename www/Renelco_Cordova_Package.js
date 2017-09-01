//////////////////////////////////////////////////
// Define AppInfo Class
//////////////////////////////////////////////////

/** AppInfo
 * This class encapsulates a AppInfo.
 *
 */	
/**
 * @author Hell
 */
/**
 *  AppInfo Class Definition 
 */
var AppInfo = (function () {
	var AppInfo = function (id) {
//		if(DEBUG) alert('Enter AppInfo() Constructor...');
		this.applicationId = '';
		this.appVersionCode = '';
		this.appVersionName = '';
		this.appBaseDirectory = '';
		this.status = this.INFO_STATUS.Undefined;
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.AppInfoEvent = new CustomEvent("AppInfo", {
				detail: {
					action: '',
					result: '',
					applicationId: '',
					appVersionCode: '',
					appVersionName: '',
					appBaseDirectory: '',					
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.AppInfoEvent = new CustomEvent("AppInfo", {
					detail: {
						action: '',
						result: '',
						applicationId: '',
						appVersionCode: '',
						appVersionName: '',
						appBaseDirectory: '',					
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.AppInfoEvent = document.createEvent("CustomEvent");
				this.AppInfoEvent.initCustomEvent('AppInfo', true, false, {action: '', result: '', applicationId: '', appVersionCode: '', appVersionName: '', appBaseDirectory: '', time: new Date()});
			}
		}
		if(DEBUG) alert('Exit AppInfo Constructor...');
		
	};

	AppInfo.prototype = {
		INFO_STATUS: {Undefined: 'Undefined', Success: 'Success', Error: 'Error'},
		reset: function() {
//		if(DEBUG) alert('AppInfo.reset()');
			var thisAppInfo = this;
			thisAppInfo.id = -1;
		    thisAppInfo.fireEvent();
		},
		load: function() {
//		if(DEBUG) alert('AppInfo.load()');
		var thisAppInfo = this;
		
			if(window.plugins.appinfo!=undefined) {
			    window.plugins.appinfo.getAppVersionName (
			    		  function(versionName) {
			    		    console.log("got Version Name: " + versionName);
			    		    thisAppInfo.appVersionName = versionName;
			    		    window.plugins.appinfo.getAppVersionCode (
			    		    		function(versionCode) {
			    		    			console.log("got Version Code: " + versionCode);
						    		    thisAppInfo.appVersionCode = versionCode; 
									    window.plugins.appinfo.getApplicationId (
									    	function(applicationId) {
									    		console.log("got Application Id: " + applicationId);
									    		thisAppInfo.applicationId = applicationId;
											    window.plugins.appinfo.getAppDataDirectory (
											    	function(dataDir) {
											    		console.log("got App. Data Directory: " + dataDir);
														//alert('joket: dataDir is null?');
														//alert('joket:app info appBaseDirectory: = '+ JSON.stringify(dataDir));
											    		thisAppInfo.appBaseDirectory = dataDir;
											    		thisAppInfo.status = thisAppInfo.INFO_STATUS.Success;
												        thisAppInfo.AppInfoEvent.detail.applicationId = thisAppInfo.applicationId;
												        thisAppInfo.AppInfoEvent.detail.appVersionCode = thisAppInfo.appVersionCode;
												        thisAppInfo.AppInfoEvent.detail.appVersionName = thisAppInfo.appVersionName;
												        thisAppInfo.AppInfoEvent.detail.appBaseDirectory = thisAppInfo.appBaseDirectory;
												        thisAppInfo.AppInfoEvent.detail.action = 'LOAD';
												        thisAppInfo.AppInfoEvent.detail.result = 'SUCCESS';
												        thisAppInfo.fireEvent();
											    	},
											    	function() {
											    		console.log("error loading App. Data Directory");
											    		thisAppInfo.status = thisAppInfo.INFO_STATUS.Error;
												        thisAppInfo.AppInfoEvent.detail.action = 'LOAD';
												        thisAppInfo.AppInfoEvent.detail.result = 'ERROR';
												        thisAppInfo.fireEvent();
											    	}
											     );    
									    	},
									    	function() {
									    	    console.log("error loading Application Id");
									    		thisAppInfo.status = thisAppInfo.INFO_STATUS.Error;
										        thisAppInfo.AppInfoEvent.detail.action = 'LOAD';
										        thisAppInfo.AppInfoEvent.detail.result = 'ERROR';
										        thisAppInfo.fireEvent();
									    	}
									    );    
						    		},
						    		function() {
						    			console.log("error loading Version Code");
							    		thisAppInfo.status = thisAppInfo.INFO_STATUS.Error;
								        thisAppInfo.AppInfoEvent.detail.action = 'LOAD';
								        thisAppInfo.AppInfoEvent.detail.result = 'ERROR';
								        thisAppInfo.fireEvent();
						    		}
						    ); 
			    		  },
			    		  function() {
			    		    console.log("error loading Version Name");
				    		thisAppInfo.status = thisAppInfo.INFO_STATUS.Error;
					        thisAppInfo.AppInfoEvent.detail.action = 'LOAD';
					        thisAppInfo.AppInfoEvent.detail.result = 'ERROR';
					        thisAppInfo.fireEvent();
			    		  }
			      );
			}
		},
		show: function() {
			var thisAppInfo = this;
			alert('AppInfo Data:\n' +
			      'Application Id:      ' + thisAppInfo.applicationId + '\n' +
				  'App. Version Name:   ' + thisAppInfo.appVersionName + '\n' +
				  'App. Code Name:      ' + thisAppInfo.appVersionCode + '\n' +
				  'App. Base Directory: ' + thisAppInfo.appBaseDirectory + 
				  '\n');
		},
		addEventListener: function(name, handler, capture) {
//		if(DEBUG) alert('Enter AppInfo.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		if(DEBUG) alert('Enter AppInfo.removeEventListener() ...');
		    if (!this.events) return;
		    if (!this.events[name]) return;
		    for (var i = this.events[name].length - 1; i >= 0; i--) {
		        if (this.events[name][i] == handler) {
		            this.events[name].splice(i, 1);
		            if(!this.events[name].length) {
//		            	alert('No more Events');
		            	delete this.events[name];
		            }
		            else {
//			            alert('Nb of Events: ' + this.events[name].length);
		            }
		        }
		    }
//		    alert(JSON.stringify(this.events));
		},
		dispatchEvent: function(event) {
//		if(DEBUG) alert('Executing AppInfo.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		if(DEBUG) alert('AppInfo.AssignEvent');
		var thisAppInfo = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisAppInfo.objectId = new Object();
				thisAppInfo.objectId = element;
				thisAppInfo.objectId.addEventListener('AppInfo', 'onAppInfo', false);
			}
			else {
//				alert('It is an HTML Element');
				thisAppInfo.htmlElement = element;
				document.getElementById(thisAppInfo.htmlElement).addEventListener("AppInfo", onAppInfo, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) alert('AppInfo.FireEvent');
		var thisAppInfo = this;
			/* 
			 * Set Event detail information here ... 
			 */
			if (thisAppInfo.objectId!=null){
//				alert('Event fired to an Object');
				thisAppInfo.objectId.dispatchEvent(thisAppInfo.AppInfoEvent);
			}
			if(thisAppInfo.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisAppInfo.htmlElement).dispatchEvent(thisAppInfo.AppInfoEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('AppInfo.store()');
			localStorage.setItem('AppInfo', JSON.stringify(this));
		},
		restore: function() {
//		if(DEBUG) alert('AppInfo.restore()');
		var thisAppInfo = this;
		var item = JSON.parse(localStorage.getItem('AppInfo'));	
			thisAppInfo.id = item.id;
		},
		remove: function() {
//		if(DEBUG) alert('AppInfo.remove()');
		var thisAppInfo = this;
			localStorage.removeItem('AppInfo');
		},
		isStored: function() {
//		if(DEBUG) alert('AppInfo.isStored()');
		var thisAppInfo = this;
		var storage = localStorage.getItem('AppInfo');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return AppInfo;
})();

