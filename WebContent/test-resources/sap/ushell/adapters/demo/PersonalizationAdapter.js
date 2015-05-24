// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview The Personalization adapter for the demo platform.
 * 
 * 
 * The demo personalization adapter stores entries in a local json object which 
 * is pre-initialized to the data (one live object!)
 * sap.ushell.shells.demo.fioriDemoConfig.personalizationData
 * 
 * For Convenience, the object is a plain json object. 
 * But we do hand out copies and store copies of objects in the data! (via JSON.parse(JSON.stringify()))
 * 
 * @version @version@
 */

(function () {
    "use strict";
    /*jslint nomen: true*/
    /*global jQuery, sap, setTimeout */

    jQuery.sap.declare("sap.ushell.adapters.demo.PersonalizationAdapter");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");


    var oDemoPersData = sap.ushell.shells.demo.fioriDemoConfig.personalizationData || {};

    /*
     * This method MUST be called by the Unified Shell's container only.
     * Constructs a new instance of the personalization adapter for the
     * "Sandbox" platform.
     * 
     * @param {object}
     *            oSystem the system served by the adapter
     * @returns {sap.ushell.adapters.demo.PersonalizationAdapter}
     * 
     * @class The Unified Shell's personalization adapter for the "Sandbox"
     *        platform.
     * 
     * @constructor
     * @since 1.15.0
     */
    sap.ushell.adapters.demo.PersonalizationAdapter = function (oSystem) {
        // rebind demo data with every invoke! 
        oDemoPersData = sap.ushell.shells.demo.fioriDemoConfig.personalizationData  || {};
    };

    sap.ushell.adapters.demo.PersonalizationAdapter = function (oSystem) {
        this._oPersData = oDemoPersData;
    };


    /*  private helper functions
     *  
     *  All store 
     * 
     */
    function readPersData(oPersData, oPersId) {
        var oValue, oValueWhole;
        oValueWhole = undefined;
        if (Object.hasOwnProperty.call(oPersData, oPersId.container)) {
            oValueWhole = oPersData[oPersId.container];
        }
        oValue = null;
        if (oValueWhole &&  typeof oValueWhole === "object" && Object.hasOwnProperty.call(oValueWhole, oPersId.item)) {
            oValue = JSON.parse(JSON.stringify(oValueWhole[oPersId.item])); // non existing item -->
        }
        return oValue;
    }

    function containsPersData(oPersData, oPersId) {
        var oValue, oValueWhole;
        oValueWhole = {};
        if (Object.hasOwnProperty.call(oPersData, oPersId.container)) {
            oValueWhole = oPersData[oPersId.container];
        }
        oValue = null;
        if (oValueWhole &&  typeof oValueWhole === "object" && Object.hasOwnProperty.call(oValueWhole, oPersId.item)) {
            return true;
        }
        return false;
    }

    function keysPersData(oPersData, oPersId) {
        var oValue, oValueWhole;
        oValueWhole = {};
        if (Object.hasOwnProperty.call(oPersData,oPersId.container)) {
            oValueWhole = oPersData[oPersId.container];
        }
        if (!oValueWhole || typeof oValueWhole !== "object") {
            return [];
        }
        return Object.keys(oValueWhole);
    }

    function writePersData(oPersData, oPersId, oValue) {
        var oValueWhole, bResult;
        oValue = JSON.parse(JSON.stringify(oValue));
        oValueWhole = undefined;
        if (Object.hasOwnProperty.call(oPersData, oPersId.container)) {
            oValueWhole = oPersData[oPersId.container];
        }
        if (!oValueWhole || typeof oValueWhole !== "object") {
            oValueWhole = {};
        }
        oValueWhole[oPersId.item] = oValue;
        oPersData[oPersId.container] = oValueWhole;
        bResult = true;
        return bResult;
    }

    function delPersData(oPersData, oPersId) {
        var oValue, oValueWhole, bResult;
        oValueWhole = {};
        if (Object.hasOwnProperty.call(oPersData, oPersId.container)) {
            oValueWhole = oPersData[oPersId.container];
        }
        if (!oValueWhole || typeof oValueWhole !== "object") {
            oValueWhole = {};
        }
        delete oValueWhole[oPersId.item];
        oPersData[oPersId.container] = oValueWhole;
        bResult = true;
        return bResult;
    }
    // ---- direct call interface - asynchronous mode ----

    /**
     * Reads a personalization data value.
     * 
     * @param {Object} oPersId 
     *           oPersid must be an object containing properties <code> { container : "xx", item : "yy" }</code> two string keys representing the key of the object
     * @returns {object} Promise object which provides the personalization
     *          value. Promise object done function: param {object} oValue JSON
     *          object containing the personalization value. If there is no
     *          personalization data for the item, null is returned. Promise
     *          object fail function: param {string} sMessage Error message
     * @since 1.15.0
     */
    sap.ushell.adapters.demo.PersonalizationAdapter.prototype.readPersData = function (oPersId) {
        var oDeferred = new jQuery.Deferred(),
            oValue = readPersData(this._oPersData, oPersId);
        oDeferred.resolve(oValue);
        return oDeferred.promise();

    };

    /**
     * Writes a personalization data value.
     * 
    * @param {Object} oPersId 
     *           oPersid must be an object containing properties <code> { container : "xx", item : "yy" }</code> two string keys representing the key of the object
     * @param {object}
     *            oValue JSON object containing the personalization value.
     * @returns {object} Promise object which returns if the saving was
     *          successful or erroneous. Promise object done function: no
     *          params. Promise object fail function: no params
     * @since 1.15.0
     */
    sap.ushell.adapters.demo.PersonalizationAdapter.prototype.writePersData = function (oPersId, oValue) {
        var oDeferred = new jQuery.Deferred(),
            bResult = writePersData(this._oPersData, oPersId, oValue);
        if (bResult) {
            oDeferred.resolve();
        } else {
            oDeferred.reject();
        }
        return oDeferred.promise();
    };

    /**
     * Deletes a personalization data value.
     * 
    * @param {Object} oPersId 
     *           oPersid must be an object containing properties <code> { container : "xx", item : "yy" }</code> two string keys representing the key of the object
     * @returns {object} Promise object which returns if the deletion was
     *          successful or erroneous. Promise object done function: no
     *          params. Promise object fail function: no params
     * @since 1.15.0
     */
    sap.ushell.adapters.demo.PersonalizationAdapter.prototype.delPersData = function (oPersId) {
        var oDeferred = new jQuery.Deferred(),
            bResult = delPersData(this._oPersData, oPersId);
        if (bResult) {
            oDeferred.resolve();
        } else {
            oDeferred.reject();
        }
        return oDeferred.promise();
    };

    /*
     * Factory methods for obtaining AdapterContainer objects
     * Note that deletion does not invalidate handed out containers 
     */

    // ---- Container interface - support of multiple synchronous operations
    // ----
    sap.ushell.adapters.demo.PersonalizationAdapter.prototype.getAdapterContainer = function (sContainerKey) {
        return new sap.ushell.adapters.demo.AdapterContainer(sContainerKey);
    };

    // ---- Container interface - support of multiple synchronous operations
    // ----
    /**
     * Remove the content of the given container key from the storage
     * 
     * Note: a previously obtained AdaterContainer for the instance is not invalidated
     * @returns a promise (though technically this is a synchronous op)
     */
    sap.ushell.adapters.demo.PersonalizationAdapter.prototype.delAdapterContainer = function (sContainerKey) {
        if (Object.hasOwnProperty.call(oDemoPersData, sContainerKey)) {
            delete oDemoPersData[sContainerKey];
        }
        var oDeferred = new jQuery.Deferred();
        oDeferred.resolve();
        return oDeferred.promise();
    };

    // --- Adapter Container ---
    sap.ushell.adapters.demo.AdapterContainer = function (sContainerKey) {
        this._sContainerKey = sContainerKey;
        this._oPersData = oDemoPersData;  // global! 
        this._oLocalStorage = false;
    };
    sap.ushell.adapters.demo.AdapterContainer.prototype.load = function () {
        var oDeferred = new jQuery.Deferred();
        this._oLocalStorage = true;
        oDeferred.resolve();
        return oDeferred.promise();
    };
    sap.ushell.adapters.demo.AdapterContainer.prototype.save = function () {
        var oDeferred = new jQuery.Deferred();
        oDeferred.resolve();
        return oDeferred.promise();
    };
    sap.ushell.adapters.demo.AdapterContainer.prototype.getItemKeys = function () {
        return keysPersData(this._oPersData, { container : this._sContainerKey });
    };
    sap.ushell.adapters.demo.AdapterContainer.prototype.containsItem = function (sItemKey) {
        return containsPersData(this._oPersData, { container : this._sContainerKey, item : sItemKey });
    };
    sap.ushell.adapters.demo.AdapterContainer.prototype.getItemValue = function (sItemKey) {
        return readPersData(this._oPersData, { container : this._sContainerKey, item : sItemKey });
    };
    sap.ushell.adapters.demo.AdapterContainer.prototype.setItemValue = function (sItemKey, oItemValue) {
        return writePersData(this._oPersData, { container : this._sContainerKey, item : sItemKey }, oItemValue);
    };
    sap.ushell.adapters.demo.AdapterContainer.prototype.delItem = function (sItemKey) {
        return delPersData(this._oPersData, { container : this._sContainerKey, item : sItemKey });
    };
}());

