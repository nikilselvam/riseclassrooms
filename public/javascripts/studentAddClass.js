
$("#search-submit-button").click(function() {
	$("#search-results-div").show();
});



$("#add-class-button").click(function(){
app.post("/student/studentHome", function(req, res) {
alert("Class number: " + req.body.classNumber);
res.send(req.body.classNumber);
res.send(req.body.className);
res.end("yes");

//var classNumber = req.body.classNumber,
//var className = req.body.className,
//console.log(req.body);
//res.end("yes");

});

});
