const user = document.getElementById('user').value,
      bkmkBtn = document.getElementById('bkmk-btn'),
      comicID = document.getElementById('comic-id').value,
      commentBtn = document.getElementById('new-comment'),
      commentInput = document.getElementById('comment-input'),
      cmtRptBtns = document.getElementsByClassName('comment-report'),
      deleteBtns = document.getElementsByClassName('comment-delete'),
      likeBtn = document.getElementById('like-btn'),
      likeBtns = document.getElementsByClassName('comment-like'),
      mainImg = document.getElementById('page-view'),
      matureBlk = document.getElementById('mature-block'),
      matureBtn = document.getElementById('show-mature'),
      pageID = document.getElementById('page-id').value,
      previewBtns = document.getElementsByClassName('preview-button'),
      reportSubmit = document.getElementById('report-submit'),
      sectionBtns = document.getElementsByClassName('section-title'),
      tipSubmit = document.getElementById('tip-submit'),
      pageNum = document.getElementById('page-num').value,
      bagNum = document.getElementById('bag-counter'),
      addCartBtn = document.getElementById('add-to-cart');

for(let btn of likeBtns){
  btn.addEventListener('click', ()=>{
    let url = `/fetch/comic/${comicID}/page/${pageID}/comment/${btn.dataset.id}/like`,
        init = {method:'PUT', credentials:'same-origin'};
    
    fetch(url, init)
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      if(data.message){
        throw data;
      } else {
        if(data.status == 'like'){
          btn.innerHTML = `<i class="fas fa-heart fa-lg fa-fw"></i> ${Number(btn.dataset.likes) + 1}`;
          btn.classList.add('unlike');
          btn.setAttribute('data-likes', Number(btn.dataset.likes) + 1);
        } else if(data.status == 'unlike'){
          btn.innerHTML = `<i class="fal fa-heart fa-lg fa-fw"></i> ${Number(btn.dataset.likes) - 1}`;
          btn.classList.remove('unlike');
          btn.setAttribute('data-likes', Number(btn.dataset.likes) - 1);
        }
      }
    })
    .catch((err)=>{
      alertPop('error', err.message);
    });
  });
}
for(let btn of cmtRptBtns){
  btn.addEventListener('click', ()=>{
    let url = `/fetch/comic/${comicID}/page/${pageID}/comment/${btn.dataset.id}/report`,
        init = {method:'POST', credentials:'same-origin'};
    
    fetch(url, init)
    .then((response)=>{
      if(response.ok){
        alertPop('success', 'We\'re looking into this.');
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
for(let btn of deleteBtns){
    btn.addEventListener('click', ()=>{
      deleteComment(btn);
    });
  }
for(let btn of previewBtns){
  btn.addEventListener('click', ()=>{
    viewUpload(btn);
  });
}
for(let btn of sectionBtns){
  btn.addEventListener('click', ()=>{
    btn.classList.toggle('open');
  });
}
if(user == 'true'){
  commentBtn.addEventListener('click', ()=>{
    postComment();
  });
  commentInput.addEventListener('input', (e)=>{
    if(['Enter', 'Tab'].includes(e.key)){
      postComment();
    }
  });
  bkmkBtn.addEventListener('click', ()=>{
    let url = `/fetch/comic/${comicID}/follow`,
        init = {method:'POST', credentials:'same-origin'};
    
    fetch(url, init)
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      if(data.status){
        if(data.status == 'follow'){
          bkmkBtn.innerHTML = '<i class="fas fa-bookmark fa-fw text-green"></i> Unfollow Comic';
          alertPop('success', 'Now Following Comic.');
        } else if(data.status == 'unfollow'){
          bkmkBtn.innerHTML = '<i class="far fa-bookmark fa-fw"></i> Follow Comic';
          alertPop('success', 'No Longer Following Comic.');
        }
      } else {
        throw data;
      }
    })
    .catch((err)=>{
      alertPop('error', err.message);
    });
  });
  if(likeBtn){
    likeBtn.addEventListener('click', ()=>{
      let url = `/fetch/comic/${comicID}/page/${pageID}/like`,
          init = {method:'PUT', credentials:'same-origin'};
      
      fetch(url, init)
      .then((response)=>{
        return response.json();
      })
      .then((data)=>{
        if(data.status){
          if(data.status == 'liked'){
            likeBtn.innerHTML = `<i class="fad fa-heart fa-fw"></i> ${Number(likeBtn.dataset.likes) + 1}`;
            likeBtn.classList.add('unlike');
            likeBtn.setAttribute('data-likes', Number(likeBtn.dataset.likes) + 1);
          } else if(data.status == 'unliked'){
            likeBtn.innerHTML = `<i class="fal fa-heart fa-fw"></i> ${Number(likeBtn.dataset.likes) - 1}`;
            likeBtn.classList.remove('unlike');
            likeBtn.setAttribute('data-likes', Number(likeBtn.dataset.likes) - 1);
          }
        } else {
          throw data;
        }
      })
      .catch((err)=>{
        alertPop('error', err.message);
      });
    });
    if(tipSubmit){
      tipSubmit.addEventListener('click', ()=>{
        let amount = document.getElementById('tip-amount').value,
            comment = document.getElementById('tip-comment').value;
        if(!['',0, NaN].includes(Number(amount))){
          let url =  `/fetch/comic/${comicID}/page/${pageID}/tip`,
              body = new FormData(),
              init = {method:'POST', body, credentials:'same-origin'};
          
          if(amount < 1 || amount > 50){
            alertPop('error', 'Please keep your tip between $1 and $50')
          } else {
            body.append('amount', amount*100);
            body.append('comment', comment);    
            
            fetch(url, init)
            .then((response)=>{
              if(response.ok){
                alertPop('success', 'Thanks for supporting this comic!');
                amount = '';
                comment = '';
                closeModal('tip-modal');
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
          
        }
      });
    }

    reportSubmit.addEventListener('click', ()=>{
      let radios = document.getElementsByName('report'),
          url = `/fetch/comic/${comicID}/page/${pageID}/report`,
          body = new FormData(),
          init = {method:'POST', body, credentials:'same-origin'};
    
      for(let rad of radios){
        if(rad.checked == true){
          body.append('reason', rad.id);
        }
      }
      fetch(url, init)
      .then((response)=>{
        if(response.ok){
          alertPop('success', 'We\'ll look into this right away.');
          closeModal('report-modal');
        } else {
          return response.json();
        }
      })
      .then((err)=>{
        if(err){
          throw err
        }
      })
      .catch((err)=>{
        alertPop('error', err.message);
      });
    });
  }
  if(matureBtn){
    matureBtn.addEventListener('click', ()=>{
      matureBlk.classList.add('inactive');
      mainImg.classList.remove('inactive');
    });
  }
}
if(addCartBtn){
  addCartBtn.addEventListener('click', ()=>{
    let url = `/fetch/bag/add`,
        body = new FormData(),
        init = {method:'POST', body, credentials:'same-origin'};
    
    if(addCartBtn.dataset.style != 'whole'){
      for(let ele of document.getElementById('pages-form').elements){
        if(ele.checked && ele.value != ''){
          body.append('pages', ele.value);
        }
      }
    }
    body.append('comic', addCartBtn.dataset.comic);
    body.append('type', addCartBtn.dataset.style);
    fetch(url, init)
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      if(data.message){
        throw data;
      } else {
        alertPop('success', 'Items added to bag!');
        bagNum.innerText = Number(data.length);
        bagEmpty.classList.add('inactive');
        bagNum.classList.remove('inactive');
        bagItems.classList.remove('inactive');
        checkoutLink.classList.remove('inactive');
        bagItems.innerHTML = '';
        for(let item of data){
          createBagItem(item, data.indexOf(item));
        }
        closeModal('purchase-modal');
      }
    })
    .catch((err)=>{
      alertPop('error', err.message);
    });
  });
}

let pageList = document.getElementById('page-list');
pageList.scrollTop = (pageNum - 1) * 80;
function deleteComment(btn){
  let url = `/fetch/comic/${comicID}/page/${pageID}/comment/${btn.dataset.id}/delete`,
      init = {method:'DELETE', credentials:'same-origin'};
      
  fetch(url, init)
  .then((response)=>{
    if(response.ok){
      document.getElementById('comments').removeChild(btn.parentElement);
      alertPop('success', 'Comment deleted.');
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
function postComment() {
  if(commentInput.value != ''){
    let url = `/fetch/comic/${commentBtn.dataset.comic}/page/${commentBtn.dataset.page}/comment`,
        body = new FormData(),
        init = {method:'POST', body, credentials:'same-origin'};
    
    body.append('text', commentInput.value);
    
    fetch(url, init)
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      if(data.message){
        throw data;
      } else {
        let comment = document.createElement('article'),
            userLink = document.createElement('a'),
            profile = document.createElement('span'),
            username = document.createElement('span'),
            date = document.createElement('span'),
            text = document.createElement('p'),
            delBtn = document.createElement('button');
            
        comment.classList.add('comment');
        userLink.href = `/user/${data.user.username}`;
        userLink.classList.add('comment-link');
        profile.classList.add('profile-img');
        profile.classList.add('background');
        profile.setAttribute('style', `background-image:url("${data.user.profileImg}")`);
        username.classList.add('comment-user');
        username.innerText = data.user.username;
        date.classList.add('comment-date');
        date.innerText = dateStringer(data.date, null, false);
        for(let chl of [profile, username, date]){
          userLink.appendChild(chl);
        }
        text.classList.add('comment-text');
        text.innerText = data.text;
        delBtn.classList.add('comment-delete');
        delBtn.setAttribute('type', 'button');
        delBtn.setAttribute('data-id', data.pubID);
        delBtn.innerHTML = `<i class="fal fa-trash-alt fa-lg fa-fw"></i> Delete`;
        delBtn.addEventListener('click', ()=>{
          deleteComment(delBtn);
        });
        for(let chl of [userLink, text, delBtn]){
          comment.appendChild(chl);
        }
        document.getElementById('comments').appendChild(comment);
        commentInput.value = '';
      }
    })
    .catch((err)=>{
      alertPop('error', err.message);
    });
  }
}
function viewUpload(ele){
  let parent = document.getElementById('view-body'),
      element;
  if(parent.children[1]){
    parent.removeChild(parent.children[1]);
  }
  if(ele.dataset.type != 'link'){
    if(ele.dataset.type == 'image'){
      element = document.createElement('img');
    } else if(ele.dataset.type == 'video'){
      element = document.createElement('video');
      element.setAttribute('controls', true);
    }
    element.src = ele.dataset.url;
    element.classList.add('modal-preview');
    parent.appendChild(element);
  }
}