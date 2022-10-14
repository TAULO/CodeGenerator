/*global google, $, Modernizr,googlecode_property_vars,map,jQuery,mapfunctions_vars,L,curent_gview_lat,curent_gview_long,googlecode_regular_vars,wprentals_google_map_cluster, mapbase_vars,wprentals_map_type,InfoBox, window, alert, setTimeout,*/

wprentals_map_type  =   parseInt(mapbase_vars.wprentals_map_type);

var lealet_map_move_on_hover    =   0;
var propertyMarker_submit       =   '';
var leaflet_map_move_flag       =   0;




function wprentals_map_general_start_map(page_map){
    "use strict";
    var zoom_level;
    if(page_map=='prop'){
        zoom_level=parseInt(googlecode_property_vars.page_custom_zoom, 10);
    }else{
        zoom_level=parseInt(googlecode_regular_vars.page_custom_zoom, 10);
    }

    if(wprentals_map_type===1){
        wprentals_google_start_map(zoom_level);
    }else if(wprentals_map_type===2){
        wprentals_leaflet_start_map(zoom_level);
    }else if(wprentals_map_type===3){

    }
}




function wprentals_map_general_set_markers(map, markers){
    "use strict";
    wprentals_google_setMarkers2(map, markers);
}

function wprentals_map_general_cluster(){
    "use strict";
    if(wprentals_map_type===1){
        wprentals_google_map_cluster();
    }else if(wprentals_map_type===2){
        wprentals_leaflet_map_cluster();
    }else if(wprentals_map_type===3){

    }

}

function  wprentals_leaflet_map_cluster(){
    "use strict";
    map.addLayer(markers_cluster);
}


function wprentals_map_general_fit_to_bounds(){
     "use strict";
    if(wprentals_map_type===1){
        wprentals_google_fit_to_bounds();
    }else if(wprentals_map_type===2){
        wprentals_leaflet_fit_to_bounds();
    }else if(wprentals_map_type===3){

    }

}



function wprentals_map_general_map_pan_move(){
     "use strict";
    if(wprentals_map_type===1){
        wprentals_google_map_pan_move();
    }else if(wprentals_map_type===2){
        wprentals_leaflet_map_pan_move();
    }else if(wprentals_map_type===3){

    }


}

function wprentals_leaflet_start_map(zoom_level){
     "use strict";
    if (typeof(curent_gview_long)==='undefined' || curent_gview_lat === '' || curent_gview_long === '0') {
        if( typeof(googlecode_property_vars)!=='undefined' ){
            curent_gview_lat = googlecode_property_vars.general_latitude;
        }

        if( typeof(googlecode_regular_vars)!=='undefined' ){
            curent_gview_lat = googlecode_regular_vars.general_latitude;
        }
    }

    if ( typeof(curent_gview_long)==='undefined' || curent_gview_long === '' || curent_gview_long === '0') {
        if( typeof(googlecode_property_vars)!=='undefined' ){
            curent_gview_long = googlecode_property_vars.general_longitude;
        }
        if( typeof(googlecode_regular_vars)!=='undefined' ){
            curent_gview_long = googlecode_regular_vars.general_longitude;
        }
    }

    var mapCenter = L.latLng( curent_gview_lat,curent_gview_long );

    if (document.getElementById('googleMap')) {

        if(map) {
            map.remove();
        }


        map =  L.map( 'googleMap',{
            center: mapCenter,
            zoom: zoom_level,

        }).on('load', function(e) {
            jQuery('#gmap-loading').remove();
        });

    } else if (document.getElementById('google_map_prop_list')) {
        map =  L.map( 'google_map_prop_list',{
            center: mapCenter,
            zoom: zoom_level
        }).on('load', function(e) {
            jQuery('#gmap-loading').remove();
        });

    }else  if (document.getElementById('google_map_on_list')) {
        map =  L.map( 'google_map_on_list',{
            center: mapCenter,
            zoom: zoom_level
        }).on('load', function(e) {
            jQuery('#gmap-loading').remove();
        });
        map_intern = 1;
    }




    var tileLayer =  wprentals_open_stret_tile_details();
    map.addLayer( tileLayer );

    map.scrollWheelZoom.disable();
    if ( Modernizr.mq('only all and (max-width: 768px)') ) {
        map.dragging.disable();
    }
   // map.touchZoom.disable();



    map.on('popupopen', function(e) {

        lealet_map_move_on_hover=1;

        if( jQuery('#google_map_prop_list_wrapper').length==0 ){
            var px = map.project(e.popup._latlng); // find the pixel location on the map where the popup anchor is
            if( mapfunctions_vars.useprice === 'yes' ){
               px.y -= 115; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
            }else{
                px.y -= 320/2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
            }
            map.panTo(map.unproject(px),{animate: true}); // pan to new center
        }

        lealet_map_move_on_hover=1;
    });


    map.on('load', function(e) {
        jQuery('#gmap-loading').remove();
    });

    if ( Modernizr.mq('only all and (max-width: 768px)') ) {
        map.on('dblclick ', function(e) {
            if (map.dragging.enabled()) {
                 map.dragging.disable();
            }else{
                map.dragging.enable();
            }
        });
    }


    markers_cluster=L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
            return L.divIcon({ html: '<div class="leaflet_cluster" style="background-image: url('+images['cloud_pin']+')">' + cluster.getChildCount() + '</div>' });
	},
    });

}





function wprentals_open_stret_tile_details(){
      "use strict";

    if( mapbase_vars.wp_estate_mapbox_api_key==='' ){
        var tileLayer = L.tileLayer(  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        } );

    }else{
        var tileLayer = L.tileLayer( 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token='+mapbase_vars.wp_estate_mapbox_api_key, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'your.mapbox.access.token'
            }
        );
    }
    return tileLayer;
}







function wprentals_google_start_map(zoom_level){
     "use strict";
    var mapOptions, styles;

    if (typeof(curent_gview_long)==='undefined' || curent_gview_lat === ''  || curent_gview_lat === '0') {
        if( typeof(googlecode_property_vars)!=='undefined' ){
            curent_gview_lat = googlecode_property_vars.general_latitude;
        }

        if( typeof(googlecode_regular_vars)!=='undefined' ){
            curent_gview_lat = googlecode_regular_vars.general_latitude;
        }
    }

    if ( typeof(curent_gview_long)==='undefined' || curent_gview_long === '' || curent_gview_long === '0') {
        if( typeof(googlecode_property_vars)!=='undefined' ){
            curent_gview_long = googlecode_property_vars.general_longitude;
        }
        if( typeof(googlecode_regular_vars)!=='undefined' ){
            curent_gview_long = googlecode_regular_vars.general_longitude;
        }
    }



    mapOptions = {
        flat: false,
        noClear: false,
        zoom: zoom_level,
        scrollwheel: false,
        draggable: true,
        maxZoom:18,
        center: new google.maps.LatLng(curent_gview_lat, curent_gview_long),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP]
        },
        disableDefaultUI: true,
        gestureHandling: 'cooperative'

    };




    if (document.getElementById('googleMap')) {
        map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
    } else if (document.getElementById('google_map_prop_list')) {
        mapOptions['minZoom']=4;

        map = new google.maps.Map(document.getElementById('google_map_prop_list'), mapOptions);
    } else if (document.getElementById('google_map_on_list')) {
        map = new google.maps.Map(document.getElementById('google_map_on_list'), mapOptions);
        map_intern = 1;
    } else {
        return;
    }
    bounds_list = new google.maps.LatLngBounds();
    google.maps.visualRefresh = true;

    if (mapfunctions_vars.map_style !== '') {
        styles = JSON.parse(mapfunctions_vars.map_style);
        map.setOptions({styles: styles});
    }

    if(typeof(map_style_shortcode) !=='undefined' && map_style_shortcode !==''){
        styles = (map_style_shortcode );
        map.setOptions({styles: styles});
    }

    google.maps.event.addListener(map, 'tilesloaded', function () {

        jQuery('#gmap-loading').remove();
    });

     google.maps.event.addListener(map, 'tilesloaded', function () {

        jQuery('#gmap-loading').remove();
    });

    if (Modernizr.mq('only all and (max-width: 1025px)')) {
        map.setOptions({'draggable': false});
    }

    if ( document.getElementById('googleMap') ) {
        google.maps.event.addDomListener(document.getElementById('googleMap'), 'mousewheel', scrollwhel);
        google.maps.event.addDomListener(document.getElementById('googleMap'), 'DOMMouseScroll', scrollwhel);
    }
    if ( document.getElementById('google_map_prop_list') ) {
        google.maps.event.addDomListener(document.getElementById('google_map_prop_list'), 'mousewheel', scrollwhel);
        google.maps.event.addDomListener(document.getElementById('google_map_prop_list'), 'DOMMouseScroll', scrollwhel);
    }

    function scrollwhel(event) {

        if (map.scrollwheel === true) {
            event.stopPropagation();
        }


    }

}

function wprentals_leaflet_fit_to_bounds(){
    "use strict";
    if ( typeof(bounds_list)!='undefined' && bounds_list.isValid()) {
        if(mapfunctions_vars.bypass_fit_bounds!=='1'){
            wpestate_fit_bounds_leaflet(bounds_list);
        }
    }else{
        wpestate_fit_bounds_nolsit_leaflet();
    }

}







function wprentals_google_fit_to_bounds(){
     "use strict";
    if (document.getElementById('google_map_prop_list')) {

        if (!bounds_list.isEmpty()) {
            if(mapfunctions_vars.bypass_fit_bounds!=='1'){
                wpestate_fit_bounds(bounds_list);
            }
        }else{
            wpestate_fit_bounds_nolsit();
        }
    }else if (document.getElementById('googleMap')) {

        if (!bounds_list.isEmpty()) {
            if(mapfunctions_vars.bypass_fit_bounds!=='1'){
                wpestate_fit_bounds(bounds_list);
            }
        }else{
            wpestate_fit_bounds_nolsit();
        }

    }
}

function wprentals_map_general_spiderfy(){
     "use strict";
    if(wprentals_map_type===1){
        oms = new OverlappingMarkerSpiderfier(map, {markersWontMove: true, markersWontHide: true, keepSpiderfied: true, legWeight: 3});
        setOms(gmarkers);
    }else if(wprentals_map_type===2){
        // no school no job no problem
    }else if(wprentals_map_type===3){

    }
}


function wprentals_leaflet_map_pan_move(){
     "use strict";
    if (googlecode_regular_vars.on_demand_pins==='yes' && mapfunctions_vars.is_tax!=1 && mapfunctions_vars.is_property_list==='1'){
        map.on('moveend', function(e) {
            wpestate_ondenamd_map_moved_leaflet();
        });

    }
}









function wprentals_google_map_pan_move(){
     "use strict";
    if (googlecode_regular_vars.on_demand_pins==='yes' && mapfunctions_vars.is_tax!=1 && mapfunctions_vars.is_property_list==='1'){
        map.addListener('idle', function() {
            wpestate_ondenamd_map_moved();
        });
    }
}





function wprentals_google_setMarkers2 (map, locations){
     "use strict";
    var selected_id = parseInt(jQuery('#gmap_wrapper').attr('data-post_id'), 10);
    if (isNaN(selected_id)) {
        selected_id = parseInt(jQuery('#google_map_on_list').attr('data-post_id'), 10);
    }

    var open_height     = parseInt(mapfunctions_vars.open_height, 10);
    var closed_height   = parseInt(mapfunctions_vars.closed_height, 10);

    var width_browser   = jQuery(window).width();

    infobox_width = 700;
    vertical_pan = -215;
    if (width_browser < 900) {
        infobox_width = 500;
    }
    if (width_browser < 600) {
        infobox_width = 400;
    }
    if (width_browser < 400) {
        infobox_width = 200;
    }

    var i;
     for (i = 0; i < locations.length; i++) {

        var beach                       = locations[i];
        var id                          = beach[10];
        var lat                         = beach[1];
        var lng                         = beach[2];
        var title                       = decodeURIComponent(beach[0]);
        var pin                         = beach[8];
        var counter                     = beach[3];
        var image                       = decodeURIComponent(beach[4]);
        var price                       = decodeURIComponent(beach[5]);
        var single_first_type           = decodeURIComponent(beach[6]);
        var single_first_action         = decodeURIComponent(beach[7]);
        var link                        = decodeURIComponent(beach[9]);
        var city                        = decodeURIComponent(beach[11]);
        var area                        = decodeURIComponent(beach[12]);
        var cleanprice                  = beach[13];
        var rooms                       = beach[14];
        var baths                       = beach[15];
        var size                        = beach[16];
        var single_first_type_name      = decodeURIComponent(beach[17]);
        var single_first_action_name    = decodeURIComponent(beach[18]);
        var status                      = decodeURIComponent(beach[19]);
        var pin_price                   =   decodeURIComponent ( beach[20] );
        var custom_info                 =   decodeURIComponent ( beach[21] );

        if (selected_id === id) {
            found_id = i;
        }

        if(wprentals_map_type===1){
            wprentals_createMarker_google(pin_price,infobox_width ,size, i, id, lat, lng, pin, title, counter, image, price, single_first_type, single_first_action, link, city, area, rooms, baths, cleanprice,  single_first_type_name, single_first_action_name,status,custom_info);
        }else if(wprentals_map_type===2){
            wprentals_createMarker_leaflet(pin_price,infobox_width ,size, i, id, lat, lng, pin, title, counter, image, price, single_first_type, single_first_action, link, city, area, rooms, baths, cleanprice,  single_first_type_name, single_first_action_name,status,custom_info);

        }else if(wprentals_map_type===3){

        }

    }

}

function wprentals_createMarker_google(pin_price,infobox_width, size, i, id, lat, lng, pin, title, counter, image, price, single_first_type, single_first_action, link, city, area, rooms, baths, cleanprice,   single_first_type_name, single_first_action_name,status,custom_info) {
    "use strict";
    var marker, myLatLng;
    var Titlex          =   jQuery('<textarea />').html(title).text();
    var infobox_class   =   "";
    var poss            =   0;
    var boxText         =   document.createElement("div");
    var myOptions = {
        content: boxText,
        disableAutoPan: true,
        maxWidth: infobox_width,
        boxClass: "mybox",
        zIndex: null,
        closeBoxMargin: "-13px 0px 0px 0px",
        closeBoxURL: "",
        infoBoxClearance: new google.maps.Size(1, 1),
        isHidden: false,
        pane: "floatPane",
        enableEventPropagation: false
    };
    infoBox = new InfoBox(myOptions);


    myLatLng = new google.maps.LatLng(lat, lng);
    if(mapfunctions_vars.useprice === 'yes' && mapfunctions_vars.hidden_map  ){
        infobox_class=" pin_price_info ";
        var myLatlng = new google.maps.LatLng(lat,lng);
        marker= new WpstateMarker(
            area,
            city,
            pin_price,
            poss,
            myLatlng,
            map,
            Titlex,
            counter,
            image,
            id,
            price,
            single_first_type,
            single_first_action,
            link,
            i,
            rooms,
            baths,
            cleanprice,
            size,
            single_first_type_name,
            single_first_action_name,
            pin,
            custom_info

        );

    }else{
        infobox_class=" classic_info ";
            marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                icon: custompin(pin),
                custompin: pin,
                shape: shape,
                title: title,
                zIndex: counter,
                image: image,
                idul: id,
                price: price,
                category: single_first_type,
                action: single_first_action,
                link: link,
                city: city,
                area: area,
                infoWindowIndex: i,
                rooms: rooms,
                guest_no: baths,
                cleanprice: cleanprice,
                size: size,
                category_name: single_first_type_name,
                action_name: single_first_action_name,
                status:status,
                custom_info:custom_info
            });

    }

    gmarkers.push(marker);


    if (typeof (bounds_list) !== "undefined") {

        bounds_list.extend(marker.getPosition());
    }


    google.maps.event.addListener(marker, 'click', function (event) {


        var title, info_image, category, action, category_name, action_name, in_type, infoguest, inforooms,  vertical_off, status_html,status;
        wpestate_new_open_close_map(1);
        external_action_ondemand=1;

        if (this.image === '') {
            info_image =  mapfunctions_vars.path + '/idxdefault.jpg';
        } else {
            info_image = this.image;
        }




        if ( typeof(this.status)!='undefined'){
            if( this.status.indexOf('%')!==-1 ){
                status = this.status;
            }else{
                status = decodeURIComponent(this.status.replace(/-/g, ' '));
            }
        }else{
            status='';
        }



        category        = decodeURIComponent(this.category.replace(/-/g, ' '));
        action          = decodeURIComponent(this.action.replace(/-/g, ' '));
        category_name   = decodeURIComponent(this.category_name.replace(/-/g, ' '));
        action_name     = decodeURIComponent(this.action_name.replace(/-/g, ' '));

        status_html=wpestate_display_status(status);


        in_type = mapfunctions_vars.in_text;
        if (category === '' || action === '') {
            in_type = " ";
        }
        in_type = " / ";

        if (this.guest_no !== '' &&  this.guest_no !== '0' && this.guest_no !== 0 ) {
            infoguest = '<span id="infoguest">' + this.guest_no + '</span>';
        } else {
            infoguest = '';
        }

        if (this.rooms !== '') {
            inforooms = '<span id="inforoom">' + this.rooms + '</span>';
        } else {
            inforooms = '';
        }

        title = this.title.toString();




        if( this.custom_info!=='undefined'){
            var custom_array=this.custom_info.split(',');
            inforooms = '<span id="inforoom" class="custom_infobox_icon"><i class="' + custom_array[0] + '"></i>' + custom_array[1] + '</span>';
            infoguest = '<span id="infoguest" class="custom_infobox_icon"><i class="' + custom_array[2] + '"></i>' + custom_array[3] + '</span>';

        }



        infoBox.setContent('<div class="info_details '+infobox_class+' "><span id="infocloser" onClick=\'javascript:infoBox.close();\' ></span>'+status_html+'<a href="' + this.link + '"><div class="infogradient"></div><div class="infoimage" style="background-image:url(' + info_image + ')"  ></div></a><a href="' + this.link + '" id="infobox_title"> ' + title + '</a><div class="prop_detailsx">' + category_name + " " + in_type + " " + action_name + '</div><div class="infodetails">' + infoguest + inforooms + '</div><div class="prop_pricex">' + this.price + '</div></div>');

        if( mapfunctions_vars.hidden_map ){
            infoBox.open(map, this);
        }

        map.setCenter(this.position);

        switch (infobox_width) {
            case 700:
                if (!document.getElementById('google_map_on_list')) {
                    if (mapfunctions_vars.listing_map === 'top') {
                        if( document.getElementById('google_map_prop_list') ){
                            map.panBy(0, -100);

                        }else{

                            map.panBy(100, -100);
                        }
                    } else {
                        map.panBy(10, -110);
                    }
                } else {
                    if( mapfunctions_vars.hidden_map ){
                        map.panBy(0, -160);
                    }
                }
                vertical_off = 0;
                break;
            case 500:
                if( document.getElementById('google_map_prop_list') ){
                    map.panBy(50, -120);
                }else{
                    map.panBy(50, -150);
                }
                break;
            case 400:

                if( document.getElementById('google_map_prop_list') ){
                     map.panBy(100, -220);
                }else{
                    map.panBy(0, -150);
                }
                break;
            case 200:
                map.panBy(20, -170);
                break;
        }






        if (control_vars.show_adv_search_map_close === 'no') {
            $('.search_wrapper').addClass('adv1_close');
            adv_search_click();
        }
        wpestate_close_adv_search();
    });/////////////////////////////////// end event listener

    if (mapfunctions_vars.generated_pins !== '0') {
        if(map_is_pan===0){
            wpestate_pan_to_last_pin(myLatLng);
        }
        map_is_pan=1;
    }
}

function wprentals_createMarker_leaflet(pin_price,infobox_width, size, i, id, lat, lng, pin, title, counter, image, price, single_first_type, single_first_action, link, city, area, rooms, guest_no, cleanprice,   single_first_type_name, single_first_action_name,status,custom_info) {
    "use strict";

    var infoboxWrapper = document.createElement( "div" );
    infoboxWrapper.className = 'leafinfobox-wrapper';
    var infobox = "";

    var infobox_class=" classic_info ";
    if( mapfunctions_vars.useprice === 'yes' ){
        infobox_class =' openstreet_map_price_infobox ';
    }

    if ( typeof(status)!='undefined'){
        if( status.indexOf('%')!==-1 ){

        }else{
            status = decodeURIComponent(status.replace(/-/g, ' '));
        }
    }else{
        status='';
    }


    var status_html=wpestate_display_status(status);


    var info_image='';
    if (image === '') {
        info_image =  mapfunctions_vars.path + '/idxdefault.jpg';
    } else {
        info_image = image;
    }

    var category        = decodeURIComponent(single_first_type.replace(/-/g, ' '));
    var action          = decodeURIComponent(single_first_action.replace(/-/g, ' '));
    var category_name   = decodeURIComponent(single_first_type_name.replace(/-/g, ' '));
    var action_name     = decodeURIComponent(single_first_action_name.replace(/-/g, ' '));

    var in_type = mapfunctions_vars.in_text;
    if (category === '' || action === '') {
        in_type = " ";
    }
    in_type = " / ";
    var  infoguest,inforooms;

    if (guest_no !== '') {
        infoguest = '<span id="infoguest">' + guest_no + '</span>';
    } else {
        infoguest = '';
    }

    if (rooms !== '') {
        inforooms = '<span id="inforoom">' + rooms + '</span>';
    } else {
        inforooms = '';
    }

    title = title.toString();

    if( custom_info!=='undefined'){
        var custom_array=custom_info.split(',');
        inforooms = '<span id="inforoom" class="custom_infobox_icon"><i class="' + custom_array[0] + '"></i>' + custom_array[1] + '</span>';
        infoguest = '<span id="infoguest" class="custom_infobox_icon"><i class="' + custom_array[2] + '"></i>' + custom_array[3] + '</span>';
    }
    infobox += '<div class="info_details '+infobox_class+' "><a id="infocloser" onClick=\'javascript:jQuery(".leaflet-popup-close-button")[0].click();\' ></a>'+status_html+'<a href="' + link + '"><div class="infogradient"></div><div class="infoimage" style="background-image:url(' + info_image + ')"  ></div></a><a href="' + link + '" id="infobox_title"> ' + title + '</a><div class="prop_detailsx">' + category_name + " " + in_type + " " + action_name + '</div><div class="infodetails">' + infoguest + inforooms + '</div><div class="prop_pricex">' + price + '</div></div>';

    var    markerOptions = {
        riseOnHover: true
    };

    var markerCenter    =   L.latLng( lat, lng );
    var propertyMarker  =   '';


    if( !mapfunctions_vars.hidden_map ){
        propertyMarker = L.circle(markerCenter, {
            color: 'red',
            fillColor: '#b881fc',
            fillOpacity: 0.4,
            strokeWeight: 0.4,
            radius: 120


        });

    }else{


        if( mapfunctions_vars.useprice === 'yes' ){
            var price_pin_class= 'wpestate_marker openstreet_price_marker '+wpestate_makeSafeForCSS(single_first_type_name.trim() )+' '+wpestate_makeSafeForCSS(single_first_action_name.trim());

            var pin_price_marker = '<div class="'+price_pin_class+'">';
            if (typeof(price) !== 'undefined') {
                if( mapfunctions_vars.use_price_pins_full_price==='no'){
                    pin_price_marker +='<div class="interior_pin_price">'+pin_price+'</div>';
                }else{
                    pin_price_marker +='<div class="interior_pin_price">'+price+'</div>';
                }
            }
            pin_price_marker += '</div>';

            var myIcon = L.divIcon({
                className:'someclass',
                iconSize: new L.Point(0, 0),
                html: pin_price_marker
            });
            propertyMarker  = L.marker( markerCenter, {icon: myIcon} );

        }else{
            var markerImage     = {
                iconUrl: wprentals_custompin_leaflet(pin),
                iconSize: [44, 50],
                iconAnchor: [20, 50],
                popupAnchor: [1, -50]
            };
            markerOptions.icon  = L.icon( markerImage );
            propertyMarker      = L.marker( markerCenter, markerOptions );
        }


    }


    propertyMarker.idul =   id;
    propertyMarker.pin  =   pin;

    if (mapfunctions_vars.user_cluster === 'yes') {
        markers_cluster.addLayer(propertyMarker);
    }else{
        propertyMarker.addTo( map );
    }

    gmarkers.push(propertyMarker);

    if (typeof (bounds_list) !== "undefined") {
        bounds_list.extend(propertyMarker.getLatLng());
    }else{
         bounds_list = L.latLngBounds( propertyMarker.getLatLng(),propertyMarker.getLatLng() );
    }

    infoboxWrapper.innerHTML = infobox;
    propertyMarker.bindPopup( infobox );


    if (mapfunctions_vars.generated_pins !== '0') {
        if(map_is_pan===0){
            wpestate_pan_to_last_pin(markerCenter);
        }
        map_is_pan=1;
    }



}

function wprentals_custompinchild_leaflet(image) {
    "use strict";
    var custom_img;
    var extension='';
    var ratio = jQuery(window).dense('devicePixelRatio');

    if(ratio>1){
        extension='_2x';
    }

    if (images['userpin'] === '') {
        custom_img = mapfunctions_vars.path + '/' + 'userpin' +extension+ '.png';
    } else {
        custom_img = images['userpin'];
        if(ratio>1){
            custom_img=custom_img.replace(".png","_2x.png");
        }
    }



    return custom_img;
}

function wprentals_custompin_leaflet(image) {
    "use strict";

    if( mapfunctions_vars.useprice === 'yes' ){
        return mapfunctions_vars.path + '/pixel.png';
    }

    var custom_img  =   '';
    var extension   =   '';
    var ratio       =   jQuery(window).dense('devicePixelRatio');

    if(ratio>1){
        extension='_2x';
    }

    if(mapfunctions_vars.use_single_image_pin==='no'){
        if (image !== '') {
            if (images[image] === '') {
                custom_img = mapfunctions_vars.path + '/' + image + extension + '.png';
            } else {
                custom_img = images[image];
                if(ratio>1){
                    custom_img=wpestate_get_custom_retina_pin(custom_img);
                }
            }
        } else {
            custom_img = images['single_pin'];
        }
    }else{
        if(ratio>1){
            custom_img= wpestate_get_custom_retina_pin(  images['single_pin'] );
        }else{
            custom_img= images['single_pin'];
        }
    }

   return custom_img;
}






function wprentals_map_resize(){
     "use strict";
    if(wprentals_map_type===1){
        google.maps.event.trigger(map, "resize");
    }else if(wprentals_map_type===2){
         map.invalidateSize();
    }else if(wprentals_map_type===3){

    }
}





wprentals_autocomplete_mapbox();

/*
*
* Autocomplete for OpenStreetMap
*
*
*/
function wprentals_openstreet__code_address_map_call(item_id){

  var featuretype='settlement';
  if(item_id==='property_address'){
    featuretype='';
  }

  jQuery('#'+item_id).autocomplete( {
				source: function ( request, response ) {
 					    jQuery.get( 'https://nominatim.openstreetmap.org/search', {
 						         format: 'json',
                     featuretype:featuretype,
 						         q: request.term,//was q
 						         addressdetails:'1',
 					    }, function( result ) {
 						         if ( !result.length ) {
                         response( [ {
                             value: '',
                             label: 'there are no results'
                         } ] );
                         return;
 						             }
					               response( result.map( function ( place ) {

 						                    var return_obj= {
 								                         label: place.display_name,
                                         latitude: place.lat,
                           							 longitude: place.lon,
                           							 value: place.display_name,
                                     };


                                   if(typeof(place.address)!='undefined'){
                                       return_obj.county=place.address.county;
                                   }

                                   if(typeof(place.address)!='undefined'){
                                       return_obj.city=place.address.city;
                                   }

                                   if(typeof(place.address)!='undefined'){
                                       return_obj.state=place.address.state;
                                   }

                                   if(typeof(place.address)!='undefined'){
                                       return_obj.country=place.address.country;
                                   }

                                   if(typeof(place.address)!='undefined'){
                                       return_obj.zip=place.address.postcode;
                                   }

                                   return return_obj

 						} ) );
 					}, 'json' );
 				},
 				select: function ( event, ui ) {

          var admin_area      =   '';

          jQuery('#property_city').val(ui.item.city);
          jQuery('#property_country').val(ui.item.country);
          jQuery('#property_admin_area').val( ui.item.label);


          if(item_id==='property_address'){
            wprentals_submit_agolia_codeAddress( ui.item.latitude, ui.item.longitude);
          }

          if(item_id==='geolocation_search'){
            jQuery("#geolocation_lat").val(ui.item.latitude);
            jQuery("#geolocation_long").val(ui.item.longitude);
             
            wpestate_start_filtering_ajax_map(1);
          }
          wprentals_fillInAddress_filter_leaflet(ui.item,item_id);
 				}
 			} );


}



function wprentals_autocomplete_mapbox(){
         "use strict";

        if( parseInt(mapbase_vars.wprentals_places_type) == 1  ){
            return;
        }


        if (document.getElementById('property_city_front')) {

          if( parseInt(  mapbase_vars.wprentals_places_type)==3 ){
              wprentals_openstreet__code_address_map_call('property_city_front');
          }else if( parseInt(  mapbase_vars.wprentals_places_type)==2 ){

                var placesAutocomplete = places({
                    appId:  mapbase_vars.wp_estate_algolia_app_id,
                    apiKey: mapbase_vars.wp_estate_algolia_api_key,
                    type: 'city',
                     language: 'en',
                     templates: {
                        value: function(suggestion) {
                          return suggestion.name;
                        }
                    },
                    container: document.querySelector('#property_city_front')
                });

                placesAutocomplete.on('change', function(e) {
                    wprentals_agolia_fillInAddress_city(e);
                });

            }
        }


        // agolia on submit
        if (document.getElementById('property_address')) {
            var address, full_addr, country, city, infowindow;
            address = document.getElementById('property_address').value;
            city = jQuery("#property_city_submit").val();
            full_addr = address + ',' + city;
            country = document.getElementById('property_country').value;
             if (country) {
                full_addr = full_addr + ',' + country;
            }

            if( parseInt(  mapbase_vars.wprentals_places_type)==3 ){
              wprentals_openstreet__code_address_map_call('property_address');
            }else     if( parseInt(  mapbase_vars.wprentals_places_type)==2 ){

              var placesAutocomplete = places({
                  appId:  mapbase_vars.wp_estate_algolia_app_id,
                  apiKey: mapbase_vars.wp_estate_algolia_api_key,
                  type: 'address',
                   language: 'en',

                  templates: {
                       value: function(suggestion) {
                         return suggestion.name;
                       }
                   },
                  container: document.querySelector('#property_address')
              });

              placesAutocomplete.on('change', function(place) {
                  wprentals_submit_agolia_codeAddress(place.suggestion.latlng.lat,place.suggestion.latlng.lng);
              });

            }
        }

        //agoliaa on geolocation half

        if (document.getElementById('geolocation_search')) {
          if( parseInt(  mapbase_vars.wprentals_places_type)==2 ){
              var placesAutocomplete = places({
                  appId:  mapbase_vars.wp_estate_algolia_app_id,
                  apiKey: mapbase_vars.wp_estate_algolia_api_key,
                  language: 'en',
                  templates: {
                      value: function(suggestion) {
                         return suggestion.name;
                      }
                   },
                  container: document.querySelector('#geolocation_search')
              });
              initial_geolocation_circle_flag=0;
              placesAutocomplete.on('change', function(place) {
                  initial_geolocation_circle_flag=0;
                  jQuery("#geolocation_lat").val(place.suggestion.latlng.lat);
                  jQuery("#geolocation_long").val(place.suggestion.latlng.lng);
                  
                  wpestate_start_filtering_ajax_map(1);
              });

          }else if( parseInt(  mapbase_vars.wprentals_places_type)==3 ){
              initial_geolocation_circle_flag=0;
              wprentals_openstreet__code_address_map_call('geolocation_search');
          }



        }

        var search_fields = ['search_location', 'search_locationshortcode', 'search_locationmobile','search_locationsidebar','search_locationhalf'];

        search_fields.forEach(function(element) {

            if (document.getElementById(element) && document.getElementById(element).getAttribute("type") == "text"  ) {
                if( parseInt(  mapbase_vars.wprentals_places_type)==2 ){

                    var placesAutocomplete = places({
                      appId:  mapbase_vars.wp_estate_algolia_app_id,
                      apiKey:  mapbase_vars.wp_estate_algolia_api_key,
                      type: 'city',
                       language: 'en',

                      templates: {
                          value: function(suggestion) {
                             return suggestion.name;
                          }
                       },
                      container: document.querySelector('#'+element)
                  });

                  placesAutocomplete.on('change', function(place) {
                      wprentals_fillInAddress_filter_leaflet(place,element);
                  });

                }else if( parseInt(  mapbase_vars.wprentals_places_type)==3 ){
                  wprentals_openstreet__code_address_map_call(element);
                }
            }
        });




    }



function wprentals_fillInAddress_filter_leaflet(place,element){
     "use strict";
        var i, addressType, val, have_city,admin_area,property_country,property_area,property_city;
        have_city   =   0;
        admin_area  =   '';

       var extension='';

        if(element=='search_locationshortcode'){
            extension='shortcode';
        }else if(element=='search_locationmobile'){
            extension='mobile';
        }else if(element=='search_locationsidebar'){
            extension='sidebar';
        }else if(element=='search_locationhalf'){
          extension='half'
        }

        if( typeof(place.label)!=='undefined' ){
            admin_area=admin_area+place.label;
        }



        jQuery('#property_admin_area,#property_admin_areasidebar,#property_admin_areashortcode,#property_admin_areamobile').val(admin_area);




        if( typeof(place.country)!=='undefined' ){
            property_country=place.country;

            jQuery('#advanced_country'+extension).attr('data-value', property_country);
            jQuery('#advanced_country'+extension).val(property_country);
            jQuery('#search_location_country'+extension).val(property_country);

        }


        if( typeof(place.city)!=='undefined' ){
            property_city=place.city;
            jQuery('#advanced_city'+extension).attr('data-value', property_city);
            jQuery('#advanced_city'+extension).val(property_city);
            jQuery('#search_location_city'+extension).val(property_city);
        }
        /*
        if(place.suggestion.type=='address' ){
            property_area=place.suggestion.address;
            jQuery('#advanced_area'+extension).attr('data-value', property_area);
            jQuery('#advanced_area'+extension).val(property_area);
            jQuery('#search_location_area'+extension).val(property_area);
        }
        */




        if(jQuery('#advanced_search_map_list').length>0){
            
            wpestate_start_filtering_ajax_map(1);
        }



        var is_google_map = parseFloat(jQuery('#isgooglemap').attr('data-isgooglemap'), 10);
        if (is_google_map === 1) {
            var guest_val=jQuery(this).attr('data-value');
        }
}



function wprentals_fillInAddress_filter_leaflet_old(place,element){
     "use strict";
        var i, addressType, val, have_city,admin_area,property_country,property_area,property_city;
        have_city   =   0;
        admin_area  =   '';

       var extension='';

        if(element=='search_locationshortcode'){
            extension='shortcode';
        }else if(element=='search_locationmobile'){
            extension='mobile';
        }else if(element=='search_locationsidebar'){
            extension='sidebar';
        }else if(element=='search_locationhalf'){
          extension='half'
        }

        if( typeof(place.suggestion.administrative)!=='undefined' ){
            admin_area=admin_area+place.suggestion.administrative;
        }

        if( typeof(place.suggestion.county)!=='undefined' ){
            admin_area=admin_area+', '+place.suggestion.county;
        }

        jQuery('#property_admin_area,#property_admin_areasidebar,#property_admin_areashortcode,#property_admin_areamobile').val(admin_area);




        if( typeof(place.suggestion.country)!=='undefined' ){
            property_country=place.suggestion.country;

            jQuery('#advanced_country'+extension).attr('data-value', property_country);
            jQuery('#advanced_country'+extension).val(property_country);
            jQuery('#search_location_country'+extension).val(property_country);

        }


        if(place.suggestion.type=='city' ){
            property_city=place.suggestion.value;
            jQuery('#advanced_city'+extension).attr('data-value', property_city);
            jQuery('#advanced_city'+extension).val(property_city);
            jQuery('#search_location_city'+extension).val(property_city);
        }
        if(place.suggestion.type=='address' ){
            property_area=place.suggestion.address;
            jQuery('#advanced_area'+extension).attr('data-value', property_area);
            jQuery('#advanced_area'+extension).val(property_area);
            jQuery('#search_location_area'+extension).val(property_area);
        }




        if(jQuery('#advanced_search_map_list').length>0){
           
            wpestate_start_filtering_ajax_map(1);
        }



        var is_google_map = parseFloat(jQuery('#isgooglemap').attr('data-isgooglemap'), 10);
        if (is_google_map === 1) {
            var guest_val=jQuery(this).attr('data-value');
        }
}





function   wprentals_agolia_fillInAddress_city(place) {
     "use strict";
    var admin_area      =   '';
    var property_city   =   '';
    var property_country=   '';

    if( typeof(place.suggestion.administrative)!=='undefined' ){
        admin_area=admin_area+place.suggestion.administrative;
    }

    if( typeof(place.suggestion.county)!=='undefined' ){
        admin_area=admin_area+', '+place.suggestion.county;
    }

    if( typeof(place.suggestion.country)!=='undefined' ){
        property_country=place.suggestion.country;
    }

    if( typeof(place.suggestion.value)!=='undefined' ){
        property_city=place.suggestion.value;
    }


    jQuery('#property_city').val(property_city);
    jQuery('#property_country').val(property_country);
    jQuery('#property_admin_area').val( property_city+", "+admin_area);

}


function wprentals_initialize_map_submit_leaflet(){

    "use strict";
    var listing_lat = jQuery('#property_latitude').val();
    var listing_lon = jQuery('#property_longitude').val();

    if (listing_lat === '' || listing_lat === 0 || listing_lat === '0') {
        listing_lat = google_map_submit_vars.general_latitude;
    }

    if (listing_lon === '' || listing_lon === 0 || listing_lon === '0') {
        listing_lon = google_map_submit_vars.general_longitude;
    }

    var mapCenter = L.latLng( listing_lat,listing_lon );


    if (document.getElementById('googleMapsubmit')) {
        map =  L.map( 'googleMapsubmit',{
            center: mapCenter,
            zoom: 17
        }).on('load', function(e) {

        });
       // map_intern = 1;



        var tileLayer =  wprentals_open_stret_tile_details();

        map.addLayer( tileLayer );
        map.on('click', function(e){

            map.removeLayer( propertyMarker_submit );
            var markerCenter        =   L.latLng( e.latlng);
            propertyMarker_submit   =   L.marker(e.latlng).addTo(map);
            propertyMarker_submit.bindPopup('<div class="submit_leaflet_admin">Latitude: ' + e.latlng.lat + ' Longitude: ' + e.latlng.lng+'</div>').openPopup();
            document.getElementById("property_latitude").value =  e.latlng.lat ;
            document.getElementById("property_longitude").value = e.latlng.lng;
        });


        var markerCenter        =   L.latLng( listing_lat,listing_lon );
        propertyMarker_submit   =   L.marker( markerCenter ).addTo(map);
        propertyMarker_submit.bindPopup('<div class="submit_leaflet_admin">Latitude: ' + listing_lat + ' Longitude: ' + listing_lon+'</div>').openPopup();
   }
}


function wprentals_submit_agolia_codeAddress(listing_lat,listing_lon){
         "use strict";
        if( parseInt(mapbase_vars.wprentals_map_type) ==1 ){
            wprentals_submit_set_postion(listing_lat,listing_lon);
        }else  if( parseInt(mapbase_vars.wprentals_map_type) ==2 ){
            map.removeLayer( propertyMarker_submit );
            var markerCenter    =   L.latLng( listing_lat,listing_lon );
            propertyMarker_submit      =   L.marker( markerCenter ).addTo(map);
            map.setView(markerCenter, 15);
            propertyMarker_submit.bindPopup('<div class="submit_leaflet_admin">Latitude: ' + listing_lat + ' Longitude: ' + listing_lon+'</div>').openPopup();
            document.getElementById("property_latitude").value =  listing_lat ;
            document.getElementById("property_longitude").value = listing_lon;
        }



}



function wprentals_submit_set_postion(listing_lat,listing_long){
    "use strict";
    wpestate_removeMarkers();
    var myLatLng = new google.maps.LatLng( listing_lat, listing_long);
    map.setCenter(myLatLng);
    var marker = new google.maps.Marker({
        map: map,
        position: myLatLng
    });

    gmarkers.push(marker);
    var infowindow = new google.maps.InfoWindow({
        content: 'Latitude: ' + listing_lat + '<br>Longitude: ' + listing_long
    });

    infowindow.open(map,marker);
    document.getElementById("property_latitude").value  =   listing_lat ;
    document.getElementById("property_longitude").value =   listing_long;

}



function wpestate_display_status(status){
    var   status_html='';

    if (status!=='normal' && status!==''){
        var status_array = status.split(",");
        for (var i = 0; i < status_array.length; i++) {
            status_html=status_html+'<div class="property_status status_'+status_array[i]+'">'+status_array[i]+'</div>';
        }
    }

    return status_html='<div class="property_status_wrapper_infobox">'+status_html+'</div>';

}
