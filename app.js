import * as dotenv from 'dotenv';
import colors from 'colors';
import {
	inquirerMenu,
	pausa,
	leerInput,
	listarLugares
} from './helpers/inquirer.js'
import { Busquedas } from './models/busquedas.js';

//Para que nos funcione dotenv
dotenv.config();

const main = async () => {
	let opt = "";
	const busquedas = new Busquedas();

	do {
		//aqui lo que hacemos es guardar en la variable opt el return de inquirerMenu que se usa para mostrar las preguntas en la consola
		opt = await inquirerMenu();

		//Luego ante la seleccion de cada pregunta ejecutamos un switch
		switch (opt) {
			case 1:
				//Mostrar el mensaje
				const termino = await leerInput("Ciudad:");

				//Buscamos los resultados
				const lugares = await busquedas.ciudad(termino);

				//Selecionar el lugar
				const id = await listarLugares(lugares);
				if (id === "0") continue;
				const lugarSel = lugares.find(l => l.id === id);
				busquedas.agregarHistorial(lugarSel.nombre);

				//Datos del clima
				const clima = await busquedas.climaLugar(lugarSel.lon, lugarSel.lat);

				//Monstrar resultados
				console.log(`\nInformación de la ciudad\n`.cyan);
				console.log("Ciudad:", lugarSel.nombre);
				console.log("Latitud:", lugarSel.lat);
				console.log("Longitud:", lugarSel.lon);
				console.log("Temperatura:", clima.temp);
				console.log("Minima:", clima.temp_min);
				console.log("Maxima:", clima.temp_max);
				console.log("Como está el clima:", clima.desc);
				break;
			case 2:
				//Mostramos en el historial los datos capitalizados
				busquedas.historialCapitalizado.forEach((lugar, i) => {
					const idx = `${i + 1}.`.cyan;
					console.log(`${idx} ${lugar}`);
				});
				break;
		}

		//ejecutamos la pausa
		await pausa();
	} while (opt !== 0); //mientras opt no sea cero se ejecuta
};

main();