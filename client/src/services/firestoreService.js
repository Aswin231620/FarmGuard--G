
import { db, auth } from '../firebase';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    doc,
    setDoc,
    getDoc,
    orderBy,
    limit,
    serverTimestamp
} from 'firebase/firestore';

export const getAlerts = async () => {
    const alertsCol = collection(db, 'alerts');
    const q = query(alertsCol, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAssessmentHistory = async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const assessmentsCol = collection(db, 'assessments');
    const q = query(
        assessmentsCol,
        where('user_id', '==', user.uid),
        orderBy('date', 'desc'),
        limit(5)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const submitAssessment = async (responses, score, risk_level) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const assessmentsCol = collection(db, 'assessments');
    await addDoc(assessmentsCol, {
        user_id: user.uid,
        responses,
        score,
        risk_level,
        date: new Date().toISOString(),
        created_at: serverTimestamp()
    });
};

export const getCompliance = async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const complianceCol = collection(db, 'compliance');
    const q = query(complianceCol, where('user_id', '==', user.uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateCompliance = async (item_id, status) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const docId = `${user.uid}_${item_id}`;
    await setDoc(doc(db, 'compliance', docId), {
        user_id: user.uid,
        item_id,
        status,
        last_updated: new Date().toISOString()
    }, { merge: true });
};

export const getProfile = async () => {
    const user = auth.currentUser;
    if (!user) return null;

    const docRef = doc(db, 'profiles', user.uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
};

export const updateProfile = async (profileData) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    await setDoc(doc(db, 'profiles', user.uid), {
        ...profileData,
        user_id: user.uid
    }, { merge: true });
};
