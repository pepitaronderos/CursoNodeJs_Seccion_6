import fs from 'fs';
import axios from 'axios';
import { Console } from 'console';

class Busquedas {
	historial = [];
	dbPath = "./db/database.json";

	constructor() {
		//Leemos si el json ya esta creado, si es asi se recuperan sus datos y se guardan en historial
		this.leerDB();
	}

	//Esto es para capitalizar las palabras de la lista de lugares
	get historialCapitalizado() {
		return this.historial.map(lugar => {
			let palabras = lugar.split(" ");
			palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

			return palabras.join(" ");
		});
	}

	//Este get es para retornar los parametros de la url del mapbox
	get paramsMapbox() {
		return {
			limit: 5,
			language: "es",
			access_token: process.env.MAPBOX_KEY //Lo que hacemos es leer el apikey de una variable de entorno que creamos a traves del paquete dotenv, para eso creamos el archivo .env en donde colocamos la variable MAPBOX_KEY con el apikey
		}
	}

	//Este get es para retornar los parametros de la url del openweather
	get paramsOpenWeather() {
		return {
			appid: process.env.OPENWEATHER_KEY,
			units: "metric",
			lang: "es"
		}
	}

	//Ciudad es un metodo asincrono que lo que hace es buscar la infomacion de la url pasandole como parametro el lugar que selecciono el usuario, y retornando un objeto con los datos que necesitamos
	async ciudad(lugar) {
		try {
			//Peticion  http
			const resp = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`, {
				params: this.paramsMapbox
			});

			//Si pongo ({}) significa que estoy retornando un objeto de manera implicita
			return resp.data.features.map(lugar => ({
				id: lugar.id,
				nombre: lugar.place_name,
				lon: lugar.center[0],
				lat: lugar.center[1]
			}));
		} catch (error) {
			console.log(error);
		}
	}

	//Climalugar es un metodo asincrono que lo que hace es buscar la infomacion de la url pasandole como parametros la longitud y latitud del lugar seleccionado por el usuario, y retornando un objeto con los datos que necesitamos
	async climaLugar(lon, lat) {
		try {
			//Peticion  http
			const resp = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
				params: { ...this.paramsOpenWeather, lat, lon } //desestructuramos el getter y mandamos las propiedades adicinales que necesitamos
			});

			//Acordarse hacer la desestructuracion en objetos grandes para traer solo la info que necesitamos
			const { weather, main } = resp.data;

			return {
				desc: weather[0].description,
				temp: main.temp,
				temp_min: main.temp_min,
				temp_max: main.temp_max
			}
		} catch (error) {
			console.log(error);
		}
	}

	//Este metodo lo que hace es tomar el lugar seleccionado por el usuario, chequear que no esté guardado en historial, guardarlo en el array y agregarlo al json
	agregarHistorial(lugar) {
		if (this.historial.includes(lugar.toLocaleLowerCase())) {
			return;
		}

		this.historial = this.historial.splice(0, 4);
		this.historial.unshift(lugar.toLocaleLowerCase());

		//grabar en db
		this.guardarDB();
	}

	//Este metodo es para guardar un archivo json con las ciudades que el usuario fue buscando
	guardarDB() {
		//se hace con el payload en el caso de que quiera grabar mas propiedades
		const payload = {
			historial: this.historial
		}

		fs.writeFileSync(this.dbPath, JSON.stringify(payload));
	}

	//Este metodo es para leer si el json ya existe, si es asi obtenemos su valores y los pasamos a historial
	leerDB() {
		if (!fs.existsSync(this.dbPath)) return;

		const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
		const data = JSON.parse(info);

		this.historial = data.historial;
	}
}

export {
	Busquedas
}