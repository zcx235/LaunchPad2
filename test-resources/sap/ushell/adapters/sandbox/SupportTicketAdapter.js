// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview The SupportTicket adapter for the Sandbox platform.
 *
 * @version @version@
 */
(function () {
    "use strict";
    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.adapters.sandbox.SupportTicketAdapter");
    jQuery.sap.require("jquery.sap.storage");

    sap.ushell.adapters.sandbox.SupportTicketAdapter = function (oSystem) {

        var SessionStorageKey = "com.sap.ushell.adapters.sandbox.SupportTicket";

        /**
         * Create a support ticket and store in Session Storage
         *
         * @param {JSON} oSuportObject
         * JSON object containing the input fields required for the support ticket
         */
        this.createTicket = function (oSuportObject) {

            var oDeferred,
                oSessionStorage,
                sTicketId,
                date = new Date();

            sTicketId = date.toLocaleString();
            oDeferred = new jQuery.Deferred();

            oSessionStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session, SessionStorageKey);
            if (oSessionStorage.put(sTicketId, JSON.stringify(oSuportObject)) === true) {
                oDeferred.resolve(sTicketId);
            } else {
                oDeferred.reject("Failed to save Support Ticket");
            }
            return oDeferred.promise();
        };
    };
}());