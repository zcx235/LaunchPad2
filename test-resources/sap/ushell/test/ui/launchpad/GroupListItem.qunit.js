// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.GroupListItem
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.launchpad.GroupListItem"); 
    jQuery.sap.require("sap.ushell.resources");

    module("sap.ushell.ui.launchpad.GroupListItem", {
        setup: function () {
        	sap.ushell.bootstrap("demo");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
        	delete sap.ushell.Container;
        }
    });
    var demiItemData = {
            title : "defaultGroup",
            defaultGroup : true,
            groupId : "group1",
            editMode : false,
            removable : true,
            numberOfTiles : 5,
            afterRendering : function afterRender(){},
    };

    test("Constructor Test", function () {
        var item = new sap.ushell.ui.launchpad.GroupListItem(demiItemData);
        ok(item.getTitle() == "defaultGroup", "title Test");
        ok(item.getGroupId() == "group1", "id Test");
        ok(item.getProperty("editMode") == false, "edit Mode Test");
    });

    test("startEdit Test", function () {
        var item = new sap.ushell.ui.launchpad.GroupListItem(demiItemData);
        item._startEdit();
        ok(item.getProperty("editMode") == true, "edit Mode property has been set");
        ok(item.getId() == item.getFocusInfo().id, "focus is on the current element");
    });
    
    test("startEdit when personalization is off Test", function () {
    	var oRenderer = sap.ushell.Container.createRenderer("fiori2");
    	sap.ui.getCore().byId("shell").getModel().setProperty("/personalization", false);
        var item = new sap.ushell.ui.launchpad.GroupListItem(demiItemData);
        item.ondblclick();
        ok(item.getProperty("editMode") == false, "edit Mode property has not been set");
        ok(item.getId() == item.getFocusInfo().id, "focus is on the current element");
        oRenderer.destroy();
    });
}());
