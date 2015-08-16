var path = require('path');
// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;
// ORM
var Sequelize = require('sequelize');
// SQLite
// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // ---> en SQLite (.env)
    omitNull: true      // ---> en Postgres
  }      
);

var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // exportar tabla Quiz
exports.Comment = Comment; // exportar tabla Comentarios

sequelize.sync().then(function() {
	Quiz.count().then(function (count){
		if(count === 0) {   
		Quiz.bulkCreate( 
			[ {pregunta: 'Capital de Italia', respuesta: 'Roma', tema: 'Humanidades'},
			{pregunta: 'Unidad mínima de información empleada en informática', respuesta: 'Bit', tema: 'Tecnologia'},
			{pregunta: 'Capital de Portugal', respuesta: 'Lisboa', tema: 'Humanidades'},
			{pregunta: 'H2O', respuesta: 'Agua', tema: 'Ciencia'},
			{pregunta: 'Rey que convertía todo en oro', respuesta: 'Midas', tema: 'Ocio'},
			{pregunta: 'Capital de España', respuesta: 'Madrid', tema: 'Humanidades'},
			{pregunta: 'Capital de Bélgica', respuesta: 'Bruselas', tema: 'Humanidades'}, 
			{pregunta: 'Primer mes del año', respuesta: 'Enero', tema: 'Otro'} ]
		)
		.then(function(){console.log('Base de datos inicializada')});
		};
	});
});
