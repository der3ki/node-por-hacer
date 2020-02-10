const fs = require('fs');

let listadoPorHacer = [];
//La const crear, devuelve un objeto porHacer, con las propiedades descripcion y completado

const guardarDB = () =>{
    //Json stringify convierte un objeto a JSON
    let data = JSON.stringify(listadoPorHacer);
    fs.writeFile('db/data.json',data, (err)=>{
        if(err) throw new Error('No se pudo grabar',err);
    });
}
const cargarDB = () =>{
    try{
        //Se carga la db del json
        listadoPorHacer = require('../db/data.json');
    }
    //Ponemos este catch, por si el valor de data.json no hay nada, que se convierta en un array, ya que sino no será accesible para los jsons.
    catch(error){
        listadoPorHacer = [];
    }
}

const crear = (descripcion) =>{
    //Antes de crear/hacer una modificación, cargamos la DB, para que se guarden todos los resultados en vez de ir sobrescribiendolos.
    cargarDB();
    let porHacer = {
        descripcion,
        completado: false
    };
    listadoPorHacer.push(porHacer);
    guardarDB();
    return porHacer;
}
const getListado = () =>{
    cargarDB();
    return listadoPorHacer;
}

const actualizar = (descripcion,completado = true) =>{
    cargarDB();
    //Primero hay que buscar el index desde donde se llama a actualizar
    //Devuelve un index o devuelve - 1 si no encuentra el index
    let index = listadoPorHacer.findIndex(tarea =>{ return (tarea.descripcion === descripcion);})

    if(index >= 0){
        //Igualamos el completado
        listadoPorHacer[index].completado =  completado;
        //Guardamos la BBDD
        guardarDB();
        //Devolvemos true para finalizar el if
        return true;
    }
    else{
        return false;
    }
}

const borrar = (descripcion) =>{
    cargarDB();
    //Devuelve un array con valores donde la descripcion pasada por parametro NO está dentro del listadoPorHacer
    let nuevoListado = listadoPorHacer.filter( tarea => {
        return tarea.descripcion !== descripcion
    });

    if(listadoPorHacer.length === nuevoListado.length){
        return false;
    }
    else{
        listadoPorHacer = nuevoListado;
        guardarDB();
        return true;
    }
}

module.exports = {
    crear,
    getListado,
    actualizar,
    borrar
}
