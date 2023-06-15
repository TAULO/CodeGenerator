import rndStr from "../GenerateJSON/RandomData.js";
import {
    v4
} from "uuid";

function generateFields(amount) {
    const fields = []
    for (let i = 0; i < amount; i++) {
        fields.push({
            "id": v4(),
            "descriptive": {
                // "id": "test1",
                "name": rndStr(),
                "application": rndStr(),
                "actions": [
                    rndStr(),
                    rndStr()
                ],
                "image": rndStr(),
                "offset": {},
                "path": rndStr(),
                "variablename": rndStr(),
                "version": rndStr()
            }
        })
    }
    return {
        "batch": {
            "field": fields
        }
    }
}

export default generateFields