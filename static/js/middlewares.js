/**
 * Created by Saurabh on 04/04/2015.
 */
if(localStorage.getItem('user_username')==undefined && localStorage.getItem('user_api_key')==undefined){
    window.location.assign('/login/');
}

function enableMiddleware(middlewareId, $row, $button)
{
    $.ajax({
            headers : {
                'Content-Type' : 'application/json'
            },
            url : 'http://192.168.1.10:8000/api/v1/middleware/'+middlewareId+'/?format=json&username='+localStorage.getItem('user_username')+'&api_key='+localStorage.getItem('user_api_key') ,
            type : 'PATCH',
            data : JSON.stringify({is_enabled: true})
    })
        .done(function(data){
            $row.removeClass('warning');
            $row.addClass('success');
            $button.text('Disable');
            $button.unbind('click');
            $button.click(function(){
                disableMiddleware(deviceId, $row, $button)
            });
        })
        .fail(function( jqXHR, textStatus, errorThrown ){
            console.log("Error in request "+textStatus);
        });
}

function disableMiddleware(middlewareId, $row, $button)
{
    $.ajax({
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            url : 'http://192.168.1.10:8000/api/v1/middleware/'+middlewareId+'/?format=json&username='+localStorage.getItem('user_username')+'&api_key='+localStorage.getItem('user_api_key') ,
            type : 'PATCH',
            data : JSON.stringify({is_enabled: false})
        })
        .done(function(data){
            $row.removeClass('success');
            $row.addClass('warning');
            $button.text('Enable');
            $button.unbind('click');
            $button.click(function(){
                enableMiddleware(middlewareId, $row, $button)
            });
        })
        .fail(function( jqXHR, textStatus, errorThrown ){
            console.log("Error in request "+textStatus);
        });
}

function getMiddlewares()
{
    $.get(
        "http://192.168.1.10:8000/api/v1/middleware/",
        {
            format:'json',
            username:localStorage.getItem('user_username'),
            api_key:localStorage.getItem('user_api_key')
        },
        function( data ) {
            $.each(data.objects, function(i, item) {
                var $tr = $('<tr>');
                $tr.addClass('animated fadeIn');
                var $deleteButton = $('<button>');
                $deleteButton.addClass('btn btn-default')
                    .text('Delete');
                $deleteButton.click(function(){
                    deleteMiddleware(item.id, $tr, $deleteButton)
                });
                var $is_enabled = $('<button>')
                    .addClass('btn btn-default');
                if(item.is_enabled)
                {
                    $tr.addClass('success');
                    $is_enabled.text('Disable');
                    $is_enabled.click(function(){
                        disableMiddleware(item.id, $tr, $is_enabled)
                    });
                }
                else
                {
                    $tr.addClass('warning');
                    $is_enabled.text('Enable');
                    $is_enabled.click(function(){
                        enableMiddleware(item.id, $tr, $is_enabled)
                    });
                }
                $tr.append(
                    $('<td>').text(item.name),
                    $('<td>').append($is_enabled),
                    $('<td>').append($deleteButton)
                );
            $tr.appendTo('#middlewares-table');
            });
        }
    );
}

function addMiddleware()
{
    $.ajax({
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            url : 'http://192.168.1.10:8000/api/v1/middleware/?format=json&username='+localStorage.getItem('user_username')+'&api_key='+localStorage.getItem('user_api_key')+'&force=true' ,
            type : 'POST',
            data : JSON.stringify({
                name: $('#form-middleware-file').val().split('\\').pop().split('.')[0],
                file: middlewareFile
            })
        })
        .done(function(data){
            var n = noty({
                layout: "topRight",
                text: 'Middleware added successfully',
                theme: 'relax',
                type:'success',
                timeout: 2000,
                force: true,
                animation: {
                    open: 'animated fadeInDown',
                    close: 'animated fadeOutUp',
                    easing: 'swing',
                    speed: 500
                }
            });
            $('#middlewares-table tr').not(function(){if ($(this).has('th').length){return true}}).remove();
            getMiddlewares();
        })
        .fail(function( jqXHR, textStatus, errorThrown ){
            console.log("Error in request "+textStatus);
            console.log(jqXHR.responseText);
            var n = noty({
                layout: "topRight",
                text: 'Unable to add middleware',
                theme: 'relax',
                type:'error',
                timeout: 2000,
                animation: {
                    open: 'animated fadeInDown',
                    close: 'animated fadeOutUp',
                    easing: 'swing',
                    speed: 500
                }
            });
        });

}

function deleteMiddleware(middlewareId, $row, $button)
{
    $.ajax({
            headers : {
                'Content-Type' : 'application/json'
            },
            url : 'http://192.168.1.10:8000/api/v1/middleware/'+middlewareId+'/?format=json&username='+localStorage.getItem('user_username')+'&api_key='+localStorage.getItem('user_api_key') ,
            type : 'DELETE'
    })
        .done(function(data){
            $row.addClass('animated fadeOut');
            $row.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $row.remove();
            });
            var n = noty({
                layout:"topRight",
                text: 'Middleware deleted',
                theme: 'relax',
                type:'success',
                timeout: 2000,
                force: true,
                animation: {
                    open: 'animated fadeInDown',
                    close: 'animated fadeOutUp',
                    easing: 'swing',
                    speed: 500
                }
            });
        })
        .fail(function( jqXHR, textStatus, errorThrown ){
            console.log("Error in request "+textStatus);
            var n = noty({
                layout: "topRight",
                text: 'Unable to delete middleware',
                theme: 'relax',
                type:'error',
                timeout: 2000,
                animation: {
                    open: 'animated fadeInDown',
                    close: 'animated fadeOutUp',
                    easing: 'swing',
                    speed: 500
                }
            });
        });
}

var middlewareFile;
$(window).load(function(){
    getMiddlewares();
    $('#form-middleware-file').on('change', function (event) {
        files = event.target.files;
        $.each(files, function(i, file){
            var fileReader = new FileReader();
            fileReader.onload = function(fileReadEvent){
                middlewareFile = Base64.encode(fileReadEvent.target.result);
            };
            fileReader.readAsText(file);
            console.log();

        })
    });
});