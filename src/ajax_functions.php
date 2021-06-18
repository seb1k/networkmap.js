<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include('functions.php');
include('config.php');



$todo = false;
if(isset($_POST["todo"]))
	$todo = $_POST["todo"];


if(!$todo)
	die( json_encode(array(	'status' => 'error', 'error' => 'Nothing to do'	)));


if($todo=="pass")
	{
	check_need_password();
	}
if($todo=="get_interface")
	{
	check_need_password();
	get_interface();
	}

if($todo=="get_image_menu")
	{
	get_image_menu();
	}
if($todo=="upload_image")
	{
	check_need_password();
	do_upload_image();
	}
if($todo=="save_map")
	{
	check_need_password();
	save_map();
	}





function save_map()
{
$map_name=false;
$map_data=false;
if(isset($_POST["map_name"]))
	$map_name = $_POST["map_name"];
if(isset($_POST["map_data"]))
	$map_data = $_POST["map_data"];

if(!$map_name)die('map_name missing !');
if(!$map_data)die('map_data missing !');


$POSTdata = json_decode($map_data);

$FILE = realpath(dirname(__FILE__)) . '/map/' . filter_filename( $map_name).".json";

$result = @file_put_contents($FILE, json_encode($POSTdata));

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

echo "ok";
}



function do_upload_image()
{
$filename=false;
$imgdata=false;
if(isset($_POST["filename"]))
	$filename = $_POST["filename"];
if(isset($_POST["imgdata"]))
	$imgdata = $_POST["imgdata"];

if(!$filename)die('missing filename');
if(!$imgdata)die('missing image data');

$filename = filter_filename($filename);

// only imagedata after the comma ','

$imgdata = explode(',',$imgdata)[1];



if(file_put_contents ("img/".$filename , base64_decode ( $imgdata )) !== false)
 	echo "ok";

}

function get_image_menu()
{
$dir    = 'img';


$scanned_directory = array_diff(scandir("img"), array('..', '.'));




echo json_encode($scanned_directory);
}

function get_interface()
{
$ip 		= $_POST["ip"];;
$community 	= $_POST["todo"];
if (!function_exists('snmp2_real_walk'))
	{
	echo json_encode(["Error|PHP SNMP is not activated on the server"]);
	die();
	}

// NAME 1.3.6.1.2.1.1.1.0
$ip = $_POST["ip"];
$community = $_POST["community"];
	
//$a = snmp2_real_walk($ip, $community, "1.3.6.1.2.1.2.2.1.2");

$ifaces = @snmp2_real_walk($ip, $community, "1.3.6.1.2.1.2.2.1.2");


if ($ifaces === FALSE)
	{
    if(str_contains(error_get_last()["message"],"No response from"))
		{
		echo json_encode(["Error|No response from $ip"]);
		die();
		}
	else
		{
		echo json_encode(["Error|SNMP Unknow error"]);
		die();
		}
	}


$return_table=[];


foreach($ifaces as $i => $value) {
	
	$oid =trim(explode('.', $i)[1]);
	$name =trim(explode(': ', $value)[1]);
	array_push($return_table,$oid."|".$name);
}

echo json_encode($return_table);
}



