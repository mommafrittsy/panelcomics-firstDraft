const comicBtns = document.getElementsByClassName('dash-comic'),
      section = document.getElementById('query-section'),
      subsection = document.getElementById('query-subsection');

if(section){
  let comicsSection = document.getElementById('comics');
  comicsSection.classList.add('inactive');
  document.getElementById(section.value).classList.remove('inactive');
  if(section.value == 'comics' && subsection){
    for(let btn of comicBtns){
      btn.classList.add('inactive');
    }
    document.getElementById('comic-show-all').classList.remove('inactive');
    document.getElementById('comic-show-all').setAttribute('data-comic', subsection.value);
    document.getElementById('add-comic').classList.add('inactive');
    document.getElementById(subsection.value).classList.remove('inactive');
  }
}