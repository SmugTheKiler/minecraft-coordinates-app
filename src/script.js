const title_el = document.getElementById('title');
title_el.innerText = api.title;


const note_title_el = document.getElementById('locationTitle');
const note_content_el = document.getElementById('coordinates'); 
const note_submit_el = document.getElementById('locationSubmit');

const errorField = document.getElementById('errorField')

// function to check if string contains integer
function containsInteger(str) {
    return /\d/.test(str);
}
// function to check if string contains letter
function containsLetter(str) {
    return /[a-zA-Z]/.test(str);
}

note_submit_el.addEventListener('click', async () => {
	const title = note_title_el.value;
	const content = note_content_el.value;

	// check for empty
	if(content == '') {
		errorField.innerText = 'Please enter the coordinates!'
		return;
	} else if(title == '') {
		errorField.innerText = 'Please enter a title!'
		return;
	}

	// Validate
	if(content.length > 32) {
		errorField.innerText = 'The coordinates are too long!'
		return;
	} else if(title.length > 32) {
		errorField.innerText = 'The title is too long!'
		return;
	} else if(containsInteger(content) == false) {
		errorField.innerText = 'The coordinates must contain numbers!'
		return;
	} else if(containsLetter(content) == true) {
		errorField.innerText = 'Coordinates can\'t have letters!'
		return;
	}

	// try incase of some random error
	try {
	const res = await api.createFile({
		title,
		content
	})

	console.log(res);

	// reset form
	note_title_el.value = "";
	note_content_el.value = "";

	if(res == false) {
		errorField.innerText = 'Something went wrong!'
	} else {
		errorField.innerText = 'Location saved!'
	};

	// error handle
	} catch (error) {
		console.error(error);
		alert(error);
		errorField.innerText = 'Something went really wrong!'
	};
});