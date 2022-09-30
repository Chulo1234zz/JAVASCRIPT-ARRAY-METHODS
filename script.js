"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
// display new movements
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements; //we use the slice method to get an exact copy of the original array here
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
<div class="movements__row">
    <div class="movements__type movements__type--${type}">
      ${i + 1} ${type}
    </div>
      <div class="movements__value">${mov}₤</div>
</div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// function that creates usernames
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map(function (name, index) {
        return name[0];
      })
      .join("");
  });
};
// computing username
console.log(createUsername(accounts));

// creating the balance using reduce() method and printing it to the gui

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

// request loan
// some method to check any condition and return true or false
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  // console.log('pel')
  // my trial
  const loanRequest = Number(inputLoanAmount.value);
  // console.log(loanRequest)
  if (
    loanRequest > 0 &&
    currentAccount.movements.some((mov) => mov > 0.1 * loanRequest)
  ) {
    // console.log('successful request')
    currentAccount.movements.push(loanRequest);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = " ";
});

// close account
// the findindex() method

// console.log(accounts)
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  let closeUser = inputCloseUsername.value;
  let closePin = Number(inputClosePin.value);
  // console.log(closeUser,closePin)
  if (
    closeUser === currentAccount.username &&
    closePin === currentAccount.pin
  ) {
    // console.log('correct')

    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    // console.log(index)
    // delete account
    accounts.splice(index, 1);

    // hide ui
    containerApp.style.opacity = 0;
  }
  // console.log(accounts)
});

// sorting the movements
// my attempt
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  // currentAccount.movements.sort((a, b) => b - a);
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/* const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]); */

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// slice()
// let arr = ['a','b','c','d','e'];
// console.log(arr.slice(2));
// visit book for more details

// splice()
// console.log(arr.splice(2));
// console.log(arr) this is changed because of the splice method

// reverse()
// const arr2 = ['j','i','h','g','f'];
// console.log(arr2.reverse());

// concat()
// const letters = arr.concat(arr2);
// console.log(letters)

// join()
// console.log(letters.join(' - '))

/////////////////////////////////
// forEach()
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// movements.forEach(console.log('next pls'))

// comparing the for of loop with the foreach method
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    // console.log(` Movement ${i+1}: You desposited ${movement}`)
  } else {
    // console.log(` Movement ${i+1}: You withdrew ${(-1 *movement)}`)//or math.abs() to remove the negative value
  }
}

// forEach() solution
// console.log('////////////FOREACH')
movements.forEach(function (movement, index, array) {
  if (movement > 0) {
    // console.log(` Movement ${index+1}: You desposited ${movement}`)
  } else {
    // console.log(` Movement ${index+1}: You withdrew ${(-1 *movement)}`)//or math.abs() to remove the negative value
  }
});

// forEach() with maps and sets
const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);
currencies.forEach(function (value, key, map) {
  // console.log(`${key},${value},${map   }`)
});

//   coding challenge

// end of coding challenge 1

// /////////DATA TRANSFORMATIONS: MAP, FILTER,REDUCE

// the map() method
const movements2 = [200, 450, -400, 3000, -650, -130, 70, 1300]; //converting these to usd
const eurToUsd = 1.1;

const movementsUSD = movements2.map(function (mov) {
  return mov * eurToUsd;
});
const movUSD = movements2.map((mov) => mov * eurToUsd);
// console.log(movementsUSD)
// console.log(movUSD)

// computing usernames

// filter() method
const deposits = movements2.filter(function (mov) {
  return mov > 0;
});
// console.log(deposits)

const withdrawals = movements2.filter((mov) => mov < 0);
// console.log(withdrawals )

// reduce method
// accumulator is like a snowball that gets bigger as it rolls down it accumulates
const balance = movements2.reduce(function (acc, current, i, arr) {
  return acc + current;
}, 0);
// the 2nd parameter of the reduce function is the original value of the accumulator
// console.log(balance)

// maximum value
const max = movements2.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements2[0]);
// console.log(max)

// coding challenge no 2
const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];
/* const convertAge =function(){
  if(cur<=2) return cur*2;else return cur * 4; console.log(convertAge) } ; */

const calcAverageHumanAge = (ages) => {
  const humanAge = ages
    .map(function (age) {
      return age <= 2 ? 2 * age : 16 + 4 * age;
    })
    .filter((age) => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
};
const avg1 = calcAverageHumanAge(data1);
console.log(avg1);

// the magic of chaining methods
// cuntion to add up all the deposits and convert them to usd
const totalUsd = movements
  .filter((mov) => mov > 0)
  .map((mov) => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
// console.log(totalUsd)

// find() method
// the find method does the same thing as filter method just that it doesnt rerurn a new array based on the inputted condition, it returns the first element in the array that satisfies the condition
const firstWithdrawal = movements.find((mov) => mov < 0);
console.log(firstWithdrawal);
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// some and every method
// some method tests for a condition in an array
const anyDeposits = movements.some((mov) => (mov) => 0);
console.log(anyDeposits);

// every method as the name implies returns true only if all the elements in the array satisfy the condition in the call back function

// flat and flat map method
// flat mthod
// it basically flattens the array especially if it is a nested array
const arr = [[1, 2, 3], 4, 5, [6, 7, 8]];
console.log(arr.flat());
const arrDeep = [[[1, 2], 3], 4, 5, [6, [7, 8]]];
console.log(arrDeep.flat(2)); //you can make the flattening go levels deeper by changing the arguments passed into it ie; (1) makes it go 1 level deep

// if the bank wants to find the total balance of all the accounts

const accountMovements = accounts.map((acc) => acc.movements);
console.log(accountMovements.flat(10).reduce((acc, mov) => acc + mov));
// since it was dicsovered that u mostly only ever flat after the map method the flatmap() method was invented
// flatMap()
const accountMovements2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => acc + mov);
console.log(accountMovements2);

// sorting arrays
// strings
const owners = ["Jerry", "Prince", "Salam", "Basit"]; //the sort method rearranges based on an order and it mutates the original aray
console.log(owners.sort());
// numbers
console.log(movements);
// console.log(movements.sort());//this doesnt sort anything coz the sort method sorts as strings

//return < 0, A,B
//return > 0, B,A
/* movements.sort((a, b) => {
  if (a > b) return 1;
  if (b > a) return -1;
}); */

// better still since if a >b then the subtraction will always return positive a>b vice versa
movements.sort((a, b) => a - b);
console.log(movements);

// progrmaically creating and fillling arrays/
// !. usingthe new array method
// if u use the new array constructor with only one numerical argument instead of it to make another array with only that number it creates a new array with the length of that only number
//the only way u can fill this emty array is by the fill method
const x = new Array(8);
x.fill(1, 3); //he 2nd argument passed should be the number of empty array we want at the beginning
console.log(x);

// using fill method on normal arrays
const arrr = [1, 2, 3, 4, 5, 6, 7];
console.log(arrr.fill(23, 4, 6)); //it starts filling the arrays with the first argument from index 4 to index 6

// Array.from() : used to programmatically create and array
const y = Array.from({ length: 7 }, () => 1);
console.log(y); //use this instead of the previous method of new Array() and fill method;

// recreating 'arrr' with the Array.from() method
const z = Array.from({ length: 7 }, (cur, i) => i + 1); //underscore(_) is a throaway variable bcoz u useit in place of variables u dont need in this case 'cur'
console.log(z);

// mini coding challenge
// make an array with the array.from to generate 100 random dice rolls
const dice = Array.from(
  { length: 100 },
  () => Math.floor(Math.random() * 6) + 1
);
// console.log(dice);

// real use case of array.from is converting iterables like strings,maps and sets to arrays
// using querySelectorAll reruns a nodeList containing all of the selected elements
// its like an iterable since it is not an array and u want to convert it to an array so u can use the array methods on it u can also use the Array.from method

// say we want to take the values of the movements from the ui and cslc the balance

labelBalance.addEventListener("click", function () {
  const movHtml = document.querySelectorAll(".movements__value");//this only shows all the elements when it is attached to a callback fn
  // console.log(movHtml);
  console.log(Array.from(movHtml));
});
