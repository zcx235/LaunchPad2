jQuery.sap.declare("sap.ui.Z_DEEP2.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
jQuery.sap.require("sap.ui.Z_DEEP2.MyRouter");


(function() {
sap.ui.core.UIComponent.extend("sap.ui.Z_DEEP2.Component", {
	metadata : {
		name : "Z_DEEP2",
		version : "1.0",
		includes : ["css/cell.css","css/error.css"],
		dependencies : {
			libs : ["sap.m", "sap.ui.layout"],
			components : []
		},

		config : {
//			resourceBundle : "i18n/messageBundle.properties",
//			user : "model/user.json",
			serviceConfig : {
				name: "Z_DEEP_STRUCTURE2_SRV",
				serviceUrl: "../../../../../proxy/sap/opu/odata/sap/Z_DEEP_STRUCTURE2_SRV/"
			}
		},
		
		routing : {
			config : {
				routerClass : sap.ui.Z_DEEP2.MyRouter,
				viewType : "XML",
				viewPath : "sap.ui.Z_DEEP2.view",
				targetParent : "AppView",		// App.view.xml ID
				targetControl : "fioriContent", // This is the control in which new views are placed
                targetAggregation : "pages", // This is the aggregation in which the new views will be placed
				clearTarget : false
			},
			routes : [
				{
					pattern : "",
					name : "Master",
					view : "Master",
//					targetAggregation : "pages",
//					targetControl : "idAppControl",
				},
			]
		}
	},
	
	createContent : function() {
		// create root view
		var oViewData = {
			component : this	
		};
		
		var oView = sap.ui.view({
			id : "AppView",
			viewName : "sap.ui.Z_DEEP2.view.App",
			type : "XML",
			viewData : oViewData
		});
		
		return oView;
	},
	
	init : function(){
		// call super init (will call function "create content")
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
        
        // always use absolute paths relative to our own component
        // (relative paths will fail if running in the Fiori Launchpad)
        var sRootPath = jQuery.sap.getModulePath("sap.ui.Z_DEEPS");
        
        // Get the service URL for the oData model
		var oServiceConfig = this.getMetadata().getConfig().serviceConfig;
		var sServiceUrl = oServiceConfig.serviceUrl;
		
        // the metadata is read to get the location of the i18n language files later
        var mConfig = this.getMetadata().getConfig();
        this._routeMatchedHandler = new sap.m.routing.RouteMatchedHandler(this.getRouter(), this._bRouterCloseDialogs);
	
        // create oData model
        var oDataModel = this._initODataModel(sServiceUrl);
        
//        //create user model
//        var oUserModel = new sap.ui.model.json.JSONModel([sRootPath,mConfig.user].join("/"));
//        this.setModel(oUserModel,"USER");
                
        // initialize router and navigate to the first page
        this.getRouter().initialize();
	},
	
	// creation and setup of the oData model
    _initODataModel : function(sServiceUrl) {
//        jQuery.sap.require("sap.ui.ZTime_Entry.util.messages");
        var oConfig = {
            metadataUrlParams : {},
            json : true,
            // loadMetadataAsync : true,
            defaultBindingMode :"TwoWay",
            defaultCountMode: "Inline",
            useBatch : true
        };
        var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, oConfig);
        oModel.attachRequestFailed(null, function(oParameter){
        	this.getEventBus().publish("Component", "MetadataFailed");
//        	sap.ui.ZTime_Entry.util.messages.showErrorMessage(oParameter);
        	});
        this.setModel(oModel);
        return oModel;
    },
    
    getEventBus : function () {
		return sap.ui.getCore().getEventBus();
	}
});
}());