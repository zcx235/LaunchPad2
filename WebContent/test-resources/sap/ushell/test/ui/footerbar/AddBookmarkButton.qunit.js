// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
(function () {
    "use strict";
    /* module, ok, test, jQuery, sap */

    jQuery.sap.require("sap.ushell.ui.footerbar.AddBookmarkButton");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-core');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-widget');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-mouse');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-sortable');
    jQuery.sap.require("sap.ushell.resources");

    module("sap.ushell.ui.footerbar.AddBookmarkButton", {
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

    test("Constructor Test", function () {
        // avoid creating the real demo LaunchPageAdapter
        var oRenderer = sap.ushell.Container.createRenderer("fiori2");

        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();
        ok(bookmark.getIcon() == "sap-icon://add-favorite" , "Check dialog icon");
        ok(bookmark.getProperty("width") == "100%" , "Check dialog width");
        ok(bookmark.getText("text") == sap.ushell.resources.i18n.getText("addToHomePageBtn") , "Check button title");
        ok(bookmark.getEnabled() == true, "Check if button is enabled");
        oRenderer.destroy();
    });

    test("Custom Url Test", function () {
        var oRenderer = sap.ushell.Container.createRenderer("fiori2");
        this.isCheckCustomUrlCalled = false;
        var oEventBus = sap.ui.getCore().getEventBus(),
            bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton({appData : {customUrl : "TestUrl", title: 'TestTitle' }}),
            _checkCustomUrl = function (sChannelId, sEventId, oData) {
                ok(oData.url === "TestUrl", "expected value for customUrl is: TestUrl");
                this.isCheckCustomUrlCalled = true;
            }.bind(this);
        bookmark._openDialog = function () {
            this.oDialog = {
                close: function () {},
                destroy: function () {}
            };
            this.cb = function () {};
        };
        oEventBus.subscribe("launchpad", "addBookmarkTile", _checkCustomUrl, this);
        bookmark.showAddBookmarkDialog();
        var addBookmarkStub = sinon.stub(sap.ushell.Container.getService("LaunchPage"), "addBookmark");
        addBookmarkStub.returns(jQuery.Deferred().resolve().promise());
        bookmark._handleOkButtonPress();

        ok(this.isCheckCustomUrlCalled, "event: addBookmarkTile wasn't published");
        oEventBus.unsubscribe("launchpad", "addBookmarkTile", _checkCustomUrl, this);
        bookmark.destroy();
        addBookmarkStub.restore();
        oRenderer.destroy();
    });

    test("appData serviceURL Test 1 - simple string", function () {
        var oRenderer = sap.ushell.Container.createRenderer("fiori2");
        this.isCheckServiceUrlCalled = false;
        var oEventBus = sap.ui.getCore().getEventBus(),
            bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton({appData : {serviceUrl : 'testServiceUrl', title: 'TestTitle' }}),
            _checkServiceUrl = function (sChannelId, sEventId, oData) {
                ok(oData.serviceUrl === "testServiceUrl", "service URL plain string came back ok");
                this.isCheckServiceUrlCalled = true;
            }.bind(this);

        bookmark._openDialog = function () {
            this.oDialog = {
                close: function () {},
                destroy: function () {}
            };
            this.cb = function () {};
        };

        oEventBus.subscribe("launchpad", "addBookmarkTile", _checkServiceUrl, this);
        bookmark.showAddBookmarkDialog();
        var addBookmarkStub = sinon.stub(sap.ushell.Container.getService("LaunchPage"), "addBookmark");
        addBookmarkStub.returns(jQuery.Deferred().resolve().promise());
        bookmark._handleOkButtonPress();

        ok(this.isCheckServiceUrlCalled, "event: addBookmarkTile wasn't published");
        oEventBus.unsubscribe("launchpad", "addBookmarkTile", _checkServiceUrl, this);
        bookmark.destroy();
        addBookmarkStub.restore();
        oRenderer.destroy();
    });

    test("appData serviceURL Test 2 - a function ", function () {
        var oRenderer = sap.ushell.Container.createRenderer("fiori2");
        this.isCheckServiceUrlCalled = false;
        var oEventBus = sap.ui.getCore().getEventBus(),
            bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton({appData : {serviceUrl : function () { return 'functionServiceUrl'; }, title: 'TestTitle' }}),
            _checkServiceUrl = function (sChannelId, sEventId, oData) {
                ok(oData.serviceUrl === "functionServiceUrl", "service URL plain string came back ok");
                this.isCheckServiceUrlCalled = true;
            }.bind(this);

        bookmark._openDialog = function () {
            this.oDialog = {
                close: function () {},
                destroy: function () {}
            };
            this.cb = function () {};
        };

        oEventBus.subscribe("launchpad", "addBookmarkTile", _checkServiceUrl, this);
        bookmark.showAddBookmarkDialog();
        var addBookmarkStub = sinon.stub(sap.ushell.Container.getService("LaunchPage"), "addBookmark");
        addBookmarkStub.returns(jQuery.Deferred().resolve().promise());

        bookmark._handleOkButtonPress();

        ok(this.isCheckServiceUrlCalled, "event: addBookmarkTile wasn't published");
        oEventBus.unsubscribe("launchpad", "addBookmarkTile", _checkServiceUrl, this);
        bookmark.destroy();
        addBookmarkStub.restore();
        oRenderer.destroy();
    });

    test("Bookmark button Disabled in standalone state", function () {
        var oRenderer = sap.ushell.Container.createRenderer("fiori2");

        //Check that the button is disabled and invisible if the state of the shell is "standalone"
        sap.ui.getCore().byId("shell").getModel().getData().currentState.stateName = "standalone";
        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();

        ok(bookmark.getEnabled() == false, "Check if disabled - shell is in standalone state");
        ok(bookmark.getVisible() == true, "Check if visible - shell is in standalone state");
        oRenderer.destroy();

    });

    test("Bookmark button Disabled in headerless state", function () {
        var oRenderer = sap.ushell.Container.createRenderer("fiori2");

        //Check that the button is disabled and invisible if the state of the shell is "headerless"
        sap.ui.getCore().byId("shell").getModel().getData().currentState.stateName = "headerless";
        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();

        ok(bookmark.getEnabled() == false, "Check if disabled - shell is in headerless state");
        ok(bookmark.getVisible() == true, "Check if visible - shell is in headerless state");
        oRenderer.destroy();

    });

    test("Bookmark button Disabled in embedded state", function () {
        var oRenderer = sap.ushell.Container.createRenderer("fiori2");

        //Check that the button is disabled and invisible if the state of the shell is "embedded"
        sap.ui.getCore().byId("shell").getModel().getData().currentState.stateName = "embedded";
        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();

        ok(bookmark.getEnabled() == false, "Check if disabled - shell is in embedded state");
        ok(bookmark.getVisible() == true, "Check if visible - shell is in embedded state");
        oRenderer.destroy();

    });

    test("Disable bookmark button when personalization is switched off", function () {
        var oRenderer = sap.ushell.Container.createRenderer("fiori2");
        sap.ui.getCore().byId("shell").getModel().setProperty("/personalization", false);
        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton();

        ok(bookmark.getEnabled() == false, "Check if disabled - personalization is off");
        ok(bookmark.getVisible() == true, "Check if visible - personalization is off");
        oRenderer.destroy();
    });

    test("showAddBookmarkDialog Test", function () {

        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton(),
            oRenderer = sap.ushell.Container.createRenderer("fiori2"),
            oResourceBundle = sap.ushell.resources.i18n;
        ok(bookmark.getEnabled() == true, "Enabled");
        bookmark.showAddBookmarkDialog();
        var bookmarkDialogContent = sap.ui.getCore().byId('bookmarkFormId').getContent();
        ok(bookmarkDialogContent[0].getMetadata()._sClassName === 'sap.ui.core.Icon' , "Check form field type #0");
        ok(bookmarkDialogContent[0].getSrc() === 'sap-icon://home' , "Check form field value #0");
        ok(bookmarkDialogContent[1].getMetadata()._sClassName === 'sap.m.Label' , "Check form field type #1");
        ok(bookmarkDialogContent[1].getText() === oResourceBundle.getText('titleFld') , "Check form field value #1");
        ok(bookmarkDialogContent[2].getMetadata()._sClassName === 'sap.m.Input' , "Check form field type #2");
        ok(bookmarkDialogContent[2].getValue() === "" , "Check form field value #2");
        ok(bookmarkDialogContent[3].getMetadata()._sClassName === 'sap.m.Label' , "Check form field type #3");
        ok(bookmarkDialogContent[3].getText() === oResourceBundle.getText('subtitleFld') , "Check form field value #3");
        ok(bookmarkDialogContent[4].getMetadata()._sClassName === 'sap.m.Input' , "Check form field type #4");
        ok(bookmarkDialogContent[4].getValue() === "" , "Check form field value #4");
        ok(bookmarkDialogContent[5].getMetadata()._sClassName === 'sap.m.Label' , "Check form field type #5");
        ok(bookmarkDialogContent[5].getText() === oResourceBundle.getText('infoMsg') , "Check form field value #5");
        ok(bookmarkDialogContent[6].getMetadata()._sClassName === 'sap.m.Input' , "Check form field type #6");
        ok(bookmarkDialogContent[6].getValue() === '' , "Check form field value #6");
        ok(bookmarkDialogContent[7].getMetadata()._sClassName === 'sap.m.Label' , "Check form field type #5");
        ok(bookmarkDialogContent[7].getText() === oResourceBundle.getText('GroupListItem_label') , "Check form field value #7");
        ok(bookmarkDialogContent[8].getMetadata()._sClassName === 'sap.m.Select' , "Check form field type #8");


        sap.ui.getCore().byId('bookmarkDialog').destroy();
        oRenderer.destroy();
    });

    test("Disable dialog ok button when Title Field is empty", function () {

        var bookmark = new sap.ushell.ui.footerbar.AddBookmarkButton(),
            oRenderer = sap.ushell.Container.createRenderer("fiori2"),
            oResourceBundle = sap.ushell.resources.i18n;
        bookmark.showAddBookmarkDialog();
        var bookmarkDialogContent = sap.ui.getCore().byId('bookmarkFormId').getContent();
        var titleInput = bookmarkDialogContent[2];
        var bookmarkDialogOkButton = sap.ui.getCore().byId('bookmarkDialog').getBeginButton();

        ok(titleInput.getValue() === "" && !bookmarkDialogOkButton.getProperty("enabled"), "Check the ok button is not enabled");
        titleInput.setValue("not empty");
        titleInput.fireLiveChange();
        ok(bookmarkDialogOkButton.getProperty("enabled"), "Check the ok button is enabled");

        sap.ui.getCore().byId('bookmarkDialog').destroy();
        oRenderer.destroy();
    });

}());
