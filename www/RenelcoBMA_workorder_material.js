//////////////////////////////////////////////////
// Define WorkOrder_Material Class
//////////////////////////////////////////////////

/** WorkOrder_Material
 * This class encapsulates a WorkOrder_Material.
 *
 */	
/**
 * @author Hell
 */
/**
 *  WorkOrder_Material Class Definition 
 */
var WorkOrder_Material = (function () {
	var WorkOrder_Material = function (workorder_id, material_id, collaborator_id, name, quantity, comment) {
//		if(DEBUG) alert('Enter WorkOrder_Material() Constructor...');
		this.workorder_id = workorder_id || -1;
		this.material_id = material_id || -1;
		this.collaborator_id = collaborator_id || -1;
		this.name = name || '';
		this.quantity = quantity || 0.00;
		this.comment = comment || '';
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.WorkOrder_MaterialEvent = new CustomEvent("WorkOrder_Material", {
				detail: {
					workorder_id: 0,
					material_id: 0,
					collaborator_id: 0,
					name: '',
					quantity: 0.00,
					comment: '',
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.WorkOrder_MaterialEvent = new CustomEvent("WorkOrder_Material", {
					detail: {
						workorder_id: 0,
						material_id: 0,
						collaborator_id: 0,
						name: '',
						quantity: 0.00,
						comment: '',
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.WorkOrder_MaterialEvent = document.createEvent("CustomEvent");
				this.WorkOrder_MaterialEvent.initCustomEvent('WorkOrder_Material', true, false, {workorder_id: 0, material_id: 0, collaborator_id: 0, name: '', quantity: 0.00, comment: '', time: new Date()});
			}
		}
//		if(DEBUG) alert('Exit WorkOrder_Material Constructor...');
	};

	WorkOrder_Material.prototype = {
		reset: function() {
//		if(DEBUG) alert('WorkOrder_Material.reset()');
			var thisWorkOrder_Material = this;
			thisWorkOrder_Material.workorder_id = -1;
			thisWorkOrder_Material.material_id = -1;
			thisWorkOrder_Material.collaborator_id = -1;
			thisWorkOrder_Material.name = '';
			thisWorkOrder_Material.quantity = 0.00;
			thisWorkOrder_Material.comment = '';
		    thisWorkOrder_Material.fireEvent();
		},
		assign: function() {
//		if(DEBUG) alert('WorkOrder_Material.assign()');
		var thisWorkOrder_Material = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/assignMaterialToWorkOrder";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workorder_id": thisWorkOrder_Material.workorder_id,
						   "material_id": thisWorkOrder_Material.material_id,
						   "collaborator_id": thisWorkOrder_Material.collaborator_id,
						   "quantity": thisWorkOrder_Material.quantity,
						   "comment": thisWorkOrder_Material.comment},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisWorkOrder_Material.id = returnedId;
					    });
					    thisWorkOrder_Material.fireEvent();
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
					tx.executeSql('INSERT INTO WORKORDER_MATERIAL (WORKORDER_ID, MATERIAL_ID, COLLABORATOR_ID, QUANTITY, COMMENT) VALUES(?, ?, ?, ?, ?)', 
							      [thisWorkOrder_Material.workorder_id,
							       thisWorkOrder_Material.material_id,
							       thisWorkOrder_Material.collaborator_id,
							       thisWorkOrder_Material.quantity,
								   thisWorkOrder_Material.comment], 
							      function() {
										thisWorkOrder_Material.fireEvent();	
								  }, 
							      function() {
								  	  alert('WorkOrder_Material INSERT Error');
								  });
				});
			}
		},
		update: function(quantity, comment) {
//		if(DEBUG) alert('WorkOrder_Material.update()');	
		var thisWorkOrder_Material = this;
		
			thisWorkOrder_Material.quantity = quantity;
			thisWorkOrder_Material.comment = comment;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/updateWorkOrderMaterial";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"quantity": thisWorkOrder_Material.quantity,
						   "comment": thisWorkOrder_Material.comment,
					       "workorder_id": thisWorkOrder_Material.workorder_id,
						   "material_id": thisWorkOrder_Material.material_id,
						   "collaborator_id": thisWorkOrder_Material.collaborator_id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisWorkOrder_Material.fireEvent();
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
					tx.executeSql('UPDATE WORKORDER_MATERIAL  SET QUANTITY = ?, COMMENT = ?  WHERE (WORKORDER_ID = ? AND MATERIAL_ID = ? AND COLLABORATOR_ID = ?)', 
							      [thisWorkOrder_Material.quantity,
								   thisWorkOrder_Material.comment,
							       thisWorkOrder_Material.workorder_id,
								   thisWorkOrder_Material.material_id,
							       thisWorkOrder_Material.collaborator_id], 
							      function() {
										thisWorkOrder_Material.fireEvent();	
								  }, 
							      function() {
								  	  alert('WorkOrder_Material UPDATE Error');
								  });
				});
			}
		},
		unassign: function() {
//		if(DEBUG) alert('WorkOrder_Material.suppress()');
		var thisWorkOrder_Material = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/unassignMaterialFromWorkOrder";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workorder_id": thisWorkOrder_Material.workorder_id,
						   "material_id": thisWorkOrder_Material.material_id,
						   "collaborator_id": thisWorkOrder_Material.collaborator_id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisWorkOrder_Material.fireEvent();
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
					tx.executeSql('DELETE FROM WORKORDER_MATERIAL  WHERE (WORKORDER_ID = ? AND MATERIAL_ID = ? AND COLLABORATOR_ID = ?)', 
							      [thisWorkOrder_Material.workorder_id,
							       thisWorkOrder_Material.material_id,
							       thisWorkOrder_Material.collaborator_id], 
							      function() {
										thisWorkOrder_Material.fireEvent();	
								  }, 
							      function() {
								  	  alert('WorkOrder_Material DELETE Error');
								  });
				});
			}
		},
		show: function() {
			var thisWorkOrder_Material = this;
			alert('WorkOrder_Material Data:\n' +
				  'WorkOrder Id: ' + thisWorkOrder_Material.workorder_id + '\n' + 	
				  'Material Id: ' + thisWorkOrder_Material.material_id + '\n' + 	
				  'Collaborator Id: ' + thisWorkOrder_Material.collaborator_id + '\n' + 	
				  'Name: ' + thisWorkOrder_Material.name + '\n' + 
				  'Quantity: ' + thisWorkOrder_Material.quantity + '\n' + 
				  'Comment: ' + thisWorkOrder_Material.comment + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		if(DEBUG) alert('Enter WorkOrder_Material.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		if(DEBUG) alert('Enter WorkOrder_Material.removeEventListener() ...');
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
//		if(DEBUG) alert('Executing WorkOrder_Material.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		if(DEBUG) alert('WorkOrder_Material.AssignEvent');
		var thisWorkOrder_Material = this;
			if (element!==null && typeof element==='object') {
//				if(DEBUG) alert('It is an Object');
				thisWorkOrder_Material.objectId = new Object();
				thisWorkOrder_Material.objectId = element;
				thisWorkOrder_Material.objectId.addEventListener('WorkOrder_Material', 'onWorkOrder_Material', false);
			}
			else {
//				if(DEBUG) alert('It is an HTML Element');
				thisWorkOrder_Material.htmlElement = element;
				document.getElementById(thisWorkOrder_Material.htmlElement).addEventListener("WorkOrder_Material", onWorkOrder_Material, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) alert('WorkOrder_Material.FireEvent');
		var thisWorkOrder_Material = this;
			if (thisWorkOrder_Material.objectId!=null){
//				if(DEBUG) alert('Event fired to an Object');
				thisWorkOrder_Material.objectId.dispatchEvent(thisWorkOrder_Material.WorkOrder_MaterialEvent);
			}
			if(thisWorkOrder_Material.htmlElement!=null) {
//				if(DEBUG) alert('Event fired to an HTML Element');
				document.getElementById(thisWorkOrder_Material.htmlElement).dispatchEvent(thisWorkOrder_Material.WorkOrder_MaterialEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('WorkOrder_Material.store()');
			localStorage.setItem('WorkOrder_Material', JSON.stringify(this));
		},
		restore: function() {
//		if(DEBUG) alert('WorkOrder_Material.restore()');
		var thisWorkOrder_Material = this;
		var item = JSON.parse(localStorage.getItem('WorkOrder_Material'));	
			thisWorkOrder_Material.workorder_id = item.workorder_id;
			thisWorkOrder_Material.material_id = item.material_id;
			thisWorkOrder_Material.collaborator_id = item.collaborator_id;
			thisWorkOrder_Material.quantity = item.quantity;
			thisWorkOrder_Material.name = item.name;
			thisWorkOrder_Material.comment = item.comment;
			thisWorkOrder_Material.htmlElement = item.htmlElement;
			thisWorkOrder_Material.objectId = item.objectId;
			thisWorkOrder_Material.WorkOrder_MaterialEvent = item.WorkOrder_MaterialEvent;
			thisWorkOrder_Material.fireEvent();
		},
		remove: function() {
//		if(DEBUG) alert('WorkOrder_Material.remove()');
		var thisWorkOrder_Material = this;
			localStorage.removeItem('WorkOrder_Material');
		},
		isStored: function() {
//		if(DEBUG) alert('WorkOrder_Material.isStored()');
		var thisWorkOrder_Material = this;
		var storage = localStorage.getItem('WorkOrder_Material');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return WorkOrder_Material;
})();


var WorkOrder_MaterialsCollection = (function () {
	
	var WorkOrder_MaterialsCollection = function () {
//		if(DEBUG) alert('Enter WorkOrder_MaterialsCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.WorkOrder_MaterialsCollectionEvent = new CustomEvent("WorkOrder_MaterialsCollection", {
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
				this.WorkOrder_MaterialsCollectionEvent = new CustomEvent("WorkOrder_MaterialsCollection", {
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
				this.WorkOrder_MaterialsCollectionEvent = document.createEvent("CustomEvent");
				this.WorkOrder_MaterialsCollectionEvent.initCustomEvent('WorkOrder_MaterialsCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
//		if(DEBUG) alert('Exit Constructor...');
	};

	WorkOrder_MaterialsCollection.prototype = {
		reset: function() {
		if(DEBUG) alert('reset');
		var thisWorkOrder_MaterialsCollection = this;
			thisWorkOrder_MaterialsCollection.collection = {};
			thisWorkOrder_MaterialsCollection.count = 0;
		},
		load: function(workorderId, collaboratorId) {
//		if(DEBUG) alert('load');
		var thisWorkOrder_MaterialsCollection = this;
		
			thisWorkOrder_MaterialsCollection.reset();
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getWorkOrderMaterials";
				thisWorkOrder_MaterialsCollection.reset();
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workorder_id": workorderId,
						   "collaborator_id": collaboratorId},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var key = 0;
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        item = new WorkOrder_Material($this.find("WORKORDER_ID").text(),
					        							  $this.find("MATERIAL_ID").text(), 
					        							  $this.find("COLLABORATOR_ID").text(), 
					        							  $this.find("NAME").text(),
					        							  $this.find("QUANTITY").text(),
					        							  $this.find("COMMENT").text());
	//				        alert(JSON.stringify(item));
					        thisWorkOrder_MaterialsCollection.add(key++, item);
					    });
					    thisWorkOrder_MaterialsCollection.fireEvent();
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
					tx.executeSql('SELECT WM.WORKORDER_ID, WM.MATERIAL_ID, WM.COLLABORATOR_ID, M.NAME, WM.QUANTITY, WM.COMMENT  FROM WORKORDER_MATERIAL WM  JOIN MATERIAL M ON (M.MATERIAL_ID=WM.MATERIAL_ID) WHERE WM.WORKORDER_ID = ? AND WM.COLLABORATOR_ID = ? ORDER BY M.NAME ASC',
							      [workorderId,
							       collaboratorId], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
									for (var i=0; i<data.length; i++) {
								        var item = new WorkOrder_Material(data.item(i).WORKORDER_ID,
								        								  data.item(i).MATERIAL_ID,
								        								  data.item(i).COLLABORATOR_ID,
								        								  data.item(i).NAME,
								        								  data.item(i).QUANTITY,
								        								  data.item(i).COMMENT);
//								        alert(JSON.stringify(item));
								        thisWorkOrder_MaterialsCollection.add(key++, item);
									}
									thisWorkOrder_MaterialsCollection.fireEvent();
								  }, 
								  function() {
									  alert('WorkOrder_Materials Collection SELECT Error');
								  });
				});
			}
		},
		add: function(key, item) {
		if(DEBUG) alert('WorkOrder_MaterialsCollection.add()');
			if(this.collection[key]==undefined) {
				this.collection[key]=item;
				this.count++;
			}
			else {
//				alert('Item already exists ...');
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
				if(this.collection[idx].material_id==id) {
					return this.collection[idx];
				}
			}
			return undefined;
		},
		assignEvent: function(element) {
//		alert('AssignEvent');
		var thisWorkOrder_MaterialsCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisWorkOrder_MaterialsCollection.objectId = new Object();
				thisWorkOrder_MaterialsCollection.objectId = element;
				thisWorkOrder_MaterialsCollection.objectId.addEventListener('WorkOrder_MaterialsCollection', 'onWorkOrder_MaterialsCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisWorkOrder_MaterialsCollection.htmlElement = element;
				document.getElementById(thisWorkOrder_MaterialsCollection.htmlElement).addEventListener("WorkOrder_MaterialsCollection", onWorkOrder_MaterialsCollection, false);
			}
		},
		fireEvent: function() {
//		alert('FireEvent');
		var thisWorkOrder_MaterialsCollection = this;
			thisWorkOrder_MaterialsCollection.WorkOrder_MaterialsCollectionEvent.detail.count = thisWorkOrder_MaterialsCollection.count;
			thisWorkOrder_MaterialsCollection.WorkOrder_MaterialsCollectionEvent.detail.items = thisWorkOrder_MaterialsCollection.collection;
			if (thisWorkOrder_MaterialsCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisWorkOrder_MaterialsCollection.objectId.dispatchEvent(thisWorkOrder_MaterialsCollection.WorkOrder_MaterialsCollectionEvent);
			}
			if(thisWorkOrder_MaterialsCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisWorkOrder_MaterialsCollection.htmlElement).dispatchEvent(thisWorkOrder_MaterialsCollection.WorkOrder_MaterialsCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('WorkOrder_MaterialsCollection.store()');
		var thisWorkOrder_MaterialsCollection = this;
			localStorage.setItem('WorkOrder_MaterialsCollection', JSON.stringify(thisWorkOrder_MaterialsCollection));
		},
		restore: function() {
//		if(DEBUG) alert('WorkOrder_MaterialsCollection.restore()');
		var thisWorkOrder_MaterialsCollection = this;
		var item = JSON.parse(localStorage.getItem('WorkOrder_MaterialsCollection'));	
			thisWorkOrder_MaterialsCollection.count = item.count;
			thisWorkOrder_MaterialsCollection.collection = item.collection;
			thisWorkOrder_MaterialsCollection.htmlElement = item.htmlElement;
			thisWorkOrder_MaterialsCollection.objectId = item.objectId;
			thisWorkOrder_MaterialsCollection.WorkOrder_MaterialsCollectionEvent = item.WorkOrder_MaterialsCollectionEvent;
			thisWorkOrder_MaterialsCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('WorkOrder_MaterialsCollection.unstore()');
			localStorage.removeItem('WorkOrder_MaterialsCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('WorkOrder_MaterialsCollection.isStored()');
		var storage = localStorage.getItem('WorkOrder_MaterialsCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
		
	};
	return WorkOrder_MaterialsCollection;
	
})();


var Material_WorkOrdersCollection = (function () {
	
	var Material_WorkOrdersCollection = function () {
//		alert('Enter Material_WorkOrdersCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.Material_WorkOrdersCollectionEvent = new CustomEvent("Material_WorkOrdersCollection", {
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
				this.Material_WorkOrdersCollectionEvent = new CustomEvent("Material_WorkOrdersCollection", {
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
				this.Material_WorkOrdersCollectionEvent = document.createEvent("CustomEvent");
				this.Material_WorkOrdersCollectionEvent.initCustomEvent('Material_WorkOrdersCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
//		alert('Exit Constructor...');
	};

	Material_WorkOrdersCollection.prototype = {
		load: function(id) {
//			alert('load');
		var thisMaterial_WorkOrdersCollection = this;
		
			thisMaterial_WorkOrdersCollection.reset();
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getMaterialWorkOrders";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"material_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var key = 0;
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        item = new WorkOrder_Material($this.find("MATERIAL_ID").text(), 
					        							  $this.find("WORKORDER_ID").text(),
					        							  $this.find("QUANTITY").text(),
					        							  $this.find("COMMENT").text());
	//				        alert(JSON.stringify(item));
					        thisMaterial_WorkOrdersCollection.add(key++, item);
					    });
					    thisMaterial_WorkOrdersCollection.fireEvent();
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
					tx.executeSql('SELECT MATERIAL_ID, WORKORDER_ID, QUANTITY, COMMENT  FROM WORKORDER_MATERIAL  WHERE MATERIAL_ID = ?',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
									for (var i=0; i<data.length; i++) {
								        var item = new WorkOrder_Material(data.item(i).MATERIAL_ID,
								        								  data.item(i).WORKORDER_ID,
								        								  data.item(i).QUANTITY,
								        								  data.item(i).COMMENT);
//								        alert(JSON.stringify(item));
								        thisMaterial_WorkOrdersCollection.add(key++, item);
									}
									thisMaterial_WorkOrdersCollection.fireEvent();
								  }, 
								  function() {
									  alert('Material_WorkOrders Collection SELECT Error');
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
//		alert('AssignEvent');
		var thisMaterial_WorkOrdersCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisMaterial_WorkOrdersCollection.objectId = new Object();
				thisMaterial_WorkOrdersCollection.objectId = element;
				thisMaterial_WorkOrdersCollection.objectId.addEventListener('Material_WorkOrdersCollection', 'onMaterial_WorkOrdersCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisMaterial_WorkOrdersCollection.htmlElement = element;
				document.getElementById(thisMaterial_WorkOrdersCollection.htmlElement).addEventListener("Material_WorkOrdersCollection", onMaterial_WorkOrdersCollection, false);
			}
		},
		fireEvent: function() {
//		alert('FireEvent');
		var thisMaterial_WorkOrdersCollection = this;
			thisMaterial_WorkOrdersCollection.Material_WorkOrdersCollectionEvent.detail.count = thisMaterial_WorkOrdersCollection.count;
			thisMaterial_WorkOrdersCollection.Material_WorkOrdersCollectionEvent.detail.items = thisMaterial_WorkOrdersCollection.collection;
			if (thisMaterial_WorkOrdersCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisMaterial_WorkOrdersCollection.objectId.dispatchEvent(thisMaterial_WorkOrdersCollection.Material_WorkOrdersCollectionEvent);
			}
			if(thisMaterial_WorkOrdersCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisMaterial_WorkOrdersCollection.htmlElement).dispatchEvent(thisMaterial_WorkOrdersCollection.Material_WorkOrdersCollectionEvent);
			}
		}
		
	};
	return Material_WorkOrdersCollection;
	
})();
