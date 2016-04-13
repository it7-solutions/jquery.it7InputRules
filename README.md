[![Build Status](https://travis-ci.org/it7-solutions/jquery.it7InputRules.svg?branch=master)](https://travis-ci.org/it7-solutions/jquery.it7InputRules)

# jquery.it7InputRules
Plug-in for filtering and transforming text entered in the input field.

## Limitation

* Тext inserted using the browser autocomplete - not filtered.
* In IE8 - The text is inserted in the INPUT - not filtered.
* Ctrl+Z disabled.

## Usage

Except loading js-file you need to specify the class *it7InputRulesListen* and rules for  transformation and filtering in the tag attribute *data-it7-input-rules*:
```html
<script type="text/javascript" src="validationRulesForInputRules.js">
<input name="targetField" class="it7InputRulesListen" data-it7-input-rules="{"uppercase":true,"alphaNumber":true}" />
```

