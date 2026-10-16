APP_TITLE = 'Create a Contact from Forms';

const MONTHS_NAME_TO_NUMBER = {
  "January": 1,
  "February": 2,
  "March": 3,
  "April": 4,
  "May": 5,
  "June": 6,
  "July": 7,
  "August": 8,
  "September": 9,
  "October": 10,
  "November": 11,
  "December": 12
}

/**
 * Creates a Google Contact using the form responses.
 */
function onFormSubmit(e) {
  try {
    const personData = getFormResponses(e);
    const res = People.People.createContact(buildPersonObject(personData));
    if (res !== null && res !== {}) {
      console.log(`Successfully added ${res.names[0].displayName}`);
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * Returns a JSON object with a property for each form question/answer.
 * Each property is named after form response title.
 */
function getFormResponses(e) {
  let personData = buildEmptyPersonDataObject();
  const itemResponses = e.response.getItemResponses();
  itemResponses.forEach(itemResponse => {
    const question = itemResponse.getItem().getTitle();
    const answer = itemResponse.getResponse();
    personData[question] = answer;
  });
  return personData;
}

/**
 * Builds a JSON object to store form responses to use to create a contact.
 */
function buildEmptyPersonDataObject() {
  return {
    "First Name": '',
    "Middle Name (optional)": '',
    "Last Name": '',
    "Preferred Name (optional)": '',
    "Phone Number": '',
    "Phone Number Type": '',
    "Email Address": '',
    "Email Address Type": '',
    "Birth Month": '',
    "Birth Day": ''
  };
}

/**
 * Builds a JSON Person object that complies with Google's People API:
 * https://developers.google.com/people/api/rest/v1/people#Person
 */
function buildPersonObject(personData) {
  return {
    "birthdays": buildBirthdaysObject(personData["Birth Month"], personData["Birth Day"]),
    "emailAddresses": buildEmailAddressesObject(personData["Email Address"], personData["Email Address Type"]),
    "names": buildNamesObject(personData["First Name"], personData["Middle Name (optional)"], personData["Last Name"]),
    "nicknames": buildNicknamesObject(personData["Preferred Name (optional)"]),
    "phoneNumbers": buildPhoneNumbersObject(personData["Phone Number"], personData["Phone Number Type"])
  }
}

function buildBirthdaysObject(birthMonth, birthDay) {
  if (birthMonth !== '' && birthDay !== '') {
    return [
      {
        "date": {
          "year": 0,
          "month": getMonthNumber(birthMonth),
          "day": birthDay
        }
      }
    ];
  } else { return []; }
}

function buildEmailAddressesObject(emailAddress, type) {
  if (emailAddress !== '' && type !== '') {
    return [
      {
        "value": emailAddress,
        "type": type
      }
    ]
  } else { return []; }
}

function buildNamesObject(firstName, middleName, lastName) {
  if (firstName !== '' && lastName !== '') {
    return [
      {
        "givenName": firstName,
        "familyName": lastName,
        "middleName": middleName
      }
    ]
  } else { return []; }
}

function buildNicknamesObject(preferredName) {
  if (preferredName !== '') {
    return [
      {
        "value": preferredName,
        "type": "DEFAULT"
      }
    ];
  } else { return []; }
}

function buildPhoneNumbersObject(phoneNumber, type) {
  if (phoneNumber !== '' && type !== '') {
    return [
      {
        "value": phoneNumber,
        "type": type
      }
    ]
  } else { return []; }
}

/**
 * Transforms a full month (e.g., March) into a number that matches its order in the annual calendar (e.g., 3).
 */
function getMonthNumber(monthName) {
  return MONTHS_NAME_TO_NUMBER[monthName];
}
