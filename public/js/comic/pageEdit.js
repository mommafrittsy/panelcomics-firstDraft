const uploadBtn = document.getElementById('upload-modal-submit')
      comicID = document.getElementById('comic-id').value,
      pageID = document.getElementById('page-id').value
      galleryItemDeletes = document.getElementsByClassName('gallery-item-delete'),
      galleryItemPreviews = document.getElementsByClassName('gallery-item-preview'),
      infoSub = document.getElementById('info-submit'),
      pgFins = document.getElementsByClassName('page-final'),
      previewModalCloses = document.getElementsByClassName('preview-modal-close'),
      publicToggle = document.getElementById('public-toggle'),
      publishBtn = document.getElementById('btn-publish'),
      dscHolder = document.getElementById('discussion'),
      dscInput = document.getElementById('discussion-input'),
      dscLikes = document.getElementsByClassName('like-btn'),
      dscSub = document.getElementById('discussion-btn'),
      msgDelBtns = document.getElementsByClassName('delete-msg-btn');

      
for(let btn of galleryItemDeletes){
  btn.addEventListener('click', ()=>{
    galleryDelete(btn.dataset.file_id);
  });
} 
for(let btn of galleryItemPreviews){
  btn.addEventListener('click', ()=>{
    galleryPreview(btn.dataset.file_id);
  });
}     
dscInput.addEventListener('keydown', (e)=>{
  if(['enter', 'tab'].includes(e.key.toLowerCase())){
    discussionNew(dscInput.value);
  }
});
for(let btn of dscLikes){
  btn.addEventListener('click', ()=>{
    let url = `/comics/${comicID}/pages/${pageID}/discussion/${btn.dataset.id}/${btn.dataset.status}`,
        init = {method:'PUT', body, credentials:'same-origin'};

    fetch(url, init)
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      if(data.ok == true){
        if(data.status == null){
          btn.firstElementChild.classList.remove('fad');
          btn.firstElementChild.classList.add('far');
          btn.lastElementChild.innerText = data[`${btn.dataset.status}s`];       
        } else {
          btn.firstElementChild.classList.add('fad');
          btn.firstElementChild.classList.remove('far');
          btn.lastElementChild.innerText = data[`${btn.dataset.status}s`];

          if(data.removed != null){
            let otrBtn = document.getElementById(`${btn.dataset.id}-${data.removed}`);

            otrBtn.firstElementChild.classList.remove('fad');
            otrBtn.firstElementChild.classList.add('far');
            otrBtn.lastElementChild.innerText = data[`${data.removed}s`];  
          }
        }
      } else {
        throw err;
      }
    })
    .catch((err)=>{
      console.log(err);
      alertPop('error', err.message);
    });
  });
}
dscSub.addEventListener('click', ()=>{
  discussionNew(dscInput.value);
});
infoSub.addEventListener('click', ()=>{
  let elements = infoSub.form.elements,
      url = `/comics/${comicID}/pages/${pageID}/info`,
      body = new FormData(),
      init = {method:'PUT', body, credentials:'same-origin'};
  
  for(let ele of elements){
    if(ele.type == "checkbox"){
      if(ele.checked == true){
        body.append(ele.name, ele.value);
      }
    } else if(ele.type == "radio"){
      body.append(ele.name, ele.checked);
    } else {
      if(ele.value != ''){
        body.append(ele.name, ele.value);
      }
    }
  }
  for(let arr of ['patrons', 'remove_patrons']){
    if(instantData[arr]){
      for(let ele of instantData[arr]){
        body.append(arr, ele);
      }
    }
  }
  
  fetch(url, init)
  .then((response)=>{
    if(response.ok){
      alertPop('success', 'Page info updated.');
      modalClose('info-modal');
    } else {
      return response.json();
    }
  })
  .then((err)=>{
    if(err){
      throw err;
    }
  })
  .catch((err)=>{
    alertPop('error', err.message);
  });
});

for(let btn of msgDelBtns){
  btn.addEventListener('click', ()=>{
    discussionDelete(btn.dataset.id);
  });
}

for(let ele of pgFins){
  for(let ev of ['drop', 'input']){
    ele.addEventListener(ev, (e)=>{
      let url = `/comics/${comicID}/pages/${pageID}/page_upload`,
          body = new FormData(),
          init = {method:'POST', body, credentials:'same-origin'};

      body.append('file', filesToUpload[0]);

      fetch(url, init)
      .then((response)=>{
        if(response.ok){
          location.reload();
        } else {
          return response.json();
        }
      })
      .then((err)=>{
        if(err){
          throw err;
        }
      })
      .catch((err)=>{
        alertPop('error', err.message);
      });
    });
  }
}

for(let btn of previewModalCloses){
  btn.addEventListener('click', ()=>{
    modalClose('preview-modal');
    document.getElementById('media-holder').innerHTML = '';
  });
}
if(publicToggle){
  publicToggle.addEventListener('input', ()=>{
    let url = `/comics/${comicID}/pages/${pageID}/files/${publicToggle.dataset.file_id}/public_update`,
        init = {method:'PUT', credentials:'same-origin'};

    fetch(url, init)
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      if(data.bool){
        if(data.bool == true){
          publicToggle.setAttribute('checked', true);
        } else {
          publicToggle.removeAttribute('checked');
        }
      } else {
        throw data;
      }
    })
    .catch((err)=>{
      console.log(err);
      alertPop('error', err.message);
    })
  });
}
if(publishBtn){
  publishBtn.addEventListener('click', ()=>{
    let url = `/comics/${comicID}/pages/${pageID}/publish`,
        init = {method:'POST', credentials:'same-origin'};

    fetch(url, init)
    .then((response)=>{
      if(response.ok){
        publishBtn.classList.add('inactive');
        alertPop('success', 'Page published.');
      } else {
        return response.json();
      }
    })
    .then((err)=>{
      if(err){
        throw err;
      }
    })
    .catch((err)=>{
      console.log(err);
      alertPop('error', err.message);
    });
  });
}
uploadBtn.addEventListener('click', ()=>{
  if(filesToUpload.length > 0){
    let url = `/comics/${uploadBtn.dataset.comic}/pages/${uploadBtn.dataset.page}/files/new`,
        body = new FormData(),
        init = {method:'POST', body, credentials:'same-origin'},
        typeSelect = document.getElementById('upload-type-select'),
        meter = document.getElementById('upload-modal-meter');

    meter.classList.add('full');
    meter.classList.remove('inactive');
    for(let file of filesToUpload){
      body.append('files', file);
    }
    body.append('type', typeSelect.value);

    fetch(url, init)
    .then((response)=>{
      meter.classList.add('inactive');
      return response.json();
    })
    .then((data)=>{
      if(data.files){
        let gallery = document.getElementById(`${typeSelect.value}-gallery`);

        for(let file of data.files){
          let item_span = document.createElement('span'),
              fileName = document.createElement('span'),
              preview_span,
              uploadDeleteBtn = document.createElement('button');

          if(file.contentType == 'video'){
            preview_span = document.createElement('video');
            preview_span.src = file.url;
            preview_span.setAttribute('muted', true);
            preview_span.addEventListener('mouseenter', ()=>{
              preview_span.play();
            });
            preview_span.addEventListener('mouseleave', ()=>{
              preview_span.pause();
              preview_span.currentTime(0);
            });
          } else if(['image', 'audio'].includes(file.contentType)){
            preview_span = document.createElement('span');
            preview_span.setAttribute('data-file_id', file.id);
            if(file.contentType.startsWith('audio')){
              preview_span.innerHTML = '<i class="fad fa-tv-music fa-3x></i>';
            } else {
              preview_span.setAttribute('style', `background-image:url('${file.url}')`);
              preview_span.classList.add('background');
            }
          } else {
            preview_span = document.createElement('a');
            preview_span.href = file.url;
            preview_span.setAttribute('download', true);
            preview_span.innerHTML = '<i class="fad fa-file-download fa-3x"></i><br><span class="disclaimer">Panel is not responsible for any content uploaded.</span>';
          }
          fileName.classList.add('file-name');
          fileName.innerText = file.name;
          item_span.classList.add('gallery-item');
          item_span.id = `item-${file.id}`;
          preview_span.classList.add('gallery-item-preview');
          uploadDeleteBtn.classList.add('gallery-item-delete');
          uploadDeleteBtn.setAttribute('data-file_id', file.id);
          uploadDeleteBtn.innerText = '×';
          uploadDeleteBtn.addEventListener('click', ()=>{
            galleryDelete(uploadDeleteBtn.dataset.file_id);
          });
          if(['audio', 'image', 'video'].includes(file.contentType)){
            preview_span.addEventListener('click', ()=>{
              galleryPreview(preview_span.dataset.file_id);
            });
          }
          for(let ele of [uploadDeleteBtn, preview_span, fileName]){
            item_span.appendChild(ele);
          }
          gallery.appendChild(item_span);
        }
        gallery.classList.remove('inactive');
        location.href = `${location.href.split('#')[0]}#${gallery.id}`;
        modalClose('upload-modal');
        document.getElementById('upload-modal-preview').innerHTML = '<p class="disclaimer inactive" style="text-align: center;">Click on a file to remove it.</p>';
        typeSelect.value = 'script';
        filesToUpload = [];
      } else {
        throw data;
      }
    })
    .catch((err)=>{
      console.log(err);
      alertPop('error', err.message);
    });
  }
});

function discussionCreate(msg){
  let box = document.createElement('div'),
      userLink = document.createElement('a'),
      userProfile = document.createElement('span'),
      userUsername = document.createElement('span'),
      dateTime = document.createElement('span'),
      text = document.createElement('p'),
      btnBox = document.createElement('div'),
      likesSpan = document.createElement('span'),
      dislikesSpan = document.createElement('span'),
      deleteBtn = document.createElement('button');
  
  box.id = `msg-${msg.id}`;
  box.classList.add('discussion-msg');
  userLink.href = `/user/${msg.user.username}`;
  userLink.classList.add('profile-holder');
  userProfile.setAttribute('class', 'profile background');
  userProfile.setAttribute('style', `background-image:url('${msg.user.profile}')`);
  userUsername.innerText = msg.user.username;
  for(let ele of [userProfile, userUsername]){
    userLink.appendChild(ele);
  }
  dateTime.classList.add('date');
  dateTime.innerText = dateStringer(msg.date, 'date_time');
  text.innerText = msg.text;
  btnBox.classList.add('msg-btns');
  likesSpan.innerHTML = '<i class="fas fa-thumbs-up" style="margin-right: 15px"></i> 0';
  likesSpan.setAttribute('style', 'color:#999');
  dislikesSpan.innerHTML = '<i class="fas fa-thumbs-down" style="margin-right: 15px"></i> 0';
  dislikesSpan.setAttribute('style', 'color:#999');
  deleteBtn.setAttribute('type', 'button');
  deleteBtn.classList.add('delete-msg-btn');
  deleteBtn.setAttribute('data-id', msg.id);
  deleteBtn.innerHTML = '<i class="fad fa-trash-alt" style="margin-right: 5px"></i> Delete';
  deleteBtn.addEventListener('click', ()=>{
    discussionDelete(deleteBtn.dataset.id);
  });
  for(let ele of [likesSpan, dislikesSpan, deleteBtn]){
    btnBox.appendChild(ele);
  }
  for(let ele of [userLink, dateTime, text, btnBox]){
    box.appendChild(ele);
  }
  document.getElementById('discussion').appendChild(box);
  location.href = `${location.href}#msg-${msg.id}`;
}
function discussionDelete(id){
  let url =  `/comics/${comicID}/pages/${pageID}/discussion/${id}/delete`,
      init = {method:'DELETE', credentials:'same-origin'};

  fetch(url, init)
  .then((response)=>{
  if(response.ok){
    let msg = document.getElementById(`msg-${id}`);
    fadeOut(msg);
    setTimeout(()=>{
      dscHolder.removeChild(msg);
    },400);
  } else {
    return response.json();
  }
  })
  .then((err)=>{
    if(err){
      throw err;
    }
  })
  .catch((err)=>{
  alertPop('error', err);
  });
}
function discussionNew(value){
  let url = `/comics/${comicID}/pages/${pageID}/discussion/new`,
      body = new FormData(),
      init = {method:'POST', body, credentials:'same-origin'};

  body.append('text', value);

  fetch(url, init)
  .then((response)=>{
    return response.json();
  })
  .then((data)=>{
    if(data.text){
      discussionCreate(data);
      dscInput.value = '';
    } else {
      throw data;
    }
  })
  .catch((err)=>{
    console.log(err);
    alertPop('error', err.message);
  });
}
function galleryPreview(fileId){
  let url = `/comics/${comicID}/pages/${pageID}/files/${fileId}`,
      init = {method:'GET', credentials:'same-origin'};
  
  fetch(url, init)
  .then((response)=>{
    return response.json();
  })
  .then((data)=>{
    if(data.contentType && ['audio', 'video', 'image'].includes(data.contentType)){
      let category = document.getElementById('media-category'),
          link = document.getElementById('media-uploader-link'),
          media, 
          mediaHolder = document.getElementById('media-holder'),
          nameSpans = document.getElementsByClassName('media-name'),
          profile = document.getElementById('media-uploader-profile'),
          publicToggleHolder = document.getElementById('public-toggle-holder'),
          size = document.getElementById('media-size'),
          username = document.getElementById('media-uploader-username');

      category.innerText = capitalizer(data.uploadType);
      profile.setAttribute('style', `background-image:url(${data.uploader.profile})`);
      username.innerText = data.uploader.username;
      size.innerText = `${(data.size/1000000).toFixed(2)}MB`;
      mediaHolder.innerHTML = '';
      link.href = `/user/${data.uploader.username}`;
      for(let span of nameSpans){
        span.innerText = data.name;
      }
      
      if(data.contentType == 'image'){
        media = document.createElement('img');
        media.setAttribute('alt', data.name);
      } else {
        media = document.createElement(data.contentType);
        media.setAttribute('controls', true);
      }
      if(data.isOwner == true){
        publicToggleHolder.classList.remove('inactive');
        publicToggle.setAttribute('data-file_id', `${data.id}`)
        if(data.public == true){
          publicToggle.setAttribute('checked', true);
        } else {
          publicToggle.removeAttribute('checked');
        }
      } else {
        publicToggleHolder.classList.add('inactive');
      }
      media.src = data.url;
      media.classList.add('media-view');
      mediaHolder.appendChild(media);
      modalOpen('preview-modal');

    } else if(data.contentType){
      throw {message:'File not found.'};
    } else {
      throw data;
    }
  })
  .catch((err)=>{
    console.log(err);
    alertPop('error', err.message);
  });
}
function galleryDelete(id){
  let url = `/comics/${comicID}/pages/${pageID}/files/${id}/delete`,
      init = {method:'DELETE', credentials:'same-origin'};

  fetch(url, init)
  .then((response)=>{
    if(response.ok){
      let itemToRemove = document.getElementById(`item-${id}`);
      fadeOut(itemToRemove);
      setTimeout(()=>{itemToRemove.parentElement.removeChild(itemToRemove)}, 400);
    } else {
      return response.json();
    }
  })
  .then((err)=>{
    if(err){
      throw err;
    }
  })
  .catch((err)=>{
    alertPop('error', err.message);
  });     
}