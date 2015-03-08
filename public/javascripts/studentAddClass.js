jQuery(function ($) {
	$("form#search").on("submit", function (e) {
		e.preventDefault();
		$("p.help-block").hide("fast");
		$("#search-results-div").fadeOut("fast", function () {
			var val = $.trim($("#search-input").val()).replace(/ +/g, ' ').toLowerCase();
			var rows = $("tbody tr");
		    rows.hide().filter(function () {
		        var text = $(this).find('td').first().text().replace(/\s+/g, ' ').toLowerCase();

		        return text.indexOf(val) != -1 ;
		    }).show();
			$("#search-results-div").fadeIn("fast");
		});
	});


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
});

