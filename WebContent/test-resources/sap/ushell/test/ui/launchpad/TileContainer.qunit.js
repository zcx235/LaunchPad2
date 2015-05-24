// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.TileContainer
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.launchpad.TileContainer");
    jQuery.sap.require("sap.ushell.resources");

    var stub;

    module("sap.ushell.ui.launchpad.TileContainer", {
        setup: function () {
            //sinon.stub(sap.ushell.ui.launchpad.TileContainer.prototype.addNewItem, function (elem) { return true; });
            //stub = sinon.stub(sap.ushell.ui.launchpad.TileContainer, "addNewItem").callsArgWith(1, {}).returns({});
            //var mock = sinon.mock(sap.ushell.ui.launchpad.TileContainer);
            //mock.expects("addNewItem").once().callsArgWith(1, {}).returns({});
            //mock.verify();
            sap.ushell.bootstrap("demo");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
//            stub.restore();
            delete sap.ushell.Container;
        }
    });
    var demiItemData = {
        showHeader : false,
        showPlaceholder : false,
        showGroupHeader : true,
        groupHeaderLevel : sap.m.HeaderLevel.H3,
        showNoData : true,
        tiles : {
        },
        afterRendering : function (oEvent) {
            alert('afterRendering afterRendering afterRendering');
        }
    };


    var elementsToDisplayMock = [
        {
            getPath : function () {
                return "path 1";
            }
        },
        {
            getPath : function () {
                return "path 3";
            }
        },
        {
            getPath : function () {
                return "path 4";
            }
        },
        {
            getPath : function () {
                return "path 5";
            }
        },
        {
            getPath : function () {
                return "path 6";
            }
        },
        {
            getPath : function () {
                return "path 40";
            }
        }
    ];
    var onscreenElementsMock = [{
        getHeaderText : function () {
            return "header 1";
        }
    },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 1";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 2";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 3";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 4";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 5";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 6";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 7";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 8";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 9";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 10";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 11";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 12";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 13";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 14";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 15";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 16";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 17";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 18";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 19";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 20";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 21";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 22";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 23";
                    }
                };
            }
        },
        {
            getBindingContext : function () {
                return {
                    getPath : function () {
                        return "path 24";
                    }
                };
            }
        },
        {
            getHeaderText : function () {
                return "header 2";
            }
        },
        {
            getHeaderText : function () {
                return "header 3";
            }
        },
        {
            getHeaderText : function () {
                return "header 4";
            }
        },
        {
            getHeaderText : function () {
                return "header 5";
            }
        }];

    var aSortersMock = [{
        fnGroup : function (elemToDisplay) {
            return "Test Group";
        }
    }];
    var oBindingInfoMock = [];

    test("TileContainer index on screen elements", function () {
        var item = new sap.ushell.ui.launchpad.TileContainer("catalogTiles1", demiItemData);
        var indexingMaps = item.indexOnScreenElements(onscreenElementsMock);
        ok(indexingMaps.onScreenHeaders['header 1'].aItemsRefrenceIndex === 0, "header 1");
        ok(indexingMaps.onScreenPathIndexMap['path 1'].aItemsRefrenceIndex === 1, "element path 1");
        ok(indexingMaps.onScreenPathIndexMap['path 2'].aItemsRefrenceIndex === 2, "element path 2");
        ok(indexingMaps.onScreenPathIndexMap['path 3'].aItemsRefrenceIndex === 3, "element path 3");
        ok(indexingMaps.onScreenPathIndexMap['path 4'].aItemsRefrenceIndex === 4, "element path 4");
        ok(indexingMaps.onScreenPathIndexMap['path 5'].aItemsRefrenceIndex === 5, "element path 5");
        ok(indexingMaps.onScreenPathIndexMap['path 6'].aItemsRefrenceIndex === 6, "element path 6");
        ok(indexingMaps.onScreenPathIndexMap['path 7'].aItemsRefrenceIndex === 7, "element path 7");
        ok(indexingMaps.onScreenPathIndexMap['path 8'].aItemsRefrenceIndex === 8, "element path 8");
        ok(indexingMaps.onScreenPathIndexMap['path 9'].aItemsRefrenceIndex === 9, "element path 9");
        ok(indexingMaps.onScreenPathIndexMap['path 10'].aItemsRefrenceIndex === 10, "element path 10");
        ok(indexingMaps.onScreenPathIndexMap['path 11'].aItemsRefrenceIndex === 11, "element path 11");
        ok(indexingMaps.onScreenPathIndexMap['path 12'].aItemsRefrenceIndex === 12, "element path 12");
        ok(indexingMaps.onScreenPathIndexMap['path 13'].aItemsRefrenceIndex === 13, "element path 13");
        ok(indexingMaps.onScreenHeaders['header 2'].aItemsRefrenceIndex === 25, "header 1");
        ok(indexingMaps.onScreenHeaders['header 3'].aItemsRefrenceIndex === 26, "header 1");
        ok(indexingMaps.onScreenHeaders['header 4'].aItemsRefrenceIndex === 27, "header 1");
        ok(indexingMaps.onScreenHeaders['header 5'].aItemsRefrenceIndex === 28, "header 1");
//        ok(item.getId() == item.getFocusInfo().id, "focus is on the current element");
        item.destroy();
    });

    test("Mark visible on screen elements", function () {
        var item = new sap.ushell.ui.launchpad.TileContainer("catalogTiles2", demiItemData);
        var indexingMaps = item.indexOnScreenElements(onscreenElementsMock);
        var onScreenElem = {};
        item.markVisibleOnScreenElements(elementsToDisplayMock, indexingMaps);
        ok(indexingMaps.onScreenPathIndexMap['path 1'].isVisible === true, "path 1 visible");
        ok(indexingMaps.onScreenPathIndexMap['path 2'].isVisible === false, "path 2 not visible");
        ok(indexingMaps.onScreenPathIndexMap['path 3'].isVisible === true, "path 2 visible");
        item.destroy();
    });

    test("Create Missing Elements In OnScreen Elements", function () {
        var item = new sap.ushell.ui.launchpad.TileContainer("catalogTiles3", demiItemData);
        var indexingMaps = item.indexOnScreenElements(onscreenElementsMock);
        var lastFilteredItem = item.markVisibleOnScreenElements(elementsToDisplayMock, indexingMaps);
        item.createMissingElementsInOnScreenElements(indexingMaps, elementsToDisplayMock, lastFilteredItem, true, aSortersMock, oBindingInfoMock, function () {}, function () {});
        ok(indexingMaps.onScreenPathIndexMap['path 40'].isVisible === true, "path 40 created");
        item.destroy();
    });

    test("Test setVisible on empty group", function () {
        var oRenderer = sap.ushell.Container.createRenderer("fiori2");
        sap.ui.getCore().byId("shell").getModel().setProperty("/personalization", false);
        var item = new sap.ushell.ui.launchpad.TileContainer("catalogTiles3", {});
        // setting true, but the result should be false
        item.setVisible(true);
        ok(item.getVisible() === false, "Tile container is not visible");
        oRenderer.destroy();
        item.destroy();
    });
}());
