//==============================================================================
//                      _       _
//  _ __ ___   ___   __| |_   _| | ___
// | '_ ` _ \ / _ \ / _` | | | | |/ _ \
// | | | | | | (_) | (_| | |_| | |  __/
// |_| |_| |_|\___/ \__,_|\__,_|_|\___|
//
//==============================================================================
/*
!Title : isMongodbid
!Auth  : mambanerd
!Vers  : 1.0
!Date  : 6/22/19 *Last Mod
!Desc  : Tests that a the parameter passed is a mongodbid
*/

// Checks if the company ID exists

var ObjectID = require('mongodb').ObjectID
const isMongodbid = value => ObjectID.isValid(value)

module.exports = isMongodbid
