// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.Message
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    // require early so that we can spy on them (and esp. try to restore the spies in teardown)
    jQuery.sap.require("sap.ushell.services.Container"); // necessary for stand-alone tests

    module("sap.ushell.services.Message", {
        setup: function () {
            sap.ushell.bootstrap("demo");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            sap.ui2.srvc.test.restoreSpies(
            );
            delete sap.ushell.Container;
        }
    });

    test("getService", function () {
        var oMessageService = sap.ushell.Container.getService("Message");

        ok(oMessageService instanceof sap.ushell.services.Message);

        ["init", "show", "info", "error"].forEach(function (sKey) {
            // check the service function
            strictEqual(typeof oMessageService[sKey], "function", "service has function " + sKey);

            // check the forwarding from the constructor function
            sinon.stub(oMessageService, sKey);
            strictEqual(typeof oMessageService[sKey], "function", "constructor has function " + sKey);
            oMessageService[sKey]();
            ok(oMessageService[sKey].called, sKey + ": constructor function calls service function");
        });
    });
}());
