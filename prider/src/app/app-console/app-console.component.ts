import { LocationService } from './service/location.service';
import { NavigationCancel, Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';

declare const google: any;

let arr: any[] = [];
let previousCoord: number;
let locationAPI: any[] = [];
let markersArray = [];

@Component({
  selector: 'app-app-console',
  templateUrl: './app-console.component.html',
  styleUrls: ['./app-console.component.scss']
})


export class AppConsoleComponent implements OnInit {

  location: any;
  map: any;
  mapElement: any;
  marker: any;
  profile: any;
  picture: any;
  name: any;
  markerList: any;

  locations = [
    ['Bondi Beach', -33.890542, 151.274856, 4],
    ['Coogee Beach', -33.923036, 151.259052, 5],
    ['Cronulla Beach', -34.028249, 151.157507, 3],
    ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
    ['Maroubra Beach', -33.950198, 151.259302, 1]
  ];

  constructor(private http: HttpClient, private router: Router, private locationService: LocationService) {

    this.locationService.getLocations().subscribe(data => locationAPI.push(data));

  }

  // place_marker(locationClick: any): void {
  //   this.marker = new google.maps.Marker({
  //     position: locationClick,
  //     map: this.map
  //   });


  // }




  get_distance(origin: any, destination: any): any {
    const service = new google.maps.DistanceMatrixService();
    const request = {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    };

    service.getDistanceMatrix(request).then((response: any) => {
      console.log("Distance", response);
    }
    );
  }


  addMarker(): void {
    var infowindow = new google.maps.InfoWindow();
    for (var i = 0; i <= this.locations.length; i++) {

      this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.locations[i][1], this.locations[i][2]),
        map: this.map,
        animation: google.maps.Animation.BOUNCE,
        title: this.locations[i][0],
      });
      var icon = { url: " http://maps.google.com/mapfiles/ms/icons/green-dot.png" }
      google.maps.event.addListener(this.marker, 'click', ((marker, i) => {
        return () => {
          marker.setIcon(icon);
          console.log("Icon Clicked", i);
        }
      })(this.marker, i));
      google.maps.event.addListener(this.marker, 'mouseover', ((marker, i) => {
        var infowindow = new google.maps.InfoWindow({
          content: this.locations[i][0],
          map: this.map
        });
        return () => {
          infowindow.open(this.map, marker);
        }
      })(this.marker, i));


    }


  }

  get_location(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          this.location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.map = new google.maps.Map(this.mapElement, {
            // center: this.location,
            center: new google.maps.LatLng(-33.92, 151.25),
            zoom: 14,
          });



          // this.map.addListener("click", (clickEvent: { latLng: any; }) => {
          //   console.log("Mouse Event", clickEvent);
          //   // this.place_marker(clickEvent.latLng);

          //   console.log("Latitude & Longitude", clickEvent.latLng.toJSON());
          //   arr.push(clickEvent.latLng.toJSON());
          //   console.log("Array", arr);
          //   if (arr.length == 2) {
          //     previousCoord = 1;
          //     this.get_distance(arr[0], arr[1]);
          //   }
          //   if (arr.length > 2) {
          //     this.get_distance(arr[previousCoord], arr[previousCoord + 1]);
          //     previousCoord = previousCoord + 1;
          //   }

          // });
          var myicon = {
            url: this.picture,
            scaledSize: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0),
          };
          console.log(myicon.url);
          var mlabel = "";
          var namel = this.name.split(" ");
          namel.forEach((element: string) => {
            mlabel = mlabel + element.charAt(0);
          });
          this.marker = new google.maps.Marker({
            position: this.location,
            icon: myicon,
            map: this.map,
            label: { text: mlabel, color: "white" },
          });
          this.addMarker();
        }
      );



    }
    else {
      this.location = {
        lat: 27.2046,
        lng: 77.4977
      };
      this.map = new google.maps.Map(this.mapElement, {
        center: this.location,
        zoom: 14,
      });
    }

  }

  get_profile(): void {
    var user_name = document.getElementById("username");
    this.profile = this.http.get<any>(environment.baseUrl + "/user/profile").subscribe(data => {
      user_name!.innerHTML = data.name;
      this.picture = data.picture;
      this.name = data.name;
      this.get_location();

    });
  }

  ngOnInit(): void {
    this.mapElement = document.getElementById("mapElement");
    this.get_profile();
  }

  logout(): void {
    this.http.get(environment.baseUrl + '/logout');
    this.router.navigate(['/home']);
  }

}
