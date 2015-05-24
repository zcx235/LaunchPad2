// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.GroupListItem
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.tile.DynamicTile");
    jQuery.sap.require("sap.ushell.resources");

    var demiTileData = {
            //TileBase Constructor arguments
            title : "testTileTitle",
            subtitle : "testTileSubTitle",
            icon : "sap-icon://world",
            info : "testInfo",
            targetURL : "#testTargetUrl",
            //DynamicTile Constructor arguments
            numberUnit : '$',
            numberFactor : 'Units%'
        },
        translationBundle = sap.ushell.resources.i18n,
        dynamicTile,
        testContainer;

    module("sap.ushell.ui.tile.DynamicTile", {
        setup: function () {
            dynamicTile = new sap.ushell.ui.tile.DynamicTile(demiTileData);
            testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            dynamicTile.destroy();
            jQuery(testContainer).remove();
        }
    });

    test("Constructor Test", function () {
        ok(dynamicTile.getNumberUnit() === demiTileData.numberUnit, "Number Unit Test");
        ok(dynamicTile.getNumberFactor() === demiTileData.numberFactor, "Number Factor Test");
        //Test constructor arguments with default values
        ok(dynamicTile.getNumberValue() === '0.0', "Number Value Test");
        ok(dynamicTile.getNumberState() === 'Neutral', "Number State Test");
        ok(dynamicTile.getNumberDigits() === 0, "Number Digits Test");
        ok(dynamicTile.getStateArrow() === 'None', "State Arrow Test");
    });

    asyncTest("Render Part - DynamicTile wrapping structure Test", function () {
        dynamicTile.placeAt('testContainer');
        setTimeout(function () {
            start();
            var bSapUshellDynamicTileClassAdded = testContainer.find('.sapUshellDynamicTile').length > 0,
                dynamicTileIndicationDiv,
                sapUshellDynamicTileClassDiv,
                sapUshellDynamicTileClassInnerDiv;

            //Check whether a div with sapUshellDynamicTile has been created.
            ok(bSapUshellDynamicTileClassAdded, "Div with CSS Class: 'sapUshellDynamicTile' is added");
            sapUshellDynamicTileClassDiv = testContainer.find('.sapUshellDynamicTile');
            sapUshellDynamicTileClassInnerDiv = jQuery(sapUshellDynamicTileClassDiv).find('div:first');
            ok(sapUshellDynamicTileClassInnerDiv.hasClass('sapUshellDynamicTileData'), "CSS Class: 'sapUshellDynamicTileData' is added on Tile Data inner div");
            //The class: 'sapUshellDynamicTileDataNeutral'is a default class that should be added if 'NumberState' hasn't been defined.
            ok(sapUshellDynamicTileClassInnerDiv.hasClass('sapUshellDynamicTileDataNeutral'), "CSS Class: 'sapUshellDynamicTileDataNeutral' is added on Tile Data inner div");
            dynamicTileIndicationDiv = sapUshellDynamicTileClassInnerDiv.find('div:first');
            ok(dynamicTileIndicationDiv.hasClass('sapUshellDynamicTileIndication'), "CSS Class: 'sapUshellDynamicTileIndication' is added on Dynamic Tile Indication div");

        }, 0);
    });

    asyncTest("Render Part - Dynamic Data Test", function () {
        dynamicTile.setNumberState('Critical')
        dynamicTile.placeAt('testContainer');
        setTimeout(function () {
            start();
            var dynamicTileDataDiv = testContainer.find('.sapUshellDynamicTileData')[0],
                bIsNumberStateClassAdded = jQuery(dynamicTileDataDiv).hasClass('sapUshellDynamicTileDataCritical');

            ok(bIsNumberStateClassAdded, "Add Number-State Class Test");
        }, 0);
    });

    asyncTest("Render Part - No State Arrow default behaviour Test", function () {
        dynamicTile.placeAt('testContainer');
        setTimeout(function () {
            start();
            var dynamicTileStateArrowDiv = jQuery('.sapUshellDynamicTileIndication').find('div:first');

            ok(dynamicTileStateArrowDiv.hasClass('sapUshellDynamicTileDataNone') && dynamicTileStateArrowDiv.hasClass('sapUshellDynamicTileStateArrow'), "No State Arrow Test");
        }, 0);
    });

    asyncTest("Render Part - State Arrow rendering Test", function () {
        dynamicTile.setStateArrow('Up');
        dynamicTile.placeAt('testContainer');
        setTimeout(function () {
            start();
            var dynamicTileStateArrowDiv = jQuery('.sapUshellDynamicTileIndication').find('div:first');

            dynamicTileStateArrowDiv = jQuery('.sapUshellDynamicTileIndication').find('div:first');
            ok(dynamicTileStateArrowDiv.hasClass('sapUshellDynamicTileDataUp') && dynamicTileStateArrowDiv.hasClass('sapUshellDynamicTileStateArrow'), "Add Number-State Class Test");
            ok(!dynamicTileStateArrowDiv.hasClass('sapUshellDynamicTileDataNone'), "sapUshellDynamicTileDataNone shouldn't be added")
        }, 0);
    });
    
    asyncTest("Render Part - Number Factor rendering Test", function () {
        dynamicTile.placeAt('testContainer');
        setTimeout(function () {
            start();
            var aTileIndicationDivChildern = jQuery(jQuery('.sapUshellDynamicTileIndication')).children(),
            	brakeLineElement = jQuery(jQuery('.sapUshellDynamicTileIndication').find('br:first')),
            	dynamicTileNumberFactorDiv = jQuery(jQuery('.sapUshellDynamicTileNumberFactor')),
            	arialLabelUnits = dynamicTileNumberFactorDiv.attr('aria-label'),
            	expectedAriaLabelText = translationBundle.getText("TileUnits_lable") + demiTileData.numberFactor,
            	bBrakeLineBeforeNumberFactor;

            ok(dynamicTileNumberFactorDiv, "CSS Class: 'sapUshellDynamicTileNumberFactor' is added Test");
            bBrakeLineBeforeNumberFactor = aTileIndicationDivChildern.index(brakeLineElement) < aTileIndicationDivChildern.index(dynamicTileNumberFactorDiv);
            ok(bBrakeLineBeforeNumberFactor, "<br> is added before the div with the numberFactor class");
            ok(arialLabelUnits === expectedAriaLabelText, "Number Factor aria-label Test");
            ok(dynamicTileNumberFactorDiv.text() === demiTileData.numberFactor, "Number Factor text value Test");
        
        }, 0);
    });

}());