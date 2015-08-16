var models = require('../models/models.js');
// autoload :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
		where: {
		id: Number(quizId)
		},
		include: [{
			model: models.Comment
		}]
	}).then(function(quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		} else {
			next(new Error('No existe quizId=' + quizId))
		}
	}
	).catch(function(error){next(error)});
};
// GET /quizes
exports.index = function(req, res) {
	if (req.query.buscar) {
		models.Quiz.findAll({where: ["UPPER(pregunta) LIKE UPPER(?)", '%'+req.query.buscar+'%'],order:'pregunta ASC'}).then(function(quizes) {
			if(typeof(quizes != 'undefined')){
				res.render('quizes/index.ejs', {quizes: quizes, errors: []});
			}
	  }).catch(function(error) { next(error);})
	} else if (req.query.tema) {
		models.Quiz.findAll({where: ["UPPER(tema) LIKE UPPER(?)", '%'+req.query.tema+'%'],order:'pregunta ASC'}).then(function(quizes) {
			if(typeof(quizes != 'undefined')){
				res.render('quizes/index.ejs', {quizes: quizes, errors: []});
			}
	  }).catch(function(error) { next(error);})

	} else {
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes/index.ejs', {quizes: quizes, errors: []});
	  }).catch(function(error) { next(error);})
	}
};
// GET /quizes/:id
exports.show = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		res.render('quizes/question.ejs', {quiz: quiz, errors: []});
  })
};
// GET /quizes/:id/answer
exports.answer = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		if (req.query.respuesta.toUpperCase() === quiz.respuesta.toUpperCase()) {
			res.render('quizes/answer.ejs', 
				 {quiz: quiz, respuesta: 'Correcto', errors: [] });
		} else {
			res.render('quizes/answer.ejs', 
				 {quiz: quiz, respuesta: 'Incorrecto', errors: []});
		}
	})
};
// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(
		{pregunta: "Pregunta", respuesta: "Respuesta", tema: "Otro"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};
// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );
	quiz
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				quiz
				.save({fields: ["pregunta", "respuesta", "tema"]})
				.then( function(){ res.redirect('/quizes')}) 
			}
		}
	).catch(function(error){next(error)});
};
// GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz;  
	res.render('quizes/edit', {quiz: quiz, errors: []});
};
// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta  = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
	req.quiz
	.validate()
	.then(
	function(err){
		if (err) {
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			} else {
			req.quiz
			.save( {fields: ["pregunta", "respuesta", "tema"]})
			.then( function(){ res.redirect('/quizes');});
			}     
		}
	).catch(function(error){next(error)});
};
// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
	res.redirect('/quizes');
	}).catch(function(error){next(error)});
};
