// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.GroupListItem
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.launchpad.DeleteArea");
    jQuery.sap.require("sap.ui.core.IconPool");
    jQuery.sap.require("sap.ushell.resources");

    module("sap.ushell.ui.launchpad.DeleteArea", {
        setup: function () {

        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {

        }
    });

    var demiItemData = {
            type: sap.ushell.ui.launchpad.DeleteAreaType.GroupList,
            message: sap.ushell.resources.i18n.getText("deleteAreaMsgForGroup"),
            icon: sap.ui.core.IconPool.getIconURI('delete')
        };

    test("Constructor Test", function () {
        var deleteArea = new sap.ushell.ui.launchpad.DeleteArea(demiItemData);
        ok(deleteArea.getType() === sap.ushell.ui.launchpad.DeleteAreaType.GroupList, "Type test");
        ok(deleteArea.getMessage() === sap.ushell.resources.i18n.getText("deleteAreaMsgForGroup"), "Message test");
        ok(deleteArea.getIcon() === sap.ui.core.IconPool.getIconURI('delete'), "Icon test");
    });

    test("setMessage test", function () {
        var deleteArea = new sap.ushell.ui.launchpad.DeleteArea(demiItemData);
        deleteArea.setMessage("this is a new custom message");
        ok(deleteArea.getMessage() === "this is a new custom message", "setMessage test");
        deleteArea.setMessage("yet a new custom message");
        ok(deleteArea.getMessage() === "yet a new custom message", "setMessage test");
    });
}());
