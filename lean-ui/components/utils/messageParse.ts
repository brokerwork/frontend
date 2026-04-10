export interface DataType {
  [propName: string]: any;
}
export default (message: string, data: DataType): string => {
  let _message: string = message;
  Object.keys(data).map(key => {
    _message = message.replace(
      new RegExp(`{ *(${key}) *}`, "g"),
      (_msg: string, $1: string): string => {
        return data[$1] || _msg;
      }
    );
  });
  return _message;
};
