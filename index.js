let fs = require("fs");
let url = require("url");
let http = require("http");
let ejs = require("ejs");

function getnextoddnumber() {

    try {
       var data = fs.readFileSync("nextodd.json");
       var obj = JSON.parse(data);
    } catch (err) {
       var obj = {"n":1000001}; 
    }

    obj.n += 2;

    fs.writeFileSync("nextodd.json", JSON.stringify(obj), (err) => {
        if (err) throw err;
        //console.log('The file has been saved!');
    });

    return obj.n;
}

function save_record(record) 
{
    try {
        var data = fs.readFileSync("records.json");
        var obj = JSON.parse(data);
     } catch (err) {
        var obj = {"lastupdate":new Date().getTime(), "records":[]}; 
     }

     obj.lastupdate = new Date().getTime();
     obj.records.push(record);

     fs.writeFileSync("records.json", JSON.stringify(obj), (err) => {
        if (err) throw err;
        //console.log('The file has been saved!');
    });

}



function read_records() 
{
    try {
        var data = fs.readFileSync("records.json");
        var obj = JSON.parse(data);
     } catch (err) {
        var obj = {"lastupdate":new Date().getTime(), "records":[]}; 
     }
    return obj;
}

// var record = read_records().records;
// save_record(record);
// return;

http.createServer((req, res)=>
{
    let urlobj = url.parse(req.url, true);

    console.log('>>'+urlobj.pathname)

    if (urlobj.pathname=="/")
    {
        let records = read_records();

        let str = ejs.render(fs.readFileSync("index.html","utf8"), {records:records});
        //console.log(str)
        res.writeHead(200,{'Content-Type': 'text/html'});
        res.write(str);
        res.end();
 
    }
    else if (urlobj.pathname=="/task")
    {
        res.writeHeader(200,{"Content-Type":"application/json"});
        res.write(JSON.stringify({"n":getnextoddnumber()}));
        res.end();
    }
    else if (urlobj.pathname=="/answer")
    {
        save_record(urlobj.query);
        res.writeHeader(200,{"Content-Type":"text/html"});
        res.write("New record was saved");
        res.end();       
    }

}).listen(8080,()=>{
    console.log("Server started. Port 8080");
});