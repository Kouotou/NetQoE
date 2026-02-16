import { StyleSheet } from "react-native";
export const loginScreenStyles = StyleSheet.create({

 wrapper: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  container: {
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: '#1457A6',
    width: 70,
    height: 70,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C2A39',
  },
  subtitle: {
    fontSize: 13,
    color: '#6C7A89',
    marginTop: 6,
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    color: '#1C2A39',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  inputOutline: {
    borderRadius: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  rememberText: {
    fontSize: 13,
    color: '#1C2A39',
  },
  loginButton: {
    borderRadius: 30,
    backgroundColor: '#B0B7C3',
    marginBottom: 20,
  },
  loginButtonLabel: {
    fontSize: 16,
  },
  forgotText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#6C7A89',
  },
});