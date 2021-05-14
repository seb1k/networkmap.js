<?php

include('config.php');


if($password)
	{
	session_start ();

	if(!isset($_SESSION['password_ok']))
		{

		$pass_send = false;
		if(isset($_POST["pass"])) $pass_send=$_POST["pass"]; // PHP 7 syle



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





$POSTdataJSON = file_get_contents("php://input");

$POSTdata = json_decode($POSTdataJSON);


$configuration_file = $POSTdata->onSave->data->id;


$configuration_file = filter_filename( $configuration_file);

$FILE = realpath(dirname(__FILE__)) . '/map/' . $configuration_file;

$result = file_put_contents($FILE, json_encode($POSTdata, JSON_PRETTY_PRINT));

if ($result === false)
	{
	if(!is_writable($FILE))
		{
		echo json_encode(array(
			'status' => 'nok',
			'error' => 'Permission denied to write file:<br/>'.$FILE
		));
		exit;
		}
	echo json_encode(array(
		'status' => 'nok',
		'error' => 'Unknown: ' . realpath(dirname(__FILE__)) . ' conffile: ' . $configuration_file		
	));
	exit;	
	}

echo json_encode(array(
	'status' => 'ok',
	'error' => null
));






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


?>