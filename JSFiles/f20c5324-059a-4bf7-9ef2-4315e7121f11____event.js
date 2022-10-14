import { 
    UPDATE_EVENTS_TABLE,
    ADD_NEW_EVENTS,
    SET_NO_MORE_DATA, 
    RESET_RECORD,
    SET_SELECTED_EVENT,
    SET_ALL_SELECTED,
    SET_LOADING_FLAG
} from "../reducers/event";
import _ from "lodash";
import { fetchEvents } from "../../services/event";
import { SET_UNAUTH_ALERT_ON_PAGE } from "store/reducers/loggedIn";

export function updateEventsTable(rows = []) {
    return {
        type: UPDATE_EVENTS_TABLE,
        rows,
    };
}

export const clearRecords = () => (dispatch) => {
    dispatch({
        type: RESET_RECORD,
        data: []
    });
};

export const setSelected = (data) => (dispatch) => {
    dispatch({
        type: SET_SELECTED_EVENT,
        data
    });
};

export const setAllSelected = (flag) => dispatch => {
    dispatch({
        type: SET_ALL_SELECTED,
        data: flag
    });
};

export const loadEvents = obj => async dispatch => {
    try {
        dispatch({
            type: SET_LOADING_FLAG,
            data: true
        });
        const queryObj = {
            offset: (obj.page-1),
            limit: obj.limit,
            search_str: obj.text,
            startDate: obj.startDate,
            endDate: obj.endDate,
            sortType: obj.sortType,
            sortKey: obj.sortKey
        };
        const items = await fetchEvents(queryObj);
        dispatch({
            type: ADD_NEW_EVENTS,
            data: items
        });
        if(items.length === 0) {
            dispatch({
                type: SET_NO_MORE_DATA
            });
        }
    } catch (e) {
        if(e.className === "not-authenticated") {
            dispatch({
                type: SET_UNAUTH_ALERT_ON_PAGE
            });
        }
        dispatch({
            type: SET_NO_MORE_DATA
        });
        dispatch({
            type: ADD_NEW_EVENTS,
            data: []
        });
        console.log(e);
    }
};

export const setEvents = (obj) => (dispatch) => {
    try {
        const newEvents = [...events];
        let items = [...newEvents];

        if(obj.sortKey) {
            items = _.orderBy(items, obj.sortKey, obj.sortType);
        }
    
        const startIndex =  ((obj.page-1)*obj.limit);
        const endIndex = ((obj.page)*obj.limit);
        if(obj.text) {
            items = items.filter((data) => {
                return data.event_id.toLocaleLowerCase().includes(obj.text.toLocaleLowerCase())
                    || data.page_url.toLocaleLowerCase().includes(obj.text.toLocaleLowerCase())
                    || data.se_category.toLocaleLowerCase().includes(obj.text.toLocaleLowerCase())
                    || data.se_action.toLocaleLowerCase().includes(obj.text.toLocaleLowerCase())
                    || data.se_property.toLocaleLowerCase().includes(obj.text.toLocaleLowerCase())
                    || data.se_label.toLocaleLowerCase().includes(obj.text.toLocaleLowerCase());
    
            });
            const result = items.slice(startIndex,endIndex);
            
            if(result.length === 0) {
                dispatch({type: SET_NO_MORE_DATA});
            }
            dispatch({
                type: ADD_NEW_EVENTS,
                data: result
            });
        } else {
            const result = items.slice(startIndex,endIndex);
            
            if(result.length === 0) {
                dispatch({type: SET_NO_MORE_DATA});
            }
            dispatch({
                type: ADD_NEW_EVENTS,
                data: result
            });
        }
        
    } catch (e) {
        console.log(e);
    }
};



const events = [
    {
        "event_id": "c3cf993c-9e4c-42df-ab2d-1c32f63cbb9f",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:16.641Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "db4e9f17-564e-489d-bb43-8ceefec5ef29",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:16.642Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "5f166164-d995-4267-81b4-8c751e88ddf7",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:16.642Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "ffd3af0e-c650-44e2-84fe-2edc67d9b2f4",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:16.695Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "47b7476c-5f4a-43b3-af12-da77da96b06e",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:16.737Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "940931cb-fc28-497c-a988-477cc541fc9b",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:16.887Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "1388526a-aa4d-4706-9b11-6fd456871447",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:17.086Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "91bbc21a-5f27-4f7b-8dab-6687f4b5987f",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:17.390Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "c4908228-29f8-411a-a63f-9814e603d844",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:17.488Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "60a390d0-63d0-4389-bc2c-1ccd9bf98713",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:17.536Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "92036062-af67-4a80-a016-543ded8f9e3e",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:17.638Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "0bca8e2e-dcc6-458b-816c-b45e4908abe8",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.641Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "33d30eb6-de0a-4b3c-8120-efb438143449",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.776Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "8d511d72-225f-4b45-95b2-729106768663",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.778Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "b6803694-99c2-4b4c-8b33-1cd60cec354c",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.785Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "bfe793c9-4f79-487f-938d-21cbfe671c67",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.786Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "6718caa8-bae2-4559-8b8d-8869421c5fff",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.787Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "04f2f822-d1ba-4f27-bb26-a8e81c100b73",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.787Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "a4e7717d-3261-410e-a4d9-f89a2fb35974",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.788Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "7760002c-05a8-4514-b7f1-49d16fb12e90",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.789Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "fffa9daf-8c40-4cc1-84f2-77f497f26910",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.790Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "c8c573c4-b1a2-4d05-9c41-5a4d1d4dc0fd",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.791Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "c7cc25f6-b46f-4b3a-9890-f4c458acc78e",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.837Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "c71a3b4b-6403-4310-8382-7b945e604c81",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.943Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "5cbd5fd5-06a5-43ee-a2b3-f6173f383e4f",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.984Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "6d924367-c870-4282-8581-3cccb89d4272",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:19.037Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "ce20ee9a-de0a-4ff3-9bae-0f6d3701c974",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:19.086Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "7bb8b182-ac2a-4ccd-aba7-6158e3787324",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:19.138Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "c6638747-b90c-4350-a8c9-7e1eee938566",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:19.186Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "11630682-688e-414a-9333-6ff3f5d97779",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:19.237Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "e37a54ef-873c-4daa-b558-c991b20533db",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:19.335Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "dbcbb9af-2ab0-47c1-8acc-94ee1aef451d",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:16.785Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "bd134bbf-a227-4fb4-b3ea-28ae0e267a10",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:16.834Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "9aefce0c-fcbe-4e9e-b20c-28fcff7c6f14",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:16.936Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "32d13a5f-c2d8-448d-9bdf-5f23f95ff12b",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:16.987Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "e0e7d374-5d97-4d63-836e-d31ca302143f",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:17.036Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "88e60b53-3f8e-4e1d-bbd7-ef3fea0ade1d",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:17.136Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "768293fe-c9c0-4010-a896-467637179368",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:17.185Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "8d126bd9-917e-4770-a9e8-6e0bf3bb975b",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:17.237Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "b1f3c5a3-0834-4ab2-a6b4-7e4474afdce3",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:17.286Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "b3cfa03c-a9a0-45aa-8ef4-ded4b451a1e2",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:17.337Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "81be2ea0-5450-4564-b76c-d27be0ea7316",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:17.438Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "d1182ba7-1ecd-485c-b368-8e38d12e1e8b",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:17.588Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "df2f7f43-5e05-4e73-919c-e305d9238e6d",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:17.687Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "c34ca744-6a66-4830-aa28-dcf625d88787",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.700Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "41180414-fec1-4219-93e5-28febd5c68fb",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.744Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "55c60b85-71ce-4575-a739-3866637d19e3",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.772Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "beda55c0-e1b5-44f4-b7bb-9409512129a9",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.773Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "f3d842d5-6005-4ae9-9ee9-8c903bb7883b",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.778Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "3f3b9067-9a52-496f-b741-161f97b621cb",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.781Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "aade6e9b-ce36-433c-90c5-da00fd79c95e",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.782Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "012c2ae7-916f-45b8-8e5d-5f78781917fd",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.782Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "d0667e45-2ae8-4eda-90b4-c68d0e920edd",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.785Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "477b54ab-2eed-4564-bb36-05cc87e1db9d",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.792Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "2b5e828d-3795-43b8-aa94-14a2aa5f194c",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.884Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "449c246f-553e-4d1e-ba62-0d7c70823c45",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:18.925Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "9c70bc8b-8c82-49e8-b7f2-b2680395ea14",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:19.286Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "b117ae23-0695-4933-8831-7f351ccefa3f",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:19.436Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "3870068b-1e04-4d83-9684-39956873ff21",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:19.536Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "72efe7e5-bb6e-4a6d-8625-1ddee5b528d5",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:19.636Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "6e6f26fb-d04a-452b-ba2a-4e3242d96353",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:19.740Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "c7c54be4-ff15-41a9-8d4c-94d6704957ec",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:19.784Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "d9948563-ee1b-4235-8d2d-ff144bc60543",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:19.985Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "9b1384ae-b135-470b-93d4-40359b5f9d17",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:20.089Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "9e3453a0-1654-448e-951b-aef37d22cc50",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:20.234Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "b4dc1fb2-e159-4cd2-8b1f-0ba4582cb946",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:20.284Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "88f47ba1-574a-4855-a824-e8c5f81769b8",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:20.337Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "e48e410d-26ca-4458-8f46-5a97ee9febfa",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:20.485Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "de98fb38-4823-433f-8188-77cc26d7f93c",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:20.586Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "cd41a9f3-c8e9-44a3-88b3-bff58722541f",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:20.640Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "52cbd2ac-c3c5-40af-8354-317276eacd47",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:20.736Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "c25613fa-3c07-450e-b7ba-7ed95ec0fa95",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:20.838Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "42a919f9-8c55-4a07-acb7-215f7c087d3d",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:20.890Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "03fdc27b-c3c6-4282-9e3e-7537744d7d12",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:20.940Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "aadc9eb6-49bf-44cd-9054-849fa344cdb9",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:21.037Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "766d2332-b763-42a3-8d5a-c01145e6d8df",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:21.085Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "5ea2d2e6-c422-452f-a149-af170402aa70",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:21.236Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "a0c3051a-7ad0-4f03-bcb7-c995bd6fff74",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:21.335Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "323ad287-361d-4b0a-859b-743aca570782",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:21.535Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "11c571a4-8170-458d-a48d-b620dd0e6718",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:21.636Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "2ca05c58-bf28-4cea-a946-9c4abf4f4011",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:21.891Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "3d64b9e3-97f9-44bc-b24b-59b3807603fa",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:22.034Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "8c5cf0ce-fc63-4faa-8bd6-eaa02f570bd4",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:22.136Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "d28b9788-70ce-4d56-b9dd-115f2709a0ae",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:22.186Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "5e9fd23a-23c1-491b-905b-0b5f99077558",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:22.238Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "5e8de5b5-bf8c-49a4-b33d-3fdb85c16502",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:22.287Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "85e60556-0d4f-4314-a199-5556bb106f09",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:22.337Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "8895010b-a1d6-4580-b7dc-c7767d1c5d01",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:22.435Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "111f146d-25c7-403c-8cbb-00e238462a3c",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:22.536Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "76c64297-3866-49b4-aa12-62363c7783f5",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:22.585Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "7f2e9d36-cdc4-49c4-ad72-b6b22055468c",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:22.636Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "37d55f2d-6c62-4d9f-b2a7-deeec820fddc",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:22.685Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "3659c18e-f69c-4b7a-8d40-33703cf1cad3",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:22.938Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "3bb43d43-69b7-42af-872b-f611e12cfa23",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:23.035Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "5bff61be-9044-4770-872b-dd155b860351",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:23.138Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "18f272f7-1fe8-43f1-a7c0-c0a8995c77f9",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:23.337Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "64251248-8403-4552-a7b6-adecc7089bab",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:23.385Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "22f1ccaa-eb2d-4556-b7a0-f9f23c7da357",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:23.484Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "1ee05bbf-d68d-418c-b76c-e659e6c2dda8",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:23.586Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    },
    {
        "event_id": "95d44dd5-2739-4d53-a72e-08f6c6f7740f",
        "page_url": "blahblha",
        "derived_tstamp": "2020-05-23T12:25:23.692Z",
        "user_id": "7e0ecc0a-f68f-4d79-8038-b436904476d2",
        "se_category": "Extension",
        "se_action": "Initialized",
        "se_property": "shep-dev",
        "se_label": "extension-js-1.21.0",
        "se_value": null,
        "useragent": null,
        "page_urlhost": null,
        "page_urlpath": "blahblha"
    }
];