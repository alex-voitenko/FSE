var FileUploader = (function() {
	var FileUploader = function(serverURL, fileURI) {
		if(DEBUG) alert('Enter Constructor FileUploader()');
		this.serverURL = serverURL ||  null;
		this.fileURI = fileURI || null;
		this.ft = new FileTransfer();
		this.options = new FileUploadOptions();
		this.info = null;
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			if(DEBUG) alert('FileUploader(): DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.FileUploaderEvent = new CustomEvent ("FileUploader", {
				detail: {
					info: null,
					filename: null,
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				if(DEBUG) alert('FileUploader(): KitKat Device...');
				this.FileUploaderEvent = new CustomEvent ("FileUploader", {
					detail: {
						info: null,
						filename: null,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				if(DEBUG) alert('FileUploader(): NOT a KitKat Device...');
				this.FileUploaderEvent = document.createEvent("CustomEvent");
				this.FileUploaderEvent.initCustomEvent('FileUploader', true, false, {info: null, filename: null, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Constructor FileUploader()');
	};
	FileUploader.prototype = {
		uploadImage: function(image, newFilename) {
		if(DEBUG) alert('FileUploader.uploadImage()');
			var thisFileUploader = this;
			thisFileUploader.fileURI = image; // Previously image.src but we don't pass image object as argument anymore, but the filename. 

			if(thisFileUploader.serverURL!=null) {
				thisFileUploader.options.fileKey = "file";
				thisFileUploader.options.fileName = (newFilename==null) ? thisFileUploader.fileURI.substr(thisFileUploader.fileURI.lastIndexOf('/') + 1) : newFilename;
				thisFileUploader.options.mimeType = "image/jpeg";
				thisFileUploader.options.chunckedMode = false;
				thisFileUploader.options.headers = { Connection: "close" };
//				alert('Uploading photo....' + JSON.stringify(thisFileUploader.options) + ' - ' + thisFileUploader.serverURL); 
				
				thisFileUploader.fileURI = thisFileUploader.fileURI.replace("sdcard0","emulated/0");
				//alert("joket: image upload uri: source url = "+ thisFileUploader.fileURI);
				//thisFileUploader.fileURI ="file:///storage/emulated/0/"
				thisFileUploader.ft.upload(thisFileUploader.fileURI, encodeURI(thisFileUploader.serverURL+'/upload.php?sub_path=' + picUploadSubDir),
						
					function onSuccess(response) {
//					    alert("Code = " + response.responseCode);
//					    alert("Response = " + response.response);
//					    alert("Sent = " + response.bytesSent);
						thisFileUploader.FileUploaderEvent.detail.info = response.responseCode;
						thisFileUploader.FileUploaderEvent.detail.filename = thisFileUploader.options.fileName;
						thisFileUploader.fireEvent();
					},
					function onError(error) {
					var reason = '';
						switch(error.code) {
							case 1:
								reason = '(Local File not found on device)';
								break;
							case 2:
								break;
							case 3:
								reason = '(Check your Network connection)';
								break;
						}
//						alert('Upload error has occurred: ' + '\n' + 
//							  'Error Code:   ' + error.code + ' ' + reason + '\n' +
//						      'Error Source: ' + error.source + '\n' +
//						      'Error Target: ' + error.target + '\n');
						thisFileUploader.FileUploaderEvent.detail.info = error.code;
						thisFileUploader.FileUploaderEvent.detail.filename = error.source;
						thisFileUploader.fireEvent();
					},
					thisFileUploader.options,
					true
				);
			}
			else {
				alert('FileUploader: Error - Target Server undefined ...');
			}
		},	
		uploadDBFile: function(file) {
		if(DEBUG) alert('FileUploader.uploadFile()');
			var thisFileUploader = this;
			thisFileUploader.fileURI = file;

			if(thisFileUploader.serverURL!=null) {
				thisFileUploader.options.fileKey = "file";
				thisFileUploader.options.fileName = thisFileUploader.fileURI.substr(thisFileUploader.fileURI.lastIndexOf('/') + 1);
				thisFileUploader.options.mimeType = "text/plain";
				thisFileUploader.options.chunckedMode = false;
				thisFileUploader.options.headers = { Connection: "close" };
//					alert('Uploading Local DB....' + JSON.stringify(thisFileUploader.options) + ' - ' + thisFileUploader.serverURL); 
				thisFileUploader.ft.upload(thisFileUploader.fileURI, encodeURI(thisFileUploader.serverURL + '/uploadDB.php?sub_path=' + dbUpload), 
					function onSuccess(response) {
//					    alert("Code = " + response.responseCode);
//					    alert("Response = " + response.response);
//					    alert("Sent = " + response.bytesSent);
						thisFileUploader.FileUploaderEvent.detail.info = response.responseCode;
						thisFileUploader.FileUploaderEvent.detail.filename = thisFileUploader.options.fileName;
						thisFileUploader.fireEvent();
					},
					function onError(error) {
//						alert('Upload error has occurred: ' + '\n' + 
//							  'Error Code:   ' + error.code + '\n' +
//						      'Error Source: ' + error.source + '\n' +
//						      'Error Target: ' + error.target + '\n');
						thisFileUploader.FileUploaderEvent.detail.info = error.code;
						thisFileUploader.FileUploaderEvent.detail.filename = error.source;
						thisFileUploader.fireEvent();
					},
					thisFileUploader.options,
					true
				);
			}
			else {
				alert('FileUploader: Error - Target Server undefined ...');
			}
		},	
		uploadLOGFile: function(file) {
		if(DEBUG) alert('FileUploader.uploadLOGFile()');
			var thisFileUploader = this;
			thisFileUploader.fileURI = file;

			if(thisFileUploader.serverURL!=null) {
				thisFileUploader.options.fileKey = "file";
				thisFileUploader.options.fileName = thisFileUploader.fileURI.substr(thisFileUploader.fileURI.lastIndexOf('/') + 1);
				thisFileUploader.options.mimeType = "text/plain";
				thisFileUploader.options.chunckedMode = false;
				thisFileUploader.options.headers = { Connection: "close" };
//						alert('Uploading Log File ...' + JSON.stringify(thisFileUploader.options) + ' - ' + thisFileUploader.serverURL); 
				thisFileUploader.ft.upload(thisFileUploader.fileURI, encodeURI(thisFileUploader.serverURL + '/uploadLog.php?sub_path=' + logUpload), 
					function onSuccess(response) {
//						    alert("Code = " + response.responseCode);
//						    alert("Response = " + response.response);
//						    alert("Sent = " + response.bytesSent);
						thisFileUploader.FileUploaderEvent.detail.info = response.responseCode;
						thisFileUploader.FileUploaderEvent.detail.filename = thisFileUploader.options.fileName;
						thisFileUploader.fireEvent();
					},
					function onError(error) {
						alert('Upload error has occurred: ' + '\n' + 
							  'Error Code:   ' + error.code + '\n' +
						      'Error Source: ' + error.source + '\n' +
						      'Error Target: ' + error.target + '\n');
						thisFileUploader.FileUploaderEvent.detail.info = error.code;
						thisFileUploader.FileUploaderEvent.detail.filename = error.source;
						thisFileUploader.fireEvent();
					},
					thisFileUploader.options,
					true
				);
			}
			else {
				alert('FileUploader: Error - Target Server undefined ...');
			}
		},	
		assignEvent: function(element) {
		if(DEBUG) alert('FileUploader.assignEvent(' + element + ')');
		var thisFileUploader = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisFileUploader.objectId = new Object();
				thisFileUploader.objectId = element;
				thisFileUploader.objectId.addEventListener('FileUploader', 'onFileUpload', false);
			}
			else {
//				alert('It is an HTML Element');
				thisFileUploader.htmlElement = element;
				document.getElementById(thisFileUploader.htmlElement).addEventListener("FileUploader", onFileUpload, false);
			}
		},
		fireEvent: function() {
		if(DEBUG) alert('FileUploader.fireEvent()');
		var thisFileUploader = this;
//			thisFileUploader.FileUploaderEvent.detail.info = thisFileUploader.info;
			
			if (thisFileUploader.objectId!=null){
//				alert('Event fired to an Object');
				thisFileUploader.objectId.dispatchEvent(thisFileUploader.FileUploaderEvent);
			}
			if(thisFileUploader.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisFileUploader.htmlElement).dispatchEvent(thisFileUploader.FileUploaderEvent);
			}
		}
	};
	return FileUploader;
})();

var FileDownloader = (function() {
	var FileDownloader = function(serverFileURL) {
		if(DEBUG) alert('Enter Constructor FileDownloader()');
		this.serverFileURL = serverFileURL || null;
		this.localFilePath = null;
		this.filename = null;
		this.ft = new FileTransfer();
		this.info = null;
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			if(DEBUG) alert('FileUploader(): DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.FileDownloaderEvent = new CustomEvent ("FileDownloader", {
				detail: {
					info: null,
					filename: null,
					status: null,
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				if(DEBUG) alert('FileUploader(): KitKat Device...');
				this.FileDownloaderEvent = new CustomEvent ("FileDownloader", {
					detail: {
						info: null,
						filename: null,
						status: null,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				if(DEBUG) alert('FileUploader(): NOT a KitKat Device...');
				this.FileDownloaderEvent = document.createEvent("CustomEvent");
				this.FileDownloaderEvent.initCustomEvent('FileDownloader', true, false, {info: null, filename: null, status: null, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Constructor FileUploader()');
	};
	FileDownloader.prototype = {
		downloadDBFile: function(dbFilename, localFilePath) {
		if(DEBUG) alert('FileDownloader.downloadFile()');
		var thisFileDownloader = this;
			thisFileDownloader.filename =  dbFilename;
			thisFileDownloader.localFilePath = localFilePath + '/' + dbFilename;
			if(thisFileDownloader.serverFileURL!=null) {
				window.requestFileSystem(LocalFileSystem.PERSISTENT,
					0,
					function(fileSystem) {
						fileSystem.root.getFile(thisFileDownloader.filename, 
							{create: true, exclusive: false}, 
							function(fileEntry) {
								 //alert('filesystem.root.getFile SUCCESS');
								 //alert('thisFileDownloader.serverFileURL = ' + thisFileDownloader.serverFileURL);
								 //alert('thisFileDownloader.localFilePath =' + thisFileDownloader.localFilePath);
								
								thisFileDownloader.ft.download(thisFileDownloader.serverFileURL,
									thisFileDownloader.localFilePath,
									function(entry) {
//										alert('Download OK.');
										thisFileDownloader.FileDownloaderEvent.detail.info = 'OK';
										thisFileDownloader.FileDownloaderEvent.detail.filename = thisFileDownloader.filename;
										thisFileDownloader.FileDownloaderEvent.detail.status = 'OK';
										thisFileDownloader.fireEvent();
									},
									function(error) {
										alert('Download ERROR: ' + err.source + '-' + err.target + '-' + err.code);	 
										thisFileDownloader.FileDownloaderEvent.detail.info = 'Download ERROR: ' + err.source + '\n' + err.target + '\n' + err.code;
										thisFileDownloader.FileDownloaderEvent.detail.filename = thisFileDownloader.filename;
										thisFileDownloader.FileDownloaderEvent.detail.status = 'ERROR';
										thisFileDownloader.fireEvent();
									},
									true
								);
							},
							function(error) {
								alert('getFile() ERROR: ' + err.source + '-' + err.target + '-' + err.code);	 
								thisFileDownloader.FileDownloaderEvent.detail.info = 'getFile() ERROR: ' + err.source + '\n' + err.target + '\n' + err.code;
								thisFileDownloader.FileDownloaderEvent.detail.filename = thisFileDownloader.filename;
								thisFileDownloader.FileDownloaderEvent.detail.status = 'ERROR';
								thisFileDownloader.fireEvent();
							}
						);
					},
					function(error) {
						alert('requestFileSystem() ERROR: ' + err.source + '-' + err.target + '-' + err.code);	 
						thisFileDownloader.FileDownloaderEvent.detail.info = 'requestFileSystem() ERROR: ' + err.source + '\n' + err.target + '\n' + err.code;
						thisFileDownloader.FileDownloaderEvent.detail.filename = thisFileDownloader.filename;
						thisFileDownloader.FileDownloaderEvent.detail.status = 'ERROR';
						thisFileDownloader.fireEvent();
					}
				);
			}
			else {
				alert('FileDownloader: Error - Source Server undefined ...');
				thisFileDownloader.FileDownloaderEvent.detail.info = 'FileDownloader ERROR: Source Server undefined ...';
				thisFileDownloader.FileDownloaderEvent.detail.filename = null;
				thisFileDownloader.FileDownloaderEvent.detail.status = 'ERROR';
				thisFileDownloader.fireEvent();
			}
		},	
		assignEvent: function(element) {
		if(DEBUG) alert('FileDownloader.assignEvent(' + element + ')');
		var thisFileDownloader = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisFileDownloader.objectId = new Object();
				thisFileDownloader.objectId = element;
				thisFileDownloader.objectId.addEventListener('FileDownloader', 'onFileDownload', false);
			}
			else {
//				alert('It is an HTML Element');
				thisFileDownloader.htmlElement = element;
				document.getElementById(thisFileDownloader.htmlElement).addEventListener("FileDownloader", onFileDownload, false);
			}
		},
		fireEvent: function() {
		if(DEBUG) alert('FileDownloader.fireEvent()');
		var thisFileDownloader = this;
//			thisFileDownloader.FileDownloaderEvent.detail.info = thisFileDownloader.info;
			
			if (thisFileDownloader.objectId!=null){
//				alert('Event fired to an Object');
				thisFileDownloader.objectId.dispatchEvent(thisFileDownloader.FileDownloaderEvent);
			}
			if(thisFileDownloader.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisFileDownloader.htmlElement).dispatchEvent(thisFileDownloader.FileDownloaderEvent);
			}
		}
	};
	return FileDownloader;
})();

function renameFile(currentName, currentDir, newName) {

	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
        	function onFileSystemSuccess(fileSystem) {
        		var fs = fileSystem;
				//alert("joket:renameFile currentDir:="+ JSON.stringify(currentDir) +" currentName:="+ JSON.stringify(currentName));
            	fileSystem.root.getFile(currentDir.substr(fileSystem.root.nativeURL.length, currentDir.length-fileSystem.root.nativeURL.length) + currentName, null, 
            		function onFileSuccess(file) {

            			fileSystem.root.getDirectory(currentDir.substr(fileSystem.root.nativeURL.length, currentDir.length-fileSystem.root.nativeURL.length), {create: true}, 
            				function onDirectorySuccess(directory) {
            					file.moveTo(directory, newName, 
                        			function () {
									//	alert("joket:renameFile new currentDir:="+ JSON.stringify(directory) +" currentName:="+ JSON.stringify(newName));
                        				console.log('SUCCESS...');
                        			}, 
                        			function(error) {
                        	    		alert('File Move: ' + error.message);
                        		});
            				
            				}, 
            				function onDirectoryError(error) {
            					alert('Directory: ' + error.message);
            				}
            			);
            		},
            		function onFileError(error) {
            			alert('File: ' + error.message);
            		}
            	
            	);
			},
			function onFileSystemError(error) {
				alert('FileSystem: ' + error.message);	
			}
	);
}