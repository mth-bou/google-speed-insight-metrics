This app allows fetching performance results about a URI from Google Page Speed Insight API to store them in Web Storage.

Then, you can easily identify some slowdowns that might be happening on your website from the table results.

Soon improvements : The script is automatically rerun twice a day with the previous URI filled to add additional results to the table.

-----------------------------------------------------------------

###Requirements :
  
```
node >= v16
npm >= v7
```

-----------------------------------------------------------------

###Step 1 : Run ```npm update``` to install the project dependencies

###Step 2 : Add a ```.env``` file to the root path with your API Key : 
```API_KEY="YourGooglePageInsightKeyApi"```

###Step 3 : Run ```npm run build``` to make Webpack compiles project bundles

###Step 4 : That's all ! You can access to the home page to fill the form with a URI to test it and get results