// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview The NavTargetResolution adapter for the demo platform.
 *
 * @version @version@
 */
(function () {
    "use strict";
    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.adapters.demo.NavTargetResolutionAdapter");

    jQuery.sap.require("sap.ui.thirdparty.datajs");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    
    /**
     * This demo adapter reads its configuration from the demo config, where the target applications are defined.
     * 
     * @param oSystem
     * @returns {sap.ushell.adapters.abap.NavTargetResolutionAdapter}
     */
    sap.ushell.adapters.demo.NavTargetResolutionAdapter = function (oSystem) {

    	var oApplications = sap.ushell.shells.demo.fioriDemoConfig.applications;

        this.resolveHashFragment = function (sHashFragment) {
            var oDeferred = new jQuery.Deferred();

            if (sHashFragment && sHashFragment.charAt(0) !== "#") {
                throw new sap.ushell.utils.Error("Hash fragment expected",
                        "sap.ushell.renderers.minimal.Shell");
            }
            sHashFragment = sHashFragment.substring(1);
            if (!sHashFragment) {
                oDeferred.resolve(undefined);
            } else {
                jQuery.sap.log.info("Hash Fragment: " + sHashFragment);
                var oResult = oApplications[sHashFragment];
                if (oResult) {
                    oDeferred.resolve(oResult);
                } else {
                    oDeferred.reject("Could not resolve link '" + sHashFragment + "'");
                }
            }
            return oDeferred.promise();
        };


        this.getSemanticObjectLinks = function(sSemanticObject) {
            var oDeferred = new jQuery.Deferred();

            if (!sSemanticObject) {
                oDeferred.resolve(undefined);
            }
            else {
                jQuery.sap.log.info("getSemanticObjectLinks: " + sSemanticObject);
                var intent,
                    oResult = [],
                    i = 0;
                for(intent in oApplications){
                	if (intent.substring(0, intent.indexOf('-')) === sSemanticObject) {
                		oResult[i] = oApplications[intent];
                		oResult[i].id = intent;
                		i++;
                	}
                }
                if (oResult) {
                	oDeferred.resolve(oResult);
                } else {
                	oDeferred.reject("Could not get links for  '" + sSemanticObject + "'");
                }
            }
            return oDeferred.promise();
        };
    };
}());
