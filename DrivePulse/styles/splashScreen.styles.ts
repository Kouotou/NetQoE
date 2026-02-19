import { StyleSheet } from "react-native";
export const splashScreenStyles = StyleSheet.create({
    wrapper: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#1457A6',
    margin: 10,
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 250,
    paddingBottom:30,
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: '#E5E5E5',
    width: 90,
    height: 90,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    marginTop: 8,
    opacity: 0.9,
  },
  button: {
    width: '100%',
    borderRadius: 40,
    marginBottom: 20,
    backgroundColor: '#E5E5E5',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    color: '#1457A6',
    fontWeight: '600',
    fontSize: 16,
  },
  loginText: {
    color: 'white',
    fontSize: 13,
  },
});