// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.LaunchPage
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.services.LaunchPage");


    module("sap.ushell.services.LaunchPage", {
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            sap.ui2.srvc.test.restoreSpies(
            );
        }
    });

    test("addBookmark failures", function () {
        var oLaunchPageService = new sap.ushell.services.LaunchPage();

        // code under test and tests
        raises(function () {
            oLaunchPageService.addBookmark();
        });
        raises(function () {
            oLaunchPageService.addBookmark("Test");
        });
        raises(function () {
            oLaunchPageService.addBookmark({});
        }, /Title missing in bookmark configuration/);
        raises(function () {
            oLaunchPageService.addBookmark({title: ""});
        }, /Title missing in bookmark configuration/);
        raises(function () {
            oLaunchPageService.addBookmark({title: "MyTitle"});
        }, /URL missing in bookmark configuration/);
    });

    test("addBookmark success", function () {
        var oActualPromise,
            oBookmarkConfig = { title: "MyTitle", url: "MyUrl" },
            oLaunchPageAdapter =  {
                addBookmark: sinon.stub().returns(new jQuery.Deferred().promise())
            },
            oLaunchPageService;

        // prepare test
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);

        // code under test
        oActualPromise = oLaunchPageService.addBookmark(oBookmarkConfig);

        // test
        ok(oLaunchPageAdapter.addBookmark.calledOnce);
        ok(oLaunchPageAdapter.addBookmark.calledWith(oBookmarkConfig));
        strictEqual(oActualPromise, oLaunchPageAdapter.addBookmark.returnValues[0]);
    });

    test("setTileVisible", function () {
        var oTile = {},
            oLaunchPageAdapter =  {
                setTileVisible: sinon.spy()
            },
            oLaunchPageService;

        // prepare test
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);

        // code under test
        oLaunchPageService.setTileVisible(oTile, true);

        // test
        ok(oLaunchPageAdapter.setTileVisible.calledOnce);
        ok(oLaunchPageAdapter.setTileVisible.calledWithExactly(oTile, true));
    });

    test("getCatalogError", function () {
        var oCatalog = {},
            oLaunchPageAdapter =  {
                getCatalogError: sinon.stub().returns("foo")
            },
            oLaunchPageService;

        // prepare test
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);

        // code under test
        strictEqual(oLaunchPageService.getCatalogError(oCatalog), "foo");

        // test
        ok(oLaunchPageAdapter.getCatalogError.calledOnce);
        ok(oLaunchPageAdapter.getCatalogError.calledWithExactly(oCatalog));
    });

    test("isTileIntentSupported", function () {
        var oTile = {},
            oLaunchPageAdapter = {
                isTileIntentSupported: sinon.stub().returns("foo") // deliberately no boolean
            },
            oLaunchPageService;

        // part 1: unsupported in adapter
        oLaunchPageService = new sap.ushell.services.LaunchPage({});
        strictEqual(oLaunchPageService.isTileIntentSupported(oTile), true);

        // part 2: delegates to adapter
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        strictEqual(oLaunchPageService.isTileIntentSupported(oTile), "foo");
        ok(oLaunchPageAdapter.isTileIntentSupported.calledOnce);
        ok(oLaunchPageAdapter.isTileIntentSupported.calledWithExactly(oTile));
    });

    test("isGroupVisible", function () {
        var oGroup = {},
            oLaunchPageAdapter = {
                isGroupVisible: sinon.stub().returns("visible")
            },
            oLaunchPageService;

        // part 1: unsupported in adapter - default value received from the service directly
        oLaunchPageService = new sap.ushell.services.LaunchPage({});
        strictEqual(oLaunchPageService.isGroupVisible(oGroup), true);

        // part 2: delegates to adapter
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        strictEqual(oLaunchPageService.isGroupVisible(oGroup), "visible");
        ok(oLaunchPageAdapter.isGroupVisible.calledOnce);
        ok(oLaunchPageAdapter.isGroupVisible.calledWithExactly(oGroup));
    });

    test("hideGroups", function () {
        var aGroups = [],
            oLaunchPageAdapter = {
                hideGroups: sinon.stub().returns({
                    fail: function (f) {},
                    done: function (f) {return this; }
                })
            },
            oLaunchPageService;

        // part 1: unsupported in adapter - A deferred object is expected which is in failed status
        oLaunchPageService = new sap.ushell.services.LaunchPage({});
        var oDeferred = oLaunchPageService.hideGroups([]);
        strictEqual(oDeferred.state(), 'rejected');

        // part 2: delegates to adapter
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        oLaunchPageService.hideGroups(aGroups);
        ok(oLaunchPageAdapter.hideGroups.calledOnce);
        ok(oLaunchPageAdapter.hideGroups.calledWithExactly(aGroups));
    });

    test("getCatalogData", function () {
        var oCatalog = {},
            oResult = {},
            oLaunchPageAdapter,
            oLaunchPageService,
            oLogMock = sap.ui2.srvc.test.createLogMock()
                .filterComponent("sap.ushell.services.LaunchPage")
                .warning("getCatalogData not implemented in adapter", null,
                    "sap.ushell.services.LaunchPage");

        // part 1: unsupported in adapter
        oLaunchPageService = new sap.ushell.services.LaunchPage({
            getCatalogId: function (oCatalog0) {
                strictEqual(oCatalog0, oCatalog);
                return "foo";
            }
        });
        deepEqual(oLaunchPageService.getCatalogData(oCatalog), {id: "foo"});
        oLogMock.verify();

        // part 2: delegates to adapter
        oLaunchPageAdapter = {
            getCatalogData: sinon.stub().returns(oResult)
        };
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        strictEqual(oLaunchPageService.getCatalogData(oCatalog), oResult);
        ok(oLaunchPageAdapter.getCatalogData.calledOnce);
        ok(oLaunchPageAdapter.getCatalogData.calledWithExactly(oCatalog));
    });

    test("test countBookmarks", function () {
        var oActualPromise,
            oExpectedPromise = (new jQuery.Deferred()).promise(),
            oLaunchPageAdapter =  {
                countBookmarks: sinon.stub().returns(oExpectedPromise)
            },
            oLaunchPageService;

        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);

        raises(function () {
            oLaunchPageService.countBookmarks();
        }, /Missing URL/);
        raises(function () {
            oLaunchPageService.countBookmarks("");
        }, /Missing URL/);
        raises(function () {
            oLaunchPageService.countBookmarks({});
        }, /Missing URL/);
        ok(oLaunchPageAdapter.countBookmarks.notCalled);

        oActualPromise = oLaunchPageService.countBookmarks("###");

        strictEqual(oActualPromise, oExpectedPromise);
        ok(oLaunchPageAdapter.countBookmarks.calledOnce);
        strictEqual(oLaunchPageAdapter.countBookmarks.args[0][0], "###");
    });

    test("test deleteBookmarks", function () {
        var oActualPromise,
            oExpectedPromise = (new jQuery.Deferred()).promise(),
            oLaunchPageAdapter =  {
                deleteBookmarks: sinon.stub().returns(oExpectedPromise)
            },
            oLaunchPageService;

        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);

        raises(function () {
            oLaunchPageService.deleteBookmarks();
        }, /Missing URL/);
        raises(function () {
            oLaunchPageService.deleteBookmarks("");
        }, /Missing URL/);
        raises(function () {
            oLaunchPageService.deleteBookmarks({});
        }, /Missing URL/);
        ok(oLaunchPageAdapter.deleteBookmarks.notCalled);

        oActualPromise = oLaunchPageService.deleteBookmarks("###");

        strictEqual(oActualPromise, oExpectedPromise);
        ok(oLaunchPageAdapter.deleteBookmarks.calledOnce);
        strictEqual(oLaunchPageAdapter.deleteBookmarks.args[0][0], "###");
    });

    test("test updateBookmarks", function () {
        var oActualPromise,
            oExpectedPromise = (new jQuery.Deferred()).promise(),
            oLaunchPageAdapter =  {
                updateBookmarks: sinon.stub().returns(oExpectedPromise)
            },
            oLaunchPageService,
            oParameters = {
                url: "foo"
            };

        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);

        raises(function () {
            oLaunchPageService.updateBookmarks();
        }, /Missing URL/);
        raises(function () {
            oLaunchPageService.updateBookmarks("");
        }, /Missing URL/);
        raises(function () {
            oLaunchPageService.updateBookmarks({});
        }, /Missing URL/);
        raises(function () {
            oLaunchPageService.updateBookmarks("foo");
        }, /Missing parameters/);
        raises(function () {
            oLaunchPageService.updateBookmarks("foo", true);
        }, /Missing parameters/);
        ok(oLaunchPageAdapter.updateBookmarks.notCalled);

        oActualPromise = oLaunchPageService.updateBookmarks("###", oParameters);

        strictEqual(oActualPromise, oExpectedPromise);
        ok(oLaunchPageAdapter.updateBookmarks.calledOnce);
        strictEqual(oLaunchPageAdapter.updateBookmarks.args[0][0], "###");
        strictEqual(oLaunchPageAdapter.updateBookmarks.args[0][1], oParameters);
    });

    test("Tile actions", function () {
        var oTile = {},
            oResult = {},
            aInternalActions,
            aExternalActions1,
            aExternalActions2,
            oLaunchPageAdapter,
            oLaunchPageService;



        // part 1: no actions
        oLaunchPageAdapter = {};
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);

        deepEqual(oLaunchPageService.getTileActions(oTile), []);

        // part 2: internal actions
        aInternalActions = [{text: "InternalAction1"}, {text: "InternalAction2"}];
        oLaunchPageAdapter = {
            getTileActions : sinon.stub().returns(aInternalActions)
        };
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);

        deepEqual(oLaunchPageService.getTileActions(oTile), aInternalActions);
        ok(oLaunchPageAdapter.getTileActions.calledWithExactly(oTile));

        // part 3: external actions
        aExternalActions1 = [{text: "ExternalAction11"}, {text: "ExternalAction12"}];
        aExternalActions2 = [{text: "ExternalAction21"}, {text: "ExternalAction22"}];
        oLaunchPageAdapter = {};
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        oLaunchPageService.registerTileActionsProvider(sinon.stub().returns(aExternalActions1));
        oLaunchPageService.registerTileActionsProvider(sinon.stub().returns(aExternalActions2));

        deepEqual(oLaunchPageService.getTileActions(oTile), aExternalActions1.concat(aExternalActions2));


        // part 4: internal and external actions
        aInternalActions = [{text: "InternalAction1"}, {text: "InternalAction2"}];
        oLaunchPageAdapter = {
            getTileActions : sinon.stub().returns(aInternalActions)
        };
        aExternalActions1 = [{text: "ExternalAction11"}, {text: "ExternalAction12"}];
        aExternalActions2 = [{text: "ExternalAction21"}, {text: "ExternalAction22"}];
        oLaunchPageService = new sap.ushell.services.LaunchPage(oLaunchPageAdapter);
        oLaunchPageService.registerTileActionsProvider(sinon.stub().returns(aExternalActions1));
        oLaunchPageService.registerTileActionsProvider(sinon.stub().returns(aExternalActions2));

        deepEqual(oLaunchPageService.getTileActions(oTile), aInternalActions.concat(aExternalActions1.concat(aExternalActions2)));

        ok(oLaunchPageAdapter.getTileActions.calledWithExactly(oTile));
    });

}());
