//Esta es la manera nueva de importar
import inquirer from 'inquirer';

//Creo las preguntas que se van a mostrar cuando corra la app, esto se usará posteriormente
const preguntas = [
	{
		type: "list",
		name: "opcion",
		message: "¿Qué desea hacer?".bgBrightRed,
		choices: [
			{
				value: 1,
				name: `${"1.".brightMagenta} Buscar ciudad`
			},
			{
				value: 2,
				name: `${"2.".brightMagenta} Historial`
			},
			{
				value: 0,
				name: `${"0.".brightMagenta} Salir`
			}
		]
	}
];

//Creo una funcion asincrona para poder recibir promesas, esta lo que hace es escirir en la consola los mensajes y leer las preguntas de arriba y colocarlas en la consola
const inquirerMenu = async () => {
	console.clear();
	console.log("=================================".brightCyan);
	console.log("     Seleccione una opción".brightCyan);
	console.log("=================================\n".brightCyan);

	//Aca desestructuramos de preguntas el parametro de la opcion
	const { opcion } = await inquirer.prompt(preguntas);

	return opcion;
};

//Con esta funcion lo que hacemos es poner en pausa la ejecucion y esperar que el usuario jaga un enter desdepues de cada accion
const pausa = async () => {
	const question = [{
		type: "input",
		name: "enter",
		message: `\nPresione ${"ENTER".brightCyan} para continuar\n`
	}];

	await inquirer.prompt(question);
};

//Esta funcion lo que hace es tomar y validar el valor que el usuario haya escrito, se usa para la opcion 1
const leerInput = async (message) => {
	const question = [
		{
			type: "input",
			name: "desc",
			message,
			validate(value) {
				if (value.length === 0) {
					return "Por favor ingrese un valor";
				}
				return true;
			}
		}
	];

	//en este caso lo que queremos obtener es el desc y es lo que terminamo retornando
	const { desc } = await inquirer.prompt(question);
	return desc;
};

//Esta funcion es para obtener la lista de lugares y obtener el id de la seleccionada
const listarLugares = async (lugares) => {
	//Pasamos las tareas ya guardados en un map y retornamos el value y el name de cada una
	const choices = lugares.map((lugar, i) => {
		const idx = `${i + 1}.`.cyan;

		return {
			value: lugar.id,
			name: `${idx} ${lugar.nombre}`
		}
	});

	//Esto es para agregarle una opcion al principio para que nos de la opcion de cancelar
	choices.unshift({
		value: "0",
		name: "0. ".cyan + "Cancelar"
	});

	//Creamos un nuevo menu que va a procesar las choices de arriba
	const preguntas = [
		{
			type: "list",
			name: "id",
			message: "Seleccione".bgBrightRed,
			choices //Esto es igual a choices: choices
		}
	];

	//Pasamos preguntas al inquirer para crear el menu nuevo y desestructuramos el id el cual retornamos
	const { id } = await inquirer.prompt(preguntas);
	return id;
};

//esta es la manera nueva de exportar
export {
	inquirerMenu,
	pausa,
	leerInput,
	listarLugares
}