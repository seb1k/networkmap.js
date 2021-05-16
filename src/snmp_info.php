<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include('config.php');


$todo = false;
if(isset($_POST["todo"]))
	$todo = $_POST["todo"];


if(!$todo)
	die(json_encode(["Error|Nothing to do"]));

if($todo=="get_interface")
	{
	get_interface();
	}

if($todo=="get_image_menu")
	{
	get_image_menu();
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





?>