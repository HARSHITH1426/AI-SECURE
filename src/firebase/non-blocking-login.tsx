
'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousHandshake(authInstance: Auth): void {
  signInAnonymously(authInstance);
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateIdentityCreation(authInstance: Auth, id: string, token: string): void {
  createUserWithEmailAndPassword(authInstance, id, token);
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateIdentityValidation(authInstance: Auth, id: string, token: string): void {
  signInWithEmailAndPassword(authInstance, id, token);
}

/** Initiate Google sign-in (non-blocking). */
export function authorizeFederatedNode(authInstance: Auth): void {
  const provider = new GoogleAuthProvider();
  // Using popup for immediate verification cycle
  signInWithPopup(authInstance, provider);
}
