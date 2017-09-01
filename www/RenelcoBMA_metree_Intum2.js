//////////////////////////////////////////////////
// Define Metree Class
//////////////////////////////////////////////////

/** Metree
 * This class encapsulates a Metree.
 *
 */	
/**
 * @author Hell
 */
/**
 *  Metree Class Definition 
 */
var Metree = (function () {
	var Metree = function (id, collaborator_id, task_id, name, etage, piece, comment, largeur_obturation, hauteur_obturation, profondeur, surface_obturation, aire_caisson, quantite, photo_before, photo_after, created, obturation) {
		if(DEBUG) alert('Enter Metree() Constructor...');
		this.id = id || -1;
		this.collaborator_id = collaborator_id || -1;
		this.task_id = task_id || -1;
		this.name = name || '';
		this.etage = etage || '';
		this.piece = piece || '';
		this.comment = comment || '';
		this.largeur_obturation = largeur_obturation || 0.00;
		this.hauteur_obturation = hauteur_obturation || 0.00;
		this.profondeur = profondeur || 0.00;
		this.surface_obturation = surface_obturation || 0.00;
		this.aire_caisson = aire_caisson || 0.00;
		this.quantite = quantite || 0.00;
		this.photo_before = photo_before || ''; 
		this.photo_after = photo_after || ''; 
		this.created = created ||  new Date();
		this.obturation = obturation || 0;
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.MetreeEvent = new CustomEvent("Metree", {
				detail: {
					id: 0,
					collaborator_id: 0,
					task_id: 0,
					name: '',
					etage: '',
					piece: '',
					comment: '',
					largeur_obturation: 0.00,
					hauteur_obturation: 0.00,
					profondeur: 0.00,
					surface_obturation: 0.00,
					aire_caisson: 0.00,
					quantite: 0.00,
					photo_before: '',
					photo_after: '',
					created: new Date(),
					obturation: 0,
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.MetreeEvent = new CustomEvent("Metree", {
					detail: {
						id: 0,
						collaborator_id: 0,
						task_id: 0,
						name: '',
						etage: '',
						piece: '',
						comment: '',
						largeur_obturation: 0.00,
						hauteur_obturation: 0.00,
						profondeur: 0.00,
						surface_obturation: 0.00,
						aire_caisson: 0.00,
						quantite: 0.00,
						photo_before: '',
						photo_after: '',
						created: new Date(),
						obturation: 0,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.MetreeEvent = document.createEvent("CustomEvent");
				this.MetreeEvent.initCustomEvent('Metree', true, false, {id: 0, collaborator_id: 0, task_id: 0, name: '', etage: '', piece: '', comment: '', largeur_obturation: 0.00, hauteur_obturation: 0.00, profondeur: 0.00, surface_obturation: 0.00, aire_caisson: 0.00, quantite: 0.00, photo_before: '', photo_after: '', created: new Date(), obturation: 0, time: new Date()});
			}
		}
//		if(DEBUG) alert('Exit Metree Constructor...');
	};

	Metree.prototype = {
		reset: function() {
//		if(DEBUG) alert('Metree.reset()');
			var thisMetree = this;
			thisMetree.id = -1;
			thisMetree.collaborator_id = -1;
			thisMetree.task_id = -1;
			thisMetree.name = '';
			thisMetree.etage = '';
			thisMetree.piece = '';
			thisMetree.comment = '';
			thisMetree.largeur_obturation = 0.00;
			thisMetree.hauteur_obturation = 0.00;
			thisMetree.profondeur = 0.00;
			thisMetree.surface_obturation = 0.00;
			thisMetree.aire_caisson = 0.00;
			thisMetree.quantite = 0.00;
			thisMetree.photo_before = '';
			thisMetree.photo_after = '';
			thisMetree.created = new Date();
			thisMetree.obturation = 0;
		    thisMetree.fireEvent();
		},
		create: function() {
		if(DEBUG) alert('Metree.create()');
		var thisMetree = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/addMetree";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"collaborator_id": thisMetree.collaborator_id,
						   "task_id": thisMetree.task_id,
						   "name": thisMetree.name,
						   "etage": thisMetree.etage,
						   "piece": thisMetree.piece,
						   "comment": thisMetree.comment,
						   "largeur_obturation": thisMetree.largeur_obturation,
						   "hauteur_obturation": thisMetree.hauteur_obturation,
						   "profondeur": thisMetree.profondeur,
						   "surface_obturation": thisMetree.surface_obturation,
						   "aire_caisson": thisMetree.aire_caisson,
						   "quantite": thisMetree.quantite,
						   "photo_before": thisMetree.photo_before,
						   "photo_after": thisMetree.photo_after,
						   "created": thisMetree.created,
						   "obturation":  thisMetree.obturation},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisMetree.id = returnedId;
					    });
					    thisMetree.fireEvent();
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
					tx.executeSql('INSERT INTO METREE  ' +
								  '(COLLABORATOR_ID, TASK_ID, NAME, ETAGE, PIECE, COMMENT, LARGEUR_OBTURATION, HAUTEUR_OBTURATION, PROFONDEUR, SURFACE_OBTURATION, AIRE_CAISSON, QUANTITE, PHOTO_BEFORE, PHOTO_AFTER, CREATED, OBTURATION) ' +
								  'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
								  [thisMetree.collaborator_id,
								   thisMetree.task_id,
								   thisMetree.name,
								   thisMetree.etage,
								   thisMetree.piece,
								   thisMetree.comment,
								   thisMetree.largeur_obturation,
								   thisMetree.hauteur_obturation,
								   thisMetree.profondeur,
								   thisMetree.surface_obturation,
								   thisMetree.aire_caisson,
								   thisMetree.quantite,
								   thisMetree.photo_before,
								   thisMetree.photo_after,
								   thisMetree.created,
								   thisMetree.obturation],
							   	   function(tx, rs) {
										thisMetree.id = rs.insertId;
										thisMetree.fireEvent();
								   },
								   function() {
									   alert('Metree INSERT Error');
								   });
				});
			}
		},
		update: function() {
		if(DEBUG) alert('Metree.update()');	
		var thisMetree = this;

			if(LOCAL_DB==false) {
				var url = urlDataServices + "/saveMetree";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"task_id": thisMetree.task_id,
						   "name": thisMetree.name,
						   "etage": thisMetree.etage,
						   "piece": thisMetree.piece,
						   "comment": thisMetree.comment,
						   "largeur_obturation": thisMetree.largeur_obturation,
						   "hauteur_obturation": thisMetree.hauteur_obturation,
						   "profondeur": thisMetree.profondeur,
						   "surface_obturation": thisMetree.surface_obturation,
						   "aire_caisson": thisMetree.aire_caisson,
						   "quantite": thisMetree.quantite,
						   "photo_before": thisMetree.photo_before,
						   "photo_after": thisMetree.photo_after,
						   "obturation": thisMetree.obturation,
						   "metree_id": thisMetree.id,
						   "collaborator_id": thisMetree.collaborator_id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisMetree.fireEvent();
					},
					error: function(xhr, status, error) {
						alert(JSON.stringify(xhr));
						alert('Something went wrong.\n' +
							  'Status: ' + status + '\n' +
							  'Error: ' + error + '\n');
					}
				});
			}
			else  {
				databaseManager.localDB.transaction(function(tx) {
							tx.executeSql('UPDATE METREE  ' +
										  'SET ' +
										  'TASK_ID = ?,' +
										  'NAME = ?,' +
										  'ETAGE = ?,' +
										  'PIECE = ?,' +
										  'COMMENT = ?,' +
										  'LARGEUR_OBTURATION = ?,' +
										  'HAUTEUR_OBTURATION = ?,' +
										  'PROFONDEUR = ?,' +
										  'SURFACE_OBTURATION = ?,' +
										  'AIRE_CAISSON = ?,' +
										  'QUANTITE = ?,' +
										  'PHOTO_BEFORE = ?,' +
										  'PHOTO_AFTER = ?,' +
										  'OBTURATION = ? ' +
										  'WHERE METREE_ID = ? ' + 
										  ' AND COLLABORATOR_ID = ?',
								  [thisMetree.task_id,
								   thisMetree.name,
								   thisMetree.etage,
								   thisMetree.piece,
								   thisMetree.comment,
								   thisMetree.largeur_obturation,
								   thisMetree.hauteur_obturation,
								   thisMetree.profondeur,
								   thisMetree.surface_obturation,
								   thisMetree.aire_caisson,
								   thisMetree.quantite,
								   thisMetree.photo_before,
								   thisMetree.photo_after,
								   thisMetree.obturation,
								   thisMetree.id,
								   thisMetree.collaborator_id],
							   	   function() {
										thisMetree.fireEvent();
								   },
								   function() {
									   alert('Metree UPDATE Error');
								   });
				});
			}
		},
		suppress: function() {
//		if(DEBUG) alert('Metree.suppress()');
		var thisMetree = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/deleteMetree";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"metree_id": thisMetree.id,
						   "collaborator_id": thisMetree.collaborator_id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisMetree.fireEvent();
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
					tx.executeSql('DELETE FROM METREE WHERE METREE_ID = ? AND COLLABORATOR_ID = ?', 
							      [thisMetree.id,
							       thisMetree.collaborator_id], 
							      function() {
										thisMetree.fireEvent();	
								  }, 
							      function() {
								  	  alert('Metree DELETE Error');
								  });
				});
			}
		},
		select: function(id) {
//		if(DEBUG) alert('Metree.select(' + id + ')');
		var thisMetree = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getMetree";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"metree_id": thisMetree.id,
						   "collaborator_id": thisMetree.collaborator_id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisMetree.id = $this.find("METREE_ID").text();
					        thisMetree.collaborator_id = $this.find("COLLABORATOR_ID").text();
					        thisMetree.task_id = $this.find("TASK_ID").text();
					        thisMetree.name = $this.find("NAME").text();
					        thisMetree.etage = $this.find("ETAGE").text();
					        thisMetree.etage = $this.find("PIECE").text();
					        thisMetree.comment = $this.find("COMMENT").text();
					        thisMetree.largeur_obturation = $this.find("LARGEUR_OBTURATION").text();
					        thisMetree.hauteur_obturation = $this.find("HAUTEUR_OBTURATION").text();
					        thisMetree.profondeur = $this.find("PROFONDEUR").text();
					        thisMetree.surface_obturation = $this.find("SURFACE_OBTURATION").text();
					        thisMetree.aire_caisson = $this.find("AIRE_CAISSON").text();
					        thisMetree.quantite = $this.find("QUANTITE").text();
					        thisMetree.photo_before = $this.find("PHOTO_BEFORE").text();
					        thisMetree.photo_after = $this.find("PHOTO_AFTER").text();
					        thisMetree.created = $this.find("CREATED").text();
					        thisMetree.obturation = $this.find("OBTURATION").text();
					    });
					    thisMetree.fireEvent();
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
					tx.executeSql('SELECT METREE_ID, COLLABORATOR_ID, TASK_ID, NAME, ETAGE, PIECE, COMMENT, LARGEUR_OBTURATION, HAUTEUR_OBTURATION, PROFONDEUR, SURFACE_OBTURATION, AIRE_CAISSON, QUANTITE, PHOTO_BEFORE, PHOTO_AFTER, CREATED, OBTURATION  FROM METREE WHERE METREE_ID = ?',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        thisMetree.id = data.item(i).METREE_ID;
								        thisMetree.collaborator_id = data.item(i).COLLABORATOR_ID;
								        thisMetree.task_id = data.item(i).TASK_ID;
								        thisMetree.name = data.item(i).NAME;
								        thisMetree.etage = data.item(i).ETAGE;
								        thisMetree.etage = data.item(i).PIECE;
								        thisMetree.comment = data.item(i).COMMENT;
								        thisMetree.largeur_obturation = data.item(i).LARGEUR_OBTURATION;
								        thisMetree.hauteur_obturation = data.item(i).HAUTEUR_OBTURATION;
								        thisMetree.profondeur = data.item(i).PROFONDEUR;
								        thisMetree.surface_obturation = data.item(i).SURFACE_OBTURATION;
								        thisMetree.aire_caisson = data.item(i).AIRE_CAISSON;
								        thisMetree.quantite = data.item(i).QUANTITE;
								        thisMetree.photo_before = data.item(i).PHOTO_BEFORE;
								        thisMetree.photo_after = data.item(i).PHOTO_AFTER;
								        thisMetree.created = data.item(i).CREATED;
								        thisMetree.obturation = data.item(i).OBTURATION;
									}
									thisMetree.fireEvent();
								  }, 
								  function() {
									  alert('Metree SELECT Error');
								  });
				});
			}
		},
		
		selectByTask: function(taskId) {
//			if(DEBUG) alert('Metree.select(' + id + ')');
			var thisMetree = this;
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getTaskMetrees";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"task_id": taskId,
						   "collaborator_id": thisMetree.collaborator_id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisMetree.id = $this.find("METREE_ID").text();
					        thisMetree.collaborator_id = $this.find("COLLABORATOR_ID").text();
					        thisMetree.task_id = $this.find("TASK_ID").text();
					        thisMetree.name = $this.find("NAME").text();
					        thisMetree.etage = $this.find("ETAGE").text();
					        thisMetree.piece = $this.find("PIECE").text();
					        thisMetree.comment = $this.find("COMMENT").text();
					        thisMetree.largeur_obturation = $this.find("LARGEUR_OBTURATION").text();
					        thisMetree.hauteur_obturation = $this.find("HAUTEUR_OBTURATION").text();
					        thisMetree.profondeur = $this.find("PROFONDEUR").text();
					        thisMetree.surface_obturation = $this.find("SURFACE_OBTURATION").text();
					        thisMetree.aire_caisson = $this.find("AIRE_CAISSON").text();
					        thisMetree.quantite = $this.find("QUANTITE").text();
					        thisMetree.photo_before = $this.find("PHOTO_BEFORE").text();
					        thisMetree.photo_after = $this.find("PHOTO_AFTER").text();
					        thisMetree.created = $this.find("CREATED").text();
					        thisMetree.obturation = $this.find("OBTURATION").text();
					    });
					    thisMetree.fireEvent();
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
					tx.executeSql('SELECT METREE_ID, COLLABORATOR_ID, TASK_ID, NAME, ETAGE, PIECE, COMMENT, LARGEUR_OBTURATION, HAUTEUR_OBTURATION, PROFONDEUR, SURFACE_OBTURATION, AIRE_CAISSON, QUANTITE, PHOTO_BEFORE, PHOTO_AFTER, CREATED, OBTURATION  FROM METREE WHERE TASK_ID = ?',
							      [taskId], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        thisMetree.id = data.item(i).METREE_ID;
								        thisMetree.collaborator_id = data.item(i).COLLABORATOR_ID;
								        thisMetree.task_id = data.item(i).TASK_ID;
								        thisMetree.name = data.item(i).NAME;
								        thisMetree.etage = data.item(i).ETAGE;
								        thisMetree.etage = data.item(i).PIECE;
								        thisMetree.comment = data.item(i).COMMENT;
								        thisMetree.largeur_obturation = data.item(i).LARGEUR_OBTURATION;
								        thisMetree.hauteur_obturation = data.item(i).HAUTEUR_OBTURATION;
								        thisMetree.profondeur = data.item(i).PROFONDEUR;
								        thisMetree.surface_obturation = data.item(i).SURFACE_OBTURATION;
								        thisMetree.aire_caisson = data.item(i).AIRE_CAISSON;
								        thisMetree.quantite = data.item(i).QUANTITE;
								        thisMetree.photo_before = data.item(i).PHOTO_BEFORE;
								        thisMetree.photo_after = data.item(i).PHOTO_AFTER;
								        thisMetree.created = data.item(i).CREATED;
								        thisMetree.obturation = data.item(i).OBTURATION;
									}
									thisMetree.fireEvent();
								  }, 
								  function() {
									  alert('Metree SELECT Error');
								  });
				});
			}
		},
		show: function() {
			var thisMetree = this;
			alert('Metree Data:\n' +
				  'Collaborator ID: ' + thisMetree.collaborator_id + '\n' +	
				  'Task ID: ' + thisMetree.task_id + '\n' +
				  'Bâtiment: ' + thisMetree.name + '\n' +
				  'Étage: ' + thisMetree.etage + '\n' +
				  'Pièce: ' + thisMetree.piece + '\n' +
				  'Comment: ' + thisMetree.comment + '\n' +
				  'Largeur Obturation [m]: ' + thisMetree.largeur_obturation + '\n' +
				  'Hauteur Obturation [m]: ' + thisMetree.hauteur_obturation + '\n' +
				  'Profondeur [m]: ' + thisMetree.profondeur + '\n' +
				  'Surface Obturation [m²]: ' + thisMetree.surface_obturation + '\n' +
				  'Aire Caisson [m²]: ' + thisMetree.aire_caisson + '\n' +
				  'Quantité: ' + thisMetree.quantite + '\n' +
				  'Url Photo Before: ' +  thisMetree.photo_before + '\n' +
				  'Url Photo After: ' + thisMetree.photo_after + '\n' + 
				  'Created: ' + thisMetree.created + '\n' + 
				  'Obturation: ' + ((thisMetree.obturation==0) ? 'no' : 'yes') + '\n' + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		if(DEBUG) alert('Enter Metree.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		if(DEBUG) alert('Enter Metree.removeEventListener() ...');
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
//		if(DEBUG) alert('Executing Metree.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
		if(DEBUG) alert('Metree.AssignEvent()');
		var thisMetree = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisMetree.objectId = new Object();
				thisMetree.objectId = element;
				thisMetree.objectId.addEventListener('Metree', 'onMetree', false);
			}
			else {
//				alert('It is an HTML Element');
				thisMetree.htmlElement = element;
				document.getElementById(thisMetree.htmlElement).addEventListener("Metree", onMetree, false);
			}
		},
		fireEvent: function() {
		if(DEBUG) alert('Metree.FireEvent');
		var thisMetree = this;
			thisMetree.MetreeEvent.detail.id = thisMetree.id;
			thisMetree.MetreeEvent.detail.collaborator_id = thisMetree.collaborator_id;
			thisMetree.MetreeEvent.detail.task_id = thisMetree.task_id;
			thisMetree.MetreeEvent.detail.name = thisMetree.name;
			thisMetree.MetreeEvent.detail.etage = thisMetree.etage;
			thisMetree.MetreeEvent.detail.piece = thisMetree.piece;
			thisMetree.MetreeEvent.detail.comment = thisMetree.comment;
			thisMetree.MetreeEvent.detail.largeur_obturation = thisMetree.largeur_obturation;
			thisMetree.MetreeEvent.detail.hauteur_obturation = thisMetree.hauteur_obturation;
			thisMetree.MetreeEvent.detail.profondeur = thisMetree.profondeur;
			thisMetree.MetreeEvent.detail.surface_obturation = thisMetree.surface_obturation;
			thisMetree.MetreeEvent.detail.aire_caisson = thisMetree.aire_caisson;
			thisMetree.MetreeEvent.detail.quantite = thisMetree.quantite;
			thisMetree.MetreeEvent.detail.photo_before = thisMetree.photo_before;
			thisMetree.MetreeEvent.detail.photo_after = thisMetree.photo_after;
			thisMetree.MetreeEvent.detail.created = thisMetree.created;
			thisMetree.MetreeEvent.detail.obturation = thisMetree.obturation;
			if (thisMetree.objectId!=null){
//				alert('Event fired to an Object');
				thisMetree.objectId.dispatchEvent(thisMetree.MetreeEvent);
			}
			if(thisMetree.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisMetree.htmlElement).dispatchEvent(thisMetree.MetreeEvent);
			}
		},
		store: function() {
//		alert('Metree.store()');
			localStorage.setItem('Metree', JSON.stringify(this));
		},
		restore: function() {
//		alert('Metree.restore()');
		var thisMetree = this;
		var item = JSON.parse(localStorage.getItem('Metree'));	
			thisMetree.id = item.id;
		},
		remove: function() {
		alert('Metree.remove()');
		var thisMetree = this;
			localStorage.removeItem('Metree');
		},
		isStored: function() {
//		alert('Metree.isStored()');
		var thisMetree = this;
		var storage = localStorage.getItem('Metree');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return Metree;
})();


var MetreeCollection = (function () {
	
	var MetreeCollection = function () {
//		if(DEBUG) alert('Enter MetreeCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.MetreeCollectionEvent = new CustomEvent("MetreeCollection", {
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
				this.MetreeCollectionEvent = new CustomEvent("MetreeCollection", {
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
				this.MetreeCollectionEvent = document.createEvent("CustomEvent");
				this.MetreeCollectionEvent.initCustomEvent('MetreeCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
//		if(DEBUG) alert('Exit MetreeCollection Constructor...');
	};

	MetreeCollection.prototype = {
		load: function() {
//		alert('load');
		var thisMetreeCollection = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getMetrees";
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
					        item = new Metree($this.find("METREE_ID").text(),
					        				  $this.find("COLLABORATOR_ID").text(),
					        				  $this.find("TASK_ID").text(), 
					        				  $this.find("NAME").text(), 
					        				  $this.find("ETAGE").text(), 
					        				  $this.find("PIECE").text(), 
					        				  $this.find("COMMENT").text(), 
					        				  $this.find("LARGEUR_OBTURATION").text(),
					        				  $this.find("HAUTEUR_OBTURATION").text(),
					        				  $this.find("PROFONDEUR").text(),
					        				  $this.find("SURFACE_OBTURATION").text(),
					        				  $this.find("AIRE_CAISSON").text(),
					        				  $this.find("QUANTITE").text(),
					        				  $this.find("PHOTO_BEFORE").text(),
					        				  $this.find("PHOTO_AFTER").text(),
					        				  $this.find("CREATED").text(),
					        				  $this.find("OBTURATION").text());
		//			        alert(JSON.stringify(item));
					        thisMetreeCollection.add(key++, item);
					    });
					    thisMetreeCollection.fireEvent();
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
					tx.executeSql('SELECT METREE_ID, COLLABORATOR_ID, TASK_ID, NAME, ETAGE, PIECE, COMMENT, LARGEUR_OBTURATION, HAUTEUR_OBTURATION, PROFONDEUR, SURFACE_OBTURATION, AIRE_CAISSON, QUANTITE, PHOTO_BEFORE, PHOTO_AFTER, CREATED, OBTURATION  FROM METREE',
						      [], 
						      function (tx, rs) {
							  	var data = rs.rows;
							  	var key = 0;
								for (var i=0; i<data.length; i++) {
							        var item = new Metree(data.item(i).METREE_ID,
							        					  data.item(i).COLLABORATOR_ID,
							        					  data.item(i).TASK_ID,
							        					  data.item(i).NAME,
							        					  data.item(i).ETAGE,
							        					  data.item(i).PIECE,
							        					  data.item(i).COMMENT,
							        					  data.item(i).LARGEUR_OBTURATION,
							        					  data.item(i).HAUTEUR_OBTURATION,
							        					  data.item(i).PROFONDEUR,
							        					  data.item(i).SURFACE_OBTURATION,
							        					  data.item(i).AIRE_CAISSON,
							        					  data.item(i).QUANTITE,
							        					  data.item(i).PHOTO_BEFORE,
							        					  data.item(i).PHOTO_AFTER,
							        					  data.item(i).CREATED,
							        					  data.item(i).OBTURATION);
//					        				alert(JSON.stringify(item));
							        thisMetreeCollection.add(key++, item);
								}
								thisMetreeCollection.fireEvent();
							  }, 
							  null);
				});
			}
		},
		loadByTask: function(taskId, collaboratorId) {
//		alert('loadByTask');
		var thisMetreeCollection = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getTaskMetrees";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"task_id": taskId,
						   "collaborator_id": collaboratorId},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var key = 0;
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        item = new Metree($this.find("METREE_ID").text(),
					        				  $this.find("COLLABORATOR_ID").text(),	
					        				  $this.find("TASK_ID").text(), 
					        				  $this.find("NAME").text(), 
					        				  $this.find("ETAGE").text(), 
					        				  $this.find("PIECE").text(), 
					        				  $this.find("COMMENT").text(), 
					        				  $this.find("LARGEUR_OBTURATION").text(),
					        				  $this.find("HAUTEUR_OBTURATION").text(),
					        				  $this.find("PROFONDEUR").text(),
					        				  $this.find("SURFACE_OBTURATION").text(),
					        				  $this.find("AIRE_CAISSON").text(),
					        				  $this.find("QUANTITE").text(),
					        				  $this.find("PHOTO_BEFORE").text(),
					        				  $this.find("PHOTO_AFTER").text(),
					        				  $this.find("CREATED").text(),
					        				  $this.find("OBTURATION").text());
		//			        alert(JSON.stringify(item));
					        thisMetreeCollection.add(key++, item);
					    });
					    thisMetreeCollection.fireEvent();
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
					tx.executeSql('SELECT METREE_ID, COLLABORATOR_ID, TASK_ID, NAME, ETAGE, PIECE, COMMENT, LARGEUR_OBTURATION, HAUTEUR_OBTURATION, PROFONDEUR, SURFACE_OBTURATION, AIRE_CAISSON, QUANTITE, PHOTO_BEFORE, PHOTO_AFTER, CREATED, OBTURATION  FROM METREE WHERE TASK_ID = ?',
						      [taskId], 
						      function (tx, rs) {
							  	var data = rs.rows;
							  	var key = 0;
								for (var i=0; i<data.length; i++) {
							        var item = new Metree(data.item(i).METREE_ID,
							        		              data.item(i).COLLABORATOR_ID,
							        					  data.item(i).TASK_ID,
							        					  data.item(i).NAME,
							        					  data.item(i).ETAGE,
							        					  data.item(i).PIECE,
							        					  data.item(i).COMMENT,
							        					  data.item(i).LARGEUR_OBTURATION,
							        					  data.item(i).HAUTEUR_OBTURATION,
							        					  data.item(i).PROFONDEUR,
							        					  data.item(i).SURFACE_OBTURATION,
							        					  data.item(i).AIRE_CAISSON,
							        					  data.item(i).QUANTITE,
							        					  data.item(i).PHOTO_BEFORE,
							        					  data.item(i).PHOTO_AFTER,
							        					  data.item(i).CREATED,
							        					  data.item(i).OBTURATION);
//			        				alert(JSON.stringify(item));
							        thisMetreeCollection.add(key++, item);
								}
								thisMetreeCollection.fireEvent();
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
		addItem:  function(item) {
			if(this.collection[this.count]==undefined) {
				this.collection[this.count]=item;
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
		empty: function() {
			for (var item in this.collection) {
				delete this.collection[item];
			}
			this.count = 0;
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
//		if(DEBUG) alert('AssignEvent');
		var thisMetreeCollection = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisMetreeCollection.objectId = new Object();
				thisMetreeCollection.objectId = element;
				thisMetreeCollection.objectId.addEventListener('MetreeCollection', 'onMetreeCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisMetreeCollection.htmlElement = element;
				document.getElementById(thisMetreeCollection.htmlElement).addEventListener("MetreeCollection", onMetreeCollection, false);
			}
		},
		fireEvent: function() {
//		alert('FireEvent');
		var thisMetreeCollection = this;
			thisMetreeCollection.MetreeCollectionEvent.detail.count = thisMetreeCollection.count;
			thisMetreeCollection.MetreeCollectionEvent.detail.items = thisMetreeCollection.collection;
			if (thisMetreeCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisMetreeCollection.objectId.dispatchEvent(thisMetreeCollection.MetreeCollectionEvent);
			}
			if(thisMetreeCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisMetreeCollection.htmlElement).dispatchEvent(thisMetreeCollection.MetreeCollectionEvent);
			}
		}
		
	};
	return MetreeCollection;
	
})();
