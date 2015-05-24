// Copyright (c) 2013 SAP AG, All Rights Reserved
// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for ushell-lib project
 */
(function () {
    "use strict";
    /*global sap */

    sap.ui2.srvc.test.qunit.addProject({
        name: 'ushell-lib',
        codebase: "ushell/resources/sap/ushell",
        testbase: "ushell/test-resources/sap/ushell/test",
        scripts: [
            // the code under test (prefer using jQuery.sap.require unless you need testPublishAt)
            "../../../test-resources/sap/ushell/adapters/demo/ContainerAdapter.js",
            "components/container/ApplicationContainer.js",
            "components/tiles/applauncherdynamic/DynamicTile.controller.js",
            "services/Bookmark.js",
            "services/Container.js"
        ],
        tests: [
            // the unit tests (alphabetic order, please)
            "adapters/demo/ContainerAdapter.qunit.js",
            "adapters/demo/PageBuildingAdapter.qunit.js",
            "adapters/demo/PersonalizationAdapter.qunit.js",
            "adapters/sandbox/PersonalizationAdapter.qunit.js",
            "adapters/demo/SupportTicketAdapterTest.qunit.js",
            "adapters/sandbox/SupportTicketAdapter.qunit.js",
            "adapters/demo/EndUserFeedbackAdapter.qunit.js",
            "components/container/ApplicationContainer.qunit.js",
            "components/factsheet/annotation/Mapping.qunit.js",
            "components/factsheet/annotation/ODataURLTemplating.qunit.js",
            "components/tiles/utils.qunit.js",
            "components/tiles/applauncher/StaticTile.qunit.js",
            "components/tiles/applauncherdynamic/DynamicTile.qunit.js",
            "components/userActivity/uesrActivityLog.qunit.js",
            "renderers/fiori2/Shell.qunit.js",
            "renderers/fiori2/Renderer.qunit.js",
            //"renderers/fiori2/search/OfflineResultsView.qunit.js",
            "renderers/fiori2/launchpad/DashboardManager.qunit.js",
            "renderers/fiori2/launchpad/PagingManager.qunit.js",
            "renderers/fiori2/launchpad/group_list/GroupList.qunit.js",
            "renderers/fiori2/launchpad/catalog/Catalog.qunit.js",
            "renderers/fiori2/UIActions.qunit.js",
            "renderers/fiori2/RendererExtensions.qunit.js",
            "services/Bookmark.qunit.js",
            "services/Container.qunit.js",
            "services/CrossApplicationNavigation.qunit.js",
            "services/LaunchPage.qunit.js",
            "services/Message.qunit.js",
            "services/NavTargetResolution.qunit.js",
            "services/PageBuilding.qunit.js",
            "services/Personalization.qunit.js",
            "services/AppContext.qunit.js",
            "services/ShellNavigation.qunit.js",
            "services/ShellNavigation.History.qunit.js",
            "services/SupportTicket.qunit.js",
            "services/EndUserFeedback.qunit.js",
            "services/URLParsing.qunit.js",
            "services/URLShortening.qunit.js",
            "services/UserInfo.qunit.js",
            "services/UserRecents.qunit.js",
            "services/AppConfiguration.qunit.js",
            "System.qunit.js",
            "utils.qunit.js",
            "ui/footerbar/AboutButton.qunit.js",
            "ui/footerbar/AddBookmarkButton.qunit.js",
            "ui/footerbar/ContactSupportButton.qunit.js",
            "ui/footerbar/JamDiscussButton.qunit.js",
            "ui/footerbar/JamShareButton.qunit.js",
            "ui/footerbar/LoginDetailsButton.qunit.js",
            "ui/footerbar/LogoutButton.qunit.js",
            "ui/footerbar/SettingsButton.qunit.js",
            "ui/launchpad/GroupListItem.qunit.js",
            "ui/launchpad/DeleteArea.qunit.js",
            "ui/launchpad/TileContainer.qunit.js",
            "ui/launchpad/EmbeddedSupportErrorMessage.qunit.js",
            "ui/tile/TileBase.qunit.js",
            "ui/tile/DynamicTile.qunit.js",
            "ui/tile/ImageTile.qunit.js",
            "ui/tile/StaticTile.qunit.js"
        ],
        integrationTests: [
            "services/Bookmark.integration.js",
            "services/CrossApplicationNavigation.integration.js",
            "services/PageBuilding.integration.js",
            "services/Personalization.integration.js"
        ]
    });
}());
