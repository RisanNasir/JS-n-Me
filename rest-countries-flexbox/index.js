
let countriesData;
let shortListCountriesData;
const numberOfCountries = 20;

// getting all countries data on loading the main page from REST countries API.
$(document).ready(function () {
  $.ajax({
    url: "https://restcountries.com/v3.1/all",
    type: "GET",
    success: function (response, textStatus, xhr) {
      countriesData = response;
      shortListCountriesData = getRandom(countriesData, numberOfCountries);
      if (xhr.status === 200) { postCountries(shortListCountriesData); }
    },
    error: function (error) {
      console.log(error)
    }
  })
});
// Return given number of random countries data.
function getRandom(countries, number) {
  let data = [];
  let unique = [];
  let total = countries.length;
  for (let i = 0; i < number; i++) {
    let random = Math.floor(Math.random() * Math.floor(total));
    
    if (unique.indexOf(random) === -1) { // checking the duplicates in numbers array.
      unique.push(random);
      data.push(countries[random])
    } else {
      i--;
    }
  }
  return data;
}

// Returning the population number with comma every three digits.
function fancyNumbers( number) {
  number = number.split(""); // splitting the string in to char array.
  let newNumber = [];
  let index = 1;
  for (let i = number.length-1; i >= 0; i--) {
    newNumber.push(number[i]);
    !(index % 3) ? newNumber.push(','): null; // putting comma in the array.
    index++;
  }
  newNumber = newNumber.reverse(); // reversing the array.
  newNumber[0] === ',' ? newNumber.shift(): null; //deleting the comma if its on 1st array element.
  newNumber = newNumber.join(""); //converting array into string.
  return newNumber;
}


//searching the full country name based on their alpha3code.
function getBorderCountryName(searchTerm) {
  let countryName = '';
  countriesData.map(element => {
    const alpha3Code = element.cca3.toLocaleLowerCase('en-US');
    if (!(alpha3Code.localeCompare(searchTerm.toLocaleLowerCase('en-US')))) {
      countryName = element.name.common;
      return;
    }
  });
  return countryName;
}

function getBorderCountry(e, searchTerm) {
  let data = [];
  countriesData.map(element => {
    const alpha3Code = element.cca3.toLocaleLowerCase('en-US');
    if (!(alpha3Code.localeCompare(searchTerm.toLocaleLowerCase('en-US')))) {
      data.push(element);
      return;
    }
  });
  postCountries(data);
}

                              

// populating the selected countries data from REST Countries API.
function postCountries(data) {
  let dataStr = ``;
  if (!(data.length === 1)) { // for multiple cards of data.
    for (let i = 0; i < data.length; i++) { // traversing and making html of all the elements in array.
      const p = fancyNumbers(data[i].population.toString()); // adding comma in population to readability.
      dataStr += `
      <div class="card">
        <div style="height=225px">
          <a class="countryFlag" href="#" onclick="postCountries(searchCountryByFullname('${data[i].name.common}'))">
            <img class="flag inverted" src="${data[i].flags.png}" >
          </a>
        </div>
        <div class="cardDetail">
          <h2>${data[i].name.common.substr(0, 52)}</h2>
          <p>Population: <span>${p}</span> </p>
          <p>Region: <span>${data[i].region} </span></p>
          <p>Sub Region: <span>${data[i].subregion} </span></p>
          <p>Capital: <span>${data[i].capital} </span></p>
        </div>
      </div>`;
    }
  } else {
    const p = fancyNumbers(data[0].population.toString());
    let borderBtn = ``; 
    // traversing all countries on the borders of a specific one.   
    let len = 0;
    if(data[0].borders === undefined){
      len = 0;
    } else {
      len = data[0].borders.length;
    }
    for (let j = 0; j < len; j++) { 
      const countryName = getBorderCountryName(data[0].borders[j]);
      borderBtn += `
      <button class="borderBtn" type="button" onclick="getBorderCountry(this, '${data[0].borders[j]}')">${countryName}</button>
      `;
    } // adding some extra details in a full card.
    dataStr = `
    <div class="btndiv"><button class="backbtn" onclick="resetPage()"><i class="fa-solid fa-arrow-left"></i>Back</button></div>
    <div class="fullCard">
      <img class="fullFlag" src="${data[0].flags.png}" >
      <div class="fullDetails">
        <h2>${data[0].name.common}</h2>
        <div class="inFullDetails">
          <div class="leftDetails">
            <p>Official Name: <span>${data[0].name.official}</span> </p>
            <p>Population: <span> ${p} </span></p>
            <p>Region:  <span>${data[0].region}</span> </p>
            <p>Sub Region:  <span>${data[0].subregion}</span> </p>
            <p>Capital:  <span>${data[0].capital}</span> </p>
          </div>
          <div class="rightDetails">
            <p>Top Level Domain:  <span>${data[0].tld}</span> </p>
            <p>Currencies:  <span>${getCurrencies(data[0].currencies)}</span> </p>
            <p>Languages:  <span>${getAll(data[0].languages)}</span></p>
            <p>Area:  <span>${fancyNumbers(data[0].area.toString())}</span> km²</p>
          </div>
        </div>
        <div class="borderBtnDiv"><p>Border Countries: </p> <div><span>${borderBtn}</span></div></div>
      </div>
    </div>`;
  }
  $(".cardContainer").html(dataStr);
}
function getCurrencies(data){
  /* {"HKD": {"name": "Hong Kong dollar","symbol": "$"}} */
  return ((Object.entries(data))[0][1].symbol + ' - ' + (Object.entries(data))[0][1].name);
}
function resetPage() {
  /* const input = document.querySelector('#inputSearch').value;
  if (!input) {
    postCountries(shortListCountriesData);
  } else {
    postCountries(searchCountry(input));
  } */
  document.querySelector('#inputSearch').value = '';
  postCountries(shortListCountriesData);
}


const flags = document.querySelectorAll('.countryFlag');
flags.forEach(flag => {
  if (flag.addEventListener) {
    flag.addEventListener('click', (event) => {
      
      //postCountries();
    });
  } else {
    flag.attachEvent('onclick', () => {
      //postCountries();
    });
  }
});




//Traverse in the objects array of some internal fields of data (currencies + languages).
function getAll(data) {
  let arr = [];
  for (const [key, value] of Object.entries(data)) {
    arr.push(value)
  }
  
  return arr;
}

//search the country on the name.
function searchCountry(searchTerm) {
  var data = [];
  countriesData.map(element => {
    const name = element.name.common.toLocaleLowerCase('en-US');
    if (name.includes(searchTerm.toLocaleLowerCase('en-US'))) {
      data.push(element);
    }
  });
  return data;
}

function searchCountryByFullname(searchTerm) {
  var data = [];
  countriesData.map(element => {
    const name = element.name.common.toLocaleLowerCase('en-US');
    if (name === searchTerm.toLocaleLowerCase('en-US')) {
      data.push(element);
    }
  });
  return data;
}

//country search by continemts or by region.
function searchByRegion(region) {
  var data = [];
  countriesData.map(element => {
    const continent = element.region.toLocaleLowerCase('en-US');
    if (continent.includes(region.toLocaleLowerCase('en-US'))) {
      data.push(element);
    }
  });

  return getRandom(data, numberOfCountries);
}

//function to accept little delay in input box will fetch data after some delay
const debounce = (func, delay = 1000) => {
  let id;
  return (...args)=> {
    if(id) {
      clearTimeout(id);
    }
      id = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
}; 
//targetting the search input and listening the keyup event and posting the search country data.
const onInput = event => {
      event.target.value ? postCountries(searchCountry(event.target.value)) : postCountries(shortListCountriesData);
}
const input = document.querySelector('#inputSearch');
input.addEventListener('input', debounce(onInput, 900));

//targetting the dropdown menu and listening the click event and posting selected regions random countries data.
const regions = document.querySelectorAll('.searchByRegion');
regions.forEach(region => {
  if (region.addEventListener) {
    region.addEventListener('click', (event) => {
      postCountries(searchByRegion(region.innerHTML));
    });
  } else {
    region.attachEvent('onclick', () => {
      postCountries(searchByRegion(region.innerHTML));
    });
  }
});

//Targetting mode link to toggle mode.
const mode = document.querySelector('.changemode');
mode.addEventListener('click', event => {
  mode.innerHTML = mode.innerHTML === 'Dark Mode' ? 'Light Mode' : 'Dark Mode';
  
  let trans = () => { // a smooth little transition while changing mode.
    document.documentElement.classList.add('transition');
    window.setTimeout(() => {
      document.documentElement.classList.remove('transition');
    }, 1000);
  };
  if (mode.innerHTML === 'Dark Mode') { // checking on mode change selection and acting.
    document.querySelector('.fa-moon').classList.remove('far');
    trans();
    document.querySelector('.fa-moon').classList.add('fas');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.querySelector('.fa-moon').classList.remove('fas');
    trans();
    document.querySelector('.fa-moon').classList.add('far');
    document.documentElement.setAttribute('data-theme', 'light');
  }
  
});


// $(".searchByRegion").on("click", function(event) {
//   var arg = $(this).html();
//   console.log(arg);
// });


