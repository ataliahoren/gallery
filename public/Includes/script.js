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

    /*// add pic
     $('#upload').on('submit', function () {
     $('#uploaddiv').hide();
     //var $file = $('#pic')[0].files[0];
     //var file = document.getElementById('pic').files[0]; --this is in JS

     var data = {
     name: $name.val(),
     description: $description.val(),
     image: $pic.val()
     };

     $.ajax(
     {
     type: 'POST',
     url: $fullUrl,
     data: picture,
     success: function (newPicture) {
     var currentId = addPic(newPicture);

     //to check

     $.ajax(
     {
     type: 'POST',
     url: $s3 + currentId + '.png',
     data: binaryPic,
     success: function (binary) {
     addPic(binary);
     //renaim to id.pmg
     },
     error: function () {
     alert('error saving to s3');
     }
     });

     },
     error: function () {
     alert('error saving picture');
     }
     });

     });*/

    //remove pic
    $gallery.delegate('.remove', 'click', function () {
        var $section = $(this).closest('section');

        $.ajax({
            type: 'DELETE',
            url: '/images/' + $section.attr('data-id'),
            success: function () {
                alert('success delete s3');

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

        var $section = $(this).closest('section');
        $section.find('input.name').val($section.find('span.name').html());
        $section.find('input.desc').val($section.find('span.desc').html());
        $section.find('input.pic').val($section.find('img.pic').attr('src'));
        $section.addClass('edit');
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

});

