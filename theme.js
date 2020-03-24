import { AmplifyTheme } from "aws-amplify-react-native";
const MySectionHeader = Object.assign({}, AmplifyTheme.button, {
  backgroundColor: "#0d8d64"
});
const MyTheme = Object.assign({}, AmplifyTheme, {
  button: MySectionHeader
});
export default MyTheme;
