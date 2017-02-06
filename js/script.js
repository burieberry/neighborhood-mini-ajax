$('body').append('<img class="bgimg">');

function loadData() {
    'use strict';

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // set address to submitted values
    var street = $('#street').val();
    var city = $('#city').val();

    // capitalize first letter of each word
    function capitalize(str) {
        'use strict';
        var strArray = str.split(' ');
        for (var i = 0; i < strArray.length; i++) {
            strArray[i] = strArray[i].charAt(0).toUpperCase() +
            strArray[i].slice(1);
        }
        return strArray.join(' ');
    }

    street = capitalize(street);
    city = capitalize(city);
    var address = street + ', ' + city;


    // load streetview
    var streetviewURL =
        'http://maps.googleapis.com/maps/api/streetview?size=600x400&location='
        + address;

    $('img').attr('src', streetviewURL);


    // load NY Times API
    var nytURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    nytURL += '?' + $.param({
        'api-key': "749809271ece406b8ca7ef5418aabb5e",
        'q': city,
        'sort': "newest"
    });

    $.getJSON(nytURL, function(data) {
        $nytHeaderElem.text('New York Times Articles About ' + city);

        $.each(data.response.docs, function(key, val) {
            $nytElem.append('<li class="article"><a href="' +
                val.web_url + '" target="_blank">' +
                val.headline.main + '</a><p>' +
                val.lead_paragraph + '</p></li>');
        });
    }).fail(function(error) {
            $nytHeaderElem.text('New York Times Articles Can Not Be Loaded.');
    });


    // Wikipedia error handling
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text('Failed to get Wikipedia resources.');
    }, 8000);

    // load Wikipedia API using JSON-P
    var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
                    city + '&limit=10&format=json&callback=?';
    $.ajax({
        url: wikiURL,
        dataType: 'jsonp'
    }).done(function(result) {
        $.each(result[1], function(key, val) {
            var url = 'https://en.wikipedia.org/wiki/' + val;
            $wikiElem.append('<li><a href="' + url +
                '" target="_blank">' + val + '</li>');
        });
    });

    return false;
};

$('#form-container').submit(loadData);
