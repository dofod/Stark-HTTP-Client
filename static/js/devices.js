/**
 * Created by Saurabh on 13/02/2015.
 */
if(localStorage.getItem('user_username')==undefined && localStorage.getItem('user_api_key')==undefined){
    window.location.assign('/login/');
}

function authorizeDevice(deviceId, $row, $button)
{
    $.ajax({
            headers : {
                'Content-Type' : 'application/json'
            },
            url : 'http://192.168.1.10:8000/api/v1/device/'+deviceId+'/?format=json&username='+localStorage.getItem('user_username')+'&api_key='+localStorage.getItem('user_api_key') ,
            type : 'PATCH',
            data : JSON.stringify({is_authorized: true})
    })
        .done(function(data){
            $row.removeClass('warning');
            $row.addClass('success');
            $button.text('Deny');
            $button.unbind('click');
            $button.click(function(){
                deauthorizeDevice(deviceId, $row, $button)
            });
        })
        .fail(function( jqXHR, textStatus, errorThrown ){
            console.log("Error in request "+textStatus);
        });
}

function deauthorizeDevice(deviceId, $row, $button)
{
    $.ajax({
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            url : 'http://192.168.1.10:8000/api/v1/device/'+deviceId+'/?format=json&username='+localStorage.getItem('user_username')+'&api_key='+localStorage.getItem('user_api_key') ,
            type : 'PATCH',
            data : JSON.stringify({is_authorized: false})
        })
        .done(function(data){
            $row.removeClass('success');
            $row.addClass('warning');
            $button.text('Allow');
            $button.unbind('click');
            $button.click(function(){
                authorizeDevice(deviceId, $row, $button)
            });
        })
        .fail(function( jqXHR, textStatus, errorThrown ){
            console.log("Error in request "+textStatus);
        });
}

function deleteDevice(deviceId, $row, $button)
{
    $.ajax({
            headers : {
                'Content-Type' : 'application/json'
            },
            url : 'http://192.168.1.10:8000/api/v1/device/'+deviceId+'/?format=json&username='+localStorage.getItem('user_username')+'&api_key='+localStorage.getItem('user_api_key') ,
            type : 'DELETE'
    })
        .done(function(data){
            $row.addClass('animated fadeOut');
            $row.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $row.remove();
            });
            var n = noty({
                layout:"topRight",
                text: 'Device deleted',
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
                text: 'Unable to delete device',
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

function getDevices()
{
    $.get(
        "http://192.168.1.10:8000/api/v1/device/",
        {
            format:'json',
            username:localStorage.getItem('user_username'),
            api_key:localStorage.getItem('user_api_key')
        },
        function( data ) {
            $.each(data.objects, function(i, item) {
                var isAuthorizedButton = $('<button>');
                isAuthorizedButton.addClass('btn btn-default');
                var $deleteButton = $('<button>');
                $deleteButton.addClass('btn btn-default')
                    .text('Delete');
                $deleteButton.click(function(){
                    deleteDevice(item.id, $tr, isAuthorizedButton)
                });
                var $tr = $('<tr>');
                $tr.addClass('animated fadeIn');
                if(item.is_authorized==false){
                    $tr.addClass('warning');
                    isAuthorizedButton.text('Allow');
                    isAuthorizedButton.click(function(){
                        authorizeDevice(item.id, $tr, isAuthorizedButton)
                    });
                }
                else{
                    $tr.addClass('success');
                    isAuthorizedButton.text('Deny');
                    isAuthorizedButton.click(function(){
                        deauthorizeDevice(item.id, $tr, isAuthorizedButton);
                    });
                }
                $tr.append(
                    $('<td>').text(item.name).css('text-align', 'center'),
                    $('<td>').append(isAuthorizedButton).css('text-align', 'center'),
                    $('<td>').append($deleteButton).css('text-align', 'center')
                );
            $tr.appendTo('#devices-table');
            });
        }
    );
}

$(window).load(getDevices());

function addDevice()
{
    $.ajax({
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            url : 'http://192.168.1.10:8000/api/v1/add-device/?format=json&username='+localStorage.getItem('user_username')+'&api_key='+localStorage.getItem('user_api_key') ,
            type : 'POST',
            data : JSON.stringify({
                name: $('#form-device-name').val(),
                password: $('#form-password').val()
            })
        })
        .done(function(data){
            var n = noty({
                layout:"topRight",
                text: 'Device added successfully',
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
            window.location.assign('/devices/');
        })
        .fail(function( jqXHR, textStatus, errorThrown ){
            console.log("Error in request "+textStatus);
            var n = noty({
                layout: "topRight",
                text: 'Unable to add Device',
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