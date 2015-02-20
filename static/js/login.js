/**
 * Created by Saurabh on 10/02/2015.
 */
if(localStorage.getItem('user_username')!=undefined && localStorage.getItem('user_api_key')!=undefined){
    window.location.assign('/users/');
}

function login() {
    $.ajax({
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            url : 'http://192.168.1.10:8000/api/v1/api-key/' ,
            type : 'GET',
            timeout: 5000,
            data : {
                format:'json',
                username:$('#form-signin-username').val(),
                password: $('#form-signin-password').val()
            }
        })
        .done(function(data){
            $.each(data.objects, function(i, item) {
                localStorage.setItem('user_api_key', item.key);
                localStorage.setItem('user_username', $('#form-signin-username').val());
                localStorage.setItem('user_id', item.id);
            });
            window.location.assign('/users/');
        })
        .fail(function( jqXHR, textStatus, errorThrown ){
            console.log("Error in request "+textStatus);

            var n = noty({
                layout: "topRight",
                text: 'Login Unsuccessful',
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

function register() {
    $.ajax({
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            url : 'http://192.168.1.10:8000/api/v1/add-user/?format=json' ,
            type : 'POST',
            data : JSON.stringify({
                username: $('#form-register-username').val(),
                password: $('#form-register-password').val(),
                first_name: $('#form-register-name').val(),
                email: $('#form-register-email').val()
            })
        })
        .done(function(data){
            var n = noty({
                layout: "topRight",
                text: 'You have registered successfully please login',
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
                text: 'Unable to register',
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


