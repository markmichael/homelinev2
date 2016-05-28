$(document).ready(function(){

//alphabetize superneighborhoods

var ABCneighborhoods = superneighborhoodData.features.sort(alphabetizeByName);
var ABCNeighborhoodsArray=[];
var ABCNeighborhoodsClasses=[];
var hoodids1=[];
var hoodids2=[];
var ABCZipCodes=[];

//populate superneighborhood list

ABCneighborhoods.forEach(populateList);

//Build maps

var mymap1 = L.map('map1').setView([29.7604, -95.3698], 11);
var mymap2 = L.map('map2').setView([29.7604, -95.3698], 11);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    StyleURL: 'mapbox://styles/mapbox/light-v9',
    id: 'markmichael.06ie3aam',
    accessToken: 'pk.eyJ1IjoibWFya21pY2hhZWwiLCJhIjoiY2lvZnRmZjJzMDE1ZHk1bTJ2N3R5c2R2dSJ9.RzjkEoIrFyW5azBrss-XOA'
}).addTo(mymap1);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    StyleURL: 'mapbox://styles/mapbox/light-v9',
    id: 'markmichael.06ie3aam',
    accessToken: 'pk.eyJ1IjoibWFya21pY2hhZWwiLCJhIjoiY2lvZnRmZjJzMDE1ZHk1bTJ2N3R5c2R2dSJ9.RzjkEoIrFyW5azBrss-XOA'
}).addTo(mymap2);

//add and style geoJSON data
var map1Property="Evictions";
var map2Property="Total Population ";
$(".Censusfeature").html(map2Property+": <span class='censusvalue'></span>");
var maxProp1=maxMapProperty(map1Property);
var maxProp2=maxMapProperty(map2Property);

var layer1= L.geoJson(superneighborhoodData, {style: style1, onEachFeature: onEachFeature});
layer1.addTo(mymap1);
var layer2= L.geoJson(superneighborhoodData, {style: style2, onEachFeature: onEachFeature});
layer2.addTo(mymap2);

//zipcodes.features.map(function(a){a.properties.ACS=zipACS.find(function(b){return a.properties.Name===b.GEO_id2.toString();})});
//console.dir(JSON.stringify(zipcodes));


layer3= L.geoJson(zipcodes, {style: style1});
layer4= L.geoJson(zipcodes, {style: style3});
//change map property

$(".mapproperties > li > a").click(function(){
	map2Property= $(this).text();
	$('.mappropertyselector').html(map2Property+'<span class="glyphicon glyphicon-menu-down"></span>');
	maxProp2=maxMapProperty(map2Property);
	layer2.setStyle(style2);
	$(".Censusfeature").html(map2Property+": <span class='censusvalue'></span>");
});

//search neighborhoods

$("#search").keyup(function(e){
        var q = $("#search").val().toUpperCase().replace(/(\W|\s)/g,"");
        if(q>0){
        	var qString=q.toString();
        	var zipFilter=ABCZipCodes.map(function(a){return a.includes(qString);});
        	var temp=ABCNeighborhoodsClasses.filter(function(a,index){return !zipFilter[index];});

        }
        else{
        var temp=ABCNeighborhoodsClasses.filter(function(a){return !a.includes(q);});  
    }
     $(".hood").show();
    temp.forEach(function(a){$("."+a + ":not(.active)").hide()}); 
    });

//select neighborhood

$(document).on("click", ".hood", function(){
	$(this).addClass("active");
	$(this).siblings().removeClass("active");
	var selectedneighborhood=$(this).text();
	var hoodindex=ABCNeighborhoodsArray.findIndex(function(a){return a === selectedneighborhood});
	mymap1.fitBounds(mymap1._layers[hoodids1[hoodindex]].getBounds(), {padding: [80, 80]});
	mymap2.fitBounds(mymap2._layers[hoodids2[hoodindex]].getBounds(), {padding: [80, 80]});
});

$(".mapbox").mouseleave(function(){
	if($(".hood").hasClass("active")){
	$(".neighborhoodtitle").text($(".hood.active").text());
	var selectedneighborhood=$(".hood.active").text();
	var hoodindex=ABCNeighborhoodsArray.findIndex(function(a){return a === selectedneighborhood});
	$(".Evictions").text(mymap1._layers[hoodids1[hoodindex]].feature.properties.Evictions);
	$(".censusvalue").text(mymap1._layers[hoodids1[hoodindex]].feature.properties[map2Property]);
}

});


//map highlighting
		function highlightFeature(e) {
			var hoodid=e.target._leaflet_id;
			if(e.target._map._leaflet_id===31){
				hoodid-=91;
			}

			mymap1._layers[hoodid].setStyle({
				weight: 1,
				color: '#777'
			})
			mymap2._layers[hoodid+91].setStyle({
				weight: 1,
				color: '#777'
			})

			if (!L.Browser.ie && !L.Browser.opera) {
				mymap1._layers[hoodid].bringToFront();
				mymap2._layers[hoodid+91].bringToFront();
			}

			$(".neighborhoodtitle").text(e.target.feature.properties.Name);
			$(".Evictions").text(e.target.feature.properties.Evictions);
			$(".censusvalue").text(e.target.feature.properties[map2Property]);
		}


		function resetHighlight(e) {
			var hoodid=e.target._leaflet_id;
			if(e.target._map._leaflet_id===31){
				hoodid-=91;
			}
			layer1.resetStyle(mymap1._layers[hoodid]);
			layer2.resetStyle(mymap2._layers[hoodid+91]);
		}

		function zoomToFeature(e) {
			mymap1.fitBounds(e.target.getBounds(), {padding: [80, 80]});
			mymap2.fitBounds(e.target.getBounds(),{padding: [80, 80]});
			var neighborhoodclass= e.target.feature.properties.Name.replace(/(\W|\s)/g,"");
			$(".hood").removeClass('active');
			$("."+neighborhoodclass).addClass('active');
			$(".hood").show();
			var q = $("#search").val().toUpperCase().replace(/(\W|\s)/g,"");
        	var temp=ABCNeighborhoodsClasses.filter(function(a){return !a.includes(q);});
        	temp.forEach(function(a){$("."+a + ":not(.active)").hide()});
		}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}


function populateList(item){
	ABCNeighborhoodsArray.push(item.properties.Name);
	ABCNeighborhoodsClasses.push(item.properties.Name.replace(/(\W|\s)/g,""));
	ABCZipCodes.push(item.properties["Zip Code"]);
	$(".hoodlist").append('<li class="hood list-group-item text-center '+item.properties.Name.replace(/(\W|\s)/g,"") +'">'+item.properties.Name+'</li>');
	hoodids1.push(ABCNeighborhoodsArray.length+32);
	hoodids2.push(ABCNeighborhoodsArray.length+123);

}

function alphabetizeByName(a,b) {
  if (a.properties.Name < b.properties.Name)
    return -1;
  else if (a.properties.Name > b.properties.Name)
    return 1;
  else 
    return 0;
}

function style1(feature) {
	var fOpac=feature.properties[map1Property]/maxProp1
	if(!Boolean(fOpac)){
		fOpac=0;
	}
    return {
        fillColor: '#CF000F',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: fOpac
    };
}

function style2(feature) {
	var fOpac=feature.properties[map2Property]/maxProp2;
    return {
        fillColor: '#19b5fe',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: fOpac
    };    
}
function style3(feature) {
	//var fOpac=feature.properties[map1Property]/maxProp1
    return {
        fillColor: '#CF000F',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 1
    };
}

function maxMapProperty(mapProperty){
	var props=superneighborhoodData.features.map(function(a){return a.properties[mapProperty];});
	return Math.max(...props)*1.25;
}

});