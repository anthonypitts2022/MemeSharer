//==============================================================================
//                      _       _
//  _ __ ___   ___   __| |_   _| | ___
// | '_ ` _ \ / _ \ / _` | | | | |/ _ \
// | | | | | | (_) | (_| | |_| | |  __/
// |_| |_| |_|\___/ \__,_|\__,_|_|\___|
//
//==============================================================================
/*
!Title : mamba dates
!Auth  : mambanerd
!Vers  : 1.0
!Date  : 6/22/19 *Last Mod
!Desc  : Handles the date formatting
*/

// The setDate paramater must be a date object eg new Date
// The format paramater must exist on the switch case below
const dateFormat = (setDate, format) => {
  const date = setDate
  let dd = date.getDate()
  let mm = date.getMonth() + 1
  let yyyy = date.getFullYear()
  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }
  switch (format) {
    case 'mm-dd-yyyy':
      return mm + '-' + dd + '-' + yyyy
      break
    default:
      return date
  }
}

module.exports = { dateFormat }
