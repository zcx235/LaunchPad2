// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview The Unified Shell's bootstrap code for development sandbox scenarios.
 *
 * @version @version@
 */
(function () {
    "use strict";
    /*global jQuery, sap, window */

    // get the path of our own script; module paths are registered relative to this path, not relative to the HTML page
    // we introduce an ID for the bootstrap script, similar to UI5; allows to reference it later as well
    function getBootstrapScriptPath() {
        var oScripts, oBootstrapScript, sBootstrapScriptUrl, sBootstrapScriptPath;
        oBootstrapScript = window.document.getElementById("sap-ushell-bootstrap");
        if (!oBootstrapScript) {
            // fallback to last script element, if no ID set (should work on most browsers) 
            oScripts = window.document.getElementsByTagName('script');
            oBootstrapScript = oScripts[oScripts.length - 1];
        }
        sBootstrapScriptUrl = oBootstrapScript.src;
        sBootstrapScriptPath = sBootstrapScriptUrl.split('?')[0].split('/').slice(0, -1).join('/') + '/';
        return sBootstrapScriptPath;
    }
    var sBootstrapScriptPath = getBootstrapScriptPath();

    // ushell bootstrap is registered as sapui5 boot task; would not be required for the sandbox case, but we stick to the ABAP pattern for consistency
    // on ABAP, this is required, because some ui5 settings (e.g. theme) are retrieved from the back-end and have to be set early in the ui5 bootstrap 
    window['sap-ui-config'] = {
        "xx-bootTask": function (fnCallback) {
            // since the sandbox is part of test-resources, we have to register the module paths explicitly
            jQuery.sap.registerModulePath("sap.ushell.adapters.sandbox", sBootstrapScriptPath + "../adapters/sandbox/");
            jQuery.sap.registerModulePath("sap.ushell.adapters.demo", sBootstrapScriptPath + "../adapters/demo/");
            jQuery.sap.registerModulePath("sap.ushell.shells.demo", sBootstrapScriptPath + "../shells/demo/");
            jQuery.sap.registerModulePath("sap.ushell.renderers.fiorisandbox", sBootstrapScriptPath + "../renderers/fiorisandbox/");

            jQuery.sap.require("sap.ushell.services.Container");
            // tell SAPUI5 that this boot task is done once the container has loaded
            sap.ushell.bootstrap("sandbox").done(fnCallback);
            //TODO what about .fail()?
        }
    };
}());
