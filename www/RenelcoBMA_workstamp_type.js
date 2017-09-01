////////////////////////////////////////////////////////////////////////////////////////////////////
// Define WorkStampType related Class
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////
// WorkStampType Class
//////////////////////////////////////////////////

/** WorkStampType Class Definition
 * 
 * This class encapsulates a WorkStamp Type.
 *
 * @author 		Hell
 * @version		1.0
 * @language 	Javascript
 */
var WorkStampType = (function () {
	var WorkStampType = function (id, name, description) {
//		if(DEBUG) alert('Enter WorkStampType() Constructor...');
		this.id = id || -1;
		this.name = name || '';
		this.description = description || '';
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			if(DEBUG) alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.WorkStampTypeEvent = new CustomEvent("WorkStampType", {
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
//				if(DEBUG) alert('KitKat Device...');
				this.WorkStampTypeEvent = new CustomEvent("WorkStampType", {
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
//				if(DEBUG) alert('NOT a KitKat Device...');
				this.WorkStampTypeEvent = document.createEvent("CustomEvent");
				this.WorkStampTypeEvent.initCustomEvent('WorkStampType', true, false, {id: 0, name: '', description: '', time: new Date()});
			}
		}
//		if(DEBUG) alert('Exit WorkStampType Constructor...');
	};

	WorkStampType.prototype = {
		reset: function() {
//		if(DEBUG) alert('WorkStampType.reset()');
			var thisWorkStampType = this;
			thisWorkStampType.id = -1;
			thisWorkStampType.name = '';
			thisWorkStampType.description = '';	
		    thisWorkStampType.fireEvent();
		},
		create: function() {
//		if(DEBUG) alert('WorkStampType.create()');
		var thisWorkStampType = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/addWorkStampType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"name": thisWorkStampType.name, "description": thisWorkStampType.description},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisWorkStampType.id = returnedId;
					    });
					    thisWorkStampType.fireEvent();
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
					tx.executeSql('INSERT INTO WORKSTAMP_TYPE  ' +
								  '(NAME, DESCRIPTION) ' +
								  'VALUES(?,?)',
								  [thisWorkStampType.name,
								   thisWorkStampType.description],
							   	   function(tx, rs) {
										thisWorkStampType.id = rs.insertId;
										thisWorkStampType.fireEvent();
								   },
								   function() {
									   alert('WorkStampType INSERT Error');
								   });
				});
			}
		},
		update: function() {
//		if(DEBUG) alert('WorkStampType.update()');	
		var thisWorkStampType = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/saveWorkStampType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"name": thisWorkStampType.name, "description": thisWorkStampType.description, "workstamp_type_id": thisWorkStampType.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisWorkStampType.fireEvent();
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
					tx.executeSql('UPDATE WORKSTAMP_TYPE  ' +
								  'SET ' +
								  'NAME = ?,' +
								  'DESCRIPTION = ?,' +
								  'WHERE WORKSTAMP_TYPE_ID = ?',
								  [thisWorkStampType.name,
								   thisWorkStampType.description,
								   thisWorkStampType.id],
							   	   function() {
										thisWorkStampType.fireEvent();
								   },
								   function() {
									   alert('WorkStampType UPDATE Error');
								   });
				});
			}
		},
		suppress: function() {
//		if(DEBUG) alert('WorkStampType.suppress()');
		var thisWorkStampType = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/deleteWorkStampType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workstamp_type_id": thisWorkStampType.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisWorkStampType.fireEvent();
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
					tx.executeSql('DELETE FROM WORKSTAMP_TYPE  WHERE WORKSTAMP_TYPE_ID = ?',
								  [thisWorkStampType.id],
							   	   function() {
										thisWorkStampType.fireEvent();
								   },
								   function() {
									   alert('WorkStampType UPDATE Error');
								   });
				});
			}
		},
		select: function(id) {
//		if(DEBUG) alert('WorkStampType.select(' + id + ')');
		var thisWorkStampType = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getWorkStampType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workstamp_type_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisWorkStampType.id = $this.find("WORKSTAMP_TYPE_ID").text();
					        thisWorkStampType.name = $this.find("NAME").text();
					        thisWorkStampType.description = $this.find("DESCRIPTION").text();
					    });
					    thisWorkStampType.fireEvent();
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
					tx.executeSql('SELECT WORKSTAMP_TYPE_ID, NAME, DESCRIPTION  FROM WORKSTAMP_TYPE WHERE WORKSTAMP_TYPE_ID = ?',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
										thisWorkStampType.id = data.item(i).WORKSTAMP_TYPE_ID;
										thisWorkStampType.name = data.item(i).NAME;
										thisWorkStampType.description = data.item(i).DESCRIPTION;
									}
									thisWorkStampType.fireEvent();
								  }, 
								  function() {
									  alert('WorkStampType SELECT Error');
								  });
				});
			}
		},
		show: function() {
			var thisWorkStampType = this;
			alert('WorkStampType Data:\n' +
				  'Id: ' + this.id + '\n' +	
				  'Name: ' + this.name + '\n' +	
				  'Description: ' + this.description + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		if(DEBUG) alert('Enter WorkStampType.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		if(DEBUG) alert('Enter WorkStampType.removeEventListener() ...');
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
//		if(DEBUG) alert('Executing WorkStampType.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		if(DEBUG) alert('WorkStampType.AssignEvent');
		var thisWorkStampType = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisWorkStampType.objectId = new Object();
				thisWorkStampType.objectId = element;
				thisWorkStampType.objectId.addEventListener('WorkStampType', 'onWorkStampType', false);
			}
			else {
//				alert('It is an HTML Element');
				thisWorkStampType.htmlElement = element;
				document.getElementById(thisWorkStampType.htmlElement).addEventListener("WorkStampType", onWorkStampType, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) alert('WorkStampType.FireEvent');
		var thisWorkStampType = this;
			thisWorkStampType.WorkStampTypeEvent.detail.id = thisWorkStampType.id;
			thisWorkStampType.WorkStampTypeEvent.detail.name = thisWorkStampType.name;
			thisWorkStampType.WorkStampTypeEvent.detail.description = thisWorkStampType.description;
			if (thisWorkStampType.objectId!=null){
//				alert('Event fired to an Object');
				thisWorkStampType.objectId.dispatchEvent(thisWorkStampType.WorkStampTypeEvent);
			}
			if(thisWorkStampType.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisWorkStampType.htmlElement).dispatchEvent(thisWorkStampType.WorkStampTypeEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('WorkStampType.store()');
			localStorage.setItem('WorkStampType', JSON.stringify(this));
		},
		restore: function() {
//		if(DEBUG) alert('WorkStampType.restore()');
		var thisWorkStampType = this;
		var item = JSON.parse(localStorage.getItem('WorkStampType'));	
			thisWorkStampType.id = item.id;
			thisWorkStampType.name = item.name;
			thisWorkStampType.description = item.description;
			thisWorkStampType.htmlElement = item.htmlElement;
			thisWorkStampType.objectId = item.objectId;
			thisWorkStampType.WorkStampTypeEvent = item.WorkStampTypeEvent;
			thisWorkStampType.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('WorkStampType.unstore()');
			localStorage.removeItem('WorkStampType');
		},
		isStored: function() {
//		if(DEBUG) alert('WorkStampType.isStored()');
		var storage = localStorage.getItem('WorkStampType');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return WorkStampType;
})();


/** WorkStampTypeCollection Class Definition
 * 
 * This class encapsulates a Collection of WorkStamp Types.
 *
 * @author 		Hell
 * @version		1.0
 * @language 	Javascript
 */
var WorkStampTypeCollection = (function () {
	
	var WorkStampTypeCollection = function () {
		if(DEBUG) alert('Enter WorkStampTypeCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			if(DEBUG) alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.WorkStampTypeCollectionEvent = new CustomEvent("WorkStampTypeCollection", {
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
				this.WorkStampTypeCollectionEvent = new CustomEvent("WorkStampTypeCollection", {
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
				this.WorkStampTypeCollectionEvent = document.createEvent("CustomEvent");
				this.WorkStampTypeCollectionEvent.initCustomEvent('WorkStampTypeCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit WorkStampTypeCollection() Constructor...');
	};

	WorkStampTypeCollection.prototype = {
		load: function() {
		if(DEBUG) alert('load');
		var thisWorkStampTypeCollection = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getWorkStampTypes";
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
					        item = new WorkStampType($this.find("WORKSTAMP_TYPE_ID").text(),
					        						 $this.find("NAME").text(),
					        						 $this.find("DESCRIPTION").text());
	//				        alert(JSON.stringify(item));
					        thisWorkStampTypeCollection.add(key++, item);
					    });
					    thisWorkStampTypeCollection.fireEvent();
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
					tx.executeSql('SELECT WORKSTAMP_TYPE_ID, NAME, DESCRIPTION  FROM WORKSTAMP_TYPE',
							      [], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
									for (var i=0; i<data.length; i++) {
								        var item = new WorkStampType(data.item(i).WORKSTAMP_TYPE_ID,
								        							 data.item(i).NAME,
								        							 data.item(i).DESCRIPTION);
//				        				alert(JSON.stringify(item));
								        thisWorkStampTypeCollection.add(key++, item);
									}
									thisWorkStampTypeCollection.fireEvent();
								  }, 
								  function() {
									  alert('WorkStampTypeCollection SELECT Error');
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
		itemByName: function(name) {
			for (var idx=0; idx<this.count; idx++) {
				if(this.collection[idx].name==name) {
					return this.collection[idx];
				}
			}
			return undefined;
		},
		assignEvent: function(element) {
//		if(DEBUG) alert('AssignEvent');
			var thisWorkStampTypeCollection = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisWorkStampTypeCollection.objectId = new Object();
				thisWorkStampTypeCollection.objectId = element;
				thisWorkStampTypeCollection.objectId.addEventListener('WorkStampTypeCollection', 'onWorkStampTypeCollection', false);
			}
			else {
//				alert('It is an HTML Element');
				thisWorkStampTypeCollection.htmlElement = element;
				document.getElementById(thisWorkStampTypeCollection.htmlElement).addEventListener("WorkStampTypeCollection", onWorkStampTypeCollection, false);
			}
		},
		fireEvent: function() {
		if(DEBUG) alert('WorkStampTypeCollection.fireEvent');
			var thisWorkStampTypeCollection = this;
			thisWorkStampTypeCollection.WorkStampTypeCollectionEvent.detail.count = thisWorkStampTypeCollection.count;
			thisWorkStampTypeCollection.WorkStampTypeCollectionEvent.detail.items = thisWorkStampTypeCollection.collection;
			
			if (thisWorkStampTypeCollection.objectId!=null){
//				if(DEBUG) alert('Event fired to an Object');
				thisWorkStampTypeCollection.objectId.dispatchEvent(thisWorkStampTypeCollection.WorkStampTypeCollectionEvent);
			}
			if(thisWorkStampTypeCollection.htmlElement!=null) {
//				if(DEBUG) alert('Event fired to an HTML Element');
				document.getElementById(thisWorkStampTypeCollection.htmlElement).dispatchEvent(thisWorkStampTypeCollection.WorkStampTypeCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('WorkStampTypeCollection.store()');
		var thisWorkStampTypeCollection = this;
			localStorage.setItem('WorkStampTypeCollection', JSON.stringify(thisWorkStampTypeCollection));
		},
		restore: function() {
//		if(DEBUG) alert('WorkStampTypeCollection.restore()');
		var thisWorkStampTypeCollection = this;
		var item = JSON.parse(localStorage.getItem('WorkStampTypeCollection'));	
			thisWorkStampTypeCollection.count = item.count;
			thisWorkStampTypeCollection.collection = item.collection;
			thisWorkStampTypeCollection.htmlElement = item.htmlElement;
			thisWorkStampTypeCollection.objectId = item.objectId;
			thisWorkStampTypeCollection.WorkStampTypeCollectionEvent = item.WorkStampTypeCollectionEvent;
			thisWorkStampTypeCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('WorkStampTypeCollection.unstore()');
			localStorage.removeItem('WorkStampTypeCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('WorkStampTypeCollection.isStored()');
		var storage = localStorage.getItem('WorkStampTypeCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return WorkStampTypeCollection;
	
})();
