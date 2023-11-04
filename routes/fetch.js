const router = require('express').Router(),
      multer = require('multer'),
      azure = require('azure-storage'),
      streamifier = require('streamifier'),
      cryptoStr = require('crypto-random-string'),
      azureEndpoint = 'https://panelapp.blob.core.windows.net',
      blobClient = azure.createBlobService('panelapp', process.env.AZURE),
      // MODELS
      Comic = require('../models/comic'),
      Member = require('../models/member'),
      Monetization = require('../models/monetization'),
      User = require('../models/user');


function comicCount(comics){
  return new Promise((resolve)=>{
    let total = 0;
    if(comics.length > 0){
      for(let comic of comics){
        if(comic.active == true){
          total ++;
        }
        if(comics.pop() == comic){
          resolve(total);
        }
      }
    } else {
      resolve(total);
    }
  });
}
function fileCreate(file, bonus, owner, uploader, prefix, container, comic, page){
  return new Promise((resolve, reject)=>{
    if(file){
      if(bonus == false || (bonus == true && owner.subscriptionLevel.usage.data <= owner.subscriptionLevel.limits.data)){
        let id = `${prefix}_${crypto({length:10})}.${file.originalname.split('.').pop()}`,
            fileObj = {
              comic,
              container,
              contentType: file.mimetype,
              created: Date.now(),
              id,
              name: file.originalname,
              owner,
              page,
              size: file.size,
              uploader,
              url: `${azureEndpoint}${container}/${id}`
            };
        File.create(fileObj, (err, newFile)=>{
          if(err){
            reject(err);
          } else {
            if(bonus == true){
              owner.subscriptionLevel.usage.data = (owner.subscriptionLevel.usage.data + file.size);
              owner.files.unshift(newFile);
              owner.save();
            }
            fileUpload(newFile, file.buffer, container)
            .then((fileUploaded)=>{
              resolve(fileUploaded);
            })
            .catch((err)=>{
              reject(err);
            });
          }
        });
      } else {
        reject({message:'No more storage available.'});
      }
    } else {
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
          resolve();
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
function monetizeUpdate(bool, body){
  return new Promise((resolve, reject)=>{
    if(bool == 'true'){
      let monetizeObj = {
        cost: Number(body.price)*100,
        dates: {
          requested: Date.now()
        },
        free: Number(body.free),
        style: body.style
      };
    
      if(body.bulk_items && body.bulk_discount){
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
  });
}

module.exports = router;