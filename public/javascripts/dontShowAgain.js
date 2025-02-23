$("#closeModal").on("click", function() {
  if($('#showModalCheck').is(':checked')) {
    try {
      fetch('/play/hideTutorial');
    } catch (error) {
      console.error('Error:', error);
    }
  }
})

