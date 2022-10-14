
/**
 * <p>Title:  </p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) xio.name 2006</p>
 * @author 王国良
 * 
 */
function XiorkFlowModelConverter() {
}

//
XiorkFlowModelConverter.convertModelToXML = function (model) {
    var doc = XMLDocument.newDomcument();
	
	
	
	var processType_val= model.getAttribute("whir:processType");
	var istempset=model.getIsTempSet();
	if(processType_val==null){
	    processType_val="1";
	}
	if(istempset==null){
	    istempset="0";
	}
	 
	
	//root
    var rootNode = doc.createElement(XiorkFlowModelConverter.NODE_ROOT);
	doc.documentElement = rootNode;
	//设置命名空间
	//rootNode.setAttribute("xmlns","http://www.omg.org/spec/BPMN/20100524/MODEL");
	rootNode.setAttribute("xmlns-default","http://www.omg.org/spec/BPMN/20100524/MODEL");
	rootNode.setAttribute("xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance");
	rootNode.setAttribute("xmlns:activiti","http://activiti.org/bpmn");
	rootNode.setAttribute("xmlns:whir","http://whir.com/ezFlow");
	rootNode.setAttribute("xmlns:bpmndi","http://www.omg.org/spec/BPMN/20100524/DI");
	rootNode.setAttribute("xmlns:omgdc","http://www.omg.org/spec/DD/20100524/DC");
	rootNode.setAttribute("xmlns:omgdi","http://www.omg.org/spec/DD/20100524/DI");
	rootNode.setAttribute("typeLanguage","http://www.w3.org/2001/XMLSchema");
	rootNode.setAttribute("expressionLanguage","http://www.w3.org/1999/XPath");
	rootNode.setAttribute("targetNamespace","Examples");

	//process
    var workflowProcessNode = doc.createElement(XiorkFlowModelConverter.NODE_PROCESS);
    rootNode.appendChild(workflowProcessNode);

	//构建流程属性 
	var names = model.getAttributeNameArray();
	for( y = 0;y < names.length; y ++){
		//替换非法字符
		var attributeValue = model.getAttribute(names[y]);
		//attributeValue.replace("<","&lt;");
		//attributeValue.replace(">","&gt;");
		//attributeValue.replace("\"","\\\"");
		workflowProcessNode.setAttribute(names[y], attributeValue);
	}
	workflowProcessNode.setAttribute(XiorkFlowModelConverter.ATTR_PROCESS_ID, model.getID());
	
	//替换非法字符
	var attributeValue = model.getName();
	//attributeValue.replace("<","&lt;");
	//attributeValue.replace(">","&gt;");
	//attributeValue.replace("\"","\\\"");
	workflowProcessNode.setAttribute(XiorkFlowModelConverter.ATTR_PROCESS_NAME, attributeValue);

    //流程documentation
	documentationNode = doc.createElement(XiorkFlowModelConverter.NODE_PROCESS_DOCUMENTATION);
	//documentationNode.text =  model.getDocumentation();//"<![CDATA[" + model.getDocumentation() + "]]>"  ;//&lt;
	XMLDocument.setText(documentationNode,model.getDocumentation());
	workflowProcessNode.appendChild(documentationNode);


	//构建流程扩展属性
	if(model.getWhirExtensionCount() > 0){
		extensionElementsNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_EXTENSIONELEMENTS);
		for( k=0;k<model.getWhirExtensionCount();k++){
			var whirExtension = model.getWhirExtension(k);
			whirExtensionNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_WHIREXTENSION);
			whirExtensionNode.setAttribute(XiorkFlowModelConverter.NODE_ACTIVITIE_WHIREXTENSION_NAME,whirExtension.name);
			
			var keys = whirExtension.keyArray();
			for( j=0;j<keys.length;j++){
				//创建field
				fieldNode =  doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_FIELD);
				fieldNode.setAttribute(XiorkFlowModelConverter.NODE_ACTIVITIE_FIELDNAME,keys[j]);
				valueNode =  doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_VALUE);
				//valueNode.text=(whirExtension.get(keys[j]));
				XMLDocument.setText(valueNode,whirExtension.get(keys[j]));
				fieldNode.appendChild(valueNode);
				whirExtensionNode.appendChild(fieldNode);
			}
			extensionElementsNode.appendChild(whirExtensionNode);
		}
		workflowProcessNode.appendChild(extensionElementsNode);
	}

	
	//diagram 
	var diagramNode = doc.createElement(XiorkFlowModelConverter.NODE_BPMNDI_BPMNDIAGRAM);

    rootNode.appendChild(diagramNode);

	var planeNode = doc.createElement(XiorkFlowModelConverter.NODE_BPMNDI_BPMNPLANE);
	planeNode.setAttribute(XiorkFlowModelConverter.ATTR_BPMNDI_BPMNELEMENT, model.getID());
	planeNode.setAttribute(XiorkFlowModelConverter.ATTR_BPMNDI_ID, "BPMNPlane_" + model.getID());

	diagramNode.appendChild(planeNode);
    //
   // var activitiesNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIES);
   //workflowProcessNode.appendChild(activitiesNode);

    //metaNodes
    var metaNodeModels = model.getMetaNodeModels();
    for (var i = 0; i < metaNodeModels.size(); i++) {
        var metaNodeModel = metaNodeModels.get(i);
        var activitieNode = XiorkFlowModelConverter.convertMetaNodeModelToXML(metaNodeModel, doc);
		//出现错误 返回错误信息
		if((activitieNode  instanceof String ) ){ 
			return activitieNode;
		}

		//当是半自由流程 并且是流程设置的那个地方 修改， 所有活动都标记为  不可修改（针对临时修改时不可修改）
	    if(processType_val=="2"&&istempset=="0"){
		      activitieNode.setAttribute("whir:tempsetforbidmodify", "1");
		}
        workflowProcessNode.appendChild(activitieNode);
    }
    
    //
    // var transitionsNode = doc.createElement(XiorkFlowModelConverter.NODE_TRANSITIONS);
    // workflowProcessNode.appendChild(transitionsNode);

    //
    var transitionModels = model.getTransitionModels();
    for (var i = 0; i < transitionModels.size(); i++) {
        var transitionModel = transitionModels.get(i);
        var transitionNode = XiorkFlowModelConverter.convertTransitionModelToXML(transitionModel, doc);

	    var tempsetforbidmodify=transitionModel.getAttribute("whir:tempsetforbidmodify");
		if(tempsetforbidmodify==null){
		    tempsetforbidmodify="0";
		} 
		transitionNode.setAttribute("whir:tempsetforbidmodify", tempsetforbidmodify);


		if(processType_val=="2"&&istempset=="0"){
		      transitionNode.setAttribute("whir:tempsetforbidmodify", "1");
		}
        workflowProcessNode.appendChild(transitionNode);
    }




	//再次遍历创建图形元素
	var metaNodeModels = model.getMetaNodeModels();
    for (var i = 0; i < metaNodeModels.size(); i++) {
        var metaNodeModel = metaNodeModels.get(i);
        var shapeNode = XiorkFlowModelConverter.convertMetaNodeModelToShapeXML(metaNodeModel, doc);
        planeNode.appendChild(shapeNode);
    }

 
	var transitionModels = model.getTransitionModels();
    for (var i = 0; i < transitionModels.size(); i++) {
        var transitionModel = transitionModels.get(i);
        var shapeNode = XiorkFlowModelConverter.convertTransitionModelToShapeXML(transitionModel, doc);
        planeNode.appendChild(shapeNode);
    }

    //
    if(Toolkit.getBrowserType()!="MSIE"){
	    return rootNode;
	}else{
	   return doc;
	}

};

//根据节点位置创建图形元素
XiorkFlowModelConverter.convertMetaNodeModelToShapeXML = function (metaNodeModel, doc) {
	var shapeNode ,boundsNode;
	//根据不同的metaNodeModel类型生成不同的xml元素
	 
	shapeNode = doc.createElement(XiorkFlowModelConverter.NODE_BPMNDI_BPMNSHAPE);
	shapeNode.setAttribute(XiorkFlowModelConverter.ATTR_BPMNDI_BPMNELEMENT, metaNodeModel.getID());
	shapeNode.setAttribute(XiorkFlowModelConverter.ATTR_BPMNDI_ID, "BPMNShape_" + metaNodeModel.getID());

	boundsNode = doc.createElement(XiorkFlowModelConverter.NODE_OMGDC_BOUNDS);

	boundsNode.setAttribute(XiorkFlowModelConverter.ATTR_OMGDC_X, metaNodeModel.getPosition().getX());
	boundsNode.setAttribute(XiorkFlowModelConverter.ATTR_OMGDC_Y, metaNodeModel.getPosition().getY());
	boundsNode.setAttribute(XiorkFlowModelConverter.ATTR_OMGDC_WIDTH, metaNodeModel.getSize().getWidth());
	boundsNode.setAttribute(XiorkFlowModelConverter.ATTR_OMGDC_HEIGHT, metaNodeModel.getSize().getHeight());

	shapeNode.appendChild(boundsNode);
	
    return shapeNode;
};



//根据节点位置创建图形元素
XiorkFlowModelConverter.convertTransitionModelToShapeXML = function (transitionModel, doc) {
	var shapeNode ,boundsNode1,boundsNode2;
	//根据不同的metaNodeModel类型生成不同的xml元素
	 
	shapeNode = doc.createElement(XiorkFlowModelConverter.NODE_BPMNDI_BPMNEDGE);
	shapeNode.setAttribute(XiorkFlowModelConverter.ATTR_BPMNDI_BPMNELEMENT,  transitionModel.getID());
	shapeNode.setAttribute(XiorkFlowModelConverter.ATTR_BPMNDI_ID, "BPMNEdge_" + transitionModel.getID());


 
    var fromMetaNodeModel = transitionModel.getFromMetaNodeModel();
    var toMetaNodeModel = transitionModel.getToMetaNodeModel(); 
    var fromOffset = transitionModel.getFromOffset();
    var toOffset = transitionModel.getToOffset(); 

	if ((!fromOffset) || (!toOffset)) {
        var offset = TransitionCompass.getOffset(fromMetaNodeModel, toMetaNodeModel);
        if (!offset) {
            return;
        }
        if (!fromOffset) {
            fromOffset = offset[0];
        }
        if (!toOffset) {
            toOffset = offset[1];
        }
    }


    var from = TransitionCompass.convertOffsetToPoint(fromMetaNodeModel, fromOffset);
    var to = TransitionCompass.convertOffsetToPoint(toMetaNodeModel, toOffset);




	boundsNode1 = doc.createElement(XiorkFlowModelConverter.NODE_OMGDI_WAYPOINT); 
	boundsNode1.setAttribute(XiorkFlowModelConverter.ATTR_OMGDC_X, from.getX());
	boundsNode1.setAttribute(XiorkFlowModelConverter.ATTR_OMGDC_Y, from.getY());
   

   	boundsNode2 = doc.createElement(XiorkFlowModelConverter.NODE_OMGDI_WAYPOINT); 
	boundsNode2.setAttribute(XiorkFlowModelConverter.ATTR_OMGDC_X,to.getX());
	boundsNode2.setAttribute(XiorkFlowModelConverter.ATTR_OMGDC_Y,to.getY());
 
    shapeNode.appendChild(boundsNode1);
	shapeNode.appendChild(boundsNode2); 

    return shapeNode;
};

//根据节点生成相应的节点元素
XiorkFlowModelConverter.convertMetaNodeModelToXML = function (metaNodeModel, doc) {
	  var activitieNode ;
	  
	//根据不同的metaNodeModel类型生成不同的xml元素
	  if( metaNodeModel instanceof UserTaskNodeModel  || metaNodeModel instanceof AutoBackTaskNodeModel  ){
		activitieNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_USERTASK);
		//构建节点描述
		  if(metaNodeModel.getDocumentation() != null){
			  documentationNode = doc.createElement(XiorkFlowModelConverter.NODE_PROCESS_DOCUMENTATION);
			  //documentationNode.text = metaNodeModel.getDocumentation();//"<![CDATA[" + metaNodeModel.getDocumentation() + "]]>";
			  XMLDocument.setText(documentationNode,metaNodeModel.getDocumentation());
 
			  activitieNode.appendChild(documentationNode);
		  }
		//构建扩展属性
		if(metaNodeModel.getWhirExtensionCount() > 0){
			extensionElementsNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_EXTENSIONELEMENTS);
			for( k=0;k<metaNodeModel.getWhirExtensionCount();k++){
				var whirExtension = metaNodeModel.getWhirExtension(k);
				whirExtensionNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_WHIREXTENSION);
				whirExtensionNode.setAttribute(XiorkFlowModelConverter.NODE_ACTIVITIE_WHIREXTENSION_NAME,whirExtension.name);
				
				var keys = whirExtension.keyArray();
				for( j=0;j<keys.length;j++){
					//创建field
					fieldNode =  doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_FIELD);
					fieldNode.setAttribute(XiorkFlowModelConverter.NODE_ACTIVITIE_FIELDNAME,keys[j]);
					valueNode =  doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_VALUE);
					//valueNode.text=(whirExtension.get(keys[j]));
                    XMLDocument.setText(valueNode,whirExtension.get(keys[j]));
					fieldNode.appendChild(valueNode);
					whirExtensionNode.appendChild(fieldNode);
				}
				extensionElementsNode.appendChild(whirExtensionNode);
			}
			activitieNode.appendChild(extensionElementsNode);
		}
		

	  }else if( metaNodeModel instanceof ExclusiveGatewayNodeModel ){
	  
		activitieNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_EXCLUSIVEGATEWAY);
	  }else if( metaNodeModel instanceof ParallelGatewayNodeModel ){
		activitieNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_PARALLELGATEWAY);
		
	  }else if( metaNodeModel instanceof InclusiveGatewayNodeModel ){
		activitieNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_INCLUSIVEGATEWAY);
		
	  }else if( metaNodeModel instanceof ServiceTaskNodeModel ){
	  
		activitieNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_SERVICETASK);
	  }else if( metaNodeModel instanceof ReceiveTaskNodeModel ){
	  
		activitieNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_RECEIVETASK);
	  }else if( metaNodeModel instanceof CallActivityNodeModel ){ 
		  var calledElement=metaNodeModel.getAttribute("calledElement") 
		  if(calledElement==null||calledElement==""||calledElement=="null"){
			 return  new String("error2");  
		  }    
		  activitieNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_CALLACTIVITY);


		  //构建扩展属性
		 if(metaNodeModel.getWhirExtensionCount() > 0){
			extensionElementsNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_EXTENSIONELEMENTS);
			for( k=0;k<metaNodeModel.getWhirExtensionCount();k++){
				var whirExtension = metaNodeModel.getWhirExtension(k);
				whirExtensionNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_WHIREXTENSION);
				whirExtensionNode.setAttribute(XiorkFlowModelConverter.NODE_ACTIVITIE_WHIREXTENSION_NAME,whirExtension.name);
				
				var keys = whirExtension.keyArray();
				for( j=0;j<keys.length;j++){
					//创建field
					fieldNode =  doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_FIELD);
					fieldNode.setAttribute(XiorkFlowModelConverter.NODE_ACTIVITIE_FIELDNAME,keys[j]);
					valueNode =  doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_VALUE);
					//valueNode.text=(whirExtension.get(keys[j]));
                    XMLDocument.setText(valueNode,whirExtension.get(keys[j]));
					fieldNode.appendChild(valueNode);
					whirExtensionNode.appendChild(fieldNode);
				}
				extensionElementsNode.appendChild(whirExtensionNode);
			}
			activitieNode.appendChild(extensionElementsNode);
		 }


	  }else if( metaNodeModel instanceof SubProcessNodeModel ){ 
		  var subProcessKey=metaNodeModel.getAttribute("whir:subProcessKey") 
		  if(subProcessKey==null||subProcessKey==""||subProcessKey=="null"){
			 return  new String("error1");  
		  } 
		  activitieNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_SUBPROCESS);
	  }else if( metaNodeModel instanceof StartNodeModel ){
		activitieNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_STARTEVENT);
		
	  }else if( metaNodeModel instanceof EndNodeModel ){
	  
		activitieNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_ENDEVENT);
	  }else{
		//
		alert("未知的节点类型"+ metaNodeModel.getID() + "！");
	  }
	  if(!( metaNodeModel instanceof UserTaskNodeModel  || metaNodeModel instanceof AutoBackTaskNodeModel ) ){
		  //构建节点描述
		  if(metaNodeModel.getDocumentation() != null){
			  documentationNode = doc.createElement(XiorkFlowModelConverter.NODE_PROCESS_DOCUMENTATION);
			  documentationNode.text = metaNodeModel.getDocumentation();//"<![CDATA[" + metaNodeModel.getDocumentation() + "]]>";
			  //XMLDocument.setText(documentationNode,metaNodeModel.getDocumentation());
 
			  activitieNode.appendChild(documentationNode);
		  }
	  }

	  //构建属性 
	  var names = metaNodeModel.getAttributeNameArray();
	  for( y = 0;y < names.length; y ++){
		  //替换非法字符
		  var attributeValue = metaNodeModel.getAttribute(names[y]);
		  //attributeValue.replace("<","&lt;");
		  //attributeValue.replace(">","&gt;");
		  //attributeValue.replace("\"","\\\"");
		  activitieNode.setAttribute(names[y], attributeValue);
	  }
	
	　activitieNode.setAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_ID, metaNodeModel.getID());
	　//activitieNode.setAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_TYPE, metaNodeModel.type);
	  //替换非法字符
	  var attributeValue =  metaNodeModel.getText();
	  //attributeValue.replace("<","&lt;");
	  //attributeValue.replace(">","&gt;");
	  //attributeValue.replace("\"","\\\"");
	　activitieNode.setAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_NAME,attributeValue);
	  
	
		//
    return activitieNode;
};
XiorkFlowModelConverter.convertTransitionModelToXML = function (transitionModel, doc) {
    var transitionNode = doc.createElement(XiorkFlowModelConverter.NODE_TRANSITION);

    //
    transitionNode.setAttribute(XiorkFlowModelConverter.ATTR_TRANSITION_ID, transitionModel.getID());
    transitionNode.setAttribute(XiorkFlowModelConverter.ATTR_TRANSITION_NAME, transitionModel.getText());
    transitionNode.setAttribute(XiorkFlowModelConverter.ATTR_TRANSITION_FROM, transitionModel.getFromMetaNodeModel().getID());
    transitionNode.setAttribute(XiorkFlowModelConverter.ATTR_TRANSITION_TO, transitionModel.getToMetaNodeModel().getID());
	

	var haveExe=false;
	//条件表达式
	if( transitionModel.getConditionExpression() != null && transitionModel.getConditionExpression() != "" ){

		haveExe=true;
		extensionElementsNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_EXTENSIONELEMENTS);
		transitionNode.appendChild(extensionElementsNode); 

		var conditionExpressionDisplayNode = doc.createElement(XiorkFlowModelConverter.NODE_TRANSITION_CONDITIONEXPRESSIONDISPLAY);
		var cdataSection = doc.createCDATASection(transitionModel.getConditionExpressionDisplay());
		conditionExpressionDisplayNode.appendChild(cdataSection);//= "<![CDATA[" + + "]]>";//transitionModel.getConditionExpression();
		extensionElementsNode.appendChild(conditionExpressionDisplayNode);


		/*var transSortNode = doc.createElement(XiorkFlowModelConverter.NODE_TRANSITION_SORT);
		var sortcdataSection = doc.createCDATASection(transitionModel.getSortNum());
		transSortNode.appendChild(sortcdataSection);//= "<![CDATA[" + + "]]>";//transitionModel.getConditionExpression();
		extensionElementsNode.appendChild(transSortNode);*/

		XiorkFlowModelConverter.addTransitionExtInfo(doc, transitionModel,extensionElementsNode);
 


		var conditionExpressionNode = doc.createElement(XiorkFlowModelConverter.NODE_TRANSITION_CONDITIONEXPRESSION);
		conditionExpressionNode.setAttribute(XiorkFlowModelConverter.ATTR_TRANSITION_TYPE,transitionModel.getConditionExpressionType());
		//alert(transitionModel.getConditionExpression());
		var cdataSection = doc.createCDATASection(transitionModel.getConditionExpression());
		conditionExpressionNode.appendChild(cdataSection);//= "<![CDATA[" + + "]]>";//transitionModel.getConditionExpression();
		transitionNode.appendChild(conditionExpressionNode);

		
	}

	//如果上面没有条件表达 ，但是有排序码的情况
	if(!haveExe){

		extensionElementsNode = doc.createElement(XiorkFlowModelConverter.NODE_ACTIVITIE_EXTENSIONELEMENTS);

		var result=XiorkFlowModelConverter.addTransitionExtInfo(doc, transitionModel,extensionElementsNode);
		if(result){
			transitionNode.appendChild(extensionElementsNode); 
		}else{
			extensionElementsNode=null;
		}
 
	}

    //
    return transitionNode;
};



//设置排序码  是否默认选中  是否必须选中的选项
XiorkFlowModelConverter.addTransitionExtInfo = function (doc, transitionModel,extensionElementsNode) {
	var needAddextensionElementsNode=false;
	if( transitionModel.getSortNum() != null && transitionModel.getSortNum() != "" ){ 
		var transSortNode = doc.createElement(XiorkFlowModelConverter.NODE_TRANSITION_SORT);
		var sortcdataSection = doc.createCDATASection(transitionModel.getSortNum());
		transSortNode.appendChild(sortcdataSection);//= "<![CDATA[" + + "]]>";//transitionModel.getConditionExpression();
		extensionElementsNode.appendChild(transSortNode);  
		needAddextensionElementsNode=true;
	}

	if( transitionModel.getDefaultChooseType() != null && transitionModel.getDefaultChooseType() != ""&& transitionModel.getDefaultChooseType() != "null" ){ 
		var transDefaultTypeNode = doc.createElement(XiorkFlowModelConverter.NODE_TRANSITION_DEFAULT_CHOOSETYPE);
		var sortcdataSection = doc.createCDATASection(transitionModel.getDefaultChooseType());
		transDefaultTypeNode.appendChild(sortcdataSection);//= "<![CDATA[" + + "]]>";//transitionModel.getConditionExpression();
		extensionElementsNode.appendChild(transDefaultTypeNode);  
		needAddextensionElementsNode=true; 
	}

	if( transitionModel.getMustChooseType() != null && transitionModel.getMustChooseType() != ""&& transitionModel.getMustChooseType() != "null" ){ 
		var transMustTypeNode = doc.createElement(XiorkFlowModelConverter.NODE_TRANSITION_MUST_CHOOSETYPE);
		var sortcdataSection = doc.createCDATASection(transitionModel.getMustChooseType());
		transMustTypeNode.appendChild(sortcdataSection);//= "<![CDATA[" + + "]]>";//transitionModel.getConditionExpression();
		extensionElementsNode.appendChild(transMustTypeNode);  
		needAddextensionElementsNode=true; 
	}

	return needAddextensionElementsNode;
}


//
XiorkFlowModelConverter.convertXMLToModel = function (doc, initModel) {
    if (!doc) {
        return null;
    }

	//针对不同的浏览器取值
    XiorkFlowModelConverter.NODE_BPMNDI_BPMNSHAPE_ =XMLDocument.getBPMNShape();
 
    var model = initModel;
    if (!model) {
        model = new XiorkFlowModel();
    }
	//解析流程属性
	var processNodes = doc.getElementsByTagName(XiorkFlowModelConverter.NODE_PROCESS);
	for (var i = 0; i < processNodes.length; i++) {
        var processNode = processNodes[i];
        model = XiorkFlowModelConverter.convertXMLToXiorkFlowModel(processNode);
		break;//只解析第一个流程
    }
	 
    //解析节点属性

	
	//开始事件
    var activitieNodes = doc.getElementsByTagName(XiorkFlowModelConverter.NODE_ACTIVITIE_STARTEVENT);
    for (var i = 0; i < activitieNodes.length; i++) {
        var activitieNode = activitieNodes[i];
        var metaNodeModel = XiorkFlowModelConverter.convertXMLToMetaNodeModel(activitieNode);
        model.addMetaNodeModel(metaNodeModel);

		model.addInitMetaNodeId(metaNodeModel.getID());
    }
	//结束事件
    var activitieNodes = doc.getElementsByTagName(XiorkFlowModelConverter.NODE_ACTIVITIE_ENDEVENT);
    for (var i = 0; i < activitieNodes.length; i++) {
        var activitieNode = activitieNodes[i];
        var metaNodeModel = XiorkFlowModelConverter.convertXMLToMetaNodeModel(activitieNode);
        model.addMetaNodeModel(metaNodeModel);

		model.addInitMetaNodeId(metaNodeModel.getID());

    }
	//用户任务
    var activitieNodes = doc.getElementsByTagName(XiorkFlowModelConverter.NODE_ACTIVITIE_USERTASK);
    for (var i = 0; i < activitieNodes.length; i++) {
        var activitieNode = activitieNodes[i];
        var metaNodeModel = XiorkFlowModelConverter.convertXMLToMetaNodeModel(activitieNode);
        model.addMetaNodeModel(metaNodeModel);
 
		model.addInitMetaNodeId(metaNodeModel.getID());
    }
	//互斥网关
	var activitieNodes = doc.getElementsByTagName(XiorkFlowModelConverter.NODE_ACTIVITIE_EXCLUSIVEGATEWAY);
    for (var i = 0; i < activitieNodes.length; i++) {
        var activitieNode = activitieNodes[i];
        var metaNodeModel = XiorkFlowModelConverter.convertXMLToMetaNodeModel(activitieNode);
        model.addMetaNodeModel(metaNodeModel);

		model.addInitMetaNodeId(metaNodeModel.getID());
    }
	//并行网关
	var activitieNodes = doc.getElementsByTagName(XiorkFlowModelConverter.NODE_ACTIVITIE_PARALLELGATEWAY);
    for (var i = 0; i < activitieNodes.length; i++) {
        var activitieNode = activitieNodes[i];
        var metaNodeModel = XiorkFlowModelConverter.convertXMLToMetaNodeModel(activitieNode);
        model.addMetaNodeModel(metaNodeModel);

		model.addInitMetaNodeId(metaNodeModel.getID());
    }
	//包含网关
	var activitieNodes = doc.getElementsByTagName(XiorkFlowModelConverter.NODE_ACTIVITIE_INCLUSIVEGATEWAY);
    for (var i = 0; i < activitieNodes.length; i++) {
        var activitieNode = activitieNodes[i];
        var metaNodeModel = XiorkFlowModelConverter.convertXMLToMetaNodeModel(activitieNode);
        model.addMetaNodeModel(metaNodeModel);

		model.addInitMetaNodeId(metaNodeModel.getID());
    }
	//java服务任务
	var activitieNodes = doc.getElementsByTagName(XiorkFlowModelConverter.NODE_ACTIVITIE_SERVICETASK);
    for (var i = 0; i < activitieNodes.length; i++) {
        var activitieNode = activitieNodes[i];
        var metaNodeModel = XiorkFlowModelConverter.convertXMLToMetaNodeModel(activitieNode);
        model.addMetaNodeModel(metaNodeModel);

		model.addInitMetaNodeId(metaNodeModel.getID());
    }
	//等待任务
	var activitieNodes = doc.getElementsByTagName(XiorkFlowModelConverter.NODE_ACTIVITIE_RECEIVETASK);
    for (var i = 0; i < activitieNodes.length; i++) {
        var activitieNode = activitieNodes[i];
        var metaNodeModel = XiorkFlowModelConverter.convertXMLToMetaNodeModel(activitieNode);
        model.addMetaNodeModel(metaNodeModel);

		model.addInitMetaNodeId(metaNodeModel.getID());
    }
	//调用任务
	var activitieNodes = doc.getElementsByTagName(XiorkFlowModelConverter.NODE_ACTIVITIE_CALLACTIVITY);
    for (var i = 0; i < activitieNodes.length; i++) {
        var activitieNode = activitieNodes[i];
        var metaNodeModel = XiorkFlowModelConverter.convertXMLToMetaNodeModel(activitieNode);
        model.addMetaNodeModel(metaNodeModel);

		model.addInitMetaNodeId(metaNodeModel.getID());
    }

	//子流程
	var activitieNodes = doc.getElementsByTagName(XiorkFlowModelConverter.NODE_ACTIVITIE_SUBPROCESS);
    for (var i = 0; i < activitieNodes.length; i++) {
        var activitieNode = activitieNodes[i];
        var metaNodeModel = XiorkFlowModelConverter.convertXMLToMetaNodeModel(activitieNode);
        model.addMetaNodeModel(metaNodeModel);

		model.addInitMetaNodeId(metaNodeModel.getID());
    }

    //顺序流
    var transitionNodes = doc.getElementsByTagName(XiorkFlowModelConverter.NODE_TRANSITION);
    for (var i = 0; i < transitionNodes.length; i++) {
        var transitionNode = transitionNodes[i];
        var transitionModel = XiorkFlowModelConverter.convertXMLToTransitionModel(transitionNode, model);
        model.addTransitionModel(transitionModel);
        var tempsetforbidmodify=transitionNode.getAttribute("whir:tempsetforbidmodify");
		if(tempsetforbidmodify==null){
		    tempsetforbidmodify="0";
		} 
		transitionModel.setAttribute("whir:tempsetforbidmodify", tempsetforbidmodify);

		model.addInitTransitionId(transitionModel.getID());
    }

    //
    return model;
};

//转换流程xml为流程对象
XiorkFlowModelConverter.convertXMLToXiorkFlowModel = function (node) {
	metaNodeModel = new XiorkFlowModel();
	
	//以下设置流程对象的常规属性
	/*包括
	id	必须	对应引擎里的key
								引擎里的id 为:    {key}:{version}:{ generated-id }}
						必须总个系统唯一
	name		为空时，引擎默认用id
	whir:processUserScope 		流程使用范围
	whir:processPackage		流程分类id
	whir:processNeedDossier		是否需要归档，  true /false
	whir:processNeedPrint		发起人是否可以打印  true/false
	whir:processCommentIsNull		批示意见是否可以为空  true/false
	whir:processRemindField		提醒字段:  ,fieldid,,fieldid,,fieldid,  
	whir:nodeWriteField		可写字段   ,fieldid,,fieldid,……
	whir: formKey		表单id 或者 某个jsp路径（绝对还是相对）
    */
	var id = node.getAttribute(XiorkFlowModelConverter.ATTR_PROCESS_ID);
    metaNodeModel.setID(id);

	//设置常规属性
	var attributes = node.attributes ;
	for( x=0; x<attributes.length;x++){
		//过滤id属性
		if(attributes.item(x).name != "id" && attributes.item(x).name != "name"){
			metaNodeModel.setAttribute(attributes.item(x).name,attributes.item(x).value );
		}
	}
	
	var name = node.getAttribute(XiorkFlowModelConverter.ATTR_PROCESS_NAME);
    metaNodeModel.setName(name);

	/*
	var processUserScope  = node.getAttribute(XiorkFlowModelConverter.ATTR_PROCESS_PROCESSUSERSCOPE);
    metaNodeModel.setProcessUserScope(processUserScope);

	var processPackage  = node.getAttribute(XiorkFlowModelConverter.ATTR_PROCESS_PROCESSPACKAGE);
    metaNodeModel.setProcessPackage(processPackage);

	var processNeedDossier  = node.getAttribute(XiorkFlowModelConverter.ATTR_PROCESS_PROCESSNEEDDOSSIER);
    metaNodeModel.setProcessNeedDossier(processNeedDossier);

	var processNeedPrint  = node.getAttribute(XiorkFlowModelConverter.ATTR_PROCESS_PROCESSNEEDPRINT);
    metaNodeModel.setProcessNeedPrint(processNeedPrint);

	var processCommentIsNull  = node.getAttribute(XiorkFlowModelConverter.ATTR_PROCESS_PROCESSCOMMENTISNULL);
    metaNodeModel.setProcessCommentIsNull(processCommentIsNull);

	var processRemindField  = node.getAttribute(XiorkFlowModelConverter.ATTR_PROCESS_PROCESSREMINDFIELD);
    metaNodeModel.setProcessRemindField(processRemindField);

	var nodeWriteField  = node.getAttribute(XiorkFlowModelConverter.ATTR_PROCESS_NODEWRITEFIELD);
    metaNodeModel.setNodeWriteField(nodeWriteField);

	var formKey  = node.getAttribute(XiorkFlowModelConverter.ATTR_PROCESS_FORMKEY);
    metaNodeModel.setFormKey(formKey);
    */
 
     var documentNode= XMLDocument.SelectSingleNode(node,XiorkFlowModelConverter.NODE_PROCESS_DOCUMENTATION);
    //设置流程描述
    // var documentNode = node.selectSingleNode(XiorkFlowModelConverter.NODE_PROCESS_DOCUMENTATION);//支持IE
	if(documentNode){
			metaNodeModel.setDocumentation(XMLDocument.getText(documentNode)); 
	}
 

	//设置扩展属性
	//var extensionElementsNode = node.selectSingleNode(XiorkFlowModelConverter.NODE_PROCESS_EXTENSIONELEMENTS);//支持IE
	var extensionElementsNode= XMLDocument.SelectSingleNode(node,XiorkFlowModelConverter.NODE_PROCESS_EXTENSIONELEMENTS);
	if(extensionElementsNode){
		//循环每个扩展属性
		var cns = extensionElementsNode.childNodes;
		for (i=0;i<cns.length;i++)
	    {
			if(cns[i].nodeName == XiorkFlowModelConverter.NODE_PROCESS_WHIREXTENSION ){ //是whir:extension
		
				whirExtension = new WhirExtension(cns[i].getAttribute(XiorkFlowModelConverter.NODE_PROCESS_WHIREXTENSION_NAME));
				metaNodeModel.addWhirExtension( whirExtension );
				//循环设置扩展属性值
				var fieldValueNodes = cns[i].childNodes;
				for (j=0;j<fieldValueNodes.length;j++)
				{
					if(fieldValueNodes[j].nodeName == XiorkFlowModelConverter.NODE_PROCESS_FIELD ){
						
						if( fieldValueNodes[j].childNodes.length != 1 ) {
							alert("field元素缺少value子元素！");
						}else{
							if( fieldValueNodes[j].childNodes[0].nodeName != XiorkFlowModelConverter.NODE_PROCESS_VALUE ){
								alert("field元素value子元素名必须是"+ XiorkFlowModelConverter.NODE_PROCESS_VALUE+ "！");
							}else{
								/*whirExtension.set( fieldValueNodes[j].getAttribute( XiorkFlowModelConverter.NODE_PROCESS_FIELDNAME ) ,fieldValueNodes[j].childNodes[0].text);//支持IE*/

							    whirExtension.set( fieldValueNodes[j].getAttribute( XiorkFlowModelConverter.NODE_PROCESS_FIELDNAME ) ,XMLDocument.getText(fieldValueNodes[j].childNodes[0]));//支持IE	
								
								DEBUGING = false;
								if( DEBUGING ){
									alert("增加了一个扩展属性 名称"+ whirExtension.name + " key:" + fieldValueNodes[j].getAttribute( XiorkFlowModelConverter.NODE_PROCESS_FIELDNAME )+ " value:" + XMLDocument.getText(fieldValueNodes[j].childNodes[0]));
								}
							}
						}
					}else{
						if( fieldValueNodes[j].nodeName  != "#comment" ){//这个是注释
							//非field元素,忽略
							alert("不支持的field子元素" +fieldValueNodes[j].nodeName  +"！");
						}
					}
				}

			}else{
				//非扩展属性元素,忽略
				if( cns[i].nodeName  != "#comment" ){//这个是注释
					alert("不支持的扩展属性子元素" +cns[i].nodeName  +"！");
				}
			}

	    }
	
	}
	return metaNodeModel;
}

XiorkFlowModelConverter.convertXMLToMetaNodeModel = function (node) {
    var metaNodeModel = null;
	//
    var type = node.nodeName;
    switch (type) {
      case XiorkFlowModelConverter.NODE_ACTIVITIE_USERTASK:
		  if(node.getAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_ISBACKTRACKACT) == "true" ){
			metaNodeModel = new AutoBackTaskNodeModel();
		  }else{
			metaNodeModel = new UserTaskNodeModel();
		  }
        break;
      case XiorkFlowModelConverter.NODE_ACTIVITIE_EXCLUSIVEGATEWAY:
        metaNodeModel = new ExclusiveGatewayNodeModel();
        break;
      case XiorkFlowModelConverter.NODE_ACTIVITIE_PARALLELGATEWAY:
        metaNodeModel = new ParallelGatewayNodeModel();
        break;
      case XiorkFlowModelConverter.NODE_ACTIVITIE_INCLUSIVEGATEWAY:
        metaNodeModel = new InclusiveGatewayNodeModel();
        break;
      case XiorkFlowModelConverter.NODE_ACTIVITIE_SERVICETASK:
        metaNodeModel = new ServiceTaskNodeModel();
        break;
      case XiorkFlowModelConverter.NODE_ACTIVITIE_RECEIVETASK:
		metaNodeModel = new ReceiveTaskNodeModel();
        break;	
      case XiorkFlowModelConverter.NODE_ACTIVITIE_CALLACTIVITY:
		metaNodeModel = new CallActivityNodeModel();
        break;	
	  case XiorkFlowModelConverter.NODE_ACTIVITIE_SUBPROCESS:
		metaNodeModel = new SubProcessNodeModel();
        break;
	  case XiorkFlowModelConverter.NODE_ACTIVITIE_STARTEVENT:
        metaNodeModel = new StartNodeModel();
        break;
      case XiorkFlowModelConverter.NODE_ACTIVITIE_ENDEVENT:
        metaNodeModel = new EndNodeModel();
        break;	
	}
    if (!metaNodeModel) {
        return null;
    }
	//设置节点描述
   // var documentNode = node.selectSingleNode(XiorkFlowModelConverter.NODE_PROCESS_DOCUMENTATION);//支持IE
    var documentNode= XMLDocument.SelectSingleNode(node,XiorkFlowModelConverter.NODE_PROCESS_DOCUMENTATION);
	if(documentNode){
		 //metaNodeModel.setDocumentation(documentNode.text ); //支持IE
		 metaNodeModel.setDocumentation(XMLDocument.getText(documentNode) ); //支持IE
	}

	//设置普通属性
    //
    //var id = eval(node.getAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_ID));
	var id = (node.getAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_ID));
    metaNodeModel.setID(id);
    
    //
    var name = node.getAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_NAME);
    metaNodeModel.setText(name);


	//常规属性修改成通用设置属性的方式
	var attributes = node.attributes ;
	for( x=0; x<attributes.length;x++){
		//过滤id属性
		if(attributes.item(x).name != "id" && attributes.item(x).name != "name"){
			metaNodeModel.setAttribute(attributes.item(x).name,attributes.item(x).value );
		}
	}

	if(metaNodeModel instanceof  UserTaskNodeModel || metaNodeModel instanceof  AutoBackTaskNodeModel  || metaNodeModel instanceof  CallActivityNodeModel){//用户任务
		//常规属性	
		/*
		var priority = node.getAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_PRIORITY);
		metaNodeModel.setPriority(name);

		var dueDate = node.getAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_DUEDATE);
		metaNodeModel.setDueDate(dueDate);

		var taskSequenceType = node.getAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_TASKSEQUENCETYPE);
		metaNodeModel.setTaskSequenceType(taskSequenceType);

		var taskNeedRead = node.getAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_TASKNEEDREAD);
		metaNodeModel.setTaskNeedRead(taskNeedRead);

		var overdueTpye = node.getAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_OVERDUETPYE);
		metaNodeModel.setOverdueTpye(overdueTpye);
		
		var taskDealWithClass = node.getAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_TASKDEALWITHCLASS);
		metaNodeModel.setTaskDealWithClass(taskDealWithClass);

		var nodeWriteField = node.getAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_NODEWRITEFIELD);
		metaNodeModel.setNodeWriteField(nodeWriteField);

		var nodeHiddenField = node.getAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_NODEHIDDENFIELD);
		metaNodeModel.setNodeHiddenField(nodeHiddenField);

		var nodeCommentField = node.getAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_NODECOMMENTFIELD);
		metaNodeModel.setNodeCommentField(nodeCommentField);

		var nodeNeedAgent = node.getAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_NODENEEDAGENT);
		metaNodeModel.setNodeNeedAgent(nodeNeedAgent);

		var formKey = node.getAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_FORMKEY);
		metaNodeModel.setFormKey(formKey);

		var assignee = node.getAttribute(XiorkFlowModelConverter.ATTR_ACTIVITIE_ASSIGNEE);
		metaNodeModel.setAssignee(assignee);
		*/
		
		//设置扩展属性
		//var extensionElementsNode = node.selectSingleNode(XiorkFlowModelConverter.NODE_ACTIVITIE_EXTENSIONELEMENTS);//支持IE
	    var extensionElementsNode= XMLDocument.SelectSingleNode(node,XiorkFlowModelConverter.NODE_ACTIVITIE_EXTENSIONELEMENTS);
		if(extensionElementsNode){
			//循环每个扩展属性
			var cns = extensionElementsNode.childNodes;
			for (i=0;i<cns.length;i++)
			{
				if(cns[i].nodeName == XiorkFlowModelConverter.NODE_ACTIVITIE_WHIREXTENSION ){ //是whir:extension
			
					whirExtension = new WhirExtension(cns[i].getAttribute(XiorkFlowModelConverter.NODE_ACTIVITIE_WHIREXTENSION_NAME));
					metaNodeModel.addWhirExtension( whirExtension );
					//循环设置扩展属性值
					var fieldValueNodes = cns[i].childNodes;
					for (j=0;j<fieldValueNodes.length;j++)
					{
						if(fieldValueNodes[j].nodeName == XiorkFlowModelConverter.NODE_ACTIVITIE_FIELD ){
							
							if( fieldValueNodes[j].childNodes.length != 1 ) {
								alert("field元素缺少value子元素！");
							}else{
								if( fieldValueNodes[j].childNodes[0].nodeName != XiorkFlowModelConverter.NODE_ACTIVITIE_VALUE ){
									alert("field元素value子元素名必须是"+ XiorkFlowModelConverter.NODE_ACTIVITIE_VALUE+ "！");
								}else{
									/*whirExtension.set( fieldValueNodes[j].getAttribute( XiorkFlowModelConverter.NODE_ACTIVITIE_FIELDNAME ) ,fieldValueNodes[j].childNodes[0].text);//支持IE*/

									whirExtension.set( fieldValueNodes[j].getAttribute( XiorkFlowModelConverter.NODE_ACTIVITIE_FIELDNAME ) ,XMLDocument.getText(fieldValueNodes[j].childNodes[0]));//支持IE
 

									DEBUGING = false;
									if( DEBUGING ){
										alert("增加了一个扩展属性 名称"+ whirExtension.name + " key:" + fieldValueNodes[j].getAttribute( XiorkFlowModelConverter.NODE_ACTIVITIE_FIELDNAME )+ " value:" + XMLDocument.getText(fieldValueNodes[j].childNodes[0]));
									}
								}
							}
						}else{
							//非field元素,忽略
							if( fieldValueNodes[j].nodeName  != "#comment" ){//这个是注释
								alert("不支持的field子元素" +fieldValueNodes[j].nodeName  +"！");
							}
						}
					}

				}else{
					//非扩展属性元素,忽略
					if( cns[i].nodeName  != "#comment" ){//这个是注释
						alert("不支持的扩展属性子元素" +cns[i].nodeName  +"！");
					}
				}

			}
		
		}
	}
   
 
	//找对应的图形
	var bpmndiNodes = node.parentNode.parentNode.parentNode.getElementsByTagName(XiorkFlowModelConverter.NODE_BPMNDI_BPMNSHAPE_) ;
	for (k=0; k<bpmndiNodes.length ;k++ )
	{
		if( bpmndiNodes[k].getAttribute(XiorkFlowModelConverter.ATTR_BPMNDI_BPMNELEMENT) == metaNodeModel.getID() ){
			if(  bpmndiNodes[k].childNodes.length == 1){
				var xCoordinate = eval(bpmndiNodes[k].childNodes[0].getAttribute(XiorkFlowModelConverter.ATTR_OMGDC_X));
				var yCoordinate = eval(bpmndiNodes[k].childNodes[0].getAttribute(XiorkFlowModelConverter.ATTR_OMGDC_Y));

				metaNodeModel.setPosition(new Point(xCoordinate, yCoordinate));
				var width = eval(bpmndiNodes[k].childNodes[0].getAttribute(XiorkFlowModelConverter.ATTR_OMGDC_WIDTH));
				var height = eval(bpmndiNodes[k].childNodes[0].getAttribute(XiorkFlowModelConverter.ATTR_OMGDC_HEIGHT));
				metaNodeModel.setSize(new Dimension(width, height));
			}
			break;
		}
	}

    //
    return metaNodeModel;
};

XiorkFlowModelConverter.convertXMLToTransitionModel = function (node, model) {
    var fromID = node.getAttribute(XiorkFlowModelConverter.ATTR_TRANSITION_FROM);
    fromMetaNodeModel = XiorkFlowModelConverter.getMetaNodeModel(model, fromID);
    var toID = node.getAttribute(XiorkFlowModelConverter.ATTR_TRANSITION_TO);
    toMetaNodeModel = XiorkFlowModelConverter.getMetaNodeModel(model, toID);

    //
    var id = (node.getAttribute(XiorkFlowModelConverter.ATTR_TRANSITION_ID));

    //
    var name = node.getAttribute(XiorkFlowModelConverter.ATTR_TRANSITION_NAME);
    name = name ? name : "";

    //
    var transitionModel = new TransitionModel(fromMetaNodeModel, toMetaNodeModel, id);

	//
    transitionModel.setText(name);

	//条件表达式
	//var extensionElementsNode = node.selectSingleNode(XiorkFlowModelConverter.NODE_TRANSITION_CONDITIONEXPRESSION);//支持IE
    var extensionElementsNode= XMLDocument.SelectSingleNode(node,XiorkFlowModelConverter.NODE_TRANSITION_CONDITIONEXPRESSION);
	if( extensionElementsNode != null ){
		 //transitionModel.setConditionExpression(extensionElementsNode.text);
		 transitionModel.setConditionExpression(XMLDocument.getText(extensionElementsNode));
		 transitionModel.setConditionExpressionType(extensionElementsNode.getAttribute(XiorkFlowModelConverter.ATTR_TRANSITION_TYPE));
	}

	//var extensionElementsNode = node.selectSingleNode(XiorkFlowModelConverter.NODE_ACTIVITIE_EXTENSIONELEMENTS);//支持IE 
	var extensionElementsNodes= XMLDocument.SelectSingleNode(node,XiorkFlowModelConverter.NODE_ACTIVITIE_EXTENSIONELEMENTS);
	if( extensionElementsNodes != null ){
		//条件表达式显示名
		//var extensionElementsNode = extensionElementsNode.selectSingleNode(XiorkFlowModelConverter.NODE_TRANSITION_CONDITIONEXPRESSIONDISPLAY);//支持IE
		var extensionElementsNode= XMLDocument.SelectSingleNode(extensionElementsNodes,XiorkFlowModelConverter.NODE_TRANSITION_CONDITIONEXPRESSIONDISPLAY);
		if( extensionElementsNode != null ){
			 //transitionModel.setConditionExpressionDisplay(extensionElementsNode.text);
			 transitionModel.setConditionExpressionDisplay(XMLDocument.getText(extensionElementsNode));
		}

		//排序码
		extensionElementsNode= XMLDocument.SelectSingleNode(extensionElementsNodes,XiorkFlowModelConverter.NODE_TRANSITION_SORT);
		if( extensionElementsNode != null ){
			 //transitionModel.setConditionExpressionDisplay(extensionElementsNode.text);
			 transitionModel.setSortNum(XMLDocument.getText(extensionElementsNode));
		}


		//必须经过
		extensionElementsNode= XMLDocument.SelectSingleNode(extensionElementsNodes,XiorkFlowModelConverter.NODE_TRANSITION_MUST_CHOOSETYPE);
		if( extensionElementsNode != null ){
			 transitionModel.setMustChooseType(XMLDocument.getText(extensionElementsNode));
		}

		//默认选中
		extensionElementsNode2= XMLDocument.SelectSingleNode(extensionElementsNodes,XiorkFlowModelConverter.NODE_TRANSITION_DEFAULT_CHOOSETYPE);
		if( extensionElementsNode2 != null ){
			 transitionModel.setDefaultChooseType(XMLDocument.getText(extensionElementsNode2));
		}else{
			 transitionModel.setDefaultChooseType("0");
		}


	}

    //
    return transitionModel;
};
XiorkFlowModelConverter.getMetaNodeModel = function (model, id) {
    var metaNodeModels = model.getMetaNodeModels();
    for (var i = 0; i < metaNodeModels.size(); i++) {
        var metaNodeModel = metaNodeModels.get(i);
        if (metaNodeModel.getID() == id) {
            return metaNodeModel;
        }
    }
};

//static
XiorkFlowModelConverter.NODE_PROCESS = "process";
XiorkFlowModelConverter.NODE_ROOT = "definitions";
XiorkFlowModelConverter.ATTR_PROCESS_ID = "id";
XiorkFlowModelConverter.ATTR_PROCESS_NAME = "name";

//节点
XiorkFlowModelConverter.NODE_ACTIVITIE_STARTEVENT = "startEvent";
XiorkFlowModelConverter.NODE_ACTIVITIE_ENDEVENT = "endEvent";

XiorkFlowModelConverter.NODE_ACTIVITIE_USERTASK = "userTask";
XiorkFlowModelConverter.NODE_ACTIVITIE_EXCLUSIVEGATEWAY = "exclusiveGateway";
XiorkFlowModelConverter.NODE_ACTIVITIE_PARALLELGATEWAY = "parallelGateway";
XiorkFlowModelConverter.NODE_ACTIVITIE_INCLUSIVEGATEWAY = "inclusiveGateway";
XiorkFlowModelConverter.NODE_ACTIVITIE_SERVICETASK = "serviceTask";
XiorkFlowModelConverter.NODE_ACTIVITIE_RECEIVETASK = "receiveTask";
XiorkFlowModelConverter.NODE_ACTIVITIE_CALLACTIVITY = "callActivity";
XiorkFlowModelConverter.NODE_ACTIVITIE_SUBPROCESS = "subProcess";


XiorkFlowModelConverter.NODE_ACTIVITIES = "Activities";
XiorkFlowModelConverter.NODE_ACTIVITIE = "Activitie";
XiorkFlowModelConverter.ATTR_ACTIVITIE_ID = "id";
XiorkFlowModelConverter.ATTR_ACTIVITIE_TYPE = "type";
XiorkFlowModelConverter.ATTR_ACTIVITIE_NAME = "name";
//节点属性
XiorkFlowModelConverter.ATTR_ACTIVITIE_PRIORITY = "activiti:priority";
XiorkFlowModelConverter.ATTR_ACTIVITIE_DUEDATE = "activiti:dueDate";
XiorkFlowModelConverter.ATTR_ACTIVITIE_TASKSEQUENCETYPE = "whir:taskSequenceType";
XiorkFlowModelConverter.ATTR_ACTIVITIE_TASKNEEDREAD = "whir:taskNeedRead";
XiorkFlowModelConverter.ATTR_ACTIVITIE_OVERDUETPYE = "whir:overdueTpye";
XiorkFlowModelConverter.ATTR_ACTIVITIE_TASKDEALWITHCLASS = "whir:taskDealWithClass";
XiorkFlowModelConverter.ATTR_ACTIVITIE_NODEWRITEFIELD = "whir:nodeWriteField";
XiorkFlowModelConverter.ATTR_ACTIVITIE_NODEHIDDENFIELD = "whir:nodeHiddenField";
XiorkFlowModelConverter.ATTR_ACTIVITIE_NODECOMMENTFIELD = "whir:nodeCommentField";
XiorkFlowModelConverter.ATTR_ACTIVITIE_NODENEEDAGENT = "whir:nodeNeedAgent";
XiorkFlowModelConverter.ATTR_ACTIVITIE_FORMKEY = "activiti:formKey";
XiorkFlowModelConverter.ATTR_ACTIVITIE_ASSIGNEE = "activiti:assignee";
XiorkFlowModelConverter.ATTR_ACTIVITIE_NODEWRITEFIELD = "activiti:assignee";
XiorkFlowModelConverter.ATTR_ACTIVITIE_ISBACKTRACKACT = "whir:isBacktrackAct";

//节点扩展子元素
XiorkFlowModelConverter.NODE_ACTIVITIE_EXTENSIONELEMENTS = "extensionElements";
XiorkFlowModelConverter.NODE_ACTIVITIE_WHIREXTENSION = "whir:whirextension";
XiorkFlowModelConverter.NODE_ACTIVITIE_WHIREXTENSION_NAME = "name";
XiorkFlowModelConverter.NODE_ACTIVITIE_FIELD = "whir:field";
XiorkFlowModelConverter.NODE_ACTIVITIE_FIELDNAME = "name";
XiorkFlowModelConverter.NODE_ACTIVITIE_VALUE = "whir:value";
XiorkFlowModelConverter.ATTR_ACTIVITIE_WHIREXTENSION_NAME = "whir:field";
XiorkFlowModelConverter.NODE_ACTIVITIE_FIELD_NAME = "whir:field";


XiorkFlowModelConverter.ATTR_ACTIVITIE_X_COORD = "xCoordinate";
XiorkFlowModelConverter.ATTR_ACTIVITIE_Y_COORD = "yCoordinate";
XiorkFlowModelConverter.ATTR_ACTIVITIE_WIDTH = "width";
XiorkFlowModelConverter.ATTR_ACTIVITIE_HEIGHT = "height";

//
XiorkFlowModelConverter.NODE_TRANSITIONS = "Transitions";
XiorkFlowModelConverter.NODE_TRANSITION = "sequenceFlow";
XiorkFlowModelConverter.NODE_TRANSITION_CONDITIONEXPRESSION = "conditionExpression";
XiorkFlowModelConverter.NODE_TRANSITION_CONDITIONEXPRESSIONDISPLAY = "whir:conditionExpressionDisplay";

XiorkFlowModelConverter.NODE_TRANSITION_SORT = "whir:transitionSort";
XiorkFlowModelConverter.NODE_TRANSITION_MUST_CHOOSETYPE = "whir:transitionMustChooseType";
XiorkFlowModelConverter.NODE_TRANSITION_DEFAULT_CHOOSETYPE = "whir:transitionDefaultChooseType";

XiorkFlowModelConverter.ATTR_TRANSITION_TYPE = "xsi:type";
XiorkFlowModelConverter.ATTR_TRANSITION_ID = "id";
XiorkFlowModelConverter.ATTR_TRANSITION_NAME = "name";
XiorkFlowModelConverter.ATTR_TRANSITION_FROM = "sourceRef";
XiorkFlowModelConverter.ATTR_TRANSITION_TO = "targetRef";


//流程属性
XiorkFlowModelConverter.ATTR_PROCESS_ID = "id";
XiorkFlowModelConverter.ATTR_PROCESS_NAME = "name";
XiorkFlowModelConverter.ATTR_PROCESS_PROCESSUSERSCOPE = "whir:processUserScope";
XiorkFlowModelConverter.ATTR_PROCESS_PROCESSPACKAGE = "whir:processPackage";
XiorkFlowModelConverter.ATTR_PROCESS_PROCESSNEEDDOSSIER = "whir:processNeedDossier";
XiorkFlowModelConverter.ATTR_PROCESS_PROCESSNEEDPRINT = "whir:processNeedPrint";
XiorkFlowModelConverter.ATTR_PROCESS_PROCESSCOMMENTISNULL = "whir:processCommentIsNull";
XiorkFlowModelConverter.ATTR_PROCESS_PROCESSREMINDFIELD = "whir:processRemindField";
XiorkFlowModelConverter.ATTR_PROCESS_NODEWRITEFIELD = "whir:nodeWriteField";
XiorkFlowModelConverter.ATTR_PROCESS_FORMKEY = "whir:formKey";
XiorkFlowModelConverter.NODE_PROCESS_DOCUMENTATION = "documentation";
XiorkFlowModelConverter.NODE_PROCESS_EXTENSIONELEMENTS = "extensionElements";
XiorkFlowModelConverter.NODE_PROCESS_WHIREXTENSION = "whir:whirextension";
XiorkFlowModelConverter.NODE_PROCESS_WHIREXTENSION_NAME = "name";
XiorkFlowModelConverter.NODE_PROCESS_FIELD = "whir:field";
XiorkFlowModelConverter.NODE_PROCESS_FIELDNAME = "name";
XiorkFlowModelConverter.NODE_PROCESS_VALUE = "whir:value";
XiorkFlowModelConverter.ATTR_PROCESS_WHIREXTENSION_NAME = "whir:field";
XiorkFlowModelConverter.NODE_PROCESS_FIELD_NAME = "whir:field";


//图形
XiorkFlowModelConverter.NODE_BPMNDI_BPMNDIAGRAM = "bpmndi:BPMNDiagram";
XiorkFlowModelConverter.NODE_BPMNDI_BPMNPLANE = "bpmndi:BPMNPlane";
XiorkFlowModelConverter.NODE_BPMNDI_BPMNSHAPE = "bpmndi:BPMNShape";
XiorkFlowModelConverter.ATTR_BPMNDI_BPMNELEMENT = "bpmnElement";
XiorkFlowModelConverter.ATTR_BPMNDI_ID = "id";
XiorkFlowModelConverter.NODE_OMGDC_BOUNDS = "omgdc:Bounds";
XiorkFlowModelConverter.ATTR_OMGDC_HEIGHT = "height";
XiorkFlowModelConverter.ATTR_OMGDC_WIDTH = "width";
XiorkFlowModelConverter.ATTR_OMGDC_X = "x";
XiorkFlowModelConverter.ATTR_OMGDC_Y = "y";
//针对不同的浏览器取值
XiorkFlowModelConverter.NODE_BPMNDI_BPMNSHAPE_ = "bpmndi:BPMNShape";

XiorkFlowModelConverter.NODE_BPMNDI_BPMNEDGE = "bpmndi:BPMNEdge";
XiorkFlowModelConverter.NODE_OMGDI_WAYPOINT = "omgdi:waypoint";
