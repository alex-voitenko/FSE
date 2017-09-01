//////////////////////////////////////////////////
// Define Activity Class
//////////////////////////////////////////////////

/** Activity
 * This class encapsulates a Activity.
 *
 */	
/**
 * @author Hell
 */
/**
 *  Activity Class Definition 
 */
var Activity = (function () {
	var Activity = function (id, name, description) {
		if(DEBUG) alert('Enter Activity() Constructor...');
		this.id = id || -1;
		this.name = name || '';
		this.description = description || '';
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//		if(DEBUG) alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.ActivityEvent = new CustomEvent("Activity", {
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
//			if(DEBUG) alert('KitKat Device...');
				this.ActivityEvent = new CustomEvent("Activity", {
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
//			if(DEBUG) alert('NOT a KitKat Device...');
				this.ActivityEvent = document.createEvent("CustomEvent");
				this.ActivityEvent.initCustomEvent('Activity', true, false, {id: 0, name: '', description: '', time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Activity Constructor...');
	};
	Activity.prototype = {
		reset: function() {
//		if(DEBUG) alert('Activity.reset()');
			var thisActivity = this;
			thisActivity.id = -1;
			thisActivity.name = '';
			thisActivity.description = '';
		    thisActivity.fireEvent();
		},
		create: function() {
//		if(DEBUG) alert('Activity.create()');
		var thisActivity = this;
			
			if(LOCAL_DB==false) {
			var url = urlDataServices + "/addActivity";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"name": thisActivity.name, 
					       "description": thisActivity.description},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisActivity.id = returnedId;
					    });
					    thisActivity.fireEvent();
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
					tx.executeSql('INSERT INTO ACTIVITY  ' +
								  '(NAME, DESCRIPTION) ' +
								  'VALUES(?,?)',
								  [thisActivity.name, 
							       thisActivity.description],
							   	   function(tx, rs) {
										thisActivity.id = rs.insertId;
										thisActivity.fireEvent();
								   },
								   function() {
									   alert('Activity INSERT Error');
								   });
				});
			}
		},
		update: function() {
//		if(DEBUG) alert('Activity.update()');	
			var thisActivity = this;
			if(LOCAL_DB==false) {
				var url = urlDataService + "/saveActivity";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"name": thisActivity.name, 
					       "description": thisActivity.description, 
					       "activity_id": thisActivity.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisActivity.fireEvent();
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
					tx.executeSql('UPDATE ACTIVITY ' +
								  'SET ' +
								  'NAME = ?,' +
								  'DESCRIPTION = ? ' +
								  'WHERE ACTIVITY_ID = ?',
								  [thisActivity.name,
								   thisActivity.description,
							   	   thisActivity.id],
							   	   function() {
										thisActivity.fireEvent();
								   },
								   function() {
									   alert('Activity UPDATE Error');
								   });
				});
			}
		},
		suppress: function() {
//		if(DEBUG) alert('Activity.suppress()');
			var thisActivity = this;
			if(LOCAL_DB==false) {
				var url = urlDataService + "/deleteActivity";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"activity_id": thisActivity.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisActivity.fireEvent();
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
					tx.executeSql('DELETE FROM ACTIVITY WHERE ACTIVITY_ID = ?', 
							      [thisActivity.id], 
							      function() {
									  thisActivity.fireEvent();	
								  }, 
							      function() {
								  	  alert('Activity DELETE Error');
								  });
				});
			}
			
		},
		select: function(id) {
//		if(DEBUG) alert('Activity.select(' + id + ')');
		var thisActivity = this;

			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getActivity";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"activity_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisActivity.id = $this.find("ACTIVITY_ID").text();
					        thisActivity.name = $this.find("NAME").text();
					        thisActivity.description = $this.find("DESCRIPTION").text();
					    });
					    thisActivity.fireEvent();
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
					tx.executeSql('SELECT ACTIVITY_ID, NAME, DESCRIPTION FROM ACTIVITY WHERE ACTIVITY_ID = ?', 
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
										thisActivity.id = data.item(i).ACTIVITY_ID;
										thisActivity.name = data.item(i).NAME;
										thisActivity.description = data.item(i).DESCRIPTION;
									}
									thisActivity.fireEvent();
								  }, 
								  function() {
									  alert('Activity SELECT Error');
								  });
				});
			}
		},
		show: function() {
			var thisActivity = this;
			alert('Activity Data:\n' +
				  'Id: ' + this.id + '\n' +	
				  'Name: ' + this.name + '\n' +	
				  'Description: ' + this.description + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		if(DEBUG) alert('Enter Activity.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		if(DEBUG) alert('Enter Activity.removeEventListener() ...');
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
//		if(DEBUG) alert('Executing Activity.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		if(DEBUG) alert('Activity.AssignEvent');
		var thisActivity = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisActivity.objectId = new Object();
				thisActivity.objectId = element;
				thisActivity.objectId.addEventListener('Activity', 'onActivity', false);
			}
			else {
//				alert('It is an HTML Element');
				thisActivity.htmlElement = element;
				document.getElementById(thisActivity.htmlElement).addEventListener("Activity", onActivity, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) alert('Activity.FireEvent');
		var thisActivity = this;
			thisActivity.ActivityEvent.detail.id = thisActivity.id;
			thisActivity.ActivityEvent.detail.name = thisActivity.name;
			thisActivity.ActivityEvent.detail.description = thisActivity.description;
			if (thisActivity.objectId!=null){
//				alert('Event fired to an Object');
				thisActivity.objectId.dispatchEvent(thisActivity.ActivityEvent);
			}
			if(thisActivity.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisActivity.htmlElement).dispatchEvent(thisActivity.ActivityEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('Activity.store()');
		var data = {id: this.id, name: this.name, description: this.description };
			localStorage.setItem('Activity', JSON.stringify(data));
		},
		restore: function() {
//		if(DEBUG) alert('Activity.restore()');
		var thisActivity = this;
		var item = JSON.parse(localStorage.getItem('Activity'));	
			thisActivity.id = item.id;
			thisActivity.name = item.name;
			thisActivity.description = item.description;
			thisActivity.fireEvent();
		},
		unstore: function() {
//		if(DEBUG) alert('Activity.unstore()');
		var thisActivity = this;
			localStorage.removeItem('Activity');
		},
		isStored: function() {
//		if(DEBUG) alert('Activity.isStored()');
		var thisActivity = this;
		var storage = localStorage.getItem('Activity');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return Activity;
})();


var ActivityCollection = (function () {
	
	var ActivityCollection = function () {
	if(DEBUG) alert('Enter ActivityCollection() Constructor...');
		this.count = 0;
		this.collection = [];
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//		if(DEBUG) alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.ActivityCollectionEvent = new CustomEvent("ActivityCollection", {
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
//			if(DEBUG) alert('KitKat Device...');
				this.ActivityCollectionEvent = new CustomEvent("ActivityCollection", {
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
//			if(DEBUG) alert('NOT a KitKat Device...');
				this.ActivityCollectionEvent = document.createEvent("CustomEvent");
				this.ActivityCollectionEvent.initCustomEvent('ActivityCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Constructor...');
	};

	ActivityCollection.prototype = {
		load: function(id) {
		if(DEBUG) alert('ActivityCollection.load()');
			var thisActivityCollection = this;
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getActivities";
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
					        item = new Activity($this.find("ACTIVITY_ID").text(),
					        				    $this.find("NAME").text(),
					        				    $this.find("DESCRIPTION").text());
	//				        alert(JSON.stringify(item));
					        thisActivityCollection.add(item);
					    });
					    thisActivityCollection.fireEvent();
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
					tx.executeSql('SELECT ACTIVITY_ID, NAME, DESCRIPTION  FROM ACTIVITY', 
							      [], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        var item = new Activity(data.item(i).ACTIVITY_ID,
								        		data.item(i).NAME,
								        		data.item(i).DESCRIPTION);
//				        				alert(JSON.stringify(item));
								        thisActivityCollection.add(item);
									}
									thisActivityCollection.fireEvent();
								  }, 
								   function(error) {
									   alert('ActivityCollection SELECT Error');
								   });
				});
			}
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
		var result  = this.collection.filter(function(o){return o.id == id;} );
			result ? this.collection.splice(this.collection.indexOf(result[0]), 1) : alert('Item not found ...');
		},
		exist: function(item) {
		if(DEBUG) alert('ActivityTypeCollection.exist()');
			if($.grep(this.collection, function(e) { return e.id == item.id; }).length===0) {
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
		var result  = this.collection.filter(function(o){return o.id == id;} );
			return result ? result[0] : null; // or undefined			
		},
		assignEvent: function(element) {
//		if(DEBUG) alert('AssignEvent');
		var thisActivityCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisActivityCollection.objectId = new Object();
				thisActivityCollection.objectId = element;
				thisActivityCollection.objectId.addEventListener('ActivityCollection', 'onActivityCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisActivityCollection.htmlElement = element;
				document.getElementById(thisActivityCollection.htmlElement).addEventListener("ActivityCollection", onActivityCollection, false);
			}
		},
		setLocalDatabase: function(database) {
		alert('setLocalData()');
		var thisActivityCollection = this;
			thisActivityCollection.localDatabase = database.localDB;
			thisActivityCollection.localDatabase.transaction(function(tx) {
				for(var idx=0; idx<thisActivityCollection.count; idx++) {
					tx.executeSql('INSERT INTO ACTIVITY (ACTIVITY_ID, NAME, DESCRIPTION) VALUES (?,?,?)', [thisActivityCollection.collection[idx].id, thisActivityCollection.collection[idx].name, thisActivityCollection.collection[idx].description]);
				}
			});
		},
		fireEvent: function() {
//		if(DEBUG) alert('FireEvent');
		var thisActivityCollection = this;
			thisActivityCollection.ActivityCollectionEvent.detail.count = thisActivityCollection.count;
			thisActivityCollection.ActivityCollectionEvent.detail.items = thisActivityCollection.collection;
			if (thisActivityCollection.objectId!=null){
//			alert('Event fired to an Object');
				thisActivityCollection.objectId.dispatchEvent(thisActivityCollection.ActivityCollectionEvent);
			}
			if(thisActivityCollection.htmlElement!=null) {
//			alert('Event fired to an HTML Element');
				document.getElementById(thisActivityCollection.htmlElement).dispatchEvent(thisActivityCollection.ActivityCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('ActivityCollection.store()');
			localStorage.setItem('ActivityCollection', JSON.stringify(this.collection));
		},
		restore: function() {
//		if(DEBUG) alert('ActivityCollection.restore()');
		var objects = JSON.parse(localStorage.getItem('ActivityCollection'));
			this.clear();
			for(var idx=0; idx<objects.length; idx++) { 
				var item = new Activity(objects[idx].id, objects[idx].name, objects[idx].description);
				this.add(item);
			}
			this.count = this.collection.length;
			this.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('ActivityCollection.unstore()');
			localStorage.removeItem('ActivityCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('ActivityCollection.isStored()');
		var storage = localStorage.getItem('ActivityCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return ActivityCollection;
	
})();
