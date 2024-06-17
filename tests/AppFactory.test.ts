import { assert, createMockedFunction, clearStore, test, newMockEvent, newMockCall, countEntities, mockIpfsFile, beforeAll, describe, afterEach, afterAll, mockInBlockStore, clearInBlockStore, logStore, logDataSources } from "matchstick-as/assembly/index"
import { Param, ParamType, createApp, newEvent } from "./utils";
import { TEST_APPSTATS_ENTITY_TYPE, TEST_APP_ENTITY_TYPE, TEST_APP_ID, TEST_APP_NAME, TEST_STATS_ENTITY_TYPE, TEST_USER_ENTITY_TYPE, TEST_USER_ID } from "./fixtures";

describe("AppFactory tests", () => {
    afterEach(() => {
      clearStore()
    })
    
    test("Create app", () => {
        createApp();

        // assert.fieldEquals(TEST_APP_ENTITY_TYPE, TEST_APP_ID, "id", TEST_APP_ID);
    })

});