import axios  from "axios";

axios.post("https://localhost.sirenia.io:8000/v1/provideBatch", {
    batch: {
        "application": {
            "id": "appID 0",
            "name": "appName 0",
            "descriptive": {
                "appVersion": "",
                "executablepathcontains": "",
                "framecontains": "",
                "icon": "",
                "jvmlocation": "",
                "launchwith": "",
                "manufacturer": "",
                "md5": "",
                "openIn": "",
                "processcontains": "",
                "titlebarcontains": "",
                "type": "",
                "urlcontains": "",
                "version": ""
            }
        }
    }
})