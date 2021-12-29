// Required modules
const fs = require ("fs");
const notesData = require("../notesdb/db.json");

module.exports= function (app){
    //function 
    function writeToDB(notes){
        //convert new JSON Array back to string
        notes =JSON.stringify(notes);
        console.log(notes);
        // writes string back to db.json
        fs.writeFileSync("./notesdb/db.json", notes, function(err){
            if(err){
                return console.log(err);
            }

        });
    }
    //API  routes
    //GET Method to return  all notes
    app.get ("/api/notes", function(req,res){
        res.json(notesData);
    });
    // POST  method to add notes
    app.post("/api/notes", function (req,res){
        //set unique id to entry
        if (notesData.length === 0){
            req.body.id = "0";
        } else {
            req.body.id=JSON.stringify(JSON.parse(notesData[notesData.length - 1].id)+1);
        }
        console.log("req.body.id: " + req.body.id);
        //pushes Body to JSON  array
        notesData.push(req.body);
        //write notes data to database
        writeToDB(notesData);
        console.log(notesData);
        //return new  note in Json format
        res.json(req.body);

    });

    //delete method
    app.delete("/api/notes/:id", function (req, res){
        //obtains id and converts to a string 
        let id = req.params.id.toString();
        console.log(id);
        // goes through notesArray searching for matching id
        for (i=0; i <notesData.length; i++){
            if  (notesData[i].id == id){
                console.log("match!");
                //resonds with deleted  note
                res.send(notesData[i]);
                // removes the deleted note
                notesData.splice(i,1);
                break;
            }
        }
        // Write notes data to database
        writeToDB(notesData);
    });
};