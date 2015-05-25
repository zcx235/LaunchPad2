// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview The UserInfo adapter for the demo platform.
 *
 * @version @version@
 */
(function () {
    "use strict";
    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.adapters.demo.UserInfoAdapter");

    jQuery.sap.require("sap.ui.thirdparty.datajs");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");

    /**
     * This demo adapter reads its configuration from the demo config, where the target applications are defined.
     * 
     * @param oSystem
     * @returns {sap.ushell.adapters.abap.UserInfoAdapter}
     */
    sap.ushell.adapters.demo.UserInfoAdapter = function (oSystem) {

        var oApplications = sap.ushell.shells.demo.fioriDemoConfig.applications;

        this.updateUserPreferences = function (oUSer) {
            var oDeferred = new jQuery.Deferred();

            jQuery.sap.log.info("updateUserPreferences: " + oUSer);
//            var curUser = sap.ushell.Container.getUser();
//            var originTheme = curUser.getSelectedTheme();
//            curUser.setSelectedTheme(selectedTheme);

            oDeferred.resolve({
                status: 200
            });
//          oDeferred.reject("Could not resolve link '" + sHashFragment + "'");
//            curUser.setUserSelectedTheme(originTheme);

            return oDeferred.promise();
        };

        this.getThemeList = function () {
            var oDeferred = new jQuery.Deferred();

            jQuery.sap.log.info("getThemeList");
            oDeferred.resolve({
                options: [{id : "theme1_id", name: "theme1_name"}, {id : "theme2_id", name: "theme2_name"},
                    {id : "theme3_id", name: "theme3_name"}, {id : "theme4_id", name: "theme4_name"},
                    {id : "base", name: "base"}, {id : "sap_bluecrystal", name: "sap_bluecrystal"}, {id : "sap_hcb", name: "sap_hcb"}]
            });

            return oDeferred.promise();
        };
    };
}());
