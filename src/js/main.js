import NiceSelect2 from 'nice-select2';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import axios from 'axios';

const selectors = document.querySelectorAll('select.selector');

const options = {
  searchable: false,
};

selectors?.forEach(el => {
  new NiceSelect2(el);
});

const sendButtons = document.querySelectorAll('.sendButton');

sendButtons?.forEach(el => {
  el.addEventListener('click', sendMail);
});

function sendMail(event) {
  event.preventDefault();
  const buttonElement = event.target;

  const thisForm = buttonElement.closest('form');
  const thisRequired = thisForm.querySelectorAll('input.required');
  const thisRequiredSel = thisForm.querySelectorAll('select.required');
  let errorsCount = 0;

  thisRequired.forEach(function (input) {
    const inputVal = input.value.trim();
    const reqType = input.getAttribute('type');

    if (reqType === 'email') {
      if (isEmpty(inputVal) || !isEmail(inputVal)) {
        errorsCount += 1;
        input.closest('label').classList.add('error');
      }
    }

    if (reqType === 'text' || input.tagName.toLowerCase() === 'textarea') {
      if (inputVal.length < 1) {
        errorsCount += 1;
        input.closest('label').classList.add('error');
      }
    }
  });

  thisRequiredSel.forEach(function (select) {
    if (select.value === '') {
      errorsCount += 1;
      select.closest('label').classList.add('error');
    }
  });

  if (errorsCount === 0) {
    sendFormData(thisForm);
  }

  document.querySelectorAll('input, textarea').forEach(function (input) {
    input.addEventListener('focusin', function () {
      document.querySelectorAll('.error')?.forEach(el => {
        el.classList.remove('error');
      });
    });
  });

  document.querySelectorAll('.selector').forEach(function (input) {
    input.addEventListener('click', function () {
      document.querySelectorAll('.error')?.forEach(el => {
        el.classList.remove('error');
      });
    });
  });
}

function sendFormData(form) {
  const formData = new FormData(form);

  axios
    .post('/wp-content/themes/student/mail.php', formData)
    .then(function (response) {
      document.querySelector('body').classList.add('openedPopup');

      setTimeout(function () {
        form.reset();
      }, 500);
    })
    .catch(function (error) {
      console.error('Помилка при відправці форми:', error);
    });
}

document.querySelectorAll('.closePop')?.forEach(el => {
  el.addEventListener('click', evt => {
    document.querySelector('body').classList.remove('openedPopup');
  });
});
