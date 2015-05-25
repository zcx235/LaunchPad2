// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.URLParsing
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.services.NavTargetResolution");

    module("sap.ushell.services.URLParsing", {
        setup: function () {
            sap.ushell.bootstrap("demo");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            sap.ui2.srvc.test.restoreSpies(
                sap.ui2.srvc.Error
            );
            delete sap.ushell.Container;
        }
    });

    test("getServiceURLParser", function () {
        var oURLParsing = sap.ushell.Container.getService("URLParsing");
        ok(oURLParsing !== undefined);
    });

    test("getShellHash", function () {
        // prepare test
        var sShellHash =  sap.ushell.Container.getService("URLParsing").getShellHash("http://urlabc#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B");
        deepEqual(sShellHash, "SO-ABC~CONTXT?ABC=3&DEF=4");
    });


    test("getShellHash bad", function () {
        // prepare test
        var sShellHash =  sap.ushell.Container.getService("URLParsing").getShellHash("123445");
        deepEqual(undefined, sShellHash);
    });

    test("getHash", function () {
        var sHash = sap.ushell.Container.getService("URLParsing").getHash("http://urlabc?A=B~DEF#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B");
        deepEqual(sHash, "SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B");
    });

    // hash parsing functions
    // breakdown a unified shell hash into segments
    // #SO-Action~CONTEXT?a=1&b=2;c=3&/def
    //

    test("parseShellHashSO_ACT", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("SO-ABC?");
        deepEqual(oShellHash.semanticObject, "SO");
        deepEqual(oShellHash.action, "ABC");
        deepEqual(Object.hasOwnProperty(oShellHash, "contextRaw"), false);
        deepEqual(oShellHash.contextRaw, undefined);
    });

    test("parseShellHashSO_ACT2", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("SO-ABC");
        deepEqual(oShellHash.semanticObject, "SO");
        deepEqual(oShellHash.action, "ABC");
    });

    test("parseShellHashAppSpecificOnly", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("&/ABCDEF&/HIJ");
        deepEqual({
            "action" : undefined,
            "appSpecificRoute" : "&/ABCDEF&/HIJ",
            "semanticObject" : undefined,
            "contextRaw" : undefined,
            "params": {}
        }, oShellHash);
    });

    test("parseShellHashAppSpecificOnly2", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("#&/ABCDEF&/HIJ");
        deepEqual({
            "action" : undefined,
            "appSpecificRoute" : "&/ABCDEF&/HIJ",
            "semanticObject" : undefined,
            "contextRaw" : undefined,
            "params": {}
        }, oShellHash);
    });


    test("parseShellHashSO_ACTwithHash", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("#SO-ABC");
        deepEqual(oShellHash.semanticObject, "SO");
        deepEqual(oShellHash.action, "ABC");
    });

    test("parseShellHashFull", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("SO-ABC~CONTXT?ABC=3A&DEF=4B&/detail/1?A=B");
        deepEqual(oShellHash.semanticObject, "SO");
        deepEqual(oShellHash.action, "ABC");
        deepEqual(oShellHash.contextRaw, "CONTXT");
        deepEqual(oShellHash.params, { ABC : [ "3A" ], DEF: [ "4B" ]});
        deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    test("parseShellHashFullDuplicates", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("/Seman/tic-Action-name~AEFHIJ==?ABC=3&DEF=5&ABC=4&/detail/1?A=B");
        deepEqual(oShellHash.semanticObject, "/Seman/tic");
        deepEqual(oShellHash.action, "Action-name");
        deepEqual(oShellHash.contextRaw, "AEFHIJ==");
        deepEqual(oShellHash.params, { ABC : ["3", "4"], DEF: [ "5"] });
        deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    test("parseShellHashOnlySOABC", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("SO-ABC~CONTXT");
        deepEqual(oShellHash.semanticObject, "SO");
        deepEqual(oShellHash.action, "ABC");
        deepEqual(oShellHash.contextRaw, "CONTXT");
        deepEqual(oShellHash.params, { });
        deepEqual(oShellHash.appSpecificRoute, undefined);
    });


    test("parseShellHashNoParams", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("SO-ABC~CONTXT&/detail/1?A=B");
        deepEqual(oShellHash.semanticObject, "SO");
        deepEqual(oShellHash.action, "ABC");
        deepEqual(oShellHash.contextRaw, "CONTXT");
        deepEqual(oShellHash.params, { });
        deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });


    test("parseShellHashFullNoRoute", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("/Seman/tic-Action-name~AEFHIJ==?ABC=3&DEF=5&ABC=4%205");
        deepEqual(oShellHash.semanticObject, "/Seman/tic");
        deepEqual(oShellHash.action, "Action-name");
        deepEqual(oShellHash.contextRaw, "AEFHIJ==");
        deepEqual(oShellHash.params, { ABC : [ "3", "4 5" ], DEF: [ "5" ] });
        deepEqual(oShellHash.hasOwnProperty("appSpecificRoute"), true);
        deepEqual(oShellHash.appSpecificRoute, undefined);
    });

    test("parseShellHashFullNoParams", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("/Seman/tic-/Act/ion-name~AEFHIJ==?&/detail/1?A=B");
        deepEqual(oShellHash.semanticObject, "/Seman/tic");
        deepEqual(oShellHash.action, "/Act/ion-name");
        deepEqual(oShellHash.contextRaw, "AEFHIJ==");
        deepEqual(oShellHash.params, { });
        deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    test("parseShellHashNoContext", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("/Seman/tic-/Act/ion-name?&/detail/1?A=B");
        deepEqual(oShellHash.semanticObject, "/Seman/tic");
        deepEqual(oShellHash.action, "/Act/ion-name");
        deepEqual(oShellHash.contextRaw, undefined);
        deepEqual(oShellHash.params, { });
        deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    test("parseShellHashOnlyAppspecificPart", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("&/detail/1?A=B");
        deepEqual(oShellHash.semanticObject, undefined);
        deepEqual(oShellHash.action, undefined);
        deepEqual(oShellHash.action, undefined);
        deepEqual(oShellHash.contextRaw, undefined);
        deepEqual(oShellHash.params, { });
        deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");
    });

    test("parseParameters", function () {
        var oRes = sap.ushell.Container.getService("URLParsing").parseParameters("?ABC=3A&DEF=4B");
        deepEqual(oRes, { ABC : [ "3A" ], DEF: [ "4B" ]});
    });

    test("parseParametersEmpty", function () {
        var oRes = sap.ushell.Container.getService("URLParsing").parseParameters("?");
        deepEqual(oRes, {});
    });

    test("parseParametersEmpty2", function () {
        var oRes = sap.ushell.Container.getService("URLParsing").parseParameters("");
        deepEqual(oRes, {});
    });
    test("paramsToString", function () {
        var oRes = sap.ushell.Container.getService("URLParsing").paramsToString({ ABC : [ "3A" ], DEF: [ "4B" ], AAAA : ["2", "1"]});
        deepEqual(oRes, "AAAA=2&AAAA=1&ABC=3A&DEF=4B");
    });

    test("paramsToStringNoArray", function () {
        var oRes = sap.ushell.Container.getService("URLParsing").paramsToString({ ABC : "3A", DEF: [ "4B" ], AAAA : ["2", "1"]});
        deepEqual(oRes, "AAAA=2&AAAA=1&ABC=3A&DEF=4B");
    });

    test("paramsToStringEmpty", function () {
        var oRes = sap.ushell.Container.getService("URLParsing").paramsToString({});
        deepEqual(oRes, "");
    });

    test("paramsToStringEmpty2", function () {
        var oRes = sap.ushell.Container.getService("URLParsing").paramsToString();
        deepEqual(oRes, "");
    });

    test("parseParameters", function () {
        var oRes = sap.ushell.Container.getService("URLParsing").parseParameters("?ABC=3A&DEF=4B");
        deepEqual(oRes, { ABC : [ "3A" ], DEF: [ "4B" ]});
    });

    test("constructShellHashFullNoRoute", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                semanticObject : "/Seman/tic",
                action : "Action-name",
                contextRaw : "AEFHIJ=="
            },
            params : {
                ABC : [ "3", "4" ],
                DEF : [ "5" ]
            }
        });
        deepEqual("/Seman/tic-Action-name~AEFHIJ==?ABC=3&ABC=4&DEF=5", sShellHash);
    });

    test("constructShellHashURLEnc", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                semanticObject : "Semantic",
                action : "Action-name",
                contextRaw : "AEFHIJ=="
            },
            params : {
                DEF : [ "5" ],
                ABC : [ "3", "4 5" ]
            }
        });
        deepEqual("Semantic-Action-name~AEFHIJ==?ABC=3&ABC=4%205&DEF=5", sShellHash);
    });

    test("constructShellNoWarnOnNoArray", function () {
        var spyjQueryLogError = sinon.spy(jQuery.sap.log, "error"),
            sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
                target : {
                    semanticObject : "Semantic",
                    action : "Action-name"
                },
                params : {
                    DEF : [ "5" ],
                    ABC : [ "3" ]
                }
            });
        deepEqual("Semantic-Action-name?ABC=3&DEF=5", sShellHash);
        deepEqual(false, spyjQueryLogError.called, "Error not called");
        spyjQueryLogError.restore();
    });


    test("constructShellWarnOnArray", function () {
        var spyjQueryLogError = sinon.spy(jQuery.sap.log, "error"),
            sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
                target : {
                    semanticObject : "Semantic",
                    action : "Action-name"
                },
                params : {
                    DEF : [ "5" ],
                    ABC : [ "3", "4 5" ]
                }
            });
        deepEqual("Semantic-Action-name?ABC=3&ABC=4%205&DEF=5", sShellHash);
        deepEqual(true, spyjQueryLogError.called, "Error called");
        deepEqual(true, spyjQueryLogError.calledWith("Array startup parameters violate the designed intent of the Unified Shell Intent, use only single-valued parameters!"), "correct arg");
        spyjQueryLogError.restore();
    });


    test("constructShellHashOrder", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                semanticObject : "/Seman/tic",
                action : "Action-name",
                contextRaw : "AEFHIJ=="
            },
            params : {
                DEF : [ "5" ],
                ABC : [ "3", "4 5" ]
            },
            appSpecificRoute : "&/soso"
        });
        deepEqual("/Seman/tic-Action-name~AEFHIJ==?ABC=3&ABC=4%205&DEF=5&/soso", sShellHash);
    });

    test("constructShellHashSemiFlat", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                semanticObject : "/Seman/tic",
                action : "Action-name",
                contextRaw : "AEFHIJ=="
            },
            params : {
                DEF : "5",
                ABC : [ "3", "4" ]
            }
        });
        deepEqual("/Seman/tic-Action-name~AEFHIJ==?ABC=3&ABC=4&DEF=5", sShellHash);
    });

    test("constructShellHashSpecified", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                shellHash : "#ABC-def?ABC=%2520A"
            }
        });
        deepEqual("ABC-def?ABC=%2520A", sShellHash);
    });

    test("constructShellHashSpecifiedWithIntern", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                shellHash : "ABC-def?ABC=%2520A&/ABC/HKL"
            }
        });
        deepEqual("ABC-def?ABC=%2520A&/ABC/HKL", sShellHash);
    });

    test("constructShellWithHash", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                shellHash : "#"
            }
        });
        deepEqual("", sShellHash);
    });

    test("constructShellHashEmpty", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                shellHash : ""
            }
        });
        deepEqual("", sShellHash);
    });

    test("constructShellHashUNDEF", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                shellHash : undefined
            }
        });
        deepEqual("", sShellHash);
    });

    test("constructShellHashAppSpecific", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                semanticObject : "ABC",
                action : "Hugo"
            },
            appSpecificRoute : "&/EINBAYER"
        });
        deepEqual("ABC-Hugo&/EINBAYER", sShellHash);
    });

    test("constructShellHashEmptyAppSpecific", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                shellHash : ""
            },
            appSpecificRoute : "&/EINBAYER"
        });
        deepEqual("&/EINBAYER", sShellHash);
    });

    test("constructShellHashEmptyTarget", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {}
        });
        deepEqual("", sShellHash);
    });

    test("constructShell HashNoParam", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").constructShellHash({
            target : {
                semanticObject : "/Seman/tic",
                action : "Action-name"
            }
        });
        deepEqual("/Seman/tic-Action-name", sShellHash);
    });

    test("splitHash", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").splitHash(
            "#Object-name~AFE2==?PV1=PV2&PV4=V5&/display/detail/7?UU=HH"
        );
        deepEqual({
            shellPart : "Object-name~AFE2==?PV1=PV2&PV4=V5",
            appSpecificRoute : "&/display/detail/7?UU=HH"
        }, oShellHash);
    });

    test("splitHash2", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").splitHash(
            "Object-name~AFE2==?PV1=PV2&PV4=V5&/display/detail/7?UU=HH"
        );
        deepEqual({
            shellPart : "Object-name~AFE2==?PV1=PV2&PV4=V5",
            appSpecificRoute : "&/display/detail/7?UU=HH"
        }, oShellHash);
    });

    test("splitHash3", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("Object-name~AFE2==?PV1=PV2&/SOSO?DEF&/IST&k=3");
        deepEqual({
            shellPart : "Object-name~AFE2==?PV1=PV2",
            appSpecificRoute : "&/SOSO?DEF&/IST&k=3"
        }, sShellHash);
    });

    test("splitHashOnlyShellPart", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").splitHash("shell-Part?DEF=HIJ&K=B");
        deepEqual({
            shellPart : "shell-Part?DEF=HIJ&K=B",
            appSpecificRoute : undefined
        }, oShellHash);
    });

    test("splitHashOnlyBadShellPart", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").splitHash("shellPart?DEF-ABC");
        deepEqual({
        }, oShellHash);
    });

    test("splitHashOnlyAppSpecific", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").splitHash(
            "&/display/detail/7?UU=HH"
        );
        deepEqual({
            shellPart : "",
            appSpecificRoute : "&/display/detail/7?UU=HH"
        }, oShellHash);
    });

    test("splitHashRobust", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").splitHash("");
        deepEqual({}, oShellHash);
    });

    test("splitHashRobust2", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").splitHash("#");
        deepEqual({}, oShellHash);
    });


    test("splitHashRobust3", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("#&/HIJ");
        deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "" }, sShellHash);
    });

    test("splitHashParamApp", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("#?HIJ=KLM&/HIJ");
        deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "?HIJ=KLM" }, sShellHash);
    });

    test("splitHashRobust3b", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("&/HIJ");
        deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "" }, sShellHash);
    });

    test("splitHashRobust3c", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("#A-B?&&/HIJ");
        deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "A-B?&" }, sShellHash);
    });

    test("splitHashRobustBadc", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("#A-B&&/HIJ");
        deepEqual({ }, sShellHash);
    });

    test("splitHashRobustAmp", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("#A-B?&&/HIJ");
        deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "A-B?&" }, sShellHash);
    });

    test("splitHashRobustAmpAmp", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("#A-B?&&&/HIJ");
        deepEqual({ appSpecificRoute: "&/HIJ", shellPart: "A-B?&&" }, sShellHash);
    });

    test("splitHashRobust4", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("NOTAHASH&/HIJ");
        deepEqual({ }, sShellHash);
    });

    test("splitHashRobust4b", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("#YES-AHASH&/HIJ&/KLM");
        deepEqual({ appSpecificRoute : "&/HIJ&/KLM", shellPart : "YES-AHASH" }, sShellHash);
    });


    test("splitHashRobust4c", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("YES-AHASH&/HIJ&/KLM");
        deepEqual({ appSpecificRoute : "&/HIJ&/KLM", shellPart : "YES-AHASH" }, sShellHash);
    });

    test("splitHashRobust5", function () {
        var sShellHash = sap.ushell.Container.getService("URLParsing").splitHash("NOTAHASH&/HIJ&/KLM");
        deepEqual({ }, sShellHash);
    });

    test("parseShellHashBad1", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("SOABC?");
        deepEqual(undefined, oShellHash);
    });

    test("parseShellHashAppOnly2", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("&/DEF&/HIJ");
        deepEqual({
            "action": undefined,
            "appSpecificRoute": "&/DEF&/HIJ",
            "contextRaw": undefined,
            "params": {},
            "semanticObject": undefined
        }, oShellHash);
    });

    test("parseShellParamsAndHashOnly2", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("?A=B&E=K&/DEF&/HIJ");
        deepEqual({
            "action": undefined,
            "appSpecificRoute": "&/DEF&/HIJ",
            "contextRaw": undefined,
            "params": { A: ["B"], E: ["K"]},
            "semanticObject": undefined
        }, oShellHash);
    });

    test("parseShellHashBad3", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("NOHASH&/DEF&/HIJ");
        deepEqual(undefined, oShellHash);
    });


    test("parseShellHashAppOnly3b", function () {
        var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash("#&/DEF&/HIJ");
        deepEqual({
            "action": undefined,
            "appSpecificRoute": "&/DEF&/HIJ",
            "contextRaw": undefined,
            "params": {},
            "semanticObject": undefined
        }, oShellHash);
    });


    // end of hash breakdown

// sample usage

    test("getServiceURLParser", function () {
        //var oURLParsing = sap.ushell.Container.getService("URLParsing");
        var oURLParsing = sap.ushell.Container.getService("URLParsing"),
            sShellHash,
            sHash,
            oShellHash;

        ok(oURLParsing !== undefined);

        // extract hash from url

        sShellHash = oURLParsing.getShellHash("http://urlabc?A=B~DEF#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B");
        deepEqual("SO-ABC~CONTXT?ABC=3&DEF=4", sShellHash);

        sHash = oURLParsing.getHash("http://urlabc?A=B~DEF#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B");
        deepEqual("SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B", sHash);

        // break down hash into parts
        oShellHash = oURLParsing.parseShellHash("SO-ABC~CONTXT?ABC=3A&DEF=4B&/detail/1?A=B");
        deepEqual(oShellHash.semanticObject, "SO");
        deepEqual(oShellHash.action, "ABC");
        deepEqual(oShellHash.contextRaw, "CONTXT");
        deepEqual(oShellHash.params, { ABC : ["3A"], DEF: ["4B"] });
        deepEqual(oShellHash.appSpecificRoute, "&/detail/1?A=B");

    });

    function testAddSystemToServiceUrl(sCurrentResolution, sUrl, sExpectedUrl, sSystem) {
        var oURLParsing = sap.ushell.Container.getService("URLParsing"),
            oNTR = sap.ushell.Container.getService("NavTargetResolution");

        if (oNTR.getCurrentResolution.restore) {
            oNTR.getCurrentResolution.restore();
        }
        sinon.stub(oNTR, "getCurrentResolution").returns({
            url: sCurrentResolution
        });
        strictEqual(oURLParsing.addSystemToServiceUrl(sUrl, sSystem), sExpectedUrl,
            "[" + sCurrentResolution + "] " + sUrl + " -> " + sExpectedUrl);

        ok(sap.ushell.Container.addRemoteSystemForServiceUrl.calledWith(sExpectedUrl));

    }

    test("addSystemToServiceUrl, success", function () {
        var oURLParsing = sap.ushell.Container.getService("URLParsing");

        sinon.spy(sap.ushell.Container, "addRemoteSystemForServiceUrl");

        strictEqual(oURLParsing.addSystemToServiceUrl("/sap/opu/odata/MyService"),
            "/sap/opu/odata/MyService");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp",
            "/sap/opu/odata/MyService",
            "/sap/opu/odata/MyService");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp",
            "/sap/opu/odata/MyService;o=/MyEntities",
            "/sap/opu/odata/MyService/MyEntities");

        // see corresponding tests in /services/src/main/webapp/test/sap/ui2/srvc/catalog.qunit.js
        // URLs without system and without parameters
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/",
            "/;o=SYS");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap",
            "/sap;o=SYS");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/hba/foo",
            "/sap/hba/foo;o=SYS");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/hba;o=quertz/foo",
            "/sap/hba;o=quertz/foo");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap;bar=baz/hba/foo",
            "/sap;bar=baz/hba/foo;o=SYS");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/hba/foo;bar=baz",
            "/sap/hba/foo;bar=baz;o=SYS");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService/",
            "/sap/opu/odata/MyService;o=SYS/");

        // URLs with system (marker) and without parameters
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=",
            "/sap/opu/odata/MyService;o=SYS");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=/Pages/$count",
            "/sap/opu/odata/MyService;o=SYS/Pages/$count");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=xyz/Pages/$count",
            "/sap/opu/odata/MyService;o=xyz/Pages/$count");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=xyz/",
            "/sap/opu/odata/MyService;o=xyz/");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=;a/",
            "/sap/opu/odata/MyService;o=SYS;a/");

        // URLs with parameters
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService/?p1=v1&p2=v2",
            "/sap/opu/odata/MyService;o=SYS/?p1=v1&p2=v2");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService?p1=v1&p2=v2",
            "/sap/opu/odata/MyService;o=SYS?p1=v1&p2=v2");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService?p1=spec/ial&p2=v2",
            "/sap/opu/odata/MyService;o=SYS?p1=spec/ial&p2=v2");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService?p1=;o=/&p2=v2",
            "/sap/opu/odata/MyService;o=SYS?p1=;o=/&p2=v2");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService?p1=;o=XYZ&p2=v2",
            "/sap/opu/odata/MyService;o=SYS?p1=;o=XYZ&p2=v2");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/UI2/PAGE_BUILDER_CUST;o=?p=a/",
            "/sap/opu/odata/UI2/PAGE_BUILDER_CUST;o=SYS?p=a/");

        // system passed as parameter
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService/",
            "/sap/opu/odata/MyService;o=system/",
            "system");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp?sap-system=SYS",
            "/sap/opu/odata/MyService;o=/MyEntities",
            "/sap/opu/odata/MyService;o=system/MyEntities",
            "system");
        testAddSystemToServiceUrl("/sap/bc/ui5_ui5/MyApp",
            "/sap/opu/odata/MyService;o=/MyEntities",
            "/sap/opu/odata/MyService;o=system/MyEntities",
            "system");
    });

    test("addSystemToServiceUrl, failures", function () {
        var oURLParsing = sap.ushell.Container.getService("URLParsing");

        sinon.spy(sap.ui2.srvc, "Error");
        sinon.spy(sap.ushell.Container, "addRemoteSystemForServiceUrl");
        [undefined, "", "./foo", "sap/hba/foo", "//foo.com/bar",
             "http://foo.com/bar"].forEach(function (sUrl) {
            sap.ui2.srvc.Error.reset();
            raises(function () {
                oURLParsing.addSystemToServiceUrl(sUrl);
            }, /Invalid URL/, "'" + sUrl + "' fails");
            ok(sap.ui2.srvc.Error.calledWith("Invalid URL: " + sUrl,
                "sap.ushell.services.URLParsing"));
            ok(sap.ushell.Container.addRemoteSystemForServiceUrl.notCalled);
        });
    });

}());
