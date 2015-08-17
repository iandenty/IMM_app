$(function() { 

	$TextContainer = $('.app-text');
	$icons = $TextContainer.find("li");

	$icons.on('click mouseover', function(){
		var icon = $(this).attr("data-id");
		$('.app-description').find("p").each(function(){
			if($(this).hasClass(icon)){
				$(this).removeClass("hide");
				$(this).addClass("show");
			}
			else{
				$(this).addClass("hide");
				$(this).removeClass("show");
			}
		})

	})

})