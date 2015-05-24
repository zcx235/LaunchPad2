// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.URLParsing
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap*/

	jQuery.sap.require("sap.ushell.services.UserRecents");

    module("sap.ushell.services.UserRecents", {
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


    test("getServiceUserRecents", function () {

        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");
        ok(oUserRecentsService !== undefined);
        deepEqual(typeof oUserRecentsService, "object");
    });


    test("getRecentsApps", function () {

        var oUserRecentsService = sap.ushell.Container.getService("UserRecents")
        ok(oUserRecentsService !== undefined);

        oUserRecentsService.getRecentApps().done(function (aRecentApps) {
            ok(aRecentApps !== undefined, "Recent Apps return" );

            //validate amount of apps equal Max limit = 6
            deepEqual(aRecentApps.length,6, "Amount of Recent app equal max limit = 6");                      
            
            //validate RecentApps is ordered by time stamp
            deepEqual(aRecentApps[0].title, "My Leave Request", "RecentApps is ordered by time stamp correctly");
        });
    });
        

    test("getRecentSearches", function () {

        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");
        ok(oUserRecentsService !== undefined);

        oUserRecentsService.getRecentSearches().done(function (aRecentSeraches) {
            ok(aRecentSeraches !== undefined, "Recent Apps return" );

            //validate amount of apps equal Max limit = 6
            deepEqual(aRecentSeraches.length,10, "Amount of Recent searches equal max limit = 10");                      
            
            //validate RecentSeraches is ordered by time stamp
            deepEqual(aRecentSeraches[0].sTerm, "Sally", "RecentSeraches is ordered by time stamp correctly");
        });
    });

    // ====================== User Apps Usage ====================

    test("appsUsageEnable", function () {
        _testAppUsageFlow(true);
    });

    test("appsUsageDisable", function () {
        _testAppUsageFlow(false);
    });

    function _testAppUsageFlow(bActive) {
        var changeOpacityFlag = bActive ? "on" : "off",
            config = {
                renderers: {
                    fiori2: {
                        componentData: {
                            config: {
                                changeOpacity : changeOpacityFlag
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
                            } ]
                        }
                    }
                }
            };

        delete sap.ushell.Container;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("demo");

        var clock = sinon.useFakeTimers("setTimeout"),
            oUserRecentsService = sap.ushell.Container.getService("UserRecents")
        ok(oUserRecentsService !== undefined);
        var stub = sinon.stub(oUserRecentsService, "addAppUsage"),
            oRenderer = sap.ushell.Container.createRenderer("fiori2"),
            callCount = bActive ? 1 : 0;
        
        clock.tick(1000);
        
        ok(stub.callCount === callCount);
        
        clock.restore();
        stub.restore();
        oRenderer.destroy();
    }
    
    
    test("getAppsUsage", function () {

        var oUserRecentsService = sap.ushell.Container.getService("UserRecents")
        ok(oUserRecentsService !== undefined);

        oUserRecentsService.getAppsUsage().done(function (aUserAppsUsage) {
            ok(aUserAppsUsage !== undefined, "User Apps Usage return" );
        });
    });
    
    test("MultiAppUsageSameDay", function () {
    	
        var oUserRecentsService = sap.ushell.Container.getService("UserRecents"); 
        
        var hash1 = "app_1";    
        oUserRecentsService.addAppUsage(hash1);
        oUserRecentsService.addAppUsage(hash1);
        oUserRecentsService.addAppUsage(hash1);

        var hash2 = "app_2";
        oUserRecentsService.addAppUsage(hash2);

        var hash3 = "app_3";
        oUserRecentsService.addAppUsage(hash3);
        oUserRecentsService.addAppUsage(hash3);
        oUserRecentsService.addAppUsage(hash3);
        oUserRecentsService.addAppUsage(hash3);
        oUserRecentsService.addAppUsage(hash3);
        
        var numberOfApps = 3;
                
        oUserRecentsService.getAppsUsage().done(function (aUserAppsUsage) {
            ok(aUserAppsUsage !== undefined, "User Apps Usage return" );

            ok(aUserAppsUsage.usageMap.app_1 === 3, "app_1 usage = 3");
            ok(aUserAppsUsage.usageMap.app_2 === 1, "app_2 usage = 1");
            ok(aUserAppsUsage.usageMap.app_3 === 5, "app_3 usage = 5");
            
            //validate min & max values (min = 1, max = 5)
            deepEqual(aUserAppsUsage.minUsage, 1, "Min value of User Apps Usage = 1"); 
            ok(aUserAppsUsage.maxUsage >= 5, "Max value of User Apps Usage = 5");
        });        
    });
    
    test("AppUsageDifferentDays", function () {
        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");

        var hash4 = "app_4";
        var hash5 = "app_5";

        var clock = sinon.useFakeTimers(new Date(2014, 4, 1, 8, 0, 0).getTime());
        oUserRecentsService.addAppUsage(hash4);
        oUserRecentsService.addAppUsage(hash5);
        oUserRecentsService.addAppUsage(hash5);
        clock.restore();

        clock = sinon.useFakeTimers(new Date(2014, 4, 2, 8, 0, 0).getTime());
        oUserRecentsService.addAppUsage(hash4);
        oUserRecentsService.addAppUsage(hash4);
        clock.restore();

        clock = sinon.useFakeTimers(new Date(2014, 4, 3, 8, 0, 0).getTime());
        oUserRecentsService.addAppUsage(hash4);
        clock.restore();

        clock = sinon.useFakeTimers(new Date(2014, 4, 4, 8, 0, 0).getTime());
        oUserRecentsService.addAppUsage(hash4);
        oUserRecentsService.addAppUsage(hash4);
        oUserRecentsService.addAppUsage(hash5);
        clock.restore();

        oUserRecentsService.getAppsUsage().done(function (aUserAppsUsage) {
            ok(aUserAppsUsage !== undefined, "User Apps Usage return" );

            //validate amount of app_4 = 6
            deepEqual(aUserAppsUsage.usageMap[hash4], 6, "Amount of User Apps Usage = 6");
            //validate amount of app_5 = 3
            deepEqual(aUserAppsUsage.usageMap[hash5], 3, "Amount of User Apps Usage = 3");
        });
    });
    
    test("InvalidAppUsageHash", function () {
   	
        var oUserRecentsService = sap.ushell.Container.getService("UserRecents"); 
        
        oUserRecentsService.getAppsUsage().done(function (aUserAppsUsage) {
            ok(aUserAppsUsage !== undefined, "User Apps Usage return" );
            
        	var currentAppsCount = Object.keys(aUserAppsUsage.usageMap).length;

            var hash = null;    
            oUserRecentsService.addAppUsage(hash);
            hash = '';    
            oUserRecentsService.addAppUsage(hash);
            hash = ' ';    
            oUserRecentsService.addAppUsage(hash);
            hash = undefined;    
            oUserRecentsService.addAppUsage(hash);
            hash = {a:"1", b:"2", c:"3"}; //object    
            oUserRecentsService.addAppUsage(hash);
            hash = new function(){};    
            oUserRecentsService.addAppUsage(hash);
            hash = 1;   //digit 
            oUserRecentsService.addAppUsage(hash);
            hash = true;    // boolean
            oUserRecentsService.addAppUsage(hash);
            
            oUserRecentsService.getAppsUsage().done(function (aUserAppsUsage) {
            	//validate amount of apps  = same as before additions
            	deepEqual(Object.keys(aUserAppsUsage.usageMap).length, currentAppsCount, "Amount of User Apps Usage Didn't change"); 
            });  
        });        
    });
	
//	Remarked as it is not stable and need to be invesitgated
//
//	test("SaveDataForMoreThanMaxDaysLimit", function () {
//
//        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");
//
//        var hash = "app_6";
//        var daysLimit = 30;
//        var clock;
//
//        for (var i = 1; i <= daysLimit + 1; i++)
//    	{
//	        clock = sinon.useFakeTimers(new Date(2014, 4, i, 8, 0, 0).getTime());// 01/05/2014 8:00 - 31/05/2014 8:00
//	        
//	        oUserRecentsService.addAppUsage(hash);
//    	}
//               
//        oUserRecentsService.getAppsUsage().done(function (aUserAppsUsage) {
//        	clock.restore();
//            ok(aUserAppsUsage !== undefined, "User Apps Usage return" );
//
//            //validate amount of app_6 = 30
//            deepEqual(aUserAppsUsage.usageMap[hash], 30, "Amount of User Apps Usage = 30"); 
//        });  
//    });    
    
}());
