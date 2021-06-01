



/*
var viewportTRansform = document.getElementsByClassName('svg-pan-zoom_viewport')[0].style.transform
var velem = viewportTRansform.split(',')
var diffX=parseInt(velem[4])
var diffY=parseInt(velem[5])
*/

// https://github.com/jb-stack/Dia-vrt-sheets

// map.settings.purgeEditing()


//SVG(map.graph.node).image('img.png').move(290,15).back().draggable()
//SVG(map.graph.node).image('img.png').move(290,15).back().draggable()

var cache=[]

var link_selected = false;

//setTimeout(function(){   document.getElementById('but_nm_trigger').click()   }, 300);

setInterval(function(){ warning_bug_matrix(); }, 700);


function clean_edit()
{
triggerEvent(map.svg.node,'click')
//map.settings.purgeEditing()
}

function check_need_password(req,func_click_ok)
{
if(req =='{"status":"need_password","error":"need_password"}')
    {
    box_need_password(func_click_ok)
    return 1
    }
return 0
}

function box_need_password(func_click_ok)
{
new networkMap.widget.Modal().alert("Please enter the password to use this function<br/><br/><center><input id='the_password' type='password'></center><br/></input>", {title: 'Error'});

var btn = document.querySelector('.modal-footer').innerHTML = "<a href='#' class='btn' onclick='send_password();"+func_click_ok+"'>Ok</a>"
document.getElementById('the_password').focus();
}

function add_label(node,retry)
{
if(!node.options.bgImage) // check good object
    return

var imgbox =node.svg.node.querySelector('image').getBBox()

if(imgbox.width==0)
    {
    if(retry>100)
        {
        error('SVG img not loaded')
        return
        }
    retry++
    setTimeout(function(){add_label(node,retry), 50});
    return
    }


if(node.tspan)
    {
    node.tspan.remove()
    }


var label = map.graph.text(node.options.name)
.font({
    family:   node.options.fontFamily,
    size:     node.options.fontSize,
    anchor:   'start'
}).center(parseFloat(node.options.x+imgbox.width/2), parseFloat(node.options.y-15))

node.tspan=label
}


function click_div_grey()
{
dg('div_grey').style.display="none"
dg('menu_overlay').style.display="none"
}

function choose_image(src)
{
// Dispatch/Trigger/Fire the event
dg('but_choose_image').value=src; // ugly hack
dg('but_choose_image').dispatchEvent(new CustomEvent("change"));

click_div_grey() // close menu
}


function upload_image(elem)
{
for(var i=0;i<elem.files.length;i++)
    {
    var f = elem.files[i]
    var filename=f.name
    var reader = new FileReader();

    reader.addEventListener("load", upload_image_ajax(reader,filename), false);

    reader.readAsDataURL(f);
    }
}


function get_map_name()
{
var map_name = "weathermap"
if($_get('map'))
    map_name = $_get('map');
return map_name
}

function save_map()
{
//map.settings.purgeEditing() // prevent bug with selection (if _setupSVG)

var map_name = encodeURIComponent(get_map_name())
var map_data = encodeURIComponent(JSON.stringify(map.getConfiguration()))
var ret = get_POST_data("ajax_functions.php","todo=save_map&map_name="+map_name+"&map_data="+map_data)

if(check_need_password(ret,"save_map()")) return;

if(ret!="ok")
    {
    var ret = JSON.parse(ret)
    new networkMap.widget.Modal()
        .alert('There was an error while saving the weathermap (' + ret.error + ')', {title: 'Error'});
    return
    }

var b = document.getElementById('SaveButton')
b.innerHTML = "Ok"
b.className="btn btn-success pull-right"
b.disabled=true

setTimeout(function() {
    b.innerHTML = "Save"
    b.className="btn btn-primary pull-right"
    b.disabled=false
    }, 1000)

    /*
//flush array request
request_server = [];
request_AJAX = [];
map.$updateQ = {};

// flush all link request
for(var i=0;i<map.links.length;i++)
    {
    //map.links[i]._setupSVG(map.links[i].options) // more bugs !
    //map.links[i].subLinks.nodeA.primaryLink.setupEvents() // more bugs !
    }
// go request
//map.batchUpdate()
*/
}


var go_imagemenu = false;
function upload_image_ajax(reader,filename)
{

if(reader.readyState!=2)
    {
    setTimeout(function(){  upload_image_ajax(reader,filename)    }, 100);
    return 
    }
filename = encodeURIComponent(filename)
var imgdata = encodeURIComponent(reader.result)
var ret = get_POST_data("ajax_functions.php","todo=upload_image&filename="+filename+"&imgdata="+imgdata)



if(ret == "ok")
    {
    clearTimeout(go_imagemenu);
    go_imagemenu = setTimeout(function(){   imagemenu()    }, 300);
    }
}



function imagemenu()
{
var ret = get_POST_data("ajax_functions.php","todo=get_image_menu")
if(check_need_password(ret,"imagemenu()")) return;

dg('div_grey').style.display="block"
dg('menu_overlay').style.display="block"



var imgs = JSON.parse(ret)

var HTML ="<label for='upload_image_input'>"
HTML +="<div style='height:60px;background-color:#eee;text-align: center;'>"
HTML +="<svg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='40px' height='50px' 	 viewBox='0 0 312.602 312.602' style='enable-background:new 0 0 312.602 312.602;' xml:space='preserve'> <path style='fill:#000002;' d='M251.52,137.244c-3.966,0-7.889,0.38-11.738,1.134c-1.756-47.268-40.758-85.181-88.448-85.181c-43.856,0-80.964,32.449-87.474,75.106C28.501,129.167,0,158.201,0,193.764c0,36.106,29.374,65.48,65.48,65.48h54.782c4.143,0,7.5-3.357,7.5-7.5c0-4.143-3.357-7.5-7.5-7.5H65.48c-27.835,0-50.48-22.645-50.48-50.48c0-27.835,22.646-50.48,50.48-50.48c1.367,0,2.813,0.067,4.419,0.206l7.6,0.658l0.529-7.61c2.661-38.322,34.861-68.341,73.306-68.341c40.533,0,73.51,32.977,73.51,73.51c0,1.863-0.089,3.855-0.272,6.088l-0.983,11.968l11.186-4.367c5.356-2.091,10.99-3.151,16.747-3.151c25.409,0,46.081,20.672,46.081,46.081c0,25.408-20.672,46.08-46.081,46.08c-0.668,0-20.608-0.04-40.467-0.08c-19.714-0.04-39.347-0.08-39.999-0.08c-4.668,0-7.108-2.248-7.254-6.681v-80.959l8.139,9.667c2.667,3.17,7.399,3.576,10.567,0.907c3.169-2.667,3.575-7.398,0.907-10.567l-18.037-21.427c-2.272-2.699-5.537-4.247-8.958-4.247c-3.421,0-6.686,1.548-8.957,4.247l-18.037,21.427c-2.668,3.169-2.262,7.9,0.907,10.567c1.407,1.185,3.121,1.763,4.826,1.763c2.137,0,4.258-0.908,5.741-2.67l7.901-9.386v80.751c0,8.686,5.927,21.607,22.254,21.607c0.652,0,20.27,0.04,39.968,0.079c19.874,0.041,39.829,0.081,40.498,0.081c33.681,0,61.081-27.4,61.081-61.08C312.602,164.644,285.201,137.244,251.52,137.244z'/></svg>"
HTML +="<div style='display: inline-block;top: -19px;position: relative;left: 10px;'>Upload new image...</div></div></label>"
HTML +="<input id='upload_image_input' type='file' value='Upload' onchange='upload_image(this)' accept='image/*' style='display:none' multiple>"


for (var img in imgs)
	{
    HTML += "<div style='width:100px;height:130px;display:inline-block;margin: auto;cursor:pointer;text-align:center;'>"
    HTML += "<img src='img/"+imgs[img]+"' onclick='choose_image(\""+imgs[img]+"\")' style='max-width:100px;max-height:100px;  margin: auto;'/>"
    HTML += "<div style='padding-top:5px;width:100%;font-size:smaller;color:#888;text-overflow: ellipsis;white-space: nowrap;overflow:hidden'>"+no_extension(imgs[img])+"</div>"
    HTML += "</div>"
	}

dg('menu_overlay').innerHTML = HTML
}



function rnd(v,r)
{
return Math.round(v/r)*r
}


function no_extension(filename)
{
return filename.split('.').slice(0, -1).join('.')
}



function screenToSVG(screenX, screenY) {
    var p = SVG(map.graph.node).node.createSVGPoint()
     p.x = screenX
     p.y = screenY
     return p.matrixTransform(SVG(map.graph.node).node.getScreenCTM());
 }

 
function SVGToScreen(screenX, screenY) {
    var p = SVG(map.graph.node).node.createSVGPoint()
     p.x = screenX
     p.y = screenY
     return p.matrixTransform(SVG(map.graph.node).node.getScreenCTM().inverse());
 }
	
function value_to_txt(value,link)
{
var unit = '%'


if(link)
	{
	var link_show_speed = link.properties.properties.link_show_speed

    if(link_show_speed=="auto")
        {
        if (value > 1000*1000 ) link_show_speed="gbps"
        else if (value > 1000 ) link_show_speed="mbps"
        else                    link_show_speed="kbps"
        }

	if(link_show_speed=="kbps")
		{
		unit = 'K'
		}
	else if(link_show_speed=="mbps")
		{
		unit = 'M'
		value/=1024;
		}
	else if(link_show_speed=="gbps")
		{
		unit = 'G'
		value/=(1024*1024);
		}
	}
/*

// Doit recuperer la vitesse du lien
if(unit=="%" && link.properties.properties.link_show_speed)
    {
    value =   calc_percentage(value,speed_link)
    }
*/
if(value < 10)
	value = Math.round(value*10)/10
else
	value = Math.round(value)


return value + unit;
}


function change_request_type(e)
{

link_selected.properties.properties.request_type=e.value

var lnk = e.closest('.nm-accordion').querySelectorAll('.nm-input-text')

if(e.value=="SNMP") // remove sublink info
    {
    lnk[0].querySelector('input').value=""
    lnk[1].querySelector('input').value=""
    triggerEvent(lnk[0].querySelector('input'),'change')
    triggerEvent(lnk[1].querySelector('input'),'change')
    }

// simulate click
//link_selected.configurationWidget.toElement(link_selected, link_selected.properties)

//triggerEvent(node,'dragstart')
//triggerEvent(node,'dragmove') 
//triggerEvent(node,'dragend')

document.getElementById('simple_menu_html').innerHTML = simple_menu_html(link_selected)
}


function simple_menu_html(link)
{
var MENU_HTML =""
var request_type = false

var PROP = link.properties.properties
var reqHTTP=reqRRD=reqSNMP=""

if(PROP.request_type)
	{
	request_type = PROP.request_type
	var sel ="selected='selected'"
	if(request_type=="HTTP")	reqHTTP=sel
	if(request_type=="RRD")		reqRRD=sel
	if(request_type=="SNMP")	reqSNMP=sel
	}
	
MENU_HTML += "<div>Request type <select onchange='change_request_type(this);upd_LINK()' name='request_type' id='request_type'><option value='HTTP' "+reqHTTP+">HTTP</option><option value='RRD' "+reqRRD+">RRD</option><option value='SNMP' "+reqSNMP+">SNMP</option></select></div>"

var need_sublink_menu = 1;



if(request_type=="SNMP")
	{
	need_sublink_menu=0;
	MENU_HTML += "<div><input onchange='upd_LINK()'  onkeyup='upd_LINK();refresh_interface(0)' id='link_info_ip' placeholder='IP' value='"+(PROP.link_info_ip??"")+"'/></div>"
	MENU_HTML += "<div><input onchange='upd_LINK()'  onkeyup='upd_LINK();refresh_interface(0)' id='link_info_community' placeholder='Community' value='"+(PROP.link_info_community??"public")+"'/></div>"
    var is_DISABLED="DISABLED"
    if(PROP.link_info_ip) is_DISABLED=""
	MENU_HTML += "<div><button id='but_refresh_interface' onclick='refresh_interface(1)' "+is_DISABLED+">Get interface</button></div>"
	MENU_HTML += "<div id='info_refresh'></div>"
	
    setTimeout(function(){   refresh_interface(0)    }, 0);
    
	var opt_interface= "";
	if(PROP.lnk_interface)
		opt_interface= "<option value='"+PROP.lnk_interface+"' >"+PROP.lnk_interface.split('|')[1]+"</option>"
	MENU_HTML += "<div>Interface <select name='interface' id='lnk_interface' onchange='upd_LINK()'>"+opt_interface+"</select></div>"
	
	var nodeAname = link.nodeA.options.name
	var nodeBname = link.nodeB.options.name
	
	var isnodeA=isnodeB=""
	if(PROP.link_ip_is)
		{
		var sel ="selected='selected'"
		if(PROP.link_ip_is=="nodeA")	isnodeA=sel
		if(PROP.link_ip_is=="nodeB")	isnodeB=sel
		}
		

	
	MENU_HTML += "<div>IP is on &nbsp;  &nbsp; <select id='link_ip_is' onchange='upd_LINK();link_callbackSNMP(link_selected)'><option value='nodeA' "+isnodeA+">"+nodeAname+"</option><option value='nodeB'  "+isnodeB+">"+nodeBname+"</option></select></div>"
	
	var o1=o2=o3=o4=o5=""
	
	if(PROP.link_show_speed)
		{
		var sel ="selected='selected'"
		if(PROP.link_show_speed=="kbps")	o1=sel
		if(PROP.link_show_speed=="mbps")	o2=sel
		if(PROP.link_show_speed=="gpbs")	o3=sel
		if(PROP.link_show_speed=="auto")	o4=sel
		if(PROP.link_show_speed=="%")		o5=sel
		}
		
	MENU_HTML += "<div>Show in <select id='link_show_speed' onchange='upd_LINK();link_selected.redraw()'><option value='auto' "+o4+">Kbps/Mbps/Gbps</option><option value='kbps' "+o1+">Kbps</option><option value='mbps'  "+o2+">Mbps</option><option value='gbps' "+o3+">Gbps</option><option value='prc' "+o5+">%</option></select></div>"
	

	if(link_selected.error)
		{
		MENU_HTML += "<div style='color:#c00'>"+link_selected.error+"</div>"
		}
		
	// empty other requests
	}

setTimeout(function(){   change_submemnu(request_type)    }, 0);
    

return MENU_HTML
}


function change_submemnu(request_type)
{
var menu_sublnk =  document.querySelector('.nm-accordion').querySelectorAll('.nm-input-text')
if(request_type=="SNMP")
    {
    menu_sublnk[0].style.display="none"
    menu_sublnk[1].style.display="none"
    }
else
    {
    menu_sublnk[0].style.display=""
    menu_sublnk[1].style.display=""
    }
}



function upd_LINK()
{
var PROP = link_selected.properties.properties

var req = dg('request_type').value

if(req=="SNMP")
    {
    PROP.link_info_ip		=	dg('link_info_ip').value
    PROP.link_info_community=	dg('link_info_community').value
    PROP.lnk_interface		=	dg('lnk_interface').value
    PROP.link_ip_is			=	dg('link_ip_is').value
    PROP.link_show_speed	=	dg('link_show_speed').value
    PROP.requestUrl		=	"snmp://"+PROP.link_info_community+"@"+PROP.link_info_ip+"/"+PROP.lnk_interface

    var but = dg('but_refresh_interface')
    if(PROP.link_info_ip)
        but.disabled = false;
    else
        but.disabled = true;
    
    }
}




function refresh_interface(force)
{
var ip = dg('link_info_ip').value
var community = dg('link_info_community').value

if(!ip) return;

var cache_key = "ajax_functions.php-todo=get_interface&ip="+ip+"&community="+community

var ret = false;
if(cache[cache_key])
    {
    ret = cache[cache_key]
    }

if(force)
    {
    ret = get_POST_data("ajax_functions.php","todo=get_interface&ip="+ip+"&community="+community)
    if(check_need_password(ret,"refresh_interface(1)")) return;
    cache[cache_key] = ret
    }

if(!ret)
    return;

var ifaces = JSON.parse(ret)

if(ifaces[0].startsWith('Error|') && !force)
    {
    return;
    }
	
var select_elem = dg('lnk_interface')


var opt_selected = select_elem.value

select_elem.innerHTML ="";





for(var i=0;i<ifaces.length;i++)
	{
    var ifc =  ifaces[i]
	var opt = document.createElement("option");
	opt.value = ifc
	opt.text = ifc.split('|')[1]

    if(opt_selected==ifc)
        opt.selected = 'selected';
	select_elem.add(opt, null);
	}


}


function dg(x){return document.getElementById(x);}





function  svg_add_shadow()
{
var defs = document.getElementById('SvgjsSvg1000').querySelector('defs');
var filter = createOn(defs,'filter',{    id:"dropshadowNODE",    height:"180%"});
var feGaussianBlur = createOn(filter,'feGaussianBlur',{    in:"SourceAlpha",    stdDeviation:"3"});
var feOffset = createOn(filter,'feOffset',{    dx:2,    dy:2,    result:"offsetblur"});
var feComponentTransfer = createOn(filter,'feComponentTransfer');
var feFuncA = createOn(feComponentTransfer,'feFuncA',{    type:"linear",    slope:"0.2"});

var feMerge = createOn(filter,'feMerge');
var feMergeNode = createOn(feMerge,'feMergeNode');
var feMergeNode = createOn(feMerge,'feMergeNode',{    in:"SourceGraphic"});
}


function createOn( dad, name, attrs, text ){
    var svg = dad.ownerSVGElement, doc = dad.ownerDocument;
    var ns = createOn.$NAMESPACES;
    var defaultNS = svg.namespaceURI;
    if (!ns){
      ns = createOn.$NAMESPACES = {};
      for (var a=svg.attributes,i=a.length;i--;) if (a[i].prefix=='xmlns') ns[a[i].localName] = a[i].nodeValue;
    }
    var p = name.split(':');
    var el = p[1] ? doc.createElementNS(ns[p[0]],p[1]) : doc.createElementNS(defaultNS,name);
    for (var a in attrs){
      p = a.split(':');
      if (p[1]) el.setAttributeNS(ns[p[0]],p[1],attrs[a]);
      else      el.setAttributeNS(null,a,attrs[a]);
    }
    if (text) el.appendChild(doc.createTextNode(text));
    return dad.appendChild(el);
  }





function send_password()
{
var pass_input=document.querySelector('#the_password')

if(!pass_input.value) return;

pass_input.closest('.modal').remove()

var ret = get_POST_data("ajax_functions.php","todo=pass&pass="+pass_input.value)

if(ret == "password_ok")
    {
    return;
    }
else if(ret=="wrong_password")alert('Wrong password')
else alert(ret)
}



function warning_bug_matrix()
{
if(map._mode=="normal")
    return;

if(Math.round(panZoomTiger.getZoom()*100)==100)
	return // Zoom is OK


if(warningbox.style.display=="none") // show + remove link edition
    {
    warningbox.style.display="block"
    }
}

function warning_bug_restore_view()
{
panZoomTiger.zoom(1)

warningbox.style.display="none"
map.graph.style("transform: matrix(1, 0, 0, 1, 0, 0);")
document.getElementsByClassName('svg-pan-zoom_viewport')[0].style.transform = "matrix(1, 0, 0, 1, 0, 0)"


// simulate click on all elements
for(var i=0;i<map.nodes.length;i++)
    {
    var node = map.nodes[i].svg.node
    triggerEvent(node,'dragstart')
    triggerEvent(node,'dragmove') 
    triggerEvent(node,'dragend')
    }
}

function triggerEvent( elem, event ) {
    var clickEvent = new Event( event ); // Create the event.
    elem.dispatchEvent( clickEvent );    // Dispatch the event.
  }


function id2name(x)
{
for(var i=0;i<map.nodes.length;i++)
    {
    var n = map.nodes[i]
    if(n.options.id==x)
        return n.options.name
    }
}

function SVG2node(SVG)
{
for(var i=0;i<map.nodes.length;i++)
    {
    var n = map.nodes[i]
    if(n.svg.node==SVG)
        return n.options
    }
return false;
}

function node2ID(x)
{
for(var i=0;i<map.nodes.length;i++)
    {
    var n = map.nodes[i]
    if(n==x)
        return i
    }
return false
}

function link2ID(x)
{
for(var i=0;i<map.links.length;i++)
    {
    var n = map.links[i]
    if(n==x)
        return i
    }
return false
}



function first_free_id()
{
for(var i=1;i<50;i++)
    {
    if(!check_id_exist("node"+i))
        {
        return "node"+i
        }
    }
return false
}

function check_id_exist(id)
{
for(var i=0;i<map.nodes.length;i++)
    {
    var n = map.nodes[i]
    if(n.options.id==id)
        return true
    }
return false
}



function new_node()
{
var new_id = first_free_id()

var viewportTRansform = document.getElementsByClassName('svg-pan-zoom_viewport')[0].style.transform
var velem = viewportTRansform.split(',')
var diffX=parseInt(velem[4])
var diffY=parseInt(velem[5])

/*
var node = { id: new_id, name: new_id, x: 290-diffX, y: 50-diffY, renderer: "rect",  label: {position: "internal", visable: "true"},
padding: "12", graph: map, draggable:  undefined }
*/

var node = { id: new_id, name: new_id, x: 290-diffX, y: 50-diffY, renderer: "rect",  label: {position: "internal", visable: "true"},
padding: "12", graph: map, draggable:  undefined }


map.addNode(new networkMap.Node(node), false);

document.getElementById('but_nm_trigger').click()
document.getElementById('but_nm_trigger').click()
}


function new_link(nodeA,nodeB)
{
var link = {//  inset: "10", connectionDistance: "10", staticConnectionDistance: "30", arrowHeadLength: "10", width: "10", background: "#777",
nodeA:  {id:nodeA.id,name: "Gi0/1","requestUrl": "http://random_data",      //,"href": "http://example.com"
},
nodeB:  {id:nodeB.id,name: "Gi0/1","requestUrl": "http://random_data", },graph: map}
var newlink = map.addLink(new networkMap.Link(link), false);
}































var function_link = false;
var linkA = false;
var linkAsvg = false;
function lnk_but(e)
{

var AddButton = document.getElementById('AddButton')
var SaveButton = document.getElementById('SaveButton')
var deleteButton = document.getElementById('deleteButton')


if(e.target.classList.contains('btn-success'))
    {
    e.target.className="btn btn-danger"
    AddButton.style.visibility = "hidden"
    SaveButton.style.visibility = "hidden"
    deleteButton.style.visibility = "hidden"
    function_link=true
    }
else
    {
    e.target.className="btn btn-success"
    AddButton.style.visibility = "visible"
    SaveButton.style.visibility = "visible"
    deleteButton.style.visibility = "visible"
    function_link=false;

    if(linkA) // try to link to new element
        {
        linkAsvg.setAttribute("fill", "#ddd")
        }
    linkA = false
    }
}





function function_link_click(t)
{
var SVGParent = t.closest('g')
var nodeIDclick = SVG2node(SVGParent)


if(!nodeIDclick)   
    {
    error('NO ID : '+SVGParent)
    return
    }


var click_ok = 0;

if(linkA == nodeIDclick) // return to normal
    {
    var elemcolor = SVGParent.firstChild
    elemcolor.setAttribute("fill", "#ddd")
    linkA = false
    return;
    }

if(linkA) // try to link to new element
    {


    // LINK !
    new_link(linkA,nodeIDclick)

    // return to normal

    linkAsvg.setAttribute("fill", "#ddd")
    linkA = false
    return;
    }



linkA = nodeIDclick
var elemcolor = SVGParent.firstChild
linkAsvg=elemcolor
elemcolor.setAttribute("fill", "#bd362f")
}






function get_POST_data(url,postdata)
{
var xhr_object = new XMLHttpRequest();

xhr_object.open("POST", url, false);
xhr_object.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhr_object.send(postdata);
if(xhr_object.readyState == 4 && xhr_object.status == 200) return(xhr_object.responseText);
else return(false);
}

function get_data(url,callback)
{
var req = new XMLHttpRequest();

req.open("GET", url, true);

req.onreadystatechange = function() {
    try {
        if ( req.readyState == 4 && req.status == 200) {
            callback({value:req.responseText})
            return
        }

        if (  req.readyState == 4 && req.status == 404) {
            log('Error 404 for '+url)
            return;
        }
    }
    catch (ex) {
        error('Error parsing response. '+req.status);

        return false;
    }
}
try {
    req.send ();
}
catch (ex) {
    error ('Something went wrong with the request.');
    callback({value:0})
    return false;
}
}

function get_data_server(url,postinfo)
{
var req = new XMLHttpRequest();

req.open("POST", url, true);

req.onreadystatechange = function() {
    try {
        if(req.status == 200)
            {

            if (  req.readyState == 4) {

                use_request_get_data(req.responseText)
				return
            }
            return;
            }
        if (  req.readyState == 4 && req.status == 404) {
            error('server 404')
            return;
        }
        if (  req.status == 500) {
            error('Server error 500')
            return;
        }
    }
    catch (ex) {
        error('Error parsing response. '+req.status+'--'+req.readyState);
        return false;
    }
}
try {
    req.send (postinfo);
}
catch (ex) {
    error ('Something went wrong with the request.');
    return false;
}
}



var request_server = [];
var request_AJAX = [];

function get_data_v(url,request)
{
var callback = request.callback


if(url.indexOf('http://random_data')!=-1)
    {
    request.callback({value:Math.random()* 100,error:""})
    //request_server[r.elem].callback({value:{value:r.v,error:r.error}})
    //request.callback({value:{value:Math.random()* 100,error:""}})
    return
    }


if(!testSameOrigin(url))
    {
    request_server.push({callback:callback,url:url})
    start_timeout_grab_data();
    return
    }


if(url)
    {
    request_AJAX.push(function(){get_data(url,callback)})
    start_timeout_grab_data();
    }


}



var timeout_grab_data = false;

function start_timeout_grab_data()
{
clearTimeout(timeout_grab_data);
timeout_grab_data = setTimeout(function(){    go_interval()    }, 300);
}

var interval_go_grab_data = false;
function go_interval()
{
clearInterval(interval_go_grab_data);
interval_go_grab_data = setInterval(function(){go_grab_data(); }, map.properties.properties.refreshInterval*1000);
go_grab_data();
}


function go_grab_data()
{
for(var i=0;i<request_AJAX.length;i++)
    request_AJAX[i]();

get_data_server("request_server.php",encodeURIComponent(JSON.stringify(request_server)))
}

function testSameOrigin(url) {

var loc = window.location,
    a = document.createElement('a');

a.href = url;

return a.hostname == loc.hostname &&
        a.port == loc.port &&
        a.protocol == loc.protocol;
}

function link_callbackSNMP(link)
{
	
var value1= value2=false;

if(link.value==="") return
if(link.value)
	{
	var splited = link.value.split(';')
	value1 = splited[0]
	value2 = splited[1]
	}

if(link.properties.properties.link_ip_is=="nodeA")
	{
	// invertion
	var buf = value2
	value2 = value1
	value1 = buf
	}

// Attribute the value to the sublink

link.subLinks.nodeA.value = value1
link.subLinks.nodeB.value = value2

var nodeAspeed = link.properties.properties.nodeA.speed
var nodeBspeed = link.properties.properties.nodeB.speed

// sublink A & B

link.subLinks.nodeA.setUtilizationLabel();
link.subLinks.nodeB.setUtilizationLabel();

var primarylinkA = link.subLinks.nodeA.primaryLink
var primarylinkB = link.subLinks.nodeB.primaryLink

var prc_A = calc_percentage(value1,nodeAspeed)
var prc_B = calc_percentage(value2,nodeBspeed)



primarylinkA.updateBgColor(primarylinkA.getLink().colormap.translate(prc_A));
primarylinkB.updateBgColor(primarylinkB.getLink().colormap.translate(prc_B));
}

function calc_percentage(speed_kb,speed_link)
{
var speed_mb = speed_kb/1024
if(!speed_link) speed_link = 100;
var prc = 100/speed_link*speed_mb
return prc;
}
	

function use_request_get_data(d)
{

try {
    var all_ret = JSON.parse(d)
} catch(e) {
    error(e);
    warn('bad JSON :'+d)
    return false;
}



for(var i=0;i<all_ret.length;i++)
    {
    var r = all_ret[i];
    request_server[r.elem].callback({value:r.v,error:r.error})
    }
}

function $_get(name){
    var param = location.search
    if(location.hash)
        param += location.hash.replace('#', '&');
    
    if(name=(new RegExp('[?#&]'+encodeURIComponent(name)+'=([^&]*)')).exec(param))
        return decodeURIComponent(name[1]);
    }

log = function() {    return Function.prototype.bind.call(console.log, console);}();
warn = function() {    return Function.prototype.bind.call(console.warn, console);}();
error = function() {    return Function.prototype.bind.call(console.error, console);}();


