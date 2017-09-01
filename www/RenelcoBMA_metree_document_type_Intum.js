//////////////////////////////////////////////////
// Define MetreeDocumentType Class
//////////////////////////////////////////////////

/** MetreeDocumentType
 * This class encapsulates a MetreeDocumentType.
 *
 */	
/**
 * @author Hell
 */
/**
 *  MetreeDocumentType Class Definition 
 */
var MetreeDocumentType = (function () {
	var MetreeDocumentType = function (id, name, description) {
		alert('Enter MetreeDocumentType() Constructor...');
		this.id = id || -1;
		this.name = name || '';
		this.description = description || '';
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.MetreeDocumentTypeEvent = new CustomEvent("MetreeDocumentType", {
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
				this.MetreeDocumentTypeEvent = new CustomEvent("MetreeDocumentType", {
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
				this.MetreeDocumentTypeEvent = document.createEvent("CustomEvent");
				this.MetreeDocumentTypeEvent.initCustomEvent('MetreeDocumentType', true, false, {id: 0, name: '', description: '', time: new Date()});
			}
		}
		alert('Exit MetreeDocumentType Constructor...');
	};

	MetreeDocumentType.prototype = {
		reset: function() {
//		alert('MetreeDocumentType.reset()');
			var thisMetreeDocumentType = this;
			thisMetreeDocumentType.id = -1;
			thisMetreeDocumentType.name = '';
			thisMetreeDocumentType.description = '';
		    thisMetreeDocumentType.fireEvent();
		},
		create: function() {
//		alert('MetreeDocumentType.create()');
		var thisMetreeDocumentType = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/addMetreeDocumentType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"name": thisMetreeDocumentType.name, "description": thisMetreeDocumentType.description},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisMetreeDocumentType.id = returnedId;
					    });
					    thisMetreeDocumentType.fireEvent();
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
					tx.executeSql('INSERT INTO METREE_DOCUMENT_TYPE  ' +
							      '(NAME, DESCRIPTION) ' +
							      'VALUES(?, ?)',
								  [thisMetreeDocumentType.name, 
								   thisMetreeDocumentType.description],
							   	   function(tx, rs) {
										thisMetreeDocumentType.id = rs.insertId;
										thisMetreeDocumentType.fireEvent();
								   },
								   function() {
									   alert('MetreeDocumentType INSERT Error');
								   });
				});
			}
		},
		update: function() {
//		alert('MetreeDocumentType.update()');	
		var thisMetreeDocumentType = this;
		
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/saveMetreeDocumentType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"name": thisMetreeDocumentType.name, "description": thisMetreeDocumentType.description, "metree_document_type_id": thisMetreeDocumentType.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisMetreeDocumentType.fireEvent();
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
					tx.executeSql('UPDATE METREE_DOCUMENT_TYPE  ' +
								  'SET  ' +
								  'NAME = ?, ' +
								  'DESCRIPTION = ? ' +
								  'WHERE METREE_DOCUMENT_TYPE_ID = ?',
								  [thisMetreeDocumentType.name,
								   thisMetreeDocumentType.description,
								   thisMetreeDocumentType.id],
							   	   function() {
										thisMetreeDocumentType.fireEvent();
								   },
								   function() {
									   alert('MetreeDocumentType UPDATE Error');
								   });
				});
			}
		},
		suppress: function() {
//		alert('MetreeDocumentType.suppress()');
		var thisMetreeDocumentType = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/deleteMetreeDocumentType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"metree_document_type_id": thisMetreeDocumentType.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisMetreeDocumentType.fireEvent();
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
					tx.executeSql('DELETE FROM METREE_DOCUMENT_TYPE  ' +
								  'WHERE METREE_DOCUMENT_TYPE_ID = ?',
							  	  [thisMetreeDocumentType.id], 
							      function() {
										thisMetreeDocumentType.fireEvent();	
								  }, 
							      function() {
								  	  alert('MetreeDocumentType DELETE Error');
								  });
				});
			}
		},
		select: function(id) {
		alert('MetreeDocumentType.select(' + id + ')');
		var thisMetreeDocumentType = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getMetreeDocumentType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"metree_document_type_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisMetreeDocumentType.id = $this.find("METREE_DOCUMENT_TYPE_ID").text();
					        thisMetreeDocumentType.name = $this.find("NAME").text();
					        thisMetreeDocumentType.description = $this.find("DESCRIPTION").text();
					    });
					    thisMetreeDocumentType.fireEvent();
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
					tx.executeSql('SELECT METREE_DOCUMENT_TYPE_ID, NAME, DESCRIPTION  ' +
								  'FROM METREE_DOCUMENT_TYPE  ' +
								  'WHERE METREE_DOCUMENT_TYPE_ID = ?',
								  [id],  
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        thisMetreeDocumentType.id = data.item(i).METREE_DOCUMENT_TYPE_ID;
								        thisMetreeDocumentType.name = data.item(i).NAME;
								        thisMetreeDocumentType.description = data.item(i).DESCRIPTION;
									}
									thisMetreeDocumentType.fireEvent();
								  }, 
								  function() {
									  alert('MetreeDocumentType SELECT Error');
								  });
				});
			}
		},
		show: function() {
		var thisMetreeDocumentType = this;
			alert('Metree Document Type Data:\n' +
				  'Name: ' + this.name + '\n' +	
				  'Description: ' + this.description + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter MetreeDocumentType.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter MetreeDocumentType.removeEventListener() ...');
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
//		alert('Executing MetreeDocumentType.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
		alert('MetreeDocumentType.AssignEvent');
		var thisMetreeDocumentType = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisMetreeDocumentType.objectId = new Object();
				thisMetreeDocumentType.objectId = element;
				thisMetreeDocumentType.objectId.addEventListener('MetreeDocumentType', 'onMetreeDocumentType', false);
			}
			else {
//				alert('It is an HTML Element');
				thisMetreeDocumentType.htmlElement = element;
				document.getElementById(thisMetreeDocumentType.htmlElement).addEventListener("MetreeDocumentType", onMetreeDocumentType, false);
			}
		},
		fireEvent: function() {
		alert('MetreeDocumentType.FireEvent');
		var thisMetreeDocumentType = this;
			thisMetreeDocumentType.MetreeDocumentTypeEvent.detail.id = thisMetreeDocumentType.id;
			thisMetreeDocumentType.MetreeDocumentTypeEvent.detail.name = thisMetreeDocumentType.name;
			thisMetreeDocumentType.MetreeDocumentTypeEvent.detail.description = thisMetreeDocumentType.description;
			if (thisMetreeDocumentType.objectId!=null){
//				alert('Event fired to an Object');
				thisMetreeDocumentType.objectId.dispatchEvent(thisMetreeDocumentType.MetreeDocumentTypeEvent);
			}
			if(thisMetreeDocumentType.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisMetreeDocumentType.htmlElement).dispatchEvent(thisMetreeDocumentType.MetreeDocumentTypeEvent);
			}
		},
		store: function() {
//		alert('MetreeDocumentType.store()');
			localStorage.setItem('MetreeDocumentType', JSON.stringify(this));
		},
		restore: function() {
//		alert('MetreeDocumentType.restore()');
		var thisMetreeDocumentType = this;
		var item = JSON.parse(localStorage.getItem('MetreeDocumentType'));	
			thisMetreeDocumentType.id = item.id;
			thisMetreeDocumentType.name = item.name;
			thisMetreeDocumentType.description = item.description;
		},
		remove: function() {
		alert('MetreeDocumentType.remove()');
		var thisMetreeDocumentType = this;
			localStorage.removeItem('MetreeDocumentType');
		},
		isStored: function() {
//		alert('MetreeDocumentType.isStored()');
		var thisMetreeDocumentType = this;
		var storage = localStorage.getItem('MetreeDocumentType');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return MetreeDocumentType;
})();

var MetreeDocumentTypeCollection = (function () {
	var MetreeDocumentTypeCollection = function () {
//		alert('Enter MetreeDocumentTypeCollection() Constructor...');
		this.count = 0;
		this.collection = [];
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.MetreeDocumentTypeCollectionEvent = new CustomEvent("MetreeDocumentTypeCollection", {
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
				this.MetreeDocumentTypeCollectionEvent = new CustomEvent("MetreeDocumentTypeCollection", {
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
				this.MetreeDocumentTypeCollectionEvent = document.createEvent("CustomEvent");
				this.MetreeDocumentTypeCollectionEvent.initCustomEvent('MetreeDocumentTypeCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
//		alert('Exit Constructor...');
	};

	MetreeDocumentTypeCollection.prototype = {
		load: function() {
//		alert('load');
		var thisMetreeDocumentTypeCollection = this;

			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getMetreeDocumentTypes";
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
					        item = new MetreeDocumentType($this.find("METREE_DOCUMENT_TYPE_ID").text(),
					        							  $this.find("NAME").text(),
					        							  $this.find("DESCRIPTION").text());
	//				        alert(JSON.stringify(item));
					        thisMetreeDocumentTypeCollection.add(item);
					    });
					    thisMetreeDocumentTypeCollection.fireEvent();
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
					tx.executeSql('SELECT METREE_DOCUMENT_TYPE_ID, NAME, DESCRIPTION FROM METREE_DOCUMENT_TYPE',
								  [], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        var item = new MetreeDocumentType(data.item(i).METREE_DOCUMENT_TYPE_ID,
								        								  data.item(i).NAME,
								        								  data.item(i).DESCRIPTION);
//				        				alert(JSON.stringify(item));
								        thisMetreeDocumentTypeCollection.add(item);
									}
								    thisMetreeDocumentTypeCollection.fireEvent();
								  }, 
								  function() {
									  alert('MetreeDocumentTypeCollection SELECT Error');
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
		var thisMetreeDocumentTypeCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisMetreeDocumentTypeCollection.objectId = new Object();
				thisMetreeDocumentTypeCollection.objectId = element;
				thisMetreeDocumentTypeCollection.objectId.addEventListener('MetreeDocumentTypeCollection', 'onMetreeDocumentTypeCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisMetreeDocumentTypeCollection.htmlElement = element;
				document.getElementById(thisMetreeDocumentTypeCollection.htmlElement).addEventListener("MetreeDocumentTypeCollection", onMetreeDocumentTypeCollection, false);
			}
		},
		fireEvent: function() {
//		alert('FireEvent');
		var thisMetreeDocumentTypeCollection = this;
			thisMetreeDocumentTypeCollection.MetreeDocumentTypeCollectionEvent.detail.count = thisMetreeDocumentTypeCollection.count;
			thisMetreeDocumentTypeCollection.MetreeDocumentTypeCollectionEvent.detail.items = thisMetreeDocumentTypeCollection.collection;
			if (thisMetreeDocumentTypeCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisMetreeDocumentTypeCollection.objectId.dispatchEvent(thisMetreeDocumentTypeCollection.MetreeDocumentTypeCollectionEvent);
			}
			if(thisMetreeDocumentTypeCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisMetreeDocumentTypeCollection.htmlElement).dispatchEvent(thisMetreeDocumentTypeCollection.MetreeDocumentTypeCollectionEvent);
			}
		},
		store: function() {
			localStorage.setItem('MetreeDocumentTypeCollection', JSON.stringify(this.collection));
		},
		restore: function() {
		var objects = JSON.parse(localStorage.getItem('MetreeDocumentTypeCollection'));
			this.clear();
			for(var idx=0; idx<objects.length; idx++) { 
				var item = new MetreeDocumentType(objects[idx].id, objects[idx].name,objects[idx].description);
				this.add(item);
			}
			this.count = this.collection.length;
			this.fireEvent();
		},
		unstore: function() {
			localStorage.removeItem('MetreeDocumentTypeCollection');
		},
		isStored: function() {
		var storage = localStorage.getItem('MetreeDocumentTypeCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return MetreeDocumentTypeCollection;
	
})();
