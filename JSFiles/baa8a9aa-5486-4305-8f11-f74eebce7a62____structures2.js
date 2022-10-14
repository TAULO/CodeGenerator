function Phrase() {
    this.en = "Missing!";
    this.es = "Falta!";
}

var DataType = {
    number: { value: "int" },
    string: { value: "string" },
    bool: { value: "boolean" }
}

function Attribute(name) {
    this.name = name;
    this.value = null;
    this.defaultValue = null;
    this.friendlyName = new Phrase();
    this.description = new Phrase();
    this.dataType = DataType.number;
    this.minValue = null;
    this.maxValue = null;
    this.required = false;
}

function Comment()
{
    this.name = "Comment";
    this.comment = "Comentario para nodos";
    this.icon = "fa fa-commenting-o";
    this.friendlyName = new Phrase();
    this.description = new Phrase();
}

function NodeElement(name, isVoice) {
    this.name = name;
    this.isVoice = isVoice; // is for voice?
    this.icon = "fa fa-commenting-o";
    this.video = "";
    this.friendlyName = new Phrase();
    this.description = new Phrase();
    this.attributes = [];
    this.children = new Array();
}

var Logic = Logic || {};

// <--------------------------- paste after here!

Logic.Voice = {
    Logic: new NodeElement("Logic", true),
    Say: new NodeElement("Say", true),
    Play: new NodeElement("Play", true),
    CollectDigits: new NodeElement("CollectDigits", true),
    Record: new NodeElement("Record", true),
    Message: new NodeElement("Message", true),
    Extension: new NodeElement("Extension", true),
    Dial: new NodeElement("Dial", true),
    Sip: new NodeElement("Sip", true),
    Hangup: new NodeElement("Hangup", true),
    Pause: new NodeElement("Pause", true),
    Goto: new NodeElement("Goto", true),
    Label: new NodeElement("Label", true),
    Conference: new NodeElement("Conference", true),
    Function: new NodeElement("Function", true),
    Execute: new NodeElement("Execute", true),
    SetVariable: new NodeElement("SetVariable", true),
    ClearVariable: new NodeElement("ClearVariable", true),
    If: new NodeElement("If", true),
    Post: new NodeElement("Post", true),
    Voicemail: new NodeElement("Voicemail", true),
    Comment: new NodeElement("Comment", true),
    Participant: new NodeElement("Participant", true)
}


// Logic
{
    Logic.Voice.Logic.friendlyName.en = "Logic";
    Logic.Voice.Logic.friendlyName.es = "Logica";

    // Children
    Logic.Voice.Logic.children = [Logic.Voice.Say, Logic.Voice.Play, Logic.Voice.CollectDigits, Logic.Voice.Record, Logic.Voice.Message, Logic.Voice.Extension, Logic.Voice.Dial, Logic.Voice.Sip, Logic.Voice.Hangup, Logic.Voice.Pause, Logic.Voice.Goto, Logic.Voice.Label, Logic.Voice.Conference, Logic.Voice.Function, Logic.Voice.Execute, Logic.Voice.SetVariable, Logic.Voice.ClearVariable, Logic.Voice.If, Logic.Voice.Post, Logic.Voice.Voicemail, Logic.Voice.Comment];
}

// Say
{
    Logic.Voice.Say.friendlyName.en = "Say";
    Logic.Voice.Say.description.en = "Converts text to speech that is read back to the caller. Is useful for saying dynamic text that is difficult to pre-record such as the caller's name.";

    // voice
    var voiceAttr = new Attribute("voice");
    Logic.Voice.Say.attributes.push(voiceAttr);
    voiceAttr.friendlyName.en = "Voice";
    voiceAttr.description.en = "Specify the gender of the person saying your message.";
    voiceAttr.required = false;
    voiceAttr.options = ["man", "woman"];

    // language
    var languageAttr = new Attribute("language");
    Logic.Voice.Say.attributes.push(languageAttr);
    languageAttr.friendlyName.en = "Language";
    languageAttr.description.en = "Impact Made supports the languages English, Espanish, French and German.";
    languageAttr.required = false;
    languageAttr.options = ["en", "es", "fr", "de"];

    // text
    var textAttr = new Attribute("text");
    Logic.Voice.Say.attributes.push(textAttr);
    textAttr.friendlyName.en = "Text";
    textAttr.description.en = "The text you wish to convert to speech.";
    textAttr.required = true;
    textAttr.dataType = DataType.string;

}

// Play
{
    Logic.Voice.Play.friendlyName.en = "Play";
    Logic.Voice.Play.description.en = "Plays an audio file back to the caller.";

    // loop
    var loopAttr = new Attribute("loop");
    Logic.Voice.Play.attributes.push(loopAttr);
    loopAttr.friendlyName.en = "Loop";
    loopAttr.description.en = "Play the audio N times. Place 2 if you wish to play the audio two times.";
    loopAttr.required = false;
    loopAttr.dataType = DataType.number;

    // url
    var urlAttr = new Attribute("url");
    Logic.Voice.Play.attributes.push(urlAttr);
    urlAttr.friendlyName.en = "Url";
    urlAttr.description.en = "The url containing the audio file to be played to the caller. For example http://yourDomain.com/Audio/Song1.mp3";
    urlAttr.required = true;
    urlAttr.dataType = DataType.string;

}

// CollectDigits
{
    Logic.Voice.CollectDigits.friendlyName.en = "CollectDigits";
    Logic.Voice.CollectDigits.description.en = "Collects digits that a caller enters into his or her telephone keypad. When the caller is done entering data, Impact Made will store the digits on a keyword. The default keyword is digits.";

    // numDigits
    var numDigitsAttr = new Attribute("numDigits");
    Logic.Voice.CollectDigits.attributes.push(numDigitsAttr);
    numDigitsAttr.friendlyName.en = "Number of Digits";
    numDigitsAttr.friendlyName.es = "Numero de digitos";
    numDigitsAttr.description.en = "How many digits are you expecting the caller to enter. For example if you are asking for a zip code you should enter 5.";
    numDigitsAttr.required = false;
    numDigitsAttr.dataType = DataType.number;
    numDigitsAttr.defaultValue = 50;

    // finishOnKey
    var finishOnKeyAttr = new Attribute("finishOnKey");
    Logic.Voice.CollectDigits.attributes.push(finishOnKeyAttr);
    finishOnKeyAttr.friendlyName.en = "Finish on Key";
    finishOnKeyAttr.description.en = "Stop waiting for more input once user enters this key. Posible values are #,*,0,1,2,3,4,5,6,6,7,8 and 9.";
    finishOnKeyAttr.required = false;
    finishOnKeyAttr.dataType = DataType.string;
    finishOnKeyAttr.defaultValue = "#";

    // timeout
    var timeoutAttr = new Attribute("timeout");
    Logic.Voice.CollectDigits.attributes.push(timeoutAttr);
    timeoutAttr.friendlyName.en = "Timeout";
    timeoutAttr.description.en = "Number of seconds to wait for the caller to enter digits.";
    timeoutAttr.required = false;
    timeoutAttr.dataType = DataType.number;
    timeoutAttr.defaultValue = 5;

    // variable
    var variableAttr = new Attribute("variable");
    Logic.Voice.CollectDigits.attributes.push(variableAttr);
    variableAttr.friendlyName.en = "Variable";
    variableAttr.description.en = "The digits that the caller entered will be saved into this variable.";
    variableAttr.required = false;
    variableAttr.dataType = DataType.string;
    variableAttr.defaultValue = "Digits";

    // category
    var categoryAttr = new Attribute("category");
    Logic.Voice.CollectDigits.attributes.push(categoryAttr);
    categoryAttr.friendlyName.en = "Category";
    categoryAttr.description.en = "Into what category will this variable belong.";
    categoryAttr.required = false;
    categoryAttr.dataType = DataType.string;

    // Children
    Logic.Voice.CollectDigits.children = [Logic.Voice.Play, Logic.Voice.Say, Logic.Voice.Pause, Logic.Voice.Comment];
}

// Record
{
    Logic.Voice.Record.friendlyName.en = "Record.";
    Logic.Voice.Record.description.en = "Records the caller's voice and saves it in the variable that you spesify. The default variable is 'record'.";

    // finishOnKey
    var finishOnKeyAttr = new Attribute("finishOnKey");
    Logic.Voice.Record.attributes.push(finishOnKeyAttr);
    finishOnKeyAttr.friendlyName.en = "Finish on key";
    finishOnKeyAttr.description.en = "Impact Made will stop the recording once user enters this key. Possible values are #,*,0,1,2,3,4,5,6,6,7,8 and 9";
    finishOnKeyAttr.required = false;
    finishOnKeyAttr.dataType = DataType.string;

    // maxLength
    var maxLengthAttr = new Attribute("maxLength");
    Logic.Voice.Record.attributes.push(maxLengthAttr);
    maxLengthAttr.friendlyName.en = "Max Length";
    maxLengthAttr.description.en = "The maximum number of seconds that the recording will last.";
    maxLengthAttr.required = false;
    maxLengthAttr.dataType = DataType.number;

    // playBeep
    var playBeepAttr = new Attribute("playBeep");
    Logic.Voice.Record.attributes.push(playBeepAttr);
    playBeepAttr.friendlyName.en = "Play Beep";
    playBeepAttr.description.en = "Allows you to toggle between playing a sound before the start of a recording. If you set the value to 'false', no beep sound will be played.";
    playBeepAttr.required = false;
    playBeepAttr.dataType = DataType.bool;

    // timeout
    var timeoutAttr = new Attribute("timeout");
    Logic.Voice.Record.attributes.push(timeoutAttr);
    timeoutAttr.friendlyName.en = "Timeout";
    timeoutAttr.description.en = "Tells Impact Made to end the recording after a number of seconds of silence has passed. The default is 5 seconds.";
    timeoutAttr.required = false;
    timeoutAttr.dataType = DataType.number;
    timeoutAttr.defaultValue = 5;

    // variable
    var variableAttr = new Attribute("variable");
    Logic.Voice.Record.attributes.push(variableAttr);
    variableAttr.friendlyName.en = "Variable";
    variableAttr.description.en = "Recordingn will be saved into this variable as a URL.";
    variableAttr.required = true;
    variableAttr.dataType = DataType.string;

    // category
    var categoryAttr = new Attribute("category");
    Logic.Voice.Record.attributes.push(categoryAttr);
    categoryAttr.friendlyName.en = "Category";
    categoryAttr.description.en = "Variable will be saved under this category.";
    categoryAttr.required = false;
    categoryAttr.dataType = DataType.string;
    categoryAttr.defaultValue = "default";

}

// Message
{
    Logic.Voice.Message.friendlyName.en = "Sms";
    Logic.Voice.Message.description.en = "Sends an Message. Note it can include media.";

    // body
    var bodyAttr = new Attribute("body");
    Logic.Voice.Message.attributes.push(bodyAttr);
    bodyAttr.friendlyName.en = "Body";
    bodyAttr.description.en = "The body of the sms.";
    bodyAttr.required = true;
    bodyAttr.dataType = DataType.string;

    // media
    var mediaAttr = new Attribute("media");
    Logic.Voice.Message.attributes.push(mediaAttr);
    mediaAttr.friendlyName.en = "Media";
    mediaAttr.friendlyName.es = "Media";
    mediaAttr.description.en = "Url where media you intend to send is located.";
    mediaAttr.description.es = "Url donde esta la media que quieres mandar.";
    mediaAttr.required = false;
    mediaAttr.dataType = DataType.string;

    // to
    var toAttr = new Attribute("to");
    Logic.Voice.Message.attributes.push(toAttr);
    toAttr.friendlyName.en = "To";
    toAttr.friendlyName.es = "Para";
    toAttr.description.en = "Impact Made will send a message to this number. If no value is provided, Impact Made will send the message as a reply to the current caller.";
    toAttr.description.es = "El telefono a donde vas a mandar el sms.";
    toAttr.required = false;
    toAttr.dataType = DataType.string;

}

// Extension
{
    Logic.Voice.Extension.friendlyName.en = "Extension";
    Logic.Voice.Extension.description.en = "Call an extension on your network.";

    // extension
    var extensionAttr = new Attribute("extension");
    Logic.Voice.Extension.attributes.push(extensionAttr);
    extensionAttr.friendlyName.en = "Extension";
    extensionAttr.description.en = "The extension to dial.";
    extensionAttr.required = true;
    extensionAttr.dataType = DataType.string;

}

// Dial
{
    Logic.Voice.Dial.friendlyName.en = "Dial";
    Logic.Voice.Dial.description.en = "Redirects a call to a different number. Use this if you want to redirect the call to your cell phone for example.";

    // record
    var recordAttr = new Attribute("record");
    Logic.Voice.Dial.attributes.push(recordAttr);
    recordAttr.friendlyName.en = "Record";
    recordAttr.description.en = "Do you want to record the call?";
    recordAttr.required = false;
    recordAttr.dataType = DataType.bool;

    // number
    var numberAttr = new Attribute("number");
    Logic.Voice.Dial.attributes.push(numberAttr);
    numberAttr.friendlyName.en = "Phone Number";
    numberAttr.description.en = "The phone number to dial.";
    numberAttr.required = true;
    numberAttr.dataType = DataType.string;

    // timeLimit
    var timeLimitAttr = new Attribute("timeLimit");
    Logic.Voice.Dial.attributes.push(timeLimitAttr);
    timeLimitAttr.friendlyName.en = "Time Limit";
    timeLimitAttr.description.en = "Sets the maximum duration of the call in seconds.";
    timeLimitAttr.required = false;
    timeLimitAttr.dataType = DataType.number;

    // timeout
    var timeoutAttr = new Attribute("timeout");
    Logic.Voice.Dial.attributes.push(timeoutAttr);
    timeoutAttr.friendlyName.en = "Timeout";
    timeoutAttr.description.en = "Sets the limit in seconds that call waits for the called party to answer the call. Basically, how long should Impact Made let the call ring before giving up and reporting 'no-answer'.";
    timeoutAttr.required = false;
    timeoutAttr.dataType = DataType.number;

}

// Sip
{
    Logic.Voice.Sip.friendlyName.en = "Sip (IP Call)";
    Logic.Voice.Sip.description.en = "Used to call VOIP phones.";

    // domain
    var domainAttr = new Attribute("domain");
    Logic.Voice.Sip.attributes.push(domainAttr);
    domainAttr.friendlyName.en = "Domain";
    domainAttr.description.en = "The IP address of the PBX.";
    domainAttr.required = true;
    domainAttr.dataType = DataType.string;

    // extension
    var extensionAttr = new Attribute("extension");
    Logic.Voice.Sip.attributes.push(extensionAttr);
    extensionAttr.friendlyName.en = "Extension";
    extensionAttr.description.en = "The extension to dial.";
    extensionAttr.required = true;
    extensionAttr.dataType = DataType.string;

    // port
    var portAttr = new Attribute("port");
    Logic.Voice.Sip.attributes.push(portAttr);
    portAttr.friendlyName.en = "Port";
    portAttr.description.en = "The port number where your PBX will be listening";
    portAttr.required = false;
    portAttr.dataType = DataType.number;
    portAttr.defaultValue = 5060;

    // transport
    var transportAttr = new Attribute("transport");
    Logic.Voice.Sip.attributes.push(transportAttr);
    transportAttr.friendlyName.en = "Transport";
    transportAttr.description.en = "TCP is used for a secure connection. This will add overhead to your connection. The recomended protocol is UDP.";
    transportAttr.required = false;
    transportAttr.options = ["UDP", "TCP"];
    transportAttr.defaultValue = "UDP";

}

// Hangup
{
    Logic.Voice.Hangup.friendlyName.en = "Hangup";
    Logic.Voice.Hangup.description.en = "Hangup the currect call.";

}

// Pause
{
    Logic.Voice.Pause.friendlyName.en = "Pause";
    Logic.Voice.Pause.description.en = "Waits silently for a specific number of seconds.";

    // length
    var lengthAttr = new Attribute("length");
    Logic.Voice.Pause.attributes.push(lengthAttr);
    lengthAttr.friendlyName.en = "Length";
    lengthAttr.description.en = "The number of seconds to wait.";
    lengthAttr.required = false;
    lengthAttr.dataType = DataType.number;
    lengthAttr.defaultValue = 1;

}

// Goto
{
    Logic.Voice.Goto.friendlyName.en = "Goto";
    Logic.Voice.Goto.description.en = "Jumps to a spesific label. A label is a spesific section of your tree. For example you may want to redirect a caller to the 'Support' section of your tree.";

    // labelId
    var labelIdAttr = new Attribute("labelId");
    Logic.Voice.Goto.attributes.push(labelIdAttr);
    labelIdAttr.friendlyName.en = "Label ID";
    labelIdAttr.description.en = "The id of the label you want to point to.";
    labelIdAttr.required = true;
    labelIdAttr.dataType = DataType.string;

}

// Label
{
    Logic.Voice.Label.friendlyName.en = "Label";
    Logic.Voice.Label.description.en = "Thanks to this attribute, it is possible to redirect callers to different sections of your tree. For example you may want to redirect a caller to the 'Support' section of your tree.";

    // id
    var idAttr = new Attribute("id");
    Logic.Voice.Label.attributes.push(idAttr);
    idAttr.friendlyName.en = "ID";
    idAttr.description.en = "The id of this label. Use the Goto statement to point to this label.";
    idAttr.required = true;
    idAttr.dataType = DataType.string;

    // isLink
    var isLinkAttr = new Attribute("isLink");
    Logic.Voice.Label.attributes.push(isLinkAttr);
    isLinkAttr.friendlyName.en = "Is Link";
    isLinkAttr.required = false;
    isLinkAttr.dataType = DataType.bool;

}

// Conference
{
    Logic.Voice.Conference.friendlyName.en = "Conference";
    Logic.Voice.Conference.description.en = "Allows you to connect to a conference room.";

    // id
    var idAttr = new Attribute("id");
    Logic.Voice.Conference.attributes.push(idAttr);
    idAttr.friendlyName.en = "ID";
    idAttr.description.en = "The id of this conference. Different IDs will create different conferences.";
    idAttr.required = true;
    idAttr.dataType = DataType.string;

    // Children
    Logic.Voice.Conference.children = [Logic.Voice.Participant];
}

// Function
{
    Logic.Voice.Function.friendlyName.en = "Function";
    Logic.Voice.Function.description.en = "Use this if you have duplicate functionality.";
    Logic.Voice.Function.video = "http://impactmade.com";

    // name
    var nameAttr = new Attribute("name");
    Logic.Voice.Function.attributes.push(nameAttr);
    nameAttr.friendlyName.en = "Name";
    nameAttr.description.en = "The name of the function.";
    nameAttr.required = true;
    nameAttr.dataType = DataType.string;

    // Children
    Logic.Voice.Function.children = [Logic.Voice.Say, Logic.Voice.Play, Logic.Voice.CollectDigits, Logic.Voice.Record, Logic.Voice.Message, Logic.Voice.Extension, Logic.Voice.Dial, Logic.Voice.Sip, Logic.Voice.Hangup, Logic.Voice.Pause, Logic.Voice.Goto, Logic.Voice.Label, Logic.Voice.Conference, Logic.Voice.Function, Logic.Voice.Execute, Logic.Voice.SetVariable, Logic.Voice.ClearVariable, Logic.Voice.If, Logic.Voice.Post, Logic.Voice.Voicemail, Logic.Voice.Comment];
}

// Execute
{
    Logic.Voice.Execute.friendlyName.en = "Execute";
    Logic.Voice.Execute.description.en = "Executes a function. This is usefull in order to avoid repeating yourself.";

    // function
    var functionAttr = new Attribute("function");
    Logic.Voice.Execute.attributes.push(functionAttr);
    functionAttr.friendlyName.en = "Function";
    functionAttr.description.en = "The name of the function to execute.";
    functionAttr.required = true;
    functionAttr.dataType = DataType.string;

}

// SetVariable
{
    Logic.Voice.SetVariable.friendlyName.en = "Set the value of a variable.";
    Logic.Voice.SetVariable.description.en = "Creates or updates a variable.";

    // name
    var nameAttr = new Attribute("name");
    Logic.Voice.SetVariable.attributes.push(nameAttr);
    nameAttr.friendlyName.en = "Name";
    nameAttr.description.en = "The name of the Keyword. For example 'ZipCode'.";
    nameAttr.required = true;
    nameAttr.dataType = DataType.string;

    // value
    var valueAttr = new Attribute("value");
    Logic.Voice.SetVariable.attributes.push(valueAttr);
    valueAttr.friendlyName.en = "Value";
    valueAttr.description.en = "The value you wish to asign to the variable.";
    valueAttr.required = false;
    valueAttr.dataType = DataType.string;

}

// ClearVariable
{
    Logic.Voice.ClearVariable.friendlyName.en = "Clear Variable";
    Logic.Voice.ClearVariable.description.en = "Deletes a variable.";

    // name
    var nameAttr = new Attribute("name");
    Logic.Voice.ClearVariable.attributes.push(nameAttr);
    nameAttr.friendlyName.en = "Name";
    nameAttr.description.en = "The name of the variable to delete.";
    nameAttr.required = true;
    nameAttr.dataType = DataType.string;

    // category
    var categoryAttr = new Attribute("category");
    Logic.Voice.ClearVariable.attributes.push(categoryAttr);
    categoryAttr.friendlyName.en = "Category";
    categoryAttr.description.en = "To what category will this variable belong? This is usefull when you have multiple departments.";
    categoryAttr.required = false;
    categoryAttr.dataType = DataType.string;
    categoryAttr.defaultValue = "default";

}

// If
{
    Logic.Voice.If.friendlyName.en = "If";
    Logic.Voice.If.description.en = "Uses variables to determine if logic should be executed.";

    // variable
    var variableAttr = new Attribute("variable");
    Logic.Voice.If.attributes.push(variableAttr);
    variableAttr.friendlyName.en = "Variable";
    variableAttr.description.en = "The name of the variable. For example ZipCode.";
    variableAttr.required = false;
    variableAttr.dataType = DataType.string;
    variableAttr.defaultValue = "Digits";

    // category
    var categoryAttr = new Attribute("category");
    Logic.Voice.If.attributes.push(categoryAttr);
    categoryAttr.friendlyName.en = "Category";
    categoryAttr.description.en = "The category where the variable belongs.";
    categoryAttr.required = false;
    categoryAttr.dataType = DataType.string;
    categoryAttr.defaultValue = "default";

    // condition
    var conditionAttr = new Attribute("condition");
    Logic.Voice.If.attributes.push(conditionAttr);
    conditionAttr.friendlyName.en = "Condition.";
    conditionAttr.required = false;
    conditionAttr.options = ["equals", "contains", "hasValue", "hasNoValue", "isLessThan", "isGreaterThan", "regex"];
    conditionAttr.defaultValue = "contains";

    // value
    var valueAttr = new Attribute("value");
    Logic.Voice.If.attributes.push(valueAttr);
    valueAttr.friendlyName.en = "Value";
    valueAttr.description.en = "Value to test against. For example you may want to test if the variable LastFourDigitsSocial is equal to 1234.";
    valueAttr.required = false;
    valueAttr.dataType = DataType.string;

    // Children
    Logic.Voice.If.children = [Logic.Voice.Say, Logic.Voice.Play, Logic.Voice.CollectDigits, Logic.Voice.Record, Logic.Voice.Message, Logic.Voice.Extension, Logic.Voice.Dial, Logic.Voice.Sip, Logic.Voice.Hangup, Logic.Voice.Pause, Logic.Voice.Goto, Logic.Voice.Label, Logic.Voice.Conference, Logic.Voice.Function, Logic.Voice.Execute, Logic.Voice.SetVariable, Logic.Voice.ClearVariable, Logic.Voice.If, Logic.Voice.Post, Logic.Voice.Voicemail, Logic.Voice.Comment];
}

// Post
{
    Logic.Voice.Post.friendlyName.en = "HTTP Post Request";
    Logic.Voice.Post.friendlyName.es = "HTTP Post";
    Logic.Voice.Post.description.en = "Sends a HTTP Post request to the url that you spesify. The request will contain all the variables that are associated with a spesific phone number.";

    // url
    var urlAttr = new Attribute("url");
    Logic.Voice.Post.attributes.push(urlAttr);
    urlAttr.friendlyName.en = "Url";
    urlAttr.description.en = "The url where Impact Made will post the variables.";
    urlAttr.required = true;
    urlAttr.dataType = DataType.string;

    // fallBackUrl
    var fallBackUrlAttr = new Attribute("fallBackUrl");
    Logic.Voice.Post.attributes.push(fallBackUrlAttr);
    fallBackUrlAttr.friendlyName.en = "Fall Back Url";
    fallBackUrlAttr.description.en = "If first POST request fails then Impact Made will make a second request to the this url.";
    fallBackUrlAttr.required = false;
    fallBackUrlAttr.dataType = DataType.string;

}

// Voicemail
{
    Logic.Voice.Voicemail.friendlyName.en = "Voicemail.";
    Logic.Voice.Voicemail.description.en = "Records the caller's voice and saves it in the variable that you spesify. The default variable is 'voicemail'.";

    // finishOnKey
    var finishOnKeyAttr = new Attribute("finishOnKey");
    Logic.Voice.Voicemail.attributes.push(finishOnKeyAttr);
    finishOnKeyAttr.friendlyName.en = "Finish on key";
    finishOnKeyAttr.description.en = "Impact Made will stop the recording once user enters this key. Possible values are #,*,0,1,2,3,4,5,6,6,7,8 and 9";
    finishOnKeyAttr.required = false;
    finishOnKeyAttr.dataType = DataType.string;

    // maxLength
    var maxLengthAttr = new Attribute("maxLength");
    Logic.Voice.Voicemail.attributes.push(maxLengthAttr);
    maxLengthAttr.friendlyName.en = "Max Length";
    maxLengthAttr.description.en = "The maximum number of seconds that the recording will last.";
    maxLengthAttr.required = false;
    maxLengthAttr.dataType = DataType.number;

    // playBeep
    var playBeepAttr = new Attribute("playBeep");
    Logic.Voice.Voicemail.attributes.push(playBeepAttr);
    playBeepAttr.friendlyName.en = "Play Beep";
    playBeepAttr.description.en = "Allows you to toggle between playing a sound before the start of a recording. If you set the value to 'false', no beep sound will be played.";
    playBeepAttr.required = false;
    playBeepAttr.dataType = DataType.bool;

    // timeout
    var timeoutAttr = new Attribute("timeout");
    Logic.Voice.Voicemail.attributes.push(timeoutAttr);
    timeoutAttr.friendlyName.en = "Timeout";
    timeoutAttr.description.en = "Tells Impact Made to end the recording after a number of seconds of silence has passed. The default is 5 seconds.";
    timeoutAttr.required = false;
    timeoutAttr.dataType = DataType.number;
    timeoutAttr.defaultValue = 5;

    // variable
    var variableAttr = new Attribute("variable");
    Logic.Voice.Voicemail.attributes.push(variableAttr);
    variableAttr.friendlyName.en = "Variable";
    variableAttr.description.en = "Recordingn will be saved into this variable as a URL.";
    variableAttr.required = true;
    variableAttr.dataType = DataType.string;

    // category
    var categoryAttr = new Attribute("category");
    Logic.Voice.Voicemail.attributes.push(categoryAttr);
    categoryAttr.friendlyName.en = "Category";
    categoryAttr.description.en = "Variable will be saved under this category.";
    categoryAttr.required = false;
    categoryAttr.dataType = DataType.string;
    categoryAttr.defaultValue = "default";

}

// Comment
{
    Logic.Voice.Comment.friendlyName.en = "Comment";
    Logic.Voice.Comment.description.en = "Comment that will not be executed. Its only usefull to explain the functionality of your tree.";

    // text
    var textAttr = new Attribute("text");
    Logic.Voice.Comment.attributes.push(textAttr);
    textAttr.friendlyName.en = "Text";
    textAttr.description.en = "The description of your comment.";
    textAttr.required = false;
    textAttr.dataType = DataType.string;

}

// Participant
{
    Logic.Voice.Participant.friendlyName.en = "Participant";
    Logic.Voice.Participant.description.en = "Joins a participant to a conference.";

    // number
    var numberAttr = new Attribute("number");
    Logic.Voice.Participant.attributes.push(numberAttr);
    numberAttr.friendlyName.en = "Phone Number";
    numberAttr.description.en = "The phone number of the participant that we plan on joining to the conference.";
    numberAttr.required = true;
    numberAttr.dataType = DataType.string;

}


Logic.Sms = {
    Logic: new NodeElement("Logic", false),
    Say: new NodeElement("Say", false),
    WaitForReply: new NodeElement("WaitForReply", false),
    Sms: new NodeElement("Sms", false),
    Goto: new NodeElement("Goto", false),
    Label: new NodeElement("Label", false),
    Function: new NodeElement("Function", false),
    Execute: new NodeElement("Execute", false),
    SetVariable: new NodeElement("SetVariable", false),
    ClearVariable: new NodeElement("ClearVariable", false),
    If: new NodeElement("If", false),
    Post: new NodeElement("Post", false),
    Comment: new NodeElement("Comment", false),
    End: new NodeElement("End", false)
}


// Logic
{
    // Version
    var VersionAttr = new Attribute("Version");
    Logic.Sms.Logic.attributes.push(VersionAttr);
    VersionAttr.required = false;
    VersionAttr.dataType = DataType.string;

    // Children
    Logic.Sms.Logic.children = [Logic.Sms.Say, Logic.Sms.WaitForReply, Logic.Sms.Sms, Logic.Sms.Goto, Logic.Sms.Label, Logic.Sms.Function, Logic.Sms.Execute, Logic.Sms.SetVariable, Logic.Sms.ClearVariable, Logic.Sms.If, Logic.Sms.Post, Logic.Sms.Comment, Logic.Sms.End];
}

// Say
{
    Logic.Sms.Say.friendlyName.en = "Say";
    Logic.Sms.Say.description.en = "Replies to a sms.";

    // text
    var textAttr = new Attribute("text");
    Logic.Sms.Say.attributes.push(textAttr);
    textAttr.friendlyName.en = "Text";
    textAttr.description.en = "Message to send.";
    textAttr.required = false;
    textAttr.dataType = DataType.string;

}

// WaitForReply
{
    Logic.Sms.WaitForReply.friendlyName.en = "Wait for reply";

    // variable
    var variableAttr = new Attribute("variable");
    Logic.Sms.WaitForReply.attributes.push(variableAttr);
    variableAttr.friendlyName.en = "Variable";
    variableAttr.description.en = "The reply will be saved under this variable.";
    variableAttr.required = false;
    variableAttr.dataType = DataType.string;
    variableAttr.defaultValue = "reply";

    // category
    var categoryAttr = new Attribute("category");
    Logic.Sms.WaitForReply.attributes.push(categoryAttr);
    categoryAttr.friendlyName.en = "Category";
    categoryAttr.description.en = "The category where the variable belongs to.";
    categoryAttr.required = false;
    categoryAttr.dataType = DataType.string;
    categoryAttr.defaultValue = "default";

}

// Sms
{
    Logic.Sms.Sms.friendlyName.en = "Sms";
    Logic.Sms.Sms.description.en = "Sends a SMS.";

    // body
    var bodyAttr = new Attribute("body");
    Logic.Sms.Sms.attributes.push(bodyAttr);
    bodyAttr.friendlyName.en = "Body";
    bodyAttr.description.en = "The body of the sms.";
    bodyAttr.required = false;
    bodyAttr.dataType = DataType.string;

    // to
    var toAttr = new Attribute("to");
    Logic.Sms.Sms.attributes.push(toAttr);
    toAttr.friendlyName.en = "Phone Number";
    toAttr.description.en = "Phone number where we will send the sms.";
    toAttr.required = false;
    toAttr.dataType = DataType.string;

}

// Goto
{
    Logic.Sms.Goto.friendlyName.en = "Goto";
    Logic.Sms.Goto.description.en = "Jumps to a spesific label. A label is a spesific section of your tree. For example you may want to redirect a caller to the 'Support' section of your tree.";

    // labelId
    var labelIdAttr = new Attribute("labelId");
    Logic.Sms.Goto.attributes.push(labelIdAttr);
    labelIdAttr.friendlyName.en = "Label ID";
    labelIdAttr.description.en = "The id of the label you want to point to.";
    labelIdAttr.required = true;
    labelIdAttr.dataType = DataType.string;

}

// Label
{
    Logic.Sms.Label.friendlyName.en = "Label";
    Logic.Sms.Label.description.en = "Thanks to this attribute, it is possible to redirect callers to different sections of your tree. For example you may want to redirect a caller to the 'Support' section of your tree.";

    // id
    var idAttr = new Attribute("id");
    Logic.Sms.Label.attributes.push(idAttr);
    idAttr.friendlyName.en = "ID";
    idAttr.description.en = "The id of this label. Use the Goto statement to point to this label.";
    idAttr.required = true;
    idAttr.dataType = DataType.string;

    // isLink
    var isLinkAttr = new Attribute("isLink");
    Logic.Sms.Label.attributes.push(isLinkAttr);
    isLinkAttr.friendlyName.en = "Is Link";
    isLinkAttr.required = false;
    isLinkAttr.dataType = DataType.bool;

}

// Function
{
    Logic.Sms.Function.friendlyName.en = "Function";
    Logic.Sms.Function.description.en = "Use this if you have duplicate functionality.";
    Logic.Sms.Function.video = "http://impactmade.com";

    // name
    var nameAttr = new Attribute("name");
    Logic.Sms.Function.attributes.push(nameAttr);
    nameAttr.friendlyName.en = "Name";
    nameAttr.description.en = "The name of the function.";
    nameAttr.required = true;
    nameAttr.dataType = DataType.string;

    // Children
    Logic.Sms.Function.children = [Logic.Sms.Say, Logic.Sms.WaitForReply, Logic.Sms.Sms, Logic.Sms.Goto, Logic.Sms.Label, Logic.Sms.Function, Logic.Sms.Execute, Logic.Sms.SetVariable, Logic.Sms.ClearVariable, Logic.Sms.If, Logic.Sms.Post, Logic.Sms.Comment, Logic.Sms.End];
}

// Execute
{
    Logic.Sms.Execute.friendlyName.en = "Execute";
    Logic.Sms.Execute.description.en = "Executes a function. This is usefull in order to avoid repeating yourself.";

    // function
    var functionAttr = new Attribute("function");
    Logic.Sms.Execute.attributes.push(functionAttr);
    functionAttr.friendlyName.en = "Function";
    functionAttr.description.en = "The name of the function to execute.";
    functionAttr.required = true;
    functionAttr.dataType = DataType.string;

}

// SetVariable
{
    Logic.Sms.SetVariable.friendlyName.en = "Set the value of a variable.";
    Logic.Sms.SetVariable.description.en = "Creates or updates a variable.";

    // name
    var nameAttr = new Attribute("name");
    Logic.Sms.SetVariable.attributes.push(nameAttr);
    nameAttr.friendlyName.en = "Name";
    nameAttr.description.en = "The name of the Keyword. For example 'ZipCode'.";
    nameAttr.required = true;
    nameAttr.dataType = DataType.string;

    // value
    var valueAttr = new Attribute("value");
    Logic.Sms.SetVariable.attributes.push(valueAttr);
    valueAttr.friendlyName.en = "Value";
    valueAttr.description.en = "The value you wish to asign to the variable.";
    valueAttr.required = false;
    valueAttr.dataType = DataType.string;

}

// ClearVariable
{
    Logic.Sms.ClearVariable.friendlyName.en = "Clear Variable";
    Logic.Sms.ClearVariable.description.en = "Deletes a variable.";

    // name
    var nameAttr = new Attribute("name");
    Logic.Sms.ClearVariable.attributes.push(nameAttr);
    nameAttr.friendlyName.en = "Name";
    nameAttr.description.en = "The name of the variable to delete.";
    nameAttr.required = true;
    nameAttr.dataType = DataType.string;

    // category
    var categoryAttr = new Attribute("category");
    Logic.Sms.ClearVariable.attributes.push(categoryAttr);
    categoryAttr.friendlyName.en = "Category";
    categoryAttr.description.en = "To what category will this variable belong? This is usefull when you have multiple departments.";
    categoryAttr.required = false;
    categoryAttr.dataType = DataType.string;
    categoryAttr.defaultValue = "default";

}

// If
{
    Logic.Sms.If.friendlyName.en = "If";
    Logic.Sms.If.description.en = "Uses variables to determine if logic should be executed.";

    // variable
    var variableAttr = new Attribute("variable");
    Logic.Sms.If.attributes.push(variableAttr);
    variableAttr.friendlyName.en = "Keyword";
    variableAttr.description.en = "The name of the variable. For example ZipCode.";
    variableAttr.required = false;
    variableAttr.dataType = DataType.string;
    variableAttr.defaultValue = "Digits";

    // category
    var categoryAttr = new Attribute("category");
    Logic.Sms.If.attributes.push(categoryAttr);
    categoryAttr.friendlyName.en = "Category";
    categoryAttr.description.en = "The category where the variable belongs.";
    categoryAttr.required = false;
    categoryAttr.dataType = DataType.string;
    categoryAttr.defaultValue = "default";

    // condition
    var conditionAttr = new Attribute("condition");
    Logic.Sms.If.attributes.push(conditionAttr);
    conditionAttr.friendlyName.en = "Condition.";
    conditionAttr.required = false;
    conditionAttr.options = ["equals", "contains", "hasValue", "hasNoValue", "isLessThan", "isGreaterThan", "regex"];
    conditionAttr.defaultValue = "contains";

    // value
    var valueAttr = new Attribute("value");
    Logic.Sms.If.attributes.push(valueAttr);
    valueAttr.friendlyName.en = "Value";
    valueAttr.description.en = "Value to test against. For example you may want to test if the variable LastFourDigitsSocial is equal to 1234.";
    valueAttr.required = false;
    valueAttr.dataType = DataType.string;

    // Children
    Logic.Sms.If.children = [Logic.Sms.Say, Logic.Sms.WaitForReply, Logic.Sms.Sms, Logic.Sms.Goto, Logic.Sms.Label, Logic.Sms.Function, Logic.Sms.Execute, Logic.Sms.SetVariable, Logic.Sms.ClearVariable, Logic.Sms.If, Logic.Sms.Post, Logic.Sms.Comment, Logic.Sms.End];
}

// Post
{
    Logic.Sms.Post.friendlyName.en = "HTTP Post Request";
    Logic.Sms.Post.friendlyName.es = "HTTP Post";
    Logic.Sms.Post.description.en = "Sends a HTTP Post request to the url that you spesify. The request will contain all the variables that are associated with a spesific phone number.";

    // url
    var urlAttr = new Attribute("url");
    Logic.Sms.Post.attributes.push(urlAttr);
    urlAttr.friendlyName.en = "Url";
    urlAttr.description.en = "The url where Impact Made will post the variables.";
    urlAttr.required = true;
    urlAttr.dataType = DataType.string;

    // fallBackUrl
    var fallBackUrlAttr = new Attribute("fallBackUrl");
    Logic.Sms.Post.attributes.push(fallBackUrlAttr);
    fallBackUrlAttr.friendlyName.en = "Fall Back Url";
    fallBackUrlAttr.description.en = "If first POST request fails then Impact Made will make a second request to the this url.";
    fallBackUrlAttr.required = false;
    fallBackUrlAttr.dataType = DataType.string;
}

// Comment
{
    Logic.Sms.Comment.friendlyName.en = "Comment";
    Logic.Sms.Comment.description.en = "Comment that will not be executed. Its only usefull to explain the functionality of your tree.";

    // text
    var textAttr = new Attribute("text");
    Logic.Sms.Comment.attributes.push(textAttr);
    textAttr.friendlyName.en = "Text";
    textAttr.description.en = "The description of your comment.";
    textAttr.required = false;
    textAttr.dataType = DataType.string;
}

// End
{
    Logic.Sms.End.friendlyName.en = "End";
    Logic.Sms.End.description.en = "Ends the conversation.";
}


