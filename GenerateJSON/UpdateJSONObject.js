import rndStr from "./RandomData.js"

function updateFlowObject(id, name, code) {
    return {
        "id": id,
        "name": name,
        "descriptive": {
            "id": rndStr(),
            "name": rndStr(),
            "inputs": [rndStr(), rndStr()],
            "outputs": [rndStr(), rndStr()],
            "application": rndStr(),
            "code": code,
            "blocklyXml": rndStr(),
            "type": rndStr(),
            "typeConfig": {
                "subjectPrefix": rndStr(),
                "triggers": {
                    "context": [rndStr(), rndStr()],
                    "external": [{
                        "configuration": {
                            "keys": [rndStr()],
                            "modifiers": [rndStr(), rndStr()]
                        },
                        "externalType": rndStr()
                    }],
                    "lifecycle": [rndStr(), rndStr()],
                    "services": [rndStr(), rndStr()]
                }
            },
            "anchors": [rndStr(), rndStr()],
            "usesfields": [rndStr(), rndStr()],
            "usesFlows": [rndStr(), rndStr()],
            "usesTables": [rndStr(), rndStr()],
            "compatibleVersion": rndStr(),
            "hideFromUser": false,
            "precompile": false,
            "restoreFocus": false,
            "isMandatory": false,
            "autocompleteSnippets": false,
            "autocompleteTypes": false,
            "debuggerEnabled": false,
            "hideInFlowLaunchMenu": false,
            "icon": rndStr(),
            "version": rndStr()
        }
    }
}

function updateAppObject(id, name) {
    return {
        "id": id,
        "name": name,
        "descriptive": {
            "appVersion": rndStr(),
            "executablepathcontains": rndStr(),
            "framecontains": rndStr(),
            "icon": rndStr(),
            "jvmlocation": rndStr(),
            "launchwith": rndStr(),
            "manufacturer": rndStr(),
            "md5": rndStr(),
            "openIn": rndStr(),
            "processcontains": rndStr(),
            "titlebarcontains": rndStr(),
            "type": rndStr(),
            "urlcontains": rndStr(),
            "version": rndStr()
        }
    }
}

function updateFieldObject(id, name) {
    return {
        "id": id,
        "name": name,
        "descriptive": {
            "id": rndStr(),
            "name": rndStr(),
            "actions": [rndStr(), rndStr()],
            "application": rndStr(),
            "image": rndStr(),
            "offset": {"offset":  rndStr()},
            "path": rndStr(),
            "variablename": rndStr(),
            "version": rndStr()
        }
    }
}

function updateTableObject(id, name) {
    return {
        "id": id,
        "name": name,
        "descriptive": {
            "csv": "\"group\",\"description\",\"function\",\"msg\"\r\n\"Dankost\",\"Dankost bruger skal være i AD\",\"if(hasDankostUser(value)){ value.dankostdata[\"\"sAMAccountName\"\"]==value.addata[\"\"sAMAccountName\"\"]} else true\",\"'Dankost bruger '+value.dankostdata[\"\"sAMAccountName\"\"]+' findes ikke i AD'\"\r\n\"Dankost\",\"Dankost brugere skal være i lønsystemet\",\"if(hasDankostUser(value)){value.addata[\"\"RSDCPRnr\"\"]==removeDash(value.londata[\"\"CPR-nummer\"\"])}else true\",\"'Dankost bruger med cpr:'+value.addata[\"\"RSDCPRnr\"\"]+' findes ikke i løn systemet ' \"\r\n\"Auditbase\",\"Auditbase brugere skal have samme navn som i AD\",\"if(hasAuditbaseUser(value) && hasAdUser(value)){value.auditbasedata[\"\"NAME\"\"]==value.addata[\"\"name\"\"]} else true\",\"'Auditbase bruger ' +value.auditbasedata[\"\"NAME\"\"]+ ' hedder ' + value.addata[\"\"name\"\"] +' i AD' \"\r\n\"Auditbase\",\"Auditbase brugere fra SHS skal være i AD\",\"if(hasAuditbaseUser(value) && value.auditbasedata[\"\"LOCATION\"\"]=='SHS'){ value.auditbasedata[\"\"LOGIN\"\"]==value.addata[\"\"sAMAccountName\"\"]} else true\",\"'Auditbase bruger '+value.auditbasedata[\"\"LOGIN\"\"]+' fra SHS findes ikke i AD'\"\r\n\"Auditbase\",\"Auditbase brugere skal have samme title som i AD\",\"if(hasAuditbaseUser(value) && hasAdUser(value)){mapADTitleToAuditbaseTitle(value.addata[\"\"title\"\"])==value.auditbasedata[\"\"TITLE\"\"]}else true\",\"'Auditbase bruger er ' +value.auditbasedata[\"\"TITLE\"\"]+ ' i Auditbase. Det var forventet at denne var '+ mapADTitleToAuditbaseTitle(value.addata[\"\"title\"\"])+''\"\r\n\"Auditbase\",\"Auditbase brugere skal have samme lokation som i AD\",\"if(hasAdUser(value) && hasAuditbaseUser(value) && value.addata[\"\"department\"\"]!==\"\"\"\"){value.auditbasedata[\"\"LOCATION\"\"]==mapADDepartmentToAuditbaseLocation(value.addata[\"\"department\"\"])}else true\",\"'Auditbase bruger er på lokation ' +value.auditbasedata[\"\"LOCATION\"\"]+ ' i Auditbase. Det var forventet at denne skulle være på '+mapADDepartmentToAuditbaseLocation(value.addata[\"\"department\"\"])\"\r\n\"AD\",\"AD brugere skal være i lønsystemet\",\"if(hasAdUser(value)){value.addata[\"\"RSDCPRnr\"\"]==removeDash(value.londata[\"\"CPR-nummer\"\"])}else true\",\"'AD bruger med cpr:'+value.addata[\"\"RSDCPRnr\"\"]+' findes ikke i løn systemet ' \"\r\n\"AD\",\"AD brugere skal have været aktiv inden for de sidste 90 dage\",\"if(hasAdUser(value)){ daysSince(value.addata[\"\"LastLogonDate\"\"]) < 90}else true\",\"'AD bruger har ikke været aktiv inden for de sidste 90 dage. Sidste logon var '+value.addata[\"\"LastLogonDate\"\"] + ' hvilket er ' + daysSince(value.addata[\"\"LastLogonDate\"\"]) + ' dage siden'\"\r\n\"AD\",\"Der må kun være en AD bruger pr. personnel i lønsystemet\",\"value.addata2[\"\"sAMAccountName\"\"]==''\",\"'AD bruger med cpr:'+value.addata[\"\"RSDCPRnr\"\"]+' har to AD brugere : '+ value.addata[\"\"sAMAccountName\"\"] +' og ' + value.addata2[\"\"sAMAccountName\"\"]\"\r\n\"AD\",\"AD brugere skal have samme navn som i lønsystemet\",\"if(hasAdUser(value) && hasLonUser(value)){value.addata[\"\"name\"\"]==value.londata[\"\"Navn (for-/efternavn)\"\"]} else true\",\"'AD bruger ' +value.addata[\"\"name\"\"]+ ' hedder ' + value.londata[\"\"Navn (for-/efternavn)\"\"] +' i løn systemet ' \"\r\n\"AD\",\"AD brugere skal have samme for- og efternavn som i lønsystemet\",\"if(hasAdUser(value) && hasLonUser(value)){sammeForogEfternavn(value.addata[\"\"name\"\"],value.londata[\"\"Navn (for-/efternavn)\"\"])} else true\",\"'AD bruger ' +value.addata[\"\"name\"\"]+ ' hedder ' + value.londata[\"\"Navn (for-/efternavn)\"\"] +' i løn systemet ' \"\r\n\"AD\",\"AD brugere skal have samme title som i lønsystemet\",\"if(hasAdUser(value) && hasLonUser(value)){value.addata[\"\"title\"\"]==mapLonStillingToAdTitle(value.londata[\"\"Stilling\"\"])} else true\",\"'AD bruger er ' +value.addata[\"\"title\"\"]+ ' i AD og har stilling ' + value.londata[\"\"Stilling\"\"] +' i løn systemet der mapper til '+mapLonStillingToAdTitle(value.londata[\"\"Stilling\"\"])\"\r\n\"AD\",\"AD brugere skal have en department eller division\",\"if(hasAdUser(value)){value.addata[\"\"department\"\"]!==\"\"\"\" || value.addata[\"\"division\"\"]!==\"\"\"\"}else true\",\"'AD bruger har ingen organisation (department eller division) i AD' \"\r\n\"AD\",\"AD brugere der har en department skal have samme organisation som i lønsystemet\",\"if(hasAdUser(value) && hasLonUser(value) && value.addata[\"\"department\"\"]!==\"\"\"\"){value.addata[\"\"department\"\"]==mapLonAfdToADDepartment(value.londata[\"\"Afdelings-niveau\"\"])}else true\",\"'AD bruger er på department ' +value.addata[\"\"department\"\"]+ ' i AD og på Afdelings-niveau '+ value.londata[\"\"Afdelings-niveau\"\"] +' i løn systemet der mapper til '+mapLonAfdToADDepartment(value.londata[\"\"Afdelings-niveau\"\"]) \"\r\n\"AD\",\"AD brugere der har en division skal have samme organisation som i lønsystemet\",\"if(hasAdUser(value) && hasLonUser(value) && value.addata[\"\"division\"\"]!==\"\"\"\"){value.addata[\"\"division\"\"]==mapLonAfdToADDivision(value.londata[\"\"Afdelings-niveau\"\"])}else true\",\"'AD bruger er på division ' +value.addata[\"\"division\"\"]+ ' i AD og på Afdelings-niveau '+ value.londata[\"\"Afdelings-niveau\"\"] +' i løn systemet der mapper til '+mapLonAfdToADDivision(value.londata[\"\"Afdelings-niveau\"\"]) \"\r\n\"Cetrea\",\"Cetrea brugere skal være i AD\",\"if(hasCetreaUser(value)){ value.cetreadata[\"\"Brugernavn\"\"]==value.addata[\"\"sAMAccountName\"\"]} else true\",\"'Cetrea bruger '+value.cetreadata[\"\"Brugernavn\"\"]+' findes ikke i AD'\"\r\n\"Cetrea\",\"Cetrea brugere skal have samme navn som i AD\",\"if(hasCetreaUser(value) && hasAdUser(value)){value.cetreadata[\"\"Navn\"\"]==value.addata[\"\"name\"\"]} else true\",\"'Cetrea bruger ' +value.cetreadata[\"\"Navn\"\"]+ ' hedder ' + value.addata[\"\"name\"\"] +' i AD' \"\r\n\"Cetrea\",\"Cetrea brugere skal have samme profession som i AD\",\"if(hasCetreaUser(value) && hasAdUser(value)){mapCetreaProfessionToADTitle(value.cetreadata[\"\"Profession\"\"])==value.addata[\"\"title\"\"]}else true\",\"'Cetrea bruger er ' +value.cetreadata[\"\"Profession\"\"]+ ' i Cetrea. Det var forventet at denne var '+ mapCetreaProfessionToADTitle(value.cetreadata[\"\"Profession\"\"])+' i AD, men er ' + value.addata[\"\"title\"\"] +'' \"\r\n\"Cetrea\",\"Cetrea brugere skal have samme primære organisation som i AD\",\"if(hasAdUser(value) && hasCetreaUser(value) && value.addata[\"\"department\"\"]!==\"\"\"\"){value.cetreadata[\"\"PrimærOrganisation\"\"]==mapADDepartmentToCetreaOrg(value.addata[\"\"department\"\"])}else true\",\"'Cetrea bruger er på PrimærOrganisation ' +value.cetreadata[\"\"PrimærOrganisation\"\"]+ ' i Cetrea og har AD department '+value.addata[\"\"department\"\"]+ ' i AD systemet der mapper til '+mapADDepartmentToCetreaOrg(value.addata[\"\"department\"\"])\"\r\n\"Cetrea\",\"Cetrea brugere skal have de rigtige rettigheder\",\"if(hasCetreaUser(value)){validateExpectedCetreaOrgs(value.cetreadata[\"\"Profession\"\"],value.cetreadata[\"\"PrimærOrganisation\"\"],value.cetreadata[\"\"Organisationer\"\"])}else true\",\"'Cetrea bruger har ikke de forventede adgange. Tildelte adgange er: ' +value.cetreadata[\"\"Organisationer\"\"]+ '. De forventede adgange var: '+getExpectedCetreaOrgs(value.cetreadata[\"\"Profession\"\"],value.cetreadata[\"\"PrimærOrganisation\"\"])+''\"",
            "name": name
        }
    }
}

export { updateAppObject, updateFieldObject, updateFlowObject, updateTableObject }
