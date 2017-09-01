//////////////////////////////////////////////////
// Define IntumWorkFlow Class
//////////////////////////////////////////////////

/** IntumWorkFlow
 * This class encapsulates an IntumWorkFlow.
 *
 */	
/**
 * @author Hell
 */
/**
 *  IntumWorkFlow Class Definition 
 */
var IntumWorkFlow = (function () {
	var IntumWorkFlow = function () {
		if(DEBUG) alert('Enter IntumWorkFlow() Constructor...');
		this.id = -1;
		this.pictureBeforeUrl = null;
		this.metree = null;
		this.pictureAfterUrl = null;
		this.status = this.WORKFLOW_STATES.Idle;
		this.htmlElement = null;
		this.objectId = null;
		this.selfObjectId = this;	// Self-assigned, used for internal Event Handling
		this.selfObjectId.addEventListener('IntumWOrkFlow', 'onIntumWorkFlow', false);
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.IntumWorkFlowEvent = new CustomEvent("IntumWorkFlow", {
				detail: {
					id: 0,
					pictureBefore: '',
					metree: '',
					pictureAfter: '',
					status: '',
					action: '',
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.IntumWorkFlowEvent = new CustomEvent("IntumWorkFlow", {
					detail: {
						id: 0,
						pictureBefore: '',
						metree: '',
						pictureAfter: '',
						status: '',
						action: '',
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.IntumWorkFlowEvent = document.createEvent("CustomEvent");
				this.IntumWorkFlowEvent.initCustomEvent('IntumWorkFlow', true, false, {id: 0, pictureBefore: '', metree: '', pictureAfter: '', status: '', action: '', time: new Date()});
			}
		}
		this.assignEvent(this.selfObjectId);
		if(DEBUG) alert('Exit IntumWorkFlow Constructor...');
	};

	IntumWorkFlow.prototype = {
		WORKFLOW_STATES: {Idle: 'Idle', PictureBefore: 'PictureBefore', Metrees: 'Metrees', PictureAfter:'PictureAfter', Terminated: 'Terminated'},
		reset: function() {
			var thisIntumWorkFlow = this;
			thisIntumWorkFlow.pictureBeforeUrl = null;
			thisIntumWorkFlow.metree = null;
			thisIntumWorkFlow.pictureAfterUrl = null;
			thisIntumWorkFlow.status = this.WORKFLOW_STATES.Idle;
			thisIntumWorkFlow.IntumWorkFlowEvent.detail.action = 'reset';
			thisIntumWorkFlow.fireEvent();
		},
		start: function() {
		var thisIntumWorkFlow = this;
			thisIntumWorkFlow.pictureBeforeUrl = '';
			thisIntumWorkFlow.status = this.WORKFLOW_STATES.PictureBefore;
			thisIntumWorkFlow.IntumWorkFlowEvent.detail.action = 'start';
			thisIntumWorkFlow.fireEvent();
		},
		setPictureBefore: function(pictureUrl) {
		if(DEBUG) alert('IntumWorkFlow.setPictureBefore()');
		var thisIntumWorkFlow = this;
			thisIntumWorkFlow.pictureBeforeUrl = pictureUrl;
			thisIntumWorkFlow.status = this.WORKFLOW_STATES.Metrees;
			thisIntumWorkFlow.IntumWorkFlowEvent.detail.action = 'picture_before';
			thisIntumWorkFlow.fireEvent();
		},
		setMetree: function(id) {
		if(DEBUG) alert('IntumWorkFlow.setMetree()');
		var thisIntumWorkFlow = this;
			thisIntumWorkFlow.metree_id = id;
			thisIntumWorkFlow.status = this.WORKFLOW_STATES.PictureAfter;
			thisIntumWorkFlow.IntumWorkFlowEvent.detail.action = 'metree';
			thisIntumWorkFlow.fireEvent();
		},
		cancelMetree: function() {
		if(DEBUG) alert('IntumWorkFlow.cancelMetree()');
		var thisIntumWorkFlow = this;
			thisIntumWorkFlow.metree_id = -1;
			thisIntumWorkFlow.status = this.WORKFLOW_STATES.Metrees;
			thisIntumWorkFlow.IntumWorkFlowEvent.detail.action = 'cancel_metree';
			thisIntumWorkFlow.fireEvent();
		},
		setPictureAfter: function(pictureUrl) {
		if(DEBUG) alert('IntumWorkFlow.setPictureAfter()');
		var thisIntumWorkFlow = this;
			thisIntumWorkFlow.pictureAfterUrl = pictureUrl;
			thisIntumWorkFlow.status = this.WORKFLOW_STATES.Terminated;
			thisIntumWorkFlow.IntumWorkFlowEvent.detail.action = 'picture_after';
			thisIntumWorkFlow.fireEvent();
		},
		terminate: function() {
		if(DEBUG) alert('terminate()');
		var thisIntumWorkFlow = this;
			thisIntumWorkFlow.IntumWorkFlowEvent.detail.action = 'terminate';
			thisIntumWorkFlow.fireEvent();
		},
		stop: function() {
		if(DEBUG) alert('stop()');
		var thisIntumWorkFlow = this;
			thisIntumWorkFlow.IntumWorkFlowEvent.detail.action = 'stop';
			thisIntumWorkFlow.fireEvent();
		},
		isRunning: function() {
		if(DEBUG) alert('isRunning()');
		var thisIntumWorkFlow = this;
			if(thisIntumWorkFlow.status==IntumWorkFlow.prototype.WORKFLOW_STATES.Idle ||
			   thisIntumWorkFlow.status==IntumWorkFlow.prototype.WORKFLOW_STATES.Terminated) {
				return false;
			}
			return true;
		},
		show: function() {
			var thisIntumWorkFlow = this;
			alert('IntumWorkFlow Data:\n' +
				  'Picture Before Url: ' + thisIntumWorkFlow.pictureBeforeUrl + '\n' +
				  'Metree: ' + metree.show() + '\n' + 
				  'Picture After Url: ' + thisIntumWorkFlow.pictureAfterUrl + '\n' +	
				  '\n');
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter IntumWorkFlow.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter IntumWorkFlow.removeEventListener() ...');
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
//		alert('Executing IntumWorkFlow.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
		if(DEBUG) alert('IntumWorkFlow.AssignEvent');
		var thisIntumWorkFlow = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisIntumWorkFlow.objectId = new Object();
				thisIntumWorkFlow.objectId = element;
				thisIntumWorkFlow.objectId.addEventListener('IntumWorkFlow', 'onIntumWorkFlow', false);
			}
			else {
//				alert('It is an HTML Element');
				thisIntumWorkFlow.htmlElement = element;
				document.getElementById(thisIntumWorkFlow.htmlElement).addEventListener("IntumWorkFlow", onIntumWorkFlow, false);
			}
		},
		fireEvent: function() {
		if(DEBUG) alert('IntumWorkFlow.FireEvent');
		var thisIntumWorkFlow = this;
			if (thisIntumWorkFlow.objectId!=null){
//				alert('Event fired to an Object');
				thisIntumWorkFlow.objectId.dispatchEvent(thisIntumWorkFlow.IntumWorkFlowEvent);
			}
			if(thisIntumWorkFlow.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisIntumWorkFlow.htmlElement).dispatchEvent(thisIntumWorkFlow.IntumWorkFlowEvent);
			}
		},
		onIntumWorkFlow: function(event) {
		if(DEBUG) alert('IntumWorkFlow.onIntumWorkFlow Event received...');
		if(DEBUG) alert('::::: ' + event.detail.action);
		},
		store: function() {
//		alert('IntumWorkFlow.store()');
			localStorage.setItem('IntumWorkFlow', JSON.stringify(this));
		},
		restore: function() {
//		alert('IntumWorkFlow.restore()');
		var thisIntumWorkFlow = this;
		var item = JSON.parse(localStorage.getItem('IntumWorkFlow'));	
			thisIntumWorkFlow.id = item.id;
			thisIntumWorkFlow.pictureBeforeUrl = item.pictureBeforeUrl;
			thisIntumWorkFlow.metre = item.metree;
			thisIntumWorkFlow.pictureAfterUrl = item.pictureAfterUrl;
		},
		remove: function() {
		alert('IntumWorkFlow.remove()');
		var thisIntumWorkFlow = this;
			localStorage.removeItem('IntumWorkFlow');
		},
		isStored: function() {
//		alert('IntumWorkFlow.isStored()');
		var thisIntumWorkFlow = this;
		var storage = localStorage.getItem('IntumWorkFlow');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return IntumWorkFlow;
})();

