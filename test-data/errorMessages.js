const errorMessages = {
  invalidUserId: 'Invalid user id',
  userDoesNotExist: 'User does not exist',
  excessBodyInRequest: 'Request body is not needed here',
  longNameLength: 'Name length must be less than or equal to 30 characters',
  shortNameLength: 'Name length must be more than or equal to 3 characters',
  missingNameField: 'Missing required field: name',
  nameFieldWithProhibitedCharacters: 'The name field should contain only Latin characters',
  longJobField: 'The job length must be less than or equal to 15 characters',
  shortJobField: 'The job length must be more than or equal to 3 characters',
  jobFieldWithProhibitedCharacters: 'The job field should contain only Latin characters',
  missingJobField: 'Missing required field: job',
  missingResponseBody: 'Missing body request',
  bodyInNotJson: 'Provided request body is not in JSON format',
}

export default errorMessages;