// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.AppConfiguration
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap*/
    jQuery.sap.require('sap.ushell.services.AppConfiguration');
    jQuery.sap.require("sap.ui.unified.library");

    module("sap.ushell.services.AppConfiguration", {
        setup: function () {
            if (!sap.ushell.Container) {
                sap.ushell.bootstrap("demo");
            }
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    var demoAppData = {
            "additionalInformation": "SAPUI5.Component=AppScflTest",
            "applicationType": "URL",
            "url": "/ushell/test-resources/sap/ushell/demoapps/AppScflTest?test=testParam",
            "description": "AppScflTest "
        };

    var getFavicon = function(){
        var favicon = undefined;
        var nodeList = document.getElementsByTagName("link");
        for (var i = 0; i < nodeList.length; i++)
        {
            if((nodeList[i].getAttribute("rel") == "icon")||(nodeList[i].getAttribute("rel") == "shortcut icon"))
            {
                favicon = nodeList[i].getAttribute("href");
            }
        }
        return favicon;
    }

    test("getService", function () {
        var oSrvc = sap.ushell.services.AppConfiguration;

        ok(oSrvc === sap.ushell.services.AppConfiguration);
    });

    test("get Application name", function () {
        var oSrvc = sap.ushell.services.AppConfiguration;
        ok(oSrvc.getApplicationName(demoAppData) === "AppScflTest");
    });

    test("get Application url", function () {
        var oSrvc = sap.ushell.services.AppConfiguration;
        ok(oSrvc.getApplicationUrl(demoAppData) === "/ushell/test-resources/sap/ushell/demoapps/AppScflTest/");
    });

    test("add Application settings button", function () {
        var oSrvc = sap.ushell.services.AppConfiguration,
            oShell;
        oShell = sap.ui.jsview("sap.ushell.renderers.fiori2.Shell");
        oShell.getController().switchViewState('app');
        sap.ui.getCore().byId("actionsBtn").firePress();
        var oActionSheet = sap.ui.getCore().byId("headActions");
        var aButtons = oActionSheet.getButtons();
        ok(aButtons.length === 4, "verify number of buttons before addition");
        oSrvc.addApplicationSettingsButtons([new sap.m.Button({text: "addButtonTest",id:"addButtonTest"})]);
        aButtons = oActionSheet.getButtons();
        ok(aButtons.length === 5, "verify number of buttons after addition");
        oShell.destroy();
    });

    test("set Window Title", function () {
        var oSrvc = sap.ushell.services.AppConfiguration;
        var newTitleName = "RenamedTitle";
        oSrvc.setWindowTitle(newTitleName);
        ok(document.title === newTitleName);
    });

    test("set Window Favicon", function () {
        var oSrvc = sap.ushell.services.AppConfiguration;
        var oFavIconProperties = {'favicon': '/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/favicon/F0003_Manage_Tasks.ico'};
        oSrvc.setIcons(oFavIconProperties);
        ok(getFavicon() === oFavIconProperties.favicon);
    });

}());
