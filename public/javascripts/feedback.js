jQuery(function ($) {
	$("form#search").on("submit", function (e) {
		e.preventDefault();
		$("p.help-block").hide("fast");
		$("#search-results-div").fadeOut("fast", function () {

			var buttonId = document.activeElement.id;
			var val;

			if (buttonId === "show-all-questions") {
				val = "";
				$("#search-input").val("");
			}
			else {
				val = $.trim($("#search-input").val()).replace(/ +/g, ' ').toLowerCase();
			}

			var rows = $(".all-questions tr");
		    rows.hide().filter(function () {
		        var text = $(this).find('td').slice(2,3).text().replace(/\s+/g, ' ').toLowerCase();

		        return text.indexOf(val) != -1 ;
		    }).show();
			$("#search-results-div").fadeIn("fast");
		});
	});

	$(".keyword").click(function(){
		var keyword = this.childNodes[1].innerHTML;
		var val = keyword.replace(/ +/g, ' ').toLowerCase();

		var rows = $(".all-questions tr");
	    rows.hide().filter(function () {
	        var text = $(this).find('td').slice(0,2).text().replace(/\s+/g, ' ').toLowerCase();

	        return text.indexOf(val) != -1 ;
	    }).show();
		$("#search-results-div").fadeIn("fast");
	});
});