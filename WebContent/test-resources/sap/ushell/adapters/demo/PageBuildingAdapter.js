// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview The Unified Shell's page building adapter for standalone demos.
 *
 * @version @version@
 */
(function () {
    "use strict";
    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.adapters.demo.PageBuildingAdapter");

    jQuery.sap.registerModulePath("sap.ui2.srvc.test",
        "/sap/public/bc/ui2/services/test/sap/ui2/srvc/test");
    jQuery.sap.require("sap.ui2.srvc.factory");
    jQuery.sap.require("sap.ui2.srvc.test.pbs");

    /**
     * This method MUST be called by the Unified Shell's container only.
     * Constructs a new instance of the page building adapter for standalone demos.
     *
     * @param {object} oSystem
     *   the system served by the adapter
     * @param {string} [sParameter]
     *   a parameter determining the scope (since 1.16.2)
     *
     * @class The Unified Shell's page building adapter for for standalone demos.
     *
     * @constructor
     * @see sap.ushell.services.PageBuilding
     * @since 1.15.0
     */
    sap.ushell.adapters.demo.PageBuildingAdapter = function (oSystem, sParameter) {
        var oFactory,
            sScope = "PERS";

        // BEWARE: constructor code below!

        /**
         * Returns the UI2 page building factory.
         * @returns {sap.ui2.srvc.Factory}
         *     the page building factory
         */
        this.getFactory = function () {
            return oFactory;
        };

        // constructor code -------------------------------------------------------

        if (sParameter === "CONF" || sParameter === "CUST") {
            sScope = sParameter;
        }
        oFactory = sap.ui2.srvc.createFactory("/~/", undefined, sScope === "PERS");
    };
}());
