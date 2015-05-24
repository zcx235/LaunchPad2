// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.adapters.demo.ContainerAdapter
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.adapters.demo.ContainerAdapter");

    module("sap.ushell.adapters.demo.ContainerAdapter", {
        setup: function () {
            sinon.stub(sap.ushell.adapters.demo.ContainerAdapter, "reload");
        },
        teardown: function () {
            sap.ui2.srvc.test.restoreSpies(sap.ushell.adapters.demo.ContainerAdapter.reload);
        }
    });

    asyncTest("create Adapter", function () {
        var oSystem = {},
            oAdapter = new sap.ushell.adapters.demo.ContainerAdapter(oSystem),
            oPromise;

        ok(typeof oAdapter.load === 'function', "adapter has load() function");
        strictEqual(oAdapter.getSystem(), oSystem, "getSystem()");
        oPromise = oAdapter.load();
        ok(typeof oPromise.done === "function", "load() returned a jQuery promise");
        strictEqual(oPromise.resolve, undefined,
            "load() does not return the jQuery deferred object itself");
        oPromise.done(function () {
            start();
            ok(true, "done function is called");
        });
    });

    asyncTest("logout()", function () {
        var oSystem = new sap.ushell.System({}),
            oSystemAdapter = new sap.ushell.adapters.demo.ContainerAdapter(oSystem),
            oLogMock = sap.ui2.srvc.test.createLogMock()
                .info("Demo system logged out: " + oSystem.getAlias(), null,
                      "sap.ushell.adapters.demo.ContainerAdapter");

        //code under test
        oSystemAdapter.logout().done(function () {
            start();
            oLogMock.verify();
            ok(sap.ushell.adapters.demo.ContainerAdapter.reload.calledOnce, "reload called");
        });

    });
}());
