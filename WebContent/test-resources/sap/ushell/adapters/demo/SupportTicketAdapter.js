// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview The SupportTicket adapter for the Sandbox platform.
 *
 * @version @version@
 */
(function () {
    "use strict";
    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.adapters.demo.SupportTicketAdapter");

    sap.ushell.adapters.demo.SupportTicketAdapter = function (oSystem) {

        this.createTicket = function (oSuportObject) {
            var oDeferred = new jQuery.Deferred(),
            sTicketId = "1234567";

            oDeferred.resolve(sTicketId);
            return oDeferred.promise();
        };

    };
}());
