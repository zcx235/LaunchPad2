// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.adapters.abap.PageBuildingAdapter
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.adapters.demo.PageBuildingAdapter");

    module("sap.ushell.adapters.abap.PageBuildingAdapter", {
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            sap.ui2.srvc.test.restoreSpies(
                sap.ui2.srvc.createFactory,
                sap.ui2.srvc.createPageBuildingService,
                sap.ui2.srvc.test.PageBuildingService
            );
        }
    });

    ["", "PERS", "CONF", "CUST"].forEach(function (sScope) {
        test("create" + (sScope ? " for " + sScope : ""), function () {
            var oAdapter,
                oFactory,
                oSystem = new sap.ushell.System({}),
                bPersonalization = !sScope || sScope === "PERS";

            // preparation
            sinon.spy(sap.ui2.srvc, "createPageBuildingService");
            sinon.spy(sap.ui2.srvc.test, "PageBuildingService");
            sinon.spy(sap.ui2.srvc, "createFactory");

            // code under test
            oAdapter = new sap.ushell.adapters.demo.PageBuildingAdapter(oSystem, sScope);
            oFactory = oAdapter.getFactory();

            // test
            ok(sap.ui2.srvc.createFactory.calledOnce);
            ok(sap.ui2.srvc.createFactory.calledWithExactly("/~/", undefined, bPersonalization),
                "factory created correctly");
            ok(sap.ui2.srvc.test.PageBuildingService.calledWithExactly("/~/", undefined,
                bPersonalization), "test PBS created");
            strictEqual(oFactory, sap.ui2.srvc.createFactory.returnValues[0],
                "factory delivered correctly");
        });
    });
}());
