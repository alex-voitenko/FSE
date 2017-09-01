//////////////////////////////////////////////////
// Define WorkOrder Class
//////////////////////////////////////////////////

/** WorkOrder
 * This class encapsulates a WorkOrder.
 *
 */	
/**
 * @author Hell
 */
/**
 *  WorkOrder Class Definition 
 */
var WorkOrder = (function () {
	var WorkOrder = function (id, workorder_status_id, site_id, name, description, startdate, enddate) {
		if(DEBUG) alert('Enter WorkOrder() Constructor...');
		this.id = id || -1;
		this.workorder_status_id = workorder_status_id || -1; 
		this.site_id = site_id || -1; 
		this.name = name || '';
		this.description = description || '';
		this.startdate =  startdate || '';
		this.enddate =  enddate || '';
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.WorkOrderEvent = new CustomEvent("WorkOrder", {
				detail: {
					id: 0,
					workorder_status_id: 0,
					site_id: 0,
					name: '',
					description: '',
					startdate: '',
					enddate: '',
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.WorkOrderEvent = new CustomEvent("WorkOrder", {
					detail: {
						id: 0,
						workorder_status_id: 0,
						site_id: 0,
						name: '',
						description: '',
						startdate: '',
						enddate: '',
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.WorkOrderEvent = document.createEvent("CustomEvent");
				this.WorkOrderEvent.initCustomEvent('WorkOrder', true, false, {id: 0, workorder_status_id: 0, site_id: 0, name: '', description: '', startdate: '', enddate: '', time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Constructor...');
	};

	WorkOrder.prototype = {
		reset: function() {
//		alert('WorkOrder.reset()');
		var thisWorkOrder = this;
			thisWorkOrder.id = -1;
			thisWorkOrder.workorder_status_id = -1;
			thisWorkOrder.site_id = -1; 
			thisWorkOrder.name = '';
			thisWorkOrder.description = description || '';
			thisWorkOrder.startdate =  startdate || '';
			thisWorkOrder.enddate =  enddate || '';
		},
		create: function() {
//		alert('WorkOrder.create()');
		var thisWorkOrder = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/addWorkOrder";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workorder_status_id": thisWorkOrder.workorder_status_id,
						   "site_id": thisWorkOrder.site_id,
					       "name": thisWorkOrder.name,
					       "description": thisWorkOrder.description,
					       "startdate": thisWorkOrder.startdate, 
					       "enddate": thisWorkOrder.enddate},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisWorkOrder.id = returnedId;
					    });
					    thisWorkOrder.fireEvent();
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
					tx.executeSql('INSERT INTO WORKORDER  ' +
								  '(WORKORDER_STATUS_ID, SITE_ID, NAME, DESCRIPTION, STARTDATE, ENDDATE) ' +
								  'VALUES(?,?,?,?,?,?)',
								  [thisWorkOrder.workorder_status_id,
								   thisWorkOrder.site_id,
							       thisWorkOrder.name,
							       thisWorkOrder.description,
							       thisWorkOrder.startdate, 
							       thisWorkOrder.enddate],
							   	   function(tx, rs) {
										thisWorkOrder.id = rs.insertId;
										thisWorkOrder.fireEvent();
								   },
								   function() {
									   alert('WorkOrder INSERT Error');
								   });
				});
			}
		},
		update: function() {
//		alert('WorkOrder.update()');	
		var thisWorkOrder = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/saveWorkOrder";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workorder_status_id": thisWorkOrder.workorder_status_id,
						   "site_id": thisWorkOrder.site_id,
					   	   "name": thisWorkOrder.name,
					   	   "description": thisWorkOrder.description,
					   	   "startdate": thisWorkOrder.startdate,
					   	   "enddate": thisWorkOrder.enddate, 
					       "workorder_id": thisWorkOrder.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisWorkOrder.fireEvent();
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
					tx.executeSql('UPDATE WORKORDER  ' +
								  'SET ' +
								  'WORKORDER_STATUS_ID = ?,' +
								  'SITE_ID = ?,' +
								  'NAME = ?,' +
								  'DESCRIPTION = ?,' +
								  'STARTDATE = ?,' +
								  'ENDDATE = ? ' +
								  'WHERE WORKORDER_ID = ?',
						  [thisWorkOrder.workorder_status_id,
						   thisWorkOrder.site_id,
					   	   thisWorkOrder.name,
					   	   thisWorkOrder.description,
					   	   thisWorkOrder.startdate,
					   	   thisWorkOrder.enddate, 
					       thisWorkOrder.id],
					   	   function() {
								thisWorkOrder.fireEvent();
						   },
						   function() {
							   alert('WorkOrder UPDATE Error');
						   });
				});
			}
		},
		suppress: function() {
//		alert('WorkOrder.suppress()');
		var thisWorkOrder = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/deleteWorkOrder";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workorder_id": thisWorkOrder.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisWorkOrder.fireEvent();
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
					tx.executeSql('DELETE FROM WORKORDER WHERE WORKORDER_ID = ?', 
							      [thisWorkOrder.id], 
							      function() {
										thisWorkOrder.fireEvent();	
								  }, 
							      function() {
								  	  alert('WorkOrder DELETE Error');
								  });
				});
			}
		},
		select: function(id) {
//		alert('WorkOrder.select()');
		var thisWorkOrder = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getWorkOrder";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workorder_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
							thisWorkOrder.id = $this.find("WORKORDER_ID").text();
							thisWorkOrder.workorder_status_id = $this.find("WORKORDER_STATUS_ID").text();
							thisWorkOrder.site_id = $this.find("SITE_ID").text();
							thisWorkOrder.description = $this.find("NAME").text();
							thisWorkOrder.description = $this.find("DESCRIPTION").text();
							thisWorkOrder.startdate = $this.find("STARTDATE").text();
							thisWorkOrder.enddate = $this.find("ENDDATE").text();
					    });
					    thisWorkOrder.fireEvent();
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
					tx.executeSql('SELECT WORKORDER_ID, WORKORDER_STATUS_ID, SITE_ID, NAME, DESCRIPTION, STARTDATE, ENDDATE  ' +
								  'FROM WORKORDER WHERE WORKORDER_ID = ?',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
										thisWorkOrder.id = data.item(i).WORKORDER_ID;
										thisWorkOrder.workorder_status_id = data.item(i).WORKORDER_STATUS_ID;
										thisWorkOrder.site_id = data.item(i).SITE_ID;
										thisWorkOrder.name = data.item(i).NAME;
										thisWorkOrder.description = data.item(i).DESCRIPTION;
										thisWorkOrder.startdate = data.item(i).STARTDATE;
										thisWorkOrder.enddate = data.item(i).ENDDATE;
									}
									thisWorkOrder.fireEvent();
								  }, 
								  function() {
									  alert('WorkOrder SELECT Error');
								  });
				});
			}
		},
		show: function() {
			alert('WorkOrder Data:\n' +
				'Id: ' + this.id + '\n' +	
				'WorkOrder Status Id: ' + this.workorder_status_id + '\n' +	
		  		'Site Id: ' + this.site_id + '\n' +	
		  		'Name: ' + this.name + '\n' +	
		  		'Description: ' + this.description + '\n' +	
		  		'Start Date: ' + this.startdate + '\n' +
		  		'End Date: ' + this.enddate + '\n');
		},
		assignEvent: function(element) {
//		alert('WorkOrder.AssignEvent()');
		var thisWorkOrder = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisWorkOrder.objectId = new Object();
				thisWorkOrder.objectId = element;
				thisWorkOrder.objectId.addEventListener('WorkOrder', 'onWorkOrder', false);
			}
			else {
//			alert('It is an HTML Element');
				thisWorkOrder.htmlElement = element;
				document.getElementById(thisWorkOrder.htmlElement).addEventListener("WorkOrder", onWorkOrder, false);
			}
		},
		fireEvent: function() {
//		alert('WorkOrder.FireEvent()');
		var thisWorkOrder = this;
			thisWorkOrder.WorkOrderEvent.detail.id = thisWorkOrder.id;
			thisWorkOrder.WorkOrderEvent.detail.workorder_status_id = thisWorkOrder.workorder_status_id;
			thisWorkOrder.WorkOrderEvent.detail.site_id = thisWorkOrder.site_id;
			thisWorkOrder.WorkOrderEvent.detail.name = thisWorkOrder.name;
			thisWorkOrder.WorkOrderEvent.detail.description = thisWorkOrder.description;
			thisWorkOrder.WorkOrderEvent.detail.startdate = thisWorkOrder.startdate;
			thisWorkOrder.WorkOrderEvent.detail.enddate = thisWorkOrder.enddate;
			if (thisWorkOrder.objectId!=null){
//				alert('Event fired to an Object');
				thisWorkOrder.objectId.dispatchEvent(thisWorkOrder.WorkOrderEvent);
			}
			if(thisWorkOrder.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisWorkOrder.htmlElement).dispatchEvent(thisWorkOrder.WorkOrderEvent);
			}
		},
		store: function() {
//		alert('WorkOrder.store()');
			localStorage.setItem('Workorder', JSON.stringify(this));
		},
		restore: function() {
//		alert('WorkOrder.restore()');
		var thisWorkOrder = this;
		var item = JSON.parse(localStorage.getItem('Workorder'));	
			thisWorkOrder.id = item.id;
			thisWorkOrder.site_id = item.site_id;
			thisWorkOrder.name = item.name;
			thisWorkOrder.description = item.description;
			thisWorkOrder.startdate = item.startdate;
			thisWorkOrder.enddate = item.enddate;
			thisWorkOrder.htmlElement = item.htmlElement;
			thisWorkOrder.objectId = item.objectId;
			thisWorkOrder.WorkOrderEvent = item.WorkOrderEvent;
			thisWorkOrder.fireEvent();
		},
		unstore: function() {
		alert('WorkOrder.unstore()');
		var thisWorkOrder = this;
			localStorage.removeItem('Workorder');
		},
		isStored: function() {
//		alert('WorkOrder.isStored()');
		var thisWorkOrder = this;
		var storage = localStorage.getItem('Workorder');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return WorkOrder;
})();


var WorkOrderCollection = (function () {
	
	var WorkOrderCollection = function () {
		if(DEBUG) alert('EnterWorkOrderCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.WorkOrderCollectionEvent = new CustomEvent("WorkOrderCollection", {
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
				this.WorkOrderCollectionEvent = new CustomEvent("WorkOrderCollection", {
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
				this.WorkOrderCollectionEvent = document.createEvent("CustomEvent");
				this.WorkOrderCollectionEvent.initCustomEvent('WorkOrderCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Constructor...');
	};

	WorkOrderCollection.prototype = {
		load: function() {
		if(DEBUG) alert('WorkOrderCollection.load');
		var thisWorkOrderCollection = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getWorkOrders";
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
					        item = new WorkOrder($this.find("WORKORDER_ID").text(),
					        					 $this.find("WORKORDER_STATUS_ID").text(),	
	        								     $this.find("SITE_ID").text(),
	        								     $this.find("NAME").text(),
	        								     $this.find("DESCRIPTION").text(),
	        								     $this.find("STARTDATE").text(),
	        								     $this.find("ENDDATE").text());
	//				        item.assignEvent('m1-DataTest');
	//				        alert(JSON.stringify(item));
					        thisWorkOrderCollection.add(key++, item);
					    });
					    thisWorkOrderCollection.fireEvent();
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
					tx.executeSql('SELECT WORKORDER_ID, WORKORDER_STATUS_ID, SITE_ID, NAME, DESCRIPTION, STARTDATE, ENDDATE  ' +
							  	  'FROM WORKORDER',
							      [], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
									for (var i=0; i<data.length; i++) {
								        var item = new WorkOrder(data.item(i).WORKORDER_ID,
								        						 data.item(i).WORKORDER_STATUS_ID,
								        						 data.item(i).SITE_ID,
								        						 data.item(i).NAME,
								        						 data.item(i).DESCRIPTION,
								        						 data.item(i).STARTDATE,
								        						 data.item(i).ENDDATE);
//				        				alert(JSON.stringify(item));
								        thisWorkOrderCollection.add(key++, item);
									}
									thisWorkOrderCollection.fireEvent();
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
			var thisWorkOrderCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisWorkOrderCollection.objectId = new Object();
				thisWorkOrderCollection.objectId = element;
				thisWorkOrderCollection.objectId.addEventListener('WorkOrderCollection', 'onWorkOrderCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisWorkOrderCollection.htmlElement = element;
				document.getElementById(thisWorkOrderCollection.htmlElement).addEventListener("WorkOrderCollection", onWorkOrderCollection, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) alert('FireEvent');
		var thisWorkOrderCollection = this;
			thisWorkOrderCollection.WorkOrderCollectionEvent.detail.count = thisWorkOrderCollection.count;
			thisWorkOrderCollection.WorkOrderCollectionEvent.detail.items = thisWorkOrderCollection.collection;
			
			if (thisWorkOrderCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisWorkOrderCollection.objectId.dispatchEvent(thisWorkOrderCollection.WorkOrderCollectionEvent);
			}
			if(thisWorkOrderCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisWorkOrderCollection.htmlElement).dispatchEvent(thisWorkOrderCollection.WorkOrderCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('WorkOrderCollection.store()');
		var thisWorkOrderCollection = this;
			localStorage.setItem('WorkorderCollection', JSON.stringify(thisWorkOrderCollection));
		},
		restore: function() {
//		if(DEBUG) alert('WorkOrderCollection.restore()');
		var thisWorkOrderCollection = this;
		var item = JSON.parse(localStorage.getItem('WorkorderCollection'));	
			thisWorkOrderCollection.count = item.count;
			thisWorkOrderCollection.collection = item.collection;
			thisWorkOrderCollection.htmlElement = item.htmlElement;
			thisWorkOrderCollection.objectId = item.objectId;
			thisWorkOrderCollection.WorkOrderCollectionEvent = item.WorkOrderCollectionEvent;
			thisWorkOrderCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('WorkOrderCollection.unstore()');
			localStorage.removeItem('WorkorderCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('WorkOrderCollection.isStored()');
		var storage = localStorage.getItem('WorkorderCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
		
	};
	return WorkOrderCollection;
	
})();
