//////////////////////////////////////////////////
// Define Metree_Document Class
//////////////////////////////////////////////////

/** Metree_Document
 * This class encapsulates a Metree_Document.
 *
 */	
/**
 * @author Hell
 */
/**
 *  Metree_Document Class Definition 
 */
var Metree_Document = (function () {
	var Metree_Document = function (metree_id, collaborator_id, metree_document_type_id, document_id, created) {
//		alert('Enter Metree_Document() Constructor...');
		this.metree_id = metree_id || -1;
		this.collaborator_id = collaborator_id || -1;
		this.metree_document_type_id = metree_document_type_id || -1;
		this.document_id = document_id || -1;
		this.created = created || new Date();
		this.status = '';
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.Metree_DocumentEvent = new CustomEvent("Metree_Document", {
				detail: {
					metree_id: 0,
					collaborator_id: 0,
					metree_document_type_id: 0,
					document_id: 0,
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
				this.Metree_DocumentEvent = new CustomEvent("Metree_Document", {
					detail: {
						metree_id: 0,
						collaborator_id: 0,
						metree_document_type_id: 0,
						document_id: 0,
						created: new Date(),
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.Metree_DocumentEvent = document.createEvent("CustomEvent");
				this.Metree_DocumentEvent.initCustomEvent('Metree_Document', true, false, {metree_id: 0, collaborator_id: 0, metree_document_type_id: 0, document_id: 0, created: new Date(), time: new Date()});
			}
		}
//		alert('Exit Metree_Document Constructor...');
	};

	Metree_Document.prototype = {
		reset: function() {
//		alert('Metree_Document.reset()');
		var thisMetree_Document = this;
			thisMetree_Document.metree_id = -1;
			thisMetree_Document.collaborator_id = -1;
			thisMetree_Document.metree_document_type_id = -1;
			thisMetree_Document.document_id = -1;
			thisMetree_Document.created = new Date();
		    thisMetree_Document.fireEvent();
		},
		assign: function() {
		if(DEBUG) alert('Metree_Document.assign()');
		var thisMetree_Document = this;
		
			if(LOCAL_DB==false) {
				var url =  urlDataServices + "/assignDocumentToMetree";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"metree_id": thisMetree_Document.metree_id,
						   "collaborator_id": thisMetree_Document.collaborator_id,
						   "metree_document_type_id": thisMetree_Document.metree_document_type_id,
						   "document_id": thisMetree_Document.document_id,
						   "created": thisMetree_Document.created},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        thisMetree_Document.status = $this.find("REQUEST_STATUS").text();
//					        alert(':::: ' + thisMetree_Document.status);
					    });
					    thisMetree_Document.fireEvent();
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
					tx.executeSql('INSERT INTO METREE_DOCUMENT (METREE_ID, COLLABORATOR_ID, METREE_DOCUMENT_TYPE_ID, DOCUMENT_ID, CREATED) VALUES (?, ?, ?, ?, ?)', 
						      	  [thisMetree_Document.metree_id,
						      	   thisMetree_Document.collaborator_id,
						           thisMetree_Document.metree_document_type_id,
						           thisMetree_Document.document_id,
						           thisMetree_Document.created], 
						          function(tx, rs) {
								  		thisMetree_Document.fireEvent();	
							  	  }, 
							  	  function() {
							  		  	alert('Metree_Document INSERT Error');
							  	  });
				});
			}
		},
		unassign: function() {
//		alert('Metree_Document.update()');	
		var thisMetree_Document = this;
		
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/unassignDocumentFromMetree";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"metree_id": thisMetree_Document.metree_id,
						   "collaborator_id":thisMetree_Document.collaborator_id,
						   "metree_document_type_id": thisMetree_Document.metree_document_type_id,
						   "document_id": thisMetree_Document.document_id,
						   "created": thisMetree_Document.created},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisMetree_Document.fireEvent();
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
					tx.executeSql('DELETE FROM METREE_DOCUMENT WHERE (METREE_ID = ? AND COLLABORATOR_ID = ? AND DOCUMENT_ID = ? AND CREATED = ?)', 
						      	  [thisMetree_Document.metree_id,
						      	   thisMetree_Document.collaborator_id,
						           thisMetree_Document.document_id,
						           thisMetree_Document.created], 
						          function() {
										thisWorkOrder_Collaborator.fireEvent();	
							  	  }, 
							  	  function() {
							  		  	alert('Metree_Document DELETE Error');
							  	  });
				});
			}
		},
		show: function() {
		var thisMetree_Document = this;
			alert('Metree_Document Data:\n' +
				  'Metree Id: ' + thisMetree_Document.metree_id + '\n' +
				  'Collaborator Id: ' + thisMetree_Document.collaborator_id + '\n' +
				  'Metree Document Type Id: ' + thisMetree_Document.metree_document_type_id + '\n' +
				  'Document Id: ' + thisMetree_Document.document_id + '\n' +
				  'Created: ' + thisMetree_Document.created + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter Metree_Document.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter Metree_Document.removeEventListener() ...');
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
//		alert('Executing Metree_Document.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		alert('Metree_Document.AssignEvent');
		var thisMetree_Document = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisMetree_Document.objectId = new Object();
				thisMetree_Document.objectId = element;
				thisMetree_Document.objectId.addEventListener('Metree_Document', 'onMetree_Document', false);
			}
			else {
//				alert('It is an HTML Element');
				thisMetree_Document.htmlElement = element;
				document.getElementById(thisMetree_Document.htmlElement).addEventListener("Metree_Document", onMetree_Document, false);
			}
		},
		fireEvent: function() {
//		alert('Metree_Document.FireEvent');
		var thisMetree_Document = this;
			thisMetree_Document.Metree_DocumentEvent.detail.metree_id = thisMetree_Document.metree_id;
			thisMetree_Document.Metree_DocumentEvent.detail.collaborator_id = thisMetree_Document.collaborator_id;
			thisMetree_Document.Metree_DocumentEvent.detail.metree_document_type_id = thisMetree_Document.metree_document_type_id;
			thisMetree_Document.Metree_DocumentEvent.detail.document_id = thisMetree_Document.document_id;
			thisMetree_Document.Metree_DocumentEvent.detail.created = thisMetree_Document.created;
			if (thisMetree_Document.objectId!=null){
//				alert('Event fired to an Object');
				thisMetree_Document.objectId.dispatchEvent(thisMetree_Document.Metree_DocumentEvent);
			}
			if(thisMetree_Document.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisMetree_Document.htmlElement).dispatchEvent(thisMetree_Document.Metree_DocumentEvent);
			}
		},
		store: function() {
//		alert('Metree_Document.store()');
			localStorage.setItem('Metree_Document', JSON.stringify(this));
		},
		restore: function() {
//		alert('Metree_Document.restore()');
		var thisMetree_Document = this;
		var item = JSON.parse(localStorage.getItem('Metree_Document'));	
			thisMetree_Document.metree_id = item.metree_id;
			thisMetree_Document.collaborator_id = item.collaborator_id;
			thisMetree_Document.metree_document_type_id = item.metree_document_type_id;
			thisMetree_Document.document_id = item.document_id;
			thisMetree_Document.created = item.created;
		},
		remove: function() {
		alert('Metree_Document.remove()');
		var thisMetree_Document = this;
			localStorage.removeItem('Metree_Document');
		},
		isStored: function() {
//		alert('Metree_Document.isStored()');
		var thisMetree_Document = this;
		var storage = localStorage.getItem('Metree_Document');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return Metree_Document;
})();


var Metree_DocumentsCollection = (function () {
	
	var Metree_DocumentsCollection = function () {
//		alert('Enter Metree_DocumentsCollection() Constructor...');
		this.count = 0;
		this.collection = [];
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.Metree_DocumentsCollectionEvent = new CustomEvent("Metree_DocumentsCollection", {
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
				this.Metree_DocumentsCollectionEvent = new CustomEvent("Metree_DocumentsCollection", {
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
				this.Metree_DocumentsCollectionEvent = document.createEvent("CustomEvent");
				this.Metree_DocumentsCollectionEvent.initCustomEvent('Metree_DocumentsCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
//		alert('Exit Constructor...');
	};

	Metree_DocumentsCollection.prototype = {
		load: function(id) {
//		alert('load');
		var thisMetree_DocumentsCollection = this;

			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getMetreeDocuments";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"metree_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var key = 0;
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        item = new Metree_Document($this.find("METREE_ID").text(),
					        						   $this.find("COLLABORATOR_ID").text(),
					        						   $this.find("METREE_DOCUMENT_TYPE_ID").text(),
					        						   $this.find("DOCUMENT_ID").text(),
					        						   $this.find("CREATED").text());
	//				        alert(JSON.stringify(item));
					        thisMetree_DocumentsCollection.add(item);
					    });
					    thisMetree_DocumentsCollection.fireEvent();
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
					tx.executeSql('SELECT METREE_ID, COLLABORATOR_ID, METREE_DOCUMENT_TYPE_ID, DOCUMENT_ID, CREATED  FROM METREE_DOCUMENT WHERE METREE_ID = ?',
						      [id], 
						      function (tx, rs) {
							  	var data = rs.rows;
							  	var key = 0;
								for (var i=0; i<data.length; i++) {
							        var item = new Metree_Document(data.item(i).METREE_ID, 
							        							   data.item(i).METREE_DOCUMENT_TYPE_ID,
							        							   data.item(i).DOCUMENT_ID,
							        							   data.item(i).CREATED);
//							        alert(JSON.stringify(item));
							        thisMetree_DocumentsCollection.add(item);
								}
								thisMetree_DocumentsCollection.fireEvent();
							  }, 
							  function() {
								  alert('Metree_Documents Collection SELECT Error');
							  });
				});
			}
		},
		clear: function() {
			this.collection.splice(0, this.collection.length);
			this.count = this.collection.length; 
		},
		add: function(item) {
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
			if($.grep(this.collection, function(e) { return e.id == item.id; }).length===0) {
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
		var thisMetree_DocumentsCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisMetree_DocumentsCollection.objectId = new Object();
				thisMetree_DocumentsCollection.objectId = element;
				thisMetree_DocumentsCollection.objectId.addEventListener('Metree_DocumentsCollection', 'onMetree_DocumentsCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisMetree_DocumentsCollection.htmlElement = element;
				document.getElementById(thisMetree_DocumentsCollection.htmlElement).addEventListener("Metree_DocumentsCollection", onMetree_DocumentsCollection, false);
			}
		},
		fireEvent: function() {
//		alert('FireEvent');
		var thisMetree_DocumentsCollection = this;
			thisMetree_DocumentsCollection.Metree_DocumentsCollectionEvent.detail.count = thisMetree_DocumentsCollection.count;
			thisMetree_DocumentsCollection.Metree_DocumentsCollectionEvent.detail.items = thisMetree_DocumentsCollection.collection;
			if (thisMetree_DocumentsCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisMetree_DocumentsCollection.objectId.dispatchEvent(thisMetree_DocumentsCollection.Metree_DocumentsCollectionEvent);
			}
			if(thisMetree_DocumentsCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisMetree_DocumentsCollection.htmlElement).dispatchEvent(thisMetree_DocumentsCollection.Metree_DocumentsCollectionEvent);
			}
		},
		store: function() {
			localStorage.setItem('Metree_DocumentsCollection', JSON.stringify(this.collection));
		},
		restore: function() {
		var objects = JSON.parse(localStorage.getItem('Metree_DocumentsCollection'));
			this.clear();
			for(var idx=0; idx<objects.length; idx++) { 
				var item = new Metree_Document(objects[idx].metree_id, objects[idx].metree_document_type_id, objects[idx].document_id);
				this.add(item);
			}
			this.count = this.collection.length;
			this.fireEvent();
		},
		unstore: function() {
			localStorage.removeItem('Metree_DocumentsCollection');
		},
		isStored: function() {
		var storage = localStorage.getItem('Metree_DocumentsCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return Metree_DocumentsCollection;
	
})();
