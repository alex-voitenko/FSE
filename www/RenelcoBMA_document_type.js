//////////////////////////////////////////////////
// Define DocumentType Class
//////////////////////////////////////////////////

/** DocumentType
 * This class encapsulates a DocumentType.
 *
 */	
/**
 * @author Hell
 */
/**
 *  DocumentType Class Definition 
 */
var DocumentType = (function () {
	var DocumentType = function (id, name, description) {
//		alert('Enter DocumentType() Constructor...');
		this.id = id || -1;
		this.name = name || -1;
		this.description = description || -1;
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.DocumentTypeEvent = new CustomEvent("DocumentType", {
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
				this.DocumentTypeEvent = new CustomEvent("DocumentType", {
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
				this.DocumentTypeEvent = document.createEvent("CustomEvent");
				this.DocumentTypeEvent.initCustomEvent('DocumentType', true, false, {id: 0, name: '', description: '', time: new Date()});
			}
		}
//		alert('Exit DocumentType Constructor...');
	};

	DocumentType.prototype = {
		reset: function() {
//		alert('DocumentType.reset()');
			var thisDocumentType = this;
			thisDocumentType.id = -1;
		    thisDocumentType.fireEvent();
		},
		create: function() {
//		alert('DocumentType.create()');
		var thisDocumentType = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/addDocumentType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"name": thisDocumentType.name, "description": thisDocumentType.description},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisDocumentType.id = returnedId;
					    });
					    thisDocumentType.fireEvent();
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
					tx.executeSql('INSERT INTO DOCUMENT_TYPE  ' +
								  '(NAME, DESCRIPTION) ' +
								  'VALUES(?,?)',
								  [thisDocumentType.name, 
								   thisDocumentType.description],
							   	   function(tx, rs) {
										thisDocumentType.id = rs.insertId;
										thisDocumentType.fireEvent();
								   },
								   function() {
									   alert('DocumentType INSERT Error');
								   });
				});
			}
		},
		update: function() {
//		alert('DocumentType.update()');	
		var thisDocumentType = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/saveDocumentType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"name": thisDocumentType.name, "description": thisDocumentType.description, "document_type_id": thisDocumentType.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisDocumentType.fireEvent();
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
					tx.executeSql('UPDATE DOCUMENT_TYPE  ' +
								  'SET ' +
								  'NAME = ?,' +
								  'DESCRIPTION = ?,' +
								  'WHERE DOCUMENT_TYPE_ID = ?',
								  [thisDocumentType.name,
								   thisDocumentType.description,
								   thisDocumentType.id],
							   	   function() {
										thisDocumentType.fireEvent();
								   },
								   function() {
									   alert('DocumentType UPDATE Error');
								   });
				});
			}
		},
		suppress: function() {
//		alert('DocumentType.suppress()');
		var thisDocumentType = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/deleteDocumentType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"document_type_id": thisDocumentType.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisDocumentType.fireEvent();
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
					tx.executeSql('DELETE FROM DOCUMENT_TYPE WHERE DOCUMENT_TYPE_ID = ?',
							      [thisDocumentType.id], 
							      function() {
										thisDocumentType.fireEvent();	
								  }, 
							      function() {
								  	  alert('DocumentType DELETE Error');
								  });
				});
			}
		},
		select: function(id) {
//		alert('DocumentType.select(' + id + ')');
		var thisDocumentType = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getDocumentType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"document_type_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        // Add Data Retrieval Code Here
					    });
					    thisDocumentType.fireEvent();
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
					tx.executeSql('SELECT DOCUMENT_TYPE_ID, NAME, DESCRIPTION  ' + 
								  'FROM DOCUMENT_TYPE  ' + 
								  'WHERE DOCUMENT_TYPE_ID = ?',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        thisDocumentType.id = data.item(i).COLLABORATOR_TYPE_ID;
								        thisDocumentType.name = data.item(i).NAME;
								        thisDocumentType.description = data.item(i).DESCRIPTION;
									}
									thisDocumentType.fireEvent();
								  }, 
								  function() {
									  alert('DocumentType SELECT Error');
								  });
				});
			}
		},
		show: function() {
			var thisDocumentType = this;
			alert('DocumentType Data:\n' +
				  'Id: ' + this.id + '\n' +	
				  'Name: ' + this.name + '\n' +	
				  'Description: ' + this.description + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter DocumentType.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter DocumentType.removeEventListener() ...');
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
//		alert('Executing DocumentType.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		alert('DocumentType.AssignEvent');
		var thisDocumentType = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisDocumentType.objectId = new Object();
				thisDocumentType.objectId = element;
				thisDocumentType.objectId.addEventListener('DocumentType', 'onDocumentType', false);
			}
			else {
//				alert('It is an HTML Element');
				thisDocumentType.htmlElement = element;
				document.getElementById(thisDocumentType.htmlElement).addEventListener("DocumentType", onDocumentType, false);
			}
		},
		fireEvent: function() {
//		alert('DocumentType.FireEvent');
		var thisDocumentType = this;
			thisDocumentType.DocumentTypeEvent.detail.id = thisDocumentType.id;
			thisDocumentType.DocumentTypeEvent.detail.name = thisDocumentType.name;
			thisDocumentType.DocumentTypeEvent.detail.description = thisDocumentType.description;
			if (thisDocumentType.objectId!=null){
//				alert('Event fired to an Object');
				thisDocumentType.objectId.dispatchEvent(thisDocumentType.DocumentTypeEvent);
			}
			if(thisDocumentType.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisDocumentType.htmlElement).dispatchEvent(thisDocumentType.DocumentTypeEvent);
			}
		},
		store: function() {
//		alert('DocumentType.store()');
			localStorage.setItem('DocumentType', JSON.stringify(this));
		},
		restore: function() {
//		alert('DocumentType.restore()');
		var thisDocumentType = this;
		var item = JSON.parse(localStorage.getItem('DocumentType'));	
			this.id = item.id;
			this.name = item.name;
			this.description = item.description;
			this.fireEvent();
		},
		remove: function() {
		alert('DocumentType.remove()');
		var thisDocumentType = this;
			localStorage.removeItem('DocumentType');
		},
		isStored: function() {
//		alert('DocumentType.isStored()');
		var thisDocumentType = this;
		var storage = localStorage.getItem('DocumentType');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return DocumentType;
})();


var DocumentTypeCollection = (function () {
	
	var DocumentTypeCollection = function () {
		if(DEBUG) alert('Enter DocumentTypeCollection() Constructor...');
		this.count = 0;
		this.collection = [];
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.DocumentTypeCollectionEvent = new CustomEvent("DocumentTypeCollection", {
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
				this.DocumentTypeCollectionEvent = new CustomEvent("DocumentTypeCollection", {
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
				this.DocumentTypeCollectionEvent = document.createEvent("CustomEvent");
				this.DocumentTypeCollectionEvent.initCustomEvent('DocumentTypeCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Constructor...');
	};

	DocumentTypeCollection.prototype = {
		load: function() {
		if(DEBUG) alert('load');
		var thisDocumentTypeCollection = this;

			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getDocumentTypes";
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
					        item = new DocumentType($this.find("DOCUMENT_TYPE_ID").text(),
					          		                $this.find("NAME").text(),
					           		                $this.find("DESCRIPTION").text());
//					        alert(JSON.stringify(item));
					        thisDocumentTypeCollection.add(item);
					    });
					    thisDocumentTypeCollection.fireEvent();
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
					tx.executeSql('SELECT DOCUMENT_TYPE_ID, NAME, DESCRIPTION FROM DOCUMENT_TYPE',
							      [], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        var item = new CollaboratorType(data.item(i).DOCUMENT_TYPE_ID,
								        							    data.item(i).NAME,
								        							    data.item(i).DESCRIPTION);
//				        				alert(JSON.stringify(item));
								        thisDocumentTypeCollection.add(item);
									}
								    thisDocumentTypeCollection.fireEvent();
								  }, 
								  function() {
									  alert('DocumentTypeCollection SELECT Error');
								  });
				});
			}
		},
		clear: function() {
		if(DEBUG) alert('DocumentTypeCollection.clear()');
			this.collection.splice(0, this.collection.length);
			this.count = this.collection.length; 
		},
		add: function(item) {
		if(DEBUG) alert('DocumentTypeCollection.add()');
			if(!this.exist(item)) {
				this.collection.push(item);
				this.count = this.collection.length;
			}
			else {
				alert('Item already exists ...');
			}
		},
		remove: function(idx) {
		if(DEBUG) alert('DocumentTypeCollection.remove(' + idx + ')');
			if(this.collection[idx]!=undefined) {
				this.collection.splice(idx, 1);
				this.count = this.collection.length;
			}
		},
		removeById: function(id) {
		if(DEBUG) alert('DocumentTypeCollection.removeById(' + id + ')');
		var result  = this.collection.filter(function(o){return o.id == id;} );
			result ? this.collection.splice(this.collection.indexOf(result[0]), 1) : alert('Item not found ...');
		},
		exist: function(item) {
		if(DEBUG) alert('DocumentTypeCollection.exist()');
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
//		alert('AssignEvent');
		var thisDocumentTypeCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisDocumentTypeCollection.objectId = new Object();
				thisDocumentTypeCollection.objectId = element;
				thisDocumentTypeCollection.objectId.addEventListener('DocumentTypeCollection', 'onDocumentTypeCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisDocumentTypeCollection.htmlElement = element;
				document.getElementById(thisDocumentTypeCollection.htmlElement).addEventListener("DocumentTypeCollection", onDocumentTypeCollection, false);
			}
		},
		fireEvent: function() {
//		alert('FireEvent');
		var thisDocumentTypeCollection = this;
			thisDocumentTypeCollection.DocumentTypeCollectionEvent.detail.count = thisDocumentTypeCollection.count;
			thisDocumentTypeCollection.DocumentTypeCollectionEvent.detail.items = thisDocumentTypeCollection.collection;
			if (thisDocumentTypeCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisDocumentTypeCollection.objectId.dispatchEvent(thisDocumentTypeCollection.DocumentTypeCollectionEvent);
			}
			if(thisDocumentTypeCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisDocumentTypeCollection.htmlElement).dispatchEvent(thisDocumentTypeCollection.DocumentTypeCollectionEvent);
			}
		},
		store: function() {
		if(DEBUG) alert('DocumentTypeCollection.store()');
			localStorage.setItem('DocumentTypeCollection', JSON.stringify(this.collection));
		},
		restore: function() {
		if(DEBUG) alert('DocumentTypeCollection.restore()');
		var objects = JSON.parse(localStorage.getItem('DocumentTypeCollection'));
			this.clear();
			for(var idx=0; idx<objects.length; idx++) { 
				var item = new DocumentType(objects[idx].id, objects[idx].name, objects[idx].description);
				this.add(item);
			}
			this.count = this.collection.length;
			this.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('DocumentTypeCollection.unstore()');
			localStorage.removeItem('DocumentTypeCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('DocumentTypeCollection.isStored()');
		var storage = localStorage.getItem('DocumentTypeCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return DocumentTypeCollection;
	
})();
