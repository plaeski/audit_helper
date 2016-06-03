$(document).ready(function() {
    if ($('#files').val().length===0){
      chrome.storage.sync.get(null, function(res){
        $("#files").val(res.raw);
      });
    }

    $('#files').bind('change', handleFileSelect);

});
var urlList = [];
var position = 0;
var totalLength = 0;

$('#previous').on('click', function(){
  chrome.storage.sync.get(null, function(res){
    position = res.position;
    if(position>0){
      position--;
      chrome.storage.sync.set({
        'position': position
      }, function(){
        printDetails(res.value);
      });
    }
  })
});

$('#next').on('click', function(){
  chrome.storage.sync.get(null, function(res){
    position = res.position
    totalLength = res.value.length;
    if(position<(totalLength-1)){
      position++;
      chrome.storage.sync.set({
        'position': position
      }, function(){
        printDetails(res.value);
      });
    }
  })
});

function printDetails(url){
  chrome.storage.sync.get(null, function(res){
    console.log(res);
    chrome.tabs.update(null, {
      url: 'http://' + url[res.position]
    });
  });
}

//   chrome.tabs.update(null, {
//     url: 'http://'+url[position]
// });
  // window.location.assign('http://' + url[position])

function handleFileSelect(evt) {
  chrome.storage.sync.clear();
  var file = evt.target.value; // FileList object
  selectUrls(file);
}

function selectUrls(file) {
    var data = $.csv.toArrays(file);
    for(var row in data) {
      urlList.push(data[row][0]);
      totalLength++;
    }
    chrome.storage.sync.set({
      'raw': file,
      'value': urlList,
      'position': position
    })
    printDetails(urlList);
}
