//////////////////////////////////////////////////
// Define LogFile Class
//////////////////////////////////////////////////

/** LogFile
 * This class encapsulates a LogFile.
 *
 */	
/**
 * @author Hell
 */
/**
 *  LogFile Class Definition 
 */
var LogFile = (function () {
	var LogFile = function () {
		if(DEBUG) console.log('Enter LogFile() Constructor...');
		this.webServerBaseUrl = '';
		this.filename = 'RenelcoBMA.log';
		this.file = null;
		this.arrayBuffer = [];
		this.fileState = LogFile.prototype.FILE_STATE.Idle;
		this.selfObjectId = this;	// Self-assigned, used for Table Creation internal Event Handling
		this.selfObjectId.addEventListener('FileUpload', 'onFileUpload', false);		
		this.htmlElement = null;
		this.objectId = null;
		this.selObjectId = this;
		if(deviceInfo==null) {
			if(DEBUG) console.log('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.LogFileEvent = new CustomEvent("LogFile", {
				detail: {
					action: '',
					result: '',
					info: '',
					text: '',
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
				if(DEBUG) console.log('KitKat Device...');
				this.LogFileEvent = new CustomEvent("LogFile", {
					detail: {
						action: '',
						result: '',
						info: '',
						text: '',
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
				if(DEBUG) console.log('NOT a KitKat Device...');
				this.LogFileEvent = document.createEvent("CustomEvent");
				this.LogFileEvent.initCustomEvent('LogFile', true, false, {action: '', result: '', info: '', text: '', time: new Date()});
			}
		}
		this.selfObjectId.addEventListener('LogFile', 'onLogFile', false);
		this.initialize();
		if(DEBUG) console.log('Exit LogFile Constructor...');
	};
	LogFile.prototype = {
		MSG_TYPE: {Info: 'Info', Warning: 'Warning', Error: 'Error', UserAction: 'UserAction', Undefined: 'Undefined' },
		FILE_STATE: {Idle: 'Idle', Writing: 'Writing', Reading: 'Reading'},
		initialize: function() {
		if(DEBUG) console.log('LogFile.initialize()');	
		var thisLogFile = this;
			window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, 
				function (dir) {
					//alert("joket: externalDataDirectory :=" + JSON.stringify(dir));
				if(DEBUG) console.log("got main dir",dir);
				dir.getFile(thisLogFile.filename, {create:true, exclusive: false}, 
					function(file) {
						if(DEBUG) console.log("got the file", file);
						thisLogFile.file = file;
						thisLogFile.startLog();
				});
			});			
		},
		startLog: function() {
		var thisLogFile = this;
			setInterval(function() {
				thisLogFile._write();
			}, 1500);
		},
		writeLog: function(msgType, msgText) {
		if(DEBUG) console.log('LogFile.writeLog('+ msgType + ',' + msgText + ')');
		var thisLogFile = this;
		var reason = '';
		var msg = '';
			switch(msgType) {
				case LogFile.prototype.MSG_TYPE.Info:
					reason = ' - INFO       - ';
					break;
				case LogFile.prototype.MSG_TYPE.Warning:
					reason = ' - WARNING    - ';
					break;
				case LogFile.prototype.MSG_TYPE.Error:
					reason = ' - ERROR      - ';
					break;
				case LogFile.prototype.MSG_TYPE.UserAction:
					reason = ' - USR ACTION - ';
					break;
				case LogFile.prototype.MSG_TYPE.Undefined:
					reason = ' - UNDEFINED  - ';
					break;
				default: 
					reason = ' - INFO       - ';
			}
			msg = '[' + (new Date()) + ']' + reason + msgText  + '\r\n';
			thisLogFile.arrayBuffer.push(msg); 
		},
//		upload: function(urlDataServer, filename) {
//		var thisLogFile = this;	
//			thisLogFile.webServerBaseUrl = urlDataServer;
//			thisLogFile.logUploader = new FileUploader(this.webServerBaseUrl + '/uploads');
//			thisLogFile.logUploader.assignEvent(this.selfObjectId);
//			
//		},
		addEventListener: function(name, handler, capture) {
//		if(DEBUG) console.log('Enter LogFile.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
		},
		removeEventListener: function(name, handler) {
//		if(DEBUG) console.log('Enter LogFile.removeEventListener() ...');
			if (!this.events) return;
		    if (!this.events[name]) return;
		    for (var i = this.events[name].length - 1; i >= 0; i--) {
		        if (this.events[name][i] == handler) {
		            this.events[name].splice(i, 1);
		            if(!this.events[name].length) {
//				        console.log('No more Events');
		            	delete this.events[name];
		            }
		            else {
//					    console.log('Nb of Events: ' + this.events[name].length);
		            }
		        }
		    }
//				    console.log(JSON.stringify(this.events));
		},
		dispatchEvent: function(event) {
//		if(DEBUG) console.log('Executing LogFile.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		console.log('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//				console.log('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		if(DEBUG) console.log('LogFile.AssignEvent');
		var thisLogFile = this;
			if (element!==null && typeof element==='object') {
//				console.log('It is an Object');
				thisLogFile.objectId = new Object();
				thisLogFile.objectId = element;
				thisLogFile.objectId.addEventListener('LogFile', 'onLogFile', false);
			}
			else {
//				console.log('It is an HTML Element');
				thisLogFile.htmlElement = element;
				document.getElementById(thisLogFile.htmlElement).addEventListener("LogFile", onLogFile, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) console.log('LogFile.FireEvent');
		var thisLogFile = this;
			if (thisLogFile.objectId!=null){
//				console.log('Event fired to an Object');
				thisLogFile.objectId.dispatchEvent(thisLogFile.LogFileEvent);
			}
			if(thisLogFile.htmlElement!=null) {
//				console.log('Event fired to an HTML Element');
				document.getElementById(thisLogFile.htmlElement).dispatchEvent(thisLogFile.LogFileEvent);
			}
			if (thisLogFile.selfObjectId!=null){
//				console.log('Event fired to Itself');
				thisLogFile.selfObjectId.dispatchEvent(thisLogFile.LogFileEvent);
			}
		},
//		onFileUpload: function(event) {
//		if(DEBUG) console.log('LogFile.onFileUpload(event) received.');
//		var thisLogFile = this;
//			if(event.detail.info==200) {
//			if(DEBUG) console.log('LogFile uploaded');
//			}
//			else {
//			if(DEBUG) alert('Failed to upload LogFile');
//			}
//			thisLogFile.fireEvent();
//		},
		onLogFile: function(event) {
		var thisLogFile = this;
			console.log('onLogFile Event received ...');
			thisLogFile.fileState = LogFile.prototype.FILE_STATE.Idle;
		},
		clear: function() {
		var thisLogFile = this;
			if(thisLogFile.fileState==LogFile.prototype.FILE_STATE.Idle) {
				thisLogFile.fileState = LogFile.prototype.FILE_STATE.Writing;
				thisLogFile.file.createWriter(
					function(fileWriter) {
						fileWriter.onwriteend = function(evt) {
							console.log("FileWriter.onwrite received ...");
							thisLogFile.fileState = LogFile.prototype.FILE_STATE.Idle;
						};
						fileWriter.truncate(0);
					}, 
					function errorHandler(error) {
					var info = '';
						switch (error.code) {
							case FileError.SECURITY_ERR:
								info = 'Security Error';
								break;
						    case FileError.NOT_FOUND_ERR:
						    	info = 'Not Found Error';
						    	break;
						    case FileError.QUOTA_EXCEEDED_ERR:
						    	info = 'Quota Exceeded Error';
						    	break;
						    case FileError.INVALID_MODIFICATION_ERR:
						    	info = 'Invalid Modification Error';
						    	break;
						    case FileError.INVALID_STATE_ERR:
						    	info = 'Invalid State Error';
						    	break;
						    default:
						    	info = 'Unknown Error';
						      	break;
						}
						thisLogFile.LogFileEvent.detail.action = 'CLEAR';
						thisLogFile.LogFileEvent.detail.result = 'ERROR';
						thisLogFile.LogFileEvent.detail.info = info;
						thisLogFile.fireEvent();
					}
				);
			}
			else {
				console.log('Currently writing into Log File, skipping...');
			}
		},
		_write: function() {
		var thisLogFile = this;
			if(thisLogFile.fileState==LogFile.prototype.FILE_STATE.Idle) {
				if(thisLogFile.arrayBuffer.length>0)  {
					thisLogFile.fileState = LogFile.prototype.FILE_STATE.Writing;
					var msg = thisLogFile.arrayBuffer.shift();
					thisLogFile.file.createWriter(function(fileWriter) {
						fileWriter.onwriteend = function(evt) {
							console.log("FileWriter.onwrite received ...");
							thisLogFile.fileState = LogFile.prototype.FILE_STATE.Idle;
//							thisLogFile.LogFileEvent.detail.action = 'WRITE';
//							thisLogFile.LogFileEvent.detail.result = 'SUCCESS';
//							thisLogFile.LogFileEvent.detail.info = '';
//							thisLogFile.LogFileEvent.detail.text = msg;
//							thisLogFile.fireEvent();
						};
						fileWriter.seek(fileWriter.length);
						fileWriter.write(msg);
					}, 
					function errorHandler(error) {
					var info = '';
						switch (error.code) {
							case FileError.SECURITY_ERR:
								info = 'Security Error';
								break;
						    case FileError.NOT_FOUND_ERR:
						    	info = 'Not Found Error';
						    	break;
						    case FileError.QUOTA_EXCEEDED_ERR:
						    	info = 'Quota Exceeded Error';
						    	break;
						    case FileError.INVALID_MODIFICATION_ERR:
						    	info = 'Invalid Modification Error';
						    	break;
						    case FileError.INVALID_STATE_ERR:
						    	info = 'Invalid State Error';
						    	break;
						    default:
						    	info = 'Unknown Error';
						      	break;
						}
						thisLogFile.LogFileEvent.detail.action = 'WRITE';
						thisLogFile.LogFileEvent.detail.result = 'ERROR';
						thisLogFile.LogFileEvent.detail.info = info;
						thisLogFile.fireEvent();
					});
				}
				else {
					console.log('Nothing to Log...');
				}
			}
			else {
				console.log('Currently writing into Log File, skipping...');
			}
		}
	};
	return LogFile;
})();

