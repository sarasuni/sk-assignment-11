var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn =$(".save-note");
var $newNoteBtn =  $(".new-note");
var $noteList =$(".list-container .list-group");

//currentNote is used to keep track of the note in the textarea
var currentNote ={};

//A function for getting all notes from db
var getNotes = function (){
    return $.ajax ({
        url:"/api/notes",
        method:"GET"
    });
};

// A function for saving  a note  to the db
var saveNote = function (note){
    return $.ajax({
        url:"/api/notes",
        data:note,
        method:"POST"
    });
};

// Bonus - A function  for deleting  a note from the db
var deleteNote = function(id){
    return $.ajax({
        url:"/api/notes/"+id,
        method:"DELETE"
    });
};

// if there is a currentNote, display it otherwise render empty inputs
var renderCurrentNote = function(){
    $saveNoteBtn.hide();
    if (currentNote.id){
        $noteTitle.attr("readonly",true);
        $noteText.attr("readonly",true);
        $noteTitle.val(currentNote.title);
        $noteText.val(currentNote.text);
    } else{
        $noteTitle.attr("readonly",false);
        $noteText.attr("readonly",false);
        $noteTitle.val("");
        $noteText.val("");
    }
};
//Get the note data from the inputs, save it to the db and update the view
var handleNoteSave = function (){
    var newNote = {
        title:$noteTitle.val(),
        text:$noteText.val()
    };
    saveNote(newNote).then(function(data){
        getAndRenderNotes();
        renderCurrentNote();
    });
};

//delete the clicked note
var handleNoteDelete = function (event){
// prevents the click listener for the list from being called when the button inside of it is clicked
event.stopPropagation();
var note =$(this)
.parent(".list-group-item")
.data();

if (currentNote.id === note.id){
    currentNote ={};
}
deleteNote(note.id).then(function(){
    getAndRenderNotes();
    renderCurrentNote();
});
};

//sets and currentNote and displays it
var handleNoteView = function(){
    currentNote = $(this).data();
    renderCurrentNote();
};

//Sets the current note to and empty object and allows the user to enter a new note
var handleNewNoteView = function (){
    currentNote ={}
    renderCurrentNote();
};
//if a note's  little or next are empty , hide the save button 
//or else ahow it

var handleRenderSaveBtn = function(){
    if(!$noteTitle.val().trim() ||  !$noteText.val().trim()){
    $saveNoteBtn.hide();
    } else{
    $saveNoteBtn.show();
    }
};

//render's the list of note title
var renderNoteList = function(notes){
    $noteList.empty();
    var noteListItems = [];

    for (var i=0; i<notes.length; i++){
        var note =notes [i];
        var $li = $("<li class='list-group-item'>").data(note);
        var $span = $("<span>").text(note.title);
        var $deleteBtn = $("<i class='fas fa-trash-alt float-right text-danger delete-note'>");
        $li.append($span, $deleteBtn);
        noteListItems.push($li);
    }

    $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
var getAndRenderNotes = function(){
    return getNotes().then(function(data){
        renderNoteList(data);
    });
};

$saveNoteBtn.on("click",handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click",handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();