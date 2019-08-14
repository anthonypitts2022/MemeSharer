/*
!Title : Sort an Arr of posts, returned in descending (newest first) order
!Auth  : Anthony Pitts
!Vers  : 1.0
!Date  : 8/13/19 *Last Mod
*/

var PostsDateSort = ( postsArr ) => {

  var date_sort_desc = function (date1, date2) {
  // This is a comparison function that will result in dates being sorted in
  // DESCENDING order.
  if (date1 > date2) return -1;
  if (date1 < date2) return 1;
  return 0;
  };

  //sorts through postArr and stores in a new sorted posts arr
  var sortedPostArr = postsArr.sort(function(a,b){
    return b.date - a.date;
  });

  //return the posts, sorted in descending order
  return sortedPostArr;

};

module.exports = { PostsDateSort };
