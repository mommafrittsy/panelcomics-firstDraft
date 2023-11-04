const alertBox = document.getElementById('alert-box'),
      body = document.getElementsByTagName('body')[0],
      formResetBtns = document.getElementsByClassName('form-clear'),
      inputFile = document.querySelectorAll('input[type="file"]'),
      inputInstant = document.getElementsByClassName('instant-input'),
      inputNum = document.querySelectorAll('input[type="number"]'),
      menuBtn = document.getElementById('menu-button'),
      menu = document.getElementById('main-menu'),
      modals = document.getElementsByClassName('modal'),
      modalBtns = document.getElementsByClassName('btn-modal'),
      modalCloseBtns = document.getElementsByClassName('close-modal'),
      switchBtns = document.getElementsByClassName('btn-switch'),
      tagDeletes = document.getElementsByClassName('tag-delete'),
      uploaderBlks = document.getElementsByClassName('uploader');

var filesToUpload = [];

var instantData = {};

if(menuBtn){
  menuBtn.addEventListener('click', (e)=>{
    menu.classList.toggle('open');
  });
}

for(let btn of formResetBtns){
  btn.addEventListener('click', ()=>{
    btn.form.reset();
  });
}

for(let btn of modalBtns){
  btn.addEventListener('click', ()=>{
    modalOpen(btn.dataset.modal);
  });
}

for(let btn of modalCloseBtns){
  btn.addEventListener('click', ()=>{
    modalClose(btn.dataset.modal);
  });
}

for(let input of inputFile){
  input.addEventListener('input', ()=>{
    fileProcess(input.parentElement, Array.from(input.files))
    .catch((err)=>{
      alertPop('error', err);
    });
  });
}

for(let input of inputInstant){
  input.addEventListener('keyup', (e)=>{
    if(e.key == input.dataset.separator){
      let tagHolder = document.getElementById(input.dataset.holder),
          tag = document.createElement('span'),
          tagContent = input.value.slice(0, -1),
          tagValue = document.createElement('span'),
          tagDeleteBtn = document.createElement('button');

      tag.classList.add('tag');
      tag.setAttribute('data-content', tagContent);
      tagValue.innerText = tagContent;
      tagDeleteBtn.setAttribute('type', 'button');
      tagDeleteBtn.setAttribute('class', 'tag-delete instant-tag');
      tagDeleteBtn.setAttribute('data-name', input.dataset.name);
      tagDeleteBtn.setAttribute('data-content', tagContent);
      tagDeleteBtn.innerText = '×';
      
      for(let ele of [tagValue, tagDeleteBtn]){
        tag.appendChild(ele);
      }
      if(instantData[input.dataset.name]){
        instantData[input.dataset.name].push(tagContent);
      } else {
        instantData[input.dataset.name] = [tagContent];
      }
      tagHolder.appendChild(tag);
      tagDelete(tagDeleteBtn);
      input.value = '';
    }
  });
}

for(let input of inputNum){
  input.addEventListener('keydown', (e)=>{
    if(!/[0-9]/.test(e.key) && !['Backspace', 'Enter', 'Tab', 'Delete', '.'].includes(e.key)){
      e.preventDefault();
    }
  })
}

for(let btn of switchBtns){
  btn.addEventListener('click', ()=>{
    let show = document.getElementById(btn.dataset.show),
        hide = document.getElementById(btn.dataset.hide);

    if(show){
      show.classList.remove('inactive');
    }
    if(hide){
      hide.classList.add('inactive');   
    }
  });
}

for(let btn of tagDeletes){
  tagDelete(btn);
}

for(let blk of uploaderBlks){
  dropCreate(blk);
}


function alertPop(type, message){
  alertBox.innerText = message;
  alertBox.setAttribute('class', type);
  setTimeout(()=>{fadeOut(alertBox)}, 5000);
}
function capitalizer(string){
  if(string){
    let strArr = string.split(' '), newArr = [];
    for(let str of strArr){
      newArr.push(`${str.substring(0,1).toUpperCase()}${str.substring(1)}`);
    }
    return newArr.join(' ');
  } else {
    return;
  }
}
function dateStringer(date, type){
  let computed = new Date(date),
      year = computed.getFullYear(),
      months = ['January', 'February', 'March','April','May','June','July','August','September','October','November','December'],
      month = months[computed.getMonth()],
      day = computed.getDate(),
      time =`${computed.getHours()}:0${computed.getMinutes()}`,
      requestedDate;
  if(computed.getMinutes() >= 10){
    time = `${computed.getHours()}:${computed.getMinutes()}`;
  }
  
  if(type == 'year'){
    requestedDate = year;
  } else if(type == 'month'){
    requestedDate =  `${month} ${year}`;
  } else if(type == 'day'){
    requestedDate = `${month} ${day}, ${year}`;
  } else if(type == 'time'){
    requestedDate = time;
  } else if(type == 'date_time'){
    requestedDate = `${month} ${day}, ${year} - ${time}`
  } else if(type == 'input'){
    let monthStr, dateStr;

    if(`${computed_date.getMonth() + 1}`.length == 1){
      monthStr = `0${computed_date.getMonth() + 1}`;
    } else {
      monthStr = computed_date.getMonth() + 1;
    }
    if(`${day}`.length == 1){
      dateStr = `0${day}`;
    } else {
      dateStr = day;
    }

    requestedDate = `${year}-${monthStr}-${dateStr}`;
  }

  return requestedDate;
}
function dropCreate(block){
  for(let event of ['dragenter', 'dragover', 'dragleave', 'drop']){
    block.addEventListener(event, (e)=>{
      e.preventDefault();
      e.stopPropagation();
    });
  }
  for(let event of ['dragenter','dragover']){
    block.addEventListener(event, ()=>{
      block.classList.add('dragging');
    });
  }
  for(let event of ['dragleave','drop']){
    block.addEventListener(event, ()=>{
      block.classList.remove('dragging');
    });
  }
  block.addEventListener('drop', (e)=>{
  let files = Array.from(e.dataTransfer.files);
    fileProcess(block, files)
    .catch((err)=>{
      console.log(err);
      alertPop('error', err);
    });
  });
}
function fadeIn (element){
  element.classList.add('fade-in');
  setTimeout(()=>{
    element.classList.remove('inactive');
    element.classList.remove('fade-in');
  }, 400);
}
function fadeOut(element){
  element.classList.add('fade-out');
  setTimeout(()=>{
    element.classList.add('inactive');
    element.classList.remove('fade-out');
  }, 400);
}
function fileProcess(block, files){
  return new Promise((resolve, reject)=>{
    if(files){
      let previews = block.children[4],
          instructions = Array.from(previews.children).pop(),
          restrictions;
      
      if(files.length > 10){
        files.length = 10;
      }    
      if(block.dataset.restriction){
        restrictions = block.dataset.restriction.split(',');
      }
      if(block.dataset.multiple != 'true'){
        filesToUpload = [];
      }
      for(let file of files){
        let type = file.type.split('/')[0];

        if(!block.dataset.restriction || (restrictions.length > 0 && restrictions.includes(type))){
          if((type == 'video' && file.size < 5000000000) || file.size < 25000000){
            let reader = new FileReader();

            reader.readAsDataURL(file);
            filesToUpload.push(file);
            reader.addEventListener('load', ()=>{
              let element;

              if(['audio', 'image', 'video'].includes(type)){
                if(type == 'image'){
                  element = document.createElement('span');
                  element.classList.add('background');
                  element.setAttribute('style', `background-image:url("${reader.result}")`);
                  file.url = reader.result;
                } else {
                  element = document.createElement(type);element.setAttribute('src', reader.result);
                }
                element.classList.add('preview');
                
                if(type != 'image'){
                  element.addEventListener('mouseenter', ()=>{
                    element.play();
                  });
                  element.addEventListener('mouseleave', ()=>{
                    element.pause();
                  });
                }
                if(type == 'video'){
                  element.classList.add('single');
                }
              } else {
                let icon = document.createElement('i'),
                    name = document.createElement('span');
                element = document.createElement('a');
                element.classList.add('preview-document-span');
                icon.setAttribute('class', 'fad fa-file-upload fa-3x');
                name.innerText = file.name;
                for(let ele of [icon, name]){
                  element.appendChild(ele);
                }
              }
              element.addEventListener('click', ()=>{
                filesToUpload.splice(filesToUpload.indexOf(file), 1);
                fadeOut(element);
                if(filesToUpload.length == 0){
                  instructions.classList.add('inactive');
                }
                setTimeout(()=>{previews.removeChild(element)}, 400);
              });
              if(block.dataset.multiple == 'true'){
                previews.classList.add('multiple');
              } else {
                previews.innerHTML = '<p class="disclaimer" style="text-align: center;">Click on a file to remove it.</p>';
                instructions = Array.from(previews.children).pop();
                element.classList.add('single');
              }
              instructions.classList.remove('inactive');
              previews.insertBefore(element, instructions);

              if(files.pop() == file){
                resolve();
              }
            });
          } else {
            reject('File is too large.');
          }
        } else {
          reject('File is not a valid type.');
        }
      }
    } else {
      reject('No files uploaded.');
    }
  });
}
function formSubmit(btn){
  return new Promise((resolve, reject)=>{
    let elements = btn.form.elements,
        url = btn.dataset.url,
        body = new FormData(),
        init = {method: btn.dataset.method.toUpperCase(), body, credentials: 'same-origin'};
    
    for(let ele of elements){
      if(['checkbox', 'radio'].includes(ele.type)){
        if(ele.checked == true){
          body.append(ele.name, ele.value);
        }
      } else {
        if(ele.value != ''){
          body.append(ele.name, ele.value);
        }
      }
    }

    fetch(url, init)
    .then((response)=>{
      if(response.ok){
        return response.json();
      } else {
        throw response.json();
      }
    })
    .then((data)=>{
      resolve(data);
    })
    .catch((err)=>{
      reject(err);
    });
  });
}
function menuClose(e){
  console.log(e.target);
  if(e.target != menu || e.target.parentElement != menu){
    menu.classList.remove('open');
  }
}
function modalClose(modalName){
  let modal = document.getElementById(modalName);

  modal.classList.remove('open');
  modal.classList.add('closing');
  body.classList.remove('no-scroll');
  setTimeout(()=>{
    modal.classList.remove('closing');
    modal.classList.add('inactive');
  }, 400);
}
function modalOpen(modalName){
  let modal = document.getElementById(modalName);

  modal.classList.remove('inactive');
  modal.classList.add('open');
  body.classList.add('no-scroll');
  window.addEventListener('click', (e)=>{
    if(e.target == modal){
      modalClose(modalName);
    }
  });
}
function tagDelete(btn){
  let tag = btn.parentElement,
      holder = tag.parentElement;

  btn.addEventListener('click', ()=>{
    if(instantData[btn.dataset.name]?.includes(btn.dataset.content)){
      let index = instantData[btn.dataset.name].indexOf(btn.dataset.content);
      instantData[btn.dataset.name].splice(index, 1);
    } else {
      if(instantData[`remove_${btn.dataset.name}`]){
        instantData[`remove_${btn.dataset.name}`].push(btn.dataset.content);
      } else {
        instantData[`remove_${btn.dataset.name}`] = [btn.dataset.content];
      }
    }
    holder.removeChild(tag);
  });
}