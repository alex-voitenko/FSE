//////////////////////////////////////////////////
// Define Document Class
//////////////////////////////////////////////////

/** Document
 * This class encapsulates a Document.
 *
 */	
/**
 * @author Hell
 */
/**
 *  Document Class Definition 
 */
var Document = (function () {
	var Document = function (id, collaborator_id, document_type_id, name, description, local_url, server_url, dataserver_url, created, uploaded, urlPhpServices) {
		if(DEBUG) console.log('Enter Document() Constructor...');
		this.MAX_RETRIES = 5;
		this.id = id || -1;
		this.collaborator_id = collaborator_id || -1;
		this.document_type_id = document_type_id || -1;
		this.name = name  || '';
		this.description = description || '';
		this.local_url = local_url || '';
		this.server_url = server_url || '';
		this.created = created || new Date();
		this.webServerBaseUrl = dataserver_url;
		this.urlPhpServices = urlPhpServices || '';
		this.uploaded = uploaded || 0;
		this.nbRetries = 0;
		this.htmlElement = null;
		this.objectId = null;
		this.selfObjectId = this;	// Self-assigned, used for File Upload and others internal Event Handling
		this.selfObjectId.addEventListener('Document', 'onDocument', false);
		this.selfObjectId.addEventListener('FileUpload', 'onFileUpload', false);
		this.parent = null;
		if(deviceInfo===undefined) {
//			console.log('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.DocumentEvent = new CustomEvent("Document", {
				detail: {
					action: 'UNDEFINED',
					result: '',
					id: 0,
					collaborator_id: 0,
					document_type_id: 0,
					name: '',
					description: '',
					local_url: '',
					server_url: '',
					created: new Date(),
					uploaded: 0,
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				console.log('KitKat Device...');
				this.DocumentEvent = new CustomEvent("Document", {
					detail: {
						action: 'UNDEFINED',
						result: '',
						id: 0,
						collaborator_id: 0,
						document_type_id: 0,
						name: '',
						description: '',
						local_url: '',
						server_url: '',
						created: new Date(),
						uploaded: 0,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				console.log('NOT a KitKat Device...');
				this.DocumentEvent = document.createEvent("CustomEvent");
				this.DocumentEvent.initCustomEvent('Document', true, false, {action: 'UNDEFINED', result: '', id: 0, collaborator_id: 0, document_type_id: 0, name: '', description: '', local_url: '', server_url: '', created: new Date(), uploaded: 0, time: new Date()});
			}
		}
		this.imgUploader = new FileUploader(this.webServerBaseUrl + '/uploads');
		this.imgUploader.assignEvent(this.selfObjectId);
		if(DEBUG) console.log('Exit Document Constructor...');
	};

	Document.prototype = {
		DOCUMENT_STATUS: {Undefined: 'Undefined', Set: 'Set', NotSet: 'NotSet', Uploaded: 'Uploaded', NotUploaded: 'NotUploaded', Valid: 'Valid', Unvalid: 'Unvalid' },
		reset: function() {
//		if(DEBUG) console.log('Document.reset()');
		var thisDocument = this;
			thisDocument.id = -1;
			thisDocument.collaborator_id = -1;
			thisDocument.document_type_id = -1; 
			thisDocument.name = '';
			thisDocument.description = '';
			thisDocument.local_url = '';
			thisDocument.server_url = '';
			thisDocument.webServerBaseUrl = urlDataServer;
			thisDocument.created = new Date();
			thisDocument.uploaded = 0;
			thisDocument.DocumentEvent.detail.action = 'RESET';
			thisDocument.DocumentEvent.detail.result = 'SUCCESS';
		    thisDocument.fireEvent();
		},
		startUpload: function() {
		if(DEBUG) console.log('upload');
		var thisDocument = this;
			// Check if Document not yet uploaded
			if(thisDocument.uploaded==0) {
				thisDocument.nbRetries = 0;
				thisDocument.upload();
			}
			// Document already uploaded, skip ...
			else {
				thisDocument.parent.upload();
			}
		},
		upload: function() {
		if(DEBUG) console.log('upload');
//		if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'Document.upload(): Executing ...');
		var thisDocument = this;
			thisDocument.DocumentEvent.detail.action = 'UNDEFINED';
			thisDocument.DocumentEvent.detail.result = '';
			//alert("joket: upload image in document thisDocument.local_url:="+ thisDocument.local_url);
			//alert("joket: upload image in document thisDocument.server_url:="+ thisDocument.server_url.substr(thisDocument.server_url.lastIndexOf('/') + 1));
			
			thisDocument.imgUploader.uploadImage(thisDocument.local_url, thisDocument.server_url.substr(thisDocument.server_url.lastIndexOf('/') + 1));
		},
		checkDocumentFileOnServer: function() {
		console.log('Document.checkDocumentFileOnServer()');
		var thisDocument = this;
		//alert("joket: checkDocumentFileOnServer "+thisDocument.local_url);
			phoneui.showActivityDialog('Checking Document...');
			$.ajax ({
				type: "GET",
				url: thisDocument.urlPhpServices,
				data: {"action": 'imgexist', "imgname": thisDocument.server_url.substr(thisDocument.server_url.lastIndexOf('/') + 1) },
				datatype: "text",
				timeout: 600000,
				success: function(data)	{
					if(data.trim()=='SUCCESS') {
						if(DEBUG) alert('Required Document File exists on Server');
//						if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'Document.checkDocumentFileOnServer(): Document File ' + thisDocument.server_url.substr(thisDocument.server_url.lastIndexOf('/') + 1) + ' exists on Server.');
	    				thisDocument.DocumentEvent.detail.action = 'UPLOADED';
						thisDocument.DocumentEvent.detail.result = 'SUCCESS';
					    thisDocument.fireEvent();
					}
					else {
						if(DEBUG) alert('Required Document File doesn\'t exist on Server.');
//						if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'Document.checkDocumentFileOnServer(): Document File ' + thisDocument.server_url.substr(thisDocument.server_url.lastIndexOf('/') + 1) + ' doesn\'t exist on Server.');
	    				thisDocument.DocumentEvent.detail.action = 'UPLOADED';
						thisDocument.DocumentEvent.detail.result = 'ERROR';
					    thisDocument.fireEvent();
					}
				},
				error: function(xhr, status, error) {
					alert('Something went wrong.\n' +
						  'Status: ' + status + '\n' +
						  'Error: ' + error + '\n');
					if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'Document.checkDocumentFileOnServer(): Something went wrong - Status: ' + status + ' / Error: ' + error);
					if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'Document.checkDocumentFileOnServer(): Document ' + name  + ' not uploaded ...');
    				thisDocument.DocumentEvent.detail.action = 'UPLOADED';
					thisDocument.DocumentEvent.detail.result = 'FAILURE';
				    thisDocument.fireEvent();
				}
			});
				
		},
		create: function() {
//		if(DEBUG) console.log('Document.create()');
		var thisDocument = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/addDocument";
				//alert("joket:createDocument local_url = " + thisDocument.local_url);
				$.ajax ({
					type: "GET",
					url: url,
					data: {"collaborator_id": collaborator.id,
						   "document_type_id": thisDocument.document_type_id,
						   "name": thisDocument.name,
						   "description": thisDocument.description,
						   "local_url":     thisDocument.local_url.replace("sdcard0","emulated/0"),//"file::",// this is dangerous work manual local url 
						   "server_url": thisDocument.server_url,
						   "created": thisDocument.created,
						   "uploaded": thisDocument.uploaded},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
						//alert("joket: add Document local_url = " +JSON.stringify(data));
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisDocument.id = returnedId;
					    });
					    thisDocument.DocumentEvent.detail.action = 'INSERT';
						thisDocument.DocumentEvent.detail.result = 'SUCCESS';
					    thisDocument.fireEvent();
					},
					error: function(xhr, status, error) {
						alert(JSON.stringify(xhr));
						alert('Something went wrong.\n' +
							  'Status: ' + status + '\n' +
							  'Error: ' + error + '\n');
						if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'Document.create(): Something went wrong - Status: ' + status + ' / Error: ' + error);
					    thisDocument.DocumentEvent.detail.action = 'INSERT';
						thisDocument.DocumentEvent.detail.result = 'ERROR';
					    thisDocument.fireEvent();
					}
				});
			}
			else {
				//alert("joket:createDocument databaseManager transaction local_url = " + thisDocument.local_url);
				databaseManager.localDB.transaction(function(tx) {
					tx.executeSql('INSERT INTO DOCUMENT  ' +
								  '(COLLABORATOR_ID, DOCUMENT_TYPE_ID, NAME, DESCRIPTION, LOCAL_URL, SERVER_URL, CREATED, UPLOADED) ' +
								  'VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
								  [collaborator.id,
								   thisDocument.document_type_id,
								   thisDocument.name,
								   thisDocument.description,
								   thisDocument.local_url,
								   thisDocument.server_url,
								   thisDocument.created,
								   thisDocument.uploaded],
							   	   function(tx, rs) {
										thisDocument.id = rs.insertId;
									    thisDocument.DocumentEvent.detail.action = 'INSERT';
										thisDocument.DocumentEvent.detail.result = 'SUCCESS';
									    thisDocument.fireEvent();
								   },
								   function(error) {
									   	alert('Document INSERT Error');
										if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'Document.create(): Document INSERT Error.');
									    thisDocument.DocumentEvent.detail.action = 'INSERT';
										thisDocument.DocumentEvent.detail.result = 'ERROR';
									    thisDocument.fireEvent();
								   });
				});
			}
		},
		update: function() {
//		if(DEBUG) console.log('Document.update()');	
		var thisDocument = this;
		
		
			if(LOCAL_DB==false) {
			//	alert("joket:updateDocument LOCAL_DB == 0 transaction local_url = " + thisDocument.local_url);
				var url = urlDataServices + "/saveDocument";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"document_type_id": thisDocument.document_type_id,
						   "name": thisDocument.name,
						   "description": thisDocument.description,
						   "local_url": thisDocument.local_url,
						   "server_url": thisDocument.server_url,
						   "uploaded": thisDocument.uploaded,
						   "document_id": thisDocument.id,
						   "collaborator_id": thisDocument.collaborator_id,
						   "created": thisDocument.created},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisDocument.DocumentEvent.detail.action = 'UPDATE';
						thisDocument.DocumentEvent.detail.result = 'SUCCESS';
					    thisDocument.fireEvent();
					},
					error: function(xhr, status, error) {
						alert(JSON.stringify(xhr));
						alert('Something went wrong.\n' +
							  'Status: ' + status + '\n' +
							  'Error: ' + error + '\n');
						if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'Document.update(): Something went wrong - Status: ' + status + ' / Error: ' + error);
					    thisDocument.DocumentEvent.detail.action = 'UPDATE';
						thisDocument.DocumentEvent.detail.result = 'ERROR';
					    thisDocument.fireEvent();
					}
				});
			}
			else {
			//	alert("joket:updateDocument databaseManager transaction local_url = " + thisDocument.local_url);
				databaseManager.localDB.transaction(function(tx) {
					tx.executeSql('UPDATE DOCUMENT  ' +
								  'SET ' +
								  'DOCUMENT_TYPE_ID = ?, ' +
								  'NAME = ?, ' +
								  'DESCRIPTION = ?, ' +
								  'LOCAL_URL = ?, ' +
								  'SERVER_URL = ?, ' +
								  'UPLOADED = ? ' +
								  'WHERE DOCUMENT_ID = ? AND COLLABORATOR_ID = ? AND CREATED = ?',
								  [thisDocument.document_type_id,
								   thisDocument.name,
								   thisDocument.description,
								   thisDocument.local_url,
								   thisDocument.server_url,
								   thisDocument.uploaded,
								   thisDocument.id,
								   thisDocument.collaborator_id,
								   thisDocument.created],
							   	   function() {
					    				thisDocument.DocumentEvent.detail.action = 'UPDATE';
										thisDocument.DocumentEvent.detail.result = 'SUCCESS';
									    thisDocument.fireEvent();
								   },
								   function(error) {
									   	alert('Document UPDATE Error');
										if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'Document.update(): Document UPDATE Error.');
					    				thisDocument.DocumentEvent.detail.action = 'UPDATE';
										thisDocument.DocumentEvent.detail.result = 'ERROR';
									    thisDocument.fireEvent();
								   });
				});
			}
		},
		suppress: function() {
//		if(DEBUG) console.log('Document.suppress()');
		var thisDocument = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/deleteDocument";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"document_id": thisDocument.id,
						   "collaborator_id": thisDocument.collaborator_id,
						   "created": thisDocument.created},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisDocument.DocumentEvent.detail.action = 'SUPPRESS';
						thisDocument.DocumentEvent.detail.result = 'SUCCESS';
					    thisDocument.fireEvent();
					},
					error: function(xhr, status, error) {
						alert(JSON.stringify(xhr));
						alert('Something went wrong.\n' +
							  'Status: ' + status + '\n' +
							  'Error: ' + error + '\n');
						if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'Document.suppress(): Something went wrong - Status: ' + status + ' / Error: ' + error);
					    thisDocument.DocumentEvent.detail.action = 'SUPPRESS';
						thisDocument.DocumentEvent.detail.result = 'ERROR';
					    thisDocument.fireEvent();
					}
				});
			}
			else {
				databaseManager.localDB.transaction(function(tx) {
					tx.executeSql('DELETE FROM DOCUMENT WHERE DOCUMENT_ID = ? AND COLLABORATOR_ID = ? AND CREATED = ?',
							  	  [thisDocument.id,
							  	   thisDocument.collaborator_id,
							  	   thisDocument.created], 
							      function() {
									   thisDocument.DocumentEvent.detail.action = 'SUPPRESS';
									   thisDocument.DocumentEvent.detail.result = 'SUCCESS';
									   thisDocument.fireEvent();
								  }, 
							      function() {
									   alert('Document DELETE Error');
									   if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'Document.suppress(): Document DELETE Error.');
									   thisDocument.DocumentEvent.detail.action = 'SUPPRESS';
									   thisDocument.DocumentEvent.detail.result = 'ERROR';
									   thisDocument.fireEvent();
								  });
				});
			}
		},
		select: function(document_id, collaborator_id, created) {
//		if(DEBUG) console.log('Document.select(' + id + ')');
		var thisDocument = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getDocument";
				
				$.ajax ({
					type: "GET",
					url: url,
					data: {"document_id": document_id,
						   "collaborator_id": collaborator_id,
						   "created": created},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisDocument.id = $this.find("DOCUMENT_ID").text();
					        thisDocument.collaborator_id = $this.find("COLLABORATOR_ID").text();
					        thisDocument.document_type_id = $this.find("DOCUMENT_TYPE_ID").text();
					        thisDocument.name = $this.find("NAME").text();
					        thisDocument.description = $this.find("DESCRIPTION").text();
					        thisDocument.local_url = $this.find("LOCAL_URL").text();
				//			alert("joket: select Local_DB == false get local_url = "+ thisDocument.local_url);
					        thisDocument.server_url = $this.find("SERVER_URL").text();
							thisDocument.webServerBaseUrl = urlDataServer;
					        thisDocument.created = $this.find("CREATED").text();
					        thisDocument.uploaded = $this.find("UPLOADED").text();
					    });
					    thisDocument.DocumentEvent.detail.action = 'SELECT';
					    thisDocument.DocumentEvent.detail.result = 'SUCCESS';
						thisDocument.fireEvent();
					},
					error: function(xhr, status, error) {
						alert(JSON.stringify(xhr));
						alert('Something went wrong.\n' +
							  'Status: ' + status + '\n' +
							  'Error: ' + error + '\n');
						if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'Document.select(): Something went wrong - Status: ' + status + ' / Error: ' + error);
					    thisDocument.DocumentEvent.detail.action = 'SELECT';
					    thisDocument.DocumentEvent.detail.result = 'ERROR';
						thisDocument.fireEvent();
					}
	
				});
			}
			else {
				databaseManager.localDB.transaction(function(tx) {
					tx.executeSql('SELECT DOCUMENT_ID, COLLABORATOR_ID, DOCUMENT_TYPE_ID, NAME, DESCRIPTION, LOCAL_URL, SERVER_URL, CREATED, UPLOADED  ' +
								  'FROM DOCUMENT  ' + 
								  'WHERE DOCUMENT_ID = ? AND COLLABORATOR_ID = ? AND CREATED = ?',
								  [document_id,
								   collaborator_id,
								   created],  
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        thisDocument.id = data.item(i).DOCUMENT_ID;
								        thisDocument.collaborator_id = data.item(i).COLLABORATOR_ID;
								        thisDocument.document_type_id = data.item(i).DOCUMENT_TYPE_ID;
								        thisDocument.name = data.item(i).NAME;
								        thisDocument.description = data.item(i).DESCRIPTION;
								        thisDocument.local_url = data.item(i).LOCAL_URL;
								//		alert("joket:select LOCAL_DB == true  get local_url = "+ thisDocument.local_url);

								        thisDocument.server_url = data.item(i).SERVER_URL;
								        thisDocument.webServerBaseUrl = urlDataServer;
								        thisDocument.created = data.item(i).CREATED;
								        thisDocument.uploaded = data.item(i).UPLOADED;
									}
								    thisDocument.DocumentEvent.detail.action = 'SELECT';
								    thisDocument.DocumentEvent.detail.result = 'SUCCESS';
									thisDocument.fireEvent();
								  }, 
								  function() {
									  alert('Document SELECT Error');
									  if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'Document.select(): Document SELECT Error.');
									  thisDocument.DocumentEvent.detail.action = 'SELECT';
									  thisDocument.DocumentEvent.detail.result = 'ERROR';
									  thisDocument.fireEvent();
								  });
				});
			}
		},
		show: function() {
		var thisDocument = this;
			alert('Document Data:\n' +
			      'Document Id: ' + thisDocument.id + '\n' +
			      'Collaborator Id: ' + thisDocument.collaborator_id + '\n' +
			      'Document Type Id: ' + thisDocument.document_type_id + '\n' +
			      'Name: ' + thisDocument.name + '\n' +
			      'Description: ' + thisDocument.description + '\n' +
			      'Local URL: ' + thisDocument.local_url + '\n' +
			      'Server URL: ' + thisDocument.server_url + '\n' +
			      'WEBServer Base Url: ' + thisDocument.webServerBaseUrl + '\n' +
			      'Created: ' + thisDocument.created + '\n' +
			      'Uploaded: ' + thisDocument.uploaded + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		if(DEBUG) console.log('Enter Document.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			console.log(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		if(DEBUG) console.log('Enter Document.removeEventListener() ...');
		    if (!this.events) return;
		    if (!this.events[name]) return;
		    for (var i = this.events[name].length - 1; i >= 0; i--) {
		        if (this.events[name][i] == handler) {
		            this.events[name].splice(i, 1);
		            if(!this.events[name].length) {
//		            	console.log('No more Events');
		            	delete this.events[name];
		            }
		            else {
//			            console.log('Nb of Events: ' + this.events[name].length);
		            }
		        }
		    }
//		    console.log(JSON.stringify(this.events));
		},
		dispatchEvent: function(event) {
//		if(DEBUG) console.log('Executing Document.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		console.log('Registered Events: ' + JSON.stringify(this.events[event.type]));
		var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		console.log('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		if(DEBUG) console.log('Document.AssignEvent');
		var thisDocument = this;
			if (element!==null && typeof element==='object') {
//				console.log('It is an Object');
				thisDocument.objectId = new Object();
				thisDocument.objectId = element;
				thisDocument.objectId.addEventListener('Document', 'onDocument', false);
			}
			else {
//				console.log('It is an HTML Element');
				thisDocument.htmlElement = element;
				document.getElementById(thisDocument.htmlElement).addEventListener("Document", onDocument, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) console.log('Document.FireEvent');
		var thisDocument = this;
			thisDocument.DocumentEvent.detail.id = thisDocument.id;
			thisDocument.DocumentEvent.detail.collaborator_id = thisDocument.collaborator_id;
			thisDocument.DocumentEvent.detail.document_type_id = thisDocument.document_type_id;
			thisDocument.DocumentEvent.detail.name = thisDocument.name;
			thisDocument.DocumentEvent.detail.description = thisDocument.description;
			//alert("joket: fire event thisDocument.local_url = " + thisDocument.local_url);
			thisDocument.DocumentEvent.detail.local_url = thisDocument.local_url;
			thisDocument.DocumentEvent.detail.server_url = thisDocument.server_url;
			thisDocument.DocumentEvent.detail.created = thisDocument.created;
			thisDocument.DocumentEvent.detail.uploaded = thisDocument.uploaded;
			switch (thisDocument.DocumentEvent.detail.action) {
				case 'INSERT':
					if(thisDocument.htmlElement!=null) {
	//					console.log('Event fired to an HTML Element');
						document.getElementById(thisDocument.htmlElement).dispatchEvent(thisDocument.DocumentEvent);
					}
					break;
				case 'UPDATE':
					if (thisDocument.selfObjectId!=null){
//						console.log('Event fired to Itself');
						thisDocument.selfObjectId.dispatchEvent(thisDocument.DocumentEvent);
					}
					break;
				case 'UPLOAD':
					if (thisDocument.selfObjectId!=null){
//						console.log('Event fired to Itself');
						thisDocument.selfObjectId.dispatchEvent(thisDocument.DocumentEvent);
					}
					break;
				case 'UPLOADED':
					if (thisDocument.selfObjectId!=null){
//						console.log('Event fired to an Object (');
						thisDocument.selfObjectId.dispatchEvent(thisDocument.DocumentEvent);
					}
					break;
				default:
					break;
			}
		},
		onDocument: function(event) {
		console.log('Document.onDocument Event received.');
		var thisDocument = this;
			switch (event.detail.action) {
				case 'INSERT':
//					if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'Document.onDocument(event): Document INSERT event received.');
					break;
				case 'UPDATE':
					console.log('Document UPDATE event received ');
//					if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'Document.onDocument(event): Document UPDATE event received.');
					thisDocument.parent.upload();
					break;
				case 'SUPPRESS':
					break;
				case 'SELECT':
					break;
				case 'UPLOAD':
					console.log('Document UPLOAD event received ');
					switch(event.detail.result) {
						case 'SUCCESS':
							if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'Document.onDocument(event): Document ' + event.detail.server_url + ' - UPLOAD SUCCESS event received.');
							thisDocument.checkDocumentFileOnServer();
							break;
						case 'ERROR':
							if(thisDocument.nbRetries < thisDocument.MAX_RETRIES) {
//								if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'Document.onDocument(event): Document UPLOAD ERROR event received. Retrying (' + thisDocument.nbRetries + ' of ' + thisDocument.MAX_RETRIES + ') ...');
//								if(confirm('Failed to upload Document ' + thisDocument.name + '. Retry ? (' + thisDocument.nbRetries + ' of ' + thisDocument.MAX_RETRIES + ')')==true) {
//								alert('Failed to upload Document ' + thisDocument.name + '. Retry ? (' + thisDocument.nbRetries + ' of ' + thisDocument.MAX_RETRIES + ')');
//								window.plugins.infobox.showInfo('Failed to upload Document ' + thisDocument.name + '. Retrying ... (' + thisDocument.nbRetries + ' of ' + thisDocument.MAX_RETRIES + ')', 0);
								// Retry current Upload
									alert((language==null) ? 'Failed to Upload Document' + ' ' + event.detail.name + '.\n' + 'Please check Network Signal and press OK' : language.translate('Failed to Upload Document') + ' ' + event.detail.name + '.\n' + language.translate('Please check Network Signal and press OK'));
									thisDocument.nbRetries++;
									thisDocument.upload();
//								}
//								else {
//									// Abort current Upload
////									thisDocument.nbRetries = thisDocument.MAX_RETRIES;
//									thisDocument.uploaded = 0;
//									thisDocument.update();
//								}
							}
							else  {
								if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'Document.onDocument(event): Document ' + event.detail.server_url + ' - UPLOAD ERROR event received (' + thisDocument.nbRetries + ' Retries).');
								thisDocument.uploaded = 0;
								thisDocument.update();
							}
							break;
						default:
							break;
					}
					break;
				case 'UPLOADED':
					switch(event.detail.result) {
						case 'SUCCESS':
							if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'Document.onDocument(event): Document ' + event.detail.server_url + ' UPLOADED. Setting Flag to 1 in Document DB Table');
							thisDocument.uploaded = 1;
							thisDocument.update();
							break;
						case 'ERROR':
						case 'FAILURE':
							if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'Document.onDocument(event): Document ' + event.detail.server_url + ' NOT UPLOADED. Setting Flag to 0 in Document DB Table');
							thisDocument.uploaded = 0;
							thisDocument.update();
							break;


					}
					break;
				case 'RESET':
					break;
				default:
					break;
			}
		},
		onFileUpload: function(event) {
		if(DEBUG) console.log('onFileUpload Event received.');
		var thisDocument = this;
			if(event.detail.info==200) {
			console.log('Document uploaded');
//				if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'Document.onFileUpload(event): Document File uploaded.');
			    thisDocument.DocumentEvent.detail.action = 'UPLOAD';
			    thisDocument.DocumentEvent.detail.result = 'SUCCESS';
				thisDocument.fireEvent();
			}
			else {
//				if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'Document.onFileUpload(event): Failed to upload Document File.');
				switch(event.detail.info) {
					case 1:
						console.log('Failed to retrieve local Document');
						break;
					case 2:
						break;
					case 3:
						console.log('Failed to upload Document (Check Network Connection)');
						break;
				}
			    thisDocument.DocumentEvent.detail.action = 'UPLOAD';
			    thisDocument.DocumentEvent.detail.result = 'ERROR';
				thisDocument.fireEvent();
			}
		},
		store: function() {
//		if(DEBUG) console.log('Document.store()');
			localStorage.setItem('Document', JSON.stringify(this));
		},
		restore: function() {
//		if(DEBUG) console.log('Document.restore()');
		var thisDocument = this;
		var item = JSON.parse(localStorage.getItem('Document'));	
			thisDocument.id = item.id;
			thisDocument.collaborator_id = item.collaborator_id;
			thisDocument.document_type_id = item.document_type_id;
			thisDocument.name = item.name;
			thisDocument.description = item.description;
		//	alert("joket: restore item.local_url = "+ item.local_url)
			thisDocument.local_url = item.local_url;
			thisDocument.server_url = item.server_url;
			thisDocument.created = item.created;
			thisDocument.webServerBaseUrl = item.webServerBaseUrl;
			thisDocument.uploaded = item.uploaded;
		},
		remove: function() {
//		if(DEBUG) console.log('Document.remove()');
		var thisDocument = this;
			localStorage.removeItem('Document');
		},
		isStored: function() {
//		if(DEBUG) console.log('Document.isStored()');
		var thisDocument = this;
		var storage = localStorage.getItem('Document');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return Document;
})();

var DocumentCollection = (function () {
	var DocumentCollection = function () {
//		if(DEBUG) console.log('Enter DocumentCollection() Constructor...');
		this.count = 0;
		this.collection = [];
		this.currentIdx = 0;
		this.htmlElement = null;
		this.objectId = null;
		this.selfObjectId = this;	
		if(deviceInfo===undefined) {
//			console.log('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.DocumentCollectionEvent = new CustomEvent("DocumentCollection", {
				detail: {
					action: 'UNDEFINED',
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
//				console.log('KitKat Device...');
				this.DocumentCollectionEvent = new CustomEvent("DocumentCollection", {
					detail: {
						action: 'UNDEFINED',
						count: 0,
						items: undefined,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				console.log('NOT a KitKat Device...');
				this.DocumentCollectionEvent = document.createEvent("CustomEvent");
				this.DocumentCollectionEvent.initCustomEvent('DocumentCollection', true, false, {action: 'UNDEFINED', count: 0, items: undefined, time: new Date()});
			}
		}
		this.uploadIdx = 0;
//		if(DEBUG) console.log('Exit Constructor...');
	};

	DocumentCollection.prototype = {
		initUpload: function() {
		if(DEBUG) console.log('DocumentCollection.initUpload()');
		var thisDocumentCollection = this;
			thisDocumentCollection.uploadIdx = 0;
		},
		load: function() {
		if(DEBUG) console.log('DocumentCollection.load()');
		var thisDocumentCollection = this;

			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getDocuments";
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
					        item = new Document($this.find("DOCUMENT_ID").text(),
					        					$this.find("COLLABORATOR_ID").text(),
					        					$this.find("DOCUMENT_TYPE_ID").text(),
					        					$this.find("NAME").text(),
					        					$this.find("DESCRIPTION").text(),
												convert($this.find("LOCAL_URL").text()),
					        					$this.find("SERVER_URL").text(),
					        					urlDataServer,
					        					$this.find("CREATED").text(),
					        					$this.find("UPLOADED").text(),
					        					urlPhpServices);
						//	alert("joket: document load 1 local_url = " + $this.find("LOCAL_URL").text());
	//				        alert(JSON.stringify(item));
					        thisDocumentCollection.add(item);
					    });
					    thisDocumentCollection.fireEvent();
					},
					error: function(xhr, status, error) {
						alert(JSON.stringify(xhr));
						alert('Something went wrong.\n' +
							  'Status: ' + status + '\n' +
							  'Error: ' + error + '\n');
						if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'DocumentCollection.load(): Something went wrong - Status: ' + status + ' / Error: ' + error);
					}
		
				});
			}
			else {
				databaseManager.localDB.transaction(function(tx) {
					tx.executeSql('SELECT DOCUMENT_ID, COLLABORATOR_ID, DOCUMENT_TYPE_ID, NAME, DESCRIPTION, LOCAL_URL, SERVER_URL, CREATED, UPLOADED  ' +
								  'FROM DOCUMENT',
								  [], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        var item = new Document(data.item(i).DOCUMENT_ID,
								        					    data.item(i).COLLABORATOR_ID,
								        						data.item(i).DOCUMENT_TYPE_ID,
								        						data.item(i).NAME,
								        						data.item(i).DESCRIPTION,
																convert(data.item(i).LOCAL_URL),
								        						data.item(i).SERVER_URL,
								        						urlDataServer,
								        						data.item(i).CREATED,
								        						data.item(i).UPLOADED, 
								        						urlPhpServices);
										//alert("joket: document load 2 local_url = " + data.item(i).LOCAL_URL);
//				        				alert(JSON.stringify(item));
								        thisDocumentCollection.add(item);
									}
									thisDocumentCollection.DocumentCollectionEvent.detail.action = 'LOADED';
								    thisDocumentCollection.fireEvent();
								  }, 
								  function() {
									  alert('DocumentCollection SELECT Error');
									  if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'DocumentCollection.load(): DocumentCollection SELECT Error.');
								  });
				});
			}
		},
		convert:function(local_url){
			if(local_url.includes("cache/")) {
				//alert("joket: server recognized new url1");
				return local_url;
			}
			else{
				var filename = local_url.substr(event.detail.image.lastIndexOf('/') + 1);
				var path =local_url.substr(0, event.detail.image.lastIndexOf('/') + 1);
				return path+"cache/"+filename;
			}

		},
		clear: function() {
		if(DEBUG) console.log('DocumentCollection.clear()');
			this.collection.splice(0, this.collection.length);
			this.count = this.collection.length; 
		},
		add: function(item) {
		if(DEBUG) console.log('DocumentCollection.add()');
			if(!this.exist(item)) {
				// Pass a reference to this collection to the item beeing added
				// This lets the item call back collection method upload
				item.parent = this;	 
				this.collection.push(item);
				this.count = this.collection.length;
			}
			else {
				alert('Item already exists ...');
			}
		},
		remove: function(idx) {
		if(DEBUG) console.log('DocumentCollection.remove()');
			if(this.collection[idx]!=undefined) {
				this.collection.splice(idx, 1);
				this.count = this.collection.length;
			}
		},
		removeById: function(id) {
		if(DEBUG) console.log('DocumentCollection.removeById()');
		var result  = this.collection.filter(function(o){return o.id == id;} );
			result ? this.collection.splice(this.collection.indexOf(result[0]), 1) : alert('Item not found ...');
		},
		exist: function(item) {
			if($.grep(this.collection, function(e) { return e.id == item.id; }).length===0) {
				return false;
			}
			else {
				return true;
			}
		},
		item: function(idx) {
		if(DEBUG) console.log('DocumentCollection.item(' + idx + ')');
			if(this.collection[idx]!=undefined) {
				return this.collection[idx];
			}
			return undefined;
		},
		itemById: function(id) {
		if(DEBUG) console.log('DocumentCollection.itemById(' + id + ')');
		var result  = this.collection.filter(function(o){return o.id == id;} );
			return result ? result[0] : null; // or undefined			
		},
		addEventListener: function(name, handler, capture) {
		if(DEBUG) console.log('DocumentCollection.addEventListener()');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//				alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
		if(DEBUG) console.log('Enter DocumentCollection.removeEventListener() ...');
		    if (!this.events) return;
		    if (!this.events[name]) return;
		    for (var i = this.events[name].length - 1; i >= 0; i--) {
		        if (this.events[name][i] == handler) {
		            this.events[name].splice(i, 1);
		            if(!this.events[name].length) {
//			            	console.log('No more Events');
		            	delete this.events[name];
		            }
		            else {
//				            console.log('Nb of Events: ' + this.events[name].length);
		            }
		        }
		    }
//			    console.log(JSON.stringify(this.events));
		},
		dispatchEvent: function(event) {
//		if(DEBUG) console.log('Executing DocumentCollection.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		if(DEBUG) console.log('Registered Events: ' + JSON.stringify(this.events[event.type]));
		var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//			   		console.log('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		if(DEBUG) console.log('DocumentCollection.AssignEvent()');
		var thisDocumentCollection = this;
			if (element!==null && typeof element==='object') {
//				console.log('It is an Object');
				thisDocumentCollection.objectId = new Object();
				thisDocumentCollection.objectId = element;
				thisDocumentCollection.objectId.addEventListener('DocumentCollection', 'onDocumentCollection', false);
			}
			else {
//				console.log('It is an HTML Element');
				thisDocumentCollection.htmlElement = element;
				document.getElementById(thisDocumentCollection.htmlElement).addEventListener("DocumentCollection", onDocumentCollection, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) console.log('DocumentCollection.FireEvent()');
		var thisDocumentCollection = this;
			thisDocumentCollection.DocumentCollectionEvent.detail.count = thisDocumentCollection.count;
			thisDocumentCollection.DocumentCollectionEvent.detail.items = thisDocumentCollection.collection;
			
			if((thisDocumentCollection.DocumentCollectionEvent.detail.action=='UPLOADED') || (thisDocumentCollection.DocumentCollectionEvent.detail.action=='LOADED')) {
				if (thisDocumentCollection.objectId!=null){
//					console.log('Event fired to an Object');
					thisDocumentCollection.objectId.dispatchEvent(thisDocumentCollection.DocumentCollectionEvent);
				}
				if(thisDocumentCollection.htmlElement!=null) {
//					console.log('Event fired to an HTML Element');
					document.getElementById(thisDocumentCollection.htmlElement).dispatchEvent(thisDocumentCollection.DocumentCollectionEvent);
				}
			}
		},
		upload: function() {
		if(DEBUG) console.log('DocumentCollection.upload()');
//		if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DocumentCollection.upload(): Executing ...');
		var thisDocumentCollection = this;
			if(thisDocumentCollection.uploadIdx < thisDocumentCollection.collection.length) {
				thisDocumentCollection.collection[thisDocumentCollection.uploadIdx++].startUpload();
			}
			else {
				thisDocumentCollection.DocumentCollectionEvent.detail.action='UPLOADED';
				thisDocumentCollection.fireEvent();
			}
			
		},
		store: function() {
		if(DEBUG) console.log('DocumentCollection.store()');
			localStorage.setItem('DocumentCollection', JSON.stringify(this.collection));
		},
		restore: function() {
		if(DEBUG) console.log('DocumentCollection.restore()');
		var objects = JSON.parse(localStorage.getItem('DocumentCollection'));
			this.clear();
			for(var idx=0; idx<objects.length; idx++) { 
				var item = new Document(objects[idx].id, objects[idx].document_type_id, objects[idx].name, objects[idx].description, objects[idx].local_url, objects[idx].server_url, objects[idx].created, objects[idx].uploaded);
				this.add(item);
			}
			this.count = this.collection.length;
			this.fireEvent();
		},
		unstore: function() {
		if(DEBUG) console.log('DocumentCollection.unstore()');
			localStorage.removeItem('DocumentCollection');
		},
		isStored: function() {
		if(DEBUG) console.log('DocumentCollection.isStored()');
		var storage = localStorage.getItem('DocumentCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return DocumentCollection;
	
})();