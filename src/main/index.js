import { app, BrowserWindow,ipcMain,net} from 'electron'
import {writeFile,exists,mkdir,readdir,rmdir,unlink, readFile} from 'fs'

import path from "path";








const download_path = "@/../downloads";



// Remove memory leak error
process.setMaxListeners(0);

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    show:false,
    
  })

  

 
  

  mainWindow.loadURL(winURL);

 
  
  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {

    

    var test_path = __dirname+"\\..\\..\\downloads\\temp\\"+item.getFilename();
    var result = path.win32.normalize(test_path);
  
    
    var url_name = item.getFilename();
    var file_size =item.getTotalBytes() / 1000000
    file_size = Math.round(file_size);


    // use for development
    //item.setSavePath(result); 

    // for build
     
    var test_path ="./downloads/temp/"+item.getFilename();
    
    item.setSavePath(test_path);

     

    //

    

    
    

    item.once('updated',(event,state)=>{
      
      var url_chain = item.getURLChain();
      var url_names = [];
      url_chain.forEach((chain)=>{
        var temp = chain.split("/");
        url_names.push(temp[temp.length-1]);

      })

      url_names = [...new Set(url_names)];
      
      var url_stub = "";

      url_names.forEach((name)=>{
        if(name === item.getFilename()){
          url_stub = name;
        }

      })

      webContents.send("async_download_setup",file_size,url_stub);
      
      
    })
    
    item.on('updated', (event, state) => {
      
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')

      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log("The download was paused");
        } else {
          var amount_downloaded = item.getReceivedBytes() / 1000000;
          amount_downloaded = amount_downloaded.toFixed(2);
          webContents.send("async_download_page_update_download",item.getFilename(),amount_downloaded);
          //download_page_update(item.getFilename(),amount_downloaded);
          
          // sends to download_page
          
          
        }
      }
    })

    

    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
        //finalize_download(item.getFilename());
        
        webContents.send('async_download_finalize_download',item.getFilename());
        //webContents.send("async_download_add_finish_item",item.getFilename());
      } else {
        console.log(`Download failed: ${state}`)
      }
    })

    ipcMain.on("async_download_cancel",(event,download_item)=>{
        // global event going to app.vue just to be safe
        item.pause();
        event.sender.send('async_current_download_canceled');
        
      
    })

    ipcMain.on("async_download_pause",(event,download_item)=>{
      if(download_item["url_stub"]===item.getFilename())
          if(item.isPaused()== false){
            item.pause();
            event.sender.send("async_download_state_updated","paused");
          }
    })

    ipcMain.on("async_download_resume",(event,download_item)=>{
      if(download_item["url_stub"] ===item.getFilename()){
          if(item.isPaused()==true){
              item.resume();
            event.sender.send("async_download_state_updated","downloading");
        }
      }
    })

    

    

    

    

  
  

    
  
  });
    
  
 
   

  

  
   
  mainWindow.on('ready-to-show', function() { 
    mainWindow.show(); 
    mainWindow.focus(); 
  });
    
    
  

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}




app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }

})





/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */



ipcMain.on("async_pull_feed",(event,url)=>{
  console.log("Called the pullFeed");
  let feed = "";
   let request = net.request(url);
  
   request.on("response",(res)=>{

      res.on("data",(data)=>{
          feed+=data;
      });

      res.on("error",(event,error)=>{
        console.log("There was an error loading data");
      });
      
      res.on("finish",(event)=>{
        event.sender.send("async_pull_feed_err","SomeThing went wrong");
      
        
      });
      
      res.on("end",()=>{
          console.log("main got to the end");
          event.sender.send("async_pull_feed_res",feed);
      });
   });

   request.on('error',(error)=>{
     console.log("There was a network error");
     event.sender.send('async_pull_feed_network_error');
   });

   request.end();
    
  
});



ipcMain.on("add_Feed",(event,feed_data)=>{
  console.log(feed_data);

  var gen_feed_id = Math.floor(Math.random(1) * 1000);
  var current_feed_ids = [];

  config.forEach((feed)=>{
    current_feed_ids.push(feed.id);
  });

  var result =current_feed_ids.indexOf(gen_feed_id);
  console.log("The other result  "+result);
  if(result==-1){
    var new_feed_data = {};
    new_feed_data["name"] = feed_data["name"];
    new_feed_data["url"] = feed_data["url"];
    new_feed_data["cover_path"] = feed_data["cover_path"];
    new_feed_data["id"] = gen_feed_id

    config.push(new_feed_data);
    writeFile('src/config/config.json',JSON.stringify(config,null,2),(err)=>{
      if(err){
        console.log(err);
      }
    });

  }

  else{
    while(true){
      gen_feed_id = Math.floor(Math.random(1)* 1000);
      var result = current_feed_ids.indexOf(gen_feed_id);
      if(result==-1){
        new_feed_data["name"] = feed_data["name"];
        new_feed_data["url"] = feed_data["url"];
        new_feed_data["cover_path"] = feed_data["cover_path"];
        new_feed_data["id"] = gen_feed_id;
        config.push(new_feed_data);

        writeFile('src/config/config.json',JSON.stringify(config,null,2),(err)=>{
          if(err){
            console.log(err);
          }

        });

        break;

      }
    }
  }
});

ipcMain.on("async_check_folder_exists",(event)=>{
  var check_path = "@/../downloads";
  exists(check_path,(result)=>{
    if(!result){
      mkdir(check_path,(err)=>{
        console.log(err);
        console.log('file created');
        if(!err){
          mkdir(check_path+"/temp",(err)=>{
            if(err){
              console.log(err);
            }
          });
        }
      })
    }
  })
})

ipcMain.on("async_create_download_podcast_folder",(event,podcast_name)=>{
  var podcast_download_path = download_path+"/"+podcast_name;
  exists(podcast_download_path,(result)=>{
    if(!result){
      mkdir(podcast_download_path,(err)=>{
        if(err){
          console.log(err);
        }
        
      });
    }
  })
});

ipcMain.on("async_remove_download_podcast_folder",(event,podcast_name)=>{
  var podcast_download_path = download_path+"/"+podcast_name;
  exists(podcast_download_path,(result)=>{
    if(result){
      readdir(podcast_download_path,(err,files)=>{
        if(files.length==0){
          rmdir(podcast_download_path,(err)=>{
            if(err){
              console.log(err);
            }
          })
        }
        else{
          files.forEach((file)=>{
            unlink(file,(err)=>{
              console.log(err);
            })
        })
      
    }
  })
}
  })

});

ipcMain.on("async_get_local_downloads",(event,config_data,file_path)=>{
  config_data.forEach((podcast)=>{
    var search_path = file_path+"/"+podcast.name;
    exists(search_path,(result)=>{
      if(result){
        readdir(search_path,(err,files)=>{

          if(files.length!=0){
            var total_payload =[];
            files.forEach((file)=>{
              //config_data name , url ,cover_path,id ,
              var temp = {};
              temp["podcast_name"] = podcast.name;
              temp["podcast_id"] = podcast.id;
              temp["name"] = file;
              temp["file_path"] = search_path+"/"+file;
              temp['cover_path'] = podcast.cover_path;

              total_payload.push(temp);
            })

            event.sender.send("async_dir_search_add_local_download",total_payload);
          }

        })
      }
    })

  })
 


})

  
const convertSong = (filePath) => {
  const songPromise = new Promise((resolve, reject) => {
    readFile(filePath, (err, data) => {
      if (err) { reject(err); }
      resolve(dataurl.convert({ data, mimetype: 'audio/mp3' }));
    });
  });
  return songPromise;
};


ipcMain.on("async_data_url_test",(event,file_path)=>{
  
  convertSong(file_path)
  .then((value)=>{
    event.sender.send("async_data_url_test_resp",value);
  })
  .catch((err)=>{
    console.log(err);
  })

  

})





