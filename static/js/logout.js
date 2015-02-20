/**
 * Created by Saurabh on 15/02/2015.
 */

function logout()
{
    localStorage.removeItem('user_username');
    localStorage.removeItem('user_api_key');
    localStorage.removeItem('user_id');
    window.location.assign('/login/');
}