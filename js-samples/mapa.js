function initMap() {
    // Inicializa el mapa centrado en una ubicación predeterminada
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
    });
  
    // Barra de búsqueda
    const input = document.getElementById("search-input");
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);
  
    // Marcador de Rodolfo el Reno para la ubicación del usuario
    const userLocationMarker = new google.maps.Marker({
      map,
      icon: {
        url: "https://images.creativefabrica.com/products/thumbnails/2023/10/12/XRwTWLJCw/2WdvdSBc5VzBpMvw1ZqOxT5wogd.png", // URL de Rodolfo el Reno
        scaledSize: new google.maps.Size(50, 50), // Ajusta el tamaño del ícono
        origin: new google.maps.Point(0, 0), // Origen de la imagen
        anchor: new google.maps.Point(25, 25), // Ancla del marcador
      },
      visible: false, // Ocultar inicialmente
    });
  
    // Función para obtener la ubicación actual
    function getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
  
            // Centra el mapa en la ubicación del usuario y muestra el marcador
            map.setCenter(userPosition);
            userLocationMarker.setPosition(userPosition);
            userLocationMarker.setVisible(true);
  
            // Obtener el clima de la ubicación
            getWeather(userPosition.lat, userPosition.lng);
          },
          () => {
            alert("No se pudo obtener tu ubicación actual.");
          }
        );
      } else {
        alert("Tu navegador no soporta la geolocalización.");
      }
    }
  
    // Función para obtener el clima de la ubicación
    function getWeather(lat, lng) {
      const apiKey = '4d8fb5b93d4af21d66a2948710284366'; // Aquí coloca tu clave de API de OpenWeatherMap
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=es&appid=${apiKey}`;
    
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const weatherDescription = data.weather[0].description;
          const temperature = data.main.temp;
          const weatherIconCode = data.weather[0].icon; // Código del icono del clima
    
          // Mostrar el clima y el ícono
          document.getElementById('weather-info').textContent = `${Math.round(temperature)}°C - ${weatherDescription}`;
          document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${weatherIconCode}.png`; // Actualiza el ícono del clima
        })
        .catch(error => {
          document.getElementById('weather-info').textContent = "Error al cargar el clima";
          console.error(error);
        });
    }
  
    // Función para buscar lugares en el mapa
    let markers = [];  // Lista global para almacenar los marcadores
  
    function searchPlaces(query) {
      const service = new google.maps.places.PlacesService(map);
      const request = {
        query: query, // Término de búsqueda (por ejemplo: "restaurantes")
        fields: ['name', 'geometry'], // Campos que se devolverán
      };
  
      service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Limpia los marcadores previos
          clearMarkers();
  
          // Agrega un marcador rojo para cada lugar encontrado
          results.forEach((place) => {
            const marker = new google.maps.Marker({
              map,
              position: place.geometry.location,
              icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Marcador rojo
                scaledSize: new google.maps.Size(32, 32),
              },
              title: place.name,
            });
  
            // Centra el mapa en el primer resultado
            map.setCenter(place.geometry.location);
          });
        }
      });
    }
  
    // Función para limpiar los marcadores previos
    function clearMarkers() {
      markers.forEach((marker) => marker.setMap(null));
      markers = []; // Limpiar la lista de marcadores
    }
  
    // Llama a la función para obtener la ubicación del usuario
    getUserLocation();
  
    // Manejo de búsqueda de lugares (cuando se selecciona un lugar)
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
  
      if (!place.geometry || !place.geometry.location) {
        return;
      }
  
      // Centra el mapa en el lugar buscado
      map.setCenter(place.geometry.location);
      map.setZoom(15);
    });
  
    // Manejo de búsqueda general (cuando el usuario escribe algo más general, como "restaurantes")
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const query = input.value;
        if (query) {
          searchPlaces(query); // Realiza la búsqueda con el valor ingresado
        }
      }
    });
  }
  
  // Esperamos a que el DOM se cargue completamente
    document.addEventListener("DOMContentLoaded", function() {
        // Obtén el botón por su ID
        const boton = document.getElementById("mapa");

        // Asocia un evento de clic al botón
        boton.addEventListener("click", function() {
            window.location.href = "mapa.html"; // Redirige a la nueva URL
        });
    });

    document.addEventListener("DOMContentLoaded", function() {
        // Obtén el botón por su ID
        const boton = document.getElementById("productos");

        // Asocia un evento de clic al botón
        boton.addEventListener("click", function() {
            window.location.href = "producto.html"; // Redirige a la nueva URL
        });
    });

    document.addEventListener("DOMContentLoaded", function() {
        // Obtén el botón por su ID
        const boton = document.getElementById("acerca");

        // Asocia un evento de clic al botón
        boton.addEventListener("click", function() {
            window.location.href = "acercade.html"; // Redirige a la nueva URL
        });
    });

  // Asigna la función initMap al ámbito global para que Google Maps la llame
  window.initMap = initMap;
  