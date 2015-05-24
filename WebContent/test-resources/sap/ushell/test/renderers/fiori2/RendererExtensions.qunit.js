// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.RendererExtensions
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    //jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-core');

    module("sap.ushell.renderers.fiori2.RendererExtensions", {

        setup: function () {

            sap.ushell.bootstrap("demo");
            this.oRenderer = sap.ushell.Container.createRenderer("fiori2");
            this.initialModelStates = jQuery.extend(true, {}, sap.ui.getCore().byId("shell").getModel().getProperty("/states"));

        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            //the model is build once and since the model property is updated in every test,
            // there is a need to restore the initial value of this property
            sap.ui.getCore().byId("shell").getModel().setProperty("/states", this.initialModelStates);
            this.oRenderer.destroy();
            delete sap.ushell.Container;

        }
    });

    function checkModelProperties(oItem, sPropertyName, bItemExpectedInHomeState, bItemExpectedInAppState, bItemExpectedInCatalogState) {
        var oShell = sap.ui.getCore().byId("shell");
        var headItemsHome = oShell.getModel().getProperty("/states/home/" + sPropertyName);
        if (bItemExpectedInHomeState) {
            assert.ok(headItemsHome.indexOf(oItem.getId()) >= 0, "the new item is added to the model: /states/home/" + sPropertyName);
        }
        else {
            assert.ok(headItemsHome.indexOf(oItem.getId()) < 0, "the new item is not added to the model: /states/home/" + sPropertyName);
        }
        var headItemsApp = oShell.getModel().getProperty("/states/app/" + sPropertyName);
        if (bItemExpectedInAppState) {
            assert.ok(headItemsApp.indexOf(oItem.getId()) >= 0, "the new item is added to the model: /states/app/" + sPropertyName);
        }
        else {
            assert.ok(headItemsApp.indexOf(oItem.getId()) < 0, "the new item is not added to the model: /states/app/" + sPropertyName);
        }
        var headItemsCatalog = oShell.getModel().getProperty("/states/catalog/" + sPropertyName);
        if (bItemExpectedInCatalogState) {
            assert.ok(headItemsCatalog.indexOf(oItem.getId()) >= 0, "the new item is added to the model: /states/catalog/" + sPropertyName);
        }
        else {
            assert.ok(headItemsCatalog.indexOf(oItem.getId()) < 0, "the new item is not added to the model: /states/catalog/" + sPropertyName);
        }
    }

    test("test existance of a rendererExt Class", function () {
        var instance = null;
        instance = sap.ushell.renderers.fiori2.RendererExtensions;

        assert.ok(instance, "rendererExt exists");
    });

    test("test addHeaderItem without states", function () {
        var headItem1 = new sap.ui.unified.ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderItem(headItem1);
        var oShell = sap.ui.getCore().byId("shell");
        checkModelProperties(headItem1, "headItems", true, true, true);
    });

    test("test addHeaderItem with 1 state", function () {
        var headItem1 = new sap.ui.unified.ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderItem(headItem1, rendererExt.LaunchpadState.Home);
        checkModelProperties(headItem1, "headItems", true, false, false);
    });

    test("test addHeaderItem with 2 states", function () {
        var headItem1 = new sap.ui.unified.ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderItem(headItem1, rendererExt.LaunchpadState.Home, rendererExt.LaunchpadState.Catalog);
        checkModelProperties(headItem1, "headItems", true, false, true);
    });

    test("test addHeaderItem with 3 states", function () {
        var headItem1 = new sap.ui.unified.ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderItem(headItem1, rendererExt.LaunchpadState.Home, rendererExt.LaunchpadState.Catalog, rendererExt.LaunchpadState.App);
        checkModelProperties(headItem1, "headItems", true, true, true);
    });

    test("test addHeaderEndItem without states", function () {
        var headItem1 = new sap.ui.unified.ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1);
        checkModelProperties(headItem1, "headEndItems", true, true, true);
    });

    test("test addHeaderEndItem with 1 state", function () {
        var headItem1 = new sap.ui.unified.ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1, rendererExt.LaunchpadState.Home);
        checkModelProperties(headItem1, "headEndItems", true, false, false);
    });

    test("test addHeaderEndItem with 2 states", function () {
        var headItem1 = new sap.ui.unified.ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1, rendererExt.LaunchpadState.Home, rendererExt.LaunchpadState.Catalog);
        checkModelProperties(headItem1, "headEndItems", true, false, true);
    });

    test("test addHeaderEndItem with 3 states", function () {
        var headItem1 = new sap.ui.unified.ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1, rendererExt.LaunchpadState.Home, rendererExt.LaunchpadState.Catalog, rendererExt.LaunchpadState.App);
        checkModelProperties(headItem1, "headEndItems", true, true, true);
    });

    test("test addHeaderItem the second time - without states", function () {
        var warningSpy = sinon.spy(jQuery.sap.log, "warning");
        var headItem1 = new sap.ui.unified.ShellHeadItem("firstItemNoState");
        var headItem2 = new sap.ui.unified.ShellHeadItem("secondItemNoState");
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderItem(headItem1);
        rendererExt.addHeaderItem(headItem2);
        checkModelProperties(headItem2, "headItems", true, true, true);
        checkModelProperties(headItem1, "headItems", false, false, false);
        assert.ok(warningSpy.calledWith("You can only add one headItem. Replacing existing headItem: firstItemNoState in state: home, with the new headItem: secondItemNoState."), "a warning was written in the log");
        assert.ok(warningSpy.calledWith("You can only add one headItem. Replacing existing headItem: firstItemNoState in state: app, with the new headItem: secondItemNoState."), "a warning was written in the log");
        assert.ok(warningSpy.calledWith("You can only add one headItem. Replacing existing headItem: firstItemNoState in state: catalog, with the new headItem: secondItemNoState."), "a warning was written in the log");
        warningSpy.restore();
    });

    test("test addHeaderItem the second time - with 1 state", function () {
        var warningSpy = sinon.spy(jQuery.sap.log, "warning");
        var headItem1 = new sap.ui.unified.ShellHeadItem("firstItem1state");
        var headItem2 = new sap.ui.unified.ShellHeadItem("secondItem1state");
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderItem(headItem1);
        rendererExt.addHeaderItem(headItem2, rendererExt.LaunchpadState.Home);
        checkModelProperties(headItem2, "headItems", true, false, false);
        checkModelProperties(headItem1, "headItems", false, true, true);
        assert.ok(warningSpy.calledWith("You can only add one headItem. Replacing existing headItem: firstItem1state in state: home, with the new headItem: secondItem1state."), "a warning was written in the log");
        warningSpy.restore();
    });

    test("test addHeaderEndItem the second time - without states", function () {
        var warningSpy = sinon.spy(jQuery.sap.log, "warning");
        var headItem1 = new sap.ui.unified.ShellHeadItem("firstEndItemNoState");
        var headItem2 = new sap.ui.unified.ShellHeadItem("secondEndItemNoState");
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1);
        rendererExt.addHeaderEndItem(headItem2);
        checkModelProperties(headItem2, "headEndItems", true, true, true);
        checkModelProperties(headItem1, "headEndItems", false, false, false);
        assert.ok(warningSpy.calledWith("You can only add one headEndItem. Replacing existing headItem: firstEndItemNoState in state: home, with the new headItem: secondEndItemNoState."), "a warning was written in the log");
        assert.ok(warningSpy.calledWith("You can only add one headEndItem. Replacing existing headItem: firstEndItemNoState in state: catalog, with the new headItem: secondEndItemNoState."), "a warning was written in the log");
        assert.ok(warningSpy.calledWith("You can only add one headEndItem. Replacing existing headItem: firstEndItemNoState in state: app, with the new headItem: secondEndItemNoState."), "a warning was written in the log");
        warningSpy.restore();
    });

    test("test addHeaderEndItem the second time - with 1 state", function () {
        var warningSpy = sinon.spy(jQuery.sap.log, "warning");
        var headItem1 = new sap.ui.unified.ShellHeadItem("firstEndItem1state");
        var headItem2 = new sap.ui.unified.ShellHeadItem("secondEndItem1state");
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1);
        rendererExt.addHeaderEndItem(headItem2, rendererExt.LaunchpadState.Home);
        checkModelProperties(headItem1, "headEndItems", false, true, true);
        checkModelProperties(headItem2, "headEndItems", true, false, false);
        assert.ok(warningSpy.calledWith("You can only add one headEndItem. Replacing existing headItem: firstEndItem1state in state: home, with the new headItem: secondEndItem1state."), "a warning was written in the log");
        warningSpy.restore();
    });

    test("test removeHeaderItem without states", function () {
        var headItem1 = new sap.ui.unified.ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderItem(headItem1);
        rendererExt.removeHeaderItem(headItem1);
        checkModelProperties(headItem1, "headItems", false, false, false);
    });

    test("test removeHeaderEndItem without states", function () {
        var headItem1 = new sap.ui.unified.ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1);
        rendererExt.removeHeaderEndItem(headItem1);
        checkModelProperties(headItem1, "headEndItems", false, false, false);
    });

    test("test removeHeaderItem with state", function () {
        var headItem1 = new sap.ui.unified.ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderItem(headItem1);
        rendererExt.removeHeaderItem(headItem1, rendererExt.LaunchpadState.App);
        checkModelProperties(headItem1, "headItems", true, false, true);
    });

    test("test removeHeaderEndItem with state", function () {
        var headItem1 = new sap.ui.unified.ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1);
        rendererExt.removeHeaderEndItem(headItem1, rendererExt.LaunchpadState.App);
        checkModelProperties(headItem1, "headEndItems", true, false, true);
    });

    test("test exceptions with illigal state", function () {
        var headItem1 = new sap.ui.unified.ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        assert.throws(
            function () {
                rendererExt.addHeaderItem(headItem1, "test")
            },
            function (err) {
                return (err.message == "sLaunchpadState value is invalid");
            },
            "addHeaderItem - the expected exception was thrown");
        assert.throws(
            function () {
                rendererExt.addHeaderEndItem(headItem1, "test")
            },
            function (err) {
                return (err.message == "sLaunchpadState value is invalid");
            },
            "addHeaderEndItem - the expected exception was thrown");
        assert.throws(
            function () {
                rendererExt.removeHeaderItem(headItem1, "test")
            },
            function (err) {
                return (err.message == "sLaunchpadState value is invalid");
            },
            "removeHeaderItem - the expected exception was thrown");
        assert.throws(
            function () {
                rendererExt.removeHeaderEndItem(headItem1, "test")
            },
            function (err) {
                return (err.message == "sLaunchpadState value is invalid");
            },
            "removeHeaderEndItem - the expected exception was thrown");
    });

    test("test exceptions with illigal item", function () {
        var headItem1 = {};
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        assert.throws(
            function () {
                rendererExt.addHeaderItem(headItem1)
            },
            function (err) {
                return (err.message == "oItem value is invalid");
            },
            "addHeaderItem - the expected exception was thrown");
        assert.throws(
            function () {
                rendererExt.addHeaderEndItem(headItem1)
            },
            function (err) {
                return (err.message == "oItem value is invalid");
            },
            "addHeaderEndItem - the expected exception was thrown");
        assert.throws(
            function () {
                rendererExt.removeHeaderItem(headItem1)
            },
            function (err) {
                return (err.message == "oItem value is invalid");
            },
            "removeHeaderItem - the expected exception was thrown");
        assert.throws(
            function () {
                rendererExt.removeHeaderEndItem(headItem1)
            },
            function (err) {
                return (err.message == "oItem value is invalid");
            },
            "removeHeaderEndItem - the expected exception was thrown");
    });

    test("test removeHeadItem with an item that do not exists", function () {
        var warningSpy = sinon.spy(jQuery.sap.log, "warning");
        var headItem1 = new sap.ui.unified.ShellHeadItem("firstItemAdd");
        var headItem2 = new sap.ui.unified.ShellHeadItem("secondItemRemove");
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderItem(headItem1);
        rendererExt.removeHeaderItem(headItem2);
        checkModelProperties(headItem1, "headItems", true, true, true);
        checkModelProperties(headItem2, "headItems", false, false, false);
        assert.ok(warningSpy.calledWith("You cannot remove headItem: secondItemRemove, the headItem does not exists."), "a warning was written in the log");
        warningSpy.restore();
    });

    test("test removeEndHeadItem with an item that do not exists", function () {
        var warningSpy = sinon.spy(jQuery.sap.log, "warning");
        var headItem1 = new sap.ui.unified.ShellHeadItem("firstEndItemAdd");
        var headItem2 = new sap.ui.unified.ShellHeadItem("secondEndItemRemove");
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1);
        rendererExt.removeHeaderEndItem(headItem2);
        checkModelProperties(headItem1, "headEndItems", true, true, true);
        checkModelProperties(headItem2, "headEndItems", false, false, false);
        assert.ok(warningSpy.calledWith("You cannot remove headItem: secondEndItemRemove, the headItem does not exists."), "a warning was written in the log");
        warningSpy.restore();
    });

    asyncTest("test publishing public event", function () {
        expect(1);
        sap.ui.getCore().getEventBus().subscribe("sap.ushell.renderers.fiori2.Renderer", "testEvent", function () {
                assert.ok(true, "the event was thrown as expected");
                start();
            }
        );
        sap.ushell.renderers.fiori2.utils.publishExternalEvent("testEvent");
        setTimeout(function() {
        }, 100);
    });

}());