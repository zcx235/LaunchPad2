// Copyright (c) 2012 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap/ui2/srvc/utils.js
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    document, jQuery, localStorage, sap, sinon, setTimeout, Storage, window */

    jQuery.sap.require("sap.ushell.utils");

    // Create and structure your QUnit tests here
    // Documentation can be found at http://docs.jquery.com/QUnit
    module("sap/ushell/utils.js", {
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown : function () {
            sap.ui2.srvc.test.restoreSpies(
                Storage.prototype.setItem
            );
        }
    });

    test("sap.ushell.utils.Error; create and expect tracing", function () {
        var oLogMock = sap.ui2.srvc.test.createLogMock()
                .error("UShell error created", null, "component"),
            unused = new sap.ushell.utils.Error("UShell error created", "component");
        oLogMock.verify();
        unused = !unused;
    });

    test("sap.ushell.utils.Error; check types", function () {
        var oError = new sap.ushell.utils.Error("UShell error created", "component");

        ok(oError instanceof Error, "expected instance of Error");
        ok(oError instanceof sap.ushell.utils.Error, "expected instance of sap.ushell.utils.Error");
    });

    test("sap.ushell.utils.Error: toString", function () {
        var oError = new sap.ushell.utils.Error("UShell error created", "component");

        strictEqual(oError.toString(), "sap.ushell.utils.Error: UShell error created", "toString");
    });

    test("sap.ushell.utils.Error: throw and catch", function () {
        var oError = new sap.ushell.utils.Error("UShell error created", "component");
        try {
            throw oError;
        } catch (e) {
            strictEqual(e, oError);
            strictEqual(e.message, "UShell error created");
        }
    });

    test("sap.ushell.utils.Map: basics", function () {
        var oMap = new sap.ushell.utils.Map();
        oMap.put("key", "value");
        strictEqual(oMap.containsKey("key"), true);
        strictEqual(oMap.containsKey("something"), false);
        strictEqual(oMap.get("key"), "value");
        strictEqual(oMap.get("something"), undefined);
        oMap.put("get", "oh");
        strictEqual(oMap.get("get"), "oh");
        oMap.put("hasOwnProperty", "oh");
        strictEqual(oMap.get("hasOwnProperty"), "oh");
        try {
            Object.prototype.foo = "bar";
            ok(!oMap.containsKey("foo"));
        } finally {
            delete Object.prototype.foo;
        }
    });

    test("sap.ui2.srvc.Map remove", function () {
        var oMap = new sap.ushell.utils.Map();
        oMap.put("key", "value");
        strictEqual(oMap.containsKey("key"), true);

        oMap.remove("key");
        strictEqual(oMap.containsKey("key"), false);
        strictEqual(oMap.get("key"), undefined);

        //removing something unknown should not throw an exeption
        oMap.remove("something");
    });

    test("sap.ushell.utils.Map: keys", function () {
        var oMap = new sap.ushell.utils.Map(),
            fnKeys = sinon.spy(Object, "keys"),
            aKeys;
        oMap.put("key", "value");
        aKeys = oMap.keys();
        deepEqual(aKeys, ["key"]);
        ok(fnKeys.calledOnce);
        ok(fnKeys.returned(aKeys));
    });

    test("sap.ushell.utils.Map: toString", function () {
        var oMap = new sap.ushell.utils.Map();
        strictEqual('sap.ushell.utils.Map({})', oMap.toString());

        oMap.put("key", "value");
        strictEqual('sap.ushell.utils.Map({"key":"value"})', oMap.toString());
    });

    test("sap.ushell.utils.Map: error handling", function () {
        var oMap = new sap.ushell.utils.Map();

        raises(function () {
            oMap.put({}, "foo");
        }, /Not a string key: \[object Object\]/);

        raises(function () {
            oMap.containsKey({});
        }, /Not a string key: \[object Object\]/);

        raises(function () {
            oMap.get({});
        }, /Not a string key: \[object Object\]/);
    });

    test("sap.ushell.utils.Map: put twice", function () {
        var oMap = new sap.ushell.utils.Map(),
            oPrevious;

        oPrevious = oMap.put("foo", window);
        strictEqual(oPrevious, undefined);

        oPrevious = oMap.put("foo", sinon);
        strictEqual(oPrevious, window);
    });

    test("sap.ushell.utils.hexToRgb: hex to RGB convertion", function () {
        var sHexColor = '#0a030a',
            oRgbColor;

        oRgbColor = sap.ushell.utils.hexToRgb(sHexColor);
        strictEqual(oRgbColor.r, 10);
        strictEqual(oRgbColor.g, 3);
        strictEqual(oRgbColor.b, 10);
    });

    test("sap.ushell.utils.convertToRealOpacity: claculate real opacity value", function () {
        var iMaxUsage = 45,
            iHashlessTileOpacity = 1,
            iExpectedOpacityCalc = 0.9,
            iActualOpacityCalc = undefined,
            testTileUsage = undefined;

        iActualOpacityCalc = sap.ushell.utils.convertToRealOpacity(testTileUsage, iMaxUsage);
        strictEqual(iActualOpacityCalc, iHashlessTileOpacity);

        testTileUsage = 25;
        iActualOpacityCalc = sap.ushell.utils.convertToRealOpacity(testTileUsage, iMaxUsage);
        strictEqual(iActualOpacityCalc, iExpectedOpacityCalc);
    });

    test("localStorageSetItem in Safari private browsing mode", function () {
        var sError = "QUOTA_EXCEEDED_ERR",
            oLogMock = sap.ui2.srvc.test.createLogMock()
                .filterComponent("sap.ushell.utils")
                .warning("Error calling localStorage.setItem(): " + sError, null,
                       "sap.ushell.utils");
        sinon.stub(Storage.prototype, "setItem");
        sap.ushell.utils.localStorageSetItem("foo", "bar");
        ok(Storage.prototype.setItem.calledWithExactly("foo", "bar"),
            "localStorage.setItem called for test");

        Storage.prototype.setItem.throws(sError);
        sap.ushell.utils.localStorageSetItem("foo", "bar");
        oLogMock.verify();

    });

    test("localStorageSetItem eventing to same window", function () {
        var fnStorageListener = sinon.spy(function (oStorageEvent) {
            strictEqual(oStorageEvent.key, "foo", "Key");
            strictEqual(oStorageEvent.newValue, "bar", "Value");
        });

        sinon.stub(Storage.prototype, "setItem");

        window.addEventListener('storage', fnStorageListener);
        sap.ushell.utils.localStorageSetItem("foo", "bar", true);

        ok(fnStorageListener.calledOnce, "Listener called (once)");

    });

    test("getFormFactor", function () {
        var oOriginalSystem = sap.ui.Device.system;

        function testFormFactor(oSystem, sExpected) {
            oSystem.SYSTEMTYPE = oOriginalSystem.SYSTEMTYPE;
            sap.ui.Device.system = oSystem;
            strictEqual(sap.ushell.utils.getFormFactor(), sExpected);
        }

        testFormFactor({desktop: true}, "desktop");
        testFormFactor({tablet: true}, "tablet");
        testFormFactor({phone: true}, "phone");
        testFormFactor({tablet: true, phone: true}, "tablet"); //Phablet?
        testFormFactor({desktop: true, tablet: true}, "desktop"); //MS Surface Pro?
        testFormFactor({desktop: true, tablet: true, phone: true}, "desktop"); //?
        testFormFactor({}, undefined);

        sap.ui.Device.system = oOriginalSystem;
    });

}());
