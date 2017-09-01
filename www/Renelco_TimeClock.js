//var DEBUG = false;	//Declared somewhere else ...
var TimeClock = (function () {
	
	var TimeClock = function () {
		if(DEBUG) alert('Enter TimeClock() Constructor...');
		this.startTime = 0;
		this.currentTime = 0;
		this.elapsedTime = 0;
		this.endTime = 0;
		this.status = this.TIMECLOCK_STATES.Idle;
		this.timerId = new Object();
		this.interval = 1000;
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
		if(DEBUG) alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.timeClockEvent = new CustomEvent('TimeClock', {
				detail: {
					type: 'TimeClock',
					startTime: 0,
					currentTime: 0,
					endTime: 0,
					elapsedTime: 0,
					status: this.TIMECLOCK_STATES.Idle,
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
				if(DEBUG) alert('KitKat Device...');
				this.timeClockEvent = new CustomEvent('TimeClock', {
					detail: {
						type: 'TimeClock',
						startTime: 0,
						currentTime: 0,
						endTime: 0,
						elapsedTime: 0,
						status: this.TIMECLOCK_STATES.Idle,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
				if(DEBUG) alert('NOT a KitKat Device...');
				this.timeClockEvent = document.createEvent("CustomEvent");
				this.timeClockEvent.initCustomEvent('TimeClock', true, false, {type: 'TimeClock', startTime: 0, currentTime: 0, endTime: 0, elapsedTime: 0, status: this.TIMECLOCK_STATES.Idle, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit TimeClock() Constructor...');
	};
	TimeClock.prototype = {
		TIMECLOCK_STATES: {Idle: 'Idle', Running: 'Running', Stopped: 'Stopped'},
		reset: function() {
		if(DEBUG) alert('Timer.reset()');	
		var thisTimeClock = this;
			thisTimeClock.startTime = 0;
			thisTimeClock.currentTime = 0;
			thisTimeClock.endTime = 0;
			thisTimeClock.elapsedTime = 0;
			thisTimeClock.status = thisTimeClock.TIMECLOCK_STATES.Idle;
			thisTimeClock.fireEvent();
		},
		start: function() {
		if(DEBUG) alert('TimeClock.start()');	
		var thisTimeClock = this;
			thisTimeClock.timerId = setInterval(function () { thisTimeClock.timeOut() }, thisTimeClock.interval);
			thisTimeClock.status = thisTimeClock.TIMECLOCK_STATES.Running;
			if(thisTimeClock.startTime == 0 ) {
				thisTimeClock.startTime = new Date().getTime();
			}
			thisTimeClock.fireEvent();
		},
		stop: function() {
		if(DEBUG) alert('TimeClock.stop()');
		var thisTimeClock = this;
			thisTimeClock.currentTime = new Date().getTime();
			thisTimeClock.endTime = thisTimeClock.currentTime;
			thisTimeClock.elapsedTime = thisTimeClock.endTime - thisTimeClock.startTime;
			clearInterval(thisTimeClock.timerId);
			thisTimeClock.status = thisTimeClock.TIMECLOCK_STATES.Stopped;
//			thisTimeClock.fireEvent();
		},
		isIdle: function() {
		if(DEBUG) alert('TimeClock.isIdle()');	
		var thisTimeClock = this;
			return ((thisTimeClock.status=='Idle') ? true:false); 
		},
		isRunning: function() {
		if(DEBUG) alert('TimeClock.isRunning()');	
		var thisTimeClock = this;
			return ((thisTimeClock.status=='Running') ? true:false); 
		},
		isStopped: function() {
		if(DEBUG) alert('TimeClock.isStopped()');	
		var thisTimeClock = this;
			return ((thisTimeClock.status=='Stopped') ? true:false); 
		},
		timeOut: function() {
		if(DEBUG) alert('TimeClock.timeOut()');	
		var thisTimeClock = this;
			thisTimeClock.currentTime = new Date().getTime();
			thisTimeClock.elapsedTime = thisTimeClock.currentTime - thisTimeClock.startTime;
			thisTimeClock.fireEvent();
		},
		getDate: function() {
		if(DEBUG) alert('TimeClock.getDate()');	
		var thisTimeClock = this;
			return thisTimeClock.currentTime;
		},
		getHours: function() {
		if(DEBUG) alert('TimeClock.getHours()');	
			return thisTimeClock.elapsedTime.getHours();
		},
		getMinutes: function() {
		if(DEBUG) alert('TimeClock.getMinutes()');	
		var thisTimeClock = this;
			return thisTimeClock.currentTime.getMinutes();
		},
		getSeconds: function() {
		if(DEBUG) alert('TimeClock.getSeconds()');	
		var thisTimeClock = this;
			return thisTimeClock.currentTime.getSeconds();
		},
		isMorning: function() {
		if(DEBUG) alert('TimeClock.isMorning()');
		var thisTimeClock = this;
		var curDate = new Date(Number(thisTimeClock.currentTime));
		var hours = Number(curDate.getHours());
			if(hours<12) {
				return true;
			}
			return false;
		},
		isNoon: function() {
		if(DEBUG) alert('TimeClock.isAfternoon()');
		var thisTimeClock = this;
		var curDate = new Date(Number(thisTimeClock.currentTime));
		var hours = Number(curDate.getHours());
				if((hours>=11) && (hours<=13)) {
					return true;
				}
				return false;
		},
		isAfternoon: function() {
		if(DEBUG) alert('TimeClock.isAfternoon()');
		var thisTimeClock = this;
		var curDate = new Date(Number(thisTimeClock.currentTime));
		var hours = Number(curDate.getHours());
			if(hours>=12) {
				return true;
			}
			return false;
		},
		show: function() {
		var thisTimeClock = this;
			alert('TimeClock Data:\n' +
				  'Start Time: ' + thisTimeClock.startTime + '\n' +
				  'Current Time: ' + thisTimeClock.currentTime + '\n' +
				  'Elapsed Time: ' + thisTimeClock.elapsedTime + '\n' +
				  'End Time: ' + thisTimeClock.endTime + '\n' + 
				  'Running: ' + ((thisTimeClock.status==thisTimeClock.TIMECLOCK_STATES.Running) ? 'Yes' : 'No') + '\n');
		},
		assignEvent: function(element) {
		if(DEBUG) alert('TimeClock.assignEvent(' + element + ')');
		var thisTimeClock = this;
			if (element!==null && typeof element==='object') {
				if(DEBUG) alert('It is an Object');
				thisTimeClock.objectId = element;
				thisTimeClock.htmlElement = null;
				thisTimeClock.objectId.addEventListener('TimeClock', 'onTimeClock', false);
			}
			else {
				if(DEBUG) alert('It is an HTML Element');
				thisTimeClock.objectId = null;
				thisTimeClock.htmlElement = element;
				document.getElementById(thisTimeClock.htmlElement).addEventListener("TimeClock", onTimeClock, false);
			}
		},
		attachUI: function(htmlElement) {
		if(DEBUG) alert('Executing TimeClock.attachUI()');
			this.htmlElement = htmlElement;
		},
		addEventListener: function(name, handler, capture) {
		if(DEBUG) alert('Enter TimeClock.addEventListener() ...');
		    if (!this.events) this.events = {};
		    if (!this.events[name]) this.events[name] = [];
		    this.events[name].push(handler);
//		    alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
		if(DEBUG) alert('Enter TimeClock.removeEventListener() ...');
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
//		alert('Executing TimeClock.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
		var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		    	alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		fireEvent: function() {
		if(DEBUG) alert('TimeClock.fireEvent()');
		var thisTimeClock = this;
			thisTimeClock.timeClockEvent.detail.startTime = thisTimeClock.startTime;
			thisTimeClock.timeClockEvent.detail.endTime = thisTimeClock.endTime;
			thisTimeClock.timeClockEvent.detail.currentTime = thisTimeClock.currentTime;
			thisTimeClock.timeClockEvent.detail.elapsedTime = thisTimeClock.elapsedTime;
			thisTimeClock.timeClockEvent.detail.status = thisTimeClock.status;
			if (thisTimeClock.objectId!=null){
				if(DEBUG) alert('TimeClockEvent fired to an Object');
				thisTimeClock.objectId.dispatchEvent(thisTimeClock.timeClockEvent);
			}
			if (thisTimeClock.htmlElement!=null){
				if(DEBUG) alert('TimeClockEvent fired to an HTML Element');
				document.getElementById(thisTimeClock.htmlElement).dispatchEvent(thisTimeClock.timeClockEvent);
			}
		},
		store: function() {
		if(DEBUG) alert('TimeClock.store()');
		var thisTimeClock = this;
			localStorage.setItem('TimeClock', JSON.stringify(thisTimeClock));
		},
		restore: function() {
		if(DEBUG) alert('TimeClock.restore()');
		var thisTimeClock = this;
		var item = JSON.parse(localStorage.getItem('TimeClock'));
			thisTimeClock.startTime = item.startTime;
			thisTimeClock.currentTime = item.currentTime;
			thisTimeClock.elapsedTime = item.elapsedTime;
			thisTimeClock.endTime = item.endTime;
			thisTimeClock.status = item.status;
			thisTimeClock.interval = item.interval;
			thisTimeClock.timerId = item.timerId;
		},
		unstore: function() {
		if(DEBUG) alert('TimeClock.unstore()');
			var thisTimeClock = this;
			localStorage.removeItem('TimeClock');
		},
		isStored: function() {
		if(DEBUG) alert('TimeClock.isStored()');
		var thisTimeClock = this;
		var storage = localStorage.getItem('TimeClock');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return TimeClock;
})();
