/* 
	Structure of notes object:
	{
		"<course_name>": [
			{
				"key": ,
				"desc":
			},
		],	
	}
*/

const noteForm = document.querySelector("#note-form");
const notesDisplay = document.querySelector("#notes-display");
const COURSE = notesDisplay.getAttribute("course");

const BASE_OBJ = {
	CSF111: [],
	MATHF112: [],
	MATHF113: [],
	EEEF111: [],
	PHYF111: [],
	BITSF110: [],
	BITSF111: [],
	BITSF112: [],
	PHYF110: [],
	CHEMF110: [],
	BIOF110: [],
	MEF112: []
};

/* 
	Returns the JSON form of the notes object from localStorage.
	If the notes object does not exist, it is created using BASE_OBJ.
*/
const getNotesObj = () => {
	if (!localStorage.notes) storeNotesObj(BASE_OBJ);
	return JSON.parse(localStorage.getItem("notes"));
};

/* 
	Receives the notes object, and puts it into localStorage.
	The notesDisplay must also be refreshed.
*/
const storeNotesObj = (notes) => {
	localStorage.setItem("notes", JSON.stringify(notes));
	refreshNotesDisplay();
};

/* 
	Creates a note using the info provided by the user in the form (this = form element). Generates a random key to indentify the note.
	Adds it to the appropriate course of the notes object.
*/
const addNote = function (e) {
	e.preventDefault();

	const notes = getNotesObj(),
		key = Math.random();

	const note = {
		key,
		desc: this[0].value
	};

	notes[COURSE].push(note);
	storeNotesObj(notes);
	noteForm.reset();
};

/* 
	Removes the note, corresponding to the clicked note-delete button, from the appropriate course of the notes object.
	Uses the key obtained from the parent div of the note-delete button to delete the correct note.
*/
const removeNote = function (e) {
	e.preventDefault();

	const notes = getNotesObj(),
		key = this.parentElement.id;

	notes[COURSE] = notes[COURSE].filter((note) => note.key != key);

	storeNotesObj(notes);
};

/* 
	Refreshes the notesDisplay by:
	1. Clearing it.
	2. Generating the html for each of the notes present in the appropriate course of the notes object. 
	3. Adds click listeners to the delete-note buttons of each note.
*/
const refreshNotesDisplay = () => {
	const courseNotes = getNotesObj()[COURSE];
	notesDisplay.innerHTML = "";

	courseNotes.forEach((note) => {
		const noteHTML = `
			<div class="noteCard my-2 mx-2 card" style="width: 18rem;">
				<div class="card-body" id="${note.key}">
					<p class="card-text">${note.desc}</p>
					<button class="btn btn-secondary note-delete">Delete</button>
				</div>
			</div>
		`;
		notesDisplay.innerHTML += noteHTML;
	});

	document
		.querySelectorAll(".note-delete")
		.forEach((deleteBtn) =>
			deleteBtn.addEventListener("click", removeNote)
		);
};

refreshNotesDisplay();
noteForm.addEventListener("submit", addNote);
