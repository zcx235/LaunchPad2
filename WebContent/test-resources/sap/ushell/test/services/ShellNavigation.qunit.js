//Copyright (c) 2013 SAP AG, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.ShellNavigation
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
      notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
      jQuery, sap, sinon, window, hasher */

    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.services.ShellNavigation");

    var fnOldHashChangeListener = null, oHashChanger = null;

    // private helper functions
    function initHashChanger(sShellHash) {
        oHashChanger = new sap.ushell.services.ShellNavigationHashChanger();
        var fnShellCallback = sinon.spy();
        oHashChanger.initShellNavigation(fnShellCallback);
        oHashChanger.toExternal({
            target : {
                shellHash : sShellHash
            }
        });
        fnShellCallback.reset();

        return fnShellCallback;
    }

    function attachHashChangerEventListener(sEventName) {
        var oResult, fnHashChangedHandler;
        oResult = {
            callCount : 0,
            parameters : null
        };
        fnHashChangedHandler = function (oEvent) {
            oResult.callCount += 1;
            oResult.parameters = oEvent.getParameters();
        };
        oHashChanger.attachEvent(sEventName, fnHashChangedHandler);

        return oResult;
    }

    module(
        "sap.ushell.services.ShellNavigation",
        {
            setup : function () {
                sap.ushell.bootstrap("demo");
            },
            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown : function () {
                if (oHashChanger) {
                    oHashChanger.destroy();
                }

                sap.ui2.srvc.test
                    .restoreSpies(
                        sap.ushell.Container.getService("ShellNavigation").hashChanger.initShellNavigation,
                        hasher.setHash, //
                        hasher.replaceHash
                    );

                // reset the hash via hasher API after each test
                if (hasher) {
                    hasher.setHash("");
                }

                delete sap.ushell.Container;
            }
        }
    );

    // Shell navigation services
    // registration of hasher events for onhashchange
    // forwarding to callbacks of application
    test("getService", function () {
        // modules cannot be unloaded; so this test should be the first in order
        ok(typeof sap.ushell.Container.getService("ShellNavigation") === "object");
    });

    test("hrefForExternalWithSoActionTargetAndParams", function () {
        var sShellHash = sap.ushell.Container.getService("ShellNavigation").hrefForExternal({
            target : {
                semanticObject : "SO",
                action : "ABC"
            },
            params : {
                A : "A1"
            }
        });
        deepEqual(sShellHash, "#SO-ABC?A=A1");
    });

    // currently we double encode url parameters
    test("hrefForExternalWithSoActionTargetAndParams_DoubleEncode",
        function () {
            var sx = ("this&that is Space"), sShellHashHref = sap.ushell.Container.getService("ShellNavigation")
                .hrefForExternal({
                    target : {
                        semanticObject : "SO",
                        action : "ABC"
                    },
                    params : {
                        A : [ sx, 1 ]
                    }
                });
            deepEqual(encodeURIComponent(sx), "this%26that%20is%20Space");
            deepEqual(sShellHashHref,
                "#SO-ABC?A=this%2526that%2520is%2520Space&A=1");
        });

    test("hrefForExternalWithShellHashTarget", function () {
        var sShellHash = sap.ushell.Container.getService("ShellNavigation").hrefForExternal({
            target : {
                shellHash : "SO-Action"
            }
        });
        deepEqual(sShellHash, "#SO-Action");
    });

    test(
        "hrefForExternalWithShellHashTarget_DoubleEncode",
        function () {
            var encodedParam = encodeURIComponent("needs%& encoding"),
                sShellHash = sap.ushell.Container.getService("ShellNavigation")
                    .hrefForExternal({
                        target : {
                            shellHash : "S O-Action?p=v%&p2=" + encodedParam
                        }
                    });
            deepEqual(sShellHash,
                "#S%20O-Action?p=v%25&p2=needs%2525%2526%2520encoding");
        }
    );

    // currently we double encode url parameters
    test("hrefForExternalURLNoTruncationVerbose",
        function () {
            var sx = ("this&that is Space"),
                oParams = {
                    OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead : [ 1, 2, 3, 4, 5, 6],
                    VeryLongNamesAreAlsoProblematicEspIfMultipliedOften : ["That getting too long to be handled 1",
                        "THIS is getting too long to be handled 2",
                        "THIS is getting too long to be handled 7" ],
                    B :  [ "THIS is getting too long to be handled 1",
                           "THIS is getting too long to be handled 7" ],
                    A : [sx, 1 ]
                },
                oShellHashHref = sap.ushell.Container.getService("ShellNavigation")
                    .hrefForExternal({
                        target : {
                            semanticObject : "SO",
                            action : "ABC"
                        },
                        params : oParams
                    }, true);
            deepEqual(oShellHashHref.hash,
                "#SO-ABC?A=this%2526that%2520is%2520Space&A=1&B=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25201&B=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25207&OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=1&OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=2&OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=3&OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=4&OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=5&OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=6&VeryLongNamesAreAlsoProblematicEspIfMultipliedOften=That%2520getting%2520too%2520long%2520to%2520be%2520handled%25201&VeryLongNamesAreAlsoProblematicEspIfMultipliedOften=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25202&VeryLongNamesAreAlsoProblematicEspIfMultipliedOften=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25207");
            deepEqual(oShellHashHref.params,
                undefined, "undefined if no truncation (!) ");
            deepEqual(oShellHashHref.skippedParams,
                undefined, "undefined if no truncation");
        });
    // currently we double encode url parameters
    test("hrefForExternalURLTruncationVerbose",
        function () {
            var sx = ("this&that is Space"), oShellHashHref = sap.ushell.Container.getService("ShellNavigation")
                .hrefForExternal({
                    target : {
                        semanticObject : "SO",
                        action : "ABC"
                    },
                    params : {
                        OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead : [ 1, 2, 3, 4, 5, 6],
                        VeryLongNamesAreAlsoProblematicEspIfMultipliedOften :  [ "That getting too long to be handled 1",
                               "THIS is getting too long to be handled 2",
                               "THIS is getting too long to be handled 3",
                               "THIS is getting too long to be handled 4",
                               "THIS is getting too long to be handled 5",
                               "THIS is getting too long to be handled 6",
                               "THIS is getting too long to be handled 7" ],
                        B :  [ "THIS is getting too long to be handled 1",
                               "THIS is getting too long to be handled 2",
                               "THIS is getting too long to be handled 3",
                               "THIS is getting too long to be handled 4",
                               "THIS is getting too long to be handled 5",
                               "THIS is getting too long to be handled 6",
                               "THIS is getting too long to be handled 7" ],
                        A : [ sx, 1 ]
                    }
                }, true);
            deepEqual(oShellHashHref.hash,
                "#SO-ABC?A=this%2526that%2520is%2520Space&A=1&B=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25201&B=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25202&B=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25203&B=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25204&B=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25205&B=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25206&B=THIS%2520is%2520getting%2520too%2520long%2520to%2520be%2520handled%25207&OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=1&OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=2&OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead=3");
            deepEqual(oShellHashHref.params, {
                "A": [
                    "this&that is Space",
                    "1"
                ],
                "B": [
                    "THIS is getting too long to be handled 1",
                    "THIS is getting too long to be handled 2",
                    "THIS is getting too long to be handled 3",
                    "THIS is getting too long to be handled 4",
                    "THIS is getting too long to be handled 5",
                    "THIS is getting too long to be handled 6",
                    "THIS is getting too long to be handled 7"
                ],
                "OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead": [
                    "1",
                    "2",
                    "3"
                ]
            });
            deepEqual(oShellHashHref.skippedParams, {
                OnceMoreIntoTheBreachOrFillTheWallsUpWithOurEnglishDead : [ "4", "5", "6"],
                VeryLongNamesAreAlsoProblematicEspIfMultipliedOften :  [ "That getting too long to be handled 1",
                    "THIS is getting too long to be handled 2",
                    "THIS is getting too long to be handled 3",
                    "THIS is getting too long to be handled 4",
                    "THIS is getting too long to be handled 5",
                    "THIS is getting too long to be handled 6",
                    "THIS is getting too long to be handled 7" ]
            });
        });

    test("init",
        function () {
            var fnCallback, initShellNavigationStub, oHashChanger;
            fnCallback = function () { /* dummy */ };
            initShellNavigationStub = sinon.stub(
                sap.ushell.Container.getService("ShellNavigation").hashChanger,
                "initShellNavigation"
            );
            // we use a stub for the initShellNavigation navigation method
            // to avoid
            // registration of event handler on the hasher; it's difficult
            // to destroy the
            // central hash changer instance and it causes side effects if
            // not destroyed
            sap.ushell.Container.getService("ShellNavigation").init(fnCallback);

            oHashChanger = sap.ui.core.routing.HashChanger.getInstance();
            ok(
                oHashChanger instanceof sap.ushell.services.ShellNavigationHashChanger,
                "hashChanger instanceof ShellNavigationHashChanger"
            );
            sinon.assert.calledWith(initShellNavigationStub, fnCallback);
        });

    test("HashChanger.init and destroy", function () {
        oHashChanger = new sap.ushell.services.ShellNavigationHashChanger();
        var fnShellCallback = sinon.spy();
        oHashChanger.initShellNavigation(fnShellCallback);
        fnShellCallback.reset();
        oHashChanger.destroy();

        sap.ushell.Container.getService("ShellNavigation").toExternal({
            target : {
                semanticObject : "AnObject",
                action : "Action"
            }
        });

        sinon.assert.notCalled(fnShellCallback);
    });

    test("HashChanger.hrefForAppSpecificHash",
        function () {
            var sAppSpecificHash, sExpectedHash, sActualHash;

            // we use a new HashChanger instance for this test to avoid side
            // effects; destroy is called in teardown
            oHashChanger = new sap.ushell.services.ShellNavigationHashChanger();
            oHashChanger.initShellNavigation(function () { /* dummy */
            });
            oHashChanger.toExternal({
                target : {
                    semanticObject : "AnObject",
                    action : "Action"
                }
            });

            sAppSpecificHash = "app/specific&/hash needs &/?% encoding";
            sExpectedHash = encodeURI("#AnObject-Action&/"
                + sAppSpecificHash);
            sActualHash = oHashChanger
                .hrefForAppSpecificHash(sAppSpecificHash);
            strictEqual(sActualHash, sExpectedHash);
        });

    test("HashChanger.toExternal with object, action and parameters",
        function () {
            var sExpectedHash, fnShellCallback;
            // we use a new HashChanger instance for this test to avoid side
            // effects; destroy is called in teardown
            oHashChanger = new sap.ushell.services.ShellNavigationHashChanger();
            fnShellCallback = sinon.spy();
            oHashChanger.initShellNavigation(fnShellCallback);
            oHashChanger.toExternal({
                target : {
                    semanticObject : "AnObject",
                    action : "Action"
                },
                params : {
                    A : "Needs encoding&/",
                    B : "anotherValue"
                }
            });

            sExpectedHash = "AnObject-Action?A="
                + encodeURIComponent("Needs encoding&/") + "&B=anotherValue";
            sinon.assert.calledWith(fnShellCallback, sExpectedHash, null);
        });

    test("HashChanger.toExternal with shellHash", function () {
        var sExpectedHash, fnShellCallback, oHashSetHandlerResult;
        // we use a new HashChanger instance for this test to avoid side
        // effects; destroy is called in teardown
        oHashChanger = new sap.ushell.services.ShellNavigationHashChanger();
        fnShellCallback = sinon.spy();
        oHashChanger.initShellNavigation(fnShellCallback);
        oHashSetHandlerResult = attachHashChangerEventListener("hashSet");

        sExpectedHash = "AnObject-Action?A="
            + encodeURIComponent("Needs encoding&/") + "&B=anotherValue";
        oHashChanger.toExternal({
            target : {
                shellHash : sExpectedHash
            }
        });

        sinon.assert.calledWith(fnShellCallback, sExpectedHash, null);

        strictEqual(oHashSetHandlerResult.callCount, 1,
            "hashSet handler called once");
        strictEqual(oHashSetHandlerResult.parameters.sHash, "",
            "expected sHash parameter set to empty string in hashChanged event");
    });

    test("HashChanger.toExternal with shellHash including app-specific part", function () {
        var sShellHash, sAppHash, fnShellCallback, oHashSetHandlerResult,
            oUrlShortening,
            oExpandHashSpy;
        // we use a new HashChanger instance for this test to avoid side
        // effects; destroy is called in teardown
        oHashChanger = new sap.ushell.services.ShellNavigationHashChanger();
        fnShellCallback = sinon.spy();
        oHashChanger.initShellNavigation(fnShellCallback);

        oUrlShortening = sap.ushell.Container.getService("URLShortening");
        oExpandHashSpy = sinon.spy(oUrlShortening, "expandHash");
        oHashSetHandlerResult = attachHashChangerEventListener("hashSet");

        sShellHash = "AnObject-Action?A="
            + encodeURIComponent("Needs encoding&/") + "&B=anotherValue";
        sAppHash = "/my/appspecific/route";
        oHashChanger.toExternal({
            target : {
                shellHash : sShellHash + "&/" + sAppHash
            }
        });

        strictEqual(oExpandHashSpy.args[0][0], "AnObject-Action?A=Needs%20encoding%26%2F&B=anotherValue&//my/appspecific/route", "URLShortening.expandHash called with new Hash");
        strictEqual(oExpandHashSpy.args[1][0], "", "URLShortening.expandHash called with old Hash");
        strictEqual(oExpandHashSpy.callCount, 2, "URLShortening.expandHash called twice");

        sinon.assert.calledWith(fnShellCallback, sShellHash, "&/" + sAppHash, null);

        strictEqual(oHashSetHandlerResult.callCount, 1, "hashSet handler called once");
        strictEqual(oHashSetHandlerResult.parameters.sHash, sAppHash,
            "expected sHash parameter set to app-specific part in hashChanged event");
    });

    test("HashChanger.toAppHash - writeHistory true",
        function () {
            var sExpectedAppHash, fnShellCallback, hasherSetHashSpy,
                oHashChangedHandlerResult, oHashSetHandlerResult;
            fnShellCallback = initHashChanger("AnObject-Action");
            hasherSetHashSpy = sinon.spy(hasher, "setHash");
            oHashChangedHandlerResult = attachHashChangerEventListener("hashChanged");
            oHashSetHandlerResult = attachHashChangerEventListener("hashSet");
            sExpectedAppHash = "my app hash";

            oHashChanger.toAppHash(sExpectedAppHash, true);

            sinon.assert.notCalled(fnShellCallback);

            sinon.assert.calledWith(hasherSetHashSpy,
                "AnObject-Action&/my app hash");

            strictEqual(oHashChangedHandlerResult.callCount, 1,
                "hashChanged handler called once");
            strictEqual(oHashChangedHandlerResult.parameters.newHash,
                sExpectedAppHash, "newHash parameter set in hashChanged event");

            strictEqual(oHashSetHandlerResult.callCount, 1,
                "hashSet handler called once");
            strictEqual(oHashSetHandlerResult.parameters.sHash, sExpectedAppHash,
                "sHash parameter set in hashChanged event");
        });

    test("HashChanger.setHash",
        function () {
            var sExpectedAppHash, fnShellCallback, hasherSetHashSpy,
                oHashChangedHandlerResult, oHashSetHandlerResult;

            fnShellCallback = initHashChanger("AnObject-Action");
            hasherSetHashSpy = sinon.spy(hasher, "setHash");
            oHashChangedHandlerResult = attachHashChangerEventListener("hashChanged");
            oHashSetHandlerResult = attachHashChangerEventListener("hashSet");
            sExpectedAppHash = "my app hash";

            oHashChanger.setHash(sExpectedAppHash);

            sinon.assert.notCalled(fnShellCallback);

            sinon.assert.calledWith(hasherSetHashSpy,
                "AnObject-Action&/my app hash");

            strictEqual(oHashChangedHandlerResult.callCount, 1,
                "hashChanged handler called once");
            strictEqual(oHashChangedHandlerResult.parameters.newHash,
                sExpectedAppHash, "newHash parameter set in hashChanged event");

            strictEqual(oHashSetHandlerResult.callCount, 1, "hashSet handler called once");
            strictEqual(oHashSetHandlerResult.parameters.sHash, sExpectedAppHash,
                "sHash parameter set in hashChanged event");
        });

    test("HashChanger.toAppHash - writeHistory false",
        function () {
            var sExpectedAppHash, fnShellCallback, hasherReplaceHashSpy,
                oHashChangedHandlerResult, oHashReplacedHandlerResult;

            fnShellCallback = initHashChanger("AnObject-Action");
            hasherReplaceHashSpy = sinon.spy(hasher, "replaceHash");
            oHashChangedHandlerResult = attachHashChangerEventListener("hashChanged");
            oHashReplacedHandlerResult = attachHashChangerEventListener("hashReplaced");
            sExpectedAppHash = "my app hash";

            oHashChanger.toAppHash(sExpectedAppHash, false);

            sinon.assert.notCalled(fnShellCallback);

            sinon.assert.calledWith(hasherReplaceHashSpy,
                "AnObject-Action&/my app hash");

            strictEqual(oHashChangedHandlerResult.callCount, 1,
                "hashChanged handler called once");
            strictEqual(oHashChangedHandlerResult.parameters.newHash,
                sExpectedAppHash, "newHash parameter set in hashChanged event");

            strictEqual(oHashReplacedHandlerResult.callCount, 1, "hashSet handler called once");
            strictEqual(oHashReplacedHandlerResult.parameters.sHash, sExpectedAppHash,
                "sHash parameter set in hashReplaced event");
        });

    test("HashChanger.replaceHash",
        function () {
            var sExpectedAppHash, fnShellCallback, hasherReplaceHashSpy,
                oHashChangedHandlerResult, oHashReplacedHandlerResult;

            fnShellCallback = initHashChanger("AnObject-Action");
            hasherReplaceHashSpy = sinon.spy(hasher, "replaceHash");
            oHashChangedHandlerResult = attachHashChangerEventListener("hashChanged");
            oHashReplacedHandlerResult = attachHashChangerEventListener("hashReplaced");
            sExpectedAppHash = "my app hash";

            oHashChanger.replaceHash(sExpectedAppHash);

            sinon.assert.notCalled(fnShellCallback);

            sinon.assert.calledWith(hasherReplaceHashSpy,
                "AnObject-Action&/my app hash");

            strictEqual(oHashChangedHandlerResult.callCount, 1,
                "hashChanged handler called once");
            strictEqual(oHashChangedHandlerResult.parameters.newHash,
                sExpectedAppHash, "newHash parameter set in hashChanged event");

            strictEqual(oHashReplacedHandlerResult.callCount, 1, "hashSet handler called once");
            strictEqual(oHashReplacedHandlerResult.parameters.sHash, sExpectedAppHash,
                "sHash parameter set in hashReplaced event");
        });

    test("Inital Shell navigation part do not discriminate",
        function () {
            var fnShellCallback,
                oshellHash1,
                oshellHash2;

            fnShellCallback = initHashChanger("");

            oshellHash1 = oHashChanger.privsplitHash("");
            oshellHash2 = oHashChanger.privsplitHash("&/detail");

            strictEqual(oshellHash1.shellPart, oshellHash2.shellPart, "shell parts equal");
        });

    // see I-CSN 0001102839 2014
    test("robust error handling for hash change with illegal new hash",
        function () {
            var fnShellCallback = initHashChanger(""),
                oShellHashChangedHandlerResult = attachHashChangerEventListener("shellHashChanged");

            oHashChanger.treatHashChanged("illegalhash", "SO-action&/app-specific-route");

            sinon.assert.calledWith(fnShellCallback, "illegalhash", null, "SO-action", sinon.match.instanceOf(Error));
            strictEqual(oShellHashChangedHandlerResult.callCount, 1, "shellHashChanged handler called once");
            strictEqual(oShellHashChangedHandlerResult.parameters.newShellHash, "illegalhash", "shellHashChanged called with newShellHash");
            strictEqual(oShellHashChangedHandlerResult.parameters.newAppSpecificRoute, null, "shellHashChanged called with newAppSpecificRoute");
            strictEqual(oShellHashChangedHandlerResult.parameters.oldShellHash, "SO-action", "shellHashChanged called with oldShellHash");
            ok(oShellHashChangedHandlerResult.parameters.error instanceof Error, "shellHashChanged called with error");
        });

    test("robust error handling for hash change with illegal new and old hash",
        function () {
            var fnShellCallback = initHashChanger(""),
                oShellHashChangedHandlerResult = attachHashChangerEventListener("shellHashChanged");

            oHashChanger.treatHashChanged("illegalNewHash", "illegalOldHash");

            sinon.assert.calledWith(fnShellCallback, "illegalNewHash", null, "illegalOldHash", sinon.match.instanceOf(Error));
            strictEqual(oShellHashChangedHandlerResult.callCount, 1, "shellHashChanged handler called once");
            strictEqual(oShellHashChangedHandlerResult.parameters.newShellHash, "illegalNewHash", "shellHashChanged called with newShellHash");
            strictEqual(oShellHashChangedHandlerResult.parameters.newAppSpecificRoute, null, "shellHashChanged called with newAppSpecificRoute");
            strictEqual(oShellHashChangedHandlerResult.parameters.oldShellHash, "illegalOldHash", "shellHashChanged called with oldShellHash");
            ok(oShellHashChangedHandlerResult.parameters.error instanceof Error, "shellHashChanged called with error");
        });

    test("robust error handling for hash change with illegal old hash",
        function () {
            var fnShellCallback = initHashChanger(""),
                oShellHashChangedHandlerResult = attachHashChangerEventListener("shellHashChanged");

            oHashChanger.treatHashChanged("SO-action&/app-specific-route", "illegalhash");

            sinon.assert.calledWith(fnShellCallback, "SO-action", "&/app-specific-route", "illegalhash");
            strictEqual(oShellHashChangedHandlerResult.callCount, 1, "shellHashChanged handler called once");
            strictEqual(oShellHashChangedHandlerResult.parameters.newShellHash, "SO-action", "shellHashChanged called with newShellHash");
            strictEqual(oShellHashChangedHandlerResult.parameters.newAppSpecificRoute, "&/app-specific-route", "shellHashChanged called with newAppSpecificRoute");
            strictEqual(oShellHashChangedHandlerResult.parameters.oldShellHash, "illegalhash", "shellHashChanged called with oldShellHash");
        });

}());
