// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.Bookmark
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.services.Container"); // necessary for stand-alone tests

    module("sap.ushell.services.CrossApplicationNavigation", {
        setup: function () {
            sap.ushell.bootstrap("demo");
        },
        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    test("getService", function () {
        var oCrossApplicationNavigationService;

        // code under test
        oCrossApplicationNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");

        // test
        ok(oCrossApplicationNavigationService instanceof sap.ushell.services.CrossApplicationNavigation);
        strictEqual(typeof oCrossApplicationNavigationService.hrefForExternal, "function");
        strictEqual(typeof oCrossApplicationNavigationService.toExternal, "function");
        // TODO test parameters
    });


    test("with ShellNavigation", function () { //TODO use sinon the way it is supposed to...
        var oCrossApplicationNavigationService,
            lastCall,
            methodName,
            stub;
        //  hrefForExternal
        oCrossApplicationNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        stub = sinon.stub(sap.ushell.Container.getService("ShellNavigation"), "hrefForExternal",
            function (oArgs) {
                lastCall = oArgs;
                return oArgs;
            });
        equal("abc", oCrossApplicationNavigationService.hrefForExternal("abc"));
        equal("abc", lastCall);
        //  toExternal
        methodName = "toExternal";
        oCrossApplicationNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        stub = sinon.stub(sap.ushell.Container.getService("ShellNavigation"), methodName,
            function (oArgs) {
                lastCall = oArgs;
                return oArgs;
            });
        equal(undefined, oCrossApplicationNavigationService[methodName]("dedddf"));
        equal("dedddf", lastCall);

        //  hrefForAppSpecificHash
        methodName = "hrefForAppSpecificHash";
        oCrossApplicationNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        stub = sinon.stub(sap.ushell.Container.getService("ShellNavigation"), methodName,
            function (oArgs) {
                lastCall = oArgs;
                return oArgs;
            });
        equal("def", oCrossApplicationNavigationService[methodName]("def"));
        equal("def", lastCall);
    });

    test("getSemanticObjectLinks", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            mParameters = {
                A: "B",
                C: "e'e e"
            },
            oResult;

        sinon.stub(oNavTargetResolution, "getSemanticObjectLinks").returns({/*don't care*/});
        oResult = sap.ushell.Container.getService("CrossApplicationNavigation")
            .getSemanticObjectLinks("Action", mParameters, true);
        ok(oNavTargetResolution.getSemanticObjectLinks
            .calledWithExactly("Action", mParameters, true));
        strictEqual(oResult, oNavTargetResolution.getSemanticObjectLinks.returnValues[0]);
    });

    test("isIntentSupported", function () {
        var aIntents = [/*content does not matter*/],
            oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            oResult,
            oSimulatedResult = {};

        sinon.stub(oNavTargetResolution, "isIntentSupported").returns(oSimulatedResult);
        oResult = sap.ushell.Container.getService("CrossApplicationNavigation")
            .isIntentSupported(aIntents);
        ok(oNavTargetResolution.isIntentSupported.calledWithExactly(aIntents));
        strictEqual(oResult, oSimulatedResult);
    });

    test("sap-system added on navigation", function () {
        var oShellNavigation = sap.ushell.Container.getService("ShellNavigation"),
            oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            oCAN = sap.ushell.Container.getService("CrossApplicationNavigation");

        sinon.stub(oShellNavigation, "hrefForExternal").returns({/*don't care*/});
        sinon.stub(oShellNavigation, "toExternal").returns({/*don't care*/});
        sinon.stub(oNavTargetResolution, "getCurrentResolution").returns(
            {url: "/~/?sap-system=CURRENT"}
        );

        function check(oArgs, oExpected) {
            oShellNavigation.hrefForExternal.reset();
            oCAN.hrefForExternal(JSON.parse(JSON.stringify(oArgs)));
            deepEqual(oShellNavigation.hrefForExternal.args[0][0], oExpected,
                "hrefForExternal: " + JSON.stringify(oArgs) + " -> " + JSON.stringify(oExpected));

            oShellNavigation.toExternal.reset();
            oCAN.toExternal(oArgs);
            deepEqual(oShellNavigation.toExternal.args[0][0], oExpected,
                "toExternal: " + JSON.stringify(oArgs) + " -> " + JSON.stringify(oExpected));
        }

        //code under test
        //shell navigation uses system of current app, other parameters unchanged
        check({params: {foo: "bar"}}, {params: {foo: "bar", "sap-system": "CURRENT"}});
        //shell navigation uses system of current app, target and no parameters
        check({target: {}}, {target: {}, params: {"sap-system": "CURRENT"}});
        //shell navigation uses system of current app, no overwrite of existing sap-system
        check({target: {}, params: {"sap-system": "OWNSYSTEM"}},
            {target: {}, params: {"sap-system": "OWNSYSTEM"}});
        //oArgs contains shellHash with params
        check({target: {shellHash: "SO-36?jumper=postman"}},
            {target: {shellHash: "SO-36?jumper=postman&sap-system=CURRENT"}});
        //oArgs contains shellHash without params
        check({target: {shellHash: "SO-36"}},
            {target: {shellHash: "SO-36?sap-system=CURRENT"}});
        //oArgs contains shellHash with param sap-system
        check({target: {shellHash: "SO-36?sap-system=OWNSYSTEM"}},
            {target: {shellHash: "SO-36?sap-system=OWNSYSTEM"}});
        check({target: {shellHash: "SO-36?asap-system=foo"}},
            {target: {shellHash: "SO-36?asap-system=foo&sap-system=CURRENT"}});
        check({target: {shellHash: "SO-36?sap-system="}},
            {target: {shellHash: "SO-36?sap-system="}});
        check({target: {}, params: {"sap-system": ""}},
            {target: {}, params: {"sap-system": ""}});
        //non-object parameters not touched
        check("foo", "foo");
        //no change if shell hash is no string, see ShellNavigation.privhrefForExternalNoEnc
        check({target: {shellHash: 42}}, {target: {shellHash: 42}});
        //no change if current application URL has no sap-system parameter
        oNavTargetResolution.getCurrentResolution.returns({url: "/~/"});
        check({params: {foo: "bar"}}, {params: {foo: "bar"}});
    });
}());
