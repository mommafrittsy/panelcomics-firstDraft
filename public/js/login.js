const loginSub = document.getElementById('login-form-submit'),
      signupEmail = document.getElementById('signup-email'),
      signupSub = document.getElementById('signup-form-submit');

loginSub.addEventListener('click', ()=>{
  let email = document.getElementById('login-email');
  if(email.validity.valid){
    loginFormSubmit(loginSub);
  }
});

signupEmail.addEventListener('blur', ()=>{
  signupEmail.parentElement.classList.remove('error');
  if(signupEmail.value != ''){
    if(signupEmail.validity.valid){
      let url = `/user/email/check`,
          body = new FormData(),
          init = {method:'POST', body, credentials:'same-origin'};

      body.append('email', signupEmail.value);

      fetch(url, init)
      .then((response)=>{
        return response.json();
      })
      .then((data)=>{
        if(data.message){
          throw data;
        } else {
          let icon = document.getElementById('signup-email-icon');
          if(data.status == true){
            icon.setAttribute('class', 'fad fa-lg fa-fw fa-check-circle input-icon text-green');
          } else {
            signupEmail.parentElement.classList.add('error');
            icon.setAttribute('class', 'fad fa-lg fa-fw fa-times-circle input-icon text-red');
          }
        }
      })
      .catch((err)=>{
        alertPop('error', err.message);
      });
    } else {  
      document.getElementById('signup-email-icon').setAttribute('class', 'fad fa-lg fa-fw fa-times-circle input-icon text-red');
    }
  } else {
    document.getElementById('signup-email-icon').setAttribute('class', 'inactive');
  }
});

signupSub.addEventListener('click', ()=>{
  if(signupEmail.validity.valid){
    loginFormSubmit(signupSub);
  } else {
    document.getElementById('signup-email-icon').setAttribute('class', 'fad fa-lg fa-fw fa-times-circle input-icon text-red');
  }
});

function loginFormSubmit(subBtn){
  formSubmit(subBtn)
  .then((newLoc)=>{
    location.href = newLoc.url;
  })
  .catch((err)=>{
    alertPop('error', err.message);
  });
}