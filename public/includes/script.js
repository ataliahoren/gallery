$(document).ready(function () {
    //add new pic form
    $('#onclickAdd').click(function (e) {
        e.preventDefault();
        $('#uploaddiv').show();
    });
    $('#cancel').click(function (e) {
        e.preventDefault();
        $('#uploaddiv').hide();
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
    //edit pic
    $gallery.delegate('.editPic', 'click', function () {
		$("#uploaddiv").show();
        var $section = $(this).closest('section');
        $("#uploaddiv").find('#name').val($section.find('span.name').html());
        $("#uploaddiv").find('#description').val($section.find('span.desc').html());
        $("#uploaddiv").find('i#pic').val($section.find('img.pic').attr('src'));
        //$section.addClass('edit');
    });
	
    //cancel edit
    $gallery.delegate('.cancelEdit', 'click', function () {
        $(this).closest('section').removeClass('edit');
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
		console.log("ste: " + str);
		/*var srcOriginal = src.split("_");
		console.log(srcOriginal);
		var sizeOriginalfull = srcOriginal[1];
		console.log(sizeOriginalfull);
		var sizeOriginalsplit = src.split(".");
		console.log(sizeOriginalsplit);
		var sizeOriginal = sizeOriginalsplit[0];
		console.log(sizeOriginal); */
		//src.replace(src, str);
//		src.replace(src, str);
		$($allImg[i]).attr("src").replace(src, str);
	}
}
//user has chosen other size pic
	$('.btn-default').click(function (e)
	 {
		e.preventDefault();
		var small = "small";
		var medium = "medium";
		var large = "large";
		var regular = "regular";		
		console.log($(this).text());
		if ($(this).text() == "small") PictureSize("{{smallImage}}");	
		else if ($(this).text() == "medium") PictureSize("{{mediumImage}}");
		else if ($(this).text() == "large") PictureSize("{{largeImage}}");
		else PictureSize("{{originalImage}}");
	});
/*********color handling***********/
	//user has chosen color
	$("a").click(function (e)
	 {
		e.preventDefault();
		var color = $(this).text();
	var $allImg = $("img").get();
	var $allImgSize = $allImg.length
		for (var i=0; i<$allImgSize; i++)
			{

 			       var $section = $(this).closest('section');
				if ($($allImg[i]).attr("data-id") ==  color) $($section).show();
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
