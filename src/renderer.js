window.addEventListener('DOMContentLoaded', () => {
    window.api.getFile().then(notes => {
        const notesList = document.getElementById('locations-list');
        let notesCounter = 0;
        notes.forEach(note => {
            notesCounter++;
        });
        if (notesCounter === 0) {
            notesList.innerHTML = `<p>No locations added yet</p>`;
        }
        notes.forEach(note => {
            const li = document.createElement('li');

            const title = document.createElement('span');
            title.className = 'title';
            title.textContent = note.title;

            const content = document.createElement('span');
            content.className = 'content';
            content.textContent = `: ${note.content}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => {
                window.api.deleteFile(note.title).then(() => {
                    li.remove();
                }).catch(error => console.error('Error deleting file:', error.message));
            };

            li.appendChild(title);
            li.appendChild(content);
            li.appendChild(deleteButton);
            notesList.appendChild(li);
        });
    }).catch(error => console.error('Error fetching notes:', error));
});
