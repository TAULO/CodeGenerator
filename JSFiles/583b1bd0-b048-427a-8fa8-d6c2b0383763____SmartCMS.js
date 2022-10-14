

SmartCMSLoaded = false;
SmartCMSLoadingTime = 0;


 var smartCms = function(callback,json,app)
{
    //Properties for Cache progress
    this.app = app;
    this.totalNbCells = 1;
    this.currentNbCells = 0;
    this.ProjectID = null;
    this.ProjectName = null;
    this.Host = null;
    this.ProjectEnvironment = null;
    this.Version = null;
    this.DatatableNames = null;
    this.EnableCaching = null;
    this.callback = callback;
    this.json = json;
    
    window.SmartCMSLoaded = false;  
    
};

smartCms.prototype.initialize = function(){
    this.ProjectID = this.json.ProjectID;
    this.Host = this.json.Host;
    this.EmailHost = this.json.EmailHost;
    this.ProjectName = this.json.ProjectName;
    this.ProjectEnvironment = this.json.ProjectEnvironment;
    this.Version = this.json.Version;
    this.DatatableNames = this.json.DatatableNames;
    this.EnableCaching = (this.json.EnableCaching == 'true'); 
    this.initializeCache(this.callback);
};

smartCms.prototype.initializeCache = function(callback) {
    
    if(SmartCMSLoaded)
        return;
    
    var self = this;
    
    //Properties for Cache progress
    this.totalNbCells = 1;
    this.currentNbCells = 0;
    
    this.startDate = new Date();
    
    this.GetCacheStatus(callback); 
    
    
};

smartCms.prototype.getLoadingTotalTime = function(suffix){
    
    if(suffix === undefined)
        suffix = "";
    
    var difference_ms = new Date().getTime() - this.startDate.getTime(); 
    return String(difference_ms) + suffix;
};

smartCms.prototype.GetCacheStatus = function(callback){
    var jsonTable;
    
    var self = this;

    var urlRequest = this.Host + "/Restful/ListAllProjectTables?projectID=" + this.ProjectID + "&environment=" + this.ProjectEnvironment.toString();
    
    
    var onFinishedCheckingStatus = function(){
        //Load cache, then call event when completed
        self.LoadCache(function(cache){
            
              console.log("Online cache loaded in " + self.getLoadingTotalTime(" Milliseconds"));
              window.SmartCMSLoaded = true;
              self.app.fire(SmartCMS.Events.LoadingCacheSuccess);
              self.app.fire(SmartCMS.Events.LoadingCacheDone,self.getLoadingTotalTime()); 
              SmartCMSLoadingTime = self.getLoadingTotalTime();
              callback();
        });  
    };
    
   
    // Load and deserialize new cached from CMS
    $.ajax({
        url: urlRequest,
        type: 'GET',
        async: true,
        success: function(data) {
       
        // Parse data, is it a error message or actual json table
        jsonTable = JSON.parse(data.Message);    
        
        console.log(jsonTable);
      
        for(var i = 0; i < jsonTable.length; i++)
        {
            if(!self.IsTableStatusCached(jsonTable[i].Name,jsonTable[i].ModificationDate))
            {
                onFinishedCheckingStatus();
                return;
            }
        }
            
         
          console.log("Online cache loaded in " + self.getLoadingTotalTime(" Milliseconds"));
          window.SmartCMSLoaded = true;
          self.app.fire(SmartCMS.Events.LoadingCacheSuccess);
          self.app.fire(SmartCMS.Events.LoadingCacheDone,self.getLoadingTotalTime()); 
          SmartCMSLoadingTime = self.getLoadingTotalTime();
          callback();
        },
      
        
        error: function(message) {
            onFinishedCheckingStatus();
        },


    });
};

// Load cache and store it within the user's local storage
smartCms.prototype.LoadCache = function(onComplete) {

    var index = 0;

    var Cache = [];
    
    var self = this;
    
    var OnDataTableCached = (function(currentDatatable, message) {
      
        index++;
        
        if(currentDatatable !== null)
            Cache.push(currentDatatable);
        else
            console.error("Cannot cache datatable : " + self.DatatableNames[index-1] + " because it is not in the CMS Project");

        if (index > self.DatatableNames.length - 1) {
            console.log("Get all datatables completed");
            onComplete(Cache);
        } 
        else 
        {
            self.CacheDataTable(self.DatatableNames[index], OnDataTableCached);
        }


    });
                               
    this.CacheDataTable(this.DatatableNames[index], OnDataTableCached);

   

};




//Will cache a datatable from the CMS into user's local storage
smartCms.prototype.CacheDataTable = function(tableName, onComplete) {

    var jsonTable;
    
    var self = this;

    var urlRequest = this.Host + "/Restful/FindDataTable?projectID=" + this.ProjectID + "&tableName=" + encodeURI(tableName) + "&environment=" + this.ProjectEnvironment.toString() + "&locale=" + "all" + "&withSchema=true";

    console.log(urlRequest);
    
   
    // Load and deserialize new cached from CMS
    $.ajax({
        url: urlRequest,
        type: 'GET',
        async: true,
        success: function(data) {
        // Parse data, is it a error message or actual json table
        jsonTable = JSON.parse(JSON.stringify(data));    
        
        if (self.IsTableCached(jsonTable)) {

        // Already in cache, return cached table
        jsonTable = SmartCMSDataProvider.GetDataTableWithParameters(tableName);
        console.log("Cached already, returns cached table");
        onComplete(jsonTable, tableName);
        return;
        }
    
        // Ajax Request failed
        if(jsonTable.Result == "Error")
        {
            console.error(data.Message);
            self.app.fire(SmartCMS.Events.LoadingCacheError);
            onComplete(null, data.Message);
            return;
        }
            console.log(jsonTable);
            
            
            SmartCMSDataSerializer.Deserialize(jsonTable,function(table){     
                  self.SetDataTableInCache(table);
                  onComplete(table,jsonTable.Name);
                });
        },
        
        error: function(message) {
        
       
        self.app.fire(SmartCMS.Events.LoadingCacheError);
        onComplete(null,message);
        },


    });


};

smartCms.prototype.getFormattedTableName = function(tableName){
    
    if(tableName === null || tableName === undefined)
        return "";
    
    else if(tableName.indexOf(this.ProjectName) >= 0)
    {
        return tableName;
    }
    else
    {
        return (tableName + "-" + this.ProjectName);
    }
    
};



smartCms.prototype.SetDataTableInCache = function(table) {

    if (this.EnableCaching) {

        if (this.IsTableCached(table)) {
            console.log(table.Name + " is already cached in database");
            return;
        }


        if (table !== null) {
            var jsonData = JSON.stringify(table);
            localStorage.setItem(this.getFormattedTableName(table.Name), jsonData );
        } else {
            console.log("Caching and storing table failed");
        }

    } else {
        console.log("Caching is disabled, cannot save table");
    }


};


smartCms.prototype.IsTableStatusCached = function(tableName,timestamp) {

   
    if(this.DatatableNames.indexOf(tableName) < 0)
    {
        return true;
    }
    
    timestamp = String(timestamp);
    var tableTimeStamp = String(SmartCMSDataProvider.GetDataTableTimeStamp(this.getFormattedTableName(tableName)));
    

    if( tableTimeStamp !== null && tableTimeStamp !== "")
    {
        var isCached =  timestamp === tableTimeStamp;
        return isCached;
    }
    
    return false;
    
};


smartCms.prototype.IsTableCached = function(table) {

    
    
    if(table === null)
        return false;
    
    if(!table.hasOwnProperty('Name'))
        return false;
    
    var timeStamp = SmartCMSDataProvider.GetDataTableTimeStamp(this.getFormattedTableName(table.Name));
    

    if( timeStamp !== null && timeStamp !== "")
    {
        return table.TimeStamp == String(timeStamp);
    }
    
    return false;
    
};

smartCms.prototype.DeleteCache = function() {
    localStorage.Clear();

};






/*SMART CMS MODEL*/

var SmartCMSDataModel = function(datatableName,datatableRow,rowIndex){
    this.datatableName = datatableName;
    this.isInitialized = false;
    this.rowIndex = rowIndex === undefined ? 0 : rowIndex;
    this.initialize(datatableName,datatableRow);

    
};


SmartCMSDataModel.prototype.initialize = function(datatableName,datatableRow){
    
     if(datatableRow !== null && datatableRow !== undefined)
     {
         var keys = Object.keys(datatableRow);
         var currentRow;

         for(var i = 0; i < keys.length;i++)
         {
                currentRow = datatableRow[keys[i]];

                //Handling a table reference
                if(currentRow.hasOwnProperty('referenceID'))
                {
                  this.setDataTableReference(keys[i],currentRow);
                }
                else
                  this[keys[i]] = currentRow;     

          }
           this.isInitialized = true;
      }
    
    
    
    
    
};


SmartCMSDataModel.prototype.setContent = function(property,value){
    
    if(this.hasOwnProperty(property))
    {
       this[property] = value; 
    }
    
};


SmartCMSDataModel.prototype.hasProperty = function(property){
    return this.hasOwnProperty(property);
};

SmartCMSDataModel.prototype.setDataTableReference = function(property,datatableReference){
    
   
   
    var currentRow = SmartCMSDataProvider.GetDataTableRowByFixedID(datatableReference.referenceName,datatableReference.referenceID);
    
    if(currentRow !== null && currentRow !== undefined)
    {
        this[property] = currentRow;
    }
 
    
    
   
};


/* SMART CMS PROVIDER */


var SmartCMSDataProvider = {
    
};


SmartCMSDataProvider.FileData = function(label, url,extension) {
    this.Label = {"default":label};
    this.Url = {"default" :url};
    this.Extension = {"default":extension};
};


SmartCMSDataProvider.FileDataCollection = function(Files) {
    this.Files = Files;
};

SmartCMSDataProvider.FileDataCollection.prototype.GetByExtension = function(extensions) {
    
     return this.Files.filter(function(extension){
         return extensions.contains(extension);
     });
    
};



SmartCMSDataProvider.GetDataTable = function(tableName) {

    tableName = SmartCMS.I.getFormattedTableName(tableName);

    var datatable = this.GetDataTableWithParameters(tableName);
    var rows = [];
    
    if(datatable !== null)
    {
        for(var i = 0; i < datatable.Rows.length;i++)
        {
            rows.push(new SmartCMSDataModel(tableName,datatable.Rows[i],i));
        }
       
        return rows;
       
    }
    
    else
    return null;
};

SmartCMSDataProvider.GetDataTableASync = function(tableName,delegate) {

    tableName = SmartCMS.I.getFormattedTableName(tableName);
    if(window.SmartCMSLoaded === true)
    {
        var table = SmartCMSDataProvider.GetDataTable(tableName);
        if(table === null || table === undefined)
           {
              
               SmartCMSDataProvider.OnFailedGetDataTableASync(tableName,delegate);
               //console.warn("table is not avaiable with GetDataTableAsync :" + tableName + "... retrying again");
               return;
         }
     
        delegate(table);  
        return;
    }
    else
    {
       FrameworkEnvironment.app.once(SmartCMS.Events.LoadingCacheDone,function(){
        
           var table = SmartCMSDataProvider.GetDataTable(tableName);
           
           if(table === null || table === undefined)
           {
              
               SmartCMSDataProvider.OnFailedGetDataTableASync(tableName,delegate);
               //console.warn("table is not avaiable with GetDataTableAsync :" + tableName + "... retrying again");
               return;
           }
         
           delegate(table); 
       }); 
    }
};

SmartCMSDataProvider.OnFailedGetDataTableASync = function(tableName,delegate)
{
     setTimeout(function(){
                    SmartCMSDataProvider.GetDataTableASync(tableName,delegate);
               },1000);
};


SmartCMSDataProvider.GetDataTableColumn= function(tableName,columnName) {

     tableName = SmartCMS.I.getFormattedTableName(tableName);
    var datatable = this.GetDataTable(tableName);
    var columns = [];
    for(var i = 0; i < datatable.length; i++)
    {
      if(datatable[i][columnName] === undefined)
      {
         console.error("GetDataTableColumn failed: invalid columnName of type: " + columnName);
         break;
      }
      columns.push(datatable[i][columnName]);
    }
    return columns;
};

SmartCMSDataProvider.GetDataTableRowByFixedID= function(tableName,fixedID) {

    tableName = SmartCMS.I.getFormattedTableName(tableName);
    var datatable = this.GetDataTable(tableName);
    
    if(datatable !== null && datatable !== undefined)
    {
        for(var i = 0; i < datatable.length; i++)
        {
            if(datatable[i]["FixedId"] === fixedID)
            {
                return datatable[i];
            }
        }
        
        //console.warn("GetDataTableRowByFixedID failed: invalid fixedID:" + fixedID + " in datatable : " + tableName);
    
    }
    
    //console.warn("GetDataTableRowByFixedID failed: invalid datatable not found in cache:" + tableName);
    
    
    return null;
};





SmartCMSDataProvider.GetDataTableWithParameters = function(tableName) {

    tableName = SmartCMS.I.getFormattedTableName(tableName);
    var datatable = localStorage.getItem(tableName);
    
    var jsonData;

   try
   {
       jsonData = jQuery.parseJSON(datatable);
   }
  catch(err)
  {
        return null;
  }

    return jsonData;

};


SmartCMSDataProvider.GetDataTableTimeStamp = function(tableName) {

    tableName = SmartCMS.I.getFormattedTableName(tableName);
    var tableCached = this.GetDataTableWithParameters(tableName);
    
    if(tableCached === null)
        return "";
    else
        return String(tableCached.TimeStamp);

};




/* SMART CMS SERIALIZER */

var SmartCMSDataSerializer = {};



// Will return the CMS JSON Data to a Model matching the datatable
SmartCMSDataSerializer.Deserialize = function(table,onComplete) {
    
   
    
    //Check if table request has been succeded
    if(table === null)
    {
        onComplete(null);
        return;
    }
    
    if(!table.hasOwnProperty('Rows'))
    {
        onComplete(null);
        return;
    }
    
    //Update propreties for cache loading progress
    
    if(table.Rows.length <= 0)
    {
        onComplete(table);
        return;
    }
       

  
    //Cached Properties to build Rows and Cells of table
    var deserializedTable = [table.Rows.length];
    var LanguagesKeys =[];
    var reference;
    var cellProperty;
    var fileList;
    
    //Javascript object prototype that will build model
    
    var model = {};
    
    this.totalNbCells = table.Rows.length * table.Rows[0].Cells.length;
    this.currentNbCells = 0;
    
    
    for (var s = 0; s < table.Schema.length; s++) {
     
        if(table.Schema[s].Config !== null && table.Schema[s].Config !== undefined)
        {
         
            if(table.Schema[s].Config.hasOwnProperty('EnumValues'))
            {
                  
                if(table.Schema[s].Config.EnumValues.length > 0)
                {
                    
                    SmartCMSEnum.addEnum(table.Schema[s].Name,table.Schema[s].Config.EnumValues);
                }
                
            }
        }
    }
    

    for (var i = 0; i < table.Rows.length; i++) {

        model = {};
       
        model["FixedId"] = table.Rows[i].FixedId;
        model["Id"] = table.Rows[i].Id;

        for (var j = 0; j < table.Rows[i].Cells.length; j++) {

            // Take Cell proprety variable and analyze its content, set value in consequence
            cellProperty = table.Rows[i].Cells[j];
            
            switch(cellProperty.Type)
            {
                case "reference":
                
                model[cellProperty.Name] = {};
                
                if(cellProperty.Value !== null && cellProperty.Value !== undefined)
                {
                    reference = cellProperty.Value.split('|');
                    model[cellProperty.Name]['referenceID']= reference[0]; 
                    model[cellProperty.Name]['referenceName'] = reference[1];
                }
                else
                {
                   model[cellProperty.Name]['referenceID']= null; 
                   model[cellProperty.Name]['referenceName'] = null;
                   console.error(cellProperty.Name + " as a table reference is null ");
                }
                
                break;
                case "file":
                     if(!cellProperty.IsLocalized)
                        model[cellProperty.Name] = this.SerializeFile(cellProperty,false)[0];
                    else
                        model[cellProperty.Name] = this.SerializeFile(cellProperty,true);  

                 break;
            
                case "files":
                      model[cellProperty.Name] = this.SerializeFiles(cellProperty);
                break;
                case "string":
                    
                     model[cellProperty.Name] = {};
                   
                    // Take different value if localized or not
                    if(!cellProperty.IsLocalized)
                    {
                        if(cellProperty.Value !== null && cellProperty.Value !== undefined)
                        {
                            var MultilineText = cellProperty.Value.replace(/\r?\n/g, "<br />");
                            model[cellProperty.Name]["default"] = MultilineText;   
                        }  
                        else
                            model[cellProperty.Name]["default"] = "";
                    }
                       
                    else
                    {
                        
                        LanguagesKeys = Object.keys(cellProperty.LocalizedValues);
                        
                        for(var v = 0; v < LanguagesKeys.length;v++)
                        {
                            var MultiLineText = cellProperty.LocalizedValues[LanguagesKeys[v]].Value.replace(/\r?\n/g, "<br />");
                            model[cellProperty.Name][LanguagesKeys[v]] = MultiLineText;  
                        }
                        
                     
                    }
                    break;
                    
                    case "enum":
                    console.log(cellProperty);
                    break;
            }

            
             // Update progress event
             this.currentNbCells++;
              
            var progress = (this.currentNbCells / this.totalNbCells) * 100;
            
            pc.Application.getApplication().fire(SmartCMS.Events.LoadingCacheProgress, progress );
        }
        
  
        deserializedTable[i] = model;
        
    }

    table["Rows"] = deserializedTable;
    
    onComplete(table);

};



SmartCMSDataSerializer.GetFileExtension = function(fileLabel)
{
    if(fileLabel.lastIndexOf('www.youtube.com/embed/') > -1)
    {
        return "youtube"; 
    }
    
    
    return fileLabel.substr(fileLabel.lastIndexOf('.')+1);
    
};


SmartCMSDataSerializer.SerializeFile = function(cellProperty,isLocalized)
{
    var LocalizedValues = [];
    
     var LocalizedFile = {};
     var LocalizedLabel = {};
     var LocalizedURL = {};
     var LocalizedExtension = {}; 
    
     
    if(!isLocalized)
    {
        LocalizedLabel["default"] =  cellProperty.Label;
        LocalizedURL["default"] = cellProperty.URL;
        LocalizedExtension["default"] =  this.GetFileExtension(cellProperty.Label);
        
        LocalizedFile["Label"] = LocalizedLabel;
        LocalizedFile["Url"] = LocalizedURL;
        LocalizedFile["Extension"] = LocalizedExtension;
        
        LocalizedValues.push(LocalizedFile);
        return LocalizedValues;     
    }
    else
    {
        LocalizedValues = [];
        
        var LanguagesKeys = Object.keys(cellProperty.LocalizedValues);
        
         
        for(var v = 0; v < LanguagesKeys.length;v++)
        {
                LocalizedLabel[LanguagesKeys[v]] = cellProperty.LocalizedValues[LanguagesKeys[v]].Label;
                LocalizedURL[LanguagesKeys[v]] = cellProperty.LocalizedValues[LanguagesKeys[v]].URL;
                LocalizedExtension[LanguagesKeys[v]] =  this.GetFileExtension(LocalizedLabel[LanguagesKeys[v]]);
        }
            LocalizedFile["Label"] = LocalizedLabel;
            LocalizedFile["Url"] = LocalizedURL;
            LocalizedFile["Extension"] = LocalizedExtension;
            LocalizedValues.push(LocalizedFile);         
        
         
        return LocalizedValues;
    }


};

SmartCMSDataSerializer.SerializeFiles = function(cellProperty)
{
    var LocalizedValues;
    
    var LocalizedFile = {};
    var LocalizedLabel = {};
    var LocalizedURL = {};
    var LocalizedExtension = {};  
    
   
    
    
     if(!cellProperty.IsLocalized)
     {
         LocalizedValues = [];

        for(var h = 0; h < cellProperty.Values.length; h++)
        { 
             LocalizedFile = {};
             LocalizedLabel = {};
             LocalizedURL = {};
             LocalizedExtension = {};
            
             LocalizedLabel["default"] =  cellProperty.Values[h].Label;
             LocalizedURL["default"] = cellProperty.Values[h].URL;
             LocalizedExtension["default"] =  this.GetFileExtension(cellProperty.Values[h].Label);
            
             LocalizedFile["Label"] = LocalizedLabel;
             LocalizedFile["Url"] = LocalizedURL;
             LocalizedFile["Extension"] = LocalizedExtension;
             LocalizedValues.push(LocalizedFile);  
        }
         
         return LocalizedValues;
         
       }
    
     else
        {
            LocalizedValues = {};
            var LanguagesKeys = Object.keys(cellProperty.LocalizedValues);
            
            for(var u = 0; u < LanguagesKeys.length;u++)
            {
                
                LocalizedValues[LanguagesKeys[u]] =[];
                
                      for(var v = 0; v < cellProperty.LocalizedValues[LanguagesKeys[u]].Values.length;v++)
                        {
                         LocalizedFile = {};
                         LocalizedLabel = {};
                         LocalizedURL = {};
                         LocalizedExtension = {};   

                       
                        var currentValue = cellProperty.LocalizedValues[LanguagesKeys[u]].Values[v];

                        if(currentValue !== undefined)
                        {
                                 LocalizedLabel = currentValue.Label;
                                 LocalizedURL = currentValue.URL;
                                 LocalizedExtension =  this.GetFileExtension(currentValue.Label);
                        }


                        
                        LocalizedFile["Label"] = LocalizedLabel;
                        LocalizedFile["Url"] = LocalizedURL;
                        LocalizedFile["extension"] = LocalizedExtension;
                        LocalizedValues[LanguagesKeys[u]].push(LocalizedFile);        

                }
            }
            
           

        }
    
    
    return LocalizedValues;

    
};


/* SMART CMS ENUM */

SmartCMSEnum = {};

SmartCMSEnum.addEnum = function(enumName,enumKeys)
{
    if(!SmartCMSEnum.hasOwnProperty(enumName))
    {
         SmartCMSEnum[enumName] = {};
        var keys = Object.keys(enumKeys);
        
        for(var i = 0; i < keys.length; i++)
        {
            SmartCMSEnum[enumName][enumKeys[keys[i]]] = i;
        }
        
          
    }
    else
    {
        console.warn("SmartCMSEnum already has :" + enumName);
        return;
    }
};

