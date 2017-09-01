//////////////////////////////////////////////////
// Define Collaborator_Activity Class
//////////////////////////////////////////////////

/** Collaborator_Activity
 * This class encapsulates a Collaborator_Activity.
 *
 */	
/**
 * @author Hell
 */
/**
 *  Collaborator_Activity Class Definition 
 */
var Collaborator_Activity = (function () {
	var Collaborator_Activity = function (collaboratorId, activityId) {
//		alert('Enter Collaborator_Activity() Constructor...');
		this.collaborator_id = collaboratorId || -1;
		this.activity_id = activityId || -1;
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.Collaborator_ActivityEvent = new CustomEvent("Collaborator_Activity", {
				detail: {
					collaborator_id: 0,
					activity_id: 0,
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.Collaborator_ActivityEvent = new CustomEvent("Collaborator_Activity", {
					detail: {
						collaborator_id: 0,
						activity_id: 0,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.Collaborator_ActivityEvent = document.createEvent("CustomEvent");
				this.Collaborator_ActivityEvent.initCustomEvent('Collaborator_Activity', true, false, {collaborator_id: 0, activity_id: 0, time: new Date()});
			}
		}
//		alert('Exit Collaborator_Activity Constructor...');
	};

	Collaborator_Activity.prototype = {
		reset: function() {
//		alert('Collaborator_Activity.reset()');
			var thisCollaborator_Activity = this;
			thisCollaborator_Activity.collaborator_id = -1;
			thisCollaborator_Activity.activity_id = -1;
		    thisCollaborator_Activity.fireEvent();
		},
		assign: function() {
//		alert('Collaborator_Activity.assign()');
		var thisCollaborator_Activity = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/addCollaboratorActivity";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"collaborator_id": thisCollaborator_Activity.collaborator_id,
						   "activity_id": thisCollaborator_Activity.activity_id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisCollaborator_Activity.id = returnedId;
					    });
					    thisCollaborator_Activity.fireEvent();
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
					tx.executeSql('INSERT INTO COLLABORATOR_ACTIVITY  (COLLABORATOR_ID, ACTIVITY_ID)  VALUES (?, ?)', 
							      [thisCollaborator_Activity.collaborator_id,
								   thisCollaborator_Activity.activity_id], 
							   	   function(tx, rs) {
										thisCollaborator_Activity.id = rs.rows.item(0).ACTIVITY_ID;
										thisCollaborator_Activity.fireEvent();	
								  }, 
							      function() {
								  	  alert('Collaborator_Activity INSERT Error');
								  });
				});
			}
		},
		unassign: function() {
			alert('Collaborator_Activity.update()');	
		var thisCollaborator_Activity = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/deleteCollaboratorActivity";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"collaborator_id": thisCollaborator_Activity.collaborator_id,
					   	   "activity_id": thisCollaborator_Activity.activity_id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisCollaborator_Activity.fireEvent();
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
					tx.executeSql('DELETE FROM COLLABORATOR_ACTIVITY  WHERE (COLLABORATOR_ID = ? AND ACTIVITY_ID = ?)', 
							      [thisCollaborator_Activity.collaborator_id,
								   thisCollaborator_Activity.activity_id], 
							      function() {
										thisCollaborator_Activity.fireEvent();	
								  }, 
							      function() {
								  	  alert('Collaborator_Activity DELETE Error');
								  });
				});
			}
		},
		show: function() {
			var thisCollaborator_Activity = this;
			alert('Collaborator_Activity Data:\n' +
				  'Collaborator Id: ' + thisCollaborator_Activity.collaborator_id + '\n' +
				  'Activity Id: ' + thisCollaborator_Activity.activity_id + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter Collaborator_Activity.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter Collaborator_Activity.removeEventListener() ...');
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
//		alert('Executing Collaborator_Activity.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		alert('Collaborator_Activity.AssignEvent');
		var thisCollaborator_Activity = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisCollaborator_Activity.objectId = new Object();
				thisCollaborator_Activity.objectId = element;
				thisCollaborator_Activity.objectId.addEventListener('Collaborator_Activity', 'onCollaborator_Activity', false);
			}
			else {
//				alert('It is an HTML Element');
				thisCollaborator_Activity.htmlElement = element;
				document.getElementById(thisCollaborator_Activity.htmlElement).addEventListener("Collaborator_Activity", onCollaborator_Activity, false);
			}
		},
		fireEvent: function() {
//		alert('Collaborator_Activity.FireEvent');
		var thisCollaborator_Activity = this;
			if (thisCollaborator_Activity.objectId!=null){
//				alert('Event fired to an Object');
				thisCollaborator_Activity.objectId.dispatchEvent(thisCollaborator_Activity.Collaborator_ActivityEvent);
			}
			if(thisCollaborator_Activity.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisCollaborator_Activity.htmlElement).dispatchEvent(thisCollaborator_Activity.Collaborator_ActivityEvent);
			}
		},
		store: function() {
//		alert('Collaborator_Activity.store()');
			localStorage.setItem('Collaborator_Activity', JSON.stringify(this));
		},
		restore: function() {
//		if(DEBUG) alert('Collaborator_Activity.restore()');
		var thisCollaborator_Activity = this;
		var item = JSON.parse(localStorage.getItem('Collaborator_Activity'));	
			thisCollaborator_Activity.collaborator_id = item.collaborator_id;
			thisCollaborator_Activity.activity_id = item.activity_id;
			thisCollaborator_Activity.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('Collaborator_Activity.unstore()');
		var thisCollaborator_Activity = this;
			localStorage.removeItem('Collaborator_Activity');
		},
		isStored: function() {
//		if(DEBUG) alert('Collaborator_Activity.isStored()');
		var thisCollaborator_Activity = this;
		var storage = localStorage.getItem('Collaborator_Activity');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return Collaborator_Activity;
})();


var Collaborator_ActivitiesCollection = (function () {
	
	var Collaborator_ActivitiesCollection = function () {
//		alert('Enter Collaborator_ActivitiesCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.Collaborator_ActivitiesCollectionEvent = new CustomEvent("Collaborator_ActivitiesCollection", {
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
				this.Collaborator_ActivitiesCollectionEvent = new CustomEvent("Collaborator_ActivitiesCollection", {
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
				this.Collaborator_ActivitiesCollectionEvent = document.createEvent("CustomEvent");
				this.Collaborator_ActivitiesCollectionEvent.initCustomEvent('Collaborator_ActivitiesCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
//		alert('Exit Collaborator_ActivitiesCollection() Constructor...');
	};

	Collaborator_ActivitiesCollection.prototype = {
		load: function(id) {
//		if(DEBUG) alert('load');
			var thisCollaborator_ActivitiesCollection = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getCollaboratorActivities";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"collaborator_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var key = 0;
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        item = new Collaborator_Activity($this.find("COLLABORATOR_ID").text(), 
					        								 $this.find("ACTIVITY_ID").text());
//					        alert(JSON.stringify(item));
					        thisCollaborator_ActivitiesCollection.add(key++, item);
					    });
					    thisCollaborator_ActivitiesCollection.fireEvent();
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
					tx.executeSql('SELECT COLLABORATOR_ID, ACTIVITY_ID  FROM COLLABORATOR_ACTIVITY  WHERE COLLABORATOR_ID = ?',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
									for (var i=0; i<data.length; i++) {
								        var item = new Collaborator_Activity(data.item(i).COLLABORATOR_ID, 
								        									 data.item(i).ACTIVITY_ID);
								        alert(JSON.stringify(item));
								        thisCollaborator_ActivitiesCollection.add(key++, item);
									}
									thisCollaborator_ActivitiesCollection.fireEvent();
								  }, 
								  function() {
									  alert('Collaborator_Activity Collection SELECT Error');
								  });
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
				if(this.collection[idx].collaborator_id==id) {
					return this.collection[idx];
				}
			}
			return undefined;
		},
		assignEvent: function(element) {
//		if(DEBUG) alert('AssignEvent');
			var thisCollaborator_ActivitiesCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisCollaborator_ActivitiesCollection.objectId = new Object();
				thisCollaborator_ActivitiesCollection.objectId = element;
				thisCollaborator_ActivitiesCollection.objectId.addEventListener('Collaborator_ActivitiesCollection', 'onCollaborator_ActivitiesCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisCollaborator_ActivitiesCollection.htmlElement = element;
				document.getElementById(thisCollaborator_ActivitiesCollection.htmlElement).addEventListener("Collaborator_ActivitiesCollection", onCollaborator_ActivitiesCollection, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) alert('FireEvent');
			var thisCollaborator_ActivitiesCollection = this;
			thisCollaborator_ActivitiesCollection.Collaborator_ActivitiesCollectionEvent.detail.count = thisCollaborator_ActivitiesCollection.count;
			thisCollaborator_ActivitiesCollection.Collaborator_ActivitiesCollectionEvent.detail.items = thisCollaborator_ActivitiesCollection.collection;
			if (thisCollaborator_ActivitiesCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisCollaborator_ActivitiesCollection.objectId.dispatchEvent(thisCollaborator_ActivitiesCollection.Collaborator_ActivitiesCollectionEvent);
			}
			if(thisCollaborator_ActivitiesCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisCollaborator_ActivitiesCollection.htmlElement).dispatchEvent(thisCollaborator_ActivitiesCollection.Collaborator_ActivitiesCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('Collaborator_ActivitiesCollection.store()');
		var thisCollaborator_ActivitiesCollection = this;
			localStorage.setItem('Collaborator_ActivitiesCollection', JSON.stringify(thisCollaborator_ActivitiesCollection));
		},
		restore: function() {
//		if(DEBUG) alert('Collaborator_ActivitiesCollection.restore()');
		var thisCollaborator_ActivitiesCollection = this;
		var item = JSON.parse(localStorage.getItem('Collaborator_ActivitiesCollection'));	
			thisCollaborator_ActivitiesCollection.count = item.count;
			thisCollaborator_ActivitiesCollection.collection = item.collection;
			thisCollaborator_ActivitiesCollection.htmlElement = item.htmlElement;
			thisCollaborator_ActivitiesCollection.objectId = item.objectId;
			thisCollaborator_ActivitiesCollection.Collaborator_ActivitiesCollectionEvent = item.Collaborator_ActivitiesCollectionEvent;
			thisCollaborator_ActivitiesCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('Collaborator_ActivitiesCollection.unstore()');
			localStorage.removeItem('Collaborator_ActivitiesCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('Collaborator_ActivitiesCollection.isStored()');
		var storage = localStorage.getItem('Collaborator_ActivitiesCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return Collaborator_ActivitiesCollection;
	
})();


var Activity_CollaboratorsCollection = (function () {
	
	var Activity_CollaboratorsCollection = function () {
//		alert('Enter Activity_CollaboratorsCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.Activity_CollaboratorsCollectionEvent = new CustomEvent("Activity_CollaboratorsCollection", {
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
				this.Activity_CollaboratorsCollectionEvent = new CustomEvent("Activity_CollaboratorsCollection", {
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
				this.Activity_CollaboratorsCollectionEvent = document.createEvent("CustomEvent");
				this.Activity_CollaboratorsCollectionEvent.initCustomEvent('Activity_CollaboratorsCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
//		alert('Exit Constructor...');
	};

	Activity_CollaboratorsCollection.prototype = {
		load: function(id) {
//			alert('load');
			var thisActivity_CollaboratorsCollection = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getActivityCollaborators";
			
				$.ajax ({
					type: "GET",
					url: url,
					data: {"activity_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var key = 0;
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        item = new Collaborator_Activity($this.find("COLLABORATOR_ID").text(), 
					        								 $this.find("ACTIVITY_ID").text());
	//				        alert(JSON.stringify(item));
					        thisActivity_CollaboratorsCollection.add(key++, item);
					    });
					    thisActivity_CollaboratorsCollection.fireEvent();
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
					tx.executeSql('SELECT COLLABORATOR_ID, ACTIVITY_ID  FROM COLLABORATOR_ACTIVITY  WHERE ACTIVITY_ID = ?',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
								  	alert('Nb of Rows: ' + data.length);
									for (var i=0; i<data.length; i++) {
								        var item = new Collaborator_Activity(data.item(i).COLLABORATOR_ID, 
								        									 data.item(i).ACTIVITY_ID);
								        thisActivity_CollaboratorsCollection.add(key++, item);
									}
									thisActivity_CollaboratorsCollection.fireEvent();
								  }, 
								  function() {
									  alert('Activity_Collaborator Collection SELECT Error');
								  });
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
				if(this.collection[idx].activity_id==id) {
					return this.collection[idx];
				}
			}
			return undefined;
		},
		assignEvent: function(element) {
//		alert('AssignEvent');
		var thisActivity_CollaboratorsCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisActivity_CollaboratorsCollection.objectId = new Object();
				thisActivity_CollaboratorsCollection.objectId = element;
				thisActivity_CollaboratorsCollection.objectId.addEventListener('Activity_CollaboratorsCollection', 'onActivity_CollaboratorsCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisActivity_CollaboratorsCollection.htmlElement = element;
				document.getElementById(thisActivity_CollaboratorsCollection.htmlElement).addEventListener("Activity_CollaboratorsCollection", onActivity_CollaboratorsCollection, false);
			}
		},
		fireEvent: function() {
//			alert('FireEvent');
			var thisActivity_CollaboratorsCollection = this;
			thisActivity_CollaboratorsCollection.Activity_CollaboratorsCollectionEvent.detail.count = thisActivity_CollaboratorsCollection.count;
			thisActivity_CollaboratorsCollection.Activity_CollaboratorsCollectionEvent.detail.items = thisActivity_CollaboratorsCollection.collection;
			if (thisActivity_CollaboratorsCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisActivity_CollaboratorsCollection.objectId.dispatchEvent(thisActivity_CollaboratorsCollection.Activity_CollaboratorsCollectionEvent);
			}
			if(thisActivity_CollaboratorsCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisActivity_CollaboratorsCollection.htmlElement).dispatchEvent(thisActivity_CollaboratorsCollection.Activity_CollaboratorsCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('Activity_CollaboratorsCollection.store()');
		var thisActivity_CollaboratorsCollection = this;
			localStorage.setItem('Activity_CollaboratorsCollection', JSON.stringify(thisActivity_CollaboratorsCollection));
		},
		restore: function() {
//			if(DEBUG) alert('Activity_CollaboratorsCollection.restore()');
		var thisActivity_CollaboratorsCollection = this;
		var item = JSON.parse(localStorage.getItem('thisActivity_CollaboratorsCollection'));	
			thisActivity_CollaboratorsCollection.count = item.count;
			thisActivity_CollaboratorsCollection.collection = item.collection;
			thisActivity_CollaboratorsCollection.htmlElement = item.htmlElement;
			thisActivity_CollaboratorsCollection.objectId = item.objectId;
			thisActivity_CollaboratorsCollection.Activity_CollaboratorsCollectionEvent = item.Activity_CollaboratorsCollectionEvent;
			thisActivity_CollaboratorsCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('Activity_CollaboratorsCollection.unstore()');
			localStorage.removeItem('Activity_CollaboratorsCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('Activity_CollaboratorsCollection.isStored()');
		var storage = localStorage.getItem('Activity_CollaboratorsCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
		
	};
	return Activity_CollaboratorsCollection;
	
})();

