//////////////////////////////////////////////////
// Define Address Class
//////////////////////////////////////////////////

/** Address
 * This class encapsulates a Address.
 *
 */	
/**
 * @author Hell
 */
/**
 *  Address Class Definition 
 */
var Address = (function () {
	var Address = function (id, street, zip, city, state, country, latitude, longitude) {
		if(DEBUG) alert('Enter Address() Constructor...');
		this.id = id || -1;
		this.street = street || '';
		this.zip = zip || '';
		this.city = city || '';
		this.state = state || '';
		this.country = country || '';
		this.latitude = latitude || 0.000000;
		this.longitude = longitude || 0.000000;
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			if(DEBUG) alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.AddressEvent = new CustomEvent("Address", {
				detail: {
					id: 0,
					street: '',
					zip: '',
					city: '',
					state: '',
					country: '',
					latitude: 0.000000,
					longitude: 0.000000,
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				if(DEBUG) alert('KitKat Device...');
				this.AddressEvent = new CustomEvent("Address", {
					detail: {
						id: 0,
						street: '',
						zip: '',
						city: '',
						state: '',
						country: '',
						latitude: 0.000000,
						longitude: 0.000000,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				if(DEBUG) alert('NOT a KitKat Device...');
				this.AddressEvent = document.createEvent("CustomEvent");
				this.AddressEvent.initCustomEvent('Address', true, false, {id: 0, street: '', zip: '', city: '', state: '', country: '', latitude: 0.000000, longitude: 0.000000, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Address Constructor...');
	};

	Address.prototype = {
		reset: function() {
		if(DEBUG) alert('Address.reset()');
		var thisAddress = this;
			thisAddress.id = -1;
		    thisAddress.fireEvent();
		},
		create: function() {
		if(DEBUG) alert('Address.create()');
			var thisAddress = this;
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/addAddress";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"street": thisAddress.street, 
					       "zip": thisAddress.zip, 
					       "city": thisAddress.city, 
					       "state": thisAddress.state, 
					       "country": thisAddress.country, 
					       "latitude": thisAddress.latitude, 
					       "longitude": thisAddress.longitude},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisAddress.id = returnedId;
					    });
					    thisAddress.fireEvent();
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
					tx.executeSql('INSERT INTO ADDRESS  ' +
							      '(STREET, ZIP, CITY, STATE, COUNTRY, LATITUDE, LONGITUDE)' +
							      'VALUES (?,?,?,?,?,?,?)',
							      [thisAddress.street, 
							       thisAddress.zip, 
							       thisAddress.city, 
							       thisAddress.state, 
							       thisAddress.country, 
							       thisAddress.latitude, 
							       thisAddress.longitude],
							   	   function(tx, rs) {
										thisAddress.id = rs.insertId;
										thisAddress.fireEvent();
								   },
								   function() {
									   	alert('ADDRESS INSERT Error');
								   });
				});
			}
		},
		update: function() {
		if(DEBUG) alert('Address.update()');	
			var thisAddress = this;
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/saveAddress";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"street": thisAddress.street, 
						   "zip": thisAddress.zip,
						   "city": thisAddress.city,
						   "state": thisAddress.state,
						   "country": thisAddress.country,
						   "latitude": thisAddress.latitude,
						   "longitude": thisAddress.longitude,
						   "address_id": thisAddress.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisAddress.fireEvent();
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
					tx.executeSql('UPDATE ADDRESS  ' +
								  'SET ' +
								  'ADDRESS_ID = ?,' +
								  'STREET = ?,' +
								  'ZIP = ?,' +
								  'CITY = ?,' +
								  'STATE = ?,' +
								  'COUNTRY = ?,' +
								  'LATITUDE = ?,' +
								  'LONGITUDE = ? ' +
								  'WHERE ADDRESS_ID = ?',
								  [thisAddress.street, 
								   thisAddress.zip,
								   thisAddress.city,
								   thisAddress.state,
								   thisAddress.country,
								   thisAddress.latitude,
								   thisAddress.longitude,
								   thisAddress.id],
							   	   function() {
									   thisAddress.fireEvent();
								   },
								   function() {
									   alert('Material UPDATE Error');
								   });
				});

			}
		},
		suppress: function() {
		if(DEBUG) alert('Address.suppress()');
		var thisAddress = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/deleteAddress";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"address_id": thisAddress.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisAddress.fireEvent();
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
					tx.executeSql('DELETE FROM ADDRESS WHERE ADDRESS_ID = ?', 
							      [thisAddress.id], 
							      function() {
									  thisAddress.fireEvent();	
					  			  },
					  			  function() {
					  				  alert('Activity DELETE Error');
					  			  });
				});
			}
		},
		select: function(id) {
		if(DEBUG) alert('Address.select(' + id + ')');
		var thisAddress = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getAddress";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"address_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisAddress.id = $this.find("ADDRESS_ID").text();
					        thisAddress.street = $this.find("STREET").text();
					        thisAddress.zip = $this.find("ZIP").text();
					        thisAddress.city = $this.find("CITY").text();
					        thisAddress.state = $this.find("STATE").text();
					        thisAddress.country = $this.find("COUNTRY").text();
							thisAddress.latitude = $this.find("LATITUDE").text();
							thisAddress.longitude = $this.find("LONGITUDE").text();
					    });
					    thisAddress.fireEvent();
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

					tx.executeSql('SELECT ADDRESS_ID, STREET, ZIP, CITY, STATE, COUNTRY, LATITUDE, LONGITUDE FROM ADDRESS WHERE ADDRESS_ID = ?',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        thisAddress.id = data.item(i).ADDRESS_ID;
								        thisAddress.street = data.item(i).STREET;
								        thisAddress.zip = data.item(i).ZIP;
								        thisAddress.city = data.item(i).CITY;
								        thisAddress.state = data.item(i).STATE;
								        thisAddress.country = data.item(i).COUNTRY;
										thisAddress.latitude = data.item(i).LATITUDE;
										thisAddress.longitude = data.item(i).LONGITUDE;
									}
								    thisAddress.fireEvent();
								  }, 
								  function() {
									  alert('Address SELECT Error');
								  });
				});
			}
		},
		show: function() {
			var thisAddress = this;
			alert('Address Data:\n' +
				  'Id: ' + this.id + '\n' +	
				  'Street: ' + this.street + '\n' +	
				  'Zip: ' + this.zip + '\n' +	
				  'City: ' + this.city + '\n' +	
				  'Country: ' + this.country + '\n' +	
				  'Latitude: ' + this.latitude + '\n' +	
				  'Longitude: ' + this.longitude + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter Address.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter Address.removeEventListener() ...');
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
		if(DEBUG) alert('Executing Address.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
		var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
		if(DEBUG) alert('Address.AssignEvent');
		var thisAddress = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisAddress.objectId = new Object();
				thisAddress.objectId = element;
				thisAddress.objectId.addEventListener('Address', 'onAddress', false);
			}
			else {
//				alert('It is an HTML Element');
				thisAddress.htmlElement = element;
				document.getElementById(thisAddress.htmlElement).addEventListener("Address", onAddress, false);
			}
		},
		fireEvent: function() {
		if(DEBUG) alert('Address.FireEvent');
		var thisAddress = this;
			thisAddress.AddressEvent.detail.id = thisAddress.id;
			thisAddress.AddressEvent.detail.street = thisAddress.street;
			thisAddress.AddressEvent.detail.zip = thisAddress.zip;
			thisAddress.AddressEvent.detail.city = thisAddress.city;
			thisAddress.AddressEvent.detail.state = thisAddress.state;
			thisAddress.AddressEvent.detail.country = thisAddress.country;
			thisAddress.AddressEvent.detail.latitude = thisAddress.latitude;
			thisAddress.AddressEvent.detail.longitude = thisAddress.longitude;
			if (thisAddress.objectId!=null){
//				alert('Event fired to an Object');
				thisAddress.objectId.dispatchEvent(thisAddress.AddressEvent);
			}
			if(thisAddress.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisAddress.htmlElement).dispatchEvent(thisAddress.AddressEvent);
			}
		},
		store: function() {
		if(DEBUG) alert('Address.store()');
			localStorage.setItem('Address', JSON.stringify(this));
		},
		restore: function() {
		if(DEBUG) alert('Address.restore()');
		var thisAddress = this;
		var item = JSON.parse(localStorage.getItem('Address'));	
			thisAddress.id = item.id;
	        thisAddress.street = item.street;
	        thisAddress.zip = item.zip;
	        thisAddress.city = item.city;
	        thisAddress.state = item.state;
	        thisAddress.country = item.country;
			thisAddress.latitude = item.latitude;
			thisAddress.longitude = item.longitude;
			thisAddress.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('Address.unstore()');
		var thisAddress = this;
			localStorage.removeItem('Address');
		},
		isStored: function() {
		if(DEBUG) alert('Address.isStored()');
		var thisAddress = this;
		var storage = localStorage.getItem('Address');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return Address;
})();


var AddressCollection = (function () {
	
	var AddressCollection = function () {
		if(DEBUG) alert('Enter AddressCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.AddressCollectionEvent = new CustomEvent("AddressCollection", {
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
				this.AddressCollectionEvent = new CustomEvent("AddressCollection", {
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
				this.AddressCollectionEvent = document.createEvent("CustomEvent");
				this.AddressCollectionEvent.initCustomEvent('AddressCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Constructor...');
	};

	AddressCollection.prototype = {
		load: function() {
//		if(DEBUG) alert('AddressCollection.load()');
		var thisAddressCollection = this;
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getAddresses";
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
					        item = new Address($this.find("ADDRESS_ID").text(), 
					        		           $this.find("STREET").text(),
					        		           $this.find("ZIP").text(),
					        		           $this.find("CITY").text(),
					        		           $this.find("STATE").text(),
					        		           $this.find("COUNTRY").text(),
					        		           $this.find("LATITUDE").text(),
					        		           $this.find("LONGITUDE").text());
	//				        alert(JSON.stringify(item));
					        thisAddressCollection.add(key++, item);
					    });
					    thisAddressCollection.fireEvent();
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
					tx.executeSql('SELECT ADDRESS_ID, STREET, ZIP, CITY, STATE, COUNTRY, LATITUDE, LONGITUDE  FROM ADDRESS',
							      [], 
							      function (tx, rs) {
								  	var data = rs.rows;
								    var key = 0;
									for (var i=0; i<data.length; i++) {
								        var item = new Address(data.item(i).ADDRESS_ID, 
						        		           			   data.item(i).STREET,
						        		           			   data.item(i).ZIP,
						        		           			   data.item(i).CITY,
						        		           			   data.item(i).STATE,
						        		           			   data.item(i).COUNTRY,						        		           
						        		           			   data.item(i).LATITUDE,
						        		           			   data.item(i).LONGITUDE); 
//				        				alert(JSON.stringify(item));
				        				thisAddressCollection.add(key++, item);
									}
									thisAddressCollection.fireEvent();
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
		var thisAddressCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisAddressCollection.objectId = new Object();
				thisAddressCollection.objectId = element;
				thisAddressCollection.objectId.addEventListener('AddressCollection', 'onAddressCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisAddressCollection.htmlElement = element;
				document.getElementById(thisAddressCollection.htmlElement).addEventListener("AddressCollection", onAddressCollection, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) alert('FireEvent');
			var thisAddressCollection = this;
			thisAddressCollection.AddressCollectionEvent.detail.count = thisAddressCollection.count;
			thisAddressCollection.AddressCollectionEvent.detail.items = thisAddressCollection.collection;
			document.getElementById(thisAddressCollection.htmlElement).dispatchEvent(thisAddressCollection.AddressCollectionEvent);
		},
		store: function() {
		if(DEBUG) alert('AddressCollection.store()');
		var thisAddressCollection = this;
			localStorage.setItem('AddressCollection', JSON.stringify(thisAddressCollection));
		},
		restore: function() {
		if(DEBUG) alert('AddressCollection.restore()');
		var thisAddressCollection = this;
		var item = JSON.parse(localStorage.getItem('AddressCollection'));	
			thisAddressCollection.count = item.count;
			thisAddressCollection.collection = item.collection;
			thisAddressCollection.htmlElement = item.htmlElement;
			thisAddressCollection.objectId = item.objectId;
			thisAddressCollection.AddressCollectionEvent = item.AddressCollectionEvent;
			thisAddressCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('AddressCollection.unstore()');
		var thisAddressCollection = this;
			localStorage.removeItem('AddressCollection');
		},
		isStored: function() {
		if(DEBUG) alert('AddressCollection.isStored()');
		var thisAddressCollection = this;
		var storage = localStorage.getItem('AddressCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
		
	};
	return AddressCollection;
	
})();
