// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview The Unified Shell's personalization adapter for the sandbox.
 * 
 * The sandbox personalization adapter stores entries in the local storage under the key 
 * object under "com.sap.ushell.adapters.sandbox.Personalization"
 * individual propertybags identified by "container" 
 * store stringified JSON objects, whose keys are the "item"s 
 *
 * reflection is possible on all "item"s stored in a Container. 
 * reflection on the "container"s themselves are not possible
 * Addition and entries of the two stage key "container"/"item" is performed 
 * via modification of the corresponding object. 
 * 
 * 
 * 
 * @version
 * @version@
 */
(function () {
    "use strict";
    /*global jQuery, sap */
    /*jslint nomen: true*/
    jQuery.sap.declare("sap.ushell.adapters.sandbox.PersonalizationAdapter");

    jQuery.sap.require("jquery.sap.storage");

    /**
     * This method MUST be called by the Unified Shell's container only.
     * Constructs a new instance of the personalization adapter for the
     * "Sandbox" platform.
     * 
     * @param {object}
     *            oSystem the system served by the adapter
     * 
     * @class The Unified Shell's personalization adapter for the "Sandbox"
     *        platform.
     * 
     * @constructor
     * @since 1.15.0
     */
    sap.ushell.adapters.sandbox.PersonalizationAdapter = function (oSystem) {

    };


    var PersonalizationLocalStorageKey = "com.sap.ushell.adapters.sandbox.Personalization";

    /*  private helper functions
     *  
     *  All store 
     * 
     */
    function readPersData(oPersId) {
        var sValue, oValue, sValueWhole, oValueWhole, oDeferred, oLocalStorage;
        oDeferred = new jQuery.Deferred();
        oLocalStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local, PersonalizationLocalStorageKey);
        sValueWhole = oLocalStorage.get(oPersId.container);
        oValueWhole = JSON.parse(sValueWhole); // null --> null
        oValue = null;
        if (oValueWhole &&  typeof oValueWhole === "object" && Object.hasOwnProperty.call(oValueWhole, oPersId.item)) {
            sValue = oValueWhole[oPersId.item]; // non existing item -->
            oValue = JSON.parse(sValue); // null --> null
        }
        return oValue;
    }

    function containsPersData(oPersId) {
        var oValue, sValueWhole, oValueWhole, oLocalStorage;
        oLocalStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local, PersonalizationLocalStorageKey);
        sValueWhole = oLocalStorage.get(oPersId.container);
        oValueWhole = JSON.parse(sValueWhole); // null --> null
        oValue = null;
        if (oValueWhole &&  typeof oValueWhole === "object" && Object.hasOwnProperty.call(oValueWhole, oPersId.item)) {
            return true;
        }
        return false;
    }

    function keysPersData(oPersId) {
        var sValue, oValue, sValueWhole, oValueWhole, oLocalStorage;
        oLocalStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local, PersonalizationLocalStorageKey);
        sValueWhole = oLocalStorage.get(oPersId.container);
        oValueWhole = JSON.parse(sValueWhole); // null --> null
        if (!oValueWhole || typeof oValueWhole !== "object") {
            return [];
        }
        return Object.keys(oValueWhole);
    }

    function writePersData(oPersId, oValue) {
        var sValue, oLocalStorage, sValueWhole, oValueWhole, bResult;
        sValue = JSON.stringify(oValue);
        oLocalStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local,
                PersonalizationLocalStorageKey);
        sValueWhole = oLocalStorage.get(oPersId.container);
        oValueWhole = JSON.parse(sValueWhole);
        if (!oValueWhole || typeof oValueWhole !== "object") {
            oValueWhole = {};
        }
        oValueWhole[oPersId.item] = sValue;
        sValueWhole = JSON.stringify(oValueWhole);
        bResult = oLocalStorage.put(oPersId.container, sValueWhole);
        return bResult;
    }

    function delPersData(oPersId) {
        var oValueWhole, sValueWhole, oLocalStorage, bResult;
        oLocalStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local,
                PersonalizationLocalStorageKey);
        sValueWhole = oLocalStorage.get(oPersId.container);
        oValueWhole = JSON.parse(sValueWhole);
        if (!oValueWhole || typeof oValueWhole !== "object") {
            oValueWhole = {};
        }
        delete oValueWhole[oPersId.item];
        sValueWhole = JSON.stringify(oValueWhole);
        bResult = oLocalStorage.put(oPersId.container, sValueWhole);
        return bResult;
    }
    /**
     * Delete the local storage container for key oPersId.container
     */
    function delPersDataContainer(oPersId) {
        var oValueWhole, sValueWhole, oLocalStorage, bResult;
        oLocalStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local,
                PersonalizationLocalStorageKey);
        sValueWhole = oLocalStorage.get(oPersId.container);
        oLocalStorage.remove(oPersId.container);
        return true;
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
    sap.ushell.adapters.sandbox.PersonalizationAdapter.prototype.readPersData = function (oPersId) {
        var oDeferred = new jQuery.Deferred(),
            oValue = readPersData(oPersId);
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
    sap.ushell.adapters.sandbox.PersonalizationAdapter.prototype.writePersData = function (oPersId, oValue) {
        var oDeferred = new jQuery.Deferred(),
            bResult = writePersData(oPersId, oValue);
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
    sap.ushell.adapters.sandbox.PersonalizationAdapter.prototype.delPersData = function (oPersId) {
        var oDeferred = new jQuery.Deferred(),
            bResult = delPersData(oPersId);
        if (bResult) {
            oDeferred.resolve();
        } else {
            oDeferred.reject();
        }
        return oDeferred.promise();
    };

    // ---- Container interface - support of multiple synchronous operations
    // ----
    sap.ushell.adapters.sandbox.PersonalizationAdapter.prototype.getAdapterContainer = function (sContainerKey) {
        return new sap.ushell.adapters.sandbox.AdapterContainer(sContainerKey);
    };

    /**
     * Remove the content of the given container key from the storage
     * 
     * Note: a previously obtained AdaterContainer for the instance is not invalidated
     * @returns a promise (though technically this is a synchronous op)
     */
    sap.ushell.adapters.sandbox.PersonalizationAdapter.prototype.delAdapterContainer = function (sContainerKey) {
        delPersDataContainer({ container : sContainerKey });
        var oDeferred = new jQuery.Deferred();
        oDeferred.resolve();
        return oDeferred.promise();
    };

    // --- Adapter Container ---
    sap.ushell.adapters.sandbox.AdapterContainer = function (sContainerKey) {
        this._sContainerKey = sContainerKey;
        this._oLocalStorage = false;
    };
    sap.ushell.adapters.sandbox.AdapterContainer.prototype.load = function () {
        var oDeferred = new jQuery.Deferred();
        this._oLocalStorage = true;
        oDeferred.resolve();
        return oDeferred.promise();
    };
    sap.ushell.adapters.sandbox.AdapterContainer.prototype.save = function () {
        var oDeferred = new jQuery.Deferred();
        oDeferred.resolve();
        return oDeferred.promise();
    };
    sap.ushell.adapters.sandbox.AdapterContainer.prototype.getItemKeys = function () {
        return keysPersData({ container : this._sContainerKey });
    };
    sap.ushell.adapters.sandbox.AdapterContainer.prototype.containsItem = function (sItemKey) {
        return containsPersData({ container : this._sContainerKey, item : sItemKey });
    };
    sap.ushell.adapters.sandbox.AdapterContainer.prototype.getItemValue = function (sItemKey) {
        return readPersData({ container : this._sContainerKey, item : sItemKey });
    };
    sap.ushell.adapters.sandbox.AdapterContainer.prototype.setItemValue = function (sItemKey, oItemValue) {
        return writePersData({ container : this._sContainerKey, item : sItemKey }, oItemValue);
    };
    sap.ushell.adapters.sandbox.AdapterContainer.prototype.delItem = function (sItemKey) {
        return delPersData({ container : this._sContainerKey, item : sItemKey });
    };
}());