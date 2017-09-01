//////////////////////////////////////////////////
// Define Customer Class
//////////////////////////////////////////////////

/** Customer
 * This class encapsulates a Customer.
 *
 */	
/**
 * @author Hell
 */
/**
 *  Customer Class Definition 
 */
var Customer = (function () {
	var Customer = function (id, address_id, name, description, contactname, phonenr, mobilenr, email, website) {
		if(DEBUG) alert('Enter Customer() Constructor...');
		this.id = id || -1;
		this.address_id = address_id || -1;
		this.name = name || '';
		this.description = description || '';
		this.contactname = contactname || '';
		this.phonenr = phonenr || '';
		this.mobilenr = mobilenr || '';
		this.email = email || '';
		this.website = website || '';
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.CustomerEvent = new CustomEvent("Customer", {
				detail: {
					id: 0,
					address_id: 0,
					name: '',
					description: '',
					contact_name: '',
					phonenr: '',
					mobilenr: '',
					email: '',
					website: '',
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.CustomerEvent = new CustomEvent("Customer", {
					detail: {
						id: 0,
						address_id: 0,
						name: '',
						description: '',
						contact_name: '',
						phonenr: '',
						mobilenr: '',
						email: '',
						website: '',
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.CustomerEvent = document.createEvent("CustomEvent");
				this.CustomerEvent.initCustomEvent('Customer', true, false, {id: 0, address_id: 0, name: '', description: '', contact_name: '', phonenr: '', mobilenr: '', email: '', website: '', time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Customer Constructor...');
	};

	Customer.prototype = {
		reset: function() {
//		alert('Customer.reset()');
			var thisCustomer = this;
			thisCustomer.id = -1;
			thisCustomer.address_id = -1;
			thisCustomer.name = '';
			thisCustomer.description = '';
			thisCustomer.contactname = '';
			thisCustomer.phonenr = '';
			thisCustomer.mobilenr = '';
			thisCustomer.email = '';
			thisCustomer.website = '';
		    thisCustomer.fireEvent();
		},
		create: function() {
//		alert('Customer.create()');
		var thisCustomer = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/addCustomer";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"address_id": thisCustomer.address_id,
						   "name": thisCustomer.name,
						   "description": thisCustomer.description,
						   "contactname": thisCustomer.contactname, 
					       "phonenr": thisCustomer.phonenr,
					       "mobilenr": thisCustomer.mobilenr,
					       "email": thisCustomer.email,
					       "website": thisCustomer.website},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisCustomer.id = returnedId;
					    });
					    thisCustomer.fireEvent();
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
					tx.executeSql('INSERT INTO CUSTOMER  ' +
								  '(ADDRESS_ID, NAME, DESCRIPTION, CONTACTNAME, PHONENR, MOBILENR, EMAIL, WEBSITE) ' +
								  'VALUES(?,?,?,?,?,?,?,?)',
								  [thisCustomer.address_id,
								   thisCustomer.name,
								   thisCustomer.description,
								   thisCustomer.contactname, 
							       thisCustomer.phonenr,
							       thisCustomer.mobilenr,
							       thisCustomer.email,
							       thisCustomer.website],
							   	   function(tx, rs) {
										thisCustomer.id = rs.insertId;
										thisCustomer.fireEvent();
								   },
								   function() {
									   alert('Customer INSERT Error');
								   });
				});
			}
		},
		update: function() {
//		alert('Customer.update()');	
		var thisCustomer = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/saveCustomer";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"address_id": thisCustomer.address_id,
						   "name": thisCustomer.name,
						   "description": thisCustomer.description,
						   "contactname": thisCustomer.contactname,
						   "phonenr": thisCustomer.phonenr,
						   "mobilenr": thisCustomer.mobilenr,
						   "email": thisCustomer.email,
						   "website": thisCustomer.website,
						   "customer_id": thisCustomer.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisCustomer.fireEvent();
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
					tx.executeSql('UPDATE CUSTOMER  ' + 
								  'SET ' +
								  'ADDRESS_ID = ?,' +
								  'NAME = ?,' +
								  'DESCRIPTION = ?,' +
								  'CONTACTNAME = ?,' +
								  'PHONENR = ?,' +
								  'MOBILENR = ?,' +
								  'EMAIL = ?,' +
								  'WEBSITE = ? ' +
								  'WHERE CUSTOMER_ID = ?',
								  [thisCustomer.address_id,
								   thisCustomer.name,
								   thisCustomer.description,
								   thisCustomer.contactname,
								   thisCustomer.phonenr,
								   thisCustomer.mobilenr,
								   thisCustomer.email,
								   thisCustomer.website,
								   thisCustomer.id],
							   	   function() {
										thisCustomer.fireEvent();
								   },
								   function() {
									   alert('Customer UPDATE Error');
								   });
				});
			}
		},
		suppress: function() {
//		alert('Customer.suppress()');
		var thisCustomer = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/deleteCustomer";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"customer_id": thisCustomer.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisCustomer.fireEvent();
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
					tx.executeSql('DELETE FROM CUSTOMER WHERE CUSTOMER_ID = ?',
							      [thisCustomer.id], 
							      function() {
						thisCustomer.fireEvent();	
								  }, 
							      function() {
								  	  alert('Customer DELETE Error');
								  });
				});
			}
		},
		select: function(id) {
//		alert('Customer.select(' + id + ')');
		var thisCustomer = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getCustomer";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"customer_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisCustomer.id = $this.find("CUSTOMER_ID").text();
					        thisCustomer.address_id = $this.find("ADDRESS_ID").text();
					        thisCustomer.name = $this.find("NAME").text();
					        thisCustomer.description = $this.find("DESCRIPTION").text();
					        thisCustomer.contactname = $this.find("CONTACTNAME").text();
					        thisCustomer.phonenr = $this.find("PHONENR").text();
					        thisCustomer.mobilenr = $this.find("MOBILENR").text();
					        thisCustomer.email = $this.find("EMAIL").text();
					        thisCustomer.website = $this.find("WEBSITE").text();
					    });
					    thisCustomer.fireEvent();
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
					tx.executeSql('SELECT CUSTOMER_ID, ADDRESS_ID, NAME, DESCRIPTION, CONTACTNAME, PHONENR, MOBILENR, EMAIL, WEBSITE  FROM CUSTOMER WHERE CUSTOMER_ID = ?',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        thisCustomer.id = data.item(i).CUSTOMER_ID;
								        thisCustomer.address_id = data.item(i).ADDRESS_ID;
								        thisCustomer.name = data.item(i).NAME;
								        thisCustomer.description = data.item(i).DESCRIPTION;
								        thisCustomer.contactname = data.item(i).CONTACTNAME;
								        thisCustomer.phonenr = data.item(i).PHONENR;
								        thisCustomer.mobilenr = data.item(i).MOBILENR;
								        thisCustomer.email = data.item(i).EMAIL;
								        thisCustomer.website = data.item(i).WEBSITE;
									}
									thisCustomer.fireEvent();
								  }, 
								  function() {
									  alert('Customer SELECT Error');
								  });
				});
			}
		},
		show: function() {
			var thisCustomer = this;
			alert('Customer Data:\n' +
				  'Id: ' + thisCustomer.id + '\n' +
				  'Address Id: ' + thisCustomer.address_id + '\n' +
				  'Name: ' + thisCustomer.name + '\n' +
				  'Description: ' + thisCustomer.description + '\n' +
				  'Contact Name: ' + thisCustomer.contactname + '\n' +
				  'Phone Nr: ' + thisCustomer.phonenr + '\n' +
				  'Mobile Nr: ' + thisCustomer.mobilenr + '\n' +
				  'Email: ' + thisCustomer.email + '\n' +
				  'Web Site: ' + thisCustomer.website + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter Customer.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter Customer.removeEventListener() ...');
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
//		alert('Executing Customer.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		alert('Customer.AssignEvent');
		var thisCustomer = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisCustomer.objectId = new Object();
				thisCustomer.objectId = element;
				thisCustomer.objectId.addEventListener('Customer', 'onCustomer', false);
			}
			else {
//				alert('It is an HTML Element');
				thisCustomer.htmlElement = element;
				document.getElementById(thisCustomer.htmlElement).addEventListener("Customer", onCustomer, false);
			}
		},
		fireEvent: function() {
//		alert('Customer.FireEvent');
		var thisCustomer = this;
			if (thisCustomer.objectId!=null){
//				alert('Event fired to an Object');
				thisCustomer.objectId.dispatchEvent(thisCustomer.CustomerEvent);
			}
			if(thisCustomer.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisCustomer.htmlElement).dispatchEvent(thisCustomer.CustomerEvent);
			}
		},
		store: function() {
//		alert('Customer.store()');
			localStorage.setItem('Customer', JSON.stringify(this));
		},
		restore: function() {
//		alert('Customer.restore()');
		var thisCustomer = this;
		var item = JSON.parse(localStorage.getItem('Customer'));	
			thisCustomer.id = item.id;
			thisCustomer.address_id = item.address_id;
			thisCustomer.name = item.name;
			thisCustomer.description = item.description;
			thisCustomer.contactname = item.contactname;
			thisCustomer.phonenr = item.phonenr;
			thisCustomer.mobilenr = item.mobilenr;
			thisCustomer.email = item.email;
			thisCustomer.website = item.website;
			thisCustomer.htmlElement = item.htmlElement;
			thisCustomer.objectId = item.objectId;
			thisCustomer.CustomerEvent = item.CustomerEvent;
			thisCustomer.fireEvent();
		},
		unstore: function() {
		alert('Customer.unstore()');
		var thisCustomer = this;
			localStorage.removeItem('Customer');
		},
		isStored: function() {
//		alert('Customer.isStored()');
		var thisCustomer = this;
		var storage = localStorage.getItem('Customer');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return Customer;
})();


var CustomerCollection = (function () {
	
	var CustomerCollection = function () {
//		alert('Enter CustomerCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.CustomerCollectionEvent = new CustomEvent("CustomerCollection", {
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
				this.CustomerCollectionEvent = new CustomEvent("CustomerCollection", {
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
				this.CustomerCollectionEvent = document.createEvent("CustomEvent");
				this.CustomerCollectionEvent.initCustomEvent('CustomerCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
//		alert('Exit Constructor...');
	};

	CustomerCollection.prototype = {
		load: function() {
//			alert('load');
			var thisCustomerCollection = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getCustomers";
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
					        item = new Customer($this.find("CUSTOMER_ID").text(),
					        					$this.find("ADDRESS_ID").text(),
					        					$this.find("NAME").text(),
					        					$this.find("DESCRIPTION").text(),
					        					$this.find("CONTACTNAME").text(),
					        					$this.find("PHONENR").text(),
					        					$this.find("MOBILENR").text(),
					        					$this.find("EMAIL").text(),
					        					$this.find("WEBSITE").text());
	//				        alert(JSON.stringify(item));
					        thisCustomerCollection.add(key++, item);
					    });
					    thisCustomerCollection.fireEvent();
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
					tx.executeSql('SELECT CUSTOMER_ID, ADDRESS_ID, NAME, DESCRIPTION, CONTACTNAME, PHONENR, MOBILENR, EMAIL, WEBSITE  FROM CUSTOMER',
							      [], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
									for (var i=0; i<data.length; i++) {
								        item = new Customer(data.item(i).CUSTOMER_ID,
								        				    data.item(i).ADDRESS_ID,
								        				    data.item(i).NAME,
								        				    data.item(i).DESCRIPTION,
								        				    data.item(i).CONTACTNAME,
								        				    data.item(i).PHONENR,
								        				    data.item(i).MOBILENR,
								        				    data.item(i).EMAIL,
								        				    data.item(i).WEBSITE);
//				        				alert(JSON.stringify(item));
								        thisCustomerCollection.add(key++, item);
									}
									thisCustomerCollection.fireEvent();
								  }, 
								  function() {
									  alert('CustomerCollection SELECT Error');
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
		var thisCustomerCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisCustomerCollection.objectId = new Object();
				thisCustomerCollection.objectId = element;
				thisCustomerCollection.objectId.addEventListener('CustomerCollection', 'onCustomerCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisCustomerCollection.htmlElement = element;
				document.getElementById(thisCustomerCollection.htmlElement).addEventListener("CustomerCollection", onCustomerCollection, false);
			}
		},
		fireEvent: function() {
//			alert('FireEvent');
			var thisCustomerCollection = this;
			thisCustomerCollection.CustomerCollectionEvent.detail.count = thisCustomerCollection.count;
			thisCustomerCollection.CustomerCollectionEvent.detail.items = thisCustomerCollection.collection;
			if (thisCustomerCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisCustomerCollection.objectId.dispatchEvent(thisCustomerCollection.CustomerCollectionEvent);
			}
			if(thisCustomerCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisCustomerCollection.htmlElement).dispatchEvent(thisCustomerCollection.CustomerCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('CustomerCollection.store()');
		var thisCustomerCollection = this;
			localStorage.setItem('CustomerCollection', JSON.stringify(thisCustomerCollection));
		},
		restore: function() {
//		if(DEBUG) alert('CustomerCollection.restore()');
		var thisCustomerCollection = this;
		var item = JSON.parse(localStorage.getItem('CustomerCollection'));	
			thisCustomerCollection.count = item.count;
			thisCustomerCollection.collection = item.collection;
			thisCustomerCollection.htmlElement = item.htmlElement;
			thisCustomerCollection.objectId = item.objectId;
			thisCustomerCollection.CustomerCollectionEvent = item.CustomerCollectionEvent;
			thisCustomerCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('CustomerCollection.unstore()');
			localStorage.removeItem('CustomerCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('CustomerCollection.isStored()');
		var storage = localStorage.getItem('CustomerCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return CustomerCollection;
	
})();
