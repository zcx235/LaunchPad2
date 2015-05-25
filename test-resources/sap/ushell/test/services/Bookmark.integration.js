// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.PageBuilding
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, OData, sap, sinon */

    jQuery.sap.require("sap.ushell.services.Container"); // necessary for stand-alone tests
    // These contracts are used by CHIPs during the test
    jQuery.sap.require("sap.ui2.srvc.contracts.bag");
    jQuery.sap.require("sap.ui2.srvc.contracts.configuration");
    jQuery.sap.require("sap.ui2.srvc.contracts.configurationUi");
    jQuery.sap.require("sap.ui2.srvc.contracts.preview");
    jQuery.sap.require("sap.ui2.srvc.contracts.refresh");
    jQuery.sap.require("sap.ui2.srvc.contracts.search");
    jQuery.sap.require("sap.ui2.srvc.contracts.url");
    jQuery.sap.require("sap.ui2.srvc.contracts.visible");
    jQuery.sap.require("sap.ui2.srvc.contracts.actions");

    var sMODULE = "sap.ushell.services.Bookmark.integration";

    /**
     * A function which ignores all of its arguments and just starts QUnit once.
     *
     * BEWARE: do not directly use <code>start</code> as a success handler if any arguments are
     * passed to it! Else QUnit's semaphore becomes NaN and you run into trouble.
     */
    function start_1() {
        start(1);
    }

    function deleteOurPages() {
        var oLaunchPageService = sap.ushell.Container.getService("LaunchPage");

        oLaunchPageService.getGroups()
            .fail(sap.ui2.srvc.test.onError)
            .done(function (aGroups) {
                start();
                aGroups.forEach(function (oGroup) {
                    if (oLaunchPageService.getGroupTitle(oGroup) === sMODULE) {
                        stop();
                        oLaunchPageService.removeGroup(oGroup)
                            .fail(sap.ui2.srvc.test.onError).done(start_1);
                    }
                });
            });
    }

    module(sMODULE, {
        setup: function () {
            stop();
            // add config directly, because boottask is not called
            window["sap-ushell-config"] = {
                services : {
                    "LaunchPage": {
                        "adapter": {
                            "config": {
                                "services": {
                                    "targetMappings": {
                                        "baseUrl" : "/sap/opu/odata/UI2/INTEROP",
                                        "relativeUrl" : "TargetMappings"
                                    }
                                }
                            }
                        }
                    }
                }
            };
            sap.ushell.bootstrap("abap", {
                abap: "sap.ushell_abap.adapters.abap",
                hana: "sap.ushell_abap.adapters.hana"
            }).fail(sap.ui2.srvc.test.onError).done(start_1);
        },

        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
            // ensure that the page set is always read in PageBuildingService.readPageSet
            delete OData.read.$cache;
        }
    });

    asyncTest("test add bookmark (static tile; groups already read)", function () {
        var oLaunchPageService = sap.ushell.Container.getService("LaunchPage");

        oLaunchPageService.getDefaultGroup()
            .fail(sap.ui2.srvc.test.onError)
            .done(function (oGroup) {
                var aTiles = oLaunchPageService.getGroupTiles(oGroup),
                    oBookmarkData = {
                        icon: "sap-icon://home",
                        info: "Static Applauncher",
                        subtitle: "INTEGRATION",
                        title: Date.now().toString(),
                        url: "#"
                    };

                sap.ushell.Container.getService("Bookmark").addBookmark(oBookmarkData)
                    .fail(sap.ui2.srvc.test.onError)
                    .done(function () {
                        var j,
                            oTile,
                            aTiles2 = oLaunchPageService.getGroupTiles(oGroup);

                        strictEqual(aTiles2.length, aTiles.length + 1, "1 additional tile added");

                        for (j = 0; j < aTiles2.length; j += 1) {
                            oTile = aTiles2[j];
                            if (aTiles.indexOf(oTile) < 0) {
                                // check data of new tile and remove it again
                                strictEqual(oTile.getTitle(), oBookmarkData.title, "title ok");
                                strictEqual(oTile.getChip().getId(),
                                    "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER", "type ok");
                                oLaunchPageService.removeTile(oGroup, oTile)
                                    .fail(sap.ui2.srvc.test.onError)
                                    .done(start_1);
                            }
                        }
                    });
            });
    });

    asyncTest("test add bookmark (dynamic tile; groups already read)", function () {
        var oLaunchPageService = sap.ushell.Container.getService("LaunchPage");

        oLaunchPageService.getDefaultGroup()
            .fail(sap.ui2.srvc.test.onError)
            .done(function (oGroup) {
                var aTiles = oLaunchPageService.getGroupTiles(oGroup),
                    oBookmarkData = {
                        icon: "sap-icon://sys-first-page",
                        info: "Dynamic Applauncher",
                        numberUnit: "USD",
                        serviceUrl: "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/Pages/$count",
                        serviceRefreshInterval: 0,
                        subtitle: "INTEGRATION",
                        title: Date.now().toString(),
                        url: "#"
                    };

                sap.ushell.Container.getService("Bookmark").addBookmark(oBookmarkData)
                    .fail(sap.ui2.srvc.test.onError)
                    .done(function () {
                        var j,
                            oTile,
                            aTiles2 = oLaunchPageService.getGroupTiles(oGroup);

                        strictEqual(aTiles2.length, aTiles.length + 1, "1 additional tile added");

                        for (j = 0; j < aTiles2.length; j += 1) {
                            oTile = aTiles2[j];
                            if (aTiles.indexOf(oTile) < 0) {
                                // check data of new tile and remove it again
                                strictEqual(oTile.getTitle(), oBookmarkData.title, "title ok");
                                strictEqual(oTile.getChip().getId(),
                                    "X-SAP-UI2-CHIP:/UI2/DYNAMIC_APPLAUNCHER", "type ok");
                                oLaunchPageService.removeTile(oGroup, oTile)
                                    .fail(sap.ui2.srvc.test.onError)
                                    .done(start_1);
                            }
                        }
                    });
            });
    });

    // setup

    asyncTest("delete our pages", 0, deleteOurPages);

    asyncTest("delete our bookmarks", 0, function () {
        var oBookmarkService = sap.ushell.Container.getService("Bookmark");

        oBookmarkService.deleteBookmarks("###")
            .fail(sap.ui2.srvc.test.onError)
            .done(start_1);
    });

    asyncTest("create multiple pages", 0, function () {
        var oLaunchPageService = sap.ushell.Container.getService("LaunchPage");

        oLaunchPageService.getGroups()
            .fail(sap.ui2.srvc.test.onError)
            .done(function (aGroups) {
                start();
                stop(2);
                oLaunchPageService.addGroup(sMODULE)
                    .fail(sap.ui2.srvc.test.onError)
                    .done(start_1);
                oLaunchPageService.addGroup(sMODULE)
                    .fail(sap.ui2.srvc.test.onError)
                    .done(start_1);
            });
    });

    asyncTest("addCatalogTileToGroup", function () {
        var oBookmarkService = sap.ushell.Container.getService("Bookmark"),
            iIndex = -1,
            oCatalogData = {
                baseUrl: "/sap/hba/apps/kpi/s/odata/hana_chip_catalog.xsodata/",
                remoteId: "HANA_CATALOG",
                systemAlias: ""
            },
            sHanaCatalogId = "X-SAP-REMOTE:HANA_TEST",
            oLaunchPageService = sap.ushell.Container.getService("LaunchPage"),
            sLegacyHanaCatalogId = "X-SAP-UI2-HANA:hana?remoteId=HANA_CATALOG",
            aCatalogIds = [sLegacyHanaCatalogId, sHanaCatalogId],
            oTestGroup,
            sGroupId;

        /*
         * @param {string} sCatalogTileId
         *   ID of the catalog tile
         */
        function addCatalogTileToGroup(sCatalogTileId, bUseCatalogData, sCatalogId) {
            // code under test
            oBookmarkService.addCatalogTileToGroup(sCatalogTileId, sGroupId,
                    bUseCatalogData ? oCatalogData : undefined)
                .fail(sap.ui2.srvc.test.onError)
                .done(function () {
                    var oTile = oLaunchPageService.getGroupTiles(oTestGroup).pop(),
                        oCatalogTile = oTile.getChip();

                    // test
                    strictEqual(oTile.getPage().getId(), sGroupId);
                    strictEqual(oCatalogTile.getId(), sCatalogTileId);
                    strictEqual(oCatalogTile.getCatalog().getId(), sCatalogId);
                    start();
                });
        }

        // preparation
        oLaunchPageService.getGroups()
            .fail(sap.ui2.srvc.test.onError)
            .done(function (aGroups) {
                aGroups.some(function (oGroup) {
                    if (oLaunchPageService.getGroupTitle(oGroup) === sMODULE) {
                        oTestGroup = oGroup;
                        sGroupId = oLaunchPageService.getGroupId(oTestGroup);
                        return true;
                    }
                });
                ok(oTestGroup, "oTestGroup");
                oLaunchPageService.getCatalogs()
                    .fail(sap.ui2.srvc.test.onError)
                    .progress(function (oCatalog) {
                        var sCatalogId = oLaunchPageService.getCatalogId(oCatalog);
                        if (aCatalogIds.indexOf(sCatalogId) > -1) {
                            // current catalog is a (legacy) HANA catalog
                            stop(); // getCatalogs().done may be faster than getCatalogTiles().done
                            oLaunchPageService.getCatalogTiles(oCatalog)
                                .fail(sap.ui2.srvc.test.onError)
                                .done(function (aCatalogTiles) {
                                    // use distinct CHIPs for HANA and HANA legacy catalog access
                                    iIndex += 1;
                                    addCatalogTileToGroup(
                                        oLaunchPageService.getCatalogTileId(aCatalogTiles[iIndex]),
                                        (sCatalogId === sHanaCatalogId) ? true : false,
                                        sCatalogId
                                    );
                                });
                        }
                    })
                    .done(start_1);
            });
    });

    asyncTest("add multiple bookmarks", 0, function () {
        var oBookmarkService = sap.ushell.Container.getService("Bookmark"),
            oLaunchPageService = sap.ushell.Container.getService("LaunchPage");

        oLaunchPageService.getGroups()
            .fail(sap.ui2.srvc.test.onError)
            .done(function (aGroups) {
                start();
                stop(3);
                oBookmarkService.addBookmark({
                    title: "1st bookmark",
                    url: "###"
                }).fail(sap.ui2.srvc.test.onError).done(start_1);
                oBookmarkService.addBookmark({
                    title: "2nd bookmark",
                    url: "###"
                }).fail(sap.ui2.srvc.test.onError).done(start_1);
                oBookmarkService.addBookmark({
                    title: "3rd bookmark",
                    url: "###"
                }).fail(sap.ui2.srvc.test.onError).done(start_1);
            });
    });

    asyncTest("move bookmarks to different pages", 0, function () {
        var oLaunchPageService = sap.ushell.Container.getService("LaunchPage");

        oLaunchPageService.getGroups()
            .fail(sap.ui2.srvc.test.onError)
            .done(function (aGroups) {
                var oDefaultGroup = aGroups[0],
                    aDefaultGroupTiles = oLaunchPageService.getGroupTiles(oDefaultGroup);

                start();
                stop(2);

                // we're interested in the last entries...
                aGroups.reverse();
                aDefaultGroupTiles.reverse();

                // move two bookmarks to separate pages
                // Note: source index does not matter!
                oLaunchPageService.moveTile(aDefaultGroupTiles[0], undefined, 0,
                    oDefaultGroup, aGroups[0])
                    .fail(sap.ui2.srvc.test.onError).done(start_1);
                oLaunchPageService.moveTile(aDefaultGroupTiles[1], undefined, 0,
                    oDefaultGroup, aGroups[1])
                    .fail(sap.ui2.srvc.test.onError).done(start_1);
            });
    });

    // code under test

    asyncTest("count all of our bookmarks", function () {
        var oBookmarkService = sap.ushell.Container.getService("Bookmark");

        oBookmarkService.countBookmarks("###")
            .fail(sap.ui2.srvc.test.onError)
            .done(function (iCount) {
                start();
                strictEqual(iCount, 3);
            });
    });

    asyncTest("update our bookmarks", function () {
        var oBookmarkService = sap.ushell.Container.getService("Bookmark");

        oBookmarkService.updateBookmarks("###", {url: "#&/"})
            .fail(sap.ui2.srvc.test.onError)
            .done(function (iCount) {
                strictEqual(iCount, 3);

                oBookmarkService.countBookmarks("###")
                    .fail(sap.ui2.srvc.test.onError)
                    .done(function (iNewCount) {
                        strictEqual(iNewCount, 0);

                        oBookmarkService.countBookmarks("#&/")
                            .fail(sap.ui2.srvc.test.onError)
                            .done(function (iYetAnotherCount) {
                                start();
                                strictEqual(iYetAnotherCount, 3);
                            });
                    });
            });
    });

    asyncTest("delete our bookmarks", function () {
        var oBookmarkService = sap.ushell.Container.getService("Bookmark");

        oBookmarkService.deleteBookmarks("#&/")
            .fail(sap.ui2.srvc.test.onError)
            .done(function (iCount) {
                strictEqual(iCount, 3);

                oBookmarkService.countBookmarks("#&/")
                    .fail(sap.ui2.srvc.test.onError)
                    .done(function (iNewCount) {
                        start();
                        strictEqual(iNewCount, 0);
                    });
            });
    });

    // teardown

    asyncTest("delete our pages", 0, deleteOurPages);
}());
