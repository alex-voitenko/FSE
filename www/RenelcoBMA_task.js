//////////////////////////////////////////////////
// Define Task Class
//////////////////////////////////////////////////

/** Task
 * This class encapsulates a Task.
 *
 */	
/**
 * @author Hell
 */
/**
 *  Task Class Definition 
 */
var Task = (function () {
	var Task = function (id, collaborator_id, workorder_id, activity_id, name, description, executed, duration) {
		if(DEBUG) alert('Enter Task() Constructor...');
		this.id = id || -1;
		this.collaborator_id = collaborator_id || -1; 
		this.workorder_id = workorder_id || -1;
		this.activity_id = activity_id || -1;
		this.name = name || '';
		this.description = description || '';
		this.executed = executed || new Date();
		this.duration = duration || 0;
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.TaskEvent = new CustomEvent("Task", {
				detail: {
					id: 0,
					collaborator_id: 0,
					workorder_id: 0,
					activity_id: 0,
					name: '',
					description: '',
					executed: new Date(),
					duration: 0,
					time: new Date()
				},
				bubbles: true,
				cancelable: false
			});
		}
		else {
			if(deviceInfo.isKitKat()==true) {
//				alert('KitKat Device...');
				this.TaskEvent = new CustomEvent("Task", {
					detail: {
						id: 0,
						collaborator_id: 0,
						workorder_id: 0,
						activity_id: 0,
						collaborator_id: 0,
						name: '',
						description: '',
						executed: new Date(),
						duration: 0,
						time: new Date()
					},
					bubbles: true,
					cancelable: false
				});
			}
			else {
//				alert('NOT a KitKat Device...');
				this.TaskEvent = document.createEvent("CustomEvent");
				this.TaskEvent.initCustomEvent('Task', true, false, {id: 0, collaborator_id: 0, workorder_id: 0, activity_id: 0, name: '', description: '', executed: new Date(), duration: 0, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Task Constructor...');
	};

	Task.prototype = {
		reset: function() {
//		if(DEBUG) alert('Task.reset()');
		var thisTask = this;
			thisTask.id = -1;
			thisTask.collaborator_id = -1;
			thisTask.workorder_id = -1;
			thisTask.activity_id = -1;
			thisTask.name = '';
			thisTask.description = '';
			thisTask.executed = new Date();
			thisTask.duration = 0;
		    thisTask.fireEvent();
		},
		create: function() {
		if(DEBUG) alert('Task.create()');
		var thisTask = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/addTask";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"collaborator_id": thisTask.collaborator_id,
						   "workorder_id": thisTask.workorder_id,
					   	   "activity_id": thisTask.activity_id,
						   "name": thisTask.name,
						   "description": thisTask.description,
						   "executed": thisTask.executed,
						   "duration": thisTask.duration},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    $xml.find("Entry").each(function() {
					        var $this = $(this);
					        var returnedId = $this.find("ID").text();
					        thisTask.id = returnedId;
					    });
					    thisTask.fireEvent();
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
					tx.executeSql('INSERT INTO TASK  ' +
								  '(COLLABORATOR_ID, WORKORDER_ID, ACTIVITY_ID, NAME, DESCRIPTION, EXECUTED, DURATION) ' +
								  'VALUES(?,?,?,?,?,?,?)',
								  [thisTask.collaborator_id,
								   thisTask.workorder_id,
							   	   thisTask.activity_id,
								   thisTask.name,
								   thisTask.description,
								   thisTask.executed,
								   thisTask.duration],
							   	   function(tx, rs) {
								   		thisTask.id = rs.insertId;
										thisTask.fireEvent();
								   },
								   function() {
									   	alert('Task INSERT Error');
								   });
				});
			}
		},
		update: function() {
//		if(DEBUG) alert('Task.update()');	
		var thisTask = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/saveTask";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workorder_id": thisTask.workorder_id,
						   "activity_id": thisTask.activity_id,						   
						   "name": thisTask.name,
						   "description": thisTask.description,
						   "duration": thisTask.duration,
						   "task_id": thisTask.id,
						   "collaborator_id": thisTask.collaborator_id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisTask.fireEvent();
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
							tx.executeSql('UPDATE TASK  ' +
										  'SET ' +
										  'WORKORDER_ID = ?,'+
										  'ACTIVITY_ID = ?,' +
										  'NAME = ?,' +
										  'DESCRIPTION = ?,' +
										  'DURATION = ? ' +
										  'WHERE TASK_ID = ?' +
										  ' AND COLLABORATOR_ID = ?',
								  [thisTask.workorder_id,
								   thisTask.activity_id,
								   thisTask.name,
								   thisTask.description,
								   thisTask.duration,
								   thisTask.id,
								   thisTask.collaborator_id,],
							   	   function() {
										thisTask.fireEvent();
								   },
								   function() {
									   alert('Task UPDATE Error');
								   });
				});
			}
		},
		suppress: function() {
//		if(DEBUG) alert('Task.suppress()');
			var thisTask = this;
			
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/deleteTask";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"task_id": thisTask.id,
						   "collaborator_id": thisTask.collaborator_id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var retId = -1;
					    thisTask.fireEvent();
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
					tx.executeSql('DELETE FROM TASK WHERE TASK_ID = ? AND COLLABORATOR_ID = ?', 
							      [thisTask.id,
							       thisTask.collaborator_id], 
							      function() {
										thisTask.fireEvent();	
								  }, 
							      function() {
								  	  alert('Task DELETE Error');
								  });
				});
			}
		},
		select: function(taskId, collaboratorId) {
//		if(DEBUG) alert('Task.select(' + id + ')');
		var thisTask = this;
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getTask";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"task_id": taskId,
						   "collaborator_id": collaboratorId},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        thisTask.id = $this.find("TASK_ID").text();
					        thisTask.collaborator_id = $this.find("COLLABORATOR_ID").text();
					        thisTask.workorder_id = $this.find("WORKORDER_ID").text();
					        thisTask.activity_id = $this.find("ACTIVITY_ID").text();
					        thisTask.name = $this.find("NAME").text();
					        thisTask.description = $this.find("DESCRIPTION").text();
					        thisTask.executed = $this.find("EXECUTED").text();
					        thisTask.duration = $this.find("DURATION").text();
					    });
					    thisTask.fireEvent();
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
					tx.executeSql('SELECT TASK_ID, COLLABORATOR_ID, WORKORDER_ID, ACTIVITY_ID, NAME, DESCRIPTION, EXECUTED, DURATION  ' +
								  'FROM TASK WHERE TASK_ID = ? AND COLLABORATOR_ID = ?', 
							      [taskId, collaboratorId], 
							      function (tx, rs) {
								  	var data = rs.rows;
									for (var i=0; i<data.length; i++) {
								        thisTask.id = data.item(i).TASK_ID;
								        thisTask.collaborator_id = data.item(i).COLLABORATOR_ID;
								        thisTask.workorder_id = data.item(i).WORKORDER_ID;
								        thisTask.activity_id = data.item(i).ACTIVITY_ID;
								        thisTask.name = data.item(i).NAME;
								        thisTask.description = data.item(i).DESCRIPTION;
								        thisTask.executed = data.item(i).EXECUTED;
								        thisTask.duration = data.item(i).DURATION;
									}
									thisTask.fireEvent();
								  }, 
								  function() {
									  alert('Task SELECT Error');
								  });
				});
			}
		},
		show: function() {
		var thisTask = this;
			alert('Task Data:\n' +
				  'Task Id: ' + thisTask.id + '\n' +	
				  'Collaborator Id: ' + thisTask.collaborator_id + '\n' +	
				  'WorkOrder Id: ' + thisTask.workorder_id + '\n' +	
				  'Activity Id: ' + thisTask.activity_id + '\n' +	
				  'Collaborator Id: ' + thisTask.collaborator_id + '\n' +	
				  'Name: ' + thisTask.name + '\n' +	
				  'Description: ' + thisTask.description + '\n' +	
				  'Date Execution: ' + thisTask.executed + '\n' +
				  'Duration: ' + thisTask.duration + '\n');
		},
		addEventListener: function(name, handler, capture) {
//		if(DEBUG) alert('Enter Task.addEventListener() ...');
			if (!this.events) this.events = {};
			if (!this.events[name]) this.events[name] = [];
			this.events[name].push(handler);
//			alert(JSON.stringify(this.events));
		},
		removeEventListener: function(name, handler) {
//		if(DEBUG) alert('Enter Task.removeEventListener() ...');
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
//		if(DEBUG) alert('Executing Task.dispatchEvent(' + JSON.stringify(event) + ') ...');
//		if(DEBUG) alert('Registered Events: ' + JSON.stringify(this.events[event.type]));
			var name = event.type;
		    for (var i= 0; i<this.events[name].length; i++) {
//		   		alert('Indexed Event: ' + this.events[name][i]);
		        this[this.events[name][i]](event);
		    }
		    return !event.defaultPrevented;		
		},
		assignEvent: function(element) {
		if(DEBUG) alert('Task.AssignEvent');
		var thisTask = this;
			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisTask.objectId = new Object();
				thisTask.objectId = element;
				thisTask.objectId.addEventListener('Task', 'onTask', false);
			}
			else {
//				alert('It is an HTML Element');
				thisTask.htmlElement = element;
				document.getElementById(thisTask.htmlElement).addEventListener("Task", onTask, false);
			}
		},
		fireEvent: function() {
		if(DEBUG) alert('Task.FireEvent');
		var thisTask = this;
			thisTask.TaskEvent.detail.id = thisTask.id;
			thisTask.TaskEvent.detail.collaborator_id = thisTask.collaborator_id;
			thisTask.TaskEvent.detail.workorder_id = thisTask.workorder_id;
			thisTask.TaskEvent.detail.activity_id = thisTask.activity_id;
			thisTask.TaskEvent.detail.name = thisTask.name;
			thisTask.TaskEvent.detail.description = thisTask.description;
			thisTask.TaskEvent.detail.executed = thisTask.executed;
			thisTask.TaskEvent.detail.duration = thisTask.duration;
			if (thisTask.objectId!=null){
//				alert('Event fired to an Object');
				thisTask.objectId.dispatchEvent(thisTask.TaskEvent);
			}
			if(thisTask.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisTask.htmlElement).dispatchEvent(thisTask.TaskEvent);
			}
		},
		store: function() {
//		alert('Task.store()');
			localStorage.setItem('Task', JSON.stringify(this));
		},
		restore: function() {
//		alert('Task.restore()');
		var thisTask = this;
		var item = JSON.parse(localStorage.getItem('Task'));	
			thisTask.id = item.id;
			thisTask.collaborator_id = item.collaborator_id;
			thisTask.workorder_id = item.workorder_id;
			thisTask.activity_id = item.activity_id;
			thisTask.name = item.name;
			thisTask.description = item.description;
			thisTask.executed = item.executed;
			thisTask.duration = item.duration;
			thisTask.htmlElement = item.htmlElement;
			thisTask.objectId = item.objectId;
			thisTask.TaskEvent = item.TaskEvent;
			thisTask.fireEvent();
		},
		unstore: function() {
		alert('Task.remove()');
		var thisTask = this;
			localStorage.removeItem('Task');
		},
		isStored: function() {
//		alert('Task.isStored()');
		var thisTask = this;
		var storage = localStorage.getItem('Task');
			if(storage!=null) {
				return true;
			}
			return false;
		}
	};
	return Task;
})();


var TaskCollection = (function () {
	
	var TaskCollection = function () {
		if(DEBUG) alert('Enter TaskCollection() Constructor...');
		this.count = 0;
		this.collection = {};
		this.htmlElement = null;
		this.objectId = null;
		if(deviceInfo===undefined) {
//			alert('DeviceInfo not available,\n Defining Event for KITKAT Device (Android 4.4.x) ...');
			this.TaskCollectionEvent = new CustomEvent("TaskCollection", {
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
				this.TaskCollectionEvent = new CustomEvent("TaskCollection", {
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
				this.TaskCollectionEvent = document.createEvent("CustomEvent");
				this.TaskCollectionEvent.initCustomEvent('TaskCollection', true, false, {count: 0, items: undefined, time: new Date()});
			}
		}
		if(DEBUG) alert('Exit Constructor...');
	};

	TaskCollection.prototype = {
		reset: function() {
		if(DEBUG) alert('reset');
		var thisTaskCollection = this;
			thisTaskCollection.collection = {};
			thisTaskCollection.count = 0;
		},
		load: function() {
//		if(DEBUG) alert('load');
		var thisTaskCollection = this;

			thisTaskCollection.reset();
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getTasks";
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
					        item = new Task($this.find("TASK_ID").text(),
			        						$this.find("COLLABORATOR_ID").text(),
					        				$this.find("WORKORDER_ID").text(),
					        				$this.find("ACTIVITY_ID").text(),
					        				$this.find("NAME").text(),
					        				$this.find("DESCRIPTION").text(),
					        				$this.find("EXECUTED").text(),
					        				$this.find("DURATION").text());
	//				        alert(JSON.stringify(item));
					        thisTaskCollection.add(key++, item);
					    });
					    thisTaskCollection.fireEvent();
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
					tx.executeSql('SELECT TASK_ID, COLLABORATOR_ID, WORKORDER_ID, ACTIVITY_ID, NAME, DESCRIPTION, EXECUTED, DURATION  ' +
							      'FROM TASK', 
							      [], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
									for (var i=0; i<data.length; i++) {
								        var item = new Task(data.item(i).TASK_ID,
					        								data.item(i).COLLABORATOR_ID,
								        					data.item(i).WORKORDER_ID,
								        					data.item(i).ACTIVITY_ID,
								        					data.item(i).NAME,
								        					data.item(i).DESCRIPTION,
								        					data.item(i).EXECUTED,
								        					data.item(i).DURATION);
	//			        				alert(JSON.stringify(item));
								        thisTaskCollection.add(key++, item);
									}
									thisTaskCollection.fireEvent();
								  }, 
								  null);
				});
			}
		},
		loadByWorkOrder: function(workorder_id) {
//		if(DEBUG) alert('loadByWorkOrder');
		var thisTaskCollection = this;

			thisTaskCollection.reset();
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getWorkOrderTasks";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workorder_id": workorder_id},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var key = 0;
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        item = new Task($this.find("TASK_ID").text(),
			        						$this.find("COLLABORATOR_ID").text(),
					        				$this.find("WORKORDER_ID").text(),
					        				$this.find("ACTIVITY_ID").text(),
					        				$this.find("NAME").text(),
					        				$this.find("DESCRIPTION").text(),
					        				$this.find("EXECUTED").text(),
					        				$this.find("DURATION").text());
	//				        alert(JSON.stringify(item));
					        if(item.duration>0) thisTaskCollection.add(key++, item);
					    });
					    thisTaskCollection.fireEvent();
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
					tx.executeSql('SELECT TASK_ID, COLLABORATOR_ID, WORKORDER_ID, ACTIVITY_ID, NAME, DESCRIPTION, EXECUTED, DURATION  ' +
							      'FROM TASK WHERE WORKORDER_ID = ?', 
							      [workorder_id], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
									for (var i=0; i<data.length; i++) {
								        var item = new Task(data.item(i).TASK_ID,
					        								data.item(i).COLLABORATOR_ID,
								        					data.item(i).WORKORDER_ID,
								        					data.item(i).ACTIVITY_ID,
								        					data.item(i).NAME,
								        					data.item(i).DESCRIPTION,
								        					data.item(i).EXECUTED,
								        					data.item(i).DURATION);
	//			        				alert(JSON.stringify(item));
								        thisTaskCollection.add(key++, item);
									}
									if(item.duration>0) thisTaskCollection.fireEvent();
								  }, 
								  null);
				});
			}
		},
		loadByWorkOrderCollaborator: function(workorderId, collaboratorId) {
//		if(DEBUG) alert('loadByWorkOrderCollaborator');
		var thisTaskCollection = this;

			thisTaskCollection.reset();
		
			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getWorkOrderCollaboratorTasks";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workorder_id": workorderId,
					       "collaborator_id": collaboratorId},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var key = 0;
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        item = new Task($this.find("TASK_ID").text(),
			        						$this.find("COLLABORATOR_ID").text(),
					        				$this.find("WORKORDER_ID").text(),
					        				$this.find("ACTIVITY_ID").text(),
					        				$this.find("NAME").text(),
					        				$this.find("DESCRIPTION").text(),
					        				$this.find("EXECUTED").text(),
					        				$this.find("DURATION").text());
	//				        alert(JSON.stringify(item));
					        if(item.duration>0) thisTaskCollection.add(key++, item);
					    });
					    thisTaskCollection.fireEvent();
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
					tx.executeSql('SELECT TASK_ID, COLLABORATOR_ID, WORKORDER_ID, ACTIVITY_ID, NAME, DESCRIPTION, EXECUTED, DURATION  ' +
						          'FROM TASK ' +
						          'WHERE WORKORDER_ID = ? AND COLLABORATOR_ID = ?', 
							      [workorderId,collaboratorId], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
									for (var i=0; i<data.length; i++) {
								        var item = new Task(data.item(i).TASK_ID,
					        								data.item(i).COLLABORATOR_ID,
								        					data.item(i).WORKORDER_ID,
								        					data.item(i).ACTIVITY_ID,
								        					data.item(i).NAME,
								        					data.item(i).DESCRIPTION,
								        					data.item(i).EXECUTED,
								        					data.item(i).DURATION);
		//			        				alert(JSON.stringify(item));
								        if(item.duration>0) thisTaskCollection.add(key++, item);
									}
									thisTaskCollection.fireEvent();
								  }, 
								  null);
				});
			}
		},
		loadByWorkOrderCollaboratorActivity: function(workorderId, collaboratorId, activityId) {
//		if(DEBUG) alert('loadByWorkOrderCollaboratorActivity');
		var thisTaskCollection = this;

			thisTaskCollection.reset();

			if(LOCAL_DB==false) {
				var url = urlDataServices + "/getWorkOrderCollaboratorActivityTasks";
				$.ajax ({
					type: "GET",
					url: url,
					data: {"workorder_id": workorderId,
					       "collaborator_id": collaboratorId,
					       "activity_id": activityId},
					datatype: "xml",
					timeout: 25000,
					success: function(data) {
					    var $xml = $(data);
					    var key = 0;
					    $xml.find("Row").each(function() {
					        var $this = $(this);
					        item = new Task($this.find("TASK_ID").text(),
			        						$this.find("COLLABORATOR_ID").text(),
					        				$this.find("WORKORDER_ID").text(),
					        				$this.find("ACTIVITY_ID").text(),
					        				$this.find("NAME").text(),
					        				$this.find("DESCRIPTION").text(),
					        				$this.find("EXECUTED").text(),
					        				$this.find("DURATION").text());
	//					        alert(JSON.stringify(item));
					        if(item.duration>0) thisTaskCollection.add(key++, item);
					    });
					    thisTaskCollection.fireEvent();
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
					tx.executeSql('SELECT TASK_ID, COLLABORATOR_ID, WORKORDER_ID, ACTIVITY_ID, NAME, DESCRIPTION, EXECUTED, DURATION  ' +
						          'FROM TASK WHERE WORKORDER_ID = ? AND COLLABORATOR_ID = ? AND ACTIVITY_ID = ?', 
							      [workorderId, 
							       collaboratorId,
							       activityId], 
							      function (tx, rs) {
								  	var data = rs.rows;
								  	var key = 0;
									for (var i=0; i<data.length; i++) {
								        var item = new Task(data.item(i).TASK_ID,
					        								data.item(i).COLLABORATOR_ID,
								        					data.item(i).WORKORDER_ID,
								        					data.item(i).ACTIVITY_ID,
								        					data.item(i).NAME,
								        					data.item(i).DESCRIPTION,
								        					data.item(i).EXECUTED,
								        					data.item(i).DURATION);
		//			        				alert(JSON.stringify(item));
								        if(item.duration>0) thisTaskCollection.add(key++, item);
									}
									thisTaskCollection.fireEvent();
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
			alert(this.collection.length);
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
//		alert('AssignEvent');
		var thisTaskCollection = this;

			if (element!==null && typeof element==='object') {
//				alert('It is an Object');
				thisTaskCollection.objectId = new Object();
				thisTaskCollection.objectId = element;
				thisTaskCollection.objectId.addEventListener('TaskCollection', 'onTaskCollection', false);
			}
			else {
//				alert('It is an HTML Element');
				thisTaskCollection.htmlElement = element;
				document.getElementById(thisTaskCollection.htmlElement).addEventListener("TaskCollection", onTaskCollection, false);
			}
		},
		fireEvent: function() {
//			alert('FireEvent');
			var thisTaskCollection = this;
			thisTaskCollection.TaskCollectionEvent.detail.count = thisTaskCollection.count;
			thisTaskCollection.TaskCollectionEvent.detail.items = thisTaskCollection.collection;
			
			if (thisTaskCollection.objectId!=null){
//				alert('Event fired to an Object');
				thisTaskCollection.objectId.dispatchEvent(thisTaskCollection.TaskCollectionEvent);
			}
			if(thisTaskCollection.htmlElement!=null) {
//				alert('Event fired to an HTML Element');
				document.getElementById(thisTaskCollection.htmlElement).dispatchEvent(thisTaskCollection.TaskCollectionEvent);
			}
		},
		store: function() {
//		if(DEBUG) alert('TaskCollection.store()');
		var thisTaskCollection = this;
			localStorage.setItem('TaskCollection', JSON.stringify(thisTaskCollection));
		},
		restore: function() {
//		if(DEBUG) alert('TaskCollection.restore()');
		var thisTaskCollection = this;
		var item = JSON.parse(localStorage.getItem('TaskCollection'));	
			thisTaskCollection.count = item.count;
			thisTaskCollection.collection = item.collection;
			thisTaskCollection.htmlElement = item.htmlElement;
			thisTaskCollection.objectId = item.objectId;
			thisTaskCollection.TaskCollectionEvent = item.TaskCollectionEvent;
			thisTaskCollection.fireEvent();
		},
		unstore: function() {
		if(DEBUG) alert('TaskCollection.unstore()');
			localStorage.removeItem('TaskCollection');
		},
		isStored: function() {
//		if(DEBUG) alert('TaskCollection.isStored()');
		var storage = localStorage.getItem('TaskCollection');
			if(storage!=null) {
				return true;
			}
			return false;
		}
		
	};
	return TaskCollection;
	
})();

