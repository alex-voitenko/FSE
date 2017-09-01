//////////////////////////////////////////////////
// Define WorkOrderInfo Class
//////////////////////////////////////////////////

/** WorkOrderInfo
 * This class encapsulates a WorkOrderInfo.
 *
 */	
/**
 * @author Hell
 */
/**
 *  WorkOrderInfo Class Definition 
 */
var WorkOrderInfo = (function () {
	var WorkOrderInfo = function (id) {
		if(DEBUG) alert('Enter WorkOrderInfo() Constructor...');
		this.id = id || -1;
		this.workorder = null;
		this.customer = null;
		this.site = null;
		this.customerAddress = null;
		this.siteAddress = null;
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.WorkOrderInfoEvent = new CustomEvent("WorkOrderInfo", {
				detail: {
					id: 0,
					workorder: null,
					customer: null,
					site: null,
					customer_address: null,
					site_address: null,
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.WorkOrderInfoEvent = new CustomEvent("WorkOrderInfo", {
					detail: {
						id: 0,
						workorder: null,
						customer: null,
						site: null,
						customer_address: null,
						site_address: null,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.WorkOrderInfoEvent = document.createEvent("CustomEvent");
				this.WorkOrderInfoEvent.initCustomEvent('WorkOrderInfo', true, false, {id: 0, workorder: null, customer: null, site: null, customer_address: null, site_address: null, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit WorkOrderInfo Constructor...');
	};

	WorkOrderInfo.prototype = {
		reset: function() {
//		alert('WorkOrderInfo.reset()');
			var thisWorkOrderInfo = this;
			thisWorkOrderInfo.id = -1;
			thisWorkOrderInfo.workorder = null;
			thisWorkOrderInfo.customer = null;
			thisWorkOrderInfo.site = null;
			thisWorkOrderInfo.customerAddress = null;
			thisWorkOrderInfo.siteAddress = null;
		    thisWorkOrderInfo.fireEvent();
		},
		select: function(id) {
//		alert('WorkOrderInfo.select(' + id + ')');
		var thisWorkOrderInfo = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getWorkOrderInfo";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workorder_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisWorkOrderInfo.workorder = new WorkOrder($this.find("WORKORDER_ID").text(),
					        											$this.find("WORKORDER_STATUS_ID").text(),
					        											$this.find("WORKORDER_DESCRIPTION").text(),
					        											$this.find("WORKORDER_STARTDATE").text(),
					        											$this.find("WORKORDER_ENDDATE").text());
					        thisWorkOrderInfo.customer = new Customer($this.find("CUSTOMER_ID").text(),
									  								  $this.find("CUSTOMER_ADDRESS_ID").text(),
					        										  $this.find("CUSTOMER_NAME").text(),
					        										  $this.find("CUSTOMER_DESCRIPTION").text(),
					        										  $this.find("CUSTOMER_CONTACTNAME").text(),
					        										  $this.find("CUSTOMER_PHONENR").text(),
					        										  $this.find("CUSTOMER_MOBILENR").text(),
					        										  $this.find("CUSTOMER_EMAIL").text(),
					        										  $this.find("CUSTOMER_WEBSITE").text());
					        thisWorkOrderInfo.customerAddress = new Address($this.find("CUSTOMER_ADDRESS_ID").text(),
					        												$this.find("CUSTOMER_ADDRESS_STREET").text(),
					        												$this.find("CUSTOMER_ADDRESS_ZIP").text(),
					        												$this.find("CUSTOMER_ADDRESS_CITY").text(),
					        												$this.find("CUSTOMER_ADDRESS_STATE").text(),
					        												$this.find("CUSTOMER_ADDRESS_COUNTRY").text(),
					        												$this.find("CUSTOMER_ADDRESS_LATITUDE").text(),
					        												$this.find("CUSTOMER_ADDRESS_LONGITUDE").text());
					        thisWorkOrderInfo.site = new Site($this.find("SITE_ID").text(),
					        								  $this.find("SITE_ADDRESS_ID").text(),
					        								  $this.find("SITE_CUSTOMER_ID").text(),
					        								  $this.find("SITE_NAME").text(),
					        								  $this.find("SITE_DESCRIPTION").text());
					        thisWorkOrderInfo.siteAddress = new Address($this.find("SITE_ADDRESS_ID").text(),
					        											$this.find("SITE_ADDRESS_STREET").text(),
					        											$this.find("SITE_ADDRESS_ZIP").text(),
					        											$this.find("SITE_ADDRESS_CITY").text(),
					        											$this.find("SITE_ADDRESS_STATE").text(),
					        											$this.find("SITE_ADDRESS_COUNTRY").text(),
					        											$this.find("SITE_ADDRESS_LATITUDE").text(),
					        											$this.find("SITE_ADDRESS_LONGITUDE").text());
					    });
					    thisWorkOrderInfo.fireEvent();
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
						tx.executeSql('SELECT WO.WORKORDER_ID, WO.WORKORDER_STATUS_ID, WO.DESCRIPTION AS WORKORDER_DESCRIPTION, WO.STARTDATE AS WORKORDER_STARTDATE, WO.ENDDATE AS WORKORDER_ENDDATE, ' +
									  'S.SITE_ID, S.NAME AS SITE_NAME, S.DESCRIPTION AS SITE_DESCRIPTION, SA.ADDRESS_ID AS SITE_ADDRESS_ID, SA.STREET SITE_ADDRESS_STREET, SA.ZIP AS SITE_ADDRESS_ZIP, SA.CITY AS SITE_ADDRESS_CITY, SA.STATE AS SITE_ADDRESS_STATE, SA.COUNTRY AS SITE_ADDRESS_COUNTRY, SA.LATITUDE AS SITE_ADDRESS_LATITUDE, SA.LONGITUDE AS SITE_ADDRESS_LONGITUDE, ' +
									  'C.CUSTOMER_ID, C.NAME AS CUSTOMER_NAME, C.DESCRIPTION AS CUSTOMER_DESCRIPTION, C.CONTACTNAME AS CUSTOMER_CONTACTNAME, C.PHONENR AS CUSTOMER_PHONENR, C.MOBILENR AS CUSTOMER_MOBILENR, C.EMAIL AS CUSTOMER_EMAIL, C.WEBSITE AS CUSTOMER_WEBSITE,CA.ADDRESS_ID AS CUSTOMER_ADDRESS_ID, CA.STREET AS CUSTOMER_ADDRESS_STREET, CA.ZIP AS CUSTOMER_ADDRESS_ZIP, CA.CITY AS CUSTOMER_ADDRESS_CITY, CA.STATE AS CUSTOMER_ADDRESS_STATE, CA.COUNTRY AS CUSTOMER_ADDRESS_COUNTRY, CA.LATITUDE AS CUSTOMER_ADDRESS_LATITUDE, CA.LONGITUDE AS CUSTOMER_ADDRESS_LONGITUDE  ' + 
									  'FROM WORKORDER WO, SITE S, ADDRESS SA, CUSTOMER C, ADDRESS CA  ' +
									  'WHERE WO.SITE_ID=S.SITE_ID AND S.ADDRESS_ID = SA.ADDRESS_ID AND C.CUSTOMER_ID = S.CUSTOMER_ID AND C.ADDRESS_ID = CA.ADDRESS_ID AND WORKORDER_ID = ?',
								      [id], 
								      function (tx, rs) {
									  	var data = rs.rows;
										for (var i=0; i<data.length; i++) {
									        thisWorkOrderInfo.workorder = new WorkOrder(data.item(i).WORKORDER_ID,
									        											data.item(i).SITE_ID,
									        											data.item(i).WORKORDER_STATUS_ID,
									        											data.item(i).WORKORDER_DESCRIPTION,
									        											data.item(i).WORKORDER_STARTDATE,
									        											data.item(i).WORKORDER_ENDDATE);
									        thisWorkOrderInfo.customer = new Customer(data.item(i).CUSTOMER_ID,
													  								  data.item(i).CUSTOMER_ADDRESS_ID,
									        										  data.item(i).CUSTOMER_NAME,
									        										  data.item(i).CUSTOMER_DESCRIPTION,
									        										  data.item(i).CUSTOMER_CONTACTNAME,
									        										  data.item(i).CUSTOMER_PHONENR,
									        										  data.item(i).CUSTOMER_MOBILENR,
									        										  data.item(i).CUSTOMER_EMAIL,
									        										  data.item(i).CUSTOMER_WEBSITE);
									        thisWorkOrderInfo.customerAddress = new Address(data.item(i).CUSTOMER_ADDRESS_ID,
									        												data.item(i).CUSTOMER_ADDRESS_STREET,
									        												data.item(i).CUSTOMER_ADDRESS_ZIP,
									        												data.item(i).CUSTOMER_ADDRESS_CITY,
									        												data.item(i).CUSTOMER_ADDRESS_STATE,
									        												data.item(i).CUSTOMER_ADDRESS_COUNTRY,
									        												data.item(i).CUSTOMER_ADDRESS_LATITUDE,
									        												data.item(i).CUSTOMER_ADDRESS_LONGITUDE);
									        thisWorkOrderInfo.site = new Site(data.item(i).SITE_ID,
									        								  data.item(i).SITE_ADDRESS_ID,
									        								  data.item(i).CUSTOMER_ID,
									        								  data.item(i).SITE_NAME,
									        								  data.item(i).SITE_DESCRIPTION);
									        thisWorkOrderInfo.siteAddress = new Address(data.item(i).SITE_ADDRESS_ID,
									        											data.item(i).SITE_ADDRESS_STREET,
									        											data.item(i).SITE_ADDRESS_ZIP,
									        											data.item(i).SITE_ADDRESS_CITY,
									        											data.item(i).SITE_ADDRESS_STATE,
									        											data.item(i).SITE_ADDRESS_COUNTRY,
									        											data.item(i).SITE_ADDRESS_LATITUDE,
									        											data.item(i).SITE_ADDRESS_LONGITUDE);
										}
										thisWorkOrderInfo.fireEvent();
									  }, 
									  function() {
										  alert('WorkOrderInfo SELECT Error');
									  });
					});
			}
		},
		show: function() {
			var thisWorkOrderInfo = this;
			alert('WorkOrderInfo Data:\n' +
				  '----- WorkOrder -----\n' + 
				  'Id: ' + thisWorkOrderInfo.workorder.id + '\n' +
				  'Site Id: '+ thisWorkOrderInfo.workorder.site_id + '\n' +
				  'Status Id: ' + thisWorkOrderInfo.workorder.workorder_status_id + '\n' +
				  'Description:'  + thisWorkOrderInfo.workorder.description + '\n' +
				  'Start Date: '  + thisWorkOrderInfo.workorder.startdate + '\n' +
				  'End Date: '  + thisWorkOrderInfo.workorder.enddate + '\n' +
				  '----- Customer ----- \n' +
				  'Id: ' + thisWorkOrderInfo.customer.id + '\n' +
				  'Address Id: ' + thisWorkOrderInfo.customer.address_id + '\n' +
				  'Name: ' + thisWorkOrderInfo.customer.name + '\n' +
				  'Description: ' + thisWorkOrderInfo.customer.description + '\n' +
				  'Contact Name: ' + thisWorkOrderInfo.customer.contactname + '\n' +
				  'Phone Nr: ' + thisWorkOrderInfo.customer.phonenr + '\n' +
				  'Mobile Nr: ' + thisWorkOrderInfo.customer.mobilenr + '\n' +
				  'Email: ' + thisWorkOrderInfo.customer.email + '\n' +
				  'Web Site: ' + thisWorkOrderInfo.customer.website + '\n' +
				  '----- Customer Address ----- \n' +
				  'Id: ' + thisWorkOrderInfo.customerAddress.id + '\n' +
				  'Street: ' + thisWorkOrderInfo.customerAddress.street + '\n' +
				  'Zip: ' + thisWorkOrderInfo.customerAddress.zip + '\n' +
				  'City: ' + thisWorkOrderInfo.customerAddress.city + '\n' +
				  'State: ' + thisWorkOrderInfo.customerAddress.state + '\n' +
				  'Country: ' + thisWorkOrderInfo.customerAddress.country + '\n' +
				  'Latitude: ' + thisWorkOrderInfo.customerAddress.latitude + '\n' +
				  'Longitude: ' + thisWorkOrderInfo.customerAddress.longitude + '\n' +
				  '----- Site ----- \n' + thisWorkOrderInfo.site.id + '\n' +
				  'Id: ' + thisWorkOrderInfo.site.id + '\n' +
				  'Address Id: ' + thisWorkOrderInfo.site.address_id + '\n' +
				  'Customer Id: ' + thisWorkOrderInfo.site.customer_id + '\n' +
				  'Name: \n' + thisWorkOrderInfo.site.name + '\n' +
				  'Description: ' + thisWorkOrderInfo.site.description + '\n' +
				  '----- Site Address ----- \n' +
				  'Id: ' + thisWorkOrderInfo.siteAddress.id + '\n' +
				  'Street: ' + thisWorkOrderInfo.siteAddress.street + '\n' +
				  'Zip: ' + thisWorkOrderInfo.siteAddress.zip + '\n' +
				  'City: ' + thisWorkOrderInfo.siteAddress.city + '\n' +
				  'State: ' + thisWorkOrderInfo.siteAddress.state + '\n' +
				  'Country: ' + thisWorkOrderInfo.siteAddress.country + '\n' +
				  'Latitude: ' + thisWorkOrderInfo.siteAddress.latitude + '\n' +
				  'Longitude: ' + thisWorkOrderInfo.siteAddress.longitude + '\n' +
				  '\n');
		},
		addEventListener: function(name, handler, capture) {
//		alert('Enter WorkOrderInfo.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		alert('Enter WorkOrderInfo.removeEventListener() ...');
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
//		alert('Executing WorkOrderInfo.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		alert('WorkOrderInfo.AssignEvent');
		var thisWorkOrderInfo = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisWorkOrderInfo.objectId = new Object();
				thisWorkOrderInfo.objectId = element;
				thisWorkOrderInfo.objectId.addEventListener('WorkOrderInfo', 'onWorkOrderInfo', false);
			}
			else {
//				alert('It is an HTML Element');
				thisWorkOrderInfo.htmlElement = element;
				document.getElementById(thisWorkOrderInfo.htmlElement).addEventListener("WorkOrderInfo", onWorkOrderInfo, false);
			}
		},
		fireEvent: function() {
//		alert('WorkOrderInfo.FireEvent');
		var thisWorkOrderInfo = this;
			if (thisWorkOrderInfo.objectId!=null){
//				alert('Event fired to an Object');
				thisWorkOrderInfo.objectId.dispatchEvent(thisWorkOrderInfo.WorkOrderInfoEvent);
			}
			if(thisWorkOrderInfo.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisWorkOrderInfo.htmlElement).dispatchEvent(thisWorkOrderInfo.WorkOrderInfoEvent);
			}
		},
		store: function() {
//		alert('WorkOrderInfo.store()');
			localStorage.setItem('WorkOrderInfo', JSON.stringify(this));
		},
		restore: function() {
//		alert('WorkOrderInfo.restore()');
		var thisWorkOrderInfo = this;
		var item = JSON.parse(localStorage.getItem('WorkOrderInfo'));	
			thisWorkOrderInfo.id = item.id;
			thisWorkOrderInfo.workorder = item.workorder;
			thisWorkOrderInfo.customer = item.customer;
			thisWorkOrderInfo.site = item.site;
			thisWorkOrderInfo.customerAddress = item.customerAddress;
			thisWorkOrderInfo.siteAddress = item.siteAddress;
			thisWorkOrderInfo.htmlElement = item.htmlElement;
			thisWorkOrderInfo.objectId = item.objectId;
			thisWorkOrderInfo.WorkOrderInfoEvent = item.WorkOrderInfoEvent;
			thisWorkOrderInfo.fireEvent();
		},
		unstore: function() {
		alert('WorkOrderInfo.unstore()');
		var thisWorkOrderInfo = this;
			localStorage.removeItem('WorkOrderInfo');
		},
		isStored: function() {
//		alert('WorkOrderInfo.isStored()');
		var thisWorkOrderInfo = this;
		var storage = localStorage.getItem('WorkOrderInfo');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return WorkOrderInfo;
})();


var WorkOrderInfoCollection = (function () {
	
	var WorkOrderInfoCollection = function () {
		if(DEBUG) alert('Enter WorkOrderInfoCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.WorkOrderInfoCollectionEvent = new CustomEvent("WorkOrderInfoCollection", {
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
				this.WorkOrderInfoCollectionEvent = new CustomEvent("WorkOrderInfoCollection", {
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
				this.WorkOrderInfoCollectionEvent = document.createEvent("CustomEvent");
				this.WorkOrderInfoCollectionEvent.initCustomEvent('WorkOrderInfoCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
//		alert('Exit Constructor...');
	};

	WorkOrderInfoCollection.prototype = {
		load: function() {
		alert('load');
		var thisWorkOrderInfoCollection = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getWorkOrderInfos";
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
					        item = new WorkOrderInfo(key);
					        item.workorder = new WorkOrder($this.find("WORKORDER_ID").text(),
					        							   $this.find("WORKORDER_STATUS_ID").text(),
					        							   $this.find("WORKORDER_DESCRIPTION").text(),
					        							   $this.find("WORKORDER_STARTDATE").text(),
					        							   $this.find("WORKORDER_ENDDATE").text());
					        item.customer = new Customer($this.find("CUSTOMER_ID").text(),
					        							 $this.find("CUSTOMER_ADDRESS_ID").text(),
					        							 $this.find("CUSTOMER_NAME").text(),
					        							 $this.find("CUSTOMER_DESCRIPTION").text(),
					        							 $this.find("CUSTOMER_CONTACTNAME").text(),
					        							 $this.find("CUSTOMER_PHONENR").text(),
					        							 $this.find("CUSTOMER_MOBILENR").text(),
					        							 $this.find("CUSTOMER_EMAIL").text(),
					        							 $this.find("CUSTOMER_WEBSITE").text());
					        item.customerAddress = new Address($this.find("CUSTOMER_ADDRESS_ID").text(),
					        								   $this.find("CUSTOMER_ADDRESS_STREET").text(),
					        								   $this.find("CUSTOMER_ADDRESS_ZIP").text(),
					        								   $this.find("CUSTOMER_ADDRESS_CITY").text(),
					        								   $this.find("CUSTOMER_ADDRESS_STATE").text(),
					        								   $this.find("CUSTOMER_ADDRESS_COUNTRY").text(),
					        								   $this.find("CUSTOMER_ADDRESS_LATITUDE").text(),
					        								   $this.find("CUSTOMER_ADDRESS_LONGITUDE").text());
					        item.site = new Site($this.find("SITE_ID").text(),
					        		             $this.find("SITE_ADDRESS_ID").text(),
					        		             $this.find("SITE_CUSTOMER_ID").text(),
					        		             $this.find("SITE_NAME").text(),
					        		             $this.find("SITE_DESCRIPTION").text());
					        item.siteAddress = new Address($this.find("SITE_ADDRESS_ID").text(),
														   $this.find("SITE_ADDRESS_STREET").text(),
														   $this.find("SITE_ADDRESS_ZIP").text(),
														   $this.find("SITE_ADDRESS_CITY").text(),
														   $this.find("SITE_ADDRESS_STATE").text(),
														   $this.find("SITE_ADDRESS_COUNTRY").text(),
														   $this.find("SITE_ADDRESS_LATITUDE").text(),
														   $this.find("SITE_ADDRESS_LONGITUDE").text());
					        
					        alert(JSON.stringify(item));
					        thisWorkOrderInfoCollection.add(key++, item);
					    });
					    thisWorkOrderInfoCollection.fireEvent();
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
					tx.executeSql('SELECT WO.WORKORDER_ID, WO.WORKORDER_STATUS_ID, WO.DESCRIPTION AS WORKORDER_DESCRIPTION, WO.STARTDATE AS WORKORDER_STARTDATE, WO.ENDDATE AS WORKORDER_ENDDATE, ' +
							      'S.SITE_ID, S.NAME AS SITE_NAME, S.DESCRIPTION AS SITE_DESCRIPTION, SA.ADDRESS_ID AS SITE_ADDRESS_ID, SA.STREET SITE_ADDRESS_STREET, SA.ZIP AS SITE_ADDRESS_ZIP, SA.CITY AS SITE_ADDRESS_CITY, SA.STATE AS SITE_ADDRESS_STATE, SA.COUNTRY AS SITE_ADDRESS_COUNTRY, SA.LATITUDE AS SITE_ADDRESS_LATITUDE, SA.LONGITUDE AS SITE_ADDRESS_LONGITUDE, ' +
							      'C.CUSTOMER_ID, C.NAME AS CUSTOMER_NAME, C.DESCRIPTION AS CUSTOMER_DESCRIPTION, C.CONTACTNAME AS CUSTOMER_CONTACTNAME, C.PHONENR AS CUSTOMER_PHONENR, C.MOBILENR AS CUSTOMER_MOBILENR, C.EMAIL AS CUSTOMER_EMAIL, C.WEBSITE AS CUSTOMER_WEBSITE,CA.ADDRESS_ID AS CUSTOMER_ADDRESS_ID, CA.STREET AS CUSTOMER_ADDRESS_STREET, CA.ZIP AS CUSTOMER_ADDRESS_ZIP, CA.CITY AS CUSTOMER_ADDRESS_CITY, CA.STATE AS CUSTOMER_ADDRESS_STATE, CA.COUNTRY AS CUSTOMER_ADDRESS_COUNTRY, CA.LATITUDE AS CUSTOMER_ADDRESS_LATITUDE, CA.LONGITUDE AS CUSTOMER_ADDRESS_LONGITUDE  ' + 
							      'FROM WORKORDER WO, SITE S, ADDRESS SA, CUSTOMER C, ADDRESS CA  ' +
							      'WHERE WO.SITE_ID=S.SITE_ID AND S.ADDRESS_ID = SA.ADDRESS_ID AND C.CUSTOMER_ID = S.CUSTOMER_ID AND C.ADDRESS_ID = CA.ADDRESS_ID AND WORKORDER_ID = ?',
							      [], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	alert('LEN: ' + data.length);
								  	var key = 0;
									for (var i=0; i<data.length; i++) {
								        var item = new WorkOrderInfo(key);
								        item.workorder = new WorkOrder(data.item(i).WORKORDER_ID,
								        							   data.item(i).SITE_ID,
								        							   data.item(i).WORKORDER_STATUS_ID,
								        							   data.item(i).WORKORDER_DESCRIPTION,
								        							   data.item(i).WORKORDER_STARTDATE,
								        							   data.item(i).WORKORDER_ENDDATE);
									    item.customer = new Customer(data.item(i).CUSTOMER_ID,
																     data.item(i).CUSTOMER_ADDRESS_ID,
									    							 data.item(i).CUSTOMER_NAME,
									    							 data.item(i).CUSTOMER_DESCRIPTION,
									    							 data.item(i).CUSTOMER_CONTACTNAME,
									    							 data.item(i).CUSTOMER_PHONENR,
									    							 data.item(i).CUSTOMER_MOBILENR,
									    							 data.item(i).CUSTOMER_EMAIL,
									    							 data.item(i).CUSTOMER_WEBSITE);
									    item.customerAddress = new Address(data.item(i).CUSTOMER_ADDRESS_ID,
				    													   data.item(i).CUSTOMER_ADDRESS_STREET,
				    													   data.item(i).CUSTOMER_ADDRESS_ZIP,
				    													   data.item(i).CUSTOMER_ADDRESS_CITY,
				    													   data.item(i).CUSTOMER_ADDRESS_STATE,
				    													   data.item(i).CUSTOMER_ADDRESS_COUNTRY,
				    													   data.item(i).CUSTOMER_ADDRESS_LATITUDE,
				    													   data.item(i).CUSTOMER_ADDRESS_LONGITUDE);
									    item.site = new Site(data.item(i).SITE_ID,
									    					 data.item(i).SITE_ADDRESS_ID,
									    					 data.item(i).CUSTOMER_ID,
									    					 data.item(i).SITE_NAME,
									    					 data.item(i).SITE_DESCRIPTION);
									    item.siteAddress = new Address(data.item(i).SITE_ADDRESS_ID,
									    							   data.item(i).SITE_ADDRESS_STREET,
									    							   data.item(i).SITE_ADDRESS_ZIP,
									    							   data.item(i).SITE_ADDRESS_CITY,
									    							   data.item(i).SITE_ADDRESS_STATE,
									    							   data.item(i).SITE_ADDRESS_COUNTRY,
									    							   data.item(i).SITE_ADDRESS_LATITUDE,
									    							   data.item(i).SITE_ADDRESS_LONGITUDE);
								        
//				        				alert(JSON.stringify(item));
								        thisWorkOrderCollection.add(key++, item);
									}
									thisWorkOrderCollection.fireEvent();
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
		var thisWorkOrderInfoCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisWorkOrderInfoCollection.objectId = new Object();
				thisWorkOrderInfoCollection.objectId = element;
				thisWorkOrderInfoCollection.objectId.addEventListener('WorkOrderInfoCollection', 'onWorkOrderInfoCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisWorkOrderInfoCollection.htmlElement = element;
				document.getElementById(thisWorkOrderInfoCollection.htmlElement).addEventListener("WorkOrderInfoCollection", onWorkOrderInfoCollection, false);
			}
		},
		fireEvent: function() {
//		alert('FireEvent');
		var thisWorkOrderInfoCollection = this;
			thisWorkOrderInfoCollection.WorkOrderInfoCollectionEvent.detail.count = thisWorkOrderInfoCollection.count;
			thisWorkOrderInfoCollection.WorkOrderInfoCollectionEvent.detail.items = thisWorkOrderInfoCollection.collection;
			if (thisWorkOrderInfoCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisWorkOrderInfoCollection.objectId.dispatchEvent(thisWorkOrderInfoCollection.WorkOrderInfoCollectionEvent);
			}
			if(thisWorkOrderInfoCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisWorkOrderInfoCollection.htmlElement).dispatchEvent(thisWorkOrderInfoCollection.WorkOrderInfoCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('WorkOrderInfoCollection.store()');
		var thisWorkOrderInfoCollection = this;
			localStorage.setItem('WorkOrderInfoCollection', JSON.stringify(thisWorkOrderInfoCollection));
		},
		restore: function() {
//		if(DEBUG) alert('WorkOrderInfoCollection.restore()');
		var thisWorkOrderInfoCollection = this;
		var item = JSON.parse(localStorage.getItem('WorkOrderInfoCollection'));	
			thisWorkOrderInfoCollection.count = item.count;
			thisWorkOrderInfoCollection.collection = item.collection;
			thisWorkOrderInfoCollection.htmlElement = item.htmlElement;
			thisWorkOrderInfoCollection.objectId = item.objectId;
			thisWorkOrderInfoCollection.WorkOrderInfoCollectionEvent = item.WorkOrderInfoCollectionEvent;
			thisWorkOrderInfoCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('WorkOrderInfoCollection.unstore()');
			localStorage.removeItem('WorkOrderInfoCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('WorkOrderInfoCollection.isStored()');
		var storage = localStorage.getItem('WorkOrderInfoCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return WorkOrderInfoCollection;
	
})();
