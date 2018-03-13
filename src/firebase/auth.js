import * as firebase from 'firebase';
import { auth } from './firebase';

export const doCreateUserWithEmailAndPassword = (email, password) =>
	auth.createUserWithEmailAndPassword(email, password);

export const doUpdateUsername = (username) => 
    auth.currentUser.updateProfile({
        username
    })

export const doUpdateAvatar = (avatar) => 
    auth.currentUser.updateProfile({
        avatar
    })

export const doSignInWithEmailAndPassword = (email, password) =>
	auth.signInWithEmailAndPassword(email, password);

export const doSignInWithProvider = (provider) => 
	auth.signInWithPopup(provider)

export const providerGoogle = new firebase.auth.GoogleAuthProvider()

export const doSignOut = () =>
	auth.signOut();

export const doPasswordReset = (email) =>
	auth.sendPasswordResetEmail(email);

export const doPasswordUpdate = (password) =>
	auth.currentUser.updatePassword(password);