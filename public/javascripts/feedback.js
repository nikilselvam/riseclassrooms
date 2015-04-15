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
		        debugger;
		        return text.indexOf(val) != -1 ;
		    }).show();

			$("#search-results-div").fadeIn("fast");
		});
	});

	$(".keyword").click(function(){
		var keywordObject = this;

		$("p.help-block").hide("fast");
		$("#search-results-div").fadeOut("fast", function () {
			var keyword = keywordObject.childNodes[1].innerHTML;
			var val = keyword.replace(/ +/g, ' ').toLowerCase();
			var secondVal = null;

			if (val.substr(val.length-1, 1) === "y") {
				secondVal = val.substr(0, val.length - 1) + "i";
			}

			$("#search-input").val(val);		

			var rows = $(".all-questions tr");
		    rows.hide().filter(function () {
		        var text = $(this).find('td').slice(2,3).text().replace(/\s+/g, ' ').toLowerCase();

		    	if (secondVal === null) {
		        	return text.indexOf(val) != -1;
		    	}
		    	else {
		    		return text.indexOf(val) != -1 || text.indexOf(secondVal) != -1;
		    	}
		    }).show();

			$("#search-results-div").fadeIn("fast");
		});

	});
});