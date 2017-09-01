/**
 * 
 */
var ApplicationBackupManager = (function () {
	var ApplicationBackupManager = function () {
//		if(DEBUG) console.log('Enter ApplicationBackupManager() Constructor...');
		this.appRootDirectory = '';
		this.appDBDirectory = '';
		this.appCacheDirectory = '';
		this.appFileDirectory = '';
		
		this.devRootDirectory = '';
		this.devBackupRootDirectory  = '';
		this.devBackupDBSubDirectory = '';
		this.devBackupImageSubDirectory = '';
		this.devBackupFileSubDirectory = '';
		
		this.backupDateTime = null;
		
		this.htmlElement = null;
		this.objectId = null;
		this.selfObjectId = this;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.ApplicationBackupManagerEvent = new CustomEvent("ApplicationBackupManager", {
				detail: {
					action: '',
					result: '',
					appRootDirectory: null,
					appDBDirectory: null,
					appCacheDirectory: null,
					appFileDirectory: null,
					devRootDirectory: null,
					devBackupRootDirectory: null,
					devBackupDBSubDirectory: null,
					devBackupImageSubDirectory: null,
					devBackupFileSubDirectory: null,
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.ApplicationBackupManagerEvent = new CustomEvent("ApplicationBackupManager", {
					detail: {
						appRootDirectory: null,
						appDBDirectory: null,
						appCacheDirectory: null,
						appFileDirectory: null,
						devRootDirectory: null,
						devBackupRootDirectory: null,
						devBackupDBSubDirectory: null,
						devBackupImageSubDirectory: null,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.ApplicationBackupManagerEvent = document.createEvent("CustomEvent");
				this.ApplicationBackupManagerEvent.initCustomEvent('ApplicationBackupManager', true, false, {action: '', result: '', appRootDirectory: null, appDBDirectory: null, appCacheDirectory: null, appFileDirectory: null, devRootDirectory: null, devBackupRootDirectory: null, devBackupDBSubDirectory: null, devBackupImageSubDirectory: null, time: new Date()});
			}
		}
		this.init();
		if(DEBUG) console.log('Exit ApplicationBackupManager Constructor...');
	};

	ApplicationBackupManager.prototype = {
		INFO_STATUS: {Undefined: 'Undefined', Success: 'Success', Error: 'Error'},
		init: function() {
		if(DEBUG) console.log('ApplicationBackupManager.init()');
			this.initApplicationFileSystem();
			this.initDeviceFileSystem();
		},
		initApplicationFileSystem: function() {
		if(DEBUG) console.log('AppFileSystem.initAppFileSystem()');
		var thisAppBackupMgr = this;
		var fsRoot = null;
		
			window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, 
		    	function onSuccess(fileSystem) {
		    		console.log('App FileSystem Success');
					fsRoot = fileSystem;
	    	        fsRoot.getDirectory("", {create: true, exclusive: false}, 
	    	        	function onDirectorySuccess(directory) {
    	  					console.log('App Root Directory Success');
	    	        		thisAppBackupMgr.appRootDirectory = directory;
	    	        		fsRoot.getDirectory("databases/", {create: true, exclusive: false},
	    	        			function onDirectorySuccess(directory) {
	    	        				console.log('App Database Directory Success');
	    	        				thisAppBackupMgr.appDBDirectory = directory;
	    	        				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
	    	        			        	function onFileSystemSuccess(fileSystem) {
	    	        			        		var fs = fileSystem;
	    	        			    	  		fs.root.getDirectory("Android/data/" + appInfo.applicationId + "/cache", {create: true, exclusive: false}, 
	    	        			    	  			function onDirectorySuccess(directory) {
	    	        			    	  				console.log('App Cache Directory Success');
	    	        			    	  				thisAppBackupMgr.appCacheDirectory = directory;
														//alert("joket:getDirectory:="+JSON.stringify(directory));
	    	        	    	        				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
	    	        	    	        			        	function onFileSystemSuccess(fileSystem) {
	    	        	    	        			        		var fs = fileSystem;
	    	        	    	        			    	  		fs.root.getDirectory("Android/data/" + appInfo.applicationId + "/files", {create: true, exclusive: false}, 
	    	        	    	        			    	  			function onDirectorySuccess(directory) {
	    	        	    	        			    	  				console.log('App Files Directory Success');
																			//alert("joket: backup initAppFileSystem directory = "+ JSON.stringify(directory));
	    	        	    	        			    	  				thisAppBackupMgr.appFileDirectory = directory;
	    	        	    	        			    	  			}, 
	    	        	    	        			    	  			function onDirectoryFail(error) {
	    	        	    	        			    	  				console.log('App File Directory Error: '  + error.code + ' / ' + error.source);
	    	        	    	        			    	  				thisAppBackupMgr.appFileDirectory = null;
	    	        	    	        			    	  		}); 
	    	        	    	        				        }, 
	    	        	    	        				        function onFileSystemFail(error) {
	    	        	    	        				        	console.log('App File Directory: FileSystem Error: '  + error.code + ' / ' + error.source);
	    	        	    	        		   	  				thisAppBackupMgr.appFileDirectory = null;
	    	        	    	        				        }
    	        	    	        					);
	    	        			    	  			}, 
	    	        			    	  			function onDirectoryFail(error) {
	    	        			    	  				console.log('App Cache Directory Error: '  + error.code + ' / ' + error.source);
	    	        			    	  				thisAppBackupMgr.appCacheDirectory = null;
	    	        			    	  		}); 
	    	        				        }, 
	    	        				        function onFileSystemFail(error) {
	    	        				        	console.log('App Cache Directory: FileSystem Error: '  + error.code + ' / ' + error.source);
	    	        		   	  				thisAppBackupMgr.appCacheDirectory = null;
	    	        				        }
    	        					);
	    	        			},
	    	        			function onDirectoryFail(error){
	    	    	    	  		console.log('App Database Directory Error: '  + error.code + ' / ' + error.source);
	    	        				thisAppBackupMgr.appDBDirectory = null;
	    	        			}
	    	        		);
	    	        	},
	    	    	  	function onDirectoryFail(error) {
	    	    	  		console.log('App Root Directory Error: '  + error.code + ' / ' + error.source);
	    	    	  		thisAppBackupMgr.appRootDirectory = null;
	    					thisAppBackupMgr.appDBDirectory = null;
	    					thisAppBackupMgr.appCacheDirectory = null;
	    	    	  	}
	    			);
				},
				function onFail(error) {
						console.log('App FileSystem Error: '  + error.code + ' / ' + error.source);
						thisAppBackupMgr.appRootDirectory = null;
						thisAppBackupMgr.appDBDirectory = null;
						thisAppBackupMgr.appCacheDirectory = null;
				}
			);
		},
		initDeviceFileSystem: function() {
//		if(DEBUG) console.log('ApplicationBackupManager.initDeviceFileSystem()');
		console.log("ApplicationBackupManager.initDeviceFileSystem(): joket");
		var thisAppBackupMgr = this;
		
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
		    	function onSuccess(fileSystem) {
		    		console.log('Local (backup) FileSystem Success');
		    		fileSystem.root.getDirectory("RenelApps/", {create: true, exclusive: false},
		    			function onDirectorySuccess(directory) {
		    				thisAppBackupMgr.devRootDirectory = directory;
    	  					console.log('Dev Backup Root Directory Success');
    	  					thisAppBackupMgr.devRootDirectory.getDirectory("RenelAppFSEmployee/", {create: true, exclusive: false},
    	  						function onDirectorySuccess(directory) {
    	  							console.log('Dev Backup Application Sub-Directory Success');
    	  							thisAppBackupMgr.devBackupRootDirectory = directory;
    	  							thisAppBackupMgr.devBackupRootDirectory.getDirectory("databases/", {create: true, exclusive: false}, 
   	  					    			function onDirectorySuccess(directory) {
   	  						  				console.log('Dev Backup Application DB SubDirectory Success');
   	  						  				thisAppBackupMgr.devBackupDBSubDirectory = directory;
   	  						  				thisAppBackupMgr.devBackupRootDirectory.getDirectory("images/", {create: true, exclusive: false},
	  						  					function onDirectorySuccess(directory) {
	  						  						console.log('Dev Backup Application Images SubDirectory Success');
	    	  						  				thisAppBackupMgr.devBackupImageSubDirectory = directory;
	    	  						  				thisAppBackupMgr.devBackupRootDirectory.getDirectory("files/", {create: true, exclusive: false},
	    	   	  						  					function onDirectorySuccess(directory) {
	    	   	  						  						console.log('Dev Backup Application Files SubDirectory Success');
	    	   	    	  						  				thisAppBackupMgr.devBackupFileSubDirectory = directory;
																console.log('joket: Renelco_cordova_backup.js init Device File system function success');
	    	   	    	  						  				
	    	   	  						  					},
	    	   	  						  					function onDirectoryFail(error) {
	    	   	    	  						  				console.log('Dev Backup Application Files SubDirectory Error: ' + error.code + ' / ' + error.source);
	    	   	    	  						  				thisAppBackupMgr.devBackupFileSubDirectory = null;
	    	   	  						  					}
   	   	  						  					);	
   	  						  					},
   	  						  					function onDirectoryFail(error) {
   	    	  						  				console.log('Dev Backup Application Images SubDirectory Error: ' + error.code + ' / ' + error.source);
   	    	  						  				thisAppBackupMgr.devBackupImageSubDirectory = null;
   	  						  					}
   	  						  				);	
   	  					    			},
   	  					    			function onDirectoryFail(error) {
   	  						  				console.log('Dev Backup Application DB SubDirectory Error: ' + error.code + ' / ' + error.source);
   	  						  				thisAppBackupMgr.devBackupDBSubDirectory = null;
   	  						  				thisAppBackupMgr.devBackupImageSubDirectory = null;
   	  					    			}
   	  					    		);
    	  							
    	  						},
    	  						function onDirectoryFail(error) {
    	  							console.log('Dev Backup Application Sub-Directory Error: ' + error.code + ' / ' + error.source);
    	  							thisAppBackupMgr.devBackupRootDirectory = null;
					  				thisAppBackupMgr.devBackupDBSubDirectory = null;
					  				thisAppBackupMgr.devBackupImageSubDirectory = null;
    	  						}
    	  					);
		    			},
		    			function onDirectoryFail(error) {
    	  					console.log('Dev Backup Root Directory Error: ' + error.code + ' / ' + error.source);
	    	        		thisAppBackupMgr.devRootDirectory = null;
  							thisAppBackupMgr.devBackupRootDirectory = null;
			  				thisAppBackupMgr.devBackupDBSubDirectory = null;
			  				thisAppBackupMgr.devBackupImageSubDirectory = null;
		    			}
		    		);
		    		
		    	},
		    	function onFail(error) {
	        	    console.log('Device FileSystem (backup): FileSystem Error: ' + error.code + ' / ' + error.source);
	  				thisAppBackupMgr.devRootDirectory = null;
					thisAppBackupMgr.devBackupRootDirectory = null;
	  				thisAppBackupMgr.devBackupDBSubDirectory = null;
	  				thisAppBackupMgr.devBackupImageSubDirectory = null;
		    	}
		    );
		},
		backup: function() {
		if(DEBUG) console.log('ApplicationBackupManager.backup()');
			this.backupDateTime = new Date();
			this.backupCache();
			console.log("joket:backup ok");
			this.backupFiles();
			console.log("joket; backup File ok");
			this.backupDatabases();
			console.log("joket: backup databases");
		},
		backupCache: function() {
		if(DEBUG) console.log('ApplicationBackupManager.backupCache()');
		var thisAppBackupMgr = this;
		var dirReader = thisAppBackupMgr.appCacheDirectory.createReader();
			dirReader.readEntries(
				function listDirSuccess(entries){ 
					// success get files and folders
					console.log('Files on directory: ' + thisAppBackupMgr.appCacheDirectory.fullPath);
					//alert('joket:appCacheDirectory in backupCache function :='+ JSON.stringify(thisAppBackupMgr.appCacheDirectory)+"  entries:="+ JSON.stringify(entries));
					for(var i=0; i<entries.length; ++i){
						console.log(entries[i].name);
						//alert("joket: devBackupImageSubDirectory:="+JSON.stringify(thisAppBackupMgr.devBackupImageSubDirectory));
						entries[i].copyTo(thisAppBackupMgr.devBackupImageSubDirectory, /*'img_' + */ entries[i].name,
							function onFileCopySuccess(entry) {
								console.log('File ' + entry.fullPath + ' copied successfully ...');
							},
							function onFileCopyError(error) {
								console.log('FileCopy Error: ' + error);
							}
						);
					}
				},
				function listDirError(error){
					// Error go fuck with it
					alert(error.code);
				}
			);
		},
		backupFiles: function() {
		if(DEBUG) console.log('ApplicationBackupManager.backupFiles()');
		var thisAppBackupMgr = this;
		var dirReader = thisAppBackupMgr.appFileDirectory.createReader();
			dirReader.readEntries(
				function listDirSuccess(entries){ 
					// success get files and folders
					console.log('Files on directory: ' + thisAppBackupMgr.appFileDirectory.fullPath);
					for(var i=0; i<entries.length; ++i){
						console.log(entries[i].name);
						entries[i].copyTo(thisAppBackupMgr.devBackupFileSubDirectory, entries[i].name + '-' + getDateTimeString(thisAppBackupMgr.backupDateTime),
							function onFileCopySuccess(entry) {
								console.log('File ' + entry.fullPath + ' copied successfully ...');
							},
							function onFileCopyError(error) {
								console.log('FileCopy Error: ' + error);
							}
						);
					}
				},
				function listDirError(error){
					// Error go fuck with it
					alert(error.code);
				}
			);
		},
		backupDatabases: function() {
		if(DEBUG) console.log('ApplicationBackupManager.backupDatabases()');
		var thisAppBackupMgr = this;
		var dirReader = thisAppBackupMgr.appDBDirectory.createReader();
			dirReader.readEntries(
				function listDirSuccess(entries){ 
					// success get files and folders
					console.log('Files on directory: ' + thisAppBackupMgr.appDBDirectory.fullPath);
					for(var i=0; i<entries.length; ++i){
						console.log(entries[i].name);
						entries[i].copyTo(thisAppBackupMgr.devBackupDBSubDirectory, entries[i].name + '-' + getDateTimeString(thisAppBackupMgr.backupDateTime) + '.db',
							function onFileCopySuccess(entry) {
								console.log('File ' + entry.fullPath + ' copied successfully ...');
							},
							function onFileCopyError(error) {
								console.log('FileCopy Error: ' + error);
							}
						);
					}
				},
				function listDirError(error){
					// Error go fuck with it
					alert(error.code);
				}
			);
		},
		addEventListener: function(name, handler, capture) {
//		if(DEBUG) alert('Enter ApplicationBackupManager.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		if(DEBUG) alert('Enter ApplicationBackupManager.removeEventListener() ...');
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
//		if(DEBUG) alert('Executing ApplicationBackupManager.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
//		if(DEBUG) alert('ApplicationBackupManager.AssignEvent');
		var thisAppBackupMgr = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisAppBackupMgr.objectId = new Object();
				thisAppBackupMgr.objectId = element;
				thisAppBackupMgr.objectId.addEventListener('ApplicationBackupManager', 'onApplicationBackupManager', false);
			}
			else {
//				alert('It is an HTML Element');
				thisAppBackupMgr.htmlElement = element;
				document.getElementById(thisAppBackupMgr.htmlElement).addEventListener("ApplicationBackupManager", onApplicationBackupManager, false);
			}
		},
		fireEvent: function() {
//		if(DEBUG) alert('ApplicationBackupManager.FireEvent');
		var thisAppBackupMgr = this;
			/* 
			 * Set Event detail information here ... 
			 */
			if (thisAppBackupMgr.objectId!=null){
//				alert('Event fired to an Object');
				thisAppBackupMgr.objectId.dispatchEvent(thisAppBackupMgr.ApplicationBackupManagerEvent);
			}
			if(thisAppBackupMgr.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisAppBackupMgr.htmlElement).dispatchEvent(thisAppBackupMgr.ApplicationBackupManagerEvent);
			}
		}
	};
	return ApplicationBackupManager;
})();
