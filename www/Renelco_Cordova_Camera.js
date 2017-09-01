var DeviceCamera = (function () {
	var DeviceCamera = function () {
		if(DEBUG) alert('Enter Constructor DeviceCamera()');
		this.image = null;
		this.quality = 50;
		this.width = 800;
		this.height = 600;
		this.options = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceCamera(): DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.DeviceCameraEvent = new CustomEvent ("DeviceCamera", {
				detail: {
					image: null,
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				if(DEBUG) alert('DeviceCamera(): KitKat Device...');
				this.DeviceCameraEvent = new CustomEvent ("DeviceCamera", {
					detail: {
						image: null,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				if(DEBUG) alert('DeviceCamera(): NOT a KitKat Device...');
				this.DeviceCameraEvent = document.createEvent("CustomEvent");
				this.DeviceCameraEvent.initCustomEvent('DeviceCamera', true, false, {image: null, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Constructor DeviceCamera()');
	};
	DeviceCamera.prototype = {
		captureImage: function(quality, width, height) {
		if(DEBUG) alert('DeviceCamera.captureImage()');
			var thisDeviceCamera = this;
			thisDeviceCamera.quality = thisDeviceCamera.quality || quality;
			thisDeviceCamera.width = thisDeviceCamera.width || width;
			thisDeviceCamera.height = thisDeviceCamera.height || height;
			thisDeviceCamera.options = {quality: thisDeviceCamera.quality, sourceType: navigator.camera.PictureSourceType.CAMERA, destinationType: navigator.camera.DestinationType.FILE_URI, correctOrientation: true, targetWidth: thisDeviceCamera.width, targetHeight: thisDeviceCamera.height};
			navigator.camera.getPicture(
				function onSuccess(imageData) {
					thisDeviceCamera.image = imageData;
					thisDeviceCamera.fireEvent();
				},
				function onError(message) {
					thisDeviceCamera.image = null;
					thisDeviceCamera.fireEvent();
				},
				thisDeviceCamera.options
			);
		},
		getImage: function(quality, width, height) {
		if(DEBUG) alert('DeviceCamera.getImage()');
			var thisDeviceCamera = this;
			thisDeviceCamera.quality = thisDeviceCamera.quality || quality;
			thisDeviceCamera.width = thisDeviceCamera.width || width;
			thisDeviceCamera.height = thisDeviceCamera.height || height;
			thisDeviceCamera.options = {quality: thisDeviceCamera.quality, sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM, destinationType: navigator.camera.DestinationType.FILE_URI, correctOrientation: true, targetWidth: thisDeviceCamera.width, targetHeight: thisDeviceCamera.height};
			navigator.camera.getPicture(
				function onSuccess(imageData) {
					thisDeviceCamera.image = imageData;
					thisDeviceCamera.fireEvent();
				},
				function onError(message) {
					thisDeviceCamera.image = null;
					thisDeviceCamera.fireEvent();
				},
				thisDeviceCamera.options
			);
		},
		assignEvent: function(element) {
		if(DEBUG) alert('DeviceCamera.assignEvent(' + element + ')');
		var thisDeviceCamera = this;
			if (element!==null && typeof element==='object') {
//			alert('It is an Object');
				thisDeviceCamera.objectId = new Object();
				thisDeviceCamera.objectId = element;
				thisDeviceCamera.objectId.addEventListener('DeviceCamera', 'onDeviceCamera', false);
			}
			else {
//			alert('It is an HTML Element');
				thisDeviceCamera.htmlElement = element;
				document.getElementById(thisDeviceCamera.htmlElement).addEventListener("DeviceCamera", onDeviceCamera, false);
			}
		},
		fireEvent: function() {
		if(DEBUG) alert('DeviceCamera.fireEvent()');
		var thisDeviceCamera = this;
			thisDeviceCamera.DeviceCameraEvent.detail.image = thisDeviceCamera.image;
			
			if (thisDeviceCamera.objectId!=null){
//				alert('Event fired to an Object');
				thisDeviceCamera.objectId.dispatchEvent(thisDeviceCamera.DeviceCameraEvent);
			}
			if(thisDeviceCamera.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisDeviceCamera.htmlElement).dispatchEvent(thisDeviceCamera.DeviceCameraEvent);
			}
		}
	};
	return DeviceCamera;
})();
