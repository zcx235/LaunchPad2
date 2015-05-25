// Copyright (c) 2014 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit integration tests for sap.ushell.services.Personalization
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    jQuery.sap.require("sap.ui2.srvc.PageBuildingService"); // only needed for initial clean-up
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell_abap.adapters.abap.PersonalizationAdapter");
    jQuery.sap.require("sap.ushell.services.Personalization");

    var sCONTAINER_KEY = "sap.ushell.personalization#sap.ushell.test.personalization",
        sCONTAINER = "sap.ushell.test.personalization",
        oContainer,
        sITEM_KEY = "TestItem",
        oITEMVALUE = {"v1": "false"},
        sPAGE_ID = "/UI2/PERSONALIZATION";

    function start_1() {
        start();
    }

    module("sap.ushell.services.Personalization.integration: ABAP adapter test: ", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("abap", {abap: "sap.ushell_abap.adapters.abap",
                hana: "sap.ushell_abap.adapters.hana"})
                .fail(sap.ui2.srvc.test.onError)
                .done(start_1);
        },
        teardown: function () {
            delete sap.ushell.Container;
        }
    });


    asyncTest("initial clean-up", 0, function () {
        var oPbs = new sap.ui2.srvc.PageBuildingService(
            "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/",
            sap.ui2.srvc.test.onError
        );
        oPbs.deleteBag(sPAGE_ID, sCONTAINER_KEY, /*fnSuccess*/start_1, sap.ui2.srvc.test.onError);
    });


    asyncTest("setItemValue + save + load", function () {
        var oService = sap.ushell.Container.getService("Personalization");

        oService.getContainer(sCONTAINER, {validity : Infinity})
            .fail(sap.ui2.srvc.test.onError)
            .done(function (oContainer0) {
                oContainer = oContainer0; // keep the container for several tests
                deepEqual(oContainer.getItemKeys(), [], "bag should be empty first");
                oContainer.setItemValue(sITEM_KEY, oITEMVALUE);
                oContainer.save()
                    .fail(sap.ui2.srvc.test.onError)
                    .done(function () {
                        ok(true, oContainer.containsItem(sITEM_KEY),
                            "Correct item with item key: " + sITEM_KEY);
                        deepEqual(oContainer.getItemValue(sITEM_KEY), oITEMVALUE,
                            "Correct item value before loading");
                        oContainer.load()
                            .fail(sap.ui2.srvc.test.onError)
                            .done(function () {
                                start();
                                deepEqual(oContainer.getItemValue(sITEM_KEY), oITEMVALUE,
                                    "Correct item value after loading");
                            });
                    });
            });
    });

    asyncTest("delItem + save", function () {
        //oContainer has already been loaded in the prev test
        deepEqual(oContainer.getItemKeys(), [sITEM_KEY], "key is contained");
        deepEqual(oContainer.getItemValue(sITEM_KEY), oITEMVALUE,
            "Correct item value after loading");
        oContainer.delItem(sITEM_KEY); // code under test
        deepEqual(oContainer.getItemKeys(), [], "key should be removed");
        oContainer.save()
            .fail(sap.ui2.srvc.test.onError)
            .done(function () {
                start();
                deepEqual(oContainer.getItemKeys(), [], "key should still be removed");
            });
    });

    asyncTest("(clean-up) delPersonalizationContainer", function () {
        var oService = sap.ushell.Container.getService("Personalization");

        oService.delPersonalizationContainer(sCONTAINER)
            .fail(sap.ui2.srvc.test.onError)
            .done(function () {
                start();
                ok(true, "Deletion of container succeeded");
            });
    });
}());