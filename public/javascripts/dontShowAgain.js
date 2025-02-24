$("#closeModal").on("click", function() {
  if($('#showModalCheck').is(':checked')) {
    try {
      fetch('/users/hideTutorial', {
        method: 'POST',
      }).catch(error => console.error('Error:', error));
    } catch (error) {
      console.error('Error:', error);
    }
  }
})

