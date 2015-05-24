// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
(function () {
    "use strict";
    /* module, ok, test, jQuery, sap */

    jQuery.sap.require("sap.ushell.ui.footerbar.LoginDetailsButton");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");

    var LoginDetailsDialog;

    module("sap.ushell.ui.footerbar.LoginDetailsButton", {
        /**
         * This method is called before each test
         */
        setup: function () {
            sap.ushell.bootstrap("demo");
            LoginDetailsDialog = new sap.ushell.ui.footerbar.LoginDetailsButton();
        },
        /**
         * This method is called after each test. Add every restoration code here
         * 
         */
        teardown: function () {
            LoginDetailsDialog.destroy();
            delete sap.ushell.Container;
        }
    });

    test("Constructor Test", function () {
        ok(LoginDetailsDialog.getIcon() == "sap-icon://person-placeholder" , "Check dialog icon");
        ok(LoginDetailsDialog.getProperty("width") == "100%" , "Check dialog width");
        ok(LoginDetailsDialog.getText("text") == sap.ushell.resources.i18n.getText("userPreferences") , "Check dialog title");
        ok(LoginDetailsDialog.getTooltip("text") == sap.ushell.resources.i18n.getText("userPreferences_tooltip") , "Check dialog tooltip");
    });

    test("Login Details Button disabled Test", function () {
        //Re-instantiate "LoginDetailsDialog" to test it when the container is undefined.
        LoginDetailsDialog.destroy();
        sap.ushell.Container = undefined;
        LoginDetailsDialog = new sap.ushell.ui.footerbar.LoginDetailsButton();

        ok(LoginDetailsDialog.getEnabled() === false , "the button is disabled");
    });

    test("restore user preferences Test", function () {

        var user = sap.ushell.Container.getUser(),
            initialThemeValue = "theme3";

        var loginDialogStub = sinon.stub(LoginDetailsDialog, "showLoginDetailsDialog", function(){
            this.userInfoService = sap.ushell.Container.getService("UserInfo");
            this.oUser = this.userInfoService.getUser();
            this.translationBundle = sap.ushell.resources.i18n;
        });

        var okDialogStub = sinon.stub(LoginDetailsDialog, "_dialogOkButtonHandler", function(){
            this.oCore = sap.ui.getCore();
            var coreStub = sinon.stub(this.oCore, "applyTheme", function(){});
        });

        //Set an initial theme
        user.setTheme(initialThemeValue);
        user.resetChangedProperties();
        //Change theme.
        user.setTheme("theme4");
        LoginDetailsDialog.showLoginDetailsDialog();
        LoginDetailsDialog._dialogOkButtonHandler();
        LoginDetailsDialog._restoreUserPreferencesProperties("");
        loginDialogStub.restore();
        okDialogStub.restore();

        ok(user.getTheme() === initialThemeValue);
    });
}());
