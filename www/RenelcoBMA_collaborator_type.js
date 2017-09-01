//////////////////////////////////////////////////
// Define CollaboratorType Class
//////////////////////////////////////////////////

/** CollaboratorType 
 * This class encapsulates a Type of Collaborator.
 *
 */	
/**
 * @author Hell
 */
/**
 *  CollaboratorType Class Definition 
 */
var CollaboratorType = (function () {
	var CollaboratorType = function (id, name, description, picture_url) {
	if(DEBUG) alert('Enter CollaboratorType() Constructor...');
		this.id = id || -1;
		this.name = name || '';
		this.description =  description || '';
		this.picture_url =  picture_url || '';
		this.htmlElement = '';
		this.objectId = null;
		if(deviceInfo===undefined) {
//		if(DEBUG) alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.CollaboratorTypeEvent = new CustomEvent("CollaboratorType", {
				detail: {
					id: 0,
					name: '',
					description: '',
					picture_url: '',
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//			if(DEBUG) alert('KitKat Device...');
				this.CollaboratorTypeEvent = new CustomEvent("CollaboratorType", {
					detail: {
						id: 0,
						name: '',
						description: '',
						picture_url: '',
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//			if(DEBUG) alert('NOT a KitKat Device...');
				this.CollaboratorTypeEvent = document.createEvent("CustomEvent");
				this.CollaboratorTypeEvent.initCustomEvent('CollaboratorType', true, false, {id: 0, name: '', description: '', picture_url: '', time: new Date()});
			}
		}
		if(DEBUG) alert('Exit CollaboratorType() Constructor...');
	};
	
	CollaboratorType.prototype = {
		reset: function() {
//		if(DEBUG) alert('CollaboratorType.reset()');
		var thisCollaboratorType = this;
			thisCollaboratorType.id = -1;
			thisCollaboratorType.name = '';
			thisCollaboratorType.description = '';	
			thisCollaboratorType.picture_url = '';
		},
		create: function() {
//		if(DEBUG) alert('CollaboratorType.create()');
		var thisCollaboratorType = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/addCollaboratorType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"name": thisCollaboratorType.name, "description": thisCollaboratorType.description, "picture_url": thisCollaboratorType.picture_url},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisCollaboratorType.id = returnedId;
					    });
					    thisCollaboratorType.fireEvent();
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
					tx.executeSql('INSERT INTO COLLABORATOR_TYPE  ' +
								  '(NAME, DESCRIPTION, PICTURE_URL) ' +
								  'VALUES(?,?,?)',
								  [thisCollaboratorType.name, 
								   thisCollaboratorType.description,
								   thisCollaboratorType.picture_url],
							   	   function(tx, rs) {
										thisCollaboratorType.id = rs.insertId;
										thisCollaboratorType.fireEvent();
								   },
								   function() {
									   alert('CollaboratorType INSERT Error');
								   });
				});
			}
		},
		update: function() {
//		if(DEBUG) alert('CollaboratorType.update()');	
		var thisCollaboratorType = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/saveCollaboratorType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"name": thisCollaboratorType.name, "description": thisCollaboratorType.description, "picture_url": thisCollaboratorType.picture_url, "collaborator_type_id": thisCollaboratorType.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisCollaboratorType.fireEvent();
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
					tx.executeSql('UPDATE COLLABORATOR_TYPE  ' +
								  'SET ' +
								  'NAME = ?,' +
								  'DESCRIPTION = ?,' +
								  'PICTURE_URL = ? ' +
								  'WHERE COLLABORATOR_TYPE_ID = ?',
								  [thisCollaboratorType.name,
								   thisCollaboratorType.description,
								   thisCollaboratorType.picture_url,
								   thisCollaboratorType.id],
							   	   function() {
										thisCollaboratorType.fireEvent();
								   },
								   function() {
									   alert('CollaboratorType UPDATE Error');
								   });
				});
			}
		},
		suppress: function() {
//		if(DEBUG) alert('CollaboratorType.suppress()');
		var thisCollaboratorType = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/deleteCollaboratorType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"collaborator_type_id": thisCollaboratorType.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisCollaboratorType.fireEvent();
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
					tx.executeSql('DELETE FROM COLLABORATOR_TYPE WHERE COLLABORATOR_TYPE_ID = ?',
							      [thisCollaboratorType.id], 
							      function() {
										thisCollaboratorType.fireEvent();	
								  }, 
							      function() {
								  	  alert('CollaboratorType DELETE Error');
								  });
				});
			}
		},
		select: function(id) {
//		if(DEBUG) alert('CollaboratorType.select()');
		var thisCollaboratorType = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getCollaboratorType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"collaborator_type_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisCollaboratorType.id = $this.find("COLLABORATOR_TYPE_ID").text();
					        thisCollaboratorType.name = $this.find("NAME").text();
					        thisCollaboratorType.description = $this.find("DESCRIPTION").text();
					        thisCollaboratorType.picture_url = $this.find("PICTURE_URL").text();
					    });
					    thisCollaboratorType.fireEvent();
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
					tx.executeSql('SELECT COLLABORATOR_TYPE_ID, NAME, DESCRIPTION, PICTURE_URL FROM COLLABORATOR_TYPE WHERE COLLABORATOR_TYPE_ID = ?',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        thisCollaboratorType.id = data.item(i).COLLABORATOR_TYPE_ID;
								        thisCollaboratorType.name = data.item(i).NAME;
								        thisCollaboratorType.description = data.item(i).DESCRIPTION;
								        thisCollaboratorType.picture_url = data.item(i).PICTURE_URL;
									}
									thisCollaboratorType.fireEvent();
								  }, 
								  function() {
									  alert('CollaboratorType SELECT Error');
								  });
				});
			}
		},
		show: function() {
			alert('Collaborator Type Data:\n' +
				  'Id: ' + this.id + '\n' +	
				  'Name: ' + this.name + '\n' +	
				  'Description: ' + this.description + '\n' +
				  'Picture URL: ' + this.picture_url + '\n');
		},
		assignEvent: function(element) {
//		if(DEBUG) alert('CollaboratorType.AssignEvent()');
		var thisCollaboratorType = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisCollaboratorType.objectId = new Object();
				thisCollaboratorType.objectId = element;
				thisCollaboratorType.objectId.addEventListener('CollaboratorType', 'onCollaboratorType', false);
			}
			else {
//			alert('It is an HTML Element');
				thisCollaboratorType.htmlElement = element;
				document.getElementById(thisCollaboratorType.htmlElement).addEventListener("CollaboratorType", onCollaboratorType, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) alert('CollaboratorType.FireEvent()');
		var thisCollaboratorType = this;
			thisCollaboratorType.CollaboratorTypeEvent.detail.id = thisCollaboratorType.id;
			thisCollaboratorType.CollaboratorTypeEvent.detail.name = thisCollaboratorType.name;
			thisCollaboratorType.CollaboratorTypeEvent.detail.description = thisCollaboratorType.description;
			thisCollaboratorType.CollaboratorTypeEvent.detail.picture_url = thisCollaboratorType.picture_url;
			if (thisCollaboratorType.objectId!=null){
//			alert('Event fired to an Object');
				thisCollaboratorType.objectId.dispatchEvent(thisCollaboratorType.CollaboratorTypeEvent);
			}
			if(thisCollaboratorType.htmlElement!=null) {
//			alert('Event fired to an HTML Element');
				document.getElementById(thisCollaboratorType.htmlElement).dispatchEvent(thisCollaboratorType.CollaboratorTypeEvent);
			}
		},
		store: function() {
		if(DEBUG) alert('CollaboratorType.store()');
		var data = {id: this.id, name: this.name, description: this.description, picture_url: this.picture_url };
			localStorage.setItem('CollaboratorType', JSON.stringify(data));
		},
		restore: function() {
//		if(DEBUG) alert('CollaboratorType.restore()');
		var item = JSON.parse(localStorage.getItem('CollaboratorType'));	
			this.id = item.id;
			this.name = item.name;
			this.description = item.description;
			this.picture_url = item.picture_url;
			this.fireEvent();
		},
		unstore: function() {
//		if(DEBUG) alert('CollaboratorType.unstore()');
			localStorage.removeItem('CollaboratorType');
		},
		isStored: function() {
//		if(DEBUG) alert('CollaboratorType.isStored()');
		var storage = localStorage.getItem('CollaboratorType');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return CollaboratorType;
})();


var CollaboratorTypeCollection = (function () {
	
	var CollaboratorTypeCollection = function () {
	if(DEBUG) alert('Enter CollaboratorTypeCollection() Constructor...');
		this.count = 0;
		this.collection = [];
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//		if(DEBUG) alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.CollaboratorTypeCollectionEvent = new CustomEvent("CollaboratorTypeCollection", {
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
//			if(DEBUG) alert('KitKat Device...');
				this.CollaboratorTypeCollectionEvent = new CustomEvent("CollaboratorTypeCollection", {
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
//			if(DEBUG) alert('NOT a KitKat Device...');
				this.CollaboratorTypeCollectionEvent = document.createEvent("CustomEvent");
				this.CollaboratorTypeCollectionEvent.initCustomEvent('CollaboratorTypeCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit CollaboratorTypeCollection() Constructor...');
	};

	CollaboratorTypeCollection.prototype = {
		load: function() {
//		if(DEBUG) alert('CollaboratorTypeCollection.load');
			var thisCollaboratorTypeCollection = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getCollaboratorTypes";
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
					        item = new CollaboratorType($this.find("COLLABORATOR_TYPE_ID").text(),
					          		                    $this.find("NAME").text(),
					           		                    $this.find("DESCRIPTION").text(),
					           		                    $this.find("PICTURE_URL").text());
	//				        alert(JSON.stringify(item));
					        thisCollaboratorTypeCollection.add(item);
					    });
					    thisCollaboratorTypeCollection.fireEvent();
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
					tx.executeSql('SELECT COLLABORATOR_TYPE_ID, NAME, DESCRIPTION, PICTURE_URL FROM COLLABORATOR_TYPE',
							      [], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        var item = new CollaboratorType(data.item(i).COLLABORATOR_TYPE_ID,
								        							    data.item(i).NAME,
								        							    data.item(i).DESCRIPTION,
								        							    data.item(i).PICTURE_URL);
//				        				alert(JSON.stringify(item));
								        thisCollaboratorTypeCollection.add(item);
									}
								    thisCollaboratorTypeCollection.fireEvent();
								  }, 
								  function() {
									  alert('CollaboratorTypeCollection SELECT Error');
								  });
				});
			}
		},
		clear: function() {
		if(DEBUG) alert('CollaboratorTypeCollection.clear()');
			this.collection.splice(0, this.collection.length);
			this.count = this.collection.length; 
		},
		add: function(item) {
		if(DEBUG) alert('CollaboratorTypeCollection.add()');
			if(!this.exist(item)) {
				this.collection.push(item);
				this.count = this.collection.length;
			}
			else {
				alert('Item already exists ...');
			}
		},
		remove: function(idx) {
		if(DEBUG) alert('CollaboratorTypeCollection.remove(' + idx + ')');
			if(this.collection[idx]!=undefined) {
				this.collection.splice(idx, 1);
				this.count = this.collection.length;
			}
		},
		removeById: function(id) {
		if(DEBUG) alert('CollaboratorTypeCollection.removeById(' + id + ')');
		var result  = this.collection.filter(function(o){return o.id == id;} );
			result ? this.collection.splice(this.collection.indexOf(result[0]), 1) : alert('Item not found ...');
		},
		exist: function(item) {
		if(DEBUG) alert('CollaboratorTypeCollection.exist()');
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
//		if(DEBUG) alert('AssignEvent');
		var thisCollaboratorTypeCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisCollaboratorTypeCollection.objectId = new Object();
				thisCollaboratorTypeCollection.objectId = element;
				thisCollaboratorTypeCollection.objectId.addEventListener('CollaboratorTypeCollection', 'onCollaboratorTypeCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisCollaboratorTypeCollection.htmlElement = element;
				document.getElementById(thisCollaboratorTypeCollection.htmlElement).addEventListener("CollaboratorTypeCollection", onCollaboratorTypeCollection, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) alert('FireEvent');
			var thisCollaboratorTypeCollection = this;
			thisCollaboratorTypeCollection.CollaboratorTypeCollectionEvent.detail.count = thisCollaboratorTypeCollection.count;
			thisCollaboratorTypeCollection.CollaboratorTypeCollectionEvent.detail.items = thisCollaboratorTypeCollection.collection;
			if (thisCollaboratorTypeCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisCollaboratorTypeCollection.objectId.dispatchEvent(thisCollaboratorTypeCollection.CollaboratorTypeCollectionEvent);
			}
			if(thisCollaboratorTypeCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisCollaboratorTypeCollection.htmlElement).dispatchEvent(thisCollaboratorTypeCollection.CollaboratorTypeCollectionEvent);
			}
		},
		store: function() {
		if(DEBUG) alert('CollaboratorTypeCollection.store()');
			localStorage.setItem('CollaboratorTypeCollection', JSON.stringify(this.collection));
		},
		restore: function() {
		if(DEBUG) alert('CollaboratorTypeCollection.restore()');
		var objects = JSON.parse(localStorage.getItem('CollaboratorTypeCollection'));
			this.clear();
			for(var idx=0; idx<objects.length; idx++) { 
				var item = new CollaboratorType(objects[idx].id, objects[idx].name, objects[idx].description, objects[idx].picture_url);
				this.add(item);
			}
			this.count = this.collection.length;
			this.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('CollaboratorTypeCollection.unstore()');
			localStorage.removeItem('CollaboratorTypeCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('CollaboratorTypeCollection.isStored()');
		var storage = localStorage.getItem('CollaboratorTypeCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return CollaboratorTypeCollection;
	
})();
