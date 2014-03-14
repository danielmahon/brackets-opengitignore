/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/** {ext_name} Extension 
    description 
*/
define(function (require, exports, module) {
	'use strict';

	var CommandManager = brackets.getModule("command/CommandManager");
	var Menus = brackets.getModule("command/Menus");
	//var EditorManager  = brackets.getModule("editor/EditorManager");
	var ProjectManager = brackets.getModule("project/ProjectManager");
	//var FileUtils = brackets.getModule("file/FileUtils");    
	var DocumentManager = brackets.getModule("document/DocumentManager");
	//var NativeApp = brackets.getModule("utils/NativeApp");
	//var Commands = brackets.getModule("command/Commands");
	var Strings = brackets.getModule("strings");
	var Dialogs = brackets.getModule("widgets/Dialogs");
	var ErrorTemplate = require("text!error.html");


	var COMMAND_ID = "danielmahon.opengitignore";
	var MENU_NAME = "Open .gitignore";

	function showDialog(msg, cb) {
		msg = msg || 'Error: Message not defined!';
		
		Dialogs.showModalDialogUsingTemplate(Mustache.render(ErrorTemplate, {
			Strings: Strings,
			msg: msg
		})).done(function (id) {
			if (id === Dialogs.DIALOG_BTN_OK) {
				// do nothing
			}
			if (cb) cb();
		});
	}

	function doMyCommand() {
		var path = '';

		console.log(COMMAND_ID + ": Finding and opening .gitignore");

		var selectedEntry = ProjectManager.getSelectedItem();

		if (!selectedEntry) {
			showDialog('<p>You must select a file or folder!</p>');
			return;
		}

		if (selectedEntry._isDirectory) {
			path = selectedEntry.fullPath + '.gitignore';
		} else {
			path = selectedEntry.parentPath + '.gitignore';
		}

		DocumentManager.getDocumentForPath(path).done(
			function (doc) {
				DocumentManager.setCurrentDocument(doc);
			}
		).fail(function (err) {
			if (err === 'NotFound') {
				showDialog('<p><strong>.gitignore does not exist at the location:</strong></p><p><em>"' + path + '"</em></p><p>Double check which file/folder you have selected and that ".gitignore" is already created and try again.</p><p><strong>Usage:</strong></p><p>If you select a file, it will look in the parent directory for the ".gitignore".<br/>If you select a folder, it will look inside that folder.<br/>If you select nothing, it will look in the project root.');
			} else {
				showDialog(err || 'Unknown Error!');
			}
		});
	}


	CommandManager.register(MENU_NAME, COMMAND_ID, doMyCommand);

	var contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU);
	contextMenu.addMenuDivider();
	contextMenu.addMenuItem(COMMAND_ID);

});