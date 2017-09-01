//////////////////////////////////////////////////
// Define Gender Class
//////////////////////////////////////////////////

/** Gender
 * This class encapsulates a Gender.
 *
 */	
/**
 * @author Hell
 */
/**
 * Gender Class Definition 
 */
var Gender = (function () {
	var Gender = function (id, name, description) {
//		alert('Enter Gender() Constructor...');
		this.id = id || -1;
		this.name = name || '';
		this.description = description || '';
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.GenderEvent = new CustomEvent("Gender", {
				detail: {
					id: 0,
					name: '',
					description: '',
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.GenderEvent = new CustomEvent("Gender", {
					detail: {
						id: 0,
						name: '',
						description: '',
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.GenderEvent = document.createEvent("CustomEvent");
				this.GenderEvent.initCustomEvent('Gender', true, false, {id: 0, name: '', description: '', time: new Date()});
			}
		}
//		alert('Exit Gender Constructor...');
	};

	Gender.prototype = {
		reset: function() {
//		alert('Gender.reset()');
			var thisGender = this;
			thisGender.id = -1;
		    thisGender.fireEvent();
		},
		create: function() {
//		alert('Gender.create()');
		var thisGender = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/addGender";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"name": thisGender.name, 
						   "description": thisGender.description},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisGender.id = returnedId;
					    });
					    thisGender.fireEvent();
					},
					error: function(xhr, status, error) {
						alert(JSON.stringify(xhr));
						alert('Something went wrong.\n' +
							  'Status: ' + status + '\n' +
							  'Error: ' + error + '\n');
					}
				});
			}
			else {
				databaseManager.localDB.transaction(function(tx) {
					tx.executeSql('INSERT INTO GENDER  ' +
								  '(NAME, DESCRIPTION) ' +
								  'VALUES(?,?)',
								  [thisGender.name, 
								   thisGender.description],
							   	   function(tx, rs) {
										thisGender.id = rs.insertId;
										thisGender.fireEvent();
								   },
								   function() {
									   alert('Gender INSERT Error');
								   });
				});
			}
		},
		update: function() {
//		alert('Gender.update()');	
		var thisGender = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/saveGender";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"name": thisGender.name, 
					   	   "description": thisGender.description,
					   	   "gender_id": thisGender.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisGender.fireEvent();
					},
					error: function(xhr, status, error) {
						alert(JSON.stringify(xhr));
						alert('Something went wrong.\n' +
							  'Status: ' + status + '\n' +
							  'Error: ' + error + '\n');
					}
				});
			}
			else {
				databaseManager.localDB.transaction(function(tx) {
					tx.executeSql('UPDATE GENDER  ' +
								  'SET ' +
								  'NAME = ?,' +
								  'DESCRIPTION = ? ' +
								  'WHERE GENDER_ID = ?',
								  [thisGender.name,
								   thisGender.description,
								   thisGender.id],
							   	   function() {
										thisGender.fireEvent();
								   },
								   function() {
									   alert('Gender UPDATE Error');
								   });
				});
			}
		},
		suppress: function() {
//		alert('Gender.suppress()');
		var thisGender = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/deleteGender";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"gender_id": thisGender.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisGender.fireEvent();
					},
					error: function(xhr, status, error) {
						alert(JSON.stringify(xhr));
						alert('Something went wrong.\n' +
							  'Status: ' + status + '\n' +
							  'Error: ' + error + '\n');
					}
				});
			}
			else {
				databaseManager.localDB.transaction(function(tx) {
					tx.executeSql('DELETE FROM GENDER WHERE GENDER_ID = ?', 
							      [thisGender.id], 
							      function() {
										thisGender.fireEvent();	
								  }, 
							      function() {
								  	  alert('Gender DELETE Error');
								  });
				});
			}
		},
		select: function(id) {
//		alert('Gender.select(' + id + ')');
		var thisGender = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getGender";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"gender_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisGender.id = $this.find("GENDER_ID").text();
					        thisGender.name = $this.find("NAME").text();
					        thisGender.description = $this.find("DESCRIPTION").text();
					    });
					    thisGender.fireEvent();
					},
					error: function(xhr, status, error) {
						alert(JSON.stringify(xhr));
						alert('Something went wrong.\n' +
							  'Status: ' + status + '\n' +
							  'Error: ' + error + '\n');
					}
	
				});
			}
			else {
				databaseManager.localDB.transaction(function(tx) {
					tx.executeSql('SELECT GENDER_ID, NAME, DESCRIPTION  FROM GENDER WHERE GENDER_ID = ?', 
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
										thisGender.id = data.item(i).GENDER_ID;
										thisGender.name = data.item(i).NAME;
										thisGender.description = data.item(i).DESCRIPTION;
									}
									thisGender.fireEvent();
								  }, 
								  function() {
									  alert('Gender SELECT Error');
								  });
				});
			}
		},
		show: function() {
			var thisGender = this;
			alert('Gender Data:\n' +
				  'Id: ' + thisGender.id + '\n' +	
				  'Name: ' + thisGender.name + '\n' +	
				  'Description: ' + thisGender.description + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter Gender.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter Gender.removeEventListener() ...');
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
//		alert('Executing Gender.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		alert('Gender.AssignEvent');
		var thisGender = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisGender.objectId = new Object();
				thisGender.objectId = element;
				thisGender.objectId.addEventListener('Gender', 'onGender', false);
			}
			else {
//				alert('It is an HTML Element');
				thisGender.htmlElement = element;
				document.getElementById(thisGender.htmlElement).addEventListener("Gender", onGender, false);
			}
		},
		fireEvent: function() {
//		alert('Gender.FireEvent');
		var thisGender = this;
			if (thisGender.objectId!=null){
//				alert('Event fired to an Object');
				thisGender.objectId.dispatchEvent(thisGender.GenderEvent);
			}
			if(thisGender.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisGender.htmlElement).dispatchEvent(thisGender.GenderEvent);
			}
		},
		store: function() {
//		alert('Gender.store()');
			localStorage.setItem('Gender', JSON.stringify(this));
		},
		restore: function() {
//		alert('Gender.restore()');
		var thisGender = this;
		var item = JSON.parse(localStorage.getItem('Gender'));	
			thisGender.id = item.id;
			thisGender.name = item.name;
			thisGender.description = item.description;
			thisGender.htmlElement = item.htmlElement;
			thisGender.objectId = item.objectId;
			thisGender.GenderEvent = item.GenderEvent;
			thisGender.fireEvent();
		},
		unstore: function() {
		alert('Gender.unstore()');
		var thisGender = this;
			localStorage.removeItem('Gender');
		},
		isStored: function() {
//		alert('Gender.isStored()');
		var thisGender = this;
		var storage = localStorage.getItem('Gender');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return Gender;
})();


var GenderCollection = (function () {
	
	var GenderCollection = function () {
//		alert('Enter GenderCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.GenderCollectionEvent = new CustomEvent("GenderCollection", {
				detail: {
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
//				alert('KitKat Device...');
				this.GenderCollectionEvent = new CustomEvent("GenderCollection", {
					detail: {
						count: 0,
						items: undefined,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.GenderCollectionEvent = document.createEvent("CustomEvent");
				this.GenderCollectionEvent.initCustomEvent('GenderCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
//		alert('Exit Constructor...');
	};

	GenderCollection.prototype = {
		load: function() {
//		if(DEBUG) alert('load');
		var thisGenderCollection = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getGenders";
				$.ajax ({
					type: "GET",
					url: url,
					data: {},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var key = 0;
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        item = new Gender($this.find("GENDER_ID").text(),
					        				  $this.find("NAME").text(),
					        				  $this.find("DESCRIPTION").text());
	//				        alert(JSON.stringify(item));
					        thisGenderCollection.add(key++, item);
					    });
					    thisGenderCollection.fireEvent();
					},
					error: function(xhr, status, error) {
						alert(JSON.stringify(xhr));
						alert('Something went wrong.\n' +
							  'Status: ' + status + '\n' +
							  'Error: ' + error + '\n');
					}
		
				});
			}
			else {
				databaseManager.localDB.transaction(function(tx) {
					tx.executeSql('SELECT GENDER_ID, NAME, DESCRIPTION  FROM GENDER', 
						      [], 
						      function (tx, rs) {
							  	var data = rs.rows;
							  	var key = 0;
								for (var i=0; i<data.length; i++) {
							        var item = new Gender(data.item(i).GENDER_ID,
							        					  data.item(i).NAME,
							        					  data.item(i).DESCRIPTION);
//			        				alert(JSON.stringify(item));
							        thisGenderCollection.add(key++, item);
								}
								thisGenderCollection.fireEvent();
							  }, 
							  null);
				});
			}
		},
		add: function(key, item) {
			if(this.collection[key]==undefined) {
				this.collection[key]=item;
				this.count++;
			}
			else {
				alert('Item already exists ...');
			}
		},
		remove: function(key) {
			if(this.collection[key]!=undefined) {
				delete this.collection[key]
				this.count--;
			}
		},
		count: function() {
			return this.count;
		},
		item: function(key) {
			if(this.collection[key]!=undefined) {
				return this.collection[key];
			}
			return undefined;
		},
		itemById: function(id) {
			for (var idx=0; idx<this.count; idx++) {
				if(this.collection[idx].id==id) {
					return this.collection[idx];
				}
			}
			return undefined;
		},
		assignEvent: function(element) {
//			alert('AssignEvent');
			var thisGenderCollection = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisGenderCollection.objectId = new Object();
				thisGenderCollection.objectId = element;
				thisGenderCollection.objectId.addEventListener('GenderCollection', 'onGenderCollection', false);
			}
			else {
//				alert('It is an HTML Element');
				thisGenderCollection.htmlElement = element;
				document.getElementById(thisGenderCollection.htmlElement).addEventListener("GenderCollection", onGenderCollection, false);
			}
		},
		fireEvent: function() {
//		alert('FireEvent');
		var thisGenderCollection = this;
			thisGenderCollection.GenderCollectionEvent.detail.count = thisGenderCollection.count;
			thisGenderCollection.GenderCollectionEvent.detail.items = thisGenderCollection.collection;
			if (thisGenderCollection.objectId!=null){
//			alert('Event fired to an Object');
				thisGenderCollection.objectId.dispatchEvent(thisGenderCollection.GenderCollectionEvent);
			}
			if(thisGenderCollection.htmlElement!=null) {
//			alert('Event fired to an HTML Element');
				document.getElementById(thisGenderCollection.htmlElement).dispatchEvent(thisGenderCollection.GenderCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('GenderCollection.store()');
		var thisGenderCollection = this;
			localStorage.setItem('GenderCollection', JSON.stringify(thisGenderCollection));
		},
		restore: function() {
//			if(DEBUG) alert('GenderCollection.restore()');
		var thisGenderCollection = this;
		var item = JSON.parse(localStorage.getItem('GenderCollection'));	
			thisGenderCollection.count = item.count;
			thisGenderCollection.collection = item.collection;
			thisGenderCollection.htmlElement = item.htmlElement;
			thisGenderCollection.objectId = item.objectId;
			thisGenderCollection.GenderCollectionEvent = item.GenderCollectionEvent;
			thisGenderCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('GenderCollection.unstore()');
			localStorage.removeItem('GenderCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('GenderCollection.isStored()');
		var storage = localStorage.getItem('GenderCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
		
	};
	return GenderCollection;
	
})();
