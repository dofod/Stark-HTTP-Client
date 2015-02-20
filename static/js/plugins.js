/**
 * Created by Saurabh on 10/02/2015.
 */
if(localStorage.getItem('user_username')==undefined && localStorage.getItem('user_api_key')==undefined){
    window.location.assign('/login/');
}
function getPlugins()
{
    $.get(
        "http://192.168.1.10:8000/api/v1/plugin/",
        {
            format:'json',
            username:localStorage.getItem('user_username'),
            api_key:localStorage.getItem('user_api_key')
        },
        function( data ) {
            $.each(data.objects, function(i, item) {
                var $tr = $('<tr>');
                $tr.addClass('animated fadeIn');
                var $events = $('<td>');
                $.each(item.events, function(eventIndex, event){
                    $events.append(event);
                    $events.append($('<br>'));
                });
                var $triggers = $('<td>');
                $.each(item.triggers, function(triggerIndex, trigger){
                    $triggers.append(trigger);
                    $triggers.append($('<br>'));
                });
                $tr.append(
                    $('<td>').text(item.name),
                    $events,
                    $triggers
                );
            $tr.appendTo('#plugins-table');
            });
        }
    );
}

function addPlugin()
{
    $.ajax({
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            url : 'http://192.168.1.10:8000/api/v1/plugin/?format=json&username='+localStorage.getItem('user_username')+'&api_key='+localStorage.getItem('user_api_key') ,
            type : 'POST',
            data : JSON.stringify({
                name: $('#form-plugin-file').val().split('\\').pop().split('.')[0],
                file: pluginFile
            })
        })
        .done(function(data){
            var n = noty({
                layout: "topRight",
                text: 'Plugin added successfully',
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
                text: 'Unable to add plugin',
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

var pluginFile;
$(window).load(function(){
    getPlugins();
    $('#form-plugin-file').on('change', function (event) {
        files = event.target.files;
        $.each(files, function(i, file){
            var fileReader = new FileReader();
            fileReader.onload = function(fileReadEvent){
                pluginFile = Base64.encode(fileReadEvent.target.result);
            };
            fileReader.readAsText(file);
            console.log();

        })
    });
});

