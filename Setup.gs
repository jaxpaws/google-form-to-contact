function setUp() {
  installTrigger_()
}

/**
 * Installs trigger to capture onFormSubmit event when a form is submitted.
 * Ensures that the trigger is only installed once.
 * Called by setup().
 */
function installTrigger_() {
  if (doesTriggerAlreadyExist()) {
    return;
  }
  const triggerUniqueId = ScriptApp.newTrigger('onFormSubmit')
    .forForm(FormApp.getActiveForm())
    .onFormSubmit()
    .create()
    .getUniqueId();
  PropertiesService.getScriptProperties().setProperty(
    "triggerUniqueId",
    triggerUniqueId
  );
  console.log(`Trigger with the following unique ID was created: ${triggerUniqueId}`);
}

function doesTriggerAlreadyExist() {
  const propTriggerId = 
    PropertiesService.getScriptProperties().getProperty('triggerUniqueId');
  if (propTriggerId !== null) {
    for (const t in triggers) {
      if (triggers[t].getUniqueId() === propTriggerId) {
        console.log(
          `Trigger with the following unique ID already exists: ${propTriggerId}`
        );
        return true;
      }
    }
  }
  return false;
}

/**
 * Removes all script properties and triggers for the project.
 * Use primarily to test setup routines.
 */
function removeTriggersAndScriptProperties() {
  PropertiesService.getScriptProperties().deleteAllProperties();
  // Removes all triggers associated with project.
  const triggers = ScriptApp.getProjectTriggers();
  for (const t in triggers) {
    ScriptApp.deleteTrigger(triggers[t]);
  }
}

/**
 * Removes all form responses to reset the form.
 */
function deleteAllResponses() {
  FormApp.getActiveForm().deleteAllResponses();
}
