var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

router.param('quizId', quizController.load);  // autoload :quizId

router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

router.get('/author', function(req, res) {
  res.render('author', { title: 'Autor' });
});

module.exports = router;
