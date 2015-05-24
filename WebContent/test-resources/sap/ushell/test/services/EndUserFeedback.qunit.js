 // Copyright (c) 2014 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.EndUserFeedback and customizable
 * extensions
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
      notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
      jQuery, sap, sinon, window, hasher */

    jQuery.sap.require("sap.ushell.resources");

    module(
        "sap.ushell.services.EndUserFeedback",
        {
            setup : function () {
            },
            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown : function () {
                window["sap-ushell-config"] = {};
                delete sap.ushell.Container;
            }
        }
    );

    asyncTest("service disabled by default - factory instantiation", function () {
        var oService = null;

        sap.ushell.bootstrap("demo");

        oService = sap.ushell.Container.getService("EndUserFeedback");
        oService.isEnabled()
            .fail(function () {
                start();
                ok("is default disabled!");
            })
            .done(sap.ui2.srvc.test.onError);
    });

    test("service disabled by default - constructor call", function () {
        jQuery.sap.require("sap.ushell.services.EndUserFeedback");
        var oService = new sap.ushell.services.EndUserFeedback();

        oService.isEnabled()
            .fail(function () {
                start();
                ok("is default disabled!");
            })
            .done(sap.ui2.srvc.test.onError);
    });

    test("service enabled if set in bootstrap config", function () {
        var oService = null;

        window["sap-ushell-config"] = {
            services: {
                EndUserFeedback: {
                    config: {
                        enabled: true
                    }
                }
            }
        };
        sap.ushell.bootstrap("demo");

        oService = sap.ushell.Container.getService("EndUserFeedback");
        oService.isEnabled()
            .done(function () {
                start();
                ok("service is enabled!");
            })
            .fail(sap.ui2.srvc.test.onError);
    });

    asyncTest("Send Feedback - Anonymous true", function () {
        var oTestAdapter,
            oAdapterSendFeedbackSpy,
            oEndUserFeedbackSrv,
            oInputEndUserFeedbackData = {
                feedbackText: "Unit test feedback message",
                ratings: [
                    {
                        questionId: "Q10",      // length max. 32 | type String
                        value: 3                 //rating from 1..5 | type Integer
                    }
                ],
                clientContext: {
                    userDetails : {
                        userId : "Hugo001",
                        eMail : "hugo@nodomain.com"
                    },
                    navigationData: {
                        formFactor: "desktop",
                        applicationInformation: {
                            url: "theUrl",
                            additionalInformation : "aaa",
                            applicationType : "URL"
                        }
                    }
                },
                isAnonymous: true
            },
            oExpectedEndUserFeedbackData = {
                feedbackText: "Unit test feedback message",
                ratings: [
                    {
                        questionId: "Q10",      // length max. 32 | type String
                        value: 3                 //rating from 1..5 | type Integer
                    }
                ],
                additionalInformation : "aaa",
                applicationType : "URL",
                url: "theUrl",
                formFactor: "desktop",
                isAnonymous: true,
                userId : "", //Should be blank in case isAnonymous is true
                eMail : "" //Should be blank in case isAnonymous is true
            },
            oActualEndUserFeedbackData;

        /**
         * overwrites the function of the EnduserFeedback adapter
         *
         * @param {JSON} oFeedbackObject
         * JSON object containing the input fields required for the EndUserFeedback
         */
        oTestAdapter = {};
        oTestAdapter.sendFeedback = function (oFeedbackObject) {
            var oDeferred, iNrOfFeedbacks = 333;
            oDeferred = new jQuery.Deferred();

            sap.ui2.srvc.call(function () {
                oDeferred.resolve(iNrOfFeedbacks);
            }, sap.ui2.srvc.test.onError, true);
            return oDeferred.promise();
        };

        oEndUserFeedbackSrv = new sap.ushell.services.EndUserFeedback(oTestAdapter);
        oAdapterSendFeedbackSpy = sinon.spy(oTestAdapter, "sendFeedback");
        oEndUserFeedbackSrv.sendFeedback(oInputEndUserFeedbackData).done(function (iNrOfFeedbacks) {
            start();
            ok(typeof iNrOfFeedbacks === "number", "sendFeedback returns a number.");
            equal(iNrOfFeedbacks, 333, "fixed number");
            oActualEndUserFeedbackData = oAdapterSendFeedbackSpy.args[0][0];
            deepEqual(oActualEndUserFeedbackData, oExpectedEndUserFeedbackData, "Feedback data stored in session storage");
        }).fail(function (sMessage) {
            start();
            ok(false, "Create feedback failed: " + sMessage);
        });
        ok(oAdapterSendFeedbackSpy.calledOnce, "Method sendFeedback of EndUserFeedback service has been called ");
    });

}());
