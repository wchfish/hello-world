/**
 * Created by wangc on 2017/4/5.
 * 遍历一个页面包括主页面在内的所有iframe，采用深度优先的方法
 */

function getAllIframeWindows(currentWindow) {
  var iframeWindows = [], iframeWindow, childIframes, childIframeWindows;

  childIframes = currentWindow.document.getElementsByTagName('iframe');
  if (childIframes.length === 0) {
    iframeWindows.push(currentWindow);
    return iframeWindows;
  } else {
    for(var i = 0; i < childIframes.length; i++) {
        iframeWindow = childIframes[i].contentWindow;
        childIframeWindows = getAllIframeWindows(iframeWindow);
        iframeWindows = iframeWindows.concat(childIframeWindows);
    }
    iframeWindows.push(currentWindow);
    return iframeWindows;
  }
}

var frameWindows;
setTimeout(function(){
  frameWindows = getAllIframeWindows(window);
  frameWindows.forEach(function(iframeWindow, index) {
    var $links = iframeWindow.$('link');
  });
}, 2000);