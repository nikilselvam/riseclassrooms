$('.back').click(function(){
	document.location = "/keyword";
});

$("#who_list li, #what_list li, #when_list li, #where_list li, #why_list li, #how_list li").hide();

$("#who").click(function(){
	$("#who_list li").toggle();

	var height = $(this).height();

	if (height >= 49 && height < 51) {
		$(this).css("height", 300);
	}
	else if (height >= 300  && height < 301) {
		$(this).css("height", 50);
	}
});

$("#what").click(function(){
	$("#what_list li").toggle();

	var height = $(this).height();

	if (height >= 49 && height < 51) {
		$(this).css("height", 300);
	}
	else if (height >= 300  && height < 301) {
		$(this).css("height", 50);
	}
});

$("#when").click(function(){
	$("#when_list li").toggle();

	var height = $(this).height();

	if (height >= 49 && height < 51) {
		$(this).css("height", 300);
	}
	else if (height >= 300  && height < 301) {
		$(this).css("height", 50);
	}
});

$("#where").click(function(){
	$("#where_list li").toggle();

	var height = $(this).height();

	if (height >= 49 && height < 51) {
		$(this).css("height", 300);
	}
	else if (height >= 300  && height < 301) {
		$(this).css("height", 50);
	}
});

$("#why").click(function(){
	$("#why_list li").toggle();

	var height = $(this).height();

	if (height >= 49 && height < 51) {
		$(this).css("height", 300);
	}
	else if (height >= 300  && height < 301) {
		$(this).css("height", 50);
	}
});

$("#how").click(function(){
	$("#how_list li").toggle();

	var height = $(this).height();

	if (height >= 49 && height < 51) {
		$(this).css("height", 300);
	}
	else if (height >= 300  && height < 301) {
		$(this).css("height", 50);
	}
});

$("#show_all").click(function(){
	$("#who_list li, #what_list li, #when_list li, #where_list li, #why_list li, #how_list li").show();
	$(".keyword_container").css("height", 300);
});

$("#hide_all").click(function(){
	$("#who_list li, #what_list li, #when_list li, #where_list li, #why_list li, #how_list li").hide();
	$(".keyword_container").css("height", 50);
});