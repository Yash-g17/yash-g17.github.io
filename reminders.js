/* 
	Structure of reminders object:
	{
		"<course_name>": [
			{
				"key": ,
				"title": ,
				"date": ,
				"time":
			},
		],	
	}
*/

const reminderForm = document.querySelector("#reminder-form");
const remindersDisplay = document.querySelector("#reminders-display");
const COURSE = remindersDisplay.getAttribute("course");

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
	Returns the JSON form of the reminders object from localStorage.
	If the reminders object does not exist, it is created using BASE_OBJ.
*/
const getRemindersObj = () => {
	if (!localStorage.reminders) storeRemindersObj(BASE_OBJ);
	return JSON.parse(localStorage.getItem("reminders"));
};

/* 
	Receives the reminders object, and puts it into localStorage.
	The remindersDisplay must also be refreshed.
*/
const storeRemindersObj = (reminders) => {
	localStorage.setItem("reminders", JSON.stringify(reminders));
	refreshRemindersDisplay();
};

/* 
	Creates a reminder using the info provided by the user in the form (this = form element). Generates a random key to indentify the reminder.
	Adds it to the appropriate course of the reminders object.
*/
const addReminder = function (e) {
	e.preventDefault();

	const reminders = getRemindersObj(),
		key = Math.random();

	const reminder = {
		key,
		title: this[0].value,
		date: this[1].value,
		time: this[2].value
	};

	reminders[COURSE].push(reminder);
	storeRemindersObj(reminders);
	reminderForm.reset();
};

/* 
	Removes the reminder, corresponding to the clicked reminder-delete button, from the appropriate course of the reminders object.
	Uses the key obtained from the parent div of the reminder-delete button to delete the correct reminder.
*/
const removeReminder = function (e) {
	e.preventDefault();

	const reminders = getRemindersObj(),
		key = this.parentElement.id;

	reminders[COURSE] = reminders[COURSE].filter(
		(reminder) => reminder.key != key
	);

	storeRemindersObj(reminders);
};

/* 
	Checks if reminders of the appropriate course of the reminders object are due.
	Assign a special class to due reminders.
*/
const areRemindersDue = () => {
	const courseReminders = getRemindersObj()[COURSE];

	courseReminders.forEach((reminder) => {
		if (Date.now() >= Date.parse(`${reminder.date} ${reminder.time}`)) {
			document.getElementById(reminder.key).classList.add("reminder-due");
		}
	});
};

/* 
	Refreshes the remindersDisplay by:
	1. Clearing it.
	2. Generating the html for each of the reminders present in the appropriate course of the reminders object. 
	3. Checks if reminders are due.
	4. Adds click listeners to the delete-reminder buttons of each reminder.
*/
const refreshRemindersDisplay = () => {
	const courseReminders = getRemindersObj()[COURSE];
	remindersDisplay.innerHTML = "";

	courseReminders.forEach((reminder) => {
		const reminderHTML = `
			<div class="noteCard my-2 mx-2 card" style="width: 18rem;">
				<div class="card-body" id="${reminder.key}">
					<h3	class="card-text">${reminder.title}</h3>
					<p class="card-text">Due on <strong>${reminder.date}</strong> at <strong>${reminder.time}</strong>.</p>
					<button class="btn btn-secondary reminder-delete">Delete</button>
				</div>
			</div>
		`;
		remindersDisplay.innerHTML += reminderHTML;
	});

	areRemindersDue();

	document
		.querySelectorAll(".reminder-delete")
		.forEach((deleteBtn) =>
			deleteBtn.addEventListener("click", removeReminder)
		);
};

refreshRemindersDisplay();
reminderForm.addEventListener("submit", addReminder);

// Makes sure that areRemindersDue is fired every minute, exactly when time changes from one minute to the next.
const msUntilNextMinute = 60000 - (new Date().getTime() % 60000);
setTimeout(() => {
	areRemindersDue();
	setInterval(areRemindersDue, 60000);
}, msUntilNextMinute + 500);
