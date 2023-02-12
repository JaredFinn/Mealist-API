const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8100');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Quincy37%',
    database: 'recipedb'
  });

  app.get('/recipes/all', function (req, res) {
    connection.query('select tr.recipe_id, tr.recipe_name, tr.recipe_image from t_recipes tr;', (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      res.json(results);
    });
  })

  app.post('/recipes/ingredients/:recipe_id', function (req, res) {
    const recipe_id = req.params.recipe_id;

    connection.query(`insert into t_list values (${recipe_id});`, (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      res.json(results);
    });
  })
  

app.get('/recipes/ingredients/all', function (req, res) {
    connection.query('select tr.recipe_id, tr.recipe_name, ti.ingredient_name, tm.measurement_desc, ' +
                        'tmq.measurement_qty_desc from t_ingredients tis '+
                        'left join t_recipes tr on tis.recipe_id = tr.recipe_id '+
                        'left join t_ingredient ti on tis.ingredient_id = ti.ingredient_id ' +
                        'left join t_measurement tm on tis.measurement_id = tm.measurement_id ' +
                        'left join t_measurement_qty tmq on tis.measurement_qty_id = tmq.measurement_qty_id ' +
                        'order by tr.recipe_name;', (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      res.json(results);
    });
  
});

app.listen(process.env.PORT || 8080);