import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  body : {
    flex : 1
  },
  codeContainer : {
    flex : 0.5
  },
  commentContainer : {
    flex : 0.6,
    marginBottom : 20
  },
  fileName : {
    fontSize : 17
  },
  codeField : {
    margin : 5
  },
  divider : {
    backgroundColor : 'black',
    height : 2
  },
  sectionDivider : {
    backgroundColor : 'black',
    height : 2
  },
  commentsTitle : {
    fontSize : 20,
    textAlign : 'center'
  },
  row : {
    margin : 5,
    padding : 5,
    borderRadius: 4,
    borderWidth: 1,
    backgroundColor : '#E9EAF9',
    borderColor: '#DFF0FF'
  },
  rowMessage : {
    fontSize : 15
  },
  rowUserName : {
    fontSize : 10,
    textAlign : 'right'
  },
});
