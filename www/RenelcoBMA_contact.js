//////////////////////////////////////////////////
// Define Contact Class
//////////////////////////////////////////////////

/** Contact
 * This class encapsulates a Contact.
 *
 */	
/**
 * @author Hell
 */
/**
 *  CContact Class Definition 
 */

var CContact = (function () {
	var CContact = function (id, address_id, lastname, firstname, phonenr, mobilenr, email) {
		if(DEBUG) alert('Enter CContact() Constructor...');
		this.id = id || -1;
		this.address_id = address_id || -1;
		this.lastname = lastname || '';
		this.firstname = firstname || '';
		this.phonenr = phonenr || '';
		this.mobilenr = mobilenr || '';
		this.email = email || '';
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.ContactEvent = new CustomEvent("CContact", {
				detail: {
					id: 0,
					address_id: 0,
					lastname: '',
					firstname: '',
					phonenr: '',
					mobilenr: '',
					email: '',
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.ContactEvent = new CustomEvent("CContact", {
					detail: {
						id: 0,
						address_id: 0,
						lastname: '',
						firstname: '',
						phonenr: '',
						mobilenr: '',
						email: '',
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.ContactEvent = document.createEvent("CustomEvent");
				this.ContactEvent.initCustomEvent('CContact', true, false, {id: 0, address_id: 0, lastname: '', firstname: '', phonenr: '', mobilenr: '', email: '',time: new Date()});
			}
		}
		if(DEBUG) alert('Exit CContact Constructor...');
	};

	CContact.prototype = {
		reset: function() {
//		alert('CContact.reset()');
			var thisContact = this;
			thisContact.id = -1;
			thisContact.address_id = -1;
			thisContact.lastname = '';
			thisContact.firstname = '';
			thisContact.phonenr = '';
			thisContact.mobilenr = '';
			thisContact.email = '';
		    thisContact.fireEvent();
		},
		create: function() {
//		alert('Contact.create()');
		var thisContact = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/addContact";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"address_id": thisContact.address_id,
						   "lastname": thisContact.lastname,
						   "firstname": thisContact.firstname,
						   "phonenr": thisContact.phonenr,
						   "mobilenr": thisContact.mobilenr,
						   "email": thisContact.email},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisContact.id = returnedId;
					    });
					    thisContact.fireEvent();
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
					tx.executeSql('INSERT INTO CONTACT  ' +
								  '(ADDRESS_ID, LASTNAME, FIRSTNAME, PHONENR, MOBILENR, EMAIL) ' +
								  'VALUES(?,?,?,?,?,?)',
								  [thisContact.address_id,
								   thisContact.lastname,
								   thisContact.firstname,
								   thisContact.phonenr,
								   thisContact.mobilenr,
								   thisContact.email],
							   	   function(tx, rs) {
										thisContact.id = rs.insertId;
										thisContact.fireEvent();
								   },
								   function() {
									   alert('Contact INSERT Error');
								   });
				});
			}
		},
		update: function() {
//		alert('Contact.update()');	
		var thisContact = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/saveContact";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"address_id": thisContact.address_id,
						   "lastname": thisContact.lastname,
						   "firstname": thisContact.firstname,
						   "phonenr": thisContact.phonenr,
						   "mobilenr": thisContact.mobilenr,
						   "email": thisContact.email,
						   "contact_id": thisContact.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisContact.fireEvent();
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
					tx.executeSql('UPDATE CONTACT  ' +
							  	  'SET ' +
							  	  'ADDRESS_ID = ?,' +
							  	  'LASTNAME = ?,' +
							  	  'FIRSTNAME = ?,' +
							  	  'PHONENR = ?,' +
							  	  'MOBILENR = ?,' +
							  	  'EMAIL = ? ' +
							  	  'WHERE CONTACT_ID = ?',
								  [thisContact.address_id,
								   thisContact.lastname,
								   thisContact.firstname,
								   thisContact.phonenr,
								   thisContact.mobilenr,
								   thisContact.email,
								   thisContact.id],
							   	   function() {
										thisContact.fireEvent();
								   },
								   function() {
									   alert('Contact UPDATE Error');
								   });
				});
			}
		},
		suppress: function() {
//		alert('Contact.suppress()');
		var thisContact = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/deleteContact";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"contact_id": thisContact.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisContact.fireEvent();
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
					tx.executeSql('DELETE FROM CONTACT WHERE CONTACT_ID = ?',
							      [thisContact.id], 
							      function() {
										thisContact.fireEvent();	
								  }, 
							      function() {
								  	  alert('Contact DELETE Error');
								  });
				});
			}
		},
		select: function(id) {
		alert('Contact.select(' + id + ')');
		var thisContact = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getContact";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"contact_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisContact.id = $this.find("CONTACT_ID").text();
					        thisContact.address_id = $this.find("ADDRESS_ID").text();
					        thisContact.lastname = $this.find("LASTNAME").text();
					        thisContact.firstname = $this.find("FIRSTNAME").text();
					        thisContact.phonenr = $this.find("PHONENR").text();
					        thisContact.mobilenr = $this.find("MOBILENR").text();
					        thisContact.email = $this.find("EMAIL").text();
					    });
					    thisContact.fireEvent();
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
					tx.executeSql('SELECT CONTACT_ID, ADDRESS_ID, LASTNAME, FIRSTNAME, PHONENR, MOBILENR, EMAIL FROM CONTACT WHERE CONTACT_ID = ?',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        thisContact.id = data.item(i).CONTACT_ID;
								        thisContact.address_id = data.item(i).ADDRESS_ID;
								        thisContact.lastname = data.item(i).LASTNAME;
								        thisContact.firstname = data.item(i).FIRSTNAME;
								        thisContact.phonenr = data.item(i).PHONENR;
								        thisContact.mobilenr = data.item(i).MOBILENR;
								        thisContact.email = data.item(i).EMAIL;
									}
									thisContact.fireEvent();
								  }, 
								  function() {
									  alert('Contact SELECT Error');
								  });
				});
			}
		},
		show: function() {
			var thisContact = this;
			alert('Contact Data:\n' +
				  'Id: ' + thisContact.id + '\n' +	
				  'Address Id: ' + thisContact.address_id + '\n' +	
		  		  'Lastname: ' + thisContact.lastname + '\n' +	
		  		  'Firstname: ' + thisContact.firstname + '\n' +
		  		  'Phone Nr: ' + thisContact.phonenr + '\n' +
		  		  'Mobile Nr: ' + thisContact.mobilenr + '\n' +
		  		  'Email: ' + thisContact.email + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter Contact.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter Contact.removeEventListener() ...');
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
//		alert('Executing Contact.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
		alert('Contact.AssignEvent');
		var thisContact = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisContact.objectId = new Object();
				thisContact.objectId = element;
				thisContact.objectId.addEventListener('CContact', 'onContact', false);
			}
			else {
//				alert('It is an HTML Element');
				thisContact.htmlElement = element;
				document.getElementById(thisContact.htmlElement).addEventListener("CContact", onContact, false);
			}
		},
		fireEvent: function() {
		alert('Contact.FireEvent');
		var thisContact = this;
			thisContact.ContactEvent.detail.id = thisContact.id;
			thisContact.ContactEvent.detail.address_id = thisContact.address_id;
			thisContact.ContactEvent.detail.lastname = thisContact.lastname;
			thisContact.ContactEvent.detail.firstname = thisContact.firstname;
			thisContact.ContactEvent.detail.phonenr = thisContact.phonenr;
			thisContact.ContactEvent.detail.mobilenr = thisContact.mobilenr;
			thisContact.ContactEvent.detail.email = thisContact.email;
			if (thisContact.objectId!=null){
//				alert('Event fired to an Object');
				thisContact.objectId.dispatchEvent(thisContact.ContactEvent);
			}
			if(thisContact.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisContact.htmlElement).dispatchEvent(thisContact.ContactEvent);
			}
		},
		store: function() {
//		alert('Contact.store()');
			localStorage.setItem('CContact', JSON.stringify(this));
		},
		restore: function() {
//		alert('Contact.restore()');
		var thisContact = this;
		var item = JSON.parse(localStorage.getItem('CContact'));	
			thisContact.id = item.id;
			thisContact.address_id = item.address_id;
	        thisContact.lastname = item.lastname;
	        thisContact.firstname = item.firstname;
	        thisContact.phonenr = item.phonenr;
	        thisContact.mobilenr = item.mobilenr;
	        thisContact.email = item.email;
	        thisContact.htmlElement = item.htmlElement;
	        thisContact.objectId = item.objectId;
	        thisContact.ContactEvent = item.ContactEvent;
	        thisContact.fireEvent();
		},
		unstore: function() {
//		alert('Contact.unstore()');
		var thisContact = this;
			localStorage.removeItem('CContact');
		},
		isStored: function() {
//		alert('Contact.isStored()');
		var thisContact = this;
		var storage = localStorage.getItem('CContact');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return CContact;
	
})();


var ContactCollection = (function () {
	
	var ContactCollection = function () {
		if(DEBUG) alert('Enter ContactCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.ContactCollectionEvent = new CustomEvent("ContactCollection", {
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
				this.ContactCollectionEvent = new CustomEvent("ContactCollection", {
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
				this.ContactCollectionEvent = document.createEvent("CustomEvent");
				this.ContactCollectionEvent.initCustomEvent('ContactCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Constructor...');
	};

	ContactCollection.prototype = {
		load: function() {
//		if(DEBUG) alert('load');
		var thisContactCollection = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getContacts";
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
					        item = new CContact($this.find("CONTACT_ID").text(),
					        				    $this.find("ADDRESS_ID").text(),
					        				    $this.find("LASTNAME").text(),
					        				    $this.find("FIRSTNAME").text(),
					        				    $this.find("PHONENR").text(),
					        				    $this.find("MOBILENR").text(),
					        				    $this.find("EMAIL").text());
	//				        alert(JSON.stringify(item));
					        thisContactCollection.add(key++, item);
					    });
					    thisContactCollection.fireEvent();
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
					tx.executeSql('SELECT CONTACT_ID, ADDRESS_ID, LASTNAME, FIRSTNAME, PHONENR, MOBILENR, EMAIL FROM CONTACT',
							      [], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
									for (var i=0; i<data.length; i++) {
								        item = new CContact(data.item(i).CONTACT_ID,
								        				    data.item(i).ADDRESS_ID,
								        				    data.item(i).LASTNAME,
								        				    data.item(i).FIRSTNAME,
								        				    data.item(i).PHONENR,
								        				    data.item(i).MOBILENR,
								        				    data.item(i).EMAIL);
//				        				alert(JSON.stringify(item));
								        thisContactCollection.add(key++, item);
									}
									thisContactCollection.fireEvent();
								  }, 
								  function() {
									  alert('ContactCollection SELECT Error');
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
		var thisContactCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisContactCollection.objectId = new Object();
				thisContactCollection.objectId = element;
				thisContactCollection.objectId.addEventListener('ContactCollection', 'onContactCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisContactCollection.htmlElement = element;
				document.getElementById(thisContactCollection.htmlElement).addEventListener("ContactCollection", onContactCollection, false);
			}
		},
		fireEvent: function() {
//		alert('FireEvent');
		var thisContactCollection = this;
			thisContactCollection.ContactCollectionEvent.detail.count = thisContactCollection.count;
			thisContactCollection.ContactCollectionEvent.detail.items = thisContactCollection.collection;
			if (thisContactCollection.objectId!=null){
//			alert('Event fired to an Object');
				thisContactCollection.objectId.dispatchEvent(thisContactCollection.ContactCollectionEvent);
			}
			if(thisContactCollection.htmlElement!=null) {
//			alert('Event fired to an HTML Element');
				document.getElementById(thisContactCollection.htmlElement).dispatchEvent(thisContactCollection.ContactCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('ContactCollection.store()');
		var thisContactCollection = this;
			localStorage.setItem('ContactCollection', JSON.stringify(thisContactCollection));
		},
		restore: function() {
//		if(DEBUG) alert('ContactCollection.restore()');
		var thisContactCollection = this;
		var item = JSON.parse(localStorage.getItem('ContactCollection'));	
			thisContactCollection.count = item.count;
			thisContactCollection.collection = item.collection;
			thisContactCollection.htmlElement = item.htmlElement;
			thisContactCollection.objectId = item.objectId;
			thisContactCollection.ContactCollectionEvent = item.ContactCollectionEvent;
			thisContactCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('ContactCollection.unstore()');
			localStorage.removeItem('ContactCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('ContactCollection.isStored()');
		var storage = localStorage.getItem('ContactCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return ContactCollection;
})();
