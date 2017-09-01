//////////////////////////////////////////////////
// Define Material Class
//////////////////////////////////////////////////

/** Material
 * This class encapsulates a Material.
 *
 */	
/**
 * @author Hell
 */
/**
 *  Material Class Definition 
 */
var Material = (function () {
	var Material = function (id, name, description, unit_price, picture_url) {
//		if(DEBUG) alert('Enter Material() Constructor...');
		this.id = id || -1;
		this.name = name || '';
		this.description = description || '';
		this.unit_price = unit_price || 0.00;
		this.picture_url = picture_url || ''; 
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			if(DEBUG) alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.MaterialEvent = new CustomEvent("Material", {
				detail: {
					id: 0,
					name: '',
					description: '',
				    unit_price: 0.00,
					picture_url: '',
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				if(DEBUG) alert('KitKat Device...');
				this.MaterialEvent = new CustomEvent("Material", {
					detail: {
						id: 0,
						name: '',
						description: '',
					    unit_price: 0.00,
						picture_url: '',
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				if(DEBUG) alert('NOT a KitKat Device...');
				this.MaterialEvent = document.createEvent("CustomEvent");
				this.MaterialEvent.initCustomEvent('Material', true, false, {id: 0,	name: '', description: '', unit_price: 0.00,  picture_url: '', time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Material Constructor...');
	};

	Material.prototype = {
		reset: function() {
//		if(DEBUG) alert('Material.reset()');
			var thisMaterial = this;
			thisMaterial.id = -1;
			thisMaterial.name = '';
			thisMaterial.description = '';
			thisMaterial.unit_price = 0.00;
			thisMaterial.picture_url = '';
		    thisMaterial.fireEvent();
		},
		create: function() {
//		if(DEBUG) alert('Material.create()');
			var thisMaterial = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/addMaterial";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"name": thisMaterial.name,
						   "description": thisMaterial.description,
						   "unit_price": thisMaterial.unit_price, 
						   "picture_url": thisMaterial.picture_url},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisMaterial.id = returnedId;
					    });
					    thisMaterial.fireEvent();
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
					tx.executeSql('INSERT INTO MATERIAL  ' +
								  '(MATERIAL_ID, NAME, DESCRIPTION, UNIT_PRICE, PICTURE_URL) ' +
								  'VALUES (?,?,?,?)',
								  [thisMaterial.name,
								   thisMaterial.description,
								   thisMaterial.unit_price, 
								   thisMaterial.picture_url],
							   	   function(tx, rs) {
										thisMaterial.id = rs.insertId;
										thisMaterial.fireEvent();
								   },
								   function() {
									   alert('Material INSERT Error');
								   });
				});
			}
		},
		update: function() {
//		if(DEBUG) alert('Material.update()');	
			var thisMaterial = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/saveMaterial";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"name": thisMaterial.name,
					   	   "description": thisMaterial.description,
						   "unit_price": thisMaterial.unit_price, 
					   	   "picture_url": thisMaterial.picture_url,
					   	   "material_id": thisMaterial.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisMaterial.fireEvent();
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
					tx.executeSql('UPDATE MATERIAL  ' +
								  'SET ' +
								  'NAME = ?,' +
								  'DESCRIPTION = ?,' +
								  'UNIT_PRICE = ?,' +
								  'PICTURE_URL = ? ' +
								  'WHERE MATERIAL_ID = ?',
								  [thisMaterial.name,
								   thisMaterial.description,
								   thisMaterial.unit_price, 
							   	   thisMaterial.picture_url,
								   thisMaterial.id],
							   	   function() {
										thisMaterial.fireEvent();
								   },
								   function() {
									   alert('Material UPDATE Error');
								   });
				});
			}
		},
		suppress: function() {
//		if(DEBUG) alert('Material.suppress()');
			var thisMaterial = this;

			if(LOCAL_DB==false) {
				var url = urlDataServices + "/deleteMaterial";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"material_id": thisMaterial.id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisMaterial.fireEvent();
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
					tx.executeSql('DELETE FROM MATERIAL WHERE MATERIAL_ID = ?', 
							      [thisMaterial.id], 
							      function() {
										thisMaterial.fireEvent();	
								  }, 
							      function() {
								  	  alert('Material DELETE Error');
								  });
				});
			}
		},
		select: function(id) {
//		if(DEBUG) alert('Material.select(' + id + ')');
		var thisMaterial = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getMaterial";
	
				$.ajax ({
					type: "GET",
					url: url,
					data: {"material_id": id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisMaterial.id = $this.find("MATERIAL_ID").text();
					        thisMaterial.name = $this.find("NAME").text();
					        thisMaterial.description = $this.find("DESCRIPTION").text();
					        thisMaterial.unit_price = $this.find("UNIT_PRICE").text();
					        thisMaterial.picture_url = $this.find("PICTURE_URL").text();
					    });
					    thisMaterial.fireEvent();
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
					tx.executeSql('SELECT MATERIAL_ID, NAME, DESCRIPTION, UNIT_PRICE, PICTURE_URL FROM MATERIAL WHERE MATERIAL_ID = ?',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        thisMaterial.id = data.item(i).MATERIAL_ID;
								        thisMaterial.name = data.item(i).NAME;
								        thisMaterial.description = data.item(i).DESCRIPTION;
								        thisMaterial.unit_price = data.item(i).UNIT_PRICE;
								        thisMaterial.picture_url = data.item(i).PICTURE_URL;
									}
									thisMaterial.fireEvent();
								  }, 
								  function() {
									  alert('Material SELECT Error');
								  });
				});
			}
		},
		show: function() {
		var thisMaterial = this;
			alert('Material Data:\n' +
				  'Id: ' + thisMaterial.id + '\n' +	
				  'Name: ' + thisMaterial.name + '\n' +	
				  'Description: ' + thisMaterial.description + '\n' + 
				  'Unit Price: ' + thisMaterial.unit_price + '\n' + 
				  'Picture URL: ' + thisMaterial.picture_url + '\n' + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		if(DEBUG) alert('Enter Material.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		if(DEBUG) alert('Enter Material.removeEventListener() ...');
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
//		if(DEBUG)alert('Executing Material.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		if(DEBUG) alert('Material.AssignEvent');
		var thisMaterial = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisMaterial.objectId = new Object();
				thisMaterial.objectId = element;
				thisMaterial.objectId.addEventListener('Material', 'onMaterial', false);
			}
			else {
//				alert('It is an HTML Element');
				thisMaterial.htmlElement = element;
				document.getElementById(thisMaterial.htmlElement).addEventListener("Material", onMaterial, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) alert('Material.FireEvent');
		var thisMaterial = this;
			thisMaterial.MaterialEvent.detail.id = thisMaterial.id;
			thisMaterial.MaterialEvent.detail.name = thisMaterial.name;
			thisMaterial.MaterialEvent.detail.description = thisMaterial.description;
			thisMaterial.MaterialEvent.detail.unit_price = thisMaterial.unit_price;
			thisMaterial.MaterialEvent.detail.picture_url = thisMaterial.picture_url;
			
			if (thisMaterial.objectId!=null){
//				alert('Event fired to an Object');
				thisMaterial.objectId.dispatchEvent(thisMaterial.MaterialEvent);
			}
			if(thisMaterial.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisMaterial.htmlElement).dispatchEvent(thisMaterial.MaterialEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('Material.store()');
			localStorage.setItem('Material', JSON.stringify(this));
		},
		restore: function() {
//		if(DEBUG) alert('Material.restore()');
		var thisMaterial = this;
		var item = JSON.parse(localStorage.getItem('Material'));	
			thisMaterial.id = item.id;
			thisMaterial.name = item.name;
			thisMaterial.description = item.description;
			thisMaterial.unit_price = item.unit_price;
			thisMaterial.picture_url = item.picture_url;
			thisMaterial.htmlElement = item.htmlElement;
			thisMaterial.objectId = item.objectId;
			thisMaterial.MaterialEvent = item.MaterialEvent;
			thisMaterial.fireEvent();
			
		},
		unstore: function() {
//		if(DEBUG) alert('Material.unstore()');
		var thisMaterial = this;
			localStorage.removeItem('Material');
		},
		isStored: function() {
//		if(DEBUG) alert('Material.isStored()');
		var thisMaterial = this;
		var storage = localStorage.getItem('Material');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return Material;
})();


var MaterialCollection = (function () {
	
	var MaterialCollection = function () {
//		if(DEBUG) alert('Enter MaterialCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			if(DEBUG) alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.MaterialCollectionEvent = new CustomEvent("MaterialCollection", {
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
				this.MaterialCollectionEvent = new CustomEvent("MaterialCollection", {
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
				this.MaterialCollectionEvent = document.createEvent("CustomEvent");
				this.MaterialCollectionEvent.initCustomEvent('MaterialCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
//		if(DEBUG) alert('Exit Constructor...');
	};

	MaterialCollection.prototype = {
		load: function() {
//		if(DEBUG) alert('load');
		var thisMaterialCollection = this;

			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getMaterials";
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
					        item = new Material($this.find("MATERIAL_ID").text(),
					        					$this.find("NAME").text(),
					        					$this.find("DESCRIPTION").text(),
					        					$this.find("UNIT_PRICE").text(),
					        					$this.find("PICTURE_URL").text());
	//				        alert(JSON.stringify(item));
					        thisMaterialCollection.add(key++, item);
					    });
					    thisMaterialCollection.fireEvent();
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
					tx.executeSql('SELECT MATERIAL_ID, NAME, DESCRIPTION, UNIT_PRICE, PICTURE_URL FROM MATERIAL ORDER BY NAME ASC',
						      [], 
						      function (tx, rs) {
							  	var data = rs.rows;
							  	var key = 0;
								for (var i=0; i<data.length; i++) {
							        var item = new Material(data.item(i).MATERIAL_ID,
							        					    data.item(i).NAME,
							        					    data.item(i).DESCRIPTION,
							        					    data.item(i).UNIT_PRICE,
							        					    data.item(i).PICTURE_URL);
//			        				alert(JSON.stringify(item));
							        thisMaterialCollection.add(key++, item);
								}
								thisMaterialCollection.fireEvent();
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
//		if(DEBUG) alert('itemById(' + id + ')');
			for (var idx=0; idx<this.count; idx++) {
				if(this.collection[idx].id==id) {
					return this.collection[idx];
				}
			}
			return undefined;
		},
		assignEvent: function(element) {
//		if(DEBUG) alert('AssignEvent');
		var thisMaterialCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisMaterialCollection.objectId = new Object();
				thisMaterialCollection.objectId = element;
				thisMaterialCollection.objectId.addEventListener('MaterialCollection', 'onMaterialCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisMaterialCollection.htmlElement = element;
				document.getElementById(thisMaterialCollection.htmlElement).addEventListener("MaterialCollection", onMaterialCollection, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) alert('FireEvent');
		var thisMaterialCollection = this;
			thisMaterialCollection.MaterialCollectionEvent.detail.count = thisMaterialCollection.count;
			thisMaterialCollection.MaterialCollectionEvent.detail.items = thisMaterialCollection.collection;
			if (thisMaterialCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisMaterialCollection.objectId.dispatchEvent(thisMaterialCollection.MaterialCollectionEvent);
			}
			if(thisMaterialCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisMaterialCollection.htmlElement).dispatchEvent(thisMaterialCollection.MaterialCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('MaterialCollection.store()');
		var thisMaterialCollection = this;
			localStorage.setItem('MaterialCollection', JSON.stringify(thisMaterialCollection));
		},
		restore: function() {
//		if(DEBUG) alert('MaterialCollection.restore()');
		var thisMaterialCollection = this;
		var item = JSON.parse(localStorage.getItem('MaterialCollection'));	
			thisMaterialCollection.count = item.count;
			thisMaterialCollection.collection = item.collection;
			thisMaterialCollection.htmlElement = item.htmlElement;
			thisMaterialCollection.objectId = item.objectId;
			thisMaterialCollection.MaterialCollectionEvent = item.MaterialCollectionEvent;
			thisMaterialCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('MaterialCollection.unstore()');
			localStorage.removeItem('MaterialCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('MaterialCollection.isStored()');
		var storage = localStorage.getItem('MaterialCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
		
	};
	return MaterialCollection;
	
})();
