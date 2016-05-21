
// When the browser is ready...
$(document).ready(function() {
  $("form[validate]").css({"display": "flex", "flex-direction": "column", "align-items": "center"});
  $("form[validate] :input").not("[type='submit']").css({"width": "200px", "margin-top": "10px"});
  $("form[validate] :input[type='submit']").css({"margin-top": "20px", "width": "100px"});
  $("form[validate] :input").not("[type='submit']").attr("placeholder", "input here");

  $("form[validate]").submit(function(event){
     event.preventDefault();

     var inputs = $("form[validate] :input").not(":submit");

     // create form validator
     var validator = new FormValidator(inputs);
     if(validator.validate()) {
       alert("Validation success!!!");
     }
  });
});

// Form validator object
function FormValidator(inputs) {
  var _inputs = inputs;
  var _isErrors = false;

  this._getInputs = function () {
    return $(_inputs);
  }

  this._isErrors = function () {
    return _isErrors;
  }

  this._setIsErrors = function (status) {
    _isErrors = status;
  }

  this._validateInput = function (input) {
    var value = input.value;

    this._validateLength(input);
    this._validateEmail(input);
    this._validateDate(input);
    this._validateRegexp(input);
  }

  this._removeMessages = function () {
    $("em[class='error']").remove();
  }

  this._showErrorMessage = function (input, message) {
      $(input).after("<em class='error' style='color: red; font-size: 13px'>" + message + "</em>");
  }

  this._validateLength = function (input) {
    var isMinLength = input.hasAttribute("validate-minlength");
    var isMaxLength = input.hasAttribute("validate-maxlength");

    var minLength = parseInt(input.getAttribute("validate-minlength"));
    var maxLength = parseInt(input.getAttribute("validate-maxlength"));

    if((!isMinLength || isNaN(minLength)) && isMaxLength) {
      minLength = 2;
    }
    else if(isMinLength && (!isMaxLength || isNaN(maxLength))) {
      maxLength = 500;
    }
    else if(!isMinLength && !isMaxLength) {
      return;
    }

    var message = "Correct input length is between " + minLength + " and " + maxLength;

    var length = input.value.length;
    if(input.value == "" || length < minLength || length > maxLength) {
      this._showErrorMessage(input, message);
      this._setIsErrors(true);
    }
  }

  this._validateEmail = function (input) {
    if(!input.hasAttribute("validate-email"))
      return;

    var isCorrect = true,
        value = input.value,
        atIndex = -1;

    atIndex = value.indexOf("@");

    if(!(atIndex < value.length - 1 && atIndex > 0)) {
      this._showErrorMessage(input, "Input correct email");
      this._setIsErrors(true);
    }
  }

  this._validateDate = function (input) {
    if(!input.hasAttribute("validate-date"))
      return;

    // date field should contain current date (format dd/mm/yyyy)
    var SEPARATOR = "/",
        isCorrect = true;

    // slash position check
    if(!(input.value.indexOf(SEPARATOR) === 2
        && input.value.indexOf(SEPARATOR, 3) === 5
        && input.value.length == 10)) {
      input.focus();
      isCorrect = false;
    }

    // splits the date string to parts
    var dateParts = input.value.split(SEPARATOR);

    var day = parseInt(dateParts[0]);
    var month = parseInt(dateParts[1]);
    var year = parseInt(dateParts[2]);

    // check digits
    if(isNaN(day) || isNaN(month) || isNaN(year)) {
      isCorrect = false;
    }

    // check data if correct
    var date = new Date(year, month - 1, day);
    if(isNaN(date.getTime())) {
      isCorrect = false;
    }

    if(!isCorrect) {
      this._showErrorMessage(input, "Correct date format is dd/mm/yyyy");
      this._setIsErrors(true);
    }
    else {
      // saves the date for output
      day = date.getDate().toString();
      month = (date.getMonth() + 1).toString();
      year = date.getFullYear().toString();

      day = (day.length == 1) ? "0" + day : day;
      month = (month.length == 1) ? "0" + month : month;

      input.value = day + SEPARATOR + month + SEPARATOR + year;
    }
  }

  this._validateRegexp = function (input) {
    if(!input.hasAttribute("validate-regexp"))
      return;
  }
}

FormValidator.prototype.validate = function () {
  /*
  <form validate>
    <input name="name" value="" validate-required validate-minlength="5" validate-maxlength="30" />
    <input name="email" value="" validate-required validate-email />
    <input name="date" value="" validate-date />
    <input name="ip" value="" validate-regexp="^\d+\.\d+\.\d+\.\d+$" />
    <input type="submit" value="Send" />
  </form>
  */
  // removes previous messages
  this._removeMessages();

  var inputs = this._getInputs();
  for(var i = 0; i < inputs.length; ++i) {
    var input = inputs[i];

    if (input.hasAttribute("validate-required")) {
      this._validateInput(input);
    }
    else if(input.value != "") {
      this._validateInput(input);
    }
  }

  return !this._isErrors();
}
