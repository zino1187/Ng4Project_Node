var express = require('express');
var router = express.Router();
var oracledb = require("oracledb");
var pool;

oracledb.autoCommit = true;
oracledb.createPool({
  user: "node",
  password: "node",
  connectString: "localhost/XE"
}, function (error, dbPool) {
  pool = dbPool;
});


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/regist', function (request, response, next) {
  console.log("전송된 데이터는 ", request.body);

  var name = request.body.name;
  var age = request.body.age;
  var job = request.body.job;

  //regist
  oracledb.getConnection(function (error, con) {
    if (error) {
      console.log(error);
    } else {
      var sql = "insert into profile(profile_id, name, age, job) values(seq_profile.nextval,:name,:age,:job)";
      con.execute(sql, [name, age, job], function (err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.rowsAffected == 0) {
            response.writeHead(500, { "Content-Type": "text/json" });
            response.end(JSON.stringify({
              result: 0,
              msg: "등록실패"
            }));
          } else {
            response.writeHead(200, { "Content-Type": "text/json" });
            response.end(JSON.stringify({
              result: 1,
              msg: "등록성공"
            }));
          }
        }
        con.close(function (e) { console.log(e); });
      });
    }
  });
});

/* 목록보기 */
router.get('/api/list', function (request, response, next) {
  oracledb.getConnection(function (error, con) {
    if (error) {
      console.log(error);
    } else {
      var sql = "select * from profile";
      con.execute(sql, function (err, result, fields) {
        if (err) {
          console.log(err);
        } else {
          console.log(JSON.stringify({
            records:result.rows
          }));
          response.writeHead(200, { "Content-Type": "text/json" });
          response.end(JSON.stringify({
            records:result.rows
          }));
        }
        con.close(function (e) { console.log(e); });
      });
    }
  });
});

/* 상세보기 */
router.get('/api/detail', function (request, response, next) {
  var profile_id=request.query.profile_id;
  console.log("profile_id  는 ",profile_id);

  oracledb.getConnection(function (error, con) {
    if (error) {
      console.log(error);
    } else {
      var sql = "select * from profile where profile_id=:profile_id";
      con.execute(sql,[profile_id] ,function (err, result, fields) {
        if (err) {
          console.log(err);
        } else {
          console.log(JSON.stringify({
            record:result.rows[0]
          }));
          response.writeHead(200, { "Content-Type": "text/json" });
          response.end(JSON.stringify({
            record:result.rows[0]
          }));
        }
        con.close(function (e) { console.log(e); });
      });
    }
  });
});


module.exports = router;













