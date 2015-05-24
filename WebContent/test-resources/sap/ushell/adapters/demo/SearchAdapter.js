// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview The Search adapter for the demo platform.
 *
 * @version @version@
 */
(function () {
    "use strict";
    /*global jQuery, sap, setTimeout */
    jQuery.sap.declare("sap.ushell.adapters.demo.SearchAdapter");

    window.sap.bc = window.sap.bc || {};
    window.sap.bc = {ina : {api: {sina: {properties: {systemType: "ABAP", startWithSearch : "false" , noSapClientFromUrl: true, noDefaultSina: true}}}}};
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.esh.api.release.sina");

    /**
     * 
     * @param oSystem
     * @returns {sap.ushell.adapters.abap.SearchAdapter}
     */
    sap.ushell.adapters.demo.SearchAdapter = function (oSystem) {

        this.isSearchAvailable = function () {
            var oDeferred = jQuery.Deferred();

            oDeferred.resolve(true);
            return oDeferred.promise();
        };

        this.getSina = function () {
            var self = this;
            if(!self.sina){
                var proxyProperties = {
                    demoMode : jQuery.sap.getModulePath("sap.ushell.adapters.demo.searchResults." + "record", ".json")
                };
                
                var proxy = new window.sap.bc.ina.api.sina.impl.inav2.proxy.Proxy(proxyProperties);
                var sys = new window.sap.bc.ina.api.sina.impl.inav2.system.ABAPSystem({'proxy':proxy});
                self.sina = window.sap.bc.ina.api.sina.getSina({system: sys});
                window.sap.bc.ina.api.sina = window.jQuery.extend({}, window.sap.bc.ina.api.sina, self.sina); // without extend the new global sina instance would overwrite every module after sap.bc.ina.sina !!!
            }
            return self.sina;
        };

    };
}());
