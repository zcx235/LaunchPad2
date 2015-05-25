// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.Shell
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-core');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-widget');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-mouse');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-sortable');
    jQuery.sap.require("sap.ushell.resources");

    module("sap.ushell.renderers.fiori2.Shell", {
        setup: function () {
            window.location.hash = "";
            sap.ushell.bootstrap("demo");
/*            if (window.hasher && window.hasher.getHash()) {
                window.hasher.setHash('');
            }*/

            jQuery.sap.declare("sap.ushell.components.container.ApplicationContainer");
            sap.ushell.components.container.ApplicationContainer = function() {};

            sap.m.BusyDialog.prototype.open = function(){};

            oController = new sap.ui.controller("sap.ushell.renderers.fiori2.Shell");

        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            window.location.hash = "";
            delete sap.ushell.Container;
            oController.destroy();
        }
    });

    var oController;



    test("test isCatalogExist and showCatalog", function () {
        oController.oNavContainer = {
            addPage : function() {},
            to : function() {}
        };
        var switchViewState = sinon.stub(oController, "switchViewState");
        oController.oLoadingDialog = {
            closeLoadingScreen : function() {}
        };
        var publish = sinon.stub(sap.ui.getCore().getEventBus(), "publish");


        sap.ui.jsview("sap.ushell.renderers.fiori2.launchpad.catalog.Catalog", {
            createContent : function() {
                return [];
            }
        });

        var catalogExist = oController.isCatalogExist();
        ok(catalogExist === false ,'Verify catalog is still undefined');
        //create catalog
        oController.showCatalog();
        ok(switchViewState.calledOnce === true ,'Verify switch view called');
        ok(switchViewState.args[0][0] === "catalog" ,'Verify switch view called with catalog');

        switchViewState.restore();
        publish.restore();
    });

//    test("test openShellOverlay and closeShellOverlay", function () {
//        var overlay = {
//            open : sinon.spy(),
//            close : sinon.spy(),
//            isActive : sinon.stub().returns(true)
//        };
//        var byId = sinon.stub(sap.ui.getCore(), "byId");
//        byId.returns(overlay);
//
//        //open
//        oController.openShellOverlay();
//        ok(overlay.open.calledOnce === true ,'Test openShellOverlay');
//        //close
//        oController.closeShellOverlay ();
//        ok(overlay.close.calledOnce === true ,'Test closeShellOverlay');
//
//        byId.restore();
//    });

//    test("test onCurtainClose", function () {
//        var searchField = {
//            $ : sinon.stub().returns({
//                find : sinon.stub().returns({
//                    blur : sinon.spy()
//                })
//            }),
//            focus : sinon.spy()
//        };
//        var byId = sinon.stub(sap.ui.getCore(), "byId");
//        byId.returns(searchField);
//        var publish = sinon.spy(sap.ui.getCore().getEventBus(), "publish");
//
//        oController.onCurtainClose ();
//        ok(publish.calledOnce === true ,'Test openShellOverlay');
//        ok(publish.args[0][0] === "closeCurtain" ,'Test openShellOverlay');
//
//        byId.restore();
//        publish.restore();
//    });

    test("test getAnimationType", function () {
        var animations = oController.getAnimationType();
        ok(animations === "slide" ,'Verify animations type');
        //sap.ui.Device.os = sap.ui.Device.os || {};
        sap.ui.Device.os.android = true;
        var animations = oController.getAnimationType();
        ok(animations === "show" ,'Verify animations type');
        //delete sap.ui.Device.os.android;
    });


    test("test doShowMessage", function () {
        jQuery.sap.require("sap.m.MessageBox");
        jQuery.sap.require("sap.ushell.ui.launchpad.EmbeddedSupportErrorMessage");
        jQuery.sap.require("sap.m.MessageToast");

        var sMessage = "testMessage";
        var sTitle = "testTitle";
        var sCallback = "sCallback";

        var show = sinon.stub(sap.m.MessageBox, "show");
        var confirm = sinon.stub(sap.m.MessageBox, "confirm");
        var mtShow = sinon.stub(sap.m.MessageToast, "show");
        var stubEmbeddedSupportErrorMessage = sinon.stub(sap.ushell.ui.launchpad.EmbeddedSupportErrorMessage.prototype, "open");

        //test regular error message
        oController.doShowMessage(sap.ushell.services.Message.Type.ERROR, sMessage, {title: sTitle});
        ok(show.calledOnce === true ,'Test error popup called');
        ok(show.args[0][0] === sMessage, 'Test error popup message');
        ok(show.args[0][1] === 'ERROR', 'Test error popup message type');
        ok(show.args[0][2] === sTitle, 'Test error popup message sTitle');

        //test error message with support ticket
        sap.ushell.Container.getService("SupportTicket").isEnabled = function() {return (true)};
        oController.doShowMessage(sap.ushell.services.Message.Type.ERROR, sMessage, {title:sTitle});
        ok(stubEmbeddedSupportErrorMessage.calledOnce === true ,'Test error popup called');

        //test confirm message without action
        oController.doShowMessage(sap.ushell.services.Message.Type.CONFIRM, sMessage, {title:sTitle, callback : sCallback});
        ok(confirm.calledOnce === true ,'Test confirm popup called');
        ok(confirm.args[0][0] === sMessage, 'Test confirm popup message');
        ok(confirm.args[0][1] === sCallback, 'Test confirm sCallback');
        ok(confirm.args[0][2] === sTitle, 'Test confirm popup message sTitle');

        //test confirm message with action
        oController.doShowMessage(sap.ushell.services.Message.Type.CONFIRM, sMessage, {title:sTitle, callback : sCallback, actions : "action"});
        ok(show.callCount === 2 ,'Test confirm popup called with actions');
        ok(show.args[1][0] === sMessage, 'Test confirm popup (with actions) message');
        ok(show.args[1][1] === 'QUESTION', 'Test confirm popup (with actions) type');
        ok(show.args[1][2] === sTitle, 'Test confirm popup (with actions) message sTitle');
        ok(show.args[1][3] === 'action', 'Test confirm popup (with actions) actions');
        ok(show.args[1][4] === sCallback, 'Test confirm popup (with actions) sCallback');

        //test other message without duration
        oController.doShowMessage("otherType", sMessage, {duration: null});
        ok(mtShow.calledOnce === true ,'Test toast called');
        ok(mtShow.args[0][0] === sMessage, 'Test toast message');
        ok(mtShow.args[0][1].duration === 3000, 'Test toast duration');

        //test other message with duration
        oController.doShowMessage("otherType", sMessage, {duration: 1});
        ok(mtShow.callCount === 2 ,'Test toast called');
        ok(mtShow.args[1][0] === sMessage, 'Test toast message');
        ok(mtShow.args[1][1].duration === 1, 'Test toast duration');

        show.restore();
        confirm.restore();
        mtShow.restore();
        stubEmbeddedSupportErrorMessage.restore();
    });

    test("test fixShellHash", function () {
        var hash = oController.fixShellHash("");
        ok(hash === "#" ,'Test fix empty has');

        hash = oController.fixShellHash("test");
        ok(hash === "#test" ,'Test adding # prefix');

        hash = oController.fixShellHash("#");
        ok(hash === "#" ,'Test hash equal #');

        hash = oController.fixShellHash("#test");
        ok(hash === "#test" ,'Test no fix required');
    });


    test("test openDashboard", function () {
        oController.oNavContainer = {
            backToTop : function(){}
        };
        var close = sinon.stub(sap.m.BusyDialog.prototype, "close"); //to block unwanted busy-dialog issues
        var switchViewState = sinon.stub(oController, "switchViewState");
        var setAppIcons = sinon.stub(oController, "setAppIcons");
        var byIDstub =  sinon.stub( sap.ui.getCore(), "byId").returns(
            {
                focusOnConfigBtn : function(){return true}
            }
        );
        oController.openDashboard();
        ok(switchViewState.calledOnce === true ,'Test switch view state called');
        ok(switchViewState.args[0][0] === "home" ,'Test switch view state called with home');
        ok(setAppIcons.calledOnce === true ,'Test setAppIcons called');

        switchViewState.restore();
        setAppIcons.restore();
        close.restore();
        byIDstub.restore();
    });

    test("test setAppIcons", function () {
        var setIcons = sinon.spy(jQuery.sap, "setIcons");

        //without meta config & ios
        sap.ui.Device.os.ios = true;
        oController.setAppIcons();

        ok(setIcons.calledOnce === true ,'Test set icons called');
        ok(setIcons.args[0][0].favicon === "../resources/sap/ushell/themes/base/img/launchpad_favicon.ico" ,'Test favicon');
        ok(setIcons.args[0][0].phone === "../resources/sap/ushell/themes/base/img/launchicons/57_iPhone_Desktop_Launch.png" ,'Test phone');
        //ok(jQuery.sap.setIcons.args[0][0].precomposed === true ,'Test precomposed');

        //without meta config & not ios
        sap.ui.Device.os.ios = false;
        var getFavIconHref = sinon.stub(oController, "getFavIconHref");
        getFavIconHref.returns("test");

        oController.setAppIcons();

        ok(jQuery.sap.setIcons.callCount === 2 ,'Test set icons called');
        ok(jQuery.sap.setIcons.args[1][0].favicon === "../resources/sap/ushell/themes/base/img/launchpad_favicon.ico" ,'Test favicon');
        ok(jQuery.sap.setIcons.args[1][0].phone === "" ,'Test phone');

        //ios with meta config
        var oMetadataConfig = {
            homeScreenIconPhone : "homeScreenIconPhone",
            "homeScreenIconPhone@2" : "homeScreenIconPhone@2",
            homeScreenIconTablet : "homeScreenIconTablet",
            "homeScreenIconTablet@2" : "homeScreenIconTablet@2",
            favIcon : "favIcon",
            title : "title"
        };
        sap.ui.Device.os.ios = true;
        oController.setAppIcons(oMetadataConfig);
        ok(setIcons.callCount === 3 ,'Test set icons called');
        ok(setIcons.args[2][0].favicon === "favIcon" ,'Test favicon');
        ok(setIcons.args[2][0].phone === "homeScreenIconPhone" ,'Test phone');

        setIcons.restore();
        getFavIconHref.restore();
    });

    test("test onAfterNavigate", function () {
        oController.oLoadingDialog = {
            closeLoadingScreen : sinon.spy()
        };
        oController.oNavContainer = {
            getInitialPage : function() {return null;}
        };
        oController.onAfterNavigate({getParameter : function() {return "catalogPage"}});
        ok(oController.oLoadingDialog.closeLoadingScreen.calledOnce === true ,'Test close load screen called after navigation');
    });

    test("test togglePane", function () {
        var oEvent = {
            getSource : sinon.stub().returns({
                getSelected : sinon.stub(),
                getModel : sinon.stub().returns({
                    setProperty : sinon.spy()
                })
            }),
            getParameter : sinon.stub().returns("categoriesBtn")
        };
        var getModel = sinon.stub(oController, "getModel").returns({
            setProperty : sinon.spy()
        });
        var getView = sinon.stub(oController, "getView").returns({
            oDashboardManager : {
                getGroupListView : function() {return ({
                    addStyleClass : function() {},
                    getId : function() {return "id";}
                });}
            }
        });
        sap.ui.Device.system.desktop = true;

        //id = categories button
        oController.togglePane(oEvent);
        ok(oController.getModel().setProperty.callCount === 2 ,'Controller model set properties called 2 times');
        ok(oController.getModel().setProperty.args[0][0] === '/states/home/paneContent' ,'Controller model set properties called with /states/home/paneContent');
        ok(oController.getModel().setProperty.args[1][0] === '/currentState/paneContent' ,'Controller model set properties called with /currentState/paneContent');
        ok(oEvent.getSource().getModel().setProperty.callCount === 1 ,'Event source model set properties called 1 time');
        ok(oEvent.getSource().getModel().setProperty.args[0][0] === '/currentState/showCurtainPane' ,'Event source model set properties called with /currentState/showCurtainPane');

        //id != categories button
        oEvent.getParameter = sinon.stub().returns("other");
        oController.togglePane(oEvent);
        ok(oController.getModel().setProperty.callCount === 4 ,'Controller model set properties called 4 times');
        ok(oEvent.getSource().getModel().setProperty.callCount === 2 ,'Event source model set properties called 1 time');
        ok(oEvent.getSource().getModel().setProperty.args[1][0] === '/currentState/showPane' ,'Event source model set properties called with /currentState/showPane');

        getModel.restore();
        getView.restore();
    });

    test("test doHashChange", function () {
        oController.oLoadingDialog = {
            setText: sinon.stub.returns(undefined),
            openLoadingScreen: sinon.stub.returns(undefined),
            closeLoadingScreen: sinon.stub.returns(undefined)
        }
        sap.ushell.renderers.fiori2.Navigation = {
            CATALOG : {
                ID : "catalog"
            }
        };
        oController.history = sinon.spy();
        oController.history.hashChange = sinon.spy();
        oController.openSomething = sinon.spy();
        oController.cleanHash = sinon.spy();
        oController.historyBack = sinon.spy();
        oController.history.getHistoryLength = sinon.stub();
        oController.history.getHistoryLength.returns(0);
        var parseShellHashMock = sinon.stub();
        parseShellHashMock.withArgs("#hash").returns(null);
        parseShellHashMock.withArgs("#navResCtx").returns({contextRaw : "navResCtx", params : {additionalInformation : ["test"], url : ["test"], applicationType : ["test"]}});


        var sShellHash = "#hash";
        var sShellHashNavResCtx = "#navResCtx";
        var sOldShellHash = "#oldHash";
        var sAppPart = "AppPart";

        //test do hash change without parse error, without navResCtx, which succeeds
        var dfdA = $.Deferred();
        sap.ushell.Container.getService = sinon.stub().returns({
            resolveHashFragment : function() {return (dfdA);},
            parseShellHash : parseShellHashMock
        });
        oController.doHashChange(sShellHash, sAppPart, sOldShellHash, null);
        ok(oController.history.hashChange.calledOnce === true ,'No hash parse (!navResCtx), and dfd resolved - Hash changed was called');
        dfdA.resolve();
        dfdA.done(function(){
            ok(oController.openSomething.calledOnce === true ,'No hash parse (!navResCtx), and dfd resolved - Open something was called');
        });

        //test with contextRaw === "navResCtx"
        oController.doHashChange(sShellHashNavResCtx, sAppPart, sOldShellHash, null);
        ok(oController.openSomething.callCount === 2 ,'Test hash parsed - open something was called');


        //test parse error flow
        var oParseError = {message : "error"};
        oController.reportError = sinon.spy();
        oController.oLoadingDialog = {
            closeLoadingScreen : function() {}
        };
        oController.delayedMessageError = sinon.spy();
        //with history 0
        oController.doHashChange(sShellHash, sAppPart, sOldShellHash, oParseError);
        ok(oController.cleanHash.calledOnce === true ,'Parse Error (with no history) - clean hash');
        //test parse error flow - with history > 0
        oController.history.getHistoryLength.returns(1);
        oController.doHashChange(sShellHash, sAppPart, sOldShellHash, oParseError);
        ok(oController.historyBack.calledOnce === true ,'Parse Error (with history) - navigate back using history');

        //test do hash change without parse error, without navResCtx, which fails with history 0
        oController.history.getHistoryLength.returns(0);
        var dfdB = $.Deferred();
        sap.ushell.Container.getService = sinon.stub().returns({
            resolveHashFragment : function() {return (dfdB);},
            parseShellHash : parseShellHashMock
        });

        oController.oLoadingDialog = {
            setText: sinon.stub.returns(undefined),
            openLoadingScreen: sinon.stub.returns(undefined),
            closeLoadingScreen: sinon.stub.returns(undefined)
        }
        oController.doHashChange(sShellHash, sAppPart, sOldShellHash, null);
        dfdB.reject();
        dfdB.fail(function(){
            ok(oController.cleanHash.callCount === 2 ,'test do hash change without parse error, without navResCtx, which fails with history 0 - clean hash is called');
        });
        //test do hash change without parse error, without navResCtx, which fails with history > 0
        oController.history.getHistoryLength.returns(1);
        var dfdC = $.Deferred();
        sap.ushell.Container.getService = sinon.stub().returns({
            resolveHashFragment : function() {return (dfdC);},
            parseShellHash : parseShellHashMock
        });
        oController.doHashChange(sShellHash, sAppPart, sOldShellHash, null);
        dfdC.reject();
        dfdC.fail(function(){
            ok(oController.historyBack.callCount === 2 ,'test do hash change without parse error, without navResCtx, which fails with history > 0 - history back is called');
        });

    });

    /*
    test("test openApp", function () {

        var oData = {
            oApplication : null,
            oMetadata : {},
            sShellHash : "#hash",
            params : {},
            semanticObject : "semanticObject",
            action : "action"
        };
        var sChannelId = "sChannelId";
        var sEventId = "sEventId";
        oController.oLoadingDialog = {
            closeLoadingScreen : sinon.spy(),
            showAppInfo : sinon.spy(),
            openLoadingScreen : function() {}
        };
        oController.oNavContainer = sinon.spy();
        oController.oNavContainer.to = sinon.spy();
        oController.oNavContainer.getInitialPage = sinon.stub().returns(false);
        oController.oNavContainer.getPage = sinon.stub().returns(null);
        oController.oNavContainer.addPage = sinon.spy();
        oController.switchViewState = sinon.spy();
        oController.changeHash = sinon.spy();
        var hrefForExternalSpy = sinon.spy();
        sap.ushell.Container.getService = sinon.stub();
        sap.ushell.Container.getService.withArgs("ShellNavigation").returns({
            hrefForExternal : hrefForExternalSpy
        });
        sap.ushell.Container.getService.withArgs("URLParsing").returns({
            parseShellHash : function() {return "#hash";}
        });

        //test no application - and first position - close loading screen
        oController.history = {
            getHistoryLength : sinon.stub().returns(0)
        };
        oController.openApp(sChannelId, sEventId, oData);
        ok(oController.oLoadingDialog.closeLoadingScreen.calledOnce === true ,'test no application - and first position - close loading screen was called');

        //test no application - and not first position - app has been launched before - do nothing;
        oController.history.getHistoryLength = sinon.stub().returns(1);
        oController.openApp(sChannelId, sEventId, oData);
        ok(oController.oLoadingDialog.closeLoadingScreen.calledOnce === true ,'test no application - and first position - close loading screen was called');

        //with application
        //WebGUI Application
        oController.openAppNewWindow = sinon.spy();
        oData.oApplication = {applicationType : "NWBC"};
        oData.contextRaw = "test";
        oController.history.getHistoryLength = sinon.stub().returns(2);
        oController.openApp(sChannelId, sEventId, oData);
        //ok(oController.oLoadingDialog.closeLoadingScreen.callCount() === 2 ,'test no application - and first position - close loading screen was called');
        ok(hrefForExternalSpy.calledOnce === true ,'test WebGUI Application - hrefForExternal was called');
        ok(oController.openAppNewWindow.calledOnce === true ,'test WebGUI Application - window open was called');

//        oData.contextRaw = "navResCtx";
//        oController.openApp(sChannelId, sEventId, oData);
//        ok(oController.switchViewState.calledOnce === true ,'test WebGUI Application - switch view state called');
//        ok(oController.switchViewState.args[0][0] === "minimal" ,'test WebGUI Application - switch view state called with minimal');
//        ok(oController.changeHash.calledOnce === true ,'test WebGUI Application - switch view state called');
//        ok(oController.changeHash.args[0][0] === oData.semanticObject + "-" + oData.action ,'test WebGUI Application - switch view state called with minimal');

        //not WebGUI Application
        //first open of application
        oData.oApplication = {applicationType : "test"};
        oData.oMetadata.fullWidth = true;
        oController.openApp(sChannelId, sEventId, oData);
        ok(oController.oLoadingDialog.showAppInfo.calledOnce === true ,'test New Application - Loading Dialog - show app info called');
        ok(oController.oNavContainer.addPage.calledOnce === true ,'test New Application - Navigation Container - add page called');
        ok(oController.switchViewState.calledOnce === true ,'test New Application - switch view state called');
        ok(oController.switchViewState.args[0][0] === "app" ,'test New Application - switch view state called with app argument');
        ok(oController.oNavContainer.to.calledOnce === true ,'test New Application - navigation container to called');

    });
    */

    test("test openSomething", function () {
        var close = sinon.stub(sap.m.BusyDialog.prototype, "close"); //to block unwanted issues
        var oModel = oController.getModel();
//        sap.ushell.services.URLParsing.parseShellHash = sinon.stub();
//        sap.ushell.services.URLParsing.parseShellHash.withArgs("#error").throws();
//        sap.ushell.services.URLParsing.parseShellHash.withArgs("#hash").returns({});
        var publish = sinon.spy(sap.ui.getCore().getEventBus(), "publish");

        var sShellHash = "#hash";
        var sOldShellHash = "#oldHash";
        var sAppPart = "AppPart";

        sap.ushell.renderers.fiori2.Navigation = {
            CATALOG : {
                ID : "catalog"
            }
        };

        oController.oNavContainer = {
            getParent : sinon.stub().returns(true)
        };

        //if application & catalog ID - show catalog
        oController.openSomething(sShellHash, sOldShellHash, sAppPart, {applicationType : sap.ushell.renderers.fiori2.Navigation.CATALOG.ID});
        ok(publish.calledOnce === true ,'application open - catalog');
        ok(publish.args[0][0] === "showCatalog" ,'Catalog application open - parameters');
        //ok(sap.ui.getCore().getEventBus().publish.args[0][1].oApplication.applicationType === "ShellCatalog" ,'Catalog application open - parameters - app type');
        ok(publish.args[0][1].sAppPart === sAppPart ,'Catalog application open - parameters - app part');
        ok(publish.args[0][1].sOldShellHash === sOldShellHash ,'Catalog application open - parameters - app part');
        ok(publish.args[0][1].sShellHash === sShellHash ,'Catalog application open - parameters - app part');

        //if application with other ID - open app
        oController.openSomething(sShellHash, sOldShellHash, sAppPart, {applicationType : "other"});
        ok(publish.callCount === 2 ,'Regular application open');
        ok(publish.args[1][0] === "openApp" ,'Regular application open - parameters');
        ok(publish.args[1][1].oApplication.applicationType === "other" ,'Regular application open - parameters - app type');
        ok(publish.args[1][1].sAppPart === sAppPart ,'Regular application open - parameters - app part');
        ok(publish.args[1][1].sOldShellHash === sOldShellHash ,'Regular application open - parameters - app part');
        ok(publish.args[1][1].sShellHash === sShellHash ,'Regular application open - parameters - app part');

        //if not application
        //if dashboard
        oController.openDashboard = sinon.spy();
        oController.showCatalog = sinon.spy();
        oController.openSomething();
        ok(oController.openDashboard.calledOnce === true ,'Test dashboard opened');
        //if catalog
        oModel.setProperty("/currentState", {'stateName' : 'catalogApp'});
        oController.openSomething();
        ok(oController.openDashboard.calledOnce === true ,'Test catalog opened');

        publish.restore();
        close.restore();
    });

    function _testUserImage(sUserImageURI, bExist){
        var getImageStub = sinon.stub(sap.ushell.Container.getUser(), "getImage");
        getImageStub.returns(sUserImageURI);
        var origAjax = jQuery.ajax;
        var jqAjaxStub = sinon.stub(jQuery, "ajax", function(oRequestSettings){
            if (!sUserImageURI || sUserImageURI === "" || sUserImageURI === oRequestSettings.url) {
                bExist ? oRequestSettings.success() : oRequestSettings.error();
            }
            else{
                return origAjax.apply(this, arguments);
            }
        });

        var oRenderer = sap.ushell.Container.createRenderer("fiori2");
        var oShell = sap.ui.getCore().byId("shell");
        sap.ui.getCore().getEventBus().publish("launchpad", "contentRendered");

        getImageStub.restore();
        jqAjaxStub.restore();
        var oActionsBtn = sap.ui.getCore().byId("actionsBtn");
        if(bExist){
            ok(oActionsBtn.getImage() === sUserImageURI, 'User image not as expected: "' + oActionsBtn.getImage() + '" instead of "' + sUserImageURI +'"');
        }
        else{
            ok(oActionsBtn.getImage() !== sUserImageURI, 'User image not as expected, URI"' + sUserImageURI +'"');
        }
        oRenderer.destroy();
    };

    test("test user image - existing image", function () {
        // Note: use same URL as backend to facilitate testing against ABAP
        _testUserImage("/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/themes/base/img/flower_anim.gif", true)
    });

    test("test user image - non existing image", function () {
        _testUserImage("/non/existing/image", false)
    });

    test("test user image - empty image", function () {
        _testUserImage("", false)
    });

    test("test user image - undefined image", function () {
        _testUserImage(undefined, false)
    });

    test("test getLogonProvider api", function () {
       var shellView = sap.ui.jsview("sap.ushell.renderers.fiori2.Shell");
	   var iframe = shellView.createIFrameDialog();
	   ok(iframe.getAttribute('id') === "SAMLDialogFrame", 'Verify SAML logon iframe ID is samlLogonFrame');
	   ok(iframe.nodeName === "IFRAME", 'Verify SAML logon frame nodeName is an IFRAME');
	   ok(iframe.getAttribute('src') === "", 'Verify SAML logon frame src is empty');
	   //Check function functions well (skipping on DOM checks or CSS classes exitance..)
	   shellView.showIFrameDialog();
	   shellView.destroyIFrameDialog()
	   //Test API create, show and destroy must be exposed for UI5 services:
	   var logonProvider = oController._getLogonFrameProvider();
	   ok(typeof(logonProvider.create === 'function'), "Verify that oController._getLogonFrameProvider().create() exists");
	   ok(typeof(logonProvider.show === 'function'), "Verify that oController._getLogonFrameProvider().show() exists");
	   ok(typeof(logonProvider.destroy === 'function'), "Verify that oController._getLogonFrameProvider().destroy() exists");
	   shellView.destroy();
     });

}());
