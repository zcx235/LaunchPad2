(function () {
    "use strict";
    /*global sap,jQuery */
    /*jslint nomen: true, vars: true */
    sap.ui.controller("sap.ushell.demo.AppNavSample.Main", {
        mViewNamesToViews : {},
        oInnerAppRouter : null,
        oApp : null, // the SplitApp Control instance of this view

        getMyComponent : function () {
            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            var myComponent = sap.ui.component(sComponentId);
            return myComponent;
        },


        /* *Nav* (7) callback for route changes */
        /**
         * Callback for hash changes, this is registered with the navigation framework
         *
         * our route has one argument, which is passed as the first argument
         *
         *  (for the _home route, sViewName is undefined)
         */
        _handleNavEvent : function (oEvent) {
            var sRouteName = oEvent.getParameter("name");
            jQuery.sap.log.debug("AppNav2: Navigate to route " + sRouteName);
            if (sRouteName === "toaView") {
                var sViewName = oEvent.getParameter("arguments").viewName;
                jQuery.sap.log.debug("AppNav2: Navigate to view " + sViewName);
                this.doNavigate("toView", sViewName);
            }
            if (sRouteName === "_home") {
                this.doNavigate("toView", "Detail");
            }
        },


        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf Main
         */
        onInit: function () {
            jQuery.sap.log.info("On Init of Main.XML.controller called : this.getView().getId()" + this.getView().getId());
            this.mViewNamesToViews = {};
            this.oApp = this.byId("app");
            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            this.oComponent = sap.ui.component(sComponentId);
            jQuery.sap.log.debug("located Component" + typeof this.oComponent);

            var vw =  sap.ui.view({ type: sap.ui.core.mvc.ViewType.XML,
                viewName: "sap.ushell.demo.AppNavSample.view.List",
                id : this.createId("List")
                });

            vw.getController().oApplication = this;

            this.oApp.addMasterPage(vw);

            vw =  sap.ui.view({ type: sap.ui.core.mvc.ViewType.XML,
                viewName: "sap.ushell.demo.AppNavSample.view.Detail"
                });
            this.mViewNamesToViews.Detail = vw;
            vw.getController().oApplication = this;
            this.oApp.addDetailPage(vw);

            this.oApp.setInitialDetail(vw); // use the object, not the (generated) id!

            /* obtain the (Controller) Navigator instance */
            this.oInnerAppRouter = this.getMyComponent().getInnerAppRouter();

            /* *Nav* (4) register callback handler for routes */
            this.oInnerAppRouter.attachRouteMatched(this._handleNavEvent, this);

            /* *Nav* (5) initialize with the (Split)App
             *
             * Compare Main.view.xml
             *   <SplitApp id="app">
             *
             *  */
//        this.oAppNavigator.init(this.byId("app"));

            /* reentrant loading : app triggers navigation on init
        var that = this;
        setTimeout(function(){
            that.oCrossAppNavigator.toExternal({ target : { semanticObject : "Action", action: "approvepurchaseorders" }});
        },200);
             */
            /* *Nav* (6) generate links, this may also be done later  */

            // *XNav* (1) obtain cross app navigation interface
            var fgetService =  sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
            this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");

            // we also have to call the shell's CrossAppNavigation service for creating correct links for inner-app navigation
            // because the shell part of the hash has to be set
            var toView1 = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForAppSpecificHash("View1/")) || "";
            var toView2 = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForAppSpecificHash("View2/")) || "";
            var toView3 = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForAppSpecificHash("View3/")) || "";

            var toSU01html_href = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ target: { semanticObject : "Action", action: "tosu01html"}})) || "";
            var toSU01_href = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ target: { semanticObject : "Action", action: "tosu01"}})) || "";
            var towdapp_href = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ target: { semanticObject : "Action", action: "towdapp" }})) || "";

            var thelongstring = "";
            var i = 0;
            for (i = 0; i < 4; i = i + 1) { //4000
                thelongstring = thelongstring + "xx" + i;
            }
            // *XNav (2) generate cross application link
            var toDefaultApp = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ target: { semanticObject : "Action", action: "todefaultapp" }})) || "";
            // an "external navigation" to the same app, as it has a different startup parameter
            // (date), it will be reloaded!
            var toOurApp = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({
                target: { semanticObject : "Action", action: "toappnavsample" },
                params : { zval : thelongstring, date : new Date().toString()}
            })) || "";

            var sShellHash =  "#Action~toappnavsample&date=" + encodeURIComponent(new Date().toString());

            var toOurApp2 = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({
                target: { "shellHash" : sShellHash }
            })) || "";


            var mdl = new sap.ui.model.json.JSONModel(
                    {
                        toView2_href : toView2,
                        toView1_href : toView1,
                        toView3_href : toView3,
                        DefaultApp_display_href :  toDefaultApp, // "#DefaultApp-display"
                        AppNavSample_display_args_href : toOurApp,
                        AppNavSample_display_args_href2 : toOurApp2,
                        toSU01html_href : toSU01html_href,
                        toSU01_href : toSU01_href,
                        towdapp_href : towdapp_href
                    }
                );


            if (toOurApp2 === sShellHash) {
                jQuery.sap.log.error("naaah! Behold of the encoding changes");
            }

            /*
             * elements of this model are bound to href tags in views :
             * e.g. (Detail.view.xml) :
             * <Link href="{/DefaultApp_display_href}" text="cross app link (Default App)" tooltip="Back to Fiori Sandbox Default Application (note href is generated!)"></Link>
             */

            this.getView().setModel(mdl);

        },

        // construct and register a view if not yet present
        makeViewUilib : function (sViewname) {

            if (this.mViewNamesToViews[sViewname]) {
                return this.mViewNamesToViews[sViewname];
            }
            //construct
            jQuery.sap.log.info("sap.ushell.demo.AppNavSample: Creating view + " + sViewname + "... ");
            // run with owner to pass component!
            var oView = null;
            sap.ui.base.ManagedObject.runWithOwner(function () {
                /* create View */
                oView =  sap.ui.view({ type: sap.ui.core.mvc.ViewType.XML,
                    viewName: "sap.ushell.demo.AppNavSample.view." + sViewname
                    // use a generated id!
                    }
                    );
            }, this.oComponent);

            jQuery.sap.log.info("sap.ushell.demo.AppNavSample:  Creating view + " + sViewname + " assigned id : " + oView.getId());
            this.mViewNamesToViews[sViewname] = oView;
            return oView;
        },

        navigate : function (sEvent, sNavTarget) {
            var oView = null;
            if (sEvent === "toHome") {
                // use external navigation to navigate to homepage
                if (this.oCrossAppNavigator) {
                    this.oCrossAppNavigator.toExternal({ target : { shellHash : "#" }});
                }
                return;
            }
            if (sEvent === "toView") {
                var sView = sNavTarget; // navtarget;
                if (sView === "" || !this.isLegalViewName(sView)) {
                    var vw = this.mViewNamesToViews.Detail;
                    this.oApp.toDetail(vw);
                    return;
                }
                /* *Nav* (7) Trigger inner app navigation */
                this.oInnerAppRouter.navTo("toaView", { viewName : sView}, true);
                return;
            }
            if (sEvent === "back") {
                this.oApp.back();
            } else if (sEvent === "backDetail") {
                this.oApp.backDetail();
            } else {
                jQuery.sap.log.info("sap.ushell.demo.AppNavSample: Unknown navigation");
            }

        },

        isLegalViewName : function (sViewNameUnderTest) {
            return (sViewNameUnderTest === "Detail" || sViewNameUnderTest === "View1" || sViewNameUnderTest === "View2" || sViewNameUnderTest === "View3");
        },

        doNavigate : function (sEvent, sNavTarget) {
            var oView = null;
            if (sEvent === "toView") {
                var sView = sNavTarget; // navtarget;
                if (sView === "" || !this.isLegalViewName(sView)) {
                    var vw = this.mViewNamesToViews.Detail;
                    this.oApp.toDetail(vw);
                    return;
                }
                var bNew = !this.mViewNamesToViews[sView];
                oView = this.makeViewUilib(sView);
                if (bNew) {
                    this.oApp.addPage(oView);
                }
                this.oApp.toDetail(oView);
                oView.getController().oApplication = this;
                return;
            }
            if (sEvent === "back") {
                this.oApp.back();
            } else if (sEvent === "backDetail") {
                this.oApp.backDetail();
            } else {
                jQuery.sap.log.info("sap.ushell.demo.AppNavSample: Unknown navigation");
            }
        },

        /**
         * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
         * (NOT before the first rendering! onInit() is used for that one!).
         * @memberOf Main
         */
//    onBeforeRendering: function() {
//
//    },
        /**
         * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
         * This hook is the same one that SAPUI5 controls get after being rendered.
         * @memberOf Main
         */
//    onAfterRendering: function() {
//
//    },
        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf Main
         */
        onExit: function () {
            jQuery.sap.log.info("sap.ushell.demo.AppNavSample: On Exit of Main.XML.controller called : this.getView().getId():" + this.getView().getId());
            this.mViewNamesToViews = {};
            if (this.oInnerAppRouter) {
                this.oInnerAppRouter.destroy();
            }
        }

    });

}());