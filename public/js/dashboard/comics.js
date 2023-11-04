const   comicBtnHolder = document.getElementById('comic-btns'),
        comicNewBtn = document.getElementById('add-comic'),
        comicNewSubmit = document.getElementById('comic-new-submit'),
        comicShowAll = document.getElementById('comic-show-all'),
        comicUpdateBtns = document.getElementsByClassName('comic-update-submit'),
        inputsRole = document.getElementsByClassName('input-role'),
        inputsSocial = document.getElementsByClassName('input-social'),
        inputsToggle = document.getElementsByClassName('property-toggle-input'),
        memberModalBtns = document.getElementsByClassName('member-modal-btn'),
        memberNewBtns = document.getElementsByClassName('member-new-btn'),
        memberNewReset = document.getElementById('member-new-reset'),
        memberNewSubmit = document.getElementById('member-new-submit'),
        memberNewUsername = document.getElementById('member-new-username'),
        memberRemoveBtn = document.getElementById('member-info-remove-btn'),
        memberUpdateSubmit = document.getElementById('member-info-submit'),
        schTypeSwitches = document.getElementsByClassName('schedule-type-switch');

var membersToAdd = [];

if((section && section.value != 'comics') || subsection){
  comicNewBtn.classList.add('inactive');
}

for(let btn of comicBtns){
  btn.addEventListener('click', (e)=>{
    let comicMain = document.getElementById(`comic-${btn.dataset.comic}`),
        msgBubble = document.getElementById(`message-bubble-${btn.dataset.index}`),
        msgNumber = document.getElementById(`new-messages-${btn.dataset.index}`),
        header = document.getElementsByTagName('head')[0],
        newIcon = document.createElement('link');

  if(document.title != 'Dashboard | Panel'){
    header.removeChild(document.querySelector('link[rel="icon"]'));
    newIcon.type = 'image/png';
    newIcon.href = 'https://files.panelcomics.ink/site-images/icon.png';
    newIcon.rel = 'icon';
    header.appendChild(newIcon);
    document.title = "Dashboard | Panel";
  };

    // comicBtnHolder.classList.add('fade-out');
    comicBtnHolder.classList.add('inactive');
    comicMain.classList.remove('inactive');
    comicMain.classList.add('fade-in');
    comicShowAll.setAttribute('data-comic', comicMain.id);
    comicShowAll.classList.remove('inactive');
    if(comicNewBtn){
      comicNewBtn.classList.add('inactive');
    }
    history.replaceState({}, 'Dashboard: Comics', `/dashboard?section=comics&subsection=${comicMain.id}`);
    msgNumber.innerText = 0;
    msgNumber.dataset.messages = 0;
    msgBubble.classList.add('inactive');
    setTimeout(()=>{
      // comicBtnHolder.classList.add('inactive');
      // comicBtnHolder.classList.remove('fade-out');
      comicMain.classList.remove('fade-in');
    }, 251);
  });
}

if(comicNewSubmit){
  comicNewSubmit.addEventListener('click', ()=>{
  let url = '/comics/new',
      body = new FormData(),
      init = {method:'POST', body, credentials:'same-origin'};

  for(let ele of comicNewSubmit.form.elements){
    if(['radio', 'checkbox'].includes(ele.type)){
      if(ele.checked == true){
        body.append(ele.name, ele.value);
      }
    } else if(ele.value != ''){
      body.append(ele.name, ele.value);
    }
  }
  body.append('banner', filesToUpload[0]);

  fetch(url, init)
  .then((response)=>{
    if(response.ok){
      location.reload();
    } else {
      return response.json();
    }
  })
  .then((err)=>{
    throw err;
  })
  .catch((err)=>{
    alertPop('error', err.message);
  })
  });
}

for(let input of inputsSocial){
  let updated = false;
  input.addEventListener('keydown', (e)=>{
    if(!['tab', 'shift'].includes(e.key.toLowerCase()) && updated == false){
      updated = true;
    }
  });
  input.addEventListener('blur', ()=>{
    if(updated == true){
      let url = `/comics/${input.dataset.id}/social/update`,
          body = new FormData(),
          init = {method:'PUT', body, credentials:'same-origin'};

      body.append('name', input.name);
      body.append('value', input.value);

      fetch(url, init)
      .then((response)=>{
        return response.json();
      })
      .then((data)=>{
        if(data.updated){
          if(data.updated == true){
            alertPop('success', `${input.name} link updated.`);
          }
        } else {
          throw data;
        }
      })
      .catch((err)=>{
        alertPop('error', err.message);
      });
    }
    
  });
}

for(let input of inputsToggle){
  input.addEventListener('input', ()=>{
    let url = `/comics/${input.dataset.id}/${input.name}`,
        init = {method:'PUT', credentials:'same-origin'};

    fetch(url, init)
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      if(data.bool != undefined){
        if(data.bool == true){
          alertPop('success', `Comic made ${input.name}.`);
        } else if(data.bool == false){ 
          alertPop('success', `Comic is no longer ${input.name}.`);
        }
      } else {
        throw err;
      }
    })
    .catch((err)=>{
      alertPop('error', err.message);
    })
  });
}

comicShowAll.addEventListener('click', ()=>{
  let comicToHide = document.getElementById(comicShowAll.dataset.comic);

  for(let ele of [comicShowAll, comicToHide]){
    ele.classList.add('inactive');
    // ele.classList.add('fade-out');
    // setTimeout(()=>{ele.classList.add('inactive'); ele.classList.remove('fade-out')}, 251);
  }
  history.pushState({}, 'Dashboard: Comics', `/dashboard?section=comics`);
  comicBtnHolder.classList.remove('inactive');
  comicBtnHolder.classList.add('fade-in');
  if(comicNewBtn){
    comicNewBtn.classList.remove('inactive');
  }
  setTimeout(()=>{
    comicBtnHolder.classList.remove('fade-in');
    comicShowAll.removeAttribute('data-comic');
  });
});

for(let btn of comicUpdateBtns){
  btn.addEventListener('click', ()=>{
    let url = `/comics/${btn.dataset.id}/update`,
        body = new FormData(),
        init = {method:'PUT', credentials:'same-origin', body};

    for(let ele of btn.form.elements){
      if((!['radio', 'checkbox'].includes(ele.type) && ele.value != '')|| (['radio', 'checkbox'].includes(ele.type) && ele.checked == true)){
        body.append(ele.name, ele.value);
      }
    }
    if(filesToUpload.length > 0){
      body.append('banner', filesToUpload[0]);
    }
    
    fetch(url, init)
    .then((response)=>{
      if(response.ok){
        if(filesToUpload.length > 0){
          let previewBox = document.getElementById(`comic-${btn.dataset.index}-banner-preview`);
          document.getElementById(`comic-${btn.dataset.index}-banner`).setAttribute('style', `background-image:url('${filesToUpload[0].url}')`);
          previewBox.children[1].classList.add('inactive');
          previewBox.removeChild(previewBox.children[0]);
        }
        filesToUpload = [];
        alertPop('success', 'Comic updated.');
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
    })
  });
}

for(let btn of memberModalBtns){
  btn.addEventListener('click', ()=>{
    let url = `/comics/${btn.dataset.comic}/members/${btn.dataset.member}`,
        init = {method:'GET', credentials:'same-origin'};

    fetch(url, init)
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      if(data.username){

        let status = document.getElementById('member-info-status'),
            removeSection = document.getElementById('member-info-remove'),
            canUploadInput = document.getElementById('can-upload-input');

        for(let ele of document.getElementsByClassName('member-info-username')){
          ele.innerText = data.username;
        }
        for(let input of inputsRole){
          if(data.role.includes(input.value)){
            input.checked = true;
          } else {
            input.checked = false;
          }
        }
        if(data.admin == true){
          document.getElementById('can-upload-header').classList.add('inactive');
          canUploadInput.parentElement.classList.add('inactive');
        } else if(data.canUpload == true){
          canUploadInput.checked = true;
        } else {
          canUploadInput.checked = false;
        }
        status.innerText = data.status;
        if(data.canRemove == false){
          memberRemoveBtn.removeAttribute('data-id');
          memberRemoveBtn.removeAttribute('data-comic');
          removeSection.classList.add('inactive');
        } else if(data.admin == false){
          memberRemoveBtn.setAttribute('data-id', data.id);
          memberRemoveBtn.setAttribute('data-comic', btn.dataset.comic);
          removeSection.classList.remove('inactive');
        }
        memberUpdateSubmit.setAttribute('data-comic', btn.dataset.comic);
        memberUpdateSubmit.setAttribute('data-member', btn.dataset.member);
        modalOpen(btn.dataset.modal);
      } else {
        throw data;
      }
    })
    .catch((err)=>{
      console.log(err);
      alertPop('error', err.message);
    });
  });
}

for(let btn of memberNewBtns){
  btn.addEventListener('click', ()=>{
    document.getElementById('member-new-comic-title').innerText = btn.dataset.comictitle;
    document.getElementById('member-new-submit').setAttribute('data-id', btn.dataset.comicid);
    memberNewUsername.setAttribute('data-id', btn.dataset.comicid);
    memberNewUsername.focus();
    membersToAdd = [];
  });
}

memberNewReset.addEventListener('click', ()=>{
  membersToAdd = [];
  memberNewUsername.value = '';
  document.getElementById('member-new-comic-title').innerText = '';
  document.getElementById('member-new-submit').removeAttribute('data-id');
  document.getElementById('member-new-results').innerHTML = '';
  document.getElementById('member-new-list').innerHTML = '';
});

memberNewSubmit.addEventListener('click', ()=>{
  let url = `/comics/${memberNewSubmit.dataset.id}/members/add`,
      body  = new FormData(),
      init = {method: 'PUT', body, credentials: 'same-origin'};

  if(membersToAdd.length > 0){
    for(let member of  membersToAdd){
      body.append('members', member);
    }
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
      if(err){
        alertPop('error', err.message);
      }
    });
  } else {
    alertPop('error', 'No users selected.');
  }
});

memberNewUsername.addEventListener('input', ()=>{
  memberNewSearch();
});

memberRemoveBtn.addEventListener('click', ()=>{
  let url = `/comics/${memberRemoveBtn.dataset.comic}/members/${memberRemoveBtn.dataset.id}/remove`,
      init = {method:'DELETE', credentials:'same-origin'};

  fetch(url, init)
  .then((response)=>{
    if(response.ok){
      let formerMember = document.getElementById(`member-${memberRemoveBtn.dataset.id}`);

      formerMember.parentElement.removeChild(formerMember);
      modalClose('member-info-modal');
      alertPop('success', 'Member removed.');
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
  })
});

memberUpdateSubmit.addEventListener('click', ()=>{
  let elements = memberUpdateSubmit.form.elements,
      url = `/comics/${memberUpdateSubmit.dataset.comic}/members/${memberUpdateSubmit.dataset.member}/update`,
      body = new FormData(),
      init = {method:'PUT', body, credentials:'same-origin'};

  for(let ele of elements){
    if(ele.id == 'can-upload-input'){
      body.append('canUpload', ele.checked);
    } else if(ele.type == 'checkbox'){
      if(ele.checked == true){
        body.append(ele.name, ele.value);
      }
    }

    
  }
  fetch(url, init)
  .then((response)=>{
    if(response.ok){
      modalClose('member-info-modal');
      alertPop('success', 'Member info updated.');
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

for(let btn of schTypeSwitches){
  btn.addEventListener('click', ()=>{
    let show = document.getElementById(btn.dataset.show),
        calendars = document.getElementsByClassName('update-calendar');

    for(let cal of calendars){
      cal.classList.add('inactive');
    }
    if(btn.innerText != 'as-available'){
      show.classList.remove('inactive');
    }
  });
}

function memberNewSearch(){
  let results = document.getElementById('member-new-results');
  if(memberNewUsername.value != ''){
    let url = `/comics/${memberNewUsername.dataset.id}/members/search/${memberNewUsername.value}`,
        init = {method:'GET', credentials:'same-origin'};
    
    results.innerHTML = '';    

    fetch(url, init)
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      if(Array.isArray(data)){
        for(let user of data){
          if(!membersToAdd.includes(user._id)){
            let box = document.createElement('li'),
                profile = document.createElement('span'),
                username = document.createElement('span');
            
            box.addEventListener('click', ()=>{
              let addedBox = document.createElement('li'),
                  addedProfile = document.createElement('span'),
                  addedUsername = document.createElement('span'),removeBtn = document.createElement('button')
                  memberList = document.getElementById('member-new-list');
              
              membersToAdd.push(user._id);
              addedProfile.setAttribute('class', 'profile background');
              addedProfile.setAttribute('style', `background-image:url('${user.profile}')`);
              addedUsername.innerText = user.username;
              removeBtn.innerText = '×';
              removeBtn.setAttribute('class', 'btn btn-close');
              removeBtn.addEventListener('click', ()=>{
                membersToAdd.splice(membersToAdd.indexOf(user._id), 1);
                memberList.removeChild(addedBox);
              });
              addedBox.setAttribute('data-id', user._id);
              addedBox.appendChild(addedProfile);
              addedBox.appendChild(addedUsername);
              addedBox.appendChild(removeBtn);
              memberList.appendChild(addedBox);
              results.innerHTML = '';
              memberNewUsername.value = '';
            });
            profile.setAttribute('class', 'profile background');
            profile.setAttribute('style', `background-image:url('${user.profile}')`);
            username.innerText = user.username;
            box.setAttribute('data-id', user._id);
            box.appendChild(profile);
            box.appendChild(username);
            box.setAttribute('style', 'cursor:pointer');
            results.appendChild(box);
          }
        }
      } else {
        throw data;
      }
    })
    .catch((err)=>{
      console.log(err);
      alertPop('error', err.message);
    })
  }
}