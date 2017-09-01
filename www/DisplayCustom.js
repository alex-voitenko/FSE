const DIGIT_COLOR_RED = 1;
const DIGIT_COLOR_GREEN = 2;
const DIGIT_COLOR_BLUE = 3;
const DIGIT_COLOR_YELLOW = 4;
const DIGIT_COLOR_ORANGE = 5;
const DIGIT_COLOR_GRAY = 6;



const CLOCK_4DIGITS = 4;
const CLOCK_6DIGITS = 6;

var Digit = (function() {
	var Digit = function(color) {
//		alert('Enter Digit() Constructor...');
		this.color = color || DIGIT_COLOR_RED;
		this.value = 0;
		if(this.color==DIGIT_COLOR_RED) {
			this.digits = ['images/BoldRedDigit_0.png', 
						   'images/BoldRedDigit_1.png',
						   'images/BoldRedDigit_2.png',
						   'images/BoldRedDigit_3.png',
						   'images/BoldRedDigit_4.png',
						   'images/BoldRedDigit_5.png',
						   'images/BoldRedDigit_6.png',
						   'images/BoldRedDigit_7.png',
						   'images/BoldRedDigit_8.png',
						   'images/BoldRedDigit_9.png'];
		}
		else if(this.color==DIGIT_COLOR_GREEN) {
			this.digits = ['images/BoldGreenDigit_0.png', 
						   'images/BoldGreenDigit_1.png',
						   'images/BoldGreenDigit_2.png',
						   'images/BoldGreenDigit_3.png',
						   'images/BoldGreenDigit_4.png',
						   'images/BoldGreenDigit_5.png',
						   'images/BoldGreenDigit_6.png',
						   'images/BoldGreenDigit_7.png',
						   'images/BoldGreenDigit_8.png',
						   'images/BoldGreenDigit_9.png'];
		}
		else if(this.color==DIGIT_COLOR_BLUE) {
			this.digits = ['images/BoldBlueDigit_0.png', 
						   'images/BoldBlueDigit_1.png',
						   'images/BoldBlueDigit_2.png',
						   'images/BoldBlueDigit_3.png',
						   'images/BoldBlueDigit_4.png',
						   'images/BoldBlueDigit_5.png',
						   'images/BoldBlueDigit_6.png',
						   'images/BoldBlueDigit_7.png',
						   'images/BoldBlueDigit_8.png',
						   'images/BoldBlueDigit_9.png'];
		}
		else if(this.color==DIGIT_COLOR_YELLOW) {
			this.digits = ['images/BoldYellowDigit_0.png', 
						   'images/BoldYellowDigit_1.png',
						   'images/BoldYellowDigit_2.png',
						   'images/BoldYellowDigit_3.png',
						   'images/BoldYellowDigit_4.png',
						   'images/BoldYellowDigit_5.png',
						   'images/BoldYellowDigit_6.png',
						   'images/BoldYellowDigit_7.png',
						   'images/BoldYellowDigit_8.png',
						   'images/BoldYellowDigit_9.png'];
		}
		else if(this.color==DIGIT_COLOR_ORANGE) {
			this.digits = ['images/BoldOrangeDigit_0.png', 
						   'images/BoldOrangeDigit_1.png',
						   'images/BoldOrangeDigit_2.png',
						   'images/BoldOrangeDigit_3.png',
						   'images/BoldOrangeDigit_4.png',
						   'images/BoldOrangeDigit_5.png',
						   'images/BoldOrangeDigit_6.png',
						   'images/BoldOrangeDigit_7.png',
						   'images/BoldOrangeDigit_8.png',
						   'images/BoldOrangeDigit_9.png'];
		}
		else {
			this.digits = ['images/BoldGrayDigit_0.png', 
						   'images/BoldGrayDigit_1.png',
						   'images/BoldGrayDigit_2.png',
						   'images/BoldGrayDigit_3.png',
						   'images/BoldGrayDigit_4.png',
						   'images/BoldGrayDigit_5.png',
						   'images/BoldGrayDigit_6.png',
						   'images/BoldGrayDigit_7.png',
						   'images/BoldGrayDigit_8.png',
						   'images/BoldGrayDigit_9.png'];
		}
		this.htmlElement = new Object();
		this.events = {};
//		alert('Exit Constructor...');
	};

	Digit.prototype = {
		display: function() {
//		alert('Executing Digit.display(' + this.digits[this.value] + ')');
			thisDigit = this;
			$('#'+thisDigit.htmlElement).attr('src', thisDigit.digits[thisDigit.value]);
		},
		attachUI: function(htmlElement) {
//		alert('Executing Digit.attachUI()');
			thisDigit = this;
			thisDigit.htmlElement = htmlElement;
//			alert('HTMLElement: ' + thisDigit.htmlElement);
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter Digit.addEventListener() ...');
		    if (!this.events) this.events = {};
		    if (!this.events[name]) this.events[name] = [];
		    this.events[name].push(handler);
//		   	alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter Digit.removeEventListener() ...');
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
//			alert('Executing Digit.dispatchEvent(' + JSON.stringify(event) + ') ...');
//			alert('Digit Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		    	alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		onDisplayValueChange: function(event) {
//			alert('Event Digit.onDisplayValueChange Received: \n' + event.detail.value);
			thisDigit = this;
			thisDigit.value = event.detail.value;
			thisDigit.display();
		}
	};
	return Digit;
})();

var Points = (function() {
	var Points = function(color) {
//		alert('Enter Points Constructor...');
		this.color = color || DIGIT_COLOR_RED;
		this.status = 0;
		if(this.color==DIGIT_COLOR_RED) {
			this.digits = ['images/BoldRedDigit_2PointsOff.png',
			               'images/BoldRedDigit_2Points.png'];
		}
		else if(this.color==DIGIT_COLOR_GREEN) {
			this.digits = ['images/BoldGreenDigit_2PointsOff.png',
			               'images/BoldGreenDigit_2Points.png'];
		}
		else if(this.color==DIGIT_COLOR_BLUE) {
			this.digits = ['images/BoldBlueDigit_2PointsOff.png',
			               'images/BoldBlueDigit_2Points.png'];
		}
		else if(this.color==DIGIT_COLOR_YELLOW) {
			this.digits = ['images/BoldYellowDigit_2PointsOff.png',
			               'images/BoldYellowDigit_2Points.png'];
		}
		else if(this.color==DIGIT_COLOR_ORANGE) {
			this.digits = ['images/BoldOrangeDigit_2PointsOff.png',
			               'images/BoldOrangeDigit_2Points.png'];
		}
		else {
			this.digits = ['images/BoldGrayDigit_2PointsOff.png',
			               'images/BoldGrayDigit_2Points.png'];
		}
		this.htmlElement = new Object();
		this.events = {};
//		alert('Exit Points Constructor...');
	};

	Points.prototype = {
		on: function() {
//		alert('Executing Points.on()');
			thisPoints = this;
			thisPoints.status = 1;
			thisPoints.display();
		},
		off: function() {
//		alert('Executing Points.off()');
			thisPoints = this;
			thisPoints.status = 0;
			thisPoints.display();
		},
		isOn: function() {
//		alert('Executing Points.isOn()');
			thisPoints = this;
			return (thisPoints.status==1) ? true : false;
		},
		toggle: function() {
//		alert('Executing Points.toggle()');
			thisPoints = this;
			(thisPoints.status==1) ? (thisPoints.status=0) : (thisPoints.status=1);
			thisPoints.display();
		},
		display: function() {
//		alert('Executing Points.display(' + this.digits[this.status] + ')');
			thisPoints = this;
			$('#'+thisPoints.htmlElement).attr('src', thisPoints.digits[thisPoints.status]);
		},
		attachUI: function(htmlElement) {
//		alert('Executing Points.attachUI()');
			thisPoints = this;
			thisPoints.htmlElement = htmlElement;
//			alert('HTMLElement: ' + thisPoints.htmlElement);
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter Points.addEventListener() ...');
		    if (!this.events) this.events = {};
		    if (!this.events[name]) this.events[name] = [];
		    this.events[name].push(handler);
//		   	alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter Points.removeEventListener() ...');
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
//			alert('Executing dispatchEvent(' + JSON.stringify(event) + ') ...');
//			alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		    	alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		onDisplayValueChange: function(event) {
			alert('Event Points.onClockDisplay Received: ' + event.detail.value + ' ...');
//			thisPoints = this;
//			thisPoints.value = event.detail.value;
//			thisPoints.display();
		}
	};
	return Points;
})();


var ClockDisplay = (function () {
	var ClockDisplay = function(nbDigits, color) {
//		alert('Enter ClockDisplay() Constructor...');
		this.nbDigits = nbDigits || CLOCK_4DIGITS;
		this.color = color || DIGIT_COLOR_RED;
		this.digits = new Array();
		for(var key=0; key<this.nbDigits; key++) {
			var digit = new Digit(this.color); 
			this.digits.push(digit);
			this.assignEvent(this.digits[key]);
		}
		this.points = new Points(this.color);
		
		this.objectId = new Object();
		this.htmlElement = new Object();
		
		this.clock = new Object();
		
		this.events = {};
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.ClockDisplayEvent = new CustomEvent('ClockDisplay', {
				detail: {
					type: 'ClockDisplay',
					value: 0, 
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.ClockDisplayEvent = new CustomEvent('ClockDisplay', {
					detail: {
						type: 'ClockDisplay',
						value: 0,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.ClockDisplayEvent = document.createEvent("CustomEvent");
				this.ClockDisplayEvent.initCustomEvent('ClockDisplay', true, false, {type: 'ClockDisplay', value: 0, time: new Date()});
			}
		}
//		alert(JSON.stringify(this.digits));
//		alert('Exit Constructor... ');
	};

	ClockDisplay.prototype = {
		attachUI: function(position, htmlElement) {
//		alert('ClockDisplay.attachUI(' + position + ', ' + htmlElement + ')');
		var thisClockDisplay = this;
			if(position>0) {
//				alert('ClockDisplay.attachUI('+ position + ', '+htmlElement+')');
				thisClockDisplay.digits[position-1].attachUI(htmlElement);
			}
			else {
//				alert('ClockDisplay.attachUI('+ position + ', '+htmlElement+')');
				thisClockDisplay.points.attachUI(htmlElement);
			}
		},
		show: function() {
//		alert('ClockDisplay.show()');
		var thisClockDisplay = this;
			for(idx=0; idx <thisClockDisplay.digits.length; idx++) {
				thisClockDisplay.digits[idx].display();
			}
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter Digit.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter Digit.removeEventListener() ...');
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
//		alert('Executing Digit.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
		var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		alert('ClockDisplay.AssignEvent ' + element);
		var thisClockDisplay = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisClockDisplay.objectId = element;
				thisClockDisplay.htmlElement = null;
				thisClockDisplay.objectId.addEventListener('ClockDisplay', 'onDisplayValueChange', false);
			}
			else {
//				alert('It is an HTML Element');
				thisClockDisplay.objectId = null;
				thisClockDisplay.htmlElement = element;
				document.getElementById(thisClockDisplay.htmlElement).addEventListener("ClockDisplay", onDisplayValueChange, false);
			}
		},
		fireEvent: function() {
//		alert('ClockDisplay.FireEvent: ' + this.clock);
		var thisClockDisplay = this;
			switch(thisClockDisplay.nbDigits) {
			case CLOCK_4DIGITS:
//				alert('FireEvent CLOCK_4DIGITS ...');
				thisClockDisplay.ClockDisplayEvent.detail.value = thisClockDisplay.clock.getMinutes()%10;
//				alert('Event for Digit #0: ' + JSON.stringify(thisClockDisplay.ClockDisplayEvent));
				thisClockDisplay.digits[0].dispatchEvent(thisClockDisplay.ClockDisplayEvent);
				thisClockDisplay.ClockDisplayEvent.detail.value = Math.floor(thisClockDisplay.clock.getMinutes()/10);
//				alert('Event for Digit #1: ' + JSON.stringify(thisClockDisplay.ClockDisplayEvent));
				thisClockDisplay.digits[1].dispatchEvent(thisClockDisplay.ClockDisplayEvent);
				thisClockDisplay.ClockDisplayEvent.detail.value = thisClockDisplay.clock.getHours()%10;
//				alert('Event for Digit #2: ' + JSON.stringify(thisClockDisplay.ClockDisplayEvent));
				thisClockDisplay.digits[2].dispatchEvent(thisClockDisplay.ClockDisplayEvent);
				thisClockDisplay.ClockDisplayEvent.detail.value = Math.floor(thisClockDisplay.clock.getHours()/10);
//				alert('Event for Digit #3: ' + JSON.stringify(thisClockDisplay.ClockDisplayEvent));
				thisClockDisplay.digits[3].dispatchEvent(thisClockDisplay.ClockDisplayEvent);
				thisClockDisplay.points.toggle();
				break;
			case CLOCK_6DIGITS:
//				alert('FireEvent CLOCK_6DIGITS ...');
				thisClockDisplay.ClockDisplayEvent.detail.value = thisClockDisplay.clock.getSeconds()%10;
//				alert('Event for Digit #0: ' + JSON.stringify(thisClockDisplay.ClockDisplayEvent));
				thisClockDisplay.digits[0].dispatchEvent(thisClockDisplay.ClockDisplayEvent);
				thisClockDisplay.ClockDisplayEvent.detail.value = Math.floor(thisClockDisplay.clock.getSeconds()/10);
//				alert('Event for Digit #1: ' + JSON.stringify(thisClockDisplay.ClockDisplayEvent));
				thisClockDisplay.digits[1].dispatchEvent(thisClockDisplay.ClockDisplayEvent);
				thisClockDisplay.ClockDisplayEvent.detail.value = thisClockDisplay.clock.getMinutes()%10;
//				alert('Event for Digit #2: ' + JSON.stringify(thisClockDisplay.ClockDisplayEvent));
				thisClockDisplay.digits[2].dispatchEvent(thisClockDisplay.ClockDisplayEvent);
				thisClockDisplay.ClockDisplayEvent.detail.value = Math.floor(thisClockDisplay.clock.getMinutes()/10);
//				alert('Event for Digit #3: ' + JSON.stringify(thisClockDisplay.ClockDisplayEvent));
				thisClockDisplay.digits[3].dispatchEvent(thisClockDisplay.ClockDisplayEvent);
				thisClockDisplay.ClockDisplayEvent.detail.value = thisClockDisplay.clock.getHours()%10;
//				alert('Event for Digit #4: ' + JSON.stringify(thisClockDisplay.ClockDisplayEvent));
				thisClockDisplay.digits[4].dispatchEvent(thisClockDisplay.ClockDisplayEvent);
				thisClockDisplay.ClockDisplayEvent.detail.value = Math.floor(thisClockDisplay.clock.getHours()/10);
//				alert('Event for Digit #5: ' + JSON.stringify(thisClockDisplay.ClockDisplayEvent));
				thisClockDisplay.digits[5].dispatchEvent(thisClockDisplay.ClockDisplayEvent);
				thisClockDisplay.points.toggle();
				break;
			}
		},
		onClock: function(event) {
//		alert('ClockDisplay.onClock Event Received ...');
		var thisClockDisplay = this;
			thisClockDisplay.clock = event.detail.value;
			thisClockDisplay.fireEvent();
		},
	};
	
	return ClockDisplay;
})();


var TimerDisplay = (function () {
	var TimerDisplay = function(nbDigits, color) {
//		alert('Enter TimerDisplay() Constructor...');
		this.nbDigits = nbDigits || CLOCK_4DIGITS;
		this.color = color || DIGIT_COLOR_RED;
		this.digits = new Array();
		for(var key=0; key<this.nbDigits; key++) {
			var digit = new Digit(this.color); 
			this.digits.push(digit);
			this.assignEvent(this.digits[key]);
		}
		this.points = new Array();
		var points1 = new Points(this.color);
		this.points.push(points1);
		var points2 = new Points(this.color);
		this.points.push(points2);
		
		this.objectId = new Object();
		this.htmlElement = new Object();
		
		this.timer = new Object();
		
		this.events = {};
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.TimerDisplayEvent = new CustomEvent('TimerDisplay', {
				detail: {
					type: 'TimerDisplay',
					value: 0, 
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.TimerDisplayEvent = new CustomEvent('TimerDisplay', {
					detail: {
						type: 'TimerDisplay',
						value: 0,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.TimerDisplayEvent = document.createEvent("CustomEvent");
				this.TimerDisplayEvent.initCustomEvent('TimerDisplay', true, false, {type: 'TimerDisplay', value: 0, time: new Date()});
			}
		}
//		alert(JSON.stringify(this.digits));
//		alert('Exit Constructor... ');
	};

	TimerDisplay.prototype = {
		attachUI: function(position, htmlElement) {
//		alert('ClockDisplay.attachUI(' + position + ', ' + htmlElement + ')');
		var thisTimerDisplay = this;
			if(position>0) {
//				alert('TimerDisplay.attachUI('+ position + ', '+htmlElement+')');
				thisTimerDisplay.digits[position-1].attachUI(htmlElement);
			}
			else {
//				alert('TimerDisplay.attachUI('+ position + ', '+htmlElement+')');
				if(position==0) {
					thisTimerDisplay.points[position].attachUI(htmlElement);
				}
				else if(position==-1) {
					position = 1;
					thisTimerDisplay.points[position].attachUI(htmlElement);
				}
			}
		},
		show: function() {
//		alert('TimerDisplay.show()');
		var thisTimerDisplay = this;
			for(idx=0; idx <thisTimerDisplay.digits.length; idx++) {
				thisTimerDisplay.digits[idx].display();
			}
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter Digit.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter Digit.removeEventListener() ...');
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
//		alert('Executing Digit.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
		var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		alert('TimerDisplay.AssignEvent ' + element);
		var thisTimerDisplay = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisTimerDisplay.objectId = element;
				thisTimerDisplay.htmlElement = null;
				thisTimerDisplay.objectId.addEventListener('TimerDisplay', 'onDisplayValueChange', false);
			}
			else {
//				alert('It is an HTML Element');
				thisTimerDisplay.objectId = null;
				thisTimerDisplay.htmlElement = element;
				document.getElementById(thisTimerDisplay.htmlElement).addEventListener("TimerDisplay", onDisplayValueChange, false);
			}
		},
		fireEvent: function() {
		if(DEBUG) alert('TimerDisplay.FireEvent: ' + this.timer);
		var thisTimerDisplay = this;
		var elapsedHours = Math.floor(thisTimerDisplay.timer/3600);
//		alert('elapsedHours: ' + elapsedHours);
		var elapsedMinutes = Math.floor((thisTimerDisplay.timer - (elapsedHours * 3600))/60);
//		alert('elapsedMinutes: ' + elapsedMinutes);
		var elapsedSeconds = Math.floor((thisTimerDisplay.timer - (elapsedHours * 3600) - (elapsedMinutes * 60)));
//		alert('elapsedSeconds: ' + elapsedSeconds);
			switch(thisTimerDisplay.nbDigits) {
			case CLOCK_4DIGITS:
//				alert('FireEvent CLOCK_4DIGITS ...');
				thisTimerDisplay.TimerDisplayEvent.detail.value = elapsedMinutes%10;
//				alert('Event for Digit #0: ' + JSON.stringify(thisTimerDisplay.TimerDisplayEvent));
				thisTimerDisplay.digits[0].dispatchEvent(thisTimerDisplay.TimerDisplayEvent);
				thisTimerDisplay.TimerDisplayEvent.detail.value = Math.floor(elapsedMinutes/10);
//				alert('Event for Digit #1: ' + JSON.stringify(thisTimerDisplay.TimerDisplayEvent));
				thisTimerDisplay.digits[1].dispatchEvent(thisTimerDisplay.TimerDisplayEvent);
				thisTimerDisplay.TimerDisplayEvent.detail.value = elapsedHours%10;
//				alert('Event for Digit #2: ' + JSON.stringify(thisTimerDisplay.TimerDisplayEvent));
				thisTimerDisplay.digits[2].dispatchEvent(thisTimerDisplay.TimerDisplayEvent);
				thisTimerDisplay.TimerDisplayEvent.detail.value = Math.floor(elapsedHours/10);
//				alert('Event for Digit #3: ' + JSON.stringify(thisClockDisplay.ClockDisplayEvent));
				thisTimerDisplay.digits[3].dispatchEvent(thisTimerDisplay.TimerDisplayEvent);
				thisTimerDisplay.points[0].on();
				break;
			case CLOCK_6DIGITS:
//				alert('FireEvent CLOCK_6DIGITS ...');
				thisTimerDisplay.TimerDisplayEvent.detail.value = elapsedSeconds%10;
//				alert('Event for Digit #0: ' + JSON.stringify(thisTimerDisplay.TimerDisplayEvent));
				thisTimerDisplay.digits[0].dispatchEvent(thisTimerDisplay.TimerDisplayEvent);
				thisTimerDisplay.TimerDisplayEvent.detail.value = Math.floor(elapsedSeconds/10);
//				alert('Event for Digit #1: ' + JSON.stringify(thisTimerDisplay.TimerDisplayEvent));
				thisTimerDisplay.digits[1].dispatchEvent(thisTimerDisplay.TimerDisplayEvent);
				thisTimerDisplay.TimerDisplayEvent.detail.value = elapsedMinutes%10;
//				alert('Event for Digit #2: ' + JSON.stringify(thisClockDisplay.ClockDisplayEvent));
				thisTimerDisplay.digits[2].dispatchEvent(thisTimerDisplay.TimerDisplayEvent);
				thisTimerDisplay.TimerDisplayEvent.detail.value = Math.floor(elapsedMinutes/10);
//				alert('Event for Digit #3: ' + JSON.stringify(thisTimerDisplay.TimerDisplayEvent));
				thisTimerDisplay.digits[3].dispatchEvent(thisTimerDisplay.TimerDisplayEvent);
				thisTimerDisplay.TimerDisplayEvent.detail.value = elapsedHours%10;
//				alert('Event for Digit #4: ' + JSON.stringify(thisTimerDisplay.TimerDisplayEvent));
				thisTimerDisplay.digits[4].dispatchEvent(thisTimerDisplay.TimerDisplayEvent);
				thisTimerDisplay.TimerDisplayEvent.detail.value = Math.floor(elapsedHours/10);
//				alert('Event for Digit #5: ' + JSON.stringify(thisTimerDisplay.TimerDisplayEvent));
				thisTimerDisplay.digits[5].dispatchEvent(thisTimerDisplay.TimerDisplayEvent);
				thisTimerDisplay.points[0].on();
				thisTimerDisplay.points[1].on();
				break;
			}
		},
		onTimer: function(event) {
//		alert('TimerDisplay.onTimer Event Received ...');
		var thisTimerDisplay = this;
//			alert('##### ' + JSON.stringify(event));
			thisTimerDisplay.timer = event.detail.elapsedTime/1000;
			thisTimerDisplay.fireEvent();
		},
		onTimeClock: function(event) {
		if(DEBUG) alert('TimerDisplay.onTimeClock Event Received ...');
		var thisTimerDisplay = this;
//			alert('##### ' + JSON.stringify(event));
			thisTimerDisplay.timer = event.detail.elapsedTime/1000;
			thisTimerDisplay.fireEvent();
		}
	};
	
	return TimerDisplay;
})();
