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

    module("sap.ushell.renderers.fiori2.Renderer", {
        setup: function () {
            window.location.hash = "";
            //Do not bootstrap here; config must be set before
            //sap.ushell.bootstrap("demo");
            if (window.hasher && window.hasher.getHash()) {
                window.hasher.setHash('');
            }
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
//            window.location.hash = "";
            window["sap-ushell-config"] = {};
            delete sap.ushell.Container;
        }
    });

    function _testAppState(expectedStateName, iHeadItems, bSearch, aExcludedActions, bApp) {
        var oRenderer = sap.ushell.Container.createRenderer("fiori2");

        //Invoke opening of the Action Sheet
        sap.ui.getCore().byId("actionsBtn").firePress();
        var oShell = sap.ui.getCore().byId("shell");
        var stateName = oShell.getModel().getProperty("/currentState").stateName;

        ok( stateName === expectedStateName, 'state: ' + stateName + ", expected state: " + expectedStateName);

        ok( oShell.getHeadItems().length === iHeadItems, 'home button is not displayed on ' + expectedStateName + ' state');
        var searchAvailable = (sap.ui.getCore().byId("sf").getParent() !== null);
        ok( searchAvailable === bSearch, 'sf button is not displayed on ' + expectedStateName + ' state');

        //verify excluded actions
        var aActions = sap.ui.getCore().byId("headActions").getButtons();
        var aActionsIds = [];
        jQuery.each(aActions, function (i, action) {
            aActionsIds.push(action.getId());
        });

        jQuery.each(aExcludedActions, function (i, action) {
            ok(aActionsIds.indexOf(aExcludedActions[i]) === -1, aExcludedActions[i] + ' button is not displayed');
        });
        //ok( aActionsIds.indexOf("loginDetails") === -1, 'loginDetails button is not displayed on standalone state');

        //verify app is opend in case bApp = true
        //as there is no hash fragment the id of the application element is 'application-'
        var app = sap.ui.getCore().byId("application-") || sap.ui.getCore().byId("shellPage-");
        ok(!app === !bApp, 'application found');

        oRenderer.destroy();
    }

    function _getContainerConfiguration() {
        return {
            renderers: {
                fiori2: {
                    componentData: {
                        config: {
                            changeOpacity : "off"
                        }
                    }
                }
            },
            services: {
                NavTargetResolution: {
                    config : {
                        resolveLocal : [ {
                            linkId : "",
                            resolveTo : {
                                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                                applicationType: "URL",
                                url: "/ushell/test-resources/sap/ushell/demoapps/AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2"
                            }

                        }]
                    }
                }
            }
        };
    }

//    test("disable search", function () {
//        window["sap-ushell-config"] = {
//            renderers: {
//                fiori2: {
//                    componentData: {
//                        config: {
//                            enableSearch: false
//                        }
//                    }
//                }
//            }
//        };
//        sap.ushell.bootstrap("demo");
//        var oUserRecentsStub = sinon.stub(sap.ushell.Container.getService("UserRecents"), "addAppUsage");
//
//        var oRenderer = sap.ushell.Container.createRenderer("fiori2");
//        var search = sap.ui.getCore().byId("sf");
//        ok(!search, 'verify search field is hidden');
//        oRenderer.destroy();
//        oUserRecentsStub.restore();
//    });

    test("enable search", function () {
        window["sap-ushell-config"] = {
            renderers: {
                fiori2: {
                    componentData: {
                        config: {
                            search: "display",
                            changeOpacity : "off"
                        }
                    }
                }
            }
        };
        sap.ushell.bootstrap("demo");

        var oRenderer = sap.ushell.Container.createRenderer("fiori2");
        var search = sap.ui.getCore().byId("sf");
        ok(search, 'verify search field is displayed');
        oRenderer.destroy();
    });

    test("Contact Support Button disabled by default", function () {
        sap.ushell.bootstrap("demo");

        var oRenderer = sap.ushell.Container.createRenderer("fiori2");

        //Invoke opening of the Action Sheet
        sap.ui.getCore().byId("actionsBtn").firePress();

        var isVisible = sap.ui.getCore().byId("ContactSupportBtn").getVisible();
        ok(!isVisible, 'verify contact support button is hidden');
        oRenderer.destroy();
    });

    test("Enable Contact Support Button", function () {
        window["sap-ushell-config"] = {
            renderers: {
                fiori2: {
                    componentData: {
                        config: {
                            changeOpacity : "off"
                        }
                    }
                }
            },
            services: {
                SupportTicket: {
                    // service has to be enabled explicitly
                    config: {
                        enabled: true
                    }
                }
            }
        };
        sap.ushell.bootstrap("demo");

        var oRenderer = sap.ushell.Container.createRenderer("fiori2");

        //Invoke opening of the Action Sheet
        sap.ui.getCore().byId("actionsBtn").firePress();

        var isVisible = sap.ui.getCore().byId("ContactSupportBtn").getVisible();
        ok(isVisible, 'verify contact support button is displayed');
        oRenderer.destroy();
    });

    test("Standalone application state", function () {
        var config = _getContainerConfiguration();
        config.renderers.fiori2.componentData.config.appState =  "standalone";
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("demo");

        _testAppState("standalone", 0, false, [], true);
    });

    test("Minimal application state", function () {
        var config = _getContainerConfiguration();
        config.renderers.fiori2.componentData.config.appState =  "minimal";
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("demo");

        _testAppState("minimal", 0, false, [], true);
    });

    test("catalogApp application state", function () {
        var config = _getContainerConfiguration();
        config.renderers.fiori2.componentData.config.appState =  "catalogApp";
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("demo");

        _testAppState("app", 1, true, [], true);
    });

    test("home application state", function () {
        var config = _getContainerConfiguration();
        config.renderers.fiori2.componentData.config.appState =  "home";
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("demo");

        _testAppState("app", 1, true, [], true);
    });

    test("create renderer with url params", function () {
        var config = _getContainerConfiguration();
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("demo");
        var oURIPars = {
            get: function () {
                return "standalone";
            }
        };
        var oGetUriPar = sinon.stub(jQuery.sap, "getUriParameters");
        oGetUriPar.returns(oURIPars);
        var oRenderer = sap.ushell.Container.createRenderer("fiori2");

        var oShell = sap.ui.getCore().byId("shell");
        var stateName = oShell.getModel().getProperty("/currentState").stateName;
        ok(stateName === 'standalone', 'state is standalone');
        oGetUriPar.restore();
        oRenderer.destroy();
    });

    test("create renderer with url params including resolved navigation", function () {
        var config = _getContainerConfiguration();
        config.renderers.fiori2.componentData.config.appState =  "standalone";
        config.services = undefined;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("demo");

        window.hasher.setHash("#xxxx-yyy~navResCtx?additionalInformation=&applicationType=URL&url=http%253A%252F%252Fwalla.co.il");

	    var oRenderer = sap.ushell.Container.createRenderer("fiori2");
        var oShell = sap.ui.getCore().byId("shell");
        var stateName = oShell.getModel().getProperty("/currentState").stateName;
        ok(stateName === 'standalone', 'state is standalone');
        window.hasher.setHash("");
        oRenderer.destroy();
    });
    
    test("Headerless application state & personalization enablement 1", function () {
        var config = _getContainerConfiguration();
        config.renderers.fiori2.componentData.config.appState =  "headerless";
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("demo");

        // first test is to see that personalization is off due to the headerless mode
        var oRenderer = sap.ushell.Container.createRenderer("fiori2");
        
        var oShell = sap.ui.getCore().byId("shell");
        var bEnablePers = oShell.getModel().getProperty("/personalization");
        ok(bEnablePers === false, 'verify personalization is off due to appstate headerless mode');

        oRenderer.destroy();
    });

    test("Headerless application state & personalization enablement 2", function () {
         // second test is to see that personalization is off due to headerless mode (even though configuration indicates that personalization if enabled)
        var config = _getContainerConfiguration();
        config.renderers.fiori2.componentData.config.appState =  "headerless";
        config.renderers.fiori2.componentData.config.enablePersonalization =  true;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("demo");

        var oRenderer = sap.ushell.Container.createRenderer("fiori2");
        
        
        var oShell = sap.ui.getCore().byId("shell");
        var bEnablePers = oShell.getModel().getProperty("/personalization");
        ok(bEnablePers === false, 'verify personalization is off due to appstate headerless mode even when configuration allows personalization');

        oRenderer.destroy();
    });

    test("Headerless application state & personalization enablement 3", function () {
        // third test is to see that personalization is off due to non-headerless mode BUT configuration set personalization off
        var config = _getContainerConfiguration();
        config.renderers.fiori2.componentData.config.appState =  "standalone";
        config.renderers.fiori2.componentData.config.enablePersonalization =  false;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("demo");

        var oRenderer = sap.ushell.Container.createRenderer("fiori2");
        
        
        var oShell = sap.ui.getCore().byId("shell");
        var bEnablePers = oShell.getModel().getProperty("/personalization");
        ok(bEnablePers === false, 'verify personalization is off due to non-headerless mode BUT configuration set personalization off');

        oRenderer.destroy();
    });

    test("Headerless application state & personalization enablement 4", function () {
          // fourth test is to see that personalization is off due to non-headerless mode BUT configuration simply do not have personalization property
        var config = _getContainerConfiguration();
        config.renderers.fiori2.componentData.config.appState =  "standalone";
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("demo");

        var oRenderer = sap.ushell.Container.createRenderer("fiori2");
        
        
        var oShell = sap.ui.getCore().byId("shell");
        var bEnablePers = oShell.getModel().getProperty("/personalization");
        ok(bEnablePers === false, 'verify personalization is off due to non-headerless mode BUT configuration simply do not have personalization property');

        oRenderer.destroy();
    });

    test("Headerless application state & personalization enablement 5", function () {
        // fifth test is to see that personalization is on due to non-headerless mode and configuration enables personalization
        var config = _getContainerConfiguration();
        config.renderers.fiori2.componentData.config.appState =  "standalone";
        config.renderers.fiori2.componentData.config.enablePersonalization =  true;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("demo");

        var oRenderer = sap.ushell.Container.createRenderer("fiori2");
        
        
        var oShell = sap.ui.getCore().byId("shell");
        var bEnablePers = oShell.getModel().getProperty("/personalization");
        ok(bEnablePers === true, 'verify personalization is on due to non-headerless mode and configuration enables personalization');

        oRenderer.destroy();
    });

//    asyncTest("iframe intent", function () {
//        var iframe = document.createElement("iframe");
//        iframe.setAttribute('id', 'flp');
//        document.body.appendChild(iframe);
//        iframe.setAttribute('src', '/ushell/test-resources/sap/ushell/shells/demo/FioriLaunchpad.html?appState=standalone#UI2Fiori2SampleApps-appnavsample');
//        jQuery(iframe).css({visibility: 'hidden', width: 0, height: 0});
//
//        iframe.onload = function () {
//            var iframeWin = iframe.contentWindow;
//            //Invoke opening of the Action Sheet
//            var oShell = iframeWin.sap.ui.getCore().byId("shell");
//            var stateName = oShell.getModel().getProperty("/currentState").stateName;
//
//            jQuery(iframe).remove();
//            ok(stateName === 'standalone', 'state is standalone');
//            start();
//        };
//    });
//
//    asyncTest("iframe resolved", function () {
//        var iframe = document.createElement("iframe");
//        iframe.setAttribute('id', 'flp1');
//        document.body.appendChild(iframe);
//        iframe.setAttribute('src', '/ushell/test-resources/sap/ushell/shells/demo/FioriLaunchpad.html?appState=standalone#xxxx-yyy~navResCtx?additionalInformation=&applicationType=URL&url=http%253A%252F%252Fwalla.co.il');
//        jQuery(iframe).css({visibility: 'hidden', width: 0, height: 0});
//
//        iframe.onload = function () {
//            var iframeWin = iframe.contentWindow;
//            //Invoke opening of the Action Sheet
//            var oShell = iframeWin.sap.ui.getCore().byId("shell");
//            var stateName = oShell.getModel().getProperty("/currentState").stateName;
//
//            jQuery(iframe).remove();
//            ok(stateName === 'standalone', 'state is standalone');
//            start();
//        };
//    });

}());
