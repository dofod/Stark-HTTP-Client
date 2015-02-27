/**
 * Created by Saurabh on 14/02/2015.
 */
if(localStorage.getItem('user_username')==undefined && localStorage.getItem('user_api_key')==undefined){
    window.location.assign('/login/');
}
function getUsers()
{
    $.get(
        "http://192.168.1.10:8000/api/v1/user/",
        {
            format:'json',
            username:localStorage.getItem('user_username'),
            api_key:localStorage.getItem('user_api_key')
        },
        function( data ) {
            $.each(data.objects, function(i, item) {
                var $tr = $('<tr>');
                $tr.addClass('animated fadeIn');
                $tr.append(
                    $('<td>').text(item.first_name),
                    $('<td>').text(item.username),
                    $('<td>').text(new Date(item.last_login).toDateString()),
                    $('<td>').text(item.email)
                );
            $tr.appendTo('#users-table');
            });
        }
    );
}

$(window).load(getUsers());