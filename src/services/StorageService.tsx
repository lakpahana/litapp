import { getDownloadURL, ref,uploadBytesResumable,deleteObject } from "firebase/storage";
import { fstorage } from "../firebase";
class SotrageManagerService {
   getRef(){
         return ref(fstorage);
   }
   downloadFile(path:any){
         return getDownloadURL(ref(fstorage, path));
   }
   uploadFile(path:any,filename:any){
      const storageRef = ref(fstorage, filename);
      return uploadBytesResumable(storageRef, path);

   }
   deleteFile(path:any){
      return deleteObject(ref(fstorage,path));
   }
}

export default new SotrageManagerService();