// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.UserInfo
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    // require early so that we can spy on them (and esp. try to restore the spies in teardown)
    jQuery.sap.require("sap.ushell.services.Container"); // necessary for stand-alone tests
    jQuery.sap.require("sap.ushell.services.UserInfo");

    module("sap.ushell.services.UserInfo", {
        setup: function () {
            sap.ushell.bootstrap("demo");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    test("getService", function () {
        // code under test
        var oUserInfoService = sap.ushell.Container.getService("UserInfo");

        // test
        ok(oUserInfoService instanceof sap.ushell.services.UserInfo);
        strictEqual(typeof oUserInfoService.getId, "function");
    });

    test("delegation to Container", function () {
        var oUserInfoService = sap.ushell.Container.getService("UserInfo");

        // prepare test
        sinon.stub(sap.ushell.Container, "getUser", function () {
            return new sap.ushell.User({id : "id"});
        });

        // test
        strictEqual(oUserInfoService.getId(), "id");
        ok(sap.ushell.Container.getUser.calledOnce);
    });

    test("get user data", function () {
        var oUserInfoService = sap.ushell.Container.getService("UserInfo"),
            oUser = oUserInfoService.getUser();

        // test
        ok(oUser.getTheme() === "sap_bluecrystal", "check user selected theme");
        ok(oUser.getAccessibilityMode() === false, "check user selected accessability mode");
    });

    test("set user data", function () {
        var oUserInfoService = sap.ushell.Container.getService("UserInfo"),
            oUser = oUserInfoService.getUser(),
            bFailed = false;
        //Set
        oUser.setTheme("theme2");
        oUser.setAccessibilityMode(true);
            // test
        ok(oUser.getTheme() === "theme2", "check user selected theme");
        ok(oUser.getAccessibilityMode() === true, "check user selected accessability mode");

        oUser.isSetThemePermitted = function () {
            return false;
        };
        try {
            oUser.setTheme("theme3");
        } catch (e) {
            ok(oUser.getTheme() === "theme2", "check user  theme wasn't changed");
            bFailed = true;
        }
        ok(bFailed === true, "check that set Theme was prevented");

        oUser.isSetAccessibilityPermitted = function () {
            return false;
        };
        bFailed = false;
        try {
            oUser.setAccessibilityMode(false);
        } catch (exc) {
            ok(oUser.getAccessibilityMode() === true, "check user accessibility wasn't changed ");
            bFailed = true;
        }
        ok(bFailed === true, "check that set accessibility was prevented");



    });

    asyncTest("get user options", function () {
        var oUserInfoService = sap.ushell.Container.getService("UserInfo");

        // test
        oUserInfoService.getThemeList().done(function (res) {
            start();
            ok(res.options[0].id === "theme1_id", "check user theme options");
            ok(res.options[1].id === "theme2_id", "check user theme options");
            ok(res.options[2].id === "theme3_id", "check user theme options");
            ok(res.options[3].id === "theme4_id", "check user theme options");
        });
    });

    asyncTest("update user preferences", function () {
        var oUserInfoService = sap.ushell.Container.getService("UserInfo"),
            oUser = oUserInfoService.getUser();

        oUser.setTheme("theme2");
        oUser.setAccessibilityMode("true");
        // test
        oUserInfoService.updateUserPreferences().done(function (res) {
            start();
            ok(res.status === 200, "check OK response from server");

        });
    });



}());
