//////////////////////////////////////////////////
// Define DatabaseManager Class
//////////////////////////////////////////////////

/** DatabaseManager
 * This class encapsulates the RenelcoBMA Local Database.
 *
 */	
/**
 * @author Renelco
 */
/**
 *  DatabaseManager Class Definition 
 */
var DatabaseManager = (function () {
	var DatabaseManager = function (urlDataServer, urlPhpServices, dbFilePath, dbName) {
		if(DEBUG) alert('Enter DatabaseManager() Constructor...');
		this.MAX_RETRIES =5;
		this.webServerBaseUrl = urlDataServer || '';
		this.urlPhpServices = urlPhpServices || '';
		this.localFilePath = dbFilePath || '';
		this.nbRetries = 0;
		
		this.dbName = dbName || '';
		this.dbFullName = '';
		this.version = '1.0';
		this.description = 'RenelcoBMA Local Database';
		this.size = (2048 * 2048);
		this.localDB = null;
		this.status = this.DB_STATUS.Undefined;
		
		this.htmlElement = null;	
		this.objectId = null;
		this.selfObjectId = this;	// Self-assigned, used for Table Creation internal Event Handling
		this.selfObjectId.addEventListener('DatabaseManager', 'onDatabaseManager', false);
		this.selfObjectId.addEventListener('FileDownload', 'onFileDownload', false);
		this.selfObjectId.addEventListener('FileUpload', 'onFileUpload', false);
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.DatabaseManagerEvent = new CustomEvent("DatabaseManager", {
				detail: {
					action: 'UNDEFINED',
					result: '',
					status: this.DB_STATUS.Undefined,
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.DatabaseManagerEvent = new CustomEvent("DatabaseManager", {
					detail: {
						action: 'UNDEFINED',
						result: '',
						status: this.DB_STATUS.Undefined,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.DatabaseManagerEvent = document.createEvent("CustomEvent");
				this.DatabaseManagerEvent.initCustomEvent('DatabaseManager', true, false, {action: 'UNDEFINED', result: '', status: this.DB_STATUS.Undefined, time: new Date()});
			}
		}
		
		this.dbDownloader = new FileDownloader(this.webServerBaseUrl + '/downloads/' + dbDownload + '/' + this.dbName + '.db');
		this.dbDownloader.assignEvent(this.selfObjectId);
		this.dbUploader = new FileUploader(this.webServerBaseUrl + '/uploads');
		this.dbUploader.assignEvent(this.selfObjectId);
		
		if(DEBUG) alert('Exit DatabaseManager Constructor...');
	};

	DatabaseManager.prototype = {
		DB_STATUS: {Undefined: 'Undefined', Downloaded: 'Downloaded', Opened: 'Opened', Unopened: 'Unopened', Closed: 'Closed', Uploaded: 'Uploaded', NotUploaded: 'NotUploaded', Synchronizing: 'Synchronizing', Synchronized: 'Synchronized', NotSynchronized: 'NotSynchronized', SynchronizingOnExit: 'SynchronizingOnExit', SynchronizedOnExit: 'SynchronizedOnExit', NotSynchronizedOnExit: 'NotSynchronizedOnExit'},
		initialize: function() {
		if(DEBUG) alert('DatabaseManager.initialize()');
		var thisDatabaseManager = this;
			if((localStorage.getItem('LocalDB')!='') && (localStorage.getItem('LocalDB')!=undefined)) {
//				console.log('Database already exists: ' + localStorage.getItem('LocalDB'));
				if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.initialize(): Database already exists: ' + localStorage.getItem('LocalDB'));

				if(thisDatabaseManager.isCurrentDB()) {
//					console.log('Current Database already loaded. Nothing more to do than just open it.');
					if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.initialize(): Current Database already loaded. Nothing more to do than just open it.');
					thisDatabaseManager.open();
				}
				else {
//					console.log('Sounds like Previous DB still on Device: Should be Uploaded & Synchronized first');
					if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Warning, 'DatabaseManager.initialize(): Sounds like Previous DB still on Device: Should be Uploaded & Synchronized first');
					thisDatabaseManager.status = thisDatabaseManager.DB_STATUS.Synchronizing;
					thisDatabaseManager.DatabaseManagerEvent.detail.status = thisDatabaseManager.DB_STATUS.NotSynchronized;
					thisDatabaseManager.fireEvent();
				}
			}
			else {
//				console.log('NO Database loaded.');
				if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.initialize(): NO Database loaded.');
				thisDatabaseManager.checkLocalDBFileOnServer();
			}
		},
		checkLocalDBFileOnServer: function() {
		if(DEBUG) alert('DatabaseManager.checkLocalDBFileOnServer()');
		var thisDatabaseManager = this;
			phoneui.showActivityDialog('Checking Data...');
			$.ajax ({
				type: "GET",
				url: thisDatabaseManager.urlPhpServices,
				data: {"action": 'dbexist', "dbname": thisDatabaseManager.dbName + '.db'},
				datatype: "text",
				timeout: 600000,
				success: function(data)	{
					if(data.trim()=='SUCCESS') {
//						if(DEBUG) alert('Required SQLite Database File exists on Server');
						if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.checkLocalDBFileOnServer(): Required SQLite Database File exists on Server');
						thisDatabaseManager.initLocalDB();
					}
					else {
//						if(DEBUG) alert('Required SQLite Database File doesn\'t exist on Server.');
						if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Warning, 'DatabaseManager.checkLocalDBFileOnServer(): Required SQLite Database File doesn\'t exist on Server.');
						thisDatabaseManager.createLocalDBFileOnServer();
					}
				},
				error: function(xhr, status, error) {
					alert('Something went wrong.\n' +
						  'Status: ' + status + '\n' +
						  'Error: ' + error + '\n');
//					alert('Local Database ' + DBName + '.db' + ' not available. Exiting ...');
					if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'DatabaseManager.checkLocalDBFileOnServer(): Local Database ' + DBName + '.db' + ' not available. Exiting ...');
					setTimeout( function() { navigator.app.exitApp(); });
				}
			});
			
		},
		synchronize: function(dbname) {
		if(DEBUG) alert('DatabaseManager.synchronize()');
		var thisDatabaseManager = this;
			if(thisDatabaseManager.status==thisDatabaseManager.DB_STATUS.SynchronizingOnExit) {
				phoneui.showActivityDialog('Synchronizing Data...');
			}
			else {
				phoneui.showActivityDialog('Synchronizing Data...');
			}
			$.ajax ({
				type: "GET",
				url: thisDatabaseManager.urlPhpServices,
				data: {"action": 'synchronize', "dbname": dbname + '.db'},
				datatype: "text",
				timeout: 600000,
				success: function(data) {
					alert("joket successfull synchronization");
					if(data.trim()=='SUCCESS') {
					    if(DEBUG) alert('Database ' + dbname + ' synchronized successfully. Exiting ...');
						if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.synchronize(): Database ' + dbname + ' synchronized successfully. Exiting ...');
						if(thisDatabaseManager.status==thisDatabaseManager.DB_STATUS.SynchronizingOnExit) {
							thisDatabaseManager.DatabaseManagerEvent.detail.status = thisDatabaseManager.DB_STATUS.SynchronizedOnExit;
						}
						else {
							thisDatabaseManager.DatabaseManagerEvent.detail.status = thisDatabaseManager.DB_STATUS.Synchronized;
						}
					}
					else {
						if(DEBUG) alert('Failed to synchronize Local Database. Exiting ...');
						if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'DatabaseManager.synchronize(): Failed to synchronize Local Database. Exiting ...');
						if(thisDatabaseManager.status==thisDatabaseManager.DB_STATUS.SynchronizingOnExit) {
							thisDatabaseManager.DatabaseManagerEvent.detail.status = thisDatabaseManager.DB_STATUS.NotSynchronizedOnExit;
						}
						else {
							thisDatabaseManager.DatabaseManagerEvent.detail.status = thisDatabaseManager.DB_STATUS.NotSynchronized;
						}
					}
					thisDatabaseManager.fireEvent();
				},
				error: function(xhr, status, error) {
					alert('Something went wrong.\n' +
						  'Status: ' + status + '\n' +
						  'Error: ' + error + '\n');
					if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'DatabaseManager.synchronize(): Something went wrong - Status: ' + status + ' / Error: ' + error);
					if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'DatabaseManager.synchronize(): Local Database not synchronized. Exiting ...');
					setTimeout( function() { navigator.app.exitApp(); });
				}
			});
		},
		createLocalDBFileOnServer: function() {
		if(DEBUG) alert('DatabaseManager.createLocalDBFileOnServer()');
		var thisDatabaseManager = this;
			
			phoneui.showActivityDialog('Creating Database...');
			$.ajax ({
				type: "GET",
				url: thisDatabaseManager.urlPhpServices,
				data: {"action": 'create', "dbname": thisDatabaseManager.dbName + '.db'},
				datatype: "text",
				timeout: 600000,
				success: function(data) {
					if(data.trim()=='SUCCESS') {
					    if(DEBUG) alert('Database ' + $('#txtDBName').val() + ' created successfully.');
						if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.createLocalDBFileOnServer(): Database ' + thisDatabaseManager.dbName + '.db' + ' created successfully.');
					    thisDatabaseManager.initLocalDB();
					}
					else {
						if(DEBUG) alert('Local Database ' + thisDatabaseManager.dbName + '.db' + ' not available. Exiting ...');
						if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'DatabaseManager.createLocalDBFileOnServer(): Local Database ' + thisDatabaseManager.dbName + '.db' + ' not available. Exiting ...');
						setTimeout( function() { navigator.app.exitApp(); });
					}
					
				},
				error: function(xhr, status, error) {
					alert('Something went wrong.\n' +
						  'Status: ' + status + '\n' +
						  'Error: ' + error + '\n');
//					alert('Local Database ' + thisDatabaseManager.dbName + '.db' + ' not available. Exiting ...');
					if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'DatabaseManager.createLocalDBFileOnServer(): Something went wrong - Status: ' + status + ' / Error: ' + error);
					if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'DatabaseManager.createLocalDBFileOnServer(): Local Database ' + thisDatabaseManager.dbName + '.db' + ' not available. Exiting ...');
					setTimeout( function() { navigator.app.exitApp(); });
				}
			});
		},
		checkLocalDBFileOnDevice: function() {
		if(DEBUG) alert('DatabaseManager.checkLocalDBFileOnDevice()');
		var thisDatabaseManager = this;
			window.resolveLocalFileSystemURL('file:///data/data/' + appId + '/databases/' + thisDatabaseManager.dbName, 
											 function() {
												if(DEBUG) alert('DB File "/data/data/' + appId + '/databases/' + thisDatabaseManager.dbName + '" exists');
												if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.checkLocalDBFileOnDevice(): DB File "/data/data/' + appId + '/databases/' + thisDatabaseManager.dbName + '" exists');
												return true;
											 }, 
											 function() {
												if(DEBUG) alert('DB File "/data/data/' + appId + '/databases/' + thisDatabaseManager.dbName + '" is missing...');
												if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'DatabaseManager.checkLocalDBFileOnDevice(): DB File "/data/data/' + appId + '/databases/' + thisDatabaseManager.dbName + '" is missing...');
												return false;
											 });
		},
		isCurrentDB: function() {
		if(DEBUG) alert('DatabaseManager.isCurrentDB()');
		var thisDatabaseManager = this;
		var strCurDate = getDateString(new Date());
		var strDBDate = localStorage.getItem("LocalDB").substring(localStorage.getItem("LocalDB").lastIndexOf('-') + 1);
			if(strDBDate==strCurDate) {
				if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.isCurrentDB(): Local Database is the current Database.');
				return true;
			}
			if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.isCurrentDB(): Local Database is NOT the current Database (Previous Database has not been yet synchronized.');
			return false;
		},
		initLocalDB: function() {
		if(DEBUG) alert('DatabaseManager.initLocalDB()');
		var thisDatabaseManager = this;
			phoneui.showActivityDialog('Synchronizing...');
			if(networkInfo.isConnected()==true) {
				thisDatabaseManager.download();
			}
			else {
				alert('Network Connection not available. Exiting ...');
				setTimeout( function() { navigator.app.exitApp(); });
			}
		},
		hasDB: function() {
		var thisDatabaseManager = this;
			if(thisDatabaseManager.localDB==null) {
				return false;
			}
			return true;
		},
		show: function() {
			alert('Database Manager Info: \n' +
				  'WebService Url: ' + this.webServiceBaseUrl + '\n' +
				  'DB Name: ' + this.dbName + '\n' +
				  'DB Version: ' + this.version + '\n' +
				  'DB Description: ' + this.description + '\n' +
				  'DB Size: ' + this.size + '\n' +
				  'DB Status: ' + this.status + '\n');
		},
		suppress: function() {
		if(DEBUG) alert('DatabaseManager.DatabaseManager.suppress()');
		var thisDatabaseManager = this;
	    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
	    		function onFileSystemSuccess(fileSystem) {
	            	alert('FileSystem Name: ' + fileSystem.name);
	            	alert('FileSystem ROOT Name: ' + fileSystem.root.name);
	        	},
	        	function fail(evt) {
	        		alert(evt.target.error.code);
	        	});
		},
		open: function(dbname) {
		if(DEBUG) alert('DatabaseManager.open()');	
		var thisDatabaseManager = this;
			try {
				if(dbname==undefined || dbname=='') {
					thisDatabaseManager.localDB = sqlitePlugin.openDatabase({name: thisDatabaseManager.localFilePath + '/' + this.dbName},
						function() {
//							console.log('Local DB Retrieved and Loaded...');
							window.plugins.infobox.showInfo('Local DB Retrieved and Loaded...', 0);
							thisDatabaseManager.DatabaseManagerEvent.detail.status = thisDatabaseManager.DB_STATUS.Opened;
							thisDatabaseManager.fireEvent();
						},
						function(error) {
//							console.log('Local DB Error: ' + error.message);
							window.plugins.infobox.showInfo('Local DB Error: ' + error.message, 1);
							thisDatabaseManager.DatabaseManagerEvent.detail.status = thisDatabaseManager.DB_STATUS.Unopened;
							thisDatabaseManager.fireEvent();
						});
				}
				else {
					thisDatabaseManager.localDB = sqlitePlugin.openDatabase({name: thisDatabaseManager.localFilePath + '/' + dbname},
							function() {
//								console.log('Local DB Retrieved and Loaded...');
								window.plugins.infobox.showInfo('Local DB Retrieved and Loaded...', 0);
								thisDatabaseManager.DatabaseManagerEvent.detail.status = thisDatabaseManager.DB_STATUS.Opened;
								thisDatabaseManager.fireEvent();
							},
							function(error) {
//								console.log('Local DB Error: ' + error.message);
								window.plugins.infobox.showInfo('Local DB Error: ' + error.message, 1);
								thisDatabaseManager.DatabaseManagerEvent.detail.status = thisDatabaseManager.DB_STATUS.Unopened;
								thisDatabaseManager.fireEvent();
							});
				}
			}
			catch(exception) {
				alert('WEBSql Database required ...');
				if (!window.openDatabase) {
					alert('Web SQL not supported on this device');
					this.localDB = null;
					this.status = this.DB_STATUS.Undefined;
					return;
				}
				else {
					this.localDB = openDatabase(this.dbName, this.version, this.description, this.size);
					alert('WEBSql Database restored...');
				}
			}
		},
		// Formerly SyncIn - Now we download the entire DB File already synchronized 
		download: function() {
		if(DEBUG) alert('DatabaseManager.download()');
		var thisDatabaseManager = this;
		
			thisDatabaseManager.dbDownloader.downloadDBFile(thisDatabaseManager.dbName, thisDatabaseManager.localFilePath);
		},
		startUpload: function(dbname) {
		if(DEBUG) alert('DatabaseManager.startUpload()');
		var thisDatabaseManager = this;
			if(dbname==undefined || dbname=='') {
				thisDatabaseManager.dbFullName = '/data/data/' + appId + '/databases/' + thisDatabaseManager.dbName;
			}
			else {
				thisDatabaseManager.dbFullName = '/data/data/' + appId + '/databases/' + dbname;
			}
			thisDatabaseManager.nbRetries = 0;
			thisDatabaseManager.upload();
		},
		// Formerly SyncOut - Now we upload the entire DB File for synchronization
		// Synchronization operations are taken in charge by the RDS Server
		upload: function() {
		if(DEBUG) alert('upload');
		var thisDatabaseManager = this;
			thisDatabaseManager.dbUploader.uploadDBFile(thisDatabaseManager.dbFullName);
		},
		addEventListener: function(name, handler, capture) {
//		if(DEBUG) alert('Enter DatabaseManager.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//					alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		if(DEBUG) alert('Enter DatabaseManager.removeEventListener() ...');
		    if (!this.events) return;
		    if (!this.events[name]) return;
		    for (var i = this.events[name].length - 1; i >= 0; i--) {
		        if (this.events[name][i] == handler) {
		            this.events[name].splice(i, 1);
		            if(!this.events[name].length) {
//				        alert('No more Events');
		            	delete this.events[name];
		            }
		            else {
//					    alert('Nb of Events: ' + this.events[name].length);
		            }
		        }
		    }
//				    alert(JSON.stringify(this.events));
		},
		dispatchEvent: function(event) {
//		if(DEBUG) alert('DatabaseManager.dispatchEvent(' + JSON.stringify(event) + ') ...');
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//				alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		if(DEBUG) alert('DatabaseManager.AssignEvent()');
		var thisDatabaseManager = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisDatabaseManager.objectId = new Object();
				thisDatabaseManager.objectId = element;
				thisDatabaseManager.objectId.addEventListener('DatabaseManager', 'onDatabaseManager', false);
			}
			else {
//				alert('It is an HTML Element');
				thisDatabaseManager.htmlElement = element;
				document.getElementById(thisDatabaseManager.htmlElement).addEventListener("DatabaseManager", onDatabaseManager, false);
			}
		},
		fireEvent: function() {
		if(DEBUG) alert('DatabaseManager.fireEvent()');
		var thisDatabaseManager = this;
			if (thisDatabaseManager.selfObjectId!=null){
//				alert('Event fired to itself');
				thisDatabaseManager.selfObjectId.dispatchEvent(thisDatabaseManager.DatabaseManagerEvent);
			}
			if (thisDatabaseManager.objectId!=null){
//				alert('Event fired to an Object');
				thisDatabaseManager.objectId.dispatchEvent(thisDatabaseManager.DatabaseManagerEvent);
			}
			if(thisDatabaseManager.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisDatabaseManager.htmlElement).dispatchEvent(thisDatabaseManager.DatabaseManagerEvent);
			}
		},
		onDatabaseManager: function(event) {
		if(DEBUG) alert('DatabaseManager.onDatabaseManager(event) received: ' + event.detail.status);
		var thisDatabaseManager = this;
		var dbStatus = event.detail.status; 
			switch(dbStatus) {
				case "Undefined":
					if(DEBUG) alert('DB is Undefined ...');
					if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.onDatabaseManager(event): DB is Undefined ...');
					// Nothing to do here 
					break;
				case "Downloaded":
					if(DEBUG) alert('DB is Downloaded ...');
					if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.onDatabaseManager(event): DB is Downloaded ...');
					thisDatabaseManager.status = thisDatabaseManager.DB_STATUS.Downloaded;
					thisDatabaseManager.open();
					break;
				case "Opened":
					if(DEBUG) alert('DB is Populated and Ready ...');
					if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.onDatabaseManager(event): DB is Populated and Ready ...');
					phoneui.hideActivityDialog();
					if(thisDatabaseManager.status==thisDatabaseManager.DB_STATUS.Synchronizing) {
						// Since its synchronizing, we don't anything ... 
						if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.onDatabaseManager(event): DB is currently synchronizing ...');
					}
					else {
						thisDatabaseManager.status = thisDatabaseManager.DB_STATUS.Opened;
						if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.onDatabaseManager(event): DB is ready for use ...');
						localStorage.setItem("LocalDB", thisDatabaseManager.dbName);
					}
					break;
				case "Unopened":
					// Nothing to do here 
					thisDatabaseManager.status = thisDatabaseManager.DB_STATUS.Unopened;
					break;
				case "Uploaded":
//					// Processed by the Application
					phoneui.hideActivityDialog();
					if(thisDatabaseManager.status==thisDatabaseManager.DB_STATUS.Synchronizing) {
						if(DEBUG) alert('Now we have to synchronized the current Database');
						thisDatabaseManager.synchronize(localStorage.getItem("LocalDB"));
					}
					else {
						thisDatabaseManager.status = thisDatabaseManager.DB_STATUS.Uploaded;
//						localStorage.setItem("LocalDB", '');		// Postponed 'cause we want to synchronize first 
					}
					break;
				case "NotUploaded": 
					if(thisDatabaseManager.nbRetries < thisDatabaseManager.MAX_RETRIES) {
//						window.plugins.infobox.showInfo('Failed to upload Local DB File  ' + thisDatabaseManager.dbName + '. Retrying ... (' + thisDatabaseManager.nbRetries + ' of ' + thisDatabaseManager.MAX_RETRIES + ')', 0);
						if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.onDatabaseManager(event): Failed to upload Local DB File  ' + thisDatabaseManager.dbName + '. Retrying ... (' + thisDatabaseManager.nbRetries + ' of ' + thisDatabaseManager.MAX_RETRIES + ')');
						alert((language==null) ? 'Failed to Upload Database' + ' ' + thisDatabaseManager.dbName + '.\n' + 'Please check Network Signal and press OK' : language.translate('Failed to Upload Database') + ' ' + thisDatabaseManager.dbName + '.\n' + language.translate('Please check Network Signal and press OK'));
						thisDatabaseManager.nbRetries++;
						thisDatabaseManager.upload();
					}
					break;
				case "Synchronized":
					if(DEBUG) alert('Now we have to create/download the current Database');
					if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.onDatabaseManager(event): DB is synchronized. Now we have to create/download the current Database ...');
					localStorage.setItem("LocalDB", '');
					thisDatabaseManager.checkLocalDBFileOnServer();
					break;
				case "NotSynchronized":
//					alert('Failed to synchronize the current Database. Exiting...');
					if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.onDatabaseManager(event): Failed to synchronize the current Database. Retrying...');
//					setTimeout( function() { navigator.app.exitApp(); });
					break;
				case "SynchronizedOnExit":
					if(DEBUG) alert('Now we exit the App');
					localStorage.setItem("LocalDB", '');
					break;
				case "NotSynchronizedOnExit":
					alert('Failed to synchronize the current Database...');
					if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.onDatabaseManager(event): Failed to synchronize the current Database. Retrying...');
//					setTimeout( function() { navigator.app.exitApp(); });
					break;
				default:
					break;
			}
		},
		onFileDownload: function(event) {
		if(DEBUG) alert('DatabaseManager.onFileDownload(event) received.');
		var thisDatabaseManager = this;
			if(event.detail.status=='OK') {
				if(DEBUG) alert('Database Downloaded');
				if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.onFileDownload(event): Database File Downloaded.');
				thisDatabaseManager.DatabaseManagerEvent.detail.status = this.DB_STATUS.Downloaded;
			}
			else {
				if(DEBUG) alert('Failed to download Database File');
				if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Error, 'DatabaseManager.onFileDownload(event): Failed to download Database File.');
				thisDatabaseManager.DatabaseManagerEvent.detail.status = this.DB_STATUS.Undefined;
			}
			thisDatabaseManager.fireEvent();
		},
		onFileUpload: function(event) {
		if(DEBUG) alert('DatabaseManager.onFileUpload(event) received.');
		var thisDatabaseManager = this;
			if(event.detail.info==200) {
			if(DEBUG) alert('Database uploaded');
			if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.onFileUpload(event): Database File uploaded.');
				thisDatabaseManager.DatabaseManagerEvent.detail.action = 'UPLOAD';
				thisDatabaseManager.DatabaseManagerEvent.detail.result = 'SUCCESS';
				thisDatabaseManager.DatabaseManagerEvent.detail.status = this.DB_STATUS.Uploaded;
				thisDatabaseManager.fireEvent();
			}
			else {
			if(DEBUG) alert('Failed to upload Database');
				if(log) log.writeLog(LogFile.prototype.MSG_TYPE.Info, 'DatabaseManager.onFileUpload(event): Failed to upload Database File.');
				switch(event.detail.info) {
					case 1:
						console.log('Failed to retrieve local Database');
						break;
					case 2:
						break;
					case 3:
						console.log('Failed to upload Database (Check Network Connection)');
						break;
				}
				thisDatabaseManager.DatabaseManagerEvent.detail.action = 'UPLOAD';
				thisDatabaseManager.DatabaseManagerEvent.detail.result = 'ERROR';
				thisDatabaseManager.DatabaseManagerEvent.detail.status = this.DB_STATUS.NotUploaded;
				thisDatabaseManager.fireEvent();
			}
		}
	};

	return DatabaseManager;
})();

