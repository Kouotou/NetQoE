import { StyleSheet } from "react-native";
export const signupScreenStyles = StyleSheet.create({

  wrapper: {
    flex: 1,
    backgroundColor: '#b3cde6',
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
    backgroundColor: '#a1a5ab',
  },
  inputOutline: {
    borderRadius: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxText: {
    fontSize: 12,
    flex: 1,
  },
  createButton: {
    borderRadius: 30,
    backgroundColor: '#B0B7C3',
  },
  createButtonLabel: {
    fontSize: 16,
  },
});
