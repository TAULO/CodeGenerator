import rndStr from "../GenerateJSON/RandomData.js";
import {
    v4
} from "uuid";

function generateApps(amount) {
    const apps = []
    for (let i = 0; i < amount; i++) {
        apps.push({
            "id": v4(),
            "name": rndStr(),
            "descriptive": {
                "name": rndStr(),
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
        })
    }
    return {
        "batch": {
            "application": apps
        }
    }
}

export default generateApps