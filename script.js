'use strict';

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1

//movements.forEach((move, i) => move > 0 ? console.log(`${i+1}. DEP: ${move}`) : console.log(`${i+1}. WIT: ${Math.abs(move)}`))

const displayMovements = (account, sort = false) => {
    containerMovements.innerHTML = ''

    const movs = sort ? account.movements.slice().sort((a, b) => a - b) : movements

    movs.forEach((movement) => {
        const type = movement > 0 ? 'deposit' : 'withdrawal'

        const markup = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${type}</div>
          
          <div class="movements__value">${movement.toFixed(2)} €</div>
        </div>`

        containerMovements.insertAdjacentHTML('afterbegin', markup)
    })
}

const displayBalance = (account) => {
  account.balance = account.movements.reduce(((accum, mov) => accum + mov), 0) 
  labelBalance.textContent = `${account.balance.toFixed(2)} €`
}

const displaySummary = (account) => {
  const income = account.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0)
  const out = account.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  const interest = account.movements.filter(mov => mov > 0).map(deposit => deposit * account.interestRate/100).filter(int => int > 1).reduce((acc, mov) => acc + mov, 0)

  labelSumIn.textContent = `${income.toFixed(2)} €`
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)} €`
  labelSumInterest.textContent = `${interest.toFixed(2)} €`
}

const createUserName = (accounts) => {
  accounts.forEach(acc => acc.username = acc.owner.toLowerCase().split(' ').map(item => item[0]).join(''))
}
createUserName(accounts)

const updateUI = (acc) => {
  displayMovements(acc)
  displayBalance(acc)
  displaySummary(acc)
}

let currentAccount

btnLogin.addEventListener('click', (e) => {
  e.preventDefault()

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`

    containerApp.style.opacity = 100

    updateUI(currentAccount)

    inputLoginPin.value = inputLoginUsername.value = ''
    inputLoginPin.blur()
  }
})


btnTransfer.addEventListener('click', (e) => {
  e.preventDefault()
  const amount = Number(inputTransferAmount.value)
  const recieverAcc = accounts.find(acc => acc.username === inputTransferTo.value)

  if (amount > 0 && recieverAcc && currentAccount.balance >= amount && recieverAcc.username !== currentAccount.username) {
    currentAccount.movements.push(-amount)
    recieverAcc.movements.push(amount)
    updateUI(currentAccount)
  }

  inputTransferAmount.value = inputTransferTo.value = ''
  inputTransferAmount.blur()
})


btnLoan.addEventListener('click', e => {
  e.preventDefault()

  const amount = Number(inputLoanAmount.value)

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount)
    updateUI(currentAccount)
    inputLoanAmount.value = ''
    inputLoanAmount.blur()
  }
})


btnClose.addEventListener('click', (e) => {
  e.preventDefault()

  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username)
    accounts.splice(index, 1)

    inputCloseUsername.value = inputClosePin.value = ''
    inputClosePin.blur()
    containerApp.style.opacity = 0
    labelWelcome.textContent = 'Log in to get started'
  }
})

let sorted = false

btnSort.addEventListener('click', e => {
  e.preventDefault()
  displayMovements(currentAccount, !sorted)
  sorted = !sorted
})

// Training:

// const movUSD = movements.map(item => item * eurToUsd)

// const movDesc = movements.map((mov, i) => `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`)


// const deposits = movements.filter(mov => mov > 0)
// const withdrawals = movements.filter(mov => mov < 0)

// const balance = movements.reduce(((accum, curr, index, arr) => accum + curr), 0) // 2nd param is a starting value of accumulator (accum)

// const max = movements.reduce((acc, curr) => {
//   if (acc > curr) return acc
//   else return curr
// } )

// console.log(max)

// const total = Math.round(movements.filter(mov => mov > 0).map(mov => mov * eurToUsd).reduce((acc, curr) => acc + curr, 0))

// console.log(total)

// const search = movements.find(mov => mov < 0)

// console.log(search)

// const anyDeposits = movements.some(mov => mov > 0) // checks if any value meets the condition and returns boolean

// console.log(anyDeposits)

// console.log(movements.every(mov => mov > 0)) // checks if every value meets the condition and returns boolean

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8]

// console.log(arr.flat()) // creates a one dimensional array

// const arrDeep = [1, 2, 3, [4, 5, [6, 7, [8, 9 ]]]]

// console.log(arrDeep.flat(3))

// const overBalance = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0)
// console.log(overBalance)

// const bankBal = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0) // combines map and flat as it is a common operation. goes only 1 levle deep
// console.log(bankBal)

// movements.sort((curr, next) => {
//   if (curr > next) return 1 // keep order
//   if (next > curr) return -1 // switch order
// })

// movements.sort((a, b) => a - b)

// console.log(movements)

// const x = new Array(7)
// x.fill(1, 3, 5) // item, start, end
// console.log(x)

// const y = Array.from({length: 7}, () => 1)
// console.log(y)

// const z = Array.from({length: 7}, (_, i) => i + 1)
// console.log(z)

// const dice = Array.from({length: 100}, () => Math.round(Math.random() * (6 - 1) + 1))
// console.log(dice)

// labelBalance.addEventListener('click', () => {
//   const moveUI = Array.from(document.querySelectorAll('.movements__value'), el => el.textContent.replace('€', '')) // converts node list into array, then map the repplace function

//   console.log(moveUI)
// })

// console.log(Number.isNaN(20)) // check if value is NaN, not commonly used
// console.log(Number.isFinite(20)) // best way of checking if value is a number
// console.log(Number.isInteger(20)) 

// const randomInt = (min, max) => Math.trunc(Math.random() * (max - min) + 1) + min
// console.log(randomInt(10, 20))

// console.log((2.7167).toFixed(2)) // removes decimals
