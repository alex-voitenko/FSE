//////////////////////////////////////////////////
// Define WorkOrder_Collaborator Class
//////////////////////////////////////////////////

/** WorkOrder_Collaborator
 * This class encapsulates a WorkOrder_Collaborator.
 *
 */	
/**
 * @author Hell
 */
/**
 *  WorkOrder_Collaborator Class Definition 
 */
var WorkOrder_Collaborator = (function () {
	var WorkOrder_Collaborator = function (workorder_id, collaborator_id, workorder_status_id) {
		if(DEBUG) alert('Enter WorkOrder_Collaborator() Constructor...');
		this.workorder_id = workorder_id || -1;
		this.collaborator_id = collaborator_id || -1;
		this.workorder_status_id = workorder_status_id || -1;
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.WorkOrder_CollaboratorEvent = new CustomEvent("WorkOrder_Collaborator", {
				detail: {
					workorder_id: 0,
					collaborator_id: 0,
					workorder_status_id: 0,
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.WorkOrder_CollaboratorEvent = new CustomEvent("WorkOrder_Collaborator", {
					detail: {
						workorder_id: 0,
						collaborator_id: 0,
						workorder_status_id: 0,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.WorkOrder_CollaboratorEvent = document.createEvent("CustomEvent");
				this.WorkOrder_CollaboratorEvent.initCustomEvent('WorkOrder_Collaborator', true, false, {workorder_id: 0, collaborator_id: 0, workorder_status_id: 0, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit WorkOrder_Collaborator Constructor...');
	};

	WorkOrder_Collaborator.prototype = {
		reset: function() {
//		alert('WorkOrder_Collaborator.reset()');
			var thisWorkOrder_Collaborator = this;
			thisWorkOrder_Collaborator.workorder_id = -1;
			thisWorkOrder_Collaborator.collaborator_id = -1;
			thisWorkOrder_Collaborator.workorder_status_id = -1;
		    thisWorkOrder_Collaborator.fireEvent();
		},
		assign: function() {
//		alert('WorkOrder_Collaborator.assign()');
		var thisWorkOrder_Collaborator = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/assignCollaboratorToWorkOrder";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workorder_id": thisWorkOrder_Collaborator.workorder_id,
						   "collaborator_id": thisWorkOrder_Collaborator.collaborator_id,
						   "workorder_status_id": thisWorkOrder_Collaborator.workorder_status_id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisWorkOrder_Collaborator.id = returnedId;
					    });
					    thisWorkOrder_Collaborator.fireEvent();
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
					tx.executeSql('INSERT INTO WORKORDER_COLLABORATOR (WORKORDER_ID, COLLABORATOR_ID, WORKORDER_STATUS_ID) VALUES (?, ?, ?)', 
							      [thisWorkOrder_Collaborator.workorder_id,
								   thisWorkOrder_Collaborator.collaborator_id,
								   thisWorkOrder_Collaborator.workorder_status_id], 
							      function() {
										thisWorkOrder_Collaborator.fireEvent();	
								  }, 
							      function() {
								  	  alert('WorkOrder_Collaborator INSERT Error');
								  });
				});
			}
		},
		unassign: function() {
//		alert('WorkOrder_Collaborator.unassign()');	
		var thisWorkOrder_Collaborator = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/unassignCollaboratorFromWorkOrder";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workorder_id": thisWorkOrder_Collaborator.workorder_id,
					   	   "collaborator_id": thisWorkOrder_Collaborator.collaborator_id,
						   "workorder_status_id": thisWorkOrder_Collaborator.workorder_status_id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisWorkOrder_Collaborator.fireEvent();
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
					tx.executeSql('DELETE FROM WORKORDER_COLLABORATOR WHERE (WORKORDER_ID = ? AND COLLABORATOR_ID = ? AND WORKORDER_STATUS_ID = ?)', 
							      [thisWorkOrder_Collaborator.workorder_id,
								   thisWorkOrder_Collaborator.collaborator_id,
								   thisWorkOrder_Collaborator.workorder_status_id], 
							      function() {
										thisWorkOrder_Collaborator.fireEvent();	
								  }, 
							      function() {
								  	  alert('WorkOrder_Collaborator DELETE Error');
								  });
				});
			}
		},
		show: function() {
			var thisWorkOrder_Collaborator = this;
			alert('WorkOrder_Collaborator Data:\n' +
				  'WorkOrder Id: ' + thisWorkOrder_Collaborator.workorder_id + '\n' +
				  'Collaborator Id: ' + thisWorkOrder_Collaborator.collaborator_id + '\n' +
			  	  'WorkOrder Status Id: ' + thisWorkOrder_Collaborator.workorder_status_id + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter WorkOrder_Collaborator.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter WorkOrder_Collaborator.removeEventListener() ...');
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
//		alert('Executing WorkOrder_Collaborator.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		alert('WorkOrder_Collaborator.AssignEvent');
		var thisWorkOrder_Collaborator = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisWorkOrder_Collaborator.objectId = new Object();
				thisWorkOrder_Collaborator.objectId = element;
				thisWorkOrder_Collaborator.objectId.addEventListener('WorkOrder_Collaborator', 'onWorkOrder_Collaborator', false);
			}
			else {
//				alert('It is an HTML Element');
				thisWorkOrder_Collaborator.htmlElement = element;
				document.getElementById(thisWorkOrder_Collaborator.htmlElement).addEventListener("WorkOrder_Collaborator", onWorkOrder_Collaborator, false);
			}
		},
		fireEvent: function() {
//		alert('WorkOrder_Collaborator.FireEvent');
		var thisWorkOrder_Collaborator = this;
			if (thisWorkOrder_Collaborator.objectId!=null){
//				alert('Event fired to an Object');
				thisWorkOrder_Collaborator.objectId.dispatchEvent(thisWorkOrder_Collaborator.WorkOrder_CollaboratorEvent);
			}
			if(thisWorkOrder_Collaborator.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisWorkOrder_Collaborator.htmlElement).dispatchEvent(thisWorkOrder_Collaborator.WorkOrder_CollaboratorEvent);
			}
		},
		store: function() {
//		alert('WorkOrder_Collaborator.store()');
			localStorage.setItem('WorkOrder_Collaborator', JSON.stringify(this));
		},
		restore: function() {
//		alert('WorkOrder_Collaborator.restore()');
		var thisWorkOrder_Collaborator = this;
		var item = JSON.parse(localStorage.getItem('WorkOrder_Collaborator'));	
			thisWorkOrder_Collaborator.workorder_id = item.workorder_id;
			thisWorkOrder_Collaborator.collaborator_id = item.collaborator_id;
			thisWorkOrder_Collaborator.workorder_status_id = item.workorder_status_id;
			thisWorkOrder_Collaborator.htmlElement = item.htmlElement;
			thisWorkOrder_Collaborator.objectId = item.objectId;
			thisWorkOrder_Collaborator.WorkOrder_CollaboratorEvent = item.WorkOrder_CollaboratorEvent;
			thisWorkOrder_Collaborator.fireEvent();
		},
		unstore: function() {
		alert('WorkOrder_Collaborator.remove()');
		var thisWorkOrder_Collaborator = this;
			localStorage.removeItem('WorkOrder_Collaborator');
		},
		isStored: function() {
//		alert('WorkOrder_Collaborator.isStored()');
		var thisWorkOrder_Collaborator = this;
		var storage = localStorage.getItem('WorkOrder_Collaborator');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return WorkOrder_Collaborator;
})();


var WorkOrder_CollaboratorsCollection = (function () {
	
	var WorkOrder_CollaboratorsCollection = function () {
		if(DEBUG) alert('Enter WorkOrder_CollaboratorsCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.WorkOrder_CollaboratorsCollectionEvent = new CustomEvent("WorkOrder_CollaboratorsCollection", {
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
				this.WorkOrder_CollaboratorsCollectionEvent = new CustomEvent("WorkOrder_CollaboratorsCollection", {
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
				this.WorkOrder_CollaboratorsCollectionEvent = document.createEvent("CustomEvent");
				this.WorkOrder_CollaboratorsCollectionEvent.initCustomEvent('WorkOrder_CollaboratorsCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Constructor...');
	};

	WorkOrder_CollaboratorsCollection.prototype = {
		load: function(id) {
//		alert('load(' + id +')');
		var thisWorkOrder_CollaboratorsCollection = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getWorkOrderCollaborators";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workorder_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var key = 0;
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        item = new WorkOrder_Collaborator($this.find("WORKORDER_ID").text(),
			        										  $this.find("COLLABORATOR_ID").text(),
			        										  $this.find("WORKORDER_STATUS_ID").text());
//					        alert(JSON.stringify(item));
					        thisWorkOrder_CollaboratorsCollection.add(key++, item);
					    });
					    thisWorkOrder_CollaboratorsCollection.fireEvent();
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
					tx.executeSql('SELECT WORKORDER_ID, COLLABORATOR_ID, WORKORDER_STATUS_ID  FROM WORKORDER_COLLABORATOR WHERE WORKORDER_ID = ?',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
									for (var i=0; i<data.length; i++) {
								        var item = new WorkOrder_Collaborator(data.item(i).WORKORDER_ID, 
								        									  data.item(i).COLLABORATOR_ID,
								        									  data.item(i).WORKORDER_STATUS_ID);
//								        alert(JSON.stringify(item));
								        thisWorkOrder_CollaboratorsCollection.add(key++, item);
									}
									thisWorkOrder_CollaboratorsCollection.fireEvent();
								  }, 
								  function() {
									  alert('WorkOrder_Collaborators Collection SELECT Error');
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
//		alert('AssignEvent');
		var thisWorkOrder_CollaboratorsCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisWorkOrder_CollaboratorsCollection.objectId = new Object();
				thisWorkOrder_CollaboratorsCollection.objectId = element;
				thisWorkOrder_CollaboratorsCollection.objectId.addEventListener('WorkOrder_CollaboratorsCollection', 'onWorkOrder_CollaboratorsCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisWorkOrder_CollaboratorsCollection.htmlElement = element;
				document.getElementById(thisWorkOrder_CollaboratorsCollection.htmlElement).addEventListener("WorkOrder_CollaboratorsCollection", onWorkOrder_CollaboratorsCollection, false);
			}
			alert('AssignEvent');
		},
		fireEvent: function() {
//		alert('FireEvent');
		var thisWorkOrder_CollaboratorsCollection = this;
			thisWorkOrder_CollaboratorsCollection.WorkOrder_CollaboratorsCollectionEvent.detail.count = thisWorkOrder_CollaboratorsCollection.count;
			thisWorkOrder_CollaboratorsCollection.WorkOrder_CollaboratorsCollectionEvent.detail.items = thisWorkOrder_CollaboratorsCollection.collection;
			if (thisWorkOrder_CollaboratorsCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisWorkOrder_CollaboratorsCollection.objectId.dispatchEvent(thisWorkOrder_CollaboratorsCollection.WorkOrder_CollaboratorsCollectionEvent);
			}
			if(thisWorkOrder_CollaboratorsCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisWorkOrder_CollaboratorsCollection.htmlElement).dispatchEvent(thisWorkOrder_CollaboratorsCollection.WorkOrder_CollaboratorsCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('WorkOrder_CollaboratorsCollection.store()');
		var thisWorkOrder_CollaboratorsCollection = this;
			localStorage.setItem('WorkOrder_CollaboratorsCollection', JSON.stringify(thisWorkOrder_CollaboratorsCollection));
		},
		restore: function() {
//		if(DEBUG) alert('WorkOrder_CollaboratorsCollection.restore()');
		var thisWorkOrder_CollaboratorsCollection = this;
		var item = JSON.parse(localStorage.getItem('WorkOrder_CollaboratorsCollection'));	
			thisWorkOrder_CollaboratorsCollection.count = item.count;
			thisWorkOrder_CollaboratorsCollection.collection = item.collection;
			thisWorkOrder_CollaboratorsCollection.htmlElement = item.htmlElement;
			thisWorkOrder_CollaboratorsCollection.objectId = item.objectId;
			thisWorkOrder_CollaboratorsCollection.WorkOrder_CollaboratorsCollectionEvent = item.WorkOrder_CollaboratorsCollectionEvent;
			thisWorkOrder_CollaboratorsCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('WorkOrder_CollaboratorsCollection.unstore()');
			localStorage.removeItem('WorkOrder_CollaboratorsCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('WorkOrder_CollaboratorsCollection.isStored()');
		var storage = localStorage.getItem('WorkOrder_CollaboratorsCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return WorkOrder_CollaboratorsCollection;
	
})();


var Collaborator_WorkOrdersCollection = (function () {
	
	var Collaborator_WorkOrdersCollection = function () {
		if(DEBUG) alert('Enter Collaborator_WorkOrdersCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.Collaborator_WorkOrdersCollectionEvent = new CustomEvent("Collaborator_WorkOrdersCollection", {
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
				this.Collaborator_WorkOrdersCollectionEvent = new CustomEvent("Collaborator_WorkOrdersCollection", {
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
				this.Collaborator_WorkOrdersCollectionEvent = document.createEvent("CustomEvent");
				this.Collaborator_WorkOrdersCollectionEvent.initCustomEvent('Collaborator_WorkOrdersCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Constructor...');
	};

	Collaborator_WorkOrdersCollection.prototype = {
		load: function(id) {
		alert('load(' + id + ')');
		var thisCollaborator_WorkOrdersCollection = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getCollaboratorWorkOrders";
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
					        item = new WorkOrder_Collaborator($this.find("WORKORDER_ID").text(),
									  						  $this.find("COLLABORATOR_ID").text(),
									  						  $this.find("WORKORDER_STATUS_ID").text());
	//				        alert(JSON.stringify(item));
					        thisCollaborator_WorkOrdersCollection.add(key++, item);
					    });
					    thisCollaborator_WorkOrdersCollection.fireEvent();
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
					tx.executeSql('SELECT WORKORDER_ID, COLLABORATOR_ID, WORKORDER_STATUS_ID  FROM WORKORDER_COLLABORATOR WHERE COLLABORATOR_ID = ?',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
									for (var i=0; i<data.length; i++) {
								        var item = new WorkOrder_Collaborator(data.item(i).WORKORDER_ID, 
								        									  data.item(i).COLLABORATOR_ID,
								        									  data.item(i).WORKORDER_STATUS_ID);
								        alert(JSON.stringify(item));
								        thisCollaborator_WorkOrdersCollection.add(key++, item);
									}
									thisCollaborator_WorkOrdersCollection.fireEvent();
								  }, 
								  function() {
									  alert('Collaborator_WorkOrders Collection SELECT Error');
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
				if(this.collection[idx].workorder_id==id) {
					return this.collection[idx];
				}
			}
			return undefined;
		},
		assignEvent: function(element) {
		alert('AssignEvent');
		var thisCollaborator_WorkOrdersCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisCollaborator_WorkOrdersCollection.objectId = new Object();
				thisCollaborator_WorkOrdersCollection.objectId = element;
				thisCollaborator_WorkOrdersCollection.objectId.addEventListener('Collaborator_WorkOrdersCollection', 'onCollaborator_WorkOrdersCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisCollaborator_WorkOrdersCollection.htmlElement = element;
				document.getElementById(thisCollaborator_WorkOrdersCollection.htmlElement).addEventListener("Collaborator_WorkOrdersCollection", onCollaborator_WorkOrdersCollection, false);
			}
		},
		fireEvent: function() {
		alert('FireEvent');
		var thisCollaborator_WorkOrdersCollection = this;
			thisCollaborator_WorkOrdersCollection.Collaborator_WorkOrdersCollectionEvent.detail.count = thisCollaborator_WorkOrdersCollection.count;
			thisCollaborator_WorkOrdersCollection.Collaborator_WorkOrdersCollectionEvent.detail.items = thisCollaborator_WorkOrdersCollection.collection;
			if (thisCollaborator_WorkOrdersCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisCollaborator_WorkOrdersCollection.objectId.dispatchEvent(thisCollaborator_WorkOrdersCollection.Collaborator_WorkOrdersCollectionEvent);
			}
			if(thisCollaborator_WorkOrdersCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisCollaborator_WorkOrdersCollection.htmlElement).dispatchEvent(thisCollaborator_WorkOrdersCollection.Collaborator_WorkOrdersCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('Collaborator_WorkOrdersCollection.store()');
		var thisCollaborator_WorkOrdersCollection = this;
			localStorage.setItem('Collaborator_WorkOrdersCollection', JSON.stringify(thisCollaborator_WorkOrdersCollection));
		},
		restore: function() {
//		if(DEBUG) alert('Collaborator_WorkOrdersCollection.restore()');
		var thisCollaborator_WorkOrdersCollection = this;
		var item = JSON.parse(localStorage.getItem('Collaborator_WorkOrdersCollection'));	
			thisCollaborator_WorkOrdersCollection.count = item.count;
			thisCollaborator_WorkOrdersCollection.collection = item.collection;
			thisCollaborator_WorkOrdersCollection.htmlElement = item.htmlElement;
			thisCollaborator_WorkOrdersCollection.objectId = item.objectId;
			thisCollaborator_WorkOrdersCollection.Collaborator_WorkOrdersCollectionEvent = item.Collaborator_WorkOrdersCollectionEvent;
			thisCollaborator_WorkOrdersCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('Collaborator_WorkOrdersCollection.unstore()');
			localStorage.removeItem('Collaborator_WorkOrdersCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('Collaborator_WorkOrdersCollection.isStored()');
		var storage = localStorage.getItem('Collaborator_WorkOrdersCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return Collaborator_WorkOrdersCollection;
	
})();


////////////////////////////////////////////////////////////////////////////////////////////////////
// WorkOrder Collaborator Extended 
////////////////////////////////////////////////////////////////////////////////////////////////////

var WorkOrder_CollaboratorEx = (function () {
	var WorkOrder_CollaboratorEx = function (workorder_id, collaborator_id, workorder_status_id, name, description, startdate, enddate, site_id, customer_id, site_name, address_id, street, zip, city, state, country, latitude, longitude) {
//		alert('Enter WorkOrder_Collaborator() Constructor...');
		this.workorder_id = workorder_id || -1;
		this.collaborator_id = collaborator_id || -1;
		this.workorder_status_id = workorder_status_id || -1;
		this.name = name || '';
		this.description = description || '';
		this.startdate = startdate || '';
		this.enddate = enddate || '';
		this.site_id = site_id || -1;
		this.customer_id = customer_id || -1;
		this.site_name = site_name || '';
		this.address_id = address_id || -1;
		this.street = street || '';
		this.zip = zip || '';
		this.city = city || '';
		this.state = state || '';
		this.country = country || '';
		this.latitude = latitude || 0.000000;
		this.longitude = longitude || 0.000000;
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.WorkOrder_CollaboratorExEvent = new CustomEvent("WorkOrder_CollaboratorEx", {
				detail: {
					workorder_id: 0,
					collaborator_id: 0,
					workorder_status_id: 0,
					name: '',
					description: '',
					startdate: '',
					enddate: '',
					site_id: 0,
					customer_id: '',
					site_name: '',
					address_id: 0,
					street: '',
					zip: '',
					city: '',
					state: '',
					country: '',
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
//				alert('KitKat Device...');
				this.WorkOrder_CollaboratorExEvent = new CustomEvent("WorkOrder_CollaboratorEx", {
					detail: {
						workorder_id: 0,
						collaborator_id: 0,
						workorder_status_id: 0,
						name: '',
						description: '',
						startdate: '',
						enddate: '',
						site_id: 0,
						customer_id: '',
						site_name: '',
						address_id: 0,
						street: '',
						zip: '',
						city: '',
						state: '',
						country: '',
						latitude: 0.000000,
						longitude: 0.000000,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.WorkOrder_CollaboratorExEvent = document.createEvent("CustomEvent");
				this.WorkOrder_CollaboratorExEvent.initCustomEvent('WorkOrder_CollaboratorEx', true, false, {workorder_id: 0, collaborator_id: 0, workorder_status_id: 0, name: '', description: '', startdate: '', enddate: '', site_id: 0, customer_id: '', site_name: '', address_id: 0, street: '', zip: '', city: '', state: '', country: '', latitude: 0.000000, longitude: 0.000000, time: new Date()});
			}
		}
//		alert('Exit WorkOrder_CollaboratorEx Constructor...');
	};

	WorkOrder_CollaboratorEx.prototype = {
		reset: function() {
//		alert('WorkOrder_CollaboratorEx.reset()');
			var thisWorkOrder_CollaboratorEx = this;
			thisWorkOrder_CollaboratorEx.workorder_id = -1;
			thisWorkOrder_CollaboratorEx.collaborator_id = -1;
			thisWorkOrder_CollaboratorEx.workorder_status_id = -1;
			thisWorkOrder_CollaboratorEx.name = '';
			thisWorkOrder_CollaboratorEx.description = '';
			thisWorkOrder_CollaboratorEx.startdate = '';
			thisWorkOrder_CollaboratorEx.enddate = '';
			thisWorkOrder_CollaboratorEx.site_id = -1;
			thisWorkOrder_CollaboratorEx.customer_id = -1;
			thisWorkOrder_CollaboratorEx.site_name = '';
			thisWorkOrder_CollaboratorEx.address_id = -1;
			thisWorkOrder_CollaboratorEx.street = '';
			thisWorkOrder_CollaboratorEx.zip = '';
			thisWorkOrder_CollaboratorEx.city = '';
			thisWorkOrder_CollaboratorEx.state = '';
			thisWorkOrder_CollaboratorEx.country = '';
			thisWorkOrder_CollaboratorEx.latitude = 0.000000;
			thisWorkOrder_CollaboratorEx.longitude = 0.000000;
			thisWorkOrder_CollaboratorEx.fireEvent();
		},
		show: function() {
			var thisWorkOrder_CollaboratorEx = this;
			alert('WorkOrder_CollaboratorEx Data:\n' +
				  'WorkOrder Id: ' + thisWorkOrder_CollaboratorEx.workorder_id + '\n' +
				  'Collaborator Id: ' + thisWorkOrder_CollaboratorEx.collaborator_id + '\n' +
				  'WorkOrder Status Id: ' +  thisWorkOrder_CollaboratorEx.workorder_status_id + '\n' +
				  'WorkOrder Name: ' + thisWorkOrder_CollaboratorEx.name + '\n' +
				  'WorkOrder Description: ' + thisWorkOrder_CollaboratorEx.description + '\n' +
				  'WorkOrder Start Date: ' + thisWorkOrder_CollaboratorEx.startdate + '\n' +
				  'WorkOrder End Date: ' + thisWorkOrder_CollaboratorEx.enddate + '\n' +
				  'Site Id: ' + thisWorkOrder_CollaboratorEx.site_id + '\n' +
				  'Customer Id: ' + thisWorkOrder_CollaboratorEx.customer_id + '\n' +
				  'Site Name: ' + thisWorkOrder_CollaboratorEx.site_name + '\n' +
				  'Address Id: ' + thisWorkOrder_CollaboratorEx.address_id + '\n' +
				  'Street: ' +  thisWorkOrder_CollaboratorEx.street + '\n' +
				  'Zip: ' + thisWorkOrder_CollaboratorEx.zip + '\n' +
				  'City: ' +  thisWorkOrder_CollaboratorEx.city + '\n' +
				  'State: ' +  thisWorkOrder_CollaboratorEx.state + '\n' +
				  'Country: ' + thisWorkOrder_CollaboratorEx.country + '\n' +
				  'Latitude: ' + thisWorkOrder_CollaboratorEx.latitude + '\n' +
				  'Longitude: ' + thisWorkOrder_CollaboratorEx.longitude + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter WorkOrder_CollaboratorEx.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter WorkOrder_CollaboratorEx.removeEventListener() ...');
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
//		alert('Executing WorkOrder_CollaboratorEx.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		alert('WorkOrder_CollaboratorEx.AssignEvent');
		var thisWorkOrder_CollaboratorEx = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisWorkOrder_CollaboratorEx.objectId = new Object();
				thisWorkOrder_CollaboratorEx.objectId = element;
				thisWorkOrder_CollaboratorEx.objectId.addEventListener('WorkOrder_CollaboratorEx', 'onWorkOrder_CollaboratorEx', false);
			}
			else {
//				alert('It is an HTML Element');
				thisWorkOrder_CollaboratorEx.htmlElement = element;
				document.getElementById(thisWorkOrder_CollaboratorEx.htmlElement).addEventListener("WorkOrder_CollaboratorEx", onWorkOrder_CollaboratorEx, false);
			}
		},
		fireEvent: function() {
//		alert('WorkOrder_Collaborator.FireEvent');
		var thisWorkOrder_CollaboratorEx = this;
			if (thisWorkOrder_CollaboratorEx.objectId!=null){
//				alert('Event fired to an Object');
				thisWorkOrder_CollaboratorEx.objectId.dispatchEvent(thisWorkOrder_CollaboratorEx.WorkOrder_CollaboratorExEvent);
			}
			if(thisWorkOrder_CollaboratorEx.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisWorkOrder_CollaboratorEx.htmlElement).dispatchEvent(thisWorkOrder_CollaboratorEx.WorkOrder_CollaboratorExEvent);
			}
		},
		store: function() {
//		alert('WorkOrder_CollaboratorEx.store()');
			localStorage.setItem('WorkOrder_CollaboratorEx', JSON.stringify(this));
		},
		restore: function() {
//		alert('WorkOrder_CollaboratorEx.restore()');
		var thisWorkOrder_CollaboratorEx = this;
		var item = JSON.parse(localStorage.getItem('WorkOrder_CollaboratorEx'));	
			thisWorkOrder_CollaboratorEx.workorder_id = item.workorder_id;
			thisWorkOrder_CollaboratorEx.collaborator_id = item.collaborator_id;
			thisWorkOrder_CollaboratorEx.workorder_status_id = item.workorder_status_id;
			thisWorkOrder_CollaboratorEx.name = item.name;
			thisWorkOrder_CollaboratorEx.description = item.description;
			thisWorkOrder_CollaboratorEx.startdate = item.startdate;
			thisWorkOrder_CollaboratorEx.enddate = item.enddate;
			thisWorkOrder_CollaboratorEx.site_id = item.site_id;
			thisWorkOrder_CollaboratorEx.customer_id = item.customer_id;
			thisWorkOrder_CollaboratorEx.site_name = item.site_name;
			thisWorkOrder_CollaboratorEx.address_id = item.address_id;
			thisWorkOrder_CollaboratorEx.street = item.street;
			thisWorkOrder_CollaboratorEx.zip = item.zip;
			thisWorkOrder_CollaboratorEx.city = item.city;
			thisWorkOrder_CollaboratorEx.state = item.state;
			thisWorkOrder_CollaboratorEx.country = item.country;
			thisWorkOrder_CollaboratorEx.latitude = item.latitude;
			thisWorkOrder_CollaboratorEx.longitude = item.longitude;
			thisWorkOrder_CollaboratorEx.htmlElement = item.htmlElement;
			thisWorkOrder_CollaboratorEx.objectId = item.objectId;
			thisWorkOrder_CollaboratorEx.WorkOrder_CollaboratorExEvent = item.WorkOrder_CollaboratorExEvent;
			thisWorkOrder_CollaboratorEx.fireEvent();
		},
		unstore: function() {
		alert('WorkOrder_Collaborator.unstore()');
		var thisWorkOrder_CollaboratorEx = this;
			localStorage.removeItem('WorkOrder_CollaboratorEx');
		},
		isStored: function() {
//		alert('WorkOrder_Collaborator.isStored()');
		var thisWorkOrder_CollaboratorEx = this;
		var storage = localStorage.getItem('WorkOrder_CollaboratorEx');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return WorkOrder_CollaboratorEx;
})();


var Collaborator_WorkOrdersCollectionEx = (function () {
	
	var Collaborator_WorkOrdersCollectionEx = function () {
		if(DEBUG) alert('Enter Collaborator_WorkOrdersCollectionEx() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.Collaborator_WorkOrdersCollectionExEvent = new CustomEvent("Collaborator_WorkOrdersCollectionEx", {
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
				this.Collaborator_WorkOrdersCollectionExEvent = new CustomEvent("Collaborator_WorkOrdersCollectionEx", {
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
				this.Collaborator_WorkOrdersCollectionExEvent = document.createEvent("CustomEvent");
				this.Collaborator_WorkOrdersCollectionExEvent.initCustomEvent('Collaborator_WorkOrdersCollectionEx', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Collaborator_WorkOrdersCollectionEx() Constructor...');
	};

	Collaborator_WorkOrdersCollectionEx.prototype = {
		load: function(id) {
//		if(DEBUG) alert('load');
		var thisCollaborator_WorkOrdersCollectionEx = this;
		
			if(LOCAL_DB==false) {
			var url = urlDataServices + "/getCollaboratorWorkOrdersEx";
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
					        item = new WorkOrder_CollaboratorEx($this.find("WORKORDER_ID").text(),
					        									$this.find("COLLABORATOR_ID").text(),
					        									$this.find("WORKORDER_STATUS_ID").text(),
					        									$this.find("DESCRIPTION").text(),
					        									$this.find("STARTDATE").text(),
					        									$this.find("ENDDATE").text(),
					        									$this.find("SITE_ID").text(),
					        									$this.find("CUSTOMER_ID").text(),
					        									$this.find("SITE_NAME").text(),
					        									$this.find("ADDRESS_ID").text(),
					        									$this.find("STREET").text(),
					        									$this.find("ZIP").text(),
					        									$this.find("CITY").text(),
					        									$this.find("STATE").text(),
					        									$this.find("COUNTRY").text(),
					        									$this.find("LATITUDE").text(),
					        									$this.find("LONGITUDE").text());
	//				        alert(JSON.stringify(item));
					        thisCollaborator_WorkOrdersCollectionEx.add(key++, item);
					    });
					    thisCollaborator_WorkOrdersCollectionEx.fireEvent();
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
					tx.executeSql('SELECT WO.WORKORDER_ID, WO.WORKORDER_STATUS_ID, WO.NAME, WO.DESCRIPTION, WO.STARTDATE, WO.ENDDATE, S.SITE_ID, S.CUSTOMER_ID, S.NAME AS SITE_NAME, A.ADDRESS_ID, A.STREET, A.ZIP, A.CITY, A.STATE, A.COUNTRY, A.LATITUDE, A.LONGITUDE  ' +
								  'FROM WORKORDER WO, SITE S, ADDRESS A  ' +
								  'WHERE WO.SITE_ID=S.SITE_ID  AND S.ADDRESS_ID = A.ADDRESS_ID  AND WORKORDER_ID IN (SELECT WORKORDER_ID  FROM WORKORDER_COLLABORATOR  WHERE COLLABORATOR_ID=?) AND WORKORDER_STATUS_ID = 2 ' + 
								  'ORDER BY WO.NAME ASC ',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
									for (var i=0; i<data.length; i++) {	
								        var item = new WorkOrder_CollaboratorEx(data.item(i).WORKORDER_ID,
								        										id,
								        										data.item(i).WORKORDER_STATUS_ID,
								        										data.item(i).NAME,
								        										data.item(i).DESCRIPTION,
								        										data.item(i).STARTDATE,
								        										data.item(i).ENDDATE,
								        										data.item(i).SITE_ID,
								        										data.item(i).CUSTOMER_ID,
								        										data.item(i).SITE_NAME,
								        										data.item(i).ADDRESS_ID,
								        										data.item(i).STREET,
								        										data.item(i).ZIP,
								        										data.item(i).CITY,
								        										data.item(i).STATE,
								        										data.item(i).COUNTRY,
								        										data.item(i).LATITUDE,
								        										data.item(i).LONGITUDE);
//								        alert(JSON.stringify(item));
								        thisCollaborator_WorkOrdersCollectionEx.add(key++, item);
									}
									thisCollaborator_WorkOrdersCollectionEx.fireEvent();

								  }, 
								  function() {
									  alert('Collaborator_WorkOrders Collection Ex SELECT Error');
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
				if(this.collection[idx].workorder_id==id) {
					return this.collection[idx];
				}
			}
			return undefined;
		},
		assignEvent: function(element) {
//		if(DEBUG) alert('AssignEvent');
		var thisCollaborator_WorkOrdersCollectionEx = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisCollaborator_WorkOrdersCollectionEx.objectId = new Object();
				thisCollaborator_WorkOrdersCollectionEx.objectId = element;
				thisCollaborator_WorkOrdersCollectionEx.objectId.addEventListener('Collaborator_WorkOrdersCollectionEx', 'onCollaborator_WorkOrdersCollectionEx', false);
			}
			else {
//			alert('It is an HTML Element');
				thisCollaborator_WorkOrdersCollectionEx.htmlElement = element;
				document.getElementById(thisCollaborator_WorkOrdersCollectionEx.htmlElement).addEventListener("Collaborator_WorkOrdersCollectionEx", onCollaborator_WorkOrdersCollectionEx, false);
			}
		},
		fireEvent: function() {
		if(DEBUG) alert('FireEvent');
		var thisCollaborator_WorkOrdersCollectionEx = this;
			thisCollaborator_WorkOrdersCollectionEx.Collaborator_WorkOrdersCollectionExEvent.detail.count = thisCollaborator_WorkOrdersCollectionEx.count;
			thisCollaborator_WorkOrdersCollectionEx.Collaborator_WorkOrdersCollectionExEvent.detail.items = thisCollaborator_WorkOrdersCollectionEx.collection;
			if (thisCollaborator_WorkOrdersCollectionEx.objectId!=null){
//				alert('Event fired to an Object');
				thisCollaborator_WorkOrdersCollectionEx.objectId.dispatchEvent(thisCollaborator_WorkOrdersCollectionEx.Collaborator_WorkOrdersCollectionExEvent);
			}
			if(thisCollaborator_WorkOrdersCollectionEx.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisCollaborator_WorkOrdersCollectionEx.htmlElement).dispatchEvent(thisCollaborator_WorkOrdersCollectionEx.Collaborator_WorkOrdersCollectionExEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('Collaborator_WorkOrdersCollectionExCollection.store()');
		var thisCollaborator_WorkOrdersCollectionExCollection = this;
			localStorage.setItem('Collaborator_WorkOrdersCollectionExCollection', JSON.stringify(thisCollaborator_WorkOrdersCollectionExCollection));
		},
		restore: function() {
//		if(DEBUG) alert('Collaborator_WorkOrdersCollectionExCollection.restore()');
		var thisCollaborator_WorkOrdersCollectionExCollection = this;
		var item = JSON.parse(localStorage.getItem('Collaborator_WorkOrdersCollectionExCollection'));	
			thisCollaborator_WorkOrdersCollectionExCollection.count = item.count;
			thisCollaborator_WorkOrdersCollectionExCollection.collection = item.collection;
			thisCollaborator_WorkOrdersCollectionExCollection.htmlElement = item.htmlElement;
			thisCollaborator_WorkOrdersCollectionExCollection.objectId = item.objectId;
			thisCollaborator_WorkOrdersCollectionExCollection.Collaborator_WorkOrdersCollectionExEvent = item.Collaborator_WorkOrdersCollectionExEvent;
			thisCollaborator_WorkOrdersCollectionExCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('Collaborator_WorkOrdersCollectionExCollection.unstore()');
			localStorage.removeItem('Collaborator_WorkOrdersCollectionExCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('Collaborator_WorkOrdersCollectionExCollection.isStored()');
		var storage = localStorage.getItem('Collaborator_WorkOrdersCollectionExCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
		
	};
	return Collaborator_WorkOrdersCollectionEx;
})();


