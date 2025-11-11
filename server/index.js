  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const bodyParser = require('body-parser');
  const { Server } = require('socket.io'); 
  const http = require('http');
  const puppeteer = require('puppeteer-extra');
  const puppeteerExtraPluginStealth = require('puppeteer-extra-plugin-stealth');
  puppeteer.use(puppeteerExtraPluginStealth());
  const { executablePath } = require('puppeteer-core');
  const { resolve } = require('path');
  const { setTimeout } = require('timers');
  // const fs = require('fs');
  require('dotenv').config();



process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Optionally restart the server if critical
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  // Optionally handle the rejection
});



const app = express();
const PORT = 5000;

// Middleware
 
app.use(express.json()); // Parse JSON bodies


app.get('/', (req, res) => {
  res.send(':>'); 
});


// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://altissia.mooo.com'], // Allow both local and production
        methods: ['GET', 'POST'],       // Allowed HTTP methods
        credentials: true,              // Allow credentials
    },
});


let browser  ;
    
 const connecting  = async (socket,{email,password}) => {
  
  while(true){
    // console.log('connecting');
     
       socket.browser = await puppeteer.launch({
            headless: false,
          //  executablePath: '/usr/bin/google-chrome',
         //  executablePath: '/usr/bin/chromium-browser',
           // executablePath: '/snap/bin/chromium',
          executablePath: '/usr/bin/chromium',
       //executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-blink-features=AutomationControlled',
              '--disable-infobars',
              '--window-size=1920,1080',
              '--disable-extensions',
              '--disable-dev-shm-usage',
              '--disable-accelerated-2d-canvas',
              '--no-first-run',
              '--no-zygote',
              '--disable-gpu'
            ],
            defaultViewport: null
        });

  socket.page = await socket.browser.newPage();
  
  await socket.page.setDefaultNavigationTimeout(10 * 60 * 5000); // 10 minutes
  await socket.page.setDefaultTimeout(10 * 60 * 5000); // 10 minutes

  const cookies = await socket.page.cookies();  
  for (let cookie of cookies) {
      await socket.page.deleteCookie(cookie);  
  }

  await socket.page.goto('https://app.ofppt-langues.ma/gw/api/saml/init?idp=https://sts.windows.net/dae54ad7-43df-47b7-ae86-4ac13ae567af/', { waitUntil: 'domcontentloaded' });
  await new Promise((resolve)=>setTimeout(resolve,1000));
  await socket.page.waitForSelector('.form-control.ltr_override.input.ext-input.text-box.ext-text-box',{timeout:5000000});
  await socket.page.type('.form-control.ltr_override.input.ext-input.text-box.ext-text-box', email);
  await socket.page.click('.win-button.button_primary.button.ext-button.primary.ext-primary');
  await new Promise((resolve)=>setTimeout(resolve,1000));
  const userErrElement = await socket.page.$('#usernameError'); // Check if the element exists
  if (userErrElement) {
    // console.log('userErr0');
    const userErr = await socket.page.evaluate((el) => el.innerHTML, userErrElement);
    if (userErr) {
      // console.log('usererr1');
      socket.emit('loginStatus', { status: 'errUsername', end: false });
      socket.connn = 'false';
      break;
    }
  }

  socket.emit('loginStatus', { status: 'accessing ', end : false });

  await socket.page.waitForSelector('.form-control.input.ext-input.text-box.ext-text-box#i0118',{timeout:500000})
  await socket.page.type('.form-control.input.ext-input.text-box.ext-text-box#i0118', password);
  await socket.page.click('.win-button.button_primary.button.ext-button.primary.ext-primary');
  await new Promise((resolve)=>setTimeout(resolve,1000));

  const pwdErrElement = await socket.page.$('#passwordError'); // Check if the element exists
  if (pwdErrElement) {
    // console.log('pwdErr0');
  const pwdErr = await socket.page.evaluate((el) => el.innerHTML, pwdErrElement);
  if (pwdErr) {
    // console.log('pwdErr');
    socket.emit('loginStatus', { status: 'errPwd', end : false });
    socket.connn = 'false';
    break;
  }
  }


  socket.emit('loginStatus', { status: 'analysing ', end : false });
  
   await Promise.race([
      socket.page.waitForSelector('.sign-in-box.ext-sign-in-box.fade-in-lightbox', { timeout: 5000000 }),  
  ]);

  socket.page.on('dialog', async (dialog) => {
    await dialog.accept(); 
  });



  // Wait for the input button to appear, with a longer timeout if needed
  const buttonSelector = "input.button.primary";
  await socket.page.waitForSelector(buttonSelector, { timeout: 1000000 }); // Wait up to 100 seconds or more if needed

 
  // Check if the next input exists
  await socket.page.waitForSelector('#idSIButton9',{timeout:500000  });
  const inputButton = await socket.page.$("input#idSIButton9");
 
 await  new Promise((resolve)=>setTimeout(resolve,5000));
  if (await socket.page.$("input#idSIButton9")) {
    
    // If the input exists, wait for the button and click it
    await socket.page.click("input#idSIButton9");
    await new Promise((resolve)=>setTimeout(resolve,5000));
    await socket.page.waitForSelector('.c-bQzyIt-kiVRfz-gap-20', { timeout: 550000 });
    
    
    socket.connn = 'true';
    break;
  } else {
    // If the input doesn't exist, log an error and handle the failure
    
   // socket.emit('loginStatus', { status: 'errNoInput', end: false });
    socket.connn = 'true';
   
    break;
  }
 }
}

 const entering = async (socket,{email,password}) => {
   console.log('enteringg');
  if (!socket.page){   await connecting(socket,{email,password}) }

  if (socket.connn == 'true' ){
    
      
      new Promise((resolve)=>setTimeout(resolve,500));
      socket.page.waitForSelector('.c-UUIxu span:nth-of-type(1)', { timeout: 5500000 });
      const actualLang = await socket.page.$eval('.c-UUIxu span:nth-of-type(1)' ,(elem) => elem.innerHTML );
     
        
      await  socket.page.waitForSelector('.c-kRsDtu', { timeout: 1500000 });
        

  //     const typeT = await socket.page.$eval('.c-fkeHKJ:nth-of-type(2) p.c-UUIxu', (levell) => {
         
  //       const typeT = levell.textContent.replace(levell.querySelector('a').textContent, '').trim();
        
  //       return { typeT, typeStatus: true };
        
  //     });

    
  // if (typeT.typeStatus){
    
  //   if (typeT.typeT !== 'Programme complet') {
    
  //     await socket.page.$eval('.c-fkeHKJ:nth-of-type(2) p.c-UUIxu a ',(aC)=>{
  //         aC.click();
  //     });
  //     await socket.page.waitForSelector('.c-hKLDcm.c-hKLDcm-bcOzrm-withBorder-true.c-hULizL:nth-of-type(7)');
  //     await new Promise((resolve)=>setTimeout(resolve,1000));
  //     await socket.page.click('.c-hKLDcm.c-hKLDcm-bcOzrm-withBorder-true.c-hULizL:nth-of-type(7)');
  //     await new Promise((resolve)=>setTimeout(resolve,500));
  //     await socket.page.click('button.c-lfgsZH.c-PJLV.c-lfgsZH-ecAMBT-variant-primary');
  //     await socket.page.waitForSelector('button.c-ccmNHq',{timeout:50000});
     
  //     await socket.page.waitForSelector('button.c-ccmNHq',{timeout:50000});
  //     await new Promise(resolve => setTimeout(resolve, 5000));
  
       
  //   }

  // }
 
       await socket.page.waitForSelector('.c-EGZmo-ibPHcsG-css',{timeout:505000});
      
      await socket.page.click('.c-EGZmo-ibPHcsG-css');
       
      await socket.page.waitForSelector('a.c-kOgFh.c-bHwuwj.c-htEJa.c-jzWmiW.c-dkjtxz', { timeout: 550000 });
      await socket.page.click('a.c-kOgFh.c-bHwuwj.c-htEJa.c-jzWmiW.c-dkjtxz');
      
      await socket.page.waitForSelector('h1.c-jzWmiW.c-PJLV.c-dTrANJ.c-jzWmiW-iHUiTj-variant-one',{timeout:100000});
      const username = await socket.page.$eval('h1.c-jzWmiW.c-PJLV.c-dTrANJ.c-jzWmiW-iHUiTj-variant-one' ,(elem) => elem.innerHTML );

      await socket.page.click('.c-dJcyxD');
        
          await user.updateOne(
            { email: email},
            { 
              $set: { 
                username: username
                      } 
            },
            { 
              upsert: true }
          ); 

      socket.emit('loginStatus', { status: 'done', end: true });
      socket.emit('loginResponse', true , {email,password,username,actualLang} );
  }
  }

io.on('connection',async (socket) => {
    
//  console.log(`New client connected`);

  socket.on('switchLang',async ({lang,email,password})=>{
    if(!socket.page){
      await connecting(socket,{email,password})
    }

    await socket.page.waitForSelector('.c-fkeHKJ:nth-of-type(1) .c-UUIxu a.c-kzvPMu.c-PJLV');
    await socket.page.click('.c-fkeHKJ:nth-of-type(1) .c-UUIxu a.c-kzvPMu.c-PJLV');
    await socket.page.waitForSelector('label.c-hKLDcm.c-hKLDcm-bcOzrm-withBorder-true',{timeout:550000});
    const langBtns = await socket.page.$$('label.c-hKLDcm.c-hKLDcm-bcOzrm-withBorder-true button');
    if (lang=='anglais'){
      await langBtns[0].click();
    }else{
      await langBtns[2].click();
    }
    await new Promise((resolve)=>setTimeout(resolve,1500));
    await socket.page.waitForSelector('button.c-lfgsZH.c-PJLV.c-lfgsZH-ecAMBT-variant-primary.c-lfgsZH-kLwveE-isPill-true.c-lkzxXa');
    await socket.page.click('.c-lfgsZH-kLwveE-isPill-true');
    await new Promise((resolve)=>setTimeout(resolve,1500));
    const b7 = await socket.page.$('.c-hKLDcm.c-hKLDcm-bcOzrm-withBorder-true');
    if (b7){
      await new Promise((resolve)=>setTimeout(resolve,1500));
        await socket.page.waitForSelector('.c-hKLDcm.c-hKLDcm-bcOzrm-withBorder-true.c-hULizL:nth-of-type(7)');
       await socket.page.click('.c-hKLDcm.c-hKLDcm-bcOzrm-withBorder-true.c-hULizL:nth-of-type(7) button');
      await new Promise((resolve)=>setTimeout(resolve,1500));
      await socket.page.click('button.c-lfgsZH.c-PJLV.c-lfgsZH-ecAMBT-variant-primary');

    }
    
    const b8 = await socket.page.$('.c-lfgsZH-jtKSBF-cv');
    if (b8) {
      await socket.page.waitForSelector('.c-lfgsZH-jtKSBF-cv');
      await socket.page.click('.c-lfgsZH-jtKSBF-cv');
      await new Promise((resolve)=>setTimeout(resolve,1500));
    }
    
   
    await new Promise((resolve) => setTimeout(resolve, 2000)); 
    const b71 = await socket.page.$('.c-isILgV');
    if (b71){
       
        await socket.page.click('.c-isILgV:nth-of-type(1)');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await socket.page.click('div.c-bQzyIt:nth-of-type(1) label.c-isILgV:nth-of-type(1)');
        // await socket.page.waitForSelector('button.c-lfgsZH.c-PJLV.c-lfgsZH-ecAMBT-variant-primary');
        await new Promise((resolve)=>setTimeout(resolve,500));
        await socket.page.click('button.c-lfgsZH.c-PJLV.c-lfgsZH-ecAMBT-variant-primary');
    }


     
     await socket.page.waitForSelector('button.c-ccmNHq',{timeout:5000});
     

     await socket.page.reload();
    
    socket.emit('switchStatus');
    
  });


  socket.on('login', async ({email, password}) => {
    

    if (!socket.page){
      await connecting(socket,{email,password});
  
    } 
    if (socket.connn){
  
      
      const existingUser = await user.findOne({ email: email , password:password});
      await new Promise((resolve) =>setTimeout(resolve,1000));

      if (existingUser) {
        await new Promise((resolve) =>setTimeout(resolve,1000));

        if(existingUser.password === password) {
          await entering(socket,{email,password});
        }else{
          socket.emit('loginResponse',  false );
        }  
      } else {
        const newUser = new user({ email: email, password: password });
        await newUser.save();
        await entering(socket, {email, password});
      }
   }
  
}  );

  

// Event listener for the 'runActv' event
socket.on('runActv', async ({ username,email,password,lang }) => {
  
  console.log('running actvs :', username);
  let lvl= '';
  let actv= '';
  let msg= '';
  if (lang=='français'){
   lvl = 'A1';
   actv = 'Donner ses informations personnelles';
   msg = 'Rencontrer quelqu\’un de nouveau / un(e) inconnu(e)';
    
  }else if (lang=='anglais'){
     lvl = 'A1';
     actv = 'Give Your Personal Information';
     msg = 'Meet Someone New';
     
  }
   
  let NumberActv = 1;

 
    while(true){
     
              // If the socket.page object is not available, initialize it by connecting
              if (!socket.page) {
                  await connecting(socket, { email, password });
              }
              // Find all buttons with the class 'c-ccmNHq' on the socket.page
            await new Promise((resolve) =>setTimeout(resolve,1000));
              await socket.page.waitForSelector('button.c-ccmNHq');
              const btns = await socket.page.$$('button.c-ccmNHq');
              await btns[1].click();

              // Find all paragraph elements with the class 'c-hVcnQI'
              await socket.page.waitForSelector('p.c-hVcnQI');
              const actvs = await socket.page.$$('p.c-hVcnQI');
              for (let actvv of actvs) {
               
                  // Get the trimmed text content of the paragraph
                  const actvText = await actvv.evaluate(el => el.textContent.trim());
                  // Click the paragraph if its text matches the provided 'actv'
                  if (actvText === actv) {
                      await actvv.click();
                      
                      // Find all modules represented by paragraphs with class 'c-hpQCTv'
                      await socket.page.waitForSelector('p.c-hpQCTv');
                      const modules = await socket.page.$$('p.c-hpQCTv');
                      for (let module of modules) {
                      
                          // Get the trimmed HTML content of the module
                          const moduleText = await module.evaluate(el => el.innerHTML.trim());

                          // Click the module if its content matches the provided 'msg'
                          if (moduleText === msg) {
                              await module.click();
                            
                              // Wait for the exercises selector and get all matching elements
                              await socket.page.waitForSelector('p.c-Wiork');
                              let exercises = await socket.page.$$('p.c-Wiork');

                              // Iterate through the exercises
                              const i =5;
                        
                                  try {
                                  
                                      socket.emit('actvStatus',`running activity number ${NumberActv} `);

                                      await socket.page.waitForSelector('p.c-Wiork',{timeout:5000});
                                      exercises = await socket.page.$$('p.c-Wiork');
                                      const exercise = exercises[5];
                                      await new Promise(resolve => setTimeout(resolve,1000));
                                      // Click on the current exercise
                                      await exercise.click();
                                      await new Promise(resolve => setTimeout(resolve, 5000));

                                      // Check for video playback controls
                                    
                                    
                                        while (true) {
                                            await new Promise((resolve)=>setTimeout(resolve,500));
                                            if (await socket.page.$('button.c-jUtMbh')) {
                                                await socket.page.$eval('button.c-jUtMbh', btn => btn.click());
                                            }
                                            new Promise((resolve)=>setTimeout(resolve,1500));
                                            if (await socket.page.$('a.c-lfgsZH-kLwveE-isPill-true')) {
                                              new Promise((resolve)=>setTimeout(resolve,1500));
                                              await socket.page.$eval('a.c-lfgsZH.c-cIdiJW.c-lfgsZH-ecAMBT-variant-primary.c-lfgsZH-kLwveE-isPill-true', btn => btn.click());
                                              new Promise((resolve)=>setTimeout(resolve,1500));
                                              break;
                                          }
                                        }
                                    
                                  } catch (error) {
                                      console.error(`Error on exercise ${i + 1}:`, error.message);
                                  }
                              
                              if (await socket.page.$('a.c-dJcyxD')){
                                await socket.page.$eval('a.c-dJcyxD',(btn)=>btn.click());

                              }

                          }
                      }
                      
                  }
              }
              NumberActv++;
               }             

});

socket.on('runHours',async({username,email,password})=>{
  console.log('Running Hours',username);
  if (!socket.page) {
    await connecting(socket, { email, password });
  }
 
   await socket.page.waitForSelector('.c-EGZmo-ibPHcsG-css',{timeout:5000});
    await socket.page.click('.c-EGZmo-ibPHcsG-css');

    await socket.page.waitForSelector('a.c-kOgFh.c-bHwuwj.c-htEJa.c-jzWmiW.c-dkjtxz', { timeout: 500000 });
    await socket.page.click('a.c-kOgFh.c-bHwuwj.c-htEJa.c-jzWmiW.c-dkjtxz');
    
    await socket.page.waitForSelector('p.c-PJLV.c-PJLV-cJbzxd-weight-500',{timeout:1000000});
    let hours = await socket.page.$eval('p.c-PJLV.c-PJLV-cJbzxd-weight-500' ,(elem) => elem.innerHTML );
  
    await socket.page.click('.c-dJcyxD');
  //console.log('oppo');
    socket.emit('hoursStatus',{status:'Done',hours:hours});

    socket.hoursInterval =  setInterval(()=>{
    //console.log('clicking');
    socket.page.$eval('button.c-ccmNHq',(div)=>div.click());
    
  },5000);
});


socket.on('stopHours', ({username,email,password}) => {
  if (socket.hoursInterval) {
    clearInterval(socket.hoursInterval);  
    console.log('Interval stopped',username);
    delete socket.hoursInterval;  
  } else {
   // console.log('No interval to stop');
  }
});


  socket.on('disconnect', async () => {
   // console.log('User disconnected');
    if(socket.page!= null ){  await socket.page.close();await socket.browser.close()  }
    socket.page = null;
    socket.browser = null;
 
   
    if (socket.hoursInterval) {
      clearInterval(socket.hoursInterval);  
      // console.log('Interval stopped');
      delete socket.hoursInterval;  
    }
  });

  socket.on('clearSession' ,async ()=>{ if(page!= null){ 
    console.log('User clearing ');
    if(socket.page!= null ){  await socket.page.close() ; await socket.browser.close() }
    socket.page = null;
    socket.browser = null;
   
   }});
});

 
// MongoDB connection - Local instance
mongoose.connect('mongodb://localhost:27017/altissiabooster')
  .then(() => console.log('✅ MongoDB Connected (Local)'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

  const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String }
  });
  
const user= mongoose.model('user', userSchema);

 
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));