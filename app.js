const express = require('express'),
      app = express(),
      baseURL = 'https://panelcomics.ink',
      countries = {
        all: {
          "AF": "Afghanistan", 
          "AX": "Åland Islands", 
          "AL": "Albania", 
          "DZ": "Algeria", 
          "AS": "American Samoa", 
          "AD": "Andorra", 
          "AO": "Angola", 
          "AI": "Anguilla", 
          "AQ": "Antarctica", 
          "AG": "Antigua and Barbuda", 
          "AR": "Argentina", 
          "AM": "Armenia", 
          "AW": "Aruba", 
          "AU": "Australia", 
          "AT": "Austria", 
          "AZ": "Azerbaijan", 
          "BS": "Bahamas", 
          "BH": "Bahrain", 
          "BD": "Bangladesh", 
          "BB": "Barbados", 
          "BY": "Belarus", 
          "BE": "Belgium", 
          "BZ": "Belize", 
          "BJ": "Benin", 
          "BM": "Bermuda", 
          "BT": "Bhutan", 
          "BO": "Bolivia", 
          "BA": "Bosnia and Herzegovina", 
          "BW": "Botswana", 
          "BV": "Bouvet Island", 
          "BR": "Brazil", 
          "IO": "British Indian Ocean Territory", 
          "BN": "Brunei Darussalam", 
          "BG": "Bulgaria", 
          "BF": "Burkina Faso", 
          "BI": "Burundi", 
          "KH": "Cambodia", 
          "CM": "Cameroon", 
          "CA": "Canada", 
          "CV": "Cape Verde", 
          "KY": "Cayman Islands", 
          "CF": "Central African Republic", 
          "TD": "Chad", 
          "CL": "Chile", 
          "CN": "China", 
          "CX": "Christmas Island", 
          "CC": "Cocos (Keeling) Islands", 
          "CO": "Colombia", 
          "KM": "Comoros", 
          "CG": "Congo", 
          "CD": "Congo, The Democratic Republic of the", 
          "CK": "Cook Islands", 
          "CR": "Costa Rica", 
          "CI": "Cote D'Ivoire", 
          "HR": "Croatia", 
          "CU": "Cuba", 
          "CY": "Cyprus", 
          "CZ": "Czech Republic", 
          "DK": "Denmark", 
          "DJ": "Djibouti", 
          "DM": "Dominica", 
          "DO": "Dominican Republic", 
          "EC": "Ecuador", 
          "EG": "Egypt", 
          "SV": "El Salvador", 
          "GQ": "Equatorial Guinea", 
          "ER": "Eritrea", 
          "EE": "Estonia", 
          "ET": "Ethiopia", 
          "FK": "Falkland Islands (Malvinas)", 
          "FO": "Faroe Islands", 
          "FJ": "Fiji", 
          "FI": "Finland", 
          "FR": "France", 
          "GF": "French Guiana", 
          "PF": "French Polynesia", 
          "TF": "French Southern Territories", 
          "GA": "Gabon", 
          "GM": "Gambia", 
          "GE": "Georgia", 
          "DE": "Germany", 
          "GH": "Ghana", 
          "GI": "Gibraltar", 
          "GR": "Greece", 
          "GL": "Greenland", 
          "GD": "Grenada", 
          "GP": "Guadeloupe", 
          "GU": "Guam", 
          "GT": "Guatemala", 
          "GG": "Guernsey", 
          "GN": "Guinea", 
          "GW": "Guinea-Bissau", 
          "GY": "Guyana", 
          "HT": "Haiti", 
          "HM": "Heard Island and Mcdonald Islands", 
          "VA": "Holy See (Vatican City State)", 
          "HN": "Honduras", 
          "HK": "Hong Kong", 
          "HU": "Hungary", 
          "IS": "Iceland", 
          "IN": "India", 
          "ID": "Indonesia", 
          "IR": "Iran, Islamic Republic Of", 
          "IQ": "Iraq", 
          "IE": "Ireland", 
          "IM": "Isle of Man", 
          "IL": "Israel", 
          "IT": "Italy", 
          "JM": "Jamaica", 
          "JP": "Japan", 
          "JE": "Jersey", 
          "JO": "Jordan", 
          "KZ": "Kazakhstan", 
          "KE": "Kenya", 
          "KI": "Kiribati", 
          "KP": "Democratic People's Republic of Korea", 
          "KR": "Korea, Republic of", 
          "XK": "Kosovo", 
          "KW": "Kuwait", 
          "KG": "Kyrgyzstan", 
          "LA": "Lao People's Democratic Republic", 
          "LV": "Latvia", 
          "LB": "Lebanon", 
          "LS": "Lesotho", 
          "LR": "Liberia", 
          "LY": "Libyan Arab Jamahiriya", 
          "LI": "Liechtenstein", 
          "LT": "Lithuania", 
          "LU": "Luxembourg", 
          "MO": "Macao", 
          "MK": "Macedonia, The Former Yugoslav Republic of", 
          "MG": "Madagascar", 
          "MW": "Malawi", 
          "MY": "Malaysia", 
          "MV": "Maldives", 
          "ML": "Mali", 
          "MT": "Malta", 
          "MH": "Marshall Islands", 
          "MQ": "Martinique", 
          "MR": "Mauritania", 
          "MU": "Mauritius", 
          "YT": "Mayotte", 
          "MX": "Mexico", 
          "FM": "Micronesia, Federated States of", 
          "MD": "Moldova, Republic of", 
          "MC": "Monaco", 
          "MN": "Mongolia", 
          "ME": "Montenegro", 
          "MS": "Montserrat", 
          "MA": "Morocco", 
          "MZ": "Mozambique", 
          "MM": "Myanmar", 
          "NA": "Namibia", 
          "NR": "Nauru", 
          "NP": "Nepal", 
          "NL": "Netherlands", 
          "AN": "Netherlands Antilles", 
          "NC": "New Caledonia", 
          "NZ": "New Zealand", 
          "NI": "Nicaragua", 
          "NE": "Niger", 
          "NG": "Nigeria", 
          "NU": "Niue", 
          "NF": "Norfolk Island", 
          "MP": "Northern Mariana Islands", 
          "NO": "Norway", 
          "OM": "Oman", 
          "PK": "Pakistan", 
          "PW": "Palau", 
          "PS": "Palestinian Territory, Occupied", 
          "PA": "Panama", 
          "PG": "Papua New Guinea", 
          "PY": "Paraguay", 
          "PE": "Peru", 
          "PH": "Philippines", 
          "PN": "Pitcairn", 
          "PL": "Poland", 
          "PT": "Portugal", 
          "PR": "Puerto Rico", 
          "QA": "Qatar", 
          "RE": "Reunion", 
          "RO": "Romania", 
          "RU": "Russian Federation", 
          "RW": "Rwanda", 
          "SH": "Saint Helena", 
          "KN": "Saint Kitts and Nevis", 
          "LC": "Saint Lucia", 
          "PM": "Saint Pierre and Miquelon", 
          "VC": "Saint Vincent and the Grenadines", 
          "WS": "Samoa", 
          "SM": "San Marino", 
          "ST": "Sao Tome and Principe", 
          "SA": "Saudi Arabia", 
          "SN": "Senegal", 
          "RS": "Serbia", 
          "SC": "Seychelles", 
          "SL": "Sierra Leone", 
          "SG": "Singapore", 
          "SK": "Slovakia", 
          "SI": "Slovenia", 
          "SB": "Solomon Islands", 
          "SO": "Somalia", 
          "ZA": "South Africa", 
          "GS": "South Georgia and the South Sandwich Islands", 
          "ES": "Spain", 
          "LK": "Sri Lanka", 
          "SD": "Sudan", 
          "SR": "Suriname", 
          "SJ": "Svalbard and Jan Mayen", 
          "SZ": "Swaziland", 
          "SE": "Sweden", 
          "CH": "Switzerland", 
          "SY": "Syrian Arab Republic", 
          "TW": "Taiwan", 
          "TJ": "Tajikistan", 
          "TZ": "Tanzania, United Republic of", 
          "TH": "Thailand", 
          "TL": "Timor-Leste", 
          "TG": "Togo", 
          "TK": "Tokelau", 
          "TO": "Tonga", 
          "TT": "Trinidad and Tobago", 
          "TN": "Tunisia", 
          "TR": "Turkey", 
          "TM": "Turkmenistan", 
          "TC": "Turks and Caicos Islands", 
          "TV": "Tuvalu", 
          "UG": "Uganda", 
          "UA": "Ukraine", 
          "AE": "United Arab Emirates", 
          "GB": "United Kingdom", 
          "US": "United States", 
          "UM": "United States Minor Outlying Islands", 
          "UY": "Uruguay", 
          "UZ": "Uzbekistan", 
          "VU": "Vanuatu", 
          "VE": "Venezuela", 
          "VN": "Viet Nam", 
          "VG": "Virgin Islands, British", 
          "VI": "Virgin Islands, U.S.", 
          "WF": "Wallis and Futuna", 
          "EH": "Western Sahara", 
          "YE": "Yemen", 
          "ZM": "Zambia", 
          "ZW": "Zimbabwe"
        },
        stripe: {
          allData: [
            {code:'AU', name:'Australia', currency:'AUD'},
            {code:'AT', name:'Austria', native:'Österreich', currency:'EUR'},
            {code:'BE', name:'Belgium', currency:'EUR'},
            {code:'CA', name:'Canada', currency:'CAD'},
            {code:'DK', name:'Denmark', native:'Danmark', currency:'DKK'},
            {code:'EE', name:'Estonia', native:'Eesti', currency:'EUR'},
            {code:'FI', name:'Finland', native:'Suomi', currency:'EUR'},
            {code:'FR', name:'France', currency:'EUR'},
            {code:'DE', name:'Germany', native:'Deutschland', currency:'EUR'},
            {code:'GR', name:'Greece', native:'Ελλάς', currency:'EUR'},
            {code:'HK', name:'Hong Kong', native:'香港', currency:'HKD'},
            {code:'IE', name:'Ireland', native:'Éire', currency:'EUR'},
            {code:'IT', name:'Italy', native:'Italia', currency:'EUR'},
            {code:'JP', name:'Japan', native:'日本', currency:'JPY'},
            {code:'LV', name:'Latvia', native:'Latvija', currency:'EUR'},
            {code:'LT', name:'Lithuania', native:'Lietuva', currency:'EUR'},
            {code:'LU', name:'Luxembourg', native:'Lëtzebuerg', currency:'EUR'},
            {code:'MY', name:'Malaysia', currency:'MYR'},
            {code:'MX', name:'Mexico', native:'México', currency:'MXN'},
            {code:'NL', name:'Netherlands', native:'Nederland', currency:'EUR'},
            {code:'NZ', name:'New Zealand', currency:'NZD'},
            {code:'NO', name:'Norway', native:'Norge', currency:'NOK'},
            {code:'PL', name:'Poland', native:'Polska', currency:'EUR'},
            {code:'PT', name:'Portugal', currency:'EUR'},
            {code:'SG', name:'Singapore', currency:'SGD'},
            {code:'SK', name:'Slovakia', native:'Slovensko', currency:'EUR'},
            {code:'SL', name:'Slovenia', native:'Slovenija', currency:'EUR'},
            {code:'ES', name:'Spain', native:'España', currency:'EUR'},
            {code:'SE', name:'Sweden', native:'Sverige', currency:'SEK'},
            {code:'CH', name:'Switzerland', currency:'CHF'},
            {code:'GB', name:'United Kingdom', currency:'GBP'},
            {code:'US', name:'United States', currency:'USD'}
          ],
          codes: [
            'AU', 'AT', 'BE', 'CA', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HK', 'IE', 'IT', 'JP', 'LV', 'LT', 'LU', 'MY', 'MX', 'NL','NZ', 'NO', 'PL', 'PT', 'SG', 'SK', 'SL', 'ES', 'SE', 'CH', 'GB', 'US'
          ]
        }
      },
      fileURL = 'https://panelapp.blob.core.windows.net/site-images/',
      months = ['January', 'February', 'March','April','May','June','July','August','September','October','November','December'],
      
      // PACKAGES
      crypto_str = require('crypto-random-string'),
      helmet = require('helmet'),
      http = require('http').Server(app),
      io = require('socket.io')(http),
      mongoose = require('mongoose'),
      passport = require('passport'),
      secure = require('express-force-https'),
      session = require('express-session'),
      sessionMongo = require('connect-mongodb-session')(session),
      store = new sessionMongo({
        uri: process.env.MONGO,
        collection: 'sessions'
      }, (err)=>{if(err){console.log(err)}}),

      // MODELS
      Advert = require('./models/advert'),
      Comic = require('./models/comic'),
      File = require('./models/file'),
      Item = require('./models/item'),
      Member = require('./models/member'),
      Message = require('./models/message'),
      Monetization = require('./models/monetization'),
      Notification = require('./models/notification'),
      Page = require('./models/page'),
      Purchase = require('./models/purchase'),
      Report = require('./models/report'),
      Staff = require('./models/staff'),
      Tip = require('./models/tip'),
      User = require('./models/user'),

      // ROUTES
      comic = require('./routes/comic'),
      fetch = require('./routes/fetch'),
      userRoutes = require('./routes/user');

// PACKAGE SETUP
app.use(session({
  secret: process.env.SESSION,
  cookie: {
    httpOnly: true,
    maxAge: 604800000
  },
  store,
  resave: true,
  saveUninitialized: false
}));
app.enable('trust proxy');
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(secure);

mongoose.connect(process.env.MONGO, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
store.on('error', (err)=>{if(err){console.log(err)}});

// LOCAL VARIABLES
app.use((req, res, next)=>{
  let localVars = {
    capitalizer,
    countries,
    dateStringer,
    error: req.query.error,
    path: req.path,
    query: req.query,
    user: null
  };
  
  userFindProfile(req.user)
  .then((foundUser)=>{
    localVars.user = foundUser;

    res.locals = localVars;
    next();
  })
  .catch((err)=>{
    console.log(err);
    next();
  });
});

io.on('error', (err)=>{
  console.log(err);
});

// SocketIO
Comic.find({active:true})
.exec((err, allComics)=>{
  if(err){
    console.log(err);
  } else {
    for(let cm of allComics){
      let rm = io.of(cm.room_key);

      rm.on('connection', (usr)=>{
        usr.on('message', (msg)=>{
          User.findOne({_id:msg.user})
          .populate('profile')
          .exec((err, foundUser)=>{
            if(err){
              console.log(err);
            } else if(!foundUser.comics.admin.concat(foundUser.comics.created).includes(cm._id.toString())){
              usr.emit('error', 'You are not a member of this comic.');
            } else {
              let msgObj = {
                date: Date.now(),
                member_number: msg.member_number,
                profile: foundUser.profile.url,
                text: msg.text,
                user: foundUser._id
              };
              

              Message.create(msgObj, (err, newMessage)=>{
                if(err){
                  console.log(err);
                  usr.emit('error_message', err.message);
                } else {
                  cm.messages.push(newMessage);
                  cm.save();
                  rm.emit('message', msgObj);
                }
              });
            }
          });
        });
        usr.on('typing', (username)=>{
          rm.emit('typing', `${username.username}`);
        });
        usr.on('stop_typing', (username)=>{
          rm.emit('stop_typing', username.username);
        });
      }); 
    }
  }
});

app.get('/', (req, res)=>{
  res.render('home', {
      title:'A New Comic Experience',
      url: `${baseURL}/`,
      description: 'A New Indie Comic Experience',
      image: `${fileURL}/Panel Logo Full-01.png`, 
      css_js: 'home'
    });
});
app.get('/404', (req, res)=>{
  res.render('404', {
    title: 'Are you sure?',
    url: `${baseURL}/404`,
    description: 'There\'s nothing here. We wish we knew, but nope.',
    image: `${fileURL}/Panel Logo Full-01.png`,
    css_js: '404'
  });
});
app.get('/bag', (req, res)=>{
  if(!req.user){
    res.redirect('/login?error=You need to be logged in.');
  } else {
    res.render('bag', {backUrl:req.get('Referer')});
  }
});
app.get('/dashboard', (req, res)=>{
  if(!req.user){
    res.redirect('/login?error=You need to be logged in.');
  } else {
    User.findOne({_id:req.user._id})
    .populate({path:'adverts', populate:'comic'})
    .populate('banner')
    .populate({path: 'comics.admin', populate:[{path:'admin'}, {path:'banner'}, {path:'members', populate:{path:'user', populate:'profile'}}, {path: 'messages', populate: {path:'user', populate:'profile'}}, {path:'pages', populate:'page'}, {path: 'purchasers', populate:[{path:'user', populate:'profile'}, {path:'comic'}, {path:'pages'}]}, {path:'tips', populate:{path:'user', populate:'profile'}}, {path:'monetization'}]})
    .populate({path: 'comics.created', populate:[{path:'admin'}, {path:'banner'}, {path:'members', populate:{path:'user', populate:'profile'}}, {path: 'messages', populate: {path:'user', populate:'profile'}}, {path:'pages', populate:'page'}, {path: 'purchasers', populate:[{path:'user', populate:'profile'}, {path:'comic'}, {path:'pages'}]}, {path:'tips', populate:{path:'user', populate:'profile'}}, {path:'monetization'}]})
    .populate({path:'comics.purchased', populate:[{path:'banner'}, {path:'pages'}]})
    .populate({path:'notifications', populate:[{path:'user', populate:'profile'}, {path:'comic', populate:'banner'}]})
    .populate('profile')
    .exec((err, foundUser)=>{
      if(err){
        console.log(err);
        res.redirect(`/?error=${err.message}`);
      } else {
        let usrComics = foundUser.comics.created.concat(foundUser.comics.admin);

        usrComics.sort((a,b)=>{
          if(a.dates.updated.date < b.dates.updated.date){
            return 1;
          } else if(a.dates.updated.date > b.dates.updated.date){
            return -1;
          } else if(a.dates.updated.date == b.dates.updated.date){
            return 0;
          }
        });

        res.render('./dashboard/frame', {user:foundUser, comics:usrComics});
      }
    });
  }
});
app.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/');
});
app.use('/fetch', fetch);
app.use('/comics', comic);
app.use('/user', userRoutes);
app.get('/pricing', (req, res)=>{
  res.render('pricing', {
    title: 'Premium Plans',
    url: `${baseURL}/pricing`,
    description: 'Check out Panel\'s Premium Plans to create your perfect experience.',
    image: `${fileURL}Panel Logo Full-01.png`,
    css_js: 'pricing' 
  });
});
app.get('/:username', (req, res)=>{
  userFindPage(req.params.username)
  .then((userID)=>{
    User.findOne({_id:userID})
    .populate({path:'comics.admin', populate:'banner'})
    .populate({path:'comics.created', populate:'banner'})
    .populate({path:'comics.following', populate:'banner'})
    .populate({path:'comics.recent', populate: 'banner'})
    .populate('banner')
    .populate('profile')
    .exec((err, foundUser)=>{
      if(err){
        res.redirect(`${req.get('Referer')}?error=${err.message}`);
      } else {
        let memberComics = foundUser.comics.admin.concat(foundUser.comics.created), recent;

        comicsFilterCreated(memberComics, foundUser.comics.recent)
        .then((comics)=>{
          recent = comics;

          return comicsFilterCreated(memberComics, foundUser.comics.following);
        })
        .then((comics)=>{
          let pageVars = {
                title: `${foundUser.username}`,
                url: `${baseURL}/${foundUser.username}`,
                description: foundUser.biography,
                image: `${fileURL}/Panel Logo Full-01.png`,
                css_js: 'user',
                comics: memberComics,
                owner: foundUser,
                recent,
                following: comics
              };
          if(foundUser.banner){
            pageVars.image = foundUser.banner.url;
          }
          res.render('user', pageVars);
        });
      }
    })
  })
  .catch((err)=>{
    if(err){
      res.redirect(`${req.get('Referer')}?error=${err.message}`);
    } else {
      res.redirect('/404');
    }
  })
});

http.listen(process.env.PORT, process.env.IP, ()=>{
  console.log('Running');
});

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
function comicsFilterCreated(comicsCreated, comics){
  return new Promise((resolve)=>{
    let comicsArr = [];
    if(comics && comics.length > 0){
      for(let comic of comics){
        if(!comicsCreated.includes(comic)){
          comicsArr.push(comic);
        }
        if(comics.pop() == comic){
          comicsArr.sort((a,b)=>{
            if(a.dates.updated.date > b.dates.updated.date){
              return 1;
            } else if(a.dates.updated.date < b.dates.updated.date){
              return -1;
            } else {
              return 0;
            }
          });
          resolve(comicsArr);
        }
      }
    } else {
      resolve(comicsArr);
    }
  });
}
function dateStringer(date, type){
  let computed = new Date(date),
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
function userFindPage(user){
  return new Promise ((resolve, reject)=>{
    if(user){
      User.findOne({username:user})
      .exec((err, usernameUser)=>{
        if(err){
          reject(err);
        } else if(usernameUser != null){
          resolve(usernameUser._id);
        } else {
          User.findOne({publicID:user})
          .exec((err, idUser)=>{
            if(err){
              reject(err);
            } else if(idUser == null) {
              reject();
            } else {
              resolve(idUser._id);
            }
          });
        }
      });
    } else {
      reject();
    }
  });
}
function userFindProfile(user){
  return new Promise((resolve, reject)=>{
    if(user){
      User.findOne({_id:user._id})
      .populate('profile')
      .populate('bag')
      .exec((err, foundUser)=>{
        if(err){
          reject(err);
        } else if(foundUser == null) {
          reject("No user found.");
        } else {
          resolve(foundUser);
        }
      })
    } else {
      resolve();
    }
  });
}