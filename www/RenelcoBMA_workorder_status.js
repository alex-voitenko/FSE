//////////////////////////////////////////////////
// Define WorkOrderStatus Class
//////////////////////////////////////////////////

/** WorkOrderStatus
 * This class encapsulates a WorkOrderStatus.
 *
 */	
/**
 * @author Hell
 */
/**
 *  WorkOrderStatus Class Definition 
 */

var WorkOrderStatus = (function () {
	var WorkOrderStatus = function (id, name, description) {
		if(DEBUG) alert('Enter WorkOrderStatus() Constructor...');
		this.id = id || -1;
		this.name = name || '';
		this.description = description || '';
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.WorkOrderStatusEvent = new CustomEvent("WorkOrderStatus", {
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
				this.WorkOrderStatusEvent = new CustomEvent("WorkOrderStatus", {
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
				this.WorkOrderStatusEvent = document.createEvent("CustomEvent");
				this.WorkOrderStatusEvent.initCustomEvent('WorkOrderStatus', true, false, {id: 0, name: '', description: '', time: new Date()});
			}
		}
		if(DEBUG) alert('Exit WorkOrderStatus Constructor...');
	};

	WorkOrderStatus.prototype = {
		reset: function() {
//		alert('WorkOrderStatus.reset()');
			var thisWorkOrderStatus = this;
			thisWorkOrderStatus.id = -1;
			thisWorkOrderStatus.name = '';
			thisWorkOrderStatus.description = '';	
		    thisWorkOrderStatus.fireEvent();
		},
		create: function() {
//		if(DEBUG) alert('WorkOrderStatus.create()');
		var thisWorkOrderStatus = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/addWorkOrderStatus";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"name": thisWorkOrderStatus.name, "description": thisWorkOrderStatus.description},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisWorkOrderStatus.id = returnedId;
					    });
					    thisWorkOrderStatus.fireEvent();
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
					tx.executeSql('INSERT INTO WORKORDER_STATUS  ' +
								  '(NAME, DESCRIPTION) ' +
								  'VALUES(?,?)',
								  [thisWorkOrderStatus.name,
								   thisWorkOrderStatus.description],
							   	   function(tx, rs) {
										thisWorkOrderStatus.id = rs.insertId;
										thisWorkOrderStatus.fireEvent();
								   },
								   function() {
									   alert('WorkOrderStatus INSERT Error');
								   });
				});
			}
		},
		update: function() {
//		if(DEBUG) alert('WorkOrderStatus.update()');	
		var thisWorkOrderStatus = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/saveWorkOrderStatus";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"name": thisWorkOrderStatus.name, "description": thisWorkOrderStatus.description, "workorder_status_id": thisWorkOrderStatus.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisWorkOrderStatus.fireEvent();
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
					tx.executeSql('UPDATE WORKORDER_STATUS  ' +
								  'SET ' +
								  'NAME = ?,' +
								  'DESCRIPTION = ?,' +
								  'WHERE WORKORDER_STATUS_ID = ?',
								  [thisWorkOrderStatus.name,
								   thisWorkOrderStatus.description,
								   thisWorkOrderStatus.id],
							   	   function() {
										thisWorkOrderStatus.fireEvent();
								   },
								   function() {
									   alert('WorkOrderStatus UPDATE Error');
								   });
				});
			}
		},
		suppress: function() {
//		if(DEBUG) alert('WorkOrderStatus.suppress()');
		var thisWorkOrderStatus = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/deleteWorkOrderStatus";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workorder_status_id": thisWorkOrderStatus.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisWorkOrderStatus.fireEvent();
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
					tx.executeSql('DELETE FROM WORKORDER_STATUS  WHERE WORKORDER_STATUS_ID = ?',
								  [thisWorkOrderStatus.id],
							   	   function() {
										thisWorkOrderStatus.fireEvent();
								   },
								   function() {
									   alert('WorkOrderStatus UPDATE Error');
								   });
				});
			}
		},
		select: function(id) {
		if(DEBUG) alert('WorkOrderStatus.select(' + id + ')');
		var thisWorkOrderStatus = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getWorkOrderStatus";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workorder_status_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisWorkOrderStatus.id = $this.find("WORKORDER_STATUS_ID").text();
					        thisWorkOrderStatus.name = $this.find("NAME").text();
					        thisWorkOrderStatus.description = $this.find("DESCRIPTION").text();
					    });
					    thisWorkOrderStatus.fireEvent();
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
					tx.executeSql('SELECT WORKORDER_STATUS_ID, NAME, DESCRIPTION  FROM WORKORDER_STATUS WHERE WORKORDER_STATUS_ID = ?',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        thisWorkOrderStatus.id = data.item(i).WORKORDER_STATUS_ID;
								        thisWorkOrderStatus.name = data.item(i).NAME;
								        thisWorkOrderStatus.description = data.item(i).DESCRIPTION;
									}
									thisWorkOrderStatus.fireEvent();
								  }, 
								  function() {
									  alert('WorkOrderStatus SELECT Error');
								  });
				});
			}
		},
		show: function() {
		var thisWorkOrderStatus = this;
		alert('WorkOrderStatus Data:\n' +
			  'Id: ' + this.id + '\n' +	
			  'Name: ' + this.name + '\n' +	
			  'Description: ' + this.description + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter WorkOrderStatus.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter WorkOrderStatus.removeEventListener() ...');
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
//		alert('Executing WorkOrderStatus.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		alert('WorkOrderStatus.AssignEvent');
		var thisWorkOrderStatus = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisWorkOrderStatus.objectId = new Object();
				thisWorkOrderStatus.objectId = element;
				thisWorkOrderStatus.objectId.addEventListener('WorkOrderStatus', 'onWorkOrderStatus', false);
			}
			else {
//				alert('It is an HTML Element');
				thisWorkOrderStatus.htmlElement = element;
				document.getElementById(thisWorkOrderStatus.htmlElement).addEventListener("WorkOrderStatus", onWorkOrderStatus, false);
			}
		},
		fireEvent: function() {
//		alert('WorkOrderStatus.FireEvent');
		var thisWorkOrderStatus = this;
			thisWorkOrderStatus.WorkOrderStatusEvent.detail.id = thisWorkOrderStatus.id;
			thisWorkOrderStatus.WorkOrderStatusEvent.detail.name = thisWorkOrderStatus.name;
			thisWorkOrderStatus.WorkOrderStatusEvent.detail.description = thisWorkOrderStatus.description;
			if (thisWorkOrderStatus.objectId!=null){
//				alert('Event fired to an Object');
				thisWorkOrderStatus.objectId.dispatchEvent(thisWorkOrderStatus.WorkOrderStatusEvent);
			}
			if(thisWorkOrderStatus.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisWorkOrderStatus.htmlElement).dispatchEvent(thisWorkOrderStatus.WorkOrderStatusEvent);
			}
		},
		store: function() {
//		alert('WorkOrderStatus.store()');
			localStorage.setItem('WorkOrderStatus', JSON.stringify(this));
		},
		restore: function() {
//		alert('WorkOrderStatus.restore()');
		var thisWorkOrderStatus = this;
		var item = JSON.parse(localStorage.getItem('WorkOrderStatus'));	
			thisWorkOrderStatus.id = item.id;
			thisWorkOrderStatus.name = item.name;
			thisWorkOrderStatus.description = item.description;
			thisWorkOrderStatus.htmlElement = item.htmlElement;
			thisWorkOrderStatus.objectId = item.objectId;
			thisWorkOrderStatus.WorkOrderStatusEvent = item.WorkOrderStatusEvent;
			thisWorkOrderStatus.fireEvent();
		},
		unstore: function() {
		alert('WorkOrderStatus.unstore()');
		var thisWorkOrderStatus = this;
			localStorage.removeItem('WorkOrderStatus');
		},
		isStored: function() {
//		alert('WorkOrderStatus.isStored()');
		var thisWorkOrderStatus = this;
		var storage = localStorage.getItem('WorkOrderStatus');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return WorkOrderStatus;
})();


var WorkOrderStatusCollection = (function () {
	var WorkOrderStatusCollection = function () {
		if(DEBUG) alert('Enter WorkOrderStatusCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			if(DEBUG) alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.WorkOrderStatusCollectionEvent = new CustomEvent("WorkOrderStatusCollection", {
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
				this.WorkOrderStatusCollectionEvent = new CustomEvent("WorkOrderStatusCollection", {
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
				this.WorkOrderStatusCollectionEvent = document.createEvent("CustomEvent");
				this.WorkOrderStatusCollectionEvent.initCustomEvent('WorkOrderStatusCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Constructor...');
	};

	WorkOrderStatusCollection.prototype = {
		load: function() {
//		alert('load');
		var thisWorkOrderStatusCollection = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getWorkOrderStatuses";
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
					        item = new WorkOrderStatus($this.find("WORKORDER_STATUS_ID").text(),
					        						   $this.find("NAME").text(),
					        						   $this.find("DESCRIPTION").text());
	//				        alert(JSON.stringify(item));
					        thisWorkOrderStatusCollection.add(key++, item);
					    });
					    thisWorkOrderStatusCollection.fireEvent();
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
					tx.executeSql('SELECT WORKORDER_STATUS_ID, NAME, DESCRIPTION  FROM WORKORDER_STATUS',
							      [], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
									for (var i=0; i<data.length; i++) {
								        var item = new WorkOrderStatus(data.item(i).WORKORDER_STATUS_ID,
								        							   data.item(i).NAME,
								        							   data.item(i).DESCRIPTION);
//				        				alert(JSON.stringify(item));
								        thisWorkOrderStatusCollection.add(key++, item);
									}
									thisWorkOrderStatusCollection.fireEvent();
								  }, 
								  function() {
									  alert('WorkOrderStatusCollection SELECT Error');
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
				if(this.collection[idx].id==id) {
					return this.collection[idx];
				}
			}
			return undefined;
		},
		assignEvent: function(element) {
//		alert('AssignEvent');
		var thisWorkOrderStatusCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisWorkOrderStatusCollection.objectId = new Object();
				thisWorkOrderStatusCollection.objectId = element;
				thisWorkOrderStatusCollection.objectId.addEventListener('WorkOrderStatusCollection', 'onWorkOrderStatusCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisWorkOrderStatusCollection.htmlElement = element;
				document.getElementById(thisWorkOrderStatusCollection.htmlElement).addEventListener("WorkOrderStatusCollection", onWorkOrderStatusCollection, false);
			}
		},
		fireEvent: function() {
//		alert('FireEvent');
		var thisWorkOrderStatusCollection = this;
			thisWorkOrderStatusCollection.WorkOrderStatusCollectionEvent.detail.count = thisWorkOrderStatusCollection.count;
			thisWorkOrderStatusCollection.WorkOrderStatusCollectionEvent.detail.items = thisWorkOrderStatusCollection.collection;
			if (thisWorkOrderStatusCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisWorkOrderStatusCollection.objectId.dispatchEvent(thisWorkOrderStatusCollection.WorkOrderStatusCollectionEvent);
			}
			if(thisWorkOrderStatusCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisWorkOrderStatusCollection.htmlElement).dispatchEvent(thisWorkOrderStatusCollection.WorkOrderStatusCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('WorkOrderStatusCollection.store()');
		var thisWorkOrderStatusCollection = this;
			localStorage.setItem('WorkOrderStatusCollection', JSON.stringify(thisWorkOrderStatusCollection));
		},
		restore: function() {
//		if(DEBUG) alert('WorkOrderStatusCollection.restore()');
		var thisWorkOrderStatusCollection = this;
		var item = JSON.parse(localStorage.getItem('WorkOrderStatusCollection'));	
			thisWorkOrderStatusCollection.count = item.count;
			thisWorkOrderStatusCollection.collection = item.collection;
			thisWorkOrderStatusCollection.htmlElement = item.htmlElement;
			thisWorkOrderStatusCollection.objectId = item.objectId;
			thisWorkOrderStatusCollection.WorkOrderStatusCollectionEvent = item.WorkOrderStatusCollectionEvent;
			thisWorkOrderStatusCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('WorkOrderStatusCollection.unstore()');
			localStorage.removeItem('WorkOrderStatusCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('WorkOrderStatusCollection.isStored()');
		var storage = localStorage.getItem('WorkOrderStatusCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
		
	};
	return WorkOrderStatusCollection;
	
})();
