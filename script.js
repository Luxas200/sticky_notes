document.querySelector('#takeNote').addEventListener('click', () => {
    const reset = document.createElement('button');
    reset.textContent='Cancel';
    reset.setAttribute('type','button');
    reset.setAttribute('id','resetButton');
    document.querySelector('#buttons').append(reset);

    const title = document.createElement('input');
    title.setAttribute('placeholder','Title');
    title.setAttribute('name','noteTitle');
    title.setAttribute('id','noteTitle');
    title.classList.add('inputStyle');
    document.querySelector('#inputNotes').prepend(title);
},{once:true});

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    const title=document.querySelector('#noteTitle').value;
    const notetext=document.querySelector('#takeNote').value;    
    const noteData = {
        title: title,
        notetext: notetext,
        completed: false
    };
    setNoteToLocal(noteData);
    addNote(noteData);        
    
});

function setNoteToLocal(noteData) {
    let notes = getNoteFromLocal();
    notes.push(noteData);
    localStorage.setItem('notes', JSON.stringify(notes));
};

document.querySelector('#buttons').addEventListener('click', (event) => {
    if (event.target.id === 'resetButton') {
        document.querySelector('#noteTitle').value='';
        document.querySelector('#takeNote').value='';
    }
});

window.addEventListener('load', ()=> {
    const notes = getNoteFromLocal();
    notes.forEach(noteData=>addNote(noteData));
});

function getNoteFromLocal() {
    try {
        const notes = JSON.parse(localStorage.getItem('notes'));
        return Array.isArray(notes) ? notes : [];
    }
    catch (error) {
        console.error('Error from localStorage', error);
        return [];
    }
};

function updateComleteStatus(title,completed) {
    let notes = getNoteFromLocal();
    notes= notes.map(note => {
       if (note.title === title) {
            return {
                title: note.title,
                notetext: note.notetext,
                completed: completed};       
       }
       else return note; 
    });
    localStorage.setItem('notes', JSON.stringify(notes));
};

function deleteNoteFromLocal(title) {
    let notes = getNoteFromLocal();
    notes = notes.filter(note=> note.title !== title);
    localStorage.setItem('notes', JSON.stringify(notes));
};

function addNote(noteData) {
    const note= document.createElement('div');
    note.classList.add('note');

    const noteTitle=document.createElement('h3');
    noteTitle.textContent=noteData.title;
    note.append(noteTitle);

    const noteContent = document.createElement('p');
    noteContent.textContent=noteData.notetext;

    if (noteData.completed) {
        noteContent.classList.add('crossed-out')
    };
    noteContent.addEventListener('click', () => {
        noteContent.classList.toggle('crossed-out');
        updateComleteStatus(noteData.title,noteContent.classList.contains('crossed-out'));        
    }); 
    note.append(noteContent);

    const deleteButtton = document.createElement('button');
    const deleteIcon = document.createElement('img');
    deleteIcon.setAttribute('src', 'img/removeImg.png');
    deleteIcon.setAttribute('alt', 'delete');
    deleteButtton.append(deleteIcon);
    deleteButtton.classList.add('delete-button');
    deleteButtton.addEventListener('click', () => {
        note.remove();
        deleteNoteFromLocal(noteData.title);
    });
    note.append(deleteButtton);

    const noteContainer = document.querySelector('#noteContainer');
    noteContainer.prepend(note);
};
