
const now  = moment().format("dddd, MMMM Do, YYYY, h:mm a");
var modalEl = document.querySelector("modal")
var dropdown = document.querySelector('.dropdown');
var hideEl = document.querySelector(".hide")
var dropdownItem = document.querySelectorAll(".dropdown-item");
var historyList = document.querySelector("#history-list");

//display current day and time at top of page
$("#currentDay").text(now)

// updateTime
function updateTime() {
  const now = moment();
  const humanReadable = now.local().format("dddd, MMMM Do YYYY, h:mm A");
  currentDay.textContent = humanReadable;
}
setInterval(updateTime, 60000);
updateTime();

//trigger drop down when button clicked
dropdown.addEventListener('click', function(event) {
  event.stopPropagation();
  dropdown.classList.toggle('is-active');
});

dropdownItem.forEach(element => {
    element.addEventListener("click", function(event) {
        dropdownItem.forEach(dropEl =>  dropEl.classList.remove("is-active"))
        element.classList.add('is-active');
    })  
})

var citySearch = function () {
    event.preventDefault();
    var city = cityName.value.trim();

    // check if the name is good
    if (city) {
        //send to the getData() function
        getData(city);
        cityName.value = "";
    } else {
        alert("Please enter an ACTUAL city name.");
        //modalEl.classList.add("is-active")
    }
};

var getData = function (city, state) {

    // format the url
    var apiUrl = "https://gnews.io/api/v3/search?q=" + city + state + "&image=required&token=6239b8aeaa278adf5c3b7cc28b4fba9b";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            // send the parsed JSON data to displayNewsData() function
            response.json().then(function (data) {
                displayNewsData(data, city);
            });
        } else {
            hideEl.classList.remove("hide")
            alert("Error: " + response.statusText);
        };
    });
};

// function to display information to page
var displayNewsData = function (data, city) {

    for (var i = 0; i < 3; i++) {
     //set news array and for loop to retrieve data
    
    const nameOfCity = city;
    const dataArticle = data.articles[i].title;
    const dataUrl = data.articles[i].url;
    const dataImage = data.articles[i].image;

    var nameOfCityHtml = document.querySelector("#newsCityTitle");
    var dataArticleHtml = document.getElementById("title" + i);
    var dataUrlHtml = document.getElementById("url" + i);
    var dataImageHtml = document.getElementById("image" + i);

    hideEl.classList.remove("hide")
    nameOfCityHtml.innerHTML = "News from " + nameOfCity;
    dataArticleHtml.innerHTML = dataArticle;
    dataUrlHtml.setAttribute("href", dataUrl);
    dataUrlHtml.innerHTML = "Click Here to Read More";
    dataImageHtml.setAttribute('src', dataImage);
    }
};

// variable to hold the previous searches
var prevSearches = [];

// function to save previous searches
var savePrevSearches = function() {
  localStorage.setItem("prevSearches", JSON.stringify(prevSearches));
};

// function to load previous searches to the page
var loadPrevSearches = function() {
  
  // retrieve previous searches from localstorage
  prevSearches = localStorage.getItem("prevSearches");
  if (prevSearches === null) {
    prevSearches = [];
    return false;
  }
  prevSearches = JSON.parse(prevSearches);

  // loop through array and create buttons for previous searches
  for (var i = 0; i < prevSearches.length; i++) {
    // creates a button with the city's name
    var cityBtn = document.createElement("button");
    cityBtn.setAttribute("type", "button");
    cityBtn.setAttribute("id", prevSearches[i]);
    cityBtn.setAttribute("class", "buttons")
    cityBtn.textContent = prevSearches[i];
    historyList.appendChild(cityBtn);
  };

};

// function to create a button for previous searches
var previousSearchBtn = function(city) {
  // creates a button with the city's name
  var cityBtn = document.createElement("button");
  cityBtn.setAttribute("type", "button");
  cityBtn.setAttribute("id", city);
  cityBtn.setAttribute("class", "buttons")
  cityBtn.textContent = city;
  historyList.appendChild(cityBtn);
};

// function to handle previousSeachBtn clicks
var previousSeachBtnHandler = function(event) {
  // get button's id and sends that to getData()
  var citySearch = event.target.getAttribute("id");
  getData(citySearch);
};


// function map set
function initMap() {
    var map = new google.maps.Map(document.getElementById("map"), {
      center: {  lat: 36.1627, lng: -86.7816 },
      zoom: 13
    });
  
    var input = document.getElementById("pac-input");
  
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);
  
    // Specify just the place data fields that you need.
    autocomplete.setFields(["place_id", "geometry", "name"]);
  
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById("infowindow-content");
    infowindow.setContent(infowindowContent);
  
    var marker = new google.maps.Marker({ map: map });
  
    autocomplete.addListener("place_changed", function() {
      infowindow.close();
  
      var place = autocomplete.getPlace();
  
      if (!place.geometry) {
        return;
      }
  
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
  
      // Set the position of the marker using the place ID and location.
      marker.setPlace({
        placeId: place.place_id,
        location: place.geometry.location
      });
  
      marker.setVisible(true);
    
    var exactLoc1 = input.value.split(",")[0];
    var exactLoc2 = input.value.split(",")[1];

    getData(exactLoc1, exactLoc2);
    prevSearches.push(place.name);
    previousSearchBtn(place.name);
    savePrevSearches();
    });
};

historyList.addEventListener("click", previousSeachBtnHandler);
loadPrevSearches();