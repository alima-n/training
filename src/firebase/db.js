import { db, storage } from './firebase';

export const doCreateUser = (id, username, email, avatar) =>
    db.ref(`users/${id}`).set({
        username,
        email,
        avatar,
    });

export const onceGetUsers = () =>
    db.ref('users').once('value');

export const onceGetBooking = () =>
    db.ref('booking').once('value');
    
export const onceGetTestimonials = () =>
    db.ref('testimonials').once('value');

export const isAdmin = (uid) => 
    db.ref(`admins/${uid}`).once('value');

export const doUpdateUserInfo = async (uid, field, value) => {
    const data = await db.ref(`users/${uid}`);

    return data.update({
		[field]: value
	})
}

export const doUpdateAvatar = async (uid, file) => {
    const data = db.ref(`users/${uid}`);
    const snapshot = await storage.ref(`${uid}/photoURL/`).put(file);
    const fileRef = await storage.refFromURL(storage.ref(snapshot.metadata.fullPath).toString());
    const url = await fileRef.getMetadata().then(metadata => metadata.downloadURLs[0])

    return data.update({
		avatar: url
	})
}

export const doAddSubscriber = (username, email, phone, uid) => {
    return db.ref(`subscribers`).push({
        username,
        email,
        phone,
        uid
	})
}

export const doAddListenerToRef = (ref, event, action) => 
	ref.on(event, () => 
		ref.once('value')
		.then(snapshot =>
			action(snapshot.val())
		)
    )

export const coursesRef = db.ref('courses').limitToLast(50);
export const usersRef = db.ref('users').limitToLast(50);
export const bookingRef = db.ref('booking').limitToLast(50);

export const doCreateEvent = (randomId, name, type, start, end, price, modules, description) => db.ref(`courses/${randomId}`).set({
    name, 
    type, 
    start, 
    end, 
    price, 
    modules,
    description
})

export const doGetUserInfo = (id, field) => 
    db.ref(`users/${id}/${field}`).once('value').then(snapshot => snapshot.val());

export const doGetCourseInfo = (id, field) => 
    db.ref(`courses/${id}/${field}`).once('value').then(snapshot => snapshot.val());

export const doCheckIfBookingExists = (courseId, uid) => 
    db.ref(`booking/${courseId}_${uid}/confirmed`).once('value').then(snapshot => snapshot.val());

export const doBookCourse = (courseId, uid) => 
    db.ref(`booking/${courseId}_${uid}`).set({
        confirmed: true,
        paid: false,
        date: +new Date(),
    })

export const doUpdateBooking = async (id, field, value) => {
    const data = await db.ref(`booking/${id}`);

    return data.update({
		[field]: value
	})
}


export const doRemoveBooking = (id) =>
    db.ref(`booking/${id}`).remove();

export const doRemoveUser = (uid) => {
    db.ref(`users/${uid}`).remove();

    onceGetBooking().then(snapshot => {
        const bookingToRemove = Object.keys(snapshot.val()).filter(key => key.includes(uid));
        bookingToRemove.map(id => doRemoveBooking(id));
    });
}
    


