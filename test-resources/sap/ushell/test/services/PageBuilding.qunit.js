// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.PageBuilding
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.services.Container"); // necessary for stand-alone tests
    jQuery.sap.require("sap.ushell.services.PageBuilding");
    jQuery.sap.require("sap.ushell.adapters.demo.PageBuildingAdapter");

    module("sap.ushell.services.PageBuilding", {
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            sap.ui2.srvc.test.restoreSpies(
                sap.ushell.adapters.demo.PageBuildingAdapter
            );
            delete sap.ushell.Container;
        }
    });

    asyncTest("getFactory", function () {
        var oAdapter = new sap.ushell.adapters.demo.PageBuildingAdapter({});

        sinon.stub(sap.ushell.adapters.demo, "PageBuildingAdapter").returns(oAdapter);

        sap.ushell.bootstrap("demo").always(function () {
            var oFactory,
                oPageBuildingService;

            start();

            sinon.spy(oAdapter, "getFactory");
            oPageBuildingService = sap.ushell.Container.getService("PageBuilding");

            oFactory = oPageBuildingService.getFactory();

            ok(oAdapter.getFactory.called, "factory requested from adapter");
            strictEqual(oFactory, oAdapter.getFactory.returnValues[0],
                "adapter's factory delivered");
        });
    });

    asyncTest("getPage", function () {
        var oPageBuildingService,
            oFactory;

        sap.ushell.bootstrap("demo").always(function () {
            var oPageBuildingService = sap.ushell.Container.getService("PageBuilding"),
                oFactory = oPageBuildingService.getFactory(),
                oResult = {};

            start();

            sinon.stub(oFactory, "createPage").returns(oResult);

            strictEqual(oPageBuildingService.getPage("foo"), oResult, "got expected result");
            ok(oFactory.createPage.calledWith("foo"));
        });
    });

    asyncTest("page set", function () {
        sap.ushell.bootstrap("demo").always(function () {
            var oPageBuildingService = sap.ushell.Container.getService("PageBuilding");

            raises(function () {
                oPageBuildingService.getPageSet();
            }, /Missing page set ID/, "no ID");
            oPageBuildingService.getPageSet("/UI2/Fiori2LaunchpadHome")
                .fail(sap.ui2.srvc.test.onError)
                .done(function (oPageSet) {
                    var aPages;
                    start();
                    aPages = oPageSet.getPages();
                    strictEqual(aPages[0].getId(), "PAGE_SET_PAGE_USER_CREATED", "ID of 1st page");
                    strictEqual(aPages[1].getId(), "/UI2/Fiori2LaunchpadHome", "ID of 2nd page");
                    ok(!aPages[0].isStub());
                    ok(!aPages[1].isStub());
                });
        });
    });
}());
