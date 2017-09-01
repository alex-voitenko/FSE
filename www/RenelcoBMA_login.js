//////////////////////////////////////////////////
// Define Login Class
//////////////////////////////////////////////////

/** Login
 * This class encapsulates a Login Process.
 *
 */	
/**
 * @author Hell
 */
/**
 *  Login Class Definition 
 */
var Login = (function () {
	var Login = function (email, password) {
		if(DEBUG) alert('Enter Login(' + email + ', ' + password + ') Constructor...');
		this.id = -1;
		this.email = email || ''; 
		this.password = password || '';
		this.mobileNr = '';
		this.imei = '';
		this.imei_s = '';
		this.uuid = '';
		this.objectId = null;
		this.htmlElementId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.LoginEvent = new CustomEvent("Login", {
				detail: {
					action: '',
					id: 0,
					mobilenr: '',
					imei: '',
					imei_s: '',
					uuid: '',
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.LoginEvent = new CustomEvent("Login", {
					action: '',
					detail: {
						id: 0,
						mobilenr: '',
						imei: '',
						imei_s: '',
						uuid: '',
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.LoginEvent = document.createEvent("CustomEvent");
				this.LoginEvent.initCustomEvent('Login', true, false, {action: '', id: 0, mobilenr: '', imei: '', imei_s: '', uuid: '', time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Login Constructor...');
	};
	
	Login.prototype = {
		reset: function() {
		if(DEBUG) alert('Login.reset()');
		var thisLogin = this;
			thisLogin.id = -1;
			thisLogin.email = '';
			thisLogin.password = '';
			thisLogin.mobileNr = '';
			thisLogin.imei = '';
			thisLogin.imei_s = '';
			thisLogin.uuid = '';
		},
		login: function() {
		if(DEBUG) alert('Login.login()');
		var thisLogin = this;
		
			if(LOCAL_DB==false || databaseManager==undefined) {
				var url = urlDataServices + "/login";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"email": thisLogin.email,
						   "password": thisLogin.password},
					datatype: "xml",
					timeout: 600000,
					success: function(data) {
					    var $xml = $(data);
					    var key = 0;
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisLogin.id = $this.find("COLLABORATOR_ID").text();
					        thisLogin.email = $this.find("EMAIL").text();
					        thisLogin.mobileNr = $this.find("MOBILENR").text();
					        thisLogin.imei = $this.find("IMEI").text();
					        thisLogin.imei_s = $this.find("IMEI_S").text();
					        thisLogin.uuid = $this.find("UUID").text();
					    });
						if(thisLogin.id>0) { 
							thisLogin.LoginEvent.detail.action = 'LOGIN_SUCCEED'; 
						}
						else { 
							thisLogin.LoginEvent.detail.action = 'LOGIN_FAILED'; 
						}
					    thisLogin.fireEvent();
					},
					error: function(xhr, status, error) {
					    thisLogin.LoginEvent.detail.action = 'LOGIN_FAILED';
						thisLogin.reset();
					    thisLogin.fireEvent();
//						alert(JSON.stringify(xhr));
						alert('Something went wrong.\n' +
							  'Status: ' + status + '\n' +
							  'Error: ' + error + '\n');
					}
				});
			}
			else {
				databaseManager.localDB.transaction(function(tx) {
					tx.executeSql('SELECT COLLABORATOR_ID, EMAIL, MOBILENR, IMEI, IMEI_S, UUID FROM COLLABORATOR WHERE EMAIL = ? AND PASSWORD = ?', 
							      [thisLogin.email,
							       thisLogin.password], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        thisLogin.id = data.item(i).COLLABORATOR_ID;
								        thisLogin.email = data.item(i).EMAIL;
								        thisLogin.mobileNr = data.item(i).MOBILENR;
								        thisLogin.imei = data.item(i).IMEI;
								        thisLogin.imei_s = data.item(i).IMEI_S;
								        thisLogin.uuid = data.item(i).UUID;
									}
									if(thisLogin.id>0) { 
										thisLogin.LoginEvent.detail.action = 'LOGIN_SUCCEED'; 
									}
									else { 
										thisLogin.LoginEvent.detail.action = 'LOGIN_FAILED'; 
									}
									thisLogin.fireEvent();
								  }, 
								  function() {
									  thisLogin.LoginEvent.detail.action = 'LOGIN_FAILED';
									  thisLogin.reset();
									  thisLogin.fireEvent();
								  }
					);
				});
			}
		},
		show: function() {
//		alert('Login.show()');
			alert('Login Data:\n' +
				'Id: ' + this.id + '\n' +	
		  		'Email: ' + this.email + '\n' +	
		  		'Mobile Nr: ' + this.mobileNr + '\n' +	
		  		'IMEI: ' + this.imei + '\n' +
		  		'IMEI_S: ' + this.imei_s + '\n' +
		  		'UUID: ' + this.uuid + '\n');
		},
		assignEvent: function(element) {
		if(DEBUG) alert('Login.AssignEvent(' + element + ')');
		var thisLogin = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisLogin.objectId = element;
				thisLogin.htmlElement = null;
				thisLogin.objectId.addEventListener('Login', 'onLogin', false);
			}
			else {
//				alert('It is an HTML Element');
				thisLogin.objectId = null;
				thisLogin.htmlElement = element;
				document.getElementById(thisLogin.htmlElement).addEventListener("Login", onLogin, false);
			}
		},
		fireEvent: function() {
		if(DEBUG) alert('Login.FireEvent()');
		var thisLogin = this;
			
			thisLogin.LoginEvent.detail.id = thisLogin.id;
			thisLogin.LoginEvent.detail.mobilenr = thisLogin.mobileNr;
			thisLogin.LoginEvent.detail.imei = thisLogin.imei;
			thisLogin.LoginEvent.detail.imei_s = thisLogin.imei_s;
			thisLogin.LoginEvent.detail.uuid = thisLogin.uuid;

			if (thisLogin.htmElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisLogin.htmlElement).dispatchEvent(thisLogin.LoginEvent);
			}
			if(thisLogin.objectId!=null) {
//				alert('Event fired to an Object');
				thisLogin.objectId.dispatchEvent(thisLogin.LoginEvent);
			}
		}
	};
	return Login;
})();
