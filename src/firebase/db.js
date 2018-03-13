import { db } from './firebase';

export const doCreateUser = (id, username, email, avatar) =>
    db.ref(`users/${id}`).set({
        username,
        email,
        avatar,
    });

export const onceGetUsers = () =>
    db.ref('users').once('value');
    
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

export const doCreateEvent = (name, type, start, end, price, modules, description) => db.ref('courses').push({
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

export const doCheckIfBookingExists = (uid, courseId) => 
    db.ref(`booking/${courseId}/${uid}/confirmed`).once('value').then(snapshot => snapshot.val());

export const doBookCourse = (courseId, uid) => 
    db.ref(`booking/${courseId}/${uid}`).set({
        confirmed: true,
        paid: false
    })

