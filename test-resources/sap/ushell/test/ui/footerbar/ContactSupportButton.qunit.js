// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
(function () {
    "use strict";
    /*global module, ok, test, jQuery, sap */

    jQuery.sap.require("sap.ushell.ui.footerbar.ContactSupportButton");
    jQuery.sap.require("sap.ushell.resources");

    module("sap.ushell.ui.footerbar.ContactSupportButton", {
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
        var ContactSupportDialog = new sap.ushell.ui.footerbar.ContactSupportButton();
        ok(ContactSupportDialog.getIcon() === "sap-icon://email", "Check dialog icon");
        ok(ContactSupportDialog.getProperty("width") === "100%", "Check dialog width");
        ok(ContactSupportDialog.getText("text") === sap.ushell.resources.i18n.getText("contactSupportBtn"), "Check dialog title");
        ok(ContactSupportDialog.getTooltip("text") === sap.ushell.resources.i18n.getText("contactSupportBtn_tooltip"), "Check dialog tooltip");
    });

    test("showContactSupportDialog Test", function () {
        var contactSupportDialog = new sap.ushell.ui.footerbar.ContactSupportButton();
        //Show the dialog
        contactSupportDialog.showContactSupportDialog();

        //Get the contact support dialog content form
        var dialogForm = sap.ui.getCore().byId('ContactSupportDialog'),
            dialogFormContent = dialogForm.getContent();


        var ui5Version = (sap.ui.version || "") + (' (' + (sap.ui.buildinfo.buildtime || "") + ')') || '',
            userAgent = navigator.userAgent || '',
            simpleFormTopContent,
            simpleFormBottomContent,
            translationBundle = sap.ushell.resources.i18n;

        // check buttons
        ok(dialogForm.getLeftButton() === 'contactSupportSendBtn', "Check send button");
        ok(dialogForm.getRightButton() === 'contactSupportCancelBtn', "Check cancel button");

        // check content
        ok(dialogFormContent[0].getMetadata()._sClassName === 'sap.ui.layout.form.SimpleForm', "Check top simple form");
        ok(dialogFormContent[0].getId() === 'topForm', "Check top simple form id");
        ok(dialogFormContent[0].getEditable() === false, "Check top simple form is editable");
        // check top content
        simpleFormTopContent = dialogFormContent[0].getContent();
        ok(simpleFormTopContent !== undefined, "Check top simple form content");
        ok(simpleFormTopContent[0].getMetadata()._sClassName === "sap.m.TextArea", "Check top simple form content - TextArea");
        ok(simpleFormTopContent[0].getId() === "textArea", "Check top simple form content - TextArea id");
        ok(simpleFormTopContent[0].getPlaceholder() === translationBundle.getText("txtAreaPlaceHolderHeader"), "Check top simple form content - TextArea placeholder");
        
        ok(dialogFormContent[1].getMetadata()._sClassName === 'sap.ui.layout.form.SimpleForm', "Check bottom simple form");
        ok(dialogFormContent[1].getId() === 'bottomForm', "Check bottom simple form id");
        ok(dialogFormContent[1].getEditable() === false, "Check bottom simple form is editable");
        // check bottom content
        simpleFormBottomContent = dialogFormContent[1].getContent();
        ok(simpleFormBottomContent !== undefined, "Check bottom simple form content");
        ok(simpleFormBottomContent[0].getMetadata()._sClassName === "sap.m.Link", "Check bottom simple form content - link");
        ok(simpleFormBottomContent[0].getText() === translationBundle.getText("technicalDataLink"), "Check bottom simple form content - link text");

        //Destroy the contact support dialog
        sap.ui.getCore().byId('ContactSupportDialog').destroy();
    });

    test("check bottom form content", function () {
        var contactSupportDialog = new sap.ushell.ui.footerbar.ContactSupportButton(),
            simpleFormBottomContent,
            translationBundle = sap.ushell.resources.i18n;

        //Show the dialog
        contactSupportDialog.showContactSupportDialog();
        // click on the link to open bottom form  
        contactSupportDialog._embedLoginDetailsInBottomForm();

        var dialogFormContent = sap.ui.getCore().byId('ContactSupportDialog').getContent(),
            applicationInformation = contactSupportDialog.oClientContext.navigationData.applicationInformation;

        // get bottom content
        ok(dialogFormContent[1].getMetadata()._sClassName === 'sap.ui.layout.form.SimpleForm', "Check bottom simple form with technical info");
        ok(dialogFormContent[1].getId() === "technicalInfoBox", "Check bottom simple form id");
        ok(dialogFormContent[1].getEditable() === false, "Check bottom simple form is editable");
        simpleFormBottomContent = dialogFormContent[1].getContent();

        ok(simpleFormBottomContent[0].getMetadata()._sClassName === 'sap.m.Text', "Check form field loginDetails");
        ok(simpleFormBottomContent[0].getText() === translationBundle.getText("loginDetails"), "Check form field value loginDetails");
        ok(simpleFormBottomContent[1].getMetadata()._sClassName === 'sap.m.Label', "Check form field userFld");
        ok(simpleFormBottomContent[1].getText() === translationBundle.getText("userFld"), "Check form field value userFld");
        ok(simpleFormBottomContent[2].getMetadata()._sClassName === 'sap.m.Text', "Check form field userDetails.fullName");
        ok(simpleFormBottomContent[2].getText() === (contactSupportDialog.oClientContext.userDetails.fullName || ""), "Check form field value userDetails.fullName");
        ok(simpleFormBottomContent[3].getMetadata()._sClassName === 'sap.m.Label', "Check form field serverFld");
        ok(simpleFormBottomContent[3].getText() === translationBundle.getText("serverFld"), "Check form field value serverFld");
        ok(simpleFormBottomContent[4].getMetadata()._sClassName === 'sap.m.Text', "Check form field server");
        ok(simpleFormBottomContent[4].getText() === window.location.host, "Check form field value server");
        ok(simpleFormBottomContent[5].getMetadata()._sClassName === 'sap.m.Label', "Check form field languageFld");
        ok(simpleFormBottomContent[5].getText() === translationBundle.getText("languageFld"), "Check form field value languageFld");
        ok(simpleFormBottomContent[6].getMetadata()._sClassName === 'sap.m.Text', "Check form field Language");
        ok(simpleFormBottomContent[6].getText() === (contactSupportDialog.oClientContext.Language || ""), "Check form field value Language");
        ok(simpleFormBottomContent[7].getMetadata()._sClassName === 'sap.m.Text', "Check form field space");
        ok(simpleFormBottomContent[7].getText() === '', "Check form field value space");
        ok(simpleFormBottomContent[8].getMetadata()._sClassName === 'sap.m.Text', "Check form field navigationDataFld");
        ok(simpleFormBottomContent[8].getText() === translationBundle.getText("navigationDataFld"), "Check form field value navigationDataFld");
        ok(simpleFormBottomContent[9].getMetadata()._sClassName === 'sap.m.Label', "Check form field hashFld");
        ok(simpleFormBottomContent[9].getText() === translationBundle.getText("hashFld"), "Check form field value hashFld");
        ok(simpleFormBottomContent[10].getMetadata()._sClassName === 'sap.m.Text', "Check form field navigation hash");
        ok(simpleFormBottomContent[10].getText() === (contactSupportDialog.oClientContext.navigationData.navigationHash || ""), "Check form field value navigation hash");
        ok(simpleFormBottomContent[11].getMetadata()._sClassName === 'sap.m.Text', "Check form field space");
        ok(simpleFormBottomContent[11].getText() === "", "Check form field value space");
        ok(simpleFormBottomContent[12].getMetadata()._sClassName === 'sap.m.Text', "Check form field applicationInformationFld");
        ok(simpleFormBottomContent[12].getText() === translationBundle.getText("applicationInformationFld"), "Check form field value applicationInformationFld");
        ok(simpleFormBottomContent[13].getMetadata()._sClassName === 'sap.m.Label', "Check form field applicationTypeFld");
        ok(simpleFormBottomContent[13].getText() === translationBundle.getText("applicationTypeFld"), "Check form field value applicationTypeFld");
        ok(simpleFormBottomContent[14].getMetadata()._sClassName === 'sap.m.Text', "Check form field application type");
        ok(simpleFormBottomContent[14].getText() === ((applicationInformation && applicationInformation.applicationType) || ""), "Check form field value application type");
        ok(simpleFormBottomContent[15].getMetadata()._sClassName === 'sap.m.Label', "Check form field urlFld");
        ok(simpleFormBottomContent[15].getText() === translationBundle.getText("urlFld"), "Check form field value urlFld");
        ok(simpleFormBottomContent[16].getMetadata()._sClassName === 'sap.m.Text', "Check form field url");
        ok(simpleFormBottomContent[16].getText() === ((applicationInformation && applicationInformation.url) || ""), "Check form field value url");
        ok(simpleFormBottomContent[17].getMetadata()._sClassName === 'sap.m.Label', "Check form field additionalInfoFld");
        ok(simpleFormBottomContent[17].getText() === translationBundle.getText("additionalInfoFld"), "Check form field value additionalInfoFld");
        ok(simpleFormBottomContent[18].getMetadata()._sClassName === 'sap.m.Text', "Check form field additional info");
        ok(simpleFormBottomContent[18].getText() === ((applicationInformation && applicationInformation.additionalInformation) || ""), "Check form field value additional info");

        //Destroy the about dialog
        sap.ui.getCore().byId('ContactSupportDialog').destroy();
    });

    test("contact suppot button disabled", function () {
        sap.ushell.Container = undefined;
        var contactSupportDialog = new sap.ushell.ui.footerbar.ContactSupportButton();
        ok(contactSupportDialog.getEnabled() === false, "the button is disabled");
    });

    test("Check bottom form content with email", function () {
        var translationBundle = sap.ushell.resources.i18n,
            oClientContext = sap.ushell.UserActivityLog.getMessageInfo(),
            messageInfoStub = sinon.stub(sap.ushell.UserActivityLog, "getMessageInfo", function () {
                oClientContext.userDetails.eMail = 'aaa@bbb.com';

                return oClientContext;
            }),
            contactSupportDialog = new sap.ushell.ui.footerbar.ContactSupportButton(),
            dialogFormContent,
            simpleFormBottomContent;

        //Show the dialog
        contactSupportDialog.showContactSupportDialog();
        // click on the link to open bottom form
        contactSupportDialog._embedLoginDetailsInBottomForm();

        dialogFormContent = sap.ui.getCore().byId('ContactSupportDialog').getContent();
        simpleFormBottomContent = dialogFormContent[1].getContent();
        ok(simpleFormBottomContent[5].getMetadata()._sClassName === 'sap.m.Label', "Check form field eMailFld");
        ok(simpleFormBottomContent[5].getText() === translationBundle.getText("eMailFld"), "Check form field value eMailFld");
        ok(simpleFormBottomContent[6].getMetadata()._sClassName === 'sap.m.Text', "Check form field mail");
        ok(simpleFormBottomContent[6].getText() === (oClientContext.userDetails.eMail), "Check form field value mail");
        messageInfoStub.restore();

        //Destroy the about dialog
        sap.ui.getCore().byId('ContactSupportDialog').destroy();
    });
}());
