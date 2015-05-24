// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview The SupportTicket adapter for the demo platform.
 *
 * @version @version@
 */
(function () {
    "use strict";
    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.adapters.demo.SupportTicketAdapter");
    jQuery.sap.require("jquery.sap.storage");

    sap.ushell.adapters.demo.EndUserFeedbackAdapter = function (oSystem) {

        var SessionStorageKey = "com.sap.ushell.adapters.demo.EndUserFeedback";

        /**
         * Create a feedback and store in Session Storage
         *
         * @param {JSON} oFeedbackObject
         * JSON object containing the input fields required for the support ticket
         */
        this.sendFeedback = function (oFeedbackObject) {
            var oDeferred,
                oSessionStorage,
                iNrOfFeedbacks;

            iNrOfFeedbacks = 333;
            oDeferred = new jQuery.Deferred();

            sap.ui2.srvc.call(function () {
                oSessionStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session, SessionStorageKey);
                if (oSessionStorage.put(iNrOfFeedbacks, JSON.stringify(oFeedbackObject)) === true) {
                    jQuery.sap.log.info("User Feedback " + JSON.stringify(oFeedbackObject) + " has been sent.");
                    oDeferred.resolve(iNrOfFeedbacks);
                } else {
                    oDeferred.reject("Failed to save end user feedback");
                }
            }, sap.ui2.srvc.test.onError, true);

            return oDeferred.promise();
        };

        this.getLegalText = function () {
            var oDeferred,
                oSessionStorage,
                sLegalText;

            sLegalText = "This is the legal text \n in the users language.\n with multiple line breaks.";
            oDeferred = new jQuery.Deferred();

            sap.ui2.srvc.call(function () {
                oSessionStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session, SessionStorageKey);
                jQuery.sap.log.info("Legal text " + sLegalText + " for user feedback dialog has been sent.");
                oDeferred.resolve(sLegalText);

            }, sap.ui2.srvc.test.onError, true);

            return oDeferred.promise();
        };

        /**
         * Checks if the service is enabled.
         * <p>
         * The service is only enabled if getLegalText can be invoked and returns a valid response
         *
         * @return {object} promise, for the demo adapter always resolved 
         *
         * @public
         * @since 1.25.1
         */
        this.isEnabled = function () {
            var oDeferred = new jQuery.Deferred();
            sap.ui2.srvc.call(function () {
                oDeferred.resolve();
            });
            return oDeferred.promise();
        };
    };
}());