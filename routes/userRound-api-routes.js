var db = require("../models");

module.exports = function(app) {
    
    app.post("/user_round", function(req,res) {
        // Retrieving all database records
        
        var courseId = req.body.idCourse;
        db.Course.findOne({
            where: {
                id: courseId
            },
            include: [db.Hole]
        }).then(function(result) {
           res.json(result);
        });
            // Rendering courses and passing the data to be parsed on the handlebars page
            // res.render("user_round", userRoundObj);
    });

    app.post("/api/userRounds", function(req,res) {
        console.log(req);
        var round = req.body;
        db.UserRound.create({
            tosses: round.dbTosses,
            score: round.dbScore,
            CourseId: round.dbCourseId,
            UserInfoId: round.dbUserId
        }).then(function(result) {
            res.json(result);
        });
    });
    };
        
  