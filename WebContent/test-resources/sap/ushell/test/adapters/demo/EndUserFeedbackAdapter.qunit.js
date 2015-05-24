(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-core');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-widget');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-mouse');
    jQuery.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-sortable');
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.ui.footerbar.ContactSupportButton");
    jQuery.sap.require("sap.ushell.UserActivityLog");

    module("sap.ushell.adapters.demo.EndUserFeedbackAdapter",
        {
            setup : function () {
                sap.ushell.bootstrap("demo");
                var oModel = new sap.ui.model.json.JSONModel({
                    currentState: {}
                });
                oModel.setProperty("/currentState/stateName", "home");
                this.oNavContainer = new sap.m.NavContainer({
                    id: "navContainer",
                    pages: []
                });
                this.oNavContainer.setModel(oModel);
                sap.ushell.UserActivityLog.activate();
            },
            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown : function () {
                delete sap.ushell.Container;
                this.oNavContainer.destroy();
            }
        }
        );

    asyncTest("Send Feedback", function () {
        var oEndUserFeedbackSrv = sap.ushell.Container.getService("EndUserFeedback"),
            oEndUserFeedbackStorage,
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
                userId : "",
                eMail : ""
            },
            oActualEndUserFeedbackData;

        oEndUserFeedbackSrv.sendFeedback(oInputEndUserFeedbackData).done(function (iNrOfFeedbacks) {
            start();
            ok(typeof iNrOfFeedbacks === "number", "sendFeedback returns a number.");
            equal(iNrOfFeedbacks, 333, "fixed number");
            oEndUserFeedbackStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session, "com.sap.ushell.adapters.demo.EndUserFeedback");
            oActualEndUserFeedbackData = JSON.parse(oEndUserFeedbackStorage.get(iNrOfFeedbacks));
            deepEqual(oActualEndUserFeedbackData, oExpectedEndUserFeedbackData, "Feedback data stored in session storage");
        }).fail(function (sMessage) {
            start();
            ok(false, "Create feedback failed: " + sMessage);
        });
    });
    asyncTest("Get legal text for end user feedback dialog", function () {
        var oEndUserFeedbackSrv = sap.ushell.Container.getService("EndUserFeedback"),
            oEndUserFeedbackStorage,
            sExpectedLegalText = "This is the legal text in the users language.",
            sActualLegalText;

        oEndUserFeedbackSrv.getLegalText().done(function (sLegalText) {
            start();
            ok(typeof sLegalText === "string", "getLegalText returns a string.");
            equal(sLegalText, "This is the legal text \n in the users language.\n with multiple line breaks.", "fixed text");
        }).fail(function (sMessage) {
            start();
            ok(false, "Cannot retrieve legal text: " + sMessage);
        });
    });


}());