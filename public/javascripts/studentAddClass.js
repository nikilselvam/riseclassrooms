
$("#search-submit-button").click(function() {
	$("#search-results-div").show();
});


$("form#search").on("submit", function (e) { e.preventDefault(); $("p.help-block").hide("fast"); });


$(".addClassButton").click(function(){
	var element = $(this).parent().parent();
	var value = $(element).attr('data-id');

	var data = {
		'classId' : value
	};

	var url = "/class/subscribe";

	$.ajax({
		type: "POST",
		url: url,
		data: data,
		success: function(req, res) {
			location.href = '/student';
		}
	});
});
