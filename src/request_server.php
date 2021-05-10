<?php


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


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

	if	(str_starts_with($url_lower, 'http://') ||str_starts_with($url_lower, 'https://'))
		$ret_object = get_http($url);
    if	(str_starts_with($url_lower, 'snmp://') )
        $v = get_snmp($url);
    if	(str_starts_with($url_lower, 'rrd:') )
        $ret_object = get_rrd($url);

    if($ret_object)
        {
        $v      =   $ret_object->v;
        $error  =   $ret_object->error;
        }

	$execution_time = round((microtime(true) - $script_time_start)*1000);
	array_push($final,["elem"=>$i,"v"=>$v,"url"=>$url,"error"=>$error,"requesttime"=>$execution_time]);
	}
	


echo json_encode($final);




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

@file_get_contents("http://example.com");


function get_snmp($link)
{
return false;
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












