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

    module("sap.ushell.adapters.demo.SupportTicketAdapterTest",
        {
            setup : function () {
                sap.ushell.bootstrap("demo");
                
                var oModel = new sap.ui.model.json.JSONModel({
                	currentState:{}
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


    test("Check user input text received", function () {
        // avoid creating the real demo SupportTicketAdapter
        jQuery.sap.declare("sap.ushell.adapters.demo.SupportTicketAdapter");
        sap.ushell.adapters.demo.SupportTicketAdapter = function () {
            this.createTicket = function (oSupportObject) {
                ok(oSupportObject.text, 'new test');

                var oDeferred = new jQuery.Deferred(),
                sTicketId = "1234567";

                oDeferred.resolve(sTicketId);
                return oDeferred.promise();
            };
        };

        var supportDialog = new sap.ushell.ui.footerbar.ContactSupportButton();
        supportDialog.showContactSupportDialog();
        var oTextArea = sap.ui.getCore().byId("textArea"),
            oSendButton = sap.ui.getCore().byId("contactSupportSendBtn");

        oTextArea.setValue("new test");
        oSendButton.firePress();
        supportDialog.oDialog.destroy();
    });
    
    test("Check client context data - error collection", function () {
        // avoid creating the real demo SupportTicketAdapter
        jQuery.sap.declare("sap.ushell.adapters.demo.SupportTicketAdapter");
        sap.ushell.adapters.demo.SupportTicketAdapter = function () {
            this.createTicket = function (oSupportObject) {
                var sClientContext = oSupportObject.clientContext,
                    logs = sClientContext.userLog,
                    foundOne = 0, foundTwo = 0,
                    logIndex;
                for (logIndex in logs) {
                    var log = logs[logIndex];
                    if (log.type === 'ERROR') {
                    	if (log.messageText.indexOf("test error one") != -1) {
                            foundOne = 1;
                        } else if (log.messageText.indexOf("test error two") != -1) {
                            foundTwo = 1;
                        }
                    }
                }
                ok(foundOne && foundTwo, "not found");
                var oDeferred = new jQuery.Deferred(),
                    sTicketId = "1234567";

                oDeferred.resolve(sTicketId);
                return oDeferred.promise();
            };
        };
      //Invoke two errors
        jQuery.sap.log.error("test error one");
        jQuery.sap.log.error("test error two");
        
        var supportDialog = new sap.ushell.ui.footerbar.ContactSupportButton();
        supportDialog.showContactSupportDialog();
        var oSendButton = sap.ui.getCore().byId("contactSupportSendBtn");
        oSendButton.firePress();
        supportDialog.oDialog.destroy();
    });
}());