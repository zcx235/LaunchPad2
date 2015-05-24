// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.launchpad.dashboard.DashboardContent
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-core');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-widget');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-mouse');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-sortable');
    jQuery.sap.require("sap.ushell.resources");

    module("sap.ushell.renderers.fiori2.launchpad.dashboard.DashboardContent", {
        setup: function () {
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
        }
    });

    test("createContent Test", function () {
        var oDashboardView = sap.ui.jsview("sap.ushell.renderers.fiori2.launchpad.dashboard.DashboardContent");
        ok(oDashboardView.getContent().length === 2,'get Content Test');
        oDashboardView.destroy();
    });
}());
