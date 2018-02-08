/**********************************************
            web app - searching box
**********************************************/


var searchBox, searchBoxSelect, searchBoxSelect, sbRangeInput, sbRange, placeLocation, dataList;

searchBox = document.getElementsByClassName('search-box')[0];
searchBoxSelect = document.getElementsByClassName('search-box-select')[0];
searchBoxInput = document.getElementsByClassName('search-box-input')[0];
sbInput = document.getElementsByClassName('sb-input')[0];
placeLocation = document.getElementsByClassName('place-location')[0];
require = document.getElementsByClassName('require');
alertMessage = document.getElementsByClassName('alert-message');
sbRangeInput = document.getElementsByClassName('sb-range-input')[0];
sbRange = document.getElementsByClassName('sb-range')[0];
sbSubmit = document.getElementsByClassName('sb-submit')[0];
dataList = document.getElementsByClassName('data-list')[0];



// search box select - show / hide

searchBoxInput.addEventListener('click', searchBoxSelectShowHide);

function searchBoxSelectShowHide() {
    searchBoxSelect.classList.toggle('hide');
}



// get selected item

searchBox.addEventListener('click', getSelectedItem);

function getSelectedItem(e) {
    var selectedItemValue;

    selectedItemValue = e.target.innerText;

    if (e.target.tagName === 'A') {
        sbInput.value = selectedItemValue;
        searchBoxSelect.classList.add('hide');
    }
}



// get range value

sbRange.addEventListener('change', getRangeValue);

function getRangeValue() {
    sbRangeInput.value = sbRange.value;
    sbRangeInput.nextElementSibling.style.display = "none";
}

// max range value

sbRangeInput.addEventListener('keyup', maxRangeValue);

function maxRangeValue() {
    if (sbRangeInput.value > 2000) {
        sbRangeInput.value = 2000;
    }
    sbRange.value = sbRangeInput.value;
}



// search box input

searchBoxSelect.addEventListener('click', sbInputAlertMessageHide);

function sbInputAlertMessageHide(e) {
    if (e.target.tagName === 'A') {
        sbInput.nextElementSibling.style.display = 'none';
    }
}

// search box location

placeLocation.addEventListener('keyup', slLocationAlertMessageHide);

function slLocationAlertMessageHide() {
    if (this.value !== '') {
        this.nextElementSibling.style.display = 'none';
    }
}

// search box range

sbRangeInput.addEventListener('keyup', sbRangeAlertMessageHide);

function sbRangeAlertMessageHide() {
    if (this.value !== '') {
        this.nextElementSibling.style.display = 'none';
    }
}



// validation alert message 

function sbInputAlertMessageShow() {
    if (sbInput.value === '') {
        sbInput.nextElementSibling.style.display = 'block';
    } else {
        sbInput.nextElementSibling.style.display = 'none';
    }
}

function plAlertMessageShow() {
    if (placeLocation.value === '') {
        placeLocation.nextElementSibling.style.display = 'block';
    } else {
        placeLocation.nextElementSibling.style.display = 'none';
    }
}

function sbRangeAlertMessageShow() {
    var regEx = /[a-zA-Z-+\,./'!@#$%^&*=]+/;
    if (sbRangeInput.value.match(regEx) || sbRangeInput.value === '') {
        sbRangeInput.nextElementSibling.style.display = 'block';
    } else {
        sbRangeInput.nextElementSibling.style.display = 'none';
    }
}



/************************************************
             get location coordinate
************************************************/

function getLocationCoordinate(address) {
    var position = {};
    $.ajax({
        url: 'http://maps.google.com/maps/api/geocode/json',
        type: 'GET',
        data: {
            address: address,
            sensor: false
        },
        cache: true,
        async: false,
        dataType: "json",
        success: function (result) {
            try {
                position.lat = result.results[0].geometry.location.lat;
                position.lng = result.results[0].geometry.location.lng;
            } catch (err) {
                placeLocation.nextElementSibling.style.display = 'block';
                return;
            }
        }
    });
    return position;
}


/************************************************
             get data from foursquare
************************************************/

function getData(e) {
    e.preventDefault();

    // validation alert message
    sbInputAlertMessageShow();
    plAlertMessageShow();
    sbRangeAlertMessageShow();

    // form validation 
    if (sbInput.value === '' || placeLocation.value === '') {
        return;
    } else {

        var posLat, posLng, url;

        // add coordinations
        posLat = getLocationCoordinate(placeLocation.value).lat;
        posLng = getLocationCoordinate(placeLocation.value).lng;

        url = "https://api.foursquare.com/v2/venues/search?&categoryId=4d4b7105d754a06376d81259&radius=" + sbRangeInput.value + "&client_id=2TC0GHMY3FTKAY5Y3WSXWTYUT3EY0CL11DOTPSD5BELKYDVU&client_secret=ISIT3PFVCZORCQA0J3YGFOJOQ1C3GUZPUDFUKL3LKGRR4O5N&v=20170117&ll=" + posLat + "," + posLng + "";


        // get data and build table
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);

        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

                var data, list, listKeys;

                data = JSON.parse(this.responseText);
                data = data.response.venues;

                listKeys = ['Name', 'Category', 'Address', 'Distance'];

                list = '';
                list += '<table>';
                list += '<thead>';
                list += '<tr>';

                for (var i = 0; i < listKeys.length; i++) {
                    list += '<th>' + listKeys[i] + '</th>';
                    dataList.innerHTML = list;
                }
                list += '</tr>';
                list += '</thead>';
                list += '<tbody>';

                for (var i in data) {
                    list += '<tr><td>' + data[i].name + '</td><td>' + data[i].categories[0].name + '</td><td>' + data[i].location.address + '</td><td>' + data[i].location.distance + '</td></tr>';
                }
                list += '</tbody>';
                list += '</table>';

                dataList.innerHTML = list;
            }
        }
        xhr.send();
    }
}


//// get data from foursquare - trigger ////
sbSubmit.addEventListener('click', getData);
