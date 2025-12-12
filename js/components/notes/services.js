const NotesService = {
  saveNotes(notes, nextNoteId) {
    Storage.set('quickNotes', notes);
    Storage.set('nextNoteId', nextNoteId);
  },
  loadNotes() {
    return Storage.get('quickNotes') || [];
  }
};
