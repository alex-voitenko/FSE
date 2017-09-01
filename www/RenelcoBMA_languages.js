//////////////////////////////////////////////////
// Define Language Class
//////////////////////////////////////////////////

/** Language
 * This class encapsulates a Language.
 *
 */	
/**
 * @author Hell
 */
/**
 *  Language Class Definition 
 */
var Language = (function () {
	var Language = function () {
		if(DEBUG) alert('Enter Language() Constructor...');
		this.language = null;
		this.langTable = [];
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.LanguageEvent = new CustomEvent("Language", {
				detail: {
					language: '',
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.LanguageEvent = new CustomEvent("Language", {
					detail: {
						language: '',
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.LanguageEvent = document.createEvent("CustomEvent");
				this.LanguageEvent.initCustomEvent('Language', true, false, {language: '', time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Language Constructor...');
	};

	Language.prototype = {
		reset: function() {
//		alert('Language.reset()');
			var thisLanguage = this;
			thisLanguage.language = 'ENGLISH';
		    thisLanguage.fireEvent();
		},
		load: function(lang) {
		console.log('Language.load()');
		var thisLanguage = this;
			thisLanguage.language = lang.toUpperCase();
//			if(LOCAL_DB==false) {
		
				var url = urlDataServices + "/getLanguages";
				//alert("joket: get urlDataServices" + url + " lang:" + thisLanguage.language);
				$.ajax ({
					type: "GET",
					url: url,
					data: {"lang": thisLanguage.language},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisLanguage.langTable[$this.find("ENGLISH").text()] = $this.find("CURRENT_LANG").text();
					    });
					    thisLanguage.fireEvent();
					},
					error: function(xhr, status, error) {
						alert('Something went wrong.\n' +
							  'Status: ' + status + '\n' +
							  'Error: ' + error + '\n');
					}
	
				});
//			}
//			else {
//				databaseManager.localDB.transaction(function(tx) {
//					tx.executeSql("SELECT ENGLISH, " + thisLanguage.language + " FROM LANGUAGES",
//								  [],  
//							      function (tx, rs) {
//								  	var data = rs.rows;
//									for (var i=0; i<data.length; i++) {
//										thisLanguage.langTable[data.item(i)["ENGLISH"]] = data.item(i)[thisLanguage.language];
//									}
//									thisLanguage.fireEvent();
//								  }, 
//								  function() {
//									  alert('Language LOAD Error');
//								  });
//				});
//			}
		},
		translate: function(str) {
			var thisLanguage = this;
			//alert("langTable" + JSON.stringify(thisLanguage.langTable));
			return thisLanguage.langTable[str]; 
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter Language.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter Language.removeEventListener() ...');
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
//		alert('Executing Language.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		alert('Language.AssignEvent');
		var thisLanguage = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisLanguage.objectId = new Object();
				thisLanguage.objectId = element;
				thisLanguage.objectId.addEventListener('Language', 'onLanguage', false);
			}
			else {
//				alert('It is an HTML Element');
				thisLanguage.htmlElement = element;
				document.getElementById(thisLanguage.htmlElement).addEventListener("Language", onLanguage, false);
			}
		},
		fireEvent: function() {
//		alert('Language.FireEvent');
		var thisLanguage = this;
			/* 
			 * Set Event detail information here ... 
			 */
			if (thisLanguage.objectId!=null){
//				alert('Event fired to an Object');
				thisLanguage.objectId.dispatchEvent(thisLanguage.LanguageEvent);
			}
			if(thisLanguage.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisLanguage.htmlElement).dispatchEvent(thisLanguage.LanguageEvent);
			}
		},
		store: function() {
//		alert('Language.store()');
			localStorage.setItem('Language', JSON.stringify(this));
		},
		restore: function() {
//		alert('Language.restore()');
		var thisLanguage = this;
		var item = JSON.parse(localStorage.getItem('Language'));	
			thisLanguage.language = item.language;
			thisLanguage.langTable = item.langTable;
			thisLanguage.htmlElement = item.htmlElement;
			thisLanguage.objectId = item.objectId;
			thisLanguage.LanguageEvent =item.LanguageEvent;
		},
		remove: function() {
		alert('Language.remove()');
		var thisLanguage = this;
			localStorage.removeItem('Language');
		},
		isStored: function() {
//		alert('Language.isStored()');
		var thisLanguage = this;
		var storage = localStorage.getItem('Language');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return Language;
})();
