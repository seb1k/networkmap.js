<?php


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
set_error_handler( 'error_handler' );

include('functions.php');
include('config.php');


$TIMEOUT_RRD_DATA = 5*60; // maximum 5 minutes


// rrdtool lastupdate filename [--daemon|-d address]
$POSTdataJSON = file_get_contents("php://input");


$data = urldecode($POSTdataJSON);

$req = json_decode($data);

$final =[];

for($i=0;$i<count($req);$i++)
	{
	$url = trim($req[$i]->url);
	$script_time_start = microtime(true);
	$v = "";
    $error = "";
    $ret_object = false;
    $url_lower=strtolower($url);

    if	(request_already_send($url,$final))
        {
		$ret_object = get_previous_request($url,$final);
        }
    else
        {
        if	(str_starts_with($url_lower, 'http://') ||str_starts_with($url_lower, 'https://'))
            $ret_object = get_http($url);
        if	(str_starts_with($url_lower, 'snmp://') )
            $ret_object = get_snmp($url);
        if	(str_starts_with($url_lower, 'rrd:') )
            $ret_object = get_rrd($url);

        }

    if($ret_object)
        {
        $v      =   $ret_object->v;
        $error  =   $ret_object->error;
        }

	$execution_time = round((microtime(true) - $script_time_start)*1000);
	array_push($final,["elem"=>$i,"url"=>$url,"v"=>$v,"error"=>$error,"requesttime"=>$execution_time]);
	}
	


echo json_encode($final);


function request_already_send($url,$final)
{
for($i=0;$i<count($final);$i++)
	{
    if($final[$i]['url']==$url)
        return true;
    }
return false;
}

function get_previous_request($url,$final)
{
for($i=0;$i<count($final);$i++)
	{
    if($final[$i]['url']==$url)
        {
        $err_return = "Double query";
        if($final[$i]['error'])
            $err_return .= ", ".$final[$i]['error'];
        return (object)["v"=>$final[$i]['v'],"error"=>$err_return];
        }
    }
return (object)["v"=>"","error"=>"Unknow error in get_previous_request()"];
}


function get_http($link)
{
// use key 'http' even if you send the request to https://...
$options = array(
    'http' => array(
        'method'  => 'GET',
		'timeout' => 3
	),
	"ssl"=>array(
        "verify_peer"=>false,
        "verify_peer_name"=>false,
    ));
	
$context  = stream_context_create($options);
$result = @file_get_contents($link, false, $context);

if ($result === FALSE)
	{
    if(!isset($http_response_header)) // dns error ?
        return (object)["v"=>"","error"=>"HTTP request error"];
	$code=getHttpCode($http_response_header);
	return (object)["v"=>"","error"=>"HTTP error $code"];
	}


return (object)["v"=>$result,"error"=>""];
}


function getHttpCode($http_response_header)
{
if(is_array($http_response_header))
{
    $parts=explode(' ',$http_response_header[0]);
    if(count($parts)>1) //HTTP/1.0 <code> <text>
        return intval($parts[1]); //Get code
}
return 0;
}



function get_rrd($link)
{
global $TIMEOUT_RRD_DATA;

$link = substr($link,4); // remove "rrd:"

if(!@is_file( $link))
    {
    if(str_contains(error_get_last()["message"],"open_basedir restriction in effect"))
        return (object)["v"=>false,"error"=>"PHP error open_basedir restriction"];
    
    return (object)["v"=>false,"error"=>".rrd file missing"];
    }


exec("rrdtool lastupdate $link", $output, $retval);



list($date_v, $v) = explode(":", $output[2]);



if(str_contains($output[1],"ERROR: opening"))
    {
    return (object)["v"=>false,"error"=>"ERROR: opening file"];
    }

if(!$date_v||!$v)
    return (object)["v"=>false,"error"=>"missing data"];

$time_elapsed = time()-$date_v;

if($time_elapsed>$TIMEOUT_RRD_DATA)
    return (object)["v"=>false,"error"=>"The last data is too old"];

return (object)["v"=>$v,"error"=>""];
}






function get_snmp($link)
{

    // FAKE DATA
//return (object)["v"=>"1515;3333","error"=>""];

if (!function_exists('snmp2_get'))
    return (object)["v"=>"","error"=>"PHP SNMP is not activated on the server"];
$link = substr($link,7); // remove "snmp://"



$serv_info_split = explode('/', $link);

list($community, $ip) = explode('@', $serv_info_split[0]);

list($oid) = explode('|', $serv_info_split[1]);


return get_speed_port($ip, $community,$oid);
}






function get_speed_port($ip,$community,$oid)
{

if(!$oid || !is_numeric($oid))
	return (object)["v"=>"","error"=>"No interface $oid"];


//$ifInOctets = snmp2_get($ip, $community, "1.3.6.1.2.1.2.2.1.10.$oid"); // 32bits
//$ifOutOctets =  snmp2_get($ip, $community, "1.3.6.1.2.1.2.2.1.16.$oid"); // 32bits


 try {
$ifInOctets     =   snmp2_get($ip, $community, "1.3.6.1.2.1.31.1.1.1.6.$oid");
$ifOutOctets    =   snmp2_get($ip, $community, "1.3.6.1.2.1.31.1.1.1.10.$oid");
} catch (Exception $e) {
	return (object)["v"=>"","error"=>$e->getMessage()];
    //echo 'Exception reçue : ',  $e->getMessage(), "\n";
}

 


$ifInOctets =	(int)explode(' ',$ifInOctets)[1];
$ifOutOctets =	(int)explode(' ',$ifOutOctets)[1];
$ts = time();

$new_value = (object)["ifOutOctets"=>$ifOutOctets,"ifInOctets"=>$ifInOctets,"ts"=>$ts];

$FILE = "oid_info/$ip-$oid.txt";

$old_valueJSON = @file_get_contents ( $FILE);

$result = file_put_contents ( $FILE , json_encode($new_value));

if ($result === false)
	{
	if(!is_writable($FILE))
		{
		return (object)["v"=>"","error"=>"Cant write in directory oid_info"];
		}
	return (object)["v"=>"","error"=>"cant write file $FILE ( Unknow error )"];
	}

if($old_valueJSON === false)
	return (object)["v"=>"","error"=>"First data grabbing"];
$old_value = json_decode($old_valueJSON );




$speed = get_speed_kbps($old_value,$new_value);

if ($speed === false)
	{
	return (object)["v"=>"","error"=>"Check too early... Wait a few seconds"];
	}
return (object)["v"=>$speed,"error"=>""];
}


function get_speed_kbps($old_value,$new_value)
{

if(!isset($new_value->ifOutOctets))return false;
if(!isset($old_value->ifOutOctets))return false;

$byte_transfererOUT = $new_value->ifOutOctets - $old_value->ifOutOctets;
$byte_transfererIN = $new_value->ifInOctets - $old_value->ifInOctets;

$time_elapsed = $new_value->ts - $old_value->ts;

if($time_elapsed==0)
	return false;

return round(8*($byte_transfererIN /(1024))/$time_elapsed,1).";".round(8*($byte_transfererOUT /(1024))/ $time_elapsed,1);
}



function error_handler( $errno, $errmsg, $filename, $linenum, $vars )
  {
    // error was suppressed with the @-operator
    if ( 0 === error_reporting() )
      return false;

    if ( $errno !== E_ERROR )
      throw new \ErrorException( sprintf('%s: %s', $errno, $errmsg ), 0, $errno, $filename, $linenum );

}