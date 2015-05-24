 // Copyright (c) 2014 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.SupportTicket and customizable
 * extensions
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
      notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
      jQuery, sap, sinon, window, hasher */

    module(
        "sap.ushell.services.SupportTicket",
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

    test("service disabled by default - factory instantiation", function () {
        var oService = null;

        sap.ushell.bootstrap("demo");

        oService = sap.ushell.Container.getService("SupportTicket");
        equal(oService.isEnabled(), false);
    });

    test("service disabled by default - constructor call", function () {
        jQuery.sap.require("sap.ushell.services.SupportTicket");
        var oService = new sap.ushell.services.SupportTicket();

        equal(oService.isEnabled(), false);
    });

    test("service enabled if set in bootstrap config", function () {
        var oService = null;

        window["sap-ushell-config"] = {
            services: {
                SupportTicket: {
                    config: {
                        enabled: true
                    }
                }
            }
        };
        sap.ushell.bootstrap("demo");

        oService = sap.ushell.Container.getService("SupportTicket");
        equal(oService.isEnabled(), true);
    });

}());
