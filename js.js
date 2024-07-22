const ps = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!$%&|[](){}:;.,*+-#@<>~',
};
const passwordLength = document.querySelector('.pass-length input'),
  passwordDetails = document.querySelector('.detail span'),
  passwordIndicator = document.querySelector('.pass-indicator'),
  passwordInput = document.querySelector('.input-box input');

const randomInteger = (min, max) =>
  Math.floor(min + Math.random() * (max + 1 - min));
const shuffleString = (str) =>
  str
    .split('')
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join('');

const updatePasswordIndicator = (a) => {
  passwordDetails.textContent = a;
  passwordIndicator.classList.remove('strong', 'medium');
  if (a >= 16) {
    passwordIndicator.classList.add('strong');
  } else if (a >= 8) {
    passwordIndicator.classList.add('medium');
  }
};

const restorePasswordOptions = () => {
  if (localStorage.getItem('passwordOption')) {
    const passwordOption = JSON.parse(localStorage.getItem('passwordOption'));
    uppercase.checked = passwordOption['uppercase'];
    numbers.checked = passwordOption['numbers'];
    symbols.checked = passwordOption['symbols'];
    passwordLength.value = passwordOption.length;
  }
};

const savePasswordOptions = () => {
  const passwordOption = {};
  passwordOption['length'] = +passwordLength.value;
  passwordOption['uppercase'] = uppercase.checked;
  passwordOption['numbers'] = numbers.checked;
  passwordOption['symbols'] = symbols.checked;
  localStorage.setItem('passwordOption', JSON.stringify(passwordOption));
};

const generatePassword = () => {
  savePasswordOptions();
  const length = +passwordLength.value;
  updatePasswordIndicator(length);
  let passString = shuffleString(ps.lowercase);
  if (uppercase.checked) passString = shuffleString(passString + ps.uppercase);
  if (numbers.checked) passString = shuffleString(passString + ps.numbers);
  if (symbols.checked) passString = shuffleString(passString + ps.symbols);

  let randomPassword = '';

  for (let i = 0; i < length; i++) {
    let random = randomInteger(0, passString.length - 1);
    randomPassword += passString[random];
  }
  passwordInput.value = randomPassword;
};

restorePasswordOptions();
passwordLength.oninput = generatePassword;
document.querySelector('.generate-btn').onclick = generatePassword;
generatePassword();
// ---------------КОПИРОВАНИЕ ПО КНОПКЕ-----------
const copyButton = document.querySelector('.input-box span');

const copyPassword = () => {
  navigator.clipboard.writeText(passwordInput.value);
  copyButton.textContent = 'check';
  copyButton.style.color = 'red';
  setTimeout(function () {
    copyButton.textContent = 'copy_all';
    copyButton.style.color = '#707070';
  }, 1000);
};

copyButton.onclick = copyPassword;

// ---------------СОБЫТИЕ ПРИ ПРОКРУТКИ МЫШИ--------------

const rangeInput = document.querySelector('.pass-length input');
let count = 2;

function handleMouseMove(e) {
  e.preventDefault();
  let delta = e.deltaY > 0 ? 1 : -1;
  count += delta * 2;
  if (count <= -1) {
    count = 2;
  }
  if (count > 0 && count <= 32) {
    passwordLength.value = count;
    passwordDetails.textContent = count;
    generatePassword();
  }
  if (count > 32) count = 32;
}

// Добавляем обработчики событий
// rangeInput.addEventListener('wheel', handleMouseMove);
document
  .querySelector('.pass-length')
  .addEventListener('wheel', handleMouseMove);
