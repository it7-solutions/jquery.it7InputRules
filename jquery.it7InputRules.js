/**
 *
 * jquery.it7InputRules.js
 * @summary Filtered and transform input characters  jQuery plugin
 * @see https://github.com/it7-solutions/jquery.it7InputRules
 *
 * @version: 1.0.0
 * @author ANEKHERo.SyS aka Kolodyazhni Andrew
 *
 * @licence MIT License http://www.opensource.org/licenses/mit-license
 *
 * @requires jQuery jQuery v1.8.2
 */
;(function ($) {


    /* Variables */
    var defaultOptions = {
        // jQuery element
        $root: undefined,
        // Selector for filter events by elements
        selector: undefined,
        // Error message style
        // 0 - hide
        // 1 - show native alert
        errorMessage: 1,
        // Run-time variables
        alreadyListened: false
    };
    var rules = {};


    /* Private Methods */
    function getElementSelection(that) {
        var position = {};
        if (that.selectionStart === undefined) {
            that.focus();
            var select = document.selection.createRange();
            position.length = select.text.length;
            select.moveStart('character', -that.value.length);
            position.end = select.text.length;
            position.start = position.end - position.length;
        } else {
            position.start = that.selectionStart;
            position.end = that.selectionEnd;
            position.length = position.end - position.start;
        }
        return position;
    }

    function setElementSelection(that, start, end) {
        if (that.selectionStart === undefined) {
            that.focus();
            var r = that.createTextRange();
            r.collapse(true);
            r.moveEnd('character', end);
            r.moveStart('character', start);
            r.select();
        } else {
            that.selectionStart = start;
            that.selectionEnd = end;
        }
    }

    function getElementRules(element) {
        var elementRules = $(element).data("it7InputRules");
        return (elementRules && typeof elementRules === 'object') ? elementRules : {};
    }

    function makeFakeState(state, added){
        return {
            event: state.event,
            element: state.element,
            value: '',
            added: added,
            pass: true,
            selection: {
                start: 0,
                end: 0,
                length: 0
            }
        };
    }

    function createState(event, element){
        return {
            event: event,
            element: element,
            value: $(element).val(),
            added: String.fromCharCode(event.which),
            pass: true,
            selection: getElementSelection(element)
        };
    }

    function applyRules(state, elementRules) {
        $.each(elementRules, function(ruleName, ruleParameters){
            if(ruleParameters && rules[ruleName] && typeof rules[ruleName] === 'function'){
                state = rules[ruleName](state);
            }
        });
        return state;
    }

    function placeText(value, replaced, start, end){
        return value.substr(0, start) + replaced + value.substring(end);
    }

    function setElementValue(state){
        if(state.pass){
            var cursorPosition = state.selection.start + state.added.length;
            $(state.element).val(placeText(state.value, state.added, state.selection.start, state.selection.end));
            setElementSelection(state.element, cursorPosition, cursorPosition);
        }
    }

    /**
     * Exclude Ctrl+* in FF
     *
     * @param event
     * @returns {boolean}
     */
    function isPrintableCharacter(event){
        return !event.ctrlKey && event.which > 0;
    }

    function onElementKeyPress(d, event, element){
        if(isPrintableCharacter(event)){
            var state = createState(event, element);
            setElementValue(applyRules(state, getElementRules(element)));
            event.preventDefault();
            return false;
        }
    }

    function getPastedText(state) {
        var currentValue = $(state.element).val();
        var pastedFrom = state.selection.start;
        var pastedTo = currentValue.length - (state.value.length - state.selection.end);
        return currentValue.substring(pastedFrom, pastedTo);
    }

    function applyToPasted(state, elementRules) {
        var pasted = getPastedText(state);
        state.added = '';
        $.each(pasted, function(i, character){
            var s = makeFakeState(state, character);
            s = applyRules(s, elementRules);
            if(s.pass){
                state.added += s.added;
            }
        });
        return state;
    }

    function onPasteToElement(d, event, element) {
        var state = createState(event, element);
        setTimeout(function () {
            setElementValue(applyToPasted(state, getElementRules(element)));
        }, 1);
    }

    /**
     * Disable Ctrl+Z
     *
     * @returns {boolean}
     */
    function onElementKeyDown() {
        if(event.ctrlKey && event.which === 90){
            event.preventDefault();
            return false;
        }
    }

    function setListeners(d){
        if(!d.alreadyListened){
            d.$root.on('keydown.jquery.it7InputRules', d.selector, function(e){onElementKeyDown()});
            d.$root.on('keypress.jquery.it7InputRules', d.selector, function(e){onElementKeyPress(d, e, this)});
            d.$root.on('paste.jquery.it7InputRules', d.selector, function (e) {
                onPasteToElement(d, e, this)
            });
            d.alreadyListened = true;
        }
    }

    function initSelectorData(rootOptions, options){
        options || (options = {});
        var selector = String(options.selector);
        selector || (selector = 'undefined');
        var selectorOption = rootOptions.selectors[selector];
        if(!selectorOption){
            selectorOption = $.extend({}, defaultOptions);
            rootOptions.selectors[selector] = selectorOption;
            selectorOption.$root = rootOptions.$root;
        }
        $.extend(selectorOption, options);
        return selectorOption;
    }

    function initRootData($root){
        var rootOptions = $root.data('jquery.it7InputRules');
        if(!rootOptions){
            rootOptions = {selectors: {}, $root: $root};
            $root.data('jquery.it7InputRules', rootOptions);
        }
        return rootOptions;
    }

    /* Public Methods */
    function it7InputRules(options){
        $(this).each(function(){
            var $root = $(this);
            var rootOptions = initRootData($root);
            var selectorOptions = initSelectorData(rootOptions, options);
            setListeners(selectorOptions);
        });
    }

    /**
     * Show error Message
     *
     * @param message
     */
    function showError(message) {
        if(defaultOptions.errorMessage){
            alert('Javascript runtime error: ' + message);
        }
    }


    /* Register plugin in jQuery namespace */
    $.fn.it7InputRules = it7InputRules;
    $.fn.it7InputRules.defaults = defaultOptions;
    $.fn.it7InputRules.rules = rules;

})(jQuery);

(function ($) {
    var rules = {
        "uppercase": function (state) {
            state.added = state.added.toUpperCase();
            return state;
        },
        "alphaNumber": function (state) {
            state.pass = /[a-zA-Z0-9]/.test(state.added);
            return state;
        }
    };
    $.extend($.fn.it7InputRules.rules, rules);
})(jQuery);

$(function(){
    $(document).it7InputRules({selector: '.it7InputRulesListen'});
});
