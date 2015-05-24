// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.URLShortening
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */
    /*jslint nomen: true*/

    jQuery.sap.require("sap.ushell.services.Container");

    var oldURL_LENGTH_LIMIT = 1024,
        oldURL_PARAMS_LENGTH_LIMIT = 512;

    function saveLengthLimit(shortener) {
        oldURL_LENGTH_LIMIT = shortener.URL_LENGTH_LIMIT;
        shortener.URL_LENGTH_LIMIT = 60;
        oldURL_PARAMS_LENGTH_LIMIT = shortener.URL_PARAMS_LENGTH_LIMIT;
        shortener.URL_PARAMS_LENGTH_LIMIT = 20;
    }

    function restoreLengthLimit(shortener) {
        shortener.URL_LENGTH_LIMIT = oldURL_LENGTH_LIMIT;
        shortener.URL_PARAMS_LENGTH_LIMIT = oldURL_PARAMS_LENGTH_LIMIT;
    }

    module("sap.ushell.services.URLShortening", {
        setup: function () {
            sap.ushell.bootstrap("demo");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    test("getServiceURLShortening", function () {
        var oURLShortening = sap.ushell.Container.getService("URLShortening");
        ok(oURLShortening !== undefined);
    });

    test("shortenURLEmpty", function () {
        // prepare test
        var oService = sap.ushell.Container.getService("URLShortening");
        deepEqual("#", oService.compactHash("#"));
        deepEqual("#ABC-DEF~HIJ&/ABC=DEF", oService.compactHash("#ABC-DEF~HIJ&/ABC=DEF"));
    });

    test("testcheckHashLengthTruncation", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            aTruncatedURL,
            sHashRestored,
            aLongUrl,
            stubGenerateKey;
        saveLengthLimit(shortener);
        stubGenerateKey = sinon.stub(shortener, "_generateKey", function () { return "AGUID"; });
        aLongUrl = "#SO-ABC~CONTXT?ABC=3&DEF=4&HIJ=AAAAAAAAAAAAAABBBBBBBBBBBB&AKLM=JJJJJJ&CFUN=JJJJJJJJJJJJ&/detail/1?A=B";
        sHash = shortener.checkHashLength(aLongUrl);
        aTruncatedURL = "#SO-ABC~CONTXT?ABC=3&AKLM=JJJJJJ&/detail/1?A=B";
        deepEqual(aTruncatedURL, sHash.hash);
        deepEqual({ "ABC" : [ "3" ], "AKLM" : ["JJJJJJ"] }, sHash.params);
        deepEqual({HIJ : ["AAAAAAAAAAAAAABBBBBBBBBBBB"], "DEF" : ["4"], CFUN : ["JJJJJJJJJJJJ"]}, sHash.skippedParams);
        stubGenerateKey.restore();
        restoreLengthLimit(shortener);
    });

    test("testcheckHashLength", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            aTruncatedURL,
            aLongUrl,
            stubGenerateKey,
            stubLogError;
        saveLengthLimit(shortener);
        stubGenerateKey = sinon.stub(shortener, "_generateKey", function () { return "AGUID"; });
        stubLogError = sinon.spy(jQuery.sap.log, "error");
        aLongUrl = "#SO-ABC~CONTXT?ABC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&/detail/1?A=B";
        sHash = shortener.checkHashLength(aLongUrl);
        aTruncatedURL = "#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B";
        deepEqual(aTruncatedURL, sHash.hash);
        deepEqual({ "ABC" : [ "3" ], "DEF" : ["4"] }, sHash.params);
        deepEqual({ "DEF" : ["AAAAAAAAAAAAAABBBBBBBBBBBB", "JJJJJJJJJJJJJJJJJJ"]}, sHash.skippedParams);
        deepEqual(true, stubLogError.called, "LogError called");
        deepEqual(true, stubGenerateKey.called, "generate key called");
        stubGenerateKey.restore();
        stubLogError.restore();
        restoreLengthLimit(shortener);
    });

    test("testcheckHashArrayWarn", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            aTruncatedURL,
            aLongUrl,
            stubGenerateKey,
            stubLogError;
        saveLengthLimit(shortener);
        stubGenerateKey = sinon.stub(shortener, "_generateKey", function () { return "AGUID"; });
        stubLogError = sinon.spy(jQuery.sap.log, "error");
        aLongUrl = "#SO-ABC~CONTXT?DEF=4&DEF=A&DEF=B&/detail/1?A=B&KKKK=DFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
        sHash = shortener.checkHashLength(aLongUrl);
        aTruncatedURL = "#SO-ABC~CONTXT?DEF=4&DEF=A&DEF=B&/detail/1?A=B&KKKK=DFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
        deepEqual(aTruncatedURL, sHash);
        deepEqual(true, stubLogError.called, "LogError called");
        deepEqual(false, stubGenerateKey.called, "generate key called");
        stubGenerateKey.restore();
        stubLogError.restore();
        restoreLengthLimit(shortener);
    });


    test("smokeShortenExpand", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            sHashRestored,
            aLongUrl,
            stubGenerateKey;
        saveLengthLimit(shortener);
        stubGenerateKey = sinon.stub(shortener, "_generateKey", function () { return "AGUID"; });
        aLongUrl = "#SO-ABC~CONTXT?ABC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&/detail/1?A=B";
        sHash = shortener.compactHash(aLongUrl);
        deepEqual("#SO-ABC~CONTXT?ABC=3&DEF=4&" + shortener.ABBREV_PARAM_NAME + "=AGUID&/detail/1?A=B", sHash);
        sHashRestored = shortener.expandHash(sHash);
        deepEqual(aLongUrl, sHashRestored);
        stubGenerateKey.restore();
        restoreLengthLimit(shortener);
    });
    test("smokeShortenExpandOrder", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            sHashRestored,
            aLongUrl,
            stubGenerateKey;
        saveLengthLimit(shortener);
        stubGenerateKey = sinon.stub(shortener, "_generateKey", function () { return "AGUID"; });
        aLongUrl = "#SO-ABC~CONTXT?ARC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&ABC=JJJJJJJJJJJJJJJJJJ&/detail/1?A=B";
        sHash = shortener.compactHash(aLongUrl);
        deepEqual("#SO-ABC~CONTXT?" + shortener.ABBREV_PARAM_NAME + "=AGUID&/detail/1?A=B", sHash);
        sHashRestored = shortener.expandHash(sHash);
        deepEqual("#SO-ABC~CONTXT?ABC=JJJJJJJJJJJJJJJJJJ&ARC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&/detail/1?A=B", sHashRestored);
        stubGenerateKey.restore();
        restoreLengthLimit(shortener);
    });


    test("shortenExpandNoAppHash", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            sHashRestored,
            aLongUrl,
            stubGenerateKey;
        saveLengthLimit(shortener);
        stubGenerateKey = sinon.stub(shortener, "_generateKey", function () { return "AGUID"; });
        aLongUrl = "#SO-ABC~CONTXT?A=3&A=4&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ";
        sHash = shortener.compactHash(aLongUrl);
        deepEqual("#SO-ABC~CONTXT?A=3&A=4&DEF=4&" + shortener.ABBREV_PARAM_NAME + "=AGUID", sHash);
        sHashRestored = shortener.expandHash(sHash);
        deepEqual(aLongUrl, sHashRestored);
        stubGenerateKey.restore();
        restoreLengthLimit(shortener);
    });


    test("expandNoStorage", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            unresolveableShortendURL,
            sHashRestored,
            aLongUrl,
            stubGenerateKey;
        saveLengthLimit(shortener);
        shortener.URL_LENGTH_LIMIT = 60;
        shortener.URL_PARAMS_LENGTH_LIMIT = 20;
        stubGenerateKey = sinon.stub(shortener, "_generateKey", function () { return "AGUID"; });
        aLongUrl = "#SO-ABC~CONTXT?ABC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&/detail/1?A=B";
        sHash = shortener.compactHash("#SO-ABC~CONTXT?ABC=3&DEF=4&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&/detail/1?A=B");
        sHash = sHash.replace(/AGUID/, "BGUID");
        unresolveableShortendURL = "#SO-ABC~CONTXT?ABC=3&DEF=4&" + shortener.ABBREV_PARAM_NAME + "=BGUID&/detail/1?A=B";
        deepEqual(unresolveableShortendURL, sHash);
        sHashRestored = shortener.expandHash(sHash);
        deepEqual(sHash, sHashRestored);
        stubGenerateKey.restore();
        restoreLengthLimit(shortener);
    });

    test("smokeShortenExpandTooLongAppHash", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            sHashRestored,
            aLongUrl,
            stubGenerateKey;
        saveLengthLimit(shortener);
        stubGenerateKey = sinon.stub(shortener, "_generateKey", function () { return "AGUID"; });
        aLongUrl = "#SO-ABC~CONTXT?ABC=3&DEF=4&/detail/1?A=B&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ";
        sHash = shortener.compactHash(aLongUrl);
        deepEqual(aLongUrl, sHash);
        sHashRestored = shortener.expandHash(sHash);
        deepEqual(aLongUrl, sHashRestored);
        stubGenerateKey.restore();
        restoreLengthLimit(shortener);
    });

    test("noCompactParamPresent", function () {
        var shortener = sap.ushell.Container.getService("URLShortening"),
            sHash,
            sHashRestored,
            aLongUrl,
            stubGenerateKey;
        saveLengthLimit(shortener);
        stubGenerateKey = sinon.stub(shortener, "_generateKey", function () { return "AGUID"; });
        aLongUrl = "#SO-ABC~CONTXT?ABC=3&DEF=4&" + shortener.ABBREV_PARAM_NAME + "=AGUID&DEF=AAAAAAAAAAAAAABBBBBBBBBBBB&DEF=JJJJJJJJJJJJJJJJJJ&/detail/1?A=B";
        sHash = shortener.compactHash(aLongUrl);
        deepEqual(aLongUrl, sHash);
        stubGenerateKey.restore();
        restoreLengthLimit(shortener);
    });

    test("expandHashRobust", function () {
        var shortener = sap.ushell.Container.getService("URLShortening");
        deepEqual("", shortener.expandHash(""));
        deepEqual("#", shortener.expandHash("#"));
        deepEqual("#ABCDEF&/ABC", shortener.expandHash("#ABCDEF&/ABC"));
        deepEqual("#&/ABC", shortener.expandHash("#&/ABC"));
    });

    test("generateKey distinct", function () {
        var a,
            shortener = sap.ushell.Container.getService("URLShortening");
        deepEqual(true, shortener._generateKey().length < 36);
        a = shortener._generateKey();
        deepEqual(true, a !== shortener._generateKey());
    });

// end of hash breakdown
// sample usage 
}());
