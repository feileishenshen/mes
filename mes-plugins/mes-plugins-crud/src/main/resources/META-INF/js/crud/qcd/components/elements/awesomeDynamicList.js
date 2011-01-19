
var QCD = QCD || {};
QCD.components = QCD.components || {};
QCD.components.elements = QCD.components.elements || {};

QCD.components.elements.AwesomeDynamicList = function(_element, _mainController) {
	$.extend(this, new QCD.components.Container(_element, _mainController));
	
	var mainController = _mainController;
	var elementPath = this.elementPath;
	var elementSearchName = this.elementSearchName;
	
	var innerFormContainer;
	var awesomeDynamicListContent;
	
	var formObjects;
	var formObjectsIndex = 1;
	
	var currentWidth;
	var currentHeight;
	
	var firstLine;
	
	var BUTTONS_WIDTH = 50;
	
	var hasButtons = this.options.hasButtons;
	
	function constructor(_this) {
		innerFormContainer = $("#"+_this.elementSearchName+" > .awesomeDynamicListInnerForm").children();
		awesomeDynamicListContent = $("#"+_this.elementSearchName+" > .awesomeDynamicListContent");
		formObjects = new Array();
		formObjectsMap = new Object();
		if (!hasButtons) {
			BUTTONS_WIDTH = 0;
		}
		updateButtons();
	}
	
	this.getComponentValue = function() {
		var formValues = new Array();
		for (var i in formObjects) {
			if (! formObjects[i]) {
				continue;
			}
			formValues.push({
				name: formObjects[i].elementName,
				value: formObjects[i].getValue()
			});
		}
		return { 
			forms: formValues
		};
	}
	
	this.setComponentValue = function(value) {
		var forms = value.forms;
		if (forms) {
			formObjects = new Array();
			awesomeDynamicListContent.empty();
			this.components = new Object();
			formObjectsIndex = 1;
			for (var i in forms) {
				var formValue = forms[i];
				var formObject = getFormCopy(formObjectsIndex);
				formObject.setValue(formValue);
				formObjects[formObjectsIndex] = formObject;
				this.components[formObject.elementName] = formObject;
				formObjectsIndex++;
			}
			updateButtons();
		} else {
			var innerFormChanges = value.innerFormChanges;
			for (var i in innerFormChanges) {
				this.components[i].setValue(innerFormChanges[i]);
			}
		}
	}
	
	this.setComponentState = function(state) {
	}
	
	this.setComponentEnabled = function(isEnabled) {
	}
	
	this.setComponentLoading = function(isLoadingVisible) {
	}
	
	this.updateSize = function(_width, _height) {
		currentWidth = _width;
		currentHeight = _height;
		//this.element.width(currentWidth);
		QCD.info("updateSize - "+_width);
		for (var i in formObjects) {
			formObjects[i].updateSize(_width-BUTTONS_WIDTH, _height);
		}
	}
	
	function getFormCopy(formId) {
		var copy = innerFormContainer.clone();
		changeElementId(copy, formId);
		var line = $("<div>").addClass("awesomeListLine").attr("id", elementPath+"_line_"+formId);
		var formContainer = $("<div>").addClass("awesomeListFormContainer");
		formContainer.append(copy);
		line.append(formContainer);
		if (hasButtons) {
			var buttons = $("<div>").addClass("awesomeListButtons");
		
			var removeLineButton = $("<a>").addClass("awesomeListButton").addClass("awesomeListMinusButton").addClass("enabled").attr("id", elementPath+"_line_"+formId+"_removeButton");
			removeLineButton.css("display", "none");
			removeLineButton.click(function(e) {
				var button = $(e.target);
				if (button.hasClass("enabled")) {
					var lineId = button.attr("id").substring(elementPath.length+6, button.attr("id").length-13); 
					removeRowClicked(lineId);
				}
			});
			buttons.append(removeLineButton);
			var addLineButton = $("<a>").addClass("awesomeListButton").addClass("awesomeListPlusButton").addClass("enabled").attr("id", elementPath+"_line_"+formId+"_addButton");
			addLineButton.click(function(e) {
				var button = $(e.target);
				if (button.hasClass("enabled")) {
					var lineId = button.attr("id").substring(elementPath.length+6, button.attr("id").length-10); 
					addRowClicked(lineId);
				}
			});
			addLineButton.css("display", "none");
			buttons.append(addLineButton);
			
			line.append(buttons);
		}
		awesomeDynamicListContent.append(line);
		var formObject = QCDPageConstructor.getChildrenComponents(copy, mainController)["innerForm_"+formId];
		formObject.updateSize(currentWidth-BUTTONS_WIDTH, currentHeight);
		formObject.setEnabled(true, true);
		return formObject;
	}
	
	function addRowClicked(rowId) {
		var formObject = getFormCopy(formObjectsIndex);
		formObjects[formObjectsIndex] = formObject;
		formObjectsIndex++;
		updateButtons();
	}
	
	function removeRowClicked(rowId) {
		var line = $("#"+elementSearchName+"_line_"+rowId);
		line.remove();
		formObjects[rowId] = null;
		updateButtons();
	}
	
	function updateButtons() {
		if (!hasButtons) {
			return;
		}
		var objectCounter = 0;
		var lastObject = 0;
		for (var i in formObjects) {
			if (formObjects[i]) {
				objectCounter++;
				lastObject = i;
			}
		}
		if (objectCounter  > 0) {
			if (firstLine) {
				firstLine.hide();
				firstLine = null;
			}
			for (var i in formObjects) {
				if (! formObjects[i]) {
					continue;
				}
				var removeButton = $("#"+elementSearchName+"_line_"+i+"_removeButton");
				var addButton = $("#"+elementSearchName+"_line_"+i+"_addButton");
				removeButton.show();
				if (i == lastObject) {
					addButton.show();
				} else {
					addButton.hide();
				}
			}	
		} else {
			firstLine = $("<div>").addClass("awesomeListLine").attr("id", elementPath+"_line_0");
			var buttons = $("<div>").addClass("awesomeListButtons");
			var addLineButton = $("<a>").addClass("awesomeListButton").addClass("awesomeListPlusButton").addClass("enabled").attr("id", elementPath+"_line_0_addButton");
			addLineButton.click(function(e) {
				var button = $(e.target);
				if (button.hasClass("enabled")) {
					var lineId = button.attr("id").substring(elementPath.length+6, button.attr("id").length-10); 
					addRowClicked(lineId);
				}
			});
			buttons.append(addLineButton);
			firstLine.append(buttons);
			awesomeDynamicListContent.append(firstLine);
		}
	}
	
	
	
	function changeElementId(element, formId) {
		var id = element.attr("id");
		if (id) {
			element.attr("id",id.replace("@innerFormId", formId));
		}
		element.children().each(function(i,e) {
			var kid = $(e);
			changeElementId(kid, formId)
		});
	}
	
	constructor(this);
}