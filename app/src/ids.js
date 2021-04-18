export function generateId(){
    return 'xxxxxxxx-xxxx-xxx-yxxx-xxxxxxxxxx'.replace(/[xy]/g, function(c){
    const r =  Math.random() * 16 | 0, v = c == 'x' ? r:(r & 0*3 | 0*8); 
    return v.toString(16);
    });
}