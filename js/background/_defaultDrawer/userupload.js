(function () {
  // 图片、视频上传器
  var iovuploader = new dialog({
    content: _REQUIRE_('../htmls/iovuploader.html'),
    class: "iovuploader",
  })
  // @note 将cancel按钮修改为div，防止表单submit到cancel
  // @edit at 2024/1/30 15:20

  // Dom
  var iovuploaderf = iovuploader.getDialogDom();
  // 取消
  util.query(iovuploaderf, '.cancel').onclick = function (e) {
    e.preventDefault();
    iovuploader.close();
  }
  // 提交
  util.query(iovuploaderf, 'form').onsubmit = function (e) {
    e.preventDefault();
    // 类型 image(图片) / video(视频)
    var type = util.query(iovuploaderf, '.uploadi').checked ? 'image' : 'video';
    // url?
    var url = util.query(iovuploaderf, 'input[type="url"]').value;
    // File?
    var file = util.query(iovuploaderf, 'input[type="file"]').files[0];
    // 先把背景设置对话框中的图片src重置
    util.query(d, '.zdy .left img').src = '';
    if (file) {
      // File优先

      // 将内容写入idb
      initsto.set('upload', file, true, function () {
        iovuploader.close();
        getUserUploadUrl(function (r) {
          // 获取并设置背景设置对话框中的图片src
          util.query(d, '.zdy .left img').src = r;
        })
        setbg({
          type: "default",
          data: {
            type: "userbg"
          }
        })
      });

      // 设置存储
      initsto.set('userbg', {
        type: type,
        useidb: true
      })
    } else {
      initsto.set('userbg', {
        type: type,
        url: url
      })
      iovuploader.close();
      getUserUploadUrl(function (r) {
        // 获取并设置背景设置对话框中的图片src
        util.query(tab1, '.zdy .left img').src = r;
        setbg({
          type: "default",
          data: {
            type: "userbg"
          }
        })
      })
    }

    util.query(tab1, '.noBg').style.display = 'none';
    util.query(tab1, '.hasBg').style.display = 'block';
    util.query(tab1, '.zdy .editbtn').style.display = 'block';
  }

  // 获取用户上传图片、视频URL
  function getUserUploadUrl(cb) {
    var a = initsto.get('userbg');
    // 没有上传，直接返回false
    if (!a) {
      cb(false);
      return;
    }

    if (a.type == 'video') {
      // 视频
      var b = a.useidb;
      if (b) {
        // 来自用户本地上传，从idb提取，获取视频快照返回
        initsto.get('upload', true, function (blob) {
          getVideoCaptrue(URL.createObjectURL(blob), function (c) {
            cb(c);
          });
        })
      } else {
        // 来自外站，尝试获取视频快照返回
        try {
          getVideoCaptrue(a.url, function (c) {
            cb(c);
          });
        } catch (e) {
          //失败（CORS|>400）
          cb(false);
        }
      }
    } else if (a.type == 'image') {
      var b = a.useidb;
      if (b) {
        // 来自用户本地上传，从idb提取返回
        initsto.get('upload', true, function (blob) {
          cb(URL.createObjectURL(blob));
        })
      } else {
        // 来自外站，直接返回
        cb(a.url);
      }
    }
  }



  //获取视频快照
  function getVideoCaptrue(url, callback) {
    var video = document.createElement('video');
    video.src = url;
    video.crossOrigin = 'anonymous';

    video.onloadedmetadata = function () {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      video.currentTime = video.duration / 4;

      video.oncanplay = function () {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        callback(canvas.toDataURL('image/png'));
        this.remove();
      };
    };
  }

  function hasUploadedImg() {
    return !!initsto.get('userbg');
  }
  return{
    hasUploadedImg,
    getUserUploadUrl,
    getVideoCaptrue,
    iovuploader
  }
})();
