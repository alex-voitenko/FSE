//////////////////////////////////////////////////
// Define ObturationType Class
//////////////////////////////////////////////////

/** ObturationType
 * This class encapsulates a ObturationType.
 *
 */	
/**
 * @author Hell
 */
/**
 *  ObturationType Class Definition 
 */
var ObturationType = (function () {
	var ObturationType = function (id, name, shortname, description) {
		if(DEBUG) alert('Enter ObturationType(...) Constructor...');
		this.id = id || -1;
		this.name = name || '';
		this.shortname = shortname || '';
		this.description =  description || '';
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.ObturationTypeEvent = new CustomEvent("ObturationType", {
					detail: {
					id: 0,
					name: '',
					shortname: '',
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
				this.ObturationTypeEvent = new CustomEvent("ObturationType", {
						detail: {
						id: 0,
						name: '',
						shortname: '',
						description: '',
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.ObturationTypeEvent = document.createEvent("CustomEvent");
				this.ObturationTypeEvent.initCustomEvent('ObturationType', true, false, {id: 0, name: '', shortname: '', description: '', time: new Date()});
			}
		}
		if(DEBUG) alert('Exit ObturationType() Constructor...');
	};

	ObturationType.prototype = {
		reset: function() {
//		alert('ObturationType.reset()');
			var thisObturationType = this;
			thisObturationType.id = -1;
			thisObturationType.name = '';
			thisObturationType.shortname = '';
			thisObturationType.description = '';	
		    thisObturationType.fireEvent();
		},
		create: function() {
//		alert('ObturationType.create()');
		var thisObturationType = this;

			if(LOCAL_DB==false) {
				var url = urlDataServices + "/addObturationType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"name": thisObturationType.name, "shortname": thisObturationType.shortname, "description": thisObturationType.description},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisObturationType.id = returnedId;
					    });
					    thisObturationType.fireEvent();
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
					tx.executeSql('INSERT INTO OBTURATION_TYPE  ' +
								  '(NAME, SHORTNAME, DESCRIPTION) ' +
								  'VALUES(?,?,?)',
								  [thisObturationType.name,
								   thisObturationType.shortname, 
								   thisObturationType.description],
							   	   function(tx, rs) {
										thisObturationType.id = rs.insertId;
										thisObturationType.fireEvent();
								   },
								   function() {
									   alert('ObturationType INSERT Error');
								   });
				});
			}
		},
		update: function() {
//		alert('ObturationType.update()');	
		var thisObturationType = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/saveObturationType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"name": thisObturationType.name, "shortname": thisObturationType.shortname, "description": thisObturationType.description, "obturation_type_id": thisObturationType.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisObturationType.fireEvent();
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
					tx.executeSql('UPDATE OBTURATION_TYPE  ' +
								  'SET ' +
								  'NAME = ?,' +
								  'SHORTNAME = ?,' +
								  'DESCRIPTION = ?,' +
								  'WHERE OBTURATION_TYPE_ID = ?',
								  [thisObturationType.name,
								   thisObturationType.shortname, 
								   thisObturationType.description, 
								   thisObturationType.id],
							   	   function() {
										thisObturationType.fireEvent();
								   },
								   function() {
									   alert('ObturationType UPDATE Error');
								   });
				});
			}
		},
		suppress: function() {
//		alert('ObturationType.suppress()');
		var thisObturationType = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/deleteObturationType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"obturation_type_id": thisObturationType.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisObturationType.fireEvent();
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
					tx.executeSql('DELETE FROM OBTURATION_TYPE WHERE OBTURATION_TYPE_ID = ?', 
							      [thisObturationType.id], 
							      function() {
										thisObturationType.fireEvent();	
								  }, 
							      function() {
								  	  alert('ObturationType DELETE Error');
								  });
				});
			}
		},
		select: function(id) {
//		alert('ObturationType.select(' + id + ')');
		var thisObturationType = this;

			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getObturationType";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"obturation_type_id": thisObturationType.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisObturationType.id = $this.find("OBTURATION_TYPE_ID").text();
					        thisObturationType.name = $this.find("NAME").text();
					        thisObturationType.name = $this.find("SHORTNAME").text();
					        thisObturationType.description = $this.find("DESCRIPTION").text();
					    });
					    thisObturationType.fireEvent();
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
					tx.executeSql('SELECT OBTURATION_TYPE_ID, NAME, SHORTNAME, DESCRIPTION FROM OBTURATION_TYPE WHERE OBTURATION_TYPE_ID = ?',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        thisObturationType.id = data.item(i).OBTURATION_TYPE_ID;
								        thisObturationType.name = data.item(i).NAME;
								        thisObturationType.shortname = data.item(i).SHORTNAME;
								        thisObturationType.description = data.item(i).DESCRIPTION;
									}
									thisObturationType.fireEvent();
								  }, 
								  function() {
									  alert('ObturationType SELECT Error');
								  });
				});
			}
		},
		show: function() {
			var thisObturationType = this;
			alert('ObturationType Data:\n' +
				  'Id: ' + this.id + '\n' +	
				  'Name: ' + this.name + '\n' +	
				  'Short Name: ' + this.shortname + '\n' +	
				  'Description: ' + this.description + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter ObturationType.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter ObturationType.removeEventListener() ...');
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
//		alert('Executing ObturationType.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		alert('ObturationType.AssignEvent');
		var thisObturationType = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisObturationType.objectId = new Object();
				thisObturationType.objectId = element;
				thisObturationType.objectId.addEventListener('ObturationType', 'onObturationType', false);
			}
			else {
//				alert('It is an HTML Element');
				thisObturationType.htmlElement = element;
				document.getElementById(thisObturationType.htmlElement).addEventListener("ObturationType", onObturationType, false);
			}
		},
		fireEvent: function() {
//		alert('ObturationType.FireEvent');
		var thisObturationType = this;
			thisObturationType.ObturationTypeEvent.detail.id = thisObturationType.id;
			thisObturationType.ObturationTypeEvent.detail.name = thisObturationType.name;
			thisObturationType.ObturationTypeEvent.detail.shortname = thisObturationType.shortname;
			thisObturationType.ObturationTypeEvent.detail.description = thisObturationType.description;
			if (thisObturationType.objectId!=null){
//				alert('Event fired to an Object');
				thisObturationType.objectId.dispatchEvent(thisObturationType.ObturationTypeEvent);
			}
			if(thisObturationType.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisObturationType.htmlElement).dispatchEvent(thisObturationType.ObturationTypeEvent);
			}
		},
		store: function() {
//		alert('ObturationType.store()');
			localStorage.setItem('obturationType', JSON.stringify(this));
		},
		restore: function() {
//		alert('ObturationType.restore()');
		var thisObturationType = this;
		var item = JSON.parse(localStorage.getItem('obturationType'));	
			thisObturationType.id = item.id;
			thisObturationType.name = item.name;
			thisObturationType.shortname = item.shortname;
			thisObturationType.description = item.description;
		},
		remove: function() {
		alert('ObturationType.remove()');
		var thisObturationType = this;
			localStorage.removeItem('obturationType');
		},
		isStored: function() {
//		alert('ObturationType.isStored()');
		var thisObturationType = this;
		var storage = localStorage.getItem('obturationType');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return ObturationType;
})();


var ObturationTypeCollection = (function () {
	
	var ObturationTypeCollection = function () {
	if(DEBUG) alert('Enter ObturationTypeCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.ObturationTypeCollectionEvent = new CustomEvent("ObturationTypeCollection", {
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
				this.ObturationTypeCollectionEvent = new CustomEvent("ObturationTypeCollection", {
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
				this.ObturationTypeCollectionEvent = document.createEvent("CustomEvent");
				this.ObturationTypeCollectionEvent.initCustomEvent('ObturationTypeCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Constructor...');
	};

	ObturationTypeCollection.prototype = {
		load: function() {
//		if(DEBUG) alert('load');
		var thisObturationTypeCollection = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getObturationTypes";
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
					        item = new ObturationType($this.find("OBTURATION_TYPE_ID").text(), 
					        						  $this.find("NAME").text(),
					        						  $this.find("SHORTNAME").text(),
					        						  $this.find("DESCRIPTION").text());
	//				        alert(JSON.stringify(item));
					        thisObturationTypeCollection.add(key++, item);
					    });
					    thisObturationTypeCollection.fireEvent();
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
					tx.executeSql('SELECT OBTURATION_TYPE_ID, NAME, SHORTNAME, DESCRIPTION FROM OBTURATION_TYPE',
						      [], 
						      function (tx, rs) {
							  	var data = rs.rows;
							  	var key = 0;
								for (var i=0; i<data.length; i++) {
							        var item = new ObturationType(data.item(i).OBTURATION_TYPE_ID,
							        							  data.item(i).NAME,
							        							  data.item(i).SHORTNAME,
							        							  data.item(i).DESCRIPTION);
//			        				alert(JSON.stringify(item));
							        thisObturationTypeCollection.add(key++, item);
								}
								thisObturationTypeCollection.fireEvent();
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
		if(DEBUG) alert('AssignEvent');
		var thisObturationTypeCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisObturationTypeCollection.objectId = new Object();
				thisObturationTypeCollection.objectId = element;
				thisObturationTypeCollection.objectId.addEventListener('ObturationTypeCollection', 'onObturationTypeCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisObturationTypeCollection.htmlElement = element;
				document.getElementById(thisObturationTypeCollection.htmlElement).addEventListener("ObturationTypeCollection", onObturationTypeCollection, false);
			}
		},
		fireEvent: function() {
		if(DEBUG) alert('FireEvent');
		var thisObturationTypeCollection = this;
			thisObturationTypeCollection.ObturationTypeCollectionEvent.detail.count = thisObturationTypeCollection.count;
			thisObturationTypeCollection.ObturationTypeCollectionEvent.detail.items = thisObturationTypeCollection.collection;
			if (thisObturationTypeCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisObturationTypeCollection.objectId.dispatchEvent(thisObturationTypeCollection.ObturationTypeCollectionEvent);
			}
			if(thisObturationTypeCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisObturationTypeCollection.htmlElement).dispatchEvent(thisObturationTypeCollection.ObturationTypeCollectionEvent);
			}
		}
		
	};
	return ObturationTypeCollection;
	
})();
