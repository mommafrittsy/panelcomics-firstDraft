const   msgBoxes = document.getElementsByClassName('messages'),
        msgInputs = document.getElementsByClassName('message-input'),
        msgSound = new Audio('https://files.panelcomics.ink/site-images/unconvinced.mp3');

for(let input of msgInputs){
  let comicSocket = io.connect(`/${input.dataset.roomkey}`),
      noticeTyping = document.getElementById(`typing-notice-${input.dataset.index}`),
      messageBox = document.getElementById(`message-box-${input.dataset.index}`),
      messageBubble = document.getElementById(`message-bubble-${input.dataset.index}`),
      messageNumber = document.getElementById(`new-messages-${input.dataset.index}`),
      messageTotal = Number(messageNumber.dataset.messages),
      typing = [], lastUser;
  
  comicSocket.on('message', (msg)=>{
    messageNew(msg, document.getElementById(input.dataset.box), lastUser);
    input.value = '';
    input.blur();

    if(msg.user != input.dataset.user){
      let head = document.getElementsByTagName('head')[0],
          msgNewIcon = document.createElement('link');
      messageTotal ++;
      msgSound.play();
      messageNumber.innerText = messageTotal;
      messageBubble.classList.remove('inactive');
      if(messageTotal == 1){
        head.removeChild(document.querySelector('link[rel="icon"]'));
        msgNewIcon.type = 'image/png';
        msgNewIcon.href = 'https://files.panelcomics.ink/site-images/newMsgIcon.png';
        msgNewIcon.rel = 'icon';
        head.appendChild(newIcon);
        document.title  = `(${messageTotal}) New Messages from ${msg.username}`;
      }
    }
  });
  comicSocket.on('typing', (username)=>{
    if(![undefined, null, ''].includes(username)){
      typing.push(username);
      noticeTypingUpdate(username, typing, noticeTyping);
      fadeIn(noticeTyping);
    }
  });
  comicSocket.on('stop_typing', (username)=>{
    typing.splice(typing.indexOf(username),1);
    noticeTypingUpdate(username, typing, noticeTyping);
    if(typing.length = 0){
      fadeOut(noticeTyping);
    }
  });
  comicSocket.on('disconnect', (err)=>{
    console.log(err);
    alertPop('error', err);
  });
  input.addEventListener('focus', ()=>{
    comicSocket.emit('typing', {username:input.dataset.name});
  });
  input.addEventListener('blur', ()=>{
    comicSocket.emit('stop_typing', {username:input.dataset.name});
  });
  input.addEventListener('keydown', (e)=>{
    if(['enter', 'tab'].includes(e.key.toLowerCase()) && input.value != ''){
      let msgObj = {
        comic: input.dataset.comic,
        member_number: input.dataset.number,
        text: input.value,
        user: input.dataset.user
      };

      e.preventDefault();
      e.stopPropagation();
      comicSocket.emit('message', msgObj);
      comicSocket.emit('stop_typing', {username: input.dataset.username});
      input.blur();
    }
  });
}

for(let box of msgBoxes){
  box.addEventListener('mouseenter', ()=>{
    box.classList.add('no-scroll');
  });
  box.addEventListener('mouseleave', ()=>{
    box.classList.remove('no-scroll');
  });
}

function dateStringer(date, type){
  let months = ['January', 'February', 'March','April','May','June','July','August','September','October','November','December'],
      computed = new Date(date),
      year = computed.getFullYear(),
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
function messageNew(msgObj, msgBox, lastUser){
  let msg = document.createElement('div'),
      text = document.createElement('p'),
      profile = document.createElement('span'),
      chip = document.createElement('span'),
      time = document.createElement('span');

  msg.classList.add('message');
  text.innerText = msgObj.text;
  chip.classList.add('chip');
  profile.setAttribute('class', 'profile background');
  profile.setAttribute('style', `background-image:url('${msgObj.profile}')`);
  time.classList.add('time');
  time.innerText = dateStringer(msgObj.date, 'date_time');

  if(msgBox.dataset.user == msgObj.user){
    msg.classList.add('right');
  } else {
    msg.classList.add('left');
    msg.classList.add(`user-${msgObj.member_number % 3}`);
  }

  if(lastUser == msgObj.user){
    msg.classList.add('same-user');
    msg.appendChild(text);
    msgBox.appendChild(msg);
  } else {
    msg.appendChild(text);
    msg.appendChild(chip);
    msg.appendChild(profile);
    msg.appendChild(time);
    msgBox.appendChild(msg);
    lastUser == msgObj.user;
  }
  if(!msgBox.classList.contains('no-scroll')){
    msgBox.scrollTop = msgBox.clientHeight;
  }
}
function noticeTypingUpdate(username, typing, noticeTyping){
  if(typing.length > 3){
    noticeTyping.innerText = 'Multiple people are typing.';
  } else if(4 > typing.length > 1){
    let last = typing.pop(), others = typing.splice(typing.length - 1, 1);
    noticeTyping.innerText = `${others.join(', ')}, and ${last} are typing.`;
  } else if(typing.length != 0){
    noticeTyping.innerText = `${username} is typing.`;
  } else {
    noticeTyping.classList.add('inactive');
  }
}