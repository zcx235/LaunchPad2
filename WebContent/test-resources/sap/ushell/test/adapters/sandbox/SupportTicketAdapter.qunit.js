(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    module("sap.ushell.adapters.sandbox.SupportTicketAdapter",
        {
            setup : function () {
                sap.ushell.bootstrap("sandbox");
            },
            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown : function () {
                delete sap.ushell.Container;
            }
        });

    asyncTest("Create ticket", function () {
        var oSupportTicketSrv = sap.ushell.Container.getService("SupportTicket"),
            oSupportTicketStorage,
            oExpectedSupportTicketData = {
                message: "Unit test message",
                details: "Unit test ticket details"
            },
            oActualSupportTicketData;

        oSupportTicketSrv.createTicket(oExpectedSupportTicketData).done(function (sTicketId) {
            start();
            ok(typeof sTicketId === "string", "Create ticket returns string-typed ticket id");
            oSupportTicketStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session, "com.sap.ushell.adapters.sandbox.SupportTicket");
            oActualSupportTicketData = JSON.parse(oSupportTicketStorage.get(sTicketId));
            deepEqual(oActualSupportTicketData, oExpectedSupportTicketData, "Support ticket data stored in session storage");
        }).fail(function (sMessage) {
            start();
            ok(false, "Create ticket failed: " + sMessage);
        });
    });

}());