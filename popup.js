$(document).ready(function() {
    if ($('#files').val().length===0){
      chrome.storage.sync.get(null, function(res){
        $("#files").val(res.raw);
        setCurrent(res.position);
      });
    }

    $('#files').bind('change', handleFileSelect);

});
var urlList = [];
var position = 0;
var totalLength = 0;

function printDetails(url){
  chrome.storage.sync.get(null, function(res){
    chrome.tabs.update(null, {
      url: 'http://' + url[res.position]
    });
  });
}

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
      'raw_array': data,
      'value': urlList,
      'position': position
    })
    printDetails(urlList);
}

function setCurrent(position){
  var current = parseInt(position) + 1
  $("#current").text(current);
}

// Navigation
$('#previous').on('click', function(){
  chrome.storage.sync.get(null, function(res){
    position = res.position;
    if(position>0){
      position--;
      setCurrent(position);
      chrome.storage.sync.set({
        'position': position
      }, function(){
        printDetails(res.value);
      });
    } else {
      alert("This is the first website");
    }
  })
});

$('#next').on('click', function(){
  chrome.storage.sync.get(null, function(res){
    position = res.position
    totalLength = res.value.length;
    if(position<(totalLength-1)){
      position++;
      setCurrent(position);
      chrome.storage.sync.set({
        'position': position
      }, function(){
        printDetails(res.value);
      });
    } else {
      alert("This is the last site");
    }
  })
});

// Ratings

$("#okay").on("click", function(){
  chrome.storage.sync.get(null, function(res){
    console.log(res);
    position = res.position;
    var raw = res['raw_array'];
    raw[position].push('Y');
    chrome.storage.sync.set({
      'raw_array': raw
    });
  })
})

$("#bad").on("click", function(){
  chrome.storage.sync.get(null, function(res){
    console.log(res);
    position = res.position;
    var raw = res['raw_array'];
    raw[position].push('N');
    chrome.storage.sync.set({
      'raw_array': raw
    });
  })
})

$("#grey").on("click", function(){
  chrome.storage.sync.get(null, function(res){
    console.log(res);
    position = res.position;
    var raw = res['raw_array'];
    raw[position].push('Grey');
    chrome.storage.sync.set({
      'raw_array': raw
    });
  })
})

// Get Results
$("#finish").on("click", function(){
  chrome.storage.sync.get(null, function(res){
    var raw = res.raw_array
    var joined = raw.join("\n");
    $("#finishedData").show();
    $("#finishedData").val(joined);
  });
})
