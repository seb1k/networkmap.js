



/*

var viewportTRansform = document.getElementsByClassName('svg-pan-zoom_viewport')[0].style.transform
var velem = viewportTRansform.split(',')
var diffX=parseInt(velem[4])
var diffY=parseInt(velem[5])

*/
//setTimeout(function(){   document.getElementById('but_nm_trigger').click()   }, 300);

setInterval(function(){ warning_bug_matrix(); }, 500);

//setTimeout(function(){    svg_add_shadow()    }, 300);

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

var ret = get_POST_data("update.php","pass="+pass_input.value)

if(ret == "password_ok")
    {
    document.getElementById('SaveButton').click()
    }
else if(ret=="wrong_password")alert('Wrong password')
else alert(ret)
}



function warning_bug_matrix()
{


if(map._mode=="normal") return;

var view_ok = 1
if(map.svg.node.viewBox.animVal)
    {
    if(map.svg.node.viewBox.animVal.x) view_ok =0
    if(map.svg.node.viewBox.animVal.y) view_ok =0
    }

if(document.getElementsByClassName('svg-pan-zoom_viewport')[0].style.transform != "matrix(1, 0, 0, 1, 0, 0)") view_ok =0


if (view_ok) return // everything's OK

if(warningbox.style.display=="none") // show + remove link edition
    {
    warningbox.style.display="block"
    }
}

function warning_bug_restore_view()
{
warningbox.style.display="none"
document.getElementsByClassName('svg-pan-zoom_viewport')[0].style.transform = "matrix(1, 0, 0, 1, 0, 0)"

var bbox = map.svg.node.getBBox()

map.svg.viewbox(1,0,0,1,0,0)

warning_bug_matrix()

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


var node = { id: new_id, name: new_id, x: 290-diffX, y: 50-diffY, renderer: "rect",  label: {position: "internal", visable: "true"},
padding: "12", graph: map, draggable:  undefined }


map.addNode(new networkMap.Node(node), false);

document.getElementById('but_nm_trigger').click()
document.getElementById('but_nm_trigger').click()
}


function new_link(nodeA,nodeB)
{

var link = {  inset: "10", connectionDistance: "10", staticConnectionDistance: "30", arrowHeadLength: "10", width: "10", background: "#777",
nodeA:  {id:nodeA.id,name: "Gi0/1","requestUrl": "http://random_data", requestData: {
    hostname: "node1",
    column: "1"
},
      //,"href": "http://example.com"
},
nodeB:  {id:nodeB.id,name: "Gi0/1","requestUrl": "http://random_data", requestData: {
    hostname: "node1",
    column: "1"
},},
graph: map
}
log('link NON')
log(link)
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
var SVGParent = t.parentElement
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
    log("use server for "+url)
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

function go_interval()
{
setInterval(function(){go_grab_data(); }, map.properties.properties.refreshInterval*1000);
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


log = function() {    return Function.prototype.bind.call(console.log, console);}();
warn = function() {    return Function.prototype.bind.call(console.warn, console);}();
error = function() {    return Function.prototype.bind.call(console.error, console);}();


