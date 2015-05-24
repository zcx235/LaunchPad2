// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview The Unified Shell's launch page adapter for the 'sandbox' platform.
 *
 * @version @version@
 */
(function () {
    "use strict";
    /*global jQuery, sap, window */
    jQuery.sap.declare("sap.ushell.adapters.sandbox.LaunchPageAdapter");

    /**
     * This method MUST be called by the Unified Shell's container only.
     * Constructs a new instance of the launch page adapter for the 'sandbox'
     * platform.
     * <p>
     * The sandbox platform does not support any page building functionality,
     * but implements this adapter in order to fail gracefully.
     *
     * @param {object}
     *            oSystem the system served by the adapter
     *
     * @class The Unified Shell's launch page adapter for the 'sandbox'
     *        platform.
     *
     * @constructor
     * @see sap.ushell.services.LaunchPage
     * @since 1.17.0
     */
    sap.ushell.adapters.sandbox.LaunchPageAdapter = function (oSystem) {

        this.setTileVisible = function (oTile, bNewVisible) {
            throw new Error("This feature is not supported for the sandbox platform");
        };

        /*
         * Returns a rejected promise.
         */
        function rejectedPromise() {
            var oDeferred = jQuery.Deferred();
            oDeferred.reject("This feature is not supported for the sandbox platform");
            return oDeferred.promise();
        }

        this.addBookmark = function () {
            return rejectedPromise();
        };

        this.countBookmarks = function (sUrl) {
            return rejectedPromise();
        };

        this.deleteBookmarks = function (sUrl) {
            return rejectedPromise();
        };

        this.updateBookmarks = function (sUrl, oParameters) {
            return rejectedPromise();
        };
    };
}());
