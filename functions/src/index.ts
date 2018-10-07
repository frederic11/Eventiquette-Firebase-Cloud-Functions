import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

const db = admin.firestore();
db.settings({timestampsInSnapshots: true});

const EVENTS_COLLECTION_FULL_DETAILS : string = "eventsCollectionFullDetails";
const EVENTS_COLLECTION_BRIEF_DETAILS : string = "eventsCollectionBriefDetails";

export const onEventSubmitted = 
functions.firestore
    .document(EVENTS_COLLECTION_FULL_DETAILS + '/{eventId}')
    .onCreate((snap, context) => {
      // Get an object representing the document
      const newValue = snap.data();

      //this is to ensure that date is still compatible with Firestore
      const timestamp = snap.get('startDateTime');
      const startDateTime = timestamp.toDate();

      //create a brief Event Object Template
      interface MyEventInterface {
        eventId : string,
        title   : string,
        shortDescription : string,
        type : string,
        actualNumberOfAttendees : number,
        startDateTime : Date, 
        locationLatitude : number,
        locationLongitude: number,
        thumbnailUrl : string,
        source : string,
        approved : boolean,
        rejected : boolean
    }

      //create a brief Event Object
      const event : MyEventInterface = {
            eventId : snap.id,
            title   : newValue.title,
            shortDescription : newValue.shortDescription,
            type : newValue.type,
            actualNumberOfAttendees : newValue.actualNumberOfAttendees,
            startDateTime : startDateTime, 
            locationLatitude : newValue.locationLatitude,
            locationLongitude: newValue.locationLongitude,
            thumbnailUrl : newValue.thumbnailUrl,
            source : newValue.source,
            approved : newValue.approved,
            rejected : newValue.rejected
      }

      // perform desired operations ...
      return db.collection(EVENTS_COLLECTION_BRIEF_DETAILS).doc(event.eventId).set(event);
    });