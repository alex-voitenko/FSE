/**
 * 
 */
var AppConfig = (function () {
	var AppConfig = function (hostId, hostName, hostBaseUrl, basePort, dssPort, customerName, local_db, logFile, autoSynchro, debug) {
		console.log('Enter AppConfig() Constructor...');
		this.hostId = hostId || -1;
		this.hostName = hostName || '';
		this.hostBaseUrl = hostBaseUrl || '';
		this.basePort = basePort || '';
		this.dssPort = dssPort || '';
		this.customerName = customerName || '';
		this.LOCAL_DB = local_db || false;
		this.LOGFile = logFile || false;
		this.AUTOSynchro = autoSynchro || true;
		this.DEBUG = debug || false;
//		this.needRestart = false;
		this.htmlElement = null;
		this.objectId = null;
		this.selfObjectId = null;
		if(deviceInfo==null) {
			console.log('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.AppConfigEvent = new CustomEvent("AppConfig", {
				detail: {
					action: '',
					result: '',
					hostId: -1,
					hostName: '',
					hostBaseUrl: '',
					basePort: '',
					dssPort: '',
					customerName: '',
					LOCAL_DB: true,
					LOGFile: false,
					AUTOSynchro: true,
					DEBUG: false,
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
				console.log('KitKat Device...');
				this.AppConfigEvent = new CustomEvent("AppConfig", {
					detail: {
						action: '',
						result: '',
						hostId: -1,
						hostName: '',
						hostBaseUrl: '',
						basePort: '',
						dssPort: '',
						customerName: '',
						LOCAL_DB: true,
						LOGFile: false,
						AUTOSynchro: true,
						DEBUG: false,
						info: '',
						text: '',
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
				console.log('NOT a KitKat Device...');
				this.AppConfigEvent = document.createEvent("CustomEvent");
				this.AppConfigEvent.initCustomEvent('AppConfig', true, false, {action: '', result: '', hostId: -1, hostName: '', hostBaseUrl: '', basePort: '', dssPort: '', customerName: '', LOCAL_DB: true, LOGFile: false, AUTOSynchro: true, DEBUG: false, info: '', text: '', time: new Date()});
			}
		}
//		this.initialize();
		console.log('Exit AppConfig Constructor...');
	};
	AppConfig.prototype = {
		initialize: function() {
		console.log('AppConfig.initialize()');
			if(this.isStored()) {
				this.restore();
			}
			else {
				this.hostId = -1;
				this.hostName = '';
				this.hostBaseUrl = '';
				this.basePort = '';
				this.dssPort = '';
				this.customerName = '';
				this.LOCAL_DB = false;
				this.LOGFile = false;
				this.AUTOSynchro = true;
				this.DEBUG = false;
				this.htmlElement = null;
				this.objectId = null;
				this.selfObjectId = this;
				this.selfObjectId.addEventListener('AppConfig', 'onAppConfig', false);
			}
		},
		isDefined: function() {
		console.log('AppConfig.defined()');
			// At least hostBaseUrl and customerName must be defined
			if((this.hostBaseUrl.trim().length==0) || (this.customerName.trim().length==0)) {
				return false;
			}
			return true;
		},
		save: function() {
			this.store();
			this.AppConfigEvent.detail.action = 'SAVE';
			this.AppConfigEvent.detail.result = 'SUCCESS';
			this.fireEvent();
		},
		del: function() {
			this.unstore();
			this.AppConfigEvent.detail.action = 'DELETE';
			this.AppConfigEvent.detail.result = 'SUCCESS';
			this.fireEvent();
		},
		show: function() {
			alert('App. Settings Data:\n' +
                  'Host ID: ' + this.hostId + '\n' +				  	
                  'Host Name: ' + this.hostName + '\n' +				  	
				  'Host Base URL: ' + this.hostBaseUrl + '\n' +
				  'Host Base Port: ' + this.basePort + '\n' +
				  'Host DSS Port: ' + this.dssPort + '\n' +
				  'Customer Name: ' + this.customerName + '\n' +
				  'LOGFile: ' + ((this.LOGFile==true) ? 'TRUE' : 'FALSE') + '\n' +
				  'AUTOSynchro: ' + ((this.AUTOSynchro==true) ? 'TRUE' : 'FALSE') + '\n' +
				  'DEBUG: ' + ((this.DEBUG==true) ? 'TRUE' : 'FALSE') + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		console.log('Enter AppConfig.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
		},
		removeEventListener: function(name, handler) {
//		console.log('Enter AppConfig.removeEventListener() ...');
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
//		console.log('Executing AppConfig.dispatchEvent(' + JSON.stringify(event) + ') ...');
		var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//				console.log('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		console.log('AppConfig.AssignEvent');
			if (element!==null && typeof element==='object') {
//				console.log('It is an Object');
				this.objectId = new Object();
				this.objectId = element;
				this.objectId.addEventListener('AppConfig', 'onAppConfig', false);
			}
			else {
//				console.log('It is an HTML Element');
				this.htmlElement = element;
				document.getElementById(this.htmlElement).addEventListener("AppConfig", onAppConfig, false);
			}
		},
		fireEvent: function() {
//		console.log('AppConfig.FireEvent');
			if (this.objectId!=null){
//				console.log('Event fired to an Object');
				this.objectId.dispatchEvent(this.AppConfigEvent);
			}
			if(this.htmlElement!=null) {
//				console.log('Event fired to an HTML Element');
				document.getElementById(this.htmlElement).dispatchEvent(this.AppConfigEvent);
			}
			if (this.selfObjectId!=null){
//				console.log('Event fired to Itself');
				this.selfObjectId.dispatchEvent(this.AppConfigEvent);
			}
		},
		onAppConfig: function(event) {
		console.log('AppConfig.onAppConfig(): Event received ...');
		},
		store: function() {
		console.log('AppConfig.store()');
		var thisAppConfig = this;
		var data;
		var seen = [];
			// This is to avoid JSON circular structure conversion error
			thisAppConfig.selfObjectId = null;
			data = JSON.stringify(thisAppConfig, ['hostId', 'hostName', 'hostBaseUrl', 'basePort', 'dssPort', 'customerName', 'LOCAL_DB', 'LOGFile', 'AUTOSynchro', 'DEBUG', 'htmlElement', 'objectId', 'selfObjectId' /*, 'AppConfigEvent'*/]);
			localStorage.setItem('AppConfig', data);
		},
		restore: function() {
		console.log('AppConfig.restore()');
		var item = JSON.parse(localStorage.getItem('AppConfig'));
			this.hostId = item.hostId;
			this.hostName = item.hostName;
			this.hostBaseUrl = item.hostBaseUrl;
			this.basePort = item.basePort;
			this.dssPort = item.dssPort;
			this.customerName = item.customerName;
			this.LOCAL_DB = item.LOCAL_DB;
			this.LOGFile = item.LOGFile;
			this.AUTOSynchro = item.AUTOSynchro;
			this.DEBUG = item.DEBUG;
			this.htmlElement = item.htmlElement;
			this.objectId = item.objectId;
			this.selfObjectId = item.selfObjectId;
//			this.AppConfigEvent = item.AppConfigEvent;
//			this.selfObjectId = this;
//			this.selfObjectId.addEventListener('AppConfig', 'onAppConfig', false);
		},
		unstore: function() {
		console.log('AppConfig.unstore()');
			localStorage.removeItem('AppConfig');
		},
		isStored: function() {
		console.log('AppConfig.isStored()');
		var storage = localStorage.getItem('AppConfig');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return AppConfig;
})();

var AppConfigCollection = (function () {
	
	var AppConfigCollection = function () {
	if(DEBUG) alert('Enter AppConfigCollection() Constructor...');
		this.count = 0;
		this.collection = [];
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===null) {
//		if(DEBUG) alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.AppConfigCollectionEvent = new CustomEvent("AppConfigCollection", {
				detail: {
					action: '',
					result: '',
					count: 0,
					items: undefined,
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//			if(DEBUG) alert('KitKat Device...');
				this.AppConfigCollectionEvent = new CustomEvent("AppConfigCollection", {
					detail: {
						action: '',
						result: '',
						count: 0,
						items: undefined,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//			if(DEBUG) alert('NOT a KitKat Device...');
				this.AppConfigCollectionEvent = document.createEvent("CustomEvent");
				this.AppConfigCollectionEvent.initCustomEvent('AppConfigCollection', true, false, {action: '', result: '', count: 0, items: undefined, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Constructor...');
	};

	AppConfigCollection.prototype = {
		load: function() {
		if(DEBUG) console.log('AppConfigCollection.load()');
			var thisAppConfigCollection = this;
			
			thisAppConfigCollection.clear();
			
			$.ajax({
				url: './hosts.xml',
				dataType: 'xml',
				success: function(xml) {
					$(xml).find('host').each(function(){
				        var $this = $(this);
				        var item = new AppConfig($this.find('host_id').text(),
				        						$this.find('host_name').text(),
				        						$this.find('host_base_url').text(),
				        						$this.find('base_port').text(),
				        						$this.find('dss_port').text(),
				        						$this.find('customer_name').text(),
				        						$this.find('local_db').text(),
				        						$this.find('logfile').text(),
				        						$this.find('autosynchro').text(),
				        						$this.find('debug').text());
//				        alert(JSON.stringify(item));
				        thisAppConfigCollection.add(item);
					});
					thisAppConfigCollection.fireEvent();
				},
				error: function(error) {
					alert("The XML File could not be processed correctly.");
				    thisAppConfigCollection.fireEvent();
				}	
			});
		},
		clear: function() {
		if(DEBUG) alert('ActivityTypeCollection.clear()');
			this.collection.splice(0, this.collection.length);
			this.count = this.collection.length; 
		},
		add: function(item) {
		if(DEBUG) alert('ActivityTypeCollection.add()');
			if(!this.exist(item)) {
				this.collection.push(item);
				this.count = this.collection.length;
			}
			else {
				alert('Item already exists ...');
			}
		},
		remove: function(idx) {
		if(DEBUG) alert('ActivityTypeCollection.remove(' + idx + ')');
			if(this.collection[idx]!=undefined) {
				this.collection.splice(idx, 1);
				this.count = this.collection.length;
			}
		},
		removeById: function(id) {
		if(DEBUG) alert('ActivityTypeCollection.removeById(' + id + ')');
		var result  = this.collection.filter(function(o){return o.hostId == id;} );
			result ? this.collection.splice(this.collection.indexOf(result[0]), 1) : alert('Item not found ...');
		},
		exist: function(item) {
		if(DEBUG) alert('ActivityTypeCollection.exist()');
			if($.grep(this.collection, function(e) { return e.hostId == item.hostId; }).length===0) {
				return false;
			}
			else {
				return true;
			}
		},
		item: function(idx) {
		if(DEBUG) alert('item(' + idx + ')');
			if(this.collection[idx]!=undefined) {
				return this.collection[idx];
			}
			return undefined;
		},
		itemById: function(id) {
		if(DEBUG) alert('itemById(' + id + ')');
		var result  = this.collection.filter(function(o){return o.hostId == id;} );
			return result ? result[0] : null; // or undefined			
		},
		assignEvent: function(element) {
//		if(DEBUG) alert('AssignEvent');
		var thisAppConfigCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisAppConfigCollection.objectId = new Object();
				thisAppConfigCollection.objectId = element;
				thisAppConfigCollection.objectId.addEventListener('AppConfigCollection', 'onAppConfigCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisAppConfigCollection.htmlElement = element;
				document.getElementById(thisAppConfigCollection.htmlElement).addEventListener("AppConfigCollection", onAppConfigCollection, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) alert('FireEvent');
		var thisAppConfigCollection = this;
			thisAppConfigCollection.AppConfigCollectionEvent.detail.count = thisAppConfigCollection.count;
			thisAppConfigCollection.AppConfigCollectionEvent.detail.items = thisAppConfigCollection.collection;
			if (thisAppConfigCollection.objectId!=null){
//			alert('Event fired to an Object');
				thisAppConfigCollection.objectId.dispatchEvent(thisAppConfigCollection.AppConfigCollectionEvent);
			}
			if(thisAppConfigCollection.htmlElement!=null) {
//			alert('Event fired to an HTML Element');
				document.getElementById(thisAppConfigCollection.htmlElement).dispatchEvent(thisAppConfigCollection.AppConfigCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('AppConfigCollection.store()');
			localStorage.setItem('AppConfigCollection', JSON.stringify(this.collection));
		},
		restore: function() {
//		if(DEBUG) alert('AppConfigCollection.restore()');
		var objects = JSON.parse(localStorage.getItem('AppConfigCollection'));
			this.clear();
			for(var idx=0; idx<objects.length; idx++) { 
				var item = new AppConfig(objects[idx].hostId, objects[idx].hostName, objects[idx].hostBaseUrl, objects[idx].basePort,objects[idx].dssPort);
				this.add(item);
			}
			this.count = this.collection.length;
			this.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('AppConfigCollection.unstore()');
			localStorage.removeItem('AppConfigCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('AppConfigCollection.isStored()');
		var storage = localStorage.getItem('AppConfigCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return AppConfigCollection;
	
})();
