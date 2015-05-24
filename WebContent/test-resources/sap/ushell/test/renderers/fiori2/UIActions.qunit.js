// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.Shell
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require('sap.ushell.UIActions');

    module("sap.ushell.UIActions", {
        setup: function () {

            var workingArea = '<div id="root">' +
                    '<div id="wrapper">' +
                        '<div id="container" style="width: 500px; height: 500px; position: absolute; background-color: red;"> </div>' +
                    '</div>' +
                '</div>';

            jQuery('body').append(workingArea);
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            jQuery('#root').remove();
        }
    });

    test("create a new instance of UIActions Class", function () {
        var instance = null;
        instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : "D"
        });

        assert.ok(instance, "create a new instance");

    });

    test("create a new instance of UIActions Class with empty mandatory parameters", function () {
        var instance;
        assert.throws(
            function() {
                instance = new sap.ushell.UIActions({
                    rootSelector : "",
                    containerSelector : "#container",
                    draggableSelector : "D"
                });
            },
            "create new UIActions object with empty rootSelector parameter should throw an exception."
        );

        assert.throws(
            function() {
                instance = new sap.ushell.UIActions({
                    rootSelector : "#root",
                    containerSelector : "",
                    draggableSelector : "D"
                });
            },
            "create new UIActions object with empty containerSelector parameter should throw an exception."
        );

        assert.throws(
            function() {
                instance = new sap.ushell.UIActions({
                    rootSelector : "#root",
                    containerSelector : "#container",
                    draggableSelector : ""
                });
            },
            "create new UIActions object with empty draggableSelector parameter should throw an exception."
        );
    });

    asyncTest("touchstart on draggable element", function () {
        expect(2);
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);
        var draggableDOMRef = document.getElementById('draggable0');

        var touchStartCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : touchStartCallback,
            isTouch : true
        }).enable();

        var event = jQuery.extend(new UIEvent('touchstart'),
            {touches:[{pageX: 10, pageY:10, target: draggableDOMRef}]});

        document.getElementById('root').dispatchEvent(event);

        setTimeout(function(){
            assert.ok(touchStartCallback.calledOnce, "make sure touchstart callback is called once");
            assert.ok(touchStartCallback.args[0][1] === draggableDOMRef, "make sure touchstart callback is called with draggable element");
            start();

            instance.disable();
            instance = null;
        }, 100);
    });

    asyncTest("mousedown on draggable element", function () {
        expect(2);
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);
        var draggableDOMRef = document.getElementById('draggable0');

        var mouseDownCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : mouseDownCallback,
            isTouch : false
        }).enable();

        var event = document.createEvent('Event');
        event.initEvent('mousedown', true, true);
        draggableDOMRef.dispatchEvent(event);

        setTimeout(function(){
            assert.ok(mouseDownCallback.calledOnce, "make sure mousedown callback is called once");
            assert.ok(mouseDownCallback.args[0][1] === draggableDOMRef, "make sure mousedown callback is called with draggable element");
            start();

            instance.disable();
            instance = null;
        }, 100);
    });

    asyncTest("touchstart on non-draggable element", function () {
        expect(1);
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);

        var touchStartCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : touchStartCallback,
            isTouch : true
        }).enable();

        var event = jQuery.extend(new UIEvent('touchstart'),
            {touches:[{pageX: 10, pageY:10, target: document.getElementById('container')}]});

        document.getElementById('root').dispatchEvent(event);

        setTimeout(function(){
            assert.ok(touchStartCallback.notCalled, "make sure touchstart callback is not called");
            start();

            instance.disable();
            instance = null;
        }, 100);
    });

    asyncTest("mousedown on non-draggable element", function () {
        expect(1);
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);

        var mouseDownCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : mouseDownCallback,
            isTouch : false
        }).enable();

        var event = document.createEvent('Event');
        event.initEvent('mousedown', true, true);
        document.getElementById('root').dispatchEvent(event);

        setTimeout(function(){
            assert.ok(mouseDownCallback.notCalled, "make sure mousedown callback is not called");
            start();

            instance.disable();
            instance = null;
        }, 100);
    });
    
    asyncTest("check double tap", function () {
        expect(2);
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);

        var draggableDOMRef = document.getElementById('draggable0');
        var rootElement = document.getElementById('root');

        var touchStartCallback = sinon.spy();
        var doubleTapCallback = sinon.spy();

        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : touchStartCallback,
            doubleTapCallback : doubleTapCallback,
            doubleTapDelay : 500,//ms,
            switchModeDelay : 1500,
            debug : true,
            isTouch : true
        }).enable();

        var touchstartEvent = jQuery.extend(new UIEvent('touchstart'),
            {touches:[{pageX: 10, pageY:10, target: draggableDOMRef}]});
        var touchendEvent = jQuery.extend(new UIEvent('touchend'),
            {touches:[{pageX: 10, pageY:10, target: draggableDOMRef}]}, {changedTouches:[{pageX: 10, pageY:10}]});

        setTimeout(function(){
            rootElement.dispatchEvent(touchstartEvent);
            setTimeout(function(){
                rootElement.dispatchEvent(touchendEvent);
                setTimeout(function(){
                    rootElement.dispatchEvent(touchstartEvent);
                    setTimeout(function(){
                        rootElement.dispatchEvent(touchendEvent);
                        setTimeout(function(){
                            assert.ok(touchStartCallback.calledTwice, "make sure touchstart callback is called twice");
                            assert.ok(doubleTapCallback.calledOnce, "make sure doubleTap callback is called");
                            start();

                            instance.disable();
                            instance = null;
                        }, 100);
                    }, 50);
                }, 50);
            }, 50);
        }, 50);
    });

    asyncTest("check double click", function () {
        expect(2);
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);

        var draggableDOMRef = document.getElementById('draggable0');
        var rootElement = document.getElementById('root');

        var mouseDownCallback = sinon.spy();
        var doubleClickCallback = sinon.spy();

        var instance1 = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : mouseDownCallback,
            doubleTapCallback : doubleClickCallback,
            doubleTapDelay : 10000,//ms,
            switchModeDelay : 1500,
            debug : true,
            isTouch : false
        }).enable();

        var mousedownEvent = jQuery.extend(document.createEvent('Event'), {pageX: 10, pageY:10});
        mousedownEvent.initEvent('mousedown', true, true);

        var mouseupEvent = jQuery.extend(document.createEvent('Event'), {pageX: 10, pageY:10});
        mouseupEvent.initEvent('mouseup', true, true);

        setTimeout(function(){
            draggableDOMRef.dispatchEvent(mousedownEvent);
            setTimeout(function(){
                draggableDOMRef.dispatchEvent(mouseupEvent);
                setTimeout(function(){
                    draggableDOMRef.dispatchEvent(mousedownEvent);
                    setTimeout(function(){
                        draggableDOMRef.dispatchEvent(mouseupEvent);
                        setTimeout(function(){
                            assert.ok(mouseDownCallback.calledTwice, "make sure mousedown callback is called twice");
                            assert.ok(doubleClickCallback.calledOnce, "make sure doubleClick callback is called");
                            start();

                            instance1.disable();
                            instance1 = null;
                        }, 100);
                    }, 50);
                }, 50);
            }, 50);
        }, 50);
    });
    
    asyncTest("check touchEnd after drag and clone disappearance", function () {
        expect(2);
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);

        var draggableDOMRef = document.getElementById('draggable0');
        var rootElement = document.getElementById('root');

        var touchEndCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            endCallback : touchEndCallback,
            cloneClass : "clone",
            switchModeDelay : 10,//ms
            isTouch : true
        }).enable();

        var touchstartEvent = jQuery.extend(new UIEvent('touchstart'),
            {touches:[{pageX: 10, pageY:10, target: draggableDOMRef}]});

        var touchmoveEvent = jQuery.extend(new UIEvent('touchmove'),
            {touches:[{pageX: 11, pageY:11, target: draggableDOMRef}]});

        var touchendEvent = jQuery.extend(new UIEvent('touchend'),
            {touches:[{pageX: 10, pageY:10, target: draggableDOMRef}]}, {changedTouches:[{pageX: 11, pageY:11}]});

        rootElement.dispatchEvent(touchstartEvent);
        setTimeout(function() {
            rootElement.dispatchEvent(touchmoveEvent);
            setTimeout(function() {
                rootElement.dispatchEvent(touchendEvent);
                setTimeout(function() {
                    assert.ok(touchEndCallback.calledOnce, "make sure touchend callback is called");
                    assert.ok(jQuery('#root').find('.clone').length === 0, "make sure the clone disappeared");
                    start();

                    instance.disable();
                    instance = null;
                }, 100);
            }, 50);
        }, 50);
    });

    asyncTest("check mouseup after drag and clone disappearance", function () {
        expect(2);
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);

        var draggableDOMRef = document.getElementById('draggable0');
        var rootElement = document.getElementById('root');

        var mouseUpCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            endCallback : mouseUpCallback,
            cloneClass : "clone",
            switchModeDelay : 10,//ms
            moveTolerance : 1,
            isTouch : false
        }).enable();

        var mousedownEvent = jQuery.extend(document.createEvent('Event'), {pageX: 10, pageY:10});
        mousedownEvent.initEvent('mousedown', true, true);

        var mousemoveEvent = jQuery.extend(document.createEvent('Event'), {pageX: 15, pageY:15});
        mousemoveEvent.initEvent('mousemove', true, true);

        var mouseupEvent = jQuery.extend(document.createEvent('Event'), {pageX: 15, pageY:15});
        mouseupEvent.initEvent('mouseup', true, true);

        draggableDOMRef.dispatchEvent(mousedownEvent);
        setTimeout(function() {
            draggableDOMRef.dispatchEvent(mousemoveEvent);
            setTimeout(function() {
                draggableDOMRef.dispatchEvent(mouseupEvent);
                setTimeout(function() {
                    assert.ok(mouseUpCallback.calledOnce, "make sure mouseup callback is called");
                    assert.ok(jQuery('#root').find('.clone').length === 0, "make sure the clone disappeared");
                    start();

                    instance.disable();
                    instance = null;
                }, 100);
            }, 50);
        }, 50);
    });

    asyncTest("check switch to drag mode and clone creation", function () {
        expect(3);
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);

        var draggableDOMRef = document.getElementById('draggable0');
        var rootElement = document.getElementById('root');

        var touchDragCallback = sinon.spy();
        var touchStartCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : touchStartCallback,
            dragCallback : touchDragCallback,
            cloneClass : "clone",
            switchModeDelay : 10,//ms
            isTouch : true
        }).enable();

        var touchstartEvent = jQuery.extend(new UIEvent('touchstart'),
            {touches:[{pageX: 10, pageY:10, target: draggableDOMRef}]});

        var touchmoveEvent = jQuery.extend(new UIEvent('touchmove'),
            {touches:[{pageX: 11, pageY:11, target: draggableDOMRef}]});

        rootElement.dispatchEvent(touchstartEvent);
        setTimeout(function() {
            rootElement.dispatchEvent(touchmoveEvent);
            setTimeout(function() {
                assert.ok(touchStartCallback.calledOnce, "make sure touchstart callback is called");
                assert.ok(touchDragCallback.calledOnce, "make sure touchdrag callback is called");
                assert.ok(jQuery('#root').find('.clone').length === 1, "make sure a clone was created");
                start();

                instance.disable();
                instance = null;
            }, 100);
        }, 50);
    });

    asyncTest("check switch to drag mode and clone creation (with mouse)", function () {
        expect(3);
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);

        var draggableDOMRef = document.getElementById('draggable0');
        var rootElement = document.getElementById('root');

        var dragCallback = sinon.spy();
        var mouseDownCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : mouseDownCallback,
            dragCallback : dragCallback,
            cloneClass : "clone",
            switchModeDelay : 10,//ms
            moveTolerance : 1,
            isTouch : false
        }).enable();

        var mousedownEvent = jQuery.extend(document.createEvent('Event'), {pageX: 10, pageY:10});
        mousedownEvent.initEvent('mousedown', true, true);

        var mousemoveEvent = jQuery.extend(document.createEvent('Event'), {pageX: 15, pageY:15});
        mousemoveEvent.initEvent('mousemove', true, true);

        draggableDOMRef.dispatchEvent(mousedownEvent);
        setTimeout(function() {
            draggableDOMRef.dispatchEvent(mousemoveEvent);
            setTimeout(function() {
                draggableDOMRef.dispatchEvent(mousemoveEvent);
                setTimeout(function() {
                    assert.ok(mouseDownCallback.calledOnce, "make sure mousedown callback is called");
                    assert.ok(dragCallback.calledOnce, "make sure mousemove callback is called");
                    assert.ok(jQuery('#root').find('.clone').length === 1, "make sure a clone was created");
                    start();

                    instance.disable();
                    instance = null;
                }, 100);
            }, 50);
        }, 50);
    });

    asyncTest("check UIActions disabled", function () {
        expect(2);
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);
        var draggableDOMRef = document.getElementById('draggable0');
        var rootElement = document.getElementById('root');

        var touchStartCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : touchStartCallback,
            isTouch : true
        }).enable();

        instance.disable();

        var event = jQuery.extend(new UIEvent('touchstart'),
            {touches:[{pageX: 10, pageY:10, target: draggableDOMRef}]});

        rootElement.dispatchEvent(event);

        setTimeout(function(){
            assert.ok(touchStartCallback.notCalled, "make sure touchstart callback is not called when the UIActions is disabled");

            instance.enable();
            rootElement.dispatchEvent(event);

            setTimeout(function() {
                assert.ok(touchStartCallback.calledOnce, "make sure touchstart callback is called when the UIActions is enabled again");
                start();

                instance.disable();
                instance = null;
            }, 100);
        }, 100);
    });

    asyncTest("check UIActions disabled (with mouse events)", function () {
        expect(2);
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);
        var draggableDOMRef = document.getElementById('draggable0');
        var rootElement = document.getElementById('root');

        var mouseDownCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : mouseDownCallback,
            isTouch : false
        }).enable();

        instance.disable();

        var mousedownEvent = jQuery.extend(document.createEvent('Event'), {pageX: 10, pageY:10});
        mousedownEvent.initEvent('mousedown', true, true);

        draggableDOMRef.dispatchEvent(mousedownEvent);

        setTimeout(function(){
            assert.ok(mouseDownCallback.notCalled, "make sure mousedown callback is not called when the UIActions is disabled");

            instance.enable();
            draggableDOMRef.dispatchEvent(mousedownEvent);

            setTimeout(function() {
                assert.ok(mouseDownCallback.calledOnce, "make sure mousedown callback is called when the UIActions is enabled again");
                start();

                instance.disable();
                instance = null;
            }, 100);
        }, 100);
    });

}());