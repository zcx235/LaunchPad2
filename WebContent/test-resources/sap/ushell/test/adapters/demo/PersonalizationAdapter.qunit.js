// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for
 *               sap.ushell.adapters.sandbox.PersonalizationAdapter
 */
(function() {
    "use strict";
    /*
     * global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     * notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     * jQuery, sap
     */

    jQuery.sap.require("sap.ushell.adapters.demo.PersonalizationAdapter");

    var CONTAINERPREFIX = "sap.ushell.personalization#";
    var CONTAINER = "PersonalizationAdapter.Test";
    var ITEM = "TestItem";
    var oPersId = {
        container : CONTAINERPREFIX + CONTAINER,
        item : ITEM
    }

    module(
            "sap.ushell.adapters.demo.PersonalizationAdapter",
            {
                setup : function() {
                    var oSystem = {};
                    var oAdapter = new sap.ushell.adapters.demo.PersonalizationAdapter(
                            oSystem);
                    var oPromiseDeleter = {};

                    oPromiseDeleter = oAdapter.delPersData(oPersId);
                    oPromiseDeleter
                            .fail(function() {

                                ok(false,
                                        " 'Error' Personalization data was _not_ deleted");
                            });
                    oAdapter.delPersData(oPersId);
                },
                /**
                 * This method is called after each test. Add every restoration
                 * code here.
                 */
                teardown : function() {
                    this.setup();
                }
            });

    asyncTest("Write + read JSON object", function() {
        var oSystem = {};
        var oAdapter = new sap.ushell.adapters.demo.PersonalizationAdapter(
                oSystem);
        var oOriginalValue = {};
        var oPromiseWriter = {};

        oOriginalValue = {
            value1 : "First value",
            value2 : 2
        };
        oPromiseWriter = oAdapter.writePersData(oPersId, oOriginalValue);
        oPromiseWriter.done(function() {
            var oPromiseReader = {};
            start();
            ok(true, "'Success' Personalization data was written");
            stop();
            oPromiseReader = oAdapter.readPersData(oPersId);
            oPromiseReader.done(function(oReadValue) {
                start();
                ok(true, "'Success' Personalization data was read");
                deepEqual(oReadValue, oOriginalValue,
                        "Read value is the written value");
            });
            oPromiseReader.fail(function() {
                start();
                ok(false, "'Error' fail function of reader was triggered");
            });
        });
        oPromiseWriter.fail(function() {
            start();
            ok(false, "'Error' fail function of writer was triggered");
        });
    });

    asyncTest("Write + read difficult JSON object", function() {
        
        var oPersIdDifficult = {
                container : "hasOwnProperty",
                item : "hasOwnProperty"
            }
        var oSystem = {};
        var oAdapter = new sap.ushell.adapters.demo.PersonalizationAdapter(
                oSystem);
        var oOriginalValue = {};
        var oPromiseWriter = {};

        oOriginalValue = {
            hasOwnProperty : "First value",
            keys : "1234",
            value2 : 2
        };
        oPromiseWriter = oAdapter.writePersData(oPersIdDifficult, oOriginalValue);
        oPromiseWriter.done(function() {
            var oPromiseReader = {};
            start();
            ok(true, "'Success' Personalization data was written");
            stop();
            oPromiseReader = oAdapter.readPersData(oPersIdDifficult);
            oPromiseReader.done(function(oReadValue) {
                start();
                ok(true, "'Success' Personalization data was read");
                deepEqual(oReadValue, oOriginalValue,
                        "Read value is the written value");
            });
            oPromiseReader.fail(function() {
                start();
                ok(false, "'Error' fail function of reader was triggered");
            });
        });
        oPromiseWriter.fail(function() {
            start();
            ok(false, "'Error' fail function of writer was triggered");
        });
    });
    
    
   asyncTest("read preconfigured JSON object", function() {
        
        var oPersIdPreconfig = {
                container : "sap.ushell.personalization#sap.ushell.services.UserRecents",
                item : "ITEM#RecentApps"
            }
        var oSystem = {};
        var oAdapter = new sap.ushell.adapters.demo.PersonalizationAdapter(
                oSystem);
        var oOriginalValue = {};
        var oPromiseReader = {};

        oOriginalValue = [
                       {"iCount": 1, "iTimestamp": 1378479383874, "oItem": {"semanticObject": "UI2Fiori2SampleApps", "action": "approvepurchaseorders", "sTargetHash": "#UI2Fiori2SampleApps-approvepurchaseorders", "title" : "Approve Purchase", "url" : "#UI2Fiori2SampleApps-approvepurchaseorders"}},
                       {"iCount": 2, "iTimestamp": 1378479383895, "oItem": {"semanticObject": "Action", "action": "toappnavsample", "sTargetHash": "#Action-toappnavsample", "title" : "Approve Nav Sample 3", "url" : "#Action-toappnavsample"}},
                       {"iCount": 2, "iTimestamp": 1378479383896, "oItem": {"semanticObject": "Action", "action": "toappnavsample2", "sTargetHash": "#Action-toappnavsample2", "title" : "Approve Nav Sample 2", "url" : "#Action-toappnavsample2"}},
                       {"iCount": 1, "iTimestamp": 1378479383899, "oItem": {"semanticObject": "UI2Fiori2SampleApps", "action": "MyLeaveRequest", "sTargetHash": "#UI2Fiori2SampleApps-MyLeaveRequest", "title" : "My Leave Request", "url" : "#UI2Fiori2SampleApps-MyLeaveRequest"}},
                       {"iCount": 2, "iTimestamp": 1378479383878, "oItem": {"semanticObject": "Action", "action": "toappnavsample", "sTargetHash": "#Action-toappnavsample", "title" : "Approve Nav Sample 8", "url" : "#Action-toappnavsample"}},
                       {"iCount": 2, "iTimestamp": 1378479383897, "oItem": {"semanticObject": "Action", "action": "toappnavsample2", "sTargetHash": "#Action-toappnavsample2", "title" : "Approve Nav Sample 1", "url" : "#Action-toappnavsample2"}},
                       {"iCount": 1, "iTimestamp": 1378479383898, "oItem": {"semanticObject": "UI2Fiori2SampleApps", "action": "approvepurchaseorders", "sTargetHash": "#UI2Fiori2SampleApps-approvepurchaseorders", "title" : "Approve first Purchase", "url" : "#UI2Fiori2SampleApps-approvepurchaseorders"}},
                       {"iCount": 2, "iTimestamp": 1378479383863, "oItem": {"semanticObject": "Action", "action": "toappnavsample", "sTargetHash": "#Action-toappnavsample", "title" : "Approve Nav Sample 13", "url" : "#Action-toappnavsample"}},
                       {"iCount": 2, "iTimestamp": 1378479383862, "oItem": {"semanticObject": "Action", "action": "toappnavsample2", "sTargetHash": "#Action-toappnavsample2", "title" : "Approve Nav Sample 12", "url" : "#Action-toappnavsample2"}},
                       {"iCount": 1, "iTimestamp": 1378479383879, "oItem": {"semanticObject": "UI2Fiori2SampleApps", "action": "approvepurchaseorders", "sTargetHash": "#UI2Fiori2SampleApps-approvepurchaseorders", "title" : "Approve Purchase", "url" : "#UI2Fiori2SampleApps-approvepurchaseorders"}},
                       {"iCount": 2, "iTimestamp": 1378479383894, "oItem": {"semanticObject": "Action", "action": "toappnavsample", "sTargetHash": "#Action-toappnavsample", "title" : "Approve Nav Sample 4", "url" : "#UI2Fiori2SampleApps-appnavsample"}},
                       {"iCount": 2, "iTimestamp": 1378479383893, "oItem": {"semanticObject": "Action", "action": "toappnavsample2", "sTargetHash": "#Action-toappnavsample2", "title" : "Approve Nav Sample 5", "url" : "#UI2Fiori2SampleApps-appnavsample2"}}
                   ];
        oPromiseReader = oAdapter.readPersData(oPersIdPreconfig);
        oPromiseReader.done(function(oReadValue) {
            start();
            ok(true, "'Success' Personalization data was read");
            deepEqual(oReadValue, oOriginalValue,
                    "Read value is the initialized");
          //  stop();
        });
        oPromiseReader.fail(function() {
            start();
            ok(false, "'Error' fail function of writer was triggered");
        });
    });
    
    
    
    
    asyncTest("delete Item", function() {
        var oSystem = {};
        var oAdapter = new sap.ushell.adapters.demo.PersonalizationAdapter(
                oSystem);
        var oOriginalValue = {};
        var oPromiseWriter = {};
        var oPromiseDeleter = {};

        oOriginalValue = {
            value1 : "First value",
            value2 : 2
        };
        oPromiseWriter = oAdapter.writePersData(oPersId, oOriginalValue);
        oPromiseWriter.done(function() {
            start();
        });
        oPromiseWriter.fail(function() {
            start();
            ok(false, "'Error' Write error in deletion test");
        });
        stop();
        oPromiseDeleter = oAdapter.delPersData(oPersId);
        oPromiseDeleter.done(function() {
            start();
            ok(true, "Personalization data was deleted");
        });
        oPromiseDeleter.fail(function() {
            start();
            ok(fail, "'Error' Personalization data was not deleted");
        });
    });

    asyncTest("non-existant item", function() {
        var sNON_EXISTANT = "NoNeXiStAnT_ItEm";
        var oPersIdNonExistant = {
            container : CONTAINERPREFIX + CONTAINER,
            item : sNON_EXISTANT
        }

        var oSystem = {};
        var oAdapter = new sap.ushell.adapters.demo.PersonalizationAdapter(
                oSystem);
        var oPromiseReader = {};
        var oPromiseDeleter = {};

        oPromiseReader = oAdapter.readPersData(oPersIdNonExistant);
        oPromiseReader.done(function(oValue) {
            start();
            equal(oValue, null, "Null is returend for a non-existing item");
        });
        oPromiseReader.fail(function() {
            start();
            ok(fail, "'Error' Personalization data could not be read");
        });
    });
    
    
    asyncTest("Container handling, delete Container", function() {
        var oSystem = {};
        var oAdapter = new sap.ushell.adapters.demo.PersonalizationAdapter(
                oSystem);
        var oPromiseLoad = {};
        var oContainer = oAdapter.getAdapterContainer("myContainer");
        oPromiseLoad = oContainer.load(); 
        oPromiseLoad.done(function() {
            start();
            oContainer.delItem("Item");
            oContainer.delItem("Item2")
            equal(undefined,oContainer.getItemValue("Item"),"Value is Undefined"); 
            equal(false,oContainer.containsItem("Item"),"contained"); 
            equal(-1,oContainer.getItemKeys().indexOf("Item")," key not found");

            // set Item 
            oContainer.setItemValue("Item","ItemValue"); 
            equal("ItemValue",oContainer.getItemValue("Item"), "Item is ok"); 
            equal(true,oContainer.containsItem("Item"),"Undefined");
            equal(0,oContainer.getItemKeys().indexOf("Item")," key found");

            
            //delete item 
            oContainer.delItem("Item"); 
            
            equal(undefined,oContainer.getItemValue("Item"),"Value is Undefined"); 
            equal(false,oContainer.containsItem("Item"),"contained"); 
            equal(-1,oContainer.getItemKeys().indexOf("Item")," key not found");
            
            // set again 
            oContainer.setItemValue("Item","ItemValue"); 
            equal("ItemValue",oContainer.getItemValue("Item"), "Item is ok"); 
            equal(true,oContainer.containsItem("Item"),"Undefined");
            equal(0,oContainer.getItemKeys().indexOf("Item")," key found");

            oContainer.setItemValue("Item2","ItemValue"); 
            stop(); 
            var oAsync = oAdapter.delAdapterContainer("myContainer");
            oAsync.done(function() { start();
                ok(true);
            })
            oAsync.fail(function() { start();
                ok(false); 
            });
            
            // everything gone! 
            equal(undefined,oContainer.getItemValue("Item"),"Value is Undefined"); 
            equal(false,oContainer.containsItem("Item"),"contained"); 
            equal(-1,oContainer.getItemKeys().indexOf("Item")," key not found");

        });
        oPromiseLoad.fail(function() {
            start();
            ok(false, "'Error' Write error in deletion test");
        });
    });

}());
