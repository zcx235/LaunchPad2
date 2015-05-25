// Copyright (c) 2013 SAP AG, All Rights Reserved
/*global sap, jQuery */
sap.ui.controller(
    "sap.ushell.demo.AppPersSample.App",
    {
        onInit : function () {
            "use strict";
            // Read potentially existing personalization favorites.
            var oId = {
                    container : "sap.ushell.demo.AppPersSample",
                    item : "favorites"
                },
                that = this;
            this.oPersonalizer = sap.ushell.Container.getService("Personalization").getPersonalizer(oId);
            this.applyExistingFruitFavorites(oId);
            this.initIceCreamFavorites();
            this.initMilkshakeFavorites();
        },

        initIceCreamFavorites : function () {
            "use strict";
            var that = this;
            // Ice cream favorites
            this.getView().byId("btnSaveIceCream").setEnabled(false);
            sap.ushell.Container.getService("Personalization").getContainer("sap.ushell.IceCreamFavorites", {validity : 2 /*minutes*/ })
                .done(function (oContainer) {
                    var i,
                        aPanelIceCreamFavorites = that.getView().byId("PanelIceCreamFavorites").getContent();
                    that.oIceCreamContainer = oContainer;
                    for (i = 0; i < aPanelIceCreamFavorites.length; i = i + 1) {
                        if (aPanelIceCreamFavorites[i] instanceof sap.m.CheckBox) {
                            aPanelIceCreamFavorites[i].setSelected(that.oIceCreamContainer.getItemValue(String(i)) || false);
                        }
                    }
                    that.getView().byId("btnSaveIceCream").setEnabled(true);
                });
        },

        initMilkshakeFavorites : function () {
            "use strict";
            // Ice cream favorites
            var i,
                that = this,
                aPanelMilkshakeFavorites = that.getView().byId("PanelMilkshakeFavorites").getContent();
            for (i = 0; i < aPanelMilkshakeFavorites.length; i = i + 1) {
                //aPanelMilkshakeFavorites[i].setSelected(that.oIceCreamContainer.getItemValue(aPanelMilkshakeFavorites[i].getId()) || false);
                aPanelMilkshakeFavorites[i].setEnabled(false);
            }
            sap.ushell.Container.getService("Personalization").getContainer("sap.ushell.MilkshakeFavorites", {validity : 0 /*FLP window!*/ })
                .done(function (oContainer) {
                    var i,
                        aPanelMilkshakeFavorites = that.getView().byId("PanelMilkshakeFavorites").getContent();
                    that.oMilkshakeContainer = oContainer;
                    for (i = 0; i < aPanelMilkshakeFavorites.length; i = i + 1) {
                        if (aPanelMilkshakeFavorites[i] instanceof sap.m.CheckBox) {
                            aPanelMilkshakeFavorites[i].setSelected(that.oMilkshakeContainer.getItemValue(String(i)) || false);
                        }
                        aPanelMilkshakeFavorites[i].setEnabled(true);
                    }
                });
        },

        /**
         * Gets the favorites from browser storage
         */
        applyExistingFruitFavorites : function (oId) {
            "use strict";
            this.oPersonalizer
                    .getPersData()
                    .done(this.onFruitFavoritesRead.bind(this))
                    .fail(
                    function () {
                        jQuery.sap.log
                                .error("Reading personalization data failed.");
                    }
                );
        },

        /**
         * Called by applyExistingFavorites Sets the check-boxes if
         * favorites were saved
         */
        onFruitFavoritesRead : function (aCheckBoxValues) {
            "use strict";
            var sDisplayValue,
                i;

            if (!aCheckBoxValues) {
                // TODO The following string is never used...
                sDisplayValue = "(Personalization data is not available from service)";
            } else {
                for (i = 0; i < aCheckBoxValues.length; i = i + 1) {
                    this.getView().byId("PanelFruitFavorites")
                            .getContent()[i]
                            .setSelected(aCheckBoxValues[i]);
                }
            }
        },

        /**
         * Called when "Save Fruit Favorites" button is pressed
         */
        onSaveFruitFavorites : function () {
            "use strict";
            var aCheckBoxValues = [],
                i,
                aPanelFavorites = this.getView().byId("PanelFruitFavorites").getContent();

            for (i = 0; i < aPanelFavorites.length - 1; i = i + 1) {
                aCheckBoxValues[i] = aPanelFavorites[i]
                        .getSelected();
            }

            this.oPersonalizer.setPersData(aCheckBoxValues);
            // neither the done nor the fail is checked
        },

        /**
         * Called when "Save ice cream favorites is changed 
         */
        onSaveIceCreamFavorites : function () {
            "use strict";
            // the button is only available if we have loaded the data 
            var aPanelIceCreamFavorites = this.getView().byId("PanelIceCreamFavorites").getContent(),
                i;
            for (i = 0; i < aPanelIceCreamFavorites.length; i = i + 1) {
                if (aPanelIceCreamFavorites[i] instanceof sap.m.CheckBox) {
                    this.oIceCreamContainer.setItemValue(String(i), aPanelIceCreamFavorites[i].getSelected());
                }
            }
            this.oIceCreamContainer.save();
            // neither the done nor the fail is checked
        },
        /**
         * Called when "Save ice cream favorites is changed 
         */
        onMilkshakeChanged : function () {
            "use strict";
            // the button is only available if we have loaded the data 
            var aPanelMilkshakeFavorites = this.getView().byId("PanelMilkshakeFavorites").getContent(),
                i;
            for (i = 0; i < aPanelMilkshakeFavorites.length; i = i + 1) {
                if (aPanelMilkshakeFavorites[i] instanceof sap.m.CheckBox) {
                    this.oMilkshakeContainer.setItemValue(String(i), aPanelMilkshakeFavorites[i].getSelected());
                }
            }
            this.oMilkshakeContainer.save(); // TODO Deferred
            // neither the done nor the fail is checked
        },
        onDestroy : function () {
            "use strict";
            this.oMilkshakeContainer.save();
        }
    }
);