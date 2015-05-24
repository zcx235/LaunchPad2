// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
(function () {
    "use strict";
    /* module, ok, test, jQuery, sap */

    jQuery.sap.require("sap.ushell.ui.footerbar.LogoutButton");	
    jQuery.sap.require("sap.ushell.resources");

    module("sap.ushell.ui.footerbar.LogoutButton", {
    	/**
         * This method is called before each test
         */
    	setup: function () {
    		sap.ushell.bootstrap("demo");
        },
        /**
         * This method is called after each test. Add every restoration code here
         * 
         */
        teardown: function () {
        	delete sap.ushell.Container;
        }
    });

    test("Constructor Test", function () {
    	this.translationBundle = sap.ushell.resources.i18n;
    	var logoutButton = new sap.ushell.ui.footerbar.LogoutButton();
        ok(logoutButton.getIcon() == "sap-icon://log" , "Check dialog icon");
        ok(logoutButton.getProperty("width") == "100%" , "Check dialog width");
        ok(logoutButton.getText("text") == this.translationBundle.getText("logoutBtn_title") , "Check dialog title");
        ok(logoutButton.getTooltip("text") == this.translationBundle.getText("logoutBtn_tooltip") , "Check dialog tooltip"); 
    });
    
    test("Login Details Button disabled Test", function () {
    	sap.ushell.Container = undefined;
    	var LoginDetailsDialog = new sap.ushell.ui.footerbar.LoginDetailsButton();
    	ok(LoginDetailsDialog.getEnabled() === false , "the button is disabled"); 
    });
}());
