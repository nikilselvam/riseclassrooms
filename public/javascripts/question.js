jQuery(function ($) {
	$("form#search").on("submit", function (e) {
		e.preventDefault();
		$("p.help-block").hide("fast");
		$("#search-results-div").fadeOut("fast", function () {

			var buttonId = document.activeElement.id;
			var val;

			if (buttonId === "show-all-questions") {
				val = "";
			}
			else {
				val = $.trim($("#search-input").val()).replace(/ +/g, ' ').toLowerCase();
			}

			var rows = $("tbody tr");
		    rows.hide().filter(function () {
		        var text = $(this).find('td').slice(0,2).text().replace(/\s+/g, ' ').toLowerCase();

		        return text.indexOf(val) != -1 ;
		    }).show();
			$("#search-results-div").fadeIn("fast");
		});
	});
});