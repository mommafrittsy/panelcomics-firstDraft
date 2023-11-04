const router = require('express').Router(),
      multer = require('multer'),
      azure = require('azure-storage'),
      streamifier = require('streamifier'),
      cryptoStr = require('crypto-random-string'),
      azureEndpoint = 'https://panelapp.blob.core.windows.net/',
      blobClient = azure.createBlobService('panelapp', process.env.AZURE),
      // MODELS
      Comic = require('../models/comic'),
      Comment = require('../models/comment'),
      File = require('../models/file'),
      Member = require('../models/member'),
      Monetization = require('../models/monetization'),
      Page = require('../models/page'),
      User = require('../models/user');

router.get('/:id/pages/:pageID', (req, res)=>{
  pageFind(req.params.pageID)
  .then((pageId)=>{
    Page.findOne({_id:pageId})
    .populate(['bonus_materials.background', 'bonus_materials.character', 'bonus_materials.concept', 'bonus_materials.drafts', 'bonus_materials.extras', 'bonus_materials.reference', {path:'comments', populate:{path:'user', populate:'profile'}}, {path: 'credits.artist', populate:{path:'user', populate:'profile'}}, {path: 'credits.background_artist', populate:{path:'user', populate:'profile'}}, {path: 'credits.character_artist', populate:{path:'user', populate:'profile'}}, {path: 'credits.concept_artist', populate:{path:'user', populate:'profile'}}, {path: 'credits.editor', populate:{path:'user', populate:'profile'}}, {path: 'credits.lead_artist', populate:{path:'user', populate:'profile'}}, {path: 'credits.writer', populate:{path:'user', populate:'profile'}}, 'page', 'report'])
    .exec((err, foundPage)=>{
      if(err){
        res.redirect(`/comics?err=${err.message}`);
      } else if(foundPage.published == false) {
        res.redirect('/404');
      } else {
        Comic.findOne({public_id:req.params.id})
        .populate(['members', 'monetization', 'followers', 'banner', {path:'pages', populate:'page'}, 'admin'])
        .exec((err, comic)=>{
          if(err){
            res.redirect(`/comics?err=${err.message}`);
          } else if(comic == null){
            res.redirect('/404');
          } else {
            comicCheckMembers(comic, req.user)
            .then((member)=>{
              let memberStatus = false, img = `https://panelapp.blob.core.windows.net/site-images/Panel Logo Full-01.png`, show = false, mature = true, level = comic.admin.subscriptionLevel.subType;

              if(member){
                memberStatus = true;
              }

              if(foundPage.mature == true || comic.mature == true){
                if(req.user && req.user.birthdate && Date.now() - 568036800000 >= req.user.birthdate){
                  show = true;
                  img = foundPage.page.url;
                }
              } else {
                show = true;
                img = foundPage.page.url;
                mature = false;
              }
              
              res.render('../views/comic/page.ejs', {
                title: `${foundPage.title}`,
                url: `${req.path}`,
                description: foundPage.description,
                image: img,
                css_js: './comic/page',
                show,
                page: foundPage,
                member: memberStatus,
                comic,
                mature,
                level
              });
            });
          }
        });
      }
    });
  })
  .catch((err)=>{
    let code = err.statusCode || 400;

    console.log(err);
    if(code == 404){
      res.redirect('/404');
    } else {
      res.redirect(`/comics?err=${err.message}`);
    }
  });
});

router.use((req, res, next)=>{
  if(!req.user){
    res.status(400).send({message:'You must be logged in first.'});
  } else {
    next();
  }
});

router.post('/new', multer({limits:{fileSize:25000000}}).single('banner'), (req, res)=>{
  User.findOne({_id:req.user._id})
  .populate('comics.admin')
  .exec((err, foundUser)=>{
    if(err){
      res.status(400).send(err);
    } else if(foundUser == null){
      res.status(400).send({message:'User not found'});
    } else {
      comicCount(foundUser.comics.admin)
      .then((total)=>{
        if(total <= foundUser.subscriptionLevel.limits.comics){
          if(req.file && req.file.mimetype.startsWith('image')){
            return fileCreate(req.file, false, foundUser, foundUser, 'bnr', 'banners');
          } else {
            throw {message:'You must upload a banner image.'};
          }
        } else {
          throw {message:"You've reached the maximum number of active comics on your plan."};
        }
      })
      .then((file)=>{
        let memberObj = {
          accepted: true,
          number: 1,
          role: [],
          upload: true,
          user: foundUser._id
        };
        Member.create(memberObj, (err, newMember)=>{
          if(err){
            throw err;
          } else {
            monetizeUpdate(req.body.monetize, req.body)
            .then((monetization)=>{
              let comicObj = {
                admin: foundUser._id.toString(),
                banner: file,
                dates: {
                  created: Date.now(),
                  updated: {
                    date: Date.now(),
                    user: foundUser._id
                  },
                },
                members: [newMember],
                monetization,
                public_id: cryptoStr({length: 24}),
                room_key: cryptoStr({length: 24}),
                summary: req.body.summary,
                title: req.body.title,
                website: req.body.website
              }
              Comic.create(comicObj, (err, newComic)=>{
                if(err){
                  throw err;
                } else {
                  if(monetization){
                    monetization.comic = newComic;
                    monetization.save(); 
                  }
                  
                  foundUser.comics.admin.push(newComic);
                  foundUser.save();
                  res.status(200).send();
                }
              })
            })
            .catch((err)=>{
              throw err;
            });
          }
        });
      })
      .catch((err)=>{
        console.log(err);
        res.status(400).send(err);
      });
    }
  })
});
router.put('/:id/members/add', multer().fields(['members']), (req, res)=>{
  if(req.body.members){
    let memberArr;
    if(Array.isArray(req.body.members)){
      memberArr = req.body.members;
    } else {
      memberArr = Array.of(req.body.members);;
    }
    
    Comic.findOne({_id:req.params.id})
    .populate('members')
    .exec((err, foundComic)=>{
      if(err){
        res.status(400).send(err);
      } else if(foundComic == null){
        res.status(404).send({message:'Comic not found.'});
      } else {
        let currentMembers = [],
            newMembers = 0;

        for(let curmem of foundComic.members){
          currentMembers.push(curmem.user.toString());
        }

        for(let member of memberArr){
          if(!currentMembers.includes(member)){
            let memObj = {
              comic:foundComic._id,
              dates: {
                added: Date.now()
              },
              number: foundComic.members.length + (req.body.members.indexOf(member) + 1),
              user: member
            };

            Member.create(memObj, (err, newMem)=>{
              if(err){
                res.status(400).send(err);
              } else {
                foundComic.members.push(newMem);
                newMembers ++;
                if(memberArr.length - 1 == memberArr.indexOf(member)){
                  foundComic.save();
                  res.status(200).send({number: newMembers});
                }
              }
            });
          }
        }
      }
    });
  } else {
    res.status(400).send({message:'No users selected.'});
  }
});
router.get('/:id/members/:memberID', (req, res)=>{
  Comic.findOne({_id:req.params.id})
  .populate({path:'members'})
  .exec((err, foundComic)=>{
    if(err){
      res.status(400).send(err);
    } else if(foundComic == null){
      res.status(404).send({message:'Comic not found.'});
    } else {
      if(foundComic.admin.toString() == req.user._id.toString()){
        comicCheckMembers(foundComic, req.user)
        .then(()=>{

          Member.findOne({_id:req.params.memberID})
          .populate('user')
          .exec((err, foundMember)=>{
            if(err){
              res.status(400).send(err);
            } else if(foundMember == null){
              res.status(404).send({message:'Member not found.'});
            } else {
              let memObj = {
                admin: foundComic.admin.toString() == foundMember.user._id.toString(),
                canRemove: foundComic.admin.toString() == req.user._id.toString() || foundMember.user._id.toString() == req.user._id.toString(),
                canUpload: foundMember.upload,
                id: foundMember._id,
                role: foundMember.role,
                username:foundMember.user.username,
              };
              if(foundMember.accepted == true){
                memObj.status = 'Accepted';
              } else if(foundMember.dates.declined){
                memObj.status = 'Declined';
              } else {
                memObj.status = 'Pending';
              }
              res.status(200).send(memObj);
            }
          });
        })
        .catch((err)=>{
          console.log(err);
          res.status(400).send(err);
        });
      } else {
        res.status(403).send({message:'You are not the admin of this comic.'});
      }
    }
  });
});
router.delete('/:id/members/:memberID/remove', (req, res)=>{
  Comic.findOne({_id:req.params.id})
  .populate('members')
  .exec((err, foundComic)=>{
    if(err){
      res.status(400).send(err);
    } else if(foundComic == null){
      res.status(404).send({message:'Comic not found.'});
    } else {
      Member.findOne({_id:req.params.memberID})
      .exec((err, foundMember)=>{
        if(err){
          res.status(400).send(err);
        } else if(foundMember == null){
          res.status(404).send({message:'Member not found.'});
        } else if((foundComic.admin.toString() != req.user._id.toString() && foundMember.user.toString() != req.user._id.toString()) || foundMember.user.toString() == foundComic.admin.toString()){
          res.status(403).send({message:'You are not allowed to do that.'});
        } else {
          User.findOne({_id:foundMember.user})
          .exec((err, memberUser)=>{
            if(err){
              res.status(400).send(err);
            } else if(memberUser == null){
              res.status(404).send({message:'User not found.'});
            } else {
              let comicIndex = memberUser.comics.created.indexOf(foundComic._id);
              
              if(comicIndex != -1){
                memberUser.comics.created.splice(memberUser.comics.created.indexOf(comicIndex, 1));
              }
              foundComic.members.splice(foundComic.members.indexOf(foundMember));
              Member.deleteOne({_id:foundMember._id}, (err)=>{
                if(err){
                  res.status(400).send(err);
                } else {
                  memberUser.save();
                  foundComic.save();
                  res.status(200).send();
                }
              });
            }
          })
        }
      });
    }
  });
});
router.put('/:id/members/:memberID/update', multer().fields(['role', 'canUpload']), (req, res)=>{
  Comic.findOne({_id:req.params.id})
  .populate('members')
  .exec((err, foundComic)=>{
    if(err){
      res.status(400).send(err);
    } else if(foundComic == null){
      res.status(404).send({message:'Comic not found.'});
    } else if(foundComic.admin.toString() != req.user._id.toString()){
      res.status(403).send({message:'You are not allowed to do that.'});
    } else {
      Member.findOne({_id:req.params.memberID})
      .exec((err, foundMember)=>{
        if(err){
          res.status(400).send(err);
        } else if(foundMember == null){
          res.status(404).send({message:'Member not found.'});
        } else {
          if(!req.body.canUpload || req.body.canUpload === 'true'){
            foundMember.upload = true;
          } else {
            foundMember.upload = false;
          }
          if(req.body.role){
            if(Array.isArray(req.body.role)){
              foundMember.role = req.body.role;
            } else {
              foundMember.role = [req.body.role];
            }
          }
          foundMember.save();
          res.status(200).send();
        }
      });
    }
  });
});
router.put('/:id/members/:memberID/:status', (req, res)=>{
  Member.findOne({_id:req.params.memberID})
  .exec((err, foundMember)=>{
    if(err){
      res.status(400).send(err);
    } else if(foundMember == null){
      res.status(404).send({message:'Member not found.'});
    } else if(foundMember.user.toString() != req.user._id.toString()){
      res.status(403).send({message:'You are not allowed to do that.'});
    } else {
      if(req.params.status == 'accept'){
        foundMember.accepted = true;
        foundMember.dates.accepted = Date.now();
      } else {
        foundMember.accepted = false;
        foundMember.dates.declined = Date.now();
        foundMember.upload = false;
      }
      foundMember.save();
      res.status(200).send();
    }
  });
});
router.get('/:id/members/search/:username', (req, res)=>{
  User.find({username:RegExp(req.params.username, 'i'), available:true}, ['comics.admin', 'comics.created','username'], {limit: 5})
  .populate('profile')
  .exec((err, users)=>{
    if(err){
      res.status(400).send(err);
    } else if(users == null || users.length == 0){
      res.status(200).send(users);
    } else {
      Comic.findOne({_id:req.params.id})
      .populate('members')
      .exec((err, foundComic)=>{
        if(err){
          res.status(400).send(err);
        } else if(foundComic == null){
          res.status(404).send('Comic not found.');
        } else {
          let matchedUsers = [];

          for(let usr of users){
            for(let member of foundComic.members){
              if(member.toString() == usr._id.toString()){
                break;
              } else if(foundComic.members.indexOf(member) == foundComic.members.length - 1){
                let usrObj = {
                      _id: usr._id.toString(),
                      profile: usr.profile.url,
                      username: usr.username,
                    };
                matchedUsers.push(usrObj);
              }
            }
            if(users.indexOf(usr) == users.length - 1 ){
              res.status(200).send(matchedUsers);
            }
          }
        }
      });
    }
  });
});
router.get('/:id/new_page', (req, res)=>{
  Comic.findOne({public_id:req.params.id})
  .populate(['admin', 'members', 'monetization'])
  .exec((err, foundComic)=>{
    if(err){
      res.redirect(`/dashboard?error=${err.message}`);
    } else if(foundComic == null){
      res.redirect(`/dashboard?error=Comic not found.`);
    } else if(foundComic.admin.subscriptionLevel.subType == 'free' && foundComic.pages.length >= 50){
      res.redirect(`/dashboard?error=Comic has reached the max allowed pages.`);
    } else {
      comicCheckMembers(foundComic, req.user)
      .then(()=>{
        let pageObj = {
          comic:foundComic._id,
          dates: {
            created: Date.now(),
            updated: {
              date: Date.now(),
              user: req.user._id
            }
          },
          mature: foundComic.mature,
          number: foundComic.pages.length + 1,
          public_id: cryptoStr({length: 24}),
          title: `Page ${foundComic.pages.length + 1}`
        };

        if(foundComic.monetization && foundComic.monetization.approved == true && foundComic.monetization.free < pageObj.number){
          pageObj.free = false;
        } else {
          pageObj.free = true;
        }

        Page.create(pageObj, (err, newPage)=>{
          if(err){
            res.status(400).send(err);
          } else {
            foundComic.pages.push(newPage);
            foundComic.dates.updated.date = Date.now();
            foundComic.dates.updated.user = req.user;
            foundComic.save();
            res.redirect(`/comics/${req.params.id}/pages/${newPage.public_id}/edit`);
          }
        });
      })
      .catch((err) => {
        res.redirect(`/dashboard?error=${err.message}`)
      });
    }
  })
});
router.post('/:id/pages/:pageID/comments/new', multer().fields(['text']), (req, res)=>{
  Page.findOne({public_id:pagesID})
  .populate('comic')
  .exec((err, page)=>{
    if(err){
      res.status(400).send(err);
    } else if(page == null){
      res.status(404).send({message:'Page not found.'});
    } else if(page.comic.banned.includes(req.user._id.toString())){
      res.status(403).send({message:'You are not allowed to do that.'});
    } else {
      let commentObj = {
          date: Date.now(),
          public_id: cryptoStr({length:24}),
          text: req.body.text,
          user: req.user
      };

      Comment.create(commentObj, (err, comment)=>{
        if(err){
          res.status(400).send(err);
        } else {
          page.comments.push(comment);
          page.save();
          res.status(200).send(comment);
        }
      });
    }
  });
});
router.delete('/:id/pages/:pageID/discussion/:msgID/delete', (req, res)=>{
  Comic.findOne({_id:req.params.id})
  .populate('members')
  .exec((err, foundComic)=>{
    if(err){
      res.status(400).send(err);
    } else if(foundComic == null){
      res.status(404).send({message:'Comic not found.'});
    } else {
      comicCheckMembers(foundComic, req.user)
      .then((member)=>{
        Comment.findOne({_id:req.params.msgID})
        .exec((err, foundMsg)=>{
          if(err){
            res.status(400).send(err);
          } else if(foundMsg == null){
            res.status(404).send({message:'Message not found.'});
          } else if(foundMsg.user.toString() != req.user._id.toString() && foundComic.admin.toString() != req.user._id.toString()) {
            res.status(403).send({message:'You do not have permission to do that.'});
          } else {
            Comment.deleteOne({_id:foundMsg._id}, (err)=>{
              if(err){
                res.status(400).send(err);
              } else {
                Page.findOne({_id:req.params.pageID})
                .exec((err, foundPage)=>{
                  if(err){
                    res.status(400).send(err);
                  } else if(foundPage == null){
                    res.status(404).send({message:'Page not found.'});
                  } else {
                    let index = foundPage.discussion.indexOf(foundMsg._id.toString());
                    foundPage.discussion.splice(index, 1);
                    foundPage.save();
                    res.status(200).send();
                  }
                });
              }
            });
          }
        });
      })
      .catch((err)=>{
        let code = err.statusCode || 400;
        console.log(err);
        res.status(code).send(err);
      });
    }
  });
});
router.put('/:id/pages/:pageID/discussion/:msgID/:status', (req, res)=>{
  Comic.findOne({_id:req.params.id})
  .populate('members')
  .exec((err, foundComic)=>{
    if(err){
      res.status(400).send(err);
    } else if(foundComic == null){
      res.status(404).send({message:'Comic not found.'});
    } else {
      comicCheckMembers(foundComic, req.user)
      .then((member)=>{
        Comment.findOne({_id:req.params.msgID})
        .exec((err, foundMsg)=>{
          if(err){
            throw err;
          } else if(foundMsg == null) {
            throw {statusCode:404, message:'Message not found.'};
          } else if(foundMsg.user == req.user._id.toString()) {
            throw {statusCode:403, message:'Cannot like own comment.'};
          } else {
            let response = {};

            if(foundMsg[`${req.params.status}s`].includes(req.user._id.toString())){
              let index = foundMsg[`${req.params.status}s`].indexOf(req.user._id.toString());

              foundMsg[`${req.params.status}s`].splice(index, 1);
              response.removed = req.params.status;
              response.status = null;
              response[`${req.params.status}s`] = foundMsg[`${req.params.status}s`].length;
            } else {
              foundMsg[`${req.params.status}s`].push(req.user._id.toString());
              response.removed = null;
              response.status = req.params.status;
              response[`${req.params.status}s`] = foundMsg[`${req.params.status}s`].length;
            }
            if(req.params.status == 'like' && foundMsg.dislikes.includes(req.user._id.toString())){
              let index = foundMsg.dislikes.indexOf(req.user._id.toString());

              foundMsg.dislikes.splice(index, 1);
              response.removed = 'dislike';
              response.dislikes = foundMsg.dislikes.length;
            } else if(req.params.status == 'dislike' && foundMsg.likes.includes(req.user._id.toString())) {
              let index = foundMsg.likes.indexOf(req.user._id.toString());

              foundMsg.likes.splice(index, 1);
              response.removed = 'like';
              response.likes = foundMsg.likes.length;
            }
            foundMsg.save();
            response.ok = true;
            res.status(200).send(response);
          }
        });
      })
      .catch((err)=>{
        let code = err.statusCode || 400;
        res.status(code).send(err);
      });
    }
  })
});
router.post('/:id/pages/:pageID/discussion/new', multer().fields(['text']), (req, res)=>{
  Comic.findOne({_id:req.params.id})
  .populate('members')
  .exec((err, foundComic)=>{
    if(err){
      res.status(400).send(err);
    } else if(foundComic == null){
      res.status(404).send({message:'Comic not found.'});
    } else {
      comicCheckMembers(foundComic, req.user)
      .then((member)=>{
        User.findOne({_id:member.user})
        .populate('profile')
        .exec((err, foundUser)=>{
          if(err){
            res.status(400).send(err);
          } else if(foundUser == null){
            res.status(404).send({message:'User not found.'});
          } else {
            Page.findOne({_id:req.params.pageID})
            .exec((err, foundPage)=>{
              if(err){
                res.status(400).send(err);
              } else if(foundPage == null){
                res.status(404).send({message:'Page not found.'});
              } else {
                let newCommObj = {
                  date: Date.now(),
                  text: req.body.text,
                  user: member.user
                };
                
                Comment.create(newCommObj, (err, newComment)=>{
                  if(err){
                    res.status(400).send(err);
                  } else {
                    let commObj = {
                      id: newComment._id,
                      commObj: newComment._id.toString(),
                      date: newComment.date,
                      text: newComment.text,
                      user: {
                        profile: foundUser.profile.url,
                        username: foundUser.username
                      }
                    };
                    foundPage.discussion.push(newComment);
                    foundPage.save();
                    res.status(200).send(commObj);
                  }
                });
              }
            })
            
          }
        });
        
      })
      .catch((err)=>{
        let code = 400;

        if(err.statusCode){
          code = err.statusCode;
        }
        res.status(code).send(err);
      });
    }
  });
});
router.get('/:id/pages/:pageID/edit', (req,res)=>{
  Comic.findOne({public_id:req.params.id})
  .populate(['admin', {path:'members', populate:{path:'user', populate:'profile'}}])
  .exec((err, foundComic)=>{
    if(err){
      res.redirect(`/dashboard?error=${err.message}`);
    } else if(foundComic == null){
      res.redirect('/dashboard?error=Comic not found.');
    } else {
      comicCheckMembers(foundComic, req.user)
      .then((member)=>{
        Page.findOne({public_id:req.params.pageID})
        .populate(['bonus_materials.background', 'bonus_materials.character', 'bonus_materials.concept', 'bonus_materials.drafts', 'bonus_materials.extras', 'bonus_materials.reference', 'scripts', 'page', {path:'dates.updated.user', populate:'profile'}, {path:'discussion', populate:{path:'user', populate:'profile'}}, {path:'scripts', populate:{path:'uploader', populate:'profile'}}])
        .exec((err, foundPage)=>{
          if(err){
            res.redirect(`/dashboard?error=${err.message}`);
          } else if(foundPage == null){
            res.redirect('/dashboard?error=Page not found.');
          } else {
            res.render('../views/comic/pageEdit', {title:`Editing ${foundPage.title}`, description:`Page Editor for ${foundComic.title}`, image:'foundPage.page.url', url:`https://panelcomics.ink/comic/${foundComic._id}/pages/${foundPage._id}/edit`, css_js:'./comic/pageEdit', comic:foundComic, page:foundPage, admin:foundComic.admin, member});
          }
        });
      })
      .catch((err)=>{
        res.redirect(`/dashboard?error=${err.message}`);
      });
    }
  });
});
router.get('/:id/pages/:pageID/files/:fileID', (req, res)=>{
  File.findOne({_id:req.params.fileID})
  .populate({path:'uploader', populate:'profile'})
  .exec((err, foundFile)=>{
    if(err){
      res.status(400).send(err);
    } else if(foundFile == null || foundFile.active != true){
      res.status(404).send({message:'File not found.'});
    } else {
      Comic.findOne({_id:req.params.id})
      .populate('members')
      .exec((err, foundComic)=>{
        if(err){
          res.status(400).send(err);
        } else if(foundComic == null){
          res.status(404).send({message:'Comic not found.'});
        } else {
          comicCheckMembers(foundComic, req.user)
          .then(()=>{
            let fileObj = {
              contentType: foundFile.contentType,
              id: foundFile._id.toString(),
              isOwner: foundFile.owner == req.user._id.toString(),
              name: foundFile.name,
              public: foundFile.public,
              size: foundFile.size,
              uploader: {
                profile: foundFile.uploader.profile.url,
                username: foundFile.uploader.username
              },
              uploadType: foundFile.uploadType,
              url: foundFile.url
            };
            res.status(200).send(fileObj);
          })
          .catch((err)=>{
            res.status(400).send(err);
          });
        }
      });
    }
  });
});
router.delete('/:id/pages/:pageID/files/:fileID/delete', (req, res)=>{
  let id = req.params.fileID;

  File.findOne({_id:id})
  .exec((err, foundFile)=>{
    if(err){
      res.status(400).send(err);
    } else if(foundFile == null){
      res.status(404).send({message:'File not found'});
    } else if(foundFile.owner.toString() != req.user._id.toString() && foundFile.uploader.toString() != req.user._id){
      res.status(403).send({message:'You do not have permission to do this.'});
    } else {
      User.findOne({_id:foundFile.owner})
      .exec((err, foundOwner)=>{
        if(err){
          res.status(400).send(err);
        } else if(foundOwner == null){
          res.status(404).send({message:'File owner not found.'});
        } else {
          Page.findOne({_id:req.params.pageID})
          .exec((err, foundPage)=>{
            if(err){
              res.status(400).send(err);
            } else if(foundPage == null){
              res.status(404).send({message:'Page not found.'});
            } else {
              if(!foundFile.uploadType){
                foundPage.scripts.splice(foundPage.scripts.indexOf(id), 1);
              } else {
                let bonusArr = foundPage.bonus_materials[foundFile.uploadType];

                bonusArr.splice(bonusArr.indexOf(id), 1);
              }
              foundOwner.files.splice(foundOwner.files.indexOf(req.params.fileID), 1);
              foundOwner.subscriptionLevel.usage.data = foundOwner.subscriptionLevel.usage.data - foundFile.size;
              foundOwner.save();
              foundPage.save();

              fileDelete(foundFile)
              .then(()=>{
                res.status(200).send();
              })
              .catch((err)=>{
                res.status(400).send(err);
              });
            }
          });
        }
      });
    }
  });
});
router.put('/:id/pages/:pageID/files/:fileID/public_update', (req, res)=>{
  File.findOne({_id:req.params.fileID})
  .exec((err, foundFile)=>{
    if(err){
      res.status(400).send(err);
    } else if(foundFile == null) {
      res.status(404).send({message:'File not found.'});
    } else if(foundFile.owner != req.user._id.toString()){
      res.status(403).send({message:'You do not have permission to do that.'});
    } else {
      foundFile.public = !foundFile.public;
      foundFile.save();

      res.status(200).send({bool:foundFile.public});
    }
  });
});
router.post('/:id/pages/:pageID/files/new', multer({limits:{fileSize:5000000000, files:10}}).array('files'), (req, res)=>{
  let files = req.files.filter(file => (file.mimetype.startsWith('video') && file.size <= 5000000000) || file.size <= 25000000), totalSize = files.reduce((acc, cur)=>{
    return acc + cur.size;
  }, 0);
  Comic.findOne({_id:req.params.id})
  .populate(['admin', 'members'])
  .exec((err, foundComic)=>{
    if(err){
      res.status(400).send(err);
    } else if(foundComic == null){
      res.status(404).send({message:'Comic not found.'});
    } else if(foundComic.admin._id == undefined){
      res.status(404).send({message:'Admin not found.'});
    } else if(req.body.type != 'scripts' && foundComic.admin.subscriptionLevel.limits.data <= (foundComic.admin.subscriptionLevel.usage.data + totalSize)){
      res.status(403).send({message:'There is not enough data available.'});
    } else {
      comicCheckMembers(foundComic, req.user)
      .then((member)=>{
        if(member.upload == true){
          User.findOne({_id:foundComic.admin._id})
          .exec((err, foundAdmin)=>{
            if(err){
              throw err;
            } else {
              Page.findOne({_id:req.params.pageID})
              .exec((err, foundPage)=>{
                if(err){
                  throw err;
                } else if(foundPage == null){
                  throw {message:'Page not found.', statusCode:404};
                } else {
                  let newFiles  = [];
                  for(let file of files){
                    let prefix = 'up', container = 'uploads';
                    if(req.body.type == 'scripts'){
                      prefix = 'scr';
                      container = 'scripts';
                    }
                    fileCreate(file, req.body.type != 'scripts', foundAdmin, req.user, prefix, container, foundComic, foundPage, req.body.type)
                    .then((upload)=>{
                      if(req.body.type == 'scripts'){
                        foundPage.scripts.push(upload);
                      } else {
                        foundPage.bonus_materials[req.body.type].push(upload);
                      }
                      let fileObj = {
                        contentType: upload.contentType,
                        id: upload._id.toString(),
                        name: upload.name,
                        type: req.body.type,
                        url: upload.url
                      }
                      newFiles.push(fileObj);
                      if(newFiles.length == files.length){
                        foundAdmin.save();
                        foundPage.save();
                        res.status(200).send({files:newFiles});
                      }
                    })
                    .catch((err)=>{
                      throw err;
                    });
                  }
                }
              });
            }
          });
        } else {
          throw {message:'You do not have permission to do that.', statusCode: 403};
        }
      })
      .catch((err)=>{
        let code = 400;
        console.log(err);
        if(err.statusCode){
          code = err.statusCode;
        }
        res.status(code).send(err);
      });
    }
  });
});
router.put('/:id/pages/:pageID/info', multer().fields([]), (req, res)=>{
  Comic.findOne({_id:req.params.id})
  .populate('members')
  .exec((err, foundComic)=>{
    if(err){
      res.status(400).send(err);
    } else if(foundComic == null){
      res.status(404).send({message:'Comic not found.'});
    } else {
      comicCheckMembers(foundComic, req.user)
      .then(()=>{
        Page.findOne({_id:req.params.pageID})
        .exec((err, foundPage)=>{
          if(err){
            throw err;
          } else if(foundPage == null){
            throw {statusCode:404, message:'Page not found.'};
          } else {
            let keyArr = Array.from(Object.keys(req.body));

            for(let key of keyArr){
              if(foundPage[key] && req.body[key] != foundPage[key]){
                foundPage[key] = req.body[key];
              } else if(foundPage.credits[key]){
                if(Array.isArray(req.body[key])){
                  foundPage.credits[key] = req.body[key];
                } else {
                  foundPage.credits[key] = [req.body[key]];
                }
              } else if(!foundPage[key]){
                foundPage[key] = req.body[key];
              } else if(key == 'patrons'){
                if(Array.isArray(req.body.patrons)){
                  foundPage.credits.patrons = foundPage.credits.patrons.concat(req.body.patrons);
                } else {
                  foundPage.credits.patrons.push(req.body.patrons);
                }
              } else if(key == 'remove_patrons'){
                if(Array.isArray(req.body.remove_patrons)){
                  for(let patron of Array.of(req.body.remove_patrons)){
                    foundPage.credits.patrons.splice(foundPage.credits.patrons.indexOf(patron), 1);
                  }
                } else {
                  console.log(foundPage.credits.patrons.indexOf(req.body.patrons));
                  foundPage.credits.patrons.splice(foundPage.credits.patrons.indexOf(req.body.remove_patrons), 1);
                }
              }
              if(keyArr.indexOf(key) == keyArr.length - 1){
                foundPage.save();
                foundComic.dates.updated.date = Date.now();
                foundComic.dates.updated.user = req.user;
                foundComic.save();
                res.status(200).send();
              }
            }
          }
        });
      })
      .catch((err)=>{
        let code = err.statusCode || 400;
        res.status(code).send(err);
      });
    }
  });
});
router.post('/:id/pages/:pageID/page_upload', multer({limits:{fileSize:25000000}}).single('file'), (req, res)=>{
  Comic.findOne({_id:req.params.id})
  .populate('admin')
  .populate('members')
  .exec((err, foundComic)=>{
    if(err){
      res.status(400).send(err);
    } else if(foundComic == null){
      res.status(404).send({message:'Comic not found.'});
    } else {
      comicCheckMembers(foundComic, req.user)
      .then((member)=>{
        Page.findOne({_id:req.params.pageID})
        .populate('page')
        .exec((err, foundPage)=>{
          if(err){
            throw err;
          } else if(foundPage == null){
            throw {statusCode:404, message:'Page not found.'};
          } else {
            fileDelete(foundPage.page)
            .then(()=>{
              return fileCreate(req.file, false, foundComic.admin, req.user, 'page', 'pages', foundComic, foundPage, req.file.mimetype);
            })
            .then((file)=>{
              foundPage.page = file;
              foundPage.save();
              foundComic.dates.updated.date = Date.now();
              foundComic.dates.updated.user = req.user;
              foundComic.save();
              res.status(200).send(err);
            })
            .catch((err)=>{
              throw err;
            });
          }
        });
      })
      .catch((err)=>{
        let code = err.statusCode || 400;
        console.log(err);
        res.status(code).send(err);
      });
    }
  });
});
router.post('/:id/pages/:pageID/publish', (req, res)=>{
  Comic.findOne({_id:req.params.id})
  .populate('members')
  .exec((err, comic)=>{
    if(err){
      res.status(400).send(err);
    } else if(comic == null){
      res.status(404).send({message:'Comic not found.'});
    } else {
      comicCheckMembers(comic, req.user._id, true)
      .then(()=>{
        Page.findOne({_id:req.params.pageID})
        .exec((err, page)=>{
          if(err){
            throw err;
          } else if(page == null) {
            throw {statusCode:404, message:'Page not found.'};
          } else {
            page.published = true;
            page.dates.published = Date.now();
            page.save();
            comic.dates.updated.date = Date.now();
            comic.dates.updated.user = req.user;
            comic.save();
            res.status(200).send();
          }
        });
      })
      .catch((err)=>{
        let code = err.statusCode || 400;
        console.log(err);
        res.status(code).send(err);
      });
    }
  });
});
router.put('/:id/social/update', multer().fields(['name', 'value']), (req, res)=>{
  Comic.findOne({_id:req.params.id})
  .populate('members')
  .exec((err, foundComic)=>{
    if(err){
      res.status(400).send(err);
    } else if(foundComic == null){
      res.status(404).send({message:'Comic not found.'});
    } else {
      comicCheckMembers(foundComic, req.user)
      .then(()=>{
        if(!foundComic.social[req.body.name] || foundComic.social[req.body.name] != req.body.value){
          foundComic.social[req.body.name] = req.body.value;
          foundComic.save();
          res.status(200).send({updated:true});
        } else {
          res.status(200).send({updated:false});
        }
      })
      .catch((err)=>{
        console.log(err);
        res.status(403).send(err);
      });
    }
  });
});
router.put('/:id/:toggle', (req, res)=>{
  Comic.findOne({_id:req.params.id})
  .exec((err, foundComic)=>{
    if(err){
      res.status(400).send(err);
    } else if(foundComic == null){
      res.status(404).send({message:'Comic not found.'});
    } else if(foundComic.admin.toString() != req.user._id.toString()){
      res.status(401).send({message:'You are not allowed to do that.'});
    } else {
      foundComic[req.params.toggle] = !foundComic[req.params.toggle];
      foundComic.dates.updated = {date:Date.now(), user:req.user};
      foundComic.save();
      res.status(200).send({bool:foundComic[req.params.toggle]});
    }
  });
});
router.put('/:id/update', multer({limits:{fileSize:25000000}}).single('banner'), (req, res)=>{
  Comic.findOne({_id:req.params._id})
  .populate('banner')
  .exec((err, foundComic)=>{
    if(err){
      res.status(400).send();
    } else if(foundComic == null){
      res.status(404).send({statusCode:404, message:'Comic not found.'});
    } else if(foundComic.admin != req.user._id.toString()) {
      res.status(403).send({statusCode:403, message:'Update not allowed.'});
    } else {
      fileCreate(req.file, false, req.user, req.user, 'bnr', 'banners', foundComic._id, null, 'image')
      .then((uploadedFile)=>{
        let fileToDelete;
        if(uploadedFile){
          fileToDelete = foundComic.banner;
          foundComic.banner = uploadedFile;
        }

        return fileDelete(fileToDelete);
      })
      .then(()=>{
        return monetizeUpdate(req.body.monetize, req.body, foundComic.monetization);
      })
      .then((monetization)=>{
        let timesArr, siteParsed;
        if(monetization){
          foundComic.monetization = monetization;
        }
        
        if(Array.isArray(req.body.day)){
          if(['weekly', 'biweekly'].includes(req.body.schedule)){
            timesArr = req.body.day.filter(day => !/[0-9]/.test(day) );
          } else if(req.body.schedule == 'monthly'){
            timesArr = req.body.day.filter(day => /[0-9]/.test(day) );
          }
        } else {
          timesArr = [req.body.day];
        }
        foundComic.dates.updated = {date: Date.now(), user: req.user};
        foundComic.schedule = {style: req.body.schedule, times: timesArr};
        for(let ele of ['title', 'summary']){
          foundComic[ele] = req.body[ele];
        }
        if(req.body.website.startsWith('https://') || req.body.website.startsWith('http://')){
          siteParsed = req.body.website;
        } else {
          siteParsed = `https://${req.body.website}`;
        }
        foundComic.website = siteParsed;
        foundComic.save();
        res.status(200).send();
      })
      .catch((err)=>{
        let statusCode = err.statusCode || 400;

        console.log(err);
        res.status(statusCode).send(err.message);
      });
    }
  });
});



module.exports = router;

function comicCheckMembers(comic, user, required){
  return new Promise((resolve, reject)=>{
    if(comic){
      if(required == true || user){
        let checked = false, memObj;
        for(let member of comic.members){
          if((member._id && member.user._id.toString() == user._id.toString()) || member.user.toString() == user._id.toString()){
            memObj = member;
            checked = true;
          }
          
          if(comic.members.indexOf(member) == comic.members.length - 1){
            if(checked == true){
              resolve(memObj);
            } else if(required && required == false){
              resolve();
            } else {
              reject({message:'You are not a member of that comic.', statusCode: 403});
            }
          }
        }
      } else {
        resolve();
      }
    } else {
      reject({message:'No comic provided.'});
    }
  });
}
function comicCount(comics){
  return new Promise((resolve)=>{
    let total = 0;
    
    if(comics.length > 0){
      for(let comic of comics){
        if(comic.active == true){
          total ++;
        }
        if(comics.indexOf(comic) == comics.length - 1){
          resolve(total);
        }
      }
    } else {
      resolve(total);
    }
  });
}
function fileCreate(file, bonus, owner, uploader, prefix, container, comic, page, uploadType){
  return new Promise((resolve, reject)=>{
    if(file){
      if(bonus == false || (bonus == true && owner.subscriptionLevel.usage.data <= owner.subscriptionLevel.limits.data)){
        let id = `${prefix}_${cryptoStr({length:24})}.${file.originalname.split('.').pop()}`,
            fileObj = {
              comic,
              container,
              contentType: file.mimetype.split('/')[0],
              created: Date.now(),
              id,
              name: file.originalname,
              owner,
              page,
              size: file.size,
              uploader,
              url: `${azureEndpoint}${container}/${id}`
            };

        if(container == 'uploads'){
          fileObj.uploadType = uploadType;
        }

        File.create(fileObj, (err, newFile)=>{
          if(err){
            console.log(err);
            reject(err);
          } else {
            if(bonus == true){
              owner.subscriptionLevel.usage.data = (owner.subscriptionLevel.usage.data + file.size);
              owner.files.unshift(newFile);
            }
            
            fileUpload(newFile, file.buffer, container)
            .then((fileUploaded)=>{
              resolve(fileUploaded);
            })
            .catch((err)=>{
              console.log(err);
              reject(err);
            });
          }
        });
      } else {
        reject({message:'No more storage available.'});
      }
    } else {
      console.log('File not found.');
      resolve();
    }
  });
}
function fileDelete(file){
  return new Promise((resolve, reject)=>{
    if(file){
      blobClient.deleteBlobIfExists(file.container, file.id,  (err, response)=>{
        if(err != null){
          reject(err);
        } else {
          File.deleteOne({_id:file._id}, ()=>{
            resolve();
          });
        }
      })
    } else {
      resolve();
    }
  });
}
function fileUpload(file, buffer){
  return new Promise((resolve, reject)=>{
    if(file){
      let stream = streamifier.createReadStream(buffer),
          options = {contentSettings:{contentType:file.contentType, metadata:{fileName:file.id}}};

      blobClient.createBlockBlobFromStream(file.container, file.id, stream, file.size, options, (err)=>{
        if(err != null){
          reject(err);
        } else {
          resolve(file);
        }
      });
    } else {
      reject({message:'No file received.'});
    }
  });
}
function monetizeCompare(body, prior){
  return new Promise((resolve, reject)=>{
    if(prior){
      Monetization.findOne({_id:prior}, (err, priorMon)=>{
        if(err){
          reject(err);
        } else if(priorMon.bulk.discount != body.bulk_discount || priorMon.bulk.items != body.bulk_items || priorMon.cost != (body.price * 100) || prior.free != body.free){
          Monetization.deleteOne({_id:prior});
          resolve(true);
        } else {
          resolve(false);
        }
      });
    } else {
      resolve(true);
    }
  });
}
function monetizeUpdate(bool, body, prior){
  return new Promise((resolve, reject)=>{
    if(bool == 'true'){
      
      monetizeCompare(body, prior)
      .then((replace)=>{
        if(replace == true){
          let monetizeObj = {
            cost: Number(body.price)*100,
            dates: {
              requested: Date.now()
            },
            free: Number(body.free),
            style: body.style
          };
        
          if(body.style == 'page' && body.bulk_items && body.bulk_discount){
            monetizeObj.bulk = {
              discount: body.bulk_discount,
              items: body.bulk_items
            }
          }
          Monetization.create(monetizeObj, (err, newMonetization)=>{
            if(err){
              reject(err);
            } else {
              resolve(newMonetization);
            }
          });
        } else {
          resolve();
        }
      })
      .catch((err)=>{
        reject(err);
      });
    } else {
      resolve();
    }
  });
}
function pageFind(id) {
  return new Promise((resolve, reject)=>{
    Page.findOne({public_id:id})
    .exec((err, pageById)=>{
      if(err){
        reject(err);
      } else if(pageById == null){
        Page.findOne({title:id})
        .exec((err, pageByTitle)=>{
          if(err){
            reject(err);
          } else if(pageByTitle == null){
            reject({statusCode:404, message:'Page not found.'});
          } else {
            resolve(pageByTitle._id);
          }
        });
      } else {
        resolve(pageById._id);
      }
    });
  });
}