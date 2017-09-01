//////////////////////////////////////////////////
// Define WorkStateManager Class
//////////////////////////////////////////////////

/** WorkStateManager
 * This class encapsulates a WorkStateManager.
 *
 */	
/**
 * @author Hell
 */
/**
 *  WorkStateManager Class Definition 
 */
var WorkStateManager = (function () {
	var WorkStateManager = function (state) {
		if(DEBUG) alert('Enter WorkStateManager() Constructor...');
		this.state = state || WORK_STATES.Idle;
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			if(DEBUG) alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.WorkStateManagerEvent = new CustomEvent("WorkStateManager", {
				detail: {
					state: WORK_STATES.Idle,
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				if(DEBUG) alert('KitKat Device...');
				this.WorkStateManagerEvent = new CustomEvent("WorkStateManager", {
					detail: {
						state: WORK_STATES.Idle,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				if(DEBUG) alert('NOT a KitKat Device...');
				this.WorkStateManagerEvent = document.createEvent("CustomEvent");
				this.WorkStateManagerEvent.initCustomEvent('WorkStateManager', true, false, {state: WORK_STATES.Idle, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit WorkStateManager Constructor...');
	};

	WorkStateManager.prototype = {
		WORK_STATES: {Idle: 'Idle', StartWorkingDay: 'StartWorkingDay', OnTheRoad: 'OnTheRoad', OnWorkOrder: 'OnWorkOrder', OnPreActivity: 'OnPreActivity', OnActivity: 'OnActivity', OnTask: 'OnTask', OnPause: 'onPause', EndActivity: 'EndActivity', EndWorkOrder: 'EndWorkOrder', EndWorkingDay: 'EndWorkingDay'},
		reset: function() {
//		if(DEBUG) alert('WorkStateManager.reset()');
		var thisWorkStateManager = this;
			thisWorkStateManager.state = WORK_STATES.Idle;
		    thisWorkStateManager.fireEvent();
		},
		setState: function(state) {
//		if(DEBUG) alert('WorkStateManager.setState(' + state + ')');
		var thisWorkStateManager = this;
			thisWorkStateManager.state = state;
		    thisWorkStateManager.fireEvent();
		},
		show: function() {
			var thisWorkStateManager = this;
			alert('WorkStateManager Data:\n' +
				  'Current Status: ' + thisWorkStateManager.state + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		if(DEBUG) alert('Enter WorkStateManager.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		if(DEBUG) alert('Enter WorkStateManager.removeEventListener() ...');
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
//		if(DEBUG) alert('Executing WorkStateManager.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
		var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		if(DEBUG) alert('WorkStateManager.AssignEvent');
		var thisWorkStateManager = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisWorkStateManager.objectId = new Object();
				thisWorkStateManager.objectId = element;
				thisWorkStateManager.objectId.addEventListener('WorkStateManager', 'onWorkStateManager', false);
			}
			else {
//				alert('It is an HTML Element');
				thisWorkStateManager.htmlElement = element;
				document.getElementById(thisWorkStateManager.htmlElement).addEventListener("WorkStateManager", onWorkStateManager, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) alert('WorkStateManager.FireEvent');
		var thisWorkStateManager = this;
			thisWorkStateManager.WorkStateManagerEvent.detail.state = thisWorkStateManager.state;
			if (thisWorkStateManager.objectId!=null){
//				alert('Event fired to an Object');
				thisWorkStateManager.objectId.dispatchEvent(thisWorkStateManager.WorkStateManagerEvent);
			}
			if(thisWorkStateManager.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisWorkStateManager.htmlElement).dispatchEvent(thisWorkStateManager.WorkStateManagerEvent);
			}
		},
		store: function() {
//		alert('WorkStateManager.store()');
			localStorage.setItem('WorkStateManager', JSON.stringify(this));
		},
		restore: function() {
//		alert('WorkStateManager.restore()');
		var thisWorkStateManager = this;
		var item = JSON.parse(localStorage.getItem('WorkStateManager'));	
			thisWorkStateManager.status = item.status;
		},
		remove: function() {
		alert('WorkStateManager.remove()');
		var thisWorkStateManager = this;
			localStorage.removeItem('WorkStateManager');
		},
		isStored: function() {
//		alert('WorkStateManager.isStored()');
		var thisWorkStateManager = this;
		var storage = localStorage.getItem('WorkStateManager');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return WorkStateManager;
})();

