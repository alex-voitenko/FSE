//////////////////////////////////////////////////
// Define Site Class
//////////////////////////////////////////////////

/** Site
 * This class encapsulates a Site.
 *
 */	
/**
 * @author Hell
 */
/**
 *  Site Class Definition 
 */
var Site = (function () {
	var Site = function (id, address_id, customer_id, name, description) {
//		alert('Enter Site() Constructor...');
		this.id = id || -1;
		this.address_id = address_id || -1;
		this.customer_id = customer_id || -1;
		this.name = name || '';
		this.description = description || '';
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.SiteEvent = new CustomEvent("Site", {
				detail: {
					id: 0,
					address_id: 0,
					customer_id: 0,
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
				this.SiteEvent = new CustomEvent("Site", {
					detail: {
						id: 0,
						address_id: 0,
						customer_id: 0,
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
				this.SiteEvent = document.createEvent("CustomEvent");
				this.SiteEvent.initCustomEvent('Site', true, false, {id: 0, address_id: 0, customer_id: 0, name: '', description: '', time: new Date()});
			}
		}
//		alert('Exit Site Constructor...');
	};

	Site.prototype = {
		reset: function() {
//		alert('Site.reset()');
			var thisSite = this;
			thisSite.id = -1;
			thisSite.address_id = -1;
			thisSite.customer_id = -1;
			thisSite.name = '';
			thisSite.description = '';
		    thisSite.fireEvent();
		},
		create: function() {
//		alert('Site.create()');
			var thisSite = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/addSite";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"address_id": thisSite.address_id,
						   "customer_id": thisSite.customer_id,
						   "name": thisSite.name,
						   "description": thisSite.description},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisSite.id = returnedId;
					    });
					    thisSite.fireEvent();
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
					tx.executeSql('INSERT INTO SITE  ' +
								  '(ADDRESS_ID, CUSTOMER_ID, NAME, DESCRIPTION) ' +
								  'VALUES(?,?,?,?)',
								  [thisSite.address_id,
								   thisSite.customer_id,
								   thisSite.name,
								   thisSite.description],
							   	   function(tx, rs) {
										thisSite.id = rs.insertId;
										thisSite.fireEvent();
								   },
								   function() {
									   alert('Site INSERT Error');
								   });
				});
			}
		},
		update: function() {
//		alert('Site.update()');	
			var thisSite = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/saveSite";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"address_id": thisSite.address_id,
						   "customer_id": thisSite.customer_id,
						   "name": thisSite.name,
						   "description": thisSite.description,
						   "site_id": thisSite.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisSite.fireEvent();
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
					tx.executeSql('UPDATE SITE  ' +
								  'SET ' +
								  'ADDRESS_ID = ?,' +
								  'CUSTOMER_ID` = ?,' +
								  'NAME = ?,' +
								  'DESCRIPTION = ? ' +
								  'WHERE SITE_ID = ?',
								  [thisSite.address_id,
								   thisSite.customer_id,
								   thisSite.name,
								   thisSite.description,
								   thisSite.id],
							   	   function() {
										thisSite.fireEvent();
								   },
								   function() {
									   alert('Site UPDATE Error');
								   });
				});
			}
		},
		suppress: function() {
//		alert('Site.suppress()');
			var thisSite = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/deleteSite";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"site_id": thisSite.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisSite.fireEvent();
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
					tx.executeSql('DELETE FROM SITE WHERE SITE_ID = ?', 
							      [thisSite.id], 
							      function() {
										thisSite.fireEvent();	
								  }, 
							      function() {
								  	  alert('Site DELETE Error');
								  });
				});
			}
		},
		select: function(id) {
//		alert('Site.select(' + id + ')');
		var thisSite = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getSite";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"site_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisSite.id = $this.find("SITE_ID").text();
					        thisSite.address_id = $this.find("ADDRESS_ID").text();
					        thisSite.customer_id = $this.find("CUSTOMER_ID").text();
					        thisSite.name = $this.find("NAME").text();
					        thisSite.description = $this.find("DESCRIPTION").text();
					    });
					    thisSite.fireEvent();
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
					tx.executeSql('SELECT SITE_ID, ADDRESS_ID, CUSTOMER_ID, NAME, DESCRIPTION FROM SITE WHERE SITE_ID = ?',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        thisSite.id = data.item(i).SITE_ID;
								        thisSite.address_id = data.item(i).ADDRESS_ID;
								        thisSite.customer_id = data.item(i).CUSTOMER_ID;
								        thisSite.name = data.item(i).NAME;
								        thisSite.description = data.item(i).DESCRIPTION;
									}
									thisSite.fireEvent();
								  }, 
								  function() {
									  alert('Site SELECT Error');
								  });
				});
			}
		},
		show: function() {
			var thisSite = this;
			alert('Site Data:\n' +
				  'Id: ' + thisSite.id + '\n' +
				  'Address Id: ' + thisSite.address_id + '\n' +
				  'Customer Id: ' + thisSite.customer_id + '\n' +
				  'Name: ' + thisSite.name + '\n' +
				  'Description: ' + thisSite.description + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter Site.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter Site.removeEventListener() ...');
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
//		alert('Executing Site.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		alert('Site.AssignEvent');
		var thisSite = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisSite.objectId = new Object();
				thisSite.objectId = element;
				thisSite.objectId.addEventListener('Site', 'onSite', false);
			}
			else {
//				alert('It is an HTML Element');
				thisSite.htmlElement = element;
				document.getElementById(thisSite.htmlElement).addEventListener("Site", onSite, false);
			}
		},
		fireEvent: function() {
//		alert('Site.FireEvent');
		var thisSite = this;
			thisSite.SiteEvent.detail.id = thisSite.id;
			thisSite.SiteEvent.detail.address_id = thisSite.address_id;
			thisSite.SiteEvent.detail.customer_id = thisSite.customer_id;
			thisSite.SiteEvent.detail.name = thisSite.name;
			thisSite.SiteEvent.detail.description = thisSite.description;
			if (thisSite.objectId!=null){
//				alert('Event fired to an Object');
				thisSite.objectId.dispatchEvent(thisSite.SiteEvent);
			}
			if(thisSite.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisSite.htmlElement).dispatchEvent(thisSite.SiteEvent);
			}
		},
		store: function() {
//		alert('Site.store()');
			localStorage.setItem('Site', JSON.stringify(this));
		},
		restore: function() {
//		alert('Site.restore()');
		var thisSite = this;
		var item = JSON.parse(localStorage.getItem('Site'));	
			thisSite.id = item.id;
			thisSite.address_id = item.address_id;
			thisSite.customer_id = item.customer_id;
			thisSite.name = item.name;
			thisSite.description = item.description;
			thisSite.htmlElement = item.htmlElement;
			thisSite.objectId = item.objectId;
			thisSite.SiteEvent = item.SiteEvent;
			thisSite.fireEvent();
		},
		unstore: function() {
		alert('Site.remove()');
		var thisSite = this;
			localStorage.removeItem('Site');
		},
		isStored: function() {
//		alert('Site.isStored()');
		var thisSite = this;
		var storage = localStorage.getItem('Site');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return Site;
})();


var SiteCollection = (function () {
	
	var SiteCollection = function () {
//		alert('Enter SiteCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.SiteCollectionEvent = new CustomEvent("SiteCollection", {
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
				this.SiteCollectionEvent = new CustomEvent("SiteCollection", {
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
				this.SiteCollectionEvent = document.createEvent("CustomEvent");
				this.SiteCollectionEvent.initCustomEvent('SiteCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
//		alert('Exit Constructor...');
	};

	SiteCollection.prototype = {
		load: function() {
//			alert('load');
			var thisSiteCollection = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getSites";
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
					        item = new Site($this.find("SITE_ID").text(),
	        								$this.find("ADDRESS_ID").text(),
	        								$this.find("CUSTOMER_ID").text(),
	        								$this.find("NAME").text(),
	        								$this.find("DESCRIPTION").text());
	//				        alert(JSON.stringify(item));
					        thisSiteCollection.add(key++, item);
					    });
					    thisSiteCollection.fireEvent();
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
					tx.executeSql('SELECT SITE_ID, ADDRESS_ID, CUSTOMER_ID, NAME, DESCRIPTION FROM SITE',
						      [], 
						      function (tx, rs) {
							  	var data = rs.rows;
							  	var key = 0;
								for (var i=0; i<data.length; i++) {
							        var item = new Site(data.item(i).SITE_ID,
							        					data.item(i).ADDRESS_ID,
							        					data.item(i).CUSTOMER_ID,
							        					data.item(i).NAME,
							        					data.item(i).DESCRIPTION);
//			        				alert(JSON.stringify(item));
							        thisSiteCollection.add(key++, item);
								}
								thisSiteCollection.fireEvent();
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
//		alert('AssignEvent');
		var thisSiteCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisSiteCollection.objectId = new Object();
				thisSiteCollection.objectId = element;
				thisSiteCollection.objectId.addEventListener('SiteCollection', 'onSiteCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisSiteCollection.htmlElement = element;
				document.getElementById(thisSiteCollection.htmlElement).addEventListener("SiteCollection", onSiteCollection, false);
			}
		},
		fireEvent: function() {
//		alert('FireEvent');
		var thisSiteCollection = this;
			thisSiteCollection.SiteCollectionEvent.detail.count = thisSiteCollection.count;
			thisSiteCollection.SiteCollectionEvent.detail.items = thisSiteCollection.collection;
			if (thisSiteCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisSiteCollection.objectId.dispatchEvent(thisSiteCollection.SiteCollectionEvent);
			}
			if(thisSiteCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisSiteCollection.htmlElement).dispatchEvent(thisSiteCollection.SiteCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('SiteCollection.store()');
		var thisSiteCollection = this;
			localStorage.setItem('SiteCollection', JSON.stringify(thisSiteCollection));
		},
		restore: function() {
//		if(DEBUG) alert('SiteCollection.restore()');
		var thisSiteCollection = this;
		var item = JSON.parse(localStorage.getItem('SiteCollection'));	
			thisSiteCollection.count = item.count;
			thisSiteCollection.collection = item.collection;
			thisSiteCollection.htmlElement = item.htmlElement;
			thisSiteCollection.objectId = item.objectId;
			thisSiteCollection.SiteCollectionEvent = item.SiteCollectionEvent;
			thisSiteCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('SiteCollection.unstore()');
			localStorage.removeItem('SiteCollection');
		},
		isStored: function() {
//			if(DEBUG) alert('SiteCollection.isStored()');
		var storage = localStorage.getItem('SiteCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return SiteCollection;
	
})();
