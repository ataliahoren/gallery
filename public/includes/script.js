$(document).ready(function () {
    //add new pic form
    $('#onclickAdd').click(function (e) {
        e.preventDefault();
        $('#uploaddiv').show();
    });
    $('#cancel').click(function (e) {
        e.preventDefault();
        $('#uploaddiv').hide();
        $('#formTitle').text("Add New");
    });
});
//data handling
 $(function () {
    var $gUrl = window.location.href;
    var arr = $gUrl.split("/");
    var $fullUrl = '/api/gallerypics';
    var $fullUrl2 = '/api/gallerypics/';
    var $s3 = '/images/';
    var $gallery = $('#gallery');
    var $name = $('#name');
    var $pic = $('#pic');
    // var $picataliatest = '//41.media.tumblr.com/f37ac708134914c471073e4c0b47328d/tumblr_mrn3dc10Wa1r1thfzo8_1280.jpg';
    var $description = $('#description');
    var pictureTemplate = $('#pic-template').html();
    function addPic(picture) {
        $gallery.append(Mustache.render(pictureTemplate, picture));
        var $ids = $('section').get();
        var $currentId = $($ids[$ids.length - 1]).attr('data-id');
        console.log($currentId + 'here');
        return $currentId;
    }
    $.ajax({
        type: 'GET',
        url: $fullUrl,
        //gallery is the collection name
        success: function (gallerypic) {
            $.each(gallerypic, function (i, picture) {
                addPic(picture);
            });
        },
        error: function () {
            alert('error loading pictures');
        }
    });
    $('#upload').on('submit', function () {
        if (!$name.val()) return false;
        return true;
    });
    //remove pic
    $gallery.delegate('.remove', 'click', function () {
        var $section = $(this).closest('section');
	console.log("remove image: " + $section.attr('data-id'));
        $.ajax({
            type: 'DELETE',
            url: '/images/' + $section.attr('data-id'),
            success: function () {
               // alert('success delete s3');
                $section.fadeOut(300, function () {
                    $(this).remove();
                });
            },
            error: function () {
                alert('error delete picture');
            }
        });
    });

    //edit pic - metadata
    $gallery.delegate('.editPic', 'click', function()
	{
		  
		var $section = $(this).closest('section');  
		$section.find('input.name').val( $section.find('span.name').html() );
		$section.find('input.desc').val( $section.find('span.desc').html() );
		$section.find('input.color').val( $section.find('span.color').html() );
		$section.find('input.color').attr('disabled', 'disabled');
		$section.find('input.pic').hide();
		$section.addClass('edit');
	});   

    //edit pic - replace img
    $gallery.delegate('.editPicImg', 'click', function () {
	$("#uploaddiv").show();
        $('#formTitle').text("Replace Image");
        var $section = $(this).closest('section');
        $("#uploaddiv").find('#name').val($section.find('span.name').html());
	$("#uploaddiv").find('#name').attr('disabled', 'disabled');
        $("#uploaddiv").find('#description').val($section.find('span.desc').html());
	$("#uploaddiv").find('#description').attr('disabled', 'disabled');
        $("#uploaddiv").find('#pic').val($section.find('img.pic').attr('src'));
        //$section.addClass('edit');
    });
	
    //cancel edit
    $gallery.delegate('.cancelEdit', 'click', function () {
	var $section = $(this).closest('section');  
        $section.removeClass('edit');
    });
    //save changes pic
    $gallery.delegate('.saveEdit', 'click', function () {
        var $section = $(this).closest('section');
        var picture =
        {
            name: $section.find('input.name').val(),
            description: $section.find('input.desc').val()
            //pic: $section.find('input.pic').val(),
            //get from s3 picture:
        };
        $.ajax(
            {
                type: 'PUT',
                url: $fullUrl2 + $section.attr('data-id'),
                data: picture,
                success: function (newPicture) {
                    $section.find('span.name').html(picture.name);
                    $section.find('span.desc').html(picture.description);
                    //$section.find('img.src').html(picture.pic);
                    $section.removeClass('edit');
                    //get from s3 picture -
                },
                error: function () {
                    alert('error updating picture');
                }
            });
    });
	
/******data-members*******/
	//array pf all img tag
	var $allImg = $("img").get();
	
	var $allImgSize = $allImg.length
		
/*********pic size handling***********/ //get the requested pic size 
function PictureSize(str)
 {
	console.log("in picsize fun");

		var $allImg = $("img").get();
	
	var $allImgSize = $allImg.length

	for (var i=0; i<$allImgSize; i++)
	{
		var src = $($allImg[i]).attr('src');
		console.log("current scr: " + src);
		console.log("str: " + str);
		var srcOriginal = src.split("_");
		console.log(srcOriginal);
		var sizeOriginalfull = srcOriginal[1];
		console.log(sizeOriginalfull);
		var sizeOriginalsplit = sizeOriginalfull.split(".");
		console.log(sizeOriginalsplit);
		var aa = sizeOriginalsplit[0];
		//console.log(sizeOriginal);
		//src.replace(src, str);
//		.replace(aa, str);
		console.log("old src: " +aa);
		var newsrc = $($allImg[i]).attr("src").replace(aa, str);
		$($allImg[i]).attr("src", newsrc);
		console.log("curr src: " +$($allImg[i]).attr("src"));
	}
}
//user has chosen other size pic
	$('.btn-default').click(function (e)
	 {
		e.preventDefault();
		var small = "small";
		var medium = "medium";
		var large = "large";
		var original = "original";		
		console.log($(this).text());
		if ($(this).text() == "small") PictureSize(small);	
		else if ($(this).text() == "medium") PictureSize(medium);
		else if ($(this).text() == "large") PictureSize(large);
		else if ($(this).text() == "original") PictureSize(original);
		else PictureSize(original);
	});
/*********color handling***********/
	//user has chosen color
	$("a").click(function (e)
	 {
		e.preventDefault();
		var color = $(this).text();
		//console.log("choosen color: " + color);
	var $allImg = $("img").get();
	var $allImgSize = $allImg.length
		for (var i=0; i<$allImgSize; i++)
			{

 			       var $section = $($allImg[i]).closest('section');
				//console.log("img section id: " + $section.attr("data-id"));
				//console.log("img curr color : " + $($allImg[i]).attr("data-id"));
				if (color == "all") $($section.show());
				else if ($($allImg[i]).attr("data-id") ==  color) $($section).show();
				else  $($section).hide();
			}
	});
	//add new color to colors list
	//get color from node
	function AddColor(color)
	{
	 $('ul.dropdown-menu').append($("<li>").append($("<a>", { href: '#' , text : color})));
	}
});
