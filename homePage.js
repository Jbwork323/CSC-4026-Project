$("#add").click(function (e) {
  // Create new input and button elements
  var $question = $(
    '<input type="text" class="dynamic-input" placeholder="Enter question"/>',
  );
  var $breakline = $("<br></br>");
  var $answers = $(
    '<input type="text" class="dynamic-input" placeholder="Enter answers, comma seperated"/>',
  );
  var $addQuestion = $('<button class="dynamic-button">Add</button>');
  // Append elements to a specific part of the page, let's assume there's a container div with class 'dynamic-area'
  $(".dynamic-area").append($question, $answers, $addQuestion, $breakline);

  $addQuestion.click(function () {
    var answersArray = $answers.val().split(",");
    var $form = $("<form></form>");
    $form.append("<label>" + $question.val() + "</label><br>"); // Add the question as a label
    // Replace comma-separated answers from $answers into multiple choice options
    $.each(answersArray, function (index, value) {
      $form.append(
        '<input type="radio" name="question" value="' +
          value.trim() +
          '">' +
          value.trim() +
          "<br>",
      );
    });
    // Remove the initial input elements and breakline
    $question.remove();
    $answers.remove();
    $addQuestion.remove();
    $breakline.remove();
    // Append the form to the dynamic area
    $(".dynamic-area").append($form);
  });
});
