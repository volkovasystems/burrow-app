var commandSet = {
  "ping":{
    "parameterList":[
    ],
    "moduleNamespace":"dummy",
    "functionNamespace":"dummy"
  },
  "sayHello":{
    "parameterList":[
    "id" ],
    "moduleNamespace":"sayHello",
    "functionNamespace":"sayHello"   
   },
  "saveItem":{
    "parameterList":[ 
    "collectionName",
    "value1",
    "value2",
    ] ,
    "moduleNamespace":"crud-cmd/save-item",
    "functionNamespace":"saveItem"    
  },
  "getItem":{
    "parameterList":[
    "collectionName",
    "key",
    "value",
    ],
    "moduleNamespace":"crud-cmd/get-item",
    "functionNamespace":"getItem"
  },
  "updateItem":{
      "parameterList":[
      "collectionName",
      "key",
      "primaryKey",
      "keyToUpdate",
      "newValue",
      ],
      "moduleNamespace":"crud-cmd/update-item",
      "functionNamespace":"updateItem"
    },
  "deleteItem":{
    "parameterList":[
    "collectionName",
    "key",
    "value",
    ],
    "moduleNamespace":"crud-cmd/delete-item",
    "functionNamespace":"deleteItem"
  },
"truncate":{
    "parameterList":[
    "collectionName"
    ],
    "moduleNamespace":"crud-cmd/truncate",
    "functionNamespace":"truncate"
  },
  "showAll":{
    "parameterList":[
    "collectionName"
    ],
    "moduleNamespace":"crud-cmd/show-all",
    "functionNamespace":"showAll"
  },
  "createSchema":{
    "parameterList":[
    "collectionName"
    ],
    "moduleNamespace":"create-schema",
    "functionNamespace":"createSchema"
  },
  "exit":{
    "parameterList":[
    ],
    "moduleNamespace":"readline",
    "functionNamespace":"killReadLineInterface"    
  },
  "initializeDBServer":{
    "parameterList":[
    ],
    "moduleNamespace":"db-server-events",
    "functionNamespace":"initializeDBServer"    
  },
  "connectDBServer":{
    "parameterList":[
    ],
    "moduleNamespace":"db-server-events",
    "functionNamespace":"connectDBServer"    
  },
  "createCabinet":{
    "parameterList":[
    ],
    "moduleNamespace":"db-server-events",
    "functionNamespace":"createCabinet"    
  },
  "disconnectDBServer":{
    "parameterList":[
    ],
    "moduleNamespace":"db-server-events",
    "functionNamespace":"disconnectDBServer"    
  },
  "getDataCabinet":{
    "parameterList":[
    "keyname"
    ],
    "moduleNamespace":"db-server-events",
    "functionNamespace":"getData"    
  },
  "setDataCabinet":{
    "parameterList":[
    "keyname"
    ],
    "moduleNamespace":"db-server-events",
    "functionNamespace":"setData"    
  }
  /* "registerChild":{
  	"parameterList":[
  		"id",
  		"mac"
  	],
  	"moduleNamespace":"sayHello",
  	"functionNamespace":"sayHello",
  	"alias":{
  		"6": "sayHello to @name with age @age",
  		"4": "sayHello @name of @age",
  		"3": "sayHello @name @age"
  	},
  	"next": [
  		"createItem @result @:Nodes @:Burrow"
  	]
  },
  	"alias": {
  		"5": "ping at interval @duration @command"
  		"3": "ping @duration @command"
  	}
  }
*/	//This is the command format for set:
	//set key value
};
exports.commandSet = commandSet;