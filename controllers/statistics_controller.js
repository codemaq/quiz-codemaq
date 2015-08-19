var models = require('../models/models.js');
var sequelize = require('sequelize');

var estadisticas = {
	quizes: 0,
	comentarios_total:0,
	pregs_comentadas: 0,
	coments_sin_pub: 0,
};
exports.analizaQuiz = function (req, res, next) {
	sequelize.Promise.all([
		models.Quiz.count(),
		models.Comment.count(),
		models.Comment.preguntas_comentadas(),
		models.Comment.comentarios_sin_publicar()
		]).then (function (values) {
			// Se asignan los diferentes valores a la variable estadisticas.X
			estadisticas.quizes = values[0];
			estadisticas.comentarios_total = values[1];
			estadisticas.pregs_comentadas = values[2];
			estadisticas.coments_sin_pub = values[3];
		}).catch(function (err) {
			next(err);
	}).finally(function () {
		next();
	});
};
exports.show = function (req, res) {
	res.render('statistics', { estadisticas: estadisticas, errors: [] });
};
