//Copyright (c) 2013 SAP AG, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, $, document */
    /*jslint plusplus: true, nomen: true */

    sap.ui.jsview("sap.ushell.demo.LinkList", {
        createContent: function (oController) {
            jQuery.sap.require('sap.m.List');
            jQuery.sap.require('sap.m.CustomListItem');
            var oList = new sap.m.List({
                items: {
                    path: '/items',
                    sorter: new sap.ui.model.Sorter("title", false, true),
                    groupHeaderFactory : jQuery.proxy(oController.getGroupHeader, oController),
                    template: new sap.m.CustomListItem({
                        content: new sap.m.Link({
                            text: "{title}",
                            href : "{targetUrl}"
                        }).addStyleClass('sapUshellLinkListItem')
                    })
                }
            });
            var orig = oList.onAfterRendering;
            oList.onAfterRendering = function () {
                orig.apply(this, arguments);
                var oFirstItem = this.getItems()[0];
                if (oFirstItem.getMetadata().getName() === "sap.m.GroupHeaderListItem" && oFirstItem.getTitle && !oFirstItem.getTitle()) {
                    oFirstItem.destroy();
                }
                oController.toggleSubItemsState();
            };
            return oList;
        },

        getControllerName: function () {
            return "sap.ushell.demo.LinkList";
        }
    });
}());