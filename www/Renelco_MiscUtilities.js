

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function numPad(number, size) {
var s = number+"";
    while (s.length < size) s = "0" + s;
    return s;
}

var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var monthNames = [ "January", "February", "March", "April", "May", "June",
                   "July", "August", "September", "October", "November", "December" ];	

var years = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"];

function LocalDateString(d){
var curHours = (d.getHours()==23) ? 0 : d.getHours();

	function pad(n) {
		return n<10 ? '0'+n : n
	}
	
	return d.getFullYear() + '-'
	   	    + pad(d.getMonth() + 1) + '-'
	    	+ pad(d.getDate()) + ' '
	    	+ pad(curHours) + ':'
	    	+ pad(d.getMinutes()) + ':'
	    	+ pad(d.getSeconds())
}

function ISODateString(d){
var curHours = (d.getUTCHours()==23) ? 0 : d.getUTCHours() + 1;

	function pad(n) {
		return n<10 ? '0'+n : n
	}
	
	return d.getUTCFullYear() + '-'
	   	    + pad(d.getUTCMonth() + 1) + '-'
	    	+ pad(d.getUTCDate()) + ' '
	    	+ pad(curHours) + ':'
	    	+ pad(d.getUTCMinutes()) + ':'
	    	+ pad(d.getUTCSeconds())
}

function UTCToLocalDate(d) {
var retDate = new Date(d.getTime() + d.getTimezoneOffset()*60*1000);
var offset = d.getTimezoneOffset() / 60;
var hours = d.getHours();

	retDate.setHours(hours - offset);
    return retDate;   
}

function AXISTimestampString(d){
	function pad(n){
		return n<10 ? '0'+n : n
	}
	return d.getUTCFullYear() + '-'
	   	    + pad(d.getUTCMonth() + 1) + '-'
	    	+ pad(d.getUTCDate()) + 'T'
	    	+ pad(d.getUTCHours()) + ':'
	    	+ pad(d.getUTCMinutes()) + ':'
	    	+ pad(d.getUTCSeconds())
}

function getDurationString(milliseconds) {
//alert('getDurationString()');
	if(milliseconds>0) {
		var time = parseInt((milliseconds%1000)/100),
				   seconds = parseInt((milliseconds/1000)%60),
				   minutes = parseInt((milliseconds/(1000*60))%60),
				   hours = parseInt((milliseconds/(1000*60*60))%24);
		var strDuration = ((hours < 10) ? "0" + hours : hours) + ':' + 
    				  	  ((minutes < 10) ? "0" + minutes : minutes) + ':' +
    				  	  ((seconds < 10) ? "0" + seconds : seconds);
	}
	else {
		strDuration = '00:00:00';
	}
    return strDuration;
}

function getTimeString(milliseconds) {
//alert('getTimeString()');
	if(milliseconds>0) {
		var time = new Date(Number(milliseconds));
		var strTime = ((time.getHours()<10) ? '0' + time.getHours() : time.getHours()) +  ':' + 
					  ((time.getMinutes()<10) ? '0' + time.getMinutes() : time.getMinutes()) + ':' + 
					  ((time.getSeconds()<10) ? '0' + time.getSeconds() : time.getSeconds());
	}
	else {
		strTime = '00:00:00';
	}
	return strTime;
}

function getDateString(d) {
var strYear = String(d.getFullYear());
var strMonth = ((d.getMonth()+1)<10) ? String('0'+(d.getMonth()+1)) : String(d.getMonth()+1);
var strDay = ((d.getDate())<10) ? String('0'+(d.getDate())) : String(d.getDate());
var	strResult = strYear + strMonth + strDay;

	return (strResult);
}

function getDateTimeString(d) {
var strYear = String(d.getFullYear());
var strMonth = ((d.getMonth()+1)<10) ? String('0'+(d.getMonth()+1)) : String(d.getMonth()+1);
var strDay = ((d.getDate())<10) ? String('0'+(d.getDate())) : String(d.getDate());
var strHours = (d.getHours()<10) ? String('0'+d.getHours()) : String(d.getHours());
var strMinutes = (d.getMinutes()<10) ? String('0'+d.getMinutes()) : String(d.getMinutes());
var strSeconds = (d.getSeconds()<10) ? String('0'+d.getSeconds()) : String(d.getSeconds());	
var	strResult = strYear + strMonth + strDay + '-' + strHours + strMinutes + strSeconds;

	return (strResult);
}

function isMorning(milliseconds) {
//alert('isMorning(' + milliseconds + ')');
var curTime = new Date(Number(milliseconds));
var hours = Number(curTime.getHours());
	if(hours<12) {
		return true;
	}
	return false;
}

function isAfternoon(milliseconds) {
//alert('isAfternoon(' + milliseconds + ')');
var curTime = new Date(Number(milliseconds));
var hours = Number(curTime.getHours());
	if(hours>=12) {
		return true;
	}
	return false;
}


function retrieveURL(filename) {
    var scripts = document.getElementsByTagName('script');
    if (scripts && scripts.length > 0) {
        for (var i in scripts) {
            if (scripts[i].src && scripts[i].src.match(new RegExp(filename+'\\.js$'))) {
                return scripts[i].src.replace(new RegExp('(.*)'+filename+'\\.js$'), '$1');
            }
        }
    }
}

var ElementUIWrapper = (function() {
	var ElementUIWrapper = function(id) {
		this.elementId = id || null;
		this.active = true;
	};
	ElementUIWrapper.prototype = {
		enable: function() {
		var thisElWrapper = this;
			if(thisElWrapper.elementId!=null) {
				$('#' + thisElWrapper.elementId).css('pointer-events', 'auto');
				thisElWrapper.active = true;
			}
		},
		disable: function() {
		var thisElWrapper = this;
			if(thisElWrapper.elementId!=null) {
				$('#' + thisElWrapper.elementId).css('pointer-events', 'none');
				thisElWrapper.active = false;
			}
		},
		show: function() {
		var thisElWrapper = this;
			if(thisElWrapper.elementId!=null) {
				$('#' + thisElWrapper.elementId).css('visibility', 'visible');
				thisElWrapper.active = true;
			}
		},
		hide: function() {
		var thisElWrapper = this;
			if(thisElWrapper.elementId!=null) {
				$('#' + thisElWrapper.elementId).css('visibility', 'hidden');
				thisElWrapper.active = false;
			}
		},
		isActive: function() {
		var thisElWrapper = this;
			return thisElWrapper.active;
		},
		info: function() {
//		alert('ElementUIWrapper.info()');
		var thisElWrapper = this;
		var status = (thisElWrapper.active==true) ? 'Active' : 'Inactive';
			alert('Element Id: ' + thisElWrapper.elementId + '\n' +
				  'Current State: ' + status + '\n');
		}
	};
	return ElementUIWrapper;
})();

var CheckUIWrapper = (function() {
	var CheckUIWrapper = function(id, imgUncheckedURL, border) {
//	if(DEBUG) alert('Enter Constructor CheckUIWrapper(' + id + ', ' + imgUncheckedURL + ', ' + border + ')...');	
		this.checkId = id || null;
		this.checkedImageURL; 
		this.uncheckedImageURL = imgUncheckedURL || null;
		this.border = border || 1;
		this.checked = false;
		if(this.checkId!=null) {
			this.checkedImageURL = $('#' + this.checkId).attr('src');
		}
//	if(DEBUG) alert('Exit Constructor CheckUIWrapper()...');
	};
	CheckUIWrapper.prototype = {
		check: function() {
		if(DEBUG) alert('CheckUIWrapper.check()');
		var thisChkWrapper = this;
			if(thisChkWrapper.checkId!=null) {
				$('#'+ thisChkWrapper.checkId).attr('src', thisChkWrapper.checkedImageURL);
				$('#'+ thisChkWrapper.checkId).css('pointer-events', 'none');
				thisChkWrapper.checked = true;
			}
		},
		uncheck: function() {
		if(DEBUG) alert('CheckUIWrapper.uncheck()');
		var thisChkWrapper = this;
			if(thisChkWrapper.checkId!=null) {
				$('#'+ thisChkWrapper.checkId).attr('src', thisChkWrapper.uncheckedImageURL);
				$('#'+ thisChkWrapper.checkId).css('pointer-events', 'none');
				thisChkWrapper.checked = false;
			}
		},
		isChecked: function() {
		if(DEBUG) alert('CheckUIWrapper.isChecked()');
		var thisChkWrapper = this;
			return thisChkWrapper.checked;
		},
		show: function() {
		if(DEBUG) alert('CheckUIWrapper.show()');
		var thisChkWrapper = this;
			if(thisChkWrapper.checkId!=null) {
				$('#'+ thisChkWrapper.checkId).css('visibility', 'visible');
			}
		},
		hide: function() {
		if(DEBUG) alert('CheckUIWrapper.hide()');
		var thisChkWrapper = this;
			if(thisChkWrapper.checkId!=null) {
				$('#'+ thisChkWrapper.checkId).css('visibility', 'hidden');
			}
		},
		info: function() {
		if(DEBUG) alert('CheckUIWrapper.info()');
		var thisChkWrapper = this;
		var status = (thisChkWrapper.checked==true) ? 'Checked' : 'Unchecked';
			alert('CheckBox Id: ' + thisChkWrapper.checkId + '\n' +
				  'Current State: ' + status + '\n');
		}
	};
	return CheckUIWrapper;
})();

var ButtonUIWrapper = (function() {
	var ButtonUIWrapper = function(id, imgInactiveURL, border) {
//	if(DEBUG) alert('Enter Constructor ButtonUIWrapper(' + id + ', ' + imgInactiveURL + ', ' + border + ')...');	
		this.buttonId = id || null;
		this.label;
		this.activeImageURL; 
		this.inactiveImageURL = imgInactiveURL || null;
		this.border = border || 1;
		this.active = true;
		if(this.buttonId!=null) {
			this.activeImageURL = $('#' + this.buttonId).attr('src');
			this.label = $('#' + this.buttonId).html();
		}
//	if(DEBUG) alert('Exit Constructor ButtonUIWrapper()...');
	};
	ButtonUIWrapper.prototype = {
		setActiveImage: function(imgURL) {
		var thisBtnWrapper = this;
			thisBtnWrapper.activeImageURL = imgURL;
			if(thisBtnWrapper.buttonId!=null) {
				$('#'+ thisBtnWrapper.buttonId).css('-webkit-border-image', 'url(' + thisBtnWrapper.activeImageURL + ') ' + thisBtnWrapper.border + ' ' + thisBtnWrapper.border + ' ' + thisBtnWrapper.border + ' ' + thisBtnWrapper.border + ' stretch stretch');
			}
		},
		setLabel: function(label) {
//		if(DEBUG) alert('ButtonWrapper.setLabel(' + label + ')');
		var thisBtnWrapper = this;
			thisBtnWrapper.label = label;
			if(thisBtnWrapper.buttonId!=null) {
				$('#' + thisBtnWrapper.buttonId).html(thisBtnWrapper.label);
			}
		},
		enable: function() {
//		if(DEBUG) alert('ButtonUIWrapper.enable()');
		var thisBtnWrapper = this;
			if(thisBtnWrapper.buttonId!=null) {
				$('#'+ thisBtnWrapper.buttonId).attr('src', thisBtnWrapper.activeImageURL);
				$('#'+ thisBtnWrapper.buttonId).css('pointer-events', 'auto');
				thisBtnWrapper.active = true;
			}
		},
		disable: function() {
//		if(DEBUG) alert('ButtonUIWrapper.disable()');
		var thisBtnWrapper = this;
			if(thisBtnWrapper.buttonId!=null) {
				if(thisBtnWrapper.inactiveImageURL!=null) {
					$('#'+ thisBtnWrapper.buttonId).attr('src', thisBtnWrapper.inactiveImageURL);
				}
				$('#'+ thisBtnWrapper.buttonId).css('pointer-events', 'none');
				thisBtnWrapper.active = false;
			}
		},
		isActive: function() {
		var thisBtnWrapper = this;
			return thisBtnWrapper.active;
		},
		show: function() {
//		if(DEBUG) alert('ButtonUIWrapper.show()');
		var thisBtnWrapper = this;
			if(thisBtnWrapper.buttonId!=null) {
				$('#'+ thisBtnWrapper.buttonId).css('visibility', 'visible');
			}
		},
		hide: function() {
//		if(DEBUG) alert('ButtonUIWrapper.hide()');
		var thisBtnWrapper = this;
			if(thisBtnWrapper.buttonId!=null) {
				$('#'+ thisBtnWrapper.buttonId).css('visibility', 'hidden');
			}
		},
		info: function() {
//		if(DEBUG) alert('ButtonUIWrapper.info()');
		var thisBtnWrapper = this;
		var status = (thisBtnWrapper.active==true) ? 'Active' : 'Inactive';
			alert('Button Id: ' + thisBtnWrapper.buttonId + '\n' +
				  'Label: ' + thisBtnWrapper.label + '\n' +	
				  'Active Image URL: ' + thisBtnWrapper.activeImageURL + '\n' +
				  'Inactive Image URL: ' + thisBtnWrapper.inactiveImageURL +'\n' +
				  'Current State: ' + status + '\n');
		}
	};
	return ButtonUIWrapper;
})();


/**
 *  ButtonUIWrapper Class Helpers used to derived new Class from base Class Address
 */
Function.prototype.subclass= function(base) {
    var c= Function.prototype.subclass.nonconstructor;
    c.prototype= base.prototype;
    this.prototype= new c();
};
Function.prototype.subclass.nonconstructor= function() {};

/**
 * LangButtonUIWrapper Class derived from ButtonUIWrapper
 */
function LangButtonUIWrapper(id, imgInactiveURL, border, selected) {
	ButtonUIWrapper.call(this, id, imgInactiveURL, border);
	this.selected = selected || false;
};

LangButtonUIWrapper.subclass(ButtonUIWrapper) ;

LangButtonUIWrapper.prototype = {
	enable: function() {
		ButtonUIWrapper.prototype.enable.call(this);
	},	
	disable: function() {
		ButtonUIWrapper.prototype.disable.call(this);
	},
	show: function() {
		ButtonUIWrapper.prototype.show.call(this);
	},
	hide: function() {
		ButtonUIWrapper.prototype.hide.call(this);
	},
	isActive: function() {
		return ButtonUIWrapper.prototype.isActive.call(this);
	},
	select : function(sel) {
	if(DEBUG) console.log('LangButtonUIWrapper.select()');
	var thisLangButtonUIWrapper = this;
			
		if(sel==true) {
			$('#'+ thisLangButtonUIWrapper.buttonId).css('-webkit-transform', 'scale(1.25, 1.25)');	
			thisLangButtonUIWrapper.selected = true;
		}
		else {
			$('#'+ thisLangButtonUIWrapper.buttonId).css('-webkit-transform', 'scale(1.0, 1.0)');	
			thisLangButtonUIWrapper.selected = false;
		}
	},
	isSelected : function() {
	if(DEBUG) console.log('LangButtonUIWrapper.isSelected()');
	var thisLangButtonUIWrapper = this;
	
		return thisLangButtonUIWrapper.selected;
	}
};


var ToolbarUIWrapper = (function() {
	var ToolbarUIWrapper = function(id) {
//	if(DEBUG) console.log('Enter Constructor ToolbarUIWrapper(' + id + ')...');	
		this.toolbarId = id || null;
		this.visible = false;
		this.active = false;
//	if(DEBUG) console.log('Exit Constructor ToolbarUIWrapper()...');
	};
	ToolbarUIWrapper.prototype = {
		enable: function() {
//		if(DEBUG) console.log('ToolbarUIWrapper.enable()');
		var thisToolbarWrapper = this;
			if(thisToolbarWrapper.toolbarId!=null) {
				$('#'+ thisToolbarWrapper.toolbarId).css('pointer-events', 'auto');
				thisToolbarWrapper.active = true;
			}
			phoneui.preprocessDOM(phoneui.getCurrentPageId());
//			phoneui.forceLayout();
		},
		disable: function() {
//		if(DEBUG) console.log('ToolbarUIWrapper.disable()');
		var thisToolbarWrapper = this;
			if(thisToolbarWrapper.toolbarId!=null) {
				$('#'+ thisToolbarWrapper.toolbarId).css('pointer-events', 'none');
				thisToolbarWrapper.active = false;
			}
			phoneui.preprocessDOM(phoneui.getCurrentPageId());
//			phoneui.forceLayout();
		},
		isActive: function() {
		var thisToolbarWrapper = this;
			return thisToolbarWrapper.active;
		},
		show: function() {
//		if(DEBUG) console.log('ToolbarUIWrapper.show()');
		var thisToolbarWrapper = this;
			if(thisToolbarWrapper.toolbarId!=null) {
				$('#'+ thisToolbarWrapper.toolbarId).css('visibility', 'visible');
			}
		},
		hide: function() {
//		if(DEBUG) console.log('ToolbarUIWrapper.hide()');
		var thisToolbarWrapper = this;
			if(thisToolbarWrapper.toolbarId!=null) {
				$('#'+ thisToolbarWrapper.toolbarId).css('visibility', 'hidden');
			}
		},
		info: function() {
//		if(DEBUG) console.log('ToolbarUIWrapper.info()');
		var thisToolbarWrapper = this;
		var status = (thisToolbarWrapper.active==true) ? 'Active' : 'Inactive';
			alert('Toolbar Id: ' + thisToolbarWrapper.toolbarId + '\n' +
				  'Current State: ' + status + '\n');
		}
	};
	return ToolbarUIWrapper;
})();

