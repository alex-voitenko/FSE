//////////////////////////////////////////////////
// Define Metree_Obturation_Type Class
//////////////////////////////////////////////////

/** Metree_Obturation_Type
 * This class encapsulates a Metree_Obturation_Type relationship.
 *
 */	
/**
 * @author Hell
 */
/**
 *  Metree_Obturation_Type Class Definition 
 */
var Metree_Obturation_Type = (function () {
	var Metree_Obturation_Type = function (metree_id, collaborator_id, obturation_type_id, created) {
//		if(DEBUG) alert('Enter Metree_Obturation_Type() Constructor...');
		this.metree_id = metree_id || -1;
		this.collaborator_id = collaborator_id || -1;
		this.obturation_type_id = obturation_type_id || -1;
		this.created = created || new Date();
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.Metree_Obturation_TypeEvent = new CustomEvent("Metree_Obturation_Type", {
				detail: {
					metree_id: 0,
					collaborator_id: 0,
					obturation_type_id: 0,
					created: new Date(),
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.Metree_Obturation_TypeEvent = new CustomEvent("Metree_Obturation_Type", {
					detail: {
						metree_id: 0,
						collaborator_id: 0,
						obturation_type_id: 0,
						created: new Date(),
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.Metree_Obturation_TypeEvent = document.createEvent("CustomEvent");
				this.Metree_Obturation_TypeEvent.initCustomEvent('Metree_Obturation_Type', true, false, {metree_id: 0, collaborator_id: 0, obturation_type_id: 0, created: new Date(), time: new Date()});
			}
		}
//		if(DEBUG) alert('Exit Metree_Obturation_Type Constructor...');
	};

	Metree_Obturation_Type.prototype = {
		reset: function() {
//		if(DEBUG) alert('Metree_Obturation_Type.reset()');
			var thisMetree_Obturation_Type = this;
			
			thisMetree_Obturation_Type.metree_id = -1;
			thisMetree_Obturation_Type.collaborator_id = -1;
			thisMetree_Obturation_Type.obturation_type_id = -1;
			thisMetree_Obturation_Type.created = new Date();
		    thisMetree_Obturation_Type.fireEvent();
		},
		assign: function() {
		if(DEBUG) alert('Metree_Obturation_Type.assign()');
		var thisMetree_Obturation_Type = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/assignObturationTypeToMetree";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"metree_id": thisMetree_Obturation_Type.metree_id,
						   "collaborator_id": thisMetree_Obturation_Type.collaborator_id,	
						   "obturation_type_id": thisMetree_Obturation_Type.obturation_type_id,
						   "created": thisMetree_Obturation_Type.created},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisMetree_Obturation_Type.id = returnedId;
					    });
					    thisMetree_Obturation_Type.fireEvent();
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
					tx.executeSql('INSERT INTO METREE_OBTURATION_TYPE (METREE_ID, COLLABORATOR_ID, OBTURATION_TYPE_ID, CREATED) VALUES(?, ?, ?, ?)', 
							      [thisMetree_Obturation_Type.metree_id,
							       thisMetree_Obturation_Type.collaborator_id,
							       thisMetree_Obturation_Type.obturation_type_id,
							       thisMetree_Obturation_Type.created], 
							      function(tx, rs) {
										thisMetree_Obturation_Type.fireEvent();	
								  }, 
							      function() {
								  	  alert('Metree_Obturation_Type INSERT Error');
								  });
				});
			}
		},
		unassign: function() {
//		if(DEBUG) alert('Metree_Obturation_Type.suppress()');
		var thisMetree_Obturation_Type = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/unassignObturationTypeFromMetree";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"material_id": thisMetree_Obturation_Type.metree_id,
						   "collaborator_id": thisMetree_Obturation_Type.collaborator_id,	
					       "workorder_id": thisMetree_Obturation_Type.obturation_type_id,
					       "created": thisMetree_Obturation_Type.created},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisMetree_Obturation_Type.fireEvent();
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
					tx.executeSql('DELETE FROM METREE_OBTURATION_TYPE  WHERE (METREE_ID = ? AND COLLABORATOR_ID = ? AND OBTURATION_TYPE_ID = ? AND CREATED = ?)', 
							      [thisMetree_Obturation_Type.metree_id,
							       thisMetree_Obturation_Type.collaborator_id,
							       thisMetree_Obturation_Type.obturation_type_id,
							       thisMetree_Obturation_Type.created], 
							      function(tx, rs) {
										thisMetree_Obturation_Type.fireEvent();	
								  }, 
							      function() {
								  	  alert('Metree_Obturation_Type DELETE Error');
								  });
				});
			}
		},
		show: function() {
			var thisMetree_Obturation_Type = this;
			alert('Metree_Obturation_Type Data:\n' +
				  'Metree Id: ' + thisMetree_Obturation_Type.metree_id + '\n' + 	
				  'Collaborator Id: ' + thisMetree_Obturation_Type.collaborator_id + '\n' + 	
				  'Obturation Type Id: ' + thisMetree_Obturation_Type.obturation_type_id + '\n' + 
				  'Created:' + thisMetree_Obturation_Type.created + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		if(DEBUG) alert('Enter Metree_Obturation_Type.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		if(DEBUG) alert('Enter Metree_Obturation_Type.removeEventListener() ...');
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
//		if(DEBUG) alert('Executing Metree_Obturation_Type.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		if(DEBUG) alert('Metree_Obturation_Type.AssignEvent');
		var thisMetree_Obturation_Type = this;
			if (element!==null && typeof element==='object') {
//				if(DEBUG) alert('It is an Object');
				thisMetree_Obturation_Type.objectId = new Object();
				thisMetree_Obturation_Type.objectId = element;
				thisMetree_Obturation_Type.objectId.addEventListener('Metree_Obturation_Type', 'onMetree_Obturation_Type', false);
			}
			else {
//				if(DEBUG) alert('It is an HTML Element');
				thisMetree_Obturation_Type.htmlElement = element;
				document.getElementById(thisMetree_Obturation_Type.htmlElement).addEventListener("Metree_Obturation_Type", onMetree_Obturation_Type, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) alert('Metree_Obturation_Type.FireEvent');
		var thisMetree_Obturation_Type = this;
			thisMetree_Obturation_Type.Metree_Obturation_TypeEvent.detail.metree_id = thisMetree_Obturation_Type.metree_id;
			thisMetree_Obturation_Type.Metree_Obturation_TypeEvent.detail.collaborator_id = thisMetree_Obturation_Type.collaborator_id;
			thisMetree_Obturation_Type.Metree_Obturation_TypeEvent.detail.obturation_type_id = thisMetree_Obturation_Type.obturation_type_id;
			thisMetree_Obturation_Type.Metree_Obturation_TypeEvent.detail.created = thisMetree_Obturation_Type.created;
			if (thisMetree_Obturation_Type.objectId!=null){
//				if(DEBUG) alert('Event fired to an Object');
				thisMetree_Obturation_Type.objectId.dispatchEvent(thisMetree_Obturation_Type.Metree_Obturation_TypeEvent);
			}
			if(thisMetree_Obturation_Type.htmlElement!=null) {
//				if(DEBUG) alert('Event fired to an HTML Element');
				document.getElementById(thisMetree_Obturation_Type.htmlElement).dispatchEvent(thisMetree_Obturation_Type.Metree_Obturation_TypeEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('Metree_Obturation_Type.store()');
			localStorage.setItem('Metree_Obturation_Type', JSON.stringify(this));
		},
		restore: function() {
//		if(DEBUG) alert('Metree_Obturation_Type.restore()');
		var thisMetree_Obturation_Type = this;
		var item = JSON.parse(localStorage.getItem('Metree_Obturation_Type'));	
			thisMetree_Obturation_Type.metree_id = item.metree_id;
			thisMetree_Obturation_Type.collaborator_id = item.collaborator_id;
			thisMetree_Obturation_Type.obturation_type_id = item.obturation_type_id;
			thisMetree_Obturation_Type.created = item.created;
			thisMetree_Obturation_Type.htmlElement = item.htmlElement;
			thisMetree_Obturation_Type.objectId = item.objectId;
			thisMetree_Obturation_Type.Metree_Obturation_TypeEvent = item.Metree_Obturation_TypeEvent;
			thisMetree_Obturation_Type.fireEvent();
		},
		remove: function() {
//		if(DEBUG) alert('Metree_Obturation_Type.remove()');
		var thisMetree_Obturation_Type = this;
			localStorage.removeItem('Metree_Obturation_Type');
		},
		isStored: function() {
//		if(DEBUG) alert('Metree_Obturation_Type.isStored()');
		var thisMetree_Obturation_Type = this;
		var storage = localStorage.getItem('Metree_Obturation_Type');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return Metree_Obturation_Type;
})();


var Metree_Obturation_TypesCollection = (function () {
	
	var Metree_Obturation_TypesCollection = function () {
//		if(DEBUG) alert('Enter Metree_Obturation_TypesCollection() Constructor...');
		this.count = 0;
		this.collection = [];
		this.obturationTypes = 'None';
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.Metree_Obturation_TypesCollectionEvent = new CustomEvent("Metree_Obturation_TypesCollection", {
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
				this.Metree_Obturation_TypesCollectionEvent = new CustomEvent("Metree_Obturation_TypesCollection", {
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
				this.Metree_Obturation_TypesCollectionEvent = document.createEvent("CustomEvent");
				this.Metree_Obturation_TypesCollectionEvent.initCustomEvent('Metree_Obturation_TypesCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
//		if(DEBUG) alert('Exit Constructor...');
	};

	Metree_Obturation_TypesCollection.prototype = {
		reset: function() {
		if(DEBUG) alert('reset');
			this.collection.splice(0, this.collection.length);
			this.count = this.collection.length; 
		},
		load: function(metreeId, collaboratorId, created) {
//		if(DEBUG) alert('load');
		var thisMetree_Obturation_TypesCollection = this;
		
			thisMetree_Obturation_TypesCollection.reset();
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getMetreeObturationTypes";
				thisMetree_Obturation_TypesCollection.reset();
				$.ajax ({
					type: "GET",
					url: url,
					data: {"metree_id": metreeId,
						   "collaborator_id": collaboratorId,
						   "created": created},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var key = 0;
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        item = new Metree_Obturation_Type($this.find("METREE_ID").text(),
					        								  $this.find("COLLABORATOR_ID").text(), 
					        							      $this.find("OBTURATION_TYPE_ID").text(),
					        							      $this.find("CREATED").text());
	//				        alert(JSON.stringify(item));
					        thisMetree_Obturation_TypesCollection.add(item);
					        (key==0) ? thisMetree_Obturation_TypesCollection.obturationTypes = $this.find("SHORTNAME").text() : thisMetree_Obturation_TypesCollection.obturationTypes + ',' + $this.find("SHORTNAME").text();  
					        key++;
					    });
					    thisMetree_Obturation_TypesCollection.fireEvent();
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
					tx.executeSql('SELECT MOT.METREE_ID, MOT.COLLABORATOR_ID, MOT.OBTURATION_TYPE_ID, MOT.CREATED, OT.NAME, OT.SHORTNAME  FROM METREE_OBTURATION_TYPE MOT JOIN OBTURATION_TYPE OT ON MOT.OBTURATION_TYPE_ID = OT.OBTURATION_TYPE_ID WHERE MOT.METREE_ID = ? AND MOT.COLLABORATOR_ID = ?',
							      [metreeId,
							       collaboratorId], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
									for (var i=0; i<data.length; i++) {
								        var item = new Metree_Obturation_Type(data.item(i).METREE_ID,
								        									  data.item(i).COLLABORATOR_ID,	
								        								  	  data.item(i).OBTURATION_TYPE_ID,
								        								  	  data.item(i).CREATED);
//								        alert(JSON.stringify(item));
								        thisMetree_Obturation_TypesCollection.add(item);
								        (key==0) ? thisMetree_Obturation_TypesCollection.obturationTypes = data.item(i).SHORTNAME : thisMetree_Obturation_TypesCollection.obturationTypes = thisMetree_Obturation_TypesCollection.obturationTypes + ',' + data.item(i).SHORTNAME;  
								        key++;
									}
									thisMetree_Obturation_TypesCollection.fireEvent();
								  }, 
								  function() {
									  alert('Metree_Obturation_Types Collection SELECT Error');
								  });
				});
			}
		},
		clear: function() {
		if(DEBUG) alert('reset');
			this.collection.splice(0, this.collection.length);
			this.count = this.collection.length; 
		},
		add: function(item) {
		if(DEBUG) alert('Metree_Obturation_TypesCollection.add()');
			if(!this.exist(item)) {
				this.collection.push(item);
				this.count = this.collection.length;
			}
			else {
				alert('Item already exists ...');
			}
		},
		remove: function(idx) {
			if(this.collection[idx]!=undefined) {
				this.collection.splice(idx, 1);
				this.count = this.collection.length;
			}
		},
		removeById: function(id) {
		var result  = this.collection.filter(function(o){return o.id == id;} );
			result ? this.collection.splice(this.collection.indexOf(result[0]), 1) : alert('Item not found ...');
		},
		exist: function(item) {
			if($.grep(this.collection, function(e) { return (e.metree_id == item.metree_id) && (e.obturation_type_id == item.obturation_type_id); }).length===0) {
				return false;
			}
			else {
				return true;
			}
		},
		item: function(idx) {
			if(this.collection[idx]!=undefined) {
				return this.collection[idx];
			}
			return undefined;
		},
		itemById: function(id) {
		var result  = this.collection.filter(function(o){return o.id == id;} );
			return result ? result[0] : null; // or undefined			
		},
		assignEvent: function(element) {
//		alert('AssignEvent');
		var thisMetree_Obturation_TypesCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisMetree_Obturation_TypesCollection.objectId = new Object();
				thisMetree_Obturation_TypesCollection.objectId = element;
				thisMetree_Obturation_TypesCollection.objectId.addEventListener('Metree_Obturation_TypesCollection', 'onMetree_Obturation_TypesCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisMetree_Obturation_TypesCollection.htmlElement = element;
				document.getElementById(thisMetree_Obturation_TypesCollection.htmlElement).addEventListener("Metree_Obturation_TypesCollection", onMetree_Obturation_TypesCollection, false);
			}
		},
		fireEvent: function() {
//		alert('FireEvent');
		var thisMetree_Obturation_TypesCollection = this;
			thisMetree_Obturation_TypesCollection.Metree_Obturation_TypesCollectionEvent.detail.count = thisMetree_Obturation_TypesCollection.count;
			thisMetree_Obturation_TypesCollection.Metree_Obturation_TypesCollectionEvent.detail.items = thisMetree_Obturation_TypesCollection.collection;
			if (thisMetree_Obturation_TypesCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisMetree_Obturation_TypesCollection.objectId.dispatchEvent(thisMetree_Obturation_TypesCollection.Metree_Obturation_TypesCollectionEvent);
			}
			if(thisMetree_Obturation_TypesCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisMetree_Obturation_TypesCollection.htmlElement).dispatchEvent(thisMetree_Obturation_TypesCollection.Metree_Obturation_TypesCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('Metree_Obturation_TypesCollection.store()');
		var thisMetree_Obturation_TypesCollection = this;
			localStorage.setItem('Metree_Obturation_TypesCollection', JSON.stringify(thisMetree_Obturation_TypesCollection));
		},
		restore: function() {
//		if(DEBUG) alert('Metree_Obturation_TypesCollection.restore()');
		var thisMetree_Obturation_TypesCollection = this;
		var item = JSON.parse(localStorage.getItem('Metree_Obturation_TypesCollection'));	
			thisMetree_Obturation_TypesCollection.count = item.count;
			thisMetree_Obturation_TypesCollection.collection = item.collection;
			thisMetree_Obturation_TypesCollection.htmlElement = item.htmlElement;
			thisMetree_Obturation_TypesCollection.objectId = item.objectId;
			thisMetree_Obturation_TypesCollection.Metree_Obturation_TypesCollectionEvent = item.Metree_Obturation_TypesCollectionEvent;
			thisMetree_Obturation_TypesCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('Metree_Obturation_TypesCollection.unstore()');
			localStorage.removeItem('Metree_Obturation_TypesCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('Metree_Obturation_TypesCollection.isStored()');
		var storage = localStorage.getItem('Metree_Obturation_TypesCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
		
	};
	return Metree_Obturation_TypesCollection;
	
})();
