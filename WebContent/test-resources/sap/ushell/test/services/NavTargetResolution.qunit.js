 // Copyright (c) 2014 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.NavTargetResolution and customizable
 * extensions
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
      notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
      jQuery, sap, sinon, window, hasher */

    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.services.NavTargetResolution");
    jQuery.sap.require("sap.ushell.adapters.demo.NavTargetResolutionAdapter");

    // we use a custom adapter as spy and stub
    var theLastHashFragment = null;
    jQuery.sap.declare("sap.ushell.unittest.NavTargetResolutionAdapterStub");
    sap.ushell.unittest.NavTargetResolutionAdapterStub = function () {
        this.resolveHashFragment = function (sHashFragment) {
            theLastHashFragment = sHashFragment;
            return (new jQuery.Deferred()).resolve("resolvedTo:" + sHashFragment).promise();
        };
    };

    module(
        "sap.ushell.services.NavTargetResolution",
        {
            setup : function () {
                window["sap-ushell-config"] = {
                    services: {
                        NavTargetResolution: {
                            config: {
                                allowTestUrlComponentConfig : true,
                                runStandaloneAppFolderWhitelist: {
                                    "/sap/bc/ui5_ui5/" : true,
                                    "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/" : true,
                                    "ABC" : true,
                                    "ABC/def" : true,
                                    "/a/b/c" : true,
                                    "abc/def" : true
                                }
                            }
                        }
                    }
                };
            },
            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown : function () {
                window["sap-ushell-config"] = {};
                sap.ui2.srvc.test
                    .restoreSpies(
                        jQuery.sap.getUriParameters
                    );
                delete sap.ushell.Container;
            }
        }
    );


    test("singleton instantiated", function () {
        sap.ushell.bootstrap("demo");
        // modules cannot be unloaded; so this test should be the first in order
        ok(typeof sap.ushell.Container.getService("NavTargetResolution") === "object");
    });

    function evalNow(oPromise) {
        var res, bIsDone = false;
        oPromise.done(function (pRes) {
            res = pRes;
            bIsDone = true;
        });
        oPromise.fail(function (pRes) {
            ok(false, "done expected");
        });
        ok(bIsDone, "done has been called");
        return res;
    }

    function testFailed(oPromise) {
        var res, bHasBeenFailed = false;
        oPromise.done(function (pRes) {
            ok(false, "fail expected");
        });
        oPromise.fail(function (pRes) {
            res = pRes;
            bHasBeenFailed = true;
        });
        ok(bHasBeenFailed, "failed");
        return res;
    }
    test("Test-config", function () {
        var oNt,
            res;
        sap.ushell.bootstrap("demo");
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Test-config");
        res = evalNow(res);
        deepEqual({
            "additionalInformation": "SAPUI5.Component=sap.ushell.demoapps.FioriSandboxConfigApp",
            "applicationType": "URL",
            "url": "/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/demoapps/FioriSandboxConfigApp"
        }, res);
    });

    test("Test-Local resolution nothing defined", function () {
        var oNt,
            res;
        sap.ushell.bootstrap("demo");
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        oNt.resolveHashFragment("#Test-clear");
        res = oNt.resolveHashFragment("#Test-local1");
        testFailed(res);
    });

    test("Test-Local resolution", function () {
        var oNt,
            obj,
            res;
        sap.ushell.bootstrap("demo");
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        oNt.resolveHashFragment("#Test-clear");
        obj = { url : "ABC", additionalInformation : "JOJO" };
        window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);
        res = oNt.resolveHashFragment("#Test-local1");
        res.done(function (res2) {
            deepEqual(obj, res2);
        });
        oNt.resolveHashFragment("#Test-clear");
        res = oNt.resolveHashFragment("#Test-local1");
        testFailed(res);
    });

    test("Test-Local resolution cross domain (bad-, good-, cleartest)", function () {
        var oNt,
            obj,
            sURL,
            res;
        sap.ushell.bootstrap("demo");
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        oNt.resolveHashFragment("#Test-clear");
        //bad case
        sURL = "https://www.bbc.co.uk/sap/bc/ui5_ui5/";
        obj = { url : sURL, additionalInformation : "JOJO" };
        window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);
        res = oNt.resolveHashFragment("#Test-local1");
        res.done(function (res2) {
            ok(false, "should not reach this section");
        });
        res.fail(function (sMsg) {
            deepEqual(sMsg, "URL is not resolvable", "sMsg does not have the proper value");
        });
        //good case
        sURL = window.location.origin + "/sap/bc/ui5_ui5/";
        obj = { url : sURL, additionalInformation : "JOJO" };
        window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);
        res = oNt.resolveHashFragment("#Test-local1");
        res.done(function (res2) {
            deepEqual(res2.url, sURL, "url is filled with same domain url");
        });
        res.fail(function (sMsg) {
            ok(false, "should be done");
        });
        oNt.resolveHashFragment("#Test-clear");
        res = oNt.resolveHashFragment("#Test-local1");
        testFailed(res);
    });

    test("Test-Local resolution undefined url", function () {
        var oNt,
            obj,
            sURL,
            res;
        sap.ushell.bootstrap("demo");
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        oNt.resolveHashFragment("#Test-clear");
        //good case
        sURL = undefined; // window.location.origin + "/sap/bc/ui5_ui5/";
        obj = { url : sURL, additionalInformation : "JOJO" };
        window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);
        res = oNt.resolveHashFragment("#Test-local1");
        testFailed(res);
        oNt.resolveHashFragment("#Test-clear");
        res = oNt.resolveHashFragment("#Test-local1");
        testFailed(res);
    });

    test("Test-url resolution", function () {
        var oNt,
            res,
            oGet,
            stub,
            sMsg;
        oGet = {
            get : function (s) {
                if (s.indexOf("additionalInformation") >= 0) {
                    return "SAPUI5.Component=abc";
                }
                return "/a/b/c";
            }
        };
        sap.ushell.bootstrap("demo");
        stub = sinon.stub(jQuery.sap, "getUriParameters", function () { return oGet; });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Test-url");
        res = evalNow(res);
        deepEqual({
            "additionalInformation": "SAPUI5.Component=abc",
            "applicationType": "URL",
            "url": "/a/b/c"
        }, res);
        res = oNt.baseResolveHashFragment("#Test-url");
        sMsg = testFailed(res);
        deepEqual(sMsg, "Could not resolve link 'Test-url'", "correct error message");
        jQuery.sap.getUriParameters.restore();
    });

    test("Test-url resolution - reject non-whitelisted folder", function () {
        var oNt,
            res,
            oGet,
            stub,
            sMsg;
        oGet = {
            get : function (s) {
                if (s.indexOf("additionalInformation") >= 0) {
                    return "SAPUI5.Component=abc";
                }
                return "/not/in/whitelist";
            }
        };
        sap.ushell.bootstrap("demo");
        stub = sinon.stub(jQuery.sap, "getUriParameters", function () { return oGet; });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Test-url");
        sMsg = testFailed(res);
        deepEqual(sMsg, "URL is not resolvable", "correct error message");
        res = oNt.baseResolveHashFragment("#Test-url");
        sMsg = testFailed(res);
        deepEqual(sMsg, "Could not resolve link 'Test-url'", "correct error message");
        jQuery.sap.getUriParameters.restore();
    });

    test("Test-url resolution - allow all folders", function () {
        var oNt,
            res,
            oGet,
            stub,
            sMsg;
        oGet = {
            get : function (s) {
                if (s.indexOf("additionalInformation") >= 0) {
                    return "SAPUI5.Component=abc";
                }
                return "/any/folder/for/wildcard/whitelist";
            }
        };
        window["sap-ushell-config"] = {
            // platform specific (ABAP) bootstrap configuration
            "services": {
                "NavTargetResolution" : {
                    "config" : {
                        "allowTestUrlComponentConfig" : true,
                        "runStandaloneAppFolderWhitelist": {
                            "*" : true
                        }
                    }
                }
            }
        };
        sap.ushell.bootstrap("demo");
        stub = sinon.stub(jQuery.sap, "getUriParameters", function () { return oGet; });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Test-url");
        res = evalNow(res);
        deepEqual({
            "additionalInformation": "SAPUI5.Component=abc",
            "applicationType": "URL",
            "url": "/any/folder/for/wildcard/whitelist"
        }, res);
        res = oNt.baseResolveHashFragment("#Test-url");
        sMsg = testFailed(res);
        deepEqual(sMsg, "Could not resolve link 'Test-url'", "correct error message");
        jQuery.sap.getUriParameters.restore();
    });

    test("Shell-runStandaloneApp resolution (url hash params)", function () {
        var oNt,
            res,
            orgfct,
            oGet,
            stub,
            sMsg;
        oGet = {
            get : function (s) {
                if (s.indexOf("additionalInformation") >= 0) {
                    return "SAPUI5.Component=abc";
                }
                return "/a/b/c";
            }
        };
        sap.ushell.bootstrap("demo");
        orgfct = jQuery.sap.getUriParameters;
        stub = sinon.stub(jQuery.sap, "getUriParameters", function (s) {
            if (s) {
                return orgfct(s);
            }
            return res;
        });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=%2Fa%2Fb%2Fc%3FAA%3DBB%26CCC%3DEEEE&ABC=XXX");
        res = evalNow(res);
        deepEqual({
            "additionalInformation": "SAPUI5.Component=xxx",
            "applicationType": "URL",
            "url": "/a/b/c?AA=BB&CCC=EEEE&ABC=XXX"
        }, res);
        res = oNt.baseResolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=%2Fa%2Fb%2Fc%3FAA%3DBB%26CCC%3DEEEE&ABC=XXX");
        sMsg = testFailed(res);
        deepEqual(sMsg, "Could not resolve link 'Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=%2Fa%2Fb%2Fc%3FAA%3DBB%26CCC%3DEEEE&ABC=XXX'", "correct error message");
        jQuery.sap.getUriParameters.restore();
    });

    test("Shell-runStandaloneApp resolution (url hash params 1)", function () {
        var oNt,
            res,
            orgfct,
            oGet,
            stub;
        sap.ushell.bootstrap("demo");
        oGet = {
            get : function (s) {
                if (s.indexOf("additionalInformation") >= 0) {
                    return "SAPUI5.Component=abc";
                }
                return "/a/b/c";
            }
        };
        orgfct = jQuery.sap.getUriParameters;
        stub = sinon.stub(jQuery.sap, "getUriParameters", function (s) {
            if (s) {
                return orgfct(s);
            }
            return res;
        });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=%2Fa%2Fb%2Fc&AAA=XXX");
        res = evalNow(res);
        deepEqual({
            "additionalInformation": "SAPUI5.Component=xxx",
            "applicationType": "URL",
            "url": "/a/b/c?AAA=XXX"
        }, res);
        jQuery.sap.getUriParameters.restore();
    });

    test("Shell-runStandaloneApp resolution (url params)", function () {
        var oNt,
            res,
            oGet,
            sMsg,
            stub;
        sap.ushell.bootstrap("demo");
        oGet = {
            get : function (s) {
                if (s.indexOf("additionalInformation") >= 0) {
                    return "SAPUI5.Component=abc";
                }
                if (s.indexOf("SAPUI5.Component") >= 0) {
                    return "xyz";
                }
                return "/a/b/c";
            }
        };
        stub = sinon.stub(jQuery.sap, "getUriParameters", function () { return oGet; });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Shell-runStandaloneApp");
        res = evalNow(res);
        deepEqual({
            "additionalInformation": "SAPUI5.Component=xyz",
            "applicationType": "URL",
            "url": "/a/b/c"
        }, res);
        res = oNt.baseResolveHashFragment("#Shell-runStandaloneApp");
        sMsg = testFailed(res);
        deepEqual(sMsg, "Could not resolve link 'Shell-runStandaloneApp'", "correct error message");
        jQuery.sap.getUriParameters.restore();
    });

    test("Shell-runStandaloneApp resolution (prevent cross domain injection)", function () {
        var oNt,
            res,
            orgfct,
            oGet,
            sMsg,
            stub;
        sap.ushell.bootstrap("demo");
        oGet = {
            get : function (s) {
                if (s.indexOf("additionalInformation") >= 0) {
                    return "SAPUI5.Component=abc";
                }
                return "/a/b/c";
            }
        };
        orgfct = jQuery.sap.getUriParameters;
        stub = sinon.stub(jQuery.sap, "getUriParameters", function (s) {
            if (s) {
                return orgfct(s);
            }
            return res;
        });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=http%3A%2F%2Fwww.google.de%2Fso%2Fnicht&AAA=XXX");
        sMsg = testFailed(res);
        deepEqual(sMsg, "URL is not resolvable", "correct error message"); //different domain, URL is empty,
        jQuery.sap.getUriParameters.restore();
    });

    test("Shell-runStandaloneApp resolution (allow same domain injection)", function () {
        var oNt,
            res,
            orgfct,
            oGet,
            stub;
        window["sap-ushell-config"] = {
            // platform specific (ABAP) bootstrap configuration
            "services": {
                "NavTargetResolution" : {
                    "config" : {
                        "runStandaloneAppFolderWhitelist": {
                            "/abc/" : true,
                            "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/" : true
                        }
                    }
                }
            }
        };
        sap.ushell.bootstrap("demo");
        oGet = {
            get : function (s) {
                if (s.indexOf("additionalInformation") >= 0) {
                    return "SAPUI5.Component=abc";
                }
                return "/a/b/c";
            }
        };
        orgfct = jQuery.sap.getUriParameters;
        stub = sinon.stub(jQuery.sap, "getUriParameters", function (s) {
            if (s) {
                return orgfct(s);
            }
            return res;
        });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=" + encodeURIComponent(window.location.origin + "/abc/def") + "nicht&AAA=XXX");
        res = evalNow(res);
        deepEqual({
            "additionalInformation": "SAPUI5.Component=xxx",
            "applicationType": "URL",
            "url": window.location.origin + "/abc/def" + "nicht?AAA=XXX"
        }, res);
        jQuery.sap.getUriParameters.restore();
    });

    test("Shell-runStandaloneApp resolution (prevent bad folder)", function () {
        var oNt,
            res,
            orgfct,
            oGet,
            stub,
            sMsg;
        window["sap-ushell-config"] = {
            // platform specific (ABAP) bootstrap configuration
            "services": {
                "NavTargetResolution" : {
                    "config" : {
                        "runStandaloneAppFolderWhitelist": {
                            "/abc/" : true,
                            "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/" : true
                        }
                    }
                }
            }
        };
        sap.ushell.bootstrap("demo");
        oGet = {
            get : function (s) {
                if (s.indexOf("additionalInformation") >= 0) {
                    return "SAPUI5.Component=abc";
                }
                return "/a/b/c";
            }
        };
        orgfct = jQuery.sap.getUriParameters;
        stub = sinon.stub(jQuery.sap, "getUriParameters", function (s) {
            if (s) {
                return orgfct(s);
            }
            return res;
        });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=" + encodeURIComponent(window.location.origin + "/abc") + "nicht&AAA=XXX");
        sMsg = testFailed(res);
        deepEqual(sMsg, "URL is not resolvable", "correct error message");
        jQuery.sap.getUriParameters.restore();
    });

    [
        window.location.origin + "/abc/def",
        window.location.origin + "/abc/../abc/def.json", // .. escape not possible
        "def/hij.json",
        "def/hij/aaa",
        "lmn/../def/hij.html",
        "/my/evil/../../abc/def",
        "../../relative/path"
    ].forEach(function (sFolder) {
        test("Shell-runStandaloneApp resolution (allow all folders " + sFolder + " - '*')", function () {
            var oNt,
                res,
                orgfct,
                oGet,
                stub,
                sMsg;
            window["sap-ushell-config"] = {
                // platform specific (ABAP) bootstrap configuration
                "services": {
                    "NavTargetResolution" : {
                        "config" : {
                            "runStandaloneAppFolderWhitelist": {
                                "/abc/" : true,
                                "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/" : true,
                                "*" : true
                            }
                        }
                    }
                }
            };
            sap.ushell.bootstrap("demo");
            oGet = {
                get : function (s) {
                    if (s.indexOf("additionalInformation") >= 0) {
                        return "SAPUI5.Component=abc";
                    }
                    return "/a/b/c";
                }
            };
            orgfct = jQuery.sap.getUriParameters;
            stub = sinon.stub(jQuery.sap, "getUriParameters", function (s) {
                if (s) {
                    return orgfct(s);
                }
                return res;
            });
            oNt = sap.ushell.Container.getService("NavTargetResolution");
            res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=" + encodeURIComponent(sFolder) + "nicht&AAA=XXX");
            res = evalNow(res);
            //deepEqual(sMsg, "done has been called", "correct error message");
            deepEqual(res, {
                "additionalInformation": "SAPUI5.Component=xxx",
                "applicationType": "URL",
                "url": sFolder + "nicht?AAA=XXX"
            });
        });
    });

    [
        window.location.origin + "/abc/def",
        window.location.origin + "/abc/../abc/def.json", // .. escape not possible
        "def/hij.json",
        "def/hij/aaa",
        "lmn/../def/hij.html",
        "/my/evil/../../abc/def"
    ].forEach(function (sFolder) {
      //own test
        test("Shell-runStandaloneApp resolution (allow good folder " + sFolder + ")", function () {
            var oNt,
                res,
                orgfct,
                oGet,
                stub;
            window["sap-ushell-config"] = {
                // platform specific (ABAP) bootstrap configuration
                "services": {
                    "NavTargetResolution" : {
                        "config" : {
                            "runStandaloneAppFolderWhitelist": {
                                "/abc/" : true,
                                "def/hij" : true,
                                "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/" : true
                            }
                        }
                    }
                }
            };
            sap.ushell.bootstrap("demo");
            oGet = {
                get : function (s) {
                    if (s.indexOf("additionalInformation") >= 0) {
                        return "SAPUI5.Component=abc";
                    }
                    return "/a/b/c";
                }
            };
            orgfct = jQuery.sap.getUriParameters;
            stub = sinon.stub(jQuery.sap, "getUriParameters", function (s) {
                if (s) {
                    return orgfct(s);
                }
                return res;
            });
            oNt = sap.ushell.Container.getService("NavTargetResolution");
            res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=" + encodeURIComponent(sFolder) + "&AAA=XXX");
            res = evalNow(res);
            deepEqual({
                "additionalInformation": "SAPUI5.Component=xxx",
                "applicationType": "URL",
                "url": sFolder + "?AAA=XXX"
            }, res);
            jQuery.sap.getUriParameters.restore();
        });
    });


    //own test
    [
        window.location.origin + "/abc",
        window.location.origin + "/abc/../def", // .. escape not possible
        window.location.origin + "/ABC/def",   // case sensitive
        window.location.origin + "/my/evil/folder/abc/und", // legal deep inside 
        "/abc",
        "/abc/../def", // .. escape not possible
        "/ABC/def",   // case sensitive
        "/my/evil/folder/abc/und" // legal deep inside
    ].forEach(function (sFolder) {
      //own test
        test("Shell-runStandaloneApp resolution (prevent bad folder " + sFolder + ")", function () {
            var oNt,
                res,
                orgfct,
                oGet,
                stub,
                sMsg;
            window["sap-ushell-config"] = {
                // platform specific (ABAP) bootstrap configuration
                "services": {
                    "NavTargetResolution" : {
                        "config" : {
                            "runStandaloneAppFolderWhitelist": {
                                "/abc/" : true,
                                "/ABC/" : false,
                                "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/" : true
                            }
                        }
                    }
                }
            };
            sap.ushell.bootstrap("demo");
            oGet = {
                get : function (s) {
                    if (s.indexOf("additionalInformation") >= 0) {
                        return "SAPUI5.Component=abc";
                    }
                    return "/a/b/c";
                }
            };
            orgfct = jQuery.sap.getUriParameters;
            stub = sinon.stub(jQuery.sap, "getUriParameters", function (s) {
                if (s) {
                    return orgfct(s);
                }
                return res;
            });
            oNt = sap.ushell.Container.getService("NavTargetResolution");
            res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=" + encodeURIComponent(sFolder) + "nicht&AAA=XXX");
            sMsg = testFailed(res);
            deepEqual(sMsg, "URL is not resolvable", "correct error message");
            jQuery.sap.getUriParameters.restore();
        });
    });

    test("Test- empty hash default", function () {
        var oNt,
            obj,
            res,
            oGet,
            stub;
        oGet = {
            get : function (s) {
                if (s.indexOf("additionalInformation") >= 0) {
                    return "SAPUI5.Component=abc";
                }
                return "/a/b/c";
            }
        };
        sap.ushell.bootstrap("demo");
        stub = sinon.stub(jQuery.sap, "getUriParameters", function () { return oGet; });
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("");
        res = evalNow(res);
        deepEqual(undefined, res);
        jQuery.sap.getUriParameters.restore();
    });

    test("Test register ok", function () {
        var oNt,
            obj;
        sap.ushell.bootstrap("demo");
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        obj = { name : "ResolverA",
                resolveHashFragment : function () { return {}; },
                isApplicable : function () { return false; }};
        deepEqual(true, oNt.registerCustomResolver(obj));
    });

    test("Test register no name", function () {
        var oNt,
            obj;
        sap.ushell.bootstrap("demo");
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        obj = { //name : "ResolverA",
            resolveHashFragment : function () { return {}; },
            isApplicable : function () { return false; }
        };
        deepEqual(false, oNt.registerCustomResolver(obj));
    });

    test("Test register no isApplicable", function () {
        var oNt,
            obj;
        sap.ushell.bootstrap("demo");
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        obj = {
            name : "ResolverA",
            resolveHashFragment : function () { return {}; }
            //isApplicable : function () { return false; }
        };
        deepEqual(false, oNt.registerCustomResolver(obj));
    });

    test("Test register wrong resolveHashFragment", function () {
        var oNt,
            obj;
        sap.ushell.bootstrap("demo");
        oNt = sap.ushell.Container.getService("NavTargetResolution");
        oNt.resolveHashFragment("#Test-clear");
        obj = {
            name : "ResolverA",
            resolveHashFragment : {},
            isApplicable : function () {
                return false;
            }
        };
        deepEqual(false, oNt.registerCustomResolver(obj));
    });

    test("getCurrentResolution", function () {
        var oResolution = {},
            oNTRAdapter = {
                resolveHashFragment: function () {
                    var oDeferred = new jQuery.Deferred();

                    oDeferred.resolve(oResolution);
                    return oDeferred.promise();
                }
            },
            oNavTargetResolutionService = new sap.ushell.services.NavTargetResolution(oNTRAdapter);
        sap.ushell.bootstrap("demo");

        strictEqual(oNavTargetResolutionService.getCurrentResolution(), undefined,
            "undefined if no resolution performed");

        oNavTargetResolutionService.resolveHashFragment("#foo");
        strictEqual(oNavTargetResolutionService.getCurrentResolution(), oResolution,
            "returns result of previous resolve");
    });

    module(
        "sap.ushell.services.NavTargetResolution.LocalResolver",
        {
            setup : function () {
                window["sap-ushell-config"] = {
                    services: {
                        NavTargetResolution: {
                            adapter : {
                                module: "sap.ushell.unittest.NavTargetResolutionAdapterStub"
                            },
                            config : {
                                resolveLocal : [ {
                                    "linkId" : "Rabbit-run",
                                    resolveTo : {
                                        additionalInformation : "SAPUI5.Component=Rabidrun",
                                        applicationType : "URL",
                                        url : "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2"
                                    }
                                }, {
                                    "linkId" : "Snake-bite",
                                    resolveTo : {
                                        additionalInformation : "SAPUI5.Component=BooAh",
                                        applicationType : "URL",
                                        url : "../con/stric/tor"
                                    }
                                }]
                            }
                        }
                    }
                };
                sap.ushell.bootstrap("demo");
            },
            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown : function () {
                window["sap-ushell-config"] = {};
                delete sap.ushell.Container;
            }
        }
    );

    asyncTest("localResolve - multiple targets", function () {
        var res,
            oNavTargetResolutionService;

        // code under test
        theLastHashFragment = "notcalled";
        oNavTargetResolutionService = sap.ushell.Container.getService("NavTargetResolution");
        res = oNavTargetResolutionService.resolveHashFragment("#Rabbit-run");
        res.done(function (sArg) {
            start();
            equal(theLastHashFragment, "notcalled");
            equal(sArg.additionalInformation, "SAPUI5.Component=Rabidrun");
        }).fail(function (sMessage) {
            start();
            ok(false, "service invocation failed: " + sMessage);
        });
        // code under test
        theLastHashFragment = "notcalled";
        oNavTargetResolutionService = sap.ushell.Container.getService("NavTargetResolution");
        res = oNavTargetResolutionService.resolveHashFragment("#Snake-bite");
        stop();
        res.done(function (sArg) {
            start();
            equal(theLastHashFragment, "notcalled");
            equal(sArg.additionalInformation, "SAPUI5.Component=BooAh");
        }).fail(function (sMessage) {
            start();
            ok(false, "service invocation failed: " + sMessage);
        });
        // code under test
        oNavTargetResolutionService = sap.ushell.Container.getService("NavTargetResolution");
        res = oNavTargetResolutionService.resolveHashFragment("#Some-action");
        stop();
        res.done(function (sArg) {
            start();
            equal(theLastHashFragment, "#Some-action");
            equal(sArg, "resolvedTo:#Some-action");
        }).fail(function (sMessage) {
            start();
            ok(false, "service invocation failed: " + sMessage);
        });
    });

    test("getSemanticObjectLinks", function () {
        var oNavTargetResolution,
            oNavTargetResolutionAdapter =  {
                getSemanticObjectLinks: sinon.stub(),
                resolveHashFragment: sinon.stub()
            },
            mParameters = {
                A: "B",
                C: ["e'e", "j j"]
            };

        // prepare test
        oNavTargetResolution
            = new sap.ushell.services.NavTargetResolution(oNavTargetResolutionAdapter);

        // code under test
        raises(function () {
            oNavTargetResolution.getSemanticObjectLinks("Action?foo");
        }, /Parameter must not be part of semantic object/);
        oNavTargetResolution.getSemanticObjectLinks("Action", mParameters, true);

        // test
        ok(oNavTargetResolutionAdapter.getSemanticObjectLinks.calledOnce);
        ok(oNavTargetResolutionAdapter.getSemanticObjectLinks
            .calledWithExactly("Action", mParameters, true));
    });

    test("isIntentSupported", function () {
        var aIntents = [/*content does not matter*/],
            oResult,
            oSimulatedResult = {/*jQuery.Deferred*/},
            oNavTargetResolution,
            oNavTargetResolutionAdapter =  {
                isIntentSupported: sinon.stub().returns(oSimulatedResult),
                resolveHashFragment: sinon.stub()
            };

        // prepare test
        oNavTargetResolution
            = new sap.ushell.services.NavTargetResolution(oNavTargetResolutionAdapter);

        // code under test
        oResult = oNavTargetResolution.isIntentSupported(aIntents);

        // test
        ok(oNavTargetResolutionAdapter.isIntentSupported.calledOnce);
        ok(oNavTargetResolutionAdapter.isIntentSupported.calledWithExactly(aIntents));
        strictEqual(oResult, oSimulatedResult);
    });

    test("isIntentSupported: missing in adapter", function () {
        var aIntents = ["#foo", "#bar"],
            oNavTargetResolution,
            oNavTargetResolutionAdapter =  {
                resolveHashFragment: sinon.stub()
            };

        // prepare test
        oNavTargetResolution
            = new sap.ushell.services.NavTargetResolution(oNavTargetResolutionAdapter);

        // code under test
        oNavTargetResolution.isIntentSupported(aIntents)
            .fail(sap.ui2.srvc.test.onError)
            .done(function (mSupportedByIntent) {
                start();

                // test
                deepEqual(mSupportedByIntent, {
                    "#foo": {supported: undefined},
                    "#bar": {supported: undefined}
                });
            });
    });
}());
