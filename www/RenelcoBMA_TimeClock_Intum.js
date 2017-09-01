/**
 * 
 */

////////////////////////////////////////////////////////////////////////////////////////////////////
// Intum WorkFlow Variables
/////////////////////////////////////////////////

// Workflow Processing variables
var materials;
var material;

var obturationTypes;
var obturationType;

var metrees;
var metree;

var metree_obturation_types0 = null;
var metree_obturation_types = null;
var metree_obturation_type;

var pictureBefore = null;
var pictureAfter = null;
var pictures = null;
var metree_document = null;

var workflow;
var workorder_materials = null;
var workorder_material;


// Workflow UI variables
var ewWorkOrderMaterials;

var bwWorkflowSound;
var cwPictureBefore;
var bwPictureBefore;
var cwMetree;
var bwMetree;
var cwPictureAfter;
var bwPictureAfter;
var bwNewTask;

var bwSaveMetree;
var bwNextMetree;
var bwCancelMetree;
var bwSaveMetreeObturation;
var bwCancelMetreeObturation;

var bwSaveWorkOrderMaterial;
var bwCancelWorkOrderMaterial;
var bwDeleteWorkOrderMaterial;

////////////////////////////////////////////////////////////////////////////////////////////////////
// Intum Global Initialization  
//////////////////////////////////////////////////
function initIntum() {
if(DEBUG) alert('Executing initIntum() ...');

	initObturationTypes();			// Specific Intum -> List of Type of Obturation
	initMetrees();					// Specific Intum -> WorkFlow
	initPictures();					// Specific Intum -> Collection of Pictures
	initMetreeObturationTypes();	// Specific Intum -> List of Types of Obturation per Metree
	initMaterials();				// Specific Intum -> List of Type of Materials
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Intum Workflow
//////////////////////////////////////////////////
function initWorkflow() {
if(DEBUG) console.log('initWorkflow()');
	workflow = new IntumWorkFlow();
	workflow.assignEvent(appName);
	workflow.reset();
}

/////////////////////////////////////////////////
// WorkFlow Event Handler
/////////////////////////////////////////////////
function onIntumWorkFlow(event) {
if(DEBUG) console.log('onIntumWorkflow Event received ...');
if(DEBUG) console.log('::::: ' + event.detail.action);
	if(event.detail.action==='reset') {
		if(DEBUG) console.log('Workflow Reset');
		cwPictureBefore.uncheck();
		cwMetree.uncheck();
		cwPictureAfter.uncheck();
		
		bwPictureBefore.enable();
		bwPictureBefore.show();
		bwMetree.disable();
		bwPictureAfter.disable();
		bwPictureAfter.hide();
		bwNewTask.disable();
		
		if(activity.id==1) {
			bwSaveMetree.hide();
			bwNextMetree.enable();
			bwNextMetree.show();
			bwCancelMetree.enable();
			bwSaveMetreeObturation.enable();
			bwCancelMetreeObturation.enable();
		}
		else {
			bwSaveMetree.show();
			bwNextMetree.disable();
			bwNextMetree.hide();
			bwSaveMetree.enable();
			bwCancelMetree.enable();
			bwSaveMetreeObturation.disable();
			bwCancelMetreeObturation.disable();
		}
		
//		bwStopActivity.enable();
		bwStopActivity.disable();	// We don't want User to Stop Task now 
	}
	if(event.detail.action==='start') {
		if(DEBUG) console.log('Workflow Start');
		cwPictureBefore.uncheck();
		cwMetree.uncheck();
		cwPictureAfter.uncheck();
		
		bwPictureBefore.enable();
		bwPictureBefore.show();
		bwMetree.disable();
		bwPictureAfter.disable();
		bwPictureAfter.hide();
		bwNewTask.disable();
		
		bwStopActivity.disable();
		
		pictureBefore = null;
		pictureAfter = null;
	}
	if(event.detail.action==='picture_before') {
		if(DEBUG) console.log('Workflow Picture Before');
		cwPictureBefore.check();
		bwPictureBefore.disable();
		bwPictureBefore.hide();
		bwMetree.enable();
		bwPictureAfter.disable();
		bwPictureAfter.show();
		bwNewTask.disable();

		bwStopActivity.disable();
	}
	if(event.detail.action==='metree') {
		if(DEBUG) console.log('Workflow Metree');
		bwPictureBefore.disable();
		bwPictureBefore.hide();
		bwMetree.disable();
		bwPictureAfter.enable();
		bwPictureAfter.show();
		bwNewTask.disable();
		
		bwStopActivity.disable();
	}
	if(event.detail.action==='cancel_metree') {
		if(DEBUG) console.log('Workflow Cancel Metree');
		cwMetree.uncheck();
		cwPictureBefore.check();
		bwPictureBefore.disable();
		bwPictureBefore.hide();
		bwMetree.enable();
		bwPictureAfter.disable();
		bwPictureAfter.show();
		bwNewTask.disable();
		
		bwStopActivity.disable();
	}
	if(event.detail.action==='picture_after') {
		if(DEBUG) console.log('Workflow Picture After');
		cwPictureAfter.check();
		bwPictureBefore.disable();
		bwPictureBefore.show();
		bwMetree.disable();
		bwPictureAfter.disable();
		bwPictureAfter.hide();
		bwNewTask.enable();
		
		metree.photo_after = workflow.pictureAfterUrl;
		metree.update();
		
		bwStopActivity.enable();
	}
	if(event.detail.action==='stop') {
		if(DEBUG) console.log('Workflow Stop');
		
		bwStopActivity.enable();
	}
	if(event.detail.action==='terminate') {
		if(DEBUG) console.log('Workflow Terminate');
		
		bwStopActivity.enable();
	}
}





////////////////////////////////////////////////////////////////////////////////////////////////////
// Metrees
//////////////////////////////////////////////////
function initMetrees() {
if(DEBUG) console.log('initMetrees()');	

	metrees = new MetreeCollection();
	metrees.assignEvent(appName);
	setMetree();
}

function setMetree() {
if(DEBUG) console.log('setMetree()');
	metree = new Metree();
	metree.assignEvent(appName);
}

function addMetree() {
if(DEBUG) console.log('addMetree()');
}



////////////////////////////////////////////////////////////////////////////////////////////////////
//Obturation Types
//////////////////////////////////////////////////
function initObturationTypes() {
if(DEBUG) console.log('initObturationTypes');
	
	obturationTypes = new ObturationTypeCollection();
	obturationTypes.assignEvent(appName);
	obturationTypes.load();
}

function onObturationTypeCollection(event) {
if(DEBUG) console.log('Event: onObturationTypeCollection received ...');
if(DEBUG) console.log('Obturation Types count: ' + obturationTypes.count);
	setObturationTypesList();
}


function setObturationTypesList() {
if(DEBUG) console.log('Executing setObturationTypesList()');

//	$('#' + appName + '-' + 'hidden-select-cboObturationTypes').empty();
//
//	$('#' + appName + '-' + 'hidden-select-cboObturationTypes').append("<option value=0 label=''></option>"); 
	
	for(var idx = 0; idx<obturationTypes.count; idx++) {
		$('#' + appName + '-' + 'hidden-select-cboObturationTypes').append("<option value='" + obturationTypes.item(idx).id + "' label='" + obturationTypes.item(idx).shortname + "'>" + obturationTypes.item(idx).name + "</option>"); 
	}
	phoneui.preprocessDOM(phoneui.getCurrentPageId());
	phoneui.forceLayout();
}

function initMetreeObturationTypes(metree_id) {
if(DEBUG) console.log('initMetreeObturationTypes(' + metree_id + ')');

	metree_obturation_types = new Metree_Obturation_TypesCollection();	
	metree_obturation_types.assignEvent(appName);
}


function onMetree_Obturation_TypesCollection(event) {
if(DEBUG) console.log('onMetree_Obturation_TypesCollection Event received ...');
//	alert(JSON.stringify(event.detail.items));
//	alert(metree_obturation_types0.obturationTypes);
	if(metrees.count>0) {
		setTaskInfo(metrees.item(0));
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// Documents & Pictures (Camera)
//////////////////////////////////////////////////
function initPictures() {
if(DEBUG) alert('initPictures()');
	pictures = new DocumentCollection();
	pictures.assignEvent(appName);
	pictures.load();
}

function getPictureBefore() {
if(DEBUG) console.log('getPictureBefore()');

	Beep();
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'PictureBefore Button pressed.');

//	captureImage(75, 800, 600);
	captureImage(75, 400, 300);
}


function getPictureAfter() {
if(DEBUG) console.log('getPictureAfter()');

	Beep();
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'PictureAfter Button pressed.');

//	captureImage(75, 800, 600);
	captureImage(75, 400, 300);
}


function getPicture() {
if(DEBUG) console.log('getPicture()');

	// No Camera Page

}

///////////////////////////////////////////////////////////////////////////////
// Modified by Renelco / 20166-04-27 to support Image long Filenames
///////////////////////////////////////////////////////////////////////////////
function onDeviceCamera(event) {
if(DEBUG) console.log('onCamera Event(' + JSON.stringify(event.detail) + ') received ...');
var imageFullPath = event.detail.image;
var filename = event.detail.image.substr(event.detail.image.lastIndexOf('/') + 1);
var path = event.detail.image.substr(0, event.detail.image.lastIndexOf('/') + 1);
var newFilename;
	if(event.detail.image!=null) {
//		var image = new Image(800, 600);
		var image = new Image(400, 300);
		image.src = event.detail.image;
		
		if((workflow.status==IntumWorkFlow.prototype.WORKFLOW_STATES.Idle) || (workflow.status==IntumWorkFlow.prototype.WORKFLOW_STATES.PictureBefore)) {
			workflow.setPictureBefore(imageFullPath);
			newFilename = workorder.id + '-' + activity.id + '-' + task.id + '-p1-' + collaborator.id + '-' + filename;
			renameFile(filename, path, newFilename);	// Now we rename the Image in cache using the long filename 
//			pictureBefore = new Document(-1, collaborator.id, 1, filename, 'Description of Pic. Before', uriDocument + '/' + filename, urlUploadServer + picUploadDir + newFilename, urlDataServer, task.executed, 0, urlPhpServices);

			pictureBefore = new Document(-1, collaborator.id, 1, newFilename, 'Description of Pic. Before', uriDocument + '/' + newFilename, urlUploadServer + picUploadDir + newFilename, urlDataServer, task.executed, 0, urlPhpServices);
			pictureBefore.assignEvent(appName);
			pictureBefore.create();
		}
		
		if(workflow.status==IntumWorkFlow.prototype.WORKFLOW_STATES.PictureAfter) {
			workflow.setPictureAfter(imageFullPath);
			newFilename = workorder.id + '-' + activity.id + '-' + task.id + '-p2-' + collaborator.id + '-' + filename; 
			renameFile(filename, path, newFilename);	// Now we rename the Image in cache using the long filename
//			pictureAfter = new Document(-1, collaborator.id, 1, filename, 'Description of Pic. After', uriDocument + '/' + filename, urlUploadServer + picUploadDir + newFilename, urlDataServer, task.executed, 0, urlPhpServices);
			
			pictureAfter = new Document(-1, collaborator.id, 1, newFilename, 'Description of Pic. After', uriDocument + '/' + newFilename, urlUploadServer + picUploadDir + newFilename, urlDataServer, task.executed, 0, urlPhpServices);
			pictureAfter.assignEvent(appName);
			pictureAfter.create();
		}
	}
	else {
		console.log('Could not take Snapshot ...');
	}
}

function showPicture(pictureUrl, before) {
var widthContainer = parseInt($('#' + appName + '-' + 'pagePictureViewer').css('width'));
var heightContainer = parseInt($('#' + appName + '-' + 'pagePictureViewer').css('height'));
var widthPicture = parseInt($('#' + appName + '-' + 'imgPictureViewer').css('width'));
var heightPicture = parseInt($('#' + appName + '-' + 'imgPictureViewer').css('height'));
var ratioPicture = parseInt(widthPicture/heightPicture);
var topPicture = parseInt((heightContainer-heightPicture)/2);
var leftPicture = parseInt((widthContainer-widthPicture)/2);

	Beep();

	if(widthContainer>widthPicture) {
		$('#' + appName + '-' + 'imgPictureViewer').attr('src', pictureUrl);
		$('#' + appName + '-' + 'imgPictureViewer').css('top', topPicture);
		$('#' + appName + '-' + 'imgPictureViewer').css('left', leftPicture);
	}
	else {
		widthPicture = widthContainer;
		heightPicture = widthPicture/ratioPicture;
		topPicture = parseInt((heightContainer-heightPicture)/2);
		$('#' + appName + '-' + 'imgPictureViewer').attr('src', pictureUrl);
		$('#' + appName + '-' + 'imgPictureViewer').css('top', topPicture);
		$('#' + appName + '-' + 'imgPictureViewer').css('left', 0);
		$('#' + appName + '-' + 'imgPictureViewer').css('width', widthPicture);
		$('#' + appName + '-' + 'imgPictureViewer').css('height', heightPicture);
	}
	gotoPictureViewer(phoneui.transitions.slideLeft);
}

function onDocument(event) {
if(DEBUG) console.log('onDocumentEvent received ...');

	// 'INSERT' Events are generated when a Document is created
	if((event.detail.action=='INSERT') && (event.detail.result=='SUCCESS')) {
		// 1st Picture
		if((workflow.status==IntumWorkFlow.prototype.WORKFLOW_STATES.Idle) || (workflow.status==IntumWorkFlow.prototype.WORKFLOW_STATES.Metrees)) {
			pictures.add(pictureBefore);
		}
		// 2nd Picture
		if(workflow.status==IntumWorkFlow.prototype.WORKFLOW_STATES.Terminated) {
			pictures.add(pictureAfter);
		}
	}
}

function onDocumentCollection(event) {
if(DEBUG) console.log('onDocumentCollectionEvent received ...');
	
	if(event.detail.action=='LOADED') {
		if(DEBUG) console.log('Documents LOADED ...');
		if(workStateManager.state==WorkStateManager.prototype.WORK_STATES.Synchronizing) {
			pictures.upload();
		}
	}
	if(event.detail.action=='UPLOADED') {
		if(DEBUG) console.log('Documents UPLOADED ...');
		phoneui.showActivityDialog('Uploading Data...');
		if(workStateManager.state==WorkStateManager.prototype.WORK_STATES.Synchronizing) {
			databaseManager.startUpload(localStorage.getItem("LocalDB"));			
		}
		else {
			databaseManager.startUpload();
		}
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// TaskMetrees
//////////////////////////////////////////////////
function initTaskMetrees() {
if(DEBUG) console.log('initTaskMetrees()');
	// Clear Comment Field
	$("textarea[id=" + appName + "-" + "txtTaskMetreeComment]").val("");
	
	$("textarea[id=" + appName + "-" + "txtTaskMetreeComment]").blur(function() {
//		setTimeout(function() {
			$('#' + appName + '-' + 'panelMetree').animate({scrollTop: 0}, 1000);
//		}, 5);
//		$('#' + appName + '-' + 'panelMetree').hide().fadeIn('fast');
	});
	$("textarea[id=" + appName + "-" + "txtTaskMetreeComment]").focus(function() {
//		setTimeout(function() {
			$('#' + appName + '-' + 'panelMetree').animate({scrollTop: (parseInt(($('#' + appName + '-' + 'panelMetree')[0].scrollHeight)/4))}, 500);
//		}, 5);
//		$('#' + appName + '-' + 'panelMetree').hide().fadeIn('fast');
	});

//	$("textarea[id=" + appName + "-" + "txtTaskMetreeComment]").click(function() {
//		console.log('Comment click()');
//		setTimeout(function() {
//			$('#' + appName + '-' + 'panelMetree').animate({scrollTop: (parseInt(($('#' + appName + '-' + 'panelMetree')[0].scrollHeight)/4))}, 500);
//		}, 500);
////		$('#' + appName + '-' + 'panelMetree').hide().fadeIn('fast');
//	});
	
	
	$("input[id=" + appName + "-" + "txtTaskMetreeLargeurObturation]").blur(function() {
	});
	$("input[id=" + appName + "-" + "txtTaskMetreeLargeurObturation]").focus(function() {
	});

	$("input[id=" + appName + "-" + "txtTaskMetreeHauteurObturation]").blur(function() {
	});
	$("input[id=" + appName + "-" + "txtTaskMetreeHauteurObturation]").focus(function() {
	});
	
	$("input[id=" + appName + "-" + "txtTaskMetreeProfondeur]").blur(function() {
	});
	$("input[id=" + appName + "-" + "txtTaskMetreeProfondeur]").focus(function() {
	});

	$("div[id=" + appName + "-" + "cboObturationTypes]").attr("tabindex", -1).blur(function() {
	}); 
	
	$("div[id=" + appName + "-" + "cboObturationTypes]").attr("tabindex", -1).focus(function() { 
		$("div[id=" + appName + "-" + "cboObturationTypes]").css("background", "transparent");
		Beep();
	});
}

/*
function txtTaskMetreeLargeurObturationFocused() {
}

function txtTaskMetreeHauteur_ObturationFocused() {
}

function txtTaskMetreeProfondeurFocused() {
}
*/

function showPanelToolBarMetree(visible) {
if(DEBUG) console.log('showPanelToolBarMetree(' + visible + ')');

	if(visible==true) {
		$('#' + appName + '-' + 'panelToolBarMetrees').css('z-index', 'auto');
		$('#' + appName + '-' + 'panelToolBarMetrees').css('visibility', 'visible');
		$('#' + appName + '-' + 'panelToolBarMetrees').css('left', '0px');
	}
	else {
		$('#' + appName + '-' + 'panelToolBarMetrees').css('z-index', '-99');
		$('#' + appName + '-' + 'panelToolBarMetrees').css('visibility', 'hidden');
		$('#' + appName + '-' + 'panelToolBarMetrees').css('left', -500);
	}
//	phoneui.preprocessDOM(appName + '-' + 'panelToolBarMetrees');
//	phoneui.forceLayout();
}

function showPanelToolBarMetreeObturation(visible) {
if(DEBUG) console.log('showPanelToolBarMetreeObturation(' + visible + ')');

	if(visible==true) {
		$('#' + appName + '-' + 'panelToolBarMetreesObturation').css('z-index', 'auto');
		$('#' + appName + '-' + 'panelToolBarMetreesObturation').css('visibility', 'visible');
		$('#' + appName + '-' + 'panelToolBarMetreesObturation').css('left', 0);
	}
	else {
		$('#' + appName + '-' + 'panelToolBarMetreesObturation').css('z-index', '-99');
		$('#' + appName + '-' + 'panelToolBarMetreesObturation').css('visibility', 'hidden');
		$('#' + appName + '-' + 'panelToolBarMetreesObturation').css('left', -500);
	}
}


function showPanelToolBarNotes(visible) {
if(DEBUG) console.log('showPanelToolBarNotes(' + visible + ')');

	if(visible==true) {
		$('#' + appName + '-' + 'panelToolBarNotes').css('z-index', 'auto');
		$('#' + appName + '-' + 'panelToolBarNotes').css('visibility', 'visible');
		$('#' + appName + '-' + 'panelToolBarNotes').css('left', '0px');

	}
	else {
		$('#' + appName + '-' + 'panelToolBarNotes').css('z-index', '-99');
		$('#' + appName + '-' + 'panelToolBarNotes').css('visibility', 'hidden');
		$('#' + appName + '-' + 'panelToolBarNotes').css('left', -500);

	}
//	phoneui.preprocessDOM(appName + '-' + 'panelToolBarNotes');
//	phoneui.forceLayout();
}


function setTaskMetrees() {
if(DEBUG) console.log('setMetrees()');

	Beep();
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'Metree Button pressed.');

	metree.reset();
	// Check if current Activity is Obturation and set the flag accordingly
	if(activity.id==1) {
		metree.obturation = 1;
	}
	initTaskMetrees();
//	gotoMetrees(phoneui.transitions.slideDown);
	gotoMetrees(phoneui.transitions.slideLeft);
}

function saveTaskMetrees() {
if(DEBUG) console.log('saveTaskMetrees()');

	Beep();
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'SaveMetree Button pressed.');

	if(checkMetrees()) {
		metree.collaborator_id = collaborator.id;
		metree.task_id = task.id;
		metree.name = $('#' + appName + '-' + 'txtTaskMetreeBatiment').val();
		metree.etage = $('#' + appName + '-' + 'txtTaskMetreeEtage').val();
		metree.piece = $('#' + appName + '-' + 'txtTaskMetreePiece').val();
		metree.comment = $('#' + appName + '-' + 'txtTaskMetreeComment').val();
		
//		if(activity.name=='Obturation') {
		if(activity.id==1) {
			metree.largeur_obturation = $('#' + appName + '-' + 'txtTaskMetreeLargeurObturation').val();
			metree.obturation_type_id = $('select[name="cboObturationTypes"]').val();
			metree.hauteur_obturation = $('#' + appName + '-' + 'txtTaskMetreeHauteurObturation').val();
			metree.profondeur = $('#' + appName + '-' + 'txtTaskMetreeProfondeur').val();
			metree.obturation = 1;
		}
		else {
			metree.largeur_obturation = 0;
			metree.hauteur_obturation = 0;
			metree.profondeur = 0;
			metree.obturation = 0;
		}	
		
		metree.photo_before = workflow.pictureBeforeUrl;
		metree.created = task.executed;
		metree.create();
		
		gotoWorkflow(phoneui.transitions.slideUp);
	}
	else {
		alert('All the Fields but "Room" and "Shutter Depth" must contain valid values');
		$('#' + appName + '-' + 'panelTaskMetree').scrollTop(0);
	}
}

function cancelTaskMetrees() {
if(DEBUG) console.log('cancelTaskMetrees()');	

	Beep();
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'CancelMetree Button pressed.');

	workflow.cancelMetree();
	gotoWorkflow(phoneui.transitions.slideUp);
}

function checkMetrees() {
if(DEBUG) console.log('checkMetrees()');	

	if($('#' + appName + '-' + 'txtTaskMetreeBatiment').val()=='') return false;
	if($('#' + appName + '-' + 'txtTaskMetreeEtage').val()=='') return false;
//	if(activity.name=='Obturation') {
	if(activity.id==1) {
//		if($('select[name="cboObturationTypes"]')[0].selectedOptions.length==0) return false;
		if($('select[name="cboObturationTypes"] :selected').text()==='None') return false; 
		if($('#' + appName + '-' + 'txtTaskMetreeLargeurObturation').val()=='') return false;
		if($('#' + appName + '-' + 'txtTaskMetreeHauteurObturation').val()=='') return false;
	}
	return true;
}


function onMetreeCollection(event) {
if(DEBUG) console.log('onMetreeCollection Event received ...');
//	console.log('- count ' + event.detail.count);
//	console.log('- data  ' + JSON.stringify(event.detail.items[0]));
	if(event.detail.count>0) {
		metree_obturation_types0 = new Metree_Obturation_TypesCollection();
		metree_obturation_types0.assignEvent(appName);
		metree_obturation_types0.load(event.detail.items[0].id, collaborator.id);
//		setTaskInfo(event.detail.items[0]);
	}
	else {
		alert('No valid Task Information found...'); 
	}
}

function onMetree(event) {
if(DEBUG) console.log('onMetree Event received ...');

	if(workflow.status==IntumWorkFlow.prototype.WORKFLOW_STATES.Metrees) {
		workflow.setMetree(event.detail.id);
	}
	if(workflow.status==IntumWorkFlow.prototype.WORKFLOW_STATES.PictureAfter) {
		if(event.detail.id>0) {
			cwMetree.check();
			if(activity.id==1) {
				setMetreeObturationTypes();
			}
		}
	}
	
	if(workflow.status==IntumWorkFlow.prototype.WORKFLOW_STATES.Terminated) {
	if(DEBUG) console.log('Terminate');
		setMetreeDocuments();
		terminateTask();
		setTasksList();
	}
}

function editMetreesObturation() {
if(DEBUG) console.log('editMetreesObturation()');

	Beep();
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'NextMetree Button pressed.');
	
	gotoMetreesObturation(phoneui.transitions.slideDown);
}

function setMetreeObturationTypes() {
if(DEBUG) console.log('setMetreeObturationTypes(): ');
var values = $('select[name="cboObturationTypes"]').val();
var options = $('select[name="cboObturationTypes"] option:selected');

	for (var idx=0; idx<options.length; idx++) {
		if(options[idx].label!='None') {
			metree_obturation_type = new Metree_Obturation_Type(metree.id, collaborator.id, values[idx], metree.created);
			metree_obturation_type.assignEvent(appName);
			metree_obturation_type.assign();
			metree_obturation_types.add(metree_obturation_type);
		}
	}
}

function onMetree_Obturation_Type(event) {
console.log('onMetree_Obturation_Type Event received');	
}

function obturationTypeChanged() {
if(DEBUG) console.log('obturationTypeChanged fired ...');
	
	setObturationTypes();
}

function setObturationTypes() {
if(DEBUG) alert('setObturationTypes');
var cboCaption = "";
var options = $('select[name="cboObturationTypes"] option:selected');

//	if((options.length==1) && (options[0].label="None")) {
		cboCaption = 'None';
//	}
//	else {
		for (var idx=0; idx<options.length; idx++) {
			if(cboCaption=='None') {
				if(options[idx].label!='None' && options[idx].selected==true) { 
					cboCaption = options[idx].label;
				}
			}
			else {
				cboCaption += ', ' + options[idx].label; 
			}
		}
//	}
	setTimeout(function() {
		$('#' + appName + '-' + 'cboObturationTypes').text(cboCaption);
		phoneui.preprocessDOM();
		phoneui.forceLayout();
	},
	50);
}



////////////////////////////////////////////////////////////////////////////////////////////////////
// MetreeDocuments
//////////////////////////////////////////////////
function setMetreeDocuments() {
if(DEBUG) console.log('setMetreeDocuments()');

	// Set Picture Before Doument Object and assign it to the current Metree
	metree_document = new Metree_Document(metree.id, collaborator.id, 1, pictureBefore.id, metree.created);
	metree_document.assignEvent(appName);
	metree_document.assign();
	
}

function onMetree_Document(event) {
if(DEBUG) console.log('onMetree_Document Event received ...');

	if(event.detail.metree_document_type_id<=0) {
		console.log('Failed to save Metree_Document Object ...');
		return;
	}
	else {
		// Check if Picture Before Document Object has been saved
		if(event.detail.metree_document_type_id==1) {
			// Now, do it for Picture After Document Object, also assigned to the current Metree
			metree_document = new Metree_Document(metree.id, collaborator.id, 2, pictureAfter.id, metree.created);
			metree_document.assignEvent(appName);
			metree_document.assign();
		}
		// Check if Picture After Document Object has been saved
		if(event.detail.metree_document_type_id==2) {
			// Picture After Document Object has been saved into DB, Nothing more to do ... 
		}
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// Notes
//////////////////////////////////////////////////
function initNotes() {
	
}

function openNotes() {
	alert('openNotes()');
	gotoNotes(phoneui.transitions.slideLeft);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Materials
//////////////////////////////////////////////////
function initMaterials() {
if(DEBUG) console.log('initMaterials()');
	materials = new MaterialCollection();
	materials.assignEvent(appName);
	materials.load();
}

function onMaterialCollection(event) {
if(DEBUG) console.log('onMaterialCollection Event received ...');
	setCboMaterialsList();
}

function setMaterial() {
if(DEBUG) console.log('setMaterial()');

}

function addMaterial() {
if(DEBUG) console.log('addMaterial()');

}

function initWorkOrderMaterials(workorder_id) {
if(DEBUG) console.log('initWorkOrderMaterials(' + workorder_id + ')');

	workorder_materials = new WorkOrder_MaterialsCollection();
	workorder_materials.assignEvent(appName);
	workorder_materials.load(workorder.id, collaborator.id); // workorder.id
}

function onWorkOrder_MaterialsCollection(event) {
if(DEBUG) console.log('onWorkOrder_MaterialsCollection Event received ...');
//		$('#' + appName + '-' + 'panelWorkOrderMaterial').css('visibility', 'hidden');
	setWorkOrder_MaterialsList();
}


function setCboMaterialsList() {
if(DEBUG) console.log('Executing setCboMaterialsList()');

	$('#' + appName + '-' + 'hidden-select-cboWorkOrderMaterial').empty();
	
	$('#' + appName + '-' + 'hidden-select-cboWorkOrderMaterial').append("<option value=-1' label='None'>None</option>"); 

	for(var idx = 0; idx < materials.count; idx++) {
		$('#' + appName + '-' + 'hidden-select-cboWorkOrderMaterial').append("<option value='" + materials.item(idx).id + "' label='" + materials.item(idx).name + "'>" + materials.item(idx).name + "</option>"); 
	}
	phoneui.preprocessDOM('#' + appName);
	phoneui.forceLayout();
}

function setWorkOrder_MaterialsList() {
if(DEBUG) console.log('setWorkOrder_MaterialsList');
	
	currentPage = 'pageWorkOrderMaterials';

	$("input[id*=txtWorkOrderMaterialsListItem]").val( "" );
	$('#' + appName + '-' + 'lstWorkOrderMaterialList').css('visibility', 'visible');

	loadWorkOrderMaterialsList('#' + appName + '-' + 'pageWorkOrderMaterials');
}

function loadWorkOrderMaterialsList(active_page){
if(DEBUG) console.log('loadWorkOrderMaterialsList ' + workorder_materials.count);
	
	var list_items = new Array();

	for (var idx=0; idx<workorder_materials.count; idx++) {
		var item = {
			workorder_id: workorder_materials.item(idx).workorder_id,
			material_id: workorder_materials.item(idx).material_id,
			collaborator_id: workorder_materials.item(idx).collaborator_id,
//			name: materials.itemById(workorder_materials.item(idx).material_id).name,
			name: workorder_materials.item(idx).name,
			quantity: workorder_materials.item(idx).quantity,
			comment: workorder_materials.item(idx).comment,
			picture_url: materials.itemById(workorder_materials.item(idx).material_id).picture_url
		}
		list_items.push(item);
	}
	$(":root").data("workorder_materials" , list_items);

	render_WorkOrderMaterialslist(list_items);
}

function render_WorkOrderMaterialslist(list_items ) {
if(DEBUG) console.log('render_WorkOrderMaterialslist');

var list = $('#' + appName + '-' + 'lstWorkOrderMaterials'); //lookup <ul>
//lookup number of listItems from home screen; convert to number
var itemCnt = list_items.length;
var description = '';
var cssClassList;
var bkColor;

	//remove current list items
	list.children('#' + appName + '-' + 'lstWorkOrderMaterialsListItem').remove();
	$('#' + appName + '-' + 'lstWorkOrderMaterialsListItem').css('visibility', 'visible');

	//build list 
	firstItemClass = 'm1-first';
	internalItemClass = ' m1-clickable m1-hyperlink-internal';
	lastItemClass = ' m1-last';
	singleItemClass = 'm1-first m1-last';
	
	//  Last Item displayed first
	for (var idx=0; idx < itemCnt; idx++) {
	
		item = list_items[idx];
		
		//build list css class list
		if(itemCnt===1) {
			cssClassList = singleItemClass;
		}
		else {
			cssClassList = idx==0 ? firstItemClass : '';
			cssClassList += idx==itemCnt-1 ? lastItemClass : '';
			cssClassList += internalItemClass;
		}
		if(idx%2==0) {
			bkColor = LISTITEM_BACKCOLOR_LIGHT; 
		}
		else {
			bkColor = LISTITEM_BACKCOLOR_DARK;
		}
		
//		description = sprintf("%-d %-20s", item["material_id"], item["name"].substr(0, 20));
		description = item["name"].substr(0, 25);
		
		list.append('<li id="' + appName + '-' + 'lstWorkOrderMaterialsListItem" class="' + cssClassList + '"' +  
		      	'        data-listitem-index="' + idx + '" style="background-color:' + bkColor + ';" >' + 
		      	'   <div id="' + appName + '-' + 'lstWorkOrderMaterialsListItem-inner-div">' + 
		      	'      <div id="' + appName + '-' + 'txtWorkOrderMaterialsListItem" class="m1-text" style="width:270px;font-family:monospace;overflow-x:hidden;overflow-y:hidden;" onClick="activateListItem(); editWorkOrderMaterial(' + item["material_id"] + ',' + item["quantity"] + ',\'' + item["comment"] + '\')">' + description + '</div>'+
		      	'      <div id="' + appName + '-' + 'txtWorkOrderMaterialsQuantityListItem" class="m1-text" style="width:50px;font-family:monospace;">' + item["quantity"] + '</div>'+
		      	'   </div>'+
		      	'</li>');

	}

	//Update panel's content height, set the ht value on the panel's 
	// scroller <div> data-layout-content-height attribute.
	// panelHt = header ht + listItems ht + footer ht
	var panelHt = 30 + itemCnt * 50;
	$('#' + appName + '-' + 'panelWorkOrderMaterialsList-scroller').attr('data-layout-content-height', panelHt);
	
	previousListItem = null;
	
	phoneui.preprocessDOM(list);
	phoneui.forceLayout();
}

function showWorkOrderMaterial(id) {
if(DEBUG) console.log('showMaterial(' + id + ')');
if(DEBUG) workorder_materials.itemById(id).show();
}

function showPanelToolBarWorkOrderMaterials(visible) {
	if(visible==true) {
		$('#' + appName + '-' + 'panelToolBarWorkOrderMaterials').css('z-index', 'auto');
		$('#' + appName + '-' + 'panelToolBarWorkOrderMaterials').css('visibility', 'visible');
		$('#' + appName + '-' + 'panelToolBarWorkOrderMaterials').css('left', 0);
	}
	else {
		$('#' + appName + '-' + 'panelToolBarWorkOrderMaterials').css('z-index', '-99');
		$('#' + appName + '-' + 'panelToolBarWorkOrderMaterials').css('visibility', 'hidden');
		$('#' + appName + '-' + 'panelToolBarWorkOrderMaterials').css('left', -500);
	}
//	phoneui.preprocessDOM('#' + appName + '-' + 'panelToolBarWorkOrderMaterials');
//	phoneui.forceLayout();
}

function addWorkOrderMaterial() {
if(DEBUG) console.log('addWorkOrderMaterial');

	Beep();
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'AddWOrkOrderMaterial Button pressed.');

	$('#' + appName + '-' + 'panelWorkOrderMaterial').css('visibility', 'visible');
	$('#' + appName + '-' + 'txtWorkOrderMaterialFlagNew').text('1');
	ewWorkOrderMaterials.enable();
	bwSaveWorkOrderMaterial.enable(); 
	bwSaveWorkOrderMaterial.show(); 
	bwCancelWorkOrderMaterial.enable(); 
	bwCancelWorkOrderMaterial.show(); 
	bwDeleteWorkOrderMaterial.disable();
	bwDeleteWorkOrderMaterial.hide();
	$('select[name="cboWorkOrderMaterial"] option:first').attr('selected', 'selected');
	
	$("input[id=" + appName + "-" + "txtWorkOrderMaterialComment]").val('');

	$("input[id=" + appName + "-" + "txtWorkOrderMaterialQuantity]").val('');
	
	gotoWorkOrderMaterial(phoneui.transitions.slideLeft);
	phoneui.preprocessDOM('#' + appName);
	phoneui.forceLayout();
}

function editWorkOrderMaterial(id, quantity, comment) {
if(DEBUG) console.log('editWorkOrderMaterial(' + id + ',' + quantity + comment + ')');

	Beep();
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'SelectWorkOrderMaterial (Edit) pressed.');

	$('#' + appName + '-' + 'panelWorkOrderMaterial').css('visibility', 'visible');
	$('#' + appName + '-' + 'txtWorkOrderMaterialFlagNew').text('0');
	ewWorkOrderMaterials.disable();
	bwSaveWorkOrderMaterial.enable(); 
	bwSaveWorkOrderMaterial.show(); 
	bwCancelWorkOrderMaterial.disable(); 
	bwCancelWorkOrderMaterial.hide(); 
	bwDeleteWorkOrderMaterial.enable();
	bwDeleteWorkOrderMaterial.show();
	
	$('select[name="cboWorkOrderMaterial"]').val(id).attr('selected','selected');
	
	$("input[id=" + appName + "-" + "txtWorkOrderMaterialComment]").val(comment);
	
	$("input[id=" + appName + "-" + "txtWorkOrderMaterialQuantity]").val(quantity);
	
	gotoWorkOrderMaterial(phoneui.transitions.slideLeft);
	phoneui.preprocessDOM('#' + appName);
	phoneui.forceLayout();
}

function saveWorkOrderMaterial() {
if(DEBUG) console.log('saveWorkOrderMaterial()');

	Beep();
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'SaveWorkOrderMaterial Button pressed.');

	if($('#' + appName + '-' + 'txtWorkOrderMaterialFlagNew').text()=='1') {
		if($('select[name="cboWorkOrderMaterial"]').val()>0) {
			// Retrieve selected Material and Quantity	
			workorder_material = new WorkOrder_Material();
			workorder_material.workorder_id = workorder.id; // workorder.id
			workorder_material.material_id = $('select[name="cboWorkOrderMaterial"]').val();
			workorder_material.collaborator_id = collaborator.id;
			workorder_material.quantity = $("input[id=" + appName + "-" + "txtWorkOrderMaterialQuantity]").val();
			workorder_material.comment = $("input[id=" + appName + "-" + "txtWorkOrderMaterialComment]").val();  	// Remove character "'": .replace(/'/g , "");
			// Assign selected Material to the current WorkOrder
			workorder_material.assign();
		}
		else {
			alert('Please select a valid Material...');
			return;
		}
	}
	else {
		workorder_material = workorder_materials.itemById($('select[name="cboWorkOrderMaterial"]').val());
		workorder_material.update($("input[id=" + appName + "-" + "txtWorkOrderMaterialQuantity]").val(), 
				                  $("input[id=" + appName + "-" + "txtWorkOrderMaterialComment]").val());
	}
	
	// Refresh the List of Material for the current WorkOrder
	gotoWorkOrderMaterials(phoneui.transitions.slideRight);
	workorder_materials.load(workorder.id, collaborator.id);
	phoneui.preprocessDOM('#' + appName + '-' + 'lstWorkOrderMaterials');
	phoneui.forceLayout();
}

function deleteWorkOrderMaterial() {
if(DEBUG) console.log('deleteWorkOrderMaterial()');

	Beep();
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'DeleteWorkOrderMaterial Button pressed.');

	workorder_material = workorder_materials.itemById($('select[name="cboWorkOrderMaterial"]').val());
 if (confirm("Do you really want to remove this Item from the List ?") == true) {
 	workorder_material.unassign();
 } 
 else {
 }
	
	// Refresh the List of Material for the current WorkOrder
	gotoWorkOrderMaterials(phoneui.transitions.slideRight);
	workorder_materials.load(workorder.id, collaborator.id);
	phoneui.preprocessDOM('#' + appName + '-' + 'lstWorkOrderMaterials');
	phoneui.forceLayout();
}

function cancelWorkOrderMaterial() {
if(DEBUG) console.log('cancelWorkOrderMaterial()');

	Beep();
	if(LOGFile) log.writeLog(LogFile.prototype.MSG_TYPE.UserAction, 'CancelWorkOrderMaterial Button pressed.');

	// Refresh the List of Material for the current WorkOrder
	gotoWorkOrderMaterials(phoneui.transitions.slideRight);
	phoneui.preprocessDOM('#' + appName + '-' + 'lstWorkOrderMaterials');
	phoneui.forceLayout();
}


////////////////////////////////////////////////////////////////////////////////////////////////////
// Workflow UI
//////////////////////////////////////////////////
function initIntumUI() {
if(DEBUG) console.log('initIntumUI()');

	// WorkOrder's Material ComboBox
	ewWorkOrderMaterials = new ElementUIWrapper(appName + '-' + 'cboWorkOrderMaterial');

	// WorkFlow UI Elements
	bwPictureBefore = new ButtonUIWrapper(appName + '-' + 'imgWorkflowPictureBefore', 'images/btn_photo_inactive.png', 1);
	cwPictureBefore = new CheckUIWrapper(appName + '-' + 'imgWorkflowPictureBeforeStatus', 'images/UncheckMark48x48.png', 1);
	bwMetree = new ButtonUIWrapper(appName + '-' + 'imgWorkflowMetree', 'images/btn_metree_inactive.png', 1);
	cwMetree = new CheckUIWrapper(appName + '-' + 'imgWorkflowMetreeStatus', 'images/UncheckMark48x48.png', 1);
	bwPictureAfter = new ButtonUIWrapper(appName + '-' + 'imgWorkflowPictureAfter', 'images/btn_photo_inactive.png', 1);
	cwPictureAfter = new CheckUIWrapper(appName + '-' + 'imgWorkflowPictureAfterStatus', 'images/UncheckMark48x48.png', 1);
	bwNewTask = new ButtonUIWrapper(appName + '-' + 'imgWorkflowNewTask', 'images/btn_add_inactive.png', 1); 
	bwWorkflowSound = new ButtonUIWrapper(appName + '-' + 'imgWorkflowSound', 'images/btn_sound_inactive.png', 1); 
	
	bwSaveMetree = new ButtonUIWrapper(appName + '-' + 'imgSaveMetree', 'images/btn_save_inactive.png', 1);
	bwNextMetree = new ButtonUIWrapper(appName + '-' + 'imgNextMetree', 'images/btn_marche_inactive.png', 1);
	bwCancelMetree = new ButtonUIWrapper(appName + '-' + 'imgCancelMetree', 'images/btn_cancel_inactive.png', 1);
	
	bwSaveMetreeObturation = new ButtonUIWrapper(appName + '-' + 'imgSaveMetreeObturation', 'images/btn_save_inactive.png', 1);
	bwCancelMetreeObturation = new ButtonUIWrapper(appName + '-' + 'imgCancelMetreeObturation', 'images/btn_cancel_inactive.png', 1);
	
	$('#' + appName + '-' + 'lstExecutedTasksListItem').css('visibility', 'hidden');
	
	$('#' + appName + '-' + 'txtDayTasksSummaryInfo').css('style', 'font-family:monospace;white-space:pre;overflow-x:hidden;overflow-y:hidden');
	$('#' + appName + '-' + 'lstDayTasksSummaryListItem').css('visibility', 'hidden');
	
	// Workorder Materials List 
	$('#' + appName + '-' + 'imgSpacer3').css('visibility', 'visible');
	$('#' + appName + '-' + 'txtWorkOrderMaterialFlagNew').css('visibility', 'hidden');
	bwWorkOrderMaterialSound = new ButtonUIWrapper(appName + '-' + 'imgWorkOrderMaterialSound', 'images/btn_sound_inactive.png', 1);
	bwWorkOrderMaterialSound.disable();
	bwWorkOrderMaterialPhoto = new ButtonUIWrapper(appName + '-' + 'imWorkOrderMaterialPhoto', 'images/btn_photo_inactive.png', 1);
	bwWorkOrderMaterialPhoto.disable();
	
	// Workorder Material Edit Page
	$('#' + appName + '-' + 'panelWorkOrderMaterial').css('visibility', 'visible');
	bwSaveWorkOrderMaterial = new ButtonUIWrapper(appName + '-' + 'imgSaveWorkOrderMaterial', 'images/btn_save_inactive.png', 1);
	bwSaveWorkOrderMaterial.disable();
	bwCancelWorkOrderMaterial = new ButtonUIWrapper(appName + '-' + 'imgCancelWorkOrderMaterial', 'images/btn_cancel_inactive.png', 1);
	bwCancelWorkOrderMaterial.disable();
	bwDeleteWorkOrderMaterial = new ButtonUIWrapper(appName + '-' + 'imgDeleteWorkOrderMaterial', 'images/btn_supprimer_inactive.png', 1);;
	bwDeleteWorkOrderMaterial.disable();
	
	$('#' + appName + '-' + 'lstWorkOrderMaterialsListItem').css('visibility', 'visible');
	
	// Task Metrees
	

}


////////////////////////////////////////////////////////////////////////////////////////////////////
// Keyboard Show/Hide Management
//////////////////////////////////////////////////
function intumKeyboardShow() {
	if(currentPage=='pageMetrees') {
		showPanelToolBarMetree(false);
		setTimeout(function() {
			if(document.activeElement.id==appName + '-' + 'txtTaskMetreeComment') {
				$('#' + appName + '-' + 'panelMetree').animate({scrollTop: (parseInt(($('#' + appName + '-' + 'panelMetree')[0].scrollHeight)/5))}, 500);
			}
			else {
				$('#' + appName + '-' + 'panelMetree').animate({scrollTop: 0}, 1000);
			}
		}, 5);
//		$('#' + appName + '-' + 'panelMetree').hide().fadeIn('fast');
//		$('#m1-RenelcoBMA_TimeClock-panelTaskMetree').hide().show(0);
//		phoneui.preprocessDOM();
//		phoneui.forceLayout('m1-RenelcoBMA_TimeClock-panelTaskMetree');
	}
	if(currentPage=='pageMetreesObturation') {
		showPanelToolBarMetreeObturation(false);
		setTimeout($('#' + appName + '-' + 'panelMetreeObturation').scrollTop(parseInt(($('#' + appName + '-' + 'panelMetreeObturation')[0].scrollHeight)/7)), 500);
		$('#' + appName + '-' + 'pageMetreeObturation').hide().fadeIn('fast');
//		phoneui.preprocessDOM();
//		phoneui.forceLayout('#' + appName + '-' + 'panelTaskMetreeObturation');
	}
	if(currentPage=='pageNotes') {
//		showPanelToolBarNotes(false);
//		setTimeout(function() {
//			$('#' + appName + '-' + 'panelNotes').scrollTop(parseInt(($('#' + appName + '-' + 'panelNotes')[0].scrollHeight)/9))
//		}, 500);
		
		showPanelToolBarNotes(false);
		$('#m1-RenelcoBMA_TimeClock-panelNotes').hide().show(0);
//		phoneui.preprocessDOM();
//		phoneui.forceLayout();
	}
	if(currentPage=='pageWorkOrderMaterials') {
		showPanelToolBarWorkOrderMaterials(false);
		phoneui.preprocessDOM();
		phoneui.forceLayout('#' + appName + '-' + 'panelWorkOrderMaterial');
	}
}

function intumKeyboardHide() {
	if(currentPage=='pageMetrees') {
		setTimeout(function() {
			$('#' + appName + '-' + 'panelMetree').animate({scrollTop: 0}, 1000);
			phoneui.forceLayout();
		}, 5);

		showPanelToolBarMetree(true);

		
//		phoneui.forceLayout();
		
//		showPanelToolBarMetree(true);
//		$('#m1-RenelcoBMA_TimeClock-panelTaskMetree').hide().show(0);
//		phoneui.preprocessDOM();
//		phoneui.forceLayout('m1-RenelcoBMA_TimeClock');
	}
	if(currentPage=='pageMetreesObturation') {
		setTimeout(function() {
			$('#' + appName + '-' + 'panelMetreeObturation').scrollTop(0);
			showPanelToolBarMetreeObturation(true);
			$('#' + appName + '-' + 'panelMetreeObturation').hide().show(0);
			phoneui.preprocessDOM();
			phoneui.forceLayout('#' + appName + '-' + 'pageMetreesObturation');
		}, 5);
	}
	if(currentPage=='pageNotes') {
//		setTimeout(function() {
//			$('#' + appName + '-' + 'panelNotes').scrollTop(0);
//		}, 500);
//		showPanelToolBarNotes(true);
//		phoneui.forceLayout();
		
		showPanelToolBarNotes(true);
		$('#m1-RenelcoBMA_TimeClock-panelNotes').hide().show(0);
		phoneui.preprocessDOM();
		phoneui.forceLayout('m1-RenelcoBMA_TimeClock');
	}
	if(currentPage=='pageWorkOrderMaterials') {
		showPanelToolBarWorkOrderMaterials(true);
		phoneui.preprocessDOM();
		phoneui.forceLayout('#' + appName + '-' + 'panelWorkOrderMaterial');
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Workflow Pages Navigation
//////////////////////////////////////////////////
function gotoWorkflow(transition) {
	currentPage = 'pageWorkflow';
//	showBackButton(false);	// Should be set to false before building the App with myEclipse 
	phoneui.gotoMultiPagePage(appName + '-' + 'multiPage1', 'SET_PAGE', appName + '-' + 'pageWorkflowIntum', transition);
}

function gotoMetrees(transition) {
	currentPage = 'pageMetrees';
//	if(activity.name=='Obturation') {
	if(activity.id==1) {
		$('#' + appName + '-' + 'panelMetreeData').css('visibility', 'visible');
	}
	else {
		$('#' + appName + '-' + 'panelMetreeData').css('visibility', 'hidden');
	}	
	phoneui.gotoMultiPagePage(appName + '-' + 'multiPage1', 'SET_PAGE', appName + '-' + 'pageMetrees', transition);
	phoneui.preprocessDOM('#' + appName);
}

function gotoMetreesObturation(transition) {
	currentPage = 'pageMetreesObturation';
	
	phoneui.gotoMultiPagePage(appName + '-' + 'multiPage1', 'SET_PAGE', appName + '-' + 'pageMetreesObturation', transition);
//	phoneui.preprocessDOM('#' + appName);
	setTimeout(function() { 
		setObturationTypes(); 
//		phoneui.preprocessDOM('#' + appName); 
	}, 
	750);
}

function gotoTaskDetails(transition) {
	currentPage = 'pageTaskDetails';
	$('#' + appName + '-' + 'panelTaskDetailsPictureBefore').css('background-color', LISTITEM_BACKCOLOR_LIGHT);
	$('#' + appName + '-' + 'panelTaskDetailsPictureAfter').css('background-color', LISTITEM_BACKCOLOR_LIGHT);
	phoneui.gotoMultiPagePage(appName + '-' + 'multiPage1', 'SET_PAGE', appName + '-' + 'pageTaskDetails', transition);
	phoneui.preprocessDOM('#' + appName);
}

function gotoPictureViewer(transition) {
	currentPage = 'pagePictureViewer';
	phoneui.gotoMultiPagePage(appName + '-' + 'multiPage1', 'SET_PAGE', appName + '-' + 'pagePictureViewer', transition);
	phoneui.preprocessDOM('#' + appName);
}

function gotoPartsList(transition) {
	currentPage = 'pagePartsList';
	phoneui.gotoMultiPagePage(appName + '-' + 'multiPage1', 'SET_PAGE', appName + '-' + 'pagePartsList', transition);
}

function gotoWorkOrderMaterials(transition) {
	currentPage = 'pageWorkOrderMaterials';
	setWorkOrder_MaterialsList();
	phoneui.gotoMultiPagePage(appName + '-' + 'multiPage1', 'SET_PAGE', appName + '-' + 'pageWorkOrderMaterials', transition);
}

function gotoWorkOrderMaterial(transition) {
	currentPage = 'pageWorkOrderMaterial';
	phoneui.gotoMultiPagePage(appName + '-' + 'multiPage1', 'SET_PAGE', appName + '-' + 'pageWorkOrderMaterial', transition);
}


function gotoNotes(transition) {
	alert('gotoNotes');
	currentPage = 'pageNotes';
	phoneui.gotoMultiPagePage(appName + '-' + 'multiPage1', 'SET_PAGE', appName + '-' + 'pageNotes', transition);
}

function gotoDayTasksSummary(transition) {
	currentPage = 'pageDayTasksSummary';
	phoneui.gotoMultiPagePage(appName + '-' + 'multiPage1', 'SET_PAGE', appName + '-' + 'pageDayTasksSummary', transition);
}

function intumGoBack() {
	
	if(currentPage=="pageWorkflow") {
		gotoWorkOrderActivity(phoneui.transitions.slideRight);
		return;
	}
	if(currentPage=="pageMetrees") {
//		gotoWorkflow(phoneui.transitions.slideRight);
		return;
	}
	if(currentPage=="pageMetreesObturation") {
		gotoMetrees(phoneui.transitions.slideRight);
		return;
	}
	if(currentPage=="pageTaskDetails") {
		if((workStateManager.state==='OnActivity') || (workStateManager.state==='OnTask')) {
			gotoWorkflow(phoneui.transitions.slideRight);
		}
		if(workStateManager.state==='EndWorkOrder') {
			gotoDayTasksSummary(phoneui.transitions.slideRight);
		}
		return;
	}
	if(currentPage=="pagePictureViewer") {
		gotoTaskDetails(phoneui.transitions.slideRight);
		return;
	}
	if(currentPage=="pageWorkOrderMaterial") {
		gotoWorkOrderMaterials(phoneui.transitions.slideRight);
		return;
	}
	if(currentPage=="pageWorkOrderMaterials") {
		gotoWorkOrderActivity(phoneui.transitions.slideRight);
		return;
	}
	if(currentPage=="pageDayTasksSummary") {
		gotoWorkOrderActivity(phoneui.transitions.slideLeft);
		return;
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////