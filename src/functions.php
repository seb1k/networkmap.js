<?php




function check_need_password()
{
global $password;
if($password)
    {
    session_start ();

    if(!isset($_SESSION['password_ok']))
        {

        $pass_send = false;
        if(isset($_POST["pass"]))
            $pass_send=$_POST["pass"];

        if(!$pass_send)
            {
            echo json_encode(array(
                'status' => 'need_password',
                'error' => 'need_password'
            ));
            exit;
            }
        elseif($pass_send === $password)
            {
            $_SESSION['password_ok'] = 1;
            echo "password_ok";
            exit;
            }
        else
            {
            echo "wrong_password";
            exit;
            }
        }
    }
}


function filter_filename( $name ) {
    // remove illegal file system characters https://en.wikipedia.org/wiki/Filename#Reserved_characters_and_words
    $name = str_replace(array_merge(
        array_map('chr', range(0, 31)),
        array('<', '>', ':', '"', '/', '\\', '|', '?', '*')
    ), '', $name);
    // maximise filename length to 255 bytes http://serverfault.com/a/9548/44086
    $ext = pathinfo($name, PATHINFO_EXTENSION);
    $name= mb_strcut(pathinfo($name, PATHINFO_FILENAME), 0, 255 - ($ext ? strlen($ext) + 1 : 0), mb_detect_encoding($name)) . ($ext ? '.' . $ext : '');
    return $name;
    }
    




// PHP 7 compatibility

if (!function_exists('str_starts_with')) {
    function str_starts_with($haystack, $needle) {
        return (string)$needle !== '' && strncmp($haystack, $needle, strlen($needle)) === 0;
    }
}
if (!function_exists('str_ends_with')) {
    function str_ends_with($haystack, $needle) {
        return $needle !== '' && substr($haystack, -strlen($needle)) === (string)$needle;
    }
}
if (!function_exists('str_contains')) {
    function str_contains($haystack, $needle) {
        return $needle !== '' && mb_strpos($haystack, $needle) !== false;
    }
}