(function () {
    "use strict";
    /*global sap,jQuery */

    jQuery.sap.declare("sap.ushell.shells.demo.fioriDemoConfig");

    sap.ushell.shells.demo.fioriDemoConfig = {
        //Define groups for the dashboard
        groups: [
		            {
		            	id: "group_1",
		                title: "Employee Self Service",
		                isPreset: true,
		                isVisible: true,
		                tiles: [
								{
								    id: "tile_10",
								    title: "Time Sheet",
								    size: "1x1",
								    tileType: "sap.ushell.ui.tile.StaticTile",
								    properties: {
								        chipId: "catalogTile_38",
								        title: "Time Sheet",
//								        subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
								        infoState: "Neutral",
//								        info: "0 days running without bugs",
								        icon: "sap-icon://time-entry-request",
								        targetURL: "#Action-Timesheet"
								    }
								},
								{
								    id: "tile_11",
								    title: "Fiori Default App",
								    size: "1x1",
								    tileType: "sap.ushell.ui.tile.StaticTile",
								    properties: {
								        chipId: "catalogTile_39",
								        title: "Fiori Default App",
//								        subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
								        infoState: "Neutral",
//								        info: "0 days running without bugs",
								        icon: "sap-icon://world",
								        targetURL: "#Action-Default"
								    }
								},
								{
								    id: "tile_12",
								    title: "ZTEST",
								    size: "1x1",
								    tileType: "sap.ushell.ui.tile.StaticTile",
								    properties: {
								        chipId: "catalogTile_40",
								        title: "ZTEST",
//								        subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
								        infoState: "Neutral",
//								        info: "0 days running without bugs",
								        icon: "sap-icon://world",
								        targetURL: "#Action-ZTEST"
								    }
								},
								{
								    id: "tile_13",
								    title: "Z_DEEP2",
								    size: "1x1",
								    tileType: "sap.ushell.ui.tile.StaticTile",
								    properties: {
								        chipId: "catalogTile_41",
								        title: "Z_DEEP2",
//								        subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
								        infoState: "Neutral",
//								        info: "0 days running without bugs",
								        icon: "sap-icon://world",
								        targetURL: "#Action-ZDEEP"
								    }
								}

							   ]
		            }
            	],
            	catalogs: [
            	            {
            	                id: "catalog_0",
            	                title: "Cash Management",
            	                tiles: [
            	                    {
            	                        chipId: "catalogTile_38",
            	                        title: "Time Sheet",
            	                        size: "1x1",
            	                        tileType: "sap.ushell.ui.tile.DynamicTile",
            	                        properties: {
            	                            title: "I am a short title!",
//            	                            subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
            	                            infoState: "Neutral",
//            	                            info: "0 days running without bugs",
            	                            icon: "sap-icon://time-entry-request",
            	                            targetURL: "#Action-Timesheet"
            	                        }
            	                    },
            	                    {
            	                        chipId: "catalogTile_39",
            	                        title: "Fiori Default App",
            	                        size: "1x1",
            	                        tileType: "sap.ushell.ui.tile.DynamicTile",
            	                        properties: {
            	                            title: "I am a short title!",
//            	                            subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
            	                            infoState: "Neutral",
//            	                            info: "0 days running without bugs",
            	                            icon: "sap-icon://world",
            	                            targetURL: "#Action-Default"
            	                        }
            	                    },
            	                    {
            	                        chipId: "catalogTile_40",
            	                        title: "ZTEST",
            	                        size: "1x1",
            	                        tileType: "sap.ushell.ui.tile.DynamicTile",
            	                        properties: {
            	                            title: "I am a short title!",
//            	                            subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
            	                            infoState: "Neutral",
//            	                            info: "0 days running without bugs",
            	                            icon: "sap-icon://world",
            	                            targetURL: "#Action-ZTEST"
            	                        }
            	                    },
            	                    {
            	                        chipId: "catalogTile_41",
            	                        title: "Z_DEEP2",
            	                        size: "1x1",
            	                        tileType: "sap.ushell.ui.tile.DynamicTile",
            	                        properties: {
            	                            title: "I am a short title!",
//            	                            subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
            	                            infoState: "Neutral",
//            	                            info: "0 days running without bugs",
            	                            icon: "sap-icon://world",
            	                            targetURL: "#Action-ZDEEP"
            	                        }
            	                    }
            	                ]
            	            }
            	            ],
        applications: {
        	"" : { //default application - empty URL hash
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                applicationType: "URL",
                url: "/ushell/test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp"
            },
            
        	"Action-Timesheet" : { //default application as explicit navigation target
                additionalInformation: "SAPUI5.Component=sap.ui.ZTime_Entry",
                applicationType: "URL",
                url: "../../../../../ZTime_Entry",
                description : "Default App : show statically registered apps (fioriSandboxConfig.js) "
            },
            
            "Action-Default" : { //default application as explicit navigation target
                additionalInformation: "SAPUI5.Component=FioriSandboxDefaultApp",
                applicationType: "URL",
                url: "../../../../../FioriSandboxDefaultApp",
                description : "Default App : show statically registered apps (fioriSandboxConfig.js) "
            },
            "Action-ZTEST" : { //default application as explicit navigation target
                additionalInformation: "SAPUI5.Component=ZTEST",
                applicationType: "URL",
                url: "../../../../../ZTEST",
                description : "Default App : show statically registered apps (fioriSandboxConfig.js) "
            },
            "Action-ZDEEP" : { //default application as explicit navigation target
                additionalInformation: "SAPUI5.Component=sap.ui.Z_DEEP2",
                applicationType: "URL",
                url: "../../../../../Z_DEEP2",
                description : "Default App : show statically registered apps (fioriSandboxConfig.js) "
            },
        }
    }
}());

// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview This file contains a sample Fiori sandbox application configuration.
 */
//
//(function () {
//    "use strict";
//    /*global sap,jQuery */
//
//    jQuery.sap.declare("sap.ushell.shells.demo.fioriDemoConfig");
//
//    sap.ushell.shells.demo.fioriDemoConfig = {
//        //Define groups for the dashboard
//        groups: [
//            {
//                id: "group_0",
//                title: "KPIs",
//                isPreset: true,
//                isVisible: true,
//                tiles: [
//                    {
//                        id : "tile_00",
//                        title : "Sales Performance",
//                        size : "1x1",
//                        tileType : "sap.ushell.ui.tile.DynamicTile",
//                        properties : {
//                        	chipId: "catalogTile_33",
//                            title : "Sales Performance",
//                            numberValue : 3.75,
//                            info : 'Change to Last Month in %',
//                            numberFactor : '%',
//                            numberDigits : 2,
//                            numberState : "Positive",
//                            stateArrow : "Up",
//                            icon: "sap-icon://Fiori2/F0002",
//                            targetURL: "#Action-toappnavsample",
//                            // uncomment to enable odata requests for the tile
//                            //serviceUrl: "/ushell/test-resources/sap/ushell/shells/demo/dynamicTileODataDemoService.js",
//                            serviceRefreshInterval: 10,
//                            keywords: ["sales", "performance"],
//                            formFactor: "Desktop,Tablet,Phone"
//                        }
//                    },
//                    {
//                        id: "tile_101",
//                        title: "WEB GUI",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//    						chipId: "catalogTile_34",
//                            title: "WEB GUI",
//                            subtitle: "Opens WEB GUI",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://world",
//                            targetURL: "#Action-WEBGUI",
//                            formFactor: "Tablet,Phone"
//                        }
//                    },
//                    {
//                        id: "tile_01",
//                        title: "US Profit Margin is at",
//                        size: "1x1",
//                        tileType : "sap.ushell.ui.tile.DynamicTile",
//                        properties : {
//                            chipId: "catalogTile_35",
//                            title: "US Profit Margin is at",
//                            numberValue : 21.599,
//                            info : '',
//                            infoState: "Positive",
//                            numberFactor: '%',
//                            numberUnit : 'Relative Improvement',
//                            numberDigits : 1,
//                            numberState : "Positive",
//                            stateArrow : "Up",
//                            targetURL: "#Action-toappnavsample",
//                            keywords: ["profit", "profit margin", "sales"],
//                            formFactor: "Desktop"
//                        }
//                    },
//                    {
//                        id: "tile_02",
//                        title: "Gross Revenue under Target at",
//                        size: "1x1",
//                        tileType : "sap.ushell.ui.tile.DynamicTile",
//                        properties : {
//                            chipId: "catalogTile_36",
//                            title: "Gross Revenue under Target at",
//                            numberValue : 347.765,
//                            info : 'Absolute Deviation',
//                            infoState: "Negative",
//                            numberFactor: "M",
//                            numberUnit : 'EUR',
//                            numberDigits : 0,
//                            numberState : "Negative",
//                            stateArrow : "Down",
//                            targetURL: "#Action-approvepurchaseorders",
//                            //targetURL: "#Action-approvepurchaseorders?responderOn=true",
//                            //targetURL: "/ushell/test-resources/sap/ushell/shells/sandbox/FioriSandbox.html#Action-approvepurchaseorders",
//                            //targetURL: "http://localhost:8080/ushell/test-resources/sap/ushell/demoapps/ApprovePurchaseOrders/index.html",
//                            keywords: ["profit", "revenue", "target"],
//                            formFactor: "Phone"
//                        }
//                    },
//                    {
//                        id: "tile_03",
//                        title: "Net Order Value is at",
//                        size: "1x1",
//                        tileType : "sap.ushell.ui.tile.DynamicTile",
//                        properties : {
//                            chipId: "catalogTile_37",
//                            title: "Net Order Value is at",
//                            numberValue : 85.851,
//                            info : 'Absolute Deviation',
//                            numberFactor: "M",
//                            numberUnit : 'EUR',
//                            numberDigits : 2,
//                            numberState : "Negative",
//                            stateArrow : "Up",
//                            targetURL: "#UI2Fiori2SampleApps-AppScflTest",
//                            keywords: ["profit", "order", "sales"],
//                            formFactor: "Desktop,Tablet,Phone"
//                        }
//                    },
//                    {
//                        id: "tile_04",
//                        title: "I am a short title!",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.StaticTile",
//                        properties: {
//                            chipId: "catalogTile_38",
//                            title: "I am a short title!",
//                            subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
//                            infoState: "Neutral",
//                            info: "0 days running without bugs",
//                            icon: "sap-icon://flight",
//                            targetURL: "#Action-todefaultapp",
//                            formFactor: "Desktop,Tablet"
//                        }
//                    }
//                ]
//            },
//            {
//                id: "group_2",
//                title: "TestEmpty",
//                isPreset: false,
//                isVisible: true,
//                tiles: []
//            },
//            {
//                id: "group_3",
//                title: "TestGroup1",
//                isPreset: false,
//                isVisible: true,
//                tiles: [
//                    {
//                        id: "tile_10",
//                        title: "I am a short title!",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.StaticTile",
//                        properties: {
//                            chipId: "catalogTile_38",
//                            title: "I am a short title!",
//                            subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
//                            infoState: "Neutral",
//                            info: "0 days running without bugs",
//                            icon: "sap-icon://flight",
//                            targetURL: "#Action-todefaultapp",
//                            formFactor: "Desktop,Tablet"
//                        }
//                    },
//                    {
//                        id: "tile_11",
//                        title: "My Leave Request",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//    						chipId : "catalogTile_40",
//                            title: "My Leave Request",
//                            subtitle: "Opens Fiori 1 App",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://world",
//                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
//                        }
//                    },
//                    {
//                        id: "tile_12",
//                        title: "Financial Close Tasks",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.ImageTile",
//                        properties: {
//                            chipId : "catalogTile_10",
//                            title: "Financial Close Tasks",
//                            subtitle: "Tasks Overview",
//                            imageSource: "img/Incoming_Customer_Complaints_wNumbers.png",
//                            info: "currently inactive",
//                            infoState: "Critical",
//                            targetURL: "http://www.heise.de",
//                            formFactor: "Tablet"
//                        }
//                    },
//                    {
//                        id: "tile_13",
//                        title: "My Leave Request",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//    						chipId : "catalogTile_40",
//                            title: "My Leave Request",
//                            subtitle: "Opens Fiori 1 App",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://world",
//                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
//                        }
//                    },
//                    {
//                        id: "tile_14",
//                        title: "My Leave Request",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//    						chipId : "catalogTile_40",
//                            title: "My Leave Request",
//                            subtitle: "Opens Fiori 1 App",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://world",
//                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
//                        }
//                    },
//                    {
//                        id: "tile_15",
//                        title: "Wikipedia",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//                            chipId : "catalogTile_39",
//                            title: "Wikipedia",
//                            subtitle: "Opens Wikipedia",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://world",
//                            targetURL: "#UI2Fiori2SampleApps-wikipedia",
//                            formFactor: "Tablet"
//                        }
//                    },
//                    {
//                        id: "tile_16",
//                        title: "My Leave Request",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//                            chipId : "catalogTile_40",
//                            title: "My Leave Request",
//                            subtitle: "Opens Fiori 1 App",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://world",
//                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest",
//                            formFactor: "Tablet"
//                        }
//                    }
//                ]
//            },
//            {
//                id: "group_4",
//                title: "TestGroup2",
//                isPreset: false,
//                isVisible: true,
//                tiles: [
//                    {
//                        id: "tile_10",
//                        title: "I am a short title!",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.StaticTile",
//                        properties: {
//                            chipId: "catalogTile_38",
//                            title: "I am a short title!",
//                            subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
//                            infoState: "Neutral",
//                            info: "0 days running without bugs",
//                            icon: "sap-icon://flight",
//                            targetURL: "#Action-todefaultapp",
//                            formFactor: "Desktop,Tablet"
//                        }
//                    },
//                    {
//                        id: "tile_12",
//                        title: "Financial Close Tasks",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.ImageTile",
//                        properties: {
//                            chipId : "catalogTile_10",
//                            title: "Financial Close Tasks",
//                            subtitle: "Tasks Overview",
//                            imageSource: "img/Incoming_Customer_Complaints_wNumbers.png",
//                            info: "currently inactive",
//                            infoState: "Critical",
//                            targetURL: "http://www.heise.de",
//                            formFactor: "Tablet,Desktop"
//                        }
//                    },
//                    {
//                        id: "tile_16",
//                        title: "My Leave Request",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//                            chipId : "catalogTile_40",
//                            title: "My Leave Request",
//                            subtitle: "Opens Fiori 1 App",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://world",
//                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest",
//                            formFactor: "Tablet,Desktop"
//                        }
//                    }
//                ]
//            },
//            {
//                id: "group_1",
//                title: "Employee Self Service",
//                isPreset: true,
//                isVisible: true,
//                tiles: [
//                    {
//                        id: "tile_10",
//                        title: "I am a short title!",
//                        size: "2x1",
//                        tileType: "sap.ushell.ui.tile.StaticTile",
//                        properties: {
//                            chipId: "catalogTile_38",
//                            title: "I am a short title!",
//                            subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
//                            infoState: "Neutral",
//                            info: "0 days running without bugs",
//                            icon: "sap-icon://flight",
//                            targetURL: "#Action-todefaultapp"
//                        }
//                    },
//                    {
//                        id: "tile_11",
//                        title: "Just another long long long long long title",
//                        size: "2x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties : {
//                            chipId : "catalogTile_41",
//                            title: "Just another long long long long long title",
//                            subtitle: "This shows a DynamicTile",
//                            numberValue: 20,
//                            numberState: "Positive",
//                            numberUnit: "days",
//                            stateArrow: "Down",
//                            infoState: "Positive",
//                            info: "running without any crashes",
//                            icon: "sap-icon://flight",
//                            targetURL: "#Action-todefaultapp",
//                            // uncomment to enable odata requests for the tile
//                            //serviceUrl: "/ushell/test-resources/sap/ushell/shells/demo/dynamicTileODataDemoService.js",
//                            serviceRefreshInterval: 0
//                        }
//                    },
//                    {
//                        id: "tile_12",
//                        title: "Financial Close Tasks",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.ImageTile",
//                        properties: {
//    						chipId : "catalogTile_10",
//                            title: "Financial Close Tasks",
//                            subtitle: "Tasks Overview",
//                            imageSource: "img/Incoming_Customer_Complaints_wNumbers.png",
//                            info: "currently inactive",
//                            infoState: "Critical",
//                            targetURL: "http://www.heise.de"
//                        }
//                    },
//                    {
//                        id: "tile_13",
//                        title: "User maintenance",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//                            chipId : "catalogTile_42",
//                            title: "User maintenance",
//                            subtitle: "Opens WebGUI",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://employee",
//                            targetURL: "#UI2Fiori2SampleApps-webdynpro"
//                        }
//                    },
//                    {
//                        id: "tile_14",
//                        title: "I am a tile!",
//                        size: "1x2",
//                        properties: {
//                            chipId : "catalogTile_60",
//                        }
//                    },
//                    {
//                        id: "tile_15",
//                        title: "Source Control",
//                        size: "2x2",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//                            chipId : "catalogTile_43",
//                            title: "Source Control",
//                            subtitle: "Opens Gerrit ",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://world",
//                            targetURL: "#UI2Fiori2SampleApps-Gerrit"
//                        }
//                    },
//                    {
//                        id: "tile_16",
//                        title: "My Leave Request",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//    						chipId : "catalogTile_40",
//                            title: "My Leave Request",
//                            subtitle: "Opens Fiori 1 App",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://world",
//                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
//                        }
//                    },
//                    {
//                        id: "tile_17",
//                        title: "My Leave Request",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//    						chipId : "catalogTile_40",
//                            title: "My Leave Request",
//                            subtitle: "Opens Fiori 1 App",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://world",
//                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
//                        }
//                    },
//                    {
//                        id: "tile_18",
//                        title: "XSS Example",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//                            chipId : "catalogTile_44",
//                            title: "<script>alert('Hi');</script>XSS",
//                            subtitle: "Opens Fiori 1 App<script>alert('Hi');</script>",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://<script>alert('Hi');</script>",
//                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
//                        }
//                    },
//                    {
//                        id: "tile_19",
//                        title: "My Leave Request",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//    						chipId : "catalogTile_40",
//                            title: "My Leave Request",
//                            subtitle: "Opens Fiori 1 App",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://world",
//                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
//                        }
//                    },
//                    {
//                        id: "tile_20",
//                        title: "Just_another_long_long_long_long_long_title",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties : {
//                            chipId : "catalogTile_41",
//                            title: "Just_another_long_long_long_long_long_title",
//                            subtitle: "This shows a DynamicTile with very long name",
//                            numberValue: 20,
//                            numberState: "Positive",
//                            numberUnit: "days",
//                            stateArrow: "Down",
//                            infoState: "Positive",
//                            info: "running without any crashes",
//                            icon: "sap-icon://flight",
//                            targetURL: "#Action-todefaultapp"
//                        }
//                    },
//                    {
//                        id : "tile_21",
//                        title : "Sales Performance",
//                        size : "1x1",
//                        tileType : "sap.ushell.ui.tile.DynamicTile",
//                        properties : {
//    						chipId: "catalogTile_33",
//                            title : "Sales Performance",
//                            numberValue : 3.75,
//                            info : 'Change to Last Month in %',
//                            numberFactor : '%',
//                            numberDigits : 2,
//                            stateNumber : "Positive",
//                            stateArrow : "Up",
//                            icon: "sap-icon://Fiori2/F0002",
//                            targetURL: "#Action-todefaultapp",
//                            // uncomment to enable odata requests for the tile
//                            //serviceUrl: "/ushell/test-resources/sap/ushell/shells/demo/dynamicTileODataDemoService.js",
//                            serviceRefreshInterval: 10,
//                            keywords: ["sales", "performance"]
//                        }
//                    }
//                ]
//            },
//            {
//                id: "group_hidden",
//                title: "Hidden Group",
//                isPreset: false,
//                isVisible: false,
//                tiles: []
//            }
//        ],
//        catalogs: [
//            {
//                id: "catalog_0",
//                title: "Cash Management",
//                tiles: [
//                    {
//                        chipId: "catalogTile_00",
//                        title: "Bank Risk",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties: {
//                            title: "Bank Risk",
//                            subtitle: "Rating A- and below",
//                            infoState: "Neutral",
//                            info: "Today",
////                            icon: "sap-icon://flight",
//                            numberValue: 106.6,
//                            numberDigits: 1,
//                            numberState: "Neutral",
//                            numberUnit: "M€",
//                            targetURL: "#Action-toappnavsample",
//                            keywords: ["risk", "neutral", "account"],
//                            tags: ["Liquidity", "Financial"],
//                            formFactor: "Desktop,Tablet,Phone"
//                        }
//                    },
//                    {
//                        chipId: "catalogTile_01",
//                        title: "Bank Statement Import",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties : {
//                            title: "Bank Statement Import",
//                            subtitle: "Accounts completed import",
//                            numberValue: 16.7,
//                            numberState: "Neutral",
//                            numberUnit: "%",
//                            stateArrow: "Down",
//                            infoState: "Neutral",
//                            info: "Today",
//                            targetURL: "#UI2Fiori2SampleApps-approvepurchaseorders",
//                            keywords: ["risk", "import", "account"],
//                            tags: ["Financial", "Flow"],
//                            formFactor: "Desktop,Tablet,Phone"
//                        }
//                    },
//                    {
//                        chipId: "catalogTile_02",
//                        title: "Liquidity Forecast",
//                        size: "1x1",
//                        // note: will be KPI Line chart
//                        tileType: "sap.ushell.ui.tile.ImageTile",
//                        properties: {
//                            title: "Liquidity Forecast",
//                            subtitle: "Forecast for 30 days",
//                            imageSource: "img/Gross_Revenue_Chart_wNumbers.png",
//                            targetURL: "#Action-toappperssample",
//                            keywords: ["forecast", "cash", "flow"],
//                            tags: ["Liquidity", "Flow"],
//                            formFactor: "Desktop,Tablet,Phone"
//                        }
//                    },
//                    {
//                        chipId: "catalogTile_03",
//                        title: "Liquidity Structure",
//                        size: "1x1",
//                        // note: will be KPI Comparison chart
//                        tileType: "sap.ushell.ui.tile.ImageTile",
//                        properties: {
//                            title: "Liquidity Structure",
//                            subtitle: "Structure of current account, deposit, and debt",
//                            imageSource: "img/Incoming_Customer_Complaints_wNumbers.png",
//                            targetURL: "#Action-toappnavsample2",
//                            keywords: ["liquidity"],
//                            tags: ["Financial", "Risk"],
//                            formFactor: "Desktop"
//                        }
//                    },
//                    {
//                        chipId: "catalogTile_04",
//                        title: "Current Accounts Balance",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties: {
//                            title: "Current Accounts Balance",
//                            subtitle: "Cumulated Balance",
//                            infoState: "Neutral",
//                            info: "Yesterday",
//                            numberValue: 18.46,
//                            numberDigits: 2,
//                            numberState: "Negative",
//                            numberUnit: "M€",
//                            targetURL: "#Action-toappnavsample",
//                            keywords: ["account", "banking", "balance"],
//                            formFactor: "Desktop,Phone,Tablet"
//                        }
//                    },
//                    {
//                        chipId: "catalogTile_05",
//                        title: "Current Accounts Balance",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties: {
//                            title: "Current Accounts Balance",
//                            subtitle: "Cumulated balance",
//                            info : "Today",
//                            infoState: "Neutral",
//                            numberValue : 689.5,
//                            numberUnit : "M€",
//                            numberDigits : 2,
//                            numberState: "Positive",
//                            targetURL: "#UI2Fiori2SampleApps-config",
//                            keywords: ["meh", "account"],
//                            formFactor: "Tablet,Phone"
//                        }
//                    },
//                    {
//                        chipId: "catalogTile_06",
//                        title: "Deficit in Bank Accounts",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties: {
//                            title: "Deficit in Bank Accounts",
//                            subtitle: "Cumulated Balance",
//                            icon: "sap-icon://soccor",
//                            infoState: "Neutral",
//                            info: "Today",
//                            numberValue: -314,
//                            numberDigits: 0,
//                            numberState: "Negative",
//                            numberUnit: "M€",
//                            targetURL: "#Action-toappperssample2",
//                            keywords: ["account", "minus"],
//                            formFactor: "Desktop,Tablet,Phone"
//                        }
//                    },
//                    {
//                        chipId: "catalogTile_07",
//                        title: "Surplus in Current Accounts",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties: {
//                            title: "Surplus in Current Accounts",
//                            subtitle: "Surplus",
//                            infoState: "Neutral",
//                            info: "Today",
//                            numberValue: 921.4,
//                            numberDigits: 1,
//                            numberState: "Positive",
//                            numberUnit: "M€",
//                            targetURL: "#Action-todefaultapp",
//                            keywords: ["account", "plus"],
//                            formFactor: "Tablet"
//                        }
//                    }
//                ]
//            },
//
//            {
//                id: "catalog_1",
//                title: "Financial Close",
//                tiles: [
//                    {
//                        chipId: "catalogTile_10",
//                        title: "Financial Close Tasks",
//                        size: "1x1",
//                        // note: will be KPI Comparison chart
//                        tileType: "sap.ushell.ui.tile.ImageTile",
//                        properties: {
//                            title: "Financial Close Tasks",
//                            subtitle: "Tasks Overview",
//                            imageSource: "img/Incoming_Customer_Complaints_wNumbers.png",
//                            icon: "sap-icon://task",
//                            targetURL: "#UI2Fiori2SampleApps-approvepurchaseorders",
//                            keywords: ["task"],
//                            formFactor: "Tablet,Phone"
//                        }
//                    },
//                    {
//                        chipId: "catalogTile_11",
//                        title: "Erroneous Tasks",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties : {
//                            title: "Erroneous Tasks",
//                            subtitle: "Tasks completed with error",
//                            numberValue: 3,
//                            numberState: "Negative",
//                            numberUnit: "",
//                            stateArrow: "None",
//                            infoState: "Negative",
//                            info: "tasks are erroneous",
//                            icon: "sap-icon://error",
//                            targetURL: "#UI2Fiori2SampleApps-NavigationWithoutMasterDetailPattern",
//                            keywords: ["task"],
//                            formFactor: "Tablet,Phone"
//                        }
//                    },
//                    {
//                        chipId: "catalogTile_12",
//                        title: "Delayed Tasks",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties : {
//                            title: "Delayed Tasks",
//                            subtitle: "",
//                            numberValue: 9,
//                            numberState: "Negative",
//                            numberUnit: "",
//                            stateArrow: "None",
//                            infoState: "Negative",
//                            info: "tasks with delay",
//                            icon: "sap-icon://task",
//                            targetURL: "#UI2Fiori2SampleApps-NavigationWithoutRoutes",
//                            keywords: ["task"],
//                            formFactor: "Tablet,Phone"
//                        }
//                    },
//                    {
//                        chipId: "catalogTile_12",
//                        title: "Completed Tasks",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties : {
//                            title: "Completed Tasks",
//                            subtitle: "Tasks Due Today",
//                            numberValue: 90,
//                            numberState: "Positive",
//                            numberFactor: "%",
//                            stateArrow: "None",
//                            infoState: "Positive",
//                            info: "Completed Due Today",
//                            icon: "sap-icon://task",
//                            targetURL: "#UI2Fiori2SampleApps-navigationwithroutes",
//                            keywords: ["task"],
//                            formFactor: "Tablet,Phone"
//                        }
//                    }
//                ]
//            },
//            {
//                id: "catalog_2",
//                title: "Project Execution",
//                tiles: [
//                    {
//                        chipId: "catalogTile_20",
//                        title: "WBS Cost Variance",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties: {
//                            title: "WBS Cost Variance",
//                            subtitle: "Variance",
//                            numberValue : 34,
//                            info : "Today",
//                            unit : "",
//                            numberDigits : 0,
//                            numberState: "Negative",
//                            tags: ["Financial", "Risk"],
//                            targetURL: "#UI2Fiori2SampleApps-approvepurchaseorders",
//                            keywords: ["variance"]
//                        }
//                    },
//                    {
//                        chipId: "catalogTile_21",
//                        title: "Due Activities",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties: {
//                            title: "Due Activities",
//                            subtitle: "Activities due today",
//                            numberValue : 12,
//                            info : 'Today',
//                            unit : '',
//                            decimalDigits : 0,
//                            numberState: "Neutral",
//                            tags: ["Financial", "Risk"],
//                            targetURL: "#Action-toappperssample2",
//                            keywords: ["task"]
//                        }
//                    },
//                    {
//                        chipId: "catalogTile_22",
//                        title: "Purchase Orders",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties: {
//                            title: "Purchase Orders",
//                            subtitle: "Overdue Purchase Order Items",
//                            numberValue : 97,
//                            info : 'Today',
//                            unit : '',
//                            numberDigits : 0,
//                            numberState: "Negative",
//                            targetURL: "#Action-toappperssample",
//                            keywords: ["task"]
//                        }
//                    },
//                    {
//                        chipId: "catalogTile_23",
//                        title: "Missing Parts",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties: {
//                            title: "Missing Parts",
//                            subtitle: "",
//                            numberValue : 7,
//                            info : "Today",
//                            unit : "",
//                            numberDigits : 0,
//                            numberState: "Negative",
//                            targetURL: "#Action-toappnavsample2",
//                            keywords: ["parts"]
//                        }
//                    }
//                ]
//            },
//            {
//                id: "catalog_3",
//                title: "Employee Self Service",
//                tiles: [
//                    {
//                        chipId: "catalogTile_30",
//                        title: "Leave Request",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//                            title: "Request Leave",
//                            subtitle: "",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://create-leave-request",
//                            targetURL: "#Action-toappnavsample",
//                            keywords: ["leave request", "request", "personal"]
//                        }
//                    },
//                    {
//                        chipId: "catalogTile_31",
//                        title: "My Benefits",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties : {
//                            title: "My Benefits",
//                            subtitle: "",
//                            numberValue: 3,
//                            numberState: "Neutral",
//                            numberUnit: "",
//                            info: "pending",
//                            icon: "sap-icon://family-care",
//                            targetURL: "#UI2Fiori2SampleApps-config",
//                            keywords: ["benefits", "personal"]
//                        }
//                    },
//                    {
//                        chipId: "catalogTile_32",
//                        title: "My Timesheets",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties : {
//                            title: "My Timesheets",
//                            subtitle: "",
//                            numberValue: 30,
//                            numberState: "Neutral",
//                            numberUnit: "",
//                            info: "days missing",
//                            icon: "sap-icon://time-entry-request",
//                            targetURL: "#Action-todefaultapp",
//                            keywords: ["time", "personal"]
//                        }
//                    },
//					{
//                        chipId: "catalogTile_33",
//                        title: "Sales Performance",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties: {
//                            title : "Sales Performance",
//                            numberValue : 3.75,
//                            info : 'Change to Last Month in %',
//                            numberFactor : '%',
//                            numberDigits : 2,
//                            numberState : "Positive",
//                            stateArrow : "Up",
//                            icon: "sap-icon://Fiori2/F0002",
//                            targetURL: "#Action-todefaultapp",
//                            serviceUrl: "/ushell/test-resources/sap/ushell/shells/demo/dynamicTileODataDemoService.js",
//                            serviceRefreshInterval: 10,
//                            keywords: ["sales", "performance"]
//                        }
//                    },
//					{
//                        chipId: "catalogTile_34",
//                        title: "WEB GUI",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                         properties: {
//                            title: "WEB GUI",
//                            subtitle: "Opens WEB GUI",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://world",
//                            targetURL: "#Action-WEBGUI"
//                        }
//                    },
//					{
//                        chipId: "catalogTile_35",
//                        title: "US Profit Margin is at",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties : {
//                            title: "US Profit Margin is at",
//                            numberValue : 21.599,
//                            info : '',
//                            infoState: "Positive",
//                            numberFactor: '%',
//                            numberUnit : 'Relative Improvement',
//                            numberDigits : 1,
//                            numberState : "Positive",
//                            stateArrow : "Up",
//                            targetURL: "#Action-toappnavsample",
//                            keywords: ["profit", "profit margin", "sales"]
//                        }
//                    },
//					{
//                        chipId: "catalogTile_36",
//                        title: "Gross Revenue under Target at",
//                        size: "1x1",
//                        tileType : "sap.ushell.ui.tile.DynamicTile",
//                        properties : {
//                            title: "Gross Revenue under Target at",
//                            numberValue : 347.765,
//                            info : 'Absolute Deviation',
//                            infoState: "Negative",
//                            numberFactor: "M",
//                            numberUnit : 'EUR',
//                            numberDigits : 0,
//                            numberState : "Negative",
//                            stateArrow : "Down",
//                            targetURL: "#Action-approvepurchaseorders",
//                            keywords: ["profit", "revenue", "target"]
//                        }
//                    },
//					{
//                        chipId: "catalogTile_37",
//                        title: "Net Order Value is at",
//                        size: "1x1",
//                        tileType : "sap.ushell.ui.tile.DynamicTile",
//                        properties : {
//                            title: "Net Order Value is at",
//                            numberValue : 85.851,
//                            info : 'Absolute Deviation',
//                            numberFactor: "M",
//                            numberUnit : 'EUR',
//                            numberDigits : 2,
//                            numberState : "Negative",
//                            stateArrow : "Up",
//                            targetURL: "#UI2Fiori2SampleApps-AppScflTest",
//                            keywords: ["profit", "order", "sales"]
//                        }
//                    },
//					{
//                        chipId: "catalogTile_38",
//                        title: "I am a short title!",
//                        size: "2x1",
//                        tileType: "sap.ushell.ui.tile.StaticTile",
//                        properties: {
//                            title: "I am a short title!",
//                            subtitle: "This shows a StaticTile with a long subtitle that may be misleading",
//                            infoState: "Neutral",
//                            info: "0 days running without bugs",
//                            icon: "sap-icon://flight",
//                            targetURL: "#Action-todefaultapp"
//                        }
//                    },
//					{
//                        chipId: "catalogTile_39",
//                        title: "Wikipedia",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//                            title: "Wikipedia",
//                            subtitle: "Opens Wikipedia",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://world",
//                            targetURL: "#UI2Fiori2SampleApps-wikipedia"
//                        }
//                    },
//					{
//                        chipId: "catalogTile_40",
//                        title: "My Leave Request",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//                            title: "My Leave Request",
//                            subtitle: "Opens Fiori 1 App",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://world",
//                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
//                        }
//                    },
//					{
//                        chipId: "catalogTile_41",
//                        title: "Just another long long long long long title",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.DynamicTile",
//                        properties : {
//                            title: "Just another long long long long long title",
//                            subtitle: "This shows a DynamicTile",
//                            numberValue: 20,
//                            numberState: "Positive",
//                            numberUnit: "days",
//                            stateArrow: "Down",
//                            infoState: "Positive",
//                            info: "running without any crashes",
//                            icon: "sap-icon://flight",
//                            targetURL: "#Action-todefaultapp",
//                            serviceUrl: "/ushell/test-resources/sap/ushell/shells/demo/dynamicTileODataDemoService.js",
//                            serviceRefreshInterval: 0
//                        }
//                    },
//					{
//                        chipId: "catalogTile_42",
//                        title: "User maintenance",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//                            title: "User maintenance",
//                            subtitle: "Opens WebGUI",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://employee",
//                            targetURL: "#UI2Fiori2SampleApps-webdynpro"
//                        }
//                    },
//					{
//                        chipId: "catalogTile_43",
//                        title: "Source Control",
//                        size: "2x2",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//                            title: "Source Control",
//                            subtitle: "Opens Gerrit ",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://world",
//                            targetURL: "#UI2Fiori2SampleApps-Gerrit"
//                        }
//                    },
//					{
//                        chipId: "catalogTile_44",
//                        title: "XSS Example",
//                        size: "1x1",
//                        tileType: "sap.ushell.ui.tile.TileBase",
//                        properties: {
//                            title: "<script>alert('Hi');</script>XSS",
//                            subtitle: "Opens Fiori 1 App<script>alert('Hi');</script>",
//                            infoState: "Neutral",
//                            info: "",
//                            icon: "sap-icon://<script>alert('Hi');</script>",
//                            targetURL: "#UI2Fiori2SampleApps-MyLeaveRequest"
//                        }
//                    }
//                ]
//            }
//        ],
//        applications: {
//            "" : { //default application - empty URL hash
//                additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
//                applicationType: "URL",
//                url: "/ushell/test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp"
//            },
//            "Action-WEBGUI" : {
//            	additionalInformation: "",
//                applicationType: "NWBC",
//                url: "http://walla.co.il",
//                description : "web gui testing"
//            },
//            "Action-todefaultapp" : { //default application as explicit navigation target
//                additionalInformation: "SAPUI5.Component=sap.ushell.demoapps.FioriSandboxDefaultApp",
//                applicationType: "URL",
//                url: "../../../../../test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp",
//                description : "Default App : show statically registered apps (fioriSandboxConfig.js) "
//            },
//
//            "UI2Fiori2SampleApps-defaultapp" : { //default application as explicit navigation target
//                additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
//                applicationType: "URL",
//                url: "/ushell/test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp",
//                description : "Default App : show statically registered apps (fioriSandboxConfig.js) "
//            },
//
//            "UI2Fiori2SampleApps-AppScflTest" : { //sample scaffolding application
//                additionalInformation: "SAPUI5.Component=AppScflTest",
//                applicationType: "URL",
//                url: "/ushell/test-resources/sap/ushell/demoapps/AppScflTest"
//            },
//
//            "UI2Fiori2SampleApps-wikipedia" : {
//                applicationType: "URL",
//                url: "http://www.wikipedia.org",
//                description : "Wikipedia"
//            },
//
//            "UI2Fiori2SampleApps-Gerrit" : {
//                applicationType: "NWBC",
//                url: "http://www.sap.com/index.html",
//                description : "Gerrit"
//            },
//
//
//            "UI2Fiori2SampleApps-MyLeaveRequest" : {
//                applicationType: "URL",
//                url: "http://www.sap.com/index.html",
//                description : "My Leave Request"
//            },
//
//            "UI2Fiori2SampleApps-config"  : {
//                additionalInformation: "SAPUI5.Component=sap.ushell.demoapps.FioriSandboxConfigApp",
//                applicationType: "URL",
//                url: "/ushell/test-resources/sap/ushell/demoapps/FioriSandboxConfigApp",
//                description : "Config App : Configure Test-local1 and Test-local2 apps"
//            },
//
//            "Action-toappnavsample"  : {
//                /*
//                 * Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\AppNavSample
//                 *
//                 * Demonstrates resource-based navigation inside a shell runtime
//                 *
//                 * Run e.g. as :
//                 * http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#AppNavSample-display&/Detail
//                 * http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#AppNavSample-display&/View1
//                 *
//                */
//
//                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
//                applicationType: "URL",
//                url: "/ushell/test-resources/sap/ushell/demoapps/AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2",
//                description : "AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only) "
//            },
//
//            "UI2Fiori2SampleApps-appnavsample"  : {
//                /*
//                 * Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\AppNavSample
//                 *
//                 * Demonstrates resource-based navigation inside a shell runtime
//                 *
//                 * Run e.g. as :
//                 * http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#AppNavSample-display&/Detail
//                 * http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#AppNavSample-display&/View1
//                 *
//                */
//
//                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
//                applicationType: "URL",
//                url: "/ushell/test-resources/sap/ushell/demoapps/AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2",
//                description : "AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only) "
//            },
//
//            "Action-toappnavsample2" : {
//                /*
//                 * Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\AppNavSample
//                 *
//                 * Demonstrates resource-based navigation inside a shell runtime
//                 *
//                 * Run e.g. as :
//                 * http://localhost:8080/ushell/staging/shells/sandbox/fioriSandbox.html#AppNavSample2-display&/Detail
//                 * http://localhost:8080/ushell/staging/shells/sandbox/fioriSandbox.html#AppNavSample2-display&/View1
//                 *
//                */
//                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample2",
//                applicationType: "URL",
//                url: "/ushell/test-resources/sap/ushell/demoapps/AppNavSample2",
//                description : "AppNavSample2 Inner App Navigation: Do it your self (Early(component) navigator instantiation, simple route registration example, no model binding, explicit view changes within the app)"
//            },
//
//            "Action-toappperssample" : {
//                /*
//                 * Sample app from git\unified.shell\ushell-lib\src\test\js\sap\ushell\demoapps\AppPersSample2
//                */
//                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppPersSample",
//                applicationType: "URL",
//                url: "/ushell/test-resources/sap/ushell/demoapps/AppPersSample",
//                description : "AppPersSample 1: NOT YET READY - Sample app for generic usage of personalization service"
//            },
//
//            "Action-toappperssample2" : {
//                /*
//                 * Sample app from git\unified.shell\ushell-lib\src\test\js\sap\ushell\demoapps\AppPersSample22
//                */
//                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppPersSample2",
//                applicationType: "URL",
//                url: "/ushell/test-resources/sap/ushell/demoapps/AppPersSample2",
//                description : "AppPersSample 2: INTERMEDIATE VERSION - Sample app for personalization of tables (intermediate version until table personalization is directly supported by UI5 Mobile)"
//            },
//
//            "UI2Fiori2SampleApps-appnavsample2" : {
//                /*
//                 * Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\AppNavSample
//                 *
//                 * Demonstrates resource-based navigation inside a shell runtime
//                 *
//                 * Run e.g. as :
//                 * http://localhost:8080/ushell/staging/shells/sandbox/fioriSandbox.html#AppNavSample2-display&/Detail
//                 * http://localhost:8080/ushell/staging/shells/sandbox/fioriSandbox.html#AppNavSample2-display&/View1
//                 *
//                */
//                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample2",
//                applicationType: "URL",
//                url: "/ushell/test-resources/sap/ushell/demoapps/AppNavSample2",
//                description : "AppNavSample2 Inner App Navigation: Do it your self (Early(component) navigator instantiation, simple route registration example, no model binding, explicit view changes within the app)"
//            },
//
//            "UI2Fiori2SampleApps-appperssample" : {
//                /*
//                 * Sample app from git\unified.shell\ushell-lib\src\test\js\sap\ushell\demoapps\AppPersSample2
//                */
//                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppPersSample",
//                applicationType: "URL",
//                url: "/ushell/test-resources/sap/ushell/demoapps/AppPersSample",
//                description : "AppPersSample 1: NOT YET READY - Sample app for generic usage of personalization service"
//            },
//
//            "UI2Fiori2SampleApps-appperssample2" : {
//                /*
//                 * Sample app from git\unified.shell\ushell-lib\src\test\js\sap\ushell\demoapps\AppPersSample22
//                */
//                additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppPersSample2",
//                applicationType: "URL",
//                url: "/ushell/test-resources/sap/ushell/demoapps/AppPersSample2",
//                description : "AppPersSample 2: INTERMEDIATE VERSION - Sample app for personalization of tables (intermediate version until table personalization is directly supported by UI5 Mobile)"
//            },
//
//            "UI2Fiori2SampleApps-approvepurchaseorders" : {
//                /* Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\ApprovePurchaseOrders
//                 *
//                 */
//                additionalInformation: "SAPUI5.Component=ApprovePurchaseOrders",
//                applicationType: "URL",
//                url: "/ushell/test-resources/sap/ushell/demoapps/ApprovePurchaseOrders",
//                description : "ApprovePurchaseOrders:SAP UI5 Best practice App (Inner App Navigation): explicit mapping of routes to model bindings and views, automatic view changes by the Nav framework"
//            },
//
//            "UI2Fiori2SampleApps-navigationwithroutes" : {
//                /* Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\ApprovePurchaseOrders
//                 *
//                 */
//                additionalInformation: "SAPUI5.Component=NavigationWithRoutes",
//                applicationType: "URL",
//                url: "/ushell/test-resources/sap/ushell/demoapps/NavigationWithRoutes",
//                description : "NavgationWithRoutes:Shows how to navigate using routes without the context property"
//            },
//
//            "UI2Fiori2SampleApps-NavigationWithoutRoutes" : {
//                /* Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\ApprovePurchaseOrders
//                 *
//                 */
//                additionalInformation: "SAPUI5.Component=NavigationWithoutRoutes",
//                applicationType: "URL",
//                url: "/ushell/test-resources/sap/ushell/demoapps/NavigationWithoutRoutes",
//                description : "NavigationWithoutRoutes:Shows how to navigate without using routes(that means you cannot bookmark the resulting links)"
//            },
//
//            "UI2Fiori2SampleApps-NavigationWithoutMasterDetailPattern" : {
//                /* Sample app from git\unified.shell\ushell\src\main\webapp\staging\demoapps\NavigationWithoutMasterDetailPattern
//                 *
//                 */
//                additionalInformation: "SAPUI5.Component=NavigationWithoutMasterDetailPattern",
//                applicationType: "URL",
//                url: "/ushell/test-resources/sap/ushell/demoapps/NavigationWithoutMasterDetailPattern",
//                description : "Shows how to navigate without using routes without the master-detail pattern"
//            },
//
//            "UI2Fiori2SampleApps-webdynpro" : {
//                applicationType: "NWBC",
//                url: "http://www.sap.com/index.html",
//                description : "Web Dynpro for ABAP Application Integration"
//            },
//
//            "UI2Fiori2SampleApps-webgui" : {
//                applicationType: "NWBC",
//                url: "http://www.sap.com/index.html",
//                description : "WebGUI Application Integration"
//            }
//
//            /* Put your own application here
//            "MySO-Action" : {
//                additionalInformation: "SAPUI5.Component=<component-name>",
//                applicationType: "URL",
//                url: "/<path-to-component-root>"    // folder where Component.js is stored
//            },
//            */
//
//            /*"UI5Sample-ApprovePurchaseOrdersOLD" : {
//                additionalInformation: "SAPUI5=ApprovePurchaseOrders/view.App.view.js",
//                applicationType: "URL",
//                url: "/uilib-sample/blueprint/"
//            }, */
//        }
//        // data for the personalization service
////        personalizationData: {
////            "sap.ushell.personalization#sap.ushell.services.UserRecents" : {
////                "ITEM#RecentApps": [
////                    {"iCount": 1, "iTimestamp": 1378479383874, "oItem": {"semanticObject": "UI2Fiori2SampleApps", "action": "approvepurchaseorders", "sTargetHash": "#UI2Fiori2SampleApps-approvepurchaseorders", "title" : "Approve Purchase", "url" : "#UI2Fiori2SampleApps-approvepurchaseorders"}},
////                    {"iCount": 2, "iTimestamp": 1378479383895, "oItem": {"semanticObject": "Action", "action": "toappnavsample", "sTargetHash": "#Action-toappnavsample", "title" : "Approve Nav Sample 3", "url" : "#Action-toappnavsample"}},
////                    {"iCount": 2, "iTimestamp": 1378479383896, "oItem": {"semanticObject": "Action", "action": "toappnavsample2", "sTargetHash": "#Action-toappnavsample2", "title" : "Approve Nav Sample 2", "url" : "#Action-toappnavsample2"}},
////                    {"iCount": 1, "iTimestamp": 1378479383899, "oItem": {"semanticObject": "UI2Fiori2SampleApps", "action": "MyLeaveRequest", "sTargetHash": "#UI2Fiori2SampleApps-MyLeaveRequest", "title" : "My Leave Request", "url" : "#UI2Fiori2SampleApps-MyLeaveRequest"}},
////                    {"iCount": 2, "iTimestamp": 1378479383878, "oItem": {"semanticObject": "Action", "action": "toappnavsample", "sTargetHash": "#Action-toappnavsample", "title" : "Approve Nav Sample 8", "url" : "#Action-toappnavsample"}},
////                    {"iCount": 2, "iTimestamp": 1378479383897, "oItem": {"semanticObject": "Action", "action": "toappnavsample2", "sTargetHash": "#Action-toappnavsample2", "title" : "Approve Nav Sample 1", "url" : "#Action-toappnavsample2"}},
////                    {"iCount": 1, "iTimestamp": 1378479383898, "oItem": {"semanticObject": "UI2Fiori2SampleApps", "action": "approvepurchaseorders", "sTargetHash": "#UI2Fiori2SampleApps-approvepurchaseorders", "title" : "Approve first Purchase", "url" : "#UI2Fiori2SampleApps-approvepurchaseorders"}},
////                    {"iCount": 2, "iTimestamp": 1378479383863, "oItem": {"semanticObject": "Action", "action": "toappnavsample", "sTargetHash": "#Action-toappnavsample", "title" : "Approve Nav Sample 13", "url" : "#Action-toappnavsample"}},
////                    {"iCount": 2, "iTimestamp": 1378479383862, "oItem": {"semanticObject": "Action", "action": "toappnavsample2", "sTargetHash": "#Action-toappnavsample2", "title" : "Approve Nav Sample 12", "url" : "#Action-toappnavsample2"}},
////                    {"iCount": 1, "iTimestamp": 1378479383879, "oItem": {"semanticObject": "UI2Fiori2SampleApps", "action": "approvepurchaseorders", "sTargetHash": "#UI2Fiori2SampleApps-approvepurchaseorders", "title" : "Approve Purchase", "url" : "#UI2Fiori2SampleApps-approvepurchaseorders"}},
////                    {"iCount": 2, "iTimestamp": 1378479383894, "oItem": {"semanticObject": "Action", "action": "toappnavsample", "sTargetHash": "#Action-toappnavsample", "title" : "Approve Nav Sample 4", "url" : "#UI2Fiori2SampleApps-appnavsample"}},
////                    {"iCount": 2, "iTimestamp": 1378479383893, "oItem": {"semanticObject": "Action", "action": "toappnavsample2", "sTargetHash": "#Action-toappnavsample2", "title" : "Approve Nav Sample 5", "url" : "#UI2Fiori2SampleApps-appnavsample2"}}
////                ],
////                "ITEM#RecentSearches": [
////                    {"iCount": 1, "iTimestamp": 1378478828152, "oItem": {"sTerm": "Test"}},
////                    {"iCount": 1, "iTimestamp": 1378478828151, "oItem": {"sTerm": "Recent search 3"}},
////                    {"iCount": 1, "iTimestamp": 1378478828149, "oItem": {"sTerm": "Recent search 4", "oObjectName": {"label": "Business Partners", "value": "Business Partners"}}},
////                    {"iCount": 1, "iTimestamp": 1378478828153, "oItem": {"sTerm": "Sally", "oObjectName": {"label": "Employees", "value": "Employees"}}},
////                    {"iCount": 1, "iTimestamp": 1378478828148, "oItem": {"sTerm": "Recent search 5"}},
////                    {"iCount": 1, "iTimestamp": 1378478828147, "oItem": {"sTerm": "Recent search 6"}},
////                    {"iCount": 1, "iTimestamp": 1378478828137, "oItem": {"sTerm": "Recent search 16"}},
////                    {"iCount": 1, "iTimestamp": 1378478828136, "oItem": {"sTerm": "Recent search 17"}},
////                    {"iCount": 1, "iTimestamp": 1378478828133, "oItem": {"sTerm": "Recent search 20"}},
////                    {"iCount": 1, "iTimestamp": 1378478828132, "oItem": {"sTerm": "Recent search 21"}},
////                    {"iCount": 1, "iTimestamp": 1378478828131, "oItem": {"sTerm": "Recent search 22"}},
////                    {"iCount": 1, "iTimestamp": 1378478828146, "oItem": {"sTerm": "Recent search 7"}},
////                    {"iCount": 1, "iTimestamp": 1378478828145, "oItem": {"sTerm": "Recent search 8"}},
////                    {"iCount": 1, "iTimestamp": 1378478828144, "oItem": {"sTerm": "Recent search 9"}},
////                    {"iCount": 1, "iTimestamp": 1378478828143, "oItem": {"sTerm": "Recent search 10"}},
////                    {"iCount": 1, "iTimestamp": 1378478828135, "oItem": {"sTerm": "Recent search 18"}},
////                    {"iCount": 1, "iTimestamp": 1378478828134, "oItem": {"sTerm": "Recent search 19"}},
////                    {"iCount": 1, "iTimestamp": 1378478828142, "oItem": {"sTerm": "Recent search 11"}},
////                    {"iCount": 1, "iTimestamp": 1378478828141, "oItem": {"sTerm": "Recent search 12"}},
////                    {"iCount": 1, "iTimestamp": 1378478828140, "oItem": {"sTerm": "Recent search 13"}},
////                    {"iCount": 1, "iTimestamp": 1378478828139, "oItem": {"sTerm": "Recent search 14"}},
////                    {"iCount": 1, "iTimestamp": 1378478828138, "oItem": {"sTerm": "Recent search 15"}}
////                ]
////            }
////        }
//    };
//
//}());
