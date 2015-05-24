//Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for components/container/ApplicationContainer.js
 */
(function () {
    "use strict";
    /*jslint nomen:true */
    /*global asyncTest, deepEqual, dispatchEvent, equal, expect, localStorage, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    document, jQuery, sap, sinon, some, Storage, window */

    var sPREFIX = "sap.ushell.components.container",
        sCONTAINER = sPREFIX + ".ApplicationContainer",
        sTESTURL = "http://www.sap.com/",
        oMessageTemplate = {
            data: {
                type: "request",
                service: "sap.ushell.services.CrossApplicationNavigation.unknownService",
                request_id: "generic_id",
                body: {}
            },
            origin: "http://our.origin:12345",
            source: {
                postMessage: "replace_me_with_a_spy"
            }
        },
        oFakeError = {
            message: "Post Message Fake Error"
        };

    /**
     * Creates an object which can be used for the ApplicationContainer's application property.
     * @param {string} [oProperties.text]
     *   the return value for getText()
     * @param {string} [oProperties.type]
     *   the return value for getType()
     * @param {string} [oProperties.url]
     *   the return value for getUrl()
     * @param {boolean} [oProperties.resolvable]
     *   the return value for isResolvable(). If <code>true</code>, the object's function
     *   <code>resolve()</code> must be stubbed.
     * @returns the application object
     */
    function getApplication(oProperties) {
        oProperties = oProperties || {};
        return {
            getText: function () { return oProperties.text; },
            getType: function () { return oProperties.type; },
            getUrl: function () { return oProperties.url; },
            isFolder: function () { return false; },
            isResolvable: function () { return oProperties.resolvable; },
            resolve: function () { throw new Error("resolve must be stubbed"); },
            getMenu: function () {
                return {
                    getDefaultErrorHandler: function () {
                        return oProperties.errorHandler;
                    }
                };
            }
        };
    }

    /**
     * Renders the container and expects that the internal render() is called with the given
     * arguments.
     * @param {sap.ushell.components.container.ApplicationContainer] oContainer
     *   the container
     * @param {sap.ushell.components.container.ApplicationType} oApplicationType
     *   the expected applicationType
     * @param {string} sUrl
     *   the expected URL
     * @param {string} sAdditionalInformation
     *   the expected additional information
     */
    function renderAndExpect(oContainer, oApplicationType, sUrl, sAdditionalInformation) {
        var oRenderManager = new sap.ui.core.RenderManager();

        sinon.stub(sap.ushell.components.container, "render");

        oRenderManager.render(oContainer, document.createElement("DIV"));

        ok(sap.ushell.components.container.render.calledWith(
            oRenderManager.getRendererInterface(),
            oContainer,
            oApplicationType,
            sUrl,
            sAdditionalInformation
        ));
    }

    /**
     * Call the render() function and check that an IFrame is rendered for the given URL.
     * @param {sap.ushell.components.container.ApplicationContainer] oContainer
     *   the container
     * @param {sap.ushell.components.container.ApplicationType} oApplicationType
     *   the application type
     * @param {string} sUrl
     *   the application URL
     */
    function renderInternallyAndExpectIFrame(oContainer, sApplicationType, sUrl) {
        var oRenderManager = new sap.ui.core.RenderManager(),
            // the div is not attached to the "real" DOM and therefore is standalone and
            // not rendered
            oTargetNode = document.createElement("DIV"),
            oIframe;

        // in one test the function is called multiple times
        if (oContainer.getFrameSource.reset) {
            oContainer.getFrameSource.reset();
        } else {
            sinon.stub(oContainer, "getFrameSource");
        }
        oContainer.getFrameSource.returns(sUrl);
        oContainer.addStyleClass("myClass1");
        sinon.spy(oRenderManager, "writeAccessibilityState");
        sap.ushell.components.container.render(oRenderManager.getRendererInterface(),
            oContainer, sApplicationType, sUrl, "additionalInfo");
        oRenderManager.flush(oTargetNode);

        strictEqual(oTargetNode.childNodes.length, 1);
        oIframe = oTargetNode.childNodes[0];
        strictEqual(oIframe.nodeName, "IFRAME");
        strictEqual(oIframe.className, "myClass1 sapUShellApplicationContainer");
        strictEqual(oIframe.getAttribute("data-sap-ui"), oContainer.getId());
        strictEqual(oIframe.id, oContainer.getId());
        strictEqual(oIframe.src, sUrl);
        strictEqual(oIframe.style.height, oContainer.getHeight());
        strictEqual(oIframe.style.width, oContainer.getWidth());
        ok(oRenderManager.writeAccessibilityState.calledOnce);

        ok(oContainer.getFrameSource.calledOnce);
        ok(oContainer.getFrameSource.calledWith(sApplicationType, sUrl, "additionalInfo"));
        return oRenderManager;
    }

    /**
     * Calls <code>sap.ushell.components.container.createUi5View</code> for the given container
     * and tests that it fails with the given technical error message.
     *
     * @param {sap.ushell.components.container.ApplicationContainer} oContainer
     *   the container
     * @param {string} sMessage
     *   technical error message
     */
    function testFailingCreateUi5View(oContainer, sMessage) {
        var fnCreateView = sinon.spy(sap.ui, "view"),
            oLogMock = sap.ui2.srvc.test.createLogMock()
                .filterComponent(sCONTAINER)
                .error(sMessage, oContainer.getAdditionalInformation(), sCONTAINER);

        sinon.stub(sap.ushell.components.container, "createErrorControl");

        sap.ushell.components.container.createUi5View(oContainer, oContainer.getUrl(),
            oContainer.getAdditionalInformation());

        ok(!fnCreateView.called);
        ok(sap.ushell.components.container.createErrorControl.calledOnce);
        oLogMock.verify();
    }

    // a test component
    jQuery.sap.declare("some.random.path.Component");
    sap.ui.core.UIComponent.extend("some.random.path.Component", {
        createContent: function () {return new sap.ui.core.Icon(); },
        metadata: {
            config : {
                foo : "bar"
            }
        }
    });
    // a test component w/o configuration
    jQuery.sap.declare("some.random.path.no.config.Component");
    sap.ui.core.UIComponent.extend("some.random.path.no.config.Component", {
        createContent: function () {return new sap.ui.core.Icon(); },
        metadata: {
        }
    });

    //---------------------------------------------------------------------------------------------

    // Documentation can be found at http://docs.jquery.com/QUnit
    module("components/container/ApplicationContainer.js", {
        setup: function () {
            // Avoid writing to localStorage in any case
            // Never spy on localStorage, this is a strange object in IE9!
            sinon.stub(Storage.prototype, "removeItem");
            sinon.stub(Storage.prototype, "setItem");

        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            sap.ui2.srvc.test.restoreSpies(
                jQuery.sap.assert,
                jQuery.sap.getObject,
                jQuery.sap.log.warning,
                jQuery.sap.registerModulePath,
                jQuery.sap.require,
                jQuery.sap.resources,
                jQuery.sap.uid,
                sap.ui.component,
                sap.ui.view,
                sap.ushell.components.container.createErrorControl,
                sap.ushell.components.container.createUi5Component,
                sap.ushell.components.container.createUi5View,
                sap.ushell.components.container.destroyChild,
                sap.ushell.components.container.getTranslatedText,
                sap.ushell.components.container.handleCrossApplicationNavigationMessageEvent,
                sap.ushell.components.container.isTrustedPostMessageSource,
                sap.ushell.components.container.logout,
                sap.ushell.components.container.render,
                sap.ushell.components.container.renderControlInDiv,
                sap.ushell.utils.localStorageSetItem,
                Storage.prototype.getItem,
                Storage.prototype.removeItem,
                Storage.prototype.setItem,
                window.addEventListener,
                window.removeEventListener
            );
            delete sap.ushell.Container;
        }
    });

    test("getTranslatedText", function () {
        var oResourceBundle = {
            getText: sinon.spy()
        };

        sinon.stub(jQuery.sap, "resources").returns(oResourceBundle);
        sap.ushell.components.container.getTranslatedText("an_error_has_occured");
        ok(jQuery.sap.resources.calledWith({
            url: jQuery.sap.getModulePath(sPREFIX) + "/resources/resources.properties",
            language: sap.ui.getCore().getConfiguration().getLanguage()
        }));
        ok(oResourceBundle.getText.calledWith("an_error_has_occured"));
        sap.ushell.components.container.getTranslatedText("loading", ["foo bar"]);
        ok(jQuery.sap.resources.calledOnce);
        ok(oResourceBundle.getText.calledWith("loading", ["foo bar"]));
    });

    test("renderControlInDiv w/o child", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer({
                width: "11%",
                height: "180px"
            }),
            oDiv,
            oRenderManager = new sap.ui.core.RenderManager(),
            oTargetNode = document.createElement("DIV");

        oContainer.addStyleClass("myClass1");
        sinon.spy(oRenderManager, "writeAccessibilityState");

        sap.ushell.components.container.renderControlInDiv(
            oRenderManager.getRendererInterface(),
            oContainer
        );

        oRenderManager.flush(oTargetNode);
        strictEqual(oTargetNode.childNodes.length, 1);
        oDiv = oTargetNode.childNodes[0];
        strictEqual(oDiv.nodeName, "DIV");
        strictEqual(oDiv.className, "myClass1 sapUShellApplicationContainer");
        strictEqual(oDiv.getAttribute("data-sap-ui"), oContainer.getId());
        strictEqual(oDiv.id, oContainer.getId());
        strictEqual(oDiv.style.height, oContainer.getHeight());
        strictEqual(oDiv.style.width, oContainer.getWidth());
        ok(oRenderManager.writeAccessibilityState.calledOnce);
    });

    test("renderControlInDiv w/ child", function () {
        var oChild = new sap.ui.core.Icon(),
            oContainer = new sap.ushell.components.container.ApplicationContainer({
                width: "11%",
                height: "180px"
            }),
            oDiv,
            oRenderManager = new sap.ui.core.RenderManager(),
            oTargetNode = document.createElement("DIV");

        oContainer.addStyleClass("myClass1");
        sinon.spy(oRenderManager, "writeAccessibilityState");
        sinon.spy(oRenderManager, "renderControl");

        sap.ushell.components.container.renderControlInDiv(
            oRenderManager.getRendererInterface(),
            oContainer,
            oChild
        );

        oRenderManager.flush(oTargetNode);
        strictEqual(oTargetNode.childNodes.length, 1);
        oDiv = oTargetNode.childNodes[0];
        strictEqual(oDiv.nodeName, "DIV");
        strictEqual(oDiv.className, "myClass1 sapUShellApplicationContainer");
        strictEqual(oDiv.getAttribute("data-sap-ui"), oContainer.getId());
        strictEqual(oDiv.id, oContainer.getId());
        strictEqual(oDiv.style.height, oContainer.getHeight());
        strictEqual(oDiv.style.width, oContainer.getWidth());
        ok(oRenderManager.writeAccessibilityState.calledOnce);
        ok(oRenderManager.renderControl.calledOnce);
        ok(oRenderManager.renderControl.calledWith(oChild));
    });

    test("createErrorControl", function () {
        var oResult;

        sinon.stub(sap.ushell.components.container, "getTranslatedText").returns("Error occurred");

        oResult = sap.ushell.components.container.createErrorControl();

        ok(oResult instanceof sap.ui.core.Control, "public contract");
        ok(oResult instanceof sap.ui.core.Icon, "implementation details");
        strictEqual(oResult.getSize(), "2rem");
        strictEqual(oResult.getSrc(), "sap-icon://error");
        strictEqual(oResult.getTooltip(), "Error occurred");
        ok(sap.ushell.components.container.getTranslatedText.calledWith("an_error_has_occured"));
    });

    test("ApplicationContainer control", function () {
        var oContainer;

        strictEqual(typeof sap.ushell.components.container.ApplicationContainer, "function");

        oContainer = new sap.ushell.components.container.ApplicationContainer();
        ok(oContainer instanceof sap.ui.core.Control);
        strictEqual(oContainer.getAdditionalInformation(), "",
            "default for 'additionalInformation' property");
        strictEqual(oContainer.getApplicationType(), "URL",
            "default for 'applicationType' property");
        strictEqual(oContainer.getHeight(), "100%", "default for 'height' property");
        strictEqual(oContainer.getUrl(), "", "default for 'url' property");
        strictEqual(oContainer.getVisible(), true, "default for 'visible' property");
        strictEqual(oContainer.getWidth(), "100%", "default for 'width' property");
        strictEqual(oContainer.getApplication(), undefined, "default for 'application' property");
        strictEqual(oContainer.getChild, undefined, "'child' hidden");

        oContainer = new sap.ushell.components.container.ApplicationContainer({
            applicationType: sap.ushell.components.container.ApplicationType.WDA
        });
        strictEqual(oContainer.getApplicationType(),
            sap.ushell.components.container.ApplicationType.WDA);
        oContainer = new sap.ushell.components.container.ApplicationContainer({
            applicationType: sap.ushell.components.container.ApplicationType.NWBC
        });
        strictEqual(oContainer.getApplicationType(),
            sap.ushell.components.container.ApplicationType.NWBC);

        raises(function () {
            oContainer = new sap.ushell.components.container.ApplicationContainer({
                applicationType: "foo"
            });
        });

        oContainer = new sap.ushell.components.container.ApplicationContainer({
            url: sTESTURL
        });
        strictEqual(oContainer.getUrl(), sTESTURL);

        oContainer = new sap.ushell.components.container.ApplicationContainer({
            visible: false
        });
        strictEqual(oContainer.getVisible(), false);

        oContainer = new sap.ushell.components.container.ApplicationContainer({
            height: "200px"
        });
        strictEqual(oContainer.getHeight(), "200px");

        raises(function () {
            oContainer = new sap.ushell.components.container.ApplicationContainer({
                height: "200foo"
            });
        });

        oContainer = new sap.ushell.components.container.ApplicationContainer({
            width: "100px"
        });
        strictEqual(oContainer.getWidth(), "100px");

        raises(function () {
            oContainer = new sap.ushell.components.container.ApplicationContainer({
                width: "100foo"
            });
        });

        oContainer = new sap.ushell.components.container.ApplicationContainer({
            additionalInformation: "SAPUI5="
        });
        strictEqual(oContainer.getAdditionalInformation(), "SAPUI5=");
    });

    test("ApplicationContainer renderer exists", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer(),
            oRenderManager = new sap.ui.core.RenderManager(),
            oContainerRenderer = oRenderManager.getRenderer(oContainer);

        strictEqual(typeof oContainerRenderer, "object", oContainerRenderer);
    });

    test("sap.ushell.components.container.render URL", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer({
            height: "20%",
            width: "10%"
        });
        renderInternallyAndExpectIFrame(oContainer,
            sap.ushell.components.container.ApplicationType.URL, sTESTURL);
    });

    test("sap.ushell.components.container.render WDA", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer({
            height: "20%",
            width: "10%"
        });
        renderInternallyAndExpectIFrame(oContainer,
            sap.ushell.components.container.ApplicationType.WDA,
            'http://anyhost:1234/sap/bc/webdynpro/sap/test_navigation_parameter');
    });

    asyncTest("sap.ushell.components.container.render NWBC", function () {
        sap.ushell.bootstrap("demo").done(function () {

            var oContainer = new sap.ushell.components.container.ApplicationContainer({

                height: "20%",
                width: "10%"
            });
            start();
            renderInternallyAndExpectIFrame(oContainer,
                sap.ushell.components.container.ApplicationType.NWBC,
                'http://anyhost:1234/sap/bc/ui2/nwbc/~canvas');
        });
    });

    test("getFrameSource", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer();

        strictEqual(oContainer.getFrameSource(
            sap.ushell.components.container.ApplicationType.URL,
            sTESTURL,
            ""
        ), sTESTURL);
    });

    test("getFrameSource invalid type", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer();

        raises(function () {
            oContainer.getFrameSource("FOO", sTESTURL, "");
        }, /Illegal application type: FOO/);
    });

    test("sap.ushell.components.container.render invalid type", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer(),
            oRenderManager = new sap.ui.core.RenderManager(),
            sType = "FOO",
            sTechnicalErrorMsg = "Illegal application type: " + sType,
            oLogMock = sap.ui2.srvc.test.createLogMock()
                .filterComponent(sCONTAINER)
                .error(sTechnicalErrorMsg, null, sCONTAINER);

        sinon.spy(sap.ushell.components.container, "createErrorControl");

        sap.ushell.components.container.render(oRenderManager.getRendererInterface(),
            oContainer, sType, sTESTURL, "");

        ok(sap.ushell.components.container.createErrorControl.calledOnce);
        oLogMock.verify();
    });

    test("getFrameSource throw new Error", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer(),
            oRenderManager = new sap.ui.core.RenderManager(),
            sTechnicalErrorMsg = "Some error message",
            oLogMock = sap.ui2.srvc.test.createLogMock()
                .filterComponent(sCONTAINER)
                .error(sTechnicalErrorMsg, null, sCONTAINER);

        sinon.spy(sap.ushell.components.container, "createErrorControl");

        oContainer.getFrameSource = function () {
            throw new Error(sTechnicalErrorMsg);
        };
        sap.ushell.components.container.render(oRenderManager.getRendererInterface(),
            oContainer, "n/a", sTESTURL, "");

        ok(sap.ushell.components.container.createErrorControl.calledOnce);
        oLogMock.verify();
    });

    test("sap.ushell.components.container.render invalid type w/ custom getFrameSource",
        function () {
            var oContainer = new sap.ushell.components.container.ApplicationContainer({
                height: "20%",
                width: "10%"
            });

            oContainer.getFrameSource = function (sApplicationType, sUrl, sAdditionalInformation) {
                // Note: no error thrown!
                return sUrl;
            };

            renderInternallyAndExpectIFrame(oContainer, "TRA", sTESTURL);
        });

    test("sap.ushell.components.container.render UI5 (SAPUI5=)", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer(),
            oRenderManager = new sap.ui.core.RenderManager(),
            oIcon = new sap.ui.core.Icon();

        // return a button instead of a view, so that we have a control with the necessary
        // properties, but don't have to supply another file for the view definition
        sinon.stub(sap.ushell.components.container, "createUi5View").returns(oIcon);
        sinon.stub(sap.ushell.components.container, "renderControlInDiv");

        sap.ushell.components.container.render(oRenderManager.getRendererInterface(),
            oContainer, sap.ushell.components.container.ApplicationType.URL, sTESTURL,
            "SAPUI5=some.random.path.Viewname.view.xml");
        ok(sap.ushell.components.container.createUi5View.calledOnce);
        ok(sap.ushell.components.container.createUi5View.calledWith(oContainer,
            sTESTURL, "SAPUI5=some.random.path.Viewname.view.xml"));
        ok(sap.ushell.components.container.renderControlInDiv.calledWith(
            oRenderManager.getRendererInterface(),
            oContainer,
            oIcon
        ));
    });

    test("ApplicationContainer invisible", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer({
                visible: false
            }),
            oRenderManager = new sap.ui.core.RenderManager();

        sinon.stub(sap.ushell.components.container, "render");
        sinon.stub(sap.ushell.components.container, "renderControlInDiv");

        oRenderManager.render(oContainer, document.createElement("DIV"));

        ok(sap.ushell.components.container.render.notCalled);
        ok(sap.ushell.components.container.renderControlInDiv.calledWith(
            oRenderManager.getRendererInterface(),
            oContainer
        ));
    });

    test("ApplicationContainer rendering", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer({
                applicationType: sap.ushell.components.container.ApplicationType.URL,
                url: 'http://anyhost:1234/sap/public/bc/ui2/staging/test',
                additionalInformation: 'SAPUI5=will.be.ignored.view.xml'
            });

        renderAndExpect(oContainer, oContainer.getApplicationType(), oContainer.getUrl(),
                oContainer.getAdditionalInformation());
    });

    test("createUi5View", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer({
                applicationType: sap.ushell.components.container.ApplicationType.URL,
                url: 'http://anyhost:1234/sap/public/bc/ui2/staging/test',
                // explicitely use ".view." in the view's path to check that this is no problem
                additionalInformation: 'SAPUI5=some.random.view.path.Viewname.view.xml',
                width: "11%",
                height: "180px"
            }),
            oView,
            oIcon = new sap.ui.core.Icon(),
            fnRegisterModulePath = sinon.spy(jQuery.sap, "registerModulePath"),
            // return a button instead of a view, so that we have a control with the necessary
            //  properties, but don't have to supply another file for the view definition
            fnCreateView = sinon.stub(sap.ui, "view").returns(oIcon),
            fnAssert = sinon.spy(jQuery.sap, "assert");

        sinon.spy(sap.ushell.components.container, "destroyChild");

        oView = sap.ushell.components.container.createUi5View(oContainer, oContainer.getUrl(),
                oContainer.getAdditionalInformation());

        strictEqual(oView, oIcon, "createView returns our button");
        ok(fnRegisterModulePath.calledOnce, "registerModulePath called");
        strictEqual(fnRegisterModulePath.firstCall.args[0], "some.random.view.path");
        strictEqual(fnRegisterModulePath.firstCall.args[1],
            "http://anyhost:1234/sap/public/bc/ui2/staging/test/some/random/view/path");
        ok(fnCreateView.calledOnce, "createView called");
        ok(sap.ushell.components.container.destroyChild.calledBefore(fnCreateView),
            "child destroyed before creating the view");
        ok(fnCreateView.calledWith({
            id: oContainer.getId() + "-content",
            type: "XML",
            viewData: {},
            viewName: "some.random.view.path.Viewname"
        }), "createView args");
        strictEqual(oIcon.getWidth(), "11%");
        strictEqual(oIcon.getHeight(), "180px");
        ok(oIcon.hasStyleClass("sapUShellApplicationContainer"),
            "style sapUShellApplicationContainer applied");
        strictEqual(oIcon.getParent(), oContainer, "view's parent is the container");
        ok(fnAssert.neverCalledWith(sinon.match.falsy), "no failed asserts");
    });

    test("createUi5View view in subfolder", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer({
                applicationType: sap.ushell.components.container.ApplicationType.URL,
                url: 'http://anyhost:1234/',
                additionalInformation: 'SAPUI5=some.random.path/view.Viewname.view.js'
            }),
            fnRegisterModulePath = sinon.spy(jQuery.sap, "registerModulePath"),
            fnCreateView = sinon.stub(sap.ui, "view").returns(new sap.ui.core.Icon()),
            fnAssert = sinon.spy(jQuery.sap, "assert");

        sap.ushell.components.container.createUi5View(oContainer, oContainer.getUrl(),
            oContainer.getAdditionalInformation());

        ok(fnRegisterModulePath.calledOnce, "registerModulePath called");
        strictEqual(fnRegisterModulePath.firstCall.args[0], "some.random.path");
        strictEqual(fnRegisterModulePath.firstCall.args[1], "http://anyhost:1234/some/random/path");
        ok(fnCreateView.calledOnce, "createView called");
        strictEqual(fnCreateView.firstCall.args[0].type, "JS");
        strictEqual(fnCreateView.firstCall.args[0].viewName, "some.random.path.view.Viewname");
        ok(fnAssert.neverCalledWith(sinon.match.falsy), "no failed asserts");
    });

    test("createUi5View with view data", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer({
                applicationType: sap.ushell.components.container.ApplicationType.URL,
                url: 'http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&bar=baz',
                // explicitely use ".view." in the view's path to check that this is no problem
                additionalInformation: 'SAPUI5=some.random.view.path.Viewname.view.xml'
            }),
            oView,
            oIcon = new sap.ui.core.Icon(),
            fnRegisterModulePath = sinon.spy(jQuery.sap, "registerModulePath"),
            // return a button instead of a view, so that we have a control with the necessary
            //  properties, but don't have to supply another file for the view definition
            fnCreateView = sinon.stub(sap.ui, "view").returns(oIcon),
            fnAssert = sinon.spy(jQuery.sap, "assert");

        oView = sap.ushell.components.container.createUi5View(oContainer, oContainer.getUrl(),
                oContainer.getAdditionalInformation());
        strictEqual(oView, oIcon, "createView returns our button");

        ok(fnRegisterModulePath.calledOnce, "registerModulePath called");
        ok(fnRegisterModulePath.calledWith("some.random.view.path",
            "http://anyhost:1234/sap/public/bc/ui2/staging/test/some/random/view/path"),
            "registerModulePath args");
        ok(fnCreateView.calledOnce, "createView called");
        ok(fnCreateView.calledWith({
            id: oContainer.getId() + "-content",
            type: "XML",
            viewData: {foo: ["bar", "baz"], bar: ["baz"]},
            viewName: "some.random.view.path.Viewname"
        }), "createView args");
        ok(fnAssert.neverCalledWith(sinon.match.falsy), "no failed asserts");
    });

    test("createUi5View: invalid view type", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer({
                applicationType: sap.ushell.components.container.ApplicationType.URL,
                url: 'http://anyhost:1234/sap/public/bc/ui2/staging/test',
                additionalInformation: 'SAPUI5=path.Viewname.view.foo'
            }),
            fnCreateView = sinon.spy(sap.ui, "view");

        //TODO does this appear in log or on UI?
        raises(function () {
            sap.ushell.components.container.createUi5View(oContainer, oContainer.getUrl(),
                    oContainer.getAdditionalInformation());
        });
        ok(fnCreateView.calledWith({
            id: oContainer.getId() + "-content",
            type: "FOO",
            viewData: {},
            viewName: "path.Viewname"
        }), "createView args");
    });

    function createComponentViaSapui5(sQueryString, oExpectedComponentData) {
        var oContainer = new sap.ushell.components.container.ApplicationContainer({
                applicationType: sap.ushell.components.container.ApplicationType.URL,
                url: 'http://anyhost:1234/sap/public/bc/ui2/staging/test' + sQueryString,
                additionalInformation: 'SAPUI5=some.random.path',
                width: "11%",
                height: "180px"
            }),
            oControl;

        sinon.spy(jQuery.sap, "registerModulePath");
        sinon.spy(jQuery.sap, "assert");
        sinon.spy(sap.ui, "component");

        oControl = sap.ushell.components.container.createUi5View(oContainer,
                oContainer.getUrl(), oContainer.getAdditionalInformation());

        ok(jQuery.sap.registerModulePath.calledOnce, "registerModulePath called once");
        ok(jQuery.sap.registerModulePath.calledWithExactly("some.random.path",
            "http://anyhost:1234/sap/public/bc/ui2/staging/test/some/random/path"),
            "registered the component correctly");
        strictEqual(oControl.getId(), oContainer.getId() + "-content", "component container ID");
        ok(oControl.getComponentInstance() instanceof some.random.path.Component,
            "created the correct component");
        strictEqual(oControl.getComponentInstance().getId(), oContainer.getId() + "-component",
            "component ID");
        deepEqual(oControl.getComponentInstance().getComponentData(), oExpectedComponentData,
            "passed the component data correctly");
        strictEqual(oControl.getWidth(), "11%");
        strictEqual(oControl.getHeight(), "180px");
        ok(oControl.hasStyleClass("sapUShellApplicationContainer"),
            "style sapUShellApplicationContainer applied");
        strictEqual(oControl.getParent(), oContainer, "control's parent is the container");
        ok(jQuery.sap.assert.neverCalledWith(sinon.match.falsy), "no failed asserts");
    }

    test("createUi5View: component w/o componentData", function () {
        createComponentViaSapui5('', {});
    });

    test("createUi5View: component w/ componentData", function () {
        createComponentViaSapui5('?foo=bar&foo=baz&bar=baz',
            {startupParameters: {foo: ['bar', 'baz'], bar: ['baz']}});
    });

    test("createUi5View: missing namespace", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer({
                applicationType: sap.ushell.components.container.ApplicationType.URL,
                url: 'http://anyhost:1234/',
                additionalInformation: 'SAPUI5=Viewname.view.js'
            });

        testFailingCreateUi5View(oContainer, "Missing namespace");
    });

    test("createUi5View: illegal namespace", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer({
                applicationType: sap.ushell.components.container.ApplicationType.URL,
                url: 'http://anyhost:1234/',
                additionalInformation: 'SAPUI5=foo/bar/view.Viewname.view.js'
            });

        testFailingCreateUi5View(oContainer, "Invalid SAPUI5 URL");
    });

    test("createUi5View: missing view name", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer({
                applicationType: sap.ushell.components.container.ApplicationType.URL,
                url: 'http://anyhost:1234/',
                additionalInformation: 'SAPUI5=.view.js'
            });

        testFailingCreateUi5View(oContainer, "Invalid SAPUI5 URL");
    });

    test("destroyChild() w/o child", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer();

        sinon.spy(oContainer, "destroyAggregation");

        sap.ushell.components.container.destroyChild(oContainer);

        ok(oContainer.destroyAggregation.calledWith("child"), "child destroyed");
    });

    test("destroyChild() w/ component", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer();

        sap.ushell.components.container.createUi5Component(oContainer,
                oContainer.getUrl(), 'some.random.path');

        sinon.spy(oContainer, "destroyAggregation");

        sap.ushell.components.container.destroyChild(oContainer);

        ok(oContainer.destroyAggregation.calledWith("child"), "child destroyed");
    });

    test("exit: destroyChild called", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer();

        sinon.spy(sap.ushell.components.container, "destroyChild");

        oContainer.exit();

        ok(sap.ushell.components.container.destroyChild.calledWith(oContainer),
            "destroyChild called");
    });

    test("exit: messageEventListener removed", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer(),
            fnListenerDummy = function () {};

        oContainer._messageEventListener = fnListenerDummy;
        sinon.spy(window, "removeEventListener");

        oContainer.exit();

        sinon.assert.calledWith(window.removeEventListener, "message", fnListenerDummy);
    });

    test("exit: storageEventListener removed", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer(),
            fnListenerDummy = function () {};

        oContainer._storageEventListener = fnListenerDummy;
        sinon.spy(window, "removeEventListener");

        oContainer.exit();

        sinon.assert.calledWith(window.removeEventListener, "storage", fnListenerDummy);
    });

    test("exit: unloadEventListener removed", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer(),
            fnListenerDummy = function () {};

        oContainer._unloadEventListener = fnListenerDummy;

        sinon.spy(window, "removeEventListener");

        oContainer.exit();

        sinon.assert.calledWith(window.removeEventListener, "unload", fnListenerDummy);
    });

    test("sap.ushell.components.container.render UI5 (SAPUI5.component=)", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer(),
            oControl = new sap.ui.core.Icon(), // any control with width and height is sufficient
            oRenderManager = new sap.ui.core.RenderManager();

        sinon.stub(sap.ushell.components.container, "createUi5Component")
            .returns(oControl);
        sinon.stub(sap.ushell.components.container, "renderControlInDiv");

        sap.ushell.components.container.render(oRenderManager.getRendererInterface(),
            oContainer, sap.ushell.components.container.ApplicationType.URL, sTESTURL,
            "SAPUI5.Component=some.random.path");
        ok(sap.ushell.components.container.createUi5Component.calledOnce);
        ok(sap.ushell.components.container.createUi5Component.calledWith(oContainer,
            sTESTURL, "some.random.path"));
        ok(sap.ushell.components.container.renderControlInDiv.calledWith(
            oRenderManager.getRendererInterface(),
            oContainer,
            oControl
        ));
    });

    test("createUi5Component", function () {
        var oContainer = new sap.ushell.components.container.ApplicationContainer({
                applicationType: sap.ushell.components.container.ApplicationType.URL,
                url: 'http://anyhost:1234/sap/public/bc/ui2/staging/test?foo=bar&foo=baz&bar=baz',
                additionalInformation: 'SAPUI5.Component=some.random.path',
                width: "11%",
                height: "180px"
            }),
            oControl;

        sinon.spy(jQuery.sap, "registerModulePath");
        sinon.spy(jQuery.sap, "require");
        sinon.spy(jQuery.sap, "assert");
        sinon.spy(sap.ushell.components.container, "destroyChild");
        sinon.spy(sap.ui, "component");

        oControl = sap.ushell.components.container.createUi5Component(oContainer,
                oContainer.getUrl(), 'some.random.path');

        ok(sap.ushell.components.container.destroyChild.calledBefore(sap.ui.component),
            "child destroyed before creating the component");
        ok(jQuery.sap.registerModulePath.calledWithExactly("some.random.path",
            "http://anyhost:1234/sap/public/bc/ui2/staging/test/"),
            "registered the component correctly");
        ok(!jQuery.sap.registerModulePath.calledWith("sap.ca"), "did not register sap.ca");
        ok(jQuery.sap.require.calledWithExactly("sap.ushell.services.CrossApplicationNavigation"));

        strictEqual(oControl.getId(), oContainer.getId() + "-content", "component container ID");
        ok(oControl.getComponentInstance() instanceof some.random.path.Component,
            "created the correct component");
        strictEqual(oControl.getComponentInstance().getId(), oContainer.getId() + "-component",
            "component ID");
        deepEqual(oControl.getComponentInstance().getComponentData(),
                {startupParameters: {foo: ["bar", "baz"], bar: ["baz"]}},
                "passed the component data correctly");
        strictEqual(oControl.getWidth(), "11%");
        strictEqual(oControl.getHeight(), "180px");
        ok(oControl.hasStyleClass("sapUShellApplicationContainer"),
            "style sapUShellApplicationContainer applied");
        strictEqual(oControl.getParent(), oContainer, "control's parent is the container");
        ok(jQuery.sap.assert.neverCalledWith(sinon.match.falsy), "no failed asserts");
    });

    [
        {additionalInfo: 'SAPUI5=some.random.path', configuration: {foo : "bar"}},
        {additionalInfo: 'SAPUI5.Component=some.random.path', configuration: {foo : "bar"}},
        {additionalInfo: 'SAPUI5=some.random.path.no.config', configuration: {}},
        {additionalInfo: 'SAPUI5.Component=some.random.path.no.config', configuration: {}},
        {additionalInfo: 'SAPUI5=some.random.path.SomeView.view.xml', configuration: undefined},
        {additionalInfo: undefined, configuration: undefined},
        {type: sap.ushell.components.container.ApplicationType.WDA, additionalInfo: undefined,
            configuration: undefined},
        {type: "INVALID_TYPE: Event fired even on error"}
    ].forEach(function (oFixture) {
        asyncTest("application configuration: " + JSON.stringify(oFixture), function () {
            var oContainer = new sap.ushell.components.container.ApplicationContainer(),
                oIcon = new sap.ui.core.Icon(),
                oRenderManager = new sap.ui.core.RenderManager();

            sinon.stub(sap.ui, "view").returns(oIcon);
            // no sinon spy as event handler:
            // SAPUI5 empties event object at end of EventProvider.prototype.fireEvent
            oContainer.attachApplicationConfiguration(function (oEvent) {
                start();
                ok(true, "event 'applicationConfiguration' sent");
                strictEqual(oEvent.getId(), "applicationConfiguration", "event name");
                deepEqual(oEvent.getParameter("configuration"), oFixture.configuration,
                    "event payload is component configuration");
            });
            sap.ushell.components.container.render(oRenderManager.getRendererInterface(),
                oContainer,
                oFixture.type || sap.ushell.components.container.ApplicationType.URL,
                "http://anyhost:1234/ushell/test-resources/sap/ushell/test/components/container",
                oFixture.additionalInfo);
        });
    });

    test("ApplicationContainer invisible with Application", function () {
        var oApplication = getApplication(),
            oContainer = new sap.ushell.components.container.ApplicationContainer({
                application: oApplication,
                visible: false
            }),
            oRenderManager = new sap.ui.core.RenderManager();

        sinon.stub(sap.ushell.components.container, "render");
        oRenderManager.render(oContainer, document.createElement("DIV"));

        ok(sap.ushell.components.container.render.notCalled);
    });

    test("ApplicationContainer Application rendering", function () {
        var oApplication = getApplication({
                type: sap.ushell.components.container.ApplicationType.URL,
                url: sTESTURL
            }),
            oContainer = new sap.ushell.components.container.ApplicationContainer({
                applicationType: sap.ushell.components.container.ApplicationType.WDA,
                application: oApplication,
                url: "/should/not/be/used",
                additionalInformation: "SAPUI5=should.not.be.used.view.xml"
            });

        renderAndExpect(oContainer, oApplication.getType(), oApplication.getUrl(), "");
    });

    test("createSystemForUrl", function () {

        function check(sUrl, oExpectedSystem) {
            var oSystem = sap.ushell.components.container.createSystemForUrl(sUrl);
            strictEqual(oSystem.getAlias(), oExpectedSystem.alias, "alias for " + sUrl);
            strictEqual(oSystem.getBaseUrl(), oExpectedSystem.baseUrl, "baseUrl for " + sUrl);
            strictEqual(oSystem.getClient(), oExpectedSystem.client, "client for " + sUrl);
            strictEqual(oSystem.getPlatform(), "abap", "platform for " + sUrl);
        }

        check("http://anyhost:1234/sap/bc/ui2/wda/~canvas?foo=bar", {
            alias: "http://anyhost:1234",
            baseUrl: "http://anyhost:1234"
        });
        check("http://anyhost:1234/sap/bc/ui2/wda/~canvas?foo=bar&sap-client=120", {
            alias: "http://anyhost:1234?sap-client=120",
            baseUrl: "http://anyhost:1234",
            client: "120"
        });
    });

    asyncTest("ApplicationContainer logout de-/registration", function () {
        sap.ushell.bootstrap("demo").done(function () {

            var oContainer = new sap.ushell.components.container.ApplicationContainer({
                    applicationType: sap.ushell.components.container.ApplicationType.WDA
                }),
                fnLogout;

            sinon.stub(sap.ushell.Container, "addRemoteSystem");
            sinon.stub(sap.ushell.Container, "attachLogoutEvent");
            sinon.stub(sap.ushell.Container, "detachLogoutEvent");
            sinon.spy(sap.ushell.components.container, "createSystemForUrl");

            start();
            renderInternallyAndExpectIFrame(oContainer,
                    sap.ushell.components.container.ApplicationType.WDA,
                    'http://anyhost:1234/sap/bc/ui2/wda/~canvas');
            ok(sap.ushell.Container.attachLogoutEvent.callCount === 0, "logout NOT registered");
            strictEqual(sap.ushell.components.container.getLogoutHandler(oContainer), undefined);

            renderInternallyAndExpectIFrame(oContainer,
                sap.ushell.components.container.ApplicationType.NWBC,
                'http://anyhost:1234/sap/bc/ui2/NWBC/~canvas?sap-client=120', "additionalInfo");
            ok(sap.ushell.Container.attachLogoutEvent.callCount === 1, "logout registered");
            fnLogout = sap.ushell.Container.attachLogoutEvent.args[0][0];
            ok(typeof fnLogout === "function", "a logout has been attached");
            strictEqual(sap.ushell.components.container.getLogoutHandler(oContainer), fnLogout);
            ok(sap.ushell.components.container.createSystemForUrl
                .calledWith("http://anyhost:1234/sap/bc/ui2/NWBC/~canvas?sap-client=120"),
                "created a system for the URL");
            ok(sap.ushell.Container.addRemoteSystem
                .calledWith(sap.ushell.components.container.createSystemForUrl.returnValues[0]),
                "the system was added to the controller");

            sap.ushell.Container.attachLogoutEvent.reset();
            sap.ushell.Container.detachLogoutEvent.reset();
            renderInternallyAndExpectIFrame(oContainer,
                sap.ushell.components.container.ApplicationType.WDA,
                'http://anyhost:1234/sap/bc/ui2/WDA/~canvas', "additionalInfo");
            ok(sap.ushell.Container.detachLogoutEvent.callCount === 1, "logout deregistered");
            strictEqual(sap.ushell.Container.detachLogoutEvent.args[0][0], fnLogout);
            ok(sap.ushell.Container.attachLogoutEvent.callCount === 0, "logout NOT registered");
            strictEqual(sap.ushell.components.container.getLogoutHandler(oContainer), undefined);

            sap.ushell.Container.attachLogoutEvent.reset();
            sap.ushell.Container.detachLogoutEvent.reset();
            renderInternallyAndExpectIFrame(oContainer,
                sap.ushell.components.container.ApplicationType.NWBC,
                'http://anyhost:1234/sap/bc/ui2/NWBC/~canvas', "additionalInfo");
            fnLogout = sap.ushell.Container.attachLogoutEvent.args[0][0];

            strictEqual(sap.ushell.components.container.getLogoutHandler(oContainer), fnLogout);
            oContainer.exit();
            strictEqual(sap.ushell.components.container.getLogoutHandler(oContainer), undefined,
                "logout deregistered after exit");
            ok(sap.ushell.Container.detachLogoutEvent.called, "logout deregistered on exit");
        });
    });

    asyncTest("ApplicationContainer NWBC Logoff fired", function () {
        sap.ushell.bootstrap("demo").done(function () {
            var oContainer = new sap.ushell.components.container.ApplicationContainer({
                    applicationType: sap.ushell.components.container.ApplicationType.NWBC
                }),
                fnPostMessage = sinon.spy(function (sMessage, sOrigin) {
                    strictEqual(JSON.parse(sMessage).action, "pro54_disableDirtyHandler",
                        "disable NWBC window.beforeUnload handlers");
                }),
                oEvent = new sap.ui.base.Event(),
                fnGetAttribute = sinon.stub().returns("http://anyhost:1234/sap/bc/ui2/nwbc/~canvas"),
                fnSetAttribute = sinon.spy(),
                sTagName;
            start();
            sinon.spy(oEvent, "preventDefault");
            sinon.stub(oContainer, "getDomRef", function () {
                return {
                    setAttribute: fnSetAttribute,
                    getAttribute: fnGetAttribute,
                    contentWindow: {
                        postMessage: fnPostMessage
                    },
                    tagName: sTagName
                };
            });

            renderInternallyAndExpectIFrame(oContainer,
                sap.ushell.components.container.ApplicationType.NWBC,
                'http://anyhost:1234/sap/bc/ui2/nwbc/~canvas');

            // don't do anything if the tagName doesn't match "IFRAME"
            // sTagName is here undefined
            sap.ushell.components.container.logout(oContainer, oEvent);
            sTagName = "FOO";
            sap.ushell.components.container.logout(oContainer, oEvent);
            ok(oEvent.preventDefault.notCalled, "preventDefault not called");
            ok(fnSetAttribute.notCalled, "setAttribute not called");
            ok(fnPostMessage.notCalled, "postMessage not called");

            // logout via iFrame fired
            sTagName = "IFRAME";
            sap.ushell.components.container.logout(oContainer, oEvent);
            ok(oEvent.preventDefault.calledOnce, "preventDefault called");
            ok(fnPostMessage.calledOnce, "postMessage called");
        });
    });

    test("ApplicationContainer NWBC Logoff 2 Instances", function () {
        var oContainer1 = new sap.ushell.components.container.ApplicationContainer({
                applicationType: sap.ushell.components.container.ApplicationType.NWBC
            }),
            oContainer2 = new sap.ushell.components.container.ApplicationContainer({
                applicationType: sap.ushell.components.container.ApplicationType.NWBC
            }),
            oEvent = new sap.ui.base.Event(),
            fnGetAttribute = sinon.spy(),
            fnSetAttribute = sinon.spy(),
            fnLogout1,
            fnLogout2;

        sap.ushell.Container = {
            addRemoteSystem: sinon.stub(),
            attachLogoutEvent:  sinon.stub(),
            detachLogoutEvent:  sinon.stub(),
            DirtyState: {
                CLEAN: "CLEAN",
                DIRTY: "DIRTY",
                MAYBE_DIRTY: "MAYBE_DIRTY",
                PENDING: "PENDING",
                INITIAL: "INITIAL"
            }
        };

        sinon.spy(oEvent, "preventDefault");
        sinon.stub(oContainer1, "getDomRef", function () {
            return {setAttribute: fnSetAttribute,
                    getAttribute: fnGetAttribute,
                    tagName: "IFRAME"};
        });
        sinon.stub(oContainer2, "getDomRef", function () {
            return {setAttribute: fnSetAttribute,
                    getAttribute: fnGetAttribute,
                    tagName: "IFRAME"};
        });
        sinon.spy(sap.ushell.components.container, "logout");

        // render first container
        renderInternallyAndExpectIFrame(oContainer1,
            sap.ushell.components.container.ApplicationType.NWBC,
            'http://anyhost:1234/sap/bc/ui2/nwbc/~canvas');
        ok(sap.ushell.Container.attachLogoutEvent.callCount === 1, "logout registered 1st");
        fnLogout1 = sap.ushell.Container.attachLogoutEvent.args[0][0];

        // render second container
        renderInternallyAndExpectIFrame(oContainer2,
            sap.ushell.components.container.ApplicationType.NWBC,
            'http://anyhost:4321/sap/bc/ui2/nwbc/~canvas');
        ok(sap.ushell.Container.attachLogoutEvent.callCount === 2, "logout registered 2nd");
        fnLogout2 = sap.ushell.Container.attachLogoutEvent.args[1][0];
        ok(fnLogout1 !== fnLogout2, "first and second logout registration different");

        // test logout map entries
        strictEqual(sap.ushell.components.container.getLogoutHandler(oContainer1), fnLogout1);
        strictEqual(sap.ushell.components.container.getLogoutHandler(oContainer2), fnLogout2);
    });

    asyncTest("ApplicationContainer Application with resolve", function () {
        var oApplication = getApplication({
                text: "test application",
                url: "/should/not/be/used",
                resolvable: true
            }),
            oContainer = new sap.ushell.components.container.ApplicationContainer({
                application: oApplication,
                applicationType: sap.ushell.components.container.ApplicationType.WDA,
                url: "/should/not/be/used/either",
                additionalInformation: "SAPUI5=should.not.be.used.view.xml"
            }),
            oLaunchpadData = {
                applicationType: "URL",
                applicationData: "SAPUI5=some.random.view.xml",
                Absolute: {
                    url: sTESTURL + "?"
                }
            },
            oLogMock = sap.ui2.srvc.test.createLogMock()
                .filterComponent(sCONTAINER)
                .debug("Resolving " + oApplication.getUrl(), null, sCONTAINER)
                .debug("Resolved " + oApplication.getUrl(), JSON.stringify(oLaunchpadData),
                    sCONTAINER),
            oRenderManager = new sap.ui.core.RenderManager(),
            oLoadingIndicator;

        sinon.stub(sap.ushell.components.container, "getTranslatedText").returns("foo");
        sinon.stub(oApplication, "resolve", function (fnSuccess, fnError) {
            // simulate the resolve: call success handler with (necessary) launchpad data
            sap.ui2.srvc.call(function () {
                fnSuccess(oLaunchpadData);
                // verify
                start();
                ok(oContainer.getAggregation("child") === null,
                    "Loading indicator has been deleted again");

                // As a consequence of the invalidate UI5 would render again; simulate this
                renderAndExpect(oContainer, "URL", sTESTURL, "SAPUI5=some.random.view.xml");

                oLogMock.verify();
            }, fnError, true);
        });

        sinon.stub(sap.ushell.components.container, "renderControlInDiv");

        oRenderManager.render(oContainer, document.createElement("DIV"));

        oLoadingIndicator = oContainer.getAggregation("child");
        ok(sap.ushell.components.container.renderControlInDiv.calledWith(
            oRenderManager.getRendererInterface(),
            oContainer,
            oLoadingIndicator
        ));
        ok(sap.ushell.components.container.getTranslatedText.calledWith("loading",
            [oApplication.getText()]), "loading indicator text requested");
        strictEqual(oLoadingIndicator.getText(), "foo", "Loading indicator text ok");
    });

    [undefined, sinon.spy()].forEach(function (fnApplicationErrorHandler) {
        var sResolveFailed = "resolve failed";
        asyncTest("ApplicationContainer Application resolve error w/" +
                (fnApplicationErrorHandler ? "" : "o") + " error handler",
             function () {
                var oApplication = getApplication({
                    resolvable: true,
                    errorHandler: fnApplicationErrorHandler
                }),
                    oContainer = new sap.ushell.components.container.ApplicationContainer({
                        application: oApplication
                    }),
                    oDiv = document.createElement("DIV"),
                    oRenderManager = new sap.ui.core.RenderManager();

                sinon.spy(sap.ushell.components.container, "createErrorControl");
                sinon.stub(sap.ushell.components.container, "renderControlInDiv");
                sinon.stub(oApplication, "resolve", function (fnSuccess, fnError) {
                    sap.ui2.srvc.call(function () {
                        // simulate the resolve: call error handler (asynchronously)
                        fnError(sResolveFailed);

                        // verify
                        ok(sap.ushell.components.container.createErrorControl.notCalled);
                        if (fnApplicationErrorHandler) {
                            ok(fnApplicationErrorHandler.calledOnce);
                            ok(fnApplicationErrorHandler.calledWith(sResolveFailed));
                        }

                        // simulate SAPUI5's automatic re-rendering
                        oRenderManager.render(oContainer, oDiv);

                        // verify
                        start();
                        ok(sap.ushell.components.container.createErrorControl.calledOnce);
                        ok(sap.ushell.components.container.renderControlInDiv.calledWith(
                            oRenderManager.getRendererInterface(),
                            oContainer,
                            sap.ushell.components.container.createErrorControl.returnValues[0]
                        ));
                    }, sap.ui2.srvc.test.onError, true);
                });

                oRenderManager.render(oContainer, oDiv);
            });
    });

    test("ApplicationContainer init", function () {
        var oContainer;

        sinon.spy(jQuery.sap, "uid");
        sinon.spy(window, "addEventListener");
        oContainer = new sap.ushell.components.container.ApplicationContainer();

        ok(jQuery.sap.uid.calledOnce);
        strictEqual(oContainer.globalDirtyStorageKey, "sap.ushell.Container.dirtyState." +
            jQuery.sap.uid.returnValues[0], "right ID");
        ok(window.addEventListener.calledWith("unload"), "unload registered");
        ok(window.addEventListener.calledWith("storage"), "storage registered");
        ok(window.addEventListener.calledWith("message"), "message registered");
    });


    test("ApplicationContainer IDs in sync with localStorage", function () {
        var oContainer;

        oContainer = new sap.ushell.components.container.ApplicationContainer();

        sap.ushell.Container = {
            addRemoteSystem: sinon.stub(),
            attachLogoutEvent:  sinon.stub(),
            detachLogoutEvent:  sinon.stub(),
            DirtyState: {
                CLEAN: "CLEAN",
                DIRTY: "DIRTY",
                MAYBE_DIRTY: "MAYBE_DIRTY",
                PENDING: "PENDING",
                INITIAL: "INITIAL"
            }
        };

        renderInternallyAndExpectIFrame(oContainer,
            sap.ushell.components.container.ApplicationType.NWBC,
            'http://anyhost:1234/sap/bc/ui2/NWBC/~canvas?sap-client=120', "additionalInfo");
        ok(Storage.prototype.removeItem.calledWith(oContainer.globalDirtyStorageKey),
            "removeItem called");
        ok(Storage.prototype.setItem.calledWith(oContainer.globalDirtyStorageKey, "INITIAL"),
            "calledWith right ID");

        // render second time
        Storage.prototype.removeItem.reset();
        Storage.prototype.setItem.reset();
        renderInternallyAndExpectIFrame(oContainer,
            sap.ushell.components.container.ApplicationType.NWBC,
            'http://anyhost:1234/sap/bc/ui2/NWBC/~canvas?sap-client=120', "additionalInfo");
        ok(Storage.prototype.removeItem.calledWith(oContainer.globalDirtyStorageKey),
            "removeItem called");
        ok(Storage.prototype.setItem.calledWith(oContainer.globalDirtyStorageKey, "INITIAL"),
            "calledWith right ID");
        Storage.prototype.removeItem.reset();
        oContainer.exit();
        ok(Storage.prototype.removeItem.calledOnce, "removeItem called after exit");
    });

    asyncTest("handleMessageEvent for pro54_setGlobalDirty", function () {
        sap.ushell.bootstrap("demo").done(function () {
            var oApplicationContainer,
                oContentWindow = {},
                oMessage = {
                    data: {
                        action: "pro54_setGlobalDirty",
                        parameters: {
                            globalDirty: "DIRTY"
                        }
                    },
                    source: oContentWindow
                },
                oLogMock = sap.ui2.srvc.test.createLogMock()
                    .filterComponent("sap.ushell.components.container.ApplicationContainer"),
                sStorageKey;

            sinon.spy(sap.ushell.utils, "localStorageSetItem");
            sinon.stub(Storage.prototype, "getItem", function (sKey) {
                return "PENDING";
            });
            oApplicationContainer = new sap.ushell.components.container.ApplicationContainer({
                applicationType: sap.ushell.components.container.ApplicationType.NWBC
            });
            sinon.stub(oApplicationContainer, "getDomRef").returns({
                tagName: "IFRAME",
                contentWindow: oContentWindow
            });

            sStorageKey = oApplicationContainer.globalDirtyStorageKey;
            oLogMock.debug("getGlobalDirty() pro54_setGlobalDirty SetItem key:" +
                    sStorageKey + " value: " + oMessage.data.parameters.globalDirty,
                    null,
                    "sap.ushell.components.container.ApplicationContainer");
            sap.ushell.components.container.handleMessageEvent(oApplicationContainer, oMessage);

            ok(Storage.prototype.setItem.calledWith(sStorageKey, "DIRTY"),
                "localStorage.setItem called");
            ok(sap.ushell.utils.localStorageSetItem.calledWith(sStorageKey,
                "DIRTY", true),
                "localStorageSetItem wrapper called with third paramaeter");
            oLogMock.verify();

            // second test: message from wrong window
            oMessage.source = {};
            sap.ushell.utils.localStorageSetItem.reset();

            sap.ushell.components.container.handleMessageEvent(oApplicationContainer, oMessage);
            ok(sap.ushell.utils.localStorageSetItem.notCalled);

            // third test: message when no DOM ref
            oApplicationContainer.getDomRef.returns(undefined);
            sap.ushell.utils.localStorageSetItem.reset();

            sap.ushell.components.container.handleMessageEvent(oApplicationContainer, oMessage);
            ok(sap.ushell.utils.localStorageSetItem.notCalled);

            // TODO test when not PENDING
            // TODO test with stringified oMessage.data (parseable/non-parseable)
            start();
        });
    });

    test("handleMessageEvent for CrossApplicationNavigation with data as JSON object", function () {
        var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        delete oMessage.data.type;
        sinon.spy(sap.ushell.components.container, "handleCrossApplicationNavigationMessageEvent");

        // function to be tested
        sap.ushell.components.container.handleMessageEvent(undefined, oMessage);

        ok(sap.ushell.components.container.handleCrossApplicationNavigationMessageEvent.calledOnce,
            "checks if handleCrossApplicationNavigationMessageEvent method gets called only once");
        ok(sap.ushell.components.container.handleCrossApplicationNavigationMessageEvent
            .calledWith(undefined, oMessage, oMessage.data), "called with correct parameters");
    });

    test("handleMessageEvent for CrossApplicationNavigation with data as string", function () {
        var oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        delete oMessage.data.type;
        oMessage.data = JSON.stringify(oMessage.data);
        sinon.spy(sap.ushell.components.container, "handleCrossApplicationNavigationMessageEvent");

        // function to be tested
        sap.ushell.components.container.handleMessageEvent(undefined, oMessage);

        ok(sap.ushell.components.container.handleCrossApplicationNavigationMessageEvent.calledOnce,
            "checks if handleCrossApplicationNavigationMessageEvent method gets called only once");
        ok(sap.ushell.components.container.handleCrossApplicationNavigationMessageEvent
            .calledWith(undefined, oMessage, JSON.parse(oMessage.data)), "called with correct parameters");
    });

    test("handleCrossApplicationNavigationMessageEvent with config on", function () {
        var oLogMock,
            oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
        sinon.stub(sap.ushell.components.container, "isTrustedPostMessageSource").returns(false);
        oLogMock = sap.ui2.srvc.test.createLogMock()
            .filterComponent("sap.ushell.components.container.ApplicationContainer")
            .warning("Received message from untrusted origin: " + oMessage.origin,
                oMessage.data, "sap.ushell.components.container.ApplicationContainer");

        // function to be tested
        sap.ushell.components.container
            .handleCrossApplicationNavigationMessageEvent(undefined, oMessage, oMessage.data);

        oLogMock.verify();
    });

    test("handleCrossApplicationNavigationMessageEvent with config off", function () {
        var oLogMock,
            oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        sinon.stub(jQuery.sap, "getObject").returns({enabled: false});
        oLogMock = sap.ui2.srvc.test.createLogMock()
            .filterComponent("sap.ushell.components.container.ApplicationContainer")
            .warning("Received message for CrossApplicationNavigation, but this feature is " +
                    "disabled. It can be enabled via launchpad configuration property " +
                    "'services.PostMessage.config.enabled: true'",
                undefined, "sap.ushell.components.container.ApplicationContainer");

        // function to be tested
        sap.ushell.components.container
            .handleCrossApplicationNavigationMessageEvent(undefined, oMessage, oMessage.data);

        oLogMock.verify();
    });

    test("handleCrossApplicationNavigationMessageEvent with no post message config", function () {
        var oLogMock,
            oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        sinon.stub(jQuery.sap, "getObject").returns({});
        sinon.stub(sap.ushell.components.container, "isTrustedPostMessageSource").returns(false);
        oLogMock = sap.ui2.srvc.test.createLogMock()
            .filterComponent("sap.ushell.components.container.ApplicationContainer")
            .warning("Received message from untrusted origin: " + oMessage.origin,
                oMessage.data, "sap.ushell.components.container.ApplicationContainer");

        // function to be tested
        sap.ushell.components.container
            .handleCrossApplicationNavigationMessageEvent(undefined, oMessage, oMessage.data);

        oLogMock.verify();
    });

    test("handleCrossApplicationNavigationMessageEvent service definition", function () {

        // Test if the handleCrossApplicationNavigationMessageEvent method doesn't return
        // when the service starts with sap.ushell.services.CrossApplicationNavigation.

        //test data
        var oLogMock,
            oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

        // test preparation
        sinon.stub(jQuery.sap, "getObject").returns({enabled: false});
        oLogMock = sap.ui2.srvc.test.createLogMock()
            .filterComponent("sap.ushell.components.container.ApplicationContainer")
            .warning("Received message for CrossApplicationNavigation, but this feature is disabled."
                    + " It can be enabled via launchpad configuration property 'services.PostMessage.config.enabled: true'",
                    undefined, "sap.ushell.components.container.ApplicationContainer");

        // function to be tested
        sap.ushell.components.container
            .handleCrossApplicationNavigationMessageEvent(undefined, oMessage, oMessage.data);

        oLogMock.verify();

        // Test the behaviour of the handleCrossApplicationNavigationMessageEvent method in the case it has a
        // service string defined which is not starting with sap.ushell.services.CrossApplicationNavigation. The method
        // then has to return and NOT log a warning (as defined in the next conditional block)

        //test data
        oMessage.data.service = "otherService";

        // test preparation
        sinon.spy(jQuery.sap.log, "warning");

        // function to be tested
        sap.ushell.components.container
            .handleCrossApplicationNavigationMessageEvent(undefined, oMessage, oMessage.data);

        ok(!jQuery.sap.log.warning.called, "No warning logged");
    });

    test("handleCrossApplicationNavigationMessageEvent hrefForExternal", function () {
        sap.ushell.bootstrap("demo").done(function () {
            //test data
            var oContainer = new sap.ushell.components.container.ApplicationContainer(),
                oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

            // test preparation
            oMessage.data.service = "sap.ushell.services.CrossApplicationNavigation.hrefForExternal";
            oMessage.source.postMessage = sinon.spy();
            sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
            sinon.stub(sap.ushell.components.container, "isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({hrefForExternal: sinon.stub().returns("result")});

            // function to be tested
            sap.ushell.components.container
                .handleCrossApplicationNavigationMessageEvent(oContainer, oMessage, oMessage.data);

            // we expect a successful call
            ok(sap.ushell.Container.getService().hrefForExternal.calledOnce, "hrefForExternal was called once");
            ok(oMessage.source.postMessage.calledOnce, "postMessage was called once");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessage.data.service,
                request_id: oMessage.data.request_id,
                status: "success",
                body: {
                    result: "result"
                }
            }), oMessage.origin), "parameter list is correct");

            // adapt test data to throw exception
            sap.ushell.Container.getService().hrefForExternal.throws(oFakeError);

            // function to be tested
            sap.ushell.components.container
                .handleCrossApplicationNavigationMessageEvent(oContainer, oMessage, oMessage.data);

            // we expect an error
            ok(oMessage.source.postMessage.calledTwice, "postMessage was called a second time");
            ok(sap.ushell.Container.getService().hrefForExternal.calledTwice, "hrefForExternal was called a second time");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessage.data.service,
                request_id: oMessage.data.request_id,
                status: "error",
                body: {
                    message: oFakeError.message
                }
            }), oMessage.origin), "exception correctly handled");
        });
    });

    test("handleCrossApplicationNavigationMessageEvent getSemanticObjectLinks", function () {
        sap.ushell.bootstrap("demo").done(function () {
            //test data
            var oContainer = new sap.ushell.components.container.ApplicationContainer(),
                oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

            // test preparation
            oMessage.data.service = "sap.ushell.services.CrossApplicationNavigation.getSemanticObjectLinks";
            oMessage.source.postMessage = sinon.spy();
            sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
            sinon.stub(sap.ushell.components.container, "isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({
                getSemanticObjectLinks: sinon.stub().returns(new jQuery.Deferred().resolve("result").promise())
            });

            // simulate event
            sap.ushell.components.container
                .handleCrossApplicationNavigationMessageEvent(oContainer, oMessage, oMessage.data);

            // check result
            ok(sap.ushell.Container.getService().getSemanticObjectLinks.calledOnce, "getSemanticObjectLinks was called");
            ok(oMessage.source.postMessage.calledOnce, "postMessage was called once");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessage.data.service,
                request_id: oMessage.data.request_id,
                status: "success",
                body: {
                    result: "result"
                }
            }), oMessage.origin), "parameter list is correct");

            // adapt conditions to reject promise
            sap.ushell.Container.getService.returns({
                getSemanticObjectLinks: sinon.stub().returns(new jQuery.Deferred().reject("rejected!").promise())
            });

            // simulate event
            sap.ushell.components.container
                .handleCrossApplicationNavigationMessageEvent(oContainer, oMessage, oMessage.data);

            // we expect an error
            ok(sap.ushell.Container.getService().getSemanticObjectLinks.calledOnce, "getSemanticObjectLinks was called");
            ok(oMessage.source.postMessage.calledTwice, "postMessage was called a second time");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessage.data.service,
                request_id: oMessage.data.request_id,
                status: "error",
                body: {
                    message: "rejected!"
                }
            }), oMessage.origin), "exception correctly handled");

            // adapt test conditions to throw error when calling service method
            sap.ushell.Container.getService().getSemanticObjectLinks.throws(oFakeError);

            // simulate event
            sap.ushell.components.container
                .handleCrossApplicationNavigationMessageEvent(oContainer, oMessage, oMessage.data);

            // we expect an error
            ok(sap.ushell.Container.getService().getSemanticObjectLinks.calledTwice, "getSemanticObjectLinks was called");
            ok(oMessage.source.postMessage.calledThrice, "postMessage was called a third time");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessage.data.service,
                request_id: oMessage.data.request_id,
                status: "error",
                body: {
                    message: oFakeError.message
                }
            }), oMessage.origin), "exception correctly handled");
        });
    });

    test("handleCrossApplicationNavigationMessageEvent isIntentSupported", function () {
        sap.ushell.bootstrap("demo").done(function () {
            //test data
            var oContainer = new sap.ushell.components.container.ApplicationContainer(),
                oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

            // test preparation
            oMessage.data.service = "sap.ushell.services.CrossApplicationNavigation.isIntentSupported";
            oMessage.source.postMessage = sinon.spy();
            sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
            sinon.stub(sap.ushell.components.container, "isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({
                isIntentSupported: sinon.stub().returns(new jQuery.Deferred().resolve("result").promise())
            });

            // simulate event
            sap.ushell.components.container
                .handleCrossApplicationNavigationMessageEvent(oContainer, oMessage, oMessage.data);

            // check result
            ok(sap.ushell.Container.getService().isIntentSupported.calledOnce, "isIntentSupported was called");
            ok(oMessage.source.postMessage.calledOnce, "postMessage was called once");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessage.data.service,
                request_id: oMessage.data.request_id,
                status: "success",
                body: {
                    result: "result"
                }
            }), oMessage.origin), "parameter list is correct");

            // adapt conditions to reject promise
            sap.ushell.Container.getService.returns({
                isIntentSupported: sinon.stub().returns(new jQuery.Deferred().reject("rejected!").promise())
            });

            // simulate event
            sap.ushell.components.container
                .handleCrossApplicationNavigationMessageEvent(oContainer, oMessage, oMessage.data);

            // we expect an error
            ok(sap.ushell.Container.getService().isIntentSupported.calledOnce, "isIntentSupported was called");
            ok(oMessage.source.postMessage.calledTwice, "postMessage was called a second time");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessage.data.service,
                request_id: oMessage.data.request_id,
                status: "error",
                body: {
                    message: "rejected!"
                }
            }), oMessage.origin), "exception correctly handled");

            // adapt test conditions to throw error when calling service method
            sap.ushell.Container.getService().isIntentSupported.throws(oFakeError);

            // simulate event
            sap.ushell.components.container
                .handleCrossApplicationNavigationMessageEvent(oContainer, oMessage, oMessage.data);

            // we expect an error
            ok(sap.ushell.Container.getService().isIntentSupported.calledTwice, "isIntentSupported was called");
            ok(oMessage.source.postMessage.calledThrice, "postMessage was called a third time");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessage.data.service,
                request_id: oMessage.data.request_id,
                status: "error",
                body: {
                    message: oFakeError.message
                }
            }), oMessage.origin), "exception correctly handled");
        });
    });

    test("handleCrossApplicationNavigationMessageEvent toExternal", function () {
        sap.ushell.bootstrap("demo").done(function () {
            //test data
            var oContainer = new sap.ushell.components.container.ApplicationContainer(),
                oMessage = JSON.parse(JSON.stringify(oMessageTemplate));

            // test preparation
            oMessage.data.service = "sap.ushell.services.CrossApplicationNavigation.toExternal";
            oMessage.source.postMessage = sinon.spy();
            sinon.stub(jQuery.sap, "getObject").returns({enabled: true});
            sinon.stub(sap.ushell.components.container, "isTrustedPostMessageSource").returns(true);
            sinon.stub(sap.ushell.Container, "getService").returns({ toExternal: sinon.stub() });

            // function to be tested
            sap.ushell.components.container
                .handleCrossApplicationNavigationMessageEvent(oContainer, oMessage, oMessage.data);

            // we expect a successful response
            ok(sap.ushell.Container.getService().toExternal.calledOnce, "toExternal was called once");
            ok(oMessage.source.postMessage.calledOnce, "postMessage was called");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessage.data.service,
                request_id: oMessage.data.request_id,
                status: "success",
                body: {}
            }), oMessage.origin), "parameters as expected");

            // adapt test data
            sap.ushell.Container.getService().toExternal.throws(oFakeError);

            // simulate event
            sap.ushell.components.container
                .handleCrossApplicationNavigationMessageEvent(oContainer, oMessage, oMessage.data);

            // we expect an error response
            ok(sap.ushell.Container.getService().toExternal.calledTwice, "toExternal was called a second time");
            ok(oMessage.source.postMessage.calledTwice, "postMessage was called a second time");
            ok(oMessage.source.postMessage.calledWith(JSON.stringify({
                type: "response",
                service: oMessage.data.service,
                request_id: oMessage.data.request_id,
                status: "error",
                body: {
                    message: oFakeError.message
                }
            }), oMessage.origin), "parameters as expected");

        });
    });

    asyncTest("ApplicationContainer localStorage eventing", function () {
        sap.ushell.bootstrap("demo").done(function () {
            var oContainer,
                oContentWindow = {
                    postMessage: sinon.spy(function (sMessage, sOrigin) {
                        start();
                        strictEqual(JSON.parse(sMessage).action, "pro54_getGlobalDirty",
                            "NWBC.getGlobalDirty fired");
                    })
                },
                oLogMock = sap.ui2.srvc.test.createLogMock()
                    .filterComponent("sap.ushell.components.container.ApplicationContainer")
                    .debug("getGlobalDirty() send pro54_getGlobalDirty ",
                            null,
                            "sap.ushell.components.container.ApplicationContainer"),
                sStorageKey,
                oStorageEvent = document.createEvent("StorageEvent");


            oContainer = new sap.ushell.components.container.ApplicationContainer({
                applicationType: sap.ushell.components.container.ApplicationType.NWBC
            });

            sStorageKey = oContainer.globalDirtyStorageKey;

            sinon.stub(oContainer, "getDomRef", function () {
                return {
                    contentWindow: oContentWindow,
                    tagName: "IFRAME"
                };
            });

            renderInternallyAndExpectIFrame(oContainer,
                    oContainer.getApplicationType(),
                    'http://anyhost:1234/sap/bc/ui2/NWBC/~canvas?sap-client=120', "additionalInfo");


            oStorageEvent.initStorageEvent("storage", false, false, sStorageKey, "", "PENDING",
                "", localStorage);

            sinon.spy(sap.ushell.utils, "localStorageSetItem");
            sinon.stub(Storage.prototype, "getItem").returns("PENDING");

            // code under test
            dispatchEvent(oStorageEvent);
            ok(oContentWindow.postMessage.calledOnce);
            oLogMock.verify();

        });
    });

    //TODO test 2nd rendering should not recreate view
    //TODO add new HTML5 property seamless?!
}());
