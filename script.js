'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = (movements) => {
    containerMovements.innerHTML = ''
    movements.forEach((movement) => {
        
        const type = movement > 0 ? 'deposit' : 'withdrawal'

        const markup = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${type}</div>
          
          <div class="movements__value">${movement} €</div>
        </div>`

        containerMovements.insertAdjacentHTML('afterbegin', markup)
    })
}

const displayBalance = (movements) => {
  const balance = movements.reduce(((accum, mov) => accum + mov), 0) 
  labelBalance.textContent = `${balance} €`
}

const displayDeposites = (movements) => {
  const income = movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0)
  labelSumIn.textContent = `${income} €`
}

const displayWithdrawals = (movements) => {
  const out = movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  labelSumOut.textContent = `${Math.abs(out)} €`
}

const displayInterest = (movements) => {
  const interest = movements.filter(mov => mov > 0).map(deposit => deposit * 1.2/100).filter(int => int > 1).reduce((acc, mov) => acc + mov, 0)
  labelSumInterest.textContent = `${interest} €`
}

displayBalance(movements)
displayMovements(account1.movements)
displayDeposites(account1.movements)
displayWithdrawals(account1.movements)
displayInterest(account1.movements)

const createUserName = (accounts) => {
  accounts.forEach(acc => acc.username = acc.owner.toLowerCase().split(' ').map(item => item[0]).join(''))
}
createUserName(accounts)


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

const total = Math.round(movements.filter(mov => mov > 0).map(mov => mov * eurToUsd).reduce((acc, curr) => acc + curr, 0))

console.log(total)