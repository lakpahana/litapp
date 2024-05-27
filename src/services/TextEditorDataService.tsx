
import { update, remove ,ref, set, push, get, child, DatabaseReference,onValue } from 'firebase/database';
import { db } from '../firebase';

class TextEditorDataService {
    getref()  {
        return ref(db, 'codes/');
    }
    getref2() {
        return ref(db, 'chats');
    }

    
    getAll() {
        return get(ref(db, 'codes/'));
    }

    getSingle(key:any) {
        return get(ref(db, `codes/${key}`))
    }


    create(data:any) {
        return push(ref(db, 'codes/'), data)
    }

    update(key:any, value:any) {
        return update(ref(db, `codes/${key}`), value);
    }

    delete(key:any) {
        return remove(ref(db, `codes/${key}`));
    }

    // deleteAll() {
    //     return db.remove();
    // }

    getChat() {
        return get(ref(db, 'chats'));
    }

    addChat(data:any) {
        return push(ref(db, 'chats'), data)
    }

    getUserByUid(uid:any) {
        return get(child(ref(db, 'users'), uid));
    }
}

export default new TextEditorDataService();
