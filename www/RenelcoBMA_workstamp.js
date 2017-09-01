////////////////////////////////////////////////////////////////////////////////////////////////////
// Define WorkStamp related Class
////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////
// WorkStamp Class
//////////////////////////////////////////////////

/** WorkStamp Class Definition
 * This class encapsulates a WorkStamp.
 *	
 * @author 		Hell
 * @version		1.0
 * @language 	Javascript
 */
var WorkStamp = (function () {
	var WorkStamp = function (id, collaborator_id, workorder_id, activity_id, task_id, workstamp_type_id, checkTime, latitude, longitude) {
		if(DEBUG) alert('Enter WorkStamp() Constructor...');
		this.id = id || -1;
		this.collaborator_id = collaborator_id || -1; 
		this.workorder_id = workorder_id || -1;
		this.activity_id = activity_id || -1;
		this.task_id = task_id || -1;
		this.workstamp_type_id = workstamp_type_id || -1;
		this.checkTime = checkTime || 0;
		this.latitude = latitude || 0.000000;
		this.longitude = longitude || 0.000000;
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			if(DEBUG) alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.WorkStampEvent = new CustomEvent("WorkStamp", {
				detail: {
					id: 0,
					collaborator_id: 0,
					workorder_id: 0,
					activity_id: 0,
					task_id: 0,
					workstamp_type_id: 0,
					checkTime: 0,
					latitude: 0.000000,
					longitude: 0.000000,
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				if(DEBUG) alert('KitKat Device...');
				this.WorkStampEvent = new CustomEvent("WorkStamp", {
					detail: {
						id: 0,
						collaborator_id: 0,
						workorder_id: 0,
						activity_id: 0,
						task_id: 0,
						workstamp_type_id: 0,
						checkTime: 0,
						latitude: 0.000000,
						longitude: 0.000000,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				if(DEBUG) alert('NOT a KitKat Device...');
				this.WorkStampEvent = document.createEvent("CustomEvent");
				this.WorkStampEvent.initCustomEvent('WorkStamp', true, false, {id: 0, collaborator_id: 0, workorder_id: 0, activity_id: 0, task_id: 0, workstamp_type_id: 0, checkTime: 0, latitude: 0.000000, longitude: 0.000000, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit WorkStamp Constructor...');
		console.log("exit from workstamp Constructor");
	};

	WorkStamp.prototype = {
		reset: function() {
//		if(DEBUG) alert('WorkStamp.reset()');
			var thisWorkStamp = this;
			thisWorkStamp.id = -1;
			thisWorkStamp.collaborator_id = -1;
			thisWorkStamp.workorder_id  = -1;
			thisWorkStamp.activity_id = -1;
			thisWorkStamp.task_id = -1;
			thisWorkStamp.workstamp_type_id = -1;
			thisWorkStamp.checkTime = 0;
			thisWorkStamp.latitude = 0.000000;
			thisWorkStamp.longitude = 0.000000;
		    thisWorkStamp.fireEvent();
		},
		create: function() {
		if(DEBUG) alert('WorkStamp.create()');
		var thisWorkStamp = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/addWorkStamp";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"collaborator_id": thisWorkStamp.collaborator_id, 
						   "workorder_id": thisWorkStamp.workorder_id,
						   "activity_id": thisWorkStamp.activity_id,
						   "task_id": thisWorkStamp.task_id,
					       "workstamp_type_id": thisWorkStamp.workstamp_type_id,
					       "checktime": thisWorkStamp.checkTime,
					       "latitude": thisWorkStamp.latitude,
					       "longitude": thisWorkStamp.longitude},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisWorkStamp.id = returnedId;
					    });
					    thisWorkStamp.fireEvent();
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
					tx.executeSql('INSERT INTO WORKSTAMP  ' +
								  '(COLLABORATOR_ID, WORKORDER_ID, ACTIVITY_ID, TASK_ID, WORKSTAMP_TYPE_ID, CHECKTIME, LATITUDE, LONGITUDE) ' +
								  'VALUES(?,?,?,?,?,?,?,?)',
								  [thisWorkStamp.collaborator_id,
								   thisWorkStamp.workorder_id,
								   thisWorkStamp.activity_id,
								   thisWorkStamp.task_id,
							       thisWorkStamp.workstamp_type_id,
							       thisWorkStamp.checkTime,
							       thisWorkStamp.latitude,
							       thisWorkStamp.longitude],
							   	   function(tx, rs) {
										thisWorkStamp.id = rs.insertId;
										thisWorkStamp.fireEvent();
								   },
								   function() {
									   alert('WorkStamp INSERT Error');
								   });
				});
			}
		},
		update: function() {
//		if(DEBUG) alert('WorkStamp.update()');	
		var thisWorkStamp = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/saveWorkStamp";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"collaborator_id": thisWorkStamp.collaborator_id,
						   "workorder_id": thisWorkStamp.workorder_id, 
						   "activity_id": thisWorkStamp.activity_id,
						   "task_id": thisWorkStamp.task_id,
					       "workstamp_type_id": thisWorkStamp.workstamp_type_id,
					       "checktime": thisWorkStamp.checkTime,
					       "latitude": thisWorkStamp.latitude,
					       "longitude": thisWorkStamp.longitude,
					       "workstamp_id": thisWorkStamp.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisWorkStamp.fireEvent();
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
					tx.executeSql('UPDATE WORKSTAMP  ' +
								  'SET ' +
								  'COLLABORATOR_ID = ?,' +
								  'WORKORDER_ID = ?,' +
								  'ACTIVITY_ID = ?,' +
								  'TASK_ID = ?,' +
								  'WORKSTAMP_TYPE_ID = ?,' +
								  'CHECKTIME = ?,' +
								  'LATITUDE = ?,' +
								  'LONGITUDE = ? ' +
								  'WHERE WORKSTAMP_ID = ?',
						  [thisWorkStamp.collaborator_id,
						   thisWorkStamp.workorder_id,
						   thisWorkStamp.activity_id,
						   thisWorkStamp.task_id,
					       thisWorkStamp.workstamp_type_id,
					       thisWorkStamp.checkTime,
					       thisWorkStamp.latitude,
					       thisWorkStamp.longitude,
					       thisWorkStamp.id],
					   	   function() {
								thisWorkStamp.fireEvent();
						   },
						   function() {
							   alert('WorkStamp UPDATE Error');
						   });
				});
			}
		},
		suppress: function() {
//		if(DEBUG) alert('WorkStamp.suppress()');
		var thisWorkStamp = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/deleteWorkStamp";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workstamp_id": thisWorkStamp.id,
						   "collaborator_id": thisWorkStamp.collaborator_id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisWorkStamp.fireEvent();
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
					tx.executeSql('DELETE FROM WORKSTAMP WHERE WORKSTAMP_ID = ? AND COLLABORATOR_ID = ?', 
							      [thisWorkStamp.id,
							       thisWorkStamp.collaborator_id], 
							      function() {
										thisWorkStamp.fireEvent();	
								  }, 
							      function() {
								  	  alert('WorkStamp DELETE Error');
								  });
				});
			}
		},
		select: function(workstampId, collaboratorId) {
//		if(DEBUG) alert('WorkStamp.select(' + id + ')');
		var thisWorkStamp = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getWorkStamp";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workstamp_id": workstampId,
						   "collaborator_id": collaboratorId},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisWorkStamp.id = $this.find("WORKSTAMP_ID").text();
					        thisWorkStamp.collaborator_id = $this.find("COLLABORATOR_ID").text();
					        thisWorkStamp.workorder_id = $this.find("WORKORDER_ID").text();
					        thisWorkStamp.activity_id = $this.find("ACTIVITY_ID").text();
					        thisWorkStamp.task_id = $this.find("TASK_ID").text();
					        thisWorkStamp.workstamp_type_id = $this.find("WORKSTAMP_TYPE_ID").text();
					        thisWorkStamp.checkTime = $this.find("CHECKTIME").text();
					        thisWorkStamp.latitude = $this.find("LATITUDE").text();
					        thisWorkStamp.longitude = $this.find("LONGITUDE").text();
					    });
					    thisWorkStamp.fireEvent();
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
					tx.executeSql('SELECT WORKSTAMP_ID, COLLABORATOR_ID, WORKORDER_ID, ACTIVITY_ID, TASK_ID, WORKSTAMP_TYPE_ID, CHECKTIME, LATITUDE, LONGITUDE  ' +
								  'FROM WORKSTAMP WHERE WORKSTAMP_ID = ? AND COLLABORATOR_ID = ?',
							      [workstampId, collaboratorId], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        thisWorkStamp.id = data.item(i).WORKSTAMP_ID;
								        thisWorkStamp.collaborator_id = data.item(i).COLLABORATOR_ID;
								        thisWorkStamp.workorder_id = data.item(i).WORKORDER_ID;
								        thisWorkStamp.activity_id = data.item(i).ACTIVITY_ID;
								        thisWorkStamp.task_id = data.item(i).TASK_ID;
								        thisWorkStamp.workstamp_type_id = data.item(i).WORKSTAMP_TYPE_ID;
								        thisWorkStamp.checkTime = data.item(i).CHECKTIME;
								        thisWorkStamp.latitude = data.item(i).LATITUDE;
								        thisWorkStamp.longitude = data.item(i).LONGITUDE;
									}
									thisWorkStamp.fireEvent();
								  }, 
								  function() {
									  alert('WorkStamp SELECT Error');
								  });
				});
				
			}
		},
		show: function() {
			var thisWorkStamp = this;
			alert('WorkStamp Data:\n' +
				  'Id: ' + thisWorkStamp.id + '\n' +
				  'Collaborator Id: ' + thisWorkStamp.collaborator_id + '\n' +
				  'WorkOrder Id: ' + thisWorkStamp.workorder_id + '\n' +
				  'Activity Id: ' + thisWorkStamp.activity_id + '\n' +
				  'Task Id: ' +  thisWorkStamp.task_id + '\n' +
				  'WorkStamp Type Id: ' +  thisWorkStamp.workstamp_type_id + '\n' +
				  'Check Time: ' + thisWorkStamp.checkTime + '\n' +
				  'Latitude: ' + thisWorkStamp.latitude + '\n' +
				  'Longitude: ' + thisWorkStamp.longitude + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		if(DEBUG) alert('Enter WorkStamp.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		if(DEBUG) alert('Enter WorkStamp.removeEventListener() ...');
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
//		if(DEBUG) alert('Executing WorkStamp.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		if(DEBUG) alert('WorkStamp.AssignEvent');
		var thisWorkStamp = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisWorkStamp.objectId = new Object();
				thisWorkStamp.objectId = element;
				thisWorkStamp.objectId.addEventListener('WorkStamp', 'onWorkStamp', false);
			}
			else {
//				alert('It is an HTML Element');
				thisWorkStamp.htmlElement = element;
				document.getElementById(thisWorkStamp.htmlElement).addEventListener("WorkStamp", onWorkStamp, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) alert('WorkStamp.FireEvent');
		var thisWorkStamp = this;
			thisWorkStamp.WorkStampEvent.detail.id = thisWorkStamp.id;
			thisWorkStamp.WorkStampEvent.detail.collaborator_id = thisWorkStamp.collaborator_id;
			thisWorkStamp.WorkStampEvent.detail.workorder_id = thisWorkStamp.workorder_id;
			thisWorkStamp.WorkStampEvent.detail.activity_id = thisWorkStamp.activity_id;
			thisWorkStamp.WorkStampEvent.detail.task_id = thisWorkStamp.task_id;
			thisWorkStamp.WorkStampEvent.detail.workstamp_type_id = thisWorkStamp.workstamp_type_id;
			thisWorkStamp.WorkStampEvent.detail.checkTime = thisWorkStamp.checkTime;
			thisWorkStamp.WorkStampEvent.detail.latitude = thisWorkStamp.latitude;
			thisWorkStamp.WorkStampEvent.detail.longitude = thisWorkStamp.longitude;
			if (thisWorkStamp.objectId!=null){
//				alert('Event fired to an Object');
				thisWorkStamp.objectId.dispatchEvent(thisWorkStamp.WorkStampEvent);
			}
			if(thisWorkStamp.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisWorkStamp.htmlElement).dispatchEvent(thisWorkStamp.WorkStampEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('WorkStamp.store()');
			localStorage.setItem('WorkStamp', JSON.stringify(this));
		},
		restore: function() {
//		if(DEBUG) alert('WorkStamp.restore()');
		var thisWorkStamp = this;
		var item = JSON.parse(localStorage.getItem('WorkStamp'));	
			thisWorkStamp.id = item.id;
			thisWorkStamp.collaborator_id = item.collaborator_id;
			thisWorkStamp.workorder_id = item.workorder_id;
			thisWorkStamp.activity_id = item.activity_id;
			thisWorkStamp.task_id = item.task_id;
			thisWorkStamp.workstamp_type_id = item.workstamp_type_id;
			thisWorkStamp.checkTime = item.checkTime;
			thisWorkStamp.latitude = item.latitude;
			thisWorkStamp.longitude = item.longitude;
			thisWorkStamp.htmlElement = item.htmlElement;
			thisWorkStamp.objectId = item.objectId;
			thisWorkStamp.WorkStampEvent = item.WorkStampEvent;
			thisWorkStamp.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('WorkStamp.unstore()');
		var thisWorkStamp = this;
			localStorage.removeItem('WorkStamp');
		},
		isStored: function() {
//		if(DEBUG) alert('WorkStamp.isStored()');
		var thisWorkStamp = this;
		var storage = localStorage.getItem('WorkStamp');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return WorkStamp;
})();


/** WorkStampCollection Class Definition
 * This class encapsulates a Collection of WorkStamps.
 *	
 * @author 		Hell
 * @version		1.0
 * @language 	Javascript
 */
var WorkStampCollection = (function () {
	
	var WorkStampCollection = function () {
		if(DEBUG) alert('Enter WorkStampCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			if(DEBUG) alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.WorkStampCollectionEvent = new CustomEvent("WorkStampCollection", {
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
//				if(DEBUG) alert('KitKat Device...');
				this.WorkStampCollectionEvent = new CustomEvent("WorkStampCollection", {
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
//				if(DEBUG) alert('NOT a KitKat Device...');
				this.WorkStampCollectionEvent = document.createEvent("CustomEvent");
				this.WorkStampCollectionEvent.initCustomEvent('WorkStampCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Constructor...');
	};

	WorkStampCollection.prototype = {
		load: function() {
		if(DEBUG) alert('load');
		var thisWorkStampCollection = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getWorkStamps";
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
					        item = new WorkStamp($this.find("WORKSTAMP_ID").text(),
				   					 			 $this.find("COLLABORATOR_ID").text(),
					        					 $this.find("WORKORDER_ID").text(),
									 			 $this.find("ACTIVITY_ID").text(),
		        					 			 $this.find("TASK_ID").text(),
					        					 $this.find("WORKSTAMP_TYPE_ID").text(),
					        					 $this.find("CHECKTIME").text(),
					        					 $this.find("LATITUDE").text(),
					        					 $this.find("LONGITUDE").text());
//					        alert(JSON.stringify(item));
					        thisWorkStampCollection.add(key++, item);
					    });
					    thisWorkStampCollection.fireEvent();
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
					tx.executeSql('SELECT WORKSTAMP_ID, COLLABORATOR_ID, WORKORDER_ID, ACTIVITY_ID, TASK_ID, WORKSTAMP_TYPE_ID, CHECKTIME, LATITUDE, LONGITUDE ' +
								  'FROM WORKSTAMP',
							      [], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
									for (var i=0; i<data.length; i++) {
								        var item = new WorkStamp(data.item(i).WORKSTAMP_ID,
								        						 data.item(i).COLLABORATOR_ID,
								        						 data.item(i).WOPRKORDER_ID,
								        						 data.item(i).ACTIVITY_ID,
								        						 data.item(i).TASK_ID,
								        						 data.item(i).WORKSTAMP_TYPE_ID,
								        						 data.item(i).CHECKTIME,
								        						 data.item(i).LATITUDE,
								        						 data.item(i).LONGITUDE);
//				        				alert(JSON.stringify(item));
								        thisWorkStampCollection.add(key++, item);
									}
									thisWorkStampCollection.fireEvent();
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
//		if(DEBUG) alert('AssignEvent');
		var thisWorkStampCollection = this;

			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisWorkStampCollection.objectId = new Object();
				thisWorkStampCollection.objectId = element;
				thisWorkStampCollection.objectId.addEventListener('WorkStampCollection', 'onWorkStampCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisWorkStampCollection.htmlElement = element;
				document.getElementById(thisWorkStampCollection.htmlElement).addEventListener("WorkStampCollection", onWorkStampCollection, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) alert('FireEvent');
		var thisWorkStampCollection = this;
			thisWorkStampCollection.WorkStampCollectionEvent.detail.count = thisWorkStampCollection.count;
			thisWorkStampCollection.WorkStampCollectionEvent.detail.items = thisWorkStampCollection.collection;
			if (thisWorkStampCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisWorkStampCollection.objectId.dispatchEvent(thisWorkStampCollection.WorkStampCollectionEvent);
			}
			if(thisWorkStampCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisWorkStampCollection.htmlElement).dispatchEvent(thisWorkStampCollection.WorkStampCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('WorkStampCollection.store()');
		var thisWorkStampCollection = this;
			localStorage.setItem('WorkStampCollection', JSON.stringify(thisWorkStampCollection));
		},
		restore: function() {
//		if(DEBUG) alert('WorkStampCollection.restore()');
		var thisWorkStampCollection = this;
		var item = JSON.parse(localStorage.getItem('WorkStampCollection'));	
			thisWorkStampCollection.count = item.count;
			thisWorkStampCollection.collection = item.collection;
			thisWorkStampCollection.htmlElement = item.htmlElement;
			thisWorkStampCollection.objectId = item.objectId;
			thisWorkStampCollection.WorkStampCollectionEvent = item.WorkStampCollectionEvent;
			thisWorkStampCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('WorkStampCollection.unstore()');
			localStorage.removeItem('WorkStampCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('WorkStampCollection.isStored()');
		var storage = localStorage.getItem('WorkStampCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
		
	};
	return WorkStampCollection;
	
})();
