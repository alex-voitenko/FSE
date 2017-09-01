//////////////////////////////////////////////////
// Define Collaborator Class
//////////////////////////////////////////////////

/** Collaborator
 * This class encapsulates a Collaborator.
 *
 */	
/**
 * @author Hell
 */
/**
 *  Collaborator Class Definition 
 */
var Collaborator = (function () {
	var Collaborator = function (id, gender_id, manager_id, address_id, collaborator_type_id, lastname, firstname, email, password, mobilenr, imei, imei_s, uuid, picture_url, admin) {
	if(DEBUG) alert('Enter Collaborator() Constructor...');
		this.id = id || -1;
		this.gender_id = gender_id || -1;
		this.manager_id = manager_id || -1;
		this.address_id = address_id || -1;
		this.collaborator_type_id = collaborator_type_id || -1;
		this.lastname = lastname || '';
		this.firstname = firstname || '';
		this.email =  email || '';
		this.password =  password || '';
		this.mobilenr =  mobilenr || '';
		this.imei =  imei || '';
		this.imei_s =  imei_s || '';
		this.uuid =  uuid || '';
		this.picture_url =  picture_url || '';
		this.admin = false || admin;
		this.status = this.COLLABORATOR_STATUS.Undefined;
		this.selfObjectId = this;	// Self-assigned, used for Login internal Event Handling
		this.selfObjectId.addEventListener('Collaborator', 'onCollaborator', false);
		this.htmlElement = null;
		this.objectId = null;
		this.logIn = new Object();
		if(deviceInfo===undefined) {
		if(DEBUG) alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.CollaboratorEvent = new CustomEvent("Collaborator", {
				detail: {
					action: '',
					id: 0,
					gender_id: 0,
					manager_id: 0,
					address_id: 0,
					collaborator_type_id: 0,
					lastname: '',
					firstname: '',
					email: '',
					password: '',
					mobilenr: '',
					imei: '',
					imei_s: '',
					uuid: '',
					picture_url: '',
					admin: false,
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
			if(DEBUG) alert('KitKat Device...');
				this.CollaboratorEvent = new CustomEvent("Collaborator", {
					detail: {
						action: '',
						id: 0,
						gender_id: 0,
						manager_id: 0,
						address_id: 0,
						collaborator_type_id: 0,
						lastname: '',
						firstname: '',
						email: '',
						password: '',
						mobilenr: '',
						imei: '',
						imei_s: '',
						uuid: '',
						picture_url: '',
						admin: false,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
			if(DEBUG) alert('NOT a KitKat Device...');
				this.CollaboratorEvent = document.createEvent("CustomEvent");
				this.CollaboratorEvent.initCustomEvent('Collaborator', true, false, {action: '', id: 0, gender_id: 0, manager_id: 0, address_id: 0, collaborator_type_id: 0, lastname: '', firstname: '', email: '', password: '', mobilenr: '', imei: '', imei_s: '', uuid: '', picture_url: '', admin: false, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Collaborator() Constructor...');
	};

	Collaborator.prototype = {
	    COLLABORATOR_STATUS: {Undefined: 'Undefined', Login: 'Login', Set: 'Set' },
		reset: function() {
		if(DEBUG) alert('Collaborator.reset()');
		var thisCollaborator = this;
			thisCollaborator.id = -1;
			thisCollaborator.gender_id = -1;
			thisCollaborator.manager_id = -1;
			thisCollaborator.address_id = -1;
			thisCollaborator.collaborator_type_id = -1;
			thisCollaborator.lastname = '';
			thisCollaborator.firstname = '';
			thisCollaborator.email = '';
			thisCollaborator.password = '';
			thisCollaborator.mobilenr = '';
			thisCollaborator.imei = '';
			thisCollaborator.imei_s = '';
			thisCollaborator.uuid = '';
			thisCollaborator.picture_url = '';
			thisCollaborator.admin = false;
//			thisCollaborator.CollaboratorEvent.detail.action = 'RESET';
//		    thisCollaborator.fireEvent();
		},
		create: function() {
		if(DEBUG) alert('Collaborator.create()');
			var thisCollaborator = this;
			if(LOCAL_DB==false || databaseManager==undefined) {
				var url = urlDataServices + "/addCollaborator";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"gender_id": thisCollaborator.gender_id, 
					       "manager_id": thisCollaborator.manager_id, 
					       "address_id": thisCollaborator.address_id,
					       "collaborator_type_id": thisCollaborator.collaborator_type_id, 
					       "lastname": thisCollaborator.lastname, 
					       "firstname": thisCollaborator.firstname,
					       "email": thisCollaborator.email, 
					       "password": thisCollaborator.password, 
					       "mobilenr": thisCollaborator.mobilenr, 
					       "imei": thisCollaborator.imei, 
					       "imei_s": thisCollaborator.imei_s, 
					       "uuid": thisCollaborator.uuid, 
					       "picture_url": thisCollaborator.picture_url,
					       "app_admin": thisCollaborator.admin},
					datatype: "xml",
					timeout: 600000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisCollaborator.id = returnedId;
					    });
						thisCollaborator.CollaboratorEvent.detail.action = 'INSERT';
					    thisCollaborator.fireEvent();
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
					tx.executeSql('INSERT INTO COLLABORATOR  ' +
							      '(GENDER_ID, MANAGER_ID, ADDRESS_ID, COLLABORATOR_TYPE_ID, LASTNAME, FIRSTNAME, EMAIL, PASSWORD, MOBILENR, IMEI, IMEI_S, UUID, PICTURE_URL) ' +
							      'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
								  [thisCollaborator.gender_id, 
							       thisCollaborator.manager_id, 
							       thisCollaborator.address_id,
							       thisCollaborator.collaborator_type_id, 
							       thisCollaborator.lastname, 
							       thisCollaborator.firstname,
							       thisCollaborator.email, 
							       thisCollaborator.password, 
							       thisCollaborator.mobilenr, 
							       thisCollaborator.imei, 
							       thisCollaborator.imei_s, 
							       thisCollaborator.uuid, 
							       thisCollaborator.picture_url],
							   	   function(tx, rs) {
										thisCollaborator.id = rs.insertId;
										thisCollaborator.CollaboratorEvent.detail.action = 'INSERT';
										thisCollaborator.fireEvent();
								   },
								   function() {
									   alert('Collaborator INSERT Error');
								   });
				});
			}
		},
		update: function() {
		if(DEBUG) alert('Collaborator.update()');	
		var thisCollaborator = this;
		
			if(LOCAL_DB==false || databaseManager==undefined) {
				var url = urlDataServices + "/saveCollaborator";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"gender_id": thisCollaborator.gender_id, 
					       "manager_id": thisCollaborator.manager_id, 
					       "address_id": thisCollaborator.address_id,
					       "collaborator_type_id": thisCollaborator.collaborator_type_id, 
					       "lastname": thisCollaborator.lastname, 
					       "firstname": thisCollaborator.firstname, 
					       "email": thisCollaborator.email, 
					       "password": thisCollaborator.password, 
					       "mobilenr": thisCollaborator.mobilenr, 
					       "imei": thisCollaborator.imei, 
					       "imei_s": thisCollaborator.imei_s, 
					       "uuid": thisCollaborator.uuid, 
					       "picture_url": thisCollaborator.picture_url,
					       "app_admin": thisCollaborator.admin,
					       "collaborator_id": thisCollaborator.id},
					datatype: "xml",
					timeout: 600000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
						thisCollaborator.CollaboratorEvent.detail.action = 'UPDATE';
					    thisCollaborator.fireEvent();
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
					tx.executeSql('UPDATE COLLABORATOR  ' +
								  'SET ' +
								  'GENDER_ID = ?,' +
								  'MANAGER_ID = ?,' +
								  'ADDRESS_ID = ?,' +
								  'COLLABORATOR_TYPE_ID = ?,' +
								  'LASTNAME = ?,' +
								  'FIRSTNAME = ?,' +
								  'EMAIL = ?,' +
								  'PASSWORD = ?,' +
								  'MOBILENR = ?,' +
								  'IMEI = ?,' +
								  'IMEI_S = ?,' +
								  'UUID = ?,' +
								  'PICTURE_URL = ? ' +
								  'WHERE COLLABORATOR_ID = ?',
								  [thisCollaborator.gender_id, 
							       thisCollaborator.manager_id, 
							       thisCollaborator.address_id,
							       thisCollaborator.collaborator_type_id, 
							       thisCollaborator.lastname, 
							       thisCollaborator.firstname, 
							       thisCollaborator.email, 
							       thisCollaborator.password, 
							       thisCollaborator.mobilenr, 
							       thisCollaborator.imei, 
							       thisCollaborator.imei_s, 
							       thisCollaborator.uuid, 
							       thisCollaborator.picture_url, 
							       thisCollaborator.id],
							   	   function() {
										thisCollaborator.CollaboratorEvent.detail.action = 'UPDATE';
										thisCollaborator.fireEvent();
								   },
								   function() {
									   alert('Collaborator UPDATE Error');
								   });
				});
			}
		},
		suppress: function() {
		if(DEBUG) alert('Collaborator.suppress()');
			var thisCollaborator = this;
			
			if(LOCAL_DB==false || databaseManager==undefined) {
				var url = urlDataServices + "/deleteCollaborator";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"collaborator_id": thisCollaborator.id},
					datatype: "xml",
					timeout: 600000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
						thisCollaborator.CollaboratorEvent.detail.action = 'DELETE';
					    thisCollaborator.fireEvent();
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
					tx.executeSql('DELETE FROM COLLABORATOR WHERE COLLABORATOR_ID = ?', 
							      [thisCollaborator.id], 
							      function() {
										thisCollaborator.CollaboratorEvent.detail.action = 'DELETE';
										thisCollaborator.fireEvent();
								  },
								  function() {
									  alert('Collaborator DELETE Error');
								  });
				});
			}
		},
		select: function(id) {
		if(DEBUG) alert('Collaborator.select(' + id + ')');
		var thisCollaborator = this;

			if(LOCAL_DB==false || databaseManager==undefined) {
				var url = urlDataServices + "/getCollaborator";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"collaborator_id": id},
					datatype: "xml",
					timeout: 600000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
							thisCollaborator.id = $this.find("COLLABORATOR_ID").text();
							thisCollaborator.geolocation_id = $this.find("GENDER_ID").text();
							thisCollaborator.manager_id = $this.find("MANAGER_ID").text();
							thisCollaborator.address_id = $this.find("ADDRESS_ID").text();
							thisCollaborator.collaborator_type_id = $this.find("COLLABORATOR_TYPE_ID").text();
							thisCollaborator.lastname = $this.find("LASTNAME").text();
							thisCollaborator.firstname = $this.find("FIRSTNAME").text();
							thisCollaborator.email = $this.find("EMAIL").text();
							thisCollaborator.password = $this.find("PASSWORD").text();
							thisCollaborator.mobilenr = $this.find("MOBILENR").text();
							thisCollaborator.imei = $this.find("IMEI").text();
							thisCollaborator.imei_s = $this.find("IMEI_S").text();
							thisCollaborator.uuid = $this.find("UUID").text();
							thisCollaborator.picture_url = $this.find("PICTURE_URL").text();
							thisCollaborator.admin = $this.find("APP_ADMIN").text();
					    });
						thisCollaborator.CollaboratorEvent.detail.action = 'SELECT';
					    thisCollaborator.fireEvent();
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
					tx.executeSql('SELECT COLLABORATOR_ID, GENDER_ID, MANAGER_ID, ADDRESS_ID, COLLABORATOR_TYPE_ID, LASTNAME, FIRSTNAME, EMAIL, PASSWORD, MOBILENR, IMEI, IMEI_S, UUID, PICTURE_URL FROM COLLABORATOR WHERE COLLABORATOR_ID = ?',
							      [id], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
										thisCollaborator.id = data.item(i).COLLABORATOR_ID;
										thisCollaborator.geolocation_id = data.item(i).GENDER_ID;
										thisCollaborator.manager_id = data.item(i).MANAGER_ID;
										thisCollaborator.address_id = data.item(i).ADDRESS_ID;
										thisCollaborator.collaborator_type_id = data.item(i).COLLABORATOR_TYPE_ID;
										thisCollaborator.lastname = data.item(i).LASTNAME;
										thisCollaborator.firstname = data.item(i).FIRSTNAME;
										thisCollaborator.email = data.item(i).EMAIL;
										thisCollaborator.password = data.item(i).PASSWORD;
										thisCollaborator.mobilenr = data.item(i).MOBILENR;
										thisCollaborator.imei = data.item(i).IMEI;
										thisCollaborator.imei_s = data.item(i).IMEI_S;
										thisCollaborator.uuid = data.item(i).UUID;
										thisCollaborator.picture_url = data.item(i).PICTURE_URL;
									}
									thisCollaborator.CollaboratorEvent.detail.action = 'SELECT';
									thisCollaborator.fireEvent();
								  }, 
								  function(error) {
									  alert('Collaborator SELECT Error');
								  });
				});
			}
		},
		isAdmin: function() {
		if(DEBUG) alert('Collaborator.isAdmin()');
		var thisCollaborator = this;
			return thisCollaborator.admin;
		},
		login: function(email, password) {
		if(DEBUG) alert('Collaborator.login(' + email + ', ' + password + ')');
			var thisCollaborator = this;
			phoneui.showActivityDialog('Authenticating ...');
			localStorage.setItem('Username', email);
			thisCollaborator.status = thisCollaborator.COLLABORATOR_STATUS.Login;
			thisCollaborator.logIn = new Login(email, password);
			thisCollaborator.logIn.assignEvent(thisCollaborator);
			thisCollaborator.logIn.login();
			
			/* 
			 * The following block of code is a special crap for Intum 
			 * that will be implemented later... 
			 *
			if((localStorage.getItem('Username')==null) && (localStorage.getItem('Password')==null)) {
				localStorage.setItem('Username', email);
				localStorage.setItem('Password', password);
				thisCollaborator.status = thisCollaborator.COLLABORATOR_STATUS.Login;
				thisCollaborator.logIn = new Login(email, password);
				thisCollaborator.logIn.assignEvent(thisCollaborator);
				thisCollaborator.logIn.login();
			}
			else {
				if((email==localStorage.getItem('Username')) && (password==localStorage.getItem('Password'))) {
					thisCollaborator.CollaboratorEvent.detail.action='LOGIN_SUCCEED';
					thisCollaborator.fireEvent();
				}
				else {
					thisCollaborator.CollaboratorEvent.detail.action='LOGIN_FAILED';
					thisCollaborator.fireEvent();
				}
			}
			*/
		},
		show: function() {
		var thisCollaborator = this;
			alert('Collaborator Data:\n' +
				  'Id: ' + thisCollaborator.id + '\n' +	
		  		  'Gender Id: ' + thisCollaborator.gender_id + '\n' +	
		  		  'Manager Id: ' + thisCollaborator.manager_id + '\n' +	
		  		  'Address Id: ' + thisCollaborator.address_id + '\n' +
		  		  'Collaborator Type Id: ' + thisCollaborator.collaborator_type_id + '\n' +	
		  		  'Lastname: ' + thisCollaborator.lastname + '\n' +	
		  		  'Firstname: ' + thisCollaborator.firstname + '\n' +	
		  		  'Email: ' + thisCollaborator.email + '\n' +
		  		  'Password: ' + thisCollaborator.password + '\n' +
		  		  'Mobile Nr: ' + thisCollaborator.mobilenr + '\n' +
		  		  'IMEI: ' + thisCollaborator.imei + '\n' +
		  		  'IMEI_S: ' + thisCollaborator.imei_s + '\n' +
		  		  'UUID: ' + thisCollaborator.uuid + '\n' +
		  		  'Picture Url: ' + thisCollaborator.picture_url + '\n' +
		  		  'Admin: ' + (thisCollaborator.admin==true) ? 'true' : 'false' + '\n');
		},
		addEventListener: function(name, handler, capture) {
		if(DEBUG) alert('Enter Collaborator.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
		if(DEBUG) alert('Enter Collaborator.removeEventListener() ...');
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
		if(DEBUG) alert('Executing Collaborator.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
		if(DEBUG) alert('Collaborator.AssignEvent');
		var thisCollaborator = this;
		
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisCollaborator.objectId = new Object();
				thisCollaborator.objectId = element;
				thisCollaborator.objectId.addEventListener('Collaborator', 'onCollaborator', false);
			}
			else {
//			alert('It is an HTML Element');
				thisCollaborator.htmlElement = element;
				document.getElementById(thisCollaborator.htmlElement).addEventListener("Collaborator", onCollaborator, false);
			}
		},
		fireEvent: function() {
		if(DEBUG) alert('Collaborator.FireEvent');
		var thisCollaborator = this;
			thisCollaborator.CollaboratorEvent.detail.id = thisCollaborator.id;
			thisCollaborator.CollaboratorEvent.detail.gender_id = thisCollaborator.gender_id;
			thisCollaborator.CollaboratorEvent.detail.manager_id = thisCollaborator.manager_id;
			thisCollaborator.CollaboratorEvent.detail.address_id = thisCollaborator.address_id;
			thisCollaborator.CollaboratorEvent.detail.collaborator_type_id = thisCollaborator.collaborator_type_id;
			thisCollaborator.CollaboratorEvent.detail.lastname = thisCollaborator.lastname;
			thisCollaborator.CollaboratorEvent.detail.firstname = thisCollaborator.firstname;
			thisCollaborator.CollaboratorEvent.detail.email = thisCollaborator.email;
			thisCollaborator.CollaboratorEvent.detail.password = thisCollaborator.password;
			thisCollaborator.CollaboratorEvent.detail.mobilenr = thisCollaborator.mobilenr;
			thisCollaborator.CollaboratorEvent.detail.imei = thisCollaborator.imei;
			thisCollaborator.CollaboratorEvent.detail.imei_s = thisCollaborator.imei_s;
			thisCollaborator.CollaboratorEvent.detail.uuid = thisCollaborator.uuid;
			thisCollaborator.CollaboratorEvent.detail.picture_url = thisCollaborator.picture_url;
			thisCollaborator.CollaboratorEvent.detail.admin = thisCollaborator.admin;
			
			if(thisCollaborator.status==thisCollaborator.COLLABORATOR_STATUS.Login) {
				if (thisCollaborator.selfObjectId!=null){
//					alert('Event fired to itself');
					thisCollaborator.selfObjectId.dispatchEvent(thisCollaborator.CollaboratorEvent);
				}
			}
			else {
				if (thisCollaborator.objectId!=null){
//					alert('Event fired to an Object');
					thisCollaborator.objectId.dispatchEvent(thisCollaborator.CollaboratorEvent);
				}
				if(thisCollaborator.htmlElement!=null) {
//					alert('Event fired to an HTML Element');
					document.getElementById(thisCollaborator.htmlElement).dispatchEvent(thisCollaborator.CollaboratorEvent);
				}
			}
		},
		onCollaborator: function(event) {
		if(DEBUG) alert('Collaborator.onCollaborator Event ' + event.detail.action + ' received...');
		var thisCollaborator = this;
			// Event generated when resetting Collaborator 
			// (occurs when Login fails)
			if(event.detail.action=='RESET') {
				thisCollaborator.status = thisCollaborator.COLLABORATOR_STATUS.Unset;
				thisCollaborator.CollaboratorEvent.detail.action='LOGIN_FAILED';
				thisCollaborator.fireEvent();
			}
			// Event generated when getting Collaborator Data according to its ID 
			// (Collaborator ID is returned by Login)  
			if(event.detail.action=='SELECT') {
//				thisCollaborator.show();
				if(thisCollaborator.id>-1) {
					if(thisCollaborator.uuid='') {
						thisCollaborator.uuid = (device!=undefined) ? device.uuid : '0000000000000000';
						thisCollaborator.update();
					}
					else {
						thisCollaborator.status = thisCollaborator.COLLABORATOR_STATUS.Set;
						thisCollaborator.CollaboratorEvent.detail.action='LOGIN_SUCCEED';
						thisCollaborator.fireEvent();
					}
				}
				else {
					thisCollaborator.CollaboratorEvent.detail.action='LOGIN_FAILED';
					thisCollaborator.fireEvent();
				}
			}
			// Event generated when setting uuid to Collaborator
			// Once done, we continue with App StartUp.
			if(event.detail.action=='UPDATE') {
				alert('Collaborator UPDATE');
				thisCollaborator.status = thisCollaborator.COLLABORATOR_STATUS.Set;
				thisCollaborator.CollaboratorEvent.detail.action='LOGIN_SUCCEED';
				thisCollaborator.fireEvent();
			}
			if(event.detail.action=='LOGIN_FAILED') {
				
			}
			
		},
		onLogin: function(event) {
		if(DEBUG) alert('Collaborator.onLogin()');
		var thisCollaborator = this;
			// Check if Collaborator ID returned by LogIn is valid
			phoneui.hideActivityDialog();
			if(event.detail.action=='LOGIN_SUCCEED') {
				// Check if returned ID is valid
				if(event.detail.id>0) {
					// YES, get Collaborator's Data
					thisCollaborator.select(event.detail.id);
				}
				else {
					// NO, reset Collaborator's Data
					thisCollaborator.reset();
					alert('LogIn Failed.\nWrong Username and/or Password.');
				}
			}
			if(event.detail.action=='LOGIN_FAILED') {
				thisCollaborator.reset();
				alert('LogIn Failed.\nWrong Username and/or Password.');
			}
		},
		store: function() {
//		if(DEBUG) alert('Collaborator.store()');
			localStorage.setItem('Collaborator', JSON.stringify(this));
		},
		restore: function() {
//		if(DEBUG) alert('Collaborator.restore()');
		var thisCollaborator = this;
		var item = JSON.parse(localStorage.getItem('Collaborator'));	
			thisCollaborator.id = item.id;
			thisCollaborator.gender_id = item.gender_id;
			thisCollaborator.manager_id = item.manager_id;
			thisCollaborator.address_id = item.address_id;
			thisCollaborator.collaborator_type_id = item.collaborator_type_id;
			thisCollaborator.lastname = item.lastname;
			thisCollaborator.firstname = item.firstname;
			thisCollaborator.email = item.email;
			thisCollaborator.password = item.password;
			thisCollaborator.mobilenr = item.mobilenr;
			thisCollaborator.imei = item.imei;
			thisCollaborator.imei_s = item.imei_s;
			thisCollaborator.uuid = item.uuid;
			thisCollaborator.picture = item.picture;
			thisCollaborator.admin = item.admin;
			thisCollaborator.htmlElement = item.htmlElement;
			thisCollaborator.objectId = item.objectId;
			thisCollaborator.CollaboratorEvent = item.CollaboratorEvent;
		    thisCollaborator.fireEvent();
		},
		unstore: function() {
//		if(DEBUG) alert('Collaborator.unstore()');
		var thisCollaborator = this;
			localStorage.removeItem('Collaborator');
		},
		isStored: function() {
//		if(DEBUG) alert('Collaborator.isStored()');
		var thisCollaborator = this;
		var storage = localStorage.getItem('Collaborator');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return Collaborator;
})();


var CollaboratorCollection = (function () {
	
	var CollaboratorCollection = function () {
//		if(DEBUG) alert('Enter CollaboratorCollection() Constructor.');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//		if(DEBUG) alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.CollaboratorCollectionEvent = new CustomEvent("CollaboratorCollection", {
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
				this.CollaboratorCollectionEvent = new CustomEvent("CollaboratorCollection", {
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
				this.CollaboratorCollectionEvent = document.createEvent("CustomEvent");
				this.CollaboratorCollectionEvent.initCustomEvent('CollaboratorCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
//		if(DEBUG) alert('Exit CollaboratorCollection() Constructor.');
	};

	CollaboratorCollection.prototype = {
		load: function() {
		if(DEBUG) alert('CollaboratorCollection.load()');
		var thisCollaboratorCollection = this;
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getCollaborators";
				$.ajax ({
					type: "GET",
					url: url,
					data: {},
					datatype: "xml",
					timeout: 600000,
					success: function(data) {
					    var $xml = $(data);
					    var key = 0;
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        var item = new Collaborator($this.find("COLLABORATOR_ID").text(),
	        										$this.find("GENDER_ID").text(),
					        						$this.find("MANAGER_ID").text(),
					          		                $this.find("ADDRESS_ID").text(),
					        						$this.find("COLLABORATOR_TYPE_ID").text(),
					        						$this.find("LASTNAME").text(),
					        						$this.find("FIRSTNAME").text(),
					          		                $this.find("EMAIL").text(),
					           		                $this.find("PASSWORD").text(),
					           		                $this.find("MOBILENR").text(),
					           		                $this.find("IMEI").text(),
					           		                $this.find("IMEI_S").text(),
					           		                $this.find("UUID").text(),
				           		                    $this.find("PICTURE_URL").text(),
				           		                    $this.find("APP_ADMIN").text());
	//				        if(thisCollaboratorCollection.objectId!=null) {
	//				        	item.assignEvent(thisCollaboratorCollection.objectId);
	//				        }
	//				        if(thisCollaboratorCollection.htmlElement!=null) {
	//				        	item.assignEvent(thisCollaboratorCollection.htmlElement);
	//				        }
					        thisCollaboratorCollection.add(key++, item);
					    });
					    thisCollaboratorCollection.fireEvent();
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
					tx.executeSql('SELECT COLLABORATOR_ID, GENDER_ID, MANAGER_ID, ADDRESS_ID, COLLABORATOR_TYPE_ID, LASTNAME, FIRSTNAME, EMAIL, PASSWORD, MOBILENR, IMEI, IMEI_S, UUID, PICTURE_URL FROM COLLABORATOR',
							      [], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
									for (var i=0; i<data.length; i++) {
								        item = new Collaborator(data.item(i).COLLABORATOR_ID,
								        						data.item(i).GENDER_ID,
								        						data.item(i).MANAGER_ID,
								        						data.item(i).ADDRESS_ID,
								        						data.item(i).COLLABORATOR_TYPE_ID,
								        						data.item(i).LASTNAME,
								        						data.item(i).FIRSTNAME,
								        						data.item(i).EMAIL,
								        						data.item(i).PASSWORD,
								        						data.item(i).MOBILENR,
								        						data.item(i).IMEI,
								        						data.item(i).IMEI_S,
								        						data.item(i).UUID,
								        						data.item(i).PICTURE_URL);
								        thisCollaboratorCollection.add(key++, item);
									}
									thisCollaboratorCollection.fireEvent();
								  }, 
								  function() {
									  alert('Collaborator SELECT Error');
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
//		if(DEBUG) alert('AssignEvent');
		var thisCollaboratorCollection = this;
			
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisCollaboratorCollection.objectId = new Object();
				thisCollaboratorCollection.objectId = element;
				thisCollaboratorCollection.objectId.addEventListener('CollaboratorCollection', 'onCollaboratorCollection', false);
			}
			else {
//			alert('It is an HTML Element');
				thisCollaboratorCollection.htmlElement = element;
				document.getElementById(thisCollaboratorCollection.htmlElement).addEventListener("CollaboratorCollection", onCollaboratorCollection, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) alert('FireEvent');
		var thisCollaboratorCollection = this;
			thisCollaboratorCollection.CollaboratorCollectionEvent.detail.count = thisCollaboratorCollection.count;
			thisCollaboratorCollection.CollaboratorCollectionEvent.detail.items = thisCollaboratorCollection.collection;
			if (thisCollaboratorCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisCollaboratorCollection.objectId.dispatchEvent(thisCollaboratorCollection.CollaboratorCollectionEvent);
			}
			if(thisCollaboratorCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisCollaboratorCollection.htmlElement).dispatchEvent(thisCollaboratorCollection.CollaboratorCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('CollaboratorCollection.store()');
		var thisCollaboratorCollection = this;
			localStorage.setItem('CollaboratorCollection', JSON.stringify(thisCollaboratorCollection));
		},
		restore: function() {
//		if(DEBUG) alert('CollaboratorCollection.restore()');
		var thisCollaboratorCollection = this;
		var item = JSON.parse(localStorage.getItem('CollaboratorCollection'));	
			thisCollaboratorCollection.count = item.count;
			thisCollaboratorCollection.collection = item.collection;
			thisCollaboratorCollection.htmlElement = item.htmlElement;
			thisCollaboratorCollection.objectId = item.objectId;
			thisCollaboratorCollection.CollaboratorCollectionEvent = item.CollaboratorCollectionEvent;
			thisCollaboratorCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('CollaboratorCollection.unstore()');
			localStorage.removeItem('CollaboratorCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('CollaboratorCollection.isStored()');
		var storage = localStorage.getItem('CollaboratorCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return CollaboratorCollection;
	
})();
