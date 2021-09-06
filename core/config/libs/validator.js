module.exports = {
  isRequiredInObject(values, object, error) {
    values.forEach((element) => {
      if (!object[element]) throw error;
    });
  },
  isRequired(value, error) {
    if (!value) throw error;
  },
  validateDocument: (document) => {
    var numbers, digit, soma, i, result, digitEqual;
    digitEqual = 1;
    if (document.length < 11) throw 400;

    for (i = 0; i < document.length - 1; i++)
      if (document.charAt(i) != document.charAt(i + 1)) {
        digitEqual = 0;
        break;
      }
    if (!digitEqual) {
      numbers = document.substring(0, 9);
      digit = document.substring(9);
      soma = 0;
      for (i = 10; i > 1; i--) soma += numbers.charAt(10 - i) * i;
      result = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (result != digit.charAt(0)) throw 400;
      numbers = document.substring(0, 10);
      soma = 0;
      for (i = 11; i > 1; i--) soma += numbers.charAt(11 - i) * i;
      result = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (result != digit.charAt(1)) throw 400;
      return true;
    } else throw 400;
  },
  validateEmail: (email) => {
    emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!emailRegex.test(email)) throw 400;
  },
};
